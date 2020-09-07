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
const _rect = new gfx.Rect();
const _color = new gfx.Color();
const _colorArray = [];

// Converters for converting js objects to jsb struct objects
let _converters = {
    origin: function (arg) {
        return arg;
    },
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
    Offset: function (offset) {
        return offset && new gfx.Offset(offset.x, offset.y, offset.z);
    },
    Rect: function(rect) {
        if (rect) {
            Object.assign(_rect, rect);
        }
        return _rect;
    },
    Extent: function (extent) {
        return extent && new gfx.Extent(extent.width, extent.height, extent.depth);
    },
    TextureSubres: function (res) {
        return res && new gfx.TextureSubres(res.mipLevel, res.baseArrayLayer, res.layerCount);
    },
    // TextureCopy,
    BufferTextureCopy: function (obj) {
        let jsbOffset = _converters.Offset(obj.texOffset);
        let jsbExtent = _converters.Extent(obj.texExtent);
        let jsbSubres = _converters.TextureSubres(obj.texSubres);
        return new gfx.BufferTextureCopy(obj.buffStride, obj.buffTexHeight, jsbOffset, jsbExtent, jsbSubres);
    },
    BufferTextureCopyList: function (list) {
        if (list) {
            let jsbList = [];
            for (let i = 0; i < list.length; ++i) {
                jsbList.push(_converters.BufferTextureCopy(list[i]));
            }
            return jsbList;
        }
    },
    Viewport: function (vp) {
        return vp && new gfx.Viewport(vp.left, vp.top, vp.width, vp.height, vp.minDepth, vp.maxDepth);
    },
    Color: function(color) {
        if (color) {
            Object.assign(_color, color);
        }
        return _color;
    },
    ColorArray: function(colors) {
        if (colors) {
            colors.forEach((t, i) => Object.assign(
                _colorArray[i] || (_colorArray[i] = new gfx.Color()), t));
        }
        return _colorArray;
    },
    BindingMappingInfo: function (info) {
        return new gfx.BindingMappingInfo(info);
    },
    DeviceInfo: function (info) {
        let width = cc.game.canvas.width,
            height = cc.game.canvas.height,
            handler = window.windowHandler;
        let bindingMappingInfo = info.bindingMappingInfo ? _converters.BindingMappingInfo(info.bindingMappingInfo) : undefined;
        return new gfx.DeviceInfo(handler, width, height, info.nativeWidth, info.nativeHeight, null, bindingMappingInfo);
    },
    // ContextInfo,
    BufferInfo: function (info) {
        return new gfx.BufferInfo(info);
    },
    BufferViewInfo: function (info) {
        return new gfx.BufferViewInfo(info);
    },
    // DrawInfo,
    // GFXIndirectBuffer,
    TextureInfo: function (info) {
        return new gfx.TextureInfo(info);
    },
    TextureViewInfo: function (info) {
        return new gfx.TextureViewInfo(info);
    },
    SamplerInfo: function (info) {
        info.borderColor = _converters.Color(info.borderColor);
        return new gfx.SamplerInfo(info);
    },
    ShaderMacro: function (macro) {
        return new gfx.ShaderMacro(macro.macro, macro.value);
    },
    Uniform: function (u) {
        return new gfx.Uniform(u.name, u.type, u.count);
    },
    UniformBlock: function (block) {
        let uniforms = block.members;
        let jsbUniforms;
        if (uniforms) {
            jsbUniforms = [];
            for (let i = 0; i < uniforms.length; ++i) {
                jsbUniforms.push(_converters.Uniform(uniforms[i]));
            }
        }
        return new gfx.UniformBlock(block.set, block.binding, block.name, jsbUniforms, block.count);
    },
    UniformSampler: function (sampler) {
        return new gfx.UniformSampler(sampler);
    },
    ShaderStage: function (stage) {
        return new gfx.ShaderStage(stage);
    },
    ShaderInfo: function (info) {
        let stages = info.stages,
            attributes = info.attributes,
            blocks = info.blocks,
            samplers = info.samplers;
        let jsbStages, jsbAttributes, jsbBlocks, jsbSamplers;
        if (stages) {
            jsbStages = [];
            for (let i = 0; i < stages.length; ++i) {
                jsbStages.push(_converters.ShaderStage(stages[i]));
            }
        }
        if (attributes) {
            jsbAttributes = [];
            for (let i = 0; i < attributes.length; ++i) {
                jsbAttributes.push(_converters.Attribute(attributes[i]));
            }
        }
        if (blocks) {
            jsbBlocks = [];
            for (let i = 0; i < blocks.length; ++i) {
                jsbBlocks.push(_converters.UniformBlock(blocks[i]));
            }
        }
        if (samplers) {
            jsbSamplers = [];
            for (let i = 0; i < samplers.length; ++i) {
                jsbSamplers.push(_converters.UniformSampler(samplers[i]));
            }
        }
        return new gfx.ShaderInfo(info.name, jsbStages, jsbAttributes, jsbBlocks, jsbSamplers);
    },
    Attribute: function (attr) {
        return new gfx.Attribute(attr.name, attr.format, attr.isNormalized, attr.stream, attr.isInstanced, attr.location);
    },
    InputAssemblerInfo: function (info) {
        let attrs = info.attributes;
        let jsbAttrs;
        if (attrs) {
            jsbAttrs = [];
            for (let i = 0; i < attrs.length; ++i) {
                jsbAttrs.push(_converters.Attribute(attrs[i]));
            }
        }
        return new gfx.InputAssemblerInfo(jsbAttrs, info.vertexBuffers, info.indexBuffer, info.indirectBuffer);
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
    InputState: function (info) {
        let attrs = info.attributes;
        let jsbAttrs;
        if (attrs) {
            jsbAttrs = [];
            for (let i = 0; i < attrs.length; ++i) {
                jsbAttrs.push(_converters.Attribute(attrs[i]));
            }
        }
        return new gfx.InputState(jsbAttrs);
    },
    RasterizerState: function (info) {
        return new gfx.RasterizerState(info);
    },
    DepthStencilState: function (info) {
        return new gfx.DepthStencilState(info);
    },
    BlendTarget: function (info) {
        return new gfx.BlendTarget(info);
    },
    BlendState: function (state) {
        let targets = state.targets;
        let jsbTargets;
        if (targets) {
            jsbTargets = [];
            for (let i = 0; i < targets.length; ++i) {
                jsbTargets.push(_converters.BlendTarget(targets[i]));
            }
        }
        let color = _converters.Color(state.blendColor);
        return new gfx.BlendState(state.isA2c, state.isIndepend, color, jsbTargets);
    },
    PipelineStateInfo: function (info) {
        let jsbInfo = {
            primitive: info.primitive,
            shader: info.shader,
            inputState: _converters.InputState(info.inputState),
            rasterizerState: _converters.RasterizerState(info.rasterizerState),
            depthStencilState: _converters.DepthStencilState(info.depthStencilState),
            blendState: _converters.BlendState(info.blendState),
            dynamicStates: info.dynamicStates,
            renderPass: info.renderPass,
            pipelineLayout: info.pipelineLayout,
        }
        return new gfx.PipelineStateInfo(jsbInfo);
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
            createSampler: replaceFunction('_createSampler', _converters.SamplerInfo),
            createShader: replaceFunction('_createShader', _converters.ShaderInfo),
            createInputAssembler: replaceFunction('_createInputAssembler', _converters.InputAssemblerInfo),
            createRenderPass: replaceFunction('_createRenderPass', _converters.RenderPassInfo),
            createFramebuffer: replaceFunction('_createFramebuffer', _converters.FramebufferInfo),
            createDescriptorSet: replaceFunction('_createDescriptorSet', _converters.DescriptorSetInfo),
            createDescriptorSetLayout: replaceFunction('_createDescriptorSetLayout', _converters.DescriptorSetLayoutInfo),
            createPipelineLayout: replaceFunction('_createPipelineLayout', _converters.PipelineLayoutInfo),
            createPipelineState: replaceFunction('_createPipelineState', _converters.PipelineStateInfo),
            copyBuffersToTexture: replaceFunction('_copyBuffersToTexture', _converters.origin, _converters.origin, _converters.BufferTextureCopyList),
            copyTexImagesToTexture: replaceFunction('_copyTexImagesToTexture', _converters.texImagesToBuffers, _converters.origin, _converters.BufferTextureCopyList),
        });

        let oldDeviceCreatBufferFun = item.createBuffer;
        item.createBuffer = function(info) {
            if (info.buffer) {
                return oldDeviceCreatBufferFun.call(this, _converters.BufferViewInfo(info), true);
            } else {
                return oldDeviceCreatBufferFun.call(this, _converters.BufferInfo(info), false);
            }
        }

        let oldDeviceCreatTextureFun = item.createTexture;
        item.createTexture = function(info) {
            if (info.texture) {
                return oldDeviceCreatTextureFun.call(this, _converters.TextureViewInfo(info), true);
            } else {
                return oldDeviceCreatTextureFun.call(this, _converters.TextureInfo(info), false);
            }
        }
    }
});

