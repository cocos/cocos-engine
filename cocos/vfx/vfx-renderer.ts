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

import { ccclass, visible, override, executeInEditMode, requireComponent, menu } from 'cc.decorator';
import { legacyCC } from '../core/global-exports';
import { ModelRenderer } from '../misc';
import { VFXEmitter } from './vfx-emitter';
import { vfxManager } from './vfx-manager';
import { scene } from '../render-scene';
import { Vec3 } from '../core';

@ccclass('cc.VFXRenderer')
@menu('Effects/VFXRenderer')
@executeInEditMode
@requireComponent(VFXEmitter)
export class VFXRenderer extends ModelRenderer {
    @override
    @visible(false)
    get sharedMaterials () {
        return super.sharedMaterials;
    }

    set sharedMaterials (val) {
        super.sharedMaterials = val;
    }

    private _model: scene.Model | null = null;
    private _emitter: VFXEmitter | null = null;

    public onEnable () {
        this._emitter = this.getComponent(VFXEmitter);
        if (!this._model) {
            this._model = legacyCC.director.root.createModel(scene.Model) as scene.Model;
            this._model.visFlags = this.node.layer;
            this._model.node = this._model.transform = this.node;
            this._model.createBoundingShape(Vec3.ZERO, Vec3.ZERO);
        }
        this._models.push(this._model);
        this._getRenderScene().addModel(this._model);
        vfxManager.addRenderer(this);
    }

    public onDisable () {
        this._model!.scene!.removeModel(this._model!);
        this._models.length = 0;
        vfxManager.removeRenderer(this);
    }

    public onDestroy () {
        if (this._model) {
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
        }
    }

    // internal function
    public updateRenderData () {
        if (!this._emitter || !this._model) return;
        this._model.enabled = this._emitter.particleCount !== 0;
        if (this._emitter.particleCount === 0) {
            return;
        }
        this._emitter.render();
        const model = this._model;
        const subModels = model.subModels;
        const renderers = this._emitter.renderers;
        const materials = this._materials;
        const materialInstances = this._materialInstances;
        let subModelIndex = 0;
        for (let i = 0, length = renderers.length; i < length; i++) {
            const renderer = renderers[i];
            if (!renderer.enabled) continue;
            const { renderingSubMesh, material, sharedMaterial } = renderer;
            if (renderingSubMesh && material) {
                let materialDirty = false;
                if (materialInstances[subModelIndex] !== material) {
                    materials[subModelIndex] = sharedMaterial;
                    materialInstances[subModelIndex] = material;
                    materialDirty = true;
                }
                let subModel = subModels[subModelIndex];
                if (!subModel) {
                    model.initSubModel(subModelIndex, renderingSubMesh, material);
                    subModel = subModels[subModelIndex];
                } else if (subModel.subMesh !== renderingSubMesh || materialDirty) {
                    model.setSubModelMesh(i, renderingSubMesh);
                    model.setSubModelMaterial(i, material);
                }
                subModel.inputAssembler.instanceCount = renderer.instanceCount;
                subModel.inputAssembler.vertexCount = renderer.vertexCount;
                subModel.inputAssembler.indexCount = renderer.indexCount;
                subModel.inputAssembler.firstInstance = renderer.firstInstance;
                subModel.inputAssembler.firstVertex = renderer.firstVertex;
                subModel.inputAssembler.firstIndex = renderer.firstIndex;
                subModelIndex++;
            }
        }
        if (subModelIndex < subModels.length) {
            for (let i = subModelIndex, length = subModels.length; i < length; i++) {
                subModels[i].destroy();
            }
            subModels.length = subModelIndex;
        }
        model.worldBounds.copy(this._emitter.bounds);
    }
}
