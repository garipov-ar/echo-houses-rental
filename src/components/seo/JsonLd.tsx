import React from 'react';

export const JsonLd: React.FC = () => {
  const schemaLodging = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Гостевой комплекс «ЭХО» (A-Frame и Шале)',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739',
    description:
      'Посуточная аренда стильного A-Frame дома и семейного коттеджа в Комсомольске-на-Амуре с сибирским банным чаном на дровах и русской баней.',
    telephone: '+78000000000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Комитетская, 1',
      addressLocality: 'Комсомольск-на-Амуре',
      addressRegion: 'Хабаровский край',
      postalCode: '681000',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.575678,
      longitude: 136.910337,
    },
    priceRange: '7000RUB - 18000RUB per night',
    checkinTime: '15:00',
    checkoutTime: '12:00',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Сибирский банный чан на дровах', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Русская баня', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Мангальная зона', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Бесплатная закрытая парковка', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
    ],
  };

  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Как забронировать дом в комплексе ЭХО?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Оставьте заявку на сайте. Для фиксации даты вносится предоплата 50%, остаток при заселении.',
        },
      },
      {
        '@type': 'Question',
        name: 'Какое время заезда и выезда?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Заезд осуществляется с 15:00, выезд — до 12:00 следующего дня.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLodging) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />
    </>
  );
};
