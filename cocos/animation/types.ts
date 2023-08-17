/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { ccenum, geometry } from '../core';

/**
 * 动画使用的循环模式。
 */
export enum WrapMode {
    /**
     * 向 Animation Component 或者 AnimationClip 查找 wrapMode
     */
    Default = geometry.WrapModeMask.Default,

    /**
     * 动画只播放一遍
     */
    Normal = geometry.WrapModeMask.Normal,

    /**
     * 从最后一帧或结束位置开始反向播放，到第一帧或开始位置停止
     */
    Reverse = geometry.WrapModeMask.Reverse,

    /**
     * 循环播放
     */
    Loop = geometry.WrapModeMask.Loop,

    /**
     * 反向循环播放
     */
    LoopReverse = geometry.WrapModeMask.Loop | geometry.WrapModeMask.Reverse,

    /**
     * 从第一帧播放到最后一帧，然后反向播放回第一帧，到第一帧后再正向播放，如此循环
     */
    PingPong = geometry.WrapModeMask.PingPong,

    /**
     * 从最后一帧开始反向播放，其他同 PingPong
     */
    PingPongReverse = geometry.WrapModeMask.PingPong | geometry.WrapModeMask.Reverse,
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

    public set (info: WrappedInfo): void {
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
