/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include <array>
#include "GFXBuffer.h"
#include "GFXCommandBuffer.h"
#include "GFXDescriptorSet.h"
#include "GFXDescriptorSetLayout.h"
#include "GFXFramebuffer.h"
#include "GFXInputAssembler.h"
#include "GFXObject.h"
#include "GFXPipelineLayout.h"
#include "GFXPipelineState.h"
#include "GFXQueryPool.h"
#include "GFXQueue.h"
#include "GFXRenderPass.h"
#include "GFXShader.h"
#include "GFXSwapchain.h"
#include "GFXTexture.h"
#include "states/GFXGeneralBarrier.h"
#include "states/GFXSampler.h"
#include "states/GFXTextureBarrier.h"

namespace cc {
namespace gfx {

class CC_DLL Device : public Object {
public:
    static Device *getInstance();

    ~Device() override;

    bool initialize(const DeviceInfo &info);
    void destroy();

    virtual void acquire(Swapchain *const *swapchains, uint32_t count) = 0;
    virtual void present()                                             = 0;

    virtual void flushCommands(CommandBuffer *const *cmdBuffs, uint32_t count) {}

    virtual MemoryStatus &getMemoryStatus() { return _memoryStatus; }
    virtual uint32_t      getNumDrawCalls() const { return _numDrawCalls; }
    virtual uint32_t      getNumInstances() const { return _numInstances; }
    virtual uint32_t      getNumTris() const { return _numTriangles; }

    inline CommandBuffer *      createCommandBuffer(const CommandBufferInfo &info);
    inline Queue *              createQueue(const QueueInfo &info);
    inline QueryPool *          createQueryPool(const QueryPoolInfo &info);
    inline Swapchain *          createSwapchain(const SwapchainInfo &info);
    inline Buffer *             createBuffer(const BufferInfo &info);
    inline Buffer *             createBuffer(const BufferViewInfo &info);
    inline Texture *            createTexture(const TextureInfo &info);
    inline Texture *            createTexture(const TextureViewInfo &info);
    inline Shader *             createShader(const ShaderInfo &info);
    inline InputAssembler *     createInputAssembler(const InputAssemblerInfo &info);
    inline RenderPass *         createRenderPass(const RenderPassInfo &info);
    inline Framebuffer *        createFramebuffer(const FramebufferInfo &info);
    inline DescriptorSet *      createDescriptorSet(const DescriptorSetInfo &info);
    inline DescriptorSetLayout *createDescriptorSetLayout(const DescriptorSetLayoutInfo &info);
    inline PipelineLayout *     createPipelineLayout(const PipelineLayoutInfo &info);
    inline PipelineState *      createPipelineState(const PipelineStateInfo &info);

    virtual Sampler *       getSampler(const SamplerInfo &info);
    virtual GeneralBarrier *getGeneralBarrier(const GeneralBarrierInfo &info);
    virtual TextureBarrier *getTextureBarrier(const TextureBarrierInfo &info);

    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint32_t count) = 0;
    virtual void copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint32_t count)        = 0;
    virtual void getQueryPoolResults(QueryPool *queryPool)                                                                           = 0;

    inline void copyBuffersToTexture(const BufferDataList &buffers, Texture *dst, const BufferTextureCopyList &regions);
    inline void flushCommands(const vector<CommandBuffer *> &cmdBuffs);
    inline void acquire(const vector<Swapchain *> &swapchains);

    inline Queue *           getQueue() const { return _queue; }
    inline QueryPool *       getQueryPool() const { return _queryPool; }
    inline CommandBuffer *   getCommandBuffer() const { return _cmdBuff; }
    inline const DeviceCaps &getCapabilities() const { return _caps; }
    inline API               getGfxAPI() const { return _api; }
    inline const String &    getDeviceName() const { return _deviceName; }
    inline const String &    getRenderer() const { return _renderer; }
    inline const String &    getVendor() const { return _vendor; }
    inline bool              hasFeature(Feature feature) const { return _features[toNumber(feature)]; }
    inline FormatFeature     getFormatFeatures(Format format) const { return _formatFeatures[toNumber(format)]; }

    inline const BindingMappingInfo &bindingMappingInfo() const { return _bindingMappingInfo; }

    // for external update operations which has to be performed on the device thread.
    // AR camera texture update, etc.
    template <typename ExecuteMethod>
    void registerOnAcquireCallback(ExecuteMethod &&execute);

protected:
    static Device *instance;

    friend class DeviceAgent;
    friend class DeviceValidator;
    friend class DeviceManager;

    Device();

    void destroySurface(void *windowHandle);
    void createSurface(void *windowHandle);

    virtual bool doInit(const DeviceInfo &info) = 0;
    virtual void doDestroy()                    = 0;

