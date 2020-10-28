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

import { getError, log } from '../core/platform/debug';
import { sys } from '../core/platform/sys';
import { AudioClip, AudioType } from './assets/clip';
import { legacyCC } from '../core/global-exports';
import { CompleteCallback, IDownloadParseOptions } from '../core/asset-manager/shared';
import downloadFile from '../core/asset-manager/download-file';
import { DownloadHandler } from '../core/asset-manager/downloader';
import { createDomAudio } from './audio-utils';

const __audioSupport = sys.__audioSupport;
const formatSupport = __audioSupport.format;

export function downloadDomAudio (
    url: string,
    options: IDownloadParseOptions,
    onComplete: CompleteCallback<HTMLAudioElement>
    ): void {

    createDomAudio(url).then(dom => {
        onComplete(null, dom);
    }, errMsg => {
    	log(errMsg);
    	onComplete(new Error(errMsg), null);
    });
}

function downloadArrayBuffer (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) {
    options.xhrResponseType = 'arraybuffer';
    downloadFile(url, options, options.onFileProgress, onComplete);
}

export function downloadAudio (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) {
    if (formatSupport.length === 0) {
        return onComplete(new Error(getError(4927)));
    }
    let handler: DownloadHandler | null = null;
    if (!__audioSupport.WEB_AUDIO) {
        handler = downloadDomAudio;
    }
    else {
        // web audio need to download file as arrayBuffer
        if (options.audioLoadMode !== AudioType.DOM_AUDIO) {
            handler = downloadArrayBuffer;
        }
        else {
            handler = downloadDomAudio;
        }
    }
    handler(url, options, onComplete);
};
