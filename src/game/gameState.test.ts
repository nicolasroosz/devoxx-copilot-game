import { describe, expect, it } from 'vitest';

import { createFreshRunState, createSavedGameState, hydrateRunState } from './gameState';

describe('gameState', () =>
{
    it('creates a fresh run state from the configured start position', () =>
    {
        expect(createFreshRunState(512, 48)).toEqual({
            playerX: 512,
            stepCount: 0,
            lastStepIndex: 10
        });
    });

    it('hydrates a saved run and clamps out-of-bounds positions', () =>
    {
        const hydrated = hydrateRunState({
            playerX: 8000,
            stepCount: 14,
            lastStepIndex: 167,
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
            lastStepIndex: 167
        });
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
            lastStepIndex: 13
        }, '2026-04-22T12:00:00.000Z')).toEqual({
            playerX: 640,
            stepCount: 7,
            lastStepIndex: 13,
            savedAt: '2026-04-22T12:00:00.000Z'
        });
    });
});