#pragma once
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <boost/fusion/include/adapt_struct.hpp>
#include <boost/fusion/include/at_c.hpp>
#include <boost/fusion/include/for_each.hpp>
#include <boost/preprocessor/cat.hpp>
#include <boost/preprocessor/seq/for_each.hpp>
#include <boost/preprocessor/stringize.hpp>
#include <boost/preprocessor/variadic/to_seq.hpp>
#include "WGPUBuffer.h"
#include "WGPUCommandBuffer.h"
#include "WGPUDef.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUInputAssembler.h"
#include "WGPUQueue.h"
#include "WGPURenderPass.h"
#include "WGPUShader.h"
#include "WGPUSwapchain.h"
#include "gfx-base/GFXDef-common.h"
#include "states/WGPUBufferBarrier.h"
#include "states/WGPUGeneralBarrier.h"
#include "states/WGPUTextureBarrier.h"
namespace cc::gfx {

using ems::vecFromEMS;
using ems::vecToEMS;
using ::emscripten::allow_raw_pointers;
using ::emscripten::convertJSArrayToNumberVector;
using ::emscripten::val;

template <typename T, typename EnumFallBack = void>
struct GetType {
    using type = T;
};

template <typename T>
struct GetType<T, typename std::enable_if<std::is_enum<T>::value>::type> {
    using type = typename std::underlying_type<T>::type;
};

#define UNREACHABLE_CONDITION CC_ASSERT(false);

#define NUMARGS(...) (sizeof((int[]){__VA_ARGS__}) / sizeof(int))

#define ASSIGN_PROERTY_BY_SEQ(r, obj, property)                                                                                                         \
    if (!ems_##obj[BOOST_PP_STRINGIZE(property)].isUndefined() && !ems_##obj[BOOST_PP_STRINGIZE(property)].isNull()) {                                  \
        obj.property = decltype(obj.property){ems_##obj[BOOST_PP_STRINGIZE(property)].as<GetType<decltype(obj.property)>::type>(allow_raw_pointers())}; \
    }

#define ASSIGN_FROM_EMS(obj, ...)                                                                 \
    {                                                                                             \
        BOOST_PP_SEQ_FOR_EACH(ASSIGN_PROERTY_BY_SEQ, obj, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define SET_PROERTY_BY_SEQ(r, obj, property) \
    ems_##obj.set(BOOST_STRINGIZE(property), static_cast<GetType<decltype(obj.property)>::type>(obj.property));

#define SET_TO_EMS(obj, ...)                                                                   \
    {                                                                                          \
        BOOST_PP_SEQ_FOR_EACH(SET_PROERTY_BY_SEQ, obj, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define ASSIGN_VEC_BY_SEQ(r, obj, property) \
    obj.property = std::move(convertJSArrayToNumberVector<decltype(obj.property)::value_type>(ems_##obj[#property]));

#define ASSIGN_FROM_EMSARRAY(obj, ...)                                                        \
    {                                                                                         \
        BOOST_PP_SEQ_FOR_EACH(ASSIGN_VEC_BY_SEQ, obj, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define CHECK_INCOMPLETE(v) \
    if (v.isUndefined() || v.isNull()) {
#define CHECK_VOID(v)   \
    CHECK_INCOMPLETE(v) \
    return;             \
    }

#define CHECK_PTR(v)    \
    CHECK_INCOMPLETE(v) \
    return nullptr;     \
    }

Shader* CCWGPUDevice::createShader(const val& emsInfo) {
    CHECK_PTR(emsInfo);

    ShaderInfo shaderInfo;
    shaderInfo.name = emsInfo["name"].as<std::string>();

    const auto& stages = emsInfo["stages"];
    size_t len = stages["length"].as<size_t>();
    const std::vector<val>& stagesVec = vecFromJSArray<val>(stages);
    shaderInfo.stages.resize(len);
    std::vector<std::vector<uint32_t>> spirvs;
    for (size_t i = 0; i < len; ++i) {
        const auto& emsStage = stagesVec[i];
        auto& gfxStage = shaderInfo.stages[i];
        gfxStage.stage = ShaderStageFlags{emsStage["stage"].as<uint32_t>()};
        gfxStage.source = emsStage["source"].as<std::string>();
        std::vector<uint32_t> spirv = std::move(convertJSArrayToNumberVector<uint32_t>(emsStage["spvData"]));
        spirvs.emplace_back(spirv);
    }

    const auto& attrs = emsInfo["attributes"];
    len = attrs["length"].as<size_t>();
    const std::vector<val>& attrsVec = vecFromJSArray<val>(attrs);
    shaderInfo.attributes.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsAttr = attrsVec[i];
        auto& gfxAttr = shaderInfo.attributes[i];
        gfxAttr.name = emsAttr["name"].as<std::string>();
        gfxAttr.format = Format{emsAttr["format"].as<uint32_t>()};
        gfxAttr.isNormalized = emsAttr["isNormalized"].as<bool>();
        gfxAttr.stream = emsAttr["stream"].as<uint32_t>();
        gfxAttr.isInstanced = emsAttr["isInstanced"].as<bool>();
        gfxAttr.location = emsAttr["location"].as<uint32_t>();
    }

    const auto& blocks = emsInfo["blocks"];
    len = blocks["length"].as<size_t>();
    const std::vector<val>& blocksVec = vecFromJSArray<val>(blocks);
    shaderInfo.blocks.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsBlock = blocksVec[i];
        auto& gfxBlock = shaderInfo.blocks[i];
        gfxBlock.set = emsBlock["set"].as<uint32_t>();
        gfxBlock.binding = emsBlock["binding"].as<uint32_t>();
        gfxBlock.name = emsBlock["name"].as<std::string>();
        gfxBlock.count = emsBlock["count"].as<uint32_t>();

        const auto& members = emsBlock["members"];
        size_t size = members["length"].as<size_t>();
        const std::vector<val>& membersVec = vecFromJSArray<val>(members);
        gfxBlock.members.resize(size);
        for (size_t j = 0; j < size; ++j) {
            const auto& emsMember = membersVec[j];
            auto& gfxMember = gfxBlock.members[j];
            gfxMember.name = emsMember["name"].as<std::string>();
            gfxMember.type = Type{emsMember["type"].as<uint32_t>()};
            gfxMember.count = emsMember["count"].as<uint32_t>();
        }
    }

    const auto& buffers = emsInfo["buffers"];
    len = buffers["length"].as<size_t>();
    const std::vector<val>& buffersVec = vecFromJSArray<val>(buffers);
    shaderInfo.buffers.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsBuffer = buffersVec[i];
        auto& gfxBuffer = shaderInfo.buffers[i];
        gfxBuffer.set = emsBuffer["set"].as<uint32_t>();
        gfxBuffer.binding = emsBuffer["binding"].as<uint32_t>();
        gfxBuffer.name = emsBuffer["name"].as<std::string>();
        gfxBuffer.count = emsBuffer["count"].as<uint32_t>();
        gfxBuffer.memoryAccess = MemoryAccess{emsBuffer["memoryAccess"].as<uint32_t>()};
    }

    const auto& samplerTextures = emsInfo["samplerTextures"];
    len = samplerTextures["length"].as<size_t>();
    const std::vector<val>& samplerTexturesVec = vecFromJSArray<val>(samplerTextures);
    shaderInfo.samplerTextures.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsSamplerTexture = samplerTexturesVec[i];
        auto& gfxSamplerTexture = shaderInfo.samplerTextures[i];
        gfxSamplerTexture.set = emsSamplerTexture["set"].as<uint32_t>();
        gfxSamplerTexture.binding = emsSamplerTexture["binding"].as<uint32_t>();
        gfxSamplerTexture.name = emsSamplerTexture["name"].as<std::string>();
        gfxSamplerTexture.count = emsSamplerTexture["count"].as<uint32_t>();
        gfxSamplerTexture.type = Type{emsSamplerTexture["type"].as<uint32_t>()};
    }

    const auto& samplers = emsInfo["samplers"];
    len = samplers["length"].as<size_t>();
    const std::vector<val>& samplersVec = vecFromJSArray<val>(samplers);
    shaderInfo.samplers.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsSampler = samplersVec[i];
        auto& gfxSampler = shaderInfo.samplers[i];
        gfxSampler.set = emsSampler["set"].as<uint32_t>();
        gfxSampler.binding = emsSampler["binding"].as<uint32_t>();
        gfxSampler.name = emsSampler["name"].as<std::string>();
        gfxSampler.count = emsSampler["count"].as<uint32_t>();
    }

    const auto& textures = emsInfo["textures"];
    len = textures["length"].as<size_t>();
    const std::vector<val>& texturesVec = vecFromJSArray<val>(textures);
    shaderInfo.textures.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsTexture = texturesVec[i];
        auto& gfxTexture = shaderInfo.textures[i];
        gfxTexture.set = emsTexture["set"].as<uint32_t>();
        gfxTexture.binding = emsTexture["binding"].as<uint32_t>();
        gfxTexture.name = emsTexture["name"].as<std::string>();
        gfxTexture.count = emsTexture["count"].as<uint32_t>();
        gfxTexture.type = Type{emsTexture["type"].as<uint32_t>()};
    }

    const auto& images = emsInfo["images"];
    len = images["length"].as<size_t>();
    const std::vector<val>& imagesVec = vecFromJSArray<val>(images);
    shaderInfo.images.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsImage = imagesVec[i];
        auto& gfxImage = shaderInfo.images[i];
        gfxImage.set = emsImage["set"].as<uint32_t>();
        gfxImage.binding = emsImage["binding"].as<uint32_t>();
        gfxImage.name = emsImage["name"].as<std::string>();
        gfxImage.count = emsImage["count"].as<uint32_t>();
        gfxImage.type = Type{emsImage["type"].as<uint32_t>()};
        gfxImage.memoryAccess = MemoryAccess{emsImage["memoryAccess"].as<uint32_t>()};
    }

    const auto& subpassInputs = emsInfo["subpassInputs"];
    len = subpassInputs["length"].as<size_t>();
    const std::vector<val>& subpassInputsVec = vecFromJSArray<val>(subpassInputs);
    shaderInfo.subpassInputs.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsSubpassInput = subpassInputsVec[i];
        auto& gfxSubpassInput = shaderInfo.subpassInputs[i];
        gfxSubpassInput.set = emsSubpassInput["set"].as<uint32_t>();
        gfxSubpassInput.binding = emsSubpassInput["binding"].as<uint32_t>();
        gfxSubpassInput.name = emsSubpassInput["name"].as<std::string>();
        gfxSubpassInput.count = emsSubpassInput["count"].as<uint32_t>();
    }

    auto* shader = new CCWGPUShader();
    // shader->initialize(shaderInfo);
    shader->initialize(shaderInfo, spirvs);
    return shader;
}

void CCWGPUDevice::initialize(const val& info) {
    CHECK_VOID(info);

    DeviceInfo deviceInfo;

    const auto& emsBindingMappingInfo = info["bindingMappingInfo"];
    auto& gfxBindingMappingInfo = deviceInfo.bindingMappingInfo;

    gfxBindingMappingInfo.maxBlockCounts = std::move(convertJSArrayToNumberVector<uint32_t>(emsBindingMappingInfo["maxBlockCounts"]));
    gfxBindingMappingInfo.maxSamplerTextureCounts = std::move(convertJSArrayToNumberVector<uint32_t>(emsBindingMappingInfo["maxSamplerTextureCounts"]));
    gfxBindingMappingInfo.maxSamplerCounts = std::move(convertJSArrayToNumberVector<uint32_t>(emsBindingMappingInfo["maxSamplerCounts"]));
    gfxBindingMappingInfo.maxTextureCounts = std::move(convertJSArrayToNumberVector<uint32_t>(emsBindingMappingInfo["maxTextureCounts"]));
    gfxBindingMappingInfo.maxBufferCounts = std::move(convertJSArrayToNumberVector<uint32_t>(emsBindingMappingInfo["maxBufferCounts"]));
    gfxBindingMappingInfo.maxImageCounts = std::move(convertJSArrayToNumberVector<uint32_t>(emsBindingMappingInfo["maxImageCounts"]));
    gfxBindingMappingInfo.maxSubpassInputCounts = std::move(convertJSArrayToNumberVector<uint32_t>(emsBindingMappingInfo["maxSubpassInputCounts"]));
    gfxBindingMappingInfo.setIndices = std::move(convertJSArrayToNumberVector<uint32_t>(emsBindingMappingInfo["setIndices"]));

    CCWGPUDevice::getInstance()->initialize(deviceInfo);
}

Swapchain* CCWGPUDevice::createSwapchain(const val& info) {
    CHECK_PTR(info);

    SwapchainInfo swapchainInfo;

    // it's HTMLCanvasElement.
    // swapchainInfo.windowHandle = reinterpret_cast<void*>(info["windowHandle"].as<uint32_t>());
    swapchainInfo.vsyncMode = VsyncMode{info["vsyncMode"].as<uint32_t>()};
    swapchainInfo.width = info["width"].as<uint32_t>();
    swapchainInfo.height = info["height"].as<uint32_t>();

    return this->createSwapchain(swapchainInfo);
}

Texture* CCWGPUDevice::createTexture(const val& info) {
    CHECK_PTR(info);

    const auto& emsTex = info["texture"];
    if (emsTex.isUndefined()) {
        // textureInfo
        TextureInfo textureInfo;
        textureInfo.type = TextureType{info["type"].as<uint32_t>()};
        textureInfo.usage = TextureUsage{info["usage"].as<uint32_t>()};
        textureInfo.format = Format{info["format"].as<uint32_t>()};
        textureInfo.width = info["width"].as<uint32_t>();
        textureInfo.height = info["height"].as<uint32_t>();
        textureInfo.flags = TextureFlags{info["flags"].as<uint32_t>()};
        textureInfo.layerCount = info["layerCount"].as<uint32_t>();
        textureInfo.levelCount = info["levelCount"].as<uint32_t>();
        textureInfo.samples = SampleCount{info["samples"].as<uint32_t>()};
        textureInfo.depth = info["depth"].as<uint32_t>();

        return this->createTexture(textureInfo);

    } else {
        // texViewInfo
        TextureViewInfo textureViewInfo;
        textureViewInfo.texture = info["texture"].as<Texture*>(emscripten::allow_raw_pointers());
        textureViewInfo.type = TextureType{info["type"].as<uint32_t>()};
        textureViewInfo.format = Format{info["format"].as<uint32_t>()};
        textureViewInfo.layerCount = info["layerCount"].as<uint32_t>();
        textureViewInfo.levelCount = info["levelCount"].as<uint32_t>();
        textureViewInfo.baseLayer = info["baseLayer"].as<uint32_t>();
        textureViewInfo.baseLevel = info["baseLevel"].as<uint32_t>();

        return this->createTexture(textureViewInfo);
    }
}

Sampler* CCWGPUDevice::getSampler(const val& info) {
    CHECK_PTR(info);

    SamplerInfo samplerInfo;
    samplerInfo.minFilter = Filter{info["minFilter"].as<uint32_t>()};
    samplerInfo.magFilter = Filter{info["magFilter"].as<uint32_t>()};
    samplerInfo.mipFilter = Filter{info["mipFilter"].as<uint32_t>()};
    samplerInfo.addressU = Address{info["addressU"].as<uint32_t>()};
    samplerInfo.addressV = Address{info["addressV"].as<uint32_t>()};
    samplerInfo.addressW = Address{info["addressW"].as<uint32_t>()};
    samplerInfo.maxAnisotropy = info["maxAnisotropy"].as<uint32_t>();
    samplerInfo.cmpFunc = ComparisonFunc{info["cmpFunc"].as<uint32_t>()};

    return this->getSampler(samplerInfo);
}

RenderPass* CCWGPUDevice::createRenderPass(const val& info) {
    CHECK_PTR(info);

    RenderPassInfo renderPassInfo;
    const auto& emsColors = info["colorAttachments"];
    const std::vector<val>& colorsVec = vecFromJSArray<val>(emsColors);
    size_t len = colorsVec.size();
    auto& gfxColors = renderPassInfo.colorAttachments;
    gfxColors.resize(len);
    for (size_t i = 0; i < len; ++i) {
        gfxColors[i].format = Format{colorsVec[i]["format"].as<uint32_t>()};
        gfxColors[i].sampleCount = SampleCount{colorsVec[i]["sampleCount"].as<uint32_t>()};
        gfxColors[i].loadOp = LoadOp{colorsVec[i]["loadOp"].as<uint32_t>()};
        gfxColors[i].storeOp = StoreOp{colorsVec[i]["storeOp"].as<uint32_t>()};
        gfxColors[i].barrier = colorsVec[i]["barrier"].as<WGPUGeneralBarrier*>(allow_raw_pointers());
        gfxColors[i].isGeneralLayout = colorsVec[i]["isGeneralLayout"].as<bool>();
    }

    const auto& ems_depthStencil = info["depthStencilAttachment"];
    auto& depthStencil = renderPassInfo.depthStencilAttachment;
    // gfxDepthStencil.format = Format{colorsVec[i]["format"].as<uint32_t>()};
    // gfxDepthStencil.sampleCount = SampleCount{colorsVec[i]["sampleCount"].as<uint32_t>()};
    // gfxDepthStencil.depthLoadOp = LoadOp{colorsVec[i]["depthLoadOp"].as<uint32_t>()};
    // gfxDepthStencil.depthStoreOp = StoreOp{colorsVec[i]["depthStoreOp"].as<uint32_t>()};
    // gfxDepthStencil.stencilLoadOp = LoadOp{colorsVec[i]["stencilLoadOp"].as<uint32_t>()};
    // gfxDepthStencil.stencilStoreOp = StoreOp{colorsVec[i]["stencilStoreOp"].as<uint32_t>()};
    // gfxDepthStencil.barrier = colorsVec[i]["barrier"].as<GeneralBarrier*>();
    // gfxDepthStencil.isGeneralLayout = colorsVec[i]["isGeneralLayout"].as<bool>();

    ASSIGN_FROM_EMS(depthStencil, format, sampleCount, depthLoadOp, depthStoreOp, stencilLoadOp, stencilStoreOp, isGeneralLayout);

    const auto& emsSubpasses = info["subpasses"];
    const std::vector<val>& subpassesVec = vecFromJSArray<val>(emsSubpasses);
    len = subpassesVec.size();
    auto& gfxSubpasses = renderPassInfo.subpasses;
    gfxSubpasses.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_subpass = subpassesVec[i];
        auto& subpass = gfxSubpasses[i];
        ASSIGN_FROM_EMSARRAY(subpass, inputs, colors, resolves, preserves);
        ASSIGN_FROM_EMS(subpass, depthStencil, depthStencilResolve, depthResolveMode, stencilResolveMode);
    }

