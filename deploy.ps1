# deploy.ps1 — ローカル変更を japan-sme-makers に push してGitHub Pagesへ反映
param(
    [string]$Message = ""
)

Set-Location $PSScriptRoot

$status = git status --porcelain
if (-not $status) {
    Write-Host "変更なし。pushするものがありません。" -ForegroundColor Yellow
    exit 0
}

if (-not $Message) {
    $date = Get-Date -Format "yyyy-MM-dd HH:mm"
    $Message = "update: $date"
}

git add -A
git commit -m $Message
git push origin main

Write-Host ""
Write-Host "デプロイ完了！数分後に反映されます:" -ForegroundColor Green
Write-Host "https://ishikawa-droid.github.io/japan-sme-makers/" -ForegroundColor Cyan
