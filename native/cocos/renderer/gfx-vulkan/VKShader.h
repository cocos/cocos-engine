#ifndef CC_GFXVULKAN_SHADER_H_
#define CC_GFXVULKAN_SHADER_H_

namespace cc {
namespace gfx {

class CCVKGPUShader;

class CC_VULKAN_API CCVKShader final : public Shader {
public:
    CCVKShader(Device *device);
    ~CCVKShader();

public:
    bool initialize(const ShaderInfo &info);
    void destroy();

    CC_INLINE CCVKGPUShader *gpuShader() const { return _gpuShader; }

private:
    CCVKGPUShader *_gpuShader = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
