/**
 * @hidden
 */

import { GFXBufferUsageBit, GFXFormat, GFXMemoryUsageBit } from '../gfx';
import { GFXBuffer } from '../gfx/buffer';
import { GFXInputAssembler } from '../gfx/input-assembler';
import { GFXPipelineState } from '../gfx/pipeline-state';
import { Mat4 } from '../math';
import { Pass } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject } from './define';

export interface IInstancedItem {
    count: number;
    capacity: number;
    strides: number[];
    vbs: GFXBuffer[];
    vbDatas: Float32Array[];
    ia: GFXInputAssembler;
}

const INITIAL_CAPACITY = 32;
const MAX_CAPACITY = 1024;

function uploadMat4AsVec4x3 (out: Float32Array, mat: Mat4, base: number) {
    out[base + 0] = mat.m00;
    out[base + 1] = mat.m01;
    out[base + 2] = mat.m02;
    out[base + 3] = mat.m12;
    out[base + 4] = mat.m04;
    out[base + 5] = mat.m05;
    out[base + 6] = mat.m06;
    out[base + 7] = mat.m13;
    out[base + 8] = mat.m08;
    out[base + 9] = mat.m09;
    out[base + 10] = mat.m10;
    out[base + 11] = mat.m14;
}

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
            for (let j = 0; j < instance.vbs.length; ++j) {
                instance.vbs[j].destroy();
            }
            instance.ia.destroy();
        }
        this.instances.length = 0;
    }

    public merge (subModel: SubModel, ro: IRenderObject, pso: GFXPipelineState) {
        if (!this.pso) { this.pso = pso; }
        const sourceIA = subModel.inputAssembler!;
        for (let i = 0; i < this.instances.length; ++i) {
            const instance = this.instances[i];
            if (instance.ia.indexBuffer !== sourceIA.indexBuffer || instance.count >= MAX_CAPACITY) { continue; }
            if (instance.count >= instance.capacity) { // resize buffers
                instance.capacity <<= 1;
                for (let j = 0; j < instance.vbs.length; j++) {
                    const newSize = instance.strides[j] * instance.capacity;
                    const oldData = instance.vbDatas[j];
                    instance.vbDatas[j] = new Float32Array(newSize / Float32Array.BYTES_PER_ELEMENT);
                    instance.vbDatas[j].set(oldData);
                    instance.vbs[j].resize(newSize);
                }
            }
            uploadMat4AsVec4x3(instance.vbDatas[0], ro.model.transform.worldMatrix, 12 * instance.count++);
            return;
        }

        const device = this.pass.device;

        // Create a new instance
        const vbs: GFXBuffer[] = [];
        const vbDatas: Float32Array[] = [];
        const strides: number[] = [];
        const vertexBuffers = sourceIA.vertexBuffers.slice();
        const attributes = sourceIA.attributes.slice();
        const indexBuffer = sourceIA.indexBuffer || undefined;

        // add world matrix
        for (let i = 0; i < 3; i++) {
            attributes.push({
                name: 'a_matWorld' + i,
                format: GFXFormat.RGBA32F,
                stream: vertexBuffers.length,
                isInstanced: true,
            });
        }
        const newVB = device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: 48 * INITIAL_CAPACITY,
            stride: 48,
        });
        const data = new Float32Array(newVB.size / Float32Array.BYTES_PER_ELEMENT);
        uploadMat4AsVec4x3(data, ro.model.transform.worldMatrix, 0);
        vbs.push(newVB); vbDatas.push(data); vertexBuffers.push(newVB); strides.push(48);

        const ia = device.createInputAssembler({ attributes, vertexBuffers, indexBuffer });
        this.instances.push({ count: 1, capacity: INITIAL_CAPACITY, vbs, vbDatas, strides, ia });
    }

    public uploadBuffers () {
        for (let i = 0; i < this.instances.length; ++i) {
            const instance = this.instances[i];
            if (!instance.count) { continue; }
            instance.ia.instanceCount = instance.count;
            for (let j = 0; j < instance.vbs.length; j++) {
                instance.vbs[j].update(instance.vbDatas[j].buffer);
            }
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
