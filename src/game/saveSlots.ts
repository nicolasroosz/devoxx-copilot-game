import { SavedGameState } from './gameState';

export const SAVE_SLOT_IDS = [1, 2, 3] as const;
export type SaveSlotId = typeof SAVE_SLOT_IDS[number];

export interface SaveSlotSummary
{
    id: SaveSlotId;
    title: string;
    detail: string;
    disabled: boolean;
    state: SavedGameState | null;
}

export interface StorageLike
{
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}

export interface SaveSlotMap
{
    1: SavedGameState | null;
    2: SavedGameState | null;
    3: SavedGameState | null;
}

const STORAGE_KEY = 'devoxx-copilot-game.save-slots';

function createSaveSlotMap(): SaveSlotMap
{
    return {
        1: null,
        2: null,
        3: null
    };
}

function cloneSavedGameState(state: SavedGameState): SavedGameState
{
    return {
        playerX: state.playerX,
        stepCount: state.stepCount,
        lastStepIndex: state.lastStepIndex,
        ownedItemIds: state.ownedItemIds,
        savedAt: state.savedAt
    };
}

function isSavedGameState(value: unknown): value is SavedGameState
{
    if (typeof value !== 'object' || value === null)
    {
        return false;
    }

    const candidate = value as Partial<SavedGameState>;

    return Number.isFinite(candidate.playerX)
        && Number.isFinite(candidate.stepCount)
        && Number.isFinite(candidate.lastStepIndex)
        && typeof candidate.savedAt === 'string'
        && (candidate.ownedItemIds === undefined || Array.isArray(candidate.ownedItemIds));
}

function getBrowserStorage(): StorageLike | null
{
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined')
    {
        return null;
    }

    return window.localStorage;
}

function normalizeSaveSlotMap(value: unknown): SaveSlotMap
{
    const slots = createSaveSlotMap();

    if (typeof value !== 'object' || value === null)
    {
        return slots;
    }

    for (const slotId of SAVE_SLOT_IDS)
    {
        const slotValue = (value as Record<string, unknown>)[String(slotId)];

        if (isSavedGameState(slotValue))
        {
            const cloned = cloneSavedGameState(slotValue);
            if (!cloned.ownedItemIds)
            {
                cloned.ownedItemIds = [];
            }
            slots[slotId] = cloned;
        }
    }

    return slots;
}

function writeSaveSlotMap(slots: SaveSlotMap, storage: StorageLike | null): void
{
    storage?.setItem(STORAGE_KEY, JSON.stringify(slots));
}

export function loadSaveSlots(storage: StorageLike | null = getBrowserStorage()): SaveSlotMap
{
    const rawValue = storage?.getItem(STORAGE_KEY);

    if (!rawValue)
    {
        return createSaveSlotMap();
    }

    try
    {
        return normalizeSaveSlotMap(JSON.parse(rawValue));
    }
    catch
    {
        return createSaveSlotMap();
    }
}

export function loadSaveSlot(slotId: SaveSlotId, storage: StorageLike | null = getBrowserStorage()): SavedGameState | null
{
    const state = loadSaveSlots(storage)[slotId];

    return state ? cloneSavedGameState(state) : null;
}

export function saveToSlot(slotId: SaveSlotId, state: SavedGameState, storage: StorageLike | null = getBrowserStorage()): SaveSlotMap
{
    const slots = loadSaveSlots(storage);

    slots[slotId] = cloneSavedGameState(state);
    writeSaveSlotMap(slots, storage);

    return slots;
}

export function getSaveSlotSummaries(mode: 'load' | 'save', storage: StorageLike | null = getBrowserStorage()): SaveSlotSummary[]
{
    const slots = loadSaveSlots(storage);

    return SAVE_SLOT_IDS.map((slotId) => {
        const state = slots[slotId];

        if (!state)
        {
            return {
                id: slotId,
                title: `Slot ${slotId} - Empty`,
                detail: mode === 'load' ? 'No saved run available' : 'Store the current run here',
                disabled: mode === 'load',
                state: null
            };
        }

        return {
            id: slotId,
            title: `Slot ${slotId} - ${state.stepCount} steps`,
            detail: `X ${Math.round(state.playerX)} | ${state.savedAt}`,
            disabled: false,
            state: cloneSavedGameState(state)
        };
    });
}