import { describe, expect, it } from 'vitest';

import { SavedGameState } from './gameState';
import { deleteFromSlot, getSaveSlotSummaries, loadSaveSlot, loadSaveSlots, saveToSlot, StorageLike } from './saveSlots';

class MemoryStorage implements StorageLike
{
    values = new Map<string, string>();

    getItem(key: string): string | null
    {
        return this.values.get(key) ?? null;
    }

    setItem(key: string, value: string): void
    {
        this.values.set(key, value);
    }
}

const sampleState: SavedGameState = {
    playerX: 640,
    stepCount: 11,
    lastStepIndex: 13,
    ownedItemIds: [],
    savedAt: '2026-04-22T12:00:00.000Z'
};

describe('saveSlots', () =>
{
    it('returns empty slots when storage is missing or malformed', () =>
    {
        const storage = new MemoryStorage();

        storage.setItem('devoxx-copilot-game.save-slots', '{bad json');

        expect(loadSaveSlots(storage)).toEqual({
            1: null,
            2: null,
            3: null
        });
    });

    it('saves and loads a slot without disturbing the others', () =>
    {
        const storage = new MemoryStorage();

        saveToSlot(2, sampleState, storage);
        saveToSlot(3, {
            ...sampleState,
            playerX: 900,
            stepCount: 20
        }, storage);

        expect(loadSaveSlot(2, storage)).toEqual(sampleState);
        expect(loadSaveSlot(3, storage)).toEqual({
            ...sampleState,
            playerX: 900,
            stepCount: 20
        });
        expect(loadSaveSlot(1, storage)).toBeNull();
    });

    it('saves and loads a state with owned items', () =>
    {
        const storage = new MemoryStorage();
        const stateWithItems: SavedGameState = {
            ...sampleState,
            ownedItemIds: ['article-1', 'article-5']
        };

        saveToSlot(1, stateWithItems, storage);

        const loaded = loadSaveSlot(1, storage);
        expect(loaded?.ownedItemIds).toEqual(['article-1', 'article-5']);
    });

    it('backward compatibility: old saves without ownedItemIds load as []', () =>
    {
        const storage = new MemoryStorage();
        const oldSaveData = {
            '1': {
                playerX: 640,
                stepCount: 11,
                lastStepIndex: 13,
                savedAt: '2026-04-22T12:00:00.000Z'
            },
            '2': null,
            '3': null
        };

        storage.setItem('devoxx-copilot-game.save-slots', JSON.stringify(oldSaveData));

        const loaded = loadSaveSlot(1, storage);
        expect(loaded?.ownedItemIds).toEqual([]);
    });

    it('builds load and save summaries with the expected empty-slot behavior', () =>
    {
        const storage = new MemoryStorage();

        saveToSlot(1, sampleState, storage);

        expect(getSaveSlotSummaries('load', storage)).toEqual([
            {
                id: 1,
                title: 'Slot 1 - 11 steps',
                detail: 'X 640 | 2026-04-22T12:00:00.000Z',
                disabled: false,
                state: sampleState
            },
            {
                id: 2,
                title: 'Slot 2 - Empty',
                detail: 'No saved run available',
                disabled: true,
                state: null
            },
            {
                id: 3,
                title: 'Slot 3 - Empty',
                detail: 'No saved run available',
                disabled: true,
                state: null
            }
        ]);

        expect(getSaveSlotSummaries('save', storage)[1]).toEqual({
            id: 2,
            title: 'Slot 2 - Empty',
            detail: 'Store the current run here',
            disabled: false,
            state: null
        });
    });

    it('save slot summaries display text remains unchanged regardless of owned items', () =>
    {
        const storage = new MemoryStorage();
        const stateWithItems: SavedGameState = {
            ...sampleState,
            ownedItemIds: ['article-1', 'article-2', 'article-3', 'article-4', 'article-5']
        };

        saveToSlot(1, stateWithItems, storage);

        const summaries = getSaveSlotSummaries('load', storage);
        expect(summaries[0].title).toBe('Slot 1 - 11 steps');
        expect(summaries[0].detail).toBe('X 640 | 2026-04-22T12:00:00.000Z');
    });

    it('deleting an occupied slot clears it', () =>
    {
        const storage = new MemoryStorage();

        saveToSlot(1, sampleState, storage);
        expect(loadSaveSlot(1, storage)).toEqual(sampleState);

        deleteFromSlot(1, storage);
        expect(loadSaveSlot(1, storage)).toBeNull();
    });

    it('deleting a slot does not affect other slots', () =>
    {
        const storage = new MemoryStorage();

        saveToSlot(1, sampleState, storage);
        saveToSlot(2, {
            ...sampleState,
            playerX: 800,
            stepCount: 15
        }, storage);
        saveToSlot(3, {
            ...sampleState,
            playerX: 1000,
            stepCount: 25
        }, storage);

        deleteFromSlot(2, storage);

        expect(loadSaveSlot(1, storage)).toEqual(sampleState);
        expect(loadSaveSlot(2, storage)).toBeNull();
        expect(loadSaveSlot(3, storage)).toEqual({
            ...sampleState,
            playerX: 1000,
            stepCount: 25
        });
    });

    it('deleting an empty slot is a no-op', () =>
    {
        const storage = new MemoryStorage();

        saveToSlot(1, sampleState, storage);

        deleteFromSlot(2, storage);

        expect(loadSaveSlot(1, storage)).toEqual(sampleState);
        expect(loadSaveSlot(2, storage)).toBeNull();
        expect(loadSaveSlot(3, storage)).toBeNull();
    });

    it('delete persists to storage', () =>
    {
        const storage = new MemoryStorage();

        saveToSlot(1, sampleState, storage);
        deleteFromSlot(1, storage);

        const slots = loadSaveSlots(storage);
        expect(slots[1]).toBeNull();
        expect(slots[2]).toBeNull();
        expect(slots[3]).toBeNull();
    });
});