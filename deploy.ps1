param([string]$Message = "")

Set-Location $PSScriptRoot

$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes." -ForegroundColor Yellow
    exit 0
}

if ($Message -eq "") {
    $Message = "update: " + (Get-Date -Format "yyyy-MM-dd HH:mm")
}

git add -A
git commit -m $Message
git push origin main

Write-Host "Done!" -ForegroundColor Green
