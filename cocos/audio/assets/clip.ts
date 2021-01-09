/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module component/audio
 */

import {
    ccclass, type, serializable, override,
} from 'cc.decorator';
import { Asset } from '../../core/assets/asset';
import { legacyCC } from '../../core/global-exports';
import { AudioState, AudioType } from 'pal/audio/type';
import { AudioPlayer } from 'pal:audio';

/**
 * @en
 * The audio clip asset. <br>
 * 'started' event is emitted once the audio began to play. <br>
 * 'ended' event is emitted once the audio stopped. <br>
 * Low-level platform-specific details are handled independently inside each clip.
 * @zh
 * 音频片段资源。<br>
 * 每当音频片段实际开始播放时，会发出 'started' 事件；<br>
 * 每当音频片段自然结束播放时，会发出 'ended' 事件。<br>
 * 每个片段独立处理自己依赖的平台相关的底层细节。
 */
@ccclass('cc.AudioClip')
export class AudioClip extends Asset {
    public static AudioState = AudioState;  // TODO:  PlayingState
    public static AudioType = AudioType;
    public static preventDeferredLoadDependents = true;

    @serializable
    protected _duration = 0; // we serialize this because it's unavailable at runtime on some platforms

    protected _loadMode = AudioType.UNKNOWN_AUDIO;

    protected _player: AudioPlayer | null = null;

    constructor () {
        super();
        this.loaded = false;
    }

    public destroy () {
        if (this._player) { this._player.destroy(); }
        return super.destroy();
    }

    set _nativeAsset (player: AudioPlayer | null) {
        this._player = player;
        if (player) {
            this.loaded = true;
            this._loadMode = player.type;
            this.emit('load');
        } else {
            this._player = null;
            this._loadMode = AudioType.UNKNOWN_AUDIO;
            this._duration = 0;
            this.loaded = false;
        }
    }

    get _nativeAsset () {
        return this._player;
    }

    @override
    get _nativeDep () {
        return {
            uuid: this._uuid,
            audioLoadMode: this.loadMode,
            ext: this._native,
            __isNative__: true,
        };
    }

    get loadMode () {
        return this._loadMode;
    }

    // TODO: deprecated

    // get state () {
    //     return this._player ? this._player.state : AudioState.INIT;
    // }

    public getDuration () { return this._player ? this._player.duration : this._duration; }
    // public play () { if (this._player) { this._player.play(); } }
    // public pause () { if (this._player) { this._player.pause(); } }
    // public stop () { if (this._player) { this._player.stop(); } }
    // public playOneShot (volume: number = 1) { if (this._player) { this._player.playOneShot(volume); } }
    // public setCurrentTime (val: number) { if (this._player) { this._player.seek(val); } }
    // public getCurrentTime () { return this._player ? this._player.currentTime : 0; }
    // public setVolume (val: number) { this._player && (this._player.volume = val); }
    // public getVolume () { return this._player ? this._player.volume : 1; }
    // public setLoop (val: boolean) { this._player && (this._player.loop = val); }
    // public getLoop () { this._player ? this._player.loop : false; }
}

legacyCC.AudioClip = AudioClip;
