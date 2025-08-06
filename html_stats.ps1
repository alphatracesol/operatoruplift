# Simple HTML Analysis Script
$htmlFiles = Get-ChildItem -Recurse -Filter "*.html" | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }

Write-Host "=== HTML FILES ANALYSIS - LAST 7 DAYS ===" -ForegroundColor Green
Write-Host "Total HTML files found: $($htmlFiles.Count)" -ForegroundColor White

$totalLines = 0
$totalSize = 0
$fileStats = @()

foreach ($file in $htmlFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $lines = ($content -split "`n").Count
            $totalLines += $lines
            $totalSize += $file.Length
            
            $fileStats += [PSCustomObject]@{
                Name = $file.Name
                Path = $file.FullName
                SizeKB = [math]::Round($file.Length / 1KB, 2)
                Lines = $lines
                LastModified = $file.LastWriteTime
            }
        }
    }
    catch {
        Write-Host "Error processing $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`n=== SUMMARY STATISTICS ===" -ForegroundColor Cyan
Write-Host "Total Files: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "Total Lines: $totalLines" -ForegroundColor White
Write-Host "Total Size: $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor White
Write-Host "Average Lines per File: $([math]::Round($totalLines / $htmlFiles.Count, 2))" -ForegroundColor White

Write-Host "`n=== TOP 10 LARGEST FILES ===" -ForegroundColor Cyan
$fileStats | Sort-Object SizeKB -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.SizeKB) KB ($($_.Lines) lines)" -ForegroundColor White
}

Write-Host "`n=== TOP 10 MOST COMPLEX FILES ===" -ForegroundColor Cyan
$fileStats | Sort-Object Lines -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.Lines) lines ($($_.SizeKB) KB)" -ForegroundColor White
}

# Export results
$fileStats | Export-Csv -Path "html_analysis_results.csv" -NoTypeInformation
Write-Host "`nResults exported to html_analysis_results.csv" -ForegroundColor Green 