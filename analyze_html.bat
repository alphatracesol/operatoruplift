@echo off
echo === HTML FILES ANALYSIS - LAST 7 DAYS ===
echo.

powershell -Command "& {$htmlFiles = Get-ChildItem -Recurse -Filter '*.html' | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }; Write-Host 'Total HTML files found:' $htmlFiles.Count}"

powershell -Command "& {$htmlFiles = Get-ChildItem -Recurse -Filter '*.html' | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }; $totalSize = ($htmlFiles | Measure-Object Length -Sum).Sum; $totalSizeMB = [math]::Round($totalSize / 1MB, 2); Write-Host 'Total Size:' $totalSizeMB 'MB'}"

echo.
echo === TOP 10 LARGEST FILES ===
powershell -Command "& {$htmlFiles = Get-ChildItem -Recurse -Filter '*.html' | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }; $htmlFiles | Sort-Object Length -Descending | Select-Object -First 10 | ForEach-Object { Write-Host $_.Name '- ' ([math]::Round($_.Length / 1KB, 2)) 'KB'} }"

echo.
echo === RECENT FILES (Last 24 hours) ===
powershell -Command "& {$htmlFiles = Get-ChildItem -Recurse -Filter '*.html' | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-1) }; $htmlFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 10 | ForEach-Object { Write-Host $_.Name '- ' $_.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss')} }"

pause 