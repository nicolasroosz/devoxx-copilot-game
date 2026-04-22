import { describe, expect, it } from 'vitest';

import { APP_HELP_TEXT, APP_TITLE } from './appCopy';

describe('appCopy', () =>
{
    it('describes the menu and pause controls in the shell copy', () =>
    {
        expect(APP_TITLE).toBe('Save Runner Prototype');
        expect(APP_HELP_TEXT).toBe('Use Arrow keys and Enter in menus. During play: S for shop, I for inventory, Escape to pause.');
    });
});