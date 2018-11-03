/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

var WrapModeMask = {
    Loop: 1 << 1,
    ShouldWrap: 1 << 2,
    // Reserved: 1 << 3,
    PingPong: 1 << 4 | 1 << 1 | 1 << 2,  // Loop, ShouldWrap
    Reverse: 1 << 5 | 1 << 2,      // ShouldWrap
};

/**
 * !#en Specifies how time is treated when it is outside of the keyframe range of an Animation.
 * !#zh 动画使用的循环模式。
 * @enum WrapMode
 * @memberof cc
 */
var WrapMode = cc.Enum({

    /**
     * !#en Reads the default wrap mode set higher up.
     * !#zh 向 Animation Component 或者 AnimationClip 查找 wrapMode
     * @property {Number} Default
     */
    Default: 0,

    /**
     * !#en All iterations are played as specified.
     * !#zh 动画只播放一遍
     * @property {Number} Normal
     */
    Normal: 1,

    /**
     * !#en All iterations are played in the reverse direction from the way they are specified.
     * !#zh 从最后一帧或结束位置开始反向播放，到第一帧或开始位置停止
     * @property {Number} Reverse
     */
    Reverse: WrapModeMask.Reverse,

    /**
     * !#en When time reaches the end of the animation, time will continue at the beginning.
     * !#zh 循环播放
     * @property {Number} Loop
     */
    Loop: WrapModeMask.Loop,

    /**
     * !#en All iterations are played in the reverse direction from the way they are specified.
     * And when time reaches the start of the animation, time will continue at the ending.
     * !#zh 反向循环播放
     * @property {Number} LoopReverse
     */
    LoopReverse: WrapModeMask.Loop | WrapModeMask.Reverse,

    /**
     * !#en Even iterations are played as specified, odd iterations are played in the reverse direction from the way they
     * are specified.
     * !#zh 从第一帧播放到最后一帧，然后反向播放回第一帧，到第一帧后再正向播放，如此循环
     * @property {Number} PingPong
     */
    PingPong: WrapModeMask.PingPong,

    /**
     * !#en Even iterations are played in the reverse direction from the way they are specified, odd iterations are played
     * as specified.
     * !#zh 从最后一帧开始反向播放，其他同 PingPong
     * @property {Number} PingPongReverse
     */
    PingPongReverse: WrapModeMask.PingPong | WrapModeMask.Reverse
});

cc.WrapMode = WrapMode;

// For internal
function WrappedInfo (info) {
    if (info) {
        this.set(info);
        return;
    }

    this.ratio = 0;
    this.time = 0;
    this.direction = 1;
    this.stopped = true;
    this.iterations = 0;
    this.frameIndex = undefined;
}

WrappedInfo.prototype.set = function (info) {
    this.ratio = info.ratio;
    this.time = info.time;
    this.direction = info.direction;
    this.stopped = info.stopped;
    this.iterations = info.iterations;
    this.frameIndex = info.frameIndex;
};

module.exports = {
    WrapModeMask,
    WrapMode,
    WrappedInfo
};
