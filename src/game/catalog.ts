export type Category = 'shoes' | 'hat' | 't-shirt' | 'pants';

export interface Item {
  id: string;
  name: string;
  category: Category;
  price: number;
  textureKey: string;
  boostStep: number;
}

const CATEGORIES: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];
const ITEMS_PER_CATEGORY = 10;

const NAME_THEMES: Record<Category, string[]> = {
  'shoes': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Asics', 'New Balance', 'Converse', 'Vans', 'Saucony', 'Brooks'],
  'hat': ['Classic', 'Snapback', 'Beanie', 'Fedora', 'Bucket', 'Trucker', 'Baseball', 'Beret', 'Visor', 'Newsboy'],
  't-shirt': ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black', 'White', 'Gray'],
  'pants': ['Denim', 'Chino', 'Cargo', 'Linen', 'Cotton', 'Wool', 'Khaki', 'Twill', 'Corduroy', 'Silk']
};

function getFibonacciBonus(index: number): number {
  if (index === 0 || index === 1) return 1;
  let a = 1, b = 1;
  for (let i = 2; i <= index; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

function generateItems(category: Category): Item[] {
  const items: Item[] = [];
  const themes = NAME_THEMES[category];
  const usedNames = new Set<string>();

  for (let i = 0; i < ITEMS_PER_CATEGORY; i++) {
    const price = Math.floor(100 * Math.pow(2.5, i));
    let name = themes[i];
    
    // Ensure uniqueness by appending variant number if needed
    let uniqueName = name;
    let variant = 1;
    while (usedNames.has(uniqueName)) {
      uniqueName = `${name} ${variant}`;
      variant++;
    }
    usedNames.add(uniqueName);

    items.push({
      id: `${category}-${i}`,
      name: uniqueName,
      category,
      price,
      textureKey: `item-${category}-${i}`,
      boostStep: getFibonacciBonus(i)
    });
  }

  return items;
}

let cachedCatalog: Item[] | null = null;

export function getCatalog(): Item[] {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  const catalog: Item[] = [];
  for (const category of CATEGORIES) {
    catalog.push(...generateItems(category));
  }

  cachedCatalog = catalog;
  return catalog;
}

export function getCategoryItems(category: Category): Item[] {
  return getCatalog().filter((item) => item.category === category);
}
