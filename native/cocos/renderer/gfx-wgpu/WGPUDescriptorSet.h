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
    ~CCWGPUDescriptorSet() = default;

    inline CCWGPUBindGroupObject *gpuBindGroupObject() { return _gpuBindGroupObj; }

    void update() override;

    void forceUpdate() override{};

    uint8_t dynamicOffsetCount() const;

    void prepare();

    static void *defaultBindGroup();

    inline Pairs &dynamicOffsets() { return _dynamicOffsets; }

    // ems export

    void *bgl() const { return _bgl; }

    // DescriptorSetLayout* local()const {return _local;}

    void *ccbgl() const { return _ccbgl; }

protected:
    void doInit(const DescriptorSetInfo &info) override;
    void doDestroy() override;

    CCWGPUBindGroupObject *_gpuBindGroupObj = nullptr;

    // seperate combined sampler-texture index
    ccstd::unordered_map<uint8_t, uint8_t> _textureIdxMap;
    ccstd::unordered_map<uint8_t, uint8_t> _samplerIdxMap;

    // dynamic offsets, inuse ? 1 : 0;
    Pairs _dynamicOffsets;

    void *_bgl = nullptr;

    void *_ccbgl = nullptr;

    // DescriptorSetLayout* _local = nullptr;
};

} // namespace gfx
} // namespace cc
