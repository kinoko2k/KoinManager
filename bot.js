const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, HTTPError, Embed, MessageAttachment, Intents, VoiceChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const template = new Discord.EmbedBuilder()


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
});


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});


// 特定のサーバーIDを指定
const allowedServerId = '1097462227679838259';

// 特定のユーザーIDを指定
const allowedUserId = '925245386568896564';

const PREFIX = 'c!';

client.on('messageCreate', async (message) => {
  if (message.author.id === client.user.id) return;
  if (message.author.bot) return;
  if (message.guild.id !== allowedServerId) {

    return;
  }
  if (message.content.startsWith('mc!help')) {
    const embed = new EmbedBuilder()
      .setTitle('コマンドリスト')
      .setDescription('以下は利用可能なコマンドの一覧です。')
      .addFields(
        { name: 'mc!serverinfo', value: 'サーバーの情報を表示します。(廃止)' },
        { name: `${PREFIX}mcserver`, value: 'Minecraftサーバーの状態を確認します。' },
        { name: `${PREFIX}ipinfo`, value: 'IPアドレスの情報を表示します。' },
        { name: `${PREFIX}wiki`, value: 'Wikipediaで指定したキーワードを検索します。' },
        { name: `${PREFIX}time`, value: '現在の時間を表示します。' },
        { name: `${PREFIX}github`, value: '指定したGitHubリポジトリの情報を表示します。' },
        { name: '!hypixel', value: 'Hypixelサーバーの情報を表示します。' },
        { name: '!screenshot', value: 'サイトのスクリーンショットを撮って表示します。 (サブサーバのみ)' },
        { name: 'mc!mcidcheck', value: 'MCIDの詳細について表示します。' },
        { name: 'mc!poll <q1>...<q10>', value: '投票を行います。' },
        { name: 'mc!pollend <id>', value: '投票を終了し、結果を表示します。' },
        { name: 'discordサーバの詳細', value: 'discord.gg/{inviteCode}を投稿するとサーバ情報が表示されます。' }
      );
    message.channel.send({ embeds: [embed] });
  }
});

// 投票の情報を格納するマップ
const polls = new Map();

// 投票オプションを表す絵文字に対応するインデックスを取得する関数
function getOptionIndex(emoji) {
  const numberEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
  return numberEmoji.indexOf(emoji);
}

client.on('messageCreate', async (message) => {
  if (message.author.id === client.user.id) return;
  if (message.author.bot) return;
  // 特定のユーザーのみコマンドを実行できるようにする
  if (message.author.id !== allowedUserId) {
    return;
  }
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'poll') {
    if (!args[0] || args.length < 3 || args.length > 12) {
      message.reply('正しい形式でコマンドを実行してください。例: `!poll <題名> <選択肢1> ... <選択肢10>`');
      return;
    }

    const pollId = generateRandomId(); // ランダムなIDを生成
    const pollTitle = args[0];
    const pollOptions = args.slice(1, 11); // 最大10個の選択肢をサポート

    const embed = new EmbedBuilder()
      .setTitle(pollTitle)
      .setDescription('投票結果を表示する：`' + `mc!pollend ${pollId}` + '`')
      .setColor('#00ff00');

    for (let i = 0; i < pollOptions.length; i++) {
      embed.addFields(
        { name: `${i + 1}. ` + pollOptions[i], value: " ", inline: false });
    }

    message.channel.send({ embeds: [embed] }).then((msg) => {
      for (let i = 0; i < pollOptions.length; i++) {
        msg.react(getEmoji(i + 1));
      }
      // 生成した投票の情報をマップに格納
      polls.set(pollId, { messageId: msg.id, channelId: message.channel.id, options: pollOptions });
    });
  } else if (command === 'pollend') {
    const pollId = args[0];
    const pollInfo = polls.get(pollId);

    if (!pollInfo) {
      message.reply('指定したIDの投票が見つかりません。');
      return;
    }
    /*
        // 投票のメッセージを取得し、削除する
        message.channel.messages.fetch(pollInfo.messageId)
          .then((msg) => {
            if (msg) {
              
        // リアクションを取得して投票数を集計
        const messageObject = message.channel.messages.cache.get(pollInfo.messageId);
        if (messageObject) {
          const reactions = await messageObject.reactions.cache;*/
    const resultsEmbed = new EmbedBuilder()
      .setTitle(`投票結果 - ${pollId}`)
      .setColor('#00ff00');

    if (!pollInfo.options) {
      message.reply('投票結果がありません。');
      return;
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.content === 'c!ping') {
    const startTime = Date.now();
    const pingMessage = await message.channel.send('Pinging...');
    const endTime = Date.now();

    const pingEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Pong!!🏓')
      .addFields(
        { name: 'Ping', value: `${endTime - startTime}ms`, inline: true },
        { name: 'WebSocket', value: `${client.ws.ping}ms`, inline: true }
      );

    pingMessage.edit({ content: 'Pong!', embeds: [pingEmbed] });
  }
});



