#pragma once

#include "gfx-base/GFXDevice.h"
#include "gfx-gles-new/GLESQueue.h"
#include "gfx-gles-new/GLESSwapchain.h"
#include "egl/Context.h"

namespace cc::gfx::gles {

struct GLDeviceCap {
    bool persistentMap = false;
};

class Device : public gfx::Device {
public:
    ~Device();

    static Device *getInstance();

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


    // swapchain
    void acquire(gfx::Swapchain *const *swapchains, uint32_t count);
    void present();

    // copy
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint32_t count) {}
    void copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint32_t count) {}
    void getQueryPoolResults(QueryPool *queryPool) {}

    // status
    void waitIdle();

    // context
    egl::Context *getMainContext() const { return _mainContext.get(); }
    Queue *getQueue(QueueType type) const { return type == QueueType::GRAPHICS ? _graphicsQueue.get() : _asyncQueue.get(); }

    const GLDeviceCap &getGLDeviceCap() const { return _glCap; }

private:
    friend class DeviceManager;
    Device();

    static Device *instance;

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


    inline bool checkExtension(const ccstd::string &extension) const {
        return std::any_of(_extensions.begin(), _extensions.end(), [&extension](auto &ext) {
            return ext.find(extension) != ccstd::string::npos;
        });
    }

    void initContext();
    void initDefaultObject();
    void initCaps();

    ccstd::vector<ccstd::string> _extensions;

    std::unique_ptr<egl::Context> _mainContext;
    std::unique_ptr<egl::Context> _graphicsContext;
    std::unique_ptr<egl::Context> _asyncContext;

    IntrusivePtr<Queue> _graphicsQueue;
    IntrusivePtr<Queue> _asyncQueue;
    IntrusivePtr<CommandBuffer> _defaultCmdBuffer;

    GLDeviceCap _glCap;

    // current swapchain
    ccstd::vector<Swapchain *> _swapChains;
};

} // namespace cc::gfx::gles
