import { ccclass, property } from '../core/data/class-decorator';
import { INode } from '../core/utils/interfaces';
import { CurveValueAdapter, ICurveValueProxy } from './animation-curve';
import { Node } from '../scene-graph';

export type PropertyModifier = string;

export type ElementModifier = number;

export interface CustomTargetModifier {
    get (target: any): any;

    equals (other: this): boolean;
}

export type TargetModifier = PropertyModifier | ElementModifier | CustomTargetModifier;

export function isPropertyModifier (modifier: TargetModifier): modifier is PropertyModifier {
    return typeof modifier === 'string';
}
cc.isPropertyModifier = isPropertyModifier;

export function isElementModifier (modifier: TargetModifier): modifier is ElementModifier {
    return typeof modifier === 'number';
}
cc.isElementModifier = isElementModifier;

export function isCustomTargetModifier<T extends CustomTargetModifier> (modifier: TargetModifier, constructor: Constructor<T>): modifier is T {
    return modifier instanceof constructor;
}
cc.isCustomTargetModifier = isCustomTargetModifier;

@ccclass('cc.HierachyModifier')
export class HierachyModifier implements CustomTargetModifier {
    @property
    public path: string = '';

    constructor (path?: string) {
        this.path = path || '';
    }

    public get(target: INode) {
        if (!(target instanceof Node)) {
            throw new Error(`Target of hierachy modifier shall be Node.`);
        }
        const result = target.getChildByPath(this.path);
        if (!result) {
            throw new Error(`Node "${target.name}" has no path "${this.path}"`);
        }
        return result;
    }

    public equals (other: this) {
        return this.path === other.path;
    }
}
cc.HierachyModifier = HierachyModifier;

@ccclass('cc.ComponentModifier')
export class ComponentModifier implements CustomTargetModifier {
    @property
    public component: string = '';

    constructor (component?: string) {
        this.component = component || '';
    }

    public get (target: INode) {
        if (!(target instanceof Node)) {
            throw new Error(`Target of hierachy modifier shall be Node.`);
        }
        const result = target.getComponent(this.component);
        if (!result) {
            throw new Error(`Node "${target.name}" has no component "${this.component}"`);
        }
        return result;
    }

    public equals (other: this) {
        return this.component === other.component;
    }
}
cc.ComponentModifier = ComponentModifier;

/**
 * 返回两个目标修改器是否相等。
 * 两个目标修改器相等当切仅当：
 *  - 它们都是属性修改器且修改的属性值相同，或者
 *  - 它们都是元素修改器且修改相同索引的元素，或者
 *  - 它们是同一个自定义目标修改器，或者
 *  - 它们是同一类型的自定义目标修改器（`lhs.constructor === rhs.constructor`）且 `lhs.equals(rhs)` 返回 `true`。
 * @param lhs 相比较的目标修改器。
 * @param rhs 相比较的目标修改器。
 */
export function isEqualToTargetModifier (lhs: TargetModifier, rhs: TargetModifier) {
    if (lhs === rhs) {
        return true;
    } else if (lhs.constructor !== rhs.constructor || !lhs.constructor) {
        return false;
    } else {
        // @ts-ignore
        return lhs.equals(rhs);
    }
}

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