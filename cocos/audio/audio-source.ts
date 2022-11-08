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

import { ccclass, help, menu, tooltip, type, range, serializable } from 'cc.decorator';
import { audioLoader, AudioPlayer, playOneShot } from './pal/web/index';
import { AudioPCMDataView, AudioState } from './type';
import { Component } from '../scene-graph/component';
import { clamp, sys } from '../core';
import { AudioClip } from './audio-clip';
import { Node } from '../scene-graph';

const _LOADED_EVENT = 'audiosource-loaded';

enum AudioSourceEventType {
    STARTED = 'started',
    ENDED = 'ended',
}

/**
 * @en
 * A representation of a single audio source, <br>
 * contains basic functionalities like play, pause and stop.
 * @zh
 * 音频组件，代表单个音源，提供播放、暂停、停止等基本功能。
 */
@ccclass('cc.AudioSource')
@help('i18n:cc.AudioSource')
@menu('Audio/AudioSource')
export class AudioSource extends Component {
    @type(AudioPlayer)
    protected _player: AudioPlayer|null = null;
    // NOTE: max audio channel is now an editable property with no usage.
    static maxAudioChannel = 24;

    public static EventType = AudioSourceEventType;

    @type(AudioClip)
    protected _clip: AudioClip | null = null;

    @serializable
    protected _loop = false;
    @serializable
    protected _playOnAwake = true;
    @serializable
    protected _volume = 1;

    private _lastSetClip: AudioClip | null = null;

    /**
     * @en
     * The default AudioClip to be played for this audio source.
     * @zh
     * 设定要播放的音频。
     */
    @type(AudioClip)
    @tooltip('i18n:audio.clip')
    set clip (clip: AudioClip | null) {
        if (!clip) {
            return;
        }
        if (clip === this._clip) {
            return;
        }
        this._clip = clip;
        if (this._player) {
            this._player.clip = clip;
        } else {
            this._player = new AudioPlayer(clip);
        }
    }
    get clip () {
        return this._clip;
    }

    /**
     * @en
     * Is looping enabled for this audio source?
     * @zh
     * 是否循环播放音频？
     */
    @tooltip('i18n:audio.loop')
    set loop (val) {
        this._loop = val;
        this._player && (this._player.loop = val);
    }
    get loop () {
        return this._loop;
    }

    /**
     * @en
     * Is the autoplay enabled? <br>
     * Note that for most platform autoplay will only start <br>
     * after a user gesture is received, according to the latest autoplay policy: <br>
     * https://www.chromium.org/audio-video/autoplay
     * @zh
     * 是否启用自动播放。 <br>
     * 请注意，根据最新的自动播放策略，现在对大多数平台，自动播放只会在第一次收到用户输入后生效。 <br>
     * 参考：https://www.chromium.org/audio-video/autoplay
     */
    @tooltip('i18n:audio.playOnAwake')
    set playOnAwake (val) {
        this._playOnAwake = val;
    }
    get playOnAwake () {
        return this._playOnAwake;
    }

    /**
     * @en
     * The volume of this audio source (0.0 to 1.0).<br>
     * Note: Volume control may be ineffective on some platforms.
     * @zh
     * 音频的音量（大小范围为 0.0 到 1.0）。<br>
     * 请注意，在某些平台上，音量控制可能不起效。<br>
     */
    @range([0.0, 1.0])
    @tooltip('i18n:audio.volume')
    set volume (val) {
        if (Number.isNaN(val)) { console.warn('illegal audio volume!'); return; }
        val = clamp(val, 0, 1);
        if (this._player) {
            this._player.volume = val;
            this._volume = this._player.volume;
        } else {
            this._volume = val;
        }
    }
    get volume () {
        return this._volume;
    }

    public onLoad () {
        if (this._clip) {
            this._player = new AudioPlayer(this._clip);
        }
    }

    public onEnable () {
        // audio source component may be played before
        if (this._playOnAwake && !this.playing) {
            this.play();
        }
    }

    public onDisable () {
        const rootNode = this._getRootNode();
        if (rootNode?._persistNode) {
            return;
        }
        this.pause();
    }

    public onDestroy () {
        this.stop();
        this._player?.destroy();
        this._player = null;
    }
    /**
     * @en
     * Get PCM data from specified channel.
     * Currently it is only available in Native platform and Web Audio (including Web and ByteDance platforms).
     *
     * @zh
     * 通过指定的通道获取音频的 PCM data。
     * 目前仅在原生平台和 Web Audio（包括 Web 和 字节平台）中可用。
     *
     * @param channelIndex The channel index. 0 is left channel, 1 is right channel.
     * @returns A Promise to get the PCM data after audio is loaded.
     *
     * @example
     * ```ts
     * audioSource.getPCMData(0).then(dataView => {
     *   if (!dataView)  return;
     *   for (let i = 0; i < dataView.length; ++i) {
     *     console.log('data: ' + dataView.getData(i));
     *   }
     * });
     * ```
     */
    public getPCMData (channelIndex: number): Promise<AudioPCMDataView | undefined> {
        return new Promise((resolve) => {
            if (channelIndex !== 0 && channelIndex !== 1) {
                console.warn('Only support channel index 0 or 1 to get buffer');
                resolve(undefined);
                return;
            }
            if (this._clip) {
                resolve(this._clip.getPcmData(channelIndex));
            } else {
                this.node?.once(_LOADED_EVENT, () => {
                    resolve(this._clip?.getPcmData(channelIndex));
                });
            }
        });
    }