    virtual CommandBuffer *      createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) = 0;
    virtual Queue *              createQueue()                                                     = 0;
    virtual QueryPool *          createQueryPool()                                                 = 0;
    virtual Swapchain *          createSwapchain()                                                 = 0;
    virtual Buffer *             createBuffer()                                                    = 0;
    virtual Texture *            createTexture()                                                   = 0;
    virtual Shader *             createShader()                                                    = 0;
    virtual InputAssembler *     createInputAssembler()                                            = 0;
    virtual RenderPass *         createRenderPass()                                                = 0;
    virtual Framebuffer *        createFramebuffer()                                               = 0;
    virtual DescriptorSet *      createDescriptorSet()                                             = 0;
    virtual DescriptorSetLayout *createDescriptorSetLayout()                                       = 0;
    virtual PipelineLayout *     createPipelineLayout()                                            = 0;
    virtual PipelineState *      createPipelineState()                                             = 0;

    virtual Sampler *       createSampler(const SamplerInfo &info) { return CC_NEW(Sampler(info)); }
    virtual GeneralBarrier *createGeneralBarrier(const GeneralBarrierInfo &info) { return CC_NEW(GeneralBarrier(info)); }
    virtual TextureBarrier *createTextureBarrier(const TextureBarrierInfo &info) { return CC_NEW(TextureBarrier(info)); }

    // For context switching between threads
    virtual void bindContext(bool bound) {}

    String             _deviceName;
    String             _renderer;
    String             _vendor;
    String             _version;
    API                _api{API::UNKNOWN};
    DeviceCaps         _caps;
    BindingMappingInfo _bindingMappingInfo;

    bool _multithreadedCommandRecording{true};

    std::array<bool, static_cast<size_t>(Feature::COUNT)>         _features;
    std::array<FormatFeature, static_cast<size_t>(Format::COUNT)> _formatFeatures;

    Queue *        _queue{nullptr};
    QueryPool *    _queryPool{nullptr};
    CommandBuffer *_cmdBuff{nullptr};
    Executable *   _onAcquire{nullptr};

    uint32_t     _numDrawCalls{0U};
    uint32_t     _numInstances{0U};
    uint32_t     _numTriangles{0U};
    MemoryStatus _memoryStatus;

    unordered_map<SamplerInfo, Sampler *, Hasher<SamplerInfo>>                      _samplers;
    unordered_map<GeneralBarrierInfo, GeneralBarrier *, Hasher<GeneralBarrierInfo>> _generalBarriers;
    unordered_map<TextureBarrierInfo, TextureBarrier *, Hasher<TextureBarrierInfo>> _textureBarriers;

private:
    vector<Swapchain *> _swapchains;
};

//////////////////////////////////////////////////////////////////////////

CommandBuffer *Device::createCommandBuffer(const CommandBufferInfo &info) {
    CommandBuffer *res = createCommandBuffer(info, false);
    res->initialize(info);
    return res;
}

Queue *Device::createQueue(const QueueInfo &info) {
    Queue *res = createQueue();
    res->initialize(info);
    return res;
}

QueryPool *Device::createQueryPool(const QueryPoolInfo &info) {
    QueryPool *res = createQueryPool();
    res->initialize(info);
    return res;
}

Swapchain *Device::createSwapchain(const SwapchainInfo &info) {
    Swapchain *res = createSwapchain();
    res->initialize(info);
    _swapchains.push_back(res);
    return res;
}

Buffer *Device::createBuffer(const BufferInfo &info) {
    Buffer *res = createBuffer();
    res->initialize(info);
    return res;
}

Buffer *Device::createBuffer(const BufferViewInfo &info) {
    Buffer *res = createBuffer();
    res->initialize(info);
    return res;
}

Texture *Device::createTexture(const TextureInfo &info) {
    Texture *res = createTexture();
    res->initialize(info);
    return res;
}

Texture *Device::createTexture(const TextureViewInfo &info) {
    Texture *res = createTexture();
    res->initialize(info);
    return res;
}

Shader *Device::createShader(const ShaderInfo &info) {
    Shader *res = createShader();
    res->initialize(info);
    return res;
}

InputAssembler *Device::createInputAssembler(const InputAssemblerInfo &info) {
    InputAssembler *res = createInputAssembler();
    res->initialize(info);
    return res;
}

RenderPass *Device::createRenderPass(const RenderPassInfo &info) {
    RenderPass *res = createRenderPass();
    res->initialize(info);
    return res;
}

Framebuffer *Device::createFramebuffer(const FramebufferInfo &info) {
    Framebuffer *res = createFramebuffer();
    res->initialize(info);
    return res;
}

DescriptorSet *Device::createDescriptorSet(const DescriptorSetInfo &info) {
    DescriptorSet *res = createDescriptorSet();
    res->initialize(info);
    return res;
}

DescriptorSetLayout *Device::createDescriptorSetLayout(const DescriptorSetLayoutInfo &info) {
    DescriptorSetLayout *res = createDescriptorSetLayout();
    res->initialize(info);
    return res;
}

PipelineLayout *Device::createPipelineLayout(const PipelineLayoutInfo &info) {
    PipelineLayout *res = createPipelineLayout();
    res->initialize(info);
    return res;
}

PipelineState *Device::createPipelineState(const PipelineStateInfo &info) {
    PipelineState *res = createPipelineState();
    res->initialize(info);
    return res;
}

void Device::copyBuffersToTexture(const BufferDataList &buffers, Texture *dst, const BufferTextureCopyList &regions) {
    copyBuffersToTexture(buffers.data(), dst, regions.data(), utils::toUint(regions.size()));
}

void Device::flushCommands(const vector<CommandBuffer *> &cmdBuffs) {
    flushCommands(cmdBuffs.data(), utils::toUint(cmdBuffs.size()));
}

void Device::acquire(const vector<Swapchain *> &swapchains) {
    acquire(swapchains.data(), utils::toUint(swapchains.size()));
}

template <typename ExecuteMethod>
void Device::registerOnAcquireCallback(ExecuteMethod &&execute) {
    _onAcquire = CC_NEW(CallbackExecutable<ExecuteMethod>(std::forward<ExecuteMethod>(execute)));
}

} // namespace gfx
} // namespace cc
