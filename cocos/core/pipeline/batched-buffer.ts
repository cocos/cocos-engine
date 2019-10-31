/**
 * @hidden
 */

import { GFXBufferFlagBit, GFXBufferUsageBit, GFXFormat, GFXMemoryUsageBit } from '../gfx';
import { GFXBuffer } from '../gfx/buffer';
import { GFXInputAssembler, IGFXAttribute } from '../gfx/input-assembler';
import { GFXPipelineState } from '../gfx/pipeline-state';
import { Mat4 } from '../math';
import { Pass } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, UBOLocalBatched, UniformBinding } from './define';

export interface IBatchedItem {
    vbs: GFXBuffer[];
    vbDatas: Uint8Array[];
    vbIdx: GFXBuffer;
    vbIdxData: Float32Array;
    vbCount: number;
    mergeCount: number;
    ia: GFXInputAssembler;
    ubo: GFXBuffer;
    uboData: UBOLocalBatched;
    pso: GFXPipelineState;
}

const _localBatched = new UBOLocalBatched();

export class BatchedBuffer {
    public batches: IBatchedItem[] = [];
    public pass: Pass;

    constructor (pass: Pass) {
        this.pass = pass;
    }

    public destroy () {
        for (let i = 0; i < this.batches.length; ++i) {
            const batch = this.batches[i];
            for (let j = 0; j < batch.vbs.length; ++j) {
                batch.vbs[j].destroy();
            }
            batch.vbIdx.destroy();
            batch.ia.destroy();
            batch.ubo.destroy();
        }
        this.batches.splice(0);
    }

    public merge (subModel: SubModel, ro: IRenderObject, pso: GFXPipelineState) {
        const flatBuffers = subModel.subMeshData.flatBuffers;
        if (flatBuffers.length === 0) { return; }
        let vbSize = 0;
        let vbIdxSize = 0;
        const vbCount = flatBuffers[0].count;
        const bindingLayout = pso.pipelineLayout.layouts[0];
        let isBatchExist = false;
        for (let i = 0; i < this.batches.length; ++i) {
            const batch = this.batches[i];
            if (batch.vbs.length === flatBuffers.length && batch.mergeCount < UBOLocalBatched.BATCHING_COUNT) {
                isBatchExist = true;
                for (let j = 0; j < batch.vbs.length; ++j) {
                    const vb = batch.vbs[j];
                    if (vb.stride !== flatBuffers[j].stride) {
                        isBatchExist = false;
                        break;
                    }
                }

                if (isBatchExist) {
                    for (let j = 0; j < batch.vbs.length; ++j) {
                        const flatBuff = flatBuffers[j];
                        const batchVB = batch.vbs[j];
                        let vbBuf = batch.vbDatas[j];
                        vbSize = (vbCount + batch.vbCount) * flatBuff.stride;
                        if (vbSize > batchVB.size) {
                            batchVB.resize(vbSize);
                            vbBuf = batch.vbDatas[j] = new Uint8Array(batchVB.bufferView!.buffer);
                        }
                        vbBuf.set(flatBuff.buffer, batch.vbCount * flatBuff.stride);
                    }

                    vbIdxSize = (vbCount + batch.vbCount) * 4;
                    if (vbIdxSize > batch.vbIdx.size) {
                        batch.vbIdx.resize(vbIdxSize);
                        batch.vbIdxData = new Float32Array(batch.vbIdx.bufferView!.buffer);
                    }

                    const start = batch.vbCount;
                    const end = start + vbCount;
                    const vbIdxBuf = batch.vbIdxData;
                    const mergeCount = batch.mergeCount;
                    if (vbIdxBuf[start] !== mergeCount || vbIdxBuf[end - 1] !== mergeCount) {
                        for (let j = start; j < end; j++) {
                            vbIdxBuf[j] = mergeCount;
                        }
                    }

                    // update world matrix
                    Mat4.toArray(batch.uboData.view, ro.model.transform.worldMatrix, UBOLocalBatched.MAT_WORLDS_OFFSET + batch.mergeCount * 16);
                    if (!batch.mergeCount && batch.pso !== pso) {
                        bindingLayout.bindBuffer(UniformBinding.UBO_LOCAL_BATCHED, batch.ubo);
                        bindingLayout.update();
                        batch.pso = pso;
                    }

                    ++batch.mergeCount;
                    batch.vbCount += vbCount;
                    batch.ia.vertexCount += vbCount;

                    return;
                }
            }
        }

        const device = this.pass.device;

        // Create a new batch
        const vbs: GFXBuffer[] = [];
        const vbDatas: Uint8Array[] = [];
        const totalVBS: GFXBuffer[] = [];
        for (let i = 0; i < flatBuffers.length; ++i) {
            const flatBuff = flatBuffers[i];
            const newVB = device.createBuffer({
                usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: flatBuff.count * flatBuff.stride,
                stride: flatBuff.stride,
                flags: GFXBufferFlagBit.BAKUP_BUFFER,
            });
            newVB.update(flatBuff.buffer.buffer);
            vbs.push(newVB);
            vbDatas.push(new Uint8Array(newVB.bufferView!.buffer));
            totalVBS.push(newVB);
        }

        const vbIdx = device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vbCount * 4,
            stride: 4,
            flags: GFXBufferFlagBit.BAKUP_BUFFER,
        });
        const vbIndices = new Float32Array(vbCount);
        vbIndices.fill(0);
        vbIdx.update(vbIndices);
        totalVBS.push(vbIdx);
        const vbIdxData = new Float32Array(vbIdx.bufferView!.buffer);

        const attributes = subModel.inputAssembler!.attributes;
        const attrs = new Array<IGFXAttribute>(attributes.length + 1);
        for (let a = 0; a < attributes.length; ++a) {
            attrs[a] = attributes[a];
        }
        attrs[attributes.length] = {
            name: 'a_dyn_batch_id',
            format: GFXFormat.R32F,
            stream: flatBuffers.length,
        };

        const ia = device.createInputAssembler({
            attributes: attrs,
            vertexBuffers: totalVBS,
        });

        const ubo = this.pass.device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOLocalBatched.SIZE,
        });

        bindingLayout.bindBuffer(UniformBinding.UBO_LOCAL_BATCHED, ubo);
        bindingLayout.update();

        const uboData = new UBOLocalBatched();
        Mat4.toArray(uboData.view, ro.model.transform.worldMatrix, UBOLocalBatched.MAT_WORLDS_OFFSET);

        this.batches.push({
            mergeCount: 1,
            vbs, vbDatas, vbIdx, vbIdxData, vbCount, ia, ubo, uboData, pso,
        });
    }

    public clear () {
        for (let i = 0; i < this.batches.length; ++i) {
            const batch = this.batches[i];
            batch.vbCount = 0;
            batch.mergeCount = 0;
            batch.ia.vertexCount = 0;
        }
    }

    public clearUBO () {
        for (let i = 0; i < this.batches.length; ++i) {
            const batch = this.batches[i];
            batch.ubo.update(_localBatched.view.buffer);
        }
    }
}
