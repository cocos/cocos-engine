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

import { clamp } from '../../core/math/utils';
import { AudioPlayer, IAudioInfo, PlayingState } from './player';
import { legacyCC } from '../../core/global-exports';
import { createDomAudio } from '../audio-utils';
import { AudioManager } from './audio-manager';

type ManagedAudio = AudioPlayerDOM | HTMLAudioElement;
class AudioManagerDom extends AudioManager<ManagedAudio> {
    public discardOnePlayingIfNeeded () {
        if (this._playingAudios.length < AudioManager.maxAudioChannel) {
            return;
        }

        // a played audio has a higher priority than a played shot
        let audioToDiscard: ManagedAudio | undefined;
        const oldestOneShotIndex = this._playingAudios.findIndex((audio) => audio instanceof HTMLAudioElement);
        if (oldestOneShotIndex > -1) {
            audioToDiscard = this._playingAudios[oldestOneShotIndex] as HTMLAudioElement;
            this._playingAudios.splice(oldestOneShotIndex, 1);
            audioToDiscard.pause();
            audioToDiscard.src = '';
        } else {
            audioToDiscard = this._playingAudios.shift();
            (<AudioPlayerDOM>audioToDiscard)?.stop();
        }
    }
}
export class AudioPlayerDOM extends AudioPlayer {
    protected static _manager: AudioManagerDom = new AudioManagerDom();
    protected _volume = 1;
    protected _loop = false;
    protected _nativeAudio: HTMLAudioElement;
    protected _cbRegistered = false;

    private _remove_cb: () => void;
    private _post_play: () => void;
    private _on_gesture: () => void;
    private _post_gesture: () => void;

    constructor (info: IAudioInfo) {
        super(info);
        this._nativeAudio = info.nativeAudio;

        this._remove_cb = () => {
            if (!this._cbRegistered) { return; }
            legacyCC.game.canvas.removeEventListener('touchend', this._on_gesture);
            legacyCC.game.canvas.removeEventListener('mouseup', this._on_gesture);
            this._cbRegistered = false;
        };

        this._post_play = () => {
            this._state = PlayingState.PLAYING;
            this._clip.emit('started');
            this._remove_cb(); // should remove callbacks after any success play
            AudioPlayerDOM._manager.addPlaying(this);
        };

        this._post_gesture = () => {
            if (this._interrupted) { this._post_play(); this._interrupted = false; } else { this._nativeAudio.pause(); this._nativeAudio.currentTime = 0; }
        };

        this._on_gesture = () => {
            if (!this._nativeAudio) { return; }
            const promise = this._nativeAudio.play();
            if (!promise) { // Chrome50/Firefox53 below
                // delay eval here to yield uniform behavior with other platforms
                this._state = PlayingState.PLAYING;
                legacyCC.director.once(legacyCC.Director.EVENT_AFTER_UPDATE, this._post_gesture);
                return;
            }
            promise.then(this._post_gesture);
            this._remove_cb();
        };

        this._nativeAudio.volume = this._volume;
        this._nativeAudio.loop = this._loop;
        // callback on audio ended
        this._nativeAudio.addEventListener('ended', () => {
            this._state = PlayingState.STOPPED;
            this._nativeAudio.currentTime = 0;
            this._clip.emit('ended');
            AudioPlayerDOM._manager.removePlaying(this);
        });
        /* play & stop immediately after receiving a gesture so that
           we can freely invoke play() outside event listeners later */
        legacyCC.game.canvas.addEventListener('touchend', this._on_gesture);
        legacyCC.game.canvas.addEventListener('mouseup', this._on_gesture);
        this._cbRegistered = true;
    }

    public play () {
        if (!this._nativeAudio) { return; }
        if (this._blocking) { this._interrupted = true; return; }
        if (this._state === PlayingState.PLAYING) {
            /* sometimes there is no way to update the playing state
            especially when player unplug earphones and the audio automatically stops
            so we need to force updating the playing state by pausing audio */
            this.pause();
            // restart if already playing
            this.setCurrentTime(0);
        }
        AudioPlayerDOM._manager.discardOnePlayingIfNeeded();
        const promise = this._nativeAudio.play();
        if (!promise) {
            // delay eval here to yield uniform behavior with other platforms
            this._state = PlayingState.PLAYING;
            legacyCC.director.once(legacyCC.Director.EVENT_AFTER_UPDATE, this._post_play);
            return;
        }
        promise.then(this._post_play).catch(() => { this._interrupted = true; });
    }

    public pause () {
        if (!this._nativeAudio) { return; }
        this._interrupted = false;
        if (this._state !== PlayingState.PLAYING) { return; }
        this._nativeAudio.pause();
        this._state = PlayingState.STOPPED;
        AudioPlayerDOM._manager.removePlaying(this);
    }

    public stop () {
        if (!this._nativeAudio) { return; }
        this._nativeAudio.currentTime = 0; this._interrupted = false;
        if (this._state !== PlayingState.PLAYING) { return; }
        this._nativeAudio.pause();
        this._state = PlayingState.STOPPED;
        AudioPlayerDOM._manager.removePlaying(this);
    }

    public playOneShot (volume = 1) {
        createDomAudio(this._nativeAudio.src).then((dom) => {
            AudioPlayerDOM._manager.discardOnePlayingIfNeeded();
            dom.volume = volume;
            dom.play();
            AudioPlayerDOM._manager.addPlaying(dom);
            dom.addEventListener('ended', () => {
                AudioPlayerDOM._manager.removePlaying(dom);
            });
        }, (errMsg) => {
            console.error(errMsg);
        });
    }

    public setCurrentTime (val: number) {
        if (!this._nativeAudio) { return; }
        this._nativeAudio.currentTime = clamp(val, 0, this._duration);
    }

    public getCurrentTime () {
        return this._nativeAudio ? this._nativeAudio.currentTime : 0;
    }

    public setVolume (val: number, immediate: boolean) {
        this._volume = val;
        /* note this won't work for ios devices, for there
           is just no way to set HTMLMediaElement's volume */
        if (this._nativeAudio) { this._nativeAudio.volume = val; }
    }

    public getVolume () {
        if (this._nativeAudio) { return this._nativeAudio.volume; }
        return this._volume;
    }

    public setLoop (val: boolean) {
        this._loop = val;
        if (this._nativeAudio) { this._nativeAudio.loop = val; }
    }

    public getLoop () {
        return this._loop;
    }

    public destroy () {
        if (this._nativeAudio) { this._nativeAudio.src = ''; }
        super.destroy();
    }
}
