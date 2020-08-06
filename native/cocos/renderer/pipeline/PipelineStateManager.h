#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace gfx {
class InputAssembler;
class PipelineState;
class RenderPass;
}; // namespace gfx

namespace pipeline {
struct PSOInfo;
struct Pass;

class CC_DLL PipelineStateManager {
public:
    static gfx::PipelineState *getOrCreatePipelineStage(const PSOInfo *psoci,
                                                        const Pass *pass,
                                                        const gfx::InputAssembler *inputAssembler,
                                                        gfx::RenderPass *renderPass);

private:
    static map<uint, gfx::PipelineState *> _PSOHashMap;
};

} // namespace pipeline
} // namespace cc
