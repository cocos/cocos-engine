#pragma once

#import <Metal/MTLLibrary.h>
#import <Metal/MTLRenderPipeline.h>

NS_CC_BEGIN

class CCMTLShader : public GFXShader
{
public:
    CCMTLShader(GFXDevice* device);
    ~CCMTLShader();
    
    virtual bool Initialize(const GFXShaderInfo& info) override;
    virtual void destroy() override;
        
    CC_INLINE id<MTLFunction> getVertMTLFunction() const { return _vertexMTLFunction; }
    CC_INLINE id<MTLFunction> getFragmentMTLFunction() const { return _fragmentMTLFunction; }
    
private:
    bool createMTLFunction(const GFXShaderStage&);
    
private:
    id<MTLFunction> _vertexMTLFunction = nil;
    id<MTLFunction> _fragmentMTLFunction = nil;
};

NS_CC_END
