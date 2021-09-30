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
#include "ReflectionComp.h"
#include "scene/Camera.h"

namespace cc {
namespace pipeline {

class RenderFlow;
class RenderBatchedQueue;
class RenderInstancedQueue;
class RenderAdditiveLightQueue;
class PlanarShadowQueue;
struct DeferredRenderData;
class DeferredPipeline;

struct RenderElem {
    RenderObject        renderObject;
    gfx::DescriptorSet *set;
    uint                modelIndex;
    uint                passIndex;
};

class CC_DLL LightingStage : public RenderStage {
public:
    static const RenderStageInfo &getInitializeInfo();

    LightingStage();
    ~LightingStage() override;

    bool initialize(const RenderStageInfo &info) override;
    void activate(RenderPipeline *pipeline, RenderFlow *flow) override;
    void destroy() override;
    void render(scene::Camera *camera) override;

private:
    void gatherLights(scene::Camera *camera);
    void initLightingBuffer();
    void fgLightingPass(scene::Camera *camera);
    void fgTransparent(scene::Camera *camera);
    void fgSsprPass(scene::Camera *camera);

    void putTransparentObj2Queue();

    static RenderStageInfo initInfo;
    PlanarShadowQueue *    _planarShadowQueue{nullptr};
    gfx::Rect              _renderArea;
    uint                   _phaseID{0};

    gfx::Buffer *             _deferredLitsBufs{nullptr};
    gfx::Buffer *             _deferredLitsBufView{nullptr};
    std::vector<float>        _lightBufferData;
    uint                      _lightBufferStride{0};
    uint                      _lightBufferElementCount{0};
    float                     _lightMeterScale{10000.0};
    gfx::DescriptorSet *      _descriptorSet{nullptr};
    gfx::DescriptorSetLayout *_descLayout{nullptr};
    uint                      _maxDeferredLights{UBODeferredLight::LIGHTS_PER_PASS};

    ReflectionComp *_reflectionComp{nullptr};
    RenderQueue *   _reflectionRenderQueue{nullptr};
    uint            _reflectionPhaseID{0};

    std::vector<RenderElem> _reflectionElems;
    uint                    _denoiseIndex = 0; // use to get corrrect texture string handle

    gfx::Sampler *_defaultSampler{nullptr};

    // SSPR texture size
    uint _ssprTexWidth  = 0;
    uint _ssprTexHeight = 0;
    Mat4 _matViewProj;
};

} // namespace pipeline
} // namespace cc
