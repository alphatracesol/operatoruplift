# HTML Files Analysis Script for Command Center
# Analyzes HTML files modified in the last 7 days

Write-Host "=== HTML FILES ANALYSIS - LAST 7 DAYS ===" -ForegroundColor Green
Write-Host "Scanning Command Center directory..." -ForegroundColor Yellow

# Get HTML files from last 7 days
$htmlFiles = Get-ChildItem -Recurse -Filter "*.html" | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }

Write-Host "`n=== BASIC STATISTICS ===" -ForegroundColor Cyan
Write-Host "Total HTML files found: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "Date range: $(Get-Date).AddDays(-7) to $(Get-Date)" -ForegroundColor White

# Initialize counters
$totalLines = 0
$totalHtmlLines = 0
$totalCssLines = 0
$totalJsLines = 0
$totalSize = 0
$fileDetails = @()

Write-Host "`n=== ANALYZING FILES ===" -ForegroundColor Cyan
$counter = 0

foreach ($file in $htmlFiles) {
    $counter++
    Write-Progress -Activity "Analyzing HTML files" -Status "Processing $($file.Name)" -PercentComplete (($counter / $htmlFiles.Count) * 100)
    
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $lines = ($content -split "`n").Count
            $totalLines += $lines
            
            # Count HTML, CSS, and JS lines
            $htmlLines = ([regex]::Matches($content, '<[^>]+>')).Count
            $cssLines = ([regex]::Matches($content, '<style[^>]*>.*?</style>', [System.Text.RegularExpressions.RegexOptions]::Singleline)).Count
            $cssLines += ([regex]::Matches($content, 'style\s*=\s*["''][^"''>]*["'']')).Count
            $jsLines = ([regex]::Matches($content, '<script[^>]*>.*?</script>', [System.Text.RegularExpressions.RegexOptions]::Singleline)).Count
            $jsLines += ([regex]::Matches($content, 'on\w+\s*=\s*["''][^"''>]*["'']')).Count
            
            $totalHtmlLines += $htmlLines
            $totalCssLines += $cssLines
            $totalJsLines += $jsLines
            $totalSize += $file.Length
            
            $fileDetails += [PSCustomObject]@{
                Name = $file.Name
                FullPath = $file.FullName
                LastModified = $file.LastWriteTime
                SizeKB = [math]::Round($file.Length / 1KB, 2)
                TotalLines = $lines
                HTMLLines = $htmlLines
                CSSLines = $cssLines
                JSLines = $jsLines
                Directory = Split-Path $file.FullName -Parent
            }
        }
    }
    catch {
        Write-Host "Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Progress -Activity "Analyzing HTML files" -Completed

Write-Host "`n=== COMPREHENSIVE STATISTICS ===" -ForegroundColor Green

# Overall statistics
Write-Host "Total Files: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "Total Lines of Code: $totalLines" -ForegroundColor White
Write-Host "Total HTML Elements: $totalHtmlLines" -ForegroundColor White
Write-Host "Total CSS References: $totalCssLines" -ForegroundColor White
Write-Host "Total JavaScript References: $totalJsLines" -ForegroundColor White
Write-Host "Total Size: $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor White

# Average statistics
Write-Host "`n=== AVERAGE PER FILE ===" -ForegroundColor Cyan
Write-Host "Average Lines per File: $([math]::Round($totalLines / $htmlFiles.Count, 2))" -ForegroundColor White
Write-Host "Average HTML Elements per File: $([math]::Round($totalHtmlLines / $htmlFiles.Count, 2))" -ForegroundColor White
Write-Host "Average CSS References per File: $([math]::Round($totalCssLines / $htmlFiles.Count, 2))" -ForegroundColor White
Write-Host "Average JS References per File: $([math]::Round($totalJsLines / $htmlFiles.Count, 2))" -ForegroundColor White
Write-Host "Average File Size: $([math]::Round($totalSize / $htmlFiles.Count / 1KB, 2)) KB" -ForegroundColor White

# Directory breakdown
Write-Host "`n=== DIRECTORY BREAKDOWN ===" -ForegroundColor Cyan
$dirStats = $fileDetails | Group-Object Directory | Sort-Object Count -Descending | Select-Object -First 10
foreach ($dir in $dirStats) {
    $dirFiles = $fileDetails | Where-Object { $_.Directory -eq $dir.Name }
    $dirLines = ($dirFiles | Measure-Object TotalLines -Sum).Sum
    $dirSize = ($dirFiles | Measure-Object SizeKB -Sum).Sum
    Write-Host "$($dir.Name)" -ForegroundColor Yellow
    Write-Host "  Files: $($dir.Count), Lines: $dirLines, Size: $([math]::Round($dirSize, 2)) KB" -ForegroundColor White
}

# Largest files
Write-Host "`n=== TOP 10 LARGEST FILES ===" -ForegroundColor Cyan
$fileDetails | Sort-Object SizeKB -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.SizeKB) KB ($($_.TotalLines) lines)" -ForegroundColor White
}

# Most complex files (by lines)
Write-Host "`n=== TOP 10 MOST COMPLEX FILES (by lines) ===" -ForegroundColor Cyan
$fileDetails | Sort-Object TotalLines -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.TotalLines) lines ($($_.SizeKB) KB)" -ForegroundColor White
}

# Files with most JavaScript
Write-Host "`n=== TOP 10 FILES WITH MOST JAVASCRIPT ===" -ForegroundColor Cyan
$fileDetails | Sort-Object JSLines -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.JSLines) JS references ($($_.TotalLines) total lines)" -ForegroundColor White
}

# Files with most CSS
Write-Host "`n=== TOP 10 FILES WITH MOST CSS ===" -ForegroundColor Cyan
$fileDetails | Sort-Object CSSLines -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.CSSLines) CSS references ($($_.TotalLines) total lines)" -ForegroundColor White
}

# Recent activity
Write-Host "`n=== RECENT ACTIVITY (Last 24 hours) ===" -ForegroundColor Cyan
$recentFiles = $fileDetails | Where-Object { $_.LastModified -gt (Get-Date).AddDays(-1) } | Sort-Object LastModified -Descending
Write-Host "Files modified in last 24 hours: $($recentFiles.Count)" -ForegroundColor White
$recentFiles | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.LastModified.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
}

# Export detailed results
$exportPath = "C:\Command_Center\html_analysis_results.csv"
$fileDetails | Export-Csv -Path $exportPath -NoTypeInformation
Write-Host "`n=== EXPORT ===" -ForegroundColor Green
Write-Host "Detailed results exported to: $exportPath" -ForegroundColor White

Write-Host "`n=== ANALYSIS COMPLETE ===" -ForegroundColor Green 