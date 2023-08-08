import { Reflection, ReflectionKind, SerializeEvent } from "typedoc";

const TAG_ENGINE_INTERNAL = 'engineInternal'.toLowerCase();

export function cullEngineInternal (serializeOutput: SerializeEvent['output']): void {
    traverseObject(serializeOutput);
}

function hasTagEngineInternal (obj: Reflection): boolean {
    if (obj.comment?.tags) {
        for (const tagItem of obj.comment.tags) {
            // @ts-expect-error Property 'tag' does not exist on type 'CommentTag'.
            if (tagItem.tag === TAG_ENGINE_INTERNAL) {
                return true;
            }
        }
        return false;
    }
    return false;
}

function traverseObject (obj: Record<string, any>, recentGroups?: any[]): void {
    for (const key in obj) {
        if (key === 'groups') {
            continue;
        }
        const item = obj[key];
        if (typeof item === 'number' || typeof item === 'string' || typeof item === 'undefined') {
            continue;
        }
        if (Array.isArray(item)) {
            traverseArray(item, obj.groups ?? recentGroups);
        } else {
            traverseObject(item, obj.groups ?? recentGroups);
        }
    }
}

function traverseArray (arr: Array<any>, recentGroups?: any[]): void {
    for (let i = arr.length - 1; i >= 0; --i) {
        const item = arr[i];
        if (typeof item === 'number' || typeof item === 'string') {
            continue;
        }
        if (Array.isArray(item)) {
            traverseArray(item, recentGroups);
        } else {
            if (handleObject(item)) {
                const index = arr.indexOf(item);
                if (index > -1) {
                    arr.splice(index, 1);
                }
                if (recentGroups) {
                    const group = recentGroups.find((group: Record<string, any>) => group.kind === item.kind);
                    if (group) {
                        const groupChildIndex = group.children.indexOf(item.id);
                        if (groupChildIndex > -1) {
                            group.children.splice(groupChildIndex, 1);
                        }
                        if (group.children.length === 0) {
                            const groupIndex = recentGroups.findIndex((group: Record<string, any>) => group.kind === item.kind);
                            if (groupIndex > -1) {
                                recentGroups.splice(groupIndex, 1);
                            }
                        }
                    }
                }
            } else {
                traverseObject(item, recentGroups);
            }
        }
    }
}

function isReflection (obj: Record<string, any>): obj is Reflection {
    return typeof obj.kind !== 'undefined';
}

/**
 * @returns whether we need to remove the object from array
 */
function handleObject (obj: Record<string, any>): boolean {
    if (!isReflection(obj)) {
        return false;
    }
    switch(obj.kind) {
    case ReflectionKind.Namespace:
    case ReflectionKind.Enum:
    case ReflectionKind.EnumMember:
    case ReflectionKind.Variable:
    case ReflectionKind.Class:
    case ReflectionKind.Interface:
    case ReflectionKind.Constructor:
    case ReflectionKind.Property:
    case ReflectionKind.CallSignature:
    case ReflectionKind.IndexSignature:
    case ReflectionKind.ConstructorSignature:
    case ReflectionKind.TypeLiteral:
    case ReflectionKind.TypeAlias:
    case ReflectionKind.GetSignature:
    case ReflectionKind.SetSignature:
        return hasTagEngineInternal(obj);
    case ReflectionKind.Function:
    case ReflectionKind.Method:
        return handleFunctionOrMethod(obj);
    case ReflectionKind.Accessor:
        return handleAccessor(obj);
    default:
        return false;

    }
}

/**
 * @returns whether we need to remove the object from array
 */
function handleFunctionOrMethod (funcOrMethod: Record<string, any>): boolean {
    if (Array.isArray(funcOrMethod.signatures)) {
        traverseArray(funcOrMethod.signatures);
        if (funcOrMethod.signatures.length === 0) {
            return true;
        }
    }
    return false;
}

/**
 * @returns whether we need to remove the object from array
 */
function handleAccessor (accessor: Record<string, any>): boolean {
    let needRemove = true;
    if (Array.isArray(accessor.getSignature)) {
        traverseArray(accessor.getSignature);
        if (accessor.getSignature.length !== 0) {
            needRemove = false;
        }
    }
    if (Array.isArray(accessor.setSignature)) {
        traverseArray(accessor.setSignature);
        if (accessor.setSignature.length !== 0) {
            needRemove = false;
        }
    }
    return needRemove;
}

