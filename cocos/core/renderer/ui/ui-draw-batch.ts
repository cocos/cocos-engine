/**
 * @hidden
 */

import { MeshBuffer } from '../../../ui';
import { Material } from '../../assets/material';
import { GFXTexture, GFXSampler } from '../../gfx';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { Node } from '../../scene-graph';
import { Camera } from '../scene/camera';
import { Model } from '../scene/model';
import { UI } from './ui';
import { GFXInputAssembler, IGFXInputAssemblerInfo } from '../../gfx/input-assembler';
import { IPSOCreateInfo } from '../scene/submodel';

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
    public psoCreateInfo: IPSOCreateInfo | null = null;
    public bindingLayout: GFXBindingLayout | null = null;
    public useLocalData: Node | null = null;
    public isStatic = false;

    public destroy (ui: UI) {
        if (this.psoCreateInfo) {
            ui._getUIMaterial(this.material!).revertPipelineCreateInfo(this.psoCreateInfo);
            this.psoCreateInfo = null;
        }

        if (this.bindingLayout) {
            this.bindingLayout = null;
        }

        if (this.ia) {
            this.ia.destroy();
            this.ia = null;
        }
    }

    public clear (ui: UI) {
        if (this.psoCreateInfo) {
            ui._getUIMaterial(this.material!).revertPipelineCreateInfo(this.psoCreateInfo);
            this.psoCreateInfo = null;
        }
        this.camera = null;
        this._bufferBatch = null;
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
