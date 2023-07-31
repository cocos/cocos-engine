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

import { System } from '../../core';
import { Director, director } from '../../game';
import { uiRendererManager } from './ui-renderer-manager';
import { uiLayoutManager } from './ui-layout-manager';

export class UISystem extends System {
    init (): void {
        director.on(Director.EVENT_UPDATE_UI, this.tick, this);
    }

    tick (): void {
        uiLayoutManager.updateAllDirtyLayout(); // 更新所有 dirty 的 layout
        // 可以分开更新了
        uiRendererManager.updateAllDirtyRenderers(); // 更新所有 dirty 的 renderer
    }
}

export const uiSystem = new UISystem();
director.registerSystem('ui-system', uiSystem, 0);
