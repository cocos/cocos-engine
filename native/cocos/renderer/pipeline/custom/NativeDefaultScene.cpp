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

#include "NativePipelineTypes.h"

namespace cc {

namespace render {

const pipeline::PipelineSceneData *DefaultSceneVisitor::getPipelineSceneData() const {
    return nullptr;
}

void DefaultSceneVisitor::setViewport(const gfx::Viewport &vp) {}
void DefaultSceneVisitor::setScissor(const gfx::Rect &rect) {}
void DefaultSceneVisitor::bindPipelineState(gfx::PipelineState *pso) {}
void DefaultSceneVisitor::bindDescriptorSet(uint32_t set, gfx::DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) {}
void DefaultSceneVisitor::bindInputAssembler(gfx::InputAssembler *ia) {}
void DefaultSceneVisitor::updateBuffer(gfx::Buffer *buff, const void *data, uint32_t size) {}
void DefaultSceneVisitor::draw(const gfx::DrawInfo &info) {}

SceneTask *DefaultForwardLightingTransversal::transverse(SceneVisitor *visitor) const {
    std::ignore = visitor;
    return nullptr;
}

} // namespace render

} // namespace cc
