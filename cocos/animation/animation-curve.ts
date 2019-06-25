/**
 * @category animation
 */

import { ccclass, property } from '../core/data/class-decorator';
import { binarySearchEpsilon as binarySearch } from '../core/data/utils/binary-search';
import { error, errorID } from '../core/platform/CCDebug';
import { Quat, ValueType, Vec2, Vec3, Vec4 } from '../core/value-types';
import { ccenum } from '../core/value-types/enum';
import * as vmath from '../core/vmath';
import { PropertyBlendState } from './animation-blend-state';
import { bezierByTime, BezierControlPoints } from './bezier';
import * as blending from './blending';
import * as easing from './easing';
import { MotionPath, sampleMotionPaths } from './motion-path-helper';
import { ILerpable, isLerpable } from './types';

/**
 * 表示曲线值，曲线值可以是任意类型，但必须符合插值方式的要求。
 */
export type CurveValue = any;

/**
 * 表示曲线的目标对象。
 */
export type CurveTarget = Record<string, any>;

/**
 * If propertyBlendState.weight equals to zero, the propertyBlendState.value is dirty.
 * You shall handle this situation correctly.
 */
export type BlendFunction<T> = (value: T, weight: number, propertyBlendState: PropertyBlendState) => T;

/**
 * 内置帧时间渐变方式名称。
 */
export type EasingMethodName = keyof (typeof easing);

/**
 * 帧时间渐变方式。可能为内置帧时间渐变方式的名称或贝塞尔控制点。
 */
export type EasingMethod = EasingMethodName | BezierControlPoints;

type LerpFunction<T = any> = (from: T, to: T, t: number, dt: number) => T;

/**
 * 曲线数据。
 */
export interface IPropertyCurveData {
    /**
     * 曲线使用的时间轴。
     * @see {AnimationClip.keys}
     */
    keys: number;

    /**
     * 曲线值。曲线值的数量应和 `keys` 所引用时间轴的帧数相同。
     */
    values: CurveValue[];

    /**
     * 曲线任意两帧时间的渐变方式。仅当 `easingMethods === undefined` 时本字段才生效。
     */
    easingMethod?: EasingMethod;

    /**
     * 描述了每一帧时间到下一帧时间之间的渐变方式。
     */
    easingMethods?: EasingMethod[];

    /**
     * @private
     */
    motionPaths?: MotionPath | MotionPath[];

    /**
     * 是否进行插值。
     * @default true
     */
    interpolate?: boolean;
}

export class RatioSampler {
    public ratios: number[];

    private _findRatio: (ratios: number[], ratio: number) => number;

    constructor (ratios: number[]) {
        this.ratios = ratios;
        // If every piece of ratios are the same, we can use the quick function to find frame index.
        let currRatioDif;
        let lastRatioDif;
        let canOptimize = true;
        const EPSILON = 1e-6;
        for (let i = 1, l = ratios.length; i < l; i++) {
            currRatioDif = ratios[i] - ratios[i - 1];
            if (i === 1) {
                lastRatioDif = currRatioDif;
            }
            else if (Math.abs(currRatioDif - lastRatioDif) > EPSILON) {
                canOptimize = false;
                break;
            }
        }
        this._findRatio = canOptimize ? quickFindIndex : binarySearch;
    }

    public sample (ratio: number) {
        return this._findRatio(this.ratios, ratio);
    }
}

/**
 * 动画曲线。
 */
@ccclass('cc.AnimCurve')
export class AnimCurve {
    public static Linear = null;

    public static Bezier (controlPoints: number[]) {
        return controlPoints as BezierControlPoints;
    }

    @property
    public types?: Array<(EasingMethod | null)> = undefined;

    @property
    public type?: EasingMethod | null = null;

    public _blendFunction: BlendFunction<any> | undefined = undefined;

    /**
     * The values of the keyframes. (y)
     */
    @property
    private _values: CurveValue[] = [];

    /**
     * Lerp function used. If undefined, no lerp is performed.
     */
    private _lerp: undefined | ((from: any, to: any, t: number, dt: number) => any) = undefined;

    private _stepfiedValues?: any[];

    private _duration: number;

    constructor (propertyCurveData: IPropertyCurveData, propertyName: string, duration: number, isNode: boolean) {
        this._duration = duration;

        // Install values.
        this._values = propertyCurveData.values;

        const getCurveType = (easingMethod: EasingMethod) => {
            if (typeof easingMethod === 'string') {
                return easingMethod;
            } else if (Array.isArray(easingMethod)) {
                if (easingMethod[0] === easingMethod[1] &&
                    easingMethod[2] === easingMethod[3]) {
                    return AnimCurve.Linear;
                } else {
                    return AnimCurve.Bezier(easingMethod);
                }
            } else {
                return AnimCurve.Linear;
            }
        };
        if (propertyCurveData.easingMethod !== undefined) {
            this.type = getCurveType(propertyCurveData.easingMethod);
        } else if (propertyCurveData.easingMethods !== undefined) {
            this.types = propertyCurveData.easingMethods.map(getCurveType);
        } else {
            this.type = null;
        }

        const firstValue = propertyCurveData.values[0];

        const interpolate = propertyCurveData.interpolate === undefined ?
            true : propertyCurveData.interpolate;

        // Setup the lerp function.
        if (interpolate) {
            this._lerp = selectLerpFx(firstValue);
        }

        // Setup the blend function.
        if (isNode) {
            switch (propertyName) {
                case 'position':
                    this._blendFunction = blending.additive3D;
                    break;
                case 'scale':
                    this._blendFunction = blending.additive3D;
                    break;
                case 'rotation':
                    this._blendFunction = blending.additiveQuat;
                    break;
            }
        }
    }