client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'omikuji') {
    const omikujiOptions = ['大吉', '中吉', '小吉', '末吉', '凶']; // おみくじの結果

    const randomIndex = Math.floor(Math.random() * omikujiOptions.length);
    const selectedResult = omikujiOptions[randomIndex];

    const embed = new EmbedBuilder()
      .setColor('#ADFF2F')
      .setTitle('おみくじ')
      .setDescription(`<@${message.author.id}>さんの今日の運勢は！`)
      .setFields({ name: '[運勢]', value: `${selectedResult}`, inline: true })
      .setThumbnail('https://3.bp.blogspot.com/-cPqdLavQBXA/UZNyKhdm8RI/AAAAAAAASiM/NQy6g-muUK0/s400/syougatsu2_omijikuji2.pngttps://images-ext-1.discordapp.net/external/zVm6n23Ju3BxLWr5XINg-1950hh7y3dypezxwQIcV-I/https/japaclip.com/files/omikuji.png?width=922&height=1200')

    message.channel.send({ embeds: [embed] });
  }
});

/*
const jankenOptions = ['✊', '✌️', '✋'];
const results = ['引き分け', '勝ち', '負け'];

const getResult = (userChoice, botChoice) => {
  const userIndex = jankenOptions.indexOf(userChoice);
  const botIndex = jankenOptions.indexOf(botChoice);

  const resultIndex = (userIndex - botIndex + 3) % 3;
  return results[resultIndex];
};

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'janken') {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('じゃんけんゲーム')
      .setDescription('最初はグー、じゃんけん！')
      .setURL('https://zenn.dev/articles/0b3ce05e269d70/edit');

    const gameMessage = await message.channel.send({ embeds: [embed] });

    for (const option of jankenOptions) {
      await gameMessage.react(option);
    }

    const filter = (reaction, user) => user.id === message.author.id && jankenOptions.includes(reaction.emoji.name);
    const collector = gameMessage.createReactionCollector({ filter, time: 15000 });

    collector.on('collect', (reaction) => {
      const userChoice = reaction.emoji.name;
      const botChoice = jankenOptions[Math.floor(Math.random() * jankenOptions.length)];

      const result = getResult(botChoice, userChoice); // ここでユーザ側の選択を先にする

      const resultEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('じゃんけんの結果')
        .addFields(
          { name: 'あなたの選択', value: userChoice, inline: true},
          { name: 'Botの選択', value: botChoice, inline: true },
          { name: '結果', value: `${result}` },
        );

      gameMessage.edit({ embeds: [resultEmbed] });
    });
  }
});
*/

const fs = require('fs');
const { spawn } = require('child_process');


