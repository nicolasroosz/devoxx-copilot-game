import { describe, expect, it } from 'vitest';

import { createHomeMenuOptions, createLoadMenuOptions, createPauseMenuOptions, createSaveMenuOptions, createDeleteConfirmOptions } from './menuModel';

describe('menuModel', () =>
{
    it('creates the expected home and pause menu actions', () =>
    {
        expect(createHomeMenuOptions().map((option) => option.action)).toEqual(['start-new', 'open-load']);
        expect(createPauseMenuOptions().map((option) => option.action)).toEqual(['resume', 'open-save', 'exit-run']);
    });

    it('marks empty load slots as disabled and keeps save slots enabled', () =>
    {
        const summaries = [
            { id: 1 as const, title: 'Slot 1 - 5 steps', detail: 'X 600 | saved', disabled: false, state: null },
            { id: 2 as const, title: 'Slot 2 - Empty', detail: 'No saved run available', disabled: true, state: null },
            { id: 3 as const, title: 'Slot 3 - Empty', detail: 'No saved run available', disabled: true, state: null }
        ];

        expect(createLoadMenuOptions(summaries).map((option) => option.disabled ?? false)).toEqual([false, true, true, false]);
        expect(createSaveMenuOptions(summaries).map((option) => option.disabled ?? false)).toEqual([false, false, false, false]);
    });

    it('sets deletable flag correctly for load menu based on slot occupancy', () =>
    {
        const summaries = [
            { id: 1 as const, title: 'Slot 1 - 5 steps', detail: 'X 600 | saved', disabled: false, state: { playerX: 600, stepCount: 5, lastStepIndex: 0, ownedItemIds: [], savedAt: '2024-01-01' } },
            { id: 2 as const, title: 'Slot 2 - Empty', detail: 'No saved run available', disabled: true, state: null },
            { id: 3 as const, title: 'Slot 3 - 10 steps', detail: 'X 1000 | saved', disabled: false, state: { playerX: 1000, stepCount: 10, lastStepIndex: 1, ownedItemIds: [], savedAt: '2024-01-02' } }
        ];

        const options = createLoadMenuOptions(summaries);
        const deletableFlags = options.slice(0, 3).map((option) => option.deletable);

        expect(deletableFlags).toEqual([true, false, true]);
    });

    it('createDeleteConfirmOptions returns exactly 2 options with delete and cancel actions', () =>
    {
        const slotSummary = {
            id: 1 as const,
            title: 'Slot 1 - 5 steps',
            detail: 'X 600 | saved',
            disabled: false,
            state: { playerX: 600, stepCount: 5, lastStepIndex: 0, ownedItemIds: [], savedAt: '2024-01-01' }
        };

        const options = createDeleteConfirmOptions(slotSummary);

        expect(options).toHaveLength(2);
        expect(options[0].action).toBe('delete-slot');
        expect(options[1].action).toBe('cancel-delete');
    });

    it('createDeleteConfirmOptions has descriptive labels and details', () =>
    {
        const slotSummary = {
            id: 2 as const,
            title: 'Slot 2 - Empty',
            detail: 'No saved run available',
            disabled: true,
            state: null
        };

        const options = createDeleteConfirmOptions(slotSummary);

        expect(options[0].label).toBe('Confirm Delete');
        expect(options[0].detail).toContain('cannot be undone');
        expect(options[0].detail).toContain('permanently deleted');
        expect(options[1].label).toBe('Cancel');
        expect(options[1].detail).toContain('load menu');
    });

    it('createDeleteConfirmOptions includes slotId in confirm delete option', () =>
    {
        const slotSummary = {
            id: 3 as const,
            title: 'Slot 3 - 10 steps',
            detail: 'X 1000 | saved',
            disabled: false,
            state: { playerX: 1000, stepCount: 10, lastStepIndex: 1, ownedItemIds: [], savedAt: '2024-01-02' }
        };

        const options = createDeleteConfirmOptions(slotSummary);

        expect(options[0].slotId).toBe(3);
        expect(options[1].slotId).toBeUndefined();
    });
});