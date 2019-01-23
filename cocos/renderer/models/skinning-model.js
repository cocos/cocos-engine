// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { Model } from '../scene/model';
import { SkinningUBO } from './model-uniforms';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';

export default class SkinningModel extends Model {
    constructor() {
        super();

        this._type = 'skinning';
        this._jointsTexture = null;
        this._jointsMatrixArray = null;
    }

    setJointsTexture(texture) {
        this._jointsTexture = texture;
    }

    setJointsMatrixArray(a) {
        this._jointsMatrixArray = a;
        this._skinningUBO = this._device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST,
            size: SkinningUBO.SIZE,
            stride: SkinningUBO.SIZE,
        });
        this._skinningUBO.update(this._jointsMatrixArray);
    }

    _onCreatePSO(pso) {
        super._onCreatePSO(pso);
        pso.pipelineLayout.layouts[0].bindBuffer(SkinningUBO.BLOCK.binding, this._skinningUBO);
    }
}
