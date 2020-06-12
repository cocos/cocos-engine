import { EDITOR } from 'internal:constants';
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/mesh';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { RenderPriority } from '../../pipeline/define';
import { IMacroPatch } from '../core/pass';
import { GFXShader } from '../../gfx/shader';
import { GFXDynamicState, GFXPrimitiveMode } from '../../gfx/define';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { legacyCC } from '../../global-exports';

export interface IPSOCreateInfo {
    shader: GFXShader;
    primitive: GFXPrimitiveMode;
    rasterizerState: GFXRasterizerState;
    depthStencilState: GFXDepthStencilState;
    blendState: GFXBlendState;
    dynamicStates: GFXDynamicState[];
    bindingLayout: GFXBindingLayout;
    hash: number;
}

export class SubModel {

    public priority: RenderPriority = RenderPriority.DEFAULT;
    protected _psoCreateInfos: IPSOCreateInfo[] = [];
    protected _subMeshObject: RenderingSubMesh | null = null;
    protected _material: Material | null = null;
    protected _inputAssembler: GFXInputAssembler | null = null;
    protected _cmdBuffers: GFXCommandBuffer[] = [];
    protected _patches? : IMacroPatch[];

    get psoInfos () {
        return this._psoCreateInfos;
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
            this._psoCreateInfos[i].hash = pass.hash;
        }

        this.updateLayout();
    }

    public updateLayout () {
        for (let i = 0; i < this._psoCreateInfos.length; ++i) {
            const psoCreateInfo = this._psoCreateInfos[i];
            if (psoCreateInfo) {
                psoCreateInfo.bindingLayout.update();
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
        this._psoCreateInfos.length = 0;

        this.getPipelineCreateInfo();
    }

    protected getPipelineCreateInfo () {
        if (!this._material) {
            return;
        }
        const passes = this._material.passes;
        for (let i = 0; i < passes.length; ++i) {
            const psoCreateInfo = passes[i].createPipelineStateCI(this._patches);
            if (psoCreateInfo) {
                this._psoCreateInfos[i] = psoCreateInfo;
            }
        }
    }

    protected destroyPipelineRelatedResource () {
        if (!this._material) {
            return;
        }
        const passes = this._material.passes;
        for (let i = 0; i < passes.length; ++i) {
            if (this._psoCreateInfos[i]) {
                passes[i].destroyPipelineStateCI(this._psoCreateInfos[i]);
            }
        }
        this._psoCreateInfos.length = 0;
    }
}
