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
#include "pipeline/Enum.h"

#define MAX_BLOOM_FILTER_PASS_NUM 6

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

    static const RenderStageInfo &getInitializeInfo();
    bool                          initialize(const RenderStageInfo &info) override;
    void                          activate(RenderPipeline *pipeline, RenderFlow *flow) override;
    void                          destroy() override;
    void                          render(scene::Camera *camera) override;

    gfx::Buffer * getPrefilterUBO() { return _prefilterUBO; }
    auto &        getDownsampelUBO() { return _downsampleUBO; }
    auto &        getUpsampleUBO() { return _upsampleUBO; }
    gfx::Buffer * getCombineUBO() { return _combineUBO; }
    gfx::Sampler *getSampler() const { return _sampler; }

    inline float getThreshold() const { return _threshold; }
    inline void  setThreshold(float value) { _threshold = value; }
    inline float getIntensity() const { return _intensity; }
    inline void  setIntensity(float value) { _intensity = value; }
    inline int   getIterations() const { return _iterations; }
    inline void  setIterations(int value) {
        _iterations = std::max(1, std::min(value, MAX_BLOOM_FILTER_PASS_NUM));
    }

private:
    uint      _phaseID = 0;

    static RenderStageInfo initInfo;

    float                                                _threshold    = 1.0F;
    float                                                _intensity    = 0.8F;
    int                                                  _iterations   = 2;
    gfx::Sampler *                                       _sampler      = nullptr;
    gfx::Buffer *                                        _prefilterUBO = nullptr;
    std::array<gfx::Buffer *, MAX_BLOOM_FILTER_PASS_NUM> _downsampleUBO{};
    std::array<gfx::Buffer *, MAX_BLOOM_FILTER_PASS_NUM> _upsampleUBO{};
    gfx::Buffer *                                        _combineUBO = nullptr;
    framegraph::StringHandle                             _fgStrHandleBloomOut;
};
} // namespace pipeline
} // namespace cc
