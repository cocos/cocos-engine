import { Material } from '../../3d/assets/material';
import { IRenderingSubmesh } from '../../3d/assets/mesh';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType, GFXStatus } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler, IGFXInputAssemblerInfo } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { RenderPriority } from '../../pipeline/define';
import { Pass } from '../core/pass';

export class SubModel {
    protected _subMeshObject: IRenderingSubmesh | null;
    protected _inputAssembler: GFXInputAssembler | null;
    private _material: Material | null;
    private _cmdBuffers: GFXCommandBuffer[];
    private _psos: GFXPipelineState[] | null;
    private _castShadow: boolean;
    private _priority: RenderPriority;

    constructor () {
        this._subMeshObject = null;
        this._material = null;
        this._cmdBuffers = new Array<GFXCommandBuffer>();
        this._psos = null;
        this._castShadow = false;
        this._inputAssembler = null;
        this._priority = RenderPriority.DEFAULT;
    }

    public initialize (subMesh: IRenderingSubmesh, mat: Material, psos: GFXPipelineState[]) {
        this._psos = psos;
        this.subMeshData = subMesh;

        this.material = mat;
    }

    public destroy () {
        if (this._inputAssembler) {
            this._inputAssembler.destroy();
        }
        for (let i = 0; i < this.passes.length; i++) {
            this.passes[i].destroyPipelineState(this._psos![i]);
        }
        for (const cmdBuffer of this._cmdBuffers) {
            cmdBuffer.destroy();
        }
        this._cmdBuffers.splice(0);
    }

    set priority (val: RenderPriority) {
        this._priority = val;
    }

    get priority () {
        return this._priority;
    }

    set subMeshData (sm: IRenderingSubmesh) {
        if (this._inputAssembler) {
            this._inputAssembler.destroy();
        }
        this._subMeshObject = sm;
        const iaInfo = {} as IGFXInputAssemblerInfo;
        iaInfo.attributes = this._subMeshObject!.attributes;
        iaInfo.vertexBuffers = this._subMeshObject!.vertexBuffers;
        if (this._subMeshObject!.indexBuffer) {
            iaInfo.indexBuffer = this._subMeshObject!.indexBuffer;
        }
        if (this._subMeshObject!.indirectBuffer) {
            iaInfo.indirectBuffer = this._subMeshObject!.indirectBuffer;
        }
        if (this._inputAssembler) {
            this._inputAssembler.initialize(iaInfo);
        } else {
            this._inputAssembler = (cc.director.root.device as GFXDevice).createInputAssembler(iaInfo);
        }
    }

    get subMeshData () {
        return this._subMeshObject!;
    }

    get psos (): GFXPipelineState[] {
        return this._psos!;
    }

    set psos (val: GFXPipelineState[]) {
        this._psos = val;
    }

    set material (material: Material | null) {
        this._material = material;
        if (material == null) {
            return;
        }
        for (let i = 0; i < this._material!.passes.length; i++) {
            if (this._material!.passes[i].primitive !== this._subMeshObject!.primitiveMode) {
                cc.error(`the model(%d)'s primitive type doesn't match its pass's`, i);
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

    get material (): Material | null {
        return this._material!;
    }

    get inputAssembler (): GFXInputAssembler | null {
        return this._inputAssembler;
    }

    get castShadow (): boolean {
        return this._castShadow;
    }

    set castShadow (val: boolean) {
        this._castShadow = val;
    }

    private recordCommandBuffer (index: number) {
        const device = cc.director.root.device as GFXDevice;
        const pso = this._psos![index];
        if (this._cmdBuffers[index] == null) {
            const cmdBufferInfo = {
                allocator: device.commandAllocator,
                type: GFXCommandBufferType.SECONDARY,
            };
            this._cmdBuffers[index] = device.createCommandBuffer(cmdBufferInfo);
        } else if (this._cmdBuffers[index].status == GFXStatus.UNREADY) {
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

    get passes (): Pass[] {
        return this._material!.passes;
    }

    get commandBuffers (): GFXCommandBuffer[] {
        return this._cmdBuffers;
    }
}
