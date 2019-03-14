// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { GFXDevice } from '../../gfx/device';
import { GFXSampler, IGFXSamplerInfo } from '../../gfx/sampler';

const gfxInfo: IGFXSamplerInfo = {};

class SamplerLib {
    protected _cache: Record<string, GFXSampler> = {};

    public getSampler (device: GFXDevice, info: number[]) {
        const hash = info.toString();
        const cache = this._cache[hash];
        if (cache) { return cache; }
        gfxInfo.minFilter     = info[0];
        gfxInfo.magFilter     = info[1];
        gfxInfo.mipFilter     = info[2];
        gfxInfo.addressU      = info[3];
        gfxInfo.addressV      = info[4];
        gfxInfo.addressW      = info[5];
        gfxInfo.maxAnisotropy = info[6];
        if (info.length > 7) {
            gfxInfo.cmpFunc     = info[7];
            gfxInfo.borderColor = { r: info[8], g: info[9], b: info[10], a: info[11] };
            gfxInfo.minLOD      = info[12];
            gfxInfo.maxLOD      = info[13];
            gfxInfo.mipLODBias  = info[14];
        }
        const sampler = this._cache[hash] = device.createSampler(gfxInfo);
        return sampler;
    }
}

export const samplerLib = new SamplerLib();
cc.samplerLib = samplerLib;
