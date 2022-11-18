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

import { ccclass, serializable, override } from 'cc.decorator';
import { HTML5, NATIVE } from 'internal:constants';
import { InnerAudioPlayer } from 'pal/audio';
import { Asset } from '../asset/assets/asset';
import { cclegacy } from '../core';
import { AudioPCMDataView, AudioPCMHeader, AudioType, AudioState } from './type';
import { audioBufferManager } from './audio-graph';

export interface AudioMeta {
    // player: AudioPlayer | null,
    url: string;
    duration: number;
    pcmHeader: AudioPCMHeader | null
}

/**
 * @en
 * The audio clip asset.
 * @zh
 * 音频片段资源。
 */
@ccclass('cc.AudioClip')
export class AudioClip extends Asset {
    public static AudioType = AudioType;
    @serializable
    protected _duration = 0; // we serialize this because it's unavailable at runtime on some platforms
    constructor () {
        super();
        console.log(`create clip`);
    }
    protected _meta: AudioMeta | null = null;

    /**
     * @deprecated
     */
    protected _loadMode = AudioType.UNKNOWN_AUDIO;

    private _player: InnerAudioPlayer | null = null;

    public destroy (): boolean {
        const destroyResult = super.destroy();
        this._player?.destroy();
        this._player = null;
        return destroyResult;
    }
    /**
     * @internal
     */
    public setPlayer (player: InnerAudioPlayer) {
        this._player = player;
    }
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    set _nativeAsset (meta: AudioMeta | null) {
        if (!meta) {
            return;
        }
        this._meta = meta;
    }
    get _nativeAsset () : AudioMeta | null {
        return this._meta;
    }
    get loadMode () {
        return this._loadMode;
    }
    get pcmHeader (): AudioPCMHeader {
        if (this._meta?.pcmHeader) {
            return this._meta.pcmHeader;
        } else {
            return {
                totalFrames: 0,
                sampleRate: 0,
                bytesPerFrame: 0,
                audioFormat: 0,
                channelCount: 0,
            };
        }
    }
    public getPcmData (channelID: number): AudioPCMDataView | undefined {
        if (NATIVE) {
            const buffer = audioBufferManager.getCache(this.nativeUrl);
            if (buffer) {
                return new AudioPCMDataView(buffer.getChannelData(channelID), 1);
            }
        } else if (HTML5) {
            const buffer = audioBufferManager.getCache(this.nativeUrl);
            if (buffer) {
                return new AudioPCMDataView(buffer.getChannelData(channelID), 1);
            }
        }
        return undefined;
    }
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @override
    get _nativeDep () {
        return {
            uuid: this._uuid,
            ext: this._native,
            __isNative__: true,
        };
    }

    public validate () {
        return !!this._meta;
    }

    public getDuration (): number {
        // Dynamicly loaded audioClip._duration is 0
        if (this._duration) {
            return this._duration;
        }
        return this._meta ? this._meta.duration : 0;
    }

    // #region deprecated method
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.state instead.
     */
    public get state () {
        return this._player ? this._player.state : AudioState.INIT;
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.getCurrentTime() instead.
     */
    public getCurrentTime () {
        return this._player ? this._player.currentTime : 0;
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.getVolume() instead.
     */
    public getVolume () {
        return this._player ? this._player.volume : 0;
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.getLoop() instead.
     */
    public getLoop () {
        return this._player ? this._player.loop : false;
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.setCurrentTime() instead.
     */
    public setCurrentTime (time: number) {
        this._player?.seek(time).catch((e) => {});
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.setVolume() instead.
     */
    public setVolume (volume: number) {
        if (this._player) {
            this._player.volume = volume;
        }
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.setLoop() instead.
     */
    public setLoop (loop: boolean) {
        if (this._player) {
            this._player.loop = loop;
        }
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.play() instead.
     */
    public play () {
        this._player?.play().catch((e) => {});
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.pause() instead.
     */
    public pause () {
        this._player?.pause().catch((e) => {});
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.stop() instead.
     */
    public stop () {
        this._player?.stop().catch((e) => {});
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.playOneShot() instead.
     */
    public playOneShot (volume = 1) {
        if (this._nativeAsset) {
            InnerAudioPlayer.loadOneShotAudio(this._nativeAsset.url, volume).then((oneShotAudio) => {
                oneShotAudio.play();
            }).catch((e) => {});
        }
    }
    // #endregion deprecated method
}

cclegacy.AudioClip = AudioClip;
