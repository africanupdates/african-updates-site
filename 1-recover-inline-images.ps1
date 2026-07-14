$uploadsBackup = "C:\Users\Admin\Desktop\wp-migration\uploads"
$fixed = 0
$notFound = @()

Get-ChildItem -Path content -Recurse -Filter *.md | ForEach-Object {
    $mdFile = $_.FullName
    $mdDir = $_.DirectoryName
    try {
        $content = Get-Content $mdFile -Raw -ErrorAction Stop
        $matches = [regex]::Matches($content, '!\[.*?\]\((.*?)\)')
        foreach ($m in $matches) {
            $imgPath = $m.Groups[1].Value
            if ($imgPath -notmatch '^https?://' -and $imgPath -notmatch '["<>|]') {
                $fullImgPath = Join-Path $mdDir $imgPath
                if (-not (Test-Path -LiteralPath $fullImgPath -ErrorAction SilentlyContinue)) {
                    $fileName = Split-Path $imgPath -Leaf
                    $baseName = $fileName -replace '-\d+x\d+(?=\.[a-zA-Z]+$)', ''
                    $baseNoExt = [System.IO.Path]::GetFileNameWithoutExtension($baseName)
                    $found = Get-ChildItem -Path $uploadsBackup -Recurse -Filter "$baseNoExt*" -ErrorAction SilentlyContinue | Select-Object -First 1
                    if ($found) {
                        Copy-Item -Path $found.FullName -Destination $fullImgPath -Force
                        $fixed++
                    } else {
                        $notFound += "$fileName (in $mdDir)"
                    }
                }
            }
        }
    } catch {
        Write-Output "SKIPPED: $mdFile"
    }
}

Write-Output "`nFixed: $fixed"
Write-Output "Still missing: $($notFound.Count)"
$notFound | ForEach-Object { Write-Output $_ }