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
 * @module ui
 */

import { ccclass, help, executionOrder, menu, tooltip, requireComponent, executeInEditMode, serializable } from 'cc.decorator';
import { Component } from '../../core/components/component';
import { Color } from '../../core/math';
import { Label } from './label';
import { js } from '../../core/utils/js';
import { legacyCC } from '../../core/global-exports';

/**
 * @en
 * Outline effect used to change the display, only for system fonts or TTF fonts.
 *
 * @zh
 * 描边效果组件,用于字体描边,只能用于系统字体。
 *
 * @example
 * ```ts
 * import { Node, Label, LabelOutline } from 'cc';
 * // Create a new node and add label components.
 * const node = new Node("New Label");
 * const label = node.addComponent(Label);
 * const outline = node.addComponent(LabelOutline);
 * node.parent = this.node;
 * ```
 */
@ccclass('cc.LabelOutline')
@help('i18n:cc.LabelOutline')
@executionOrder(110)
@menu('UI/LabelOutline')
@requireComponent(Label)
@executeInEditMode
export class LabelOutline extends Component {
    @serializable
    protected _color = new Color(0, 0, 0, 255);
    @serializable
    protected _width = 2;

    /**
     * @en
     * Outline color.
     *
     * @zh
     * 改变描边的颜色。
     *
     * @example
     * ```ts
     * import { Color } from 'cc';
     * outline.color = new Color(0.5, 0.3, 0.7, 1.0);
     * ```
     */
    @tooltip('i18n:labelOutline.color')
    // @constget
    get color (): Readonly<Color> {
        return this._color;
    }

    set color (value) {
        if (this._color === value) {
            return;
        }

        this._color.set(value);
        this._updateRenderData();
    }

    /**
     * @en
     * Change the outline width.
     *
     * @zh
     * 改变描边的宽度。
     *
     * @example
     * ```ts
     * outline.width = 3;
     * ```
     */
    @tooltip('i18n:labelOutline.width')
    get width () {
        return this._width;
    }

    set width (value) {
        if (this._width === value) {
            return;
        }

        this._width = value;
        this._updateRenderData();
    }

    public onEnable () {
        this._updateRenderData();
    }

    public onDisable () {
        this._updateRenderData();
    }

    protected _updateRenderData () {
        const label = this.node.getComponent(Label);
        if (label) {
            label.updateRenderData(true);
        }
    }
}

export { LabelOutline as LabelOutlineComponent };
legacyCC.LabelOutline = LabelOutline;
js.setClassAlias(LabelOutline, 'cc.LabelOutlineComponent');
