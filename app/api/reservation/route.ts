import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendTelegramMessage } from '@/lib/telegram';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const data = await request.json();
    
    return new Promise((resolve) => {
      const query = `
        INSERT INTO reservations (name, email, phone, date, time, guests, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
      `;
      
      db.run(
        query,
        [
          data.name,
          data.email,
          data.phone,
          data.date,
          data.time,
          data.guests,
          data.notes || null
        ],
        async function(err) {
          if (err) {
            console.error('Rezervasyon kayıt hatası:', err);
            resolve(new NextResponse(
              JSON.stringify({ error: 'Rezervasyon kaydedilirken bir hata oluştu' }),
              { 
                status: 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            ));
            return;
          }
          
          try {
            // Telegram bildirimi gönder
            if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
              const message = `
<b>Yeni Rezervasyon!</b>

📝 Müşteri: ${data.name}
📞 Telefon: ${data.phone}
📧 Email: ${data.email}
📅 Tarih: ${data.date}
⏰ Saat: ${data.time}
👥 Kişi Sayısı: ${data.guests}
${data.notes ? `📝 Notlar: ${data.notes}` : ''}
              `;
              
              await sendTelegramMessage(message);
            }
          } catch (telegramError) {
            console.error('Telegram bildirim hatası:', telegramError);
          }
          
          resolve(new NextResponse(
            JSON.stringify({
              success: true,
              message: 'Rezervasyon başarıyla oluşturuldu',
              id: this.lastID
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          ));
        }
      );
    });
  } catch (error) {
    console.error('Rezervasyon işlem hatası:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Rezervasyon işlemi sırasında bir hata oluştu' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function GET() {
  const headersList = headers();
  
  return new Promise((resolve) => {
    db.all(
      'SELECT * FROM reservations ORDER BY created_at DESC',
      (err, rows) => {
        if (err) {
          console.error('Rezervasyon listesi hatası:', err);
          resolve(new NextResponse(
            JSON.stringify({ error: 'Rezervasyonlar alınırken bir hata oluştu' }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          ));
          return;
        }
        
        resolve(new NextResponse(JSON.stringify(rows), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }));
      }
    );
  });
}