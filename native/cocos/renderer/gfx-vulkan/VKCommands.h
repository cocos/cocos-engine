#ifndef CC_GFXVULKAN_COMMANDS_H_
#define CC_GFXVULKAN_COMMANDS_H_

#include "VKGPUObjects.h"

namespace cc {
namespace gfx {

class CCVKDevice;

struct CCVKDepthBias {
    float constant = 0.0f;
    float clamp = 0.0f;
    float slope = 0.0f;
};

struct CCVKDepthBounds {
    float minBounds = 0.0f;
    float maxBounds = 0.0f;
};

struct CCVKStencilWriteMask {
    StencilFace face = StencilFace::FRONT;
    uint32_t write_mask = 0;
};

struct CCVKStencilCompareMask {
    StencilFace face = StencilFace::FRONT;
    int reference = 0;
    uint32_t compareMask = 0;
};

CC_VULKAN_API void CCVKCmdFuncCreateRenderPass(CCVKDevice *device, CCVKGPURenderPass *gpuRenderPass);
CC_VULKAN_API void CCVKCmdFuncDestroyRenderPass(CCVKDevice *device, CCVKGPURenderPass *gpuRenderPass);
CC_VULKAN_API void CCVKCmdFuncGetDeviceQueue(CCVKDevice *device, CCVKGPUQueue *gpuQueue);
CC_VULKAN_API void CCVKCmdFuncCreateCommandPool(CCVKDevice *device, CCVKGPUCommandPool *gpuCommandPool);
CC_VULKAN_API void CCVKCmdFuncDestroyCommandPool(CCVKDevice *device, CCVKGPUCommandPool *gpuCommandPool);
CC_VULKAN_API void CCVKCmdFuncAllocateCommandBuffer(CCVKDevice *device, CCVKGPUCommandBuffer *gpuCommandBuffer);
CC_VULKAN_API void CCVKCmdFuncFreeCommandBuffer(CCVKDevice *device, CCVKGPUCommandBuffer *gpuCommandBuffer);

CC_VULKAN_API void CCVKCmdFuncCreateBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer);
CC_VULKAN_API void CCVKCmdFuncDestroyBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer);
CC_VULKAN_API void CCVKCmdFuncResizeBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer);
CC_VULKAN_API void CCVKCmdFuncUpdateBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer, void *buffer, uint offset, uint size);
CC_VULKAN_API void CCVKCmdFuncCreateTexture(CCVKDevice *device, CCVKGPUTexture *gpuTexture);
CC_VULKAN_API void CCVKCmdFuncDestroyTexture(CCVKDevice *device, CCVKGPUTexture *gpuTexture);
CC_VULKAN_API void CCVKCmdFuncCreateTextureView(CCVKDevice *device, CCVKGPUTextureView *gpuTextureView);
CC_VULKAN_API void CCVKCmdFuncDestroyTextureView(CCVKDevice *device, CCVKGPUTextureView *gpuTextureView);
CC_VULKAN_API void CCVKCmdFuncResizeTexture(CCVKDevice *device, CCVKGPUTexture *gpuTexture);
CC_VULKAN_API void CCVKCmdFuncCreateSampler(CCVKDevice *device, CCVKGPUSampler *gpuSampler);
CC_VULKAN_API void CCVKCmdFuncDestroySampler(CCVKDevice *device, CCVKGPUSampler *gpuSampler);
CC_VULKAN_API void CCVKCmdFuncCreateShader(CCVKDevice *device, CCVKGPUShader *gpuShader);
CC_VULKAN_API void CCVKCmdFuncDestroyShader(CCVKDevice *device, CCVKGPUShader *gpuShader);
CC_VULKAN_API void CCVKCmdFuncCreateInputAssembler(CCVKDevice *device, CCVKGPUInputAssembler *gpuInputAssembler);
CC_VULKAN_API void CCVKCmdFuncDestroyInputAssembler(CCVKDevice *device, CCVKGPUInputAssembler *gpuInputAssembler);
CC_VULKAN_API void CCVKCmdFuncCreateFramebuffer(CCVKDevice *device, CCVKGPUFramebuffer *gpuFramebuffer);
CC_VULKAN_API void CCVKCmdFuncDestroyFramebuffer(CCVKDevice *device, CCVKGPUFramebuffer *gpuFramebuffer);
CC_VULKAN_API void CCVKCmdFuncCreateBindingLayout(CCVKDevice *device, CCVKGPUBindingLayout *gpuBindingLayout, BindingUnitList bindings);
CC_VULKAN_API void CCVKCmdFuncDestroyBindingLayout(CCVKDevice *device, CCVKGPUBindingLayout *gpuBindingLayout);
CC_VULKAN_API void CCVKCmdFuncCreatePipelineLayout(CCVKDevice *device, CCVKGPUPipelineLayout *gpuPipelineLayout);
CC_VULKAN_API void CCVKCmdFuncDestroyPipelineLayout(CCVKDevice *device, CCVKGPUPipelineLayout *gpuPipelineLayout);
CC_VULKAN_API void CCVKCmdFuncCreatePipelineState(CCVKDevice *device, CCVKGPUPipelineState *gpuPipelineState);
CC_VULKAN_API void CCVKCmdFuncDestroyPipelineState(CCVKDevice *device, CCVKGPUPipelineState *gpuPipelineState);

CC_VULKAN_API void CCVKCmdFuncCopyBuffersToTexture(CCVKDevice *device, uint8_t *const *buffers, CCVKGPUTexture *gpuTexture, const BufferTextureCopyList &regions);

} // namespace gfx
} // namespace cc

#endif
