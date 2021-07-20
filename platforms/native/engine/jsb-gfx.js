/****************************************************************************
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
 ****************************************************************************/

/* global gfx */

const deviceProto = gfx.Device.prototype;
const shaderProto = gfx.Shader.prototype;
const swapchainProto = gfx.Swapchain.prototype;
const bufferProto = gfx.Buffer.prototype;
const textureProto = gfx.Texture.prototype;
const descriptorSetProto = gfx.DescriptorSet.prototype;

///////////////////////////// handle different paradigms /////////////////////////////

const oldCopyTexImagesToTextureFunc = deviceProto.copyTexImagesToTexture;
deviceProto.copyTexImagesToTexture = function (texImages, texture, regions) {
    const images = [];
    if (texImages) {
        for (let i = 0; i < texImages.length; ++i) {
            const texImage = texImages[i];
            if (texImage instanceof HTMLCanvasElement) {
                // Refer to HTMLCanvasElement and ImageData implementation
                images.push(texImage._data.data);
            } else if (texImage instanceof HTMLImageElement) {
                // Refer to HTMLImageElement implementation
                images.push(texImage._data);
            } else {
                console.log('copyTexImagesToTexture: Convert texImages to data buffers failed');
                return;
            }
        }
    }
    oldCopyTexImagesToTextureFunc.call(this, images, texture, regions);
};

const oldDeviceCreateSwapchainFunc = deviceProto.createSwapchain;
deviceProto.createSwapchain = function (info) {
    info.windowHandle = window.windowHandler;
    return oldDeviceCreateSwapchainFunc.call(this, info);
};

const oldSwapchainInitializeFunc = swapchainProto.initialize;
swapchainProto.initialize = function (info) {
    info.windowHandle = window.windowHandler;
    oldSwapchainInitializeFunc.call(this, info);
};

const oldUpdate = bufferProto.update;
bufferProto.update = function (buffer, size) {
    if (buffer.byteLength === 0) return;
    let buffSize;

    if (this.cachedUsage & 0x40) { // BufferUsageBit.INDIRECT
        // It is a IIndirectBuffer object.
        const { drawInfos } = buffer;
        buffer = new Uint32Array(drawInfos.length * 7);
        let baseIndex = 0;
        let drawInfo;
        for (let i = 0; i < drawInfos.length; ++i) {
            baseIndex = i * 7;
            drawInfo = drawInfos[i];
            buffer[baseIndex] = drawInfo.vertexCount;
            buffer[baseIndex + 1] = drawInfo.firstVertex;
            buffer[baseIndex + 2] = drawInfo.indexCount;
            buffer[baseIndex + 3] = drawInfo.firstIndex;
            buffer[baseIndex + 4] = drawInfo.vertexOffset;
            buffer[baseIndex + 5] = drawInfo.instanceCount;
            buffer[baseIndex + 6] = drawInfo.firstInstance;
        }

        buffSize = buffer.byteLength;
    } else if (size !== undefined) {
        buffSize = size;
    } else {
        buffSize = buffer.byteLength;
    }

    oldUpdate.call(this, buffer, buffSize);
};

const oldDeviceCreateBufferFun = deviceProto.createBuffer;
deviceProto.createBuffer = function (info) {
    let buffer;
    if (info.buffer) {
        buffer = oldDeviceCreateBufferFun.call(this, info, true);
    } else {
        buffer = oldDeviceCreateBufferFun.call(this, info, false);
    }
    buffer.cachedUsage = info.usage;
    return buffer;
};

const oldBufferInitializeFunc = bufferProto.initialize;
bufferProto.initialize = function (info) {
    if (info.buffer) {
        oldBufferInitializeFunc.call(this, info, true);
    } else {
        oldBufferInitializeFunc.call(this, info, false);
    }
};

const oldDeviceCreateTextureFun = deviceProto.createTexture;
deviceProto.createTexture = function (info) {
    if (info.texture) {
        return oldDeviceCreateTextureFun.call(this, info, true);
    }
    return oldDeviceCreateTextureFun.call(this, info, false);
};

const oldTextureInitializeFunc = textureProto.initialize;
textureProto.initialize = function (info) {
    if (info.texture) {
        oldTextureInitializeFunc.call(this, info, true);
    } else {
        oldTextureInitializeFunc.call(this, info, false);
    }
};

///////////////////////////// optimizations /////////////////////////////

// Cache dirty to avoid invoking gfx.DescriptorSet.update().
descriptorSetProto.bindBuffer = function (binding, buffer, index) {
    this.dirtyJSB = descriptorSetProto.bindBufferJSB.call(this, binding, buffer, index || 0);
};
descriptorSetProto.bindSampler = function (binding, sampler, index) {
    this.dirtyJSB = descriptorSetProto.bindSamplerJSB.call(this, binding, sampler, index || 0);
};
descriptorSetProto.bindTexture = function (bindding, texture, index) {
    this.dirtyJSB = descriptorSetProto.bindTextureJSB.call(this, bindding, texture, index || 0);
};
const oldDSUpdate = descriptorSetProto.update;
descriptorSetProto.update = function () {
    if (!this.dirtyJSB) return;
    oldDSUpdate.call(this);
    this.dirtyJSB = false;
};

Object.defineProperty(deviceProto, 'uboOffsetAlignment', {
    get () {
        if (this.cachedUboOffsetAlignment === undefined) {
            this.cachedUboOffsetAlignment = this.getUboOffsetAlignment();
        }
        return this.cachedUboOffsetAlignment;
    },
});

cc.js.get(shaderProto, 'id', function () {
    return this.shaderID;
});
