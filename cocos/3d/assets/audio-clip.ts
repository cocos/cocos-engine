/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { Asset } from '../../assets/asset';
import { ccclass, property } from '../../core/data/class-decorator';
import { EventTargetFactory } from '../../core/event/event-target-factory';

export const PlayingState = {
    INITIALIZING: 0,
    PLAYING: 1,
    STOPPED: 2,
};

export const AudioSourceType = {
    UNKNOWN_AUDIO: -1,
    /**
     * load through Web Audio API interface
     */
    WEB_AUDIO: 0,
    /**
     * load through an audio DOM element
     */
    DOM_AUDIO: 1,

    WX_GAME_AUDIO: 2,
};

@ccclass('cc.AudioClip')
export class AudioClip extends EventTargetFactory(Asset) {
    protected _audio: any = null;
    protected _state = PlayingState.INITIALIZING;

    @property // we serialize this because it's unavailable at runtime on some platforms
    protected _duration = 0;

    @property(AudioSourceType)
    protected _loadMode = AudioSourceType.UNKNOWN_AUDIO;

    public set _nativeAsset (clip: any) {
        this._audio = clip;
        if (clip) {
            this.loaded = true;
            this.emit('load');
            this._state = PlayingState.STOPPED;
        } else {
            this.loaded = false;
            this._state = PlayingState.INITIALIZING;
            this._duration = 0;
        }
    }
    public get _nativeAsset () {
        return this._audio;
    }

    get loadMode () {
        return this._loadMode;
    }

    get state () {
        return this._state;
    }
}

cc.AudioClip = AudioClip;
