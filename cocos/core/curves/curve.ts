import { assertIsTrue } from '../data/utils/asserts';
import { approx, lerp, pingPong, repeat } from '../math';
import { KeyframeCurve } from './keyframe-curve';
import { ccclass, serializable, uniquelyReferenced } from '../data/decorators';
import { RealInterpMode, ExtrapMode, TangentWeightMode } from './real-curve-param';
import { binarySearchEpsilon } from '../algorithm/binary-search';
import { solveCubic } from './solve-cubic';
import { EditorExtendableMixin } from '../data/editor-extendable';
import { deserializeTag, SerializationContext, SerializationInput, SerializationOutput, serializeTag } from '../data';
import { DeserializationContext } from '../data/custom-serializable';
import * as easing from '../animation/easing';

export { RealInterpMode, ExtrapMode, TangentWeightMode };

export enum EasingMethod {
    LINEAR,
    CONSTANT,
    QUAD_IN,
    QUAD_OUT,
    QUAD_IN_OUT,
    QUAD_OUT_IN,
    CUBIC_IN,
    CUBIC_OUT,
    CUBIC_IN_OUT,
    CUBIC_OUT_IN,
    QUART_IN,
    QUART_OUT,
    QUART_IN_OUT,
    QUART_OUT_IN,
    QUINT_IN,
    QUINT_OUT,
    QUINT_IN_OUT,
    QUINT_OUT_IN,
    SINE_IN,
    SINE_OUT,
    SINE_IN_OUT,
    SINE_OUT_IN,
    EXPO_IN,
    EXPO_OUT,
    EXPO_IN_OUT,
    EXPO_OUT_IN,
    CIRC_IN,
    CIRC_OUT,
    CIRC_IN_OUT,
    CIRC_OUT_IN,
    ELASTIC_IN,
    ELASTIC_OUT,
    ELASTIC_IN_OUT,
    ELASTIC_OUT_IN,
    BACK_IN,
    BACK_OUT,
    BACK_IN_OUT,
    BACK_OUT_IN,
    BOUNCE_IN,
    BOUNCE_OUT,
    BOUNCE_IN_OUT,
    BOUNCE_OUT_IN,
    SMOOTH,
    FADE,
}

@ccclass('cc.RealKeyframeValue')
@uniquelyReferenced
export class RealKeyframeValue {
    constructor ({
        interpMode,
        tangentWeightMode,
        value,
        rightTangent,
        rightTangentWeight,
        leftTangent,
        leftTangentWeight,
        easingMethod,
    }:  Partial<RealKeyframeValue> = { }) {
        this.value = value ?? this.value;
        this.rightTangent = rightTangent ?? this.rightTangent;
        this.rightTangentWeight = rightTangentWeight ?? this.rightTangentWeight;
        this.leftTangent = leftTangent ?? this.leftTangent;
        this.leftTangentWeight = leftTangentWeight ?? this.leftTangentWeight;
        this.interpMode = interpMode ?? this.interpMode;
        this.tangentWeightMode = tangentWeightMode ?? this.tangentWeightMode;
        this.easingMethod = easingMethod ?? this.easingMethod;
    }

    /**
     * Interpolation method used for this keyframe.
     */
    @serializable
    public interpMode = RealInterpMode.LINEAR;

    /**
     * Tangent weight mode.
     */
    @serializable
    public tangentWeightMode = TangentWeightMode.NONE;

    /**
     * Value of the keyframe.
     */
    @serializable
    public value = 0.0;

    /**
     * The (y component of) tangent of this keyframe
     * when it's used as starting point during cubic interpolation.
     * Meaningless otherwise.
     */
    @serializable
    public rightTangent = 0.0;

    /**
     * The x component tangent of this keyframe
     * when it's used as starting point during cubic interpolation.
     * Meaningless otherwise.
     */
    @serializable
    public rightTangentWeight = 0.0;

    /**
     * The (y component of) tangent of this keyframe
     * when it's used as ending point during cubic interpolation.
     * Meaningless otherwise.
     */
    @serializable
    public leftTangent = 0.0;

    /**
     * The x component of tangent of this keyframe
     * when it's used as starting point during cubic interpolation.
     * Meaningless otherwise.
     */
    @serializable
    public leftTangentWeight = 0.0;

    /**
     * @deprecated Reserved for backward compatibility. Will be removed in future.
     */
    @serializable
    public easingMethod = EasingMethod.LINEAR;
}

/**
 * Curve.
 */
@ccclass('cc.RealCurve')
export class RealCurve extends EditorExtendableMixin<KeyframeCurve<RealKeyframeValue>>(KeyframeCurve) {
    /**
     * Gets or sets the operation should be taken
     * if input time is less than the time of first keyframe when evaluating this curve.
     * Defaults to `ExtrapMode.CLAMP`.
     */
    get preExtrap () {
        return this._preExtrap;
    }

    set preExtrap (value) {
        this._preExtrap = value;
    }

