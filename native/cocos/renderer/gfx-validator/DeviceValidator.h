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

#include "base/Agent.h"
#include "gfx-base/GFXDevice.h"

namespace cc {
namespace gfx {

class CC_DLL DeviceValidator final : public Agent<Device> {
public:
    static DeviceValidator *getInstance();

    ~DeviceValidator() override;

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

    Sampler *       createSampler(const SamplerInfo &info) override;
    GlobalBarrier * createGlobalBarrier(const GlobalBarrierInfo &info) override;
    TextureBarrier *createTextureBarrier(const TextureBarrierInfo &info) override;

    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;
    void copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint count) override;

    void          flushCommands(CommandBuffer *const *cmdBuffs, uint count) override;
    MemoryStatus &getMemoryStatus() override { return _actor->getMemoryStatus(); }
    uint          getNumDrawCalls() const override { return _actor->getNumDrawCalls(); }
    uint          getNumInstances() const override { return _actor->getNumInstances(); }
    uint          getNumTris() const override { return _actor->getNumTris(); }

    inline void enableRecording(bool recording) { _recording = recording; }
    inline bool isRecording() const { return _recording; }
    inline uint currentFrame() const { return _currentFrame; }

protected:
    static DeviceValidator *instance;

    friend class DeviceManager;

    explicit DeviceValidator(Device *device);

    bool doInit(const DeviceInfo &info) override;
    void doDestroy() override;

    void bindContext(bool bound) override { _actor->bindContext(bound); }

    bool _recording{false};
    uint _currentFrame{1U};
};

} // namespace gfx
} // namespace cc
