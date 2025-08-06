# Comprehensive HTML Files Analysis Script
# Analyzes HTML files modified in the last 7 days

Write-Host "=== HTML FILES ANALYSIS - LAST 7 DAYS ===" -ForegroundColor Green
Write-Host "Scanning Command Center directory..." -ForegroundColor Yellow

# Get HTML files from last 7 days
$htmlFiles = Get-ChildItem -Recurse -Filter "*.html" | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }

Write-Host "`n=== BASIC STATISTICS ===" -ForegroundColor Cyan
Write-Host "Total HTML files found: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "Date range: $(Get-Date).AddDays(-7) to $(Get-Date)" -ForegroundColor White

# Calculate total size
$totalSize = ($htmlFiles | Measure-Object Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "Total Size: $totalSizeMB MB" -ForegroundColor White

# Initialize counters for detailed analysis
$totalLines = 0
$totalHtmlElements = 0
$totalCssReferences = 0
$totalJsReferences = 0
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
            
            # Count HTML elements
            $htmlElements = ([regex]::Matches($content, '<[^>]+>')).Count
            
            # Count CSS references
            $cssRefs = ([regex]::Matches($content, '<style[^>]*>.*?</style>', [System.Text.RegularExpressions.RegexOptions]::Singleline)).Count
            $cssRefs += ([regex]::Matches($content, 'style\s*=\s*["''][^"''>]*["'']')).Count
            
            # Count JavaScript references
            $jsRefs = ([regex]::Matches($content, '<script[^>]*>.*?</script>', [System.Text.RegularExpressions.RegexOptions]::Singleline)).Count
            $jsRefs += ([regex]::Matches($content, 'on\w+\s*=\s*["''][^"''>]*["'']')).Count
            
            $totalHtmlElements += $htmlElements
            $totalCssReferences += $cssRefs
            $totalJsReferences += $jsRefs
            
            $fileDetails += [PSCustomObject]@{
                Name = $file.Name
                FullPath = $file.FullName
                LastModified = $file.LastWriteTime
                SizeKB = [math]::Round($file.Length / 1KB, 2)
                TotalLines = $lines
                HTMLElements = $htmlElements
                CSSReferences = $cssRefs
                JSReferences = $jsRefs
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
Write-Host "Total HTML Elements: $totalHtmlElements" -ForegroundColor White
Write-Host "Total CSS References: $totalCssReferences" -ForegroundColor White
Write-Host "Total JavaScript References: $totalJsReferences" -ForegroundColor White
Write-Host "Total Size: $totalSizeMB MB" -ForegroundColor White

# Average statistics
Write-Host "`n=== AVERAGE PER FILE ===" -ForegroundColor Cyan
Write-Host "Average Lines per File: $([math]::Round($totalLines / $htmlFiles.Count, 2))" -ForegroundColor White
Write-Host "Average HTML Elements per File: $([math]::Round($totalHtmlElements / $htmlFiles.Count, 2))" -ForegroundColor White
Write-Host "Average CSS References per File: $([math]::Round($totalCssReferences / $htmlFiles.Count, 2))" -ForegroundColor White
Write-Host "Average JS References per File: $([math]::Round($totalJsReferences / $htmlFiles.Count, 2))" -ForegroundColor White
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
$fileDetails | Sort-Object JSReferences -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.JSReferences) JS references ($($_.TotalLines) total lines)" -ForegroundColor White
}

# Files with most CSS
Write-Host "`n=== TOP 10 FILES WITH MOST CSS ===" -ForegroundColor Cyan
$fileDetails | Sort-Object CSSReferences -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.CSSReferences) CSS references ($($_.TotalLines) total lines)" -ForegroundColor White
}

# Recent activity
Write-Host "`n=== RECENT ACTIVITY (Last 24 hours) ===" -ForegroundColor Cyan
$recentFiles = $fileDetails | Where-Object { $_.LastModified -gt (Get-Date).AddDays(-1) } | Sort-Object LastModified -Descending
Write-Host "Files modified in last 24 hours: $($recentFiles.Count)" -ForegroundColor White
$recentFiles | Select-Object -First 10 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.LastModified.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
}

# Export detailed results
$exportPath = "html_analysis_results.csv"
$fileDetails | Export-Csv -Path $exportPath -NoTypeInformation
Write-Host "`n=== EXPORT ===" -ForegroundColor Green
Write-Host "Detailed results exported to: $exportPath" -ForegroundColor White

Write-Host "`n=== ANALYSIS COMPLETE ===" -ForegroundColor Green 