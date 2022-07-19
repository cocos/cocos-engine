/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { ccenum } from '../value-types/enum';

export enum WrapModeMask {
    Default = 0,
    Normal = 1 << 0,
    Loop = 1 << 1,
    ShouldWrap = 1 << 2,
    Clamp = 1 << 3,
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
    Default = WrapModeMask.Default,

    /**
     * 动画只播放一遍
     */
    Normal = WrapModeMask.Normal,

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
    /**
     * 在当前曲线值与目标曲线值之间插值。
     * @param to 目标曲线值。
     * @param t 插值比率。
     * @param dt 当前曲线值与目标曲线值的时间间隔，单位为秒。
     * @returns 插值结果。
     */
    lerp (to: any, t: number, dt: number): any;

    /**
     * 当直接使用曲线值作为采样结果时的结果值，它应该等同于插值比率为 0 时的插值结果。
     * @returns 插值比率为 0 时的插值结果。
     */
    getNoLerp? (): any;
}

export function isLerpable (object: any): object is ILerpable {
    return typeof object.lerp === 'function';
}
