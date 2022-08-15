/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "WGPUDevice.h"
#include <emscripten/val.h>
#include <numeric>
#include "../../base/threading/Semaphore.h"
#include "WGPUBuffer.h"
#include "WGPUCommandBuffer.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUExports.h"
#include "WGPUFrameBuffer.h"
#include "WGPUObject.h"
#include "WGPUPipelineLayout.h"
#include "WGPUPipelineState.h"
#include "WGPUQueryPool.h"
#include "WGPUQueue.h"
#include "WGPURenderPass.h"
#include "WGPUSampler.h"
#include "WGPUShader.h"
#include "WGPUSwapchain.h"
#include "WGPUUtils.h"

namespace cc {

namespace gfx {

struct BufferMapData {
    Semaphore *semaphore = nullptr;
    WGPUBuffer buffer = wgpuDefaultHandle;
    emscripten::val *retBuffer = nullptr;
    uint64_t size = 0;
    bool finished = false;
};

CCWGPUDevice *CCWGPUDevice::instance = nullptr;

CCWGPUDevice *CCWGPUDevice::getInstance() {
    // if JS
    if (!instance) {
        instance = ccnew CCWGPUDevice();
    }
    // endif
    return instance;
}

CCWGPUDevice::CCWGPUDevice() : Device() {
    _api = API::WEBGPU;
    _deviceName = "WebGPU";
    _caps.clipSpaceMinZ = 0.0F;
    _caps.screenSpaceSignY = -1.0F;
    _caps.clipSpaceSignY = 1.0F;
    _caps.uboOffsetAlignment = 256;
    instance = this;
}

CCWGPUDevice::~CCWGPUDevice() {
    doDestroy();
    instance = nullptr;
}

bool CCWGPUDevice::doInit(const DeviceInfo &info) {
    _gpuDeviceObj = ccnew CCWGPUDeviceObject;
    _gpuDeviceObj->wgpuDevice = emscripten_webgpu_get_device();
    _gpuDeviceObj->wgpuQueue = wgpuDeviceGetQueue(_gpuDeviceObj->wgpuDevice);

    _gpuDeviceObj->defaultResources.uniformBuffer = CCWGPUBuffer::defaultUniformBuffer();
    _gpuDeviceObj->defaultResources.storageBuffer = CCWGPUBuffer::defaultStorageBuffer();
    _gpuDeviceObj->defaultResources.commonTexture = CCWGPUTexture::defaultCommonTexture();
    _gpuDeviceObj->defaultResources.storageTexture = CCWGPUTexture::defaultStorageTexture();
    _gpuDeviceObj->defaultResources.filterableSampler = CCWGPUSampler::defaultFilterableSampler();
    _gpuDeviceObj->defaultResources.unfilterableSampler = CCWGPUSampler::defaultUnfilterableSampler();

    QueueInfo queueInfo = {
        .type = QueueType::GRAPHICS,
    };
    _queue = this->Device::createQueue(queueInfo);

    CommandBufferInfo cmdInfo = {
        .queue = _queue,
        .type = CommandBufferType::PRIMARY,
    };
    _cmdBuff = this->Device::createCommandBuffer(cmdInfo);

    _caps.maxFragmentUniformVectors = 256;
    _caps.maxVertexUniformVectors = 256;

    // auto bufferRecycleFunc = [this](WGPUBuffer buffer) {
    //     _recycleBin[getCurrentFrameIndex()].bufferBin.collect(buffer);
    // };
    // for (size_t i = 0; i < CC_WGPU_MAX_FRAME_COUNT; ++i) {
    //     _stagingBuffers[i] = new CCWGPUStagingBuffer(_gpuDeviceObj->wgpuDevice, bufferRecycleFunc);
    // }

    initFormatFeatures();
    return true;
}

void CCWGPUDevice::doDestroy() {
    if (_gpuDeviceObj) {
        delete _gpuDeviceObj;
    }
}

Swapchain *CCWGPUDevice::createSwapchain() {
    return ccnew CCWGPUSwapchain(this);
}

Queue *CCWGPUDevice::createQueue() {
    return ccnew CCWGPUQueue;
}

Buffer *CCWGPUDevice::createBuffer() {
    return ccnew CCWGPUBuffer;
}

Texture *CCWGPUDevice::createTexture() {
    return ccnew CCWGPUTexture;
}

Shader *CCWGPUDevice::createShader() {
    return ccnew CCWGPUShader;
}

InputAssembler *CCWGPUDevice::createInputAssembler() {
    return ccnew CCWGPUInputAssembler;
}

RenderPass *CCWGPUDevice::createRenderPass() {
    return ccnew CCWGPURenderPass;
}

Framebuffer *CCWGPUDevice::createFramebuffer() {
    return ccnew CCWGPUFramebuffer;
}

DescriptorSet *CCWGPUDevice::createDescriptorSet() {
    return ccnew CCWGPUDescriptorSet;
}

DescriptorSetLayout *CCWGPUDevice::createDescriptorSetLayout() {
    return ccnew CCWGPUDescriptorSetLayout;
}

PipelineLayout *CCWGPUDevice::createPipelineLayout() {
    return ccnew CCWGPUPipelineLayout;
}

PipelineState *CCWGPUDevice::createPipelineState() {
    return ccnew CCWGPUPipelineState;
}

CommandBuffer *CCWGPUDevice::createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) {
    return ccnew CCWGPUCommandBuffer;
}

void CCWGPUDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    Format dstFormat = dst->getFormat();
    uint32_t pxSize = GFX_FORMAT_INFOS[static_cast<uint>(dstFormat)].size;
    auto *texture = static_cast<CCWGPUTexture *>(dst);

