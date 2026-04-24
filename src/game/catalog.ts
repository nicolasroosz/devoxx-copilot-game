export type Category = 'shoes' | 'hat' | 't-shirt' | 'pants';

export interface Item {
  id: string;
  name: string;
  category: Category;
  price: number;
  textureKey: string;
  boostStep: number;
}

const CATEGORIES_ORDERED: Category[] = ['hat', 't-shirt', 'shoes', 'pants'];
const ITEMS_PER_CATEGORY = 10;

const CATEGORY_BONUS_FACTORS: Record<Category, number> = {
  hat: 1.0,
  't-shirt': 1.1,
  shoes: 1.2,
  pants: 1.3,
};

const CATEGORY_PRICE_FACTORS: Record<Category, number> = {
  hat: 1.0,
  't-shirt': 1.2,
  shoes: 1.4,
  pants: 1.6,
};

const NAME_THEMES: Record<Category, string[]> = {
  'shoes': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Asics', 'New Balance', 'Converse', 'Vans', 'Saucony', 'Brooks'],
  'hat': ['Classic', 'Snapback', 'Beanie', 'Fedora', 'Bucket', 'Trucker', 'Baseball', 'Beret', 'Visor', 'Newsboy'],
  't-shirt': ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black', 'White', 'Gray'],
  'pants': ['Denim', 'Chino', 'Cargo', 'Linen', 'Cotton', 'Wool', 'Khaki', 'Twill', 'Corduroy', 'Silk']
};

function getFibonacciBonus(index: number): number {
  // Fibonacci sequence starting at 1, 2, 3, 5, 8...
  // This is the traditional Fibonacci but shifted by one position
  if (index === 0) return 1;
  if (index === 1) return 2;
  let a = 1, b = 2;
  for (let i = 2; i <= index; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

let cachedCatalog: Item[] | null = null;

export function getCatalog(): Item[] {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  const catalog: Item[] = [];

  // Generate items per category independently — no cross-category index
  for (const category of CATEGORIES_ORDERED) {
    for (let itemIndex = 0; itemIndex < ITEMS_PER_CATEGORY; itemIndex++) {
      const price = Math.floor(100 * Math.pow(2.5, itemIndex) * CATEGORY_PRICE_FACTORS[category]);
      const themes = NAME_THEMES[category];
      const name = themes[itemIndex];

      catalog.push({
        id: `${category}-${itemIndex}`,
        name,
        category,
        price,
        textureKey: `item-${category}-${itemIndex}`,
        boostStep: Math.round(getFibonacciBonus(itemIndex) * CATEGORY_BONUS_FACTORS[category])
      });
    }
  }

  cachedCatalog = catalog;
  return catalog;
}

export function getCategoryItems(category: Category): Item[] {
  return getCatalog().filter((item) => item.category === category);
}
