import { EDITOR } from 'internal:constants';
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/mesh';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { RenderPriority } from '../../pipeline/define';
import { IMacroPatch } from '../core/pass';

export class SubModel {

    public priority: RenderPriority = RenderPriority.DEFAULT;
    protected _psos: GFXPipelineState[] = [];
    protected _subMeshObject: RenderingSubMesh | null = null;
    protected _material: Material | null = null;
    protected _inputAssembler: GFXInputAssembler | null = null;
    protected _cmdBuffers: GFXCommandBuffer[] = [];
    protected _pathces? : IMacroPatch[];

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
        this.destroyPipelineStates();

        this._material = material;
        this.createPipelineStates();
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

    public initialize (subMesh: RenderingSubMesh, mat: Material, patches? : IMacroPatch[]) {
        this.subMeshData = subMesh;
        this._pathces = patches;
        this.material = mat;
    }

    public destroy () {
        if (this._inputAssembler) {
            this._inputAssembler.destroy();
            this._inputAssembler = null;
        }
        this.destroyPipelineStates();
        this._material = null;
    }

    public update() {
        for (let i = 0; i < this.passes.length; ++i) {
            this.passes[i].update();
        }

        this.updateLayout();
    }

    public updateLayout() {
        for (let i = 0; i < this._psos.length; ++i) {
            let pso = this._psos[i];
            if (pso) {
                pso.pipelineLayout.layouts[0].update();
            }
        }
    }

    public onPipelineStateChanged() {
        const materail = this._material;
        if (!materail) {
            return;
        }

        const passes = materail.passes;
        for (let j = 0; j < passes.length; ++j) {
            const pass = passes[j];
            pass.destroyPipelineState(this._psos[j]);
            pass.beginChangeStatesSilently();
            pass.tryCompile(); // force update shaders
            pass.endChangeStatesSilently();
        }
        this._psos = [];

        this.createPipelineStates();
    }

    protected createPipelineStates() {
        if (!this._material) {
            return;
        }

        const passes = this._material.passes;
        for (let i = 0; i < passes.length; ++i) {
            const pso = passes[i].createPipelineState(this._pathces);
            if (pso) {
                this._psos[i] = pso;
            }
        }
    }

    protected destroyPipelineStates() {
        if (!this._material) {
            return;
        }

        for (let i = 0; i < this.passes.length; i++) {
            this.passes[i].destroyPipelineState(this._psos[i]);
        }

        this._psos = [];
    }
}
