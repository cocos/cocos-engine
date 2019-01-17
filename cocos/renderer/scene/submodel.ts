import { IRenderingSubmesh } from "../../3d/assets/mesh";
import { GFXDevice } from "../../gfx/device";
import { Material } from "../../3d/assets/material";
import { GFXCommandBuffer } from "../../gfx/command-buffer";
import { aabb } from "../../3d/geom-utils";
import { Vec3 } from "../../core/value-types";
import { GFXCommandBufferType } from "../../gfx/define";
import { GFXBuffer } from "../../gfx/buffer";
import { UBOLocal } from "../../pipeline/render-pipeline";
import { Pass } from "../core/pass";
import { GFXInputAssembler, IGFXInputAssemblerInfo } from "../../gfx/input-assembler";

export class SubModel {
    protected _subMeshObject: IRenderingSubmesh | null;
    private _inputAssembler: GFXInputAssembler | null;
    private _material: Material | null;
    private _cmdBuffers: GFXCommandBuffer[];
    private _localUBO: GFXBuffer | null;
    private _castShadow: boolean;

    constructor () {
        this._subMeshObject = null;
        this._material = null;
        this._cmdBuffers = new Array<GFXCommandBuffer>();
        this._localUBO = null;
        this._castShadow = false;
        this._inputAssembler = null;
    }

    public initialize (subMesh: IRenderingSubmesh, mat: Material, localUBO: GFXBuffer) {
        this.localUBO = localUBO;
        this.subMeshData = subMesh;
        const iaInfo = {} as IGFXInputAssemblerInfo;
        iaInfo.attributes = this._subMeshObject!.attributes;
        iaInfo.vertexBuffers = this._subMeshObject!.vertexBuffers;
        if (this._subMeshObject!.indexBuffer) {
            iaInfo.indexBuffer = this._subMeshObject!.indexBuffer;
        }
        this._inputAssembler = (cc.director.root.device as GFXDevice).createInputAssembler(iaInfo);

        this.material = mat;
    }

    public destroy () {
        if (this._inputAssembler) {
            this._inputAssembler.destroy();
        }
    }

    set subMeshData (sm: IRenderingSubmesh) {
        this._subMeshObject = sm;
    }

    get subMeshData () {
        return this._subMeshObject!;
    }

    set material (material: Material) {
        this._material = material;
        if (material == null) {
            return;
        }
        for (let i = 0; i < this._material!.passes.length; i++) {
            if (this._material!.passes[i].primitive !== this._subMeshObject!.primitiveMode) {
                cc.error('the model(%d)\'s primitive type doesn\'t match its pass\'s');
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

    set localUBO (val: GFXBuffer) {
        this._localUBO = val;
    }

    get castShadow (): boolean {
        return this._castShadow;
    }

    set castShadow (val: boolean) {
        this._castShadow = val;
    }

    private recordCommandBuffer (index: number) {
        const device = cc.director.root.device;
        const pass = this._material!.passes[index];
        if (this._cmdBuffers[index] == null) {
            const cmdBufferInfo = {
                allocator: device.commandAllocator,
                type: GFXCommandBufferType.SECONDARY,
            };
            this._cmdBuffers[index] = device.createCommandBuffer(cmdBufferInfo);
        }

        const localUBO = this._localUBO as GFXBuffer;
        const inputAssembler = this._inputAssembler as GFXInputAssembler;

        pass.bindingLayout.bindBuffer(UBOLocal.BLOCK.binding, localUBO);

        const cmdBuff = this._cmdBuffers[index];
        cmdBuff.begin();
        cmdBuff.bindPipelineState(pass.pipelineState);
        cmdBuff.bindBindingLayout(pass.bindingLayout);
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