const channelID = '1139821184381366292'; // 特定のチャンネルIDをここに入力

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (!newState.channel || newState.channel.id === oldState.channel?.id) {
    return;
  }

  // ボイスチャンネルに入室したときの処理
  if (newState.member.id === client.user.id) {
    const connection = await newState.channel.join();

    // Vosk APIを使って音声をテキストに変換する
    const voskProcess = spawn('YOUR_VOSK_API_NODEJS_DEMO_PATH', ['--port', '8080']);
    connection.receiver.createStream(newState.member.user, {
      mode: 'pcm',
    }).pipe(voskProcess.stdin);

    voskProcess.stdout.on('data', (data) => {
      const text = data.toString().trim();
      if (text) {
        const sentences = text.split('. '); // 適切な区切りで文を分割
        const channel = client.channels.cache.get(channelID);
        sentences.forEach((sentence) => {
          channel.send(sentence);
        });
      }
    });

    voskProcess.on('exit', () => {
      connection.disconnect();
    });
  }
});

const sqlite3 = require('sqlite3').verbose();

// データベースの作成とテーブルの作成
const db = new sqlite3.Database('./coin.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('SQLite3 connection error:', err);
  } else {
    // coinsテーブルを作成
    db.run(`CREATE TABLE IF NOT EXISTS coins (user_id TEXT PRIMARY KEY, coins INTEGER DEFAULT 0)`, (err) => {
      if (err) {
        console.error('SQLite3 table creation error:', err);
      } else {
        console.log('Connected to SQLite3 database and created "coins" table.');
      }
    });
  }
});

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  // メッセージごとに1コイン追加
  db.run(`INSERT OR IGNORE INTO coins (user_id, coins) VALUES (?, 0)`, [message.author.id], (err) => {
    if (err) {
      console.error('SQLite3 insert error:', err);
    } else {
      db.run(`UPDATE coins SET coins = coins + 1 WHERE user_id = ?`, [message.author.id], (err) => {
        if (err) {
          console.error('SQLite3 update error:', err);
        }
      });
    }
  });
});

// !moneyコマンド
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('c!money')) {
    const args = message.content.split(' ');
    if (args.length > 2) {
      message.reply('使い方: !money [user_id]');
      return;
    }

    const userId = args[1] || message.author.id;

    db.get(`SELECT coins FROM coins WHERE user_id = ?`, [userId], (err, row) => {
      if (err) {
        console.error('SQLite3 select error:', err);
        return;
      }

      if (!row) {
        message.reply(`<@${userId}> はコインを持っていません。`);
      } else {
        const coins = row.coins;
        if (userId === message.author.id) {
          const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('moneyコマンド実行')
          .setDescription(`あなたのもちものこいん： ${coins} こいん`)
  
        message.channel.send({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('moneyコマンド実行')
          .setDescription(`<@${userId}> には ${coins} コインがあります。`)
  
        message.channel.send({ embeds: [embed] });
        }
      }
    });
  }
});

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('c!remoney') && message.author.id === '925245386568896564') {

    if (args.length !== 3) {
      message.reply('使い方: c!remoney <user_id> <amount>');
      return;
    }

    const userId = args[1];
    const amount = parseInt(args[2]);

    if (isNaN(amount) || amount <= 0) {
      message.reply('無効な金額です！有効な正の数値を指定してください。');
      return;
    }

    // 指定したユーザの所持コインを減らす
    db.run(`INSERT OR IGNORE INTO coins (user_id, coins) VALUES (?, 0)`, [userId], (err) => {
      if (err) {
        console.error('SQLite3 insert error:', err);
      } else {
        db.run(`UPDATE coins SET coins = coins - ? WHERE user_id = ?`, [amount, userId], (err) => {
          if (err) {
            console.error('SQLite3 update error:', err);
          } else {
            const embed = new EmbedBuilder()
              .setColor('#0099ff')
              .setTitle('remoneyコマンド実行')
              .setDescription(`<@${userId}> から ${amount} コインを引きました。`);
          
            message.channel.send({ embeds: [embed] });
          }
        });
      }
    });
  }
});

