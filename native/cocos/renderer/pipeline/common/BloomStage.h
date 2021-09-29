/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.

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

#include "../RenderStage.h"
#include "frame-graph/Handle.h"
#include "Enum.h"

namespace cc {
namespace pipeline {

struct CC_DLL UBOBloom : public Object {
    static constexpr uint TEXTURE_SIZE_OFFSET = 0;
    static constexpr uint COUNT               = UBOBloom::TEXTURE_SIZE_OFFSET + 4;
    static constexpr uint SIZE                = UBOBloom::COUNT * 4;
};

class CC_DLL BloomStage : public RenderStage {
public:
    BloomStage();
    ~BloomStage() override = default;

    static const int              MAX_SCALING_SAMPLE_PASS_NUM = 6;
    static const RenderStageInfo &getInitializeInfo();
    bool                          initialize(const RenderStageInfo &info) override;
    void                          activate(RenderPipeline *pipeline, RenderFlow *flow) override;
    void                          destroy() override;
    void                          render(scene::Camera *camera) override;

    auto &        getDownsampelUBO() { return _downsampleUBO; }
    auto &        getUpsampleUBO() { return _upsampleUBO; }
    gfx::Sampler *getSampler() const { return _sampler; }

private:
    gfx::Rect _renderArea;
    uint      _phaseID = 0;

    static RenderStageInfo initInfo;

    gfx::Sampler *                                         _sampler = nullptr;
    std::array<gfx::Buffer *, MAX_SCALING_SAMPLE_PASS_NUM> _downsampleUBO;
    std::array<gfx::Buffer *, MAX_SCALING_SAMPLE_PASS_NUM> _upsampleUBO;
    framegraph::StringHandle                               _fgStrHandleBloomOut;
};
} // namespace pipeline
} // namespace cc
