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

export function genSamplerHash (info: Array<number | undefined>): number {
    let value = 0;
    let hash = 0;
    for (let i = 0; i < defaultInfo.length; i++) {
        value = (info[i] || defaultInfo[i]);
        switch (i) {
            case SamplerInfoIndex.minFilter: hash |= value; break;
            case SamplerInfoIndex.magFilter: hash |= (value << 2); break;
            case SamplerInfoIndex.mipFilter: hash |= (value << 4); break;
            case SamplerInfoIndex.addressU: hash |= (value << 6); break;
            case SamplerInfoIndex.addressV: hash |= (value << 8); break;
            case SamplerInfoIndex.addressW: hash |= (value << 10); break;
            case SamplerInfoIndex.maxAnisotropy: hash |= (value << 12); break;
            case SamplerInfoIndex.cmpFunc: hash |= (value << 16); break;
            case SamplerInfoIndex.minLOD: hash |= (value << 20); break;
            case SamplerInfoIndex.maxLOD: hash |= (value << 24); break;
            case SamplerInfoIndex.mipLODBias: hash |= (value << 28); break;
        }
    }
    return hash;
}

/**
 * @zh
 * 维护 sampler 资源实例的全局管理器。
 */
class SamplerLib {

    protected _cache: Record<number, GFXSampler> = {};

    /**
     * @zh
     * 获取指定属性的 sampler 资源。
     * @param device 渲染设备 [GFXDevice]
     * @param info 目标 sampler 属性
     */
    public getSampler (device: GFXDevice, hash: number) {
        /*
        let hash = '';
        for (let i = 0; i < defaultInfo.length; i++) {
            hash += (info[i] || defaultInfo[i]) + ',';
        }
        */
        const cache = this._cache[hash];
        if (cache) { return cache; }
        gfxInfo.minFilter     = (hash & 4);
        gfxInfo.magFilter     = ((hash >> 2) & 4);
        gfxInfo.mipFilter     = ((hash >> 4) & 4);
        gfxInfo.addressU      = ((hash >> 6) & 4);
        gfxInfo.addressV      = ((hash >> 8) & 4);
        gfxInfo.addressW      = ((hash >> 10) & 4);
        gfxInfo.maxAnisotropy = ((hash >> 12) & 16);
        gfxInfo.cmpFunc       = ((hash >> 16) & 16);
        gfxInfo.minLOD        = ((hash >> 20) & 16);
        gfxInfo.maxLOD        = ((hash >> 24) & 16);
        gfxInfo.mipLODBias    = ((hash >> 28) & 16);
        const sampler = this._cache[hash] = device.createSampler(gfxInfo);
        return sampler;
    }
}

export const samplerLib = new SamplerLib();
