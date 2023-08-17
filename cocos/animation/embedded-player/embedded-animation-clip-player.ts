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
import { errorID } from '../../core';
import type { Node } from '../../scene-graph/node';
import { AnimationClip } from '../animation-clip';
import { AnimationState } from '../animation-state';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { EmbeddedPlayableState, EmbeddedPlayable } from './embedded-player';

/**
 * @en
 * The embedded animation clip playable. The playable play animation clip on a embedded player.
 * @zh
 * 动画剪辑子区域播放器。此播放器在子区域上播放动画剪辑。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}EmbeddedAnimationClipPlayable`)
export class EmbeddedAnimationClipPlayable extends EmbeddedPlayable {
    /**
     * @en
     * Path to the node onto which the animation clip would be played, relative from animation context root.
     * @zh
     * 要播放动画剪辑的节点的路径，相对于动画上下文的根节点。
     */
    @serializable
    public path = '';

    /**
     * @en
     * The animation clip to play.
     * @zh
     * 要播放的动画剪辑。
     */
    @serializable
    public clip: AnimationClip | null = null;

    public instantiate (root: Node): EmbeddedAnimationClipPlayableState | null {
        const { clip, path } = this;
        if (!clip) {
            return null;
        }
        const clipRoot = root.getChildByPath(path);
        if (!clipRoot) {
            errorID(3938, path, root.getPathInHierarchy(), clip.name);
            return null;
        }
        const state = new AnimationState(clip);
        state.initialize(
            clipRoot,
        );
        return new EmbeddedAnimationClipPlayableState(state);
    }
}

class EmbeddedAnimationClipPlayableState extends EmbeddedPlayableState {
    constructor (animationState: AnimationState) {
        super(true);
        this._animationState = animationState;
    }

    public destroy (): void {
        this._animationState.destroy();
    }

    /**
     * Plays the animation state at specified time.
     */
    public play (): void {
        this._animationState.play();
    }

    /**
     * Pause the animation state.
     */
    public pause (): void {
        this._animationState.pause();
    }

    /**
     * Stops the animation state.
     */
    public stop (): void {
        this._animationState.stop();
    }

    /**
     * Sets the speed of the animation state.
     */
    public setSpeed (speed: number): void {
        this._animationState.speed = speed;
    }

    public setTime (time: number): void {
        this._animationState.time = time;
    }

    private _animationState: AnimationState;
}
