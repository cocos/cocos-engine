#ifndef CC_GFXVULKAN_CCVK_SHADER_H_
#define CC_GFXVULKAN_CCVK_SHADER_H_

NS_CC_BEGIN

class CCVKGPUShader;

class CC_VULKAN_API CCVKShader : public GFXShader {
public:
    CCVKShader(GFXDevice *device);
    ~CCVKShader();

public:
    bool initialize(const GFXShaderInfo &info);
    void destroy();

    CC_INLINE CCVKGPUShader *gpuShader() const { return _gpuShader; }

private:
    CCVKGPUShader *_gpuShader = nullptr;
};

NS_CC_END

#endif
