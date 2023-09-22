/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { ccclass, help, executionOrder, menu, tooltip, requireComponent, executeInEditMode, serializable } from 'cc.decorator';
import { Component } from '../../scene-graph/component';
import { Color, assertIsTrue, cclegacy } from '../../core';
import { Label } from './label';

/**
 * @en
 * Outline effect used to change the display, only for system fonts or TTF fonts.
 *
 * @zh
 * 描边效果组件,用于字体描边,只能用于系统字体。
 *
 * @deprecated since v3.8.2, please use [[Label.enableOutline]] instead.
 */
@ccclass('cc.LabelOutline')
@help('i18n:cc.LabelOutline')
@executionOrder(110)
@menu('UI/LabelOutline')
@requireComponent(Label)
@executeInEditMode
export class LabelOutline extends Component {
    /**
     * @en
     * Outline color.
     *
     * @zh
     * 改变描边的颜色。
     *
     * @deprecated since v3.8.2, please use [[Label.outlineColor]] instead.
     */
    @tooltip('i18n:labelOutline.color')
    get color (): Readonly<Color> {
        const label = this.node.getComponent(Label);
        assertIsTrue(label);
        return label.outlineColor;
    }

    set color (value) {
        const label = this.node.getComponent(Label);
        assertIsTrue(label);
        label.outlineColor = value;
    }

    /**
     * @en
     * Change the outline width.
     *
     * @zh
     * 改变描边的宽度。
     *
     * @deprecated since v3.8.2, please use [[Label.outlineWidth]] instead.
     */
    @tooltip('i18n:labelOutline.width')
    get width (): number {
        const label = this.node.getComponent(Label);
        assertIsTrue(label);
        return label.outlineWidth;
    }

    set width (value) {
        const label = this.node.getComponent(Label);
        assertIsTrue(label);
        label.outlineWidth = value;
    }

    /**
     * @deprecated since v3.8.2, please use [[Label.enableOutline]] instead.
     */
    public onEnable (): void {
        const label = this.node.getComponent(Label);
        assertIsTrue(label);
        label.enableOutline = true;
    }

    /**
     * @deprecated since v3.8.2, please use [[Label.enableOutline]] instead.
     */
    public onDisable (): void {
        const label = this.node.getComponent(Label);
        assertIsTrue(label);
        label.enableOutline = false;
    }
}

cclegacy.LabelOutline = LabelOutline;
