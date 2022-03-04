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

// Deprecated CC polyfill
const polyfills = {
    GFXDevice: true,
    GFXBuffer: true,
    GFXTexture: true,
    GFXSampler: true,
    GFXShader: true,
    GFXInputAssembler: true,
    GFXRenderPass: true,
    GFXFramebuffer: true,
    GFXPipelineState: true,
    GFXCommandBuffer: true,
    GFXQueue: true,
    GFXObjectType: true,
    GFXObject: false,
    GFXAttributeName: true,
    GFXType: true,
    GFXFormat: true,
    GFXBufferUsageBit: true,
    GFXMemoryUsageBit: true,
    GFXBufferFlagBit: true,
    GFXBufferAccessBit: 'MemoryAccessBit',
    GFXPrimitiveMode: true,
    GFXPolygonMode: true,
    GFXShadeModel: true,
    GFXCullMode: true,
    GFXComparisonFunc: true,
    GFXStencilOp: true,
    GFXBlendOp: true,
    GFXBlendFactor: true,
    GFXColorMask: true,
    GFXFilter: true,
    GFXAddress: true,
    GFXTextureType: true,
    GFXTextureUsageBit: true,
    GFXSampleCount: true,
    GFXTextureFlagBit: true,
    GFXShaderStageFlagBit: true,
    GFXDescriptorType: true,
    GFXCommandBufferType: true,
    GFXLoadOp: true,
    GFXStoreOp: true,
    GFXPipelineBindPoint: true,
    GFXDynamicStateFlagBit: true,
    GFXStencilFace: true,
    GFXQueueType: true,
    GFXRect: true,
    GFXViewport: true,
    GFXColor: true,
    GFXClearFlag: true,
    GFXOffset: true,
    GFXExtent: true,
    GFXTextureSubres: 'TextureSubresLayers',
    GFXTextureCopy: true,
    GFXBufferTextureCopy: true,
    GFXFormatType: true,
    GFXFormatInfo: true,
    GFXMemoryStatus: true,
    GFXFormatInfos: true,
    GFXFormatSize: true,
    GFXFormatSurfaceSize: true,
    GFXGetTypeSize: true,
    getTypedArrayConstructor: false,
};
for (const name in polyfills) {
    let newName = polyfills[name];
    if (newName === true) {
        newName = name.slice(3);
    } else if (newName === false) {
        newName = name;
    }
    // Deprecation
    replaceProperty(legacyCC, 'cc', [
        {
            name,
            newName,
            target: legacyCC.gfx,
            targetName: 'cc.gfx',
        },
    ]);
}

removeProperty(legacyCC, 'cc', [
    { name: 'GFX_MAX_VERTEX_ATTRIBUTES' },
    { name: 'GFX_MAX_TEXTURE_UNITS' },
    { name: 'GFX_MAX_ATTACHMENTS' },
    { name: 'GFX_MAX_BUFFER_BINDINGS' },
    { name: 'GFXTextureLayout' },
]);
