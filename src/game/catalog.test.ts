import { describe, it, expect } from 'vitest';
import { getCatalog, getCategoryItems, type Category, type Item } from './catalog';

describe('catalog', () => {
  describe('getCatalog', () => {
    it('should return exactly 40 items', () => {
      const catalog = getCatalog();
      expect(catalog).toHaveLength(40);
    });

    it('should return items with all required fields', () => {
      const catalog = getCatalog();
      catalog.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('textureKey');
      });
    });

    it('should have 10 items per category', () => {
      const catalog = getCatalog();
      const categories: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];

      categories.forEach((category) => {
        const items = catalog.filter((item) => item.category === category);
        expect(items).toHaveLength(10);
      });
    });

    it('should have deterministic and unique item IDs', () => {
      const catalog = getCatalog();
      const ids = catalog.map((item) => item.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(40);
      expect(ids).toEqual([...uniqueIds]);
    });

    it('should have deterministic IDs following pattern', () => {
      const catalog = getCatalog();
      const categories: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];

      categories.forEach((category) => {
        for (let i = 0; i < 10; i++) {
          const item = catalog.find((item) => item.id === `${category}-${i}`);
          expect(item).toBeDefined();
          expect(item?.category).toBe(category);
        }
      });
    });

    it('should have prices that are positive integers', () => {
      const catalog = getCatalog();
      catalog.forEach((item) => {
        expect(item.price).toBeGreaterThan(0);
        expect(Number.isInteger(item.price)).toBe(true);
      });
    });

    it('should have exponentially increasing prices within each category', () => {
      const catalog = getCatalog();
      const categories: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];

      categories.forEach((category) => {
        const categoryItems = catalog
          .filter((item) => item.category === category)
          .sort((a, b) => {
            const aIndex = parseInt(a.id.split('-')[1], 10);
            const bIndex = parseInt(b.id.split('-')[1], 10);
            return aIndex - bIndex;
          });

        for (let i = 1; i < categoryItems.length; i++) {
          expect(categoryItems[i].price).toBeGreaterThan(categoryItems[i - 1].price);
        }

        // Verify exponential formula: price = 100 * (2.5 ^ index)
        categoryItems.forEach((item, index) => {
          const expectedPrice = Math.floor(100 * Math.pow(2.5, index));
          expect(item.price).toBe(expectedPrice);
        });
      });
    });

    it('should have valid textureKeys following pattern', () => {
      const catalog = getCatalog();
      catalog.forEach((item) => {
        const itemIndex = parseInt(item.id.slice(item.id.lastIndexOf('-') + 1), 10);
        expect(item.textureKey).toBe(`item-${item.category}-${itemIndex}`);
      });
    });

    it('should be cached and return the same instance on subsequent calls', () => {
      const catalog1 = getCatalog();
      const catalog2 = getCatalog();
      expect(catalog1).toBe(catalog2);
    });
  });

  describe('getCategoryItems', () => {
    it('should return exactly 10 items for each category', () => {
      const categories: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];

      categories.forEach((category) => {
        const items = getCategoryItems(category);
        expect(items).toHaveLength(10);
      });
    });

    it('should return items with correct category', () => {
      const categories: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];

      categories.forEach((category) => {
        const items = getCategoryItems(category);
        items.forEach((item) => {
          expect(item.category).toBe(category);
        });
      });
    });

    it('should return items in deterministic order', () => {
      const shoes1 = getCategoryItems('shoes');
      const shoes2 = getCategoryItems('shoes');

      shoes1.forEach((item, index) => {
        expect(shoes2[index].id).toBe(item.id);
      });
    });

    it('should return items with valid structure', () => {
      const items = getCategoryItems('shoes');
      items.forEach((item: Item) => {
        expect(item.id).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.category).toBe('shoes');
        expect(item.price).toBeGreaterThan(0);
        expect(item.textureKey).toBeTruthy();
      });
    });
  });

  describe('item naming', () => {
    it('should have correctly formatted item names based on thematic themes', () => {
      const catalog = getCatalog();
      const categories: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];

      const nameThemes: Record<Category, string[]> = {
        'shoes': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Asics', 'New Balance', 'Converse', 'Vans', 'Saucony', 'Brooks'],
        'hat': ['Classic', 'Snapback', 'Beanie', 'Fedora', 'Bucket', 'Trucker', 'Baseball', 'Beret', 'Visor', 'Newsboy'],
        't-shirt': ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black', 'White', 'Gray'],
        'pants': ['Denim', 'Chino', 'Cargo', 'Linen', 'Cotton', 'Wool', 'Khaki', 'Twill', 'Corduroy', 'Silk']
      };

      categories.forEach((category) => {
        const items = getCategoryItems(category);
        const themes = nameThemes[category];
        items.forEach((item, index) => {
          expect(item.name).toBe(themes[index]);
        });
      });
    });

    it('should have boostStep values following Fibonacci sequence', () => {
      const catalog = getCatalog();
      const categories: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];

      categories.forEach((category) => {
        const items = getCategoryItems(category);
        const expectedFibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
        items.forEach((item, index) => {
          expect(item.boostStep).toBe(expectedFibonacci[index]);
        });
      });
    });
  });
});
