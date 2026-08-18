export interface SpaOption {
  id: string;
  name: string;
  badge?: string;
  price: number;
  duration: string;
  description: string;
  inclusions: string[];
  imageUrl: string;
  iconName: string;
}

export const SPA_SERVICES: SpaOption[] = [
  {
    id: 'siberian_vat',
    name: 'Горячий сибирский банный чан на дровах',
    badge: 'Хит сезона',
    price: 4500,
    duration: '3 часа парения (до 6 чел.)',
    description:
      'Чан из нержавеющей стали с отделкой сибирским кедром под открытым небом. Вода нагревается до комфортных 38–40°C на березовых дровах.',
    inclusions: [
      'Запаривание ветками дальневосточной пихты',
      'Цитрусовое наполнение (грейпфруты, апельсины)',
      'Травяной таежный сбор в термосе с медом',
      'Теплые банные шапки и простыни',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    iconName: 'Sparkles',
  },
  {
    id: 'russian_banya',
    name: 'Русская баня на березовых дровах',
    badge: 'Для здоровья и тонуса',
    price: 4000,
    duration: '3 часа (до 6-8 чел.)',
    description:
      'Настоящая парная из липы с мягким паром, купелью и просторной комнатой отдыха. Каменка с жадеитом для легкого дыхания.',
    inclusions: [
      '2 свежих дубовых / березовых веника',
      'Эфирные масла сибирской сосны и мяты',
      'Банные простыни, тапочки и шапочки',
      'Чайник травяного чая с сушками',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    iconName: 'Flame',
  },
  {
    id: 'bbq_set',
    name: 'Премиальный мангальный набор',
    price: 900,
    duration: 'На все время отдыха',
    description: 'Все необходимое для приготовления сочного шашлыка и стейков на углях.',
    inclusions: [
      'Мешок березового угля (3 кг)',
      'Эко-жидкость для розжига и спички',
      'Набор шампуров из нержавейки + решетка гриль',
      'Веер для углей и прихватки',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    iconName: 'Flame',
  },
  {
    id: 'kazan_set',
    name: 'Казан 12л на костровой подставке',
    price: 700,
    duration: 'На все время отдыха',
    description: 'Чугунный узбекский казан с крышкой для приготовления ароматного плова, лагмана или ухи на живом огне.',
    inclusions: [
      'Чугунный казан 12 литров',
      'Специальная костровая подставка-очаг',
      'Шумовка и половник с деревянными ручками',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    iconName: 'Utensils',
  },
];
