import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendBookingToTelegram } from '@/utils/telegramBooking';

const bookingSchema = z.object({
  houseName: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  nightsCount: z.number().positive(),
  guestsCount: z.number().positive(),
  selectedSpa: z.array(z.string()).optional().default([]),
  totalPrice: z.number().positive(),
  deposit: z.number(),
  clientName: z.string().min(1, 'Имя обязательно'),
  clientPhone: z.string().min(8, 'Некорректный номер телефона'),
  preferredMessenger: z.enum(['telegram', 'whatsapp', 'call']).default('telegram'),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = bookingSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ошибка валидации данных бронирования',
          details: validatedData.error.flatten(),
        },
        { status: 400 }
      );
    }

    const bookingId = 'ECHO-' + Math.floor(1000 + Math.random() * 9000);
    const result = await sendBookingToTelegram(validatedData.data);

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Заявка на бронирование успешно зарегистрирована',
      dispatched: result.success,
    });
  } catch (error) {
    console.error('Booking processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Внутренняя ошибка сервера',
      },
      { status: 500 }
    );
  }
}
