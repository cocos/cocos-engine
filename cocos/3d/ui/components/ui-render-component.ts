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

import { Component } from '../../../components/component';
import {
    ccclass,
    executeInEditMode,
    executionOrder,
    property,
    requireComponent,
} from '../../../core/data/class-decorator';
import { EventType} from '../../../core/platform/event-manager/event-enum';
import { ccenum } from '../../../core/value-types/enum';
import { Color } from '../../../core/value-types/index';
import { GFXBlendFactor } from '../../../gfx/define';
import { RenderData } from '../../../renderer/ui/renderData';
import { UI } from '../../../renderer/ui/ui';
import { Material } from '../../assets/material';
import { RenderableComponent } from '../../framework/renderable-component';
import { IAssembler, IAssemblerManager } from '../assembler/assembler';
import { CanvasComponent } from './canvas-component';
import { UITransformComponent } from './ui-transfrom-component';

// hack
ccenum(GFXBlendFactor);

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
@executeInEditMode
export class UIRenderComponent extends Component {

    public static BlendState = GFXBlendFactor;

    /**
     * !#en specify the source Blend Factor, this will generate a custom material object
     * please pay attention to the memory cost.
     * !#zh 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的
     * @property srcBlendFactor
     * sprite.srcBlendFactor = macro.BlendFactor.ONE;
     */
    @property({
        type: GFXBlendFactor,
    })
    get srcBlendFactor () {
        return this._srcBlendFactor;
    }

    set srcBlendFactor (value: GFXBlendFactor) {
        if (this._srcBlendFactor === value) {
            return;
        }

        this._srcBlendFactor = value;
        this._updateBlendFunc();
    }

    /**
     * !#en specify the destination Blend Factor.
     * !#zh 指定目标的混合模式
     * @property dstBlendFactor
     * @type {macro.BlendFactor}
     * @example
     * sprite.dstBlendFactor = GFXBlendFactor.ONE;
     */
    @property({
        type: GFXBlendFactor,
    })
    get dstBlendFactor () {
        return this._dstBlendFactor;
    }

    set dstBlendFactor (value: GFXBlendFactor) {
        if (this._dstBlendFactor === value) {
            return;
        }

        this._dstBlendFactor = value;
        this._updateBlendFunc();
    }

    /**
     * !#en render order, render order according to width, and arrange once under the same level node.
     * !#zh 渲染先后顺序，按照广度渲染排列，同级节点下进行一次排列
     */
    @property
    get priority () {
        return this._priority;
    }

    set priority (value) {
        this._priority = value;
    }

    /**
     * !#en render color
     * !#zh 渲染颜色
     * @property color
     */
    @property
    get color () {
        return this._color;
    }

    set color (value) {
        if (this._color === value) {
            return;
        }

        this._color = value;
        this.markForUpdateRenderData();
    }

    /**
     * !#en render material
     * !#zh 渲染共用材质
     * @property material
     */
    @property({
        type: Material,
    })
    get sharedMaterial () {
        return this._sharedMaterial;
    }

    set sharedMaterial (value) {
        if (this._sharedMaterial === value) {
            return;
        }

        this._sharedMaterial = value;
        this._instanceMaterial();
    }

    get material () {
        return this._material;
    }

    /**
     * !#en find the rendered camera
     * !#zh 查找被渲染相机
     */
    get visibility () {
        return this._visibility;
    }

    get renderData () {
        return this._renderData;
    }

    public static Assembler: IAssemblerManager | null = null;
    public static PostAssembler: IAssemblerManager | null = null;

    @property
    protected _srcBlendFactor = GFXBlendFactor.SRC_ALPHA;
    @property
    protected _dstBlendFactor = GFXBlendFactor.ONE_MINUS_SRC_ALPHA;
    @property
    protected _color: Color = Color.WHITE;
    @property
    protected _priority = 0;
    @property
    protected _sharedMaterial: Material | null = null;

    protected _assembler: IAssembler | null = null;
    protected _postAssembler: IAssembler | null = null;
    protected _renderDataPoolID = -1;
    protected _visibility = -1;
    protected _renderData: RenderData | null = null;
    protected _renderDataDirty = false;
    // 特殊渲染标记，在可渲染情况下，因为自身某个原因不给予渲染
    protected _renderPermit = true;
    protected _material: Material | null = null;
    protected _blendTemplate = {
        blendState: {
            targets: [
                {
                    blendSrc: GFXBlendFactor.SRC_ALPHA,
                    blendDst: GFXBlendFactor.ONE_MINUS_SRC_ALPHA,
                },
            ],
        },
        depthStencilState: {},
        rasterizerState: {},
    };

