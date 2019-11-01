#ifndef CC_GFXGLES3_GLES3_SHADER_H_
#define CC_GFXGLES3_GLES3_SHADER_H_

NS_CC_BEGIN

class GLES3GPUShader;

class CC_GLES3_API GLES3Shader : public GFXShader {
 public:
  GLES3Shader(GFXDevice* device);
  ~GLES3Shader();
  
 public:
  bool Initialize(const GFXShaderInfo& info);
  void Destroy();
  
  CC_INLINE GLES3GPUShader* gpu_shader() const { return gpu_shader_; }
 private:
  GLES3GPUShader* gpu_shader_;
};

NS_CC_END

#endif
