import { TargetPath } from './target-path';
import { IValueProxyFactory } from './value-proxy';
import * as easing from './easing';
import { BezierControlPoints } from './bezier';
import { CompactValueTypeArray } from '../data/utils/compact-value-type-array';
import { serializable } from '../data/decorators';
import { AnimCurve, RatioSampler } from './animation-curve';
import { RealCurve, RealInterpMode, TangentWeightMode } from '../curves';
import { assertIsTrue } from '../data/utils/asserts';

/**
 * 表示曲线值，曲线值可以是任意类型，但必须符合插值方式的要求。
 */
export type LegacyCurveValue = any;

/**
 * 表示曲线的目标对象。
 */
export type LegacyCurveTarget = Record<string, any>;

/**
 * 内置帧时间渐变方式名称。
 */
export type LegacyEasingMethodName = keyof (typeof easing);

/**
 * 帧时间渐变方式。可能为内置帧时间渐变方式的名称或贝塞尔控制点。
 */
export type LegacyEasingMethod = LegacyEasingMethodName | BezierControlPoints;

export type LegacyCompressedEasingMethods = Record<number, LegacyEasingMethod>;

export type LegacyLerpFunction<T = any> = (from: T, to: T, t: number, dt: number) => T;

export interface LegacyClipCurveData {
    /**
     * 曲线使用的时间轴。
     * @see {AnimationClip.keys}
     */
    keys: number;

    /**
     * 曲线值。曲线值的数量应和 `keys` 所引用时间轴的帧数相同。
     */
    values: LegacyCurveValue[];

    /**
     * 曲线任意两帧时间的渐变方式。仅当 `easingMethods === undefined` 时本字段才生效。
     */
    easingMethod?: LegacyEasingMethod;

    /**
     * 描述了每一帧时间到下一帧时间之间的渐变方式。
     */
    easingMethods?: LegacyEasingMethod[] | LegacyCompressedEasingMethods;

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

export interface LegacyClipCurve {
    commonTarget?: number;

    modifiers: TargetPath[];

    valueAdapter?: IValueProxyFactory;

    data: LegacyClipCurveData;
}

export interface LegacyCommonTarget {
    modifiers: TargetPath[];
    valueAdapter?: IValueProxyFactory;
}

export type LegacyMaybeCompactCurve = Omit<LegacyClipCurve, 'data'> & {
    data: Omit<LegacyClipCurveData, 'values'> & {
        values: any[] | CompactValueTypeArray;
    };
};

export type LegacyMaybeCompactKeys = Array<number[] | CompactValueTypeArray>;

export type LegacyRuntimeCurve = Pick<LegacyClipCurve, 'modifiers' | 'valueAdapter' | 'commonTarget'> & {
    /**
     * 属性曲线。
     */
    curve: AnimCurve;

    /**
     * 曲线采样器。
     */
    sampler: RatioSampler | null;
}

export class AnimationClipLegacyData {
    constructor (duration: number) {
        this._duration = duration;
    }

    get keys () {
        return this._keys;
    }

    set keys (value) {
        this._keys = value;
    }

    get curves () {
        return this._curves;
    }

    set curves (value) {
        this._curves = value;
        delete this._runtimeCurves;
    }

    get commonTargets () {
        return this._commonTargets;
    }

    set commonTargets (value) {
        this._commonTargets = value;
    }

    /**
     * 此动画的数据。
     */
    get data () {
        return this._data;
    }

    public getPropertyCurves (): readonly LegacyRuntimeCurve[] {
        if (!this._runtimeCurves) {
            this._createPropertyCurves();
        }
        return this._runtimeCurves!;
    }

    @serializable
    private _keys: number[][] = [];

    @serializable
    private _curves: LegacyClipCurve[] = [];

    @serializable
    private _commonTargets: LegacyCommonTarget[] = [];

    private _ratioSamplers: RatioSampler[] = [];

    private _runtimeCurves?: LegacyRuntimeCurve[];

