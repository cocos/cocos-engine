/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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
import { ccwindow } from '@base/global';
import { getError } from '@base/debug';
import { BaseImageData } from '../base-image-data';

export class ImageData extends BaseImageData {
    static loadImage (urlOrBase64: string): Promise<ImageData> {
        return new Promise((resolve, reject) => {
            const image = new ccwindow.Image();

            if (ccwindow.location.protocol !== 'file:') {
                image.crossOrigin = 'anonymous';
            }

            image.onload = (): void => {
                const imageData = new ImageData(image);
                resolve(imageData);
            };
            image.onerror = (): void => {
                reject(new Error(getError(4930, urlOrBase64)));
            };

            image.src = urlOrBase64;
        });
    }
}
