import { describe, expect, it } from 'vitest';

import { addOwnedItem, createFreshRunState, createSavedGameState, hydrateRunState } from './gameState';

describe('gameState', () =>
{
    it('creates a fresh run state from the configured start position', () =>
    {
        expect(createFreshRunState(512, 48)).toEqual({
            playerX: 512,
            stepCount: 0,
            lastStepIndex: 10,
            ownedItemIds: []
        });
    });

    it('fresh run state starts with empty owned items', () =>
    {
        const state = createFreshRunState(512, 48);
        expect(state.ownedItemIds).toEqual([]);
    });

    it('hydrates a saved run and clamps out-of-bounds positions', () =>
    {
        const hydrated = hydrateRunState({
            playerX: 8000,
            stepCount: 14,
            lastStepIndex: 167,
            ownedItemIds: ['item-1', 'item-2'],
            savedAt: '2026-04-22T12:00:00.000Z'
        }, {
            defaultPlayerX: 512,
            minPlayerX: 56,
            maxPlayerX: 4040,
            stepDistance: 48
        });

        expect(hydrated).toEqual({
            playerX: 4040,
            stepCount: 14,
            lastStepIndex: 167,
            ownedItemIds: ['item-1', 'item-2']
        });
    });

    it('hydrates a save with no ownedItemIds field defaults to []', () =>
    {
        const hydrated = hydrateRunState({
            playerX: 512,
            stepCount: 7,
            lastStepIndex: 10,
            savedAt: '2026-04-22T12:00:00.000Z'
        } as any, {
            defaultPlayerX: 512,
            minPlayerX: 56,
            maxPlayerX: 4040,
            stepDistance: 48
        });

        expect(hydrated.ownedItemIds).toEqual([]);
    });

    it('hydrates a save with ownedItemIds restores them correctly', () =>
    {
        const hydrated = hydrateRunState({
            playerX: 640,
            stepCount: 7,
            lastStepIndex: 13,
            ownedItemIds: ['article-42', 'article-99'],
            savedAt: '2026-04-22T12:00:00.000Z'
        }, {
            defaultPlayerX: 512,
            minPlayerX: 56,
            maxPlayerX: 4040,
            stepDistance: 48
        });

        expect(hydrated.ownedItemIds).toEqual(['article-42', 'article-99']);
    });

    it('falls back to a fresh run when no saved state is provided', () =>
    {
        expect(hydrateRunState(null, {
            defaultPlayerX: 512,
            minPlayerX: 56,
            maxPlayerX: 4040,
            stepDistance: 48
        })).toEqual(createFreshRunState(512, 48));
    });

    it('creates a persisted snapshot from the live run state', () =>
    {
        expect(createSavedGameState({
            playerX: 640,
            stepCount: 7,
            lastStepIndex: 13,
            ownedItemIds: []
        }, '2026-04-22T12:00:00.000Z')).toEqual({
            playerX: 640,
            stepCount: 7,
            lastStepIndex: 13,
            ownedItemIds: [],
            savedAt: '2026-04-22T12:00:00.000Z'
        });
    });

    it('createSavedGameState includes ownedItemIds in the snapshot', () =>
    {
        const snapshot = createSavedGameState({
            playerX: 640,
            stepCount: 7,
            lastStepIndex: 13,
            ownedItemIds: ['article-1', 'article-5']
        }, '2026-04-22T12:00:00.000Z');

        expect(snapshot.ownedItemIds).toEqual(['article-1', 'article-5']);
    });

    it('addOwnedItem correctly adds an item to the owned list', () =>
    {
        const state = createFreshRunState(512, 48);
        const updated = addOwnedItem(state, 'article-42');

        expect(updated.ownedItemIds).toEqual(['article-42']);
        expect(state.ownedItemIds).toEqual([]);
    });

    it('addOwnedItem preserves other state properties', () =>
    {
        const state = {
            playerX: 640,
            stepCount: 7,
            lastStepIndex: 13,
            ownedItemIds: []
        };
        const updated = addOwnedItem(state, 'article-99');

        expect(updated).toEqual({
            playerX: 640,
            stepCount: 7,
            lastStepIndex: 13,
            ownedItemIds: ['article-99']
        });
    });
});