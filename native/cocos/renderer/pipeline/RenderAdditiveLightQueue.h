#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace pipeline {
struct SubModel;
struct Light;
struct RenderObject;
struct Pass;
class DefineMap;

class RenderAdditiveLightQueue : public Object {
public:
    RenderAdditiveLightQueue() = default;
    ~RenderAdditiveLightQueue() = default;

    void add(const RenderObject *renderObj, uint subModelIdx, Pass *pass, uint beginIdx, uint endIdx);
    void clear(const vector<Light *> &validLights,
               const vector<gfx::Buffer *> &lightBuffers,
               const vector<uint> &lightIndices);
    void recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff);

private:
    void attach(RenderObject *renderObj, uint subModelIdx, gfx::Buffer *lightBuffer,
                uint lightIdx, Pass *pass, const vector<DefineMap> &patches);

private:
    vector<vector<SubModel *>> _sortedSubModelsArray;
    vector<vector<uint>> _sortedPSOCIArray;
    vector<Light *> _validLights;
    vector<gfx::Buffer *> _lightBuffers;
    vector<uint> _lightIndices;
    uint _phaseID = 0;
};

} // namespace pipeline
} // namespace cc