    private _data: Uint8Array | null = null;

    private _duration: number;

    protected _createPropertyCurves () {
        this._ratioSamplers = this._keys.map(
            (keys) => new RatioSampler(
                keys.map(
                    (key) => key / this._duration,
                ),
            ),
        );

        this._runtimeCurves = this._curves.map((targetCurve): LegacyRuntimeCurve => ({
            curve: new AnimCurve(targetCurve.data, this._duration),
            modifiers: targetCurve.modifiers,
            valueAdapter: targetCurve.valueAdapter,
            sampler: this._ratioSamplers[targetCurve.data.keys],
            commonTarget: targetCurve.commonTarget,
        }));
    }

    // private _decodeCVTAs () {
    //     const binaryBuffer: ArrayBuffer = ArrayBuffer.isView(this._nativeAsset) ? this._nativeAsset.buffer : this._nativeAsset;
    //     if (!binaryBuffer) {
    //         return;
    //     }

    //     const maybeCompressedKeys = this._keys;
    //     for (let iKey = 0; iKey < maybeCompressedKeys.length; ++iKey) {
    //         const keys = maybeCompressedKeys[iKey];
    //         if (keys instanceof CompactValueTypeArray) {
    //             maybeCompressedKeys[iKey] = keys.decompress(binaryBuffer);
    //         }
    //     }

    //     for (let iCurve = 0; iCurve < this._curves.length; ++iCurve) {
    //         const curve = this._curves[iCurve];
    //         if (curve.data.values instanceof CompactValueTypeArray) {
    //             curve.data.values = curve.data.values.decompress(binaryBuffer);
    //         }
    //     }
    // }
}

// #region Legacy data structures prior to 1.2

export interface LegacyObjectCurveData {
    [propertyName: string]: LegacyClipCurveData;
}

export interface LegacyComponentsCurveData {
    [componentName: string]: LegacyObjectCurveData;
}

export interface LegacyNodeCurveData {
    props?: LegacyObjectCurveData;
    comps?: LegacyComponentsCurveData;
}

// #endregion

export class LegacyEasingMethodConverter {
    constructor (legacyCurveData: LegacyClipCurveData, keyframesCount: number) {
        const { easingMethods } = legacyCurveData;
        if (Array.isArray(easingMethods)) {
            // Different
            this._easingMethods = easingMethods;
        } else if (easingMethods === undefined) {
            // Same
            this._easingMethods = new Array(keyframesCount).fill(legacyCurveData.easingMethod);
        } else {
            // Compressed as record
            this._easingMethods = Array.from({ length: keyframesCount }, (_, index) => easingMethods[index]);
        }
    }

    get nil () {
        return !this._easingMethods;
    }

