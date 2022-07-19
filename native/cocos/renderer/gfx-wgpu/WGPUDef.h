#pragma once
#include <emscripten/val.h>
#include "../gfx-base/GFXDef-common.h"
#include "base/std/container/vector.h"

namespace cc {
namespace gfx {

//emscripten export struct with pointers.
class TextureInfoInstance {
public:
    TextureInfoInstance() = default;

    inline void setType(TextureType type) { info.type = type; }
    inline void setUsage(uint32_t usageIn) {
        TextureUsage usage = TextureUsageBit::NONE;
        if (hasFlag(static_cast<TextureUsage>(usageIn), TextureUsageBit::TRANSFER_SRC)) {
            usage |= TextureUsageBit::TRANSFER_SRC;
        }
        if (hasFlag(static_cast<TextureUsage>(usageIn), TextureUsageBit::TRANSFER_DST)) {
            usage |= TextureUsageBit::TRANSFER_DST;
        }
        if (hasFlag(static_cast<TextureUsage>(usageIn), TextureUsageBit::SAMPLED)) {
            usage |= TextureUsageBit::SAMPLED;
        }
        if (hasFlag(static_cast<TextureUsage>(usageIn), TextureUsageBit::STORAGE)) {
            usage |= TextureUsageBit::STORAGE;
        }
        if (hasFlag(static_cast<TextureUsage>(usageIn), TextureUsageBit::COLOR_ATTACHMENT)) {
            usage |= TextureUsageBit::COLOR_ATTACHMENT;
        }
        if (hasFlag(static_cast<TextureUsage>(usageIn), TextureUsageBit::DEPTH_STENCIL_ATTACHMENT)) {
            usage |= TextureUsageBit::DEPTH_STENCIL_ATTACHMENT;
        }
        if (hasFlag(static_cast<TextureUsage>(usageIn), TextureUsageBit::INPUT_ATTACHMENT)) {
            usage |= TextureUsageBit::INPUT_ATTACHMENT;
        }
        info.usage = usage;
    }
    inline void setFormat(Format format) { info.format = format; }
    inline void setWidth(uint32_t width) { info.width = width; }
    inline void setHeight(uint32_t height) { info.height = height; }
    inline void setFlags(uint32_t flagsIn) {
        TextureFlags flags = TextureFlagBit::NONE;

        if (hasFlag(static_cast<TextureFlagBit>(flagsIn), TextureFlagBit::GEN_MIPMAP)) {
            flags |= TextureFlagBit::GEN_MIPMAP;
        }
        if (hasFlag(static_cast<TextureFlagBit>(flagsIn), TextureFlagBit::GENERAL_LAYOUT)) {
            flags |= TextureFlagBit::GENERAL_LAYOUT;
        }

        info.flags = flags;
    }
    inline void setLevelCount(uint32_t levelCount) { info.levelCount = levelCount; }
    inline void setLayerCount(uint32_t layerCount) { info.layerCount = layerCount; }
    inline void setSamples(SampleCount sample) { info.samples = sample; }
    inline void setDepth(uint32_t depth) { info.depth = depth; }
    inline void setImageBuffer(intptr_t imgBuff) { info.externalRes = reinterpret_cast<void *>(imgBuff); }

    explicit operator const TextureInfo() const { return info; }

private:
    TextureInfo info;
};

class TextureViewInfoInstance {
public:
    TextureViewInfoInstance() = default;

    inline void setTexture(Texture *tex) { info.texture = tex; }
    inline void setType(TextureType type) { info.type = type; }
    inline void setFormat(Format format) { info.format = format; }
    inline void setBaseLevel(uint32_t baseLevel) { info.baseLevel = baseLevel; }
    inline void setLevelCount(uint32_t levelCount) { info.levelCount = levelCount; }
    inline void setBaseLayer(uint32_t baseLayer) { info.baseLayer = baseLayer; }
    inline void setLayerCount(uint32_t layerCount) { info.layerCount = layerCount; }

    explicit operator const TextureViewInfo() const { return info; }

private:
    TextureViewInfo info;
};

class SwapchainInfoInstance {
public:
    SwapchainInfoInstance() = default;

    inline void setWindowHandle(uintptr_t hwnd) { info.windowHandle = reinterpret_cast<void *>(hwnd); }
    inline void setVsyncMode(VsyncMode mode) { info.vsyncMode = mode; }
    inline void setWidth(uint32_t width) { info.width = width; }
    inline void setHeight(uint32_t height) { info.height = height; }

    explicit operator const SwapchainInfo() const { return info; }

private:
    SwapchainInfo info;
};

class FramebufferInfoInstance {
public:
    FramebufferInfoInstance() = default;

    inline void setRenderPass(RenderPass *renderPass) { info.renderPass = renderPass; }
    inline void setColorTextures(TextureList colors) { info.colorTextures = colors; }
    inline void setDepthStencilTexture(Texture *tex) { info.depthStencilTexture = tex; }

