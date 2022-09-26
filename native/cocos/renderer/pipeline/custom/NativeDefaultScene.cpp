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

SceneTask* DefaultForwardLightingTransversal::transverse(SceneVisitor *visitor) const {
    std::ignore = visitor;
    return nullptr;
}

} // namespace render

} // namespace cc