// メッセージイベントを処理
client.on('messageCreate', async (message) => {
  if (message.content === 'c!ranking') {
    const rowsPerPage = 10; // 1ページあたりの行数
    let currentPage = 1;    // 現在のページ

    const updateEmbed = async () => {
      db.all(`SELECT user_id, coins FROM coins ORDER BY coins DESC LIMIT ? OFFSET ?`, [rowsPerPage, (currentPage - 1) * rowsPerPage], (err, rows) => {
                if (err) {
          console.error('SQLite3 select error:', err);
        } else {
          const embed = new EmbedBuilder()
            .setTitle('コイン数ランキング')
            .setDescription(`トップ ${rowsPerPage} ページ: ( ${currentPage} )`)
            .setColor('#FFD700');

          rows.forEach((row, index) => {
            const user = client.users.cache.get(row.user_id);
            if (user) {
              embed.addFields({ name: `${(currentPage - 1) * rowsPerPage + index + 1}. ${user.username} (${user.id})`, value: `${row.coins} coins` });
            }
          });

          message.channel.send({ embeds: [embed] }).then(async (msg) => {
            if (currentPage > 1) await msg.react('⬅️');
            if (rows.length === rowsPerPage) await msg.react('➡️');

            const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
            const collector = msg.createReactionCollector({ filter, time: 30000 });

            collector.on('collect', async (reaction) => {
              if (reaction.emoji.name === '⬅️') {
                if (currentPage > 1) {
                  currentPage--;
                  await updateEmbed();
                }
              } else if (reaction.emoji.name === '➡️') {
                currentPage++;
                await updateEmbed();
              }

              reaction.users.remove(message.author.id);
            });

            collector.on('end', () => {
              msg.reactions.removeAll().catch((error) => console.error('Failed to clear reactions:', error));
            });
          });
        }
      });
    };

    updateEmbed();
  }
});

// !giveコマンド
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('c!give') && message.author.id === '925245386568896564') {
    const args = message.content.split(' ');
    if (args.length !== 3) {
      message.reply('使い方: !give <user_id> <amount>');
      return;
    }

    const recipientId = args[1];
    const amount = parseInt(args[2]);

    if (isNaN(amount) || amount <= 0) {
      message.reply('無効な金額です！有効な数値を指定してください。');
      return;
    }

    // Recipientの所持コインを増やす
    db.run(`INSERT OR IGNORE INTO coins (user_id, coins) VALUES (?, 0)`, [recipientId], (err) => {
      if (err) {
        console.error('SQLite3 insert error:', err);
      } else {
        db.run(`UPDATE coins SET coins = coins + ? WHERE user_id = ?`, [amount, recipientId], (err) => {
          if (err) {
            console.error('SQLite3 update error:', err);
          } else {
            const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('giveコマンド実行')
            .setDescription(`${amount}コインを<@${recipientId}>へ送信しました。🎉🎉`)
    
          message.channel.send({ embeds: [embed] });
          }
        });
      }
    });
  }
});


// !sendコマンド
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('c!send')) {
    const args = message.content.split(' ');
    if (args.length !== 3) {
      message.reply('使い方: !send <上げる相手のユーザId> <何コイン上げるか>');
      return;
    }

    const senderId = message.author.id;
    const recipientId = args[1];
    const amount = parseInt(args[2]);

    if (isNaN(amount) || amount <= 0) {
      message.reply('無効な金額です！有効な数値を指定してください。');
      return;
    }

    // Senderの所持コインを取得
    db.get(`SELECT coins FROM coins WHERE user_id = ?`, [senderId], (err, senderRow) => {
      if (err) {
        console.error('SQLite3 select error:', err);
        return;
      }

      if (!senderRow || senderRow.coins < amount) {
        message.reply('送信するのに十分なコインがありません。');
        return;
      }

      // Recipientの所持コインを増やす
      db.run(`INSERT OR IGNORE INTO coins (user_id, coins) VALUES (?, 0)`, [recipientId], (err) => {
        if (err) {
          console.error('SQLite3 insert error:', err);
        } else {
          db.run(`UPDATE coins SET coins = coins + ? WHERE user_id = ?`, [amount, recipientId], (err) => {
            if (err) {
              console.error('SQLite3 update error:', err);
            } else {
              // Senderの所持コインを減らす
              db.run(`UPDATE coins SET coins = coins - ? WHERE user_id = ?`, [amount, senderId], (err) => {
                if (err) {
                  console.error('SQLite3 update error:', err);
                } else {
                  const embed = new EmbedBuilder()
                  .setColor('#0099ff')
                  .setTitle('sendコマンド実行')
                  .setDescription(`<@${recipientId}>は、${amount} コイン奪いました。\n(<@${recipientId}>へ${amount} コインを送信しました。)🎉🎉`)
          
                message.channel.send({ embeds: [embed] });
                }
              });
            }
          });
        }
      });
    });
  }
});

