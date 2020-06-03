/*
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
 */

/**
 * @category component/audio
 */

import { Asset } from '../../core/assets/asset';
import { ccclass, property } from '../../core/data/class-decorator';
import { Enum } from '../../core/value-types';
import { AudioPlayer, PlayingState } from './player';
import { AudioPlayerDOM } from './player-dom';
import { AudioPlayerWeb } from './player-web';
import { legacyCC } from '../../core/global-exports';

export const AudioType = Enum({
    WEB_AUDIO: 0,
    DOM_AUDIO: 1,
    JSB_AUDIO: 2,
    UNKNOWN_AUDIO: 3,
});

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

    public static PlayingState = PlayingState;
    public static AudioType = AudioType;
    public static preventDeferredLoadDependents = true;

    @property
    protected _duration = 0; // we serialize this because it's unavailable at runtime on some platforms

    @property({ type: AudioType })
    protected _loadMode = AudioType.UNKNOWN_AUDIO;

    protected _audio: any = null;
    protected _player: AudioPlayer | null = null;

    constructor () {
        super();
        this.loaded = false;
    }

    public destroy () {
        if (this._player) { this._player.destroy(); }
        return super.destroy();
    }

    set _nativeAsset (clip: any) {
        this._audio = clip;
        if (clip) {
            const ctor = this._getPlayer(clip);
            this._player = new ctor({ clip, duration: this._duration, eventTarget: this });
            this.loaded = true;
            this.emit('load');
        } else {
            this._player = null;
            this._loadMode = AudioType.UNKNOWN_AUDIO;
            this._duration = 0;
            this.loaded = false;
        }
    }

    get _nativeAsset () {
        return this._audio;
    }

    get loadMode () {
        return this._loadMode;
    }

    get state () {
        return this._player ? this._player.getState() : PlayingState.INITIALIZING;
    }

    public play () { if (this._player) { this._player.play(); } }
    public pause () { if (this._player) { this._player.pause(); } }
    public stop () { if (this._player) { this._player.stop(); } }
    public playOneShot (volume: number) { if (this._player) { this._player.playOneShot(volume); } }
    public setCurrentTime (val: number) { if (this._player) { this._player.setCurrentTime(val); } }
    public getCurrentTime () { if (this._player) { return this._player.getCurrentTime(); } return 0; }
    public getDuration () { if (this._player) { return this._player.getDuration(); } return this._duration; }
    public setVolume (val: number, immediate?: boolean) { if (this._player) { this._player.setVolume(val, immediate || false); } }
    public getVolume () { if (this._player) { return this._player.getVolume(); } return 1; }
    public setLoop (val: boolean) { if (this._player) { this._player.setLoop(val); } }
    public getLoop () { if (this._player) { return this._player.getLoop(); } return false; }

    private _getPlayer (clip: any) {
        let ctor: any;
        if (typeof AudioBuffer !== 'undefined' && clip instanceof AudioBuffer) {
            ctor = AudioPlayerWeb;
            this._loadMode = AudioType.WEB_AUDIO;
        } else {
            ctor = AudioPlayerDOM;
            this._loadMode = AudioType.DOM_AUDIO;
        }
        return ctor;
    }
}

legacyCC.AudioClip = AudioClip;
