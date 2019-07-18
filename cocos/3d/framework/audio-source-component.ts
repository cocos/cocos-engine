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

import { Component } from '../../components/component';
import { ccclass, menu, property } from '../../core/data/class-decorator';
import { clamp } from '../../core/value-types';
import { AudioClip } from '../assets/audio/clip';

/**
 * @en
 * A representation of a single audio source,
 * contains basic functionalities like play, pause and stop.
 * @zh
 * 音频组件，代表单个音源，提供播放、暂停、停止等基本功能。<br>
 * 用户可通过 cc.AudioSourceComponent 调用此类。
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
     * @en
     * The default AudioClip to play
     * @zh
     * 设定要播放的音频。
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
     * @en
     * Is the audio clip looping?
     * @zh
     * 是否循环播放音频？
     */
    @property
    set loop (val) {
        this._loop = val;
        if (this._clip) { this._clip.setLoop(val); }
    }
    get loop () {
        return this._loop;
    }

    /**
     * @en
     * Is the autoplay enabled? <br>
     * Note that for the most time now the autoplay will only starts <br>
     * after a user gesture is received, according to the latest autoplay policy: <br>
     * https://www.chromium.org/audio-video/autoplay
     * @zh
     * 是否启用自动播放。 <br>
     * 请注意，根据最新的自动播放策略，现在大部分时候，自动播放只会在第一次收到用户输入后生效。 <br>
     * 参考：https://www.chromium.org/audio-video/autoplay
     */
    @property
    set playOnAwake (val) {
        this._playOnAwake = val;
    }
    get playOnAwake () {
        return this._playOnAwake;
    }

    /**
     * @en
     * The volume of this audio source (0.0 to 1.0).
     * @zh
     * 音频的音量（大小范围为 0.0 到 1.0 ）。
     *
     * 请注意,在某些平台上，音量控制可能不起效。<br>
     */
    @property
    set volume (val) {
        if (isNaN(val)) { console.warn('illegal audio volume!'); return; }
        val = clamp(val, 0, 1);
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
     * @en
     * Plays the clip
     * @zh
     * 开始播放音频。
     *
     * 如果音频处于正在播放状态，将会重新开始播放音频。 <br>
     * 如果音频处于暂停状态，则会继续播放音频。
     */
    public play () {
        if (!this._clip) { return; }
        if (this.playing) { this.currentTime = 0; }
        else { this._clip.play(); }
    }

    /**
     * @en
     * Pause the clip
     * @zh
     * 暂停播放。
     */
    public pause () {
        if (!this._clip) { return; }
        this._clip.pause();
    }

    /**
     * @en
     * Stop the clip
     * @zh
     * 停止播放。
     */
    public stop () {
        if (!this._clip) { return; }
        this._clip.stop();
    }

    /**
     * @en Plays an AudioClip, and scales volume by volumeScale.
     * @zh 以指定音量播放一个音频一次。
     *
     * 注意，对同一个音频片段，不同平台多重播放效果存在差异。<br>
     * 在 Web Audio 模式下，可以同时维护多个播放进度，达到多重播放。<br>
     * 其他模式下都不支持多重播放，如前一次尚未播完，则会立即重新播放。
     * @param clip 要播放的音频
     * @param volumeScale 相对当前音量的缩放，默认为 1
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
     * @en
     * set current playback time, in seconds
     * @zh
     * 以秒为单位设置当前播放时间。
     * @param num 要跳转到的播放时间
     */
    set currentTime (num: number) {
        if (isNaN(num)) { console.warn('illegal audio time!'); return; }
        num = clamp(num, 0, this.duration);
        this._cachedCurrentTime = num;
        if (!this._clip) { return; }
        this._clip.setCurrentTime(this._cachedCurrentTime);
    }

    /**
     * @en
     * get the current playback time, in seconds
     * @zh
     * 以秒为单位获取当前播放时间。
     */
    get currentTime () {
        if (!this._clip) { return this._cachedCurrentTime; }
        return this._clip.getCurrentTime();
    }

    /**
     * @en
     * get the audio duration, in seconds
     * @zh
     * 获取以秒为单位的音频总时长。
     */
    get duration () {
        if (!this._clip) { return 0; }
        return this._clip.getDuration();
    }

    /**
     * @en
     * get current audio state
     * @zh
     * 获取当前音频状态。
     */
    get state () {
        if (!this._clip) { return AudioClip.PlayingState.INITIALIZING; }
        return this._clip.state;
    }

    /**
     * @en
     * is the audio currently playing?
     * @zh
     * 当前音频是否正在播放？
     */
    get playing () {
        return this.state === AudioClip.PlayingState.PLAYING;
    }
}