    public convert (curve: RealCurve) {
        const { _easingMethods: easingMethods } = this;
        if (!easingMethods) {
            return;
        }

        const nKeyframes = curve.keyFramesCount;
        if (curve.keyFramesCount < 2) {
            return;
        }

        if (Array.isArray(easingMethods)) {
            assertIsTrue(nKeyframes === easingMethods.length);
        }

        const iLastKeyframe = nKeyframes - 1;
        for (let iKeyframe = 0; iKeyframe < iLastKeyframe; ++iKeyframe) {
            const easingMethod = easingMethods[iKeyframe];
            if (!easingMethod) {
                continue;
            }
            if (Array.isArray(easingMethod)) {
                // Time bezier points
                const previousKeyframeValue = curve.getKeyframeValue(iKeyframe);
                const nextKeyframeValue = curve.getKeyframeValue(iKeyframe + 1);
                const [endTangent, endTangentWeight, startTangent, startTangentWeight] = timeBezierToTangents(
                    easingMethod,
                    curve.getKeyframeTime(iKeyframe),
                    previousKeyframeValue.value,
                    curve.getKeyframeTime(iKeyframe + 1),
                    nextKeyframeValue.value,
                );
                previousKeyframeValue.interpMode = RealInterpMode.CUBIC;
                previousKeyframeValue.endTangent = endTangent;
                previousKeyframeValue.endTangentWeight = endTangentWeight;
                nextKeyframeValue.startTangent = startTangent;
                nextKeyframeValue.startTangentWeight = startTangentWeight;
                nextKeyframeValue.tangentWeightMode = TangentWeightMode.BOTH;
            } else {
                const bernstein = new Array(4).fill(0);
                // Easing methods in `easing`
                switch (easingMethod) {
                case 'constant':
                case 'linear':
                    break;
                case 'quadIn':
                    // k * k
                    powerToBernstein([0.0, 0.0, 1.0, 0.0], bernstein);
                    break;
                case 'quadOut':
                    // k * (2 - k)
                    powerToBernstein([0.0, 2.0, -1.0, 0.0], bernstein);
                    break;
                case 'cubicIn':
                    // k * k * k
                    powerToBernstein([0.0, 0.0, 0.0, 1.0], bernstein);
                    break;
                case 'cubicOut':
                    // --k * k * k + 1;
                    powerToBernstein([0.0, 0.0, 0.0, 1.0], bernstein);
                    break;
                case 'backIn': {
                    // k * k * ((s + 1) * k - s)
                    const s = 1.70158;
                    powerToBernstein([1.0, 0.0, -s, s + 1.0], bernstein);
                    break;
                }
                case 'backOut': {
                    // k * k * ((s + 1) * k - s)
                    const s = 1.70158;
                    powerToBernstein([1.0, 0.0, s, s + 1.0], bernstein);
                    break;
                }
                case 'smooth': {
                    // k * k * (3 - 2 * k)
                    powerToBernstein([0.0, 0.0, 3.0, -2.0], bernstein);
                    break;
                }
                default:
                    // TODO: do sample
                    assertIsTrue(false);
                }
            }
        }
    }

    private _easingMethods: LegacyEasingMethod[]  | undefined;
}

/**
 * Legacy curve uses time based bezier curve interpolation.
 * That's, interpolate time 'x'(time ratio between two frames, eg.[0, 1])
 * and then use the interpolated time to sample curve.
 * Now we need to compute the the end tangent of previous frame and the start tangent of the next frame.
 * @param timeBezierPoints Bezier points used for legacy time interpolation.
 * @param previousTime Time of the previous keyframe.
 * @param previousValue Value of the previous keyframe.
 * @param nextTime Time of the next keyframe.
 * @param nextValue Value of the next keyframe.
 */
export function timeBezierToTangents (
    timeBezierPoints: BezierControlPoints,
    previousTime: number,
    previousValue: number,
    nextTime: number,
    nextValue: number,
): [previousTangent: number, previousTangentWeight: number, nextTangent: number, nextTangentWeight: number] {
    const [p1X, p1Y, p2X, p2Y] = timeBezierPoints;
    const dValue = nextValue - previousValue;
    const dTime = nextTime - previousTime;
    const fx = 3 * dTime;
    const fy = 3 * dValue;
    const t1x = p1X * fx;
    const t1y = p1Y * fy;
    const t2x = (1.0 - p2X) * fx;
    const t2y = (1.0 - p2Y) * fy;
    const ONE_THIRD = 1.0 / 3.0;
    return [
        t1y / t1x,
        Math.sqrt(t1x * t1x + t1y * t1y) * ONE_THIRD,
        t2y / t2x,
        Math.sqrt(t2x * t2x + t2y * t2y) * ONE_THIRD,
    ];
}

function powerToBernstein ([p0, p1, p2, p3]: [number, number, number, number], bernstein: number[]) {
    // https://stackoverflow.com/questions/33859199/convert-polynomial-curve-to-bezier-curve-control-points
    bernstein[0] = p0 + p1 + p2 + p3;
    bernstein[1] = p1 / 3.0 + p2 * 2.0 / 3.0 + p3;
    bernstein[2] = p2 / 3.0 + p3;
    bernstein[3] = p3;
}
