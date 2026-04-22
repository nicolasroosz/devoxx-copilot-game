export interface GameRunState
{
    playerX: number;
    stepCount: number;
    lastStepIndex: number;
}

export interface SavedGameState extends GameRunState
{
    savedAt: string;
}

export interface RunStateBounds
{
    defaultPlayerX: number;
    minPlayerX: number;
    maxPlayerX: number;
    stepDistance: number;
}

function clamp(value: number, min: number, max: number): number
{
    return Math.min(Math.max(value, min), max);
}

export function createFreshRunState(defaultPlayerX: number, stepDistance: number): GameRunState
{
    return {
        playerX: defaultPlayerX,
        stepCount: 0,
        lastStepIndex: Math.floor(defaultPlayerX / stepDistance)
    };
}

export function hydrateRunState(snapshot: SavedGameState | null | undefined, bounds: RunStateBounds): GameRunState
{
    if (!snapshot)
    {
        return createFreshRunState(bounds.defaultPlayerX, bounds.stepDistance);
    }

    const playerX = clamp(snapshot.playerX, bounds.minPlayerX, bounds.maxPlayerX);
    const stepCount = Number.isFinite(snapshot.stepCount) ? Math.max(0, Math.floor(snapshot.stepCount)) : 0;
    const lastStepIndex = Number.isFinite(snapshot.lastStepIndex)
        ? Math.floor(snapshot.lastStepIndex)
        : Math.floor(playerX / bounds.stepDistance);

    return {
        playerX,
        stepCount,
        lastStepIndex
    };
}

export function createSavedGameState(runState: GameRunState, savedAt: string): SavedGameState
{
    return {
        playerX: runState.playerX,
        stepCount: runState.stepCount,
        lastStepIndex: runState.lastStepIndex,
        savedAt
    };
}