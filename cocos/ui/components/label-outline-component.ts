/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import { Component } from '../../core/components/component';
import { ccclass, help, executionOrder, menu, property } from '../../core/data/class-decorator';
import { Color } from '../../core/math';
import { LabelComponent } from './label-component';
import { legacyCC } from '../../core/global-exports';

/**
 * @en
 * Outline effect used to change the display, only for system fonts or TTF fonts.
 *
 * @zh
 * 描边效果组件,用于字体描边,只能用于系统字体。
 *
 * @example
 * ```typescript
 *
 *  // Create a new node and add label components.
 *  var node = new cc.Node("New Label");
 *  var label = node.addComponent(cc.LabelComponent);
 *  var outline = node.addComponent(cc.LabelOutlineComponent);
 *  node.parent = this.node;
 * ```
 */
@ccclass('cc.LabelOutlineComponent')
@help('i18n:cc.LabelOutlineComponent')
@executionOrder(110)
@menu('UI/LabelOutline')
export class LabelOutlineComponent extends Component {
    @property
    protected _color = new Color(255, 255, 255, 255);
    @property
    protected _width = 1;

    /**
     * @en
     * Outline color.
     *
     * @zh
     * 改变描边的颜色。
     *
     * @example
     * ```typescript
     * outline.color = cc.color(0.5, 0.3, 0.7, 1.0);
     * ```
     */
    @property({
        tooltip:'描边的颜色',
    })
    // @constget
    get color (): Readonly<Color> {
        return this._color;
    }

    set color (value) {
        if (this._color === value){
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
     * ```typescript
     * outline.width = 3;
     * ```
     */
    @property({
        tooltip:'描边的宽度',
    })
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

    protected _updateRenderData () {
        const label = this.node.getComponent(LabelComponent);
        if (label) {
            label.updateRenderData(true);
        }
    }
}

legacyCC.LabelOutlineComponent = LabelOutlineComponent;
