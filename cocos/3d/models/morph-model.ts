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

/**
 * @packageDocumentation
 * @hidden
 */

import { Model } from '../../core/renderer/scene/model';
import { MorphRenderingInstance } from '../assets/morph';
import { Material } from '../../core/assets/material';
import { RenderingSubMesh } from '../../core/assets/rendering-sub-mesh';
import { DescriptorSet } from '../../core/gfx';
import { IMacroPatch } from '../../core/renderer';
import { JSB } from '../../core/default-constants';

export class MorphModel extends Model {
    private _morphRenderingInstance: MorphRenderingInstance | null = null;
    private _usedMaterials = new Set<Material>();

    public getMacroPatches (subModelIndex: number) : IMacroPatch[] | null {
        if (this._morphRenderingInstance) {
            return this._morphRenderingInstance.requiredPatches(subModelIndex);
        } else {
            return null;
        }
    }

    public initSubModel (subModelIndex: number, subMeshData: RenderingSubMesh, material: Material) {
        return super.initSubModel(
            subModelIndex,
            subMeshData,
            this._launderMaterial(material),
        );
    }

    public destroy () {
        super.destroy();
        this._morphRenderingInstance = null;
    }

    public setSubModelMaterial (subModelIndex: number, material: Material) {
        return super.setSubModelMaterial(subModelIndex, this._launderMaterial(material));
    }

    protected _updateLocalDescriptors (submodelIdx: number, descriptorSet: DescriptorSet) {
        if (JSB) {
            (this as any).setCalledFromJS(true);
        }
        super._updateLocalDescriptors(submodelIdx, descriptorSet);

        if (this._morphRenderingInstance) {
            this._morphRenderingInstance.adaptPipelineState(submodelIdx, descriptorSet);
        }
    }

    private _launderMaterial (material: Material) {
        return material;
        // if (this._usedMaterials.has(material)) {
        //     return new MaterialInstance({
        //         parent: material,
        //     });
        // } else {
        //     this._usedMaterials.add(material);
        //     return material;
        // }
    }

    public setMorphRendering (morphRendering: MorphRenderingInstance) {
        this._morphRenderingInstance = morphRendering;
    }
}
