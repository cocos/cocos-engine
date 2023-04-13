/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <cstring>
#include <memory>
#include "VKStd.h"
#include "gfx-base/GFXDevice.h"

namespace cc {
class IXRInterface;
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
class CCVKGPUInputAssemblerHub;

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
    using Device::createGeneralBarrier;
    using Device::createInputAssembler;
    using Device::createPipelineLayout;
    using Device::createPipelineState;
    using Device::createQueryPool;
    using Device::createQueue;
    using Device::createRenderPass;
    using Device::createSampler;
    using Device::createShader;
    using Device::createTexture;
    using Device::createTextureBarrier;
    using Device::createBufferBarrier;

    void frameSync() override;
    void acquire(Swapchain *const *swapchains, uint32_t count) override;
    void present() override;

    inline bool checkExtension(const ccstd::string &extension) const {
        return std::any_of(_extensions.begin(), _extensions.end(), [&extension](auto &ext) {
            return std::strcmp(ext, extension.c_str()) == 0;
        });
    }

    inline CCVKGPUDevice *gpuDevice() const { return _gpuDevice.get(); }
    inline CCVKGPUContext *gpuContext() { return _gpuContext.get(); }

    inline CCVKGPUBufferHub *gpuBufferHub() const { return _gpuBufferHub.get(); }
    inline CCVKGPUTransportHub *gpuTransportHub() const { return _gpuTransportHub.get(); }
    inline CCVKGPUDescriptorHub *gpuDescriptorHub() const { return _gpuDescriptorHub.get(); }
    inline CCVKGPUSemaphorePool *gpuSemaphorePool() const { return _gpuSemaphorePool.get(); }
    inline CCVKGPUBarrierManager *gpuBarrierManager() const { return _gpuBarrierManager.get(); }
    inline CCVKGPUDescriptorSetHub *gpuDescriptorSetHub() const { return _gpuDescriptorSetHub.get(); }
    inline CCVKGPUInputAssemblerHub *gpuIAHub() const { return _gpuIAHub.get(); }

    CCVKGPUFencePool *gpuFencePool();
    CCVKGPURecycleBin *gpuRecycleBin();
    CCVKGPUStagingBufferPool *gpuStagingBufferPool();
    void waitAllFences();

    void updateBackBufferCount(uint32_t backBufferCount);

protected:
    static CCVKDevice *instance;

    friend class DeviceManager;

    CCVKDevice();

    bool doInit(const DeviceInfo &info) override;
    void doDestroy() override;
    CommandBuffer *createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    Queue *createQueue() override;
    QueryPool *createQueryPool() override;
    Swapchain *createSwapchain() override;
    Buffer *createBuffer() override;
    Texture *createTexture() override;
    Shader *createShader() override;
    InputAssembler *createInputAssembler() override;
    RenderPass *createRenderPass() override;
    Framebuffer *createFramebuffer() override;
    DescriptorSet *createDescriptorSet() override;
    DescriptorSetLayout *createDescriptorSetLayout() override;
    PipelineLayout *createPipelineLayout() override;
    PipelineState *createPipelineState() override;

    Sampler *createSampler(const SamplerInfo &info) override;
    GeneralBarrier *createGeneralBarrier(const GeneralBarrierInfo &info) override;
    TextureBarrier *createTextureBarrier(const TextureBarrierInfo &info) override;
    BufferBarrier *createBufferBarrier(const BufferBarrierInfo &info) override;

    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint32_t count) override;
    void copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint32_t count) override;
    void getQueryPoolResults(QueryPool *queryPool) override;

    void initFormatFeature();

    std::unique_ptr<CCVKGPUDevice> _gpuDevice;
    std::unique_ptr<CCVKGPUContext> _gpuContext;

    ccstd::vector<std::unique_ptr<CCVKGPUFencePool>> _gpuFencePools;
    ccstd::vector<std::unique_ptr<CCVKGPURecycleBin>> _gpuRecycleBins;
    ccstd::vector<std::unique_ptr<CCVKGPUStagingBufferPool>> _gpuStagingBufferPools;

    std::unique_ptr<CCVKGPUBufferHub> _gpuBufferHub;
    std::unique_ptr<CCVKGPUTransportHub> _gpuTransportHub;
    std::unique_ptr<CCVKGPUDescriptorHub> _gpuDescriptorHub;
    std::unique_ptr<CCVKGPUSemaphorePool> _gpuSemaphorePool;
    std::unique_ptr<CCVKGPUBarrierManager> _gpuBarrierManager;
    std::unique_ptr<CCVKGPUDescriptorSetHub> _gpuDescriptorSetHub;
    std::unique_ptr<CCVKGPUInputAssemblerHub> _gpuIAHub;

    ccstd::vector<const char *> _layers;
    ccstd::vector<const char *> _extensions;

    IXRInterface *_xr{nullptr};
};

} // namespace gfx
} // namespace cc
