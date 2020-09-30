/*
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
import { log } from '../platform/debug';
import { sys } from '../platform/sys';
import { CompleteCallback, IDownloadParseOptions } from './shared';
const __audioSupport = sys.__audioSupport;

export default function downloadDomAudio (
    url: string,
    options: IDownloadParseOptions,
    onComplete: CompleteCallback<HTMLAudioElement>
    ): HTMLAudioElement {

    const dom = document.createElement('audio');
    dom.src = url;

    const clearEvent = () => {
        clearTimeout(timer);
        dom.removeEventListener('canplaythrough', success, false);
        dom.removeEventListener('error', failure, false);
        if (__audioSupport.USE_LOADER_EVENT) {
            dom.removeEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
        }
    };

    const timer = setTimeout(() => {
        if (dom.readyState === 0) {
            failure();
        }
        else {
            success();
        }
    }, 8000);

    const success = () => {
        clearEvent();
        if (onComplete) { onComplete(null, dom); }
    };

    const failure = () => {
        clearEvent();
        const message = 'load audio failure - ' + url;
        log(message);
        if (onComplete) { onComplete(new Error(message)); }
    };

    dom.addEventListener('canplaythrough', success, false);
    dom.addEventListener('error', failure, false);
    if (__audioSupport.USE_LOADER_EVENT) {
        dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
    }
    return dom;
}
