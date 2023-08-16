/*
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

export type FileProgressCallback = (loaded: number, total: number) => void;

export default function downloadFile (
    url: string,
    options: Record<string, any>,
    onProgress: FileProgressCallback | null | undefined,
    onComplete: ((err: Error | null, data?: any) => void),
): XMLHttpRequest {
    const xhr = new XMLHttpRequest();
    const errInfo = `download failed: ${url}, status: `;

    xhr.open('GET', url, true);

    if (options.xhrResponseType !== undefined) { xhr.responseType = options.xhrResponseType as XMLHttpRequestResponseType; }
    if (options.xhrWithCredentials !== undefined) { xhr.withCredentials = options.xhrWithCredentials as boolean; }
    if (options.xhrMimeType !== undefined && xhr.overrideMimeType) { xhr.overrideMimeType(options.xhrMimeType as string); }
    if (options.xhrTimeout !== undefined) { xhr.timeout = options.xhrTimeout as number; }

    if (options.xhrHeader) {
        for (const header in options.xhrHeader) {
            xhr.setRequestHeader(header, options.xhrHeader[header] as string);
        }
    }

    xhr.onload = (): void => {
        if (xhr.status === 200 || xhr.status === 0) {
            if (onComplete) { onComplete(null, xhr.response); }
        } else if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(no response)`)); }
    };

    if (onProgress) {
        xhr.onprogress = (e): void => {
            if (e.lengthComputable) {
                onProgress(e.loaded, e.total);
            }
        };
    }

    xhr.onerror = (): void => {
        if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(error)`)); }
    };

    xhr.ontimeout = (): void => {
        if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(time out)`)); }
    };

    xhr.onabort = (): void => {
        if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(abort)`)); }
    };

    xhr.send(null);

    return xhr;
}
