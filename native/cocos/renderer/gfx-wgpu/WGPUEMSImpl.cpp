#pragma once
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <boost/core/span.hpp>
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

template <typename T, typename EnumFallBack = void>
struct GetType {
    using type = T;
};

template <typename T>
struct GetType<T, typename std::enable_if<std::is_enum<T>::value>::type> {
    using type = typename std::underlying_type<T>::type;
};

template <typename T>
struct EMSCachedArrayAllocator {
    EMSCachedArrayAllocator() {
        offset = 0;
    }

    auto vecFromJSArray_local(const val& v) {
        const size_t l = v[length_val].as<size_t>();
        auto test = v[0].as<T>();

        std::vector<T>& rv = vec;
        uint32_t upperBound = l + offset;
        if (rv.size() < upperBound) {
            rv.resize(upperBound);
        }
        for (size_t i = 0; i < l; ++i) {
            rv[i + offset] = v[i].as<T>();
        }

        auto oldOffset = offset;
        offset = upperBound;

        struct Ret {
            size_t offset;
            size_t length;
        };
        return Ret{oldOffset, l};
    }

    // invalid after resize
    auto getMaybeInvalidVecView(uint32_t offset, uint32_t length) {
        boost::span<T> vecView(vec.data() + offset, length);
        return vecView;
    }

private:
    thread_local static std::vector<T> vec;
    thread_local static uint32_t offset;
};

template <typename T>
thread_local uint32_t EMSCachedArrayAllocator<T>::offset = 0;

template <typename T>
thread_local std::vector<T> EMSCachedArrayAllocator<T>::vec;

template <typename T, typename En = typename std::enable_if<std::is_arithmetic<typename GetType<T>::type>::value>::type>
struct EMSCachedNumbersAllocator {
    EMSCachedNumbersAllocator() {
        offset = 0;
    }

    auto convertJSArrayToNumberVector_local(const val& v) {
        const size_t l = v[length_val].as<size_t>();

        uint32_t upperBound = l + offset;
        std::vector<T>& rv = vec;
        if (rv.size() < upperBound) {
            rv.resize(upperBound);
        }

        // Copy the array into our vector through the use of typed arrays.
        // It will try to convert each element through Number().
        // See https://www.ecma-international.org/ecma-262/6.0/#sec-%typedarray%.prototype.set-array-offset
        // and https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
        val memoryView{emscripten::typed_memory_view(l, rv.data() + offset)};
        memoryView.call<void>("set", v);

        auto oldOffset = offset;
        offset += l;

        struct Ret {
            size_t offset;
            size_t length;
        };
        return Ret{oldOffset, l};
    }

    // invalid after resize
    auto getMaybeInvalidVecView(uint32_t offset, uint32_t length) {
        boost::span<T> vecView(vec.data() + offset, length);
        return vecView;
    }

private:
    thread_local static std::vector<T> vec;
    thread_local static uint32_t offset;
};
template <typename T, typename En>
thread_local uint32_t EMSCachedNumbersAllocator<T, En>::offset = 0;

template <typename T, typename En>
thread_local std::vector<T> EMSCachedNumbersAllocator<T, En>::vec;

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

