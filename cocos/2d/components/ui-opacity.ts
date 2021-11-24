/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module ui
 */

import { ccclass, help, executeInEditMode, executionOrder, menu, tooltip, editable, serializable } from 'cc.decorator';
import { Component } from '../../core/components/component';
import { director } from '../../core/director';
import { clampf } from '../../core/utils/misc';

/**
 * @en
 * Set the UI transparency component.
 * This component can be used to influence subsequent render nodes.
 * Nodes that already have a rendering component can modify the alpha channel of color directly.
 *
 * @zh
 * UI 透明度设置组件。可以通过该组件设置透明度来影响后续的渲染节点。已经带有渲染组件的节点可以直接修改 color 的 alpha 通道。
 */
@ccclass('cc.UIOpacity')
@help('i18n:cc.UIOpacity')
@executionOrder(110)
@menu('UI/UIOpacity')
@executeInEditMode
export class UIOpacity extends Component {
    /**
     * @en
     * The transparency value of the impact.
     *
     * @zh
     * 透明度。
     */
    @editable
    @tooltip('i18n:UIOpacity.opacity')
    get opacity () {
        return this._opacity;
    }

    set opacity (value) {
        if (this._opacity === value) {
            return;
        }
        value = clampf(value, 0, 255);
        this._opacity = value;
        this.node._uiProps.localOpacity = value / 255;
    }

    @serializable
    protected _opacity = 255;

    public onEnable () {
        this.node._uiProps.localOpacity = this._opacity / 255;
    }

    public onDisable () {
        this.node._uiProps.localOpacity = 1;
    }
}