    /**
     * Gets or sets the operation should be taken
     * if input time is greater than the time of last keyframe when evaluating this curve.
     * Defaults to `ExtrapMode.CLAMP`.
     */
    get postExtrap () {
        return this._postExtrap;
    }

    set postExtrap (value) {
        this._postExtrap = value;
    }

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
            const { _preExtrap: preExtrap } = this;
            const preValue = values[0];
            if (preExtrap === ExtrapMode.CLAMP || nFrames < 2) {
                return preValue.value;
            }
            switch (preExtrap) {
            case ExtrapMode.LINEAR:
                return linearTrend(firstTime, values[0].value, times[1], values[1].value, time);
            case ExtrapMode.LOOP:
                time = wrapRepeat(time, firstTime, lastTime);
                break;
            case ExtrapMode.PING_PONG:
                time = wrapPingPong(time, firstTime, lastTime);
                break;
            default:
                return preValue.value;
            }
        } else if (time > lastTime) {
            // Overflow
            const { _postExtrap: postExtrap } = this;
            const preFrame = values[nFrames - 1];
            if (postExtrap === ExtrapMode.CLAMP || nFrames < 2) {
                return preFrame.value;
            }
            switch (postExtrap) {
            case ExtrapMode.LINEAR:
                return linearTrend(lastTime, preFrame.value, times[nFrames - 2], values[nFrames - 2].value, time);
            case ExtrapMode.LOOP:
                time = wrapRepeat(time, firstTime, lastTime);
                break;
            case ExtrapMode.PING_PONG:
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
    public addKeyFrame (time: number, value: number | RealKeyframeValue): number {
        const keyframeValue = typeof value === 'number' ? new RealKeyframeValue({ value }) : value;
        return super.addKeyFrame(time, keyframeValue);
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
        dataView.setUint8(currentOffset, this._preExtrap); currentOffset += OVERFLOW_BYTES;
        dataView.setUint8(currentOffset, this._postExtrap); currentOffset += OVERFLOW_BYTES;

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
        this._preExtrap = dataView.getUint8(currentOffset); currentOffset += OVERFLOW_BYTES;
        this._postExtrap = dataView.getUint8(currentOffset); currentOffset += OVERFLOW_BYTES;

        // Frame count
        const nKeyframes = dataView.getUint32(currentOffset, true); currentOffset += FRAME_COUNT_BYTES;

        // Times
        const times = Array.from({ length: nKeyframes },
            (_, index) => dataView.getFloat32(currentOffset + TIME_BYTES * index, true));
        currentOffset += TIME_BYTES * nKeyframes;

        // Frame values
        const keyframeValues = new Array<RealKeyframeValue>(nKeyframes);
        for (let iKeyFrame = 0; iKeyFrame < nKeyframes; ++iKeyFrame) {
            const keyframeValue = new RealKeyframeValue({});
            currentOffset = loadRealKeyFrameValue(dataView, keyframeValue, currentOffset);
            keyframeValues[iKeyFrame] = keyframeValue;
        }

        assertIsTrue(currentOffset === bytes.byteLength);

        this._times = times;
        this._values = keyframeValues;
    }

    // Always sorted by time
    @serializable
    private _preExtrap: ExtrapMode = ExtrapMode.CLAMP;

    @serializable
    private _postExtrap: ExtrapMode = ExtrapMode.CLAMP;
}

const FLAGS_EASING_METHOD_BITS_START = 8;
const FLAG_EASING_METHOD_MASK = 0xFF << FLAGS_EASING_METHOD_BITS_START; // 8-16 bits

enum KeyframeValueFlagMask {
    VALUE = 1 << 0,
    INTERP_MODE = 1 << 1,
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
const INTERP_MODE_BYTES = 1;
const TANGENT_WEIGHT_MODE_BYTES = 1;
const LEFT_TANGENT_BYTES = 4;
const LEFT_TANGENT_WEIGHT_BYTES = 4;
const RIGHT_TANGENT_BYTES = 4;
const RIGHT_TANGENT_WEIGHT_BYTES = 4;

const {
    interpMode: DEFAULT_INTERP_MODE,
    tangentWeightMode: DEFAULT_TANGENT_WEIGHT_MODE,
    leftTangent: DEFAULT_LEFT_TANGENT,
    leftTangentWeight: DEFAULT_LEFT_TANGENT_WEIGHT,
    rightTangent: DEFAULT_RIGHT_TANGENT,
    rightTangentWeight: DEFAULT_RIGHT_TANGENT_WEIGHT,
} = new RealKeyframeValue({});

const REAL_KEY_FRAME_VALUE_MAX_SIZE = KEY_FRAME_VALUE_FLAGS_BYTES
    + VALUE_BYTES
    + INTERP_MODE_BYTES
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
        interpMode,
        tangentWeightMode,
        rightTangent,
        rightTangentWeight,
        leftTangent,
        leftTangentWeight,
        easingMethod,
    } = keyframeValue;

    dataView.setFloat32(currentOffset, value, true);
    currentOffset += VALUE_BYTES;

    if (interpMode !== DEFAULT_INTERP_MODE) {
        flags |= KeyframeValueFlagMask.INTERP_MODE;
        dataView.setUint8(currentOffset, interpMode);
        currentOffset += INTERP_MODE_BYTES;
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

    if (flags & KeyframeValueFlagMask.INTERP_MODE) {
        keyframeValue.interpMode = dataView.getUint8(currentOffset);
        currentOffset += INTERP_MODE_BYTES;
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
    switch (prevValue.interpMode) {
    default:
    case RealInterpMode.CONSTANT:
        return prevValue.value;
    case RealInterpMode.LINEAR: {
        const transformedRatio = prevValue.easingMethod === EasingMethod.LINEAR
            ? ratio
            : getEasingFn(prevValue.easingMethod)(ratio);
        return lerp(prevValue.value, nextValue.value, transformedRatio);
    }
    case RealInterpMode.CUBIC: {
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
            return bezierInterp(prevValue.value, p1, p2, nextValue.value, ratio);
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
            const y = bezierInterp(prevValue.value, u0y, u1y, nextValue.value, param);
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

function bezierInterp (p0: number, p1: number, p2: number, p3: number, t: number) {
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

type EasingMethodFn = (k: number) => number;

const easingMethodFnMap: Record<EasingMethod, EasingMethodFn> = {
    [EasingMethod.CONSTANT]: easing.constant,
    [EasingMethod.LINEAR]: easing.linear,

    [EasingMethod.QUAD_IN]: easing.quadIn,
    [EasingMethod.QUAD_OUT]: easing.quadOut,
    [EasingMethod.QUAD_IN_OUT]: easing.quadInOut,
    [EasingMethod.QUAD_OUT_IN]: easing.quadOutIn,
    [EasingMethod.CUBIC_IN]: easing.cubicIn,
    [EasingMethod.CUBIC_OUT]: easing.cubicOut,
    [EasingMethod.CUBIC_IN_OUT]: easing.cubicInOut,
    [EasingMethod.CUBIC_OUT_IN]: easing.cubicOutIn,
    [EasingMethod.QUART_IN]: easing.quartIn,
    [EasingMethod.QUART_OUT]: easing.quartOut,
    [EasingMethod.QUART_IN_OUT]: easing.quartInOut,
    [EasingMethod.QUART_OUT_IN]: easing.quartOutIn,
    [EasingMethod.QUINT_IN]: easing.quintIn,
    [EasingMethod.QUINT_OUT]: easing.quintOut,
    [EasingMethod.QUINT_IN_OUT]: easing.quintInOut,
    [EasingMethod.QUINT_OUT_IN]: easing.quintOutIn,
    [EasingMethod.SINE_IN]: easing.sineIn,
    [EasingMethod.SINE_OUT]: easing.sineOut,
    [EasingMethod.SINE_IN_OUT]: easing.sineInOut,
    [EasingMethod.SINE_OUT_IN]: easing.sineOutIn,
    [EasingMethod.EXPO_IN]: easing.expoIn,
    [EasingMethod.EXPO_OUT]: easing.expoOut,
    [EasingMethod.EXPO_IN_OUT]: easing.expoInOut,
    [EasingMethod.EXPO_OUT_IN]: easing.expoOutIn,
    [EasingMethod.CIRC_IN]: easing.circIn,
    [EasingMethod.CIRC_OUT]: easing.circOut,
    [EasingMethod.CIRC_IN_OUT]: easing.circInOut,
    [EasingMethod.CIRC_OUT_IN]: easing.circOutIn,
    [EasingMethod.ELASTIC_IN]: easing.elasticIn,
    [EasingMethod.ELASTIC_OUT]: easing.elasticOut,
    [EasingMethod.ELASTIC_IN_OUT]: easing.elasticInOut,
    [EasingMethod.ELASTIC_OUT_IN]: easing.elasticOutIn,
    [EasingMethod.BACK_IN]: easing.backIn,
    [EasingMethod.BACK_OUT]: easing.backOut,
    [EasingMethod.BACK_IN_OUT]: easing.backInOut,
    [EasingMethod.BACK_OUT_IN]: easing.backOutIn,
    [EasingMethod.BOUNCE_IN]: easing.bounceIn,
    [EasingMethod.BOUNCE_OUT]: easing.bounceOut,
    [EasingMethod.BOUNCE_IN_OUT]: easing.bounceInOut,
    [EasingMethod.BOUNCE_OUT_IN]: easing.bounceOutIn,
    [EasingMethod.SMOOTH]: easing.smooth,
    [EasingMethod.FADE]: easing.fade,
};

function getEasingFn (easingMethod: EasingMethod): EasingMethodFn {
    assertIsTrue(easingMethod in easingMethodFnMap);
    return easingMethodFnMap[easingMethod];
}
