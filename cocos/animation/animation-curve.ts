import { Quat, ValueType, Vec3 } from '../core';
import { ccclass, property } from '../core/data/class-decorator';
import { binarySearchEpsilon as binarySearch } from '../core/data/utils/binary-search';
import { errorID } from '../core/platform/CCDebug';
import { quat } from '../core/value-types/quat';
import { v3 } from '../core/value-types/vec3';
import { PropertyBlendState } from './animation-blend-state';
import { AnimationState } from './animation-state';
import { bezierByTime } from './bezier';
// import { easing } from './easing';
import * as easing from './easing';
import { WrapModeMask, WrappedInfo } from './types';

/**
 * 动画数据类，相当于 AnimationClip。
 * 虽然叫做 AnimCurve，但除了曲线，可以保存任何类型的值。
 */
@ccclass('cc.AnimCurve')
export class AnimCurve {
    public onTimeChangedManually? (time: number, state): void;

    /**
     * @param time
     * @param ratio The normalized time specified as a number between 0.0 and 1.0 inclusive.
     * @param state
     */
    public sample (time: number, ratio: number, state: AnimationState) {

    }
}

export type CurveValue = any;

export interface ICurveTarget {
    [x: string]: any;
}

export type LerpFunction<T = any> = (from: T, to: T, t: number) => T;

/**
 * If propertyBlendState.weight equals to zero, the propertyBlendState.value is dirty.
 * You shall handle this situation correctly.
 */
export type BlendFunction<T> = (value: T, weight: number, propertyBlendState: PropertyBlendState) => T;

export type FrameFinder = (framevalues: number[], value: number) => number;

export type LinearType = null;

export type BezierType = [number, number, number, number];

export type EasingMethodName = keyof (typeof easing);

export type CurveType = LinearType | BezierType | EasingMethodName;

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

@ccclass('cc.DynamicAnimCurve')
export class DynamicAnimCurve extends AnimCurve {
    public static Linear = null;

    public static Bezier (controlPoints: number[]) {
        return controlPoints as BezierType;
    }

    /**
     * The object being animated.
     */
    @property
    public target: ICurveTarget | null = null;

    /**
     * The name of the property being animated.
     */
    @property
    public prop: string = '';

    /**
     * The values of the keyframes. (y)
     */
    @property
    public values: CurveValue[] = [];

    /**
     * The keyframe ratio of the keyframe specified as a number between 0.0 and 1.0 inclusive. (x)
     * A null ratio indicates a zero or single frame curve.
     */
    public ratioSampler: RatioSampler | null = null;

    @property
    public types?: CurveType[] = undefined;

    @property
    public type?: CurveType = null;

    /**
     * Lerp function used. If undefined, no lerp is performed.
     */
    public _lerp: LerpFunction | undefined = undefined;

    public _blendFunction: BlendFunction<any> | undefined = undefined;

    public sample (time: number, ratio: number, state: AnimationState) {
        const values = this.values;
        const frameCount = this.ratioSampler ?
            this.ratioSampler.ratios.length :
            this.values.length;
        if (frameCount === 0) {
            return;
        }

        // evaluate value
        let value: CurveValue;
        if (this.ratioSampler === null) {
            value = this.values[0];
        } else {
            let index = this.ratioSampler.sample(ratio);
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
                        const fromRatio = this.ratioSampler.ratios[index - 1];
                        const toRatio = this.ratioSampler.ratios[index];
                        const type = this.types ? this.types[index - 1] : this.type;
                        let ratioBetweenFrames = (ratio - fromRatio) / (toRatio - fromRatio);
                        if (type) {
                            ratioBetweenFrames = computeRatioByType(ratioBetweenFrames, type);
                        }
                        // calculate value
                        const toVal = values[index];
                        value = this._lerp(fromVal, toVal, ratioBetweenFrames);
                    }
                }
            }
        }

        if (this.target) {
            if (!this._blendFunction || !state.blendState) {
                this.target[this.prop] = value;
            } else {
                const propertyBlendState = state.blendState.getPropertyState(this.target, this.prop);
                propertyBlendState.value = this._blendFunction(value, state.weight, propertyBlendState);
                propertyBlendState.weight += state.weight;
            }
        }
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

@ccclass('cc.EventAnimCurve')
export class EventAnimCurve extends AnimCurve {
    @property
    public target: ICurveTarget | null = null;