    const auto& emsDependencies = info["dependencies"];
    const std::vector<val>& dependenciesVec = vecFromJSArray<val>(emsDependencies);
    len = dependenciesVec.size();
    auto& gfxDependencies = renderPassInfo.dependencies;
    gfxDependencies.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_dependency = dependenciesVec[i];
        auto& dependency = gfxDependencies[i];
        ASSIGN_FROM_EMS(dependency, srcSubpass, dstSubpass, generalBarrier, bufferBarriers, buffers, bufferBarrierCount, textureBarriers, textures, textureBarrierCount);
    }

    return this->createRenderPass(renderPassInfo);
}

Framebuffer* CCWGPUDevice::createFramebuffer(const val& info) {
    CHECK_PTR(info);

    FramebufferInfo frameBufferInfo;
    const auto& ems_frameBufferInfo = info;
    ASSIGN_FROM_EMS(frameBufferInfo, renderPass, depthStencilTexture);

    const auto& ems_colorTextures = info["colorTextures"];
    if (!ems_colorTextures.isUndefined() || !ems_colorTextures.isNull()) {
        const std::vector<val>& colorTexturesVec = vecFromJSArray<val>(ems_colorTextures);
        size_t len = colorTexturesVec.size();
        auto& gfxColorTextures = frameBufferInfo.colorTextures;
        gfxColorTextures.resize(len);
        for (size_t i = 0; i < len; ++i) {
            gfxColorTextures[i] = colorTexturesVec[i].as<Texture*>(allow_raw_pointers());
        }
    }

    return this->createFramebuffer(frameBufferInfo);
}

