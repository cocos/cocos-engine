import { assertIsTrue } from '../data/utils/asserts';
import { approx, lerp, pingPong, repeat } from '../math';
import { KeyframeCurve } from './keyframe-curve';
import { ccclass, serializable, uniquelyReferenced } from '../data/decorators';
import { RealInterpolationMode, ExtrapolationMode, TangentWeightMode } from './real-curve-param';
import { binarySearchEpsilon } from '../algorithm/binary-search';
import { solveCubic } from './solve-cubic';
import { EditorExtendable, EditorExtendableMixin } from '../data/editor-extendable';
import { CCClass, deserializeTag, editorExtrasTag, SerializationContext, SerializationInput, SerializationOutput, serializeTag } from '../data';
import { DeserializationContext } from '../data/custom-serializable';
import { EasingMethod, getEasingFn } from './easing-method';
import { defineX } from '../data/class';
import { getOrCreateSerializationMetadata } from '../data/serialization-metadata';

export { RealInterpolationMode, ExtrapolationMode, TangentWeightMode, EasingMethod };

/**
 * View to a real frame value.
 * Note, the view may be invalidated due to keyframe change/add/remove.
 */
class RealKeyframeValue extends EditorExtendable {
    /**
     * Interpolation method used for this keyframe.
     */
    public interpolationMode = RealInterpolationMode.LINEAR;

    /**
     * Tangent weight mode.
     */
    public tangentWeightMode = TangentWeightMode.NONE;

    /**
     * Value of the keyframe.
     */
    public value = 0.0;

    /**
     * The (y component of) tangent of this keyframe
     * when it's used as starting point during cubic interpolation.
     * Meaningless otherwise.
     */
    public rightTangent = 0.0;

    /**
     * The x component tangent of this keyframe
     * when it's used as starting point during cubic interpolation.
     * Meaningless otherwise.
     */
    public rightTangentWeight = 0.0;

    /**
     * The (y component of) tangent of this keyframe
     * when it's used as ending point during cubic interpolation.
     * Meaningless otherwise.
     */
    public leftTangent = 0.0;

    /**
     * The x component of tangent of this keyframe
     * when it's used as starting point during cubic interpolation.
     * Meaningless otherwise.
     */
    public leftTangentWeight = 0.0;

    /**
     * @deprecated Reserved for backward compatibility. Will be removed in future.
     */
    public easingMethod = EasingMethod.LINEAR;
}

defineX(
    'cc.RealKeyframeValue',
    RealKeyframeValue, {
        interpolationMode: { default: RealInterpolationMode.LINEAR },
        tangentWeightMode: { default: TangentWeightMode.NONE },
        value: { default: 0.0 },
        rightTangent: { default: 0.0 },
        rightTangentWeight: { default: 0.0 },
        leftTangent: { default: 0.0 },
        leftTangentWeight: { default: 0.0 },
        [editorExtrasTag]: { default: undefined, editorOnly: true },
    },
);

getOrCreateSerializationMetadata(RealKeyframeValue).uniquelyReferenced = true;

export type { RealKeyframeValue };

/**
 * The parameter describing a real keyframe value.
 * In the case of partial keyframe value,
 * each component of the keyframe value is taken from the parameter.
 * For unspecified components, default values are taken:
 * - Interpolation mode: linear
 * - Tangent weight mode: none
 * - Value/Tangents/Tangent weights: 0.0
 */
type RealKeyframeValueParameters = number | Partial<RealKeyframeValue>;