    @property
    public ratios: number[] = [];

    @property
    public events: EventInfo[] = [];

    @property
    private _wrappedInfo = new WrappedInfo();

    @property
    private _lastWrappedInfo: WrappedInfo | null = null;

    @property
    private _ignoreIndex: number = NaN;

    public sample (time: number, ratio: number, state: AnimationState) {
        const length = this.ratios.length;

        const currentWrappedInfo = state.getWrappedInfo(state.time, this._wrappedInfo);
        let direction = currentWrappedInfo.direction;
        let currentIndex = binarySearch(this.ratios, currentWrappedInfo.ratio);
        if (currentIndex < 0) {
            currentIndex = ~currentIndex - 1;

            // if direction is inverse, then increase index
            if (direction < 0) { currentIndex += 1; }
        }

        if (this._ignoreIndex !== currentIndex) {
            this._ignoreIndex = NaN;
        }

        currentWrappedInfo.frameIndex = currentIndex;

        if (!this._lastWrappedInfo) {
            this._fireEvent(currentIndex);
            this._lastWrappedInfo = new WrappedInfo(currentWrappedInfo);
            return;
        }

        const wrapMode = state.wrapMode;
        const currentIterations = this._wrapIterations(currentWrappedInfo.iterations);

        const lastWrappedInfo = this._lastWrappedInfo;
        let lastIterations = this._wrapIterations(lastWrappedInfo.iterations);
        let lastIndex = lastWrappedInfo.frameIndex;
        const lastDirection = lastWrappedInfo.direction;

        const interationsChanged = lastIterations !== -1 && currentIterations !== lastIterations;

        if (lastIndex === currentIndex && interationsChanged && length === 1) {
            this._fireEvent(0);
        } else if (lastIndex !== currentIndex || interationsChanged) {
            direction = lastDirection;

            do {
                if (lastIndex !== currentIndex) {
                    if (direction === -1 && lastIndex === 0 && currentIndex > 0) {
                        if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
                            direction *= -1;
                        } else {
                            lastIndex = length;
                        }
                        lastIterations++;
                    } else if (direction === 1 && lastIndex === length - 1 && currentIndex < length - 1) {
                        if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
                            direction *= -1;
                        } else {
                            lastIndex = -1;
                        }
                        lastIterations++;
                    }

                    if (lastIndex === currentIndex) {
                        break;
                    }
                    if (lastIterations > currentIterations) {
                        break;
                    }
                }

                lastIndex += direction;

                cc.director.getAnimationManager().pushDelayEvent(this, '_fireEvent', [lastIndex]);
            } while (lastIndex !== currentIndex && lastIndex > -1 && lastIndex < length);
        }

        this._lastWrappedInfo.set(currentWrappedInfo);
    }

    public onTimeChangedManually (time: number, state) {
        this._lastWrappedInfo = null;
        this._ignoreIndex = NaN;

        const info = state.getWrappedInfo(time, this._wrappedInfo);
        const direction = info.direction;
        let frameIndex = binarySearch(this.ratios, info.ratio);

        // only ignore when time not on a frame index
        if (frameIndex < 0) {
            frameIndex = ~frameIndex - 1;

            // if direction is inverse, then increase index
            if (direction < 0) { frameIndex += 1; }

            this._ignoreIndex = frameIndex;
        }
    }

    private _wrapIterations (iterations: number) {
        if (iterations - (iterations | 0) === 0) {
            iterations -= 1;
        }
        return iterations | 0;
    }

    private _fireEvent (index: number) {
        if (index < 0 || index >= this.events.length || this._ignoreIndex === index) {
            return;
        }

        const eventInfo = this.events[index];
        const events = eventInfo.events;

        if (!this.target || !this.target.isValid) {
            return;
        }

        const components = this.target._components;

        for (const event of events) {
            const funcName = event.func;
            for (const component of components) {
                const func = component[funcName];
                if (func) {
                    func.apply(component, event.params);
                }
            }
        }
    }
}

/**
 * Compute a new ratio by curve type
 * @param ratio - The origin ratio
 * @param type - If it's Array, then ratio will be computed with bezierByTime.
 * If it's string, then ratio will be computed with cc.easing function
 */
export function computeRatioByType (ratio: number, type: CurveType) {
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
 * 当每两帧之前的间隔都一样的时候可以使用此函数快速查找 index
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
