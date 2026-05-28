# קריאת הודעת הקומיט מהמשתמש
$commitMessage = Read-Host "Enter commit message"

# אם המשתמש לא כתב כלום, נשים הודעת ברירת מחדל
if ([string]::IsNullOrEmpty($commitMessage)) {
    $commitMessage = "Auto-update via script"
}

Write-Host "`n[1/3] Adding files to Git..." -ForegroundColor Cyan
git add .

Write-Host "[2/3] Committing changes..." -ForegroundColor Cyan
git commit -m "$commitMessage"

Write-Host "[3/3] Pushing to GitHub (Render will deploy automatically)..." -ForegroundColor Cyan
git push origin main

Write-Host "`n[SUCCESS] Deployment triggered! Check Render Dashboard for live build status." -ForegroundColor Green