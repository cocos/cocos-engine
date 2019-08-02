/*
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

import { Component } from '../../../components';
import { ccclass, disallowMultiple, executeInEditMode, executionOrder, property } from '../../../core/data/class-decorator';
import { SystemEventType } from '../../../core/platform/event-manager/event-enum';
import { INode } from '../../../core/utils/interfaces';
import { UI } from '../../../renderer/ui/ui';
import { CanvasComponent } from './canvas-component';

/**
 * @zh
 * UI 及 UI 模型渲染基类。
 */
@ccclass('cc.UIComponent')
@executionOrder(110)
@disallowMultiple
@executeInEditMode
export class UIComponent extends Component {

    /**
     * @zh
     * 渲染先后顺序，按照广度渲染排列，按同级节点下进行一次排列。
     */
    @property
    get priority () {
        return this._priority;
    }

    set priority (value) {
        if (this._priority === value) {
            return;
        }

        this._priority = value;
        this._sortSiblings();
    }

    /**
     * @zh
     * 查找被渲染相机。
     */
    get visibility () {
        return this._visibility;
    }

    @property
    protected _priority = 0;

    protected _visibility = -1;

    private _lastParent: INode | null = null;
    public onEnable () {
        this._lastParent = this.node.parent;
        this._updateVisibility();
        if (this._lastParent) {
            this.node.on(SystemEventType.CHILD_REMOVED, this._parentChanged, this);
        }
        this.node._uiComp = this;
        this._sortSiblings();
    }

    public onDisable () {
        this._cancelEventFromParent();
        if (this.node._uiComp === this) {
            this.node._uiComp = null;
        }
    }

    /**
     * @zh
     * 渲染数据收集。每个渲染组件都由此自身决定是否渲染以及渲染状态的更新。
     *
     * @param render 数据处理中转站。
     */
    public updateAssembler(render: UI) {
    }


    /**
     * @zh
     * 后渲染数据收集。每个渲染组件都由此接口决定是否渲染以及渲染状态的更新。
     * 一般是在自身子节点 updateAssembler 执行完调用。
     *
     * @param render 数据处理中转站。
     */
    public postUpdateAssembler(render: UI) {
    }

    /**
     * @zh
     * 设置当前组件的可视编号。（我们不希望用户自行做处理，除非用户自己知道在做什么）
     */
    public setVisibility (value: number) {
        this._visibility = value;
    }

    protected _parentChanged (node: INode) {
        if (node === this.node) {
            this._updateVisibility();
            this._cancelEventFromParent();
            this._lastParent = this.node.parent;
            this._sortSiblings();
            return true;
        }

        return false;
    }

    private _sortSiblings () {

        const siblings = this.node.parent && this.node.parent.children as Mutable<INode[]>;
        if (siblings) {
            siblings.sort((a: INode, b: INode) => {
                const aComp = a._uiComp;
                const bComp = b._uiComp;
                const ca = aComp ? aComp.priority : 0;
                const cb = bComp ? bComp.priority : 0;
                return ca - cb;
            });
        }
    }

    private _updateVisibility () {
        let parent = this.node;
        // 获取被渲染相机的 visibility
        while (parent) {
            if (parent) {
                const canvasComp = parent.getComponent(CanvasComponent);
                if (canvasComp) {
                    this._visibility = canvasComp.visibility;
                    break;
                }
            }

            // @ts-ignore
            parent = parent.parent;
        }
    }

    private _cancelEventFromParent () {
        if (this._lastParent) {
            this._lastParent.off(SystemEventType.CHILD_REMOVED, this._parentChanged, this);
            this._lastParent = null;
        }

        this._visibility = -1;
    }
}
