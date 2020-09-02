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
import { InputAssemblerHandle, DescriptorSetHandle, NULL_HANDLE, DSPool } from '../core/memory-pools';
import { programLib } from '../core/program-lib';
import { SetIndex } from '../../pipeline/define';
import { legacyCC } from '../../global-exports';
import { EffectAsset } from '../../assets';

const _dsInfo: IGFXDescriptorSetInfo = {
    layout: null!,
};

export class UIDrawBatch {

    public bufferBatch: MeshBuffer | null = null;
    public camera: Camera | null = null;
    public model: Model | null = null;
    public material: Material | null = null;
    public texture: GFXTexture | null = null;
    public sampler: GFXSampler | null = null;
    public hInputAssembler: InputAssemblerHandle = NULL_HANDLE;
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
        if (this.hDescriptorSet) {
            DSPool.free(this.hDescriptorSet);
            this.hDescriptorSet = NULL_HANDLE;
        }
    }

    public clear () {
        this.bufferBatch = null;
        this.hInputAssembler = NULL_HANDLE;
        this.camera = null;
        this.material = null;
        this.texture = null;
        this.sampler = null;
        this.model = null;
        this.isStatic = false;
    }
}
