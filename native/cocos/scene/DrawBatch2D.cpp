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

#include "DrawBatch2D.h"

namespace cc {
namespace scene {

    DrawBatch2D::DrawBatch2D() {

    }

    DrawBatch2D::~DrawBatch2D() {

    }

    DrawBatch2D::clear() {
    }

    DrawBatch2D::fillPass(Material *mat, gfx::DepthStencilState *depthStencilState, ccstd::hash_t dsHash = 0, gfx::BlendState *blendState, ccstd::hash_t bsHash = 0, ccstd::vector<IMacroPatch> *patches = nullptr) {
        auto &passes = *mat->getPasses();
        if (passes.empty()) return;
        // shader 长度问题
        uint32_t hashFactor = 0;

        for (uint32_t i = 0; i < passes.size(); ++i) {
            Pass *pass = passes[i];
            if (_passes[i] == NULL) {
                _passes.push_back(new Pass(Root.getInstance()));
            }
            Pass *passInUse = _passes[i];
            pass->update();
            // 可能有负值问题
            // if (bsHash == -1) {bsHash = 0;}
            hashFactor = (dsHash << 16) | bsHash;
            passInUse->initPassFromTarget(pass, depthStencilState, blendState, hashFactor);
            // shader 长度问题
            shaders[i] = passInUse->getShaderVariant(patches);
        }
    }

} // namespace scene
} // namespace cc
