import Enum  from '../../platform/CCEnum';
import { clamp, inverseLerp, pingPong, repeat } from '../../value-types';
import { ccclass , property} from '../../platform/CCClassDecorator';

const LOOK_FORWARD = 3;

/**
 * !#en The wrap mode
 * !#zh 循环模式
 * @static
 * @enum AnimationCurve.WrapMode
 */
const WrapMode = Enum({
    /**
     * !#en Default
     * !#zh 默认模式
     * @property Default
     * @readonly
     * @type {Number}
     */
    Default: 0,
    /**
     * !#en Once Mode
     * !#zh Once 模式
     * @property Once
     * @readonly
     * @type {Number}
     */
    Once: 1,
    /**
     * !#en Loop Mode
     * !#zh Loop 模式
     * @property Loop
     * @readonly
     * @type {Number}
     */
    Loop: 2,
    /**
     * !#en PingPong Mode
     * !#zh PingPong 模式
     * @property PingPong
     * @readonly
     * @type {Number}
     */
    PingPong: 3,
    /**
     * !#en ClampForever Mode
     * !#zh ClampForever 模式
     * @property ClampForever
     * @readonly
     * @type {Number}
     */
    ClampForever: 4,
});

@ccclass('cc.Keyframe')
export class Keyframe {
    /**
     * !#en Time.
     * !#zh 时间。
     * @property {Number} time
     */
    @property
    time = 0;
    /**
     * !#en Key value.
     * !#zh 关键值。
     * @property {Number} value
     */
    @property
    value = 0;
    /**
     * !#en In tangent value.
     * !#zh 左切值。
     * @property {Number} inTangent
     */
    @property
    inTangent = 0;
    /**
     * !#en Out tangent value.
     * !#zh 右切值。
     * @property {Number} outTangent
     */
    @property
    outTangent = 0;

    constructor (time, value, inTangent, outTangent) {
        this.time = time || 0;
        this.value = value || 0;
        this.inTangent = inTangent || 0;
        this.outTangent = outTangent || 0;
    }
}

export class OptimizedKey {
    index = 0;
    time = 0;
    endTime = 0;
    coefficient = null;

    constructor () {
        this.index = -1;
        this.time = 0;
        this.endTime = 0;
        this.coefficient = new Float32Array(4);
    }

    evaluate (T) {
        const t = T - this.time;
        return evalOptCurve(t, this.coefficient);
    }
}

export function evalOptCurve (t, coefs) {
    return (t * (t * (t * coefs[0] + coefs[1]) + coefs[2])) + coefs[3];
}

const defaultKFStart = new Keyframe(0, 1, 0, 0);
const defaultKFEnd = new Keyframe(1, 1, 0, 0);


/**
 * !#en The animation curve of 3d particle.
 * !#zh 3D 粒子动画曲线
 * @class AnimationCurve
 */
@ccclass('cc.AnimationCurve')
export class AnimationCurve {
    /**
     * !#en Array of key value.
     * !#zh 关键值列表。
     * @property {[Keyframe]} keyFrames
     */
    @property({
        type: [Keyframe],
    })
    keyFrames = new Array();
    /**
     * !#en Pre-wrap mode.
     * !#zh 前置循环模式。
     * @property {WrapMode} preWrapMode
     */
    @property({
        type: cc.Enum(WrapMode),
        visible: false,
    })
    preWrapMode = WrapMode.ClampForever;
    /**
     * !#en Post-wrap mode.
     * !#zh 后置循环模式。
     * @property {WrapMode} postWrapMode
     */
    @property({
        type: cc.Enum(WrapMode),
        visible: false,
    })
    postWrapMode = WrapMode.ClampForever;

    cachedKey = null;

    constructor (keyFrames = null) {
        if (keyFrames) {
            this.keyFrames = keyFrames
        } else {
            this.keyFrames.push(defaultKFStart);
            this.keyFrames.push(defaultKFEnd);
        }
        this.cachedKey = new OptimizedKey();
    }

    addKey (keyFrame) {
        if (this.keyFrames == null) {
            this.keyFrames = [];
        }
        this.keyFrames.push(keyFrame);
    }

