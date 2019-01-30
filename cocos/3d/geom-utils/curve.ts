import { CCClass } from '../../core/data';
import { Enum } from '../../core/value-types';
import { clamp, inverseLerp, pingPong, repeat } from '../../core/vmath';

const LOOK_FORWARD = 3;

const WrapMode = Enum({
    Default: 0,
    Once: 1,
    Loop: 2,
    PingPong: 3,
    ClampForever: 4,
});

export class Keyframe {

    public time = 0;

    public value = 0;

    public inTangent = 0;

    public outTangent = 0;
}

CCClass.fastDefine('cc.Keyframe', Keyframe, {
    time: 0,
    value: 0,
    inTangent: 0,
    outTangent: 0,
});

export class OptimizedKey {
    public index: number;
    public time: number;
    public endTime: number;
    public coefficient: Float32Array;
    constructor () {
        this.index = -1;
        this.time = 0;
        this.endTime = 0;
        this.coefficient = new Float32Array(4);
    }

    public evaluate (T: number) {
        const t = T - this.time;
        return evalOptCurve(t, this.coefficient);
    }
}

export function evalOptCurve (t: number, coefs: Float32Array | number[]) {
    return (t * (t * (t * coefs[0] + coefs[1]) + coefs[2])) + coefs[3];
}

export class AnimationCurve {

    public keyFrames: Keyframe[] | null;

    public preWrapMode: number = WrapMode.Loop;

    public postWrapMode: number = WrapMode.Loop;

    private cachedKey: OptimizedKey;

    private static defaultKF: Keyframe[] = [{
        time: 0,
        value: 1,
        inTangent: 0,
        outTangent: 0,
    }, {
        time: 1,
        value: 1,
        inTangent: 0,
        outTangent: 0,
    }];

    constructor (keyFrames: Keyframe[] | null = null) {
        this.keyFrames = keyFrames || ([] as Keyframe[]).concat(AnimationCurve.defaultKF);
        this.cachedKey = new OptimizedKey();
    }

    public addKey (keyFrame: Keyframe) {
        if (this.keyFrames == null) {
            this.keyFrames = [];
        }
        this.keyFrames.push(keyFrame);
    }

    // cubic Hermite spline
    public evaluate_slow (time: number) {
        let wrappedTime = time;
        const wrapMode = time < 0 ? this.preWrapMode : this.postWrapMode;
        const startTime = this.keyFrames![0].time;
        const endTime = this.keyFrames![this.keyFrames!.length - 1].time;
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
        if (wrappedTime > this.keyFrames![0].time) {
            if (wrappedTime >= this.keyFrames![this.keyFrames!.length - 1].time) {
                preKFIndex = this.keyFrames!.length - 2;
            }
            else {
                for (let i = 0; i < this.keyFrames!.length - 1; i++) {
                    if (wrappedTime >= this.keyFrames![0].time && wrappedTime <= this.keyFrames![i + 1].time) {
                        preKFIndex = i;
                        break;
                    }
                }
            }
        }
        const keyframe0 = this.keyFrames![preKFIndex];
        const keyframe1 = this.keyFrames![preKFIndex + 1];

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

    public evaluate (time: number) {
        let wrappedTime = time;
        const wrapMode = time < 0 ? this.preWrapMode : this.postWrapMode;
        const startTime = this.keyFrames![0].time;
        const endTime = this.keyFrames![this.keyFrames!.length - 1].time;
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
        if (wrappedTime >= this.cachedKey.time && wrappedTime < this.cachedKey.endTime) {
            return this.cachedKey.evaluate(wrappedTime);
        } else {
            const leftIndex = this.findIndex(this.cachedKey, wrappedTime);
            let rightIndex = leftIndex + 1;
            if (rightIndex === this.keyFrames!.length) {
                rightIndex -= 1;
            }
            this.calcOptimizedKey(this.cachedKey, leftIndex, rightIndex);
            return this.cachedKey.evaluate(wrappedTime);
        }
    }

    public calcOptimizedKey (optKey: OptimizedKey, leftIndex: number, rightIndex: number) {
        const lhs = this.keyFrames![leftIndex];
        const rhs = this.keyFrames![rightIndex];
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

    private findIndex (optKey: OptimizedKey, t: number) {
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
                    if (currIndex >= 0 && this.keyFrames![currIndex - 1].time <= t) {
                        return currIndex - 1;
                    }
                }
            }
        }
        let left = 0;
        let right = this.keyFrames!.length;
        let mid = Math.floor((left + right) / 2);
        while (right - left > 1) {
            if (this.keyFrames![mid].time >= t) {
                right = mid;
            } else {
                left = mid + 1;
            }
            mid = Math.floor((left + right) / 2);
        }
        return left;
    }
}

CCClass.fastDefine('cc.AnimationCurve', AnimationCurve, {
    preWrapMode: WrapMode.Default,
    postWrapMode: WrapMode.Default,
    keyFrames: [],
});
