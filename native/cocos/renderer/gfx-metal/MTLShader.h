#pragma once

#import <Metal/MTLLibrary.h>
#import <Metal/MTLRenderPipeline.h>

NS_CC_BEGIN

class CCMTLShader : public GFXShader
{
public:
    CCMTLShader(GFXDevice* device);
    ~CCMTLShader();
    
    virtual bool initialize(const GFXShaderInfo& info) override;
    virtual void destroy() override;
        
    CC_INLINE id<MTLFunction> getVertMTLFunction() const { return _vertexMTLFunction; }
    CC_INLINE id<MTLFunction> getFragmentMTLFunction() const { return _fragmentMTLFunction; }
    CC_INLINE const std::unordered_map<uint, uint>& getVertexSamplerBindings() const { return _mtlVertexSamplerBindings; }
    CC_INLINE const std::unordered_map<uint, uint>& getFragmentSamplerBindings() const { return _mtlFragmentSamplerBindings; }
    
#ifdef DEBUG_SHADER
    CC_INLINE const std::string& getVertGlslShader() const { return _vertGlslShader; }
    CC_INLINE const std::string& getVertMtlSahder() const { return _vertMtlShader; }
    CC_INLINE const std::string& getFragGlslShader() const { return _fragGlslShader; }
    CC_INLINE const std::string& getFragMtlSahder() const { return _fragMtlShader; }
#endif
    
    
private:
    bool createMTLFunction(const GFXShaderStage&);
    
private:
    id<MTLFunction> _vertexMTLFunction = nil;
    id<MTLFunction> _fragmentMTLFunction = nil;
    std::unordered_map<uint, uint> _mtlVertexSamplerBindings;
    std::unordered_map<uint, uint> _mtlFragmentSamplerBindings;
    
    // For debug
#ifdef DEBUG_SHADER
    std::string _vertGlslShader;
    std::string _vertMtlShader;
    std::string _fragGlslShader;
    std::string _fragMtlShader;
#endif
};

NS_CC_END
