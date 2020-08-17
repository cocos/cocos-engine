/**
 * @hidden
 */

import { MeshBuffer } from '../../../ui';
import { Material } from '../../assets/material';
import { GFXTexture, GFXSampler, IGFXDescriptorSetInfo } from '../../gfx';
import { Node } from '../../scene-graph';
import { Camera } from '../scene/camera';
import { Model } from '../scene/model';
import { UI } from './ui';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { IAHandle, IAPool, DescriptorSetHandle, NULL_HANDLE, DSPool } from '../core/memory-pools';
import { programLib } from '../core/program-lib';
import { SetIndex } from '../../pipeline/define';
import { legacyCC } from '../../global-exports';
import { EffectAsset } from '../../assets';

const _dsInfo: IGFXDescriptorSetInfo = {
    layout: null!,
};

export class UIDrawBatch {
    private _bufferBatch: MeshBuffer | null = null;

    public camera: Camera | null = null;
    public ia: GFXInputAssembler | null = null;
    public hIA: IAHandle = NULL_HANDLE;
    public model: Model | null = null;
    public material: Material | null = null;
    public texture: GFXTexture | null = null;
    public sampler: GFXSampler | null = null;
    public hDescriptorSet: DescriptorSetHandle = NULL_HANDLE;
    public useLocalData: Node | null = null;
    public isStatic = false;

    constructor () {
        const root = legacyCC.director.root;

        const programName = EffectAsset.get('builtin-sprite')!.shaders[0].name;
        programLib.getGFXShader(root.device, programName, { USE_TEXTURE: true }, root.pipeline);
        _dsInfo.layout = programLib.getPipelineLayout(programName).setLayouts[SetIndex.LOCAL];
        this.hDescriptorSet = DSPool.alloc(root.device, _dsInfo);
    }

    public destroy (ui: UI) {
        if (this.ia) {
            IAPool.free(this.hIA);
            this.hIA = NULL_HANDLE;
            this.ia = null;
        }

        if (this.hDescriptorSet) {
            DSPool.free(this.hDescriptorSet);
            this.hDescriptorSet = NULL_HANDLE;
        }
    }

    public clear () {
        this._bufferBatch = null;
        this.camera = null;
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
