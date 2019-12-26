import { IValueProxy, IValueProxyFactory } from './value-proxy';
import { PropertyPath, isPropertyPath, TargetPath } from './target-path';

export class BoundTarget {
    private _isProxy: boolean;
    private _assignmentOrProxy: AssignmentOrProxy;

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
            this._assignmentOrProxy = {
                object: target,
                propertyOrElement: assignmentModifier,
            };
            this._isProxy = false;
        } else if (valueAdapter) {
            this._assignmentOrProxy = valueAdapter.forTarget(target);
            this._isProxy = true;
        } else {
            throw new Error(`Bad animation curve.`);
        }
    }

    public setValue (value: any) {
        if (this._isProxy) {
            (this._assignmentOrProxy as IValueProxy).set(value);
        } else {
            // @ts-ignore
            this._assignmentOrProxy.object[this._assignmentOrProxy.propertyOrElement] = value;
        }
    }

    public getValue () {
        if (this._isProxy) {
            const proxy = this._assignmentOrProxy as IValueProxy;
            if (!proxy.get) {
                throw new Error(`Target doesn't provide a get method.`);
            } else {
                return proxy.get();
            }
        } else {
            // @ts-ignore
            return this._assignmentOrProxy.object[this._assignmentOrProxy.propertyOrElement];
        }
    }
}

type AssignmentOrProxy = IValueProxy | {
    object: any,
    propertyOrElement: PropertyPath,
};