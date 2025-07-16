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
#include "base/std/container/map.h"
#include "base/std/container/set.h"
#include "gfx-base/GFXPipelineState.h"

namespace cc {
namespace gfx {

struct CCWGPUPipelineStateObject;

class CCWGPUPipelineState final : public PipelineState {
public:
    CCWGPUPipelineState();
    ~CCWGPUPipelineState();

    inline CCWGPUPipelineStateObject *gpuPipelineStateObject() { return _gpuPipelineStateObj; }

    void check(RenderPass *renderPass, bool forceUpdate = false);
    void prepare(const ccstd::set<uint8_t> &setInUse);
    PipelineLayout *layout() const { return _pipelineLayout; }

    void *ppl() const { return _ppl; }

    static ccstd::map<ccstd::hash_t, void *> pipelineMap;

    inline ccstd::hash_t getHash() const { return _hash; }

protected:
    void doInit(const PipelineStateInfo &info) override;
    void doDestroy() override;

    CCWGPUPipelineStateObject *_gpuPipelineStateObj = nullptr;

    void *_ppl = nullptr;
    bool _forceUpdate = false;
    ccstd::hash_t _hash{0};
};

} // namespace gfx
} // namespace cc
