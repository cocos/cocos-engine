import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/mesh';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { RenderPriority } from '../../pipeline/define';
import { IMacroPatch } from '../core/pass';
import { DescriptorSetsPool, PSOCIPool, PSOCIView } from '../core/memory-pools';
import { legacyCC } from '../../global-exports';

export class SubModel {

    public priority: RenderPriority = RenderPriority.DEFAULT;
    protected _psociHandles: number[] = [];
    protected _subMeshObject: RenderingSubMesh | null = null;
    protected _material: Material | null = null;
    protected _inputAssembler: GFXInputAssembler | null = null;
    protected _cmdBuffers: GFXCommandBuffer[] = [];
    protected _patches? : IMacroPatch[];

    get psoInfos () {
        return this._psociHandles;
    }

    set subMeshData (sm) {
        if (this._inputAssembler) {
            this._inputAssembler.destroy();
        }
        this._subMeshObject = sm;
        if (this._inputAssembler) {
            this._inputAssembler.initialize(sm);
        } else {
            this._inputAssembler = (legacyCC.director.root.device as GFXDevice).createInputAssembler(sm);
        }
    }

    get subMeshData () {
        return this._subMeshObject!;
    }

    set material (material) {
        this.destroyPipelineRelatedResource();

        this._material = material;
        this.getPipelineCreateInfo();
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

    public initialize (subMesh: RenderingSubMesh, mat: Material, patches?: IMacroPatch[]) {
        this.subMeshData = subMesh;
        this._patches = patches;
        this.material = mat;
    }

    public destroy () {
        if (this._inputAssembler) {
            this._inputAssembler.destroy();
            this._inputAssembler = null;
        }
        this.destroyPipelineRelatedResource();
        this._material = null;
    }

    public update () {
        for (let i = 0; i < this.passes.length; ++i) {
            const pass = this.passes[i];
            pass.update();
        }

        this.updateLayout();
    }

    public updateLayout () {
        for (let i = 0; i < this._psociHandles.length; ++i) {
            const psociHandle = this._psociHandles[i];
            if (psociHandle) {
                DescriptorSetsPool.get(PSOCIPool.get(psociHandle, PSOCIView.DESCRIPTOR_SETS)).update();
            }
        }
    }

    public onPipelineStateChanged () {
        const materail = this._material;
        if (!materail) {
            return;
        }

        const passes = materail.passes;
        for (let j = 0; j < passes.length; ++j) {
            const pass = passes[j];
            pass.beginChangeStatesSilently();
            pass.tryCompile(); // force update shaders
            pass.endChangeStatesSilently();
        }
        this._psociHandles.length = 0;

        this.getPipelineCreateInfo();
    }

    protected getPipelineCreateInfo () {
        if (!this._material) {
            return;
        }
        const passes = this._material.passes;
        for (let i = 0; i < passes.length; ++i) {
            const psociHandle = passes[i].createPipelineStateCI(this._patches);
            if (psociHandle) {
                this._psociHandles[i] = psociHandle;
            }
        }
    }

    protected destroyPipelineRelatedResource () {
        if (!this._material) {
            return;
        }
        const passes = this._material.passes;
        for (let i = 0; i < passes.length; ++i) {
            if (this._psociHandles[i]) {
                passes[i].destroyPipelineStateCI(this._psociHandles[i]);
            }
        }
        this._psociHandles.length = 0;
    }
}
