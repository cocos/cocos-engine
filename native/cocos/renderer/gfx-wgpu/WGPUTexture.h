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
#ifdef CC_WGPU_WASM
    #include "WGPUDef.h"
#endif
#include "WGPUDef.h"
#include "gfx-base/GFXTexture.h"

namespace cc {
namespace gfx {

struct CCWGPUTextureObject;
class CCWGPUSwapchain;

class CCWGPUTexture final : public Texture {
public:
    CCWGPUTexture();
    ~CCWGPUTexture();

    inline CCWGPUTextureObject *gpuTextureObject() const { return _gpuTextureObj; }

    static CCWGPUTexture *defaultCommonTexture();

    static CCWGPUTexture *defaultStorageTexture();

    CCWGPUSwapchain *swapchain();

    // stamp current state
    void stamp();

    // resource handler changed?
    inline bool internalChanged() const { return _internalChanged; }

    inline uint32_t getDepth() const { return _info.depth; };
    inline uint32_t getLayerCount() const { return _info.layerCount; };
    inline uint32_t getLevelCount() const { return _info.levelCount; };
    inline auto getTextureType() const { return _info.type; };
    inline auto getTextureUsage() const { return _info.usage; };
    inline auto getTextureFormat() const { return _info.format; };
    inline auto getTextureSamples() const { return _info.samples; };
    inline auto getTextureFlags() const { return _info.flags; };

protected:
    void doInit(const TextureInfo &info) override;
    void doInit(const TextureViewInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, uint32_t size) override;

    void doInit(const SwapchainTextureInfo &info) override;

    CCWGPUTextureObject *_gpuTextureObj = nullptr;

    bool _internalChanged = false;
};

} // namespace gfx
} // namespace cc