    public hasLerp () {
        return !!this._lerp;
    }

    public valueAt (index: number) {
        const value = this._values[index];
        if (value && value.getNoLerp) {
            return value.getNoLerp();
        } else {
            return value;
        }
    }

    public valueBetween (ratio: number, from: number, fromRatio: number, to: number, toRatio: number) {
        // if (!this._stepfiedValues) {
        //     return this._sampleFromOriginal(ratio);
        // } else {
        //     const ratioStep = 1 / this._stepfiedValues.length;
        //     const i = Math.floor(ratio / ratioStep);
        //     return this._stepfiedValues[i];
        // }

        if (!this._lerp) {
            return this.valueAt(from);
        }

        const type = this.types ? this.types[from] : this.type;
        const dRatio = (toRatio - fromRatio);
        let ratioBetweenFrames = (ratio - fromRatio) / dRatio;
        if (type) {
            ratioBetweenFrames = computeRatioByType(ratioBetweenFrames, type);
        }
        const fromVal = this._values[from];
        const toVal = this._values[to];
        const value = this._lerp(fromVal, toVal, ratioBetweenFrames, dRatio * this._duration);
        return value;
    }

    // public stepfy (stepCount: number) {
    //     this._stepfiedValues = undefined;
    //     if (stepCount === 0) {
    //         return;
    //     }
    //     this._stepfiedValues = new Array(stepCount);
    //     const ratioStep = 1 / stepCount;
    //     let curRatio = 0;
    //     for (let i = 0; i < stepCount; ++i, curRatio += ratioStep) {
    //         const value = this._sampleFromOriginal(curRatio);
    //         this._stepfiedValues[i] = value instanceof ValueType ? value.clone() : value;
    //     }
    // }

    public empty () {
        return this._values.length === 0;
    }
}

export class EventInfo {
    public events: any[] = [];

    /**
     * @param func event function
     * @param params event params
     */
    public add (func: string, params: any[]) {
        this.events.push({
            func: func || '',
            params: params || [],
        });
    }
}

/**
 * Compute a new ratio by curve type.
 * @param ratio - The origin ratio
 * @param type - If it's Array, then ratio will be computed with bezierByTime.
 * If it's string, then ratio will be computed with cc.easing function
 */
export function computeRatioByType (ratio: number, type: EasingMethod) {
    if (typeof type === 'string') {
        const func = easing[type];
        if (func) {
            ratio = func(ratio);
        } else {
            errorID(3906, type);
        }
    } else if (Array.isArray(type)) {
        // bezier curve
        ratio = bezierByTime(type, ratio);
    }

    return ratio;
}

/**
 * Use this function if intervals between frames are same.
 */
function quickFindIndex (ratios: number[], ratio: number) {
    const length = ratios.length - 1;

    if (length === 0) { return 0; }

    const start = ratios[0];
    if (ratio < start) { return 0; }

    const end = ratios[length];
    if (ratio > end) { return length; }

    ratio = (ratio - start) / (end - start);

    const eachLength = 1 / length;
    const index = ratio / eachLength;
    const floorIndex = index | 0;
    const EPSILON = 1e-6;

    if ((index - floorIndex) < EPSILON) {
        return floorIndex;
    }
    else if ((floorIndex + 1 - index) < EPSILON) {
        return floorIndex + 1;
    }

    return ~(floorIndex + 1);
}

const selectLerpFx = (() => {
    function makeValueTypeLerpFx<T extends ValueType> (constructor: Constructor<T>) {
        const tempValue = new constructor();
        return (from: T, to: T, ratio: number) => {
            return from.lerp(to, ratio, tempValue);
        };
    }

    function callLerpable (from: ILerpable, to: ILerpable, t: number, dt: number): any {
        return from.lerp(to, t, dt);
    }

    const lerpNumber = vmath.lerp;

    return (value: any): LerpFunction<any> | undefined => {
        if (value === null) {
            return undefined;
        }
        if (typeof value === 'number') {
            return lerpNumber;
        } else if (typeof value === 'object' && value.constructor) {
            if (value instanceof ValueType) {
                return makeValueTypeLerpFx(value.constructor as typeof ValueType);
            } else if (value.constructor === Number) {
                return lerpNumber;
            } else if (isLerpable(value)) {
                return callLerpable;
            }
        }
        return undefined;
    };
})();
