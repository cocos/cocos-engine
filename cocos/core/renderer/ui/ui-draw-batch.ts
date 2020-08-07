/**
 * @hidden
 */

import { MeshBuffer } from '../../../ui';
import { Material } from '../../assets/material';
import { GFXTexture, GFXSampler } from '../../gfx';
import { GFXDescriptorSet } from '../../gfx/descriptor-set';
import { Node } from '../../scene-graph';
import { Camera } from '../scene/camera';
import { Model } from '../scene/model';
import { UI } from './ui';
import { GFXInputAssembler, IGFXInputAssemblerInfo } from '../../gfx/input-assembler';

const _iaInfo: IGFXInputAssemblerInfo = {
    attributes: [],
    vertexBuffers: [],
};

export class UIDrawBatch {
    private _bufferBatch: MeshBuffer | null = null;

    public camera: Camera | null = null;
    public ia: GFXInputAssembler | null = null;
    public model: Model | null = null;
    public material: Material | null = null;
    public texture: GFXTexture | null = null;
    public sampler: GFXSampler | null = null;
    public descriptorSet: GFXDescriptorSet | null = null;
    public useLocalData: Node | null = null;
    public isStatic = false;

    public destroy (ui: UI) {
        this.descriptorSet = null;

        if (this.ia) {
            this.ia.destroy();
            this.ia = null;
        }
    }

    public clear () {
        this._bufferBatch = null;
        this.camera = null;
        this.descriptorSet = null;
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
            _iaInfo.attributes = this._bufferBatch.attributes!;
            _iaInfo.vertexBuffers[0] = this._bufferBatch.vb!;
            _iaInfo.indexBuffer = this._bufferBatch.ib!;
            if (this.ia) {
                this.ia.destroy();
                this.ia.initialize(_iaInfo);
            } else {
                this.ia = this._bufferBatch.batcher.device.createInputAssembler(_iaInfo);
            }
        }
    }
}
