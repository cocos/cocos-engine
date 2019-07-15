/**
 * @category animation
 */

import { CurveTarget } from './animation-curve';
import { AnimCurveProperty } from './animation-state';
import { Node } from '../scene-graph';

// tslint:disable:interface-over-type-literal

export type PropertyBlendState<T = any> = {
    // name: string;
    property: AnimCurveProperty;
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

    public refPropertyBlendTarget (target: CurveTarget, property: AnimCurveProperty) {
        let targetState = this._blendTargets.find((x) => x.target === target);
        if (!targetState) {
            targetState = { target, properties: [] };
            this._blendTargets.push(targetState);
        }
        const propertyStates = targetState.properties;

        let propertyState = propertyStates.find((p) => p.property === property);
        if (!propertyState) {
            propertyState = { property, weight: 0, value: undefined, refCount: 0 };
            propertyStates.push(propertyState);
        }
        ++propertyState.refCount;
        return propertyState;
    }

    public derefPropertyBlendTarget (target: CurveTarget, property: AnimCurveProperty) {
        const iTargetState = this._blendTargets.findIndex((x) => x.target === target);
        if (iTargetState < 0) {
            return;
        }
        const targetState = this._blendTargets[iTargetState];

        const propertyStates = targetState.properties;
        const iPropertyState = propertyStates.findIndex((p) => p.property === property);
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
                    target[p.property] = p.value;

                    switch (p.property) {
                        case AnimCurveProperty.POSITION: {
                            if (target instanceof Node) {
                                target.setPosition(p.value);
                            } else {
                                (target as any).position = p.value;
                            }
                            break;
                        }
                        case AnimCurveProperty.ROTATION: {
                            if (target instanceof Node) {
                                target.setRotation(p.value);
                            } else {
                                (target as any).rotation = p.value;
                            }
                            break;
                        }
                        case AnimCurveProperty.SCALE: {
                            if (target instanceof Node) {
                                target.setScale(p.value);
                            } else {
                                (target as any).scale = p.value;
                            }
                            break;
                        }
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
