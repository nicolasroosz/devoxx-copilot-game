import { describe, expect, it } from 'vitest';
import { resolvePlayerMotion } from './playerMovement';

describe('resolvePlayerMotion', () =>
{
    it('moves right using elapsed time and preserves the previous facing when idle', () =>
    {
        const movingRight = resolvePlayerMotion(120, {
            leftPressed: false,
            rightPressed: true,
            speed: 260,
            deltaMs: 500,
            minX: 56,
            maxX: 968
        });

        const idle = resolvePlayerMotion(200, {
            leftPressed: false,
            rightPressed: false,
            speed: 260,
            deltaMs: 16,
            minX: 56,
            maxX: 968
        });

        expect(movingRight).toEqual({
            x: 250,
            facing: 'right',
            isMoving: true
        });
        expect(idle).toEqual({
            x: 200,
            facing: 'right',
            isMoving: false
        });
    });

    it('clamps motion to the supplied bounds and flips left when moving left', () =>
    {
        const result = resolvePlayerMotion(60, {
            leftPressed: true,
            rightPressed: false,
            speed: 260,
            deltaMs: 1000,
            minX: 56,
            maxX: 968
        });

        expect(result).toEqual({
            x: 56,
            facing: 'left',
            isMoving: true
        });
    });
});