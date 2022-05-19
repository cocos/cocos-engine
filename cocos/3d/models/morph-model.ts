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

import { Model } from '../../core/renderer/scene/model';
import { MorphRenderingInstance } from '../assets/morph-rendering';
import { Material } from '../../core/assets/material';
import { RenderingSubMesh } from '../../core/assets/rendering-sub-mesh';
import { DescriptorSet } from '../../core/gfx';
import { IMacroPatch } from '../../core/renderer';

/**
 * @en
 * The model that support morph target rendering.
 * @zh
 * 支持渲染蒙皮形变的模型。
 */
export class MorphModel extends Model {
    private _morphRenderingInstance: MorphRenderingInstance | null = null;
    private _usedMaterials = new Set<Material>();

    /**
     * @en Acquire the material's macro patches for the given sub model.
     * @zh 获取指定子模型的材质宏组合。
     * @param subModelIndex @en The index for the requested sub model. @zh 子模型的序号。
     * @returns @en The macro patches. @zh 材质宏组合
     */
    public getMacroPatches (subModelIndex: number) : IMacroPatch[] | null {
        const superMacroPatches = super.getMacroPatches(subModelIndex);
        if (this._morphRenderingInstance) {
            const morphInstanceMacroPatches = this._morphRenderingInstance.requiredPatches(subModelIndex);
            if (morphInstanceMacroPatches) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return morphInstanceMacroPatches.concat(superMacroPatches ?? []);
            }
        }
        return superMacroPatches;
    }

    /**
     * @en Initialize a sub model with the sub mesh data and the material.
     * @zh 用子网格数据和材质初始化一个子模型。
     * @param idx @en The index of the sub model @zh 子模型的序号
     * @param subMeshData @en The sub mesh data to be set @zh 需要设置的子网格
     * @param mat sub material
     */
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

    /**
     * @en Sets the material for a given sub model.
     * @zh 给指定的子模型设置材质。
     * @param subModelIndex @en The index of the sub model @zh 子模型的序号
     * @param material @en The material to be set @zh 需要设置的材质
     * @returns void
     */
    public setSubModelMaterial (subModelIndex: number, material: Material) {
        return super.setSubModelMaterial(subModelIndex, this._launderMaterial(material));
    }

    /**
     * Sets morph rendering instance for the model, it's managed by the MeshRenderer
     * @internal
     */
    public setMorphRendering (morphRendering: MorphRenderingInstance) {
        this._morphRenderingInstance = morphRendering;
    }

    protected _updateLocalDescriptors (submodelIdx: number, descriptorSet: DescriptorSet) {
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
}
