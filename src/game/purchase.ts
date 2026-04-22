import { GameRunState, addOwnedItem } from './gameState';
import { Item, Category, getCategoryItems } from './catalog';

export function canAffordItem(runState: GameRunState, itemPrice: number): boolean {
  return runState.stepCount >= itemPrice;
}

export function deductSteps(runState: GameRunState, amount: number): GameRunState {
  return {
    ...runState,
    stepCount: Math.max(0, runState.stepCount - amount)
  };
}

export function purchaseItem(
  runState: GameRunState,
  item: Item
): { success: boolean; newRunState: GameRunState | null; message: string } {
  if (runState.ownedItemIds.includes(item.id)) {
    return {
      success: false,
      newRunState: null,
      message: `You already own ${item.name}`
    };
  }

  if (!canAffordItem(runState, item.price)) {
    return {
      success: false,
      newRunState: null,
      message: `Not enough steps. Need ${item.price}, have ${runState.stepCount}`
    };
  }

  const stepsDeducted = deductSteps(runState, item.price);
  const withItem = addOwnedItem(stepsDeducted, item.id);

  return {
    success: true,
    newRunState: withItem,
    message: `Purchased ${item.name}`
  };
}

export function getAvailableItems(category: Category, runState: GameRunState): Item[] {
  const items = getCategoryItems(category);
  return items.filter((item) => !runState.ownedItemIds.includes(item.id));
}

export function getOwnedItemsInCategory(category: Category, runState: GameRunState): Item[] {
  const items = getCategoryItems(category);
  return items.filter((item) => runState.ownedItemIds.includes(item.id));
}

export function getMostExpensiveOwnedItem(category: Category, runState: GameRunState): Item | null {
  const ownedItems = getOwnedItemsInCategory(category, runState);
  if (ownedItems.length === 0) {
    return null;
  }
  return ownedItems.reduce((max, item) => (item.price > max.price ? item : max));
}

export function getCumulativeBonusForCategory(category: Category, runState: GameRunState): number {
  const ownedItems = getOwnedItemsInCategory(category, runState);
  return ownedItems.reduce((total, item) => total + item.boostStep, 0);
}

export function getTotalCumulativeBonus(runState: GameRunState): number {
  const categories: Category[] = ['shoes', 'hat', 't-shirt', 'pants'];
  return categories.reduce((total, category) => total + getCumulativeBonusForCategory(category, runState), 0);
}
