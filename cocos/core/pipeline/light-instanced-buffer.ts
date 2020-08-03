/**
 * @hidden
 */

import { InstancedBuffer } from './instanced-buffer'
import { Pass } from '../renderer';

export class LightInstancedBuffer extends InstancedBuffer {
    private static _lightBuffers = new Map<number, InstancedBuffer>();

    public static get (pass: Pass, index: number) {
        if (!LightInstancedBuffer._lightBuffers.has(index)) {
            LightInstancedBuffer._lightBuffers.set(index, new InstancedBuffer(pass.device));
        }
        return LightInstancedBuffer._lightBuffers.get(index)!;
    }
}