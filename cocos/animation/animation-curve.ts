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

/**
 * 动画的插值方式。
 */
export enum AnimationInterpolation {
    /**
     * 曲线值之间进行线性插值。
     * 当使用此插值方式时，曲线值的类型必须为 `number`、`Number` 或继承自 `ValueType`。
     */
    Linear = 0,

    /**
     * 直接使用起始曲线值作为插值结果。
     */
    Step = 1,

    /**
     * 曲线值之间进行三次样条插值。
     * 当使用此插值方式时，曲线值的类型必须为 `ICubicSpline<T>`
     * 并且类型参数 `T` 必须为 `number`、`Number` 或继承自 `ValueType`。
     */
    CubicSpline = 2,

    /**
     * 使用自定义插值方式，插值结果为 `from.lerp.call(from, to, ratio)`，其中
     * `from` 为起始曲线值；`to` 为结束曲线值；`ratio` 表示插值比例，范围为 `(0,1)`。
     * 当使用此插值方式时，曲线值的类型必须为 `ILerpable`。
     */
    Custom = 3,
}
ccenum(AnimationInterpolation);
cc.AnimationInterpolation = AnimationInterpolation;

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
     * 曲线的插值方式。
     */
    interpolation?: AnimationInterpolation;
}

interface ICubicSplineValue<T> {
    inTangent: T;
    dataPoint: T;
    outTangent: T;
}

function fullfillInterpolationRequirement (interpolation: AnimationInterpolation, value: any) {
    const isNumberLikeOrValueType = (v: any) => {
        return typeof v === 'number' ||
            (typeof v === 'object' && v !== null &&
                (v instanceof Number || v instanceof ValueType));
    };
    switch (interpolation) {
        case AnimationInterpolation.Linear:
            return isNumberLikeOrValueType(value);
        case AnimationInterpolation.CubicSpline:
            return (typeof value === 'object' && value !== null) &&
                isNumberLikeOrValueType(value.inTangent) &&
                isNumberLikeOrValueType(value.outTangent) &&
                isNumberLikeOrValueType(value.dataPoint);
        case AnimationInterpolation.Custom:
            return isLerpable(value);
    }
    return true;
}

export class RatioSampler {
    public ratios: number[];

    private _lastSampleRatio: number = -1;

    private _lastSampleResult: number = 0;

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
        if (this._lastSampleRatio !== ratio) {
            this._lastSampleRatio = ratio;
            this._lastSampleResult = this._findRatio(this.ratios, ratio);
        }
        return this._lastSampleResult;
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

    /**
     * The keyframe ratio of the keyframe specified as a number between 0.0 and 1.0 inclusive. (x)
     * A null ratio indicates a zero or single frame curve.
     */
    public _ratioSampler: RatioSampler | null = null;

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
    private _lerp: LerpFunction | undefined = undefined;

    private _stepfiedValues?: any[];

    private _interpolation: AnimationInterpolation;

