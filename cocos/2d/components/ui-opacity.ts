/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, disallowMultiple, editable, executeInEditMode, executionOrder, help, menu, serializable, tooltip } from 'cc.decorator';
import { EDITOR_NOT_IN_PREVIEW, JSB } from 'internal:constants';
import { Component } from '../../scene-graph/component';
import { misc } from '../../core';
import { UIRenderer } from '../framework/ui-renderer';
import { Node } from '../../scene-graph';

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
@disallowMultiple
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
        value = misc.clampf(value, 0, 255);
        this._opacity = value;
        this.node._uiProps.localOpacity = value / 255;

        this.setEntityLocalOpacityDirtyRecursively(true);

        if(EDITOR_NOT_IN_PREVIEW) {
            setTimeout(()=>{
                EditorExtends.Node.emit('change', this.node.uuid, this.node);
            }, 200);
        }

    }

    private setEntityLocalOpacityDirtyRecursively (dirty: boolean) {
        if (JSB) {
            // const render = this.node._uiProps.uiComp as UIRenderer;
            // if (render) {
            //     render.setEntityOpacity(this.node._uiProps.localOpacity);
            // }
            // UIRenderer.setEntityColorDirtyRecursively(this.node, dirty);

            UIOpacity.setEntityLocalOpacityDirtyRecursively(this.node, dirty, 1);
        }
    }

    // for UIOpacity
    public static setEntityLocalOpacityDirtyRecursively (node: Node, dirty: boolean, interruptParentOpacity: number) {
        if (!node.isValid) {
            // Since children might be destroyed before the parent,
            // we should add protecting condition when executing recursion downwards.
            return;
        }

        const render = node._uiProps.uiComp as UIRenderer;
        const uiOp = node.getComponent<UIOpacity>(UIOpacity);
        let interruptOpacity = interruptParentOpacity;// if there is no UIOpacity component, it should always equal to 1.

        if (render && render.color) { // exclude UIMeshRenderer which has not color
            render.renderEntity.colorDirty = dirty;
            if (uiOp) {
                render.renderEntity.localOpacity = interruptOpacity * uiOp.opacity / 255;
            } else {
                // there is a just UIRenderer but no UIOpacity on the node, we should just transport the parentOpacity to the node.
                render.renderEntity.localOpacity = interruptOpacity;
            }
            interruptOpacity = 1;
        } else if (uiOp) {
            // there is a just UIOpacity but no UIRenderer on the node.
            // we should transport the interrupt opacity downward
            interruptOpacity = interruptOpacity * uiOp.opacity / 255;
        }

        for (let i = 0; i < node.children.length; i++) {
            UIOpacity.setEntityLocalOpacityDirtyRecursively(node.children[i], dirty || (interruptOpacity < 1), interruptOpacity);
        }
    }

    @serializable
    protected _opacity = 255;

    public onEnable () {
        this.node._uiProps.localOpacity = this._opacity / 255;
        this.setEntityLocalOpacityDirtyRecursively(true);
    }

    public onDisable () {
        this.node._uiProps.localOpacity = 1;
        this.setEntityLocalOpacityDirtyRecursively(true);
    }
}
