/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @hidden
 */

import { GFXAddress, GFXComparisonFunc, GFXFilter } from '../../gfx/define';
import { GFXDevice, GFXSampler, GFXSamplerInfo, GFXColor } from '../../gfx';
import { legacyCC } from '../../global-exports';

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
    total,
}

const defaultInfo = [
  GFXFilter.LINEAR,
  GFXFilter.LINEAR,
  GFXFilter.NONE,
  GFXAddress.WRAP,
  GFXAddress.WRAP,
  GFXAddress.WRAP,
  8,
  GFXComparisonFunc.NEVER,
  0, 0, 0,
];
export const defaultSamplerHash = genSamplerHash(defaultInfo);

const borderColor = new GFXColor();

const _samplerInfo = new GFXSamplerInfo();

export function genSamplerHash (info: (number | undefined)[]): number {
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
        if (!hash) { hash = defaultSamplerHash; }
        const cache = this._cache[hash];
        if (cache) { return cache; }

        _samplerInfo.minFilter     = (hash & 3);
        _samplerInfo.magFilter     = ((hash >> 2) & 3);
        _samplerInfo.mipFilter     = ((hash >> 4) & 3);
        _samplerInfo.addressU      = ((hash >> 6) & 3);
        _samplerInfo.addressV      = ((hash >> 8) & 3);
        _samplerInfo.addressW      = ((hash >> 10) & 3);
        _samplerInfo.maxAnisotropy = ((hash >> 12) & 15);
        _samplerInfo.cmpFunc       = ((hash >> 16) & 15);
        _samplerInfo.minLOD        = ((hash >> 20) & 15);
        _samplerInfo.maxLOD        = ((hash >> 24) & 15);
        _samplerInfo.mipLODBias    = ((hash >> 28) & 15);
        _samplerInfo.borderColor   = borderColor;

        const sampler = this._cache[hash] = device.createSampler(_samplerInfo);
        return sampler;
    }
}

export const samplerLib = new SamplerLib();
legacyCC.samplerLib = samplerLib;
