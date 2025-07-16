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

struct WGPUGPUDescriptor {
    DescriptorType type = DescriptorType::UNKNOWN;
    Buffer *buffer = nullptr;
    Texture *texture = nullptr;
    Sampler *sampler = nullptr;
};
using CCWGPUGPUDescriptorList = ccstd::vector<WGPUGPUDescriptor>;

// web interface
struct CCWGPUGPUDescriptorSetObject {
    CCWGPUGPUDescriptorList gpuDescriptors;
    ccstd::vector<uint32_t> descriptorIndices;
};

class CCWGPUDescriptorSet final : public DescriptorSet {
public:
    CCWGPUDescriptorSet();
    ~CCWGPUDescriptorSet();

    inline CCWGPUBindGroupObject *gpuBindGroupObject() { return _gpuBindGroupObj; }
    inline const std::map<uint8_t, uint8_t> &dynamicOffsets() { return _dynamicOffsets; }

    void update() override;
    void forceUpdate() override {
        _isDirty = true;
        update();
    };

    void prune(ccstd::vector<uint8_t> bindings);
    uint8_t dynamicOffsetCount() const;
    void prepare();
    ccstd::hash_t getHash() { return _bornHash; }

    static void *defaultBindGroup();
    static void clearCache();

    std::string label;

    inline void setLayout(const DescriptorSetLayout *layout) { _layout = layout; }

    inline const CCWGPUGPUDescriptorSetObject gpuDescriptors() const { return *_gpuDescriptorObj; }
    void setGpuDescriptors(DescriptorSet *set);

protected:
    void doInit(const DescriptorSetInfo &info) override;
    void doDestroy() override;
    ccstd::hash_t hash() const;

    CCWGPUBindGroupObject *_gpuBindGroupObj = nullptr;
    CCWGPUGPUDescriptorSetObject *_gpuDescriptorObj = nullptr;
    // dynamic offsets, inuse ? 1 : 0;
    std::map<uint8_t, uint8_t> _dynamicOffsets;
    uint32_t _dynamicOffsetNum{0};
    ccstd::hash_t _hash{0};
    ccstd::hash_t _bornHash{0}; // hash when created, this relate to reuse bindgroup layout
    std::function<bool(uint32_t)> _bindingSatisfied;
};

} // namespace gfx
} // namespace cc
