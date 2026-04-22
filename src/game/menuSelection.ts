export interface SelectableOption
{
    disabled?: boolean;
}

export type SelectionDirection = 'next' | 'previous';

function normalizeIndex(index: number, length: number): number
{
    return ((index % length) + length) % length;
}

export function getInitialSelectionIndex(options: SelectableOption[], preferredIndex = 0): number
{
    if (options.length === 0)
    {
        return -1;
    }

    for (let offset = 0; offset < options.length; offset += 1)
    {
        const candidateIndex = normalizeIndex(preferredIndex + offset, options.length);

        if (!options[candidateIndex].disabled)
        {
            return candidateIndex;
        }
    }

    return -1;
}

export function moveSelection(options: SelectableOption[], currentIndex: number, direction: SelectionDirection): number
{
    if (options.length === 0)
    {
        return -1;
    }

    const step = direction === 'next' ? 1 : -1;
    const startIndex = currentIndex >= 0 ? currentIndex : getInitialSelectionIndex(options);

    if (startIndex < 0)
    {
        return -1;
    }

    for (let offset = 1; offset <= options.length; offset += 1)
    {
        const candidateIndex = normalizeIndex(startIndex + (step * offset), options.length);

        if (!options[candidateIndex].disabled)
        {
            return candidateIndex;
        }
    }

    return startIndex;
}

export function isSelectionEnabled(options: SelectableOption[], index: number): boolean
{
    return index >= 0 && index < options.length && !options[index].disabled;
}