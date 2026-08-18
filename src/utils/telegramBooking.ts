export interface BookingLeadPayload {
  houseName: string;
  checkIn: string;
  checkOut: string;
  nightsCount: number;
  guestsCount: number;
  selectedSpa: string[];
  totalPrice: number;
  deposit: number;
  clientName: string;
  clientPhone: string;
  preferredMessenger: 'telegram' | 'whatsapp' | 'call';
  comment?: string;
}

export async function sendBookingToTelegram(lead: BookingLeadPayload): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Vladivostok' });
  const messengerLabel =
    lead.preferredMessenger === 'telegram'
      ? '✈️ Telegram'
      : lead.preferredMessenger === 'whatsapp'
      ? '💬 WhatsApp'
      : '📞 Телефонный звонок';

  let message = `🌲 <b>НОВОЕ БРОНИРОВАНИЕ — «ЭХО» КОМСОМОЛЬСК</b>\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🏠 <b>Объект:</b> ${lead.houseName}\n`;
  message += `📅 <b>Даты:</b> ${lead.checkIn} — ${lead.checkOut} (${lead.nightsCount} сут.)\n`;
  message += `👥 <b>Гостей:</b> ${lead.guestsCount} чел.\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `👤 <b>Имя:</b> ${lead.clientName}\n`;
  message += `📱 <b>Телефон:</b> <code>${lead.clientPhone}</code>\n`;
  message += `📲 <b>Связь через:</b> ${messengerLabel}\n`;

  if (lead.selectedSpa && lead.selectedSpa.length > 0) {
    message += `\n✨ <b>ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ:</b>\n`;
    lead.selectedSpa.forEach((spa) => {
      message += `• ${spa}\n`;
    });
  }

  if (lead.comment) {
    message += `\n💬 <b>Пожелания:</b> ${lead.comment}\n`;
  }

  message += `\n💰 <b>ИТОГО К ОПЛАТЕ:</b> <u>${new Intl.NumberFormat('ru-RU').format(lead.totalPrice)} ₽</u>\n`;
  message += `🔒 <i>Возвратный залог при заселении: ${new Intl.NumberFormat('ru-RU').format(lead.deposit)} ₽</i>\n`;
  message += `⏰ <i>Время заявки (ХАБ): ${timestamp}</i>`;

  if (botToken && chatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        console.error('Telegram API error:', data);
        return { success: false, error: data.description };
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to send telegram notification:', err);
      return { success: false, error: 'Network failure' };
    }
  }

  console.log('--- [MOCK TELEGRAM BOOKING DISPATCH] ---');
  console.log(message.replace(/<[^>]*>?/gm, ''));
  console.log('----------------------------------------');

  return { success: true };
}
