import { ccclass, property } from '../core/data/class-decorator';
import { INode } from '../core/utils/interfaces';
import { CurveValueAdapter, ICurveValueProxy } from './animation-curve';
import { Node } from '../scene-graph';

export type PropertyModifier = string;

export type ElementModifier = number;

export interface ICustomTargetModifier {
    get(target: any): any;
}

export type TargetModifier = PropertyModifier | ElementModifier | ICustomTargetModifier;

export function isPropertyModifier(modifier: TargetModifier): modifier is PropertyModifier {
    return typeof modifier === 'string';
}
cc.isPropertyModifier = isPropertyModifier;

export function isElementModifier(modifier: TargetModifier): modifier is ElementModifier {
    return typeof modifier === 'number';
}
cc.isElementModifier = isElementModifier;

export function isCustomTargetModifier<T extends ICustomTargetModifier>(modifier: TargetModifier, constructor: Constructor<T>): modifier is T {
    return modifier instanceof constructor;
}
cc.isCustomTargetModifier = isCustomTargetModifier;

@ccclass('cc.HierachyModifier')
export class HierachyModifier implements ICustomTargetModifier {
    @property
    path: string = '';

    constructor (path?: string) {
        this.path = path || '';
    }

    get(target: INode) {
        if (!(target instanceof Node)) {
            throw new Error(`Target of hierachy modifier shall be Node.`);
        }
        const result = target.getChildByPath(this.path);
        if (!result) {
            throw new Error(`Node "${target.name}" has no path "${this.path}"`);
        }
        return result;
    }
}
cc.HierachyModifier = HierachyModifier;

@ccclass('cc.ComponentModifier')
export class ComponentModifier implements ICustomTargetModifier {
    @property
    component: string = '';

    constructor (component?: string) {
        this.component = component || '';
    }

    get (target: INode) {
        if (!(target instanceof Node)) {
            throw new Error(`Target of hierachy modifier shall be Node.`);
        }
        const result = target.getComponent(this.component);
        if (!result) {
            throw new Error(`Node "${target.name}" has no component "${this.component}"`);
        }
        return result;
    }
}
cc.ComponentModifier = ComponentModifier;

type AssignmentOrProxy = ICurveValueProxy | {
    object: any,
    propertyOrElement: PropertyModifier | ElementModifier,
};

export class BoundTarget {
    private _isProxy: boolean;
    private _assignmentOrProxy: AssignmentOrProxy;

    constructor (target: any, modifiers: TargetModifier[], valueAdapter?: CurveValueAdapter) {
        let assignmentModifier: PropertyModifier | ElementModifier | undefined;
        for (let iModifier = 0; iModifier < modifiers.length; ++iModifier) {
            const modifier = modifiers[iModifier];
            if (isElementModifier(modifier) || isPropertyModifier(modifier)) {
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

    setValue (value: any) {
        if (this._isProxy) {
            (this._assignmentOrProxy as ICurveValueProxy).set(value);
        } else {
            // @ts-ignore
            this._assignmentOrProxy.object[this._assignmentOrProxy.propertyOrElement] = value;
        }
    }
}
cc.BoundTarget = BoundTarget;