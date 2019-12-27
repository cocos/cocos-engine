import { IValueProxy, IValueProxyFactory } from './value-proxy';
import { PropertyPath, isPropertyPath, TargetPath, CustomTargetPath } from './target-path';
import { Vec2, Vec4, Vec3, Color } from '../math';

export class BoundTarget {
    protected _ap: {
        isProxy: false;
        object: any,
        property: PropertyPath,
    } | {
        isProxy: true;
        proxy: IValueProxy;
    };

    constructor (target: any, modifiers: TargetPath[], valueAdapter?: IValueProxyFactory) {
        let assignmentModifier: PropertyPath | undefined;
        for (let iModifier = 0; iModifier < modifiers.length; ++iModifier) {
            const modifier = modifiers[iModifier];
            if (isPropertyPath(modifier)) {
                if (iModifier !== modifiers.length - 1 || valueAdapter) {
                    if (modifier in target) {
                        target = target[modifier];
                    } else {
                        throw new Error(`Target object has no property "${modifier}"`);
                    }
                } else {
                    assignmentModifier = modifier;
                }
            } else {
                target = modifier.get(target);
            }
        }

        if (assignmentModifier !== undefined) {
            this._ap = {
                isProxy: false,
                object: target,
                property: assignmentModifier,
            };
        } else if (valueAdapter) {
            this._ap = {
                isProxy: true,
                proxy: valueAdapter.forTarget(target),
            };
        } else {
            throw new Error(`Bad animation curve.`);
        }
    }

    public setValue (value: any) {
        if (this._ap.isProxy) {
            this._ap.proxy.set(value);
        } else {
            this._ap.object[this._ap.property] = value;
        }
    }

    protected getValue () {
        if (this._ap.isProxy) {
            if (!this._ap.proxy.get) {
                throw new Error(`Target doesn't provide a get method.`);
            } else {
                return this._ap.proxy.get();
            }
        } else {
            return this._ap.object[this._ap.property];
        }
    }
}

export class BufferedTarget extends BoundTarget {
    private _buffer: any;
    private _copy: (out: any, from: any) => void;

    constructor (target: any, modifiers: TargetPath[], valueAdapter?: IValueProxyFactory) {
        super(target, modifiers, valueAdapter);
        const value = this.getValue();
        const copyable = getBuiltinCopy(value);
        if (!copyable) {
            throw new Error(`Value is not copyable!`);
        }
        this._buffer = copyable.createBuffer();
        this._copy = copyable.copy;
    }

    public peek () {
        return this._buffer;
    }

    public pull () {
        const value = this.getValue();
        this._copy(this._buffer, value);
    }

    public push () {
        this.setValue(this._buffer);
    }
}
interface Copyable {
    createBuffer: () => any;
    copy: (out: any, source: any) => any;
}

const getBuiltinCopy = (() => {
    const map = new Map<Constructor, Copyable>();
    map.set(Vec2, { createBuffer: () => new Vec2(), copy: Vec2.copy});
    map.set(Vec3, { createBuffer: () => new Vec3(), copy: Vec3.copy});
    map.set(Vec4, { createBuffer: () => new Vec4(), copy: Vec4.copy});
    map.set(Color, { createBuffer: () => new Color(), copy: Color.copy});
    return (value: any) => {
        return map.get(value?.constructor);
    };
})();
