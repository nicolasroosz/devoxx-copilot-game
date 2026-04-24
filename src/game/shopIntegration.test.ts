import { describe, it, expect } from 'vitest';
import { createFreshRunState, createSavedGameState, hydrateRunState } from './gameState';
import {
  canAffordItem,
  deductSteps,
  purchaseItem,
  getAvailableItems,
  getOwnedItemsInCategory,
  getMostExpensiveOwnedItem
} from './purchase';
import { getCategoryItems } from './catalog';
import { saveToSlot, loadSaveSlot, getSaveSlotSummaries, StorageLike } from './saveSlots';

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe('shopIntegration', () => {
  describe('Catalog + Purchase flow', () => {
    it('buying an item decreases available items and increases owned items', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 1000;
      const category = 'shoes';

      const availableBefore = getAvailableItems(category, state);
      const ownedBefore = getOwnedItemsInCategory(category, state);

      expect(availableBefore).toHaveLength(10);
      expect(ownedBefore).toHaveLength(0);

      const itemToBuy = availableBefore[0];
      const result = purchaseItem(state, itemToBuy);

      expect(result.success).toBe(true);
      const newState = result.newRunState!;

      const availableAfter = getAvailableItems(category, newState);
      const ownedAfter = getOwnedItemsInCategory(category, newState);

      expect(availableAfter).toHaveLength(9);
      expect(ownedAfter).toHaveLength(1);
      expect(ownedAfter[0].id).toBe(itemToBuy.id);
    });

    it('after buying the most expensive shoes item, getAvailableItems has one fewer item', () => {
      const state = createFreshRunState(512, 48);
      // Use shoes-0 (price = 140) since other shoes items are too expensive
      state.stepCount = 200;
      const category = 'shoes';

      const allItems = getCategoryItems(category);
      const itemToBuy = allItems[0]; // shoes-0, price 140

      const availableBefore = getAvailableItems(category, state);
      expect(availableBefore).toContain(itemToBuy);

      const result = purchaseItem(state, itemToBuy);
      expect(result.success).toBe(true);

      const newState = result.newRunState!;
      const availableAfter = getAvailableItems(category, newState);

      expect(availableBefore.length - availableAfter.length).toBe(1);
      expect(availableAfter).not.toContain(itemToBuy);
    });

    it('after buying, getOwnedItemsInCategory includes the new item', () => {
      const state = createFreshRunState(512, 48);
      // hat-0: 100, hat-1: 3906, hat-2: 152587
      // Use hat-0 to be safe
      state.stepCount = 150;
      const category = 'hat';

      const items = getCategoryItems(category);
      const itemToBuy = items[0]; // hat-0, price 100

      const ownedBefore = getOwnedItemsInCategory(category, state);
      expect(ownedBefore).not.toContain(itemToBuy);

      const result = purchaseItem(state, itemToBuy);
      expect(result.success).toBe(true);

      const newState = result.newRunState!;
      const ownedAfter = getOwnedItemsInCategory(category, newState);

      expect(ownedAfter).toContain(itemToBuy);
    });
  });

  describe('Persistence + Hydration', () => {
    it('create a run state, buy items, save it to a slot, load it, and verify owned items are restored', () => {
      const storage = new MemoryStorage();
      const state = createFreshRunState(512, 48);
      state.stepCount = 1000;

      const shoesItems = getCategoryItems('shoes');
      const item1 = shoesItems[0];

      const result = purchaseItem(state, item1);
      expect(result.success).toBe(true);

      const updatedState = result.newRunState!;
      expect(updatedState.ownedItemIds).toContain(item1.id);

      const savedState = createSavedGameState(updatedState, '2026-04-22T12:00:00.000Z');
      saveToSlot(1, savedState, storage);

      const loadedSavedState = loadSaveSlot(1, storage);
      expect(loadedSavedState).not.toBeNull();

      const hydrated = hydrateRunState(loadedSavedState, {
        defaultPlayerX: 512,
        minPlayerX: 56,
        maxPlayerX: 4040,
        stepDistance: 48
      });

      expect(hydrated.ownedItemIds).toContain(item1.id);
      expect(hydrated.stepCount).toBe(1000 - item1.price);
    });

    it('multiple purchases: buy items from different categories, save, load, verify all are restored', () => {
      const storage = new MemoryStorage();
      let state = createFreshRunState(512, 48);
      state.stepCount = 10000;

      const shoesItem = getCategoryItems('shoes')[0];
      const hatItem = getCategoryItems('hat')[0];
      const tShirtItem = getCategoryItems('t-shirt')[0];

      let result = purchaseItem(state, shoesItem);
      expect(result.success).toBe(true);
      state = result.newRunState!;

      result = purchaseItem(state, hatItem);
      expect(result.success).toBe(true);
      state = result.newRunState!;

      result = purchaseItem(state, tShirtItem);
      expect(result.success).toBe(true);
      state = result.newRunState!;

      expect(state.ownedItemIds).toContain(shoesItem.id);
      expect(state.ownedItemIds).toContain(hatItem.id);
      expect(state.ownedItemIds).toContain(tShirtItem.id);

      const savedState = createSavedGameState(state, '2026-04-22T12:00:00.000Z');
      saveToSlot(1, savedState, storage);

      const loadedSavedState = loadSaveSlot(1, storage);
      expect(loadedSavedState?.ownedItemIds).toContain(shoesItem.id);
      expect(loadedSavedState?.ownedItemIds).toContain(hatItem.id);
      expect(loadedSavedState?.ownedItemIds).toContain(tShirtItem.id);

      const hydrated = hydrateRunState(loadedSavedState, {
        defaultPlayerX: 512,
        minPlayerX: 56,
        maxPlayerX: 4040,
        stepDistance: 48
      });

      expect(hydrated.ownedItemIds).toEqual(state.ownedItemIds);
    });
  });

  describe('Step deduction + Ownership', () => {
    it('buy shoes-1 for 350 steps, verify steps are deducted from 1000 to 650', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 1000;

      // shoes-1 costs 350 (itemIndex 1: floor(100 * 2.5^1 * 1.4))
      const items = getCategoryItems('shoes');
      const item350Steps = items[1];
      expect(item350Steps.price).toBe(350);

      const result = purchaseItem(state, item350Steps);
      expect(result.success).toBe(true);

      expect(result.newRunState!.stepCount).toBe(650);
    });

    it('cannot buy if not affordable: start with 300 steps, try to buy shoes-1 for 350, verify it fails and steps stay 300', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 300;

      // shoes-1 costs 350 (itemIndex 1: floor(100 * 2.5^1 * 1.4))
      const items = getCategoryItems('shoes');
      const item = items[1];
      expect(item.price).toBe(350);

      const result = purchaseItem(state, item);
      expect(result.success).toBe(false);
      expect(result.newRunState).toBeNull();
      expect(state.stepCount).toBe(300);
    });

    it('buy expensive item: 1000 steps, buy item for 1300, verify fail (not enough)', () => {
      const state = createFreshRunState(512, 48);
      state.stepCount = 1000;

      const items = getCategoryItems('shoes');
      const allItems = items;
      const expensiveItem = allItems[allItems.length - 1];

      expect(expensiveItem.price).toBeGreaterThan(1000);

      const result = purchaseItem(state, expensiveItem);
      expect(result.success).toBe(false);
      expect(state.stepCount).toBe(1000);
    });

    it('buy and deduct: 1000 steps, buy shoes-1 for 350, then hat-0 for 100, verify final is 550', () => {
      let state = createFreshRunState(512, 48);
      state.stepCount = 1000;

      // shoes-1 costs 350 (itemIndex 1: floor(100 * 2.5^1 * 1.4))
      const shoes = getCategoryItems('shoes');
      const item350 = shoes[1];
      expect(item350.price).toBe(350);

      let result = purchaseItem(state, item350);
      expect(result.success).toBe(true);
      state = result.newRunState!;
      expect(state.stepCount).toBe(1000 - 350); // 650

      // hat-0 costs 100 (itemIndex 0: floor(100 * 2.5^0 * 1.0))
      const hats = getCategoryItems('hat');
      const item100 = hats[0];
      expect(item100.price).toBe(100);

      result = purchaseItem(state, item100);
      expect(result.success).toBe(true);
      state = result.newRunState!;
      expect(state.stepCount).toBe(650 - 100); // 550
    });
  });

  describe('Inventory queries', () => {
    it('after buying items from each category, getMostExpensiveOwnedItem returns the highest-price item per category', () => {
      let state = createFreshRunState(512, 48);
      // Use affordable items: shoes-0 (140), hat-0 (100), t-shirt-0 (120)
      state.stepCount = 500;

      const shoesItem = getCategoryItems('shoes')[0]; // shoes-0, price 140
      const hatItem = getCategoryItems('hat')[0]; // hat-0, price 100
      const tShirtItem = getCategoryItems('t-shirt')[0]; // t-shirt-0, price 120

      let result = purchaseItem(state, shoesItem);
      expect(result.success).toBe(true);
      state = result.newRunState!;

      result = purchaseItem(state, hatItem);
      expect(result.success).toBe(true);
      state = result.newRunState!;

      result = purchaseItem(state, tShirtItem);
      expect(result.success).toBe(true);
      state = result.newRunState!;

      const mostExpensiveShoes = getMostExpensiveOwnedItem('shoes', state);
      const mostExpensiveHat = getMostExpensiveOwnedItem('hat', state);
      const mostExpensiveTShirt = getMostExpensiveOwnedItem('t-shirt', state);

      expect(mostExpensiveShoes?.id).toBe(shoesItem.id);
      expect(mostExpensiveHat?.id).toBe(hatItem.id);
      expect(mostExpensiveTShirt?.id).toBe(tShirtItem.id);
    });

    it('multiple items in one category: buy 3 shoes items, getMostExpensiveOwnedItem returns the priciest one', () => {
      let state = createFreshRunState(512, 48);
      // shoes-0: 140, shoes-1: 350, shoes-2: 875
      // With 400 steps, buy shoes-0 (140) and shoes-1 (350)
      state.stepCount = 500;

      const items = getCategoryItems('shoes');
      const item0 = items[0]; // shoes-0, price 140
      const item1 = items[1]; // shoes-1, price 350

      let result = purchaseItem(state, item0);
      expect(result.success).toBe(true);
      state = result.newRunState!;

      result = purchaseItem(state, item1);
      expect(result.success).toBe(true);
      state = result.newRunState!;

      const mostExpensive = getMostExpensiveOwnedItem('shoes', state);

      expect(mostExpensive?.id).toBe(item1.id);
      expect(mostExpensive!.price).toBe(350);
    });
  });

  describe('Save slot display remains unchanged', () => {
    it('save two runs: one with items, one without, getSaveSlotSummaries shows same display text regardless of owned items', () => {
      const storage = new MemoryStorage();

      const stateWithoutItems = createFreshRunState(512, 48);
      stateWithoutItems.stepCount = 100;
      stateWithoutItems.playerX = 640;

      const stateWithItems = createFreshRunState(512, 48);
      stateWithItems.stepCount = 100;
      stateWithItems.playerX = 640;
      stateWithItems.ownedItemIds = ['article-1', 'article-2', 'article-3'];

      const savedWithoutItems = createSavedGameState(stateWithoutItems, '2026-04-22T12:00:00.000Z');
      const savedWithItems = createSavedGameState(stateWithItems, '2026-04-22T12:00:00.000Z');

      saveToSlot(1, savedWithoutItems, storage);
      saveToSlot(2, savedWithItems, storage);

      const summaries = getSaveSlotSummaries('load', storage);

      expect(summaries[0].title).toBe('Slot 1 - 100 steps');
      expect(summaries[0].detail).toBe('X 640 | 2026-04-22T12:00:00.000Z');

      expect(summaries[1].title).toBe('Slot 2 - 100 steps');
      expect(summaries[1].detail).toBe('X 640 | 2026-04-22T12:00:00.000Z');
    });

    it('display should only show stepCount, playerX, savedAt (NOT owned items count)', () => {
      const storage = new MemoryStorage();

      const state1 = createFreshRunState(512, 48);
      state1.stepCount = 50;
      state1.playerX = 600;
      state1.ownedItemIds = [];

      const state2 = createFreshRunState(512, 48);
      state2.stepCount = 50;
      state2.playerX = 600;
      state2.ownedItemIds = ['item-1', 'item-2', 'item-3', 'item-4', 'item-5'];

      const saved1 = createSavedGameState(state1, '2026-04-20T10:00:00.000Z');
      const saved2 = createSavedGameState(state2, '2026-04-20T10:00:00.000Z');

      saveToSlot(1, saved1, storage);
      saveToSlot(2, saved2, storage);

      const summaries = getSaveSlotSummaries('load', storage);

      const summary1 = summaries.find((s) => s.id === 1)!;
      const summary2 = summaries.find((s) => s.id === 2)!;

      expect(summary1.title).toBe('Slot 1 - 50 steps');
      expect(summary2.title).toBe('Slot 2 - 50 steps');

      expect(summary1.title).not.toContain('0 items');
      expect(summary1.title).not.toContain('5 items');
      expect(summary2.title).not.toContain('5 items');

      expect(summary1.detail).toContain('X 600');
      expect(summary1.detail).toContain('2026-04-20T10:00:00.000Z');
      expect(summary2.detail).toContain('X 600');
      expect(summary2.detail).toContain('2026-04-20T10:00:00.000Z');
    });
  });
});
