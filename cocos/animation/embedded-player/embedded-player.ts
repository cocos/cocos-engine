/*
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
*/

import { ccclass, serializable } from 'cc.decorator';
import { EditorExtendable } from '../../core';
import type { Node } from '../../scene-graph';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}EmbeddedPlayer`)
export class EmbeddedPlayer extends EditorExtendable {
    /**
     * @en
     * Begin time, in seconds.
     * @zh
     * 开始时间，以秒为单位。
     */
    @serializable
    public begin = 0.0;

    /**
      * @en
      * End time, in seconds.
      * @zh
      * 结束时间，以秒为单位。
      */
    @serializable
    public end = 0.0;

    /**
      * @en
      * Whether the speed of this embedded player should be reconciled with the host animation clip.
      * @zh
      * 子区域的播放速度是否应和宿主动画剪辑保持一致。
      */
    @serializable
    public reconciledSpeed = false;

    /**
     * @en
     * Player of the embedded player.
     * @zh
     * 子区域的播放器。
     */
    @serializable
    public playable: EmbeddedPlayable | null = null;
}

export abstract class EmbeddedPlayable {
    /**
     * @en
     * Instantiates this sub region.
     * @zh
     * 实例化此子区域。
     * @param root The root node of animation context.
     * @internal
     */
    public abstract instantiate(root: Node): EmbeddedPlayableState | null;
}

export abstract class EmbeddedPlayableState {
    constructor (randomAccess: boolean) {
        this._randomAccess = randomAccess;
    }

    /**
     * @zh
     * 是否可以随意调整此播放器到任何时间。
     * @en
     * Indicates if this player can be adjusted to any time.
     */
    public get randomAccess (): boolean {
        return this._randomAccess;
    }

    /**
     * @zh
     * 销毁此播放器。
     * @zh
     * Destroys this player state.
     */
    public abstract destroy (): void;

    /**
     * @zh
     * 该方法在此播放器开始播放时触发。
     * @en
     * This method is called when this player gets to play.
     */
    public abstract play(): void;

    /**
     * @zh
     * 该方法在此播放器暂停播放时触发。
     * @en
     * This method is called when this player pauses.
     */
    public abstract pause(): void;

    /**
     * @zh
     * 该方法在此播放器结束播放时触发，或在宿主动画剪辑本身停止播放时触发。
     * @en
     * This method is called when this player ends its playback, and is called when the host animation clip is stopped.
     */
    public abstract stop(): void;

    /**
     * @zh
     * 如果 [[`EmbeddedPlayer.reconciledSpeed`]] 为 `true`，则在宿主的播放速度改变时触发。
     * @en
     * If [[`EmbeddedPlayer.reconciledSpeed`]] is `true`, is called when the host changes its speed.
     * @param speed The speed.
     */
    public abstract setSpeed(speed: number): void;

    public setTime (_time: number): void {
    }

    private declare _randomAccess: boolean;
}
