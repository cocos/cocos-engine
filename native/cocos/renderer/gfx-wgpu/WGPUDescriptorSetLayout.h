/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#pragma once
#ifdef CC_WGPU_WASM
    #include "WGPUDef.h"
#endif
#include "base/std/container/set.h"
#include "gfx-base/GFXDescriptorSetLayout.h"

namespace cc {
namespace gfx {

struct CCWGPUBindGroupLayoutObject;
class CCWGPUTexture;
class CCWGPUBuffer;
class CCWGPUSampler;

class CCWGPUDescriptorSetLayout final : public DescriptorSetLayout {
public:
    CCWGPUDescriptorSetLayout();
    ~CCWGPUDescriptorSetLayout();

    inline CCWGPUBindGroupLayoutObject *gpuLayoutEntryObject() { return _gpuLayoutEntryObj; }

    void updateBufferLayout(uint8_t binding, const CCWGPUBuffer *buffer);
    void updateTextureLayout(uint8_t binding, const CCWGPUTexture *texture);
    void updateSamplerLayout(uint8_t binding, const CCWGPUSampler *sampler);

    void prepare(ccstd::set<uint8_t> &bindingInUse, bool forceUpdate = false);

    inline uint8_t dynamicOffsetCount() { return _dynamicOffsetCount; }

    static void *defaultBindGroupLayout();
    static void *getBindGroupLayoutByHash(ccstd::hash_t hash);

    void print() const;

    ccstd::hash_t getHash() {
        return _hash;
    }

protected:
    void doInit(const DescriptorSetLayoutInfo &info) override;
    void doDestroy() override;

    ccstd::hash_t hash() const;
    ccstd::hash_t _hash{0};
    bool _internalChanged{false};

    CCWGPUBindGroupLayoutObject *_gpuLayoutEntryObj = nullptr;

    uint8_t _dynamicOffsetCount = 0;
};

} // namespace gfx
} // namespace cc
