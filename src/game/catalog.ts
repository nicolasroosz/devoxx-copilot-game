export type Category = 'shoes' | 'hat' | 't-shirt' | 'pants';

export interface Item {
  id: string;
  name: string;
  category: Category;
  price: number;
  textureKey: string;
}

const CATEGORIES: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];
const ITEMS_PER_CATEGORY = 10;

function generateItems(category: Category): Item[] {
  const items: Item[] = [];
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  for (let i = 0; i < ITEMS_PER_CATEGORY; i++) {
    const price = Math.floor(100 * Math.pow(1.5, i));
    items.push({
      id: `${category}-${i}`,
      name: `Item ${i + 1} ${categoryLabel}`,
      category,
      price,
      textureKey: `item-${category}-${i}`,
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
