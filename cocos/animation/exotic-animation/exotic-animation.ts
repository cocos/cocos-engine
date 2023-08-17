/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { EDITOR, TEST } from 'internal:constants';
import { binarySearchEpsilon, clamp, lerp, Quat, Vec3, _decorator } from '../../core';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { AnimationClipGraphBindingContext } from '../marionette/animation-graph-animation-clip-binding';
import { TransformHandle } from '../core/animation-handle';
import { Pose } from '../core/pose';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { Binder, RuntimeBinding, TrackBinding, TrackPath } from '../tracks/track';

const SPLIT_METHOD_ENABLED = TEST || EDITOR;

const { ccclass, serializable } = _decorator;

function throwIfSplitMethodIsNotValid (): never {
    // TODO: better handling
    throw new Error(`split() only valid in Editor.`);
}

/**
 * Animation that:
 * - does not exposed by users;
 * - does not compatible with regular animation;
 * - non-editable;
 * - currently only generated imported from model file.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticAnimation`)
export class ExoticAnimation {
    public createEvaluator (binder: Binder): ExoticTrsAnimationEvaluator {
        return new ExoticTrsAnimationEvaluator(this._nodeAnimations, binder);
    }

    public createEvaluatorForAnimationGraph (context: AnimationClipGraphBindingContext): ExoticTrsAGEvaluation {
        return new ExoticTrsAGEvaluation(this._nodeAnimations, context);
    }

    public addNodeAnimation (path: string): ExoticNodeAnimation {
        const nodeAnimation = new ExoticNodeAnimation(path);
        this._nodeAnimations.push(nodeAnimation);
        return nodeAnimation;
    }

    public collectAnimatedJoints (): string[] {
        return Array.from(new Set(this._nodeAnimations.map(({ path }) => path)));
    }

    public split (from: number, to: number): ExoticAnimation {
        if (!SPLIT_METHOD_ENABLED) {
            return throwIfSplitMethodIsNotValid();
        }

        const splitInfoCache = new SplitInfo();

        const newAnimation = new ExoticAnimation();
        newAnimation._nodeAnimations = this._nodeAnimations.map((nodeAnimation) => nodeAnimation.split(from, to, splitInfoCache));
        return newAnimation;
    }

    /**
     * @internal
     */
    public toHashString (): string {
        return this._nodeAnimations.map((nodeAnimation) => nodeAnimation.toHashString()).join('\n');
    }

    @serializable
    private _nodeAnimations: ExoticNodeAnimation[] = [];
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticNodeAnimation`)
class ExoticNodeAnimation {
    constructor (path: string) {
        this._path = path;
    }

    public createPosition (times: FloatArray, values: FloatArray): void {
        this._position = new ExoticTrack(times, new ExoticVec3TrackValues(values));
    }

    public createRotation (times: FloatArray, values: FloatArray): void {
        this._rotation = new ExoticTrack(times, new ExoticQuatTrackValues(values));
    }

    public createScale (times: FloatArray, values: FloatArray): void {
        this._scale = new ExoticTrack(times, new ExoticVec3TrackValues(values));
    }

    public createEvaluator (binder: Binder): ExoticNodeAnimationEvaluator {
        return new ExoticNodeAnimationEvaluator(
            this._path,
            this._position,
            this._rotation,
            this._scale,
            binder,
        );
    }

    public createEvaluatorForAnimationGraph (context: AnimationClipGraphBindingContext): ExoticNodeAnimationAGEvaluation | null {
        const transformHandle = context.bindTransform(this._path);
        if (!transformHandle) {
            return null;
        }
        return new ExoticNodeAnimationAGEvaluation(
            transformHandle,
            this._position,
            this._rotation,
            this._scale,
        );
    }

    public split (from: number, to: number, splitInfoCache: SplitInfo): ExoticNodeAnimation {
        if (!SPLIT_METHOD_ENABLED) {
            return throwIfSplitMethodIsNotValid();
        }

        const newAnimation = new ExoticNodeAnimation(this._path);
        const {
            _position: position,
            _rotation: rotation,
            _scale: scale,
        } = this;
        if (position) {
            newAnimation._position = splitVec3Track(position, from, to, splitInfoCache);
        }
        if (rotation) {
            newAnimation._rotation = splitQuatTrack(rotation, from, to, splitInfoCache);
        }
        if (scale) {
            newAnimation._scale = splitVec3Track(scale, from, to, splitInfoCache);
        }
        return newAnimation;
    }

    get path (): string {
        return this._path;
    }

    /**
     * @internal
     */
    public toHashString (): string {
        return `${this._path}\n${
            this._position?.toHashString() ?? ''
        }${this._scale?.toHashString() ?? ''
        }${this._rotation?.toHashString() ?? ''}`;
    }

    @serializable
    private _path = '';

    @serializable
    private _position: ExoticVec3Track | null = null;

    @serializable
    private _rotation: ExoticQuatTrack | null = null;

    @serializable
    private _scale: ExoticVec3Track | null = null;
}

function floatToHashString (value: number): string {
    // Note: referenced to `Skeleton.prototype.hash`
    return value.toPrecision(2);
}

function floatArrayToHashString (values: FloatArray): string {
    return (values).map((v: number) => Number.parseFloat(floatToHashString(v))).join(' ');
}

interface ExoticTrackValues<TValue> {
    readonly precision: FloatPrecision;

    get (index: number, resultValue: TValue): void;

    lerp(prevIndex: number,
        nextIndex: number,
        ratio: number,
        prevValue: TValue,
        nextValue: TValue,
        resultValue: TValue): void;
}

type MayBeQuantized = FloatArray | QuantizedFloatArray;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticVectorLikeTrackValues`)
class ExoticVectorLikeTrackValues {
    constructor (values: FloatArray) {
        this._values = values;
    }

