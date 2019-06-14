
import { ccenum } from '../core/value-types/enum';

export enum WrapModeMask {
    Loop = 1 << 1,
    ShouldWrap = 1 << 2,
    // Reserved: 1 << 3,
    PingPong = 1 << 4 | 1 << 1 | 1 << 2,  // Loop, ShouldWrap
    Reverse = 1 << 5 | 1 << 2,      // ShouldWrap
}

/**
 * 动画使用的循环模式。
 */
export enum WrapMode {
    /**
     * 向 Animation Component 或者 AnimationClip 查找 wrapMode
     */
    Default = 0,

    /**
     * 动画只播放一遍
     */
    Normal = 1,

    /**
     * 从最后一帧或结束位置开始反向播放，到第一帧或开始位置停止
     */
    Reverse = WrapModeMask.Reverse,

    /**
     * 循环播放
     */
    Loop = WrapModeMask.Loop,

    /**
     * 反向循环播放
     */
    LoopReverse = WrapModeMask.Loop | WrapModeMask.Reverse,

    /**
     * 从第一帧播放到最后一帧，然后反向播放回第一帧，到第一帧后再正向播放，如此循环
     */
    PingPong = WrapModeMask.PingPong,

    /**
     * 从最后一帧开始反向播放，其他同 PingPong
     */
    PingPongReverse = WrapModeMask.PingPong | WrapModeMask.Reverse,
}

ccenum(WrapMode);

/**
 * For internal
 */
export class WrappedInfo {
    public ratio = 0;
    public time = 0;
    public direction = 1;
    public stopped = true;
    public iterations = 0;
    public frameIndex: number = undefined as unknown as number;

    constructor (info?: WrappedInfo) {
        if (info) {
            this.set(info);
        }
    }

    public set (info: WrappedInfo) {
        this.ratio = info.ratio;
        this.time = info.time;
        this.direction = info.direction;
        this.stopped = info.stopped;
        this.iterations = info.iterations;
        this.frameIndex = info.frameIndex;
    }
}

export interface ILerpable {
    lerp (to: any, t: number, dt: number): any;
    getNoLerp? (): any;
}

export function isLerpable (object: any): object is ILerpable {
    return typeof object.lerp === 'function';
}