    for (size_t i = 0; i < count; i++) {
        uint32_t bufferSize = pxSize * regions[i].texExtent.width * regions[i].texExtent.height;

        uint32_t bytesPerRow = pxSize * regions[i].texExtent.width;
        // it's buffer data layout
        WGPUTextureDataLayout texDataLayout = {
            .offset = 0,
            .bytesPerRow = bytesPerRow,
            .rowsPerImage = regions[i].texExtent.height,
        };

        WGPUExtent3D extent = {
            .width = regions[i].texExtent.width,
            .height = regions[i].texExtent.height,
            .depthOrArrayLayers = regions[i].texExtent.depth,
        };

        auto *ccTexture = static_cast<CCWGPUTexture *>(texture);
        if (ccTexture->isTextureView()) {
            ccTexture = static_cast<CCWGPUTexture *>(ccTexture->getViewInfo().texture);
        }
        WGPUImageCopyTexture imageCopyTexture = {
            .texture = ccTexture->gpuTextureObject()->wgpuTexture,
            .mipLevel = regions[i].texSubres.mipLevel,
            .origin = WGPUOrigin3D{
                static_cast<uint32_t>(regions[i].texOffset.x),
                static_cast<uint32_t>(regions[i].texOffset.y),
                static_cast<uint32_t>(regions[i].texSubres.baseArrayLayer)},
            .aspect = WGPUTextureAspect_All,
        };
        wgpuQueueWriteTexture(_gpuDeviceObj->wgpuQueue, &imageCopyTexture, buffers[i], bufferSize, &texDataLayout, &extent);

        // //genMipmap manually when level 0 updated.
        // const TextureInfo& texInfo = dst->getInfo();
        // if (hasFlag(texInfo.flags, TextureFlagBit::GEN_MIPMAP) && regions[i].texSubres.mipLevel == 0) {
        //     for(size_t j = 1; j < texInfo.levelCount; j++) {
        //         imageCopyTexture.mipLevel = j;
        //         extent = {
        //             .width              = (uint32_t)(regions[i].texExtent.width / float(std::pow(2, j))),
        //             .height             = (uint32_t)(regions[i].texExtent.height / float(std::pow(2, j))),
        //             .depthOrArrayLayers = regions[i].texExtent.depth,
        //         };

        //         wgpuQueueWriteTexture(_gpuDeviceObj->wgpuQueue, &imageCopyTexture, buffers[i], bufferSize, &texDataLayout, &extent);
        //     }
        // }
    }
}

