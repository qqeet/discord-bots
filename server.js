const http = require('http');
const { spawn } = require('child_process');

// 啟動 Discord bot
const bots = [
  spawn('node', ['Myserver.js']),
  spawn('node', ['Fanartserver.js']),
  spawn('node', ['twitterpic.js'])
];

// 簡單的 HTTP 伺服器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Discord bots are running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// 處理 bot 輸出
bots.forEach((bot, index) => {
  bot.stdout?.on('data', (data) => {
    console.log(`[Bot ${index}] ${data}`);
  });
  bot.stderr?.on('data', (data) => {
    console.error(`[Bot ${index}] ${data}`);
  });
});
