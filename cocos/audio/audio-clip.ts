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
import { Asset } from '../asset/assets/asset';
import { legacyCC } from '../core/global-exports';
import { AudioType } from '../../pal/audio/type';

export interface AudioMeta {
    // player: AudioPlayer | null,
    url: string;
    type: AudioType;
    duration: number;
    pcmHeader: Audio.PCMHeader;
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

    protected _loadMode: AudioType = AudioType.UNKNOWN_AUDIO;

    protected _meta: AudioMeta | null = null;

    public destroy (): boolean {
        const destroyResult = super.destroy();
        return destroyResult;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    set _nativeAsset (meta: AudioMeta | null) {
        this._meta = meta;
        if (meta) {
            this._loadMode = meta.type;
        } else {
            this._meta = null;
            this._loadMode = AudioType.UNKNOWN_AUDIO;
            this._duration = 0;
        }
    }
    get _nativeAsset () {
        return this._meta;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @override
    get _nativeDep () {
        return {
            uuid: this._uuid,
            audioLoadMode: this.loadMode,
            ext: this._native,
            __isNative__: true,
        };
    }

    get loadMode (): AudioType {
        return this._loadMode;
    }

    public validate () {
        return !!this._meta;
    }

    public getDuration () {
        // Dynamicly loaded audioClip._duration is 0
        if (this._duration) {
            return this._duration;
        }
        return this._meta ? this._meta.duration : 0;
    }
}

cclegacy.AudioClip = AudioClip;
