const http = require('http');
const { spawn } = require('child_process');

// 啟動 Discord bot
const botProcesses = [];
const botFiles = ['Myserver.js', 'Fanartserver.js', 'twitterpic.js'];

botFiles.forEach((botFile, index) => {
  const bot = spawn('node', [botFile], {
    stdio: 'inherit',  // 直接輸出到 console
    detached: false
  });

  bot.on('error', (err) => {
    console.error(`[Bot ${index}] Process error:`, err);
  });

  bot.on('exit', (code) => {
    console.log(`[Bot ${index}] Process exited with code ${code}`);
    // 可以在這裡添加自動重啟邏輯
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
  console.log(`HTTP server listening on port ${PORT}`);
});

// 優雅關閉
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    // 關閉所有 bot 進程
    botProcesses.forEach((bot, index) => {
      bot.kill('SIGTERM');
      console.log(`Bot ${index} process terminated`);
    });
    process.exit(0);
  });
});