// !allpayコマンド
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('c!allpay') && !message.author.bot && message.author.id === '925245386568896564') {
    const args = message.content.split(' ');
    if (args.length !== 2) {
      message.reply('使い方: c!allpay <amount>');
      return;
    }

    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount <= 0) {
      message.reply('無効な金額です。有効な正の数値を指定してください。');
      return;
    }

    // サーバーのメンバーリストを取得
    const members = message.guild.members.cache.filter(member => !member.user.bot);

    members.forEach(member => {
      // 各メンバーにコインを送信
      db.run(`INSERT OR IGNORE INTO coins (user_id, coins) VALUES (?, 0)`, [member.user.id], (err) => {
        if (err) {
          console.error('SQLite3 insert error:', err);
        } else {
          db.run(`UPDATE coins SET coins = coins + ? WHERE user_id = ?`, [amount, member.user.id], (err) => {
            if (err) {
              console.error('SQLite3 update error:', err);
            }
          });
        }
      });
    });

    message.reply(`${amount} コインをメンバー全員に送信しました。`);
  }
});

// ショップのアイテムと価格と絵文字
const shopItems = [
  { name: 'お試し用 (コインが減ります)', price: 100, emoji: '🎉' },
  { name: '銅インゴットx1', price: 20, emoji: '<:copper:1141000053377466488>' },
  { name: '鉄インゴットx1', price: 100, emoji: '<:iron:1141000055998910564>' },
  { name: '金インゴットx1', price: 300, emoji: '<:gold:1141000046515597323> ' },
  { name: 'ダイヤモンドx1', price: 500, emoji: '<:diamond:1141000043604754432>' },
  { name: 'エメラルドx1', price: 600, emoji: '<:emerald:1141000042031874108>' },
  { name: 'Kinoko_2Kの頭', price: 2500, emoji: '<:Kinoko_2K:1008568889585696879>' },
  // 他のアイテムを追加
];

