#pragma once

#include "gfx-base/GFXDevice.h"
#include "gfx-gles-common/common/GLESBase.h"
#include "gfx-gles-common/common/GLESQueue.h"
#include "gfx-gles-common/common/GLESSwapchain.h"
#include "gfx-gles-common/common/GLESCommands.h"
#include "gfx-gles-common/common/GLESPipelineCache.h"
#include "gfx-gles-common/common/GLESRecycleBin.h"
#include "gfx-gles-common/common/GLESCommandStorage.h"
#include "gfx-gles-common/egl/Context.h"

namespace cc::gfx {
class GLESDevice : public Device {
public:
    ~GLESDevice() override;

    static GLESDevice *getInstance();

    using gfx::Device::copyBuffersToTexture;
    using gfx::Device::createBuffer;
    using gfx::Device::createCommandBuffer;
    using gfx::Device::createDescriptorSet;
    using gfx::Device::createDescriptorSetLayout;
    using gfx::Device::createFramebuffer;
    using gfx::Device::createGeneralBarrier;
    using gfx::Device::createInputAssembler;
    using gfx::Device::createPipelineLayout;
    using gfx::Device::createPipelineState;
    using gfx::Device::createQueryPool;
    using gfx::Device::createQueue;
    using gfx::Device::createRenderPass;
    using gfx::Device::createSampler;
    using gfx::Device::createShader;
    using gfx::Device::createSwapchain;
    using gfx::Device::createTexture;
    using gfx::Device::createTextureBarrier;

    void frameSync() override;

    // swapchain
    void acquire(gfx::Swapchain *const *swapchains, uint32_t count) override;
    void present() override;

    // copy
    void copyBuffersToTexture(const uint8_t *const *buffers, gfx::Texture *dst, const BufferTextureCopy *regions, uint32_t count) override;
    void copyTextureToBuffers(gfx::Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint32_t count) override;
    void getQueryPoolResults(QueryPool *queryPool) override {}

    // status
    void waitIdle();

    // context
    egl::Context *getMainContext() const { return _mainContext.get(); }
    GLESQueue *getQueue(QueueType type) const { return _queues[toNumber(type)]; }
    GLESGPUStateCache *getCacheState(uint32_t contextID) const { return _cacheStates[contextID].get(); }

    // pipeline cache
    GLESPipelineCache *pipelineCache() const { return _pipelineCache.get(); }
    GLESRecycleBin *recycleBin() const { return _recycleBins[_frameIndex].get(); }
    GLESCommandStorage *stagingBuffer() const { return _stagingStorages[_frameIndex].get(); }

    const GLESGPUConstantRegistry &constantRegistry() const { return _gpuConstantRegistry; }

    inline bool checkExtension(const ccstd::string &extension) const {
        return std::any_of(_extensions.begin(), _extensions.end(), [&extension](auto &ext) {
            return ext.find(extension) != ccstd::string::npos;
        });
    }
    inline bool isTextureExclusive(const Format &format) const { return _textureExclusive[static_cast<size_t>(format)]; };

    template <typename Func>
    void forEachContext(Func &&fn) {
        fn(_mainContext.get());
        if (_graphicsContext) {
            _graphicsQueue->queueTaskInternal([=]() {
                fn(_graphicsContext.get());
            });
        }
        if (_asyncContext) {
            _asyncQueue->queueTaskInternal([=]() {
                fn(_asyncContext.get());
            });
        }
    }

    uint32_t currentFrameIndex() const { return _frameIndex; }
    uint32_t maxFrameInFlight() const { return _maxFrame; }
private:
    friend class DeviceManager;
    GLESDevice();

    static GLESDevice *instance;
    static constexpr uint32_t MAX_FRAME = 2;

    bool doInit(const DeviceInfo &info) override;
    void doDestroy() override;
    // create device object

    gfx::CommandBuffer *createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    gfx::Queue *createQueue() override;
    gfx::QueryPool *createQueryPool() override;
    gfx::Swapchain *createSwapchain() override;
    gfx::Buffer *createBuffer() override;
    gfx::Texture *createTexture() override;
    gfx::Shader *createShader() override;
    gfx::InputAssembler *createInputAssembler() override;
    gfx::RenderPass *createRenderPass() override;
    gfx::Framebuffer *createFramebuffer() override;
    gfx::DescriptorSet *createDescriptorSet() override;
    gfx::DescriptorSetLayout *createDescriptorSetLayout() override;
    gfx::PipelineLayout *createPipelineLayout() override;
    gfx::PipelineState *createPipelineState() override;
    gfx::Sampler *createSampler(const SamplerInfo &info) override;
    gfx::GeneralBarrier *createGeneralBarrier(const GeneralBarrierInfo &info) override;


    bool initContext(EGLint majorVersion);
    void initDefaultObject();
    void initDeviceFeaturesAndConstants();

    ccstd::vector<ccstd::string> _extensions;
    ccstd::array<bool, static_cast<size_t>(Format::COUNT)> _textureExclusive;

    std::unique_ptr<egl::Context> _mainContext;
    std::unique_ptr<egl::Context> _graphicsContext;
    std::unique_ptr<egl::Context> _asyncContext;

    std::unique_ptr<GLESPipelineCache> _pipelineCache;
    ccstd::array<std::unique_ptr<GLESCommandStorage>, MAX_FRAME> _stagingStorages;
    ccstd::array<std::unique_ptr<GLESRecycleBin>,  MAX_FRAME> _recycleBins;

    GLESQueue *_queues[QUEUE_NUM]{nullptr};
    ccstd::vector<std::unique_ptr<GLESGPUStateCache>> _cacheStates; // per context

    IntrusivePtr<GLESQueue> _graphicsQueue;
    IntrusivePtr<GLESQueue> _asyncQueue;
    IntrusivePtr<CommandBuffer> _defaultCmdBuffer;

    GLESGPUConstantRegistry _gpuConstantRegistry;
    // frame context
    uint32_t _frameIndex = 0;
    uint32_t _maxFrame = MAX_FRAME;
    ccstd::vector<GLESSwapchain *> _currentSwapChains;
};

} // namespace cc::gfx
