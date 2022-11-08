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
import { Asset } from '../asset/assets/asset';
import { cclegacy } from '../core';
import { audioBufferManager } from './impl/graph-based/audio-buffer-manager';
import { AudioPCMDataView, AudioPCMHeader } from './type';

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
    @serializable
    protected _duration = 0; // we serialize this because it's unavailable at runtime on some platforms
    constructor () {
        super();
        console.log(`create clip`);
    }
    protected _meta: AudioMeta | null = null;

    public destroy (): boolean {
        const destroyResult = super.destroy();
        return destroyResult;
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
        if (NATIVE || HTML5) {
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
}

cclegacy.AudioClip = AudioClip;
