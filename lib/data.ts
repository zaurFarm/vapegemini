export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Одноразовые' | 'Pod-системы' | 'Жидкости' | 'Аксессуары';
  flavorProfile?: string;
  nicotine?: string;
  image: string;
  rating: number;
  reviews: number;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Aurora Pro Max - Манго Лед',
    description: 'Премиальная одноразовая электронная сигарета на 10000 затяжек с сетчатым испарителем. Вкус сочного манго с холодком.',
    price: 1490,
    category: 'Одноразовые',
    flavorProfile: 'Манго, Ледяной',
    nicotine: '5%',
    image: 'https://picsum.photos/seed/vape-mango/400/400',
    rating: 4.9,
    reviews: 128
  },
  {
    id: '1-2',
    name: 'Aurora Pro Max - Клубника Киви',
    description: 'Премиальная одноразовая электронная сигарета на 10000 затяжек. Сладкая клубника с кислинкой киви.',
    price: 1490,
    category: 'Одноразовые',
    flavorProfile: 'Клубника, Киви',
    nicotine: '5%',
    image: 'https://picsum.photos/seed/vape-straw/400/400',
    rating: 4.8,
    reviews: 95
  },
  {
    id: '1-3',
    name: 'Aurora Pro Max - Черника Мята',
    description: 'Премиальная одноразовая электронная сигарета на 10000 затяжек. Насыщенная черника с освежающей мятой.',
    price: 1490,
    category: 'Одноразовые',
    flavorProfile: 'Черника, Мятный',
    nicotine: '5%',
    image: 'https://picsum.photos/seed/vape-blue/400/400',
    rating: 4.7,
    reviews: 112
  },
  {
    id: '2',
    name: 'Nebula Pod System',
    description: 'Компактная pod-система с умным экраном, регулировкой мощности и батареей на 1000 мАч.',
    price: 2990,
    category: 'Pod-системы',
    image: 'https://picsum.photos/seed/vape2/400/400',
    rating: 4.8,
    reviews: 85
  },
  {
    id: '3',
    name: 'Midnight Berry Blend 30мл',
    description: 'Эксклюзивная жидкость на солевом никотине с глубоким вкусом лесных ягод и легким холодком.',
    price: 650,
    category: 'Жидкости',
    flavorProfile: 'Ягодный, Ледяной',
    nicotine: '35мг',
    image: 'https://picsum.photos/seed/vape3/400/400',
    rating: 4.9,
    reviews: 210
  },
  {
    id: '4',
    name: 'Zenith Crystal 8000 - Арбуз',
    description: 'Элегантное устройство в прозрачном корпусе с цифровым экраном. Сочный арбуз.',
    price: 1290,
    category: 'Одноразовые',
    flavorProfile: 'Арбуз, Сладкий',
    nicotine: '5%',
    image: 'https://picsum.photos/seed/vape4/400/400',
    rating: 4.7,
    reviews: 156
  },
  {
    id: '4-2',
    name: 'Zenith Crystal 8000 - Виноград',
    description: 'Элегантное устройство в прозрачном корпусе с цифровым экраном. Темный виноград.',
    price: 1290,
    category: 'Одноразовые',
    flavorProfile: 'Виноград, Сладкий',
    nicotine: '5%',
    image: 'https://picsum.photos/seed/vape-grape/400/400',
    rating: 4.6,
    reviews: 142
  },
  {
    id: '5',
    name: 'Golden Tobacco Reserve 60мл',
    description: 'Классический вкус дорогого табака с нотками карамели и ванили. Для истинных ценителей.',
    price: 890,
    category: 'Жидкости',
    flavorProfile: 'Табачный, Карамель',
    nicotine: '3мг',
    image: 'https://picsum.photos/seed/vape5/400/400',
    rating: 4.6,
    reviews: 92
  },
  {
    id: '6',
    name: 'VapeAI Leather Case',
    description: 'Премиальный кожаный чехол ручной работы для защиты вашего устройства.',
    price: 990,
    category: 'Аксессуары',
    image: 'https://picsum.photos/seed/vape6/400/400',
    rating: 5.0,
    reviews: 42
  },
  {
    id: '7',
    name: 'Mint Chill 5000',
    description: 'Освежающий мятный вкус с прохладным послевкусием. Долговечная одноразовая сигарета.',
    price: 890,
    category: 'Одноразовые',
    flavorProfile: 'Мятный, Ледяной',
    nicotine: '5%',
    image: 'https://picsum.photos/seed/vape7/400/400',
    rating: 4.3,
    reviews: 67
  },
  {
    id: '8',
    name: 'Vanilla Custard 100мл',
    description: 'Богатый и сливочный вкус ванильного заварного крема. Идеально для любителей десертов.',
    price: 950,
    category: 'Жидкости',
    flavorProfile: 'Десертный, Сливочный',
    nicotine: '6мг',
    image: 'https://picsum.photos/seed/vape8/400/400',
    rating: 4.8,
    reviews: 312
  }
];
