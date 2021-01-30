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
 * @hidden
 */

import { polyfillCC } from './polyfill-legacy-cc';
import { removeProperty, replaceProperty } from '../utils/x-deprecated';
import { legacyCC } from '../global-exports';
import { CommandBuffer } from './command-buffer';

replaceProperty(legacyCC, 'cc', [
    { name: 'GFXDynamicState', newName: 'DynamicStateFlagBit' },
    { name: 'GFXBindingType', newName: 'DescriptorType' },
    { name: 'GFXBindingLayout', newName: 'DescriptorSet' },
]);

removeProperty(CommandBuffer.prototype,  'CommandBuffer.prototype', [
    { name: 'bindBindingLayout', suggest: 'Use `bindDescriptorSet` instead' },
]);

// Deprecated CC polyfill
const customMappings = {
    // DRAW_INFO_SIZE: 'GFX_DRAW_INFO_SIZE',
    // MAX_ATTACHMENTS: 'GFX_MAX_ATTACHMENTS',
    // Obj: 'GFXObject',
    // DESCRIPTOR_BUFFER_TYPE: '',
    // DESCRIPTOR_SAMPLER_TYPE: '',
    // getTypedArrayConstructor: '',
    // GFXFormatToWebGLType: '',
    // GFXFormatToWebGLInternalFormat: '',
    // GFXFormatToWebGLFormat: '',
};
for (const api in polyfillCC) {
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