    // cubic Hermite spline
    evaluate_slow (time) {
        let wrappedTime = time;
        const wrapMode = time < 0 ? this.preWrapMode : this.postWrapMode;
        const startTime = this.keyFrames[0].time;
        const endTime = this.keyFrames[this.keyFrames.length - 1].time;
        switch (wrapMode) {
            case WrapMode.Loop:
                wrappedTime = repeat(time - startTime, endTime - startTime) + startTime;
                break;
            case WrapMode.PingPong:
                wrappedTime = pingPong(time - startTime, endTime - startTime) + startTime;
                break;
            case WrapMode.ClampForever:
                wrappedTime = clamp(time, startTime, endTime);
                break;
        }
        let preKFIndex = 0;
        if (wrappedTime > this.keyFrames[0].time) {
            if (wrappedTime >= this.keyFrames[this.keyFrames.length - 1].time) {
                preKFIndex = this.keyFrames.length - 2;
            }
            else {
                for (let i = 0; i < this.keyFrames.length - 1; i++) {
                    if (wrappedTime >= this.keyFrames[0].time && wrappedTime <= this.keyFrames[i + 1].time) {
                        preKFIndex = i;
                        break;
                    }
                }
            }
        }
        const keyframe0 = this.keyFrames[preKFIndex];
        const keyframe1 = this.keyFrames[preKFIndex + 1];

        const t = inverseLerp(keyframe0.time, keyframe1.time, wrappedTime);
        const dt = keyframe1.time - keyframe0.time;

        const m0 = keyframe0.outTangent * dt;
        const m1 = keyframe1.inTangent * dt;

        const t2 = t * t;
        const t3 = t2 * t;

        const a = 2 * t3 - 3 * t2 + 1;
        const b = t3 - 2 * t2 + t;
        const c = t3 - t2;
        const d = -2 * t3 + 3 * t2;

        return a * keyframe0.value + b * m0 + c * m1 + d * keyframe1.value;
    }

    evaluate (time) {
        let wrappedTime = time;
        const wrapMode = time < 0 ? this.preWrapMode : this.postWrapMode;
        const startTime = this.keyFrames[0].time;
        const endTime = this.keyFrames[this.keyFrames.length - 1].time;
        switch (wrapMode) {
            case WrapMode.Loop:
                wrappedTime = repeat(time - startTime, endTime - startTime) + startTime;
                break;
            case WrapMode.PingPong:
                wrappedTime = pingPong(time - startTime, endTime - startTime) + startTime;
                break;
            case WrapMode.ClampForever:
                wrappedTime = clamp(time, startTime, endTime);
                break;
        }
        if (!CC_EDITOR) {
            if (wrappedTime >= this.cachedKey.time && wrappedTime < this.cachedKey.endTime) {
                return this.cachedKey.evaluate(wrappedTime);
            }
        }
        const leftIndex = this.findIndex(this.cachedKey, wrappedTime);
        const rightIndex = Math.min(leftIndex + 1, this.keyFrames!.length - 1);
        this.calcOptimizedKey(this.cachedKey, leftIndex, rightIndex);
        return this.cachedKey.evaluate(wrappedTime);
    }

    calcOptimizedKey (optKey, leftIndex, rightIndex) {
        const lhs = this.keyFrames[leftIndex];
        const rhs = this.keyFrames[rightIndex];
        optKey.index = leftIndex;
        optKey.time = lhs.time;
        optKey.endTime = rhs.time;

        const dx = rhs.time - lhs.time;
        const dy = rhs.value - lhs.value;
        const length = 1 / (dx * dx);
        const d1 = lhs.outTangent * dx;
        const d2 = rhs.inTangent * dx;

        optKey.coefficient[0] = (d1 + d2 - dy - dy) * length / dx;
        optKey.coefficient[1] = (dy + dy + dy - d1 - d1 - d2) * length;
        optKey.coefficient[2] = lhs.outTangent;
        optKey.coefficient[3] = lhs.value;
    }

    findIndex (optKey, t) {
        const cachedIndex = optKey.index;
        if (cachedIndex !== -1) {
            const cachedTime = this.keyFrames![cachedIndex].time;
            if (t > cachedTime) {
                for (let i = 0; i < LOOK_FORWARD; i++) {
                    const currIndex = cachedIndex + i;
                    if (currIndex + 1 < this.keyFrames!.length && this.keyFrames![currIndex + 1].time > t) {
                        return currIndex;
                    }
                }
            } else {
                for (let i = 0; i < LOOK_FORWARD; i++) {
                    const currIndex = cachedIndex - i;
                    if ((currIndex - 1) >= 0 && this.keyFrames![currIndex - 1].time <= t) {
                        return currIndex - 1;
                    }
                }
            }
        }
        let left = 0;
        let right = this.keyFrames!.length;
        let mid;
        while (right - left > 1) {
            mid = Math.floor((left + right) / 2);
            if (this.keyFrames![mid].time >= t) {
                right = mid;
            } else {
                left = mid;
            }
        }
        return left;
    }
}

cc.Keyframe = Keyframe;
cc.AnimationCurve = AnimationCurve;