DescriptorSetLayout* CCWGPUDevice::createDescriptorSetLayout(const val& info) {
    CHECK_PTR(info);

    DescriptorSetLayoutInfo descriptorSetLayoutInfo;
    const auto& ems_bindings = info["bindings"];
    const std::vector<val>& bindingsVec = vecFromJSArray<val>(ems_bindings);
    auto& bindings = descriptorSetLayoutInfo.bindings;
    size_t len = bindingsVec.size();
    bindings.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_dsbinding = bindingsVec[i];
        auto& dsbinding = bindings[i];
        ASSIGN_FROM_EMS(dsbinding, binding, descriptorType, count, stageFlags);

        const auto& ems_samplers = ems_dsbinding["immutableSamplers"];
        auto& samplers = dsbinding.immutableSamplers;
        const std::vector<val>& samplersVec = vecFromJSArray<val>(ems_samplers);
        size_t samplerLen = samplersVec.size();
        samplers.resize(samplerLen);

        for (size_t j = 0; j < samplerLen; ++j) {
            samplers[j] = samplersVec[j].as<Sampler*>(allow_raw_pointers());
        }
    }

    return this->createDescriptorSetLayout(descriptorSetLayoutInfo);
}

DescriptorSet* CCWGPUDevice::createDescriptorSet(const val& info) {
    CHECK_PTR(info);
    DescriptorSetInfo descriptorSetInfo;
    const auto& ems_descriptorSetInfo = info;
    ASSIGN_FROM_EMS(descriptorSetInfo, layout);
    return this->createDescriptorSet(descriptorSetInfo);
}

