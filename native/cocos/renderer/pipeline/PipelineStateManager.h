#pragma once

#include "core/CoreStd.h"

namespace cc {
struct PSOCreateInfo;

namespace gfx {
class Device;
class InputAssembler;
class PipelineState;
class RenderPass;
};

namespace pipeline {

class CC_DLL PipelineStateManager {
public:
    static gfx::PipelineState *getOrCreatePipelineStage(gfx::Device *device,
                                                           const PSOCreateInfo &PSOInfo,
                                                           gfx::RenderPass *renderPass,
                                                           gfx::InputAssembler *inputAssembler);
    
private:
    static map<uint, gfx::PipelineState *> _PSOHashMap;
};

} // namespace pipeline
} // namespace cc
