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

import { Model } from '../../render-scene/scene/model';
import { MorphRenderingInstance } from '../assets/morph-rendering';
import { Material } from '../../asset/assets/material';
import { RenderingSubMesh } from '../../asset/assets/rendering-sub-mesh';
import { DescriptorSet } from '../../gfx';
import { IMacroPatch } from '../../render-scene';

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
    public initSubModel (subModelIndex: number, subMeshData: RenderingSubMesh, material: Material): void {
        return super.initSubModel(
            subModelIndex,
            subMeshData,
            this._launderMaterial(material),
        );
    }

    public destroy (): void {
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
    public setSubModelMaterial (subModelIndex: number, material: Material): void {
        return super.setSubModelMaterial(subModelIndex, this._launderMaterial(material));
    }

    /**
     * Sets morph rendering instance for the model, it's managed by the MeshRenderer
     * @internal
     */
    public setMorphRendering (morphRendering: MorphRenderingInstance): void {
        this._morphRenderingInstance = morphRendering;
    }

    protected _updateLocalDescriptors (submodelIdx: number, descriptorSet: DescriptorSet): void {
        super._updateLocalDescriptors(submodelIdx, descriptorSet);

        if (this._morphRenderingInstance) {
            this._morphRenderingInstance.adaptPipelineState(submodelIdx, descriptorSet);
        }
    }

    private _launderMaterial (material: Material): Material {
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
