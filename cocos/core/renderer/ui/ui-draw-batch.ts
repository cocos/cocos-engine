/**
 * @hidden
 */

import { MeshBuffer } from '../../../ui';
import { Material } from '../../assets/material';
import { GFXPipelineState, GFXTextureView, GFXSampler } from '../../gfx';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { Node } from '../../scene-graph';
import { Camera } from '../scene/camera';
import { Model } from '../scene/model';
import { UI } from './ui';
import { GFXInputAssembler, IGFXAttribute } from '../../gfx/input-assembler';

export class UIDrawBatch {
    private _bufferBatch: MeshBuffer | null = null;

    public camera: Camera | null = null;
    public ia: GFXInputAssembler | null = null;
    public model: Model | null = null;
    public material: Material | null = null;
    public texView: GFXTextureView | null = null;
    public sampler: GFXSampler | null = null;
    public firstIdx: number = 0;
    public idxCount: number = 0;
    public pipelineState: GFXPipelineState | null = null;
    public bindingLayout: GFXBindingLayout | null = null;
    public useLocalData: Node | null = null;
    public isStatic = false;

    public destroy (ui: UI) {
        if (this.pipelineState) {
            ui._getUIMaterial(this.material!).revertPipelineState(this.pipelineState);
            this.pipelineState = null;
        }

        if (this.bindingLayout) {
            this.bindingLayout = null;
        }

        if (this.ia) {
            this.ia.destroy();
        }
    }

    public clear (ui: UI) {
        if (this.pipelineState) {
            ui._getUIMaterial(this.material!).revertPipelineState(this.pipelineState);
            this.pipelineState = null;
        }
        this.camera = null;
        this._bufferBatch = null;
        this.material = null;
        this.texView = null;
        this.sampler = null;
        this.firstIdx = 0;
        this.idxCount = 0;
        this.model = null;
        this.isStatic = false;

        if (this.ia) {
            this.ia.firstIndex = 0;
            this.ia.indexCount = 0;
        }
    }

    get bufferBatch () {
        return this._bufferBatch!;
    }

    set bufferBatch(meshBuffer : MeshBuffer | null) {
        if (this._bufferBatch == meshBuffer) {
            return;
        }

        this._bufferBatch = meshBuffer;

        if (this.ia) {
            this.ia.destroy();
            this.ia = null;
        }

        if (this._bufferBatch) {
            this.ia = this._bufferBatch.batcher.device.createInputAssembler({
                attributes: this._bufferBatch.attributes!,
                vertexBuffers: [this._bufferBatch.vb!],
                indexBuffer: this._bufferBatch.ib!,
            });
        }
    }
}
