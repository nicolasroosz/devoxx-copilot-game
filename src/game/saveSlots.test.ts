import { describe, expect, it } from 'vitest';

import { SavedGameState } from './gameState';
import { getSaveSlotSummaries, loadSaveSlot, loadSaveSlots, saveToSlot, StorageLike } from './saveSlots';

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
});