let commandBufferProto = gfx.CommandBuffer.prototype;
replace(commandBufferProto, {
    initialize: replaceFunction('_initialize', _converters.CommandBufferInfo),
    setViewport: replaceFunction('_setViewport', _converters.Viewport),
    setScissor: replaceFunction('_setScissor', _converters.Rect),
    setBlendConstants: replaceFunction('_setBlendConstants', _converters.Color),
    beginRenderPass: replaceFunction('_beginRenderPass',
        _converters.origin,
        _converters.origin,
        _converters.Rect,
        _converters.ColorArray,
        _converters.origin,
        _converters.origin),
});

let framebufferProto = gfx.Framebuffer.prototype;
replace(framebufferProto, {
    initialize: replaceFunction('_initialize', _converters.FramebufferInfo),
});

let iaProto = gfx.InputAssembler.prototype;
replace(iaProto, {
    initialize: replaceFunction('_initialize', _converters.InputAssemblerInfo),
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

let pipelineStateProto = gfx.PipelineState.prototype;
replace(pipelineStateProto, {
    initialize: replaceFunction('_initialize', _converters.PipelineStateInfo),
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
replace(shaderProto, {
    initialize: replaceFunction('_initialize', _converters.ShaderInfo),
});
cc.js.get(shaderProto, 'id', function () {
    return this.hash;
});

let bufferProto = gfx.Buffer.prototype;

let oldUpdate = bufferProto.update;
bufferProto.update = function(buffer, offset, size) {
    let buffSize;
    if (size !== undefined ) {
        buffSize = size;
    } else if (this.usage & 0x40) { // BufferUsageBit.INDIRECT
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
    if (info.buffer) {
        oldBufferInitializeFunc.call(this, _converters.BufferViewInfo(info), true);
    } else {
        oldBufferInitializeFunc.call(this, _converters.BufferInfo(info), false);
    }
}

let textureProto = gfx.Texture.prototype;
let oldTextureInitializeFunc = textureProto.initialize;
textureProto.initialize = function(info) {
    if (info.texture) {
        oldTextureInitializeFunc.call(this, _converters.TextureViewInfo(info), true);
    } else {
        oldTextureInitializeFunc.call(this, _converters.TextureInfo(info), false);
    }
}
