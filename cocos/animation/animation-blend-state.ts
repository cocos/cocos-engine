import { ICurveTarget } from './animation-curve';

// tslint:disable:interface-over-type-literal

export type PropertyBlendState<T = any> = {
    name: string;
    weight: number;
    value?: T;
    refCount: number;
};

type PropertyStates = Array<PropertyBlendState<any>>;

const __animationBlendState = '__animationBlendState';

type InjectedCurveTarget = ICurveTarget & Record<typeof __animationBlendState, PropertyStates>;

export class AnimationBlendState {
    private _blendTargets = new Set<InjectedCurveTarget>();

    public refPropertyBlendTarget (target_: ICurveTarget, propertyName: string) {
        const target = target_ as InjectedCurveTarget;

        if (!this._blendTargets.has(target)) {
            this._blendTargets.add(target);
        }
        let propertyStates = target[__animationBlendState];
        if (propertyStates === undefined) {
            propertyStates = [];
            Object.defineProperty(target, __animationBlendState, { value: propertyStates, enumerable: false });
        }
        let propertyState = propertyStates.find((p) => p.name === propertyName);
        if (!propertyState) {
            propertyState = { name: propertyName, weight: 0, value: undefined, refCount: 0 };
            propertyStates.push(propertyState);
        }
        ++propertyState.refCount;
        return propertyState;
    }

    public derefPropertyBlendTarget (target_: ICurveTarget, propertyName: string) {
        const target = target_ as InjectedCurveTarget;

        if (!this._blendTargets.has(target)) {
            return;
        }

        const propertyStates = target[__animationBlendState];
        const iPropertyState = propertyStates.findIndex((p) => p.name === propertyName);
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
            delete target.__animationBlendState;
            this._blendTargets.delete(target);
        }
    }

    public apply () {
        this._blendTargets.forEach((target) => {
            const propertyStates = target.__animationBlendState;
            for (const p of propertyStates) {
                if (p.weight !== 0) {
                    target[p.name] = p.value;
                }
            }
        });
    }

    public clear () {
        this._blendTargets.forEach((target) => {
            const propertyStates = target.__animationBlendState;
            for (const p of propertyStates) {
                p.weight = 0;
            }
        });
    }
}
