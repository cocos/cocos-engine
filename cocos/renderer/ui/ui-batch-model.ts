import { Material } from '../../3d/assets/material';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';
import { SubModel } from '../scene/submodel';
import { UIDrawBatch } from './ui';

export class UIBatchModel extends Model {

    private _subModel: UISubModel;

    constructor (scene: RenderScene) {
        super(scene, null);
        this._subModel = new UISubModel();
    }

    public updateTransform () {
    }

    public updateUBOs () {
    }

    public initialize (ia: GFXInputAssembler, batch: UIDrawBatch) {
        this._subModel.directInitialize(ia, batch.material!, batch.pipelineState!);
        this._subModels[0] = this._subModel;
    }

    public destroy () {
        this._subModel.destroy();
    }
}

class UISubModel extends SubModel {
    constructor () {
        super();
        this.psos = [];
    }

    public directInitialize (ia: GFXInputAssembler, mat: Material, pso: GFXPipelineState) {
        this._inputAssembler = ia;
        this.psos[0] = pso;
        this.material = mat;
    }

    public destroy () {
        if (this.commandBuffers.length > 0) {
            this.commandBuffers[0].destroy();
        }
    }
}
