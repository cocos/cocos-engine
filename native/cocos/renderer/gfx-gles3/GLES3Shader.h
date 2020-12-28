#ifndef CC_GFXGLES3_SHADER_H_
#define CC_GFXGLES3_SHADER_H_

namespace cc {
namespace gfx {

class GLES3GPUShader;

class CC_GLES3_API GLES3Shader final : public Shader {
public:
    GLES3Shader(Device *device);
    ~GLES3Shader();

public:
    virtual bool initialize(const ShaderInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES3GPUShader *gpuShader() const { return _gpuShader; }

private:
    GLES3GPUShader *_gpuShader = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
