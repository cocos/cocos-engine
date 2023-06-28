/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { AudioPlayer } from 'pal/audio';
import { AudioClip, AudioMeta } from './audio-clip';
import downloader from '../asset/asset-manager/downloader';
import factory from '../asset/asset-manager/factory';

export function loadAudioPlayer (url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any | null) => void)): void {
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
    options: Record<string, any>,
    onComplete: ((err: Error | null, data?: AudioClip | null) => void)): void {
    const out = new AudioClip();
    out._nativeUrl = id;
    out._nativeAsset = data;
    out.duration = data.duration;
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
