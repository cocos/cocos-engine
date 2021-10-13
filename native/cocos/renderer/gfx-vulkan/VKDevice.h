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

#pragma once

#include "VKStd.h"
#include "gfx-base/GFXDevice.h"

namespace cc {
namespace gfx {

class CCVKTexture;

class CCVKGPUDevice;
class CCVKGPUContext;

class CCVKGPUBufferHub;
class CCVKGPUTransportHub;
class CCVKGPUDescriptorHub;
class CCVKGPUSemaphorePool;
class CCVKGPUBarrierManager;
class CCVKGPUDescriptorSetHub;

class CCVKGPUFencePool;
class CCVKGPURecycleBin;
class CCVKGPUStagingBufferPool;

class CC_VULKAN_API CCVKDevice final : public Device {
public:
    static CCVKDevice *getInstance();

    ~CCVKDevice() override;

    friend class CCVKContext;
    using Device::copyBuffersToTexture;
    using Device::createBuffer;
    using Device::createCommandBuffer;
    using Device::createDescriptorSet;
    using Device::createDescriptorSetLayout;
    using Device::createFramebuffer;
    using Device::createGlobalBarrier;
    using Device::createInputAssembler;
    using Device::createPipelineLayout;
    using Device::createPipelineState;
    using Device::createQueue;
    using Device::createRenderPass;
    using Device::createSampler;
    using Device::createShader;
    using Device::createTexture;
    using Device::createTextureBarrier;

    void acquire(Swapchain *const *swapchains, uint32_t count) override;
    void present() override;

    inline bool checkExtension(const String &extension) const {
        return std::any_of(_extensions.begin(), _extensions.end(), [&extension](auto &ext) {
            return std::strcmp(ext, extension.c_str()) == 0;
        });
    }

    inline CCVKGPUDevice * gpuDevice() const { return _gpuDevice; }
    inline CCVKGPUContext *gpuContext() { return _gpuContext; }

    inline CCVKGPUBufferHub *       gpuBufferHub() { return _gpuBufferHub; }
    inline CCVKGPUTransportHub *    gpuTransportHub() { return _gpuTransportHub; }
    inline CCVKGPUDescriptorHub *   gpuDescriptorHub() { return _gpuDescriptorHub; }
    inline CCVKGPUSemaphorePool *   gpuSemaphorePool() { return _gpuSemaphorePool; }
    inline CCVKGPUBarrierManager *  gpuBarrierManager() { return _gpuBarrierManager; }
    inline CCVKGPUDescriptorSetHub *gpuDescriptorSetHub() { return _gpuDescriptorSetHub; }

    CCVKGPUFencePool *        gpuFencePool();
    CCVKGPURecycleBin *       gpuRecycleBin();
    CCVKGPUStagingBufferPool *gpuStagingBufferPool();
    void                      waitAllFences();

protected:
    static CCVKDevice *instance;

    friend class DeviceManager;

    CCVKDevice();

    bool                 doInit(const DeviceInfo &info) override;
    void                 doDestroy() override;
    CommandBuffer *      createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    Queue *              createQueue() override;
    Swapchain *          createSwapchain() override;
    Buffer *             createBuffer() override;
    Texture *            createTexture() override;
    Shader *             createShader() override;
    InputAssembler *     createInputAssembler() override;
    RenderPass *         createRenderPass() override;
    Framebuffer *        createFramebuffer() override;
    DescriptorSet *      createDescriptorSet() override;
    DescriptorSetLayout *createDescriptorSetLayout() override;
    PipelineLayout *     createPipelineLayout() override;
    PipelineState *      createPipelineState() override;

    Sampler *       createSampler(const SamplerInfo &info, size_t hash) override;
    GlobalBarrier * createGlobalBarrier(const GlobalBarrierInfo &info, size_t hash) override;
    TextureBarrier *createTextureBarrier(const TextureBarrierInfo &info, size_t hash) override;

    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint32_t count) override;
    void copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint32_t count) override;

    void destroySwapchain();
    bool checkSwapchainStatus();

    CCVKGPUDevice *       _gpuDevice  = nullptr;
    CCVKGPUContext *      _gpuContext = nullptr;
    vector<CCVKTexture *> _depthStencilTextures;

    vector<CCVKGPUFencePool *>         _gpuFencePools;
    vector<CCVKGPURecycleBin *>        _gpuRecycleBins;
    vector<CCVKGPUStagingBufferPool *> _gpuStagingBufferPools;

    CCVKGPUBufferHub *       _gpuBufferHub        = nullptr;
    CCVKGPUTransportHub *    _gpuTransportHub     = nullptr;
    CCVKGPUDescriptorHub *   _gpuDescriptorHub    = nullptr;
    CCVKGPUSemaphorePool *   _gpuSemaphorePool    = nullptr;
    CCVKGPUDescriptorSetHub *_gpuDescriptorSetHub = nullptr;
    CCVKGPUBarrierManager *  _gpuBarrierManager   = nullptr;

    vector<const char *> _layers;
    vector<const char *> _extensions;
};

} // namespace gfx
} // namespace cc
