/****************************************************************************
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
 ****************************************************************************/

import { RenderableComponent } from '../../../3d/framework/renderable-component';
// import gfx from '../../renderer/gfx/index';
import {
    ccclass,
    executeInEditMode,
    executionOrder,
    property,
    requireComponent,
} from '../../../core/data/class-decorator';
import macro from '../../../core/platform/CCMacro';
import { Color } from '../../../core/value-types/index';
import { RenderData } from '../../../renderer/ui/renderData';
import { CanvasComponent } from './canvas-component';
import { UITransformComponent } from './ui-transfrom-component';
import { MeshBuffer } from '../mesh-buffer';
import { IAssembler } from '../assembler/assembler';
import { UI } from '../../../renderer/ui/ui';

/**
 * !#en
 * Base class for components which supports rendering features.
 * !#zh
 * 所有支持渲染的组件的基类
 *
 * @class UIRenderComponent
 * @extends Component
 */
@ccclass('cc.UIRenderComponent')
@executionOrder(100)
@requireComponent(UITransformComponent)
export class UIRenderComponent extends RenderableComponent {

    /**
     * !#en specify the source Blend Factor, this will generate a custom material object
     * please pay attention to the memory cost.
     * !#zh 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的
     * @property srcBlendFactor
     * sprite.srcBlendFactor = macro.BlendFactor.ONE;
     */
    @property({
        type: macro.BlendFactor,
    })
    get srcBlendFactor () {
        return this._srcBlendFactor;
    }
    set srcBlendFactor (value) {
        if (this._srcBlendFactor === value) { return; }
        this._srcBlendFactor = value;
        this._updateBlendFunc(true);
    }

    /**
     * !#en specify the destination Blend Factor.
     * !#zh 指定目标的混合模式
     * @property dstBlendFactor
     * @type {macro.BlendFactor}
     * @example
     * sprite.dstBlendFactor = cc.macro.BlendFactor.ONE;
     */
    @property({
        type: macro.BlendFactor,
    })
    get dstBlendFactor () {
        return this._dstBlendFactor;
    }

    set dstBlendFactor (value) {
        if (this._dstBlendFactor === value) { return; }
        this._dstBlendFactor = value;
        this._updateBlendFunc(true);
    }

    get color () {
        return this._color;
    }

    set color (value) {
        if (this._color === value) {
            return;
        }

        this._color = value;
    }

    get viewID () {
        return this._viewID;
    }

    get renderData () {
        return this._renderData;
    }

    public static assembler = null;

    protected _assembler: IAssembler | null = null;

    protected _postAssembler: IAssembler | null = null;
    protected _renderDataPoolID: number = -1;
    protected _viewID: number = -1;

    protected _srcBlendFactor: number = macro.BlendFactor.SRC_ALPHA;
    protected _dstBlendFactor: number = macro.BlendFactor.ONE_MINUS_SRC_ALPHA;
    @property
    protected _color: Color = Color.WHITE;
    protected _renderData: RenderData | null = null;
    // _allocedDatas = [];
    // _vertexFormat = null;
    // _toPostHandle = false;

    constructor () {
        super();
        // this._assembler = this.constructor._assembler;
        // this._postAssembler = this.constructor._postAssembler;
    }

    public onEnable () {
        let parent = this.node;
        while (parent) {
            if (parent) {
                const canvasComp = parent.getComponent(CanvasComponent);
                if (canvasComp) {
                    this._viewID = canvasComp.visibility;
                    break;
                }
            }

            // @ts-ignore
            parent = parent.parent;
        }
        // if (this.node._renderComponent) {
        //     this.node._renderComponent.enabled = false;
        // }
        // this.node._renderComponent = this;
        // this.node._renderFlag |= RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA | RenderFlow.FLAG_COLOR;
    }

    public onDisable () {
        this._viewID = -1;
        // this.node._renderComponent = null;
        // this.disableRender();
    }

    public onDestroy () {
        // for (let i = 0, l = this._allocedDatas.length; i < l; i++) {
        //     RenderData.free(this._allocedDatas[i]);
        // }
        // this._allocedDatas.length = 0;
        this.destroyRenderData();
        this.material = null;
        this._renderData = null;
    }

    // _canRender() {
    //     return this._enabled;
    // }

    // markForUpdateRenderData(enable) {
    //     // if (enable && this._canRender()) {
    //     //     this.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    //     // }
    //     // else if (!enable) {
    //     //     this.node._renderFlag &= ~RenderFlow.FLAG_UPDATE_RENDER_DATA;
    //     // }
    // }

    // markForRender(enable) {
    //     // if (enable && this._canRender()) {
    //     //     this.node._renderFlag |= RenderFlow.FLAG_RENDER;
    //     // }
    //     // else if (!enable) {
    //     //     this.node._renderFlag &= ~RenderFlow.FLAG_RENDER;
    //     // }
    // }

    // markForCustomIARender(enable) {
    //     // if (enable && this._canRender()) {
    //     //     this.node._renderFlag |= RenderFlow.FLAG_CUSTOM_IA_RENDER;
    //     // }
    //     // else if (!enable) {
    //     //     this.node._renderFlag &= ~RenderFlow.FLAG_CUSTOM_IA_RENDER;
    //     // }
    // }

    // disableRender() {
    //     // this.node._renderFlag &= ~(RenderFlow.FLAG_RENDER | RenderFlow.FLAG_CUSTOM_IA_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA | RenderFlow.FLAG_COLOR);
    // }

    public requestRenderData () {
        const data = RenderData.add();
        // this._allocedDatas.push(data);
        this._renderData = data.data;
        this._renderDataPoolID = data.pooID;
        return this._renderData;
    }

    public destroyRenderData () {
        // let index = this._allocedDatas.indexOf(data);
        // if (index !== -1) {
        //     this._allocedDatas.splice(index, 1);
        //     RenderData.free(data);
        // }
        if (this._renderDataPoolID === -1) {
            return;
        }

        RenderData.remove(this._renderDataPoolID);
        this._renderDataPoolID = -1;
        this._renderData = null;
    }

    public _updateColor () {
        const material = this.material;
        if (material) {
            material.setProperty('color', this._color);
            // material.updateHash();
        }
    }

    // TODO:
    public _updateBlendFunc (updateHash) {
        // if (!this.material) {
        //     return;
        // }

        // var pass = this.material._mainTech.passes[0];
        // pass.setBlend(
        //     gfx.BLEND_FUNC_ADD,
        //     this._srcBlendFactor, this._dstBlendFactor,
        //     gfx.BLEND_FUNC_ADD,
        //     this._srcBlendFactor, this._dstBlendFactor
        // );

        // if (updateHash) {
        //     this.material.updateHash();
        // }
    }

    public updateAssembler (render: UI) {
        if (!this._assembler) {
            return;
        }
        if (this._assembler.updateRenderData) {
            this._assembler.updateRenderData(this);
        }
        this._assembler.fillBuffers(this, render);

        return this._assembler.getRenderBuffers();
    }

    public postUpdateAssembler () {
        if (!this._postAssembler) {
            return;
        }
        if (this._postAssembler.updateRenderData) {
            this._postAssembler.updateRenderData(this);
        }
    }
}

// RenderComponent._assembler = null;
// RenderComponent._postAssembler = null;