    /**
     * @en
     * Get the sample rate of audio.
     * Currently it is only available in Native platform and Web Audio (including Web and ByteDance platforms).
     *
     * @zh
     * 获取音频的采样率。
     * 目前仅在原生平台和 Web Audio（包括 Web 和 字节平台）中可用。
     *
     * @returns A Promise to get the sample rate after audio is loaded.
     */
    public getSampleRate (): Promise<number> {
        return new Promise((resolve) => {
            if (this._clip) {
                resolve(this._clip.pcmHeader.sampleRate);
            } else {
                this.node?.once(_LOADED_EVENT, () => {
                    if (this._player) {
                        resolve(this._player.clip.pcmHeader.sampleRate);
                    }
                    resolve(0);
                });
            }
        });
    }

    private _getRootNode (): Node | null | undefined {
        let currentNode = this.node as Node | undefined | null;
        let currentGrandparentNode = currentNode?.parent?.parent;
        while (currentGrandparentNode) {
            currentNode = currentNode?.parent;
            currentGrandparentNode = currentNode?.parent?.parent;
        }
        return currentNode;
    }

    /**
     * @en
     * Play the clip.<br>
     * Restart if already playing.<br>
     * Resume if paused.
     *
     * NOTE: On Web platforms, the Auto Play Policy bans auto playing audios at the first time, because the user gesture is required.
     * there are 2 ways to play audios at the first time:
     * - play audios in the callback of TOUCH_END or MOUSE_UP event
     * - play audios straightly, the engine will auto play audios at the next user gesture.
     *
     * @zh
     * 开始播放。<br>
     * 如果音频处于正在播放状态，将会重新开始播放音频。<br>
     * 如果音频处于暂停状态，则会继续播放音频。
     *
     * 注意:在 Web 平台，Auto Play Policy 禁止首次自动播放音频，因为需要发生用户交互之后才能播放音频。
     * 有两种方式实现音频首次自动播放：
     * - 在 TOUCH_END 或者 MOUSE_UP 的事件回调里播放音频。
     * - 直接播放音频，引擎会在下一次发生用户交互时自动播放。
     */
    public play () {
        if (this._player) {
            this._player.play();
            return;
        }
        if (this._clip) {
            this._player = new AudioPlayer(this._clip);
            this._player.loop = this._loop;
            this._player.volume = this._volume;
            this._player.play();
            return;
        }
        this.node?.emit(AudioSourceEventType.STARTED, this);
    }

    /**
     * @en
     * Pause the clip.
     * @zh
     * 暂停播放。
     */
    public pause () {
        if (this._player) {
            this._player.pause();
        }
    }

    /**
     * @en
     * Stop the clip.
     * @zh
     * 停止播放。
     */
    public stop () {
        if (this._player) {
            this._player.stop();
        }
    }

    /**
     * @en
     * Plays an AudioClip, and scales volume by volumeScale. The result volume is `audioSource.volume * volumeScale`. <br>
     * @zh
     * 以指定音量倍数播放一个音频一次。最终播放的音量为 `audioSource.volume * volumeScale`。 <br>
     * @param clip The audio clip to be played.
     * @param volumeScale volume scaling factor wrt. current value.
     */
    public playOneShot (clip: AudioClip, volumeScale = 1) {
        if (!clip._nativeAsset) {
            console.error('Invalid audio clip');
            return;
        }
        playOneShot(clip, volumeScale);
    }

    /**
     * @en
     * Set current playback time, in seconds.
     * @zh
     * 以秒为单位设置当前播放时间。
     * @param time playback time to jump to.
     */
    set currentTime (time: number) {
        if (Number.isNaN(time)) { console.warn('illegal audio time!'); return; }
        if (this._player) {
            this._player.currentTime = time;
        }
    }

    /**
     * @en
     * Get the current playback time, in seconds.
     * @zh
     * 以秒为单位获取当前播放时间。
     */
    get currentTime () {
        return this._player ? this._player.currentTime : 0;
    }

    /**
     * @en
     * Get the audio duration, in seconds.
     * @zh
     * 获取以秒为单位的音频总时长。
     */
    get duration (): number {
        if (this._clip && this._clip.getDuration()) {
            return this._clip.getDuration();
        } else {
            return 0;
        }
        // return this._clip?.getDuration() ?? (this._player ? this._player.duration : 0);
    }

    /**
     * @en
     * Get current audio state.
     * @zh
     * 获取当前音频状态。
     */
    get state (): AudioState {
        return this._player ? this._player.state : AudioState.READY;
    }

    /**
     * @en
     * Is the audio currently playing?
     * @zh
     * 当前音频是否正在播放？
     */
    get playing () {
        return this.state === AudioState.PLAYING;
    }
}
