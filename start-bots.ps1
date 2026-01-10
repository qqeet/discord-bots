# start-bots.ps1 - starts three bots as background PowerShell jobs (no external windows)

$base = 'C:\Users\qqeet\AppData\Local\Discord\bot'
$node = 'C:\nodejs\node.exe'

if (-not (Test-Path (Join-Path $base 'logs'))) {
    New-Item -ItemType Directory -Path (Join-Path $base 'logs') | Out-Null
}

$jobs = @(
    @{ Name = 'Myserver';    Script = 'Myserver.js' },
    @{ Name = 'Fanartserver'; Script = 'Fanartserver.js' },
    @{ Name = 'twitterpic';   Script = 'twitterpic.js' }
)

foreach ($j in $jobs) {
    if (Get-Job -Name $j.Name -ErrorAction SilentlyContinue) {
        Write-Host "Job $($j.Name) already exists, skipping."
        continue
    }

    Start-Job -Name $j.Name -ArgumentList $node, $j.Script, $base -ScriptBlock {
        param($nodePath, $scriptFile, $workingDir)
        Set-Location $workingDir
        $logPath = Join-Path $workingDir ("logs\" + $scriptFile + ".log")
        & $nodePath $scriptFile 2>&1 | Out-File -FilePath $logPath -Append -Encoding utf8
    }

    Write-Host "Started background job: $($j.Name) -> $($j.Script)"
}

Write-Host "Current background jobs:"
Get-Job | Select-Object Id,Name,State,HasMoreData

Write-Host "To view output: Receive-Job -Name <Name> -Keep or open the logs folder. To stop: Stop-Job -Name <Name>"
