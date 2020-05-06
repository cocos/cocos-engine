#ifndef CC_GFXVULKAN_COMMANDS_H_
#define CC_GFXVULKAN_COMMANDS_H_

#include "VKGPUObjects.h"

NS_CC_BEGIN

class CCVKDevice;

struct CCVKDepthBias
{
    float constant = 0.0f;
    float clamp = 0.0f;
    float slope = 0.0f;
};

struct CCVKDepthBounds
{
    float minBounds = 0.0f;
    float maxBounds = 0.0f;
};

struct CCVKStencilWriteMask
{
    GFXStencilFace face = GFXStencilFace::FRONT;
    uint32_t write_mask = 0;
};

struct CCVKStencilCompareMask
{
    GFXStencilFace face = GFXStencilFace::FRONT;
    int reference = 0;
    uint32_t compareMask = 0;
};

struct CCVKTextureSubres
{
    uint baseMipLevel = 0;
    uint levelCount = 1;
    uint baseArrayLayer = 0;
    uint layerCount = 1;
};

struct CCVKBufferTextureCopy
{
    uint buffOffset = 0;
    uint buffStride = 0;
    uint buffTexHeight = 0;
    uint texOffset[3] = { 0 };
    uint texExtent[3] = { 0 };
    CCVKTextureSubres texSubres;
};

class CCVKCmdBeginRenderPass : public GFXCmd
{
public:
    CCVKGPUFramebuffer* gpuFBO = nullptr;
    GFXRect render_area;
    GFXClearFlags clear_flags = GFXClearFlagBit::NONE;
    uint num_clear_colors = 0;
    GFXColor clear_colors[GFX_MAX_ATTACHMENTS];
    float clear_depth = 1.0f;
    int clear_stencil = 0;

    CCVKCmdBeginRenderPass() : GFXCmd(GFXCmdType::BEGIN_RENDER_PASS) {}

    void clear()
    {
        gpuFBO = nullptr;
        num_clear_colors = 0;
    }
};

enum class CCVKState : uint8_t
{
    VIEWPORT,
    SCISSOR,
    LINE_WIDTH,
    DEPTH_BIAS,
    BLEND_CONSTANTS,
    DEPTH_BOUNDS,
    STENCIL_WRITE_MASK,
    STENCIL_COMPARE_MASK,
    COUNT,
};

class CCVKCmdBindStates : public GFXCmd
{
public:
    CCVKGPUPipelineState* gpuPipelineState = nullptr;
    CCVKGPUBindingLayout* gpuBindingLayout = nullptr;
    CCVKGPUInputAssembler* gpuInputAssembler = nullptr;
    uint8_t state_flags[(int)CCVKState::COUNT] = { 0 };
    GFXViewport viewport;
    GFXRect scissor;
    float lineWidth = 1.0f;
    CCVKDepthBias depthBias;
    GFXColor blendConstants;
    CCVKDepthBounds depthBounds;
    CCVKStencilWriteMask stencilWriteMask;
    CCVKStencilCompareMask stencilCompareMask;

    CCVKCmdBindStates() : GFXCmd(GFXCmdType::BIND_STATES) {}

    void clear()
    {
        gpuPipelineState = nullptr;
        gpuBindingLayout = nullptr;
        gpuInputAssembler = nullptr;
        memset(state_flags, 0, sizeof(state_flags));
    }
};

class CCVKCmdDraw : public GFXCmd
{
public:
    GFXDrawInfo draw_info;

    CCVKCmdDraw() : GFXCmd(GFXCmdType::DRAW) {}
    void clear() {}
};

class CCVKCmdUpdateBuffer : public GFXCmd
{
public:
    CCVKGPUBuffer* gpuBuffer = nullptr;
    uint8_t* buffer = nullptr;
    uint size = 0;
    uint offset = 0;

    CCVKCmdUpdateBuffer() : GFXCmd(GFXCmdType::UPDATE_BUFFER) {}

    void clear()
    {
        gpuBuffer = nullptr;
        buffer = nullptr;
    }
};

class CCVKCmdCopyBufferToTexture : public GFXCmd
{
public:
    CCVKGPUBuffer* gpuBuffer = nullptr;
    CCVKGPUTexture* gpuTexture = nullptr;
    GFXTextureLayout dst_layout;
    GFXBufferTextureCopyList regions;

    CCVKCmdCopyBufferToTexture() : GFXCmd(GFXCmdType::COPY_BUFFER_TO_TEXTURE) {}

    void clear()
    {
        gpuBuffer = nullptr;
        gpuTexture = nullptr;
        regions.clear();
    }
};

class CCVKCmdPackage : public Object
{
public:
    CachedArray<GFXCmdType> cmds;
    CachedArray<CCVKCmdBeginRenderPass*> beginRenderPassCmds;
    CachedArray<CCVKCmdBindStates*> bindStatesCmds;
    CachedArray<CCVKCmdDraw*> drawCmds;
    CachedArray<CCVKCmdUpdateBuffer*> updateBufferCmds;
    CachedArray<CCVKCmdCopyBufferToTexture*> copyBufferToTextureCmds;
};

