// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { Texture2D } from '../../assets/texture-2d';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Node } from '../../scene-graph/node';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';
import { SkinningUBO } from './model-uniforms';

const textureSizeBuffer = new Float32Array(4);

export class SkinningModel extends Model {
    private _skinningUBO: GFXBuffer;
    private _jointTexture: Texture2D | null = null;

    constructor (scene: RenderScene, node: Node) {
        super(scene, node);
        this._type = 'skinning';
        this._skinningUBO = this._device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST,
            size: SkinningUBO.SIZE,
            stride: SkinningUBO.SIZE,
        });
    }

    public setJointTexture (texture: Texture2D) {
        this._jointTexture = texture;
        textureSizeBuffer[0] = texture.width;
        this._skinningUBO.update(
            textureSizeBuffer, SkinningUBO.JOINTS_TEXTURE_SIZE_OFFSET, textureSizeBuffer.byteLength);
    }

    public setJointMatrices (data: Float32Array) {
        this._skinningUBO.update(data, SkinningUBO.MAT_JOINT_OFFSET);
    }

    protected _onCreatePSO (pso: GFXPipelineState) {
        super._onCreatePSO(pso);
        pso.pipelineLayout.layouts[0].bindBuffer(SkinningUBO.BLOCK.binding, this._skinningUBO);
        if (this._jointTexture) {
            const view = this._jointTexture.getGFXTextureView();
            const sampler = this._jointTexture.getGFXSampler();
            if (view && sampler) {
                pso.pipelineLayout.layouts[0].bindTextureView(SkinningUBO.JOINT_TEXTURE.binding, view);
                pso.pipelineLayout.layouts[0].bindSampler(SkinningUBO.JOINT_TEXTURE.binding, sampler);
            }
        }
    }
}
