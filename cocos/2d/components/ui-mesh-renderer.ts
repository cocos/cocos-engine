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

import { ccclass, help, executionOrder, menu, executeInEditMode } from 'cc.decorator';
import { DEBUG, JSB } from 'internal:constants';
import { ModelRenderer } from '../../misc/model-renderer';
import { RenderPriority } from '../../rendering/define';
import { IBatcher } from '../renderer/i-batcher';
import { Stage } from '../renderer/stencil-manager';
import { Component } from '../../scene-graph/component';
import { NativeUIModelProxy } from '../renderer/native-2d';
import { uiRendererManager } from '../framework/ui-renderer-manager';
import { RenderEntity, RenderEntityType } from '../renderer/render-entity';
import { MeshRenderData, RenderData } from '../renderer/render-data';
import { assert, cclegacy } from '../../core';
import { RenderDrawInfoType } from '../renderer/render-draw-info';

/**
 * @en
 * The component of model.
 * When you place particles or models in the UI, you must add this component to render.
 * The component must be placed on a node with the [[MeshRenderer]] or the [[ParticleSystem]].
 *
 * @zh
 * UI 模型基础组件。
 * 当你在 UI 中放置模型或者粒子的时候，必须添加该组件才能渲染。该组件必须放置在带有 [[MeshRenderer]] 或者 [[ParticleSystem]] 组件的节点上。
 */
@ccclass('cc.UIMeshRenderer')
@help('i18n:cc.UIMeshRenderer')
@executionOrder(110)
@menu('UI/UIMeshRenderer')
@executeInEditMode
export class UIMeshRenderer extends Component {
    constructor () {
        super();
        this._renderEntity = new RenderEntity(RenderEntityType.DYNAMIC);
        if (JSB) {
            this._UIModelNativeProxy = new NativeUIModelProxy();
        }
    }

    /**
     * @en Get the model component on this node
     * @zh 获取同节点的 model 组件
     */
    public get modelComponent () {
        return this._modelComponent;
    }

    private _modelComponent: ModelRenderer | null = null;

    //nativeObj
    private declare _UIModelNativeProxy: NativeUIModelProxy;
    protected declare _renderEntity: RenderEntity;
    public _dirtyVersion = -1;
    public _internalId = -1;

    public __preload () {
        this.node._uiProps.uiComp = this;
    }

    onEnable () {
        uiRendererManager.addRenderer(this);
        this.markForUpdateRenderData();
    }

    onDisable () {
        uiRendererManager.removeRenderer(this);
        this.renderEntity.enabled = this._canRender();
    }

    public onLoad () {
        if (!this.node._uiProps.uiTransformComp) {
            this.node.addComponent('cc.UITransform');
        }

        this._modelComponent = this.getComponent('cc.ModelRenderer') as ModelRenderer;
        if (!this._modelComponent) {
            console.warn(`node '${this.node && this.node.name}' doesn't have any renderable component`);
            return;
        }
        if (JSB) {
            this._UIModelNativeProxy.attachNode(this.node);
        }
        this.renderEntity.setNode(this.node);
    }

    public onDestroy () {
        this.renderEntity.setNode(null);
        if (this.node._uiProps.uiComp === this) {
            this.node._uiProps.uiComp = null;
        }
        this._modelComponent = this.getComponent('cc.ModelRenderer') as ModelRenderer;
        if (!this._modelComponent) {
            return;
        }

        this._modelComponent._sceneGetter = null;
    }

