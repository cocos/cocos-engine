#pragma once
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <boost/fusion/include/adapt_struct.hpp>
#include <boost/fusion/include/at_c.hpp>
#include <boost/fusion/include/for_each.hpp>
#include <boost/preprocessor/cat.hpp>
#include <boost/preprocessor/seq/for_each.hpp>
#include <boost/preprocessor/stringize.hpp>
#include "WGPUDef.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPURenderPass.h"
#include "WGPUShader.h"
#include "WGPUSwapchain.h"
#include "gfx-base/GFXDef-common.h"

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

#define ASSIGN_PROERTY_BY_SEQ(r, obj, property) \
    obj.property = decltype(obj.property){ems_##obj[#property].as<GetType<decltype(obj.property)>::type>(allow_raw_pointers())};

#define ASSING_FROM_EMS(obj, ...)                                                                 \
    {                                                                                             \
        BOOST_PP_SEQ_FOR_EACH(ASSIGN_PROERTY_BY_SEQ, obj, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define ASSIGN_VEC_BY_SEQ(r, obj, property) \
    obj.property = std::move(convertJSArrayToNumberVector<uint32_t>(ems_##obj[#property]));

#define ASSING_FROM_EMSARRAY(obj, ...)                                                                 \
    {                                                                                             \
        BOOST_PP_SEQ_FOR_EACH(ASSIGN_VEC_BY_SEQ, obj, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

void CCWGPUDescriptorSetLayout::setEMSBindings(val bindings) {
    _bindings = std::move(vecFromEMS<gfx::DescriptorSetLayoutBinding, ems::DescriptorSetLayoutBinding>(bindings));
}

void CCWGPUDescriptorSetLayout::setEMSDynamicBindings(val bindings) {
    _dynamicBindings = std::move(vecFromEMS<uint32_t>(bindings));
}

void CCWGPUDescriptorSetLayout::setEMSBindingIndices(val bindingIndices) {
    _bindingIndices = std::move(vecFromEMS<uint32_t>(bindingIndices));
}

void CCWGPUDescriptorSetLayout::setEMSDescriptorIndices(val descriptorIndices) {
    _descriptorIndices = std::move(vecFromEMS<uint32_t>(descriptorIndices));
}

val CCWGPUDescriptorSetLayout::getEMSBindings() const {
    return vecToEMS<gfx::DescriptorSetLayoutBinding, ems::DescriptorSetLayoutBinding>(_bindings);
}

val CCWGPUDescriptorSetLayout::getEMSDynamicBindings() const {
    return vecToEMS<uint32_t>(_dynamicBindings);
}

val CCWGPUDescriptorSetLayout::getEMSBindingIndices() const {
    return vecToEMS<uint32_t>(_bindingIndices);
}

val CCWGPUDescriptorSetLayout::getEMSDescriptorIndices() const {
    return vecToEMS<uint32_t>(_descriptorIndices);
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
    for (size_t i = 0; i < len; ++i) {
        const auto& emsStage = stagesVec[i];
        auto& gfxStage = shaderInfo.stages[i];
        gfxStage.stage = ShaderStageFlags{emsStage["stage"].as<uint32_t>()};
        gfxStage.source = emsStage["source"].as<std::string>();
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

    return CCWGPUDevice::getInstance()->createShader(shaderInfo);
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

    return CCWGPUDevice::getInstance()->createSwapchain(swapchainInfo);
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

        return CCWGPUDevice::getInstance()->createTexture(textureInfo);

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

        return CCWGPUDevice::getInstance()->createTexture(textureViewInfo);
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

    return CCWGPUDevice::getInstance()->getSampler(samplerInfo);
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
        gfxColors[i].barrier = colorsVec[i]["barrier"].as<GeneralBarrier*>(allow_raw_pointers());
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
    ASSING_FROM_EMS(depthStencil, format, sampleCount, depthLoadOp, depthStoreOp, stencilLoadOp, stencilStoreOp, barrier, isGeneralLayout);

    const auto& emsSubpasses = info["subpasses"];
    const std::vector<val>& subpassesVec = vecFromJSArray<val>(emsSubpasses);
    len = subpassesVec.size();
    auto& gfxSubpasses = renderPassInfo.subpasses;
    gfxColors.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_subpass = subpassesVec[i];
        auto& subpass = gfxSubpasses[i];
        ASSING_FROM_EMSARRAY(subpass, inputs, colors, resolves, preserves);
        ASSING_FROM_EMS(subpass, depthStencil, depthStencilResolve, depthResolveMode, stencilResolveMode);
    }

    const auto& emsDependencies = info["dependencies"];
    const std::vector<val>& dependenciesVec = vecFromJSArray<val>(emsDependencies);
}

} // namespace cc::gfx
