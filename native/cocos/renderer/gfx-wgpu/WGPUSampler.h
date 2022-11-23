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
#include "gfx-base/states/GFXSampler.h"

#include "WGPUobject.h"

namespace cc {
namespace gfx {

class CCWGPUSampler final : public Sampler {
public:
    explicit CCWGPUSampler(const SamplerInfo &info);
    ~CCWGPUSampler();

    inline WGPUSampler gpuSampler() const { return _wgpuSampler; }

    static CCWGPUSampler *defaultFilterableSampler();
    static CCWGPUSampler *defaultUnfilterableSampler();

    // stamp current state
    void stamp() {}
    bool internalChanged() const { return false; }

protected:
    WGPUSampler _wgpuSampler = wgpuDefaultHandle;
};

} // namespace gfx
} // namespace cc
