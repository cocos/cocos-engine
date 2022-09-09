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

import { ccclass, disallowMultiple, editable, executeInEditMode, executionOrder, help, menu, serializable, tooltip } from 'cc.decorator';
import { JSB } from 'internal:constants';
import { Component } from '../../core/components/component';
import { clampf } from '../../core/utils/misc';
import { UIRenderer } from '../framework/ui-renderer';
import { Node } from '../../core/scene-graph';

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
        value = clampf(value, 0, 255);
        this._opacity = value;
        this.node._uiProps.localOpacity = value / 255;

        this.resetOpacityDirty(this.node);
        this.setEntityLocalOpacityDirtyRecursively(true);
    }

    public interruptParentOpacity = 1;

    private setEntityLocalOpacityDirtyRecursively (dirty: boolean) {
        if (JSB) {
            // const render = this.node._uiProps.uiComp as UIRenderer;
            // if (render) {
            //     render.setEntityOpacity(this.node._uiProps.localOpacity);
            // }
            // UIRenderer.setEntityColorDirtyRecursively(this.node, dirty);

            // The third parameter should be cached interruptOpacity instead of 1
            UIOpacity.setEntityLocalOpacityDirtyRecursively(this.node, dirty, this.interruptParentOpacity);
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

            // we should only enter the branch on THE FIRST TIME when the opacityDirty is false
            if (!render.renderEntity.opacityDirty) {
                if (uiOp) {
                    uiOp.interruptParentOpacity = interruptOpacity;
                    render.renderEntity.localOpacity = interruptOpacity * uiOp.opacity / 255;
                } else {
                    // there is a just UIRenderer but no UIOpacity on the node, we should just transport the parentOpacity to the node.
                    render.renderEntity.localOpacity = interruptOpacity;
                }
                interruptOpacity = 1;
                render.renderEntity.opacityDirty = true;
            }
        } else if (uiOp) {
            // there is a just UIOpacity but no UIRenderer on the node.
            // we should transport the interrupt opacity downward
            uiOp.interruptParentOpacity = interruptOpacity;
            interruptOpacity = interruptOpacity * uiOp.opacity / 255;
        }

        for (let i = 0; i < node.children.length; i++) {
            UIOpacity.setEntityLocalOpacityDirtyRecursively(node.children[i], dirty || (interruptOpacity < 1), interruptOpacity);
        }
    }

    // If this opacity changes, we should mark opacityDirty of it and its all children as false
    // to recalculate their localOpacity and fill them in entity
    protected resetOpacityDirty (node:Node) {
        const render = node._uiProps.uiComp as UIRenderer;
        if (render && render.color) {
            render.renderEntity.opacityDirty = false;
        }
        for (let i = 0; i < node.children.length; i++) {
            this.resetOpacityDirty(node.children[i]);
        }
    }

    private executeRecursionOnEnable () {
        UIOpacity.executeRecursionOnEnable(this.node);
    }

    public static executeRecursionOnEnable (node:Node) {
        let rootUIOp = node.getComponent<UIOpacity>(UIOpacity);
        let parent = node.parent;
        while (parent) {
            const temp = parent.getComponent<UIOpacity>(UIOpacity);
            if (temp) {
                rootUIOp = temp;
            }
            parent = parent.parent;
        }
        if (rootUIOp) {
            //rootUIOp.resetOpacityDirty(rootUIOp.node);
            rootUIOp.setEntityLocalOpacityDirtyRecursively(true);
        }
    }

    @serializable
    protected _opacity = 255;

    public onEnable () {
        this.node._uiProps.localOpacity = this._opacity / 255;

        //this.setEntityLocalOpacityDirtyRecursively(true);
        // calculate interruptParentOpacity upwards recursively
        this.executeRecursionOnEnable();
    }

    public onDisable () {
        this.node._uiProps.localOpacity = 1;
        this.setEntityLocalOpacityDirtyRecursively(true);
    }
}
