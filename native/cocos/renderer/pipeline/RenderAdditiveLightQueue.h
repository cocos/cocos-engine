#pragma once

#include "core/CoreStd.h"

namespace cc {
class SubModel;
struct PSOCreateInfo;
class Light;
class RenderObject;
class Pass;
struct MacroPatch;

namespace pipeline {

class RenderAdditiveLightQueue : public gfx::Object {
public:
    RenderAdditiveLightQueue() = default;
    ~RenderAdditiveLightQueue() = default;
    
    void add(RenderObject *renderObj, uint subModelIdx, Pass *pass, uint beginIdx, uint endIdx);
    void clear(const gfx::vector<Light *> &validLights,
               const gfx::vector<gfx::GFXBuffer *> &lightBuffers,
               const gfx::vector<uint> &lightIndices);
    void recordCommandBuffer(gfx::GFXDevice *device, gfx::GFXRenderPass *renderPass, gfx::GFXCommandBuffer *cmdBuff);
    
private:
    void attach(RenderObject *renderObj, uint subModelIdx, gfx::GFXBuffer *lightBuffer,
                uint lightIdx, Pass *pass, gfx::vector<MacroPatch> patches);

private:
    gfx::vector<gfx::vector<SubModel *>> _sortedSubModelsArray;
    gfx::vector<gfx::vector<PSOCreateInfo>> _sortedPSOCIArray;
    gfx::vector<Light *> _validLights;
    gfx::vector<gfx::GFXBuffer *> _lightBuffers;
    gfx::vector<uint> _lightIndices;
    uint _phaseID = 0;
};

} // namespace pipeline
} // namespace cc
