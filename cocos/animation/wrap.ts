import { WrapModeMask } from '../core/geometry';
import { WrapMode, WrappedInfo } from './types';

export function wrap (
    elapsedTime: number,
    duration: number,
    wrapMode: WrapMode,
    repeatCount: number,
    negativeSpeed: boolean,
    info: WrappedInfo,
): WrappedInfo {
    if (duration === 0.0) {
        info.time = 0.0;
        info.ratio = 0.0;
        info.direction = 1.0;
        info.stopped = !!Number.isFinite(repeatCount);
        info.iterations = 0.0;
        return info;
    }

    let stopped = false;

    let currentIterations = elapsedTime > 0 ? (elapsedTime / duration) : -(elapsedTime / duration);
    if (currentIterations >= repeatCount) {
        currentIterations = repeatCount;

        stopped = true;
        let tempRatio = repeatCount - (repeatCount | 0);
        if (tempRatio === 0) {
            tempRatio = 1;  // 如果播放过，动画不复位
        }
        elapsedTime = tempRatio * duration * (elapsedTime > 0 ? 1 : -1);
    }

    if (elapsedTime > duration) {
        const tempTime = elapsedTime % duration;
        elapsedTime = tempTime === 0 ? duration : tempTime;
    } else if (elapsedTime < 0) {
        elapsedTime %= duration;
        if (elapsedTime !== 0) { elapsedTime += duration; }
    }

    let needReverse = false;
    const shouldWrap = wrapMode & WrapModeMask.ShouldWrap;
    if (shouldWrap) {
        needReverse = isReverseIteration(wrapMode, currentIterations);
    }

    let direction = needReverse ? -1 : 1;
    if (negativeSpeed) {
        direction *= -1;
    }

    // calculate wrapped time
    if (shouldWrap && needReverse) {
        elapsedTime = duration - elapsedTime;
    }

    info.time = elapsedTime;
    info.ratio = info.time / duration;
    info.direction = direction;
    info.stopped = stopped;
    info.iterations = currentIterations;

    return info;
}

function isReverseIteration (wrapMode: WrapMode, currentIterations: number): boolean {
    let needReverse = false;
    if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
        const isEnd = currentIterations - (currentIterations | 0) === 0;
        if (isEnd && (currentIterations > 0)) {
            currentIterations -= 1;
        }
        const isOddIteration = currentIterations & 1;
        if (isOddIteration) {
            needReverse = !needReverse;
        }
    }
    if ((wrapMode & WrapModeMask.Reverse) === WrapModeMask.Reverse) {
        needReverse = !needReverse;
    }
    return needReverse;
}