    get precision (): FloatPrecision {
        return this._isQuantized
            ? (this._values as QuantizedFloatArray).originalPrecision
            : getFloatArrayPrecision(this._values as FloatArray);
    }

    public quantize (type: QuantizationType): void {
        assertIsTrue(!this._isQuantized);
        this._values = quantize(this._values as FloatArray, type);
        this._isQuantized = true;
    }

    /**
     * @internal
     */
    public toHashString (): string {
        const { _isQuantized: isQuantized, _values: values } = this;
        return `${isQuantized} ${
            isQuantized
                ? (values as QuantizedFloatArray).toHashString()
                : floatArrayToHashString(values as FloatArray)
        }`;
    }

    @serializable
    protected _values: MayBeQuantized;

    @serializable
    protected _isQuantized = false;
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticVec3TrackValues`)
class ExoticVec3TrackValues extends ExoticVectorLikeTrackValues implements ExoticTrackValues<Vec3> {
    public static imitate (values: FloatArray, model: ExoticVec3TrackValues): ExoticVec3TrackValues {
        const trackValues = new ExoticVec3TrackValues(values);
        if (model._isQuantized) {
            trackValues.quantize((model._values as QuantizedFloatArray).quantizationType);
        }
        return trackValues;
    }

    public get (index: number, resultValue: Vec3): void {
        const {
            _values: values,
            _isQuantized: isQuantized,
        } = this;
        if (isQuantized) {
            loadVec3FromQuantized(values as QuantizedFloatArray, index, resultValue);
        } else {
            Vec3.fromArray(resultValue, values as FloatArray, index * 3);
        }
    }

    public lerp (
        prevIndex: number,
        nextIndex: number,
        ratio: number,
        prevValue: Vec3,
        nextValue: Vec3,
        resultValue: Vec3,
    ): void {
        const {
            _values: values,
            _isQuantized: isQuantized,
        } = this;
        if (isQuantized) {
            loadVec3FromQuantized(values as QuantizedFloatArray, prevIndex, prevValue);
            loadVec3FromQuantized(values as QuantizedFloatArray, nextIndex, nextValue);
        } else {
            Vec3.fromArray(prevValue, values as FloatArray, prevIndex * 3);
            Vec3.fromArray(nextValue, values as FloatArray, nextIndex * 3);
        }
        Vec3.lerp(resultValue, prevValue, nextValue, ratio);
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticQuatTrackValues`)
class ExoticQuatTrackValues extends ExoticVectorLikeTrackValues implements ExoticTrackValues<Quat> {
    public static imitate (values: FloatArray, model: ExoticQuatTrackValues): ExoticQuatTrackValues {
        const trackValues = new ExoticQuatTrackValues(values);
        if (model._isQuantized) {
            trackValues.quantize((model._values as QuantizedFloatArray).quantizationType);
        }
        return trackValues;
    }

