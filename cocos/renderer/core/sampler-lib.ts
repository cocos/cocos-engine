// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { GFXAddress, GFXComparisonFunc, GFXFilter } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXSampler, IGFXSamplerInfo } from '../../gfx/sampler';

export enum SamplerInfoIndex {
    minFilter,
    magFilter,
    mipFilter,
    addressU,
    addressV,
    addressW,
    maxAnisotropy,
    cmpFunc,
    minLOD,
    maxLOD,
    mipLODBias,
    borderColor,
    total = borderColor + 4,
}

const defaultInfo = [
  GFXFilter.LINEAR,
  GFXFilter.LINEAR,
  GFXFilter.NONE,
  GFXAddress.WRAP,
  GFXAddress.WRAP,
  GFXAddress.WRAP,
  16,
  GFXComparisonFunc.NEVER,
  0, 0, 0,
  0, 0, 0, 0,
];

const gfxInfo: IGFXSamplerInfo = {};

class SamplerLib {
    protected _cache: Record<string, GFXSampler> = {};

    public getSampler (device: GFXDevice, info: number[]) {
        let hash = '';
        for (let i = 0; i < defaultInfo.length; i++) {
            hash += (info[i] || defaultInfo[i]) + ',';
        }
        const cache = this._cache[hash];
        if (cache) { return cache; }
        gfxInfo.minFilter     = info[SamplerInfoIndex.minFilter];
        gfxInfo.magFilter     = info[SamplerInfoIndex.magFilter];
        gfxInfo.mipFilter     = info[SamplerInfoIndex.mipFilter];
        gfxInfo.addressU      = info[SamplerInfoIndex.addressU];
        gfxInfo.addressV      = info[SamplerInfoIndex.addressV];
        gfxInfo.addressW      = info[SamplerInfoIndex.addressW];
        gfxInfo.maxAnisotropy = info[SamplerInfoIndex.maxAnisotropy];
        if (info.length > SamplerInfoIndex.cmpFunc) {
            gfxInfo.cmpFunc     = info[SamplerInfoIndex.cmpFunc];
            gfxInfo.minLOD      = info[SamplerInfoIndex.minLOD];
            gfxInfo.maxLOD      = info[SamplerInfoIndex.maxLOD];
            gfxInfo.mipLODBias  = info[SamplerInfoIndex.mipLODBias];
            if (info.length >= SamplerInfoIndex.total) {
                const ofs = SamplerInfoIndex.borderColor;
                gfxInfo.borderColor = { r: info[ofs], g: info[ofs + 1], b: info[ofs + 2], a: info[ofs + 3] };
            }
        }
        const sampler = this._cache[hash] = device.createSampler(gfxInfo);
        return sampler;
    }
}

export const samplerLib = new SamplerLib();
