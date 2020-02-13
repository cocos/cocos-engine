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
    
    virtual bool initialize(const GFXPipelineStateInfo& info) override;
    virtual void destroy() override;
    
    void updateBindingBlocks(const GFXBindingLayout*);
    
    CC_INLINE const CCMTLGPUUniformBlockList& getVertexUniformBlocks() const { return _vertexUniformBlocks; }
    CC_INLINE const CCMTLGPUUniformBlockList& getFragmentUniformBlocks() const { return _fragmentUniformBlocks; }
    CC_INLINE CCMTLGPUPipelineState* getGPUPipelineState() const { return _GPUPipelieState; }
    
private:
    static bool matchSamplerName(const char* argumentName, const std::string& samplerName);
    void createMTLDepthStencilState();
    bool createGPUPipelineState();
    bool createMTLRenderPipelineState();
    void setVertexDescriptor(MTLRenderPipelineDescriptor*);
    void setMTLFunctions(MTLRenderPipelineDescriptor*);
    void setFormats(MTLRenderPipelineDescriptor*);
    void setBlendStates(MTLRenderPipelineDescriptor*);
    bool createMTLRenderPipeline(MTLRenderPipelineDescriptor*);
    void bindLayout(MTLRenderPipelineReflection*);
    void bindBuffer(MTLArgument*, bool);
    std::tuple<uint,uint> getBufferBinding(MTLArgument*) const;
    void bindTextureAndSampler(MTLArgument*, bool isVertex);
    void bindTexture(MTLArgument*, uint, bool isVertex);
    void bindSamplerState(MTLArgument*, uint, bool isVertex);
    
private:
    id<MTLRenderPipelineState> _mtlRenderPipelineState = nil;
    id<MTLDepthStencilState> _mtlDepthStencilState = nil;
    CCMTLGPUUniformBlockList _vertexUniformBlocks;
    CCMTLGPUUniformBlockList _fragmentUniformBlocks;
    CCMTLGPUTextureList _vertexTextures;
    CCMTLGPUTextureList _fragmentTextures;
    CCMTLGPUSamplerStateList _vertexSamplerStates;
    CCMTLGPUSamplerStateList _fragmentSamplerStates;
    CCMTLGPUPipelineState* _GPUPipelieState = nullptr;
};

NS_CC_END