function createRealKeyframeValue (params: RealKeyframeValueParameters) {
    const realKeyframeValue = new RealKeyframeValue();
    if (typeof params === 'number') {
        realKeyframeValue.value = params;
    } else {
        const {
            interpolationMode,
            tangentWeightMode,
            value,
            rightTangent,
            rightTangentWeight,
            leftTangent,
            leftTangentWeight,
            easingMethod,
            [editorExtrasTag]: editorExtras,
        } = params;
        realKeyframeValue.value = value ?? realKeyframeValue.value;
        realKeyframeValue.rightTangent = rightTangent ?? realKeyframeValue.rightTangent;
        realKeyframeValue.rightTangentWeight = rightTangentWeight ?? realKeyframeValue.rightTangentWeight;
        realKeyframeValue.leftTangent = leftTangent ?? realKeyframeValue.leftTangent;
        realKeyframeValue.leftTangentWeight = leftTangentWeight ?? realKeyframeValue.leftTangentWeight;
        realKeyframeValue.interpolationMode = interpolationMode ?? realKeyframeValue.interpolationMode;
        realKeyframeValue.tangentWeightMode = tangentWeightMode ?? realKeyframeValue.tangentWeightMode;
        realKeyframeValue.easingMethod = easingMethod ?? realKeyframeValue.easingMethod;
        if (editorExtras) {
            realKeyframeValue[editorExtrasTag] = editorExtras;
        }
    }
    return realKeyframeValue;
}

/**
 * Curve.
 */
@ccclass('cc.RealCurve')
export class RealCurve extends KeyframeCurve<RealKeyframeValue> {
    /**
     * Gets or sets the operation should be taken
     * if input time is less than the time of first keyframe when evaluating this curve.
     * Defaults to `ExtrapolationMode.CLAMP`.
     */
    @serializable
    public preExtrapolation: ExtrapolationMode = ExtrapolationMode.CLAMP;

    /**
     * Gets or sets the operation should be taken
     * if input time is greater than the time of last keyframe when evaluating this curve.
     * Defaults to `ExtrapolationMode.CLAMP`.
     */
    @serializable
    public postExtrapolation: ExtrapolationMode = ExtrapolationMode.CLAMP;

    /**
     * Evaluates this curve at specified time.
     * @param time Input time.
     * @returns Result value.
     */
    public evaluate (time: number): number {
        const {
            _times: times,
            _values: values,
        } = this;

        const nFrames = times.length;

        if (nFrames === 0) {
            return 0.0;
        }

        const firstTime = times[0];
        const lastTime = times[nFrames - 1];
        if (time < firstTime) {
            // Underflow
            const { preExtrapolation } = this;
            const preValue = values[0];
            if (preExtrapolation === ExtrapolationMode.CLAMP || nFrames < 2) {
                return preValue.value;
            }
            switch (preExtrapolation) {
            case ExtrapolationMode.LINEAR:
                return linearTrend(firstTime, values[0].value, times[1], values[1].value, time);
            case ExtrapolationMode.LOOP:
                time = wrapRepeat(time, firstTime, lastTime);
                break;
            case ExtrapolationMode.PING_PONG:
                time = wrapPingPong(time, firstTime, lastTime);
                break;
            default:
                return preValue.value;
            }
        } else if (time > lastTime) {
            // Overflow
            const { postExtrapolation } = this;
            const preFrame = values[nFrames - 1];
            if (postExtrapolation === ExtrapolationMode.CLAMP || nFrames < 2) {
                return preFrame.value;
            }
            switch (postExtrapolation) {
            case ExtrapolationMode.LINEAR:
                return linearTrend(lastTime, preFrame.value, times[nFrames - 2], values[nFrames - 2].value, time);
            case ExtrapolationMode.LOOP:
                time = wrapRepeat(time, firstTime, lastTime);
                break;
            case ExtrapolationMode.PING_PONG:
                time = wrapPingPong(time, firstTime, lastTime);
                break;
            default:
                return preFrame.value;
            }
        }

        const index = binarySearchEpsilon(times, time);
        if (index >= 0) {
            return values[index].value;
        }

        const iNext = ~index;
        assertIsTrue(iNext !== 0 && iNext !== nFrames && nFrames > 1);

        const iPre = iNext - 1;
        const preTime = times[iPre];
        const preValue = values[iPre];
        const nextTime = times[iNext];
        const nextValue = values[iNext];
        assertIsTrue(nextTime > time && time > preTime);
        const dt = nextTime - preTime;

        const ratio = (time - preTime) / dt;
        return evalBetweenTwoKeyFrames(preTime, preValue, nextTime, nextValue, ratio);
    }

