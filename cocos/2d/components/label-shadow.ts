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
import { Color, Vec2 } from '../../core';
import { Label } from './label';

/**
 * @en Shadow effect for Label component, only for system fonts or TTF fonts
 * @zh 用于给 Label 组件添加阴影效果，只能用于系统字体或 ttf 字体
 * @example
 * import { Node, Label, LabelShadow } from 'cc';
 * // Create a new node and add label components.
 * const node = new Node("New Label");
 * const label = node.addComponent(Label);
 * const shadow = node.addComponent(LabelShadow);
 * node.parent = this.node;
 */
@ccclass('cc.LabelShadow')
@help('i18n:cc.LabelShadow')
@executionOrder(110)
@menu('UI/LabelShadow')
@requireComponent(Label)
@executeInEditMode
export class LabelShadow extends Component {
    @serializable
    protected _color = new Color(0, 0, 0, 255);
    @serializable
    protected _offset = new Vec2(2, 2);
    @serializable
    protected _blur = 2;

    /**
     * @en
     * Shadow color.
     *
     * @zh
     * 阴影的颜色。
     *
     * @example
     * ```ts
     * import { Color } from 'cc';
     * labelShadow.color = new Color(0.5, 0.3, 0.7, 1.0);
     * ```
     */
    @tooltip('i18n:labelShadow.color')
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
     * Offset between font and shadow
     *
     * @zh
     * 字体与阴影的偏移。
     *
     * @example
     * ```ts
     * import { Vec2 } from 'cc';
     * labelShadow.offset = new Vec2(2, 2);
     * ```
     */
    @tooltip('i18n:labelShadow.offset')
    get offset () {
        return this._offset;
    }

    set offset (value) {
        this._offset = value;
        this._updateRenderData();
    }

    /**
     * @en
     * A non-negative float specifying the level of shadow blur
     *
     * @zh
     * 阴影的模糊程度
     *
     * @example
     * ```ts
     * labelShadow.blur = 2;
     * ```
     */
    @tooltip('i18n:labelShadow.blur')
    get blur () {
        return this._blur;
    }

    set blur (value) {
        this._blur = value;
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