#define ASSIGN_VEC_BY_SEQ(r, obj, property)                                                                                                                    \
    {                                                                                                                                                          \
        const auto& [vecOffset, len] = allocator.convertJSArrayToNumberVector_local<decltype(obj.property)::value_type>(ems_##obj[BOOST_STRINGIZE(property)]); \
        auto vecView = allocator.getMaybeInvalidVecView(vecOffset, len);                                                                                       \
        obj.property.assign(vecView.begin(), vecView.begin() + len);                                                                                           \
    }

// #define ASSIGN_FROM_EMSARRAY(obj, ...)                                                        \
//     {                                                                                         \
//         BOOST_PP_SEQ_FOR_EACH(ASSIGN_VEC_BY_SEQ, obj, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
//     }

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

template <typename T>
void assignFromEmsArray(std::vector<T>& vec, const val emsVal, EMSCachedNumbersAllocator<T>& allocator) {
    const auto& [emsVecOffset, len] = allocator.convertJSArrayToNumberVector_local(emsVal);
    auto vecView = allocator.getMaybeInvalidVecView(emsVecOffset, len);
    vec.assign(vecView.begin(), vecView.end());
};

Shader* CCWGPUDevice::createShader(const val& emsInfo) {
    CHECK_PTR(emsInfo);

    EMSCachedArrayAllocator<val> val_allocator;
    EMSCachedNumbersAllocator<uint32_t> uint32_allocator;
    ShaderInfo shaderInfo;
    shaderInfo.name = emsInfo[name_val].as<std::string>();
    const auto& stages = emsInfo[stages_val];
    const auto& [stagesValOffset, stagesVecLen] = val_allocator.vecFromJSArray_local(stages);
    shaderInfo.stages.resize(stagesVecLen);
    std::vector<std::vector<uint32_t>> spirvs;
    for (size_t i = 0; i < stagesVecLen; ++i) {
        const auto& emsStage = val_allocator.getMaybeInvalidVecView(stagesValOffset, stagesVecLen)[i];
        auto& gfxStage = shaderInfo.stages[i];
        gfxStage.stage = ShaderStageFlags{emsStage[stage_val].as<uint32_t>()};
        gfxStage.source = emsStage[source_val].as<std::string>();
        const auto& [spvdataOffsetOffset, len] = uint32_allocator.convertJSArrayToNumberVector_local(emsStage[spvData_val]);
        auto spvDataView = uint32_allocator.getMaybeInvalidVecView(spvdataOffsetOffset, len);
        std::vector<uint32_t> spirv(spvDataView.begin(), spvDataView.end());
        spirvs.emplace_back(std::move(spirv));
    }

    const auto& attrs = emsInfo[attributes_val];
    const auto& [attrsVecOffset, attrsVecLen] = val_allocator.vecFromJSArray_local(attrs);
    shaderInfo.attributes.resize(attrsVecLen);
    for (size_t i = 0; i < attrsVecLen; ++i) {
        const auto& emsAttr = val_allocator.getMaybeInvalidVecView(attrsVecOffset, attrsVecLen)[i];
        auto& gfxAttr = shaderInfo.attributes[i];
        gfxAttr.name = emsAttr[name_val].as<std::string>();
        gfxAttr.format = Format{emsAttr[format_val].as<uint32_t>()};
        gfxAttr.isNormalized = emsAttr[isNormalized_val].as<bool>();
        gfxAttr.stream = emsAttr[stream_val].as<uint32_t>();
        gfxAttr.isInstanced = emsAttr[isInstanced_val].as<bool>();
        gfxAttr.location = emsAttr[location_val].as<uint32_t>();
    }

    const auto& blocks = emsInfo[blocks_val];
    const auto& [blocksVecOffset, blocksVecLen] = val_allocator.vecFromJSArray_local(blocks);
    shaderInfo.blocks.resize(blocksVecLen);
    for (size_t i = 0; i < blocksVecLen; ++i) {
        const auto& emsBlock = val_allocator.getMaybeInvalidVecView(blocksVecOffset, blocksVecLen)[i];
        auto& gfxBlock = shaderInfo.blocks[i];
        gfxBlock.set = emsBlock[set_val].as<uint32_t>();
        gfxBlock.binding = emsBlock[binding_val].as<uint32_t>();
        gfxBlock.name = emsBlock[name_val].as<std::string>();
        gfxBlock.count = emsBlock[count_val].as<uint32_t>();

        const auto& members = emsBlock[members_val];
        const auto& [membersVecOffset, membersVecLen] = val_allocator.vecFromJSArray_local(members);
        gfxBlock.members.resize(membersVecLen);
        for (size_t j = 0; j < membersVecLen; ++j) {
            const auto& emsMember = val_allocator.getMaybeInvalidVecView(membersVecOffset, membersVecLen)[j];
            auto& gfxMember = gfxBlock.members[j];
            gfxMember.name = emsMember[name_val].as<std::string>();
            gfxMember.type = Type{emsMember[type_val].as<uint32_t>()};
            gfxMember.count = emsMember[count_val].as<uint32_t>();
        }
    }

    const auto& buffers = emsInfo[buffers_val];
    const auto& [buffersVecOffset, buffersVecLen] = val_allocator.vecFromJSArray_local(buffers);
    shaderInfo.buffers.resize(buffersVecLen);
    for (size_t i = 0; i < buffersVecLen; ++i) {
        const auto& emsBuffer = val_allocator.getMaybeInvalidVecView(buffersVecOffset, buffersVecLen)[i];
        auto& gfxBuffer = shaderInfo.buffers[i];
        gfxBuffer.set = emsBuffer[set_val].as<uint32_t>();
        gfxBuffer.binding = emsBuffer[binding_val].as<uint32_t>();
        gfxBuffer.name = emsBuffer[name_val].as<std::string>();
        gfxBuffer.count = emsBuffer[count_val].as<uint32_t>();
        gfxBuffer.memoryAccess = MemoryAccess{emsBuffer[memoryAccess_val].as<uint32_t>()};
    }

    const auto& samplerTextures = emsInfo[samplerTextures_val];
    const auto& [samplerTexturesVecOffset, samplerTexturesVecLen] = val_allocator.vecFromJSArray_local(samplerTextures);
    shaderInfo.samplerTextures.resize(samplerTexturesVecLen);
    for (size_t i = 0; i < samplerTexturesVecLen; ++i) {
        const auto& emsSamplerTexture = val_allocator.getMaybeInvalidVecView(samplerTexturesVecOffset, samplerTexturesVecLen)[i];
        auto& gfxSamplerTexture = shaderInfo.samplerTextures[i];
        gfxSamplerTexture.set = emsSamplerTexture[set_val].as<uint32_t>();
        gfxSamplerTexture.binding = emsSamplerTexture[binding_val].as<uint32_t>();
        gfxSamplerTexture.name = emsSamplerTexture[name_val].as<std::string>();
        gfxSamplerTexture.count = emsSamplerTexture[count_val].as<uint32_t>();
        gfxSamplerTexture.type = Type{emsSamplerTexture[type_val].as<uint32_t>()};
    }

    const auto& samplers = emsInfo[samplers_val];
    const auto& [samplersVecOffset, samplersVecLen] = val_allocator.vecFromJSArray_local(samplers);
    shaderInfo.samplers.resize(samplersVecLen);
    for (size_t i = 0; i < samplersVecLen; ++i) {
        const auto& emsSampler = val_allocator.getMaybeInvalidVecView(samplersVecOffset, samplersVecLen)[i];
        auto& gfxSampler = shaderInfo.samplers[i];
        gfxSampler.set = emsSampler[set_val].as<uint32_t>();
        gfxSampler.binding = emsSampler[binding_val].as<uint32_t>();
        gfxSampler.name = emsSampler[name_val].as<std::string>();
        gfxSampler.count = emsSampler[count_val].as<uint32_t>();
    }

    const auto& textures = emsInfo[textures_val];
    const auto& [texturesVecOffset, texturesVecLen] = val_allocator.vecFromJSArray_local(textures);
    shaderInfo.textures.resize(texturesVecLen);
    for (size_t i = 0; i < texturesVecLen; ++i) {
        const auto& emsTexture = val_allocator.getMaybeInvalidVecView(texturesVecOffset, texturesVecLen)[i];
        auto& gfxTexture = shaderInfo.textures[i];
        gfxTexture.set = emsTexture[set_val].as<uint32_t>();
        gfxTexture.binding = emsTexture[binding_val].as<uint32_t>();
        gfxTexture.name = emsTexture[name_val].as<std::string>();
        gfxTexture.count = emsTexture[count_val].as<uint32_t>();
        gfxTexture.type = Type{emsTexture[type_val].as<uint32_t>()};
    }

    const auto& images = emsInfo[images_val];
    const auto& [imagesVecOffset, imagesVecLen] = val_allocator.vecFromJSArray_local(images);
    shaderInfo.images.resize(imagesVecLen);
    for (size_t i = 0; i < imagesVecLen; ++i) {
        const auto& emsImage = val_allocator.getMaybeInvalidVecView(imagesVecOffset, imagesVecLen)[i];
        auto& gfxImage = shaderInfo.images[i];
        gfxImage.set = emsImage[set_val].as<uint32_t>();
        gfxImage.binding = emsImage[binding_val].as<uint32_t>();
        gfxImage.name = emsImage[name_val].as<std::string>();
        gfxImage.count = emsImage[count_val].as<uint32_t>();
        gfxImage.type = Type{emsImage[type_val].as<uint32_t>()};
        gfxImage.memoryAccess = MemoryAccess{emsImage[memoryAccess_val].as<uint32_t>()};
    }

    const auto& subpassInputs = emsInfo[subpassInputs_val];
    const auto& [subpassInputsVecOffset, subpassInputsVecLen] = val_allocator.vecFromJSArray_local(subpassInputs);
    shaderInfo.subpassInputs.resize(subpassInputsVecLen);
    for (size_t i = 0; i < subpassInputsVecLen; ++i) {
        const auto& emsSubpassInput = val_allocator.getMaybeInvalidVecView(subpassInputsVecOffset, subpassInputsVecLen)[i];
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

    const auto& emsInfo = info[bindingMappingInfo_val];
    auto& gfxInfo = deviceInfo.bindingMappingInfo;
    EMSCachedNumbersAllocator<uint32_t> allocator;
    assignFromEmsArray(gfxInfo.maxBlockCounts, emsInfo[maxBlockCounts_val], allocator);
    assignFromEmsArray(gfxInfo.maxSamplerTextureCounts, emsInfo[maxSamplerTextureCounts_val], allocator);
    assignFromEmsArray(gfxInfo.maxSamplerCounts, emsInfo[maxSamplerCounts_val], allocator);
    assignFromEmsArray(gfxInfo.maxTextureCounts, emsInfo[maxTextureCounts_val], allocator);
    assignFromEmsArray(gfxInfo.maxBufferCounts, emsInfo[maxBufferCounts_val], allocator);
    assignFromEmsArray(gfxInfo.maxImageCounts, emsInfo[maxImageCounts_val], allocator);
    assignFromEmsArray(gfxInfo.maxSubpassInputCounts, emsInfo[maxSubpassInputCounts_val], allocator);
    assignFromEmsArray(gfxInfo.setIndices, emsInfo[setIndices_val], allocator);

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

    EMSCachedArrayAllocator<val> allocator;
    EMSCachedNumbersAllocator<uint32_t> uint32_allocator;
    RenderPassInfo renderPassInfo;
    const auto& emsColors = info[colorAttachments_val];
    const auto& [colorsVecOffset, len] = allocator.vecFromJSArray_local(emsColors);
    auto& gfxColors = renderPassInfo.colorAttachments;
    gfxColors.resize(len);
    for (size_t i = 0; i < len; ++i) {
        auto colorsVec = allocator.getMaybeInvalidVecView(colorsVecOffset, len);
        gfxColors[i].format = Format{colorsVec[i][format_val].as<uint32_t>()};
        gfxColors[i].sampleCount = SampleCount{colorsVec[i][sampleCount_val].as<uint32_t>()};
        gfxColors[i].loadOp = LoadOp{colorsVec[i][loadOp_val].as<uint32_t>()};
        gfxColors[i].storeOp = StoreOp{colorsVec[i][storeOp_val].as<uint32_t>()};
        gfxColors[i].barrier = colorsVec[i][barrier_val].as<WGPUGeneralBarrier*>(allow_raw_pointers());
        gfxColors[i].isGeneralLayout = colorsVec[i][isGeneralLayout_val].as<bool>();
    }

    const auto& ems_depthStencil = info[depthStencilAttachment_val];
    auto& depthStencil = renderPassInfo.depthStencilAttachment;

    ASSIGN_FROM_EMS(depthStencil, format, sampleCount, depthLoadOp, depthStoreOp, stencilLoadOp, stencilStoreOp, isGeneralLayout);

    const auto& emsSubpasses = info[subpasses_val];
    const auto& [subpassesVecOffset, subpassesVecLen] = allocator.vecFromJSArray_local(emsSubpasses);
    auto& gfxSubpasses = renderPassInfo.subpasses;
    gfxSubpasses.resize(subpassesVecLen);
    for (size_t i = 0; i < subpassesVecLen; ++i) {
        auto subpassesVec = allocator.getMaybeInvalidVecView(subpassesVecOffset, subpassesVecLen);
        const auto& ems_subpass = subpassesVec[i];
        auto& subpass = gfxSubpasses[i];
        assignFromEmsArray(subpass.inputs, ems_subpass[inputs_val], uint32_allocator);
        assignFromEmsArray(subpass.colors, ems_subpass[colors_val], uint32_allocator);
        assignFromEmsArray(subpass.resolves, ems_subpass[resolves_val], uint32_allocator);
        assignFromEmsArray(subpass.preserves, ems_subpass[preserves_val], uint32_allocator);
        ASSIGN_FROM_EMS(subpass, depthStencil, depthStencilResolve, depthResolveMode, stencilResolveMode);
    }

    const auto& emsDependencies = info[dependencies_val];
    const auto& [dependenciesVecOffset, dependenciesVecLen] = allocator.vecFromJSArray_local(emsDependencies);
    auto& gfxDependencies = renderPassInfo.dependencies;
    gfxDependencies.resize(dependenciesVecLen);
    for (size_t i = 0; i < dependenciesVecLen; ++i) {
        const auto& ems_dependency = allocator.getMaybeInvalidVecView(dependenciesVecOffset, dependenciesVecLen)[i];
        auto& dependency = gfxDependencies[i];
        ASSIGN_FROM_EMS(dependency, srcSubpass, dstSubpass, generalBarrier, bufferBarriers, buffers, bufferBarrierCount, textureBarriers, textures, textureBarrierCount);
    }

    return this->createRenderPass(renderPassInfo);
}

void CCWGPURenderPass::initialize(const val& info) {
    CHECK_VOID(info);

    EMSCachedArrayAllocator<val> allocator;
    EMSCachedNumbersAllocator<uint32_t> uint32_allocator;
    RenderPassInfo renderPassInfo;
    const auto& emsColors = info[colorAttachments_val];
    const auto& [colorsVecOffset, len] = allocator.vecFromJSArray_local(emsColors);
    auto& gfxColors = renderPassInfo.colorAttachments;
    gfxColors.resize(len);
    for (size_t i = 0; i < len; ++i) {
        auto colorsVec = allocator.getMaybeInvalidVecView(colorsVecOffset, len);
        gfxColors[i].format = Format{colorsVec[i][format_val].as<uint32_t>()};
        gfxColors[i].sampleCount = SampleCount{colorsVec[i][sampleCount_val].as<uint32_t>()};
        gfxColors[i].loadOp = LoadOp{colorsVec[i][loadOp_val].as<uint32_t>()};
        gfxColors[i].storeOp = StoreOp{colorsVec[i][storeOp_val].as<uint32_t>()};
        gfxColors[i].barrier = colorsVec[i][barrier_val].as<WGPUGeneralBarrier*>(allow_raw_pointers());
        gfxColors[i].isGeneralLayout = colorsVec[i][isGeneralLayout_val].as<bool>();
    }

    const auto& ems_depthStencil = info[depthStencilAttachment_val];
    auto& depthStencil = renderPassInfo.depthStencilAttachment;

    ASSIGN_FROM_EMS(depthStencil, format, sampleCount, depthLoadOp, depthStoreOp, stencilLoadOp, stencilStoreOp, isGeneralLayout);

    const auto& emsSubpasses = info[subpasses_val];
    const auto& [subpassesVecOffset, subpassesVecLen] = allocator.vecFromJSArray_local(emsSubpasses);
    auto& gfxSubpasses = renderPassInfo.subpasses;
    gfxSubpasses.resize(subpassesVecLen);
    for (size_t i = 0; i < subpassesVecLen; ++i) {
        // dangerous, what we get by getMaybeInvalidVecView might be invalid after assignFromEmsArray
        // so pay attention to the order of assignFromEmsArray and getMaybeInvalidVecView
        // and do not reuse the result of getMaybeInvalidVecView again after assignFromEmsArray
        const auto& ems_subpass = allocator.getMaybeInvalidVecView(subpassesVecOffset, subpassesVecLen)[i];
        auto& subpass = gfxSubpasses[i];
        assignFromEmsArray(subpass.inputs, ems_subpass[inputs_val], uint32_allocator);
        assignFromEmsArray(subpass.colors, ems_subpass[colors_val], uint32_allocator);
        assignFromEmsArray(subpass.resolves, ems_subpass[resolves_val], uint32_allocator);
        assignFromEmsArray(subpass.preserves, ems_subpass[preserves_val], uint32_allocator);
        ASSIGN_FROM_EMS(subpass, depthStencil, depthStencilResolve, depthResolveMode, stencilResolveMode);
    }

    const auto& emsDependencies = info[dependencies_val];
    const auto& [dependenciesVecOffset, dependenciesVecLen] = allocator.vecFromJSArray_local(emsDependencies);
    auto& gfxDependencies = renderPassInfo.dependencies;
    gfxDependencies.resize(dependenciesVecLen);
    for (size_t i = 0; i < dependenciesVecLen; ++i) {
        const auto& ems_dependency = allocator.getMaybeInvalidVecView(dependenciesVecOffset, dependenciesVecLen)[i];
        auto& dependency = gfxDependencies[i];
        ASSIGN_FROM_EMS(dependency, srcSubpass, dstSubpass, generalBarrier, bufferBarriers, buffers, bufferBarrierCount, textureBarriers, textures, textureBarrierCount);
    }
    this->initialize(renderPassInfo);
}

Framebuffer* CCWGPUDevice::createFramebuffer(const val& info) {
    CHECK_PTR(info);

    EMSCachedArrayAllocator<val> allocator;
    FramebufferInfo frameBufferInfo;
    const auto& ems_frameBufferInfo = info;
    ASSIGN_FROM_EMS(frameBufferInfo, renderPass, depthStencilTexture);

    const auto& ems_colorTextures = info[colorTextures_val];
    if (!ems_colorTextures.isUndefined() || !ems_colorTextures.isNull()) {
        const auto& [colorTexturesVecOffset, len] = allocator.vecFromJSArray_local(ems_colorTextures);
        auto& gfxColorTextures = frameBufferInfo.colorTextures;
        gfxColorTextures.resize(len);
        for (size_t i = 0; i < len; ++i) {
            auto colorTexturesVec = allocator.getMaybeInvalidVecView(colorTexturesVecOffset, len);
            gfxColorTextures[i] = colorTexturesVec[i].as<Texture*>(allow_raw_pointers());
        }
    }

    return this->createFramebuffer(frameBufferInfo);
}

DescriptorSetLayout* CCWGPUDevice::createDescriptorSetLayout(const val& info) {
    CHECK_PTR(info);

    EMSCachedArrayAllocator<val> allocator;
    DescriptorSetLayoutInfo descriptorSetLayoutInfo;
    const auto& ems_bindings = info[bindings_val];
    const auto& [bindingsVecOffset, bindingsVecLen] = allocator.vecFromJSArray_local(ems_bindings);
    auto& bindings = descriptorSetLayoutInfo.bindings;
    bindings.resize(bindingsVecLen);
    for (size_t i = 0; i < bindingsVecLen; ++i) {
        const auto& ems_dsbinding = allocator.getMaybeInvalidVecView(bindingsVecOffset, bindingsVecLen)[i];
        auto& dsbinding = bindings[i];
        ASSIGN_FROM_EMS(dsbinding, binding, descriptorType, count, stageFlags);

        const auto& ems_samplers = ems_dsbinding[immutableSamplers_val];
        auto& samplers = dsbinding.immutableSamplers;
        const auto& [samplersVecOffset, samplersVecLen] = allocator.vecFromJSArray_local(ems_samplers);
        samplers.resize(samplersVecLen);
        for (size_t j = 0; j < samplersVecLen; ++j) {
            auto samplersVec = allocator.getMaybeInvalidVecView(samplersVecOffset, samplersVecLen);
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

    EMSCachedArrayAllocator<val> allocator;
    const auto& ems_setLayouts = info[setLayouts_val];
    auto& setLayouts = pipelineLayoutInfo.setLayouts;
    const auto& [setLayoutsVecOffset, setLayoutsVecLen] = allocator.vecFromJSArray_local(ems_setLayouts);
    setLayouts.resize(setLayoutsVecLen);
    for (size_t i = 0; i < setLayoutsVecLen; ++i) {
        auto setLayoutsVec = allocator.getMaybeInvalidVecView(setLayoutsVecOffset, setLayoutsVecLen);
        setLayouts[i] = setLayoutsVec[i].as<DescriptorSetLayout*>(allow_raw_pointers());
    }

    return this->createPipelineLayout(pipelineLayoutInfo);
}

InputAssembler* CCWGPUDevice::createInputAssembler(const val& info) {
    CHECK_PTR(info);
    EMSCachedArrayAllocator<val> allocator;

    InputAssemblerInfo inputAssemblerInfo;
    const auto& ems_inputAssemblerInfo = info;
    ASSIGN_FROM_EMS(inputAssemblerInfo, indexBuffer, indirectBuffer);

    const auto& ems_vertexBuffers = info[vertexBuffers_val];
    auto& vertexBuffers = inputAssemblerInfo.vertexBuffers;
    const auto& [vertexBuffersVecOffset, vertexBuffersVecLen] = allocator.vecFromJSArray_local(ems_vertexBuffers);
    vertexBuffers.resize(vertexBuffersVecLen);
    for (size_t i = 0; i < vertexBuffersVecLen; ++i) {
        auto vertexBuffersVec = allocator.getMaybeInvalidVecView(vertexBuffersVecOffset, vertexBuffersVecLen);
        vertexBuffers[i] = vertexBuffersVec[i].as<Buffer*>(allow_raw_pointers());
    }
    // ASSIGN_FROM_EMSARRAY(inputAssemblerInfo, vertexBuffers);

    const auto& ems_attributes = info[attributes_val];
    auto& attributes = inputAssemblerInfo.attributes;
    const auto& [attributesVecOffset, attributesVecLen] = allocator.vecFromJSArray_local(ems_attributes);
    attributes.resize(attributesVecLen);
    for (size_t i = 0; i < attributesVecLen; ++i) {
        auto attributesVec = allocator.getMaybeInvalidVecView(attributesVecOffset, attributesVecLen);
        const auto& ems_attr = attributesVec[i];
        auto& attr = attributes[i];
        ASSIGN_FROM_EMS(attr, name, format, isNormalized, stream, isInstanced, location);
    }

    return this->createInputAssembler(inputAssemblerInfo);
}

void CCWGPUDevice::acquire(const val& info) {
    CHECK_VOID(info);

    EMSCachedArrayAllocator<val> allocator;
    ccstd::vector<Swapchain*> swapchains;
    const auto& [ems_swapchainsOffset, len] = allocator.vecFromJSArray_local(info);
    swapchains.resize(len);
    for (size_t i = 0; i < len; ++i) {
        auto ems_swapchains = allocator.getMaybeInvalidVecView(ems_swapchainsOffset, len);
        swapchains[i] = ems_swapchains[i].as<Swapchain*>(allow_raw_pointers());
    }
    return this->acquire(swapchains.data(), swapchains.size());
}

void CCWGPUCommandBuffer::updateBuffer(Buffer* buff, const emscripten::val& v, uint32_t size) {
    EMSCachedNumbersAllocator<uint8_t> uint8_allocator;
    const auto& [vecOffset, len] = uint8_allocator.convertJSArrayToNumberVector_local(v);
    auto vecView = uint8_allocator.getMaybeInvalidVecView(vecOffset, len);
    updateBuffer(buff, vecView.data(), size);
}

void CCWGPUCommandBuffer::beginRenderPass(RenderPass* renderpass, Framebuffer* framebuffer, const emscripten::val& area, const emscripten::val& colors, float depth, uint32_t stencil) {
    EMSCachedArrayAllocator<val> allocator;
    const auto& ems_rect = area;
    Rect rect;
    ASSIGN_FROM_EMS(rect, width, height, x, y);

    ccstd::vector<Color> clearColors;
    const auto& [ems_clearColorsVecOffset, len] = allocator.vecFromJSArray_local(colors);
    clearColors.resize(len);
    for (size_t i = 0; i < len; ++i) {
        auto ems_clearColorsVec = allocator.getMaybeInvalidVecView(ems_clearColorsVecOffset, len);
        const auto& ems_color = ems_clearColorsVec[i];
        auto& color = clearColors[i];
        ASSIGN_FROM_EMS(color, x, y, z, w);
    }

    return this->beginRenderPass(renderpass, framebuffer, rect, clearColors, depth, stencil);
}

PipelineState* CCWGPUDevice::createPipelineState(const emscripten::val& info) {
    CHECK_PTR(info);
    EMSCachedArrayAllocator<val> allocator;
    PipelineStateInfo pipelineStateInfo;
    const auto& ems_pipelineStateInfo = info;
    ASSIGN_FROM_EMS(pipelineStateInfo, shader, pipelineLayout, renderPass, primitive, dynamicStates, bindPoint);

    const auto& ems_inputState = info[inputState_val];
    const auto& ems_attrs = ems_inputState[attributes_val];
    auto& attributes = pipelineStateInfo.inputState.attributes;
    const auto& [attributesVecOffset, attributesVecLen] = allocator.vecFromJSArray_local(ems_attrs);
    attributes.resize(attributesVecLen);
    for (size_t i = 0; i < attributesVecLen; ++i) {
        auto attributesVec = allocator.getMaybeInvalidVecView(attributesVecOffset, attributesVecLen);
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
    const auto& [targetsVecOffset, targetsVecLen] = allocator.vecFromJSArray_local(ems_targets);
    targets.resize(targetsVecLen);
    for (size_t i = 0; i < targetsVecLen; ++i) {
        auto targetsVec = allocator.getMaybeInvalidVecView(targetsVecOffset, targetsVecLen);
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
    EMSCachedArrayAllocator<val> allocator;
    ccstd::vector<CommandBuffer*> cmdBuffs;
    const auto& [ems_cmdBuffsOffset, len] = allocator.vecFromJSArray_local(info);
    cmdBuffs.resize(len);
    for (size_t i = 0; i < len; ++i) {
        auto ems_cmdBuffs = allocator.getMaybeInvalidVecView(ems_cmdBuffsOffset, len);
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
    EMSCachedNumbersAllocator<uint32_t> uint32_allocator;
    const auto& [vecOffset, len] = uint32_allocator.convertJSArrayToNumberVector_local(dynamicOffsets);
    auto vecView = uint32_allocator.getMaybeInvalidVecView(vecOffset, len);
    return this->bindDescriptorSet(set, descriptorSet, len, vecView.data());
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

    EMSCachedArrayAllocator<val> allocator;
    EMSCachedNumbersAllocator<uint8_t> uint8_allocator;
    const auto& [regionsOffset, regionsLen] = allocator.vecFromJSArray_local(vals);
    ccstd::vector<BufferTextureCopy> copies(regionsLen);
    for (size_t i = 0; i < regionsLen; ++i) {
        auto regions = allocator.getMaybeInvalidVecView(regionsOffset, regionsLen);
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

    size_t len = v[length_val].as<unsigned>();
    std::vector<std::vector<uint8_t>> lifeHolder(len);
    std::vector<const uint8_t*> buffers;
    for (size_t i = 0; i < len; i++) {
        const auto& [vecOffset, vecLen] = uint8_allocator.convertJSArrayToNumberVector_local(v[i]);
        auto vecView = uint8_allocator.getMaybeInvalidVecView(vecOffset, vecLen);
        lifeHolder[i].assign(vecView.begin(), vecView.end());
        buffers.push_back(lifeHolder[i].data());
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

    EMSCachedArrayAllocator<val> allocator;
    FramebufferInfo frameBufferInfo;
    const auto& ems_frameBufferInfo = info;
    ASSIGN_FROM_EMS(frameBufferInfo, renderPass, depthStencilTexture);

    const auto& ems_colorTextures = info[colorTextures_val];
    if (!ems_colorTextures.isUndefined() || !ems_colorTextures.isNull()) {
        const auto& [colorTexturesVecOffset, len] = allocator.vecFromJSArray_local(ems_colorTextures);
        auto& gfxColorTextures = frameBufferInfo.colorTextures;
        gfxColorTextures.resize(len);
        for (size_t i = 0; i < len; ++i) {
            auto colorTexturesVec = allocator.getMaybeInvalidVecView(colorTexturesVecOffset, len);
            gfxColorTextures[i] = colorTexturesVec[i].as<Texture*>(allow_raw_pointers());
        }
    }

    return this->initialize(frameBufferInfo);
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
