const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 建立 logs 資料夾
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 日誌檔案路徑
const logFile = path.join(logsDir, `bots-${new Date().toISOString().split('T')[0]}.log`);

// 寫入日誌函數
function writeLog(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(logFile, logMessage);
}

writeLog('========== Bot Server Started ==========');

// 啟動 Discord bot
const botProcesses = [];
const botFiles = ['Myserver.js', 'Fanartserver.js', 'twitterpic.js'];

botFiles.forEach((botFile, index) => {
  writeLog(`Starting bot ${index}: ${botFile}`);
  
  const bot = spawn('node', [botFile]);

  // 捕獲 stdout
  if (bot.stdout) {
    bot.stdout.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        writeLog(`[Bot ${index}] ${message}`);
      }
    });
  }

  // 捕獲 stderr
  if (bot.stderr) {
    bot.stderr.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        writeLog(`[Bot ${index} ERROR] ${message}`);
      }
    });
  }

  bot.on('error', (err) => {
    writeLog(`[Bot ${index}] Process error: ${err.message}`);
  });

  bot.on('exit', (code) => {
    writeLog(`[Bot ${index}] Process exited with code ${code}`);
  });

  botProcesses.push(bot);
});

// 簡單的 HTTP 伺服器用於健康檢查
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Discord bots are running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  writeLog(`HTTP server listening on port ${PORT}`);
});

// 優雅關閉
process.on('SIGTERM', () => {
  writeLog('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    writeLog('HTTP server closed');
    // 關閉所有 bot 進程
    botProcesses.forEach((bot, index) => {
      bot.kill('SIGTERM');
      writeLog(`Bot ${index} process terminated`);
    });
    writeLog('========== Bot Server Stopped ==========');
    process.exit(0);
  });
});


