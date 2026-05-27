# Fix Next.js static export paths for subdirectory deployment
$htmlPath = "out/index.html"
$content = Get-Content $htmlPath -Raw

# Replace absolute /_next paths with relative ./_next paths
$content = $content -replace 'href="/_next/', 'href="./_next/'
$content = $content -replace 'src="/_next/', 'src="./_next/'

Set-Content -Path $htmlPath -Value $content -NoNewline
Write-Host "Path fix applied successfully."
