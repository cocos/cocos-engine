#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace gfx {
class InputAssembler;
class PipelineState;
class RenderPass;
struct PipelineStateInfo;
}; // namespace gfx

namespace pipeline {

class CC_DLL PipelineStateManager {
public:
    static gfx::PipelineState *getOrCreatePipelineStage(uint psociID,
                                                        uint passID,
                                                        const gfx::InputAssembler *inputAssembler,
                                                        gfx::RenderPass *renderPass);

private:
    static map<uint, gfx::PipelineState *> _PSOHashMap;
};

} // namespace pipeline
} // namespace cc
