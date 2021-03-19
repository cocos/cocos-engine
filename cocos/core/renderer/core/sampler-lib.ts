/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { Address, ComparisonFunc, Filter, Device, Sampler, SamplerInfo, Color } from '../../gfx';
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
    mipLODBias,
    total,
}

const defaultInfo = [
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.NONE,
    Address.WRAP,
    Address.WRAP,
    Address.WRAP,
    0,
    ComparisonFunc.NEVER,
    0,
];
export const defaultSamplerHash = genSamplerHash(defaultInfo);

const borderColor = new Color();

const _samplerInfo = new SamplerInfo();

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
        case SamplerInfoIndex.mipLODBias: hash |= (value << 28); break;
        default:
        }
    }
    return hash;
}

/**
 * @zh
 * 维护 sampler 资源实例的全局管理器。
 */
class SamplerLib {
    protected _cache: Record<number, Sampler> = {};

    /**
     * @zh
     * 获取指定属性的 sampler 资源。
     * @param device 渲染设备 GFX [[Device]]
     * @param info 目标 sampler 属性
     */
    public getSampler (device: Device, hash: number) {
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
        _samplerInfo.mipLODBias    = ((hash >> 28) & 15);
        _samplerInfo.borderColor   = borderColor;

        const sampler = this._cache[hash] = device.createSampler(_samplerInfo);
        return sampler;
    }
}

export const samplerLib = new SamplerLib();
legacyCC.samplerLib = samplerLib;
