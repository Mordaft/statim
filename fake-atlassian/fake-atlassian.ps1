#Requires -Version 5.1
<#
.SYNOPSIS
  Mock en memoria de las content properties de Confluence (REST API v1).
.DESCRIPTION
  Endpoints simulados:
    POST   /rest/api/content/{pageId}/property
    GET    /rest/api/content/{pageId}/property?expand=version&limit=N&start=C
    GET    /rest/api/content/{pageId}/property/{key}
    DELETE /rest/api/content/{pageId}/property/{key}
  Administración:
    GET    /__admin/properties   lista todo lo almacenado
    DELETE /__admin/properties   vacía la memoria
  Acepta Bearer token o Basic auth; el token/email se usa como autor.
.EXAMPLE
  pwsh fake-atlassian.ps1
  pwsh fake-atlassian.ps1 -Port 8790 -AllowedOrigin http://localhost:5173
#>
[CmdletBinding()]
param(
  [int]$Port = 8790,

  # Orígenes del navegador autorizados (CORS).
  [string[]]$AllowedOrigin = @('http://localhost:5173', 'http://localhost:4173'),

  [int]$MaxProperties = 5000
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$properties = [System.Collections.Generic.List[pscustomobject]]::new()
$nextId = 100000

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")

function Set-Cors([System.Net.HttpListenerRequest]$req, [System.Net.HttpListenerResponse]$res) {
  $origin = $req.Headers['Origin']
  if (-not $origin -or $AllowedOrigin -notcontains $origin) { return }
  $res.AddHeader('Access-Control-Allow-Origin', $origin)
  $res.AddHeader('Vary', 'Origin')
  $res.AddHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  $res.AddHeader('Access-Control-Allow-Headers', 'Authorization, Accept, Content-Type, X-Atlassian-Token')
  $res.AddHeader('Access-Control-Expose-Headers', 'Retry-After')
  $res.AddHeader('Access-Control-Max-Age', '600')
}

function Send-Json([System.Net.HttpListenerResponse]$res, [int]$status, $body) {
  $res.StatusCode = $status
  if ($null -eq $body) { return }
  $res.ContentType = 'application/json; charset=utf-8'
  $bytes = [Text.Encoding]::UTF8.GetBytes(($body | ConvertTo-Json -Depth 10 -Compress))
  $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
}

function Send-Error([System.Net.HttpListenerResponse]$res, [int]$status, [string]$message) {
  Send-Json $res $status @{ errors = @(@{ status = $status; title = $message }) }
}

function Get-Author([System.Net.HttpListenerRequest]$req) {
  $auth = $req.Headers['Authorization']
  if (-not $auth) { return $null }

  if ($auth -match '^Bearer\s+(.+)$') {
    $token = $Matches[1].Trim()
    if (-not $token) { return $null }
    try {
      $decoded = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($token))
      $sep = $decoded.IndexOf(':')
      if ($sep -gt 0) { return $decoded.Substring(0, $sep).ToLowerInvariant() }
    } catch { }
    return $token.ToLowerInvariant()
  }

  if ($auth -match '^Basic\s+(.+)$') {
    try {
      $decoded = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Matches[1].Trim()))
      $sep = $decoded.IndexOf(':')
      if ($sep -gt 0) { return $decoded.Substring(0, $sep).ToLowerInvariant() }
    } catch { }
  }

  return $null
}

function ConvertTo-PropertyDto($property) {
  [ordered]@{
    id        = "$($property.id)"
    key       = $property.key
    pageId    = $property.pageId
    version   = @{
      number    = 1
      when      = $property.createdAt
      createdAt = $property.createdAt
      authorId  = $property.author
    }
    value     = $property.value
  }
}

function Read-Body([System.Net.HttpListenerRequest]$req) {
  $reader = [IO.StreamReader]::new($req.InputStream, [Text.Encoding]::UTF8)
  try { return $reader.ReadToEnd() } finally { $reader.Dispose() }
}