    public get (index: number, resultValue: Quat): void {
        const {
            _values: values,
            _isQuantized: isQuantized,
        } = this;
        if (isQuantized) {
            loadQuatFromQuantized(values as QuantizedFloatArray, index, resultValue);
        } else {
            Quat.fromArray(resultValue, values as FloatArray, index * 4);
        }
    }

    public lerp (
        prevIndex: number,
        nextIndex: number,
        ratio: number,
        prevValue: Quat,
        nextValue: Quat,
        resultValue: Quat,
    ): void {
        const {
            _values: values,
            _isQuantized: isQuantized,
        } = this;
        if (isQuantized) {
            loadQuatFromQuantized(values as QuantizedFloatArray, prevIndex, prevValue);
            loadQuatFromQuantized(values as QuantizedFloatArray, nextIndex, nextValue);
        } else {
            Quat.fromArray(prevValue, values as FloatArray, prevIndex * 4);
            Quat.fromArray(nextValue, values as FloatArray, nextIndex * 4);
        }
        Quat.slerp(resultValue, prevValue, nextValue, ratio);
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}ExoticTrack`)
class ExoticTrack<TTrackValues extends { toHashString(): string; }> {
    constructor (times: FloatArray, values: TTrackValues) {
        this.times = times;
        this.values = values;
    }

    @serializable
    public times!: FloatArray;

    @serializable
    public values!: TTrackValues;

    /**
     * @internal
     */
    public toHashString (): string {
        const { times, values } = this;
        return `times: ${floatArrayToHashString(times)}; values: ${values.toHashString()}`;
    }
}

type ExoticVec3Track = ExoticTrack<ExoticVec3TrackValues>;

type ExoticQuatTrack = ExoticTrack<ExoticQuatTrackValues>;

function splitVec3Track (track: ExoticVec3Track, from: number, to: number, splitInfoCache: SplitInfo): ExoticTrack<ExoticVec3TrackValues> {
    const { times, values } = split(
        track.times,
        track.values,
        from,
        to,
        3,
        Vec3,
        splitInfoCache,
    );

    const vec3Values = ExoticVec3TrackValues.imitate(values, track.values);
    return new ExoticTrack<ExoticVec3TrackValues>(
        times,
        vec3Values,
    );
}

function splitQuatTrack (track: ExoticQuatTrack, from: number, to: number, splitInfoCache: SplitInfo): ExoticTrack<ExoticQuatTrackValues> {
    const { times, values } = split(
        track.times,
        track.values,
        from,
        to,
        4,
        Quat,
        splitInfoCache,
    );

    const quatValues = ExoticQuatTrackValues.imitate(
        values,
        track.values,
    );
    return new ExoticTrack<ExoticQuatTrackValues>(
        times,
        quatValues,
    );
}

function split<TValue> (
    times: FloatArray,
    values: ExoticTrackValues<TValue>,
    from: number,
    to: number,
    components: number,
    ValueConstructor: {
        new (): TValue;
        toArray(array: ArrayLike<number>, value: TValue, offset: number): void;
    },
    splitInfoCache: SplitInfo,
): {
        times: FloatArray;
        values: FloatArray;
    } {
    const TimeArrayConstructor = getFloatArrayConstructorWithPrecision(getFloatArrayPrecision(times));
    const ValueArrayConstructor = getFloatArrayConstructorWithPrecision(values.precision);

    const splitInfo = splitInfoCache;
    splitInfo.calculate(times, from, to);

    const {
        preLerpIndex,
        preLerpRatio,
        directKeyframesBegin,
        directKeyframesEnd,
        postLerpIndex,
        postLerpRatio,
    } = splitInfo;

    const nNewKeyframes = splitInfo.keyframesCount;

    if (nNewKeyframes === 0) {
        return {
            times: new TimeArrayConstructor(0),
            values: new ValueArrayConstructor(0),
        };
    }

    const prevValue = new ValueConstructor();
    const nextValue = new ValueConstructor();
    const resultValue = new ValueConstructor();
    const newTimes: FloatArray = new TimeArrayConstructor(nNewKeyframes);
    const newValues: FloatArray = new ValueArrayConstructor(components * nNewKeyframes);
    const doLerp = (index: number, ratio: number, outputIndex: number): void => {
        assertIsTrue(index < times.length - 1);
        const iPrevious = index;
        const iNext = index + 1;
        values.lerp(
            iPrevious,
            iNext,
            ratio,
            prevValue,
            nextValue,
            resultValue,
        );
        newTimes[outputIndex] = lerp(times[iPrevious], times[iNext], ratio) - from;
        ValueConstructor.toArray(newValues, resultValue, components * outputIndex);
    };

    let iKeyframe = 0;
    if (preLerpIndex >= 0) {
        doLerp(preLerpIndex, preLerpRatio, iKeyframe);
        ++iKeyframe;
    }
    for (let index = directKeyframesBegin; index < directKeyframesEnd; ++index, ++iKeyframe) {
        values.get(index, resultValue);
        newTimes[iKeyframe] = times[index] - from;
        ValueConstructor.toArray(newValues, resultValue, components * iKeyframe);
    }
    if (postLerpIndex >= 0) {
        doLerp(postLerpIndex, postLerpRatio, iKeyframe);
        ++iKeyframe;
    }
    assertIsTrue(iKeyframe === nNewKeyframes);

    return {
        times: newTimes,
        values: newValues,
    };
}

class SplitInfo {
    public declare preLerpIndex: number;
    public declare preLerpRatio: number;
    public declare directKeyframesBegin: number;
    public declare directKeyframesEnd: number;
    public declare postLerpIndex: number;
    public declare postLerpRatio: number;

    constructor () {
        this._reset();
    }

    public get keyframesCount (): number {
        const {
            preLerpIndex,
            directKeyframesBegin,
            directKeyframesEnd,
            postLerpIndex,
        } = this;
        return 0
            + (preLerpIndex < 0 ? 0 : 1)
            + (directKeyframesEnd - directKeyframesBegin)
            + (postLerpIndex < 0 ? 0 : 1);
    }

    public calculate (times: ArrayLike<number>, from: number, to: number): void {
        this._reset();

        if (from > to) {
            return;
        }

        const nKeyframes = times.length;
        if (!nKeyframes) {
            return;
        }

        const firstTime = times[0];
        const lastTime = times[nKeyframes - 1];

        let fromIndex = 0;
        let fromRatio = 0.0;
        if (from < firstTime) {
            // Leave as-is.
        } else if (from >= lastTime) {
            fromIndex = nKeyframes - 1;
            fromRatio = 0.0;
        } else {
            ({ index: fromIndex, ratio: fromRatio } = binarySearchRatio(times, from));
        }

        let toIndex = 0;
        let toRatio = 0.0;
        if (to < firstTime) {
            // Leave as-is.
        } else if (to >= lastTime) {
            toIndex = nKeyframes - 1;
            toRatio = 0.0;
        } else {
            ({ index: toIndex, ratio: toRatio } = binarySearchRatio(times, to));
        }

        assertIsTrue(toIndex >= fromIndex);

        const fromJust = !fromRatio;
        const toJust = !toRatio;

        // Handles that from and to are same
        if (fromIndex === toIndex && fromRatio === toRatio) {
            if (!fromJust) {
                this.preLerpIndex = fromIndex;
                this.preLerpRatio = fromRatio;
            } else {
                this.directKeyframesBegin = fromIndex;
                this.directKeyframesEnd = fromIndex + 1;
            }
            return;
        }

        if (!fromJust) {
            this.preLerpIndex = fromIndex;
            this.preLerpRatio = fromRatio;
        }

        this.directKeyframesBegin = fromJust ? fromIndex : fromIndex + 1;
        this.directKeyframesEnd = toIndex + 1;

        if (!toJust) {
            this.postLerpIndex = toIndex;
            this.postLerpRatio = toRatio;
        }
    }

    private _reset (): void {
        this.preLerpIndex = -1;
        this.preLerpRatio = 0.0;
        this.directKeyframesBegin = 0;
        this.directKeyframesEnd = 0;
        this.postLerpIndex = -1;
        this.postLerpRatio = 0.0;
    }
}

function binarySearchRatio (values: ArrayLike<number>, value: number): { index: number; ratio: number; } {
    const nValues = values.length;
    assertIsTrue(values.length !== 0);
    let resultIndex = 0;
    let resultRatio = 0.0;
    const index0 = binarySearchEpsilon(values, value);
    if (index0 >= 0) {
        resultIndex = index0;
    } else {
        const iNext = ~index0;
        assertIsTrue(iNext !== 0 && iNext !== nValues && nValues > 1);
        const iPrev = iNext - 1;
        resultIndex = iPrev;
        const next = values[iNext];
        const prev = values[iPrev];
        resultRatio = (value - prev) / (next - prev);
    }
    return { index: resultIndex, ratio: resultRatio };
}

class ExoticTrsAnimationEvaluator {
    constructor (nodeAnimations: ExoticNodeAnimation[], binder: Binder) {
        this._nodeEvaluations = nodeAnimations.map((nodeAnimation) => nodeAnimation.createEvaluator(binder));
    }

    public evaluate (time: number): void {
        this._nodeEvaluations.forEach((nodeEvaluator) => {
            nodeEvaluator.evaluate(time);
        });
    }

    private _nodeEvaluations: ExoticNodeAnimationEvaluator[];
}

class ExoticNodeAnimationEvaluator {
    constructor (
        path: string,
        position: ExoticVec3Track | null,
        rotation: ExoticQuatTrack | null,
        scale: ExoticVec3Track | null,
        binder: Binder,
    ) {
        if (position) {
            this._position = createExoticTrackEvaluationRecord(
                position.times, position.values, Vec3, path, 'position', binder,
            );
        }
        if (rotation) {
            this._rotation = createExoticTrackEvaluationRecord(
                rotation.times, rotation.values, Quat, path, 'rotation', binder,
            );
        }
        if (scale) {
            this._scale = createExoticTrackEvaluationRecord(
                scale.times, scale.values, Vec3, path, 'scale', binder,
            );
        }
    }

    public evaluate (time: number): void {
        if (this._position) {
            const value = this._position.evaluator.evaluate(time);
            this._position.runtimeBinding.setValue(value);
        }
        if (this._rotation) {
            const value = this._rotation.evaluator.evaluate(time);
            this._rotation.runtimeBinding.setValue(value);
        }
        if (this._scale) {
            const value = this._scale.evaluator.evaluate(time);
            this._scale.runtimeBinding.setValue(value);
        }
    }

    private _position: ExoticTrackEvaluationRecord<Vec3> | null = null;
    private _rotation: ExoticTrackEvaluationRecord<Quat> | null = null;
    private _scale: ExoticTrackEvaluationRecord<Vec3> | null = null;
}

class ExoticTrackEvaluator<TValue> {
    constructor (times: FloatArray, values: ExoticTrackValues<TValue>, ValueConstructor: new () => TValue) {
        this._times = times;
        this._values = values;
        this._prevValue = new ValueConstructor();
        this._nextValue = new ValueConstructor();
        this._resultValue = new ValueConstructor();
    }

    public evaluate (time: number): TValue {
        const {
            _times: times,
            _values: values,
            _resultValue: resultValue,
        } = this;

        const nFrames = times.length;

        if (nFrames === 0) {
            return resultValue;
        }

        const inputSampleResult = sampleInput(times, time, this._inputSampleResultCache);
        if (inputSampleResult.just) {
            values.get(inputSampleResult.index, resultValue);
        } else {
            values.lerp(
                inputSampleResult.index,
                inputSampleResult.nextIndex,
                inputSampleResult.ratio,
                this._prevValue,
                this._nextValue,
                resultValue,
            );
        }

        return resultValue;
    }

    private _times: FloatArray;
    private _inputSampleResultCache: InputSampleResult = {
        just: false,
        index: -1,
        nextIndex: -1,
        ratio: 0.0,
    };
    private _values: ExoticTrackValues<TValue>;
    private _prevValue: TValue;
    private _nextValue: TValue;
    private _resultValue: TValue;
}

interface ExoticTrackEvaluationRecord<TValue> {
    runtimeBinding: RuntimeBinding;
    evaluator: ExoticTrackEvaluator<TValue>;
}

/**
 * Exotic TRS animation graph evaluator.
 */
export class ExoticTrsAGEvaluation {
    constructor (nodeAnimations: ExoticNodeAnimation[], context: AnimationClipGraphBindingContext) {
        this._nodeEvaluations = nodeAnimations.map(
            (nodeAnimation) => nodeAnimation.createEvaluatorForAnimationGraph(context),
        ).filter((x) => !!x) as ExoticNodeAnimationAGEvaluation[];
    }

    public destroy (): void {
        const { _nodeEvaluations: nodeEvaluations } = this;
        const nNodeEvaluations = nodeEvaluations.length;
        for (let iNodeEvaluation = 0; iNodeEvaluation < nNodeEvaluations; ++iNodeEvaluation) {
            nodeEvaluations[iNodeEvaluation].destroy();
        }
    }

    public evaluate (time: number, pose: Pose): void {
        const { _nodeEvaluations: nodeEvaluations } = this;
        const nNodeEvaluations = nodeEvaluations.length;
        for (let iNodeEvaluation = 0; iNodeEvaluation < nNodeEvaluations; ++iNodeEvaluation) {
            nodeEvaluations[iNodeEvaluation].evaluate(time, pose);
        }
    }

    private _nodeEvaluations: ExoticNodeAnimationAGEvaluation[];
}

class ExoticNodeAnimationAGEvaluation {
    constructor (
        transformHandle: TransformHandle,
        position: ExoticVec3Track | null,
        rotation: ExoticQuatTrack | null,
        scale: ExoticVec3Track | null,
    ) {
        this._transformHandle = transformHandle;
        if (position) {
            this._position = new ExoticTrackEvaluator(position.times, position.values, Vec3);
        }
        if (rotation) {
            this._rotation = new ExoticTrackEvaluator(rotation.times, rotation.values, Quat);
        }
        if (scale) {
            this._scale = new ExoticTrackEvaluator(scale.times, scale.values, Vec3);
        }
    }

    public destroy (): void {
        this._transformHandle.destroy();
    }

    public evaluate (time: number, pose: Pose): void {
        const {
            _transformHandle: {
                index: transformIndex,
            },
            _position: position,
            _rotation: rotation,
            _scale: scale,
        } = this;
        const {
            transforms: poseTransforms,
        } = pose;
        if (position) {
            const value = position.evaluate(time);
            poseTransforms.setPosition(transformIndex, value);
        }
        if (rotation) {
            const rotationAbs = rotation.evaluate(time);
            poseTransforms.setRotation(transformIndex, rotationAbs);
        }
        if (scale) {
            const value = scale.evaluate(time);
            poseTransforms.setScale(transformIndex, value);
        }
    }

    private _position: ExoticTrackEvaluator<Vec3> | null = null;
    private _rotation: ExoticTrackEvaluator<Quat> | null = null;
    private _scale: ExoticTrackEvaluator<Vec3> | null = null;
    private _transformHandle: TransformHandle;
}

interface InputSampleResult {
    just: boolean;
    index: number;
    nextIndex: number;
    ratio: number;
}

function sampleInput (values: FloatArray, time: number, result: InputSampleResult): InputSampleResult {
    const nFrames = values.length;
    assertIsTrue(nFrames !== 0);

    const firstTime = values[0];
    const lastTime = values[nFrames - 1];
    if (time < firstTime) {
        result.just = true;
        result.index = 0;
    } else if (time > lastTime) {
        result.just = true;
        result.index = nFrames - 1;
    } else {
        const index = binarySearchEpsilon(values, time);
        if (index >= 0) {
            result.just = true;
            result.index = index;
        } else {
            const nextIndex = ~index;
            assertIsTrue(nextIndex !== 0 && nextIndex !== nFrames && nFrames > 1);
            const prevIndex = nextIndex - 1;
            const prevTime = values[prevIndex];
            const nextTime = values[nextIndex];
            const ratio = (time - values[prevIndex]) / (nextTime - prevTime);
            result.just = false;
            result.index = prevIndex;
            result.nextIndex = nextIndex;
            result.ratio = ratio;
        }
    }

    return result;
}

type UintArray = Uint8Array | Uint16Array | Uint32Array;

type FloatArray = Float32Array | Float64Array;

type UintArrayConstructor = Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;

type IntArrayConstructor = Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor;

type QuantizationType = 'uint8' | 'uint16';

type QuantizationArrayConstructor = Uint8ArrayConstructor | Uint16ArrayConstructor;

const QUANTIZATION_TYPE_TO_ARRAY_VIEW_CONSTRUCTOR_MAP: Record<QuantizationType, QuantizationArrayConstructor> = {
    uint8: Uint8Array,
    uint16: Uint16Array,
};

enum FloatPrecision {
    FLOAT_32,
    FLOAT_64,
}

function getFloatArrayPrecision (array: FloatArray): FloatPrecision {
    switch (array.BYTES_PER_ELEMENT) {
    default:
        assertIsTrue(false);
        // fallthrough
    case 4:
        return FloatPrecision.FLOAT_32;
    case 8:
        return FloatPrecision.FLOAT_64;
    }
}

function getFloatArrayConstructorWithPrecision (precision: FloatPrecision): Float32ArrayConstructor | Float64ArrayConstructor {
    switch (precision) {
    default:
        assertIsTrue(false);
        // fallthrough
    case FloatPrecision.FLOAT_32:
        return Float32Array;
    case FloatPrecision.FLOAT_64:
        return Float64Array;
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}QuantizedFloatArray`)
class QuantizedFloatArray {
    @serializable
    public originalPrecision: FloatPrecision;

