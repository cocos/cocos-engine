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
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "gfx-base/GFXDescriptorSet.h"
namespace cc {
namespace gfx {

struct CCWGPUBindGroupObject;

using Pairs = ccstd::vector<std::pair<uint8_t, uint8_t>>;

class CCWGPUDescriptorSet final : public DescriptorSet {
public:
    CCWGPUDescriptorSet();
    ~CCWGPUDescriptorSet();

    inline CCWGPUBindGroupObject *gpuBindGroupObject() { return _gpuBindGroupObj; }
    inline Pairs &dynamicOffsets() { return _dynamicOffsets; }

    void update() override;
    void forceUpdate() override{};
    uint8_t dynamicOffsetCount() const;
    void prepare();
    ccstd::hash_t getHash() { return _bornHash; };

    static void *defaultBindGroup();
    static void clearCache();

    std::string label;

protected:
    void doInit(const DescriptorSetInfo &info) override;
    void doDestroy() override;
    ccstd::hash_t hash() const;

    CCWGPUBindGroupObject *_gpuBindGroupObj = nullptr;

    // seperate combined sampler-texture index
    ccstd::unordered_map<uint8_t, uint8_t> _textureIdxMap;
    ccstd::unordered_map<uint8_t, uint8_t> _samplerIdxMap;

    // dynamic offsets, inuse ? 1 : 0;
    Pairs _dynamicOffsets;
    ccstd::hash_t _hash{0};
    ccstd::hash_t _bornHash{0}; // hash when created, this relate to reuse bindgroup layout
};

} // namespace gfx
} // namespace cc
