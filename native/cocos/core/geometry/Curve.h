/****************************************************************************
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
****************************************************************************/

#pragma once

namespace cc {
namespace geometry {

constexpr auto LOOK_FORWARD = 3;

/**
 * @en
 * A key frame in the curve.
 * @zh
 * 曲线中的一个关键帧。
 */
struct Keyframe {
    /**
     * @en Current frame time.
     * @zh 当前帧时间。
     */
    float time = 0;

    /**
     * @en Current frame value.
     * @zh 当前帧的值。
     */
    float value = 0;

    /**
     * @en In tangent value.
     * @zh 左切线。
     */
    float inTangent = 0;

    /**
     * @en Out tangent value.
     * @zh 右切线。
     */
    float outTangent = 0;
};

float evalOptCurve(float t, const ccstd::vector<float> &coefs);

struct OptimizedKey {
    float index;
    float time;
    float endTime;
    ccstd::vector<float> coefficient;
    OptimizedKey() {
        index = -1;
        time = 0;
        endTime = 0;
        coefficient.resize(4);
    }
    static float evaluate(float t);
};

/**
 * @en
 * Describe a curve in which three times Hermite interpolation is used for each adjacent key frame.
 * @zh
 * 描述一条曲线，其中每个相邻关键帧采用三次hermite插值计算。
 */
class AnimationCurve {
    // @serializable
private:
    // _curve ! : RealCurve;

public:
    static ccstd::vector<KeyFrame> defaultKF = [ {
                                                    time : 0,
                                                    value : 1,
                                                    inTangent : 0,
                                                    outTangent : 0,
                                                },
                                                 {
                                                     time : 1,
                                                     value : 1,
                                                     inTangent : 0,
                                                     outTangent : 0,
                                                 } ];

    /**
     * For internal usage only.
     * @internal
     */
    get _internalCurve() {
        return this._curve;
    }

    /**
     * @en
     * The key frame of the curve.
     * @zh
     * 曲线的关键帧。
     */
    auto getKeyFrames() {
        return Array.from(this._curve.keyframes()).map(([ time, value ]) = > {
            const legacyKeyframe = ccnew Keyframe();
            legacyKeyframe.time = time;
            legacyKeyframe.value = value.value;
            legacyKeyframe.inTangent = value.leftTangent;
            legacyKeyframe.outTangent = value.rightTangent;
            return legacyKeyframe;
        });
    }

    void setKeyFrames(value) {
        this._curve.assignSorted(value.map((legacyCurve) = > [
            legacyCurve.time,
            {
                interpolationMode : RealInterpolationMode.CUBIC,
                value : legacyCurve.value,
                leftTangent : legacyCurve.inTangent,
                rightTangent : legacyCurve.outTangent,
            },
        ]));
    }

    /**
     * @en
     * Loop mode [[WrapMode]] when the sampling time exceeds the left end.
     * @zh
     * 当采样时间超出左端时采用的循环模式[[WrapMode]]。
     */
    auto getPreWrapMode() {
        return toLegacyWrapMode(this._curve.preExtrapolation);
    }

    void sPreWrapMode(value) {
        this._curve.preExtrapolation = fromLegacyWrapMode(value);
    }

    /**
     * @en
     * Cycle mode [[WrapMode]] when the sampling time exceeds the right end.
     * @zh
     * 当采样时间超出右端时采用的循环模式[[WrapMode]]。
     */
    get postWrapMode() {
        return toLegacyWrapMode(this._curve.postExtrapolation);
    }

    set postWrapMode(value) {
        this._curve.postExtrapolation = fromLegacyWrapMode(value);
    }

private
    cachedKey : OptimizedKey;

    /**
     * 构造函数。
     * @param keyFrames 关键帧。
     */
    constructor(keyFrames
                : Keyframe[] | null | RealCurve = null) {
        if (keyFrames instanceof RealCurve) {
            this._curve = keyFrames;
        } else {
            const curve = ccnew RealCurve();
            this._curve = curve;
            curve.preExtrapolation = ExtrapolationMode.LOOP;
            curve.postExtrapolation = ExtrapolationMode.CLAMP;
            if (!keyFrames) {
                curve.assignSorted([
                    [ 0.0, {interpolationMode : RealInterpolationMode.CUBIC, value : 1.0} ],
                    [ 1.0, {interpolationMode : RealInterpolationMode.CUBIC, value : 1.0} ],
                ]);
            } else {
                curve.assignSorted(keyFrames.map((legacyKeyframe) = > [ legacyKeyframe.time, {
                                                                           interpolationMode : RealInterpolationMode.CUBIC,
                                                                           value : legacyKeyframe.value,
                                                                           leftTangent : legacyKeyframe.inTangent,
                                                                           rightTangent : legacyKeyframe.outTangent,
                                                                       } ]));
            }
        }
        this.cachedKey = ccnew OptimizedKey();
    }

    /**
     * @en
     * Add a keyframe.
     * @zh
     * 添加一个关键帧。
     * @param keyFrame 关键帧。
     */
public
    addKey(keyFrame
           : Keyframe | null) {
        if (!keyFrame) {
            this._curve.clear();
        } else {
            this._curve.addKeyFrame(keyFrame.time, {
                interpolationMode : RealInterpolationMode.CUBIC,
                value : keyFrame.value,
                leftTangent : keyFrame.inTangent,
                rightTangent : keyFrame.outTangent,
            });
        }
    }

    /**
     * @ignore
     * @param time
     */
public
    evaluate_slow(time
                  : number) {
        return this._curve.evaluate(time);
    }

