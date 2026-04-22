export type PlayerFacing = 'left' | 'right';

export interface PlayerMovementInput
{
    leftPressed: boolean;
    rightPressed: boolean;
    speed: number;
    deltaMs: number;
    minX: number;
    maxX: number;
}

export interface PlayerMotionResult
{
    x: number;
    facing: PlayerFacing;
    isMoving: boolean;
}

export function resolvePlayerMotion(currentX: number, input: PlayerMovementInput): PlayerMotionResult
{
    const horizontalDirection = input.leftPressed === input.rightPressed ? 0 : input.rightPressed ? 1 : -1;
    const nextX = currentX + horizontalDirection * input.speed * (input.deltaMs / 1000);
    const clampedX = Math.min(Math.max(nextX, input.minX), input.maxX);

    return {
        x: clampedX,
        facing: horizontalDirection < 0 ? 'left' : 'right',
        isMoving: horizontalDirection !== 0
    };
}