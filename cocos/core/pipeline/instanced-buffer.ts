/**
 * @hidden
 */

import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../gfx';
import { GFXBuffer } from '../gfx/buffer';
import { GFXInputAssembler, IGFXAttribute } from '../gfx/input-assembler';
import { GFXPipelineState } from '../gfx/pipeline-state';
import { IInstancedAttributeBlock } from '../renderer';
import { Pass } from '../renderer/core/pass';
import { SubModel } from '../renderer/scene/submodel';

export interface IInstancedItem {
    count: number;
    capacity: number;
    vb: GFXBuffer;
    data: Uint8Array;
    ia: GFXInputAssembler;
}

const INITIAL_CAPACITY = 32;
const MAX_CAPACITY = 1024;

export class InstancedBuffer {
    public instances: IInstancedItem[] = [];
    public pso: GFXPipelineState | null = null;
    public pass: Pass;

    constructor (pass: Pass) {
        this.pass = pass;
    }

    public destroy () {
        for (let i = 0; i < this.instances.length; ++i) {
            const instance = this.instances[i];
            instance.vb.destroy();
            instance.ia.destroy();
        }
        this.instances.length = 0;
    }

    public merge (subModel: SubModel, attrs: IInstancedAttributeBlock, pso: GFXPipelineState) {
        if (!this.pso) { this.pso = pso; }
        const stride = attrs.buffer.length;
        const sourceIA = subModel.inputAssembler!;
        for (let i = 0; i < this.instances.length; ++i) {
            const instance = this.instances[i];
            if (instance.ia.indexBuffer !== sourceIA.indexBuffer || instance.count >= MAX_CAPACITY) { continue; }
            if (instance.count >= instance.capacity) { // resize buffers
                instance.capacity <<= 1;
                const newSize = stride * instance.capacity;
                const oldData = instance.data;
                instance.data = new Uint8Array(newSize);
                instance.data.set(oldData);
                instance.vb.resize(newSize);
            }
            instance.data.set(attrs.buffer, stride * instance.count++);
            return;
        }

        const device = this.pass.device;

        // Create a new instance
        const vb = device.createBuffer({
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
        const ia = device.createInputAssembler({ attributes, vertexBuffers, indexBuffer });
        this.instances.push({ count: 1, capacity: INITIAL_CAPACITY, vb, data, ia });
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
        this.pso = null;
    }
}
