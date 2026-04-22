import { describe, expect, it } from 'vitest';

import { createHomeMenuOptions, createLoadMenuOptions, createPauseMenuOptions, createSaveMenuOptions } from './menuModel';

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
});