#pragma once

#include "MTLGPUObjects.h"
#include <tuple>

#import <Metal/MTLRenderPipeline.h>
#import <Metal/MTLDepthStencil.h>

namespace cc {

class CCMTLPipelineState : public GFXPipelineState {
public:
    CCMTLPipelineState(GFXDevice *device);
    virtual ~CCMTLPipelineState();

    virtual bool initialize(const GFXPipelineStateInfo &info) override;
    virtual void destroy() override;

    CC_INLINE CCMTLGPUPipelineState *getGPUPipelineState() const { return _GPUPipelieState; }

private:
    static bool matchSamplerName(const char *argumentName, const std::string &samplerName);
    bool createMTLDepthStencilState();
    bool createGPUPipelineState();
    bool createMTLRenderPipelineState();
    void setVertexDescriptor(MTLRenderPipelineDescriptor *);
    void setMTLFunctions(MTLRenderPipelineDescriptor *);
    void setFormats(MTLRenderPipelineDescriptor *);
    void setBlendStates(MTLRenderPipelineDescriptor *);
    bool createMTLRenderPipeline(MTLRenderPipelineDescriptor *);

private:
    id<MTLRenderPipelineState> _mtlRenderPipelineState = nil;
    id<MTLDepthStencilState> _mtlDepthStencilState = nil;
    CCMTLGPUPipelineState *_GPUPipelieState = nullptr;
};

}
