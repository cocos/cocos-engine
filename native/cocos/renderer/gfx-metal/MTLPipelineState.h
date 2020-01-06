#pragma once

#include "MTLGPUObjects.h"
#include <tuple>

#import <Metal/MTLRenderPipeline.h>
#import <Metal/MTLDepthStencil.h>

NS_CC_BEGIN

class CCMTLPipelineState : public GFXPipelineState
{
public:
    CCMTLPipelineState(GFXDevice* device);
    virtual ~CCMTLPipelineState();
    
    virtual bool Initialize(const GFXPipelineStateInfo& info) override;
    virtual void Destroy() override;
    
    void bindBuffer(GFXBindingLayout*);
    
    CC_INLINE const CCMTLGPUUniformBlockList& getVertexUniformBlocks() const { return _vertexUniformBlocks; }
    CC_INLINE const CCMTLGPUUniformBlockList& getFragmentUniformBlocks() const { return _fragmentUniformBlocks; }
    CC_INLINE CCMTLGPUPipelineState* getGPUPipelineState() const { return _GPUPipelieState; }
    
private:
    void createMTLDepthStencilState();
    bool createGPUPipelineState();
    bool createMTLRenderPipelineState();
    void setVertexDescriptor(MTLRenderPipelineDescriptor*);
    void setMTLFunctions(MTLRenderPipelineDescriptor*);
    void setFormats(MTLRenderPipelineDescriptor*);
    void setBlendStates(MTLRenderPipelineDescriptor*);
    bool createMTLRenderPipeline(MTLRenderPipelineDescriptor*);
    void bindBuffer(MTLRenderPipelineReflection*);
    std::tuple<uint,uint> getBufferbinding(MTLArgument*) const;
    
private:
    id<MTLRenderPipelineState> _mtlRenderPipelineState = nil;
    id<MTLDepthStencilState> _mtlDepthStencilState = nil;
    CCMTLGPUUniformBlockList _vertexUniformBlocks;
    CCMTLGPUUniformBlockList _fragmentUniformBlocks;
    CCMTLGPUPipelineState* _GPUPipelieState = nullptr;
};

NS_CC_END
