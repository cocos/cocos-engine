/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include "MTLConfig.h"

namespace cc {
namespace gfx {

class CCMTLGPUStagingBufferPool;
class CCMTLSemaphore;

class CCMTLDevice final : public Device {
public:
    CCMTLDevice();
    ~CCMTLDevice() override = default;
    CCMTLDevice(const CCMTLDevice &) = delete;
    CCMTLDevice(CCMTLDevice &&) = delete;
    CCMTLDevice &operator=(const CCMTLDevice &) = delete;
    CCMTLDevice &operator=(CCMTLDevice &&) = delete;

    using Device::copyBuffersToTexture;
    using Device::createBuffer;
    using Device::createCommandBuffer;
    using Device::createDescriptorSet;
    using Device::createDescriptorSetLayout;
    using Device::createFence;
    using Device::createFramebuffer;
    using Device::createInputAssembler;
    using Device::createPipelineLayout;
    using Device::createPipelineState;
    using Device::createQueue;
    using Device::createRenderPass;
    using Device::createSampler;
    using Device::createShader;
    using Device::createTexture;

    bool initialize(const DeviceInfo &info) override;
    void destroy() override;
    void resize(uint width, uint height) override;
    void acquire() override;
    void present() override;

    CC_INLINE void *getMTLCommandQueue() const { return _mtlCommandQueue; }
    CC_INLINE void *getMTKView() const { return _mtkView; }
    CC_INLINE void *getMTLDevice() const { return _mtlDevice; }
    CC_INLINE uint getMaximumSamplerUnits() const { return _maxSamplerUnits; }
    CC_INLINE uint getMaximumBufferBindingIndex() const { return _maxBufferBindingIndex; }
    CC_INLINE bool isIndirectDrawSupported() const { return _indirectDrawSupported; }
    CC_INLINE CCMTLGPUStagingBufferPool *gpuStagingBufferPool() const { return _gpuStagingBufferPools[_currentFrameIndex]; }
    CC_INLINE bool isSamplerDescriptorCompareFunctionSupported() const { return _isSamplerDescriptorCompareFunctionSupported; }
    CC_INLINE uint currentFrameIndex() const { return _currentFrameIndex; }

protected:
    CommandBuffer *doCreateCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    Fence *createFence() override;
    Queue *createQueue() override;
    Buffer *createBuffer() override;
    Texture *createTexture() override;
    Sampler *createSampler() override;
    Shader *createShader() override;
    InputAssembler *createInputAssembler() override;
    RenderPass *createRenderPass() override;
    Framebuffer *createFramebuffer() override;
    DescriptorSet *createDescriptorSet() override;
    DescriptorSetLayout *createDescriptorSetLayout() override;
    PipelineLayout *createPipelineLayout() override;
    PipelineState *createPipelineState() override;
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;

private:
    void onMemoryWarning();

private:
    void *_mtlCommandQueue = nullptr;
    void *_mtkView = nullptr;
    void *_mtlDevice = nullptr;
    unsigned long _mtlFeatureSet = 0;
    uint _maxSamplerUnits = 0;
    uint _maxBufferBindingIndex = 0;
    bool _indirectDrawSupported = false;
    bool _isSamplerDescriptorCompareFunctionSupported = false;
    CCMTLGPUStagingBufferPool *_gpuStagingBufferPools[MAX_FRAMES_IN_FLIGHT] = {nullptr};
    CCMTLSemaphore *_inFlightSemaphore = nullptr;
    uint _currentFrameIndex = 0;
    uint32_t _memoryAlarmListenerId = 0;
};

} // namespace gfx
} // namespace cc
