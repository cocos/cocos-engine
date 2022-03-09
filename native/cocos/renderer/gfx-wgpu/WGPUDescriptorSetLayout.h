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

#include <emscripten/bind.h>
#include <set>
#include "gfx-base/GFXDescriptorSetLayout.h"

namespace cc {
namespace gfx {

struct CCWGPUBindGroupLayoutObject;
class CCWGPUTexture;
class CCWGPUBuffer;
class CCWGPUSampler;

class CCWGPUDescriptorSetLayout final : public emscripten::wrapper<DescriptorSetLayout> {
public:
    EMSCRIPTEN_WRAPPER(CCWGPUDescriptorSetLayout);
    CCWGPUDescriptorSetLayout();
    ~CCWGPUDescriptorSetLayout() = default;

    inline CCWGPUBindGroupLayoutObject* gpuLayoutEntryObject() { return _gpuLayoutEntryObj; }

    void updateLayout(uint8_t binding, const CCWGPUBuffer* buffer = nullptr, const CCWGPUTexture* tex = nullptr, const CCWGPUSampler* sampler = nullptr);

    void prepare(bool forceUpdate = false);

    inline uint8_t dynamicOffsetCount() { return _dynamicOffsetCount; }

    static void* defaultBindGroupLayout();

    void print() const;

protected:
    void doInit(const DescriptorSetLayoutInfo& info) override;
    void doDestroy() override;

    size_t hash() const;

    CCWGPUBindGroupLayoutObject* _gpuLayoutEntryObj = nullptr;

    uint8_t _dynamicOffsetCount = 0;
};

} // namespace gfx
} // namespace cc
