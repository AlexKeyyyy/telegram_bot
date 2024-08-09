const TelegramBot = require("node-telegram-bot-api");

const express = require("express");

const token = "7454298868:AAHZtv8YEORzprkF9DgY5paiCGcXk6il_Wg";
const bot = new TelegramBot(token);
const app = express();

bot.setWebHook(`https://telegram-bot-sveta.vercel.app/${token}`);

app.use(express.json());

app.post(`/${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Словарь для хранения количества нажатий
const missCount = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const opts = {
    reply_markup: {
      keyboard: [["Я скучаю", "Статистика"]],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };
  bot.sendMessage(
    chatId,
    "Привет, Света! Используй кнопки внизу, чтобы выразить свои чувства.",
    opts
  );
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name;

  if (msg.text === "Я скучаю") {
    if (missCount[userId]) {
      missCount[userId].count += 1;
    } else {
      missCount[userId] = { name: userName, count: 1 };
    }
    const totalCount = missCount[userId].count;
    bot.sendMessage(chatId, `${userName}, ты скучал ${totalCount} раз(а)!`);
  }

  if (msg.text === "Статистика") {
    let response = "Статистика скучания:\n";
    for (const userId in missCount) {
      response += `${missCount[userId].name} скучал ${missCount[userId].count} раз(а).\n`;
    }
    bot.sendMessage(chatId, response);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