    constructor (propertyCurveData: IPropertyCurveData, propertyName: string, isNode: boolean, ratioSampler: RatioSampler | null) {
        this._ratioSampler = ratioSampler;

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

        // If no interpolation is explicit specified, deduce the interpolation.
        if (propertyCurveData.interpolation !== undefined) {
            this._interpolation = propertyCurveData.interpolation;
        } else {
            this._interpolation = deduceInterpolation(firstValue);
        }

        // Setup the lerp function.
        if (CC_DEV) {
            if (!this._values.every(
                (value) => fullfillInterpolationRequirement(this._interpolation, value))) {
                error(
                    `Curve values for which ` +
                    `${AnimationInterpolation[this._interpolation]} ` +
                     `is used do not satify the type requirements.`);
            }
        }
        switch (this._interpolation) {
            case AnimationInterpolation.Custom:
                this._lerp = customLerpFxInvoker;
                break;
            case AnimationInterpolation.Linear:
                this._lerp = selectLinearLerpFx(firstValue);
                break;
            case AnimationInterpolation.CubicSpline:
                this._lerp = selectCubicSplineLerpFx(firstValue);
                break;
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

    /**
     * @param ratio The normalized time specified as a number between 0.0 and 1.0 inclusive.
     */
    public sample (ratio: number): any {
        if (!this._stepfiedValues) {
            return this._sampleFromOriginal(ratio);
        } else {
            const ratioStep = 1 / this._stepfiedValues.length;
            const i = Math.floor(ratio / ratioStep);
            return this._stepfiedValues[i];
        }
    }

    public stepfy (stepCount: number) {
        this._stepfiedValues = undefined;
        if (stepCount === 0) {
            return;
        }
        this._stepfiedValues = new Array(stepCount);
        const ratioStep = 1 / stepCount;
        let curRatio = 0;
        for (let i = 0; i < stepCount; ++i, curRatio += ratioStep) {
            const value = this._sampleFromOriginal(curRatio);
            this._stepfiedValues[i] = value instanceof ValueType ? value.clone() : value;
        }
    }

    public empty () {
        return this._values.length === 0;
    }

    private _sampleFromOriginal (ratio: number) {
        const values = this._values;
        const frameCount = this._ratioSampler ?
            this._ratioSampler.ratios.length :
            this._values.length;
        if (frameCount === 0) {
            return;
        }

        // evaluate value
        let isLerped = false;
        let value: CurveValue;
        if (this._ratioSampler === null) {
            value = this._values[0];
        } else {
            let index = this._ratioSampler.sample(ratio);
            if (index >= 0) {
                value = values[index];
            } else {
                index = ~index;
                if (index <= 0) {
                    value = values[0];
                } else if (index >= frameCount) {
                    value = values[frameCount - 1];
                } else {
                    const fromVal = values[index - 1];
                    if (!this._lerp) {
                        value = fromVal;
                    } else {
                        const fromRatio = this._ratioSampler.ratios[index - 1];
                        const toRatio = this._ratioSampler.ratios[index];
                        const type = this.types ? this.types[index - 1] : this.type;
                        const dRatio = (toRatio - fromRatio);
                        let ratioBetweenFrames = (ratio - fromRatio) / dRatio;
                        if (type) {
                            ratioBetweenFrames = computeRatioByType(ratioBetweenFrames, type);
                        }
                        // calculate value
                        const toVal = values[index];
                        value = this._lerp(fromVal, toVal, ratioBetweenFrames, dRatio);
                        isLerped = true;
                    }
                }
            }
        }
        if (!isLerped) {
            if (this._interpolation === AnimationInterpolation.CubicSpline) {
                return value.dataPoint;
            }
        }
        return value;
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

function customLerpFxInvoker (from: ILerpable, to: ILerpable, t: number): any {
    return from.lerp(to, t);
}

/**
 * Try deduce interpolation method from curve's value.
 * @param value Any value in the curve.
 */
function deduceInterpolation (value: any): AnimationInterpolation {
    // If linear interpolation is valid, use it; or do not do interpolation.
    return selectLinearLerpFx(value) ? AnimationInterpolation.Linear : AnimationInterpolation.Step;
}

const selectLinearLerpFx = (() => {
    function makeValueTypeLerpFx<T extends ValueType> (constructor: Constructor<T>) {
        const tempValue = new constructor();
        return (from: T, to: T, ratio: number) => {
            return from.lerp(to, ratio, tempValue);
        };
    }

    const lerpNumber = vmath.lerp;

    const builtinLerpFxTable: Map<Object, LerpFunction> = new Map();
    builtinLerpFxTable.set(Number, lerpNumber);
    builtinLerpFxTable.set(Vec2, makeValueTypeLerpFx(Vec2));
    builtinLerpFxTable.set(Vec3, makeValueTypeLerpFx(Vec3));
    builtinLerpFxTable.set(Vec4, makeValueTypeLerpFx(Vec4));
    builtinLerpFxTable.set(Quat, makeValueTypeLerpFx(Quat));

    return (value: any): LerpFunction<any> | undefined => {
        if (value === null) {
            return undefined;
        }
        if (typeof value === 'number') {
            return lerpNumber;
        } else if (typeof value === 'object') {
            const result = builtinLerpFxTable.get(value.constructor);
            if (result) {
                return result;
            }
        }
        return undefined;
    };
})();

const selectCubicSplineLerpFx = (() => {
    type ScaleFx<T> = (out: T, v: T, s: number) => T;
    type ScaleAndAddFx<T> = (out: T, v1: T, v2: T, s: number) => T;
    function makeValueTypeLerpFx<T> (
        constructor: Constructor<T>,
        scaleFx: ScaleFx<T>,
        scaleAndAdd: ScaleAndAddFx<T>) {
        let tempValue = new constructor();
        let m0 = new constructor();
        let m1 = new constructor();
        return (from: ICubicSplineValue<T>, to: ICubicSplineValue<T>, t: number, dt: number) => {
            const p0 = from.dataPoint;
            const p1 = to.dataPoint;
            // dt => t_k+1 - t_k
            m0 = scaleFx(m0, from.outTangent, dt);
            m1 = scaleFx(m1, to.inTangent, dt);
            const t_3 = t * t * t;
            const t_2 = t * t;
            const f_0 = 2 * t_3 - 3 * t_2 + 1;
            const f_1 = t_3 - 2 * t_2 + t;
            const f_2 = -2 * t_3 + 3 * t_2;
            const f_3 = t_3 - t_2;
            tempValue = scaleFx(tempValue, p0, f_0);
            tempValue = scaleAndAdd(tempValue, tempValue, m0, f_1);
            tempValue = scaleAndAdd(tempValue, tempValue, p1, f_2);
            tempValue = scaleAndAdd(tempValue, tempValue, m1, f_3);
            return tempValue;
        };
    }

    const lerpNumber = (from: ICubicSplineValue<number>, to: ICubicSplineValue<number>, t: number, dt: number) => {
        const p0 = from.dataPoint;
        const p1 = to.dataPoint;
        // dt => t_k+1 - t_k
        const m0 = from.outTangent * dt;
        const m1 = to.inTangent * dt;
        const t_3 = t * t * t;
        const t_2 = t * t;
        const f_0 = 2 * t_3 - 3 * t_2 + 1;
        const f_1 = t_3 - 2 * t_2 + t;
        const f_2 = -2 * t_3 + 3 * t_2;
        const f_3 = t_3 - t_2;
        return p0 * f_0 + m0 * f_1 + p1 * f_2 + m1 * f_3;
    };

    const builtinLerpFxTable: Map<Object, LerpFunction> = new Map();
    builtinLerpFxTable.set(Number, lerpNumber);
    builtinLerpFxTable.set(Vec2, makeValueTypeLerpFx(Vec2, vmath.vec2.scale, vmath.vec2.scaleAndAdd));
    builtinLerpFxTable.set(Vec3, makeValueTypeLerpFx(Vec3, vmath.vec3.scale, vmath.vec3.scaleAndAdd));
    builtinLerpFxTable.set(Vec4, makeValueTypeLerpFx(Vec4, vmath.vec4.scale, vmath.vec4.scaleAndAdd));
    builtinLerpFxTable.set(Quat, makeValueTypeLerpFx(Quat, vmath.quat.scale, vmath.quat.scaleAndAdd));

    return (value: any): LerpFunction<any> | undefined => {
        if (value === null || !Reflect.has(value, 'dataPoint')) {
            return undefined;
        }
        const dataValue = value.dataPoint;
        if (typeof dataValue === 'number') {
            return lerpNumber;
        } else if (typeof dataValue === 'object') {
            const result = builtinLerpFxTable.get(dataValue.constructor);
            if (result) {
                return result;
            }
        }
        return undefined;
    };
})();
