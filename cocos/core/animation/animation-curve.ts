/**
 * @category animation
 */

import { binarySearchEpsilon as binarySearch } from '../data/utils/binary-search';
import { lerp, Quat } from '../math';
import { errorID } from '../platform/debug';
import { ValueType } from '../value-types';
import { bezierByTime, BezierControlPoints } from './bezier';
import * as easing from './easing';
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
 * 内置帧时间渐变方式名称。
 */
export type EasingMethodName = keyof (typeof easing);

/**
 * 帧时间渐变方式。可能为内置帧时间渐变方式的名称或贝塞尔控制点。
 */
export type EasingMethod = EasingMethodName | BezierControlPoints;

type LerpFunction<T = any> = (from: T, to: T, t: number, dt: number) => T;

type CompressedEasingMethods = Record<number, EasingMethod>;

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
    easingMethods?: EasingMethod[] | CompressedEasingMethods;

    /**
     * 是否进行插值。
     * @default true
     */
    interpolate?: boolean;

    /**
     * For internal usage only.
     */
    _arrayLength?: number;
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
cc.RatioSampler = RatioSampler;

/**
 * 动画曲线。
 */
export class AnimCurve {
    public static Linear = null;

    public static Bezier (controlPoints: number[]) {
        return controlPoints as BezierControlPoints;
    }

    public types?: Array<(EasingMethod | null)> = undefined;

    public type?: EasingMethod | null = null;

    /**
     * The values of the keyframes. (y)
     */
    private _values: CurveValue[] = [];

    /**
     * Lerp function used. If undefined, no lerp is performed.
     */
    private _lerp: undefined | ((from: any, to: any, t: number, dt: number) => any) = undefined;

    private _duration: number;

    private _array?: any[];

    constructor (propertyCurveData: Omit<IPropertyCurveData, 'keys'>, duration: number) {
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
        } else if (Array.isArray(propertyCurveData.easingMethods)) {
            this.types = propertyCurveData.easingMethods.map(getCurveType);
        } else if (propertyCurveData.easingMethods !== undefined) {
            this.types = new Array(this._values.length).fill(null);
            for (const index of Object.keys(propertyCurveData.easingMethods)) {
                this.types[index] = getCurveType(propertyCurveData.easingMethods[index]);
            }
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

        if (propertyCurveData._arrayLength !== undefined) {
            this._array = new Array(propertyCurveData._arrayLength);
        }
    }

    public hasLerp () {
        return !!this._lerp;
    }

    public valueAt (index: number) {
        if (this._array === undefined) {
            const value = this._values[index];
            if (value && value.getNoLerp) {
                return value.getNoLerp();
            } else {
                return value;
            }
        } else {
            for (let i = 0; i < this._array.length; ++i) {
                this._array[i] = this._values[this._array.length * index + i];
            }
            return this._array;
        }
    }

    public valueBetween (ratio: number, from: number, fromRatio: number, to: number, toRatio: number) {
        if (this._lerp) {
            const type = this.types ? this.types[from] : this.type;
            const dRatio = (toRatio - fromRatio);
            let ratioBetweenFrames = (ratio - fromRatio) / dRatio;
            if (type) {
                ratioBetweenFrames = computeRatioByType(ratioBetweenFrames, type);
            }

            if (this._array === undefined) {
                const fromVal = this._values[from];
                const toVal = this._values[to];
                const value = this._lerp(fromVal, toVal, ratioBetweenFrames, dRatio * this._duration);
                return value;
            } else {
                for (let i = 0; i < this._array.length; ++i) {
                    const fromVal = this._values[this._array.length *  from + i];
                    const toVal = this._values[this._array.length * to + i];
                    this._array[i] = this._lerp(fromVal, toVal, ratioBetweenFrames, dRatio * this._duration);
                }
                return this._array;
            }
        } else {
            if (this._array === undefined) {
                return this.valueAt(from);
            } else {
                for (let i = 0; i < this._array.length; ++i) {
                    this._array[i] = this._values[this._array.length *  from + i];
                }
                return this._array;
            }
        }
    }

    public empty () {
        return this._values.length === 0;
    }
}
cc.AnimCurve = AnimCurve;

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
 * 采样动画曲线。
 * @param curve 动画曲线。
 * @param sampler 采样器。
 * @param ratio 采样比率。
 */
export function sampleAnimationCurve (curve: AnimCurve, sampler: RatioSampler, ratio: number) {
    let index = sampler.sample(ratio);
    if (index < 0) {
        index = ~index;
        if (index <= 0) {
            index = 0;
        } else if (index >= sampler.ratios.length) {
            index = sampler.ratios.length - 1;
        } else {
            return curve.valueBetween(
                ratio, index - 1, sampler.ratios[index - 1], index, sampler.ratios[index]);
        }
    }
    return curve.valueAt(index);
}
cc.sampleAnimationCurve = sampleAnimationCurve;

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
            // @ts-ignore
            constructor.lerp(tempValue, from, to, ratio);
            return tempValue;
        };
    }

    function callLerpable (from: ILerpable, to: ILerpable, t: number, dt: number): any {
        return from.lerp(to, t, dt);
    }

    function makeQuatSlerpFx () {
        const tempValue = new Quat();
        return (from: Quat, to: Quat, t: number, dt: number) => {
            return Quat.slerp(tempValue, from, to, t);
        };
    }

    return (value: any): LerpFunction<any> | undefined => {
        if (value === null) {
            return undefined;
        }
        if (typeof value === 'number') {
            return lerp;
        } else if (typeof value === 'object' && value.constructor) {
            if (value instanceof Quat) {
                return makeQuatSlerpFx();
            } else if (value instanceof ValueType) {
                return makeValueTypeLerpFx(value.constructor as typeof ValueType);
            } else if (value.constructor === Number) {
                return lerp;
            } else if (isLerpable(value)) {
                return callLerpable;
            }
        }
        return undefined;
    };
})();
