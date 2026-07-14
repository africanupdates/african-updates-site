$uploadsBackup = "C:\Users\Admin\Desktop\wp-migration\uploads"
$fixed = 0
$removed = 0

Get-ChildItem -Path content -Recurse -Filter *.md | ForEach-Object {
    $mdFile = $_.FullName
    $mdDir = $_.DirectoryName
    try {
        $content = Get-Content $mdFile -Raw -ErrorAction Stop
        $match = [regex]::Match($content, 'coverImage:\s*"([^"]+)"')
        if ($match.Success) {
            $imgName = $match.Groups[1].Value
            $fullImgPath = Join-Path $mdDir $imgName
            if (-not (Test-Path -LiteralPath $fullImgPath -ErrorAction SilentlyContinue)) {
                $baseName = $imgName -replace '-\d+x\d+(?=\.[a-zA-Z]+$)', ''
                $baseNoExt = [System.IO.Path]::GetFileNameWithoutExtension($baseName)
                $found = Get-ChildItem -Path $uploadsBackup -Recurse -Filter "$baseNoExt*" -ErrorAction SilentlyContinue | Select-Object -First 1
                if ($found) {
                    Copy-Item -Path $found.FullName -Destination $fullImgPath -Force
                    $fixed++
                } else {
                    $newContent = $content -replace 'coverImage:\s*"[^"]+"\r?\n', ''
                    Set-Content -Path $mdFile -Value $newContent -NoNewline
                    $removed++
                }
            }
        }
    } catch {
        Write-Output "SKIPPED: $mdFile"
    }
}

Write-Output "`nRecovered: $fixed | Removed: $removed"