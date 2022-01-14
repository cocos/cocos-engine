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

#include <cstdint>
#include <vector>
#include "base/RefCounted.h"
#include "core/assets/RenderingSubMesh.h"
#include "renderer/gfx-base/GFXDescriptorSet.h"
#include "renderer/gfx-base/GFXInputAssembler.h"
#include "renderer/gfx-base/GFXShader.h"
#include "renderer/pipeline/Define.h"
#include "scene/Define.h"

namespace cc {
namespace scene {
class Pass;
class SubModel : public RefCounted {
public:
    SubModel();
    ~SubModel() override = default;

    void update();

    gfx::Shader *getShader(uint) const;
    Pass *       getPass(uint) const;

    inline void setWorldBoundDescriptorSet(gfx::DescriptorSet *descriptorSet) { _worldBoundDescriptorSet = descriptorSet; }
    inline void setDescriptorSet(gfx::DescriptorSet *descriptorSet) { _descriptorSet = descriptorSet; }
    inline void setInputAssembler(gfx::InputAssembler *ia) { _inputAssembler = ia; }
    inline void setShaders(const std::vector<IntrusivePtr<gfx::Shader>> &shaders) { _shaders = shaders; }
    void        setPasses(const std::shared_ptr<std::vector<IntrusivePtr<Pass>>> &passes);
    inline void setPlanarInstanceShader(gfx::Shader *shader) { _planarInstanceShader = shader; }
    inline void setPlanarShader(gfx::Shader *shader) { _planarShader = shader; }
    inline void setPriority(pipeline::RenderPriority priority) { _priority = priority; }
    inline void setOwner(Model *model) { _owner = model; }
    void        setSubMesh(RenderingSubMesh *subMesh);

    inline gfx::DescriptorSet *                          getDescriptorSet() const { return _descriptorSet; }
    inline gfx::DescriptorSet *                          getWorldBoundDescriptorSet() const { return _worldBoundDescriptorSet; }
    inline gfx::InputAssembler *                         getInputAssembler() const { return _inputAssembler; }
    inline const std::vector<IntrusivePtr<gfx::Shader>> &getShaders() const { return _shaders; }
    inline const std::vector<IntrusivePtr<Pass>> &       getPasses() const { return *_passes; }
    inline const std::vector<IMacroPatch> &              getPatches() const { return _patches; }
    inline gfx::Shader *                                 getPlanarInstanceShader() const { return _planarInstanceShader; }
    inline gfx::Shader *                                 getPlanarShader() const { return _planarShader; }
    inline pipeline::RenderPriority                      getPriority() const { return _priority; }
    inline RenderingSubMesh *                            getSubMesh() const { return _subMesh; }
    inline Model *                                       getOwner() const { return _owner; }
    inline uint32_t                                      getId() const { return _id; }

    void initialize(RenderingSubMesh *subMesh, const std::shared_ptr<std::vector<IntrusivePtr<Pass>>> &passes, const std::vector<IMacroPatch> &patches);
    void initPlanarShadowShader();
    void initPlanarShadowInstanceShader();
    void destroy();
    void onPipelineStateChanged();
    void onMacroPatchesStateChanged(const std::vector<IMacroPatch> &patches);

protected:
    void flushPassInfo();

    gfx::Device *                     _device{nullptr};
    std::vector<IMacroPatch>          _patches;
    IntrusivePtr<gfx::InputAssembler> _inputAssembler;
    IntrusivePtr<gfx::DescriptorSet>  _descriptorSet;
    IntrusivePtr<gfx::DescriptorSet>  _worldBoundDescriptorSet;

    IntrusivePtr<gfx::Texture>                       _reflectionTex;
    gfx::Sampler *                                   _reflectionSampler{nullptr};
    pipeline::RenderPriority                         _priority{pipeline::RenderPriority::DEFAULT};
    IntrusivePtr<gfx::Shader>                        _planarShader;
    IntrusivePtr<gfx::Shader>                        _planarInstanceShader;
    IntrusivePtr<RenderingSubMesh>                   _subMesh;
    std::shared_ptr<std::vector<IntrusivePtr<Pass>>> _passes;
    std::vector<IntrusivePtr<gfx::Shader>>           _shaders;
    Model *                                          _owner{nullptr};
    int32_t                                          _id{-1};

private:
    static inline int32_t generateId() {
        static int32_t generator = 0;
        return generator++;
    }

    CC_DISALLOW_COPY_MOVE_ASSIGN(SubModel);
};

} // namespace scene
} // namespace cc