Buffer* CCWGPUDevice::createBuffer(const val& info) {
    CHECK_PTR(info);
    const auto& ems_buffer = info["buffer"];
    if (ems_buffer.isUndefined()) {
        // BufferInfo
        BufferInfo bufferInfo;
        const auto& ems_bufferInfo = info;
        ASSIGN_FROM_EMS(bufferInfo, usage, memUsage, size, stride, flags);
        return this->createBuffer(bufferInfo);
    } else {
        // BufferViewInfo
        BufferViewInfo bufferViewInfo;
        const auto& ems_bufferViewInfo = info;
        ASSIGN_FROM_EMS(bufferViewInfo, buffer, offset, range);
        return this->createBuffer(bufferViewInfo);
    }
}

PipelineLayout* CCWGPUDevice::createPipelineLayout(const val& info) {
    CHECK_PTR(info);
    PipelineLayoutInfo pipelineLayoutInfo;

    // static_assert failed due to requirement 'internal::typeSupportsMemoryView()' "type of typed_memory_view is invalid"
    // ASSIGN_FROM_EMSARRAY(pipelineLayoutInfo, setLayouts);

    const auto& ems_setLayouts = info["setLayouts"];
    auto& setLayouts = pipelineLayoutInfo.setLayouts;
    const std::vector<val>& setLayoutsVec = vecFromJSArray<val>(ems_setLayouts);
    size_t len = setLayoutsVec.size();
    setLayouts.resize(len);
    for (size_t i = 0; i < len; ++i) {
        setLayouts[i] = setLayoutsVec[i].as<DescriptorSetLayout*>(allow_raw_pointers());
    }

    return this->createPipelineLayout(pipelineLayoutInfo);
}

