/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module asset-manager
 */

import { AudioPlayer } from 'pal/audio';
import { AudioClip, AudioMeta } from './audio-clip';
import { CompleteCallback, IDownloadParseOptions } from '../core/asset-manager/shared';
import downloader from '../core/asset-manager/downloader';
import factory from '../core/asset-manager/factory';

export function loadAudioPlayer (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) {
    AudioPlayer.load(url, {
        audioLoadMode: options.audioLoadMode,
    }).then((player) => {
        const audioMeta: AudioMeta = {
            player,
            url,
            duration: player.duration,
            type: player.type,
        };
        onComplete(null, audioMeta);
    }).catch((err) => {
        onComplete(err);
    });
}

function createAudioClip (id: string,
    data: AudioMeta,
    options: IDownloadParseOptions,
    onComplete: CompleteCallback<AudioClip>) {
    const out = new AudioClip();
    out._nativeUrl = id;
    out._nativeAsset = data;
    // @ts-expect-error assignment to private field
    out._duration = data.duration;
    onComplete(null, out);
}

downloader.register({
    '.mp3': loadAudioPlayer,
    '.ogg': loadAudioPlayer,
    '.wav': loadAudioPlayer,
    '.m4a': loadAudioPlayer,
});

factory.register({
    // Audio
    '.mp3': createAudioClip,
    '.ogg': createAudioClip,
    '.wav': createAudioClip,
    '.m4a': createAudioClip,
});
