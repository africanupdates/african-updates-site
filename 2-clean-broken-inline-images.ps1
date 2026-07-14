Get-ChildItem -Path content -Recurse -Filter *.md | ForEach-Object {
    $mdFile = $_.FullName
    $mdDir = $_.DirectoryName
    $content = Get-Content $mdFile -Raw
    $newContent = [regex]::Replace($content, '!\[.*?\]\((images/[^)]+\.(jpg|jpeg|png|gif|webp))\)', {
        param($m)
        $imgPath = $m.Groups[1].Value
        $fullImgPath = Join-Path $mdDir $imgPath
        if (Test-Path $fullImgPath) { $m.Value } else { "" }
    })
    if ($newContent -ne $content) {
        Set-Content -Path $mdFile -Value $newContent -NoNewline
        Write-Output "Cleaned: $mdFile"
    }
}
Write-Output "`nDone."