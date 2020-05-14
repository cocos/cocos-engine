import { EDITOR } from 'internal:constants';
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/mesh';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType, GFXStatus } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { RenderPriority } from '../../pipeline/define';
import { legacyCC } from '../../global-exports';

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
            this._inputAssembler = (legacyCC.director.root.device as GFXDevice).createInputAssembler(sm);
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
        this.updateCommandBuffer();
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

    get commandBuffers () {
        return this._cmdBuffers;
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
        for (const cmdBuffer of this._cmdBuffers) {
            cmdBuffer.destroy();
        }
        this._cmdBuffers.length = 0;
        this._material = null;
    }

    public updateCommandBuffer () {
        if (!this._material) { return; }
        for (let i = 0; i < this._material.passes.length; i++) {
            if (EDITOR && this._subMeshObject && this._material.passes[i].primitive !== this._subMeshObject.primitiveMode) {
                console.warn(`mesh primitive type doesn't match with pass settings`);
            }
            this.recordCommandBuffer(i);
        }
        for (let i = this._cmdBuffers.length - 1; i >= this._material!.passes.length; i--) {
            const cmdBuff = this._cmdBuffers.pop();
            if (cmdBuff) {
                cmdBuff.destroy();
            }
        }
    }

    protected recordCommandBuffer (index: number) {
        const device = legacyCC.director.root.device as GFXDevice;
        const pso = this._psos![index];
        if (this._cmdBuffers[index] == null) {
            const cmdBufferInfo = {
                allocator: device.commandAllocator,
                type: GFXCommandBufferType.SECONDARY,
            };
            this._cmdBuffers[index] = device.createCommandBuffer(cmdBufferInfo);
        } else if (this._cmdBuffers[index].status === GFXStatus.UNREADY) {
            this._cmdBuffers[index].initialize({
                allocator: device.commandAllocator,
                type: GFXCommandBufferType.SECONDARY,
            });
        }
        const inputAssembler = this._inputAssembler as GFXInputAssembler;

        const cmdBuff = this._cmdBuffers[index];
        cmdBuff.begin();
        cmdBuff.bindPipelineState(pso);
        cmdBuff.bindBindingLayout(pso.pipelineLayout.layouts[0]);
        cmdBuff.bindInputAssembler(inputAssembler);
        cmdBuff.draw(inputAssembler);
        cmdBuff.end();
    }
}