    /**
     * @en
     * Calculate the curve interpolation at a given point in time.
     * @zh
     * 计算给定时间点的曲线插值。
     * @param time 时间。
     */
public
    evaluate(time
             : number) {
        const {cachedKey, _curve : curve} = this;
        const nKeyframes = curve.keyFramesCount;
        const lastKeyframeIndex = nKeyframes - 1;
        let wrappedTime = time;
        const extrapolationMode = time < 0 ? curve.preExtrapolation : curve.postExtrapolation;
        const startTime = curve.getKeyframeTime(0);
        const endTime = curve.getKeyframeTime(lastKeyframeIndex);
        switch (extrapolationMode) {
            case ExtrapolationMode.LOOP:
                wrappedTime = repeat(time - startTime, endTime - startTime) + startTime;
                break;
            case ExtrapolationMode.PING_PONG:
                wrappedTime = pingPong(time - startTime, endTime - startTime) + startTime;
                break;
            case ExtrapolationMode.CLAMP:
            default:
                wrappedTime = clamp(time, startTime, endTime);
                break;
        }
        if (wrappedTime >= cachedKey.time && wrappedTime < cachedKey.endTime) {
            return cachedKey.evaluate(wrappedTime);
        }
        const leftIndex = this.findIndex(cachedKey, wrappedTime);
        const rightIndex = Math.min(leftIndex + 1, lastKeyframeIndex);
        this.calcOptimizedKey(cachedKey, leftIndex, rightIndex);
        return cachedKey.evaluate(wrappedTime);
    }

    /**
     * @ignore
     * @param optKey
     * @param leftIndex
     * @param rightIndex
     */
public
    calcOptimizedKey(optKey
                     : OptimizedKey, leftIndex
                     : number, rightIndex
                     : number) {
        const lhsTime = this._curve.getKeyframeTime(leftIndex);
        const rhsTime = this._curve.getKeyframeTime(rightIndex);
        const {value : lhsValue, leftTangent : lhsOutTangent} = this._curve.getKeyframeValue(leftIndex);
        const {value : rhsValue, rightTangent : rhsInTangent} = this._curve.getKeyframeValue(rightIndex);
        optKey.index = leftIndex;
        optKey.time = lhsTime;
        optKey.endTime = rhsTime;

        const dx = rhsTime - lhsTime;
        const dy = rhsValue - lhsValue;
        const length = 1 / (dx * dx);
        const d1 = lhsOutTangent * dx;
        const d2 = rhsInTangent * dx;

        optKey.coefficient[0] = (d1 + d2 - dy - dy) * length / dx;
        optKey.coefficient[1] = (dy + dy + dy - d1 - d1 - d2) * length;
        optKey.coefficient[2] = lhsOutTangent;
        optKey.coefficient[3] = lhsValue;
    }

    /**
     * @ignore
     * @param optKey
     * @param t
     */
private
    findIndex(optKey
              : OptimizedKey, t
              : number) {
        const {_curve : curve} = this;
        const nKeyframes = curve.keyFramesCount;
        const cachedIndex = optKey.index;
        if (cachedIndex != = -1) {
            const cachedTime = curve.getKeyframeTime(cachedIndex);
            if (t > cachedTime) {
                for (let i = 0; i < LOOK_FORWARD; i++) {
                    const currIndex = cachedIndex + i;
                    if (currIndex + 1 < nKeyframes && curve.getKeyframeTime(currIndex + 1) > t) {
                        return currIndex;
                    }
                }
            } else {
                for (let i = 0; i < LOOK_FORWARD; i++) {
                    const currIndex = cachedIndex - i;
                    if (currIndex >= 0 && curve.getKeyframeTime(currIndex - 1) <= t) {
                        return currIndex - 1;
                    }
                }
            }
        }
        let left = 0;
        let right = nKeyframes;
        let mid;
        while (right - left > 1) {
            mid = Math.floor((left + right) / 2);
            if (curve.getKeyframeTime(mid) >= t) {
                right = mid;
            } else {
                left = mid;
            }
        }
        return left;
    }
}

function
fromLegacyWrapMode(legacyWrapMode
                   : WrapModeMask) : ExtrapolationMode {
    switch (legacyWrapMode) {
        default:
        case WrapModeMask.Default:
        case WrapModeMask.Normal:
        case WrapModeMask.Clamp: return ExtrapolationMode.CLAMP;
        case WrapModeMask.PingPong: return ExtrapolationMode.PING_PONG;
        case WrapModeMask.Loop: return ExtrapolationMode.LOOP;
    }
}

function toLegacyWrapMode(extrapolationMode
                          : ExtrapolationMode) : WrapModeMask {
    switch (extrapolationMode) {
        default:
        case ExtrapolationMode.LINEAR:
        case ExtrapolationMode.CLAMP: return WrapModeMask.Clamp;
        case ExtrapolationMode.PING_PONG: return WrapModeMask.PingPong;
        case ExtrapolationMode.LOOP: return WrapModeMask.Loop;
    }
}

/**
 * Same as but more effective than `new LegacyCurve()._internalCurve`.
 */
export function constructLegacyCurveAndConvert() {
    const curve = ccnew RealCurve();
    curve.assignSorted([
        [ 0.0, {interpolationMode : RealInterpolationMode.CUBIC, value : 1.0} ],
        [ 1.0, {interpolationMode : RealInterpolationMode.CUBIC, value : 1.0} ],
    ]);
    return curve;
}

} // namespace geometry
} // namespace cc