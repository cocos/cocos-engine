import { Model } from '../scene/model';
import { MorphRenderingInstance } from '../../assets/morph';
import { IMacroPatch, Pass } from '../core/pass';
import { Material } from '../../assets/material';
import { MaterialInstance } from '../core/material-instance';
import { RenderingSubMesh } from '../../assets/mesh';

export class MorphModel extends Model {
    private _morphRenderingInstance: MorphRenderingInstance | null = null;

    private _usedMaterials = new Set<Material>();

    protected createPipelineState (pass: Pass, subModelIndex: number, patches?: IMacroPatch[]) {
        if (!this._morphRenderingInstance) {
            // @ts-ignore
            return super.createPipelineState(...arguments);
        }
        const myPatches = this._morphRenderingInstance.requiredPatches(subModelIndex);
        const pipelineState = super.createPipelineState(
            pass,
            subModelIndex,
            myPatches ?
                (patches?.concat(myPatches) ?? myPatches):
                patches,
        );
        this._morphRenderingInstance.adaptPipelineState(subModelIndex, pipelineState);
        return pipelineState;
    }

    public initSubModel (subModelIndex: number, subMeshData: RenderingSubMesh, material: Material) {
        return super.initSubModel(
            subModelIndex,
            subMeshData,
            this._launderMaterial(material),
        );
    }

    public setSubModelMaterial (subModelIndex: number, material: Material | null) {
        return super.setSubModelMaterial(
            subModelIndex,
            material ? this._launderMaterial(material) : material,
        );
    }

    private _launderMaterial (material: Material) {
        return material;
        if (this._usedMaterials.has(material)) {
            return new MaterialInstance({
                parent: material,
            });
        } else {
            this._usedMaterials.add(material);
            return material;
        }
    }

    public setMorphRendering (morphRendering: MorphRenderingInstance) {
        this._morphRenderingInstance = morphRendering;
    }
}