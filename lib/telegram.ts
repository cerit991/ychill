import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const chatId = process.env.TELEGRAM_CHAT_ID!;

const bot = new TelegramBot(token, { polling: false });

export async function sendTelegramMessage(message: string) {
  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Telegram mesaj gönderme hatası:', error);
  }
}