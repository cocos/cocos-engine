/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "GLES2Std.h"

#include "gfx-base/GFXDevice.h"

#ifndef GL_COMPRESSED_RGB8_ETC2
    #define GL_COMPRESSED_RGB8_ETC2 0x9274
#endif

#ifndef GL_COMPRESSED_RGBA8_ETC2_EAC
    #define GL_COMPRESSED_RGBA8_ETC2_EAC 0x9278
#endif

namespace cc {
namespace gfx {

class GLES2Context;
class GLES2GPUStateCache;
class GLES2GPUBlitManager;
class GLES2GPUStagingBufferPool;
class GLES2GPUConstantRegistry;
class GLES2GPUFramebufferCacheMap;

class CC_GLES2_API GLES2Device final : public Device {
public:
    static GLES2Device *getInstance();

    ~GLES2Device() override;

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

    void resize(uint width, uint height) override;
    void acquire() override;
    void present() override;

    inline GLES2GPUStateCache *         stateCache() const { return _gpuStateCache; }
    inline GLES2GPUBlitManager *        blitManager() const { return _gpuBlitManager; }
    inline GLES2GPUStagingBufferPool *  stagingBufferPool() const { return _gpuStagingBufferPool; }
    inline GLES2GPUConstantRegistry *   constantRegistry() const { return _gpuConstantRegistry; }
    inline GLES2GPUFramebufferCacheMap *framebufferCacheMap() const { return _gpuFramebufferCacheMap; }

    inline bool checkExtension(const String &extension) const {
        return std::any_of(_extensions.begin(), _extensions.end(), [&extension](auto &ext) {
            return ext.find(extension) != String::npos;
        });
    }

protected:
    static GLES2Device *instance;

    friend class DeviceManager;
    friend class GLES2Context;

    GLES2Device();

    bool                 doInit(const DeviceInfo &info) override;
    void                 doDestroy() override;
    CommandBuffer *      createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    Queue *              createQueue() override;
    Buffer *             createBuffer() override;
    Texture *            createTexture() override;
    Sampler *            createSampler() override;
    Shader *             createShader() override;
    InputAssembler *     createInputAssembler() override;
    RenderPass *         createRenderPass() override;
    Framebuffer *        createFramebuffer() override;
    DescriptorSet *      createDescriptorSet() override;
    DescriptorSetLayout *createDescriptorSetLayout() override;
    PipelineLayout *     createPipelineLayout() override;
    PipelineState *      createPipelineState() override;
    GlobalBarrier *      createGlobalBarrier() override;
    TextureBarrier *     createTextureBarrier() override;
    void                 copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;
    void                 copyTextureToBuffers(Texture* src, uint8_t *const* buffers, const BufferTextureCopy* region, uint count) override;

    void releaseSurface(uintptr_t windowHandle) override;
    void acquireSurface(uintptr_t windowHandle) override;

    void bindRenderContext(bool bound) override;
    void bindDeviceContext(bool bound) override;

    static bool checkForETC2();

    GLES2Context *               _renderContext          = nullptr;
    GLES2Context *               _deviceContext          = nullptr;
    GLES2GPUStateCache *         _gpuStateCache          = nullptr;
    GLES2GPUBlitManager *        _gpuBlitManager         = nullptr;
    GLES2GPUStagingBufferPool *  _gpuStagingBufferPool   = nullptr;
    GLES2GPUConstantRegistry *   _gpuConstantRegistry    = nullptr;
    GLES2GPUFramebufferCacheMap *_gpuFramebufferCacheMap = nullptr;

    StringArray _extensions;
};

} // namespace gfx
} // namespace cc
