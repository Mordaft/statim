#Requires -Version 5.1
<#
.SYNOPSIS
  Mock en memoria de la API de comentarios de Confluence Cloud / Server (REST API v1) para probar varios clientes Statim en local.
.DESCRIPTION
  Endpoints simulados:
    POST   /rest/api/content
    GET    /rest/api/content/{pageId}/child/comment?expand=body.storage,version&limit=N&start=C
    DELETE /rest/api/content/{commentId}
  (Mantiene también compatibilidad con /wiki/api/v2/footer-comments).
  Administración:
    GET    /__admin/comments   lista todo lo almacenado
    DELETE /__admin/comments   vacía la memoria
  Acepta Bearer token o Basic auth; el token/email se usa como autor del comentario.
.EXAMPLE
  pwsh fake-atlassian.ps1
  pwsh fake-atlassian.ps1 -Port 8790 -AllowedOrigin http://localhost:5173
#>
[CmdletBinding()]
param(
  [int]$Port = 8790,

  # Orígenes del navegador autorizados (CORS).
  [string[]]$AllowedOrigin = @('http://localhost:5173', 'http://localhost:4173'),

  # Límite de comentarios en memoria; se descartan los más antiguos.
  [int]$MaxComments = 5000
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$comments = [System.Collections.Generic.List[pscustomobject]]::new()
$nextId = 100000

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")

function Set-Cors([System.Net.HttpListenerRequest]$req, [System.Net.HttpListenerResponse]$res) {
  $origin = $req.Headers['Origin']
  if (-not $origin -or $AllowedOrigin -notcontains $origin) { return }
  $res.AddHeader('Access-Control-Allow-Origin', $origin)
  $res.AddHeader('Vary', 'Origin')
  $res.AddHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  $res.AddHeader('Access-Control-Allow-Headers', 'Authorization, Accept, Content-Type')
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

function ConvertTo-CommentDto($c) {
  [ordered]@{
    id        = "$($c.id)"
    type      = 'comment'
    status    = 'current'
    pageId    = $c.pageId
    container = @{ id = $c.pageId; type = 'page' }
    version   = @{
      number    = 1
      when      = $c.createdAt
      createdAt = $c.createdAt
      authorId  = $c.author
      by        = @{ username = $c.author; displayName = $c.author; publicName = $c.author }
    }
    body      = @{ storage = @{ representation = 'storage'; value = $c.value } }
  }
}

function Read-Body([System.Net.HttpListenerRequest]$req) {
  $reader = [IO.StreamReader]::new($req.InputStream, [Text.Encoding]::UTF8)
  try { return $reader.ReadToEnd() } finally { $reader.Dispose() }
}

function Invoke-Route([System.Net.HttpListenerRequest]$req, [System.Net.HttpListenerResponse]$res, [string]$author) {
  $path = $req.Url.AbsolutePath.TrimEnd('/')
  $method = $req.HttpMethod

  if ($path -eq '/__admin/comments') {
    if ($method -eq 'GET') { Send-Json $res 200 @{ count = $comments.Count; results = @($comments | ForEach-Object { ConvertTo-CommentDto $_ }) }; return }
    if ($method -eq 'DELETE') { $comments.Clear(); Send-Json $res 204 $null; return }
  }

  if (-not $author) { Send-Error $res 401 'Bearer authentication required'; return }

  if (($path -eq '/rest/api/content' -or $path -eq '/wiki/api/v2/footer-comments') -and $method -eq 'POST') {
    $payload = Read-Body $req | ConvertFrom-Json
    $pageId = if ($payload.container -and $payload.container.id) { "$($payload.container.id)" } else { "$($payload.pageId)" }
    $value = if ($payload.body.storage -and $payload.body.storage.value) { $payload.body.storage.value } else { $payload.body.value }
    if (-not $pageId -or -not $value) { Send-Error $res 400 'container.id and body.storage.value are required'; return }

    $script:nextId++
    $comment = [pscustomobject]@{
      id        = $script:nextId
      pageId    = "$pageId"
      author    = $author
      value     = "$value"
      createdAt = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
    }
    $comments.Add($comment)
    if ($comments.Count -gt $MaxComments) { $comments.RemoveRange(0, $comments.Count - $MaxComments) }
    Send-Json $res 200 (ConvertTo-CommentDto $comment)
    return
  }

  if (($path -match '^/rest/api/content/(\d+)$' -or $path -match '^/wiki/api/v2/footer-comments/(\d+)$') -and $method -eq 'DELETE') {
    $id = [int]$Matches[1]
    $comment = $comments | Where-Object id -eq $id | Select-Object -First 1
    if (-not $comment) { Send-Error $res 404 'Comment not found'; return }
    if ($comment.author -ne $author) { Send-Error $res 403 'Only the author can delete this comment'; return }
    [void]$comments.Remove($comment)
    Send-Json $res 204 $null
    return
  }

  if (($path -match '^/rest/api/content/([^/]+)/child/comment$' -or $path -match '^/wiki/api/v2/pages/([^/]+)/footer-comments$') -and $method -eq 'GET') {
    $pageId = [Uri]::UnescapeDataString($Matches[1])
    $rawLimit = if ($req.QueryString['limit']) { [int]$req.QueryString['limit'] } else { 25 }
    $limit = [Math]::Min([Math]::Max($rawLimit, 1), 250)
    $rawCursor = if ($req.QueryString['start']) { [int]$req.QueryString['start'] } elseif ($req.QueryString['cursor']) { [int]$req.QueryString['cursor'] } else { 0 }
    $offset = [Math]::Max(0, $rawCursor)
    $sort = if ($req.QueryString['sort']) { $req.QueryString['sort'] } else { '-created-date' }

    $all = @($comments | Where-Object pageId -eq $pageId | Sort-Object id -Descending:($sort -ne 'created-date'))
    $page = @($all | Select-Object -Skip $offset -First $limit)
    $links = @{}
    if ($offset + $limit -lt $all.Count) {
      if ($path.StartsWith('/rest/api')) {
        $expand = if ($req.QueryString['expand']) { [Uri]::EscapeDataString($req.QueryString['expand']) } else { 'body.storage,version' }
        $qs = "expand=$expand&limit=$limit&start=$($offset + $limit)"
        $links.next = "/rest/api/content/$([Uri]::EscapeDataString($pageId))/child/comment?$qs"
      } else {
        $qs = "body-format=storage&sort=$([Uri]::EscapeDataString($sort))&limit=$limit&cursor=$($offset + $limit)"
        $links.next = "/wiki/api/v2/pages/$([Uri]::EscapeDataString($pageId))/footer-comments?$qs"
      }
    }
    Send-Json $res 200 @{
      results = @($page | ForEach-Object { ConvertTo-CommentDto $_ })
      start   = $offset
      limit   = $limit
      size    = $page.Count
      _links  = $links
    }
    return
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
      Write-Host ("[{0}] {1,-7} {2} -> {3}  ({4})  comentarios={5}" -f (Get-Date -Format 'HH:mm:ss'), $req.HttpMethod, $req.Url.PathAndQuery, $res.StatusCode, $authorDisplay, $comments.Count) -ForegroundColor $color
      $res.Close()
    }
  }
}
finally {
  $listener.Stop()
  $listener.Close()
  Write-Host 'fake-atlassian detenido.'
}