InputAssembler* CCWGPUDevice::createInputAssembler(const val& info) {
    CHECK_PTR(info);
    InputAssemblerInfo inputAssemblerInfo;
    const auto& ems_inputAssemblerInfo = info;
    ASSIGN_FROM_EMS(inputAssemblerInfo, indexBuffer, indirectBuffer);

    const auto& ems_vertexBuffers = info["vertexBuffers"];
    auto& vertexBuffers = inputAssemblerInfo.vertexBuffers;
    const std::vector<val>& vertexBuffersVec = vecFromJSArray<val>(ems_vertexBuffers);
    size_t len = vertexBuffersVec.size();
    vertexBuffers.resize(len);
    for (size_t i = 0; i < len; ++i) {
        vertexBuffers[i] = vertexBuffersVec[i].as<Buffer*>(allow_raw_pointers());
    }
    // ASSIGN_FROM_EMSARRAY(inputAssemblerInfo, vertexBuffers);

    const auto& ems_attributes = info["attributes"];
    auto& attributes = inputAssemblerInfo.attributes;
    const std::vector<val>& attributesVec = vecFromJSArray<val>(ems_attributes);
    len = attributesVec.size();
    attributes.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_attr = attributesVec[i];
        auto& attr = attributes[i];
        ASSIGN_FROM_EMS(attr, name, format, isNormalized, stream, isInstanced, location);
    }

    return this->createInputAssembler(inputAssemblerInfo);
}

