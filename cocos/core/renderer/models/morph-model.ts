import { Model } from '../scene/model';
import { MorphRenderingInstance } from '../../assets/morph';
import { IMacroPatch, Pass } from '../core/pass';
import { Material } from '../../assets/material';
import { MaterialInstance } from '../core/material-instance';
import { RenderingSubMesh } from '../../assets/mesh';

export class MorphModel extends Model {
    private _morphRenderingInstance: MorphRenderingInstance | null = null;
    private _usedMaterials = new Set<Material>();

    protected getMacroPatches(subModelIndex: number) : any {
        if (this._morphRenderingInstance) {
            return this._morphRenderingInstance.requiredPatches(subModelIndex);
        } else {
            return undefined;
        } 
    }

    protected updateAttributesAndBinding(subModelIndex : number) {
        super.updateAttributesAndBinding(subModelIndex);
        
        if (this._morphRenderingInstance) {
            const psoCreateInfos = this._subModels[subModelIndex].psoCreateInfos;
            for (let i = 0;i < psoCreateInfos.length; ++i) {
                this._morphRenderingInstance.adaptPipelineState(subModelIndex, psoCreateInfos[i]);
            }
        }
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