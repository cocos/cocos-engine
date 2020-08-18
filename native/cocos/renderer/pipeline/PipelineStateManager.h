#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace gfx {
class InputAssembler;
class PipelineState;
class RenderPass;
}; // namespace gfx

namespace pipeline {
struct PassView;

class CC_DLL PipelineStateManager {
public:
    static gfx::PipelineState *getOrCreatePipelineState(const PassView *pass,
                                                        gfx::Shader *shader,
                                                        gfx::InputAssembler *inputAssembler,
                                                        gfx::RenderPass *renderPass);

private:
    static map<uint, gfx::PipelineState *> _PSOHashMap;
};

} // namespace pipeline
} // namespace cc
