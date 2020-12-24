#pragma once
#include "pipeline/RenderPipeline.h"

namespace cc {
namespace pipeline {

class CC_DLL UIPhase {
public:
    UIPhase () = default;
    void activate(RenderPipeline* pipeline);
    void render(Camera *camera, gfx::RenderPass* renderPass);
protected:
    RenderPipeline *_pipeline = nullptr;
    uint _phaseID = 0;
};

}
}


