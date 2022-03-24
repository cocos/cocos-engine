/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
#include "renderer/gfx-base/GFXDescriptorSet.h"
#include "renderer/gfx-base/GFXInputAssembler.h"
#include "renderer/gfx-base/GFXShader.h"
#include "scene/Define.h"

namespace cc {
namespace scene {

class Pass;
class Model;

class SubModel final {
public:
    SubModel();
    SubModel(const SubModel &) = delete;
    SubModel(SubModel &&)      = delete;
    ~SubModel();
    SubModel &operator=(const SubModel &) = delete;
    SubModel &operator=(SubModel &&) = delete;

    void update();

    gfx::Shader *getShader(uint) const;
    Pass *       getPass(uint) const;

    inline void setShaders(const std::vector<gfx::Shader *> &shaders) { _shaders = shaders; }
    inline void setPasses(const std::vector<Pass *> &passes) { _passes = passes; }
    inline void setDescriptorSet(gfx::DescriptorSet *descriptorSet) { _descriptSet = descriptorSet; }
    inline void setWorldBoundDescriptorSet(gfx::DescriptorSet *descriptorSet) { _worldBoundDescriptorSet = descriptorSet; }
    inline void setInputAssembler(gfx::InputAssembler *ia) { _ia = ia; }
    inline void setPlanarInstanceShader(gfx::Shader *shader) { _planarInstanceShader = shader; }
    inline void setPlanarShader(gfx::Shader *shader) { _planarShader = shader; }
    inline void setPriority(RenderPriority priority) { _priority = priority; }
    inline void setOwner(Model *model) { _owner = model; }
    inline void setSubMeshBuffers(const std::vector<cc::scene::FlatBuffer> &flatBuffers) {
        if (!_subMesh) {
            _subMesh = new RenderingSubMesh();
        }
        _subMesh->flatBuffers = flatBuffers;
    }

    inline gfx::DescriptorSet *        getDescriptorSet() const { return _descriptSet; }
    inline gfx::DescriptorSet *        getWorldBoundDescriptorSet() const { return _worldBoundDescriptorSet; }
    inline gfx::InputAssembler *       getInputAssembler() const { return _ia; }
    inline std::vector<gfx::Shader *> &getShaders() { return _shaders; }
    inline const std::vector<Pass *> & getPasses() const { return _passes; }
    inline gfx::Shader *               getPlanarInstanceShader() const { return _planarInstanceShader; }
    inline gfx::Shader *               getPlanarShader() const { return _planarShader; }
    inline RenderPriority              getPriority() const { return _priority; }
    inline RenderingSubMesh *          getSubMesh() const { return _subMesh; }
    inline Model *                     getOwner() const { return _owner; }
    inline uint32_t                    getId() const { return _id; }

private:
    static inline uint32_t generateId() {
        static uint32_t generator = 0;
        return generator++;
    }

    RenderPriority             _priority{RenderPriority::DEFAULT};
    gfx::Shader *              _planarShader{nullptr};
    gfx::Shader *              _planarInstanceShader{nullptr};
    gfx::DescriptorSet *       _descriptSet{nullptr};
    gfx::DescriptorSet *       _worldBoundDescriptorSet{nullptr};
    gfx::InputAssembler *      _ia{nullptr};
    RenderingSubMesh *         _subMesh{nullptr};
    std::vector<Pass *>        _passes;
    std::vector<gfx::Shader *> _shaders;
    Model *                    _owner{nullptr};
    uint32_t                   _id = -1;
};

} // namespace scene
} // namespace cc
