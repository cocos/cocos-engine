/**
 * @hidden
 */

import { InstancedBuffer } from './instanced-buffer'
import { Pass } from '../renderer';

export class LightInstancedBuffer extends InstancedBuffer {
    private static _buffers = new Map<number, InstancedBuffer>();

    public static get (pass: Pass, index: number) {
        if (!LightInstancedBuffer._buffers.has(index)) {
            LightInstancedBuffer._buffers.set(index, new InstancedBuffer(pass.device));
        }
        return LightInstancedBuffer._buffers.get(index)!;
    }
}