void onQueueDone(WGPUQueueWorkDoneStatus status, void *userdata) {
    printf("Q done beg\n");
    if (status == WGPUQueueWorkDoneStatus_Success) {
        printf("Q done beg0\n");
        auto *bufferMapData = static_cast<BufferMapData *>(userdata);
        printf("Q done beg1\n");
        // auto* mappedBuffer        = wgpuBufferGetMappedRange(bufferMapData->buffer, 0, bufferMapData->size);
        auto *mappedBuffer = (uint8_t *)malloc(static_cast<uint32_t>(bufferMapData->size));
        printf("Q done beg2\n");
        *bufferMapData->retBuffer = emscripten::val(emscripten::typed_memory_view(bufferMapData->size, static_cast<uint8_t *>(mappedBuffer)));
        printf("Q suc %d\n", bufferMapData->size);
        bufferMapData->finished = true;
        // memcpy(bufferMapData->dst, mappedBuffer, bufferMapData->size);
    }
    printf("Q done\n");
}

emscripten::val CCWGPUDevice::copyTextureToBuffers(Texture *src, const BufferTextureCopyList &regions) {
    auto *texture = static_cast<CCWGPUTexture *>(src);
    Format dstFormat = src->getFormat();
    uint32_t pxSize = GFX_FORMAT_INFOS[static_cast<uint32_t>(dstFormat)].size;
    auto wgpuCommandEncoder = wgpuDeviceCreateCommandEncoder(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, nullptr);

    uint64_t size = std::accumulate(regions.begin(), regions.end(), 0, [pxSize](uint64_t initVal, const BufferTextureCopy &in) {
        uint32_t bytesPerRow = (pxSize * in.texExtent.width + 255) / 256 * 256;
        uint32_t bufferSize = bytesPerRow * in.texExtent.height * in.texExtent.depth;
        return initVal + bufferSize;
    });

    WGPUBufferDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = nullptr,
        .usage = WGPUBufferUsage_MapRead | WGPUBufferUsage_CopyDst,
        .size = size,
        .mappedAtCreation = false,
    };

    WGPUBuffer buffer = wgpuDeviceCreateBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
    uint64_t offset = 0;
    for (size_t i = 0; i < regions.size(); i++) {
        uint32_t bytesPerRow = (pxSize * regions[i].texExtent.width + 255) / 256 * 256;
        WGPUImageCopyTexture imageCopyTexture = {
            .texture = texture->gpuTextureObject()->wgpuTexture,
            .mipLevel = regions[i].texSubres.mipLevel,
            .origin = WGPUOrigin3D{
                static_cast<uint32_t>(regions[i].texOffset.x),
                static_cast<uint32_t>(regions[i].texOffset.y),
                static_cast<uint32_t>(regions[i].texOffset.z)},
            .aspect = WGPUTextureAspect_All,
        };

        WGPUTextureDataLayout texDataLayout = {
            .offset = offset,
            .bytesPerRow = bytesPerRow,
            .rowsPerImage = regions[i].texExtent.height,
        };
        uint32_t bufferSize = pxSize * regions[i].texExtent.width * regions[i].texExtent.depth;
        offset += bufferSize;

        WGPUImageCopyBuffer imageCopyBuffer = {
            .layout = texDataLayout,
            .buffer = buffer,
        };

        WGPUExtent3D extent = {
            .width = regions[i].texExtent.width,
            .height = regions[i].texExtent.height,
            .depthOrArrayLayers = regions[i].texExtent.depth,
        };

        wgpuCommandEncoderCopyTextureToBuffer(wgpuCommandEncoder, &imageCopyTexture, &imageCopyBuffer, &extent);
    }
    auto wgpuCommandBuffer = wgpuCommandEncoderFinish(wgpuCommandEncoder, nullptr);
    wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &wgpuCommandBuffer);
    printf("Q submit\n");
    Semaphore sem{0};
    BufferMapData *bufferMapData = ccnew BufferMapData{
        &sem,
        buffer,
        nullptr,
        size,
        false,
    };

    wgpuQueueOnSubmittedWorkDone(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, onQueueDone, bufferMapData);

    while (!bufferMapData->finished) {
        ;
    }
    // wgpuBufferRelease(buffer);
    return *bufferMapData->retBuffer;
}