    explicit operator const FramebufferInfo() const { return info; }

private:
    FramebufferInfo info;
};

class BufferViewInfoInstance {
public:
    BufferViewInfoInstance() = default;

    inline void setBuffer(Buffer *buffer) { info.buffer = buffer; }
    inline void setOffset(uint32_t offset) { info.offset = offset; }
    inline void setRange(uint32_t range) { info.range = range; }

    explicit operator const BufferViewInfo() const { return info; }

private:
    BufferViewInfo info;
};

class DescriptorSetInfoInstance {
public:
    DescriptorSetInfoInstance() = default;
    inline void setDescriptorSetLayout(DescriptorSetLayout *layout) { info.layout = layout; }

    explicit operator const DescriptorSetInfo() const { return info; }

private:
    DescriptorSetInfo info;
};

class PipelineStateInfoInstance {
public:
    inline void setShader(Shader *shader) { info.shader = shader; }
    inline void setPipelineLayout(PipelineLayout *pipelineLayout) { info.pipelineLayout = pipelineLayout; }
    inline void setRenderPass(RenderPass *renderPass) { info.renderPass = renderPass; }
    inline void setInputState(InputState inputState) { info.inputState = inputState; }
    inline void setRasterizerState(RasterizerState rasterizerState) { info.rasterizerState = rasterizerState; }
    inline void setDepthStencilState(DepthStencilState depthStencilState) { info.depthStencilState = depthStencilState; }
    inline void setBlendState(BlendState blendState) { info.blendState = blendState; }
    inline void setPrimitiveMode(PrimitiveMode primitive) { info.primitive = primitive; }
    inline void setDynamicStateFlags(DynamicStateFlagBit dynamicStates) { info.dynamicStates = dynamicStates; }
    inline void setPipelineBindPoint(PipelineBindPoint bindPoint) { info.bindPoint = bindPoint; }
    inline void setSubpass(uint32_t subpass) { info.subpass = subpass; }

    explicit operator const PipelineStateInfo() const { return info; }

private:
    PipelineStateInfo info;
};

class InputAssemblerInfoInstance {
public:
    inline void setAttributes(AttributeList attributes) { info.attributes = attributes; }
    inline void setBuffers(BufferList buffers) { info.vertexBuffers = buffers; }
    inline void setIndexBuffer(Buffer *buffer) { info.indexBuffer = buffer; }
    inline void setIndirectBuffer(Buffer *buffer) { info.indirectBuffer = buffer; }

    explicit operator const InputAssemblerInfo() const { return info; }

private:
    InputAssemblerInfo info;
};

class CommandBufferInfoInstance {
public:
    inline void setQueue(Queue *q) { info.queue = q; }
    inline void setType(CommandBufferType type) { info.type = type; }

    explicit operator const CommandBufferInfo() const { return info; }

private:
    CommandBufferInfo info;
};

class DispatchInfoInstance {
public:
    inline void setGroupCountX(uint32_t groupCountX) { info.groupCountX = groupCountX; }
    inline void setGroupCountY(uint32_t groupCountY) { info.groupCountY = groupCountY; }
    inline void setGroupCountZ(uint32_t groupCountZ) { info.groupCountZ = groupCountZ; }
    inline void setIndirectBuffer(Buffer *indirectBuffer) { info.indirectBuffer = indirectBuffer; }
    inline void setIndirectOffset(uint32_t offset) { info.indirectOffset = offset; }

    explicit operator const DispatchInfo() const { return info; }

private:
    DispatchInfo info;
};

class SPVShaderStageInstance {
public:
    ShaderStageFlagBit stage{ShaderStageFlagBit::NONE};
    ccstd::vector<uint32_t> spv;

    inline void setStage(ShaderStageFlagBit stageIn) { stage = stageIn; }
    inline void setSPVData(const emscripten::val &v) { spv = emscripten::convertJSArrayToNumberVector<uint32_t>(v); }
};

class SPVShaderInfoInstance {
public:
    inline void setName(ccstd::string name) { info.name = name; }
    inline void setAttributes(AttributeList attrs) { info.attributes = attrs; }
    inline void setStages(ccstd::vector<SPVShaderStageInstance> spvStages) { stages = spvStages; }
    inline void setBlocks(UniformBlockList blocks) { info.blocks = blocks; }
    inline void setBuffers(UniformStorageBufferList buffers) { info.buffers = buffers; }
    inline void setSamplerTextures(UniformSamplerTextureList list) { info.samplerTextures = list; }
    inline void setTextures(UniformTextureList textures) { info.textures = textures; }
    inline void setSamplers(UniformSamplerList samplers) { info.samplers = samplers; }
    inline void setImages(UniformStorageImageList images) { info.images = images; }
    inline void setSubpasses(UniformInputAttachmentList subpassInputs) { info.subpassInputs = subpassInputs; }

