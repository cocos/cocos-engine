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

import { Asset } from '../../../assets/asset';
import { ccclass, property } from '../../../core/data/class-decorator';
import { EventTargetFactory } from '../../../core/event/event-target-factory';
import { AudioPlayer, PlayingState } from './player';
import { AudioPlayerDOM } from './player-dom';
import { AudioPlayerWeb } from './player-web';

export const AudioType = {
    UNKNOWN_AUDIO: -1,
    WEB_AUDIO: 0,
    DOM_AUDIO: 1,
    WX_GAME_AUDIO: 2,
};

@ccclass('cc.AudioClip')
export class AudioClip extends EventTargetFactory(Asset) {

    public set _nativeAsset (clip: any) {
        this._audio = clip;
        if (clip) {
            let ctor: any;
            if (clip instanceof AudioBuffer) {
                ctor = AudioPlayerWeb;
                this._loadMode = AudioType.WEB_AUDIO;
            } else {
                ctor = AudioPlayerDOM;
                this._loadMode = AudioType.DOM_AUDIO;
            }
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

    public get _nativeAsset () {
        return this._audio;
    }

    get loadMode () {
        return this._loadMode;
    }

    get state () {
        return this._player ? this._player.getState() : PlayingState.INITIALIZING;
    }

    public static PlayingState = PlayingState;
    public static AudioType = AudioType;
    @property // we serialize this because it's unavailable at runtime on some platforms
    protected _duration = 0;
    @property(AudioType)
    protected _loadMode = AudioType.UNKNOWN_AUDIO;

    private _audio: any = null;
    private _player: AudioPlayer | null = null;

    public play () { if (this._player) { this._player.play(); } }
    public pause () { if (this._player) { this._player.pause(); } }
    public stop () { if (this._player) { this._player.stop(); } }
    public playOneShot (volume: number) { if (this._player) { this._player.playOneShot(volume); } }
    public setCurrentTime (val: number) { if (this._player) { this._player.setCurrentTime(val); } }
    public getCurrentTime () { if (this._player) { return this._player.getCurrentTime(); } return 0; }
    public getDuration () { if (this._player) { return this._player.getDuration(); } return this._duration; }
    public setVolume (val: number) { if (this._player) { this._player.setVolume(val); } }
    public getVolume () { if (this._player) { return this._player.getVolume(); } return 1; }
    public setLoop (val: boolean) { if (this._player) { this._player.setLoop(val); } }
    public getLoop () { if (this._player) { return this._player.getLoop(); } return false; }
}

cc.AudioClip = AudioClip;
