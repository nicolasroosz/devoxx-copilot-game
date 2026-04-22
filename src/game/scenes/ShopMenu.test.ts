import { describe, it, expect } from 'vitest';
import { createFreshRunState, addOwnedItem } from '../gameState';
import { getAvailableItems, purchaseItem, canAffordItem } from '../purchase';

describe('ShopMenu logic', () => {
  it('should get available items in a category', () => {
    const runState = createFreshRunState(512, 48);
    const availableShoes = getAvailableItems('shoes', runState);

    expect(availableShoes).toBeDefined();
    expect(availableShoes.length).toBe(10);
  });

  it('should filter out owned items from available items', () => {
    const runState = createFreshRunState(512, 48);
    const withShoe0 = addOwnedItem(runState, 'shoes-0');
    const availableShoes = getAvailableItems('shoes', withShoe0);

    expect(availableShoes.length).toBe(9);
    expect(availableShoes.find(item => item.id === 'shoes-0')).toBeUndefined();
  });

  it('should successfully purchase an affordable item', () => {
    const runState = createFreshRunState(512, 48);
    const withSteps = { ...runState, stepCount: 150 };
    const shoes0 = { id: 'shoes-0', name: 'Item 1 Shoes', category: 'shoes' as const, price: 100, textureKey: 'item-shoes-0' };

    const result = purchaseItem(withSteps, shoes0);

    expect(result.success).toBe(true);
    expect(result.newRunState).toBeDefined();
    expect(result.newRunState?.stepCount).toBe(50);
    expect(result.newRunState?.ownedItemIds).toContain('shoes-0');
  });

  it('should prevent purchasing an unaffordable item', () => {
    const runState = createFreshRunState(512, 48);
    const shoes0 = { id: 'shoes-0', name: 'Item 1 Shoes', category: 'shoes' as const, price: 100, textureKey: 'item-shoes-0' };

    const result = purchaseItem(runState, shoes0);

    expect(result.success).toBe(false);
    expect(result.newRunState).toBeNull();
  });

  it('should prevent re-purchasing an owned item', () => {
    const runState = createFreshRunState(512, 48);
    const withSteps = { ...runState, stepCount: 150 };
    const withShoe0 = addOwnedItem(withSteps, 'shoes-0');
    const shoes0 = { id: 'shoes-0', name: 'Item 1 Shoes', category: 'shoes' as const, price: 100, textureKey: 'item-shoes-0' };

    const result = purchaseItem(withShoe0, shoes0);

    expect(result.success).toBe(false);
    expect(result.message).toContain('already own');
  });

  it('should check affordability correctly', () => {
    const runState = createFreshRunState(512, 48);
    const withSteps = { ...runState, stepCount: 100 };

    expect(canAffordItem(runState, 100)).toBe(false);
    expect(canAffordItem(withSteps, 100)).toBe(true);
    expect(canAffordItem(withSteps, 101)).toBe(false);
  });
});

