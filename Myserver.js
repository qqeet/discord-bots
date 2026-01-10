const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const token = process.env.DISCORD_TOKEN_MYSERVER || require('./token.json').token;
const { prefix } = require('./config.json');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
client.login(token);




// 連上線時的事件
client.on('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Phantasy Star Online 2: New Genesis");
});



//抓刪 刪除事件
client.on('messageDelete', function (message) {
  if (!message.guild) return; //只要是來自群組的訊息
  if (!message.author) return; // 檢查 author 是否存在
  let mStr = '';
  if (message.author.bot) {
    return; // 忽略由機器人發出的訊息
  }
  if (message.attachments.size > 0) { //Make sure there are attachments at all
      var react = false; //Do we react to the message? Default to false

      message.attachments.forEach(attachment => { //Check each attachment to see if it's a jpg, png, or jpeg
          if (attachment.url.includes(".jpg") || attachment.url.includes(".png") || attachment.url.includes(".jpeg") || attachment.url.includes(".gif") ) {
              react = true; //It's an image! We want to react to the message
          };
      });

      if (react === true) { //React to the message
          const authorName = (message.member && message.member.user && message.member.user.username) ? message.member.user.username : message.author.username;
          const authorIcon = (message.member && message.member.user && message.member.user.avatar) ? `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.jpeg` : null;
          const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
          const embed = new EmbedBuilder()
            .setDescription(`這個人在 <#${message.channel.id}> 有訊息被刪除\n[點擊查看訊息](${messageLink})`)
            .setColor(5434855)
            .setAuthor({ name: authorName, iconURL: authorIcon })
            .addFields({ name: '刪除內容', value: '以下圖片' });
          try {
            const logChannel = client.channels.cache.get('887797421315338240');
            if (logChannel) {
              logChannel.send({ embeds: [embed] });
              logChannel.send(`${message.attachments.first().url}`);
            }
          } catch (err) {
            console.error('發送訊息失敗:', err);
          }
            //client.channels.cache.get("887169974211334174").send({embed})  //吃草
            //client.channels.cache.get("887169974211334174").send(`${message.attachments.first().url}`)  //吃草
            
      };
  };
  
  try{
      if (message.content===("")) return;
      const authorName = (message.member && message.member.user && message.member.user.username) ? message.member.user.username : message.author.username;
      const authorIcon = (message.member && message.member.user && message.member.user.avatar) ? `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.jpeg` : null;
      const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
      const embed = new EmbedBuilder()
        .setDescription(`這個人在 <#${message.channel.id}> 有訊息被刪除\n[點擊查看訊息](${messageLink})`)
        .setColor(5434855)
        .setAuthor({ name: authorName, iconURL: authorIcon })
        .addFields({ name: '刪除內容', value: `${message.content}` });
      try {
        const logChannel = client.channels.cache.get('887797421315338240');
        if (logChannel) {
          logChannel.send({ embeds: [embed] });
        }
      } catch (err) {
        console.error('發送訊息失敗:', err);
      }
  }catch(err){
      console.log("messageDeleteError",err);
  }
});

//抓刪 更新事件
client.on('messageUpdate', async function (oldMessage, newMessage) {
  try {
    if (!oldMessage || !newMessage) return;

    if (oldMessage.partial) {
      oldMessage = await oldMessage.fetch().catch(() => null);
      if (!oldMessage) return;
    }
    if (newMessage.partial) {
      newMessage = await newMessage.fetch().catch(() => null);
      if (!newMessage) return;
    }

    if (!oldMessage.guild || !newMessage.guild) return;
    if (oldMessage.author && oldMessage.author.id === client.user.id) return;
    if (oldMessage.author && oldMessage.author.bot) return;
    if (oldMessage.content && oldMessage.content.includes("https://")) return;

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
    try {
      const logChannel = client.channels.cache.get('887797421315338240');
      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }
    } catch (err) {
      console.error('發送訊息失敗:', err);
    }

  } catch (err) {
    console.log('messageUpdateError', err);
  }
})