void CCWGPUDevice::acquire(const val& info) {
    CHECK_VOID(info);

    ccstd::vector<Swapchain*> swapchains;
    const std::vector<val>& ems_swapchains = vecFromJSArray<val>(info);
    size_t len = ems_swapchains.size();
    swapchains.resize(len);
    for (size_t i = 0; i < len; ++i) {
        swapchains[i] = ems_swapchains[i].as<Swapchain*>(allow_raw_pointers());
    }
    return this->acquire(swapchains.data(), swapchains.size());
}

void CCWGPUCommandBuffer::beginRenderPass(RenderPass* renderpass, Framebuffer* framebuffer, const emscripten::val& area, const emscripten::val& colors, float depth, uint32_t stencil) {
    const auto& ems_rect = area;
    Rect rect;
    ASSIGN_FROM_EMS(rect, width, height, x, y);

    ccstd::vector<Color> clearColors;
    const std::vector<val>& ems_clearColorsVec = vecFromJSArray<val>(colors);
    size_t len = ems_clearColorsVec.size();
    clearColors.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_color = ems_clearColorsVec[i];
        auto& color = clearColors[i];
        ASSIGN_FROM_EMS(color, x, y, z, w);
    }

    return this->beginRenderPass(renderpass, framebuffer, rect, clearColors, depth, stencil);
}

