Write-Host @"
Current working directory: $(Get-Location)
Environment vars
-------
GITHUB_SHA: $env:GITHUB_SHA
GITHUB_BASE_REF: $env:GITHUB_BASE_REF
GITHUB_EVENT_PATH: $env:GITHUB_EVENT_PATH
"@

# https://github.community/t/check-pushed-file-changes-with-git-diff-tree-in-github-actions/17220/10
if ($env:GITHUB_BASE_REF) {
    # Pull Request
    git fetch origin $env:GITHUB_BASE_REF --depth=1
    $diffFiles = git diff --name-only origin/$env:GITHUB_BASE_REF $env:GITHUB_SHA
} else {
    # Push
    $gitHubEvent = Get-Content $env:GITHUB_EVENT_PATH | ConvertFrom-Json
    Write-Host "GitHub event: $gitHubEvent"
    git fetch origin $gitHubEvent.before --depth=1
    $diffFiles = git diff --name-only $gitHubEvent.before $env:GITHUB_SHA
}

Write-Host "Diff files: $diffFiles"
if (-not $diffFiles) {
    Write-Error "Seems like we got zero diffs?"
    return
}

$eslintFiles = [string]::join(" ", $diffFiles.Split('\n'))
Write-Host "ESLint check files: $eslintFiles"
if ($eslintFiles.Length -eq 0) {
    Write-Host "Skip ESLint since no input files."
} else {
    npx eslint -c ./.eslintrc.yaml $eslintFiles
}