/**
 * @hidden
 */

import { MeshBuffer } from '../../../ui';
import { Material } from '../../assets/material';
import { GFXTexture, GFXSampler } from '../../gfx';
import { Node } from '../../scene-graph';
import { Camera } from '../scene/camera';
import { Model } from '../scene/model';
import { UI } from './ui';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { IAHandle, IAPool, DescriptorSetHandle } from '../core/memory-pools';

export class UIDrawBatch {
    private _bufferBatch: MeshBuffer | null = null;

    public camera: Camera | null = null;
    public ia: GFXInputAssembler | null = null;
    public hIA: IAHandle = 0;
    public model: Model | null = null;
    public material: Material | null = null;
    public texture: GFXTexture | null = null;
    public sampler: GFXSampler | null = null;
    public hDescriptorSet: DescriptorSetHandle = 0;
    public useLocalData: Node | null = null;
    public isStatic = false;

    public destroy (ui: UI) {
        this.hDescriptorSet = 0;

        if (this.ia) {
            IAPool.free(this.hIA);
            this.hIA = 0;
            this.ia = null;
        }
    }

    public clear () {
        this._bufferBatch = null;
        this.camera = null;
        this.hDescriptorSet = 0;
        this.material = null;
        this.texture = null;
        this.sampler = null;
        this.model = null;
        this.isStatic = false;
    }

    get bufferBatch () {
        return this._bufferBatch;
    }

    set bufferBatch (meshBuffer : MeshBuffer | null) {
        if (this._bufferBatch === meshBuffer) {
            return;
        }

        this._bufferBatch = meshBuffer;

        if (this._bufferBatch) {
            if (this.ia) {
                this.ia.destroy();
                this.ia.initialize(this._bufferBatch);
            } else {
                this.hIA = IAPool.alloc(this._bufferBatch.batcher.device, this._bufferBatch);
                this.ia = IAPool.get(this.hIA);
            }
        }
    }
}
