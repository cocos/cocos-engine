import { ccclass, property } from '../core/data/class-decorator';
import { INode } from '../core/utils/interfaces';
import { CurveValueAdapter, ICurveValueProxy } from './animation-curve';

export type PropertyModifier = string;

export type ElementModifier = number;

export interface ICustomTargetModifier {
    get(target: any): any;
}

export type TargetModifier = PropertyModifier | ElementModifier | ICustomTargetModifier;

@ccclass('cc.HierachyModifier')
export class HierachyModifier implements ICustomTargetModifier {
    @property
    path: string = '';

    constructor (path?: string) {
        this.path = path || '';
    }

    get(target: INode) {
        return target.getChildByPath(this.path);
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
        return target.getComponent(this.component);
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
            switch (typeof modifier) {
            case 'string':
            case 'number':
                if (iModifier !== modifiers.length - 1 || valueAdapter) {
                    target = target[modifier];
                } else {
                    assignmentModifier = modifier;
                }
                break;
            default:
                target = modifier.get(target);
                break;
            }
        }

        if (assignmentModifier) {
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
