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
    static gfx::PipelineState *getOrCreatePipelineStage(const gfx::PipelineStateInfo *psoci,
                                                        const gfx::InputAssembler *inputAssembler,
                                                        size_t passHash,
                                                        gfx::RenderPass *renderPass);

private:
    static map<uint, gfx::PipelineState *> _PSOHashMap;
};

} // namespace pipeline
} // namespace cc
