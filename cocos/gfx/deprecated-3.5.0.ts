/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { removeProperty, replaceProperty } from '../core';
import { Device } from './base/device';
import { Feature, ColorAttachment, DepthStencilAttachment } from './base/define';

// Deprecate format features in gfx Feature.
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

removeProperty(ColorAttachment.prototype, 'ColorAttachment', [
    {
        name: 'beginAccesses',
        suggest: 'Please assign to ColorAttachment.barrier instead',
    },
    {
        name: 'endAccesses',
        suggest: 'Please assign to ColorAttachment.barrier instead',
    },
]);

removeProperty(DepthStencilAttachment.prototype, 'DepthStencilAttachment', [
    {
        name: 'beginAccesses',
        suggest: 'Please assign to DepthStencilAttachment.barrier instead',
    },
    {
        name: 'endAccesses',
        suggest: 'Please assign to DepthStencilAttachment.barrier instead',
    },
]);

replaceProperty(Device.prototype, 'Device', [
    {
        name: 'getGlobalBarrier',
        newName: 'getGeneralBarrier',
    },
]);
