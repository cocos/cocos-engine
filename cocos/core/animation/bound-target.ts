/**
 * @hidden
 */

import { Color, Vec2, Vec3, Vec4 } from '../math';
import { IValueProxy, IValueProxyFactory } from './value-proxy';
import { PropertyPath, TargetPath, isPropertyPath } from './target-path';
import { error } from '../platform/debug';

export interface IBoundTarget {
    setValue (value: any): void;
    getValue (): any;
}

export interface IBufferedTarget extends IBoundTarget {
    peek(): any;
    pull(): void;
    push(): void;
}

export function createBoundTarget (target: any, modifiers: TargetPath[], valueAdapter?: IValueProxyFactory): null | IBoundTarget {
    let ap: {
        isProxy: false;
        object: any;
        property: PropertyPath;
    } | {
        isProxy: true;
        proxy: IValueProxy;
    };
    let assignmentModifier: PropertyPath | undefined;
    for (let iModifier = 0; iModifier < modifiers.length; ++iModifier) {
        const modifier = modifiers[iModifier];
        if (isPropertyPath(modifier)) {
            if (iModifier !== modifiers.length - 1 || valueAdapter) {
                if (modifier in target) {
                    target = target[modifier];
                } else {
                    error(`Target object has no property "${modifier}"`);
                    return null;
                }
            } else {
                assignmentModifier = modifier;
            }
        } else {
            target = modifier.get(target);
            if (target === null) {
                return null;
            }
        }
    }

    if (assignmentModifier !== undefined) {
        ap = {
            isProxy: false,
            object: target,
            property: assignmentModifier,
        };
    } else if (valueAdapter) {
        ap = {
            isProxy: true,
            proxy: valueAdapter.forTarget(target),
        };
    } else {
        error(`Bad animation curve.`);
        return null;
    }

    return {
        setValue: (value) => {
            if (ap.isProxy) {
                ap.proxy.set(value);
            } else {
                ap.object[ap.property] = value;
            }
        },
        getValue: () => {
            if (ap.isProxy) {
                if (!ap.proxy.get) {
                    error(`Target doesn't provide a get method.`);
                    return null;
                } else {
                    return ap.proxy.get();
                }
            } else {
                return ap.object[ap.property];
            }
        },
    };
}

export function createBufferedTarget (target: any, modifiers: TargetPath[], valueAdapter?: IValueProxyFactory): null | IBufferedTarget {
    const boundTarget = createBoundTarget(target, modifiers, valueAdapter);
    if (boundTarget === null) {
        return null;
    }
    const value = boundTarget.getValue();
    const copyable = getBuiltinCopy(value);
    if (!copyable) {
        error(`Value is not copyable!`);
        return null;
    }
    const buffer = copyable.createBuffer();
    const copy = copyable.copy;
    return Object.assign(boundTarget, {
        peek: () => {
            return buffer;
        },
        pull: () => {
            const value = boundTarget.getValue();
            copy(buffer, value);
        },
        push: () => {
            boundTarget.setValue(buffer);
        },
    });
}

interface ICopyable {
    createBuffer: () => any;
    copy: (out: any, source: any) => any;
}

const getBuiltinCopy = (() => {
    const map = new Map<Constructor, ICopyable>();
    map.set(Vec2, { createBuffer: () => new Vec2(), copy: Vec2.copy});
    map.set(Vec3, { createBuffer: () => new Vec3(), copy: Vec3.copy});
    map.set(Vec4, { createBuffer: () => new Vec4(), copy: Vec4.copy});
    map.set(Color, { createBuffer: () => new Color(), copy: Color.copy});
    return (value: any) => {
        return map.get(value?.constructor);
    };
})();