PipelineState* CCWGPUDevice::createPipelineState(const emscripten::val& info) {
    CHECK_PTR(info);
    PipelineStateInfo pipelineStateInfo;
    const auto& ems_pipelineStateInfo = info;
    ASSIGN_FROM_EMS(pipelineStateInfo, shader, pipelineLayout, renderPass, primitive, dynamicStates, bindPoint);

    const auto& ems_inputState = info["inputState"];
    const auto& ems_attrs = ems_inputState["attributes"];
    auto& attributes = pipelineStateInfo.inputState.attributes;
    const std::vector<val>& attributesVec = vecFromJSArray<val>(ems_attrs);
    size_t len = attributesVec.size();
    attributes.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_attr = attributesVec[i];
        auto& attr = attributes[i];
        ASSIGN_FROM_EMS(attr, name, format, isNormalized, stream, isInstanced, location);
    }

    const auto& ems_rasterizerState = info["rasterizerState"];
    auto& rasterizerState = pipelineStateInfo.rasterizerState;
    ASSIGN_FROM_EMS(rasterizerState, isDiscard, polygonMode, shadeModel, cullMode, isFrontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop, isDepthClip, isMultisample, lineWidth);

    const auto& ems_depthStencilState = info["depthStencilState"];
    auto& depthStencilState = pipelineStateInfo.depthStencilState;
    ASSIGN_FROM_EMS(depthStencilState, depthTest, depthWrite, depthFunc, stencilTestFront, stencilFuncFront, stencilReadMaskFront, stencilWriteMaskFront, stencilFailOpFront, stencilZFailOpFront,
                    stencilPassOpFront, stencilRefFront, stencilTestBack, stencilFuncBack, stencilReadMaskBack, stencilWriteMaskBack, stencilFailOpBack, stencilZFailOpBack, stencilPassOpBack, stencilRefBack);

    const auto& ems_blendState = info["blendState"];
    auto& blendState = pipelineStateInfo.blendState;
    ASSIGN_FROM_EMS(blendState, isA2C, isIndepend);
    const auto& ems_blendColor = ems_blendState["blendColor"];
    auto& blendColor = blendState.blendColor;
    ASSIGN_FROM_EMS(blendColor, x, y, z, w);
    const auto& ems_targets = ems_blendState["targets"];
    auto& targets = blendState.targets;
    const std::vector<val>& targetsVec = vecFromJSArray<val>(ems_targets);
    len = targetsVec.size();
    targets.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_target = targetsVec[i];
        auto& target = targets[i];
        ASSIGN_FROM_EMS(target, blend, blendSrc, blendDst, blendEq, blendSrcAlpha, blendDstAlpha, blendAlphaEq, blendColorMask);
    }

    return this->createPipelineState(pipelineStateInfo);
}

emscripten::val CCWGPUInputAssembler::getEMSAttributes() const {
    auto arr = val::array();
    const auto& attributes = _attributes;
    for (size_t i = 0; i < attributes.size(); ++i) {
        const auto& attr = attributes[i];
        auto ems_attr = val::object();
        SET_TO_EMS(attr, name, format, isNormalized, stream, isInstanced, location);
        arr.set(i, ems_attr);
    }
    return arr;
}

void CCWGPUQueue::submit(const val& info) {
    ccstd::vector<CommandBuffer*> cmdBuffs;
    const std::vector<val>& ems_cmdBuffs = vecFromJSArray<val>(info);
    size_t len = ems_cmdBuffs.size();
    cmdBuffs.resize(len);
    for (size_t i = 0; i < len; ++i) {
        cmdBuffs[i] = ems_cmdBuffs[i].as<CommandBuffer*>(allow_raw_pointers());
    }
    return this->submit(cmdBuffs.data(), cmdBuffs.size());
}

