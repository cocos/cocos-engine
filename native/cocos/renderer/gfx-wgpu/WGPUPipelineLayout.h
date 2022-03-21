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
#include "gfx-base/GFXPipelineLayout.h"

namespace cc {
namespace gfx {

struct CCWGPUPipelineLayoutObject;

class CCWGPUPipelineLayout final : public emscripten::wrapper<PipelineLayout> {
public:
    CCWGPUPipelineLayout();
    ~CCWGPUPipelineLayout() = default;

    inline CCWGPUPipelineLayoutObject* gpuPipelineLayoutObject() { return _gpuPipelineLayoutObj; }

    //bindgroup not ready yet so delay creation
    void prepare(const std::set<uint8_t>& setInUse);

    // const std::vector<void*> & layouts()const{return _bgLayouts;}

protected:
    void doInit(const PipelineLayoutInfo& info) override;
    void doDestroy() override;

    CCWGPUPipelineLayoutObject* _gpuPipelineLayoutObj = nullptr;

    // std::vector<void*> _bgLayouts;
};

} // namespace gfx
} // namespace cc
