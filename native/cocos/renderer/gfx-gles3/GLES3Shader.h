#ifndef CC_GFXGLES3_GLES3_SHADER_H_
#define CC_GFXGLES3_GLES3_SHADER_H_

namespace cc {

class GLES3GPUShader;

class CC_GLES3_API GLES3Shader : public GFXShader {
public:
    GLES3Shader(GFXDevice *device);
    ~GLES3Shader();

public:
    virtual bool initialize(const GFXShaderInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUShader *gpuShader() const { return _gpuShader; }

private:
    GLES3GPUShader *_gpuShader = nullptr;
};

}

#endif
