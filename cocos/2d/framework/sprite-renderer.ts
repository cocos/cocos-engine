/*
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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

import { ccclass, executeInEditMode, executionOrder, help, menu, serializable, type, visible } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { builtinResMgr, Color, Material, ModelRenderer, Vec2 } from '../../core';
import { legacyCC } from '../../core/global-exports';
import { Model } from '../../core/renderer/scene';
import { Root } from '../../core/root';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { SpriteFrame } from '../assets/sprite-frame';

enum SpriteMode {
    SIMPLE = 0,
    SLICED = 1,
    TILED = 2,
}

@ccclass('cc.SpriteRenderer')
@help('i18n:cc.SpriteRenderer')
@executionOrder(100)
@menu('2D/SpriteRenderer')
@executeInEditMode
export class SpriteRenderer extends ModelRenderer {
    @type(SpriteFrame)
    get spriteFrame () {
        return this._spriteFrame;
    }

    set spriteFrame (value) {
        if (this._spriteFrame === value) {
            return;
        }

        const lastSprite = this._spriteFrame;
        this._spriteFrame = value;
        if (this._spriteFrame) {
            const mesh = this._spriteFrame.mesh;
            mesh.initialize();
        }
        this._updateModels();
        if (this.enabledInHierarchy) {
            this._attachToScene();
        }
        // TODO
        // if (EDITOR) {
        //     lastSprite?.off();
        //     this._spriteFrame?.on();
        // }
    }

    get model () {
        return this._model;
    }

    @serializable
    protected _spriteFrame: SpriteFrame | null = null;
    @serializable
    protected _mode = SpriteMode.SIMPLE;
    @serializable
    protected _color: Color = Color.WHITE.clone();
    @serializable
    protected _flipX = false;
    @serializable
    protected _flipY = false;
    @visible(false)
    @serializable
    protected _size: Vec2 = new Vec2(); // todo for sliced & tiled

    private _model: Model | null = null;

    public onLoad () {
        if (this._spriteFrame) {
            this._spriteFrame.mesh.initialize();
        }
        this._updateModels();
    }

    public onRestore () {
        this._updateModels();
        if (this.enabledInHierarchy) {
            this._attachToScene();
        }
    }

    public onEnable () {
        if (!this._model) {
            this._updateModels();
        }
        this._attachToScene();
    }

    public onDisable () {
        if (this._model) {
            this._detachFromScene();
        }
    }

    public onDestroy () {
        if (this._model) {
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
            this._models.length = 0;
        }
    }

    protected _updateModels () {
        if (!this._spriteFrame) {
            return;
        }

        const model = this._model;
        if (model) {
            model.destroy();
            model.initialize();
            model.node = model.transform = this.node;
        } else {
            this._createModel();
        }

        if (this._model) {
            const mesh = this._spriteFrame.mesh;
            this._model.createBoundingShape(mesh.struct.minPosition, mesh.struct.maxPosition);
            this._updateModelParams();
            this._onUpdateLocalDescriptorSet();
        }
    }

    protected _createModel () {
        const model = this._model = (legacyCC.director.root as Root).createModel<Model>(Model);
        model.visFlags = this.visibility;
        model.node = model.transform = this.node;
        this._models.length = 0;
        this._models.push(this._model);
    }

    protected _updateModelParams () {
        if (!this._spriteFrame || !this._model) { return; }
        const mesh = this._spriteFrame.mesh;
        this.node.hasChangedFlags |= TransformBit.POSITION;
        this._model.transform.hasChangedFlags |= TransformBit.POSITION;
        const meshCount = mesh ? mesh.renderingSubMeshes.length : 0;
        const renderingMesh = mesh.renderingSubMeshes;
        if (renderingMesh) {
            for (let i = 0; i < meshCount; ++i) {
                let material = this.getRenderMaterial(i);
                if (material && !material.isValid) {
                    material = null;
                }
                const subMeshData = renderingMesh[i];
                if (subMeshData) {
                    this._model.initSubModel(i, subMeshData, material || this._getBuiltinMaterial());
                }
            }
        }
        this._model.enabled = true;
    }

    protected _getBuiltinMaterial () {
        // classic ugly pink indicating missing material
        return builtinResMgr.get<Material>('missing-material');
    }

    protected _onMaterialModified (idx: number, material: Material | null) {
        super._onMaterialModified(idx, material);
        if (!this._spriteFrame || !this._model || !this._model.inited) {
            return;
        }
        this._onRebuildPSO(idx, material || this._getBuiltinMaterial());
    }

    protected _onRebuildPSO (idx: number, material: Material) {
        if (!this._model || !this._model.inited) { return; }
        this._model.setSubModelMaterial(idx, material);
        this._onUpdateLocalDescriptorSet();
    }

    protected _onUpdateLocalDescriptorSet () {
        if (!this._spriteFrame || !this._model || !this._model.inited) {
            return;
        }
        // For Local descriptorSet,Need a manager to cache it
        const texture = this._spriteFrame.getGFXTexture()!;
        const sampler = this._spriteFrame.getGFXSampler();
        this._model.updateTexture(texture, sampler);
    }

    protected _attachToScene () {
        if (!this.node.scene || !this._model) {
            return;
        }
        const renderScene = this._getRenderScene();
        if (this._model.scene !== null) {
            this._detachFromScene();
        }
        renderScene.addModel(this._model);
    }

    protected _detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }
}
