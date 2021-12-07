/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include <vector>
#include "math/Mat4.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"
#include "renderer/gfx-base/GFXInputAssembler.h"
#include "renderer/gfx-base/GFXShader.h"
#include "scene/Model.h"

namespace cc {
namespace scene {

// As Pass.h will include Define.h, so use forward declaration.
class Pass;

struct Fog {
    bool     enabled{false};
    bool     accurate{false};
    uint32_t type{0};
    float    density{0.0F};
    float    start{0.0F};
    float    end{0.0F};
    float    atten{0.0F};
    float    top{0.0F};
    float    range{0.0F};
    Vec4     color;
};

enum class ShadowType {
    PLANAR    = 0,
    SHADOWMAP = 1
};

enum class TransformBit {
    NONE     = 0,
    POSITION = (1 << 0),
    ROTATION = (1 << 1),
    SCALE    = (1 << 2),
    RS       = ROTATION | SCALE,
    TRS      = POSITION | ROTATION | SCALE,
    TRS_MASK = ~TRS,
};

struct Shadow {
    bool       enabled{false};
    bool       dirty{false};
    bool       shadowMapDirty{false};
    bool       fixedArea{false};
    ShadowType shadowType{ShadowType::PLANAR};
    float      invisibleOcclusionRange{0.0F};
    float      shadowDistance{0.0F};
    float      distance{0.0F};
    Pass *     instancePass{nullptr};
    Pass *     planarPass{nullptr};
    float      nearValue{0.0F};
    float      farValue{0.0F};
    uint32_t   pcfType{0};
    float      bias{0.0F};
    float      normalBias{0.0F};
    float      saturation{0.0F};
    float      orthoSize{0.0F};

    Vec4 color;
    Vec2 size;
    Vec3 normal;
    Mat4 matLight;
};

struct Skybox {
    bool   enabled{false};
    bool   isRGBE{false};
    bool   useIBL{false};
    bool   useHDR{true};
    bool   useDiffuseMap{false};
    Model *model{nullptr};
};

struct Ambient {
    bool  enabled{false};
    float skyIllum{0.0F};
    Vec4  skyColor;
    Vec4  groundAlbedo;
};

struct OctreeInfo {
    bool     enabled{false};
    Vec3     minPos;
    Vec3     maxPos;
    uint32_t depth{0};
};

struct PipelineSharedSceneData {
    bool                       isHDR{true};
    float                      shadingScale{1.0F};
    Ambient *                  ambient{nullptr};
    Shadow *                   shadow{nullptr};
    Skybox *                   skybox{nullptr};
    Fog *                      fog{nullptr};
    OctreeInfo *               octree{nullptr};
    std::vector<Pass *>        geometryRendererPasses;
    std::vector<gfx::Shader *> geometryRendererShaders;
    gfx::InputAssembler *      occlusionQueryInputAssembler{nullptr};
    Pass *                     occlusionQueryPass{nullptr};
    gfx::Shader *              occlusionQueryShader{nullptr};
    Pass *                     deferredLightPass{nullptr};
    gfx::Shader *              deferredLightPassShader{nullptr};
    Pass *                     bloomPrefilterPass{nullptr};
    gfx::Shader *              bloomPrefilterPassShader{nullptr};
    std::vector<Pass *>        bloomDownsamplePass;
    gfx::Shader *              bloomDownsamplePassShader{nullptr};
    std::vector<Pass *>        bloomUpsamplePass;
    gfx::Shader *              bloomUpsamplePassShader{nullptr};
    Pass *                     bloomCombinePass{nullptr};
    gfx::Shader *              bloomCombinePassShader{nullptr};
    Pass *                     pipelinePostPass{nullptr};
    gfx::Shader *              pipelinePostPassShader{nullptr};
};

struct FlatBuffer {
    uint32_t stride{0};
    uint32_t count{0};
    uint32_t size{0};
    uint8_t *data{nullptr};
};

struct RenderingSubMesh {
    RenderingSubMesh() = default;
    std::vector<FlatBuffer> flatBuffers;
};

struct Root {
    Root() {
        Root::instance = this;
    }

    ~Root() {
        Root::instance = nullptr;
    }

    float cumulativeTime{0};
    float frameTime{0};

    static Root *instance;
};

enum class RenderPriority {
    MIN     = 0,
    MAX     = 0xff,
    DEFAULT = 0x80,
};

enum class RenderPassStage {
    DEFAULT = 100,
    UI      = 200,
};

enum class BatchingSchemes {
    NONE       = 0,
    INSTANCING = 1,
    VB_MERGING = 2,
};

} // namespace scene
} // namespace cc