    @serializable
    public min!: number;

    @serializable
    public extent!: number;

    @serializable
    public values!: UintArray;

    get quantizationType (): QuantizationType {
        switch (this.values.BYTES_PER_ELEMENT) {
        default:
            // fallthrough
        case 1:
            return 'uint8';
        case 2:
            return 'uint16';
        }
    }

    constructor (originalPrecision: FloatPrecision, values: UintArray, extent: number, min = 0.0) {
        this.originalPrecision = originalPrecision;
        this.values = values;
        this.extent = extent;
        this.min = min;
    }

    /**
     * @internal
     */
    public toHashString (): string {
        const { originalPrecision, min, extent, values } = this;
        return `${originalPrecision} ${floatToHashString(min)} ${floatToHashString(extent)} ${values.join(' ')}`;
    }
}

function quantize (values: FloatArray, type: QuantizationType): QuantizedFloatArray {
    const TypedArrayViewConstructor = QUANTIZATION_TYPE_TO_ARRAY_VIEW_CONSTRUCTOR_MAP[type];
    const MAX = 1 << TypedArrayViewConstructor.BYTES_PER_ELEMENT;
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    values.forEach((value) => {
        min = Math.min(value, min);
        max = Math.max(value, max);
    });
    const extent = max - min;
    // Should consider `extent === 0.0`.
    const normalized = TypedArrayViewConstructor.from(values, (value) => (value - min) / extent * MAX);
    return new QuantizedFloatArray(getFloatArrayPrecision(values), normalized, extent, min);
}

