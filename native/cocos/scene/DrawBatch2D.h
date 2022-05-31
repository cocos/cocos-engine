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

#include "renderer/gfx-base/GFXDef-common.h"
#include "core/scene-graph/Layers.h"

namespace cc {
namespace scene {

class Pass;

class DrawBatch2D : public RefCounted {
public:
    DrawBatch2D();
    ~DrawBatch2D();

    void clear();
    void fillPass(Material *mat, gfx::DepthStencilState *depthStencilState, ccstd::hash_t dsHash, gfx::BlendState *blendState, ccstd::hash_t bsHash, ccstd::vector<IMacroPatch> *patches = nullptr);

    inline void setInputAssembler(gfx::InputAssembler *ia) { _inputAssembler = ia; }
    inline void setDescriptorSet(gfx::DescriptorSet *descriptorSet) { _descriptorSet = descriptorSet; }
    inline void setVisFlags(uint32_t flags) { _visFlags = flags; }
    inline void setUseLocalFlag(Node *node) { _useLocalData = node; }
    inline void setModel(Model *model) { _model = model; }
    
    inline gfx::InputAssembler *getInputAssembler() const { return _inputAssembler; }
    inline gfx::DescriptorSet *getDescriptorSet() const { return _descriptorSet; }
    inline uint32_t getVisFlags() const { return _visFlags; }
    inline ccstd::vector<gfx::Shader *> getShaders() const { return _shaders; }
    inline ccstd::vector<Pass>* getPasses() { return &_passes; }
    inline Node *getUseLocalFlag() const { return _useLocalData; }
    inline Model *getModel() const { return _model; }

protected:
    gfx::InputAssembler *_inputAssembler{nullptr}; // IntrusivePtr ?
    gfx::DescriptorSet *_descriptorSet{nullptr};
    uint32_t _visFlags{0};
    ccstd::vector<Pass> _passes;
    ccstd::vector<gfx::Shader *> _shaders;

    gfx::Texture *_texture{nullptr}; // Or use DS?
    gfx::Sampler *_sampler{nullptr}; // Or use DS?
    uint32_t textureHash{0}; // May don`t need
    uint32_t samplerHash{0}; // May don`t need

    Node *_useLocalData{nullptr}; // May don`t need
    Model *_model{nullptr};
};

} // namespace scene
} // namespace cc
