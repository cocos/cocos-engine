#ifndef CC_GFXGLES2_GLES2_SHADER_H_
#define CC_GFXGLES2_GLES2_SHADER_H_

namespace cc {
namespace gfx {

class GLES2GPUShader;

class CC_GLES2_API GLES2Shader : public GFXShader {
public:
    GLES2Shader(GFXDevice *device);
    ~GLES2Shader();

public:
    virtual bool initialize(const GFXShaderInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUShader *gpuShader() const { return _gpuShader; }

private:
    GLES2GPUShader *_gpuShader = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
