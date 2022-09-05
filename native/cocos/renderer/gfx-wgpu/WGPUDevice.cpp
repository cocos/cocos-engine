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

CCWGPUDevice::CCWGPUDevice() : wrapper<Device>(val::object()) {
    _api = API::WEBGPU;
    _deviceName = "WebGPU";
    _caps.clipSpaceMinZ = 0.0F;
    _caps.screenSpaceSignY = -1.0F;
    _caps.clipSpaceSignY = -1.0F;
    instance = this;
}

CCWGPUDevice::~CCWGPUDevice() {
    instance = nullptr;
    delete _gpuDeviceObj;
    delete this;
}

bool CCWGPUDevice::doInit(const DeviceInfo &info) {
    _gpuDeviceObj = ccnew CCWGPUDeviceObject;
    _gpuDeviceObj->wgpuDevice = emscripten_webgpu_get_device();
    _gpuDeviceObj->wgpuQueue = wgpuDeviceGetQueue(_gpuDeviceObj->wgpuDevice);

    _gpuDeviceObj->defaultResources.uniformBuffer = CCWGPUBuffer::defaultUniformBuffer();
    _gpuDeviceObj->defaultResources.storageBuffer = CCWGPUBuffer::defaultStorageBuffer();
    _gpuDeviceObj->defaultResources.commonTexture = CCWGPUTexture::defaultCommonTexture();
    _gpuDeviceObj->defaultResources.storageTexture = CCWGPUTexture::defaultStorageTexture();
    _gpuDeviceObj->defaultResources.sampler = CCWGPUSampler::defaultSampler();

    QueueInfo queueInfo = {
        .type = QueueType::GRAPHICS,
    };
    _queue = this->Device::createQueue(queueInfo);

    CommandBufferInfo cmdInfo = {
        .queue = _queue,
        .type = CommandBufferType::PRIMARY,
    };
    _cmdBuff = this->Device::createCommandBuffer(cmdInfo);
    return true;
}

void CCWGPUDevice::doDestroy() {
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

void CCWGPUDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint32_t count) {
    Format dstFormat = dst->getFormat();
    uint32_t pxSize = GFX_FORMAT_INFOS[static_cast<uint32_t>(dstFormat)].size;
    auto *texture = static_cast<CCWGPUTexture *>(dst);

    for (size_t i = 0; i < count; i++) {
        uint32_t bufferSize = pxSize * regions[i].texExtent.width * regions[i].texExtent.height;

        uint32_t bytesPerRow = pxSize * regions[i].texExtent.width;
        //it's buffer data layout
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

        WGPUImageCopyTexture imageCopyTexture = {
            .texture = texture->gpuTextureObject()->wgpuTexture,
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

Shader *CCWGPUDevice::createShader(const SPVShaderInfoInstance &info) {
    CCWGPUShader *shader = ccnew CCWGPUShader;
    shader->initialize(info);
    return shader;
}

QueryPool *CCWGPUDevice::createQueryPool() {
    return ccnew CCWGPUQueryPool;
}

Sampler *CCWGPUDevice::createSampler(const SamplerInfo &info) {
    return ccnew CCWGPUSampler(info);
}

void CCWGPUDevice::present() {
}

void CCWGPUDevice::getQueryPoolResults(QueryPool *queryPool) {
    // _cmdBuff->getQueryPoolResults(queryPool);
}

void CCWGPUDevice::debug() {
    auto wgpuCommandEncoder = wgpuDeviceCreateCommandEncoder(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, nullptr);
    auto wgpuCommandBuffer = wgpuCommandEncoderFinish(wgpuCommandEncoder, nullptr);
    wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &wgpuCommandBuffer);
}

} // namespace gfx

} // namespace cc