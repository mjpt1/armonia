# آرمونیا — راه‌اندازی سرور توسعه
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$nmCache = "$env:LOCALAPPDATA\armonia-platform-nm\node_modules"
if (-not (Test-Path "$nmCache\next\dist\server\require-hook.js")) {
  Write-Host "نصب وابستگی‌ها (اولین بار ممکن است چند دقیقه طول بکشد)..."
  if (-not (Test-Path $nmCache)) {
    New-Item -ItemType Directory -Force -Path (Split-Path $nmCache) | Out-Null
    Copy-Item "$PSScriptRoot\package.json" (Split-Path $nmCache) -Force
    Push-Location (Split-Path $nmCache)
    npm install --no-fund --no-audit
    Pop-Location
  }
}

if (-not (Test-Path "node_modules")) {
  cmd /c "mklink /J node_modules `"$nmCache`""
}

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}

if (-not (Test-Path "prisma\dev.db")) {
  Write-Host "ساخت دیتابیس..."
  node .\node_modules\prisma\build\index.js db push
  node --experimental-strip-types prisma/seed.ts
}

Write-Host ""
Write-Host "  وب:  http://localhost:3000"
Write-Host "  ERP: http://localhost:3000/erp/login"
Write-Host "  رمز: demo1234  (ceo@armonia.local)"
Write-Host ""

npm run dev
