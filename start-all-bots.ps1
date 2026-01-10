# start-all-bots.ps1 - Start all three bots in parallel in separate terminal tabs

$baseDir = 'C:\Users\qqeet\AppData\Local\Discord\bot'
$node = 'C:\nodejs\node.exe'

Write-Host "Starting all bots..." -ForegroundColor Green

# Start three bots as background jobs
$jobs = @(
    @{ Name = 'Myserver';    Script = 'Myserver.js' },
    @{ Name = 'Fanartserver'; Script = 'Fanartserver.js' },
    @{ Name = 'twitterpic';   Script = 'twitterpic.js' }
)

foreach ($j in $jobs) {
    Start-Job -Name $j.Name -ArgumentList $node, $j.Script, $baseDir -ScriptBlock {
        param($nodePath, $scriptFile, $workingDir)
        Set-Location $workingDir
        & $nodePath $scriptFile
    } | Out-Null
    Write-Host "Started: $($j.Name) -> $($j.Script)" -ForegroundColor Cyan
}

Write-Host "All bots started!" -ForegroundColor Green
Write-Host "To view logs: Get-Job | Receive-Job -Keep" -ForegroundColor Yellow
Write-Host "To stop all: Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor Yellow

# Keep displaying job output
while ($true) {
    Start-Sleep -Seconds 1
    $runningJobs = Get-Job | Where-Object { $_.State -eq 'Running' }
    if ($runningJobs.Count -eq 0) {
        Write-Host "All bots have stopped." -ForegroundColor Red
        break
    }
}
