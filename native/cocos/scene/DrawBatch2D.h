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

    inline void setInputAssembler(gfx::InputAssembler *ia) { _inputAssembler = ia; }
    inline void setDescriptorSet(gfx::DescriptorSet *descriptorSet) { _descriptorSet = descriptorSet; }
    inline void setVisFlags(uint32_t flags) { _visFlags = flags; }
    inline void setUseLocalFlag(Node *node) { _useLocalData = node; }
    inline void setModel(Model *model) { _model = model; }

    inline gfx::InputAssembler *getInputAssembler() const { return _inputAssembler; }
    inline gfx::DescriptorSet *getDescriptorSet() const { return _descriptorSet; }
    inline uint32_t getVisFlags() const { return _visFlags; }
    inline const ccstd::vector<gfx::Shader *> &getShaders() const { return _shaders; }
    inline const ccstd::vector<IntrusivePtr<Pass>> &getPasses() const { return _passes; }
    inline Node *getUseLocalFlag() const { return _useLocalData; }
    inline Model *getModel() const { return _model; }

protected:
    gfx::InputAssembler *_inputAssembler{nullptr}; // IntrusivePtr ?
    gfx::DescriptorSet *_descriptorSet{nullptr};
    uint32_t _visFlags{0};
    ccstd::vector<IntrusivePtr<scene::Pass>> _passes;
    ccstd::vector<gfx::Shader *> _shaders;

    Node *_useLocalData{nullptr}; // May don`t need
    Model *_model{nullptr};

    CC_DISALLOW_COPY_MOVE_ASSIGN(DrawBatch2D);
};

} // namespace scene
} // namespace cc
