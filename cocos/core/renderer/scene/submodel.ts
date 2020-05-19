import { EDITOR } from 'internal:constants';
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/mesh';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { RenderPriority } from '../../pipeline/define';

export class SubModel {

    public priority: RenderPriority = RenderPriority.DEFAULT;
    protected _psos: GFXPipelineState[] | null = null;
    protected _subMeshObject: RenderingSubMesh | null = null;
    protected _material: Material | null = null;
    protected _inputAssembler: GFXInputAssembler | null = null;
    protected _cmdBuffers: GFXCommandBuffer[] = [];

    set psos (val) {
        this._psos = val;
    }

    get psos () {
        return this._psos;
    }

    set subMeshData (sm) {
        if (this._inputAssembler) {
            this._inputAssembler.destroy();
        }
        this._subMeshObject = sm;
        if (this._inputAssembler) {
            this._inputAssembler.initialize(sm);
        } else {
            this._inputAssembler = (cc.director.root.device as GFXDevice).createInputAssembler(sm);
        }
    }

    get subMeshData () {
        return this._subMeshObject!;
    }

    set material (material) {
        this._material = material;
        if (material == null) {
            return;
        }
    }

    get material () {
        return this._material;
    }

    get passes () {
        return this._material!.passes;
    }

    get inputAssembler () {
        return this._inputAssembler;
    }

    public initialize (subMesh: RenderingSubMesh, mat: Material, psos: GFXPipelineState[]) {
        this.psos = psos;
        this.subMeshData = subMesh;
        this.material = mat;
    }

    public destroy () {
        if (this._inputAssembler) {
            this._inputAssembler.destroy();
            this._inputAssembler = null;
        }
        for (let i = 0; i < this.passes.length; i++) {
            this.passes[i].destroyPipelineState(this._psos![i]);
        }
        this._material = null;
    }
}