void CCWGPUDevice::copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint32_t count) {
}

void CCWGPUDevice::acquire(Swapchain *const *swapchains, uint32_t count) {
    for (auto *swapchain : _swapchains) {
        swapchain->update();
    }
}

QueryPool *CCWGPUDevice::createQueryPool() {
    return ccnew CCWGPUQueryPool;
}

Sampler *CCWGPUDevice::createSampler(const SamplerInfo &info) {
    return ccnew CCWGPUSampler(info);
}

void CCWGPUDevice::present() {
    auto *queue = static_cast<CCWGPUQueue *>(_queue);
    _numDrawCalls = queue->getNumDrawCalls();
    _numInstances = queue->getNumInstances();
    _numTriangles = queue->getNumTris();
    queue->resetStatus();

    CCWGPUDescriptorSet::clearCache();

    _currentFrameIndex = (++_currentFrameIndex) % CC_WGPU_MAX_FRAME_COUNT;
}

void CCWGPUDevice::getQueryPoolResults(QueryPool *queryPool) {
    // _cmdBuff->getQueryPoolResults(queryPool);
}

void CCWGPUDevice::debug() {
    auto wgpuCommandEncoder = wgpuDeviceCreateCommandEncoder(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, nullptr);
    auto wgpuCommandBuffer = wgpuCommandEncoderFinish(wgpuCommandEncoder, nullptr);
    wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &wgpuCommandBuffer);
}

