/**
 * @hidden
 */

import { InstancedBuffer } from './instanced-buffer'
import { Pass } from '../renderer';

export class PassInstancedBuffer extends InstancedBuffer {
    private static _buffers = new Map<Pass, InstancedBuffer>();

    public static get (pass: Pass) {
        if (!PassInstancedBuffer._buffers.has(pass)) {
            PassInstancedBuffer._buffers.set(pass, new InstancedBuffer(pass.device));
        }
        return PassInstancedBuffer._buffers.get(pass)!;
    }
}