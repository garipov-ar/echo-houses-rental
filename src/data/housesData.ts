export interface House {
  id: 'a_frame' | 'chalet';
  name: string;
  badge: string;
  tagline: string;
  area: number; // m²
  capacityStandard: number;
  capacityMax: number;
  bedrooms: number;
  bathrooms: number;
  priceWeekday: number;
  priceWeekend: number;
  priceExtraGuest: number;
  mainImage: string;
  gallery: string[];
  description: string;
  amenities: {
    iconName: string;
    label: string;
  }[];
  features: string[];
  rules: {
    checkIn: string;
    checkOut: string;
    deposit: number;
  };
}

export const HOUSES: House[] = [
  {
    id: 'a_frame',
    name: 'A-Frame «Лесной Шалаш»',
    badge: 'Для пар и семей до 4 чел.',
    tagline: 'Романтика скандинавского шалаша с панорамным видом на лес и вторым светом',
    area: 65,
    capacityStandard: 2,
    capacityMax: 4,
    bedrooms: 1, // спальня на 2 ярусе + диван
    bathrooms: 1,
    priceWeekday: 7000,
    priceWeekend: 9500,
    priceExtraGuest: 1000,
    mainImage: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Идеальное пространство для уединенного свидания, эстетичной фотосессии или спокойных семейных выходных. Высокие потолки 6 метров, панорамные окна в пол, уютный второй ярус с двуспальной кроватью и теплый свет гирлянд.',
    amenities: [
      { iconName: 'Tv', label: 'Проектор с экраном (Кинопоиск, YouTube)' },
      { iconName: 'Disc', label: 'Виниловый проигрыватель с коллекцией пластинок' },
      { iconName: 'Coffee', label: 'Кофемашина Nespresso, чай, специи' },
      { iconName: 'Wifi', label: 'Высокоскоростной Wi-Fi (оптоволокно)' },
      { iconName: 'Utensils', label: 'Полный комплект посуды и бокалов на 4 персоны' },
      { iconName: 'Flame', label: 'Индивидуальная мангальная зона и терраса' },
      { iconName: 'ShowerHead', label: 'Тропический душ, фен, халаты и косметика' },
      { iconName: 'ThermometerSnowflake', label: 'Теплые полы и климат-контроль' },
    ],
    features: [
      'Второй свет и спальное место под треугольным скатом крыши',
      'Парящее подвесное кресло-кокон с видом на лес',
      'Персональная терраса с теплыми пледами и ретро-гирляндами',
      'Расположение рядом с горячим сибирским чаном',
    ],
    rules: {
      checkIn: 'с 15:00',
      checkOut: 'до 12:00',
      deposit: 5000,
    },
  },
  {
    id: 'chalet',
    name: 'Семейное Шале «Большой Дом»',
    badge: 'Для компаний до 10–12 чел.',
    tagline: 'Просторный двухэтажный коттедж с камином для душевных праздников и встреч',
    area: 140,
    capacityStandard: 8,
    capacityMax: 12,
    bedrooms: 3,
    bathrooms: 2,
    priceWeekday: 14000,
    priceWeekend: 18000,
    priceExtraGuest: 1000,
    mainImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Капитальный деревянный дом для больших семей, дней рождения и встреч друзей. Огромная гостиная с обеденным столом из массива дуба, настоящий дровяной камин, караоке и три уютные спальни с ортопедическими матрасами Ascona.',
    amenities: [
      { iconName: 'Flame', label: 'Дровяной камин в гостиной' },
      { iconName: 'Mic', label: 'Караоке-система с двумя беспроводными микрофонами' },
      { iconName: 'Users', label: 'Большой стол на 12 персон из массива дуба' },
      { iconName: 'Bed', label: '3 изолированные спальни + 2 раскладных дивана' },
      { iconName: 'UtensilsCrossed', label: 'Большая кухня: духовка, посудомоечная машина' },
      { iconName: 'Bath', label: '2 раздельных санузла на 1 и 2 этажах' },
      { iconName: 'Tv', label: 'Smart TV 65" 4K с подписками на кинотеатры' },
      { iconName: 'Gamepad2', label: 'Игровая консоль Sony PlayStation 5 и настолки' },
    ],
    features: [
      'Огромная крытая терраса с зоной барбекю и казаном',
      'Уютный каминный зал для долгих душевных бесед',
      'Полная звукоизоляция спальных комнат',
      'Прямой выход к русской бане на дровах',
    ],
    rules: {
      checkIn: 'с 15:00',
      checkOut: 'до 12:00',
      deposit: 10000,
    },
  },
];
