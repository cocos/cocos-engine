/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import downloader from '../core/asset-manager/downloader';
import factory from '../core/asset-manager/factory';
import { CompleteCallback, IDownloadParseOptions } from '../core/asset-manager/shared';
import { getError, log } from '../core/platform/debug';
import { sys } from '../core/platform/sys';
import { VideoClip } from './assets/video-clip';

// eslint-disable-next-line consistent-return
export function downloadVideo (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) {
    const video = document.createElement('video');
    const source = document.createElement('source');
    video.appendChild(source);

    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'blob';
    req.onload = function onload () {
        if (this.status === 200 || this.status === 0) {
            source.src = URL.createObjectURL(this.response);
            onComplete(null, video);
        } else {
            onComplete(new Error(`${req.status}(no response)`));
        }
    };
    req.onerror = function onerror () {
        const message = `load video failure - ${url}`;
        log(message);
        onComplete(new Error(message));
    };
    req.send();
}

function createVideoClip (id: string, data: HTMLVideoElement, options: IDownloadParseOptions, onComplete: CompleteCallback<VideoClip>) {
    const out = new VideoClip();
    out._nativeUrl = id;
    out._nativeAsset = data;
    onComplete(null, out);
}

downloader.register({
    // Video
    '.mp4': downloadVideo,
    '.avi': downloadVideo,
    '.mov': downloadVideo,
    '.mpg': downloadVideo,
    '.mpeg': downloadVideo,
    '.rm': downloadVideo,
    '.rmvb': downloadVideo,
});

factory.register({
    // Video
    '.mp4': createVideoClip,
    '.avi': createVideoClip,
    '.mov': createVideoClip,
    '.mpg': createVideoClip,
    '.mpeg': createVideoClip,
    '.rm': createVideoClip,
    '.rmvb': createVideoClip,
});
