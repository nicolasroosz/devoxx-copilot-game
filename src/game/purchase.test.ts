import { describe, expect, it } from 'vitest';

import { createFreshRunState } from './gameState';
import {
  canAffordItem,
  deductSteps,
  purchaseItem,
  getAvailableItems,
  getOwnedItemsInCategory,
  getMostExpensiveOwnedItem
} from './purchase';
import { getCategoryItems } from './catalog';

describe('purchase', () => {
  describe('canAffordItem', () => {
    it('returns true when stepCount >= itemPrice', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 100;

      expect(canAffordItem(state, 50)).toBe(true);
      expect(canAffordItem(state, 100)).toBe(true);
    });

    it('returns false when stepCount < itemPrice', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 50;

      expect(canAffordItem(state, 100)).toBe(false);
      expect(canAffordItem(state, 51)).toBe(false);
    });

    it('returns true when stepCount equals itemPrice (exact amount)', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 100;

      expect(canAffordItem(state, 100)).toBe(true);
    });

    it('returns false with zero steps', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 0;

      expect(canAffordItem(state, 1)).toBe(false);
    });
  });

  describe('deductSteps', () => {
    it('reduces stepCount by the specified amount', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 100;

      const result = deductSteps(state, 30);

      expect(result.stepCount).toBe(70);
    });

    it('clamps stepCount to 0 if deduction would go negative', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 50;

      const result = deductSteps(state, 100);

      expect(result.stepCount).toBe(0);
    });

    it('preserves other state properties', () => {
      const state = {
        playerX: 640,
        stepCount: 100,
        lastStepIndex: 13,
        ownedItemIds: ['item-1']
      };

      const result = deductSteps(state, 30);

      expect(result).toEqual({
        playerX: 640,
        stepCount: 70,
        lastStepIndex: 13,
        ownedItemIds: ['item-1']
      });
    });

    it('does not mutate the original state', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 100;

      deductSteps(state, 30);

      expect(state.stepCount).toBe(100);
    });
  });

  describe('purchaseItem', () => {
    it('returns success when affordable and not already owned', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 150;

      const items = getCategoryItems('shoes');
      const cheapItem = items[0]; // First item should be cheapest

      const result = purchaseItem(state, cheapItem);

      expect(result.success).toBe(true);
      expect(result.newRunState).not.toBeNull();
      expect(result.message).toContain(cheapItem.name);
    });

    it('updates owned list after successful purchase', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 150;

      const items = getCategoryItems('shoes');
      const item = items[0];

      const result = purchaseItem(state, item);

      expect(result.newRunState?.ownedItemIds).toContain(item.id);
    });

    it('deducts steps after successful purchase', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 150;

      const items = getCategoryItems('shoes');
      const item = items[0];

      const result = purchaseItem(state, item);

      expect(result.newRunState!.stepCount).toBe(150 - item.price);
    });

    it('returns failure when not affordable', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 10;

      const items = getCategoryItems('shoes');
      const item = items[9]; // Last item should be most expensive

      const result = purchaseItem(state, item);

      expect(result.success).toBe(false);
      expect(result.newRunState).toBeNull();
      expect(result.message).toContain('Not enough steps');
    });

    it('returns failure when item already owned', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 500;

      const items = getCategoryItems('shoes');
      const item = items[0];

      state.ownedItemIds = [item.id];

      const result = purchaseItem(state, item);

      expect(result.success).toBe(false);
      expect(result.newRunState).toBeNull();
      expect(result.message).toContain('already own');
    });

    it('does not change state when purchase fails due to affordability', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 10;
      state.ownedItemIds = ['item-pre-owned'];

      const items = getCategoryItems('shoes');
      const item = items[9];

      const result = purchaseItem(state, item);

      expect(result.success).toBe(false);
      expect(state.stepCount).toBe(10);
      expect(state.ownedItemIds).toEqual(['item-pre-owned']);
    });

    it('does not change state when purchase fails due to ownership', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 500;
      state.ownedItemIds = [];

      const items = getCategoryItems('shoes');
      const item = items[0];
      state.ownedItemIds = [item.id];

      const result = purchaseItem(state, item);

      expect(result.success).toBe(false);
      expect(state.stepCount).toBe(500);
    });

    it('succeeds when stepCount exactly equals item price', () => {
      const state = createFreshRunState(512, 48);

      const items = getCategoryItems('shoes');
      const item = items[0];
      state.stepCount = item.price;

      const result = purchaseItem(state, item);

      expect(result.success).toBe(true);
      expect(result.newRunState!.stepCount).toBe(0);
    });
  });

  describe('getAvailableItems', () => {
    it('returns all items when none are owned', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const available = getAvailableItems(category, state);
      const all = getCategoryItems(category);

      expect(available).toEqual(all);
    });

    it('filters out already-owned items', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const allItems = getCategoryItems(category);
      const itemToOwn = allItems[0];
      state.ownedItemIds = [itemToOwn.id];

      const available = getAvailableItems(category, state);

      expect(available).not.toContain(itemToOwn);
      expect(available.length).toBe(allItems.length - 1);
    });

    it('filters out multiple owned items', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const allItems = getCategoryItems(category);
      const owned = [allItems[0], allItems[3], allItems[7]];
      state.ownedItemIds = owned.map((item) => item.id);

      const available = getAvailableItems(category, state);

      expect(available.length).toBe(allItems.length - 3);
      owned.forEach((item) => {
        expect(available).not.toContain(item);
      });
    });

    it('returns correct items for different categories', () => {
      const state = createFreshRunState(512, 48);

      const shoesAvailable = getAvailableItems('shoes', state);
      const hatsAvailable = getAvailableItems('hat', state);

      const shoesAll = getCategoryItems('shoes');
      const hatsAll = getCategoryItems('hat');

      expect(shoesAvailable).toEqual(shoesAll);
      expect(hatsAvailable).toEqual(hatsAll);
    });
  });

  describe('getOwnedItemsInCategory', () => {
    it('returns empty array when no items owned', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const owned = getOwnedItemsInCategory(category, state);

      expect(owned).toEqual([]);
    });

    it('returns only owned items in the specified category', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const allItems = getCategoryItems(category);
      const itemToOwn = allItems[0];
      state.ownedItemIds = [itemToOwn.id];

      const owned = getOwnedItemsInCategory(category, state);

      expect(owned).toEqual([itemToOwn]);
    });

    it('returns multiple owned items in the category', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const allItems = getCategoryItems(category);
      const ownedItems = [allItems[1], allItems[4], allItems[8]];
      state.ownedItemIds = ownedItems.map((item) => item.id);

      const owned = getOwnedItemsInCategory(category, state);

      expect(owned).toEqual(ownedItems);
    });

    it('ignores owned items from other categories', () => {
      const state = createFreshRunState(512, 48);

      const shoesItems = getCategoryItems('shoes');
      const hatItems = getCategoryItems('hat');

      state.ownedItemIds = [shoesItems[0].id, hatItems[0].id];

      const ownedShoes = getOwnedItemsInCategory('shoes', state);

      expect(ownedShoes).toEqual([shoesItems[0]]);
      expect(ownedShoes).not.toContain(hatItems[0]);
    });
  });

  describe('getMostExpensiveOwnedItem', () => {
    it('returns null when no items owned in category', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const result = getMostExpensiveOwnedItem(category, state);

      expect(result).toBeNull();
    });

    it('returns the single owned item', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const allItems = getCategoryItems(category);
      const item = allItems[0];
      state.ownedItemIds = [item.id];

      const result = getMostExpensiveOwnedItem(category, state);

      expect(result).toEqual(item);
    });

    it('returns the most expensive among multiple owned items', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const allItems = getCategoryItems(category);
      const owned = [allItems[2], allItems[5], allItems[8]];
      state.ownedItemIds = owned.map((item) => item.id);

      const result = getMostExpensiveOwnedItem(category, state);

      expect(result).toEqual(allItems[8]); // Last item should be most expensive
      expect(result!.price).toBeGreaterThanOrEqual(owned[0].price);
      expect(result!.price).toBeGreaterThanOrEqual(owned[1].price);
    });

    it('ignores owned items from other categories', () => {
      const state = createFreshRunState(512, 48);

      const shoesItems = getCategoryItems('shoes');
      const hatItems = getCategoryItems('hat');

      state.ownedItemIds = [shoesItems[0].id, hatItems[9].id]; // hat item 9 is more expensive

      const result = getMostExpensiveOwnedItem('shoes', state);

      expect(result).toEqual(shoesItems[0]);
      expect(result).not.toEqual(hatItems[9]);
    });

    it('correctly identifies the most expensive when order is random', () => {
      const state = createFreshRunState(512, 48);
      const category = 'shoes';

      const allItems = getCategoryItems(category);
      const owned = [allItems[1], allItems[9], allItems[3]];
      state.ownedItemIds = owned.map((item) => item.id);

      const result = getMostExpensiveOwnedItem(category, state);

      expect(result).toEqual(allItems[9]); // Most expensive regardless of order
    });
  });
});