    /**
     * Adds a keyframe into this curve.
     * @param time Time of the keyframe.
     * @param value Value of the keyframe.
     * @returns The index to the new keyframe.
     */
    public addKeyFrame (time: number, value: RealKeyframeValueParameters): number {
        return super.addKeyFrame(time, createRealKeyframeValue(value));
    }

    /**
     * Assigns all keyframes.
     * @param keyframes An iterable to keyframes. The keyframes should be sorted by their time.
     */
    public assignSorted (keyframes: Iterable<[number, RealKeyframeValueParameters]>): void;

    /**
      * Assigns all keyframes.
      * @param times Times array. Should be sorted.
      * @param values Values array. Corresponding to each time in `times`.
      */
    public assignSorted (times: readonly number[], values: RealKeyframeValueParameters[]): void;

    public assignSorted (
        times: Iterable<[number, RealKeyframeValueParameters]> | readonly number[],
        values?: readonly RealKeyframeValueParameters[],
    ) {
        if (values !== undefined) {
            assertIsTrue(Array.isArray(times));
            this.setKeyframes(
                times.slice(),
                values.map((value) => createRealKeyframeValue(value)),
            );
        } else {
            const keyframes = Array.from(times as Iterable<[number, Partial<RealKeyframeValue>]>);
            this.setKeyframes(
                keyframes.map(([time]) => time),
                keyframes.map(([, value]) => createRealKeyframeValue(value)),
            );
        }
    }

    /**
     * Returns if this curve is constant.
     * @param tolerance The tolerance.
     * @returns Whether it is constant.
     */
    public isConstant (tolerance: number) {
        if (this._values.length <= 1) {
            return true;
        }
        const firstVal = this._values[0].value;
        return this._values.every((frame) => approx(frame.value, firstVal, tolerance));
    }

    public [serializeTag] (output: SerializationOutput, context: SerializationContext) {
        if (!context.toCCON) {
            output.writeThis();
            return;
        }

        const {
            _times: times,
            _values: keyframeValues,
        } = this;

        const nKeyframes = times.length;

        const dataSize = 0
            + OVERFLOW_BYTES + OVERFLOW_BYTES
            + FRAME_COUNT_BYTES
            + TIME_BYTES * nKeyframes
            + REAL_KEY_FRAME_VALUE_MAX_SIZE * nKeyframes;

        const dataView = new DataView(new ArrayBuffer(dataSize));
        let currentOffset = 0;

        // Overflow operations
        dataView.setUint8(currentOffset, this.preExtrapolation); currentOffset += OVERFLOW_BYTES;
        dataView.setUint8(currentOffset, this.postExtrapolation); currentOffset += OVERFLOW_BYTES;

        // Frame count
        dataView.setUint32(currentOffset, nKeyframes, true); currentOffset += FRAME_COUNT_BYTES;

        // Times
        times.forEach((time, index) => dataView.setFloat32(currentOffset + TIME_BYTES * index, time, true));
        currentOffset += TIME_BYTES * nKeyframes;

        // Frame values
        for (const keyframeValue of keyframeValues) {
            currentOffset = saveRealKeyFrameValue(dataView, keyframeValue, currentOffset);
        }

        const bytes = new Uint8Array(dataView.buffer, 0, currentOffset);
        output.writeProperty('bytes', bytes);

        const keyframeValueEditorExtras = keyframeValues.map((keyframeValue) => keyframeValue[editorExtrasTag]);
        if (keyframeValueEditorExtras.some((extras) => extras !== undefined)) {
            output.writeProperty(`keyframeValueEditorExtras`, keyframeValueEditorExtras);
        }
    }

