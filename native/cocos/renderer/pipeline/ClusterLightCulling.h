/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "cocos/renderer/gfx-base/GFXDef.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"
#include "cocos/renderer/pipeline/RenderPipeline.h"
#include "cocos/scene/Pass.h"
#include "cocos/scene/RenderScene.h"

namespace cc {
namespace pipeline {
struct ShaderStrings {
    String glsl4;
    String glsl3;
    String glsl1;
};

class ClusterLightCulling {
public:
    explicit ClusterLightCulling(RenderPipeline* pipeline) : _pipeline(pipeline){};
    ~ClusterLightCulling();

    static constexpr uint CLUSTERS_X = 16;
    static constexpr uint CLUSTERS_Y = 8;
    static constexpr uint CLUSTERS_Z = 24;

    // z threads varies to meet limit number of threads
    static constexpr uint CLUSTERS_X_THREADS = 16;
    static constexpr uint CLUSTERS_Y_THREADS = 8;

    uint clusterZThreads = 1;

    static constexpr uint CLUSTER_COUNT = CLUSTERS_X * CLUSTERS_Y * CLUSTERS_Z;

    static constexpr uint MAX_LIGHTS_PER_CLUSTER = 100;

    static constexpr uint MAX_LIGHTS_GLOBAL = 1000;

    void initialize(gfx::Device* dev);

    void clusterLightCulling(scene::Camera* camera);

    inline const gfx::DescriptorSet* getBuildingDescriptorSet() const { return _buildingDescriptorSet; }
    inline const gfx::PipelineState* getBuildingPipelineState() const { return _buildingPipelineState; }
    inline const gfx::DescriptorSet* getResetCounterDescriptorSet() const { return _resetCounterDescriptorSet; }
    inline const gfx::PipelineState* getResetCounterPipelineState() const { return _resetCounterPipelineState; }
    inline const gfx::DescriptorSet* getCullingDescriptorSet() const { return _cullingDescriptorSet; }
    inline const gfx::PipelineState* getCullingPipelineState() const { return _cullingPipelineState; }

    inline const gfx::Buffer* getConstantsBuffer() const { return _constantsBuffer; }

    inline const gfx::DispatchInfo& getBuildingDispatchInfo() const { return _buildingDispatchInfo; }
    inline const gfx::DispatchInfo& getResetCounterDispatchInfo() const { return _resetDispatchInfo; }
    inline const gfx::DispatchInfo& getCullingDispatchInfo() const { return _cullingDispatchInfo; }

    inline bool isInitialized() const { return _initialized; }

private:
    String& getShaderSource(ShaderStrings& sources);

    void initBuildingSatge();

    void initResetStage();

    void initCullingStage();

    void update();

    void updateLights();

    static bool isProjMatChange(const Mat4& curProj, const Mat4& oldProj) {
        for (uint i = 0; i < sizeof(curProj.m) / sizeof(float); i++) {
            if (math::IsNotEqualF(curProj.m[i], oldProj.m[i])) {
                return true;
            }
        }
        return false;
    }

    gfx::Device*    _device{nullptr};
    scene::Camera*  _camera{nullptr};
    RenderPipeline* _pipeline{nullptr};

    gfx::Shader*              _buildingShader{nullptr};
    gfx::DescriptorSetLayout* _buildingDescriptorSetLayout{nullptr};
    gfx::PipelineLayout*      _buildingPipelineLayout{nullptr};
    gfx::PipelineState*       _buildingPipelineState{nullptr};
    gfx::DescriptorSet*       _buildingDescriptorSet{nullptr};

    gfx::Shader*              _resetCounterShader{nullptr};
    gfx::DescriptorSetLayout* _resetCounterDescriptorSetLayout{nullptr};
    gfx::PipelineLayout*      _resetCounterPipelineLayout{nullptr};
    gfx::PipelineState*       _resetCounterPipelineState{nullptr};
    gfx::DescriptorSet*       _resetCounterDescriptorSet{nullptr};

    gfx::Shader*              _cullingShader{nullptr};
    gfx::DescriptorSetLayout* _cullingDescriptorSetLayout{nullptr};
    gfx::PipelineLayout*      _cullingPipelineLayout{nullptr};
    gfx::PipelineState*       _cullingPipelineState{nullptr};
    gfx::DescriptorSet*       _cullingDescriptorSet{nullptr};

    static constexpr uint NEAR_FAR_OFFSET     = 0;
    static constexpr uint VIEW_PORT_OFFSET    = 4;
    static constexpr uint MAT_VIEW_OFFSET     = 8;
    static constexpr uint MAT_PROJ_INV_OFFSET = 24;

    std::array<float, (2 * sizeof(Vec4) + 2 * sizeof(Mat4)) / sizeof(float)> _constants{};
    gfx::Buffer*                                                             _constantsBuffer{nullptr};

    vector<scene::Light*> _validLights;
    std::vector<float>    _lightBufferData;

    gfx::GeneralBarrier* _resetBarrier{nullptr};

    gfx::DispatchInfo _buildingDispatchInfo;
    gfx::DispatchInfo _resetDispatchInfo;
    gfx::DispatchInfo _cullingDispatchInfo;

    bool  _lightBufferResized{false};
    uint  _lightBufferStride{0};
    uint  _lightBufferCount{0};
    float _lightMeterScale{10000.0F};

    // only rebuild clusters when camera project matrix changed
    bool         _rebuildClusters{false};
    vector<Mat4> _oldCamProjMats;

    bool _initialized{false};
};

} // namespace pipeline
} // namespace cc
