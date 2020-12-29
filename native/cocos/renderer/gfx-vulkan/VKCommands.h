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

CC_VULKAN_API void CCVKCmdFuncGetDeviceQueue(CCVKDevice *device, CCVKGPUQueue *gpuQueue);

CC_VULKAN_API void CCVKCmdFuncCreateTexture(CCVKDevice *device, CCVKGPUTexture *gpuTexture);
CC_VULKAN_API void CCVKCmdFuncCreateTextureView(CCVKDevice *device, CCVKGPUTextureView *gpuTextureView);
CC_VULKAN_API void CCVKCmdFuncCreateSampler(CCVKDevice *device, CCVKGPUSampler *gpuSampler);
CC_VULKAN_API void CCVKCmdFuncCreateBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer);
CC_VULKAN_API void CCVKCmdFuncCreateRenderPass(CCVKDevice *device, CCVKGPURenderPass *gpuRenderPass);
CC_VULKAN_API void CCVKCmdFuncCreateFramebuffer(CCVKDevice *device, CCVKGPUFramebuffer *gpuFramebuffer);
CC_VULKAN_API void CCVKCmdFuncCreateShader(CCVKDevice *device, CCVKGPUShader *gpuShader);
CC_VULKAN_API void CCVKCmdFuncCreateDescriptorSetLayout(CCVKDevice *device, CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout);
CC_VULKAN_API void CCVKCmdFuncCreatePipelineLayout(CCVKDevice *device, CCVKGPUPipelineLayout *gpuPipelineLayout);
CC_VULKAN_API void CCVKCmdFuncCreatePipelineState(CCVKDevice *device, CCVKGPUPipelineState *gpuPipelineState);
CC_VULKAN_API void CCVKCmdFuncCreateFence(CCVKDevice *device, CCVKGPUFence *gpuFence);

CC_VULKAN_API void CCVKCmdFuncUpdateBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer, const void *buffer, uint size, const CCVKGPUCommandBuffer *cmdBuffer = nullptr);
CC_VULKAN_API void CCVKCmdFuncCopyBuffersToTexture(CCVKDevice *device, const uint8_t *const *buffers, CCVKGPUTexture *gpuTexture, const BufferTextureCopy *regions, uint count, const CCVKGPUCommandBuffer *cmdBuff);

CC_VULKAN_API void CCVKCmdFuncDestroyRenderPass(CCVKGPUDevice *device, CCVKGPURenderPass *gpuRenderPass);
CC_VULKAN_API void CCVKCmdFuncDestroySampler(CCVKGPUDevice *device, CCVKGPUSampler *gpuSampler);
CC_VULKAN_API void CCVKCmdFuncDestroyShader(CCVKGPUDevice *device, CCVKGPUShader *gpuShader);
CC_VULKAN_API void CCVKCmdFuncDestroyFramebuffer(CCVKGPUDevice *device, CCVKGPUFramebuffer *gpuFramebuffer);
CC_VULKAN_API void CCVKCmdFuncDestroyDescriptorSetLayout(CCVKGPUDevice *device, CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout);
CC_VULKAN_API void CCVKCmdFuncDestroyPipelineLayout(CCVKGPUDevice *device, CCVKGPUPipelineLayout *gpuPipelineLayout);
CC_VULKAN_API void CCVKCmdFuncDestroyPipelineState(CCVKGPUDevice *device, CCVKGPUPipelineState *gpuPipelineState);
CC_VULKAN_API void CCVKCmdFuncDestroyFence(CCVKGPUDevice *device, CCVKGPUFence *gpuFence);

} // namespace gfx
} // namespace cc

#endif
