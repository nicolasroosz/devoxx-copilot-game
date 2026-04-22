import { describe, it, expect } from 'vitest';
import { createFreshRunState, addOwnedItem } from '../gameState';
import { getMostExpensiveOwnedItem } from '../purchase';

describe('InventoryMenu', () => {
    it('should get the most expensive owned item in a category', () => {
        const runState = createFreshRunState(512, 48);
        const withShoe0 = addOwnedItem(runState, 'shoes-0');
        const withShoe3 = addOwnedItem(withShoe0, 'shoes-3');

        const mostExpensive = getMostExpensiveOwnedItem('shoes', withShoe3);

        expect(mostExpensive).toBeDefined();
        expect(mostExpensive?.id).toBe('shoes-3');
    });

    it('should return null for empty category', () => {
        const runState = createFreshRunState(512, 48);

        const mostExpensive = getMostExpensiveOwnedItem('shoes', runState);

        expect(mostExpensive).toBeNull();
    });

    it('should handle multiple items and find highest cost', () => {
        const runState = createFreshRunState(512, 48);
        const withShoe0 = addOwnedItem(runState, 'shoes-0');
        const withShoe1 = addOwnedItem(withShoe0, 'shoes-1');
        const withShoe5 = addOwnedItem(withShoe1, 'shoes-5');

        const mostExpensive = getMostExpensiveOwnedItem('shoes', withShoe5);

        expect(mostExpensive?.id).toBe('shoes-5');
        expect(mostExpensive?.price).toBe(759);
    });
});