// ショップのコマンド
client.on('messageCreate', async (message) => {
  if (message.content === 'c!shop' && message.author.id === '925245386568896564') {
    const embed = new EmbedBuilder()
      .setTitle('きのこしょっぷ')
      .setDescription('対応する絵文字に反応して、購入する商品を選択してください:')
      .setColor('#00FF00'); // エンベッドの色

    for (const item of shopItems) {
      embed.addFields({ name: `${item.emoji} ${item.name}`, value: `${item.price} coins` });
    }

    const shopMessage = await message.channel.send({ embeds: [embed] });

    for (const item of shopItems) {
      await shopMessage.react(item.emoji); // 絵文字をリアクション
    }

    // リアクションのフィルタ
    const filter = (reaction, user) => !user.bot && shopItems.find(item => item.emoji.includes(reaction.emoji.toString())) && user.id === message.author.id;

    const collector = shopMessage.createReactionCollector({ filter, time: 60000 }); // リアクションの収集タイムアウト: 60秒

    collector.on('collect', async (reaction, user) => {
      const selectedEmoji = reaction.emoji.toString();
    
      // 選択された絵文字がショップアイテムに含まれているかチェック
      const selectedItem = shopItems.find(item => item.emoji.includes(selectedEmoji));
    
      if (!selectedItem) {
        return; // 無効な絵文字なら無視
      }
    
      // 以下のコードは変更なし
      // Senderの所持コインを取得
      db.get(`SELECT coins FROM coins WHERE user_id = ?`, [user.id], (err, row) => {
        if (err) {
          console.error('SQLite3 select error:', err);
        } else if (!row || row.coins < selectedItem.price) {
          message.reply('このアイテムを購入するのに十分なコインがありません。');
        } else {
          // Senderの所持コインを減らす
          db.run(`UPDATE coins SET coins = coins - ? WHERE user_id = ?`, [selectedItem.price, user.id], (err) => {
            if (err) {
              console.error('SQLite3 update error:', err);
            } else {
              const channelId = '1140137021428465664'; // アイテム購入ログを送信するチャンネルのID
              const channel = message.guild.channels.cache.get(channelId);
    
              if (channel) {
                const logEmbed = new EmbedBuilder()
                  .setTitle(`購入したアイテム: ${selectedItem.name}`)
                  .setDescription(`<@${user.id}> は ${selectedItem.name} を ${selectedItem.price} コインで買いました。`)
                  .setColor('#FF0000'); // エンベッドの色
                  // .setFooter('運営の人は、付与し終わったら✅つけてください。分かりやすくなります。')
    
                channel.send({ embeds: [logEmbed] });
              }
            }
          });
        }
      });
    
      collector.stop();
    });

    collector.on('end', () => {
      shopMessage.reactions.removeAll().catch((error) => console.error('Failed to clear reactions:', error));
    });
  }
});

const jankenOptions = ['✊', '✌️', '✋'];
const results = ['引き分け', '勝ち', '負け'];

const getResult = (userChoice, botChoice) => {
  const userIndex = jankenOptions.indexOf(userChoice);
  const botIndex = jankenOptions.indexOf(botChoice);

  const resultIndex = (userIndex - botIndex + 3) % 3;
  return results[resultIndex];
};

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'janken') {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('じゃんけんゲーム')
      .setDescription('最初はグー、じゃんけん！')
      .setURL('https://zenn.dev/articles/0b3ce05e269d70/edit');

    const gameMessage = await message.channel.send({ embeds: [embed] });

    for (const option of jankenOptions) {
      await gameMessage.react(option);
    }

    const filter = (reaction, user) => user.id === message.author.id && jankenOptions.includes(reaction.emoji.name);
    const collector = gameMessage.createReactionCollector({ filter, time: 15000 });

    collector.on('collect', async (reaction) => {
      const userChoice = reaction.emoji.name;
      const botChoice = jankenOptions[Math.floor(Math.random() * jankenOptions.length)];

      const result = getResult(botChoice, userChoice); // ここでユーザ側の選択を先にする

      let coinChange = 0;

      if (result === '勝ち') {
        coinChange = 5;
      } else if (result === '負け') { // 負けの判定も修正
        coinChange = -5;
      }

      // コインの増減処理
      db.run(`INSERT OR IGNORE INTO coins (user_id, coins) VALUES (?, 0)`, [message.author.id], (err) => {
        if (err) {
          console.error('SQLite3 insert error:', err);
        } else {
          db.run(`UPDATE coins SET coins = coins + ? WHERE user_id = ?`, [coinChange, message.author.id], (err) => {
            if (err) {
              console.error('SQLite3 update error:', err);
            }
          });
        }
      });

      const resultEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('じゃんけんの結果')
        .addFields(
          { name: 'あなたの選択', value: userChoice, inline: true },
          { name: 'Botの選択', value: botChoice, inline: true },
          { name: '結果', value: `${result}` },
          { name: 'コインの変動', value: `${coinChange >= 0 ? '+' : ''}${coinChange} コイン` },
        );

      gameMessage.edit({ embeds: [resultEmbed] });
    });
  }
});

client.login("TOKEN");