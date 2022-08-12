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
#include "WGPUFrameBuffer.h"
#include "WGPUInputAssembler.h"
#include "WGPUQueue.h"
#include "WGPURenderPass.h"
#include "WGPUSampler.h"
#include "WGPUShader.h"
#include "WGPUSwapchain.h"
#include "WGPUTexture.h"
#include "gfx-base/GFXDef-common.h"
#include "states/WGPUBufferBarrier.h"
#include "states/WGPUGeneralBarrier.h"
#include "states/WGPUTextureBarrier.h"
namespace cc::gfx {

using ::emscripten::allow_raw_pointers;
// using ::emscripten::convertJSArrayToNumberVector_local;
using ::emscripten::val;

#define CACHE_NAME(r, _, property) \
    const val BOOST_PP_CAT(property, _val){BOOST_PP_STRINGIZE(property)};

#define CACHE_EMS_VAL(...) \
    BOOST_PP_SEQ_FOR_EACH(CACHE_NAME, _, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__));

CACHE_EMS_VAL(
    length, update, colorTextures, colorAttachments, format, sampleCount, loadOp, storeOp, barrier, isGeneralLayout, depthStencilAttachment, subpasses,
    dependencies, name, stages, stage, source, spvData, attributes, isNormalized, stream, isInstanced, location, blocks, set, binding, count, members, type,
    buffers, memoryAccess, samplerTextures, samplers, textures, images, subpassInputs, bindingMappingInfo, maxBlockCounts, maxSamplerTextureCounts,
    maxTextureCounts, maxBufferCounts, maxImageCounts, maxSubpassInputCounts, setIndices, vsyncMode, width, height, texture, flags, layerCount, levelCount,
    samples, depth, minFilter, magFilter, mipFilter, addressU, addressV, addressW, maxAnisotropy, cmpFunc, bindings, immutableSamplers, buffer)

CACHE_EMS_VAL(
    setLayouts, vertexBuffers, inputState, rasterizerState, depthStencilState, blendState, blendColor, targets, texOffset, texExtent, texSubres, externalRes,
    inputs, colors, resolves, preserves, subpass, depthStencil, depthStencilResolve, depthResolveMode, stencilResolveMode, renderPass, depthStencilTexture,
    depthLoadOp, depthStoreOp, stencilLoadOp, stencilStoreOp, srcSubpass, dstSubpass, generalBarrier, bufferBarriers, bufferBarrierCount, maxSamplerCounts,
    textureBarriers, textureBarrierCount, descriptorType, stageFlags, layout, usage, memUsage, size, stride, offset, range, indexBuffer, indirectBuffer,
    x, y, z, w, shader, pipelineLayout, primitive, dynamicStates, bindPoint, isDiscard, polygonMode, shadeModel, cullMode, isFrontFaceCCW, depthBiasEnabled,
    depthBias, depthBiasClamp, baseLayer)

CACHE_EMS_VAL(
    depthBiasSlop, isDepthClip, isMultisample, lineWidth, depthTest, depthWrite, depthFunc, stencilTestFront, stencilFuncFront,
    stencilReadMaskFront, stencilWriteMaskFront, stencilFailOpFront, stencilZFailOpFront, stencilPassOpFront, stencilRefFront, stencilTestBack, stencilFuncBack,
    stencilReadMaskBack, stencilWriteMaskBack, stencilFailOpBack, stencilZFailOpBack, stencilPassOpBack, stencilRefBack, isA2C, isIndepend, blend, blendSrc,
    blendDst, blendEq, blendSrcAlpha, blendDstAlpha, blendAlphaEq, blendColorMask, prevAccesses, nextAccesses, left, top, minDepth, maxDepth, vertexCount,
    firstVertex, indexCount, vertexOffset, instanceCount, firstInstance, buffOffset, buffStride, buffTexHeight, mipLevel, baseArrayLayer, baseLevel)

template <typename T>
std::vector<T> convertJSArrayToNumberVector_local(const val& v) {
    const size_t l = v[length_val].as<size_t>();

    std::vector<T> rv;
    rv.resize(l);

    // Copy the array into our vector through the use of typed arrays.
    // It will try to convert each element through Number().
    // See https://www.ecma-international.org/ecma-262/6.0/#sec-%typedarray%.prototype.set-array-offset
    // and https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
    val memoryView{emscripten::typed_memory_view(l, rv.data())};
    memoryView.call<void>("set", v);

    return rv;
}

template <typename T>
std::vector<T> vecFromJSArray_local(const val& v) {
    const size_t l = v[length_val].as<size_t>();

    std::vector<T> rv;
    rv.reserve(l);
    for (size_t i = 0; i < l; ++i) {
        rv.push_back(v[i].as<T>());
    }

    return rv;
}

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
    if (!ems_##obj[BOOST_PP_CAT(property, _val)].isUndefined() && !ems_##obj[BOOST_PP_CAT(property, _val)].isNull()) {                                  \
        obj.property = decltype(obj.property){ems_##obj[BOOST_PP_CAT(property, _val)].as<GetType<decltype(obj.property)>::type>(allow_raw_pointers())}; \
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
    obj.property = std::move(convertJSArrayToNumberVector_local<decltype(obj.property)::value_type>(ems_##obj[#property]));

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

#define EMSArraysToU8Vec(v, i) (convertJSArrayToNumberVector_local<uint8_t>(v[i]))

const FramebufferInfo fromEmsFramebufferInfo(const val& info) {
    FramebufferInfo frameBufferInfo;
    const auto& ems_frameBufferInfo = info;
    ASSIGN_FROM_EMS(frameBufferInfo, renderPass, depthStencilTexture);

    const auto& ems_colorTextures = info[colorTextures_val];
    if (!ems_colorTextures.isUndefined() || !ems_colorTextures.isNull()) {
        const std::vector<val>& colorTexturesVec = vecFromJSArray_local<val>(ems_colorTextures);
        size_t len = colorTexturesVec.size();
        auto& gfxColorTextures = frameBufferInfo.colorTextures;
        gfxColorTextures.resize(len);
        for (size_t i = 0; i < len; ++i) {
            gfxColorTextures[i] = colorTexturesVec[i].as<Texture*>(allow_raw_pointers());
        }
    }
    return frameBufferInfo;
}

RenderPassInfo fromEmsRenderPassInfo(const val& info) {
    RenderPassInfo renderPassInfo;
    const auto& emsColors = info[colorAttachments_val];
    const std::vector<val>& colorsVec = vecFromJSArray_local<val>(emsColors);
    size_t len = colorsVec.size();
    auto& gfxColors = renderPassInfo.colorAttachments;
    gfxColors.resize(len);
    for (size_t i = 0; i < len; ++i) {
        gfxColors[i].format = Format{colorsVec[i][format_val].as<uint32_t>()};
        gfxColors[i].sampleCount = SampleCount{colorsVec[i][sampleCount_val].as<uint32_t>()};
        gfxColors[i].loadOp = LoadOp{colorsVec[i][loadOp_val].as<uint32_t>()};
        gfxColors[i].storeOp = StoreOp{colorsVec[i][storeOp_val].as<uint32_t>()};
        gfxColors[i].barrier = colorsVec[i][barrier_val].as<WGPUGeneralBarrier*>(allow_raw_pointers());
        gfxColors[i].isGeneralLayout = colorsVec[i][isGeneralLayout_val].as<bool>();
    }

    const auto& ems_depthStencil = info[depthStencilAttachment_val];
    auto& depthStencil = renderPassInfo.depthStencilAttachment;
    // gfxDepthStencil.format = Format{colorsVec[i][format_val].as<uint32_t>()};
    // gfxDepthStencil.sampleCount = SampleCount{colorsVec[i][sampleCount_val].as<uint32_t>()};
    // gfxDepthStencil.depthLoadOp = LoadOp{colorsVec[i][depthLoadOp_val].as<uint32_t>()};
    // gfxDepthStencil.depthStoreOp = StoreOp{colorsVec[i][depthStoreOp_val].as<uint32_t>()};
    // gfxDepthStencil.stencilLoadOp = LoadOp{colorsVec[i][stencilLoadOp_val].as<uint32_t>()};
    // gfxDepthStencil.stencilStoreOp = StoreOp{colorsVec[i][stencilStoreOp_val].as<uint32_t>()};
    // gfxDepthStencil.barrier = colorsVec[i][barrier_val].as<GeneralBarrier*>();
    // gfxDepthStencil.isGeneralLayout = colorsVec[i][isGeneralLayout_val].as<bool>();

    ASSIGN_FROM_EMS(depthStencil, format, sampleCount, depthLoadOp, depthStoreOp, stencilLoadOp, stencilStoreOp, isGeneralLayout);

    const auto& emsSubpasses = info[subpasses_val];
    const std::vector<val>& subpassesVec = vecFromJSArray_local<val>(emsSubpasses);
    len = subpassesVec.size();
    auto& gfxSubpasses = renderPassInfo.subpasses;
    gfxSubpasses.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_subpass = subpassesVec[i];
        auto& subpass = gfxSubpasses[i];
        ASSIGN_FROM_EMSARRAY(subpass, inputs, colors, resolves, preserves);
        ASSIGN_FROM_EMS(subpass, depthStencil, depthStencilResolve, depthResolveMode, stencilResolveMode);
    }

    const auto& emsDependencies = info[dependencies_val];
    const std::vector<val>& dependenciesVec = vecFromJSArray_local<val>(emsDependencies);
    len = dependenciesVec.size();
    auto& gfxDependencies = renderPassInfo.dependencies;
    gfxDependencies.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_dependency = dependenciesVec[i];
        auto& dependency = gfxDependencies[i];
        ASSIGN_FROM_EMS(dependency, srcSubpass, dstSubpass, generalBarrier, bufferBarriers, buffers, bufferBarrierCount, textureBarriers, textures, textureBarrierCount);
    }
    return renderPassInfo;
}

Shader* CCWGPUDevice::createShader(const val& emsInfo) {
    CHECK_PTR(emsInfo);

    ShaderInfo shaderInfo;
    shaderInfo.name = emsInfo[name_val].as<std::string>();

    const auto& stages = emsInfo[stages_val];
    size_t len = stages[length_val].as<size_t>();
    const std::vector<val>& stagesVec = vecFromJSArray_local<val>(stages);
    shaderInfo.stages.resize(len);
    std::vector<std::vector<uint32_t>> spirvs;
    for (size_t i = 0; i < len; ++i) {
        const auto& emsStage = stagesVec[i];
        auto& gfxStage = shaderInfo.stages[i];
        gfxStage.stage = ShaderStageFlags{emsStage[stage_val].as<uint32_t>()};
        gfxStage.source = emsStage[source_val].as<std::string>();
        std::vector<uint32_t> spirv = std::move(convertJSArrayToNumberVector_local<uint32_t>(emsStage[spvData_val]));
        spirvs.emplace_back(spirv);
    }

    const auto& attrs = emsInfo[attributes_val];
    len = attrs[length_val].as<size_t>();
    const std::vector<val>& attrsVec = vecFromJSArray_local<val>(attrs);
    shaderInfo.attributes.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsAttr = attrsVec[i];
        auto& gfxAttr = shaderInfo.attributes[i];
        gfxAttr.name = emsAttr[name_val].as<std::string>();
        gfxAttr.format = Format{emsAttr[format_val].as<uint32_t>()};
        gfxAttr.isNormalized = emsAttr[isNormalized_val].as<bool>();
        gfxAttr.stream = emsAttr[stream_val].as<uint32_t>();
        gfxAttr.isInstanced = emsAttr[isInstanced_val].as<bool>();
        gfxAttr.location = emsAttr[location_val].as<uint32_t>();
    }

    const auto& blocks = emsInfo[blocks_val];
    len = blocks[length_val].as<size_t>();
    const std::vector<val>& blocksVec = vecFromJSArray_local<val>(blocks);
    shaderInfo.blocks.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsBlock = blocksVec[i];
        auto& gfxBlock = shaderInfo.blocks[i];
        gfxBlock.set = emsBlock[set_val].as<uint32_t>();
        gfxBlock.binding = emsBlock[binding_val].as<uint32_t>();
        gfxBlock.name = emsBlock[name_val].as<std::string>();
        gfxBlock.count = emsBlock[count_val].as<uint32_t>();

        const auto& members = emsBlock[members_val];
        size_t size = members[length_val].as<size_t>();
        const std::vector<val>& membersVec = vecFromJSArray_local<val>(members);
        gfxBlock.members.resize(size);
        for (size_t j = 0; j < size; ++j) {
            const auto& emsMember = membersVec[j];
            auto& gfxMember = gfxBlock.members[j];
            gfxMember.name = emsMember[name_val].as<std::string>();
            gfxMember.type = Type{emsMember[type_val].as<uint32_t>()};
            gfxMember.count = emsMember[count_val].as<uint32_t>();
        }
    }

    const auto& buffers = emsInfo[buffers_val];
    len = buffers[length_val].as<size_t>();
    const std::vector<val>& buffersVec = vecFromJSArray_local<val>(buffers);
    shaderInfo.buffers.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsBuffer = buffersVec[i];
        auto& gfxBuffer = shaderInfo.buffers[i];
        gfxBuffer.set = emsBuffer[set_val].as<uint32_t>();
        gfxBuffer.binding = emsBuffer[binding_val].as<uint32_t>();
        gfxBuffer.name = emsBuffer[name_val].as<std::string>();
        gfxBuffer.count = emsBuffer[count_val].as<uint32_t>();
        gfxBuffer.memoryAccess = MemoryAccess{emsBuffer[memoryAccess_val].as<uint32_t>()};
    }

    const auto& samplerTextures = emsInfo[samplerTextures_val];
    len = samplerTextures[length_val].as<size_t>();
    const std::vector<val>& samplerTexturesVec = vecFromJSArray_local<val>(samplerTextures);
    shaderInfo.samplerTextures.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsSamplerTexture = samplerTexturesVec[i];
        auto& gfxSamplerTexture = shaderInfo.samplerTextures[i];
        gfxSamplerTexture.set = emsSamplerTexture[set_val].as<uint32_t>();
        gfxSamplerTexture.binding = emsSamplerTexture[binding_val].as<uint32_t>();
        gfxSamplerTexture.name = emsSamplerTexture[name_val].as<std::string>();
        gfxSamplerTexture.count = emsSamplerTexture[count_val].as<uint32_t>();
        gfxSamplerTexture.type = Type{emsSamplerTexture[type_val].as<uint32_t>()};
    }

    const auto& samplers = emsInfo[samplers_val];
    len = samplers[length_val].as<size_t>();
    const std::vector<val>& samplersVec = vecFromJSArray_local<val>(samplers);
    shaderInfo.samplers.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsSampler = samplersVec[i];
        auto& gfxSampler = shaderInfo.samplers[i];
        gfxSampler.set = emsSampler[set_val].as<uint32_t>();
        gfxSampler.binding = emsSampler[binding_val].as<uint32_t>();
        gfxSampler.name = emsSampler[name_val].as<std::string>();
        gfxSampler.count = emsSampler[count_val].as<uint32_t>();
    }

    const auto& textures = emsInfo[textures_val];
    len = textures[length_val].as<size_t>();
    const std::vector<val>& texturesVec = vecFromJSArray_local<val>(textures);
    shaderInfo.textures.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsTexture = texturesVec[i];
        auto& gfxTexture = shaderInfo.textures[i];
        gfxTexture.set = emsTexture[set_val].as<uint32_t>();
        gfxTexture.binding = emsTexture[binding_val].as<uint32_t>();
        gfxTexture.name = emsTexture[name_val].as<std::string>();
        gfxTexture.count = emsTexture[count_val].as<uint32_t>();
        gfxTexture.type = Type{emsTexture[type_val].as<uint32_t>()};
    }

    const auto& images = emsInfo[images_val];
    len = images[length_val].as<size_t>();
    const std::vector<val>& imagesVec = vecFromJSArray_local<val>(images);
    shaderInfo.images.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsImage = imagesVec[i];
        auto& gfxImage = shaderInfo.images[i];
        gfxImage.set = emsImage[set_val].as<uint32_t>();
        gfxImage.binding = emsImage[binding_val].as<uint32_t>();
        gfxImage.name = emsImage[name_val].as<std::string>();
        gfxImage.count = emsImage[count_val].as<uint32_t>();
        gfxImage.type = Type{emsImage[type_val].as<uint32_t>()};
        gfxImage.memoryAccess = MemoryAccess{emsImage[memoryAccess_val].as<uint32_t>()};
    }

    const auto& subpassInputs = emsInfo[subpassInputs_val];
    len = subpassInputs[length_val].as<size_t>();
    const std::vector<val>& subpassInputsVec = vecFromJSArray_local<val>(subpassInputs);
    shaderInfo.subpassInputs.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& emsSubpassInput = subpassInputsVec[i];
        auto& gfxSubpassInput = shaderInfo.subpassInputs[i];
        gfxSubpassInput.set = emsSubpassInput[set_val].as<uint32_t>();
        gfxSubpassInput.binding = emsSubpassInput[binding_val].as<uint32_t>();
        gfxSubpassInput.name = emsSubpassInput[name_val].as<std::string>();
        gfxSubpassInput.count = emsSubpassInput[count_val].as<uint32_t>();
    }

    auto* shader = new CCWGPUShader();
    // shader->initialize(shaderInfo);
    shader->initialize(shaderInfo, spirvs);
    return shader;
}

void CCWGPUDevice::initialize(const val& info) {
    CHECK_VOID(info);

    DeviceInfo deviceInfo;

    const auto& emsBindingMappingInfo = info[bindingMappingInfo_val];
    auto& gfxBindingMappingInfo = deviceInfo.bindingMappingInfo;

    gfxBindingMappingInfo.maxBlockCounts = std::move(convertJSArrayToNumberVector_local<uint32_t>(emsBindingMappingInfo[maxBlockCounts_val]));
    gfxBindingMappingInfo.maxSamplerTextureCounts = std::move(convertJSArrayToNumberVector_local<uint32_t>(emsBindingMappingInfo[maxSamplerTextureCounts_val]));
    gfxBindingMappingInfo.maxSamplerCounts = std::move(convertJSArrayToNumberVector_local<uint32_t>(emsBindingMappingInfo[maxSamplerCounts_val]));
    gfxBindingMappingInfo.maxTextureCounts = std::move(convertJSArrayToNumberVector_local<uint32_t>(emsBindingMappingInfo[maxTextureCounts_val]));
    gfxBindingMappingInfo.maxBufferCounts = std::move(convertJSArrayToNumberVector_local<uint32_t>(emsBindingMappingInfo[maxBufferCounts_val]));
    gfxBindingMappingInfo.maxImageCounts = std::move(convertJSArrayToNumberVector_local<uint32_t>(emsBindingMappingInfo[maxImageCounts_val]));
    gfxBindingMappingInfo.maxSubpassInputCounts = std::move(convertJSArrayToNumberVector_local<uint32_t>(emsBindingMappingInfo[maxSubpassInputCounts_val]));
    gfxBindingMappingInfo.setIndices = std::move(convertJSArrayToNumberVector_local<uint32_t>(emsBindingMappingInfo[setIndices_val]));

    CCWGPUDevice::getInstance()->initialize(deviceInfo);
}

Swapchain* CCWGPUDevice::createSwapchain(const val& info) {
    CHECK_PTR(info);

    SwapchainInfo swapchainInfo;

    // it's HTMLCanvasElement.
    // swapchainInfo.windowHandle = reinterpret_cast<void*>(info[windowHandle_val].as<uint32_t>());
    swapchainInfo.vsyncMode = VsyncMode{info[vsyncMode_val].as<uint32_t>()};
    swapchainInfo.width = info[width_val].as<uint32_t>();
    swapchainInfo.height = info[height_val].as<uint32_t>();

    return this->createSwapchain(swapchainInfo);
}

Texture* CCWGPUDevice::createTexture(const val& info) {
    CHECK_PTR(info);

    const auto& emsTex = info[texture_val];
    if (emsTex.isUndefined()) {
        // textureInfo
        TextureInfo textureInfo;
        textureInfo.type = TextureType{info[type_val].as<uint32_t>()};
        textureInfo.usage = TextureUsage{info[usage_val].as<uint32_t>()};
        textureInfo.format = Format{info[format_val].as<uint32_t>()};
        textureInfo.width = info[width_val].as<uint32_t>();
        textureInfo.height = info[height_val].as<uint32_t>();
        textureInfo.flags = TextureFlags{info[flags_val].as<uint32_t>()};
        textureInfo.layerCount = info[layerCount_val].as<uint32_t>();
        textureInfo.levelCount = info[levelCount_val].as<uint32_t>();
        textureInfo.samples = SampleCount{info[samples_val].as<uint32_t>()};
        textureInfo.depth = info[depth_val].as<uint32_t>();

        return this->createTexture(textureInfo);

    } else {
        // texViewInfo
        TextureViewInfo textureViewInfo;
        textureViewInfo.texture = info[texture_val].as<Texture*>(emscripten::allow_raw_pointers());
        textureViewInfo.type = TextureType{info[type_val].as<uint32_t>()};
        textureViewInfo.format = Format{info[format_val].as<uint32_t>()};
        textureViewInfo.layerCount = info[layerCount_val].as<uint32_t>();
        textureViewInfo.levelCount = info[levelCount_val].as<uint32_t>();
        textureViewInfo.baseLayer = info[baseLayer_val].as<uint32_t>();
        textureViewInfo.baseLevel = info[baseLevel_val].as<uint32_t>();

        return this->createTexture(textureViewInfo);
    }
}

Sampler* CCWGPUDevice::getSampler(const val& info) {
    CHECK_PTR(info);

    SamplerInfo samplerInfo;
    samplerInfo.minFilter = Filter{info[minFilter_val].as<uint32_t>()};
    samplerInfo.magFilter = Filter{info[magFilter_val].as<uint32_t>()};
    samplerInfo.mipFilter = Filter{info[mipFilter_val].as<uint32_t>()};
    samplerInfo.addressU = Address{info[addressU_val].as<uint32_t>()};
    samplerInfo.addressV = Address{info[addressV_val].as<uint32_t>()};
    samplerInfo.addressW = Address{info[addressW_val].as<uint32_t>()};
    samplerInfo.maxAnisotropy = info[maxAnisotropy_val].as<uint32_t>();
    samplerInfo.cmpFunc = ComparisonFunc{info[cmpFunc_val].as<uint32_t>()};

    return this->getSampler(samplerInfo);
}

RenderPass* CCWGPUDevice::createRenderPass(const val& info) {
    CHECK_PTR(info);
    return this->createRenderPass(fromEmsRenderPassInfo(info));
}

void CCWGPURenderPass::initialize(const val& info) {
    CHECK_VOID(info);
    this->initialize(fromEmsRenderPassInfo(info));
}

Framebuffer* CCWGPUDevice::createFramebuffer(const val& info) {
    CHECK_PTR(info);
    return this->createFramebuffer(fromEmsFramebufferInfo(info));
}

DescriptorSetLayout* CCWGPUDevice::createDescriptorSetLayout(const val& info) {
    CHECK_PTR(info);

    DescriptorSetLayoutInfo descriptorSetLayoutInfo;
    const auto& ems_bindings = info[bindings_val];
    const std::vector<val>& bindingsVec = vecFromJSArray_local<val>(ems_bindings);
    auto& bindings = descriptorSetLayoutInfo.bindings;
    size_t len = bindingsVec.size();
    bindings.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_dsbinding = bindingsVec[i];
        auto& dsbinding = bindings[i];
        ASSIGN_FROM_EMS(dsbinding, binding, descriptorType, count, stageFlags);

        const auto& ems_samplers = ems_dsbinding[immutableSamplers_val];
        auto& samplers = dsbinding.immutableSamplers;
        const std::vector<val>& samplersVec = vecFromJSArray_local<val>(ems_samplers);
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
    const auto& ems_buffer = info[buffer_val];
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

    const auto& ems_setLayouts = info[setLayouts_val];
    auto& setLayouts = pipelineLayoutInfo.setLayouts;
    const std::vector<val>& setLayoutsVec = vecFromJSArray_local<val>(ems_setLayouts);
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

    const auto& ems_vertexBuffers = info[vertexBuffers_val];
    auto& vertexBuffers = inputAssemblerInfo.vertexBuffers;
    const std::vector<val>& vertexBuffersVec = vecFromJSArray_local<val>(ems_vertexBuffers);
    size_t len = vertexBuffersVec.size();
    vertexBuffers.resize(len);
    for (size_t i = 0; i < len; ++i) {
        vertexBuffers[i] = vertexBuffersVec[i].as<Buffer*>(allow_raw_pointers());
    }
    // ASSIGN_FROM_EMSARRAY(inputAssemblerInfo, vertexBuffers);

    const auto& ems_attributes = info[attributes_val];
    auto& attributes = inputAssemblerInfo.attributes;
    const std::vector<val>& attributesVec = vecFromJSArray_local<val>(ems_attributes);
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
    const std::vector<val>& ems_swapchains = vecFromJSArray_local<val>(info);
    size_t len = ems_swapchains.size();
    swapchains.resize(len);
    for (size_t i = 0; i < len; ++i) {
        swapchains[i] = ems_swapchains[i].as<Swapchain*>(allow_raw_pointers());
    }
    return this->acquire(swapchains.data(), swapchains.size());
}

