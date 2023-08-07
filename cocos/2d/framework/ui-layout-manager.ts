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

import { UIRenderer } from './ui-renderer';

export class UILayoutManager {
    private _dirtyUIs: (UIRenderer)[] = [];

    public markLayoutDirty (uiRenderer: UIRenderer): void {
        this._dirtyUIs.push(uiRenderer);
    }

    public updateAllDirtyLayout (): void {
        const length = this._dirtyUIs.length;
        const dirtyRenderers = this._dirtyUIs;
        for (let i = 0; i < length; i++) {
            dirtyRenderers[i]._updateLayout();
        }
        this._dirtyUIs.length = 0;
    }
}
export const uiLayoutManager = new UILayoutManager();
