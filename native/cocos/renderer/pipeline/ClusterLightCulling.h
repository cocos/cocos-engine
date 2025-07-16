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

#include "cocos/renderer/gfx-base/GFXDef.h"
#include "cocos/scene/Pass.h"
#include "cocos/scene/RenderScene.h"

namespace cc {
namespace pipeline {
class RenderPipeline;
struct ShaderStrings {
    ccstd::string glsl4;
    ccstd::string glsl3;
    ccstd::string glsl1;
};

class ClusterLightCulling {
public:
    explicit ClusterLightCulling(RenderPipeline *pipeline);
    ~ClusterLightCulling();

    static constexpr uint32_t CLUSTERS_X = 16;
    static constexpr uint32_t CLUSTERS_Y = 8;
    static constexpr uint32_t CLUSTERS_Z = 24;

    // z threads varies to meet limit number of threads
    static constexpr uint32_t CLUSTERS_X_THREADS = 16;
    static constexpr uint32_t CLUSTERS_Y_THREADS = 8;

    uint32_t clusterZThreads = 1;

    static constexpr uint32_t CLUSTER_COUNT = CLUSTERS_X * CLUSTERS_Y * CLUSTERS_Z;

    static constexpr uint32_t MAX_LIGHTS_PER_CLUSTER = 200;

    static constexpr uint32_t MAX_LIGHTS_GLOBAL = 1000;

    void initialize(gfx::Device *dev);

    void clusterLightCulling(scene::Camera *camera);

private:
    ccstd::string &getShaderSource(ShaderStrings &sources);

    void initBuildingSatge();

    void initResetStage();

    void initCullingStage();

    void update();

    void updateLights();

    static bool isProjMatChange(const Mat4 &curProj, const Mat4 &oldProj) {
        for (uint32_t i = 0; i < sizeof(curProj.m) / sizeof(float); i++) {
            if (math::isNotEqualF(curProj.m[i], oldProj.m[i])) {
                return true;
            }
        }
        return false;
    }

    // weak reference
    gfx::Device *_device{nullptr};
    IntrusivePtr<scene::Camera> _camera;
    // weak reference
    RenderPipeline *_pipeline{nullptr};

    IntrusivePtr<gfx::Shader> _buildingShader;
    IntrusivePtr<gfx::DescriptorSetLayout> _buildingDescriptorSetLayout;
    IntrusivePtr<gfx::PipelineLayout> _buildingPipelineLayout;
    IntrusivePtr<gfx::PipelineState> _buildingPipelineState;
    IntrusivePtr<gfx::DescriptorSet> _buildingDescriptorSet;

    IntrusivePtr<gfx::Shader> _resetCounterShader;
    IntrusivePtr<gfx::DescriptorSetLayout> _resetCounterDescriptorSetLayout;
    IntrusivePtr<gfx::PipelineLayout> _resetCounterPipelineLayout;
    IntrusivePtr<gfx::PipelineState> _resetCounterPipelineState;
    IntrusivePtr<gfx::DescriptorSet> _resetCounterDescriptorSet;

    IntrusivePtr<gfx::Shader> _cullingShader;
    IntrusivePtr<gfx::DescriptorSetLayout> _cullingDescriptorSetLayout;
    IntrusivePtr<gfx::PipelineLayout> _cullingPipelineLayout;
    IntrusivePtr<gfx::PipelineState> _cullingPipelineState;
    IntrusivePtr<gfx::DescriptorSet> _cullingDescriptorSet;

    static constexpr uint32_t NEAR_FAR_OFFSET = 0;
    static constexpr uint32_t VIEW_PORT_OFFSET = 4;
    static constexpr uint32_t MAT_VIEW_OFFSET = 8;
    static constexpr uint32_t MAT_PROJ_INV_OFFSET = 24;

    ccstd::array<float, (2 * sizeof(Vec4) + 2 * sizeof(Mat4)) / sizeof(float)> _constants{};
    IntrusivePtr<gfx::Buffer> _constantsBuffer;

    // weak reference
    ccstd::vector<scene::Light *> _validLights;
    ccstd::vector<float> _lightBufferData;

    // weak reference
    gfx::GeneralBarrier *_resetBarrier{nullptr};

    gfx::DispatchInfo _buildingDispatchInfo;
    gfx::DispatchInfo _resetDispatchInfo;
    gfx::DispatchInfo _cullingDispatchInfo;

    bool _lightBufferResized{false};
    uint32_t _lightBufferStride{0};
    uint32_t _lightBufferCount{0};
    float _lightMeterScale{10000.0F};

    // only rebuild clusters when camera project matrix changed
    bool _rebuildClusters{false};
    ccstd::vector<Mat4> _oldCamProjMats;

    bool _initialized{false};
};

} // namespace pipeline
} // namespace cc
