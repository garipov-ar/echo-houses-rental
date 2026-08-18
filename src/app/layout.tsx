import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0E1310',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'ЭХО — Аренда A-Frame домов и шале в Комсомольске-на-Амуре с чаном и баней',
  description:
    'Посуточная аренда стильного A-Frame дома и большого семейного шале в Комсомольске-на-Амуре (ул. Комитетская, 1). Горячий сибирский банный чан на дровах, русская баня, мангал и костровая зона.',
  keywords: [
    'аренда а фрейм комсомольск на амуре',
    'посуточная аренда домов комсомольск',
    'дом с чаном комсомольск',
    'глэмпинг комсомольск',
    'эхо комитетская 1',
    'снять дом на сутки комсомольск-на-амуре',
    'баня с чаном комсомольск',
  ],
  openGraph: {
    title: 'Гостевой комплекс «ЭХО» — Уединенный отдых в тайге с горячим чаном',
    description: 'A-Frame дом и Семейное Шале с сибирским чаном и баней на дровах в Комсомольске-на-Амуре.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ЭХО — Дома посуточной аренды',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
