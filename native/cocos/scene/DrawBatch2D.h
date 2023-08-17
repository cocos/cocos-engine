/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/RefCounted.h"
//#include "core/scene-graph/Layers.h"
#include "base/Macros.h"
#include "core/scene-graph/Node.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "scene/Define.h"

namespace cc {

class Material;

namespace scene {

class Pass;
class Model;

class DrawBatch2D final : public RefCounted {
public:
    DrawBatch2D() = default;
    ~DrawBatch2D() override = default;

    void clear();
    void fillPass(Material *mat, const gfx::DepthStencilState *depthStencilState, ccstd::hash_t dsHash, const ccstd::vector<IMacroPatch> *patches = nullptr);
    void setInputAssembler(gfx::InputAssembler *ia);
    inline void setFirstIndex(uint32_t index) { _drawInfo.firstIndex = index; }
    inline void setIndexCount(uint32_t count) { _drawInfo.indexCount = count; }

    inline void setDescriptorSet(gfx::DescriptorSet *descriptorSet) { _descriptorSet = descriptorSet; }
    inline void setVisFlags(uint32_t flags) { _visFlags = flags; }
    inline void setModel(Model *model) { _model = model; }

    inline const gfx::DrawInfo &getDrawInfo() const { return _drawInfo; }
    inline gfx::InputAssembler *getInputAssembler() const { return _inputAssembler; }
    inline gfx::DescriptorSet *getDescriptorSet() const { return _descriptorSet; }
    inline uint32_t getVisFlags() const { return _visFlags; }
    inline const ccstd::vector<gfx::Shader *> &getShaders() const { return _shaders; }
    inline const ccstd::vector<IntrusivePtr<Pass>> &getPasses() const { return _passes; }
    inline Model *getModel() const { return _model; }

protected:
    gfx::InputAssembler *_inputAssembler{nullptr}; // IntrusivePtr ?
    gfx::DescriptorSet *_descriptorSet{nullptr};
    uint32_t _visFlags{0};
    ccstd::vector<IntrusivePtr<scene::Pass>> _passes;
    ccstd::vector<gfx::Shader *> _shaders;

    Model *_model{nullptr};
    gfx::DrawInfo _drawInfo;

    CC_DISALLOW_COPY_MOVE_ASSIGN(DrawBatch2D);
};

} // namespace scene
} // namespace cc
