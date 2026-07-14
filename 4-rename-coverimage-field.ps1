$renamed = 0

Get-ChildItem -Path content -Recurse -Filter *.md | ForEach-Object {
    $mdFile = $_.FullName
    try {
        $content = Get-Content $mdFile -Raw -ErrorAction Stop
        if ($content -match 'coverImage:\s*"[^"]*"') {
            $newContent = $content -replace 'coverImage:', 'featured_image:'
            Set-Content -Path $mdFile -Value $newContent -NoNewline
            $renamed++
        }
    } catch {
        Write-Output "SKIPPED: $mdFile"
    }
}

Write-Output "`nRenamed field in $renamed files"