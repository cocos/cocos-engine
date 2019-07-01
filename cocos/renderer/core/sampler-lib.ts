/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @hidden
 */

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

/**
 * @zh
 * 维护 sampler 资源实例的全局管理器。
 */
class SamplerLib {
    protected _cache: Record<string, GFXSampler> = {};

    /**
     * @zh
     * 获取指定属性的 sampler 资源。
     * @param device 渲染设备 [[GFXDevice]]
     * @param info 目标 sampler 属性
     */
    public getSampler (device: GFXDevice, info: Array<number | undefined>) {
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