function Invoke-Route([System.Net.HttpListenerRequest]$req, [System.Net.HttpListenerResponse]$res, [string]$author) {
  $path = $req.Url.AbsolutePath.TrimEnd('/')
  $method = $req.HttpMethod

  if ($path -eq '/__admin/properties') {
    if ($method -eq 'GET') { Send-Json $res 200 @{ count = $properties.Count; results = @($properties | ForEach-Object { ConvertTo-PropertyDto $_ }) }; return }
    if ($method -eq 'DELETE') { $properties.Clear(); Send-Json $res 204 $null; return }
  }

  if (-not $author) { Send-Error $res 401 'Bearer authentication required'; return }

  if ($path -match '^/(?:wiki/)?rest/api/content/([^/]+)/property(?:/([^/]+))?$') {
    $pageId = [Uri]::UnescapeDataString($Matches[1])
    $key = if ($Matches[2]) { [Uri]::UnescapeDataString($Matches[2]) } else { '' }
    if ($method -eq 'POST' -and -not $key) {
      try { $payload = Read-Body $req | ConvertFrom-Json } catch { Send-Error $res 400 'Invalid JSON'; return }
      if (-not ($payload.key -is [string]) -or -not $payload.key -or $null -eq $payload.value) {
        Send-Error $res 400 'key and value are required'; return
      }
      $valueJson = ConvertTo-Json -InputObject $payload.value -Depth 10 -Compress
      if ([Text.Encoding]::UTF8.GetByteCount($valueJson) -gt 32768) { Send-Error $res 400 'Property value exceeds 32 KB'; return }
      $existing = $properties | Where-Object { $_.pageId -eq $pageId -and $_.key -ceq $payload.key } | Select-Object -First 1
      if ($existing) { Send-Error $res 409 'Property key already exists'; return }
      if ($properties.Count -ge $MaxProperties) { Send-Error $res 429 'Property storage full'; return }
      $script:nextId++
      $property = [pscustomobject]@{
        id = $script:nextId
        pageId = $pageId
        key = $payload.key
        author = $author
        value = $payload.value
        createdAt = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
      }
      $properties.Add($property)
      Send-Json $res 200 (ConvertTo-PropertyDto $property)
      return
    }
    if ($key -and $method -in @('GET', 'DELETE')) {
      $property = $properties | Where-Object { $_.pageId -eq $pageId -and $_.key -ceq $key } | Select-Object -First 1
      if (-not $property) { Send-Error $res 404 'Property not found'; return }
      if ($method -eq 'GET') { Send-Json $res 200 (ConvertTo-PropertyDto $property); return }
      [void]$properties.Remove($property)
      Send-Json $res 204 $null
      return
    }
    if ($method -eq 'GET' -and -not $key) {
      $rawLimit = if ($req.QueryString['limit']) { [int]$req.QueryString['limit'] } else { 25 }
      $limit = [Math]::Min([Math]::Max($rawLimit, 1), 250)
      $offset = if ($req.QueryString['start']) { [Math]::Max(0, [int]$req.QueryString['start']) } else { 0 }
      $all = @($properties | Where-Object pageId -eq $pageId | Sort-Object key)
      $page = @($all | Select-Object -Skip $offset -First $limit)
      $links = @{}
      if ($offset + $limit -lt $all.Count) {
        $links.next = "${path}?expand=version&limit=$limit&start=$($offset + $limit)"
      }
      Send-Json $res 200 @{
        results = @($page | ForEach-Object { ConvertTo-PropertyDto $_ })
        start = $offset
        limit = $limit
        size = $page.Count
        _links = $links
      }
      return
    }
  }

  Send-Error $res 404 "No route for $method $path"
}

$listener.Start()
Write-Host "fake-atlassian escuchando en http://localhost:$Port" -ForegroundColor Green
Write-Host "Orígenes permitidos: $($AllowedOrigin -join ', ')  (Ctrl+C para salir)"

try {
  while ($listener.IsListening) {
    $pending = $listener.GetContextAsync()
    # Short waits keep Ctrl+C responsive.
    while (-not $pending.AsyncWaitHandle.WaitOne(500)) { }
    $ctx = $pending.GetAwaiter().GetResult()
    $req = $ctx.Request
    $res = $ctx.Response
    $author = Get-Author $req

    try {
      Set-Cors $req $res
      if ($req.HttpMethod -eq 'OPTIONS') { $res.StatusCode = 204 }
      else { Invoke-Route $req $res $author }
    }
    catch {
      Write-Warning "  Error: $($_.Exception.Message)"
      try { Send-Error $res 500 'fake-atlassian internal error' } catch { }
    }
    finally {
      $color = if ($res.StatusCode -lt 400) { 'DarkGray' } else { 'Red' }
      $authorDisplay = if ($author) { $author } else { '-' }
      Write-Host ("[{0}] {1,-7} {2} -> {3}  ({4})  properties={5}" -f (Get-Date -Format 'HH:mm:ss'), $req.HttpMethod, $req.Url.PathAndQuery, $res.StatusCode, $authorDisplay, $properties.Count) -ForegroundColor $color
      $res.Close()
    }
  }
}
finally {
  $listener.Stop()
  $listener.Close()
  Write-Host 'fake-atlassian detenido.'
}
