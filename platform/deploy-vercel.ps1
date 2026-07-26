# Armonia → Vercel (یک‌مرحله‌ای)
# پیش‌نیاز: یک‌بار `vercel login` در همین ترمینال

$ErrorActionPreference = "Stop"
$vc = "$env:LOCALAPPDATA\armonia-vercel-v2\node_modules\vercel\dist\index.js"
if (-not (Test-Path $vc)) {
  Write-Host "Installing Vercel CLI..."
  $dest = "$env:LOCALAPPDATA\armonia-vercel-v2"
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Set-Location $dest
  '{"name":"vcli","private":true,"dependencies":{"vercel":"39.1.1"}}' | Set-Content package.json -Encoding ascii
  npm install --no-fund --no-audit
}

Set-Location "C:\Users\mjpt1\Desktop\job\new\erp\platform"

Write-Host "`n=== 1) Login (اگر لازم است) ==="
node $vc whoami 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "مرورگر برای لاگین GitHub باز می‌شود..."
  node $vc login --github
}

Write-Host "`n=== 2) Link / Create project ==="
node $vc link --yes --project armonia

Write-Host "`n=== 3) Env vars ==="
# AUTH_SECRET
$secret = -join ((48..57 + 65..90 + 97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
node $vc env add AUTH_SECRET production --force 2>$null
# User may need Postgres URL — if Neon/Vercel Postgres exists as integration it can be linked in dashboard

Write-Host "`n=== 4) Deploy ==="
node $vc deploy --prod --yes

Write-Host "`nDone. Check URL above."
