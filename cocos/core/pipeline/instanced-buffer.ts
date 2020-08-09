/**
 * @hidden
 */

import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXDevice } from '../gfx';
import { GFXBuffer } from '../gfx/buffer';
import { GFXInputAssembler, IGFXAttribute } from '../gfx/input-assembler';
import { IInstancedAttributeBlock, Pass } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { SubModelView, SubModelPool, ShaderHandle, DescriptorSetHandle, PassHandle } from '../renderer/core/memory-pools';

export interface IInstancedItem {
    count: number;
    capacity: number;
    vb: GFXBuffer;
    data: Uint8Array;
    ia: GFXInputAssembler;
    stride: number;
    hShader: ShaderHandle;
    hDescriptorSet: DescriptorSetHandle;
}

const INITIAL_CAPACITY = 32;
const MAX_CAPACITY = 1024;

export class InstancedBuffer {

    private static _buffers = new Map<Pass | number, InstancedBuffer>();

    public static get (pass: Pass, key?: number) {
        const buffers = InstancedBuffer._buffers;
        const hash = key || pass;
        if (!buffers.has(hash)) {
            const buffer = new InstancedBuffer(pass);
            buffers.set(hash, buffer);
            return buffer;
        }
        return buffers.get(hash)!;
    }

    public instances: IInstancedItem[] = [];
    public hPass: PassHandle = 0;
    public hasPendingModels = false;
    private _device: GFXDevice;

    constructor (pass: Pass) {
        this._device = pass.device;
        this.hPass = pass.handle;
    }

    public destroy () {
        for (let i = 0; i < this.instances.length; ++i) {
            const instance = this.instances[i];
            instance.vb.destroy();
            instance.ia.destroy();
        }
        this.instances.length = 0;
    }

    public merge (subModel: SubModel, attrs: IInstancedAttributeBlock, passIdx: number) {
        const stride = attrs.buffer.length;
        if (!stride) { return; } // we assume per-instance attributes are always present
        const sourceIA = subModel.inputAssembler;
        const hShader = SubModelPool.get(subModel.handle, SubModelView.SHADER_0 + passIdx);
        const hDescriptorSet = SubModelPool.get(subModel.handle, SubModelView.DESCRIPTOR_SET);
        for (let i = 0; i < this.instances.length; ++i) {
            const instance = this.instances[i];
            if (instance.ia.indexBuffer !== sourceIA.indexBuffer || instance.count >= MAX_CAPACITY) { continue; }
            if (instance.stride !== stride) {
                // console.error(`instanced buffer stride mismatch! ${stride}/${instance.stride}`);
                return;
            }
            if (instance.count >= instance.capacity) { // resize buffers
                instance.capacity <<= 1;
                const newSize = instance.stride * instance.capacity;
                const oldData = instance.data;
                instance.data = new Uint8Array(newSize);
                instance.data.set(oldData);
                instance.vb.resize(newSize);
            }
            if (instance.hShader !== hShader) { instance.hShader = hShader; }
            if (instance.hDescriptorSet !== hDescriptorSet) { instance.hDescriptorSet = hDescriptorSet; }
            instance.data.set(attrs.buffer, instance.stride * instance.count++);
            this.hasPendingModels = true;
            return;
        }

        // Create a new instance
        const vb = this._device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: stride * INITIAL_CAPACITY, stride,
        });
        const data = new Uint8Array(stride * INITIAL_CAPACITY);
        const vertexBuffers = sourceIA.vertexBuffers.slice();
        const attributes = sourceIA.attributes.slice();
        const indexBuffer = sourceIA.indexBuffer || undefined;

        for (let i = 0; i < attrs.list.length; i++) {
            const attr = attrs.list[i];
            const newAttr: IGFXAttribute = {
                name: attr.name,
                format: attr.format,
                stream: vertexBuffers.length,
                isInstanced: true,
            };
            if (attr.isNormalized !== undefined) { newAttr.isNormalized = attr.isNormalized; }
            attributes.push(newAttr);
        }
        data.set(attrs.buffer);

        vertexBuffers.push(vb);
        const ia = this._device.createInputAssembler({ attributes, vertexBuffers, indexBuffer });
        this.instances.push({ count: 1, capacity: INITIAL_CAPACITY, vb, data, ia, stride, hShader, hDescriptorSet });
        this.hasPendingModels = true;
    }

    public uploadBuffers () {
        for (let i = 0; i < this.instances.length; ++i) {
            const instance = this.instances[i];
            if (!instance.count) { continue; }
            instance.ia.instanceCount = instance.count;
            instance.vb.update(instance.data);
        }
    }

    public clear () {
        for (let i = 0; i < this.instances.length; ++i) {
            const instance = this.instances[i];
            instance.count = 0;
        }
        this.hasPendingModels = false;
    }
}
