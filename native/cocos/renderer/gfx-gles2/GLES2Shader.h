#ifndef CC_GFXGLES2_GLES2_SHADER_H_
#define CC_GFXGLES2_GLES2_SHADER_H_

NS_CC_BEGIN

class GLES2GPUShader;

class CC_GLES2_API GLES2Shader : public GFXShader {
 public:
  GLES2Shader(GFXDevice* device);
  ~GLES2Shader();
  
 public:
  bool initialize(const GFXShaderInfo& info);
  void destroy();
  
  CC_INLINE GLES2GPUShader* gpuShader() const { return _gpuShader; }
 private:
  GLES2GPUShader* _gpuShader = nullptr;
};

NS_CC_END

#endif
