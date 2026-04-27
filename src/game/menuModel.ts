import { SaveSlotId, SaveSlotSummary } from './saveSlots';

export type MenuAction = 'start-new' | 'open-load' | 'load-slot' | 'return-home' | 'resume' | 'open-save' | 'save-slot' | 'exit-run' | 'return-pause' | 'delete-slot' | 'cancel-delete';

export interface MenuOption
{
    id: string;
    label: string;
    detail?: string;
    action: MenuAction;
    slotId?: SaveSlotId;
    disabled?: boolean;
    deletable?: boolean;
}

export function createHomeMenuOptions(): MenuOption[]
{
    return [
        {
            id: 'start',
            label: 'Start',
            detail: 'Begin a fresh run',
            action: 'start-new'
        },
        {
            id: 'load',
            label: 'Load',
            detail: 'Resume from one of 3 save slots',
            action: 'open-load'
        }
    ];
}

export function createLoadMenuOptions(summaries: SaveSlotSummary[]): MenuOption[]
{
    return [
        ...summaries.map((summary) => ({
            id: `load-slot-${summary.id}`,
            label: summary.title,
            detail: summary.detail,
            action: 'load-slot' as const,
            slotId: summary.id,
            disabled: summary.disabled,
            deletable: summary.state !== null
        })),
        {
            id: 'return-home',
            label: 'Return',
            detail: 'Back to the home screen',
            action: 'return-home'
        }
    ];
}

export function createPauseMenuOptions(): MenuOption[]
{
    return [
        {
            id: 'resume',
            label: 'Resume',
            detail: 'Return to the current run',
            action: 'resume'
        },
        {
            id: 'save',
            label: 'Save',
            detail: 'Choose a slot for the current run',
            action: 'open-save'
        },
        {
            id: 'exit',
            label: 'Exit',
            detail: 'Abandon unsaved progress and return home',
            action: 'exit-run'
        }
    ];
}

export function createSaveMenuOptions(summaries: SaveSlotSummary[]): MenuOption[]
{
    return [
        ...summaries.map((summary) => ({
            id: `save-slot-${summary.id}`,
            label: summary.title,
            detail: summary.detail,
            action: 'save-slot' as const,
            slotId: summary.id
        })),
        {
            id: 'return-pause',
            label: 'Return',
            detail: 'Back to the pause menu',
            action: 'return-pause'
        }
    ];
}

export function createDeleteConfirmOptions(slotSummary: SaveSlotSummary): MenuOption[]
{
    return [
        {
            id: 'confirm-delete',
            label: 'Confirm Delete',
            detail: 'This action cannot be undone. The save will be permanently deleted.',
            action: 'delete-slot',
            slotId: slotSummary.id
        },
        {
            id: 'cancel-delete',
            label: 'Cancel',
            detail: 'Return to the load menu without deleting',
            action: 'cancel-delete'
        }
    ];
}

export function formatMenuOptionText(option: MenuOption): string
{
    return option.detail ? `${option.label}\n${option.detail}` : option.label;
}