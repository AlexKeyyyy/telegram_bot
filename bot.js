const TelegramBot = require("node-telegram-bot-api");

// Укажите свой токен бота
const token = "7454298868:AAHZtv8YEORzprkF9DgY5paiCGcXk6il_Wg";
const bot = new TelegramBot(token, { polling: true });

// Словарь для хранения количества нажатий
const missCount = {};

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Создаем кнопки для клавиатуры
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

// Обработка нажатия на кнопку "Я скучаю"
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name;

  if (msg.text === "Я скучаю") {
    // Увеличиваем счетчик для текущего пользователя
    if (missCount[userId]) {
      missCount[userId].count += 1;
    } else {
      missCount[userId] = { name: userName, count: 1 };
    }

    // Отправляем сообщение с количеством нажатий
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