    public [deserializeTag] (input: SerializationInput, context: DeserializationContext) {
        if (!context.fromCCON) {
            input.readThis();
            return;
        }

        const bytes = input.readProperty('bytes') as Uint8Array;

        const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        let currentOffset = 0;

        // Overflow operations
        this.preExtrapolation = dataView.getUint8(currentOffset); currentOffset += OVERFLOW_BYTES;
        this.postExtrapolation = dataView.getUint8(currentOffset); currentOffset += OVERFLOW_BYTES;

        // Frame count
        const nKeyframes = dataView.getUint32(currentOffset, true); currentOffset += FRAME_COUNT_BYTES;

        // Times
        const times = Array.from({ length: nKeyframes },
            (_, index) => dataView.getFloat32(currentOffset + TIME_BYTES * index, true));
        currentOffset += TIME_BYTES * nKeyframes;

        // Frame values
        const keyframeValues = new Array<RealKeyframeValue>(nKeyframes);
        for (let iKeyFrame = 0; iKeyFrame < nKeyframes; ++iKeyFrame) {
            const keyframeValue = createRealKeyframeValue({});
            currentOffset = loadRealKeyFrameValue(dataView, keyframeValue, currentOffset);
            keyframeValues[iKeyFrame] = keyframeValue;
        }

        assertIsTrue(currentOffset === bytes.byteLength);

        const keyframeValueEditorExtras = input.readProperty(`keyframeValueEditorExtras`) as unknown[];
        if (keyframeValueEditorExtras) {
            assertIsTrue(keyframeValueEditorExtras.length === nKeyframes);
            keyframeValueEditorExtras.forEach(
                (extras, index) => keyframeValues[index][editorExtrasTag] = extras,
            );
        }

        this._times = times;
        this._values = keyframeValues;
    }
}

const FLAGS_EASING_METHOD_BITS_START = 8;
const FLAG_EASING_METHOD_MASK = 0xFF << FLAGS_EASING_METHOD_BITS_START; // 8-16 bits

enum KeyframeValueFlagMask {
    VALUE = 1 << 0,
    INTERPOLATION_MODE = 1 << 1,
    TANGENT_WEIGHT_MODE = 1 << 2,
    LEFT_TANGENT = 1 << 3,
    LEFT_TANGENT_WEIGHT = 1 << 4,
    RIGHT_TANGENT = 1 << 5,
    RIGHT_TANGENT_WEIGHT = 1 << 6,
}

const OVERFLOW_BYTES = 1;
const FRAME_COUNT_BYTES = 4;
const TIME_BYTES = 4;
const KEY_FRAME_VALUE_FLAGS_BYTES = 4;
const VALUE_BYTES = 4;
const INTERPOLATION_MODE_BYTES = 1;
const TANGENT_WEIGHT_MODE_BYTES = 1;
const LEFT_TANGENT_BYTES = 4;
const LEFT_TANGENT_WEIGHT_BYTES = 4;
const RIGHT_TANGENT_BYTES = 4;
const RIGHT_TANGENT_WEIGHT_BYTES = 4;

const {
    interpolationMode: DEFAULT_INTERPOLATION_MODE,
    tangentWeightMode: DEFAULT_TANGENT_WEIGHT_MODE,
    leftTangent: DEFAULT_LEFT_TANGENT,
    leftTangentWeight: DEFAULT_LEFT_TANGENT_WEIGHT,
    rightTangent: DEFAULT_RIGHT_TANGENT,
    rightTangentWeight: DEFAULT_RIGHT_TANGENT_WEIGHT,
} = createRealKeyframeValue({});

