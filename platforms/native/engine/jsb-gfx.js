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

// Converters for converting js objects to jsb struct objects
let _converters = {
    texImagesToBuffers: function (texImages) {
        if (texImages) {
            let buffers = [];
            for (let i = 0; i < texImages.length; ++i) {
                let texImage = texImages[i];
                if (texImage instanceof HTMLCanvasElement) {
                    // Refer to HTMLCanvasElement and ImageData implementation
                    buffers.push(texImage._data.data);
                }
                else if (texImage instanceof HTMLImageElement) {
                    // Refer to HTMLImageElement implementation
                    buffers.push(texImage._data);
                }
                else {
                    console.log('copyTexImagesToTexture: Convert texImages to data buffers failed');
                    return null;
                }
            }
            return buffers;
        }
    },
    DeviceInfo: function (info) {
        let width = cc.game.canvas.width,
            height = cc.game.canvas.height,
            handler = window.windowHandler;
        return new gfx.DeviceInfo(info.isAntialias, handler, width, height, info.nativeWidth, info.nativeHeight, info.bindingMappingInfo);
    }
};

// Helper functions to convert the original jsb function to a wrapper function
function replaceFunction (jsbFunc, ...converters) {
    let l = converters.length;
    // Validation
    for (let i = 0; i < l; ++i) {
        if (!converters[i]) {
            return null;
        }
    }
    if (l === 1) {
        return function (param0) {
            // Convert parameters one by one
            let _jsbParam0 = converters[0](param0);
            return this[jsbFunc](_jsbParam0);
        }
    }
    else if (l === 2) {
        return function (param0, param1) {
            // Convert parameters one by one
            let _jsbParam0 = converters[0](param0);
            let _jsbParam1 = converters[1](param1);
            return this[jsbFunc](_jsbParam0, _jsbParam1);
        }
    }
    else if (l === 3) {
        return function (param0, param1, param2) {
            // Convert parameters one by one
            let _jsbParam0 = converters[0](param0);
            let _jsbParam1 = converters[1](param1);
            let _jsbParam2 = converters[2](param2);
            return this[jsbFunc](_jsbParam0, _jsbParam1, _jsbParam2);
        }
    }
    else {
        return function (...params) {
            if (l !== params.length) {
                throw new Error(jsbFunc + ': The parameters length don\'t match the converters length');
            }
            let jsbParams = new Array(l);
            for (let i = 0; i < l; ++i) {
                jsbParams[i] = converters[i](params[i]);
            }
            return this[jsbFunc].apply(this, jsbParams);
        }
    };
}

// Replace all given functions to the wrapper function provided
function replace (proto, replacements) {
    for (let func in replacements) {
        let oldFunc = proto[func];
        let newFunc = replacements[func];
        if (oldFunc && newFunc) {
            let jsbFunc = '_' + func;
            proto[jsbFunc] = oldFunc;
            proto[func] = newFunc;
        }
    }
}

// Cache dirty to avoid invoking gfx.DescriptorSet.update().
let descriptorSetProto = gfx.DescriptorSet.prototype;
descriptorSetProto.bindBuffer = function(binding, buffer, index) {
    this.dirtyJSB = descriptorSetProto.bindBufferJSB.call(this, binding, buffer, index || 0);
}
descriptorSetProto.bindSampler = function(binding, sampler, index) {
    this.dirtyJSB = descriptorSetProto.bindSamplerJSB.call(this, binding, sampler, index || 0);
}
descriptorSetProto.bindTexture = function(bindding, texture, index) {
    this.dirtyJSB = descriptorSetProto.bindTextureJSB.call(this, bindding, texture, index || 0);
}
let oldDSUpdate = descriptorSetProto.update;
descriptorSetProto.update = function() {
    if (!this.dirtyJSB) return;
    oldDSUpdate.call(this);
    this.dirtyJSB = false;
}

replace(gfx.DeviceManager, {
    create: replaceFunction('_create', _converters.DeviceInfo),
});

let deviceProto = gfx.Device.prototype;

let oldCopyTexImagesToTextureFunc = deviceProto.copyTexImagesToTexture;
deviceProto.copyTexImagesToTexture = function(texImages, texture, regions) {
    let images = _converters.texImagesToBuffers(texImages);
    oldCopyTexImagesToTextureFunc.call(this, images, texture, regions);
}

let oldDeviceCreatBufferFun = deviceProto.createBuffer;
deviceProto.createBuffer = function(info) {
    let buffer;
    if (info.buffer) {
        buffer = oldDeviceCreatBufferFun.call(this, info, true);
    } else {
        buffer = oldDeviceCreatBufferFun.call(this, info, false);
    }
    buffer.cachedUsage = info.usage;
    return buffer;
}

let oldDeviceCreatTextureFun = deviceProto.createTexture;
deviceProto.createTexture = function(info) {
    if (info.texture) {
        return oldDeviceCreatTextureFun.call(this, info, true);
    } else {
        return oldDeviceCreatTextureFun.call(this, info, false);
    }
}

Object.defineProperty(deviceProto, 'uboOffsetAlignment', {
    get () {
        if (this.cachedUboOffsetAlignment === undefined) {
            this.cachedUboOffsetAlignment = this.getUboOffsetAlignment();
        }
        return this.cachedUboOffsetAlignment;
    }
})

let shaderProto = gfx.Shader.prototype;
cc.js.get(shaderProto, 'id', function () {
    return this.shaderID;
});

let bufferProto = gfx.Buffer.prototype;

let oldUpdate = bufferProto.update;
bufferProto.update = function(buffer, size) {
    if(buffer.byteLength === 0) return;
    let buffSize;

    if (this.cachedUsage & 0x40) { // BufferUsageBit.INDIRECT
        // It is a IIndirectBuffer object.
        let drawInfos = buffer.drawInfos;
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
    } else if (size !== undefined ) {
        buffSize = size;
    } else {
        buffSize = buffer.byteLength;
    }

    oldUpdate.call(this, buffer, buffSize);
}

let oldBufferInitializeFunc = bufferProto.initialize;
bufferProto.initialize = function(info) {
    if (info.buffer) {
        oldBufferInitializeFunc.call(this, info, true);
    } else {
        oldBufferInitializeFunc.call(this, info, false);
    }
}

let textureProto = gfx.Texture.prototype;
let oldTextureInitializeFunc = textureProto.initialize;
textureProto.initialize = function(info) {
    if (info.texture) {
        oldTextureInitializeFunc.call(this, info, true);
    } else {
        oldTextureInitializeFunc.call(this, info, false);
    }
}