function indexQuantized (quantized: QuantizedFloatArray, index: number): number {
    const quantizedValue = quantized.values[index];
    const MAX_VALUE = 1 << quantized.values.BYTES_PER_ELEMENT;
    return quantizedValue / MAX_VALUE * quantized.extent + quantized.min;
}

function createExoticTrackEvaluationRecord<TValue> (
    times: FloatArray,
    values: ExoticTrackValues<TValue>,
    ValueConstructor: new () => TValue,
    path: string,
    property: 'position' | 'scale' | 'rotation',
    binder: Binder,
): ExoticTrackEvaluationRecord<TValue> | null {
    const trackBinding = new TrackBinding();
    trackBinding.path = new TrackPath().toHierarchy(path).toProperty(property);
    const runtimeBinding = binder(trackBinding);
    if (!runtimeBinding) {
        return null;
    }
    const evaluator =  new ExoticTrackEvaluator(times, values, ValueConstructor);
    return {
        runtimeBinding,
        evaluator,
    } as ExoticTrackEvaluationRecord<TValue>;
}

function loadVec3FromQuantized (values: QuantizedFloatArray, index: number, out: Vec3): void {
    Vec3.set(
        out,
        indexQuantized(values, 3 * index + 0),
        indexQuantized(values, 3 * index + 1),
        indexQuantized(values, 3 * index + 2),
    );
}

function loadQuatFromQuantized (values: QuantizedFloatArray, index: number, out: Quat): void {
    Quat.set(
        out,
        indexQuantized(values, 4 * index + 0),
        indexQuantized(values, 4 * index + 1),
        indexQuantized(values, 4 * index + 2),
        indexQuantized(values, 4 * index + 3),
    );
}