void CCWGPUDevice::initFormatFeatures() {
    const FormatFeature completeFeature = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER | FormatFeature::STORAGE_TEXTURE;

    FormatFeature tempFeature = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::STORAGE_TEXTURE;

    _formatFeatures[toNumber(Format::R8UI)] = tempFeature;
    _formatFeatures[toNumber(Format::RG8UI)] = tempFeature;
    _formatFeatures[toNumber(Format::RGBA8UI)] = tempFeature;

    _formatFeatures[toNumber(Format::R16UI)] = tempFeature;
    _formatFeatures[toNumber(Format::RG16UI)] = tempFeature;
    _formatFeatures[toNumber(Format::RGBA16UI)] = tempFeature;

    _formatFeatures[toNumber(Format::R32F)] = tempFeature;
    _formatFeatures[toNumber(Format::RG32F)] = tempFeature;
    _formatFeatures[toNumber(Format::RGBA32F)] = tempFeature;

    if (1) {
        tempFeature = FormatFeature::RENDER_TARGET | FormatFeature::STORAGE_TEXTURE;
        _formatFeatures[toNumber(Format::R32UI)] = tempFeature;
        _formatFeatures[toNumber(Format::RG32UI)] = tempFeature;
        _formatFeatures[toNumber(Format::RGBA32UI)] = tempFeature;
    } else {
        tempFeature = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::STORAGE_TEXTURE;
        _formatFeatures[toNumber(Format::R32UI)] = tempFeature;
        _formatFeatures[toNumber(Format::RG32UI)] = tempFeature;
        _formatFeatures[toNumber(Format::RGBA32UI)] = tempFeature;
    }

    if (1) {
        _formatFeatures[toNumber(Format::RGB10A2UI)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
    } else {
        _formatFeatures[toNumber(Format::RGB10A2UI)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::STORAGE_TEXTURE;
    }

    tempFeature = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER | FormatFeature::STORAGE_TEXTURE;

    _formatFeatures[toNumber(Format::R8SN)] = tempFeature;
    _formatFeatures[toNumber(Format::RG8SN)] = tempFeature;
    _formatFeatures[toNumber(Format::RGBA8SN)] = tempFeature;

    _formatFeatures[toNumber(Format::R8)] = tempFeature;
    _formatFeatures[toNumber(Format::RG8)] = tempFeature;
    _formatFeatures[toNumber(Format::RGBA8)] = tempFeature;

    _formatFeatures[toNumber(Format::R16F)] = tempFeature;
    _formatFeatures[toNumber(Format::RG16F)] = tempFeature;
    _formatFeatures[toNumber(Format::RGBA16F)] = tempFeature;

    _formatFeatures[toNumber(Format::R11G11B10F)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
    _formatFeatures[toNumber(Format::RGB9E5)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;

    if (1) {
        _formatFeatures[toNumber(Format::DEPTH)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
        _formatFeatures[toNumber(Format::DEPTH_STENCIL)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
    } else {
        _formatFeatures[toNumber(Format::DEPTH)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER;
        _formatFeatures[toNumber(Format::DEPTH_STENCIL)] = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER;
    }

    const FormatFeature compressedFeature = FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER;
    if (1) {
        _formatFeatures[toNumber(Format::PVRTC_RGB2)] = compressedFeature;
        _formatFeatures[toNumber(Format::PVRTC_RGBA2)] = compressedFeature;
        _formatFeatures[toNumber(Format::PVRTC_RGB4)] = compressedFeature;
        _formatFeatures[toNumber(Format::PVRTC_RGBA4)] = compressedFeature;
    }
    if (1) {
        _formatFeatures[toNumber(Format::ETC2_RGB8)] = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_RGBA8)] = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_SRGB8)] = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_SRGB8_A8)] = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_RGB8_A1)] = compressedFeature;
        _formatFeatures[toNumber(Format::ETC2_SRGB8_A1)] = compressedFeature;
    }
    if (1) {
        _formatFeatures[toNumber(Format::ASTC_RGBA_4X4)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_5X4)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_5X5)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_6X5)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_6X6)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_8X5)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_8X6)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_8X8)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_10X5)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_10X6)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_10X8)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_10X10)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_12X10)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_RGBA_12X12)] = compressedFeature;

        _formatFeatures[toNumber(Format::ASTC_SRGBA_4X4)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_5X4)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_5X5)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_6X5)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_6X6)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_8X5)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_8X6)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_8X8)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_10X5)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_10X6)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_10X8)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_10X10)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_12X10)] = compressedFeature;
        _formatFeatures[toNumber(Format::ASTC_SRGBA_12X12)] = compressedFeature;
    }

    if (1) {
        _formatFeatures[toNumber(Format::BC1)] = compressedFeature;
        _formatFeatures[toNumber(Format::BC1_ALPHA)] = compressedFeature;
        _formatFeatures[toNumber(Format::BC1_SRGB)] = compressedFeature;
        _formatFeatures[toNumber(Format::BC1_SRGB_ALPHA)] = compressedFeature;
        _formatFeatures[toNumber(Format::BC2)] = compressedFeature;
        _formatFeatures[toNumber(Format::BC2_SRGB)] = compressedFeature;
        _formatFeatures[toNumber(Format::BC3)] = compressedFeature;
        _formatFeatures[toNumber(Format::BC3_SRGB)] = compressedFeature;
    }

    _formatFeatures[toNumber(Format::R8)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG8)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB8)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA8)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R8SN)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG8SN)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB8SN)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA8SN)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R8I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG8I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB8I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA8I)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R16I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG16I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB16I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA16I)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA16F)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R32UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG32UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB32UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA32UI)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R32I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG32I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB32I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA32I)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::R32F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RG32F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGB32F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    _formatFeatures[toNumber(Format::RGBA32F)] |= FormatFeature::VERTEX_ATTRIBUTE;

    _formatFeatures[toNumber(Format::RGB10A2)] |= FormatFeature::VERTEX_ATTRIBUTE;
}

} // namespace gfx

} // namespace cc
