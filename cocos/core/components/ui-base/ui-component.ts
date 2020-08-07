/*
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

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
 * @category ui
 */

import { ccclass, disallowMultiple, executeInEditMode, executionOrder, requireComponent } from 'cc.decorator';
import { UI } from '../../renderer/ui/ui';
import { Component } from '../component';
import { UITransform } from './ui-transform';
import { Node } from '../../scene-graph';

/**
 * @zh
 * UI 及 UI 模型渲染基类。
 */
@ccclass('cc.UIComponent')
@requireComponent(UITransform)
@executionOrder(110)
@disallowMultiple
@executeInEditMode
export class UIComponent extends Component {

    protected _lastParent: Node | null = null;

    public __preload () {
        this.node._uiProps.uiComp = this;
    }

    public onEnable () {
    }

    public onDisable () {

    }

    public onDestroy () {
        if (this.node._uiProps.uiComp === this) {
            this.node._uiProps.uiComp = null;
        }
    }

    public updateAssembler (render: UI) {
    }

    public postUpdateAssembler (render: UI) {
    }
}