const REAL_KEY_FRAME_VALUE_MAX_SIZE = KEY_FRAME_VALUE_FLAGS_BYTES
    + VALUE_BYTES
    + INTERPOLATION_MODE_BYTES
    + TANGENT_WEIGHT_MODE_BYTES
    + LEFT_TANGENT_BYTES
    + LEFT_TANGENT_WEIGHT_BYTES
    + RIGHT_TANGENT_BYTES
    + RIGHT_TANGENT_WEIGHT_BYTES
    + 0;

function saveRealKeyFrameValue (dataView: DataView, keyframeValue: RealKeyframeValue, offset: number) {
    let flags = 0;

    let currentOffset = offset;

    const pFlags = currentOffset; // Place holder for flags
    currentOffset += KEY_FRAME_VALUE_FLAGS_BYTES;

    const {
        value,
        interpolationMode,
        tangentWeightMode,
        rightTangent,
        rightTangentWeight,
        leftTangent,
        leftTangentWeight,
        easingMethod,
    } = keyframeValue;

    dataView.setFloat32(currentOffset, value, true);
    currentOffset += VALUE_BYTES;

    if (interpolationMode !== DEFAULT_INTERPOLATION_MODE) {
        flags |= KeyframeValueFlagMask.INTERPOLATION_MODE;
        dataView.setUint8(currentOffset, interpolationMode);
        currentOffset += INTERPOLATION_MODE_BYTES;
    }

    if (tangentWeightMode !== DEFAULT_TANGENT_WEIGHT_MODE) {
        flags |= KeyframeValueFlagMask.TANGENT_WEIGHT_MODE;
        dataView.setUint8(currentOffset, tangentWeightMode);
        currentOffset += TANGENT_WEIGHT_MODE_BYTES;
    }

    if (leftTangent !== DEFAULT_LEFT_TANGENT) {
        flags |= KeyframeValueFlagMask.LEFT_TANGENT;
        dataView.setFloat32(currentOffset, leftTangent, true);
        currentOffset += LEFT_TANGENT_BYTES;
    }

    if (leftTangentWeight !== DEFAULT_LEFT_TANGENT_WEIGHT) {
        flags |= KeyframeValueFlagMask.LEFT_TANGENT_WEIGHT;
        dataView.setFloat32(currentOffset, leftTangentWeight, true);
        currentOffset += LEFT_TANGENT_WEIGHT_BYTES;
    }

    if (rightTangent !== DEFAULT_RIGHT_TANGENT) {
        flags |= KeyframeValueFlagMask.RIGHT_TANGENT;
        dataView.setFloat32(currentOffset, rightTangent, true);
        currentOffset += RIGHT_TANGENT_BYTES;
    }

    if (rightTangentWeight !== DEFAULT_RIGHT_TANGENT_WEIGHT) {
        flags |= KeyframeValueFlagMask.RIGHT_TANGENT_WEIGHT;
        dataView.setFloat32(currentOffset, rightTangentWeight, true);
        currentOffset += RIGHT_TANGENT_WEIGHT_BYTES;
    }

    flags |= (easingMethod << FLAGS_EASING_METHOD_BITS_START);

    dataView.setUint32(pFlags, flags, true);

    return currentOffset;
}

