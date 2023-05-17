/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "../RenderStage.h"
#include "base/std/container/array.h"
#include "frame-graph/Handle.h"
#include "pipeline/Enum.h"

#define MAX_BLOOM_FILTER_PASS_NUM 6

namespace cc {
namespace pipeline {

struct CC_DLL UBOBloom {
    static constexpr uint32_t TEXTURE_SIZE_OFFSET = 0;
    static constexpr uint32_t COUNT = UBOBloom::TEXTURE_SIZE_OFFSET + 4;
    static constexpr uint32_t SIZE = UBOBloom::COUNT * 4;
};

class CC_DLL BloomStage : public RenderStage {
public:
    using SampleUBOArray = ccstd::array<gfx::Buffer *, MAX_BLOOM_FILTER_PASS_NUM>;

    BloomStage();
    ~BloomStage() override = default;

    static const RenderStageInfo &getInitializeInfo();
    bool initialize(const RenderStageInfo &info) override;
    void activate(RenderPipeline *pipeline, RenderFlow *flow) override;
    void destroy() override;
    void render(scene::Camera *camera) override;

    gfx::Buffer *getPrefilterUBO() { return _prefilterUBO; }
    SampleUBOArray &getDownsampleUBO() { return _downsampleUBO; }
    SampleUBOArray &getUpsampleUBO() { return _upsampleUBO; }
    gfx::Buffer *getCombineUBO() { return _combineUBO; }
    gfx::Sampler *getSampler() const { return _sampler; }

    inline float getThreshold() const { return _threshold; }
    inline void setThreshold(float value) { _threshold = value; }
    inline float getIntensity() const { return _intensity; }
    inline void setIntensity(float value) { _intensity = value; }
    inline int getIterations() const { return _iterations; }
    inline void setIterations(int value) {
        _iterations = std::max(1, std::min(value, MAX_BLOOM_FILTER_PASS_NUM));
    }

private:
    uint32_t _phaseID = 0;

    static RenderStageInfo initInfo;

    float _threshold = 1.0F;
    float _intensity = 0.8F;
    int _iterations = 2;
    gfx::Sampler *_sampler = nullptr;
    gfx::Buffer *_prefilterUBO = nullptr;
    SampleUBOArray _downsampleUBO{};
    SampleUBOArray _upsampleUBO{};
    gfx::Buffer *_combineUBO = nullptr;
    framegraph::StringHandle _fgStrHandleBloomOut;
};
} // namespace pipeline
} // namespace cc
