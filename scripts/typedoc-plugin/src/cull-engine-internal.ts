import { SerializeEvent } from "typedoc";

const TAG_ENGINE_INTERNAL = 'engineInternal'.toLowerCase();

export function cullEngineInternal (serializeOutput: SerializeEvent['output']): void {
    handleObject(serializeOutput);
}

function hasTagEngineInternal (obj: Record<string, any>): boolean {
    if (obj.comment?.tags) {
        for (const tagItem of obj.comment.tags) {
            if (tagItem.tag === TAG_ENGINE_INTERNAL) {
                return true;
            }
        }
        return false;
    }
    return false;
}

function handleObject (obj: Record<string, any>): void {
    for (const key in obj) {
        const item = obj[key];
        if (typeof item === 'number' || typeof item === 'string' || typeof item === 'undefined') {
            continue;
        }
        if (Array.isArray(item)) {
            handleArray(item);
            if (item.length === 0) {
                obj[key] = undefined;
            }
        } else {
            handleObject(item);
        }
    }
}

function handleArray (arr: Array<any>): void {
    for (let i = arr.length - 1; i >= 0; --i) {
        const item = arr[i];
        if (typeof item === 'number' || typeof item === 'string') {
            continue;
        }
        if (Array.isArray(item)) {
            handleArray(arr);
        } else if (hasTagEngineInternal(item)) {
            arr.splice(i, 1);
        } else {
            handleObject(item);
        }
    }
}

