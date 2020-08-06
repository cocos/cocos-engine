#include "RenderAdditiveLightQueue.h"

namespace cc {
namespace pipeline {
void RenderAdditiveLightQueue::add(const RenderObject *renderObj, uint subModelIdx, Pass *pass, uint beginIdx, uint endIdx) {
    
}

void RenderAdditiveLightQueue::clear(const vector<Light *> &validLights,
                                     const vector<gfx::Buffer *> &lightBuffers,
                                     const vector<uint> &lightIndices) {
    _validLights = validLights;
    _lightBuffers = lightBuffers;
    _lightIndices = lightIndices;
    const auto validLightCount = validLights.size();
    _sortedSubModelsArray.resize(validLightCount);
    _sortedPSOCIArray.resize(validLightCount);
    for(size_t i = 0; i < validLightCount; ++i) {
        if (_sortedPSOCIArray[i].size()) {
            _sortedSubModelsArray[i].clear();
            _sortedPSOCIArray[i].clear();
        }
    }

}

void RenderAdditiveLightQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff) {
    
}
    

void RenderAdditiveLightQueue::attach(RenderObject *renderObj,
                                      uint subModelIdx,
                                      gfx::Buffer *lightBuffer,
                                      uint lightIdx,
                                      Pass *pass,
                                      vector<MacroPatch> patches) {
    
}

} // namespace pipeline
} // namespace cc

