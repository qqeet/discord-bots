const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const token = process.env.DISCORD_TOKEN_FANART || require('./fanart-token.json').token;
const { prefix } = require('./config.json');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
client.login(token);
//node discord.js


//node Fanartserver.js
//node Myserver.js
//node twitterpic.js

// 連上線時的事件
client.on('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Minecraft");
});



//抓刪 刪除事件
client.on('messageDelete', function (message) {
  if (!message.guild) return; //只要是來自群組的訊息
  if (!message.author) return; // 檢查 author 是否存在
  if (message.author.bot) {
    return; // 忽略由機器人發出的訊息
  }

  const authorName = (message.member && message.member.user && message.member.user.username) ? message.member.user.username : message.author.username;
  const authorIcon = (message.member && message.member.user && message.member.user.avatar) ? `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.jpeg` : null;
  
  try {
    const logChannel = client.channels.cache.get('887169974211334174');
    if (!logChannel) return;

    // 優先檢查是否有圖片
    let hasImage = false;
    if (message.attachments.size > 0) {
      message.attachments.forEach(attachment => {
        if (attachment.url.includes(".jpg") || attachment.url.includes(".png") || attachment.url.includes(".jpeg") || attachment.url.includes(".gif")) {
          hasImage = true;
        }
      });
    }

    // 只發送一次日誌
    if (hasImage) {
      const embed = new EmbedBuilder()
        .setDescription(`這個人在 <#${message.channel.id}> 有訊息被刪除`)
        .setColor(5434855)
        .setAuthor({ name: authorName, iconURL: authorIcon })
        .addFields({ name: '刪除內容', value: '以下圖片' });
      logChannel.send({ embeds: [embed] });
      logChannel.send(`${message.attachments.first().url}`);
    } else if (message.content && message.content !== "") {
      const embed = new EmbedBuilder()
        .setDescription(`這個人在 <#${message.channel.id}> 有訊息被刪除`)
        .setColor(5434855)
        .setAuthor({ name: authorName, iconURL: authorIcon })
        .addFields({ name: '刪除內容', value: message.content });
      logChannel.send({ embeds: [embed] });
    }
  } catch(err) {
    console.log("messageDeleteError", err);
  }
});

//抓刪 更新事件
client.on('messageUpdate', function (oldMessage, newMessage) {
  if (!oldMessage.guild || !newMessage.guild) return;
  if(oldMessage.author.id === client.user.id) return;
  if (oldMessage.author.bot) {
    return; // 忽略由機器人發出的訊息
  }
  
  // 如果新舊內容相同，不記錄
  if (oldMessage.content === newMessage.content) return;
  
  try {
      const authorName = (oldMessage.member && oldMessage.member.user && oldMessage.member.user.username) ? oldMessage.member.user.username : (oldMessage.author ? oldMessage.author.username : 'Unknown');
      const authorIcon = (oldMessage.member && oldMessage.member.user && oldMessage.member.user.avatar) ? `https://cdn.discordapp.com/avatars/${oldMessage.member.user.id}/${oldMessage.member.user.avatar}.jpeg` : null;
      const messageLink = `https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`;
      const embed = new EmbedBuilder()
        .setDescription(`這個人在 <#${oldMessage.channel.id}> 編輯了他的訊息\n[點擊查看訊息](${messageLink})`)
        .setColor(15342211)
        .setAuthor({ name: authorName, iconURL: authorIcon })
        .addFields(
          { name: '編輯前', value: oldMessage.content ? `${oldMessage.content}` : '編輯前訊息內容為空' },
          { name: '編輯後', value: newMessage.content ? `${newMessage.content}` : '編輯後訊息內容為空' }
        );

      const logChannel = client.channels.cache.get('887169974211334174');
      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }
  } catch (err) {
    console.log('messageUpdateError', err);
  }
})
