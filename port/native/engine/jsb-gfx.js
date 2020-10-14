/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
        return new gfx.DeviceInfo(handler, width, height, info.nativeWidth, info.nativeHeight, null, info.bindingMappingInfo);
    },
    ShaderMacro: function (macro) {
        return new gfx.ShaderMacro(macro.macro, macro.value);
    },
    ColorAttachment: function (attachment) {
        return new gfx.ColorAttachment(attachment);
    },
    DepthStencilAttachment: function (attachment) {
        return new gfx.DepthStencilAttachment(attachment);
    },
    SubPass: function (subPass) {
        return new gfx.SubPass(subPass);
    },
    RenderPassInfo: function (info) {
        let colors = info.colorAttachments,
            subPasses = info.subPasses;
        let jsbColors, jsbSubPasses;
        if (colors) {
            jsbColors = [];
            for (let i = 0; i < colors.length; ++i) {
                jsbColors.push(_converters.ColorAttachment(colors[i]));
            }
        }
        if (subPasses) {
            jsbSubPasses = [];
            for (let i = 0; i < subPasses.length; ++i) {
                jsbSubPasses.push(_converters.SubPass(subPasses[i]));
            }
        }
        let jsbDSAttachment = _converters.DepthStencilAttachment(info.depthStencilAttachment);
        return new gfx.RenderPassInfo(jsbColors, jsbDSAttachment, jsbSubPasses);
    },
    FramebufferInfo: function (info) {
        return new gfx.FramebufferInfo(info);
    },
    DescriptorSetInfo: function (info) {
        return new gfx.DescriptorSetInfo(info.layout);
    },
    DescriptorSetLayoutBinding: function (info) {
        return new gfx.DescriptorSetLayoutBinding(info);
    },
    DescriptorSetLayoutInfo: function (info) {
        let bindings = info.bindings;
        let jsbBindings = [];
        for (const binding of bindings) {
            jsbBindings.push(_converters.DescriptorSetLayoutBinding(binding));
        }
        return new gfx.DescriptorSetLayoutInfo(jsbBindings);
    },
    PipelineLayoutInfo: function (info) {
        return new gfx.PipelineLayoutInfo(info.setLayouts);
    },
    BindingUnit: function (info) {
        return new gfx.BindingUnit(info);
    },
    PushConstantRange: function (range) {
        return new gfx.PushConstantRange(range.shaderType, range.offset, range.count);
    },
    CommandBufferInfo: function (info) {
        return new gfx.CommandBufferInfo(info);
    },
    QueueInfo: function (info) {
        return new gfx.QueueInfo(info.type, !!info.forceSync);
    },
    FormatInfo: function (info) {
        return new gfx.FormatInfo(info);
    },
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

let deviceProtos = [
    gfx.CCVKDevice && gfx.CCVKDevice.prototype,
    gfx.CCMTLDevice && gfx.CCMTLDevice.prototype,
    gfx.GLES3Device && gfx.GLES3Device.prototype,
    gfx.GLES2Device && gfx.GLES2Device.prototype,
];
deviceProtos.forEach(function(item, index) {
    if (item !== undefined) {
        replace(item, {
            initialize: replaceFunction('_initialize', _converters.DeviceInfo),
            createQueue: replaceFunction('_createQueue', _converters.QueueInfo),
            createCommandBuffer: replaceFunction('_createCommandBuffer', _converters.CommandBufferInfo),
            createRenderPass: replaceFunction('_createRenderPass', _converters.RenderPassInfo),
            createFramebuffer: replaceFunction('_createFramebuffer', _converters.FramebufferInfo),
            createDescriptorSet: replaceFunction('_createDescriptorSet', _converters.DescriptorSetInfo),
            createDescriptorSetLayout: replaceFunction('_createDescriptorSetLayout', _converters.DescriptorSetLayoutInfo),
            createPipelineLayout: replaceFunction('_createPipelineLayout', _converters.PipelineLayoutInfo),
        });

        let oldCopyTexImagesToTextureFunc = item.copyTexImagesToTexture;
        item.copyTexImagesToTexture = function(texImages, texture, regions) {
            let images = _converters.texImagesToBuffers(texImages);
            oldCopyTexImagesToTextureFunc.call(this, images, texture, regions);
        }

        let oldDeviceCreatBufferFun = item.createBuffer;
        item.createBuffer = function(info) {
            if (info.buffer) {
                return oldDeviceCreatBufferFun.call(this, info, true);
            } else {
                return oldDeviceCreatBufferFun.call(this, info, false);
            }
        }

        let oldDeviceCreatTextureFun = item.createTexture;
        item.createTexture = function(info) {
            if (info.texture) {
                return oldDeviceCreatTextureFun.call(this, info, true);
            } else {
                return oldDeviceCreatTextureFun.call(this, info, false);
            }
        }
    }
});

let commandBufferProto = gfx.CommandBuffer.prototype;
replace(commandBufferProto, {
    initialize: replaceFunction('_initialize', _converters.CommandBufferInfo),
});

let framebufferProto = gfx.Framebuffer.prototype;
replace(framebufferProto, {
    initialize: replaceFunction('_initialize', _converters.FramebufferInfo),
});

let descriptorSetProto = gfx.DescriptorSet.prototype;
replace(descriptorSetProto, {
    initialize: replaceFunction('_initialize', _converters.DescriptorSetInfo),
});

let descriptorSetLayoutProto = gfx.DescriptorSetLayout.prototype;
replace(descriptorSetLayoutProto, {
    initialize: replaceFunction('_initialize', _converters.DescriptorSetLayoutInfo),
});

let pipelineLayoutProto = gfx.PipelineLayout.prototype;
replace(pipelineLayoutProto, {
    initialize: replaceFunction('_initialize', _converters.PipelineLayoutInfo),
});

let queueProto = gfx.Queue.prototype;
replace(queueProto, {
    initialize: replaceFunction('_initialize', _converters.QueueInfo),
});

let renderPassProto = gfx.RenderPass.prototype;
replace(renderPassProto, {
    initialize: replaceFunction('_initialize', _converters.RenderPassInfo),
});

let samplerProto = gfx.Sampler.prototype;
replace(samplerProto, {
    initialize: replaceFunction('_initialize', _converters.SamplerInfo),
});

let shaderProto = gfx.Shader.prototype;
cc.js.get(shaderProto, 'id', function () {
    return this.shaderID;
});

let bufferProto = gfx.Buffer.prototype;

let oldUpdate = bufferProto.update;
bufferProto.update = function(buffer, offset, size) {
    let buffSize;
    if (size !== undefined ) {
        buffSize = size;
    } else if (this.cachedUsage & 0x40) { // BufferUsageBit.INDIRECT
        // It is a IGFXIndirectBuffer object.
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
    } else {
        buffSize = buffer.byteLength;
    }

    oldUpdate.call(this, buffer, offset || 0, buffSize);
}

let oldBufferInitializeFunc = bufferProto.initialize;
bufferProto.initialize = function(info) {
    this.cachedUsage = info.usage;
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
