/**
 * @hidden
 */

import { GFXDevice } from '../gfx';
import { GFXBuffer } from '../gfx/buffer';
import { GFXInputAssembler } from '../gfx/input-assembler';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, UBOLocalBatched } from './define';

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
    psoCI: number;
}

const _localBatched = new UBOLocalBatched();

export class BatchedBuffer {

    public batches: IBatchedItem[] = [];
    public _device: GFXDevice;
    public psoci: number|null = null;

    // for pass-batched-buffer
    public merge (subModel: SubModel, passIndx: number, ro: IRenderObject) {}

    // for light-batched-buffer
    public mergeLight (subModel: SubModel, ro: IRenderObject, lightPsoCI: number) {}

    constructor (device: GFXDevice) {
        this._device = device;
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
        this.batches.length = 0;
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
