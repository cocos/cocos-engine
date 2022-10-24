/*
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

import { AudioClip } from '../../audio-clip';
import { AudioState } from '../../type';

/**
 * Link for action from one to another, for example play to pause, we treat action as AudioAction.PAUSE
 * Inner properties
 */
export interface TinyOLink<T, ACTION> {
    _src: T;
    _dst: T;
    _action: ACTION
}
export class TinyOGraph<T, ACTION> {
    _links: TinyOLink<T, ACTION>[] = [];
    findLink (src: T, dst: T, action: ACTION): TinyOLink<T, ACTION> | undefined {
        return this._links.find((lk): boolean => {
            if (lk._src === src && lk._dst === dst && lk._action === action) {
                return true;
            }
            return false;
        });
    }
    constructor (links: TinyOLink<T, ACTION>[]) {
        this._links = links;
    }
}

/**
 * Responsable to state change of AudioPlayer.
 * The dynamic path will update each time a link is added.
 */
export class DynamicPath<T, ACTION> {
    get currentNode (): T | null {
        return this._node;
    }
    _node: T | null = null;
    _graph : TinyOGraph<T, ACTION> | null = null;
    _dynamicPath: TinyOLink<T, ACTION>[] = [];
    _innerOperation:((action: ACTION) => void) | undefined = undefined;

    _updatePathWithLink (src: T, dst: T, action: ACTION) {
        /**
         * Expression: Only a link start from current state can be added into path. And then check the link existance.
         */
        if (this._graph && this._node === src && this._graph.findLink(src, dst, action) !== undefined) {
            this._node = dst;
            // Translatable
            for (let idx = 0; idx < this._dynamicPath.length; idx++) {
                const innerLink = this._graph.findLink(this._dynamicPath[idx]._src, dst, action);
                if (innerLink) {
                    this._dynamicPath.splice(idx, this._dynamicPath.length - idx);
                    this._dynamicPath.push(innerLink);

                    return;
                }
            }
            this._dynamicPath.push({ _src: src, _dst: dst, _action: action });
        }
    }
    // Immediatly apply state change
    _applyPath () {
        // Operate state changes.
        for (const link of this._dynamicPath) {
            this._innerOperation && this._innerOperation(link._action);
        }
        this._dynamicPath = [];
    }
    _applyOnePath () {
        if (this._dynamicPath.length > 0) {
            this._innerOperation && this._innerOperation(this._dynamicPath[0]._action);
            this._dynamicPath.splice(0, 1);
        }
    }
    _cleanPath () {
        this._dynamicPath = [];
    }
    // Hope this function will never be used.
    _forceSetNode (node : T) {
        this._node = node;
    }
}

// All actions are positive
export enum AudioAction {
    PLAY,
    PAUSE,
    STOP,
}

export const StateLinks = [
    { _src: AudioState.READY, _dst: AudioState.PLAYING, _action: AudioAction.PLAY },
    { _src: AudioState.PLAYING, _dst: AudioState.PLAYING, _action: AudioAction.PLAY },
    { _src: AudioState.PLAYING, _dst: AudioState.PAUSED, _action: AudioAction.PAUSE },
    { _src: AudioState.PLAYING, _dst: AudioState.STOPPED, _action: AudioAction.STOP },
    { _src: AudioState.PAUSED, _dst: AudioState.PLAYING, _action: AudioAction.PLAY },
    { _src: AudioState.PAUSED, _dst: AudioState.STOPPED, _action: AudioAction.STOP },
    { _src: AudioState.STOPPED, _dst: AudioState.PLAYING, _action: AudioAction.PLAY },
];

export const stateGraph = new TinyOGraph<AudioState, AudioAction>(StateLinks);

export interface Playable {
    set clip(clip: AudioClip);
    get clip(): AudioClip;
    set loop(loop: boolean);
    get loop(): boolean;
    set currentTime(time: number);
    get currentTime(): number;
    set volume(val: number);
    get volume(): number;
    set playbackRate(rate: number);
    get playbackRate(): number;
    set pan(pan: number);
    get pan(): number;
    get state(): AudioState;
    play();
    pause();
    stop();
}
