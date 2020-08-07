import { Model } from '../scene/model';
import { MorphRenderingInstance } from '../../assets/morph';
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/mesh';
import { GFXDescriptorSet } from '../../gfx';

export class MorphModel extends Model {
    private _morphRenderingInstance: MorphRenderingInstance | null = null;
    private _usedMaterials = new Set<Material>();

    public getMacroPatches (subModelIndex: number) : any {
        if (this._morphRenderingInstance) {
            return this._morphRenderingInstance.requiredPatches(subModelIndex);
        } else {
            return undefined;
        }
    }

    public initSubModel (subModelIndex: number, subMeshData: RenderingSubMesh, material: Material) {
        return super.initSubModel(
            subModelIndex,
            subMeshData,
            this._launderMaterial(material),
        );
    }

    public setSubModelMaterial (subModelIndex: number, material: Material) {
        return super.setSubModelMaterial(subModelIndex, this._launderMaterial(material));
    }

    protected _updateLocalDescriptors (submodelIdx: number, descriptorSet: GFXDescriptorSet) {
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