    /**
     * @en Render data submission procedure, it update and assemble the render data to 2D data buffers before all children submission process.
     * Usually called each frame when the ui flow assemble all render data to geometry buffers.
     * Don't call it unless you know what you are doing.
     * @zh 渲染数据组装程序，这个方法会在所有子节点数据组装之前更新并组装当前组件的渲染数据到 UI 的顶点数据缓冲区中。
     * 一般在 UI 渲染流程中调用，用于组装所有的渲染数据到顶点数据缓冲区。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    public _render (render: IBatcher) {
        if (this._modelComponent) {
            const models = this._modelComponent._collectModels();
            // @ts-expect-error: UIMeshRenderer do not attachToScene
            this._modelComponent._detachFromScene();
            for (let i = 0; i < models.length; i++) {
                if (models[i].enabled) {
                    render.commitModel(this, models[i], this._modelComponent.material);
                }
            }
            return true;
        }

        return false;
    }

    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    public fillBuffers (render: IBatcher) {
        if (this.enabled) {
            this._render(render);
        }
    }

    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    // Native updateAssembler
    public updateRenderer () {
        if (JSB) {
            this.renderEntity.enabled = this._canRender();
            if (this._modelComponent) {
                const models = this._modelComponent._collectModels();
                // @ts-expect-error: UIMeshRenderer do not attachToScene
                this._modelComponent._detachFromScene(); // JSB
                // clear models
                this._UIModelNativeProxy.clearModels();
                this._renderEntity.clearDynamicRenderDrawInfos();
                for (let i = 0; i < models.length; i++) {
                    this._uploadRenderData(i);
                    this._UIModelNativeProxy.updateModels(models[i]);
                }
                this._UIModelNativeProxy.attachDrawInfo();
            }
        }
    }

    private _uploadRenderData (index) {
        if (JSB) {
            const renderData = MeshRenderData.add();
            // @ts-expect-error temporary no care
            renderData.initRenderDrawInfo(this, RenderDrawInfoType.MODEL);
            // @ts-expect-error temporary no care
            this._renderData = renderData;
            this._renderData!.material = this._modelComponent!.getMaterialInstance(index);
        }
    }

    /**
     * @en Post render data submission procedure, it's executed after assembler updated for all children.
     * It may assemble some extra render data to the geometry buffers, or it may only change some render states.
     * Don't call it unless you know what you are doing.
     * @zh 后置渲染数据组装程序，它会在所有子节点的渲染数据组装完成后被调用。
     * 它可能会组装额外的渲染数据到顶点数据缓冲区，也可能只是重置一些渲染状态。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     */
    public postUpdateAssembler (render: IBatcher) {
    }

    public update () {
        if (JSB) {
            if (this._modelComponent) {
                this.markForUpdateRenderData();
            }
        }
        this._fitUIRenderQueue();
    }

    private _fitUIRenderQueue () {
        if (!this._modelComponent) {
            return;
        }
        const matNum = this._modelComponent.sharedMaterials.length;
        for (let i = 0; i < matNum; i++) {
            const material = this._modelComponent.getMaterialInstance(i);
            if (material == null) {
                continue;
            }
            const passes = material.passes;
            const passNum = passes.length;
            for (let j = 0; j < passNum; j++) {
                const pass = passes[j];
                // @ts-expect-error private property access
                pass._priority = RenderPriority.MAX - 11;
                // Because the deferred pipeline cannot perform lighting processing on the uimodel,
                // it may even cause the uimodel to crash in the metal backend,
                // so force rendering uimodel in forward pipeline
                material.recompileShaders({ CC_FORCE_FORWARD_SHADING: true }, j);
            }
        }
    }

    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    // interface
    public markForUpdateRenderData (enable = true) {
        uiRendererManager.markDirtyRenderer(this);
    }

    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    public stencilStage: Stage = Stage.DISABLED;

    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    public setNodeDirty () {
    }

    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    public setTextureDirty () {
    }

    protected _canRender () {
        return (this.enabled && this._modelComponent !== null);
    }

    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get renderEntity () {
        if (DEBUG) {
            assert(this._renderEntity, 'this._renderEntity should not be invalid');
        }
        return this._renderEntity;
    }

    protected _renderData: RenderData | null = null;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get renderData () {
        return this._renderData;
    }
}

cclegacy.UIMeshRenderer = UIMeshRenderer;