WGPUGeneralBarrier* CCWGPUDevice::getGeneralBarrier(const emscripten::val& info) {
    CHECK_PTR(info);
    GeneralBarrierInfo barrierInfo;
    const auto& ems_barrierInfo = info;
    ASSIGN_FROM_EMS(barrierInfo, prevAccesses, nextAccesses, type);
    return static_cast<WGPUGeneralBarrier*>(this->getGeneralBarrier(barrierInfo));
}

void CCWGPUCommandBuffer::setViewport(const val& info) {
    CHECK_VOID(info);
    Viewport viewportInfo;
    const auto& ems_viewportInfo = info;
    ASSIGN_FROM_EMS(viewportInfo, left, top, width, height, minDepth, maxDepth);
    return this->setViewport(viewportInfo);
}

void CCWGPUCommandBuffer::setScissor(const val& info) {
    CHECK_VOID(info);
    Rect scissorRectInfo;
    const auto& ems_scissorRectInfo = info;
    ASSIGN_FROM_EMS(scissorRectInfo, x, y, width, height);
    return this->setScissor(scissorRectInfo);
}

void CCWGPUCommandBuffer::bindDescriptorSet(uint32_t set, DescriptorSet* descriptorSet, const emscripten::val& dynamicOffsets) {
    const auto& data = convertJSArrayToNumberVector<uint32_t>(dynamicOffsets);
    return this->bindDescriptorSet(set, descriptorSet, data.size(), data.data());
}

void CCWGPUCommandBuffer::draw(const val& info) {
    CHECK_VOID(info);

    if (!info["update"].isUndefined()) {
        auto* ia = info.as<InputAssembler*>(allow_raw_pointers());
        this->draw(ia->getDrawInfo());
    } else {
        DrawInfo drawInfo;
        const auto& ems_drawInfo = info;
        ASSIGN_FROM_EMS(drawInfo, vertexCount, firstVertex, indexCount, firstVertex, vertexOffset, instanceCount, firstInstance);
        return this->draw(drawInfo);
    }
}

void CCWGPUCommandBuffer::bindPipelineState(const emscripten::val& info) {
    CHECK_VOID(info);
    auto* pipelineState = info.as<PipelineState*>(allow_raw_pointers());
    return this->bindPipelineState(pipelineState);
}

void CCWGPUCommandBuffer::bindInputAssembler(const emscripten::val& info) {
    CHECK_VOID(info);
    auto* ia = info.as<InputAssembler*>(allow_raw_pointers());
    return this->bindInputAssembler(ia);
}

void CCWGPUDevice::copyBuffersToTexture(const emscripten::val& v, Texture* dst, const emscripten::val& vals) {
    CHECK_VOID(v);

    const auto& regions = vecFromJSArray<val>(vals);
    size_t len = regions.size();
    ccstd::vector<BufferTextureCopy> copies(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_copy = regions[i];
        auto& copy = copies[i];
        ASSIGN_FROM_EMS(copy, buffOffset, buffStride, buffTexHeight);
        const auto& ems_texOffset = ems_copy["texOffset"];
        auto& texOffset = copy.texOffset;
        ASSIGN_FROM_EMS(texOffset, x, y, z);
        const auto& ems_texExtent = ems_copy["texExtent"];
        auto& texExtent = copy.texExtent;
        ASSIGN_FROM_EMS(texExtent, width, height, depth);
        const auto& ems_texSubres = ems_copy["texSubres"];
        auto& texSubres = copy.texSubres;
        ASSIGN_FROM_EMS(texSubres, mipLevel, baseArrayLayer, layerCount);
    }

    len = v["length"].as<unsigned>();
    std::vector<std::vector<uint8_t>> lifeProlonger(len);
    std::vector<const uint8_t*> buffers;
    for (size_t i = 0; i < len; i++) {
        lifeProlonger[i] = EMSArraysToU8Vec(v, i);
        buffers.push_back(lifeProlonger[i].data());
    }

    return copyBuffersToTexture(buffers.data(), dst, copies.data(), copies.size());
}

WGPUGeneralBarrier::WGPUGeneralBarrier(const val& info) : GeneralBarrier(GeneralBarrierInfo{}) {
    CHECK_VOID(info);
    // TODO
}

WGPUBufferBarrier::WGPUBufferBarrier(const val& info) : BufferBarrier(BufferBarrierInfo{}) {
    CHECK_VOID(info);
    // TODO
}

WGPUTextureBarrier::WGPUTextureBarrier(const val& info) : TextureBarrier(TextureBarrierInfo{}) {
    CHECK_VOID(info);
    // TODO
}

} // namespace cc::gfx
