#ifndef CC_CORE_GFX_DEVICE_H_
#define CC_CORE_GFX_DEVICE_H_

#include "GFXDef.h"
#include "GFXFence.h"
#include "GFXQueue.h"
#include "GFXSampler.h"
#include "GFXInputAssembler.h"
#include "GFXRenderPass.h"
#include "GFXFramebuffer.h"
#include "GFXDescriptorSetLayout.h"
#include "GFXPipelineLayout.h"
#include "GFXPipelineState.h"
#include "GFXCommandBuffer.h"
#include "GFXDescriptorSet.h"
#include "GFXBuffer.h"
#include "GFXTexture.h"
#include "GFXShader.h"

namespace cc {
namespace gfx {

class CC_DLL Device : public Object {
public:
    static Device *getInstance();

    Device();
    Device(Device* device): Device() {}
    virtual ~Device();

    virtual bool initialize(const DeviceInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void resize(uint width, uint height) = 0;
    virtual void acquire() = 0;
    virtual void present() = 0;

    CC_INLINE CommandBuffer *createCommandBuffer(const CommandBufferInfo &info) { CommandBuffer *res = doCreateCommandBuffer(info, false); res->initialize(info); return res; }
    CC_INLINE Fence *createFence(const FenceInfo &info) { Fence *res = createFence(); res->initialize(info); return res; }
    CC_INLINE Queue *createQueue(const QueueInfo &info) { Queue *res = createQueue(); res->initialize(info); return res; }
    CC_INLINE Buffer *createBuffer(const BufferInfo &info) { Buffer *res = createBuffer(); res->initialize(info); return res; }
    CC_INLINE Buffer *createBuffer(const BufferViewInfo &info) { Buffer *res = createBuffer(); res->initialize(info); return res; }
    CC_INLINE Texture *createTexture(const TextureInfo &info) { Texture *res = createTexture(); res->initialize(info); return res; }
    CC_INLINE Texture *createTexture(const TextureViewInfo &info) { Texture *res = createTexture(); res->initialize(info); return res; }
    CC_INLINE Sampler *createSampler(const SamplerInfo &info) { Sampler *res = createSampler(); res->initialize(info); return res; }
    CC_INLINE Shader *createShader(const ShaderInfo &info) { Shader *res = createShader(); res->initialize(info); return res; }
    CC_INLINE InputAssembler *createInputAssembler(const InputAssemblerInfo &info) { InputAssembler *res = createInputAssembler(); res->initialize(info); return res; }
    CC_INLINE RenderPass *createRenderPass(const RenderPassInfo &info) { RenderPass *res = createRenderPass(); res->initialize(info); return res; }
    CC_INLINE Framebuffer *createFramebuffer(const FramebufferInfo &info) { Framebuffer *res = createFramebuffer(); res->initialize(info); return res; }
    CC_INLINE DescriptorSet *createDescriptorSet(const DescriptorSetInfo &info) { DescriptorSet *res = createDescriptorSet(); res->initialize(info); return res; }
    CC_INLINE DescriptorSetLayout *createDescriptorSetLayout(const DescriptorSetLayoutInfo &info) { DescriptorSetLayout *res = createDescriptorSetLayout(); res->initialize(info); return res; }
    CC_INLINE PipelineLayout *createPipelineLayout(const PipelineLayoutInfo &info) { PipelineLayout *res = createPipelineLayout(); res->initialize(info); return res; }
    CC_INLINE PipelineState *createPipelineState(const PipelineStateInfo &info) { PipelineState *res = createPipelineState(); res->initialize(info); return res; }
    CC_INLINE void copyBuffersToTexture(const BufferDataList &buffers, Texture *dst, const BufferTextureCopyList &regions) {
        copyBuffersToTexture(buffers.data(), dst, regions.data(), static_cast<uint>(regions.size()));
    }
    virtual void flushCommands(CommandBuffer *const *cmdBuffs, uint count) {}
    virtual void setMultithreaded(bool multithreaded) {}
    virtual SurfaceTransform getSurfaceTransform() const { return _transform; }
    virtual uint getWidth() const { return _width; }
    virtual uint getHeight() const { return _height; }
    virtual uint getNativeWidth() const { return _nativeWidth; }
    virtual uint getNativeHeight() const { return _nativeHeight; }
    virtual MemoryStatus &getMemoryStatus() { return _memoryStatus; }
    virtual uint getNumDrawCalls() const { return _numDrawCalls; }
    virtual uint getNumInstances() const { return _numInstances; }
    virtual uint getNumTris() const { return _numTriangles; }

    CC_INLINE void flushCommands(const vector<CommandBuffer *> &cmdBuffs) { flushCommands(cmdBuffs.data(), cmdBuffs.size()); }

    CC_INLINE void flushCommandsForJS(const vector<CommandBuffer *> &cmdBuffs) { flushCommands(cmdBuffs.data(), cmdBuffs.size()); }

    CC_INLINE Context *getContext() const { return _context; }
    CC_INLINE Queue *getQueue() const { return _queue; }
    CC_INLINE CommandBuffer *getCommandBuffer() const { return _cmdBuff; }
    CC_INLINE const DeviceCaps &getCapabilities() const { return _caps; }
    CC_INLINE bool hasFeature(Feature feature) const { return _features[static_cast<uint8_t>(feature)]; }
    CC_INLINE const BindingMappingInfo &bindingMappingInfo() const { return _bindingMappingInfo; }

    CC_INLINE API getGfxAPI() const { return _API; }
    CC_INLINE const String &getDeviceName() const { return _deviceName; }
    CC_INLINE const String &getRenderer() const { return _renderer; }
    CC_INLINE const String &getVendor() const { return _vendor; }
    CC_INLINE uint genShaderId() { return _shaderIdGen++; }
    Format getColorFormat() const;
    Format getDepthStencilFormat() const;

protected:
    friend class DeviceAgent;

    virtual CommandBuffer *doCreateCommandBuffer(const CommandBufferInfo &info, bool hasAgent) = 0;
    virtual Fence *createFence() = 0;
    virtual Queue *createQueue() = 0;
    virtual Buffer *createBuffer() = 0;
    virtual Texture *createTexture() = 0;
    virtual Sampler *createSampler() = 0;
    virtual Shader *createShader() = 0;
    virtual InputAssembler *createInputAssembler() = 0;
    virtual RenderPass *createRenderPass() = 0;
    virtual Framebuffer *createFramebuffer() = 0;
    virtual DescriptorSet *createDescriptorSet() = 0;
    virtual DescriptorSetLayout *createDescriptorSetLayout() = 0;
    virtual PipelineLayout *createPipelineLayout() = 0;
    virtual PipelineState *createPipelineState() = 0;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) = 0;

    virtual void bindRenderContext(bool bound) {}
    virtual void bindDeviceContext(bool bound) {}

    API _API = API::UNKNOWN;
    SurfaceTransform _transform = SurfaceTransform::IDENTITY;
    String _deviceName;
    String _renderer;
    String _vendor;
    String _version;
    bool _features[static_cast<uint8_t>(Feature::COUNT)];
    uint _width = 0;
    uint _height = 0;
    uint _nativeWidth = 0;
    uint _nativeHeight = 0;
    MemoryStatus _memoryStatus;
    uintptr_t _windowHandle = 0;
    Context *_context = nullptr;
    Queue *_queue = nullptr;
    CommandBuffer *_cmdBuff = nullptr;
    uint _numDrawCalls = 0u;
    uint _numInstances = 0u;
    uint _numTriangles = 0u;
    uint _shaderIdGen = 0u;
    BindingMappingInfo _bindingMappingInfo;
    DeviceCaps _caps;

private:
    static Device *_instance;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_DEVICE_H_
