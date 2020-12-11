#pragma once

#import <Metal/MTLLibrary.h>
#import <Metal/MTLRenderPipeline.h>

namespace cc {
namespace gfx {
class CCMTLGPUShader;
class CCMTLShader : public Shader {
public:
    CCMTLShader(Device *device);
    ~CCMTLShader() = default;

    virtual bool initialize(const ShaderInfo &info) override;
    virtual void destroy() override;

    CC_INLINE id<MTLFunction> getVertMTLFunction() const { return _vertexMTLFunction; }
    CC_INLINE id<MTLFunction> getFragmentMTLFunction() const { return _fragmentMTLFunction; }
    CC_INLINE const unordered_map<uint, uint> &getVertexSamplerBindings() const { return _mtlVertexSamplerBindings; }
    CC_INLINE const unordered_map<uint, uint> &getFragmentSamplerBindings() const { return _mtlFragmentSamplerBindings; }
    CC_INLINE const CCMTLGPUShader *gpuShader() const { return _gpuShader; }

    uint getAvailableBufferBindingIndex(ShaderStageFlagBit stage, uint stream);

#ifdef DEBUG_SHADER
    CC_INLINE const String &getVertGlslShader() const { return _vertGlslShader; }
    CC_INLINE const String &getVertMtlSahder() const { return _vertMtlShader; }
    CC_INLINE const String &getFragGlslShader() const { return _fragGlslShader; }
    CC_INLINE const String &getFragMtlSahder() const { return _fragMtlShader; }
#endif

private:
    bool createMTLFunction(const ShaderStage &);
    void setAvailableBufferBindingIndex();

private:
    id<MTLFunction> _vertexMTLFunction = nil;
    id<MTLFunction> _fragmentMTLFunction = nil;
    unordered_map<uint, uint> _mtlVertexSamplerBindings;
    unordered_map<uint, uint> _mtlFragmentSamplerBindings;
    vector<uint> _availableVertexBufferBindingIndex;
    vector<uint> _availableFragmentBufferBindingIndex;

    CCMTLGPUShader *_gpuShader = nullptr;

    // For debug
#ifdef DEBUG_SHADER
    String _vertGlslShader;
    String _vertMtlShader;
    String _fragGlslShader;
    String _fragMtlShader;
#endif
};

} // namespace gfx
} // namespace cc