function loadRealKeyFrameValue (dataView: DataView, keyframeValue: RealKeyframeValue, offset: number) {
    let currentOffset = offset;

    const flags = dataView.getUint32(currentOffset, true);
    currentOffset += KEY_FRAME_VALUE_FLAGS_BYTES;

    keyframeValue.value = dataView.getFloat32(currentOffset, true);
    currentOffset += VALUE_BYTES;

    if (flags & KeyframeValueFlagMask.INTERPOLATION_MODE) {
        keyframeValue.interpolationMode = dataView.getUint8(currentOffset);
        currentOffset += INTERPOLATION_MODE_BYTES;
    }

    if (flags & KeyframeValueFlagMask.TANGENT_WEIGHT_MODE) {
        keyframeValue.tangentWeightMode = dataView.getUint8(currentOffset);
        currentOffset += TANGENT_WEIGHT_MODE_BYTES;
    }

    if (flags & KeyframeValueFlagMask.LEFT_TANGENT) {
        keyframeValue.leftTangent = dataView.getFloat32(currentOffset, true);
        currentOffset += LEFT_TANGENT_BYTES;
    }

    if (flags & KeyframeValueFlagMask.LEFT_TANGENT_WEIGHT) {
        keyframeValue.leftTangentWeight = dataView.getFloat32(currentOffset, true);
        currentOffset += LEFT_TANGENT_WEIGHT_BYTES;
    }

    if (flags & KeyframeValueFlagMask.RIGHT_TANGENT) {
        keyframeValue.rightTangent = dataView.getFloat32(currentOffset, true);
        currentOffset += RIGHT_TANGENT_BYTES;
    }

    if (flags & KeyframeValueFlagMask.RIGHT_TANGENT_WEIGHT) {
        keyframeValue.rightTangentWeight = dataView.getFloat32(currentOffset, true);
        currentOffset += RIGHT_TANGENT_WEIGHT_BYTES;
    }

    const easingMethod = ((flags & FLAG_EASING_METHOD_MASK) >> FLAGS_EASING_METHOD_BITS_START) as EasingMethod;
    keyframeValue.easingMethod = easingMethod;

    return currentOffset;
}

function wrapRepeat (time: number, prevTime: number, nextTime: number) {
    return prevTime + repeat(time - prevTime, nextTime - prevTime);
}

function wrapPingPong (time: number, prevTime: number, nextTime: number) {
    return prevTime + pingPong(time - prevTime, nextTime - prevTime);
}

function linearTrend (
    prevTime: number,
    prevValue: number,
    nextTime: number,
    nextValue: number,
    time: number,
) {
    const slope = (nextValue - prevValue) / (nextTime - prevTime);
    return prevValue + (time - prevTime) * slope;
}