CC_VULKAN_API void CCVKCmdFuncCreateRenderPass(CCVKDevice* device, CCVKGPURenderPass* gpuRenderPass);
CC_VULKAN_API void CCVKCmdFuncDestroyRenderPass(CCVKDevice* device, CCVKGPURenderPass* gpuRenderPass);
CC_VULKAN_API void CCVKCmdFuncGetDeviceQueue(CCVKDevice* device, CCVKGPUQueue* gpuQueue);
CC_VULKAN_API void CCVKCmdFuncCreateCommandPool(CCVKDevice* device, CCVKGPUCommandPool* gpuCommandPool);
CC_VULKAN_API void CCVKCmdFuncDestroyCommandPool(CCVKDevice* device, CCVKGPUCommandPool* gpuCommandPool);
CC_VULKAN_API void CCVKCmdFuncAllocateCommandBuffer(CCVKDevice* device, CCVKGPUCommandBuffer* gpuCommandBuffer);
CC_VULKAN_API void CCVKCmdFuncFreeCommandBuffer(CCVKDevice* device, CCVKGPUCommandBuffer* gpuCommandBuffer);

CC_VULKAN_API void CCVKCmdFuncCreateBuffer(CCVKDevice* device, CCVKGPUBuffer* gpuBuffer);
CC_VULKAN_API void CCVKCmdFuncDestroyBuffer(CCVKDevice* device, CCVKGPUBuffer* gpuBuffer);
CC_VULKAN_API void CCVKCmdFuncResizeBuffer(CCVKDevice* device, CCVKGPUBuffer* gpuBuffer);
CC_VULKAN_API void CCVKCmdFuncUpdateBuffer(CCVKDevice* device, CCVKGPUBuffer* gpuBuffer, void* buffer, uint offset, uint size);
CC_VULKAN_API void CCVKCmdFuncCreateTexture(CCVKDevice* device, CCVKGPUTexture* gpuTexture);
CC_VULKAN_API void CCVKCmdFuncDestroyTexture(CCVKDevice* device, CCVKGPUTexture* gpuTexture);
CC_VULKAN_API void CCVKCmdFuncCreateTextureView(CCVKDevice* device, CCVKGPUTextureView* gpuTextureView);
CC_VULKAN_API void CCVKCmdFuncDestroyTextureView(CCVKDevice* device, CCVKGPUTextureView* gpuTextureView);
CC_VULKAN_API void CCVKCmdFuncResizeTexture(CCVKDevice* device, CCVKGPUTexture* gpuTexture);
CC_VULKAN_API void CCVKCmdFuncCreateSampler(CCVKDevice* device, CCVKGPUSampler* gpuSampler);
CC_VULKAN_API void CCVKCmdFuncDestroySampler(CCVKDevice* device, CCVKGPUSampler* gpuSampler);
CC_VULKAN_API void CCVKCmdFuncCreateShader(CCVKDevice* device, CCVKGPUShader* gpuShader);
CC_VULKAN_API void CCVKCmdFuncDestroyShader(CCVKDevice* device, CCVKGPUShader* gpuShader);
CC_VULKAN_API void CCVKCmdFuncCreateInputAssembler(CCVKDevice* device, CCVKGPUInputAssembler* gpuInputAssembler);
CC_VULKAN_API void CCVKCmdFuncDestroyInputAssembler(CCVKDevice* device, CCVKGPUInputAssembler* gpuInputAssembler);
CC_VULKAN_API void CCVKCmdFuncCreateFramebuffer(CCVKDevice* device, CCVKGPUFramebuffer* gpuFramebuffer);
CC_VULKAN_API void CCVKCmdFuncDestroyFramebuffer(CCVKDevice* device, CCVKGPUFramebuffer* gpuFramebuffer);
CC_VULKAN_API void CCVKCmdFuncCreateBindingLayout(CCVKDevice* device, CCVKGPUBindingLayout* gpuBindingLayout);
CC_VULKAN_API void CCVKCmdFuncDestroyBindingLayout(CCVKDevice* device, CCVKGPUBindingLayout* gpuBindingLayout);
CC_VULKAN_API void CCVKCmdFuncCreatePipelineLayout(CCVKDevice* device, CCVKGPUPipelineLayout* gpuPipelineLayout);
CC_VULKAN_API void CCVKCmdFuncDestroyPipelineLayout(CCVKDevice* device, CCVKGPUPipelineLayout* gpuPipelineLayout);
CC_VULKAN_API void CCVKCmdFuncCreatePipelineState(CCVKDevice* device, CCVKGPUPipelineState* gpuPipelineState);
CC_VULKAN_API void CCVKCmdFuncDestroyPipelineState(CCVKDevice* device, CCVKGPUPipelineState* gpuPipelineState);

CC_VULKAN_API void CCVKCmdFuncCopyBuffersToTexture(CCVKDevice* device, uint8_t* const* buffers, CCVKGPUTexture* gpuTexture, const GFXBufferTextureCopyList& regions);

NS_CC_END

#endif