    ShaderInfo info;
    ccstd::vector<SPVShaderStageInstance> stages;
};

class DescriptorSetLayoutBindingInstance {
public:
    inline void setBinding(uint32_t binding) { info.binding = binding; }
    inline void setDescriptorType(DescriptorType descriptorType) { info.descriptorType = descriptorType; }
    inline void setCount(uint32_t count) { info.count = count; }
    inline void setStageFlags(uint32_t stageFlags) {
        ShaderStageFlags flag = ShaderStageFlagBit::NONE;
        if (hasFlag(static_cast<ShaderStageFlags>(stageFlags), ShaderStageFlagBit::VERTEX)) {
            flag |= ShaderStageFlagBit::VERTEX;
        }
        if (hasFlag(static_cast<ShaderStageFlags>(stageFlags), ShaderStageFlagBit::CONTROL)) {
            flag |= ShaderStageFlagBit::CONTROL;
        }
        if (hasFlag(static_cast<ShaderStageFlags>(stageFlags), ShaderStageFlagBit::EVALUATION)) {
            flag |= ShaderStageFlagBit::EVALUATION;
        }
        if (hasFlag(static_cast<ShaderStageFlags>(stageFlags), ShaderStageFlagBit::GEOMETRY)) {
            flag |= ShaderStageFlagBit::GEOMETRY;
        }
        if (hasFlag(static_cast<ShaderStageFlags>(stageFlags), ShaderStageFlagBit::FRAGMENT)) {
            flag |= ShaderStageFlagBit::FRAGMENT;
        }
        if (hasFlag(static_cast<ShaderStageFlags>(stageFlags), ShaderStageFlagBit::COMPUTE)) {
            flag |= ShaderStageFlagBit::COMPUTE;
        }
        info.stageFlags = flag;
    }
    inline void setImmutableSamplers(SamplerList immutableSamplers) { info.immutableSamplers = immutableSamplers; }

    explicit operator const DescriptorSetLayoutBinding() const { return info; }

private:
    DescriptorSetLayoutBinding info;
};

class DescriptorSetLayoutInfoInstance {
public:
    inline void setBindings(ccstd::vector<DescriptorSetLayoutBindingInstance> bindings) { info.bindings = ccstd::vector<DescriptorSetLayoutBinding>(bindings.begin(), bindings.end()); }

    explicit operator const DescriptorSetLayoutInfo() const { return info; }

private:
    DescriptorSetLayoutInfo info;
};

class BufferInfoInstance {
public:
    inline void setUsage(uint32_t usageIn) {
        BufferUsage usage = BufferUsageBit::NONE;
        if (hasFlag(static_cast<BufferUsageBit>(usageIn), BufferUsageBit::TRANSFER_SRC)) {
            usage |= BufferUsageBit::TRANSFER_SRC;
        }
        if (hasFlag(static_cast<BufferUsageBit>(usageIn), BufferUsageBit::TRANSFER_DST)) {
            usage |= BufferUsageBit::TRANSFER_DST;
        }
        if (hasFlag(static_cast<BufferUsageBit>(usageIn), BufferUsageBit::INDEX)) {
            usage |= BufferUsageBit::INDEX;
        }
        if (hasFlag(static_cast<BufferUsageBit>(usageIn), BufferUsageBit::VERTEX)) {
            usage |= BufferUsageBit::VERTEX;
        }
        if (hasFlag(static_cast<BufferUsageBit>(usageIn), BufferUsageBit::UNIFORM)) {
            usage |= BufferUsageBit::UNIFORM;
        }
        if (hasFlag(static_cast<BufferUsageBit>(usageIn), BufferUsageBit::STORAGE)) {
            usage |= BufferUsageBit::STORAGE;
        }
        if (hasFlag(static_cast<BufferUsageBit>(usageIn), BufferUsageBit::INDIRECT)) {
            usage |= BufferUsageBit::INDIRECT;
        }

        info.usage = usage;
    }
    inline void setMemUsage(uint32_t memUsageIn) {
        MemoryUsage memUsage = MemoryUsageBit::NONE;
        if (hasFlag(static_cast<MemoryUsageBit>(memUsageIn), MemoryUsageBit::DEVICE)) {
            memUsage |= MemoryUsageBit::DEVICE;
        }
        if (hasFlag(static_cast<MemoryUsageBit>(memUsageIn), MemoryUsageBit::HOST)) {
            memUsage |= MemoryUsageBit::HOST;
        }
        info.memUsage = memUsage;
    }
    inline void setSize(uint32_t size) { info.size = size; }
    inline void setStride(uint32_t stride) { info.stride = stride; }
    inline void setFlags(uint32_t flagsIn) {
        BufferFlags flags = BufferFlagBit::NONE;

        info.flags = static_cast<BufferFlagBit>(flagsIn);
    }

    explicit operator const BufferInfo() const { return info; }

private:
    BufferInfo info;
};

} // namespace gfx
} // namespace cc