function evalBetweenTwoKeyFrames (
    prevTime: number,
    prevValue: RealKeyframeValue,
    nextTime: number,
    nextValue: RealKeyframeValue,
    ratio: number,
) {
    const dt = nextTime - prevTime;
    switch (prevValue.interpolationMode) {
    default:
    case RealInterpolationMode.CONSTANT:
        return prevValue.value;
    case RealInterpolationMode.LINEAR: {
        const transformedRatio = prevValue.easingMethod === EasingMethod.LINEAR
            ? ratio
            : getEasingFn(prevValue.easingMethod)(ratio);
        return lerp(prevValue.value, nextValue.value, transformedRatio);
    }
    case RealInterpolationMode.CUBIC: {
        const ONE_THIRD = 1.0 / 3.0;
        const {
            rightTangent: prevTangent,
            rightTangentWeight: prevTangentWeightSpecified,
        } = prevValue;
        const prevTangentWeightEnabled = isRightTangentWeightEnabled(prevValue.tangentWeightMode);
        const {
            leftTangent: nextTangent,
            leftTangentWeight: nextTangentWeightSpecified,
        } = nextValue;
        const nextTangentWeightEnabled = isLeftTangentWeightEnabled(nextValue.tangentWeightMode);

        if (!prevTangentWeightEnabled && !nextTangentWeightEnabled) {
            // Optimize for the case when both x components of tangents are 1.
            // See below.
            const p1 = prevValue.value + ONE_THIRD * prevTangent * dt;
            const p2 = nextValue.value - ONE_THIRD * nextTangent * dt;
            return bezierInterpolate(prevValue.value, p1, p2, nextValue.value, ratio);
        } else {
            let prevTangentWeight = 0.0;
            if (prevTangentWeightEnabled) {
                prevTangentWeight = prevTangentWeightSpecified;
            } else {
                const x = dt;
                const y = dt * prevTangent;
                prevTangentWeight = Math.sqrt(x * x + y * y) * ONE_THIRD;
            }
            const angle0 = Math.atan(prevTangent);
            const tx0 = Math.cos(angle0) * prevTangentWeight + prevTime;
            const ty0 = Math.sin(angle0) * prevTangentWeight + prevValue.value;

            let nextTangentWeight = 0.0;
            if (nextTangentWeightEnabled) {
                nextTangentWeight = nextTangentWeightSpecified;
            } else {
                const x = dt;
                const y = dt * nextTangent;
                nextTangentWeight = Math.sqrt(x * x + y * y) * ONE_THIRD;
            }
            const angle1 = Math.atan(nextTangent);
            const tx1 = -Math.cos(angle1) * nextTangentWeight + nextTime;
            const ty1 = -Math.sin(angle1) * nextTangentWeight + nextValue.value;

            const dx = dt;
            // Hermite to Bezier
            const u0x = (tx0 - prevTime) / dx;
            const u1x = (tx1 - prevTime) / dx;
            const u0y = ty0;
            const u1y = ty1;
            // Converts from Bernstein Basis to Power Basis.
            // Formula: [1, 0, 0, 0; -3, 3, 0, 0; 3, -6, 3, 0; -1, 3, -3, 1] * [p_0; p_1; p_2; p_3]
            // --------------------------------------
            // | Basis | Coeff
            // | t^3   | 3 * p_1 - p_0 - 3 * p_2 + p_3
            // | t^2   | 3 * p_0 - 6 * p_1 + 3 * p_2
            // | t^1   | 3 * p_1 - 3 * p_0
            // | t^0   | p_0
            // --------------------------------------
            // where: p_0 = 0, p_1 = u0x, p_2 = u1x, p_3 = 1
            // Especially, when both tangents are 1, we will have u0x = 1/3 and u1x = 2/3
            // and then: ratio = t, eg. the ratios are
            // 1-1 corresponding to param t. That's why we can do optimization like above.
            const coeff0 = 0.0; // 0
            const coeff1 = 3.0 * u0x; // 1
            const coeff2 = 3.0 * u1x - 6.0 * u0x; // -1
            const coeff3 = 3.0 * (u0x - u1x) + 1.0; // 1
            // Solves the param t from equation X(t) = ratio.
            const solutions = [0.0, 0.0, 0.0] as [number, number, number];
            const nSolutions = solveCubic(coeff0 - ratio, coeff1, coeff2, coeff3, solutions);
            const param = getParamFromCubicSolution(solutions, nSolutions, ratio);
            // Solves Y.
            const y = bezierInterpolate(prevValue.value, u0y, u1y, nextValue.value, param);
            return y;
        }
    }
    }
}

function isLeftTangentWeightEnabled (tangentWeightMode: TangentWeightMode) {
    return (tangentWeightMode & TangentWeightMode.LEFT) !== 0;
}

function isRightTangentWeightEnabled (tangentWeightMode: TangentWeightMode) {
    return (tangentWeightMode & TangentWeightMode.RIGHT) !== 0;
}

function bezierInterpolate (p0: number, p1: number, p2: number, p3: number, t: number) {
    const u = 1 - t;
    const coeff0 = u * u * u;
    const coeff1 = 3 * u * u * t;
    const coeff2 = 3 * u * t * t;
    const coeff3 = t * t * t;
    return coeff0 * p0 + coeff1 * p1 + coeff2 * p2 + coeff3 * p3;
}

function getParamFromCubicSolution (solutions: readonly [number, number, number], solutionsCount: number, x: number) {
    let param = x;
    if (solutionsCount === 1) {
        param = solutions[0];
    } else {
        param = -Infinity;
        for (let iSolution = 0; iSolution < solutionsCount; ++iSolution) {
            const solution = solutions[iSolution];
            if (solution >= 0.0 && solution <= 1.0) {
                if (solution > param) {
                    param = solution;
                }
            }
        }
        if (param === -Infinity) {
            param = 0.0;
        }
    }
    return param;
}
