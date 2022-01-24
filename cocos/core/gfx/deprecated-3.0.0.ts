/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { replaceProperty, removeProperty } from '../utils/x-deprecated';
import { legacyCC } from '../global-exports';
import { Feature } from './base/define';

// Deprecated CC polyfill
const customMappings = {
    Obj: 'GFXObject',
    DRAW_INFO_SIZE: 'GFX_DRAW_INFO_SIZE',
    DESCRIPTOR_BUFFER_TYPE: '',
    DESCRIPTOR_SAMPLER_TYPE: '',
    DESCRIPTOR_DYNAMIC_TYPE: '',
    getTypedArrayConstructor: '',
};
for (const api in legacyCC.gfx) {
    if (api === '__esModule') continue;
    let deprecated = customMappings[api];
    if (deprecated === '') {
        deprecated = api;
    } else if (deprecated === undefined) {
        deprecated = `GFX${api}`;
    }
    // Deprecation
    replaceProperty(legacyCC, 'cc', [
        {
            name: deprecated,
            newName: api,
            target: legacyCC.gfx,
            targetName: 'cc.gfx',
        },
    ]);
}

removeProperty(Feature, 'Feature', [
    {
        name: 'COLOR_FLOAT',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.R32F) & FormatFeatureBit.RENDER_TARGET;',
    },
    {
        name: 'COLOR_HALF_FLOAT',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.R16F) & FormatFeatureBit.RENDER_TARGET;',
    },
    {
        name: 'TEXTURE_FLOAT',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = (device.getFormatFeatures(Format.R32F) & (FormatFeatureBit.RENDER_TARGET'
            + ' | FormatFeatureBit.SAMPLED_TEXTURE)) === (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE);',
    },
    {
        name: 'TEXTURE_HALF_FLOAT',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = (device.getFormatFeatures(Format.R16F) & (FormatFeatureBit.RENDER_TARGET'
            + ' | FormatFeatureBit.SAMPLED_TEXTURE)) === (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE);',
    },
    {
        name: 'TEXTURE_FLOAT_LINEAR',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.R32F) & FormatFeatureBit.LINEAR_FILTER;',
    },
    {
        name: 'TEXTURE_HALF_FLOAT_LINEAR',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.R16F) & FormatFeatureBit.LINEAR_FILTER;',
    },
    {
        name: 'FORMAT_R11G11B10F',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.R11G11B10F) !== FormatFeatureBit.NONE;',
    },
    {
        name: 'FORMAT_SRGB',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.SRGB8) !== FormatFeatureBit.NONE;',
    },
    {
        name: 'FORMAT_ETC1',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.ETC_RGB8) !== FormatFeatureBit.NONE;',
    },
    {
        name: 'FORMAT_ETC2',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.ETC2_RGB8) !== FormatFeatureBit.NONE;',
    },
    {
        name: 'FORMAT_DXT',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.BC1) !== FormatFeatureBit.NONE;',
    },
    {
        name: 'FORMAT_PVRTC',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.PVRTC_RGB2) !== FormatFeatureBit.NONE;',
    },
    {
        name: 'FORMAT_ASTC',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.ASTC_RGBA_4x4) !== FormatFeatureBit.NONE;',
    },
    {
        name: 'FORMAT_RGB8',
        suggest: 'Please use device.getFormatFeatures() instead, like: \n'
            + 'let isSupported = device.getFormatFeatures(Format.RGB8) !== FormatFeatureBit.NONE;',
    },
]);
