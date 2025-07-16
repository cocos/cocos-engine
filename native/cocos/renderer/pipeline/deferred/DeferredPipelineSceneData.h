/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include "base/Ptr.h"
#include "renderer/pipeline/PipelineSceneData.h"

#define BLOOM_PREFILTERPASS_INDEX  0
#define BLOOM_DOWNSAMPLEPASS_INDEX 1
#define BLOOM_UPSAMPLEPASS_INDEX   (BLOOM_DOWNSAMPLEPASS_INDEX + 1)
#define BLOOM_COMBINEPASS_INDEX    (BLOOM_UPSAMPLEPASS_INDEX + 1)

namespace cc {
namespace pipeline {

enum class AntiAliasing {
    NONE,
    FXAA
};

class DeferredPipelineSceneData : public PipelineSceneData {
public:
    DeferredPipelineSceneData();
    ~DeferredPipelineSceneData() override;

    void activate(gfx::Device *device) override;
    void updatePipelineSceneData() override;

    void initPipelinePassInfo();

    void setAntiAliasing(AntiAliasing value);
    inline AntiAliasing getAntiAliasing() const { return _antiAliasing; }

    inline Material *getBloomMaterial() const { return _bloomMaterial; }
    inline void setBloomMaterial(Material *mat) {
        if (mat == _bloomMaterial.get()) {
            return;
        }
        _bloomMaterial = mat;
        updatePipelinePassInfo();
    }

    inline Material *getPostProcessMaterial() const { return _postProcessMaterial; }
    inline void setPostProcessMaterial(Material *mat) {
        if (mat == _postProcessMaterial.get()) {
            return;
        }
        _postProcessMaterial = mat;
        updatePipelinePassInfo();
    }

    inline void setLightingMaterial(Material *mat) { _lightingMaterial = mat; }
    inline Material *getLightingMaterial() const { return _lightingMaterial; }
    inline gfx::Shader *getLightPassShader() const { return _lightPassShader; }
    inline scene::Pass *getLightPass() const { return _lightPass; }
    inline gfx::Shader *getBloomPrefilterPassShader() const { return _bloomPrefilterPassShader; }
    inline scene::Pass *getBloomPrefilterPass() const { return _bloomPrefilterPass; }
    inline const ccstd::vector<scene::Pass *> &getBloomUpSamplePasses() const { return _bloomUpSamplePasses; }
    inline gfx::Shader *getBloomUpSamplePassShader() const { return _bloomUpSamplePassShader; }
    inline const ccstd::vector<scene::Pass *> &getBloomDownSamplePasses() const { return _bloomDownSamplePasses; }
    inline gfx::Shader *getBloomDownSamplePassShader() const { return _bloomDownSamplePassShader; }
    inline scene::Pass *getBloomCombinePass() const { return _bloomCombinePass; }
    inline gfx::Shader *getBloomCombinePassShader() const { return _bloomCombinePassShader; }

    inline gfx::Shader *getPostPassShader() const { return _postPassShader; }
    inline scene::Pass *getPostPass() const { return _postPass; }

private:
    void updateBloomPass();
    void updatePostProcessPass();
    void updatePipelinePassInfo();
    void updateDeferredPassInfo();
    void updateDeferredLightPass();

    IntrusivePtr<Material> _postProcessMaterial;
    gfx::Shader *_postPassShader{nullptr}; // weak reference
    scene::Pass *_postPass{nullptr};       // weak reference

    IntrusivePtr<Material> _lightingMaterial;
    gfx::Shader *_lightPassShader{nullptr}; // weak reference
    scene::Pass *_lightPass{nullptr};       // weak reference

    IntrusivePtr<Material> _bloomMaterial;
    scene::Pass *_bloomPrefilterPass{nullptr};           // weak reference
    gfx::Shader *_bloomPrefilterPassShader{nullptr};     // weak reference
    scene::Pass *_bloomCombinePass{nullptr};             // weak reference
    gfx::Shader *_bloomCombinePassShader{nullptr};       // weak reference
    ccstd::vector<scene::Pass *> _bloomUpSamplePasses;   // weak reference
    gfx::Shader *_bloomUpSamplePassShader{nullptr};      // weak reference
    ccstd::vector<scene::Pass *> _bloomDownSamplePasses; // weak reference
    gfx::Shader *_bloomDownSamplePassShader{nullptr};    // weak reference

    AntiAliasing _antiAliasing{AntiAliasing::NONE};
};

} // namespace pipeline
} // namespace cc