void CCWGPUCommandBuffer::updateBuffer(Buffer* buff, const emscripten::val& v, uint32_t size) {
    ccstd::vector<uint8_t> buffer = convertJSArrayToNumberVector_local<uint8_t>(v);
    updateBuffer(buff, reinterpret_cast<const void*>(buffer.data()), size);
}

void CCWGPUCommandBuffer::beginRenderPass(RenderPass* renderpass, Framebuffer* framebuffer, const emscripten::val& area, const emscripten::val& colors, float depth, uint32_t stencil) {
    const auto& ems_rect = area;
    Rect rect;
    ASSIGN_FROM_EMS(rect, width, height, x, y);

    ccstd::vector<Color> clearColors;
    const std::vector<val>& ems_clearColorsVec = vecFromJSArray_local<val>(colors);
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

    const auto& ems_inputState = info[inputState_val];
    const auto& ems_attrs = ems_inputState[attributes_val];
    auto& attributes = pipelineStateInfo.inputState.attributes;
    const std::vector<val>& attributesVec = vecFromJSArray_local<val>(ems_attrs);
    size_t len = attributesVec.size();
    attributes.resize(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_attr = attributesVec[i];
        auto& attr = attributes[i];
        ASSIGN_FROM_EMS(attr, name, format, isNormalized, stream, isInstanced, location);
    }

    const auto& ems_rasterizerState = info[rasterizerState_val];
    auto& rasterizerState = pipelineStateInfo.rasterizerState;
    ASSIGN_FROM_EMS(rasterizerState, isDiscard, polygonMode, shadeModel, cullMode, isFrontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop, isDepthClip, isMultisample, lineWidth);

    const auto& ems_depthStencilState = info[depthStencilState_val];
    auto& depthStencilState = pipelineStateInfo.depthStencilState;
    ASSIGN_FROM_EMS(depthStencilState, depthTest, depthWrite, depthFunc, stencilTestFront, stencilFuncFront, stencilReadMaskFront, stencilWriteMaskFront, stencilFailOpFront, stencilZFailOpFront,
                    stencilPassOpFront, stencilRefFront, stencilTestBack, stencilFuncBack, stencilReadMaskBack, stencilWriteMaskBack, stencilFailOpBack, stencilZFailOpBack, stencilPassOpBack, stencilRefBack);

    const auto& ems_blendState = info[blendState_val];
    auto& blendState = pipelineStateInfo.blendState;
    ASSIGN_FROM_EMS(blendState, isA2C, isIndepend);
    const auto& ems_blendColor = ems_blendState[blendColor_val];
    auto& blendColor = blendState.blendColor;
    ASSIGN_FROM_EMS(blendColor, x, y, z, w);
    const auto& ems_targets = ems_blendState[targets_val];
    auto& targets = blendState.targets;
    const std::vector<val>& targetsVec = vecFromJSArray_local<val>(ems_targets);
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

emscripten::val CCWGPUInputAssembler::getEMSVertexBuffers() const {
    auto arr = val::array();
    const auto& vertexBuffers = _vertexBuffers;
    for (size_t i = 0; i < vertexBuffers.size(); ++i) {
        const auto& vertexBuffer = static_cast<CCWGPUBuffer*>(vertexBuffers[i]);
        arr.set(i, vertexBuffer);
    }
    return arr;
}

CCWGPUBuffer* CCWGPUInputAssembler::getEMSIndexBuffer() const {
    return static_cast<CCWGPUBuffer*>(_indexBuffer);
}

CCWGPUBuffer* CCWGPUInputAssembler::getEMSIndirectBuffer() const {
    return static_cast<CCWGPUBuffer*>(_indirectBuffer);
}

uint32_t CCWGPUBuffer::getBufferUsage() const {
    return static_cast<uint32_t>(_usage);
}

uint32_t CCWGPUBuffer::getBufferMemUsage() const {
    return static_cast<uint32_t>(_memUsage);
}

uint32_t CCWGPUBuffer::getBufferFlags() const {
    return static_cast<uint32_t>(_flags);
}

val CCWGPUDescriptorSetLayout::getDSLayoutBindings() const {
    auto arr = val::array();
    const auto& bindings = _bindings;
    for (size_t i = 0; i < bindings.size(); ++i) {
        const auto& gfxbinding = bindings[i];
        auto ems_gfxbinding = val::object();
        SET_TO_EMS(gfxbinding, binding, descriptorType, count, stageFlags);
        auto samplers = val::array();
        for (size_t j = 0; j < gfxbinding.immutableSamplers.size(); ++j) {
            samplers.set(j, static_cast<CCWGPUSampler*>(gfxbinding.immutableSamplers[j]));
        }
        ems_gfxbinding.set("immutableSamplers", samplers);
        arr.set(i, ems_gfxbinding);
    }
    return arr;
}

val CCWGPUDescriptorSetLayout::getDSLayoutBindingIndices() const {
    return vecToEMS<uint32_t>(_bindingIndices);
}

val CCWGPUDescriptorSetLayout::getDSLayoutIndices() const {
    return vecToEMS<uint32_t>(_descriptorIndices);
}

void CCWGPUQueue::submit(const val& info) {
    ccstd::vector<CommandBuffer*> cmdBuffs;
    const std::vector<val>& ems_cmdBuffs = vecFromJSArray_local<val>(info);
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
    const auto& data = convertJSArrayToNumberVector_local<uint32_t>(dynamicOffsets);
    return this->bindDescriptorSet(set, descriptorSet, data.size(), data.data());
}

void CCWGPUCommandBuffer::draw(const val& info) {
    CHECK_VOID(info);

    if (!info[update_val].isUndefined()) {
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

    const auto& regions = vecFromJSArray_local<val>(vals);
    size_t len = regions.size();
    ccstd::vector<BufferTextureCopy> copies(len);
    for (size_t i = 0; i < len; ++i) {
        const auto& ems_copy = regions[i];
        auto& copy = copies[i];
        ASSIGN_FROM_EMS(copy, buffOffset, buffStride, buffTexHeight);
        const auto& ems_texOffset = ems_copy[texOffset_val];
        auto& texOffset = copy.texOffset;
        ASSIGN_FROM_EMS(texOffset, x, y, z);
        const auto& ems_texExtent = ems_copy[texExtent_val];
        auto& texExtent = copy.texExtent;
        ASSIGN_FROM_EMS(texExtent, width, height, depth);
        const auto& ems_texSubres = ems_copy[texSubres_val];
        auto& texSubres = copy.texSubres;
        ASSIGN_FROM_EMS(texSubres, mipLevel, baseArrayLayer, layerCount);
    }

    len = v[length_val].as<unsigned>();
    std::vector<std::vector<uint8_t>> lifeProlonger(len);
    std::vector<const uint8_t*> buffers;
    for (size_t i = 0; i < len; i++) {
        lifeProlonger[i] = EMSArraysToU8Vec(v, i);
        buffers.push_back(lifeProlonger[i].data());
    }

    return copyBuffersToTexture(buffers.data(), dst, copies.data(), copies.size());
}

val CCWGPUTexture::getTextureInfo() const {
    const auto& info = _info;
    val ems_info = val::object();
    SET_TO_EMS(info, type, usage, format, width, height, flags, layerCount, levelCount, samples, depth);
    ems_info.set("externalRes", reinterpret_cast<uintptr_t>(info.externalRes));
    return ems_info;
};
val CCWGPUTexture::getTextureViewInfo() const {
    const auto& viewInfo = _viewInfo;
    val ems_viewInfo = val::object();
    SET_TO_EMS(viewInfo, type, format, baseLevel, levelCount, baseLayer, layerCount);
    ems_viewInfo.set("texture", static_cast<CCWGPUTexture*>(viewInfo.texture));
    return ems_viewInfo;
};

void CCWGPUFramebuffer::initialize(const val& info) {
    CHECK_VOID(info);

    return this->initialize(fromEmsFramebufferInfo(info));
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