    // _allocedDatas = [];
    // _vertexFormat = null;
    // _toPostHandle = false;

    constructor () {
        super();
        // this._assembler = this.constructor._assembler;
        // this._postAssembler = this.constructor._postAssembler;
    }

    public __preload (){
        this._instanceMaterial();
    }

    public onEnable () {
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

        this.node.on(EventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.on(EventType.TRANSFORM_CHANGED, this._nodeStateChange, this);
        this.node.on(EventType.SIZE_CHANGED, this._nodeStateChange, this);
        // if (this.node._renderComponent) {
        //     this.node._renderComponent.enabled = false;
        // }
        // this.node._renderComponent = this;
        // this.node._renderFlag |= RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA | RenderFlow.FLAG_COLOR;
        this._renderDataDirty = true;
    }

    public onDisable () {
        this._visibility = -1;
        // this.node._renderComponent = null;
        // this.disableRender();
        this.node.off(EventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.off(EventType.TRANSFORM_CHANGED, this._nodeStateChange, this);
        this.node.off(EventType.SIZE_CHANGED, this._nodeStateChange, this);
    }

    public onDestroy () {
        // for (let i = 0, l = this._allocedDatas.length; i < l; i++) {
        //     RenderData.free(this._allocedDatas[i]);
        // }
        // this._allocedDatas.length = 0;
        this.destroyRenderData();
        this._updateMaterial(null);
        this._renderData = null;
    }

    public markForUpdateRenderData (enable: boolean = true) {
        if (enable && this._canRender()) {
            const renderData = this._renderData;
            if (renderData) {
                renderData.uvDirty = true;
                renderData.vertDirty = true;
            }

            this._renderDataDirty = enable;
        }
        else if (!enable) {
            this._renderDataDirty = enable;
        }
    }

    public requestRenderData () {
        const data = RenderData.add();
        // this._allocedDatas.push(data);
        this._renderData = data.data;
        this._renderDataPoolID = data.pooID;
        return this._renderData;
    }

    public destroyRenderData () {
        if (this._renderDataPoolID === -1) {
            return;
        }

        RenderData.remove(this._renderDataPoolID);
        this._renderDataPoolID = -1;
        this._renderData = null;
    }

    public updateAssembler (render: UI) {
        if (!this._canRender()) {
            return false;
        }

        if (this.node.hasChanged && !this._renderDataDirty) {
            this.markForUpdateRenderData();
        }

        this._checkAndUpdateRenderData();
        return true;
    }

    public postUpdateAssembler (render: UI) {
    }

    public updateRenderData (force = false) {

    }

    protected _checkAndUpdateRenderData (){
        if (this._renderDataDirty) {
            this._assembler!.updateRenderData!(this);
            this._renderDataDirty = false;
        }
    }

    protected _canRender () {
        return this._material !== null && this._renderPermit;
    }

    protected _updateColor () {
        const material = this._material;
        if (material) {
            material.setProperty('color', this._color);
        }
    }

    protected _updateMaterial (material: Material | null) {
        this._material = material;

        this._updateBlendFunc();
    }

    protected _updateBlendFunc () {
        if (!this._material) {
            return;
        }

        const target = this._blendTemplate.blendState.targets[0];
        if (target.blendDst !== this._dstBlendFactor || target.blendSrc !== this._srcBlendFactor) {
            target.blendDst = this._dstBlendFactor;
            target.blendSrc = this._srcBlendFactor;
            this._blendTemplate.depthStencilState = this._material.passes[0].depthStencilState;
            this._blendTemplate.rasterizerState = this._material.passes[0].rasterizerState;
            this._material.overridePipelineStates(this._blendTemplate, 0);
        }
    }

    // pos, rot, scale changed
    protected _nodeStateChange (){
        if (this._renderData) {
            this.markForUpdateRenderData();
        }

        for (const child of this.node.children) {
            const renderComp = child.getComponent(UIRenderComponent);
            if (renderComp) {
                renderComp.updateRenderData();
            }
        }
    }

    private _instanceMaterial (){
        if (this._sharedMaterial) {
            this._updateMaterial(Material.getInstantiatedMaterial(this._sharedMaterial, new RenderableComponent(), CC_EDITOR ? true : false));
        }
    }
}

cc.UIRenderComponent = UIRenderComponent;
