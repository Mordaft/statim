#Requires -Version 5.1
<#
.SYNOPSIS
  Proxy local para llamar a la API REST de Confluence desde Statim sin problemas de CORS.
.EXAMPLE
  pwsh localproxy.ps1 https://tu-sitio.atlassian.net
  pwsh localproxy.ps1 https://tu-sitio.atlassian.net -Port 9000 -AllowedOrigin http://localhost:5173
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory, Position = 0)]
  [uri]$TargetUrl,

  [int]$Port = 8787,

  # Orígenes del navegador autorizados (CORS).
  [string[]]$AllowedOrigin = @('http://localhost:5173','http://localhost:5174', 'http://localhost:4173'),

  # Caracteres del cuerpo mostrados en consola (0 = no mostrar).
  [int]$PreviewLength = 500
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$isLocalTarget = $TargetUrl.Host -in @('localhost', '127.0.0.1')
if ($TargetUrl.Scheme -ne 'https' -and -not $isLocalTarget) { throw 'La URL de Confluence debe ser https (http solo para localhost).' }
$target = $TargetUrl.GetLeftPart([UriPartial]::Authority)

$forwardHeaders = @('Authorization', 'Accept')
$returnHeaders = @('Retry-After', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset')

Add-Type -AssemblyName System.Net.Http

$client = [System.Net.Http.HttpClient]::new()
$client.Timeout = [TimeSpan]::FromSeconds(30)

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")

function Write-Preview([string]$label, [string]$text) {
  if ($PreviewLength -le 0 -or -not $text) { return }
  $preview = if ($text.Length -gt $PreviewLength) { $text.Substring(0, $PreviewLength) + '…' } else { $text }
  Write-Host "  ${label}: $preview" -ForegroundColor DarkGray
}

function Write-RequestLog([System.Net.HttpListenerRequest]$req) {
  Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $($req.HttpMethod) $($req.Url.AbsolutePath)" -ForegroundColor Cyan
  foreach ($key in $req.QueryString.AllKeys) {
    Write-Host "  ?$key=$($req.QueryString[$key])" -ForegroundColor Yellow
  }
  foreach ($key in $req.Headers.AllKeys) {
    # Never print credentials.
    $value = if ($key -eq 'Authorization') { (($req.Headers[$key] -split ' ')[0]) + ' ***' } else { $req.Headers[$key] }
    Write-Host "  ${key}: $value" -ForegroundColor DarkGray
  }
}

function Set-Cors([System.Net.HttpListenerRequest]$req, [System.Net.HttpListenerResponse]$res) {
  $origin = $req.Headers['Origin']
  if (-not $origin -or $AllowedOrigin -notcontains $origin) { return }
  $res.AddHeader('Access-Control-Allow-Origin', $origin)
  $res.AddHeader('Vary', 'Origin')
  $res.AddHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  $res.AddHeader('Access-Control-Allow-Headers', 'Authorization, Accept, Content-Type')
  $res.AddHeader('Access-Control-Expose-Headers', ($returnHeaders -join ', '))
  $res.AddHeader('Access-Control-Max-Age', '600')
}

function Send-Text([System.Net.HttpListenerResponse]$res, [int]$status, [string]$text) {
  $res.StatusCode = $status
  $res.ContentType = 'text/plain; charset=utf-8'
  $bytes = [Text.Encoding]::UTF8.GetBytes($text)
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
}

function Invoke-Forward([System.Net.HttpListenerRequest]$req, [System.Net.HttpListenerResponse]$res) {
  $msg = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::new($req.HttpMethod), $target + $req.Url.PathAndQuery)
  foreach ($name in $forwardHeaders) {
    if ($req.Headers[$name]) { [void]$msg.Headers.TryAddWithoutValidation($name, $req.Headers[$name]) }
  }
  [void]$msg.Headers.TryAddWithoutValidation('X-Atlassian-Token', 'no-check')

  if ($req.HasEntityBody) {
    $reader = [IO.StreamReader]::new($req.InputStream, $req.ContentEncoding)
    $body = $reader.ReadToEnd()
    $reader.Dispose()
    $mediaType = if ($req.ContentType) { ($req.ContentType -split ';')[0].Trim() } else { 'application/json' }
    $msg.Content = [System.Net.Http.StringContent]::new($body, [Text.Encoding]::UTF8, $mediaType)
    Write-Preview 'body' $body
  }

  $watch = [Diagnostics.Stopwatch]::StartNew()
  # SendAsync: the synchronous Send() does not exist on pwsh 7.0 (.NET Core 3.1).
  $resp = $client.SendAsync($msg).GetAwaiter().GetResult()
  $bytes = $resp.Content.ReadAsByteArrayAsync().GetAwaiter().GetResult()
  $watch.Stop()

  $res.StatusCode = [int]$resp.StatusCode
  if ($resp.Content.Headers.ContentType) { $res.ContentType = $resp.Content.Headers.ContentType.ToString() }
  foreach ($name in $returnHeaders) {
    $values = $null
    if ($resp.Headers.TryGetValues($name, [ref]$values)) { $res.AddHeader($name, ($values -join ', ')) }
  }
  if ($bytes.Length -gt 0 -and $res.StatusCode -ne 204) {
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  }

  $color = if ($resp.IsSuccessStatusCode) { 'Green' } else { 'Red' }
  Write-Host "  -> $([int]$resp.StatusCode) $($resp.ReasonPhrase) ($($bytes.Length) bytes, $($watch.ElapsedMilliseconds) ms)" -ForegroundColor $color
  Write-Preview 'respuesta' ([Text.Encoding]::UTF8.GetString($bytes))
  $resp.Dispose()
}

$listener.Start()
Write-Host "localproxy escuchando en http://localhost:$Port -> $target" -ForegroundColor Green
Write-Host "Orígenes permitidos: $($AllowedOrigin -join ', ')  (Ctrl+C para salir)"

try {
  while ($listener.IsListening) {
    $pending = $listener.GetContextAsync()
    # Short waits keep Ctrl+C responsive.
    while (-not $pending.AsyncWaitHandle.WaitOne(500)) { }
    $ctx = $pending.GetAwaiter().GetResult()
    $req = $ctx.Request
    $res = $ctx.Response

    try {
      Write-RequestLog $req
      Set-Cors $req $res

      if ($req.HttpMethod -eq 'OPTIONS') {
        $res.StatusCode = 204
        Write-Host '  -> 204 preflight' -ForegroundColor Green
      }
      elseif (-not $req.Url.AbsolutePath.StartsWith('/wiki/')) {
        Send-Text $res 404 'Solo se reenvían rutas /wiki/'
        Write-Host '  -> 404 ruta no permitida' -ForegroundColor Red
      }
      else {
        Invoke-Forward $req $res
      }
    }
    catch {
      Write-Warning "  Error reenviando: $($_.Exception.Message)"
      try { Send-Text $res 502 'Error en localproxy al contactar con Confluence' } catch { }
    }
    finally {
      $res.Close()
    }
  }
}
finally {
  $listener.Stop()
  $listener.Close()
  $client.Dispose()
  Write-Host 'localproxy detenido.'
}
