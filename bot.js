const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;
const YOUR_RENDER_URL = "https://mini-money-xxxx.onrender.com";

const bot = new Telegraf(BOT_TOKEN);
const app = express();
app.use(express.static(__dirname));

let balance = {};

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/main', (req, res) => res.sendFile(path.join(__dirname, 'main.html')));

bot.start((ctx) => {
  const id = ctx.from.id;
  if (!balance[id]) balance[id] = 0;

  ctx.reply(
`💰 *WELCOME TO MINI MONEY* 💰

Hi ${ctx.from.first_name}! 👋

Earn Daily By Completing Simple Tasks.

👇 Click Below To Start Earning`,
    {
      parse_mode: 'Markdown',
   ...Markup.inlineKeyboard([
        [Markup.button.webApp('🚀 OPEN MINI MONEY APP', `${YOUR_RENDER_URL}/main`)],
        [Markup.button.callback('💰 MY BALANCE', 'balance')],
        [Markup.button.callback('📊 STATS', 'stats')]
      ])
    }
  );
});

bot.action('balance', (ctx) => {
  const bal = balance[ctx.from.id] || 0;
  ctx.answerCbQuery();
  ctx.reply(`💰 Your Balance: $${bal}`);
});

bot.action('stats', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(`📊 *STATS*\n\nUsers: ${Object.keys(balance).length}\nStatus: Active ✅`);
});

bot.launch();
app.listen(process.env.PORT || 3000, () => console.log('Bot Running EN...'));
