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
import { Component } from '../../components/component';
import { ccclass, menu, property } from '../../core/data/class-decorator';
import { AudioClip } from '../assets/audio/clip';

/**
 * A representation of a single audio source,
 * contains basic functionalities like play, pause and stop.
 */
@ccclass('cc.AudioSourceComponent')
@menu('Components/AudioSourceComponent')
export class AudioSourceComponent extends Component {
    @property(AudioClip)
    protected _clip: AudioClip | null = null;
    @property
    protected _loop = false;
    @property
    protected _playOnAwake = true;
    @property
    protected _volume = 1;

    private _cachedCurrentTime = 0;

    /**
     * The default AudioClip to play
     */
    @property({ type: AudioClip })
    set clip (val) {
      this._clip = val;
      this._syncStates();
    }
    get clip () {
        return this._clip;
    }

    /**
     * Is the audio clip looping?
     */
    @property({ type: Boolean })
    set loop (val) {
        this._loop = val;
        if (this._clip) { this._clip.setLoop(val); }
    }
    get loop () {
        return this._loop;
    }

    /**
     * Is the autoplay enabled?
     * Note that for the most time now the autoplay will only starts
     * after a user gesture is received, according to the latest autoplay policy:
     * https://www.chromium.org/audio-video/autoplay
     */
    @property({ type: Boolean })
    set playOnAwake (val) {
        this._playOnAwake = val;
    }
    get playOnAwake () {
        return this._playOnAwake;
    }

    /**
     * The volume of this audio source (0.0 to 1.0).
     */
    @property({ type: Number })
    set volume (val) {
        if (this._clip) {
            this._clip.setVolume(val);
            // on some platform volume control may not be available
            this._volume = this._clip.getVolume();
        } else {
            this._volume = val;
        }
    }
    get volume () {
        return this._volume;
    }

    public onLoad () {
        this._syncStates();
        if (this._playOnAwake) { this.play(); }
    }

    /**
     * Plays the clip
     */
    public play () {
        if (!this._clip) { return; }
        if (this.playing) { this.currentTime = 0; }
        else { this._clip.play(); }
    }

    /**
     * Pause the clip
     */
    public pause () {
        if (!this._clip) { return; }
        this._clip.pause();
    }

    /**
     * Stop the clip
     */
    public stop () {
        if (!this._clip) { return; }
        this._clip.stop();
    }

    /**
     * Plays an AudioClip, and scales volume by volumeScale.
     * @param clip - the clip being played
     * @param volumeScale - the scale of the volume (0-1).
     */
    public playOneShot (clip: AudioClip, volumeScale = 1) {
        clip.playOneShot(this._volume * volumeScale);
    }

    protected _syncStates () {
        if (!this._clip) { return; }
        this._clip.setCurrentTime(this._cachedCurrentTime);
        this._clip.setLoop(this._loop);
        this._clip.setVolume(this._volume, true);
        this._volume = this._clip.getVolume();
    }

    /**
     * set current playback time, in seconds
     * @param num the playback time you want to jump to
     */
    set currentTime (num: number) {
        this._cachedCurrentTime = num;
        if (!this._clip) { return; }
        this._clip.setCurrentTime(this._cachedCurrentTime);
    }

    /**
     * get the current playback time, in seconds
     * @returns time current playback time
     */
    get currentTime () {
        if (!this._clip) { return this._cachedCurrentTime; }
        return this._clip.getCurrentTime();
    }

    /**
     * get the audio duration, in seconds
     * @returns audio duration
     */
    get duration () {
        if (!this._clip) { return 0; }
        return this._clip.getDuration();
    }

    /**
     * get current audio state
     * @returns current audio state
     */
    get state () {
        if (!this._clip) { return AudioClip.PlayingState.INITIALIZING; }
        return this._clip.state;
    }

    /**
     * is the audio currently playing?
     */
    get playing () {
        return this.state === AudioClip.PlayingState.PLAYING;
    }
}
