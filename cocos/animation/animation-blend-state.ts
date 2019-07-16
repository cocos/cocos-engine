/**
 * @category animation
 */

import { Node } from '../scene-graph';
import { CurveTarget } from './animation-curve';

// tslint:disable:interface-over-type-literal

export type PropertyBlendState<T = any> = {
    name: string;
    weight: number;
    value?: T;
    refCount: number;
};

interface ITargetState {
    target: CurveTarget;
    properties: Array<PropertyBlendState<any>>;
}

export class AnimationBlendState {
    private _blendTargets: ITargetState[] = [];

    public refPropertyBlendTarget (target: CurveTarget, property: string) {
        let targetState = this._blendTargets.find((x) => x.target === target);
        if (!targetState) {
            targetState = { target, properties: [] };
            this._blendTargets.push(targetState);
        }
        const propertyStates = targetState.properties;

        let propertyState = propertyStates.find((p) => p.name === property);
        if (!propertyState) {
            propertyState = { name, weight: 0, value: undefined, refCount: 0 };
            propertyStates.push(propertyState);
        }
        ++propertyState.refCount;
        return propertyState;
    }

    public derefPropertyBlendTarget (target: CurveTarget, property: string) {
        const iTargetState = this._blendTargets.findIndex((x) => x.target === target);
        if (iTargetState < 0) {
            return;
        }
        const targetState = this._blendTargets[iTargetState];

        const propertyStates = targetState.properties;
        const iPropertyState = propertyStates.findIndex((p) => p.name === property);
        if (iPropertyState < 0) {
            return;
        }

        const propertyState = propertyStates[iPropertyState];
        --propertyState.refCount;
        if (propertyState.refCount > 0) {
            return;
        }

        if (propertyStates.length >= 2) {
            propertyStates.splice(iPropertyState, 1);
        } else {
            this._blendTargets.splice(iTargetState, 1);
        }
    }

    public apply () {
        for (const targetState of this._blendTargets) {
            const target = targetState.target;
            const propertyStates = targetState.properties;
            for (const p of propertyStates) {
                if (p.weight !== 0) {
                    if (target instanceof Node) {
                        if (p.name === 'position') {
                            target.setPosition(p.value);
                        } else if (p.name === 'rotation') {
                            target.setRotation(p.value);
                        } else {
                            target.setScale(p.value);
                        }
                    } else {
                        target[p.name] = p.value;
                    }
                }
            }
        }
    }

    public clear () {
        for (const targetState of this._blendTargets) {
            const propertyStates = targetState.properties;
            for (const p of propertyStates) {
                p.weight = 0;
            }
        }
    }
}
