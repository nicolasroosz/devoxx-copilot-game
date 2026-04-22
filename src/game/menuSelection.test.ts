import { describe, expect, it } from 'vitest';

import { getInitialSelectionIndex, isSelectionEnabled, moveSelection } from './menuSelection';

describe('menuSelection', () =>
{
    it('picks the first enabled item when the preferred item is disabled', () =>
    {
        expect(getInitialSelectionIndex([
            { disabled: true },
            { disabled: true },
            { disabled: false },
            { disabled: false }
        ], 0)).toBe(2);
    });

    it('wraps and skips disabled options while moving through the menu', () =>
    {
        const options = [
            { disabled: false },
            { disabled: true },
            { disabled: false },
            { disabled: false }
        ];

        expect(moveSelection(options, 0, 'next')).toBe(2);
        expect(moveSelection(options, 2, 'previous')).toBe(0);
        expect(moveSelection(options, 3, 'next')).toBe(0);
    });

    it('reports whether the current selection is actionable', () =>
    {
        expect(isSelectionEnabled([{ disabled: false }, { disabled: true }], 0)).toBe(true);
        expect(isSelectionEnabled([{ disabled: false }, { disabled: true }], 1)).toBe(false);
        expect(isSelectionEnabled([{ disabled: false }], 3)).toBe(false);
    });
});