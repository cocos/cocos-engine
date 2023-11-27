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
#include "WGPUUtils.h"
#include "base/std/container/map.h"
#include "base/std/container/set.h"
#include "gfx-base/GFXPipelineLayout.h"
namespace cc {
namespace gfx {

struct CCWGPUPipelineLayoutObject;
class DescriptorSet;

class CCWGPUPipelineLayout final : public PipelineLayout {
public:
    CCWGPUPipelineLayout();
    ~CCWGPUPipelineLayout();

    inline CCWGPUPipelineLayoutObject *gpuPipelineLayoutObject() { return _gpuPipelineLayoutObj; }

    // bindgroup not ready yet so delay creation
    void prepare(const ccstd::set<uint8_t> &setInUse);

    const ccstd::vector<void *> &layouts() const { return _bgLayouts; }
    const ccstd::vector<void *> &cclayouts() const { return _ccbgLayouts; }

    static ccstd::map<ccstd::hash_t, void *> layoutMap;

    inline ccstd::hash_t getHash() const { return _hash; }

protected:
    void doInit(const PipelineLayoutInfo &info) override;
    void doDestroy() override;

    CCWGPUPipelineLayoutObject *_gpuPipelineLayoutObj = nullptr;

    ccstd::vector<void *> _bgLayouts;
    ccstd::vector<void *> _ccbgLayouts;

    ccstd::hash_t _hash{0};

    friend void createPipelineLayoutFallback(const ccstd::vector<DescriptorSet *> &descriptorSets, PipelineLayout *pipelineLayout, bool skipEmpty);
};

} // namespace gfx
} // namespace cc
