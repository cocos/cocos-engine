#ifndef CC_GFXGLES3_GLES3_BINDING_LAYOUT_H_
#define CC_GFXGLES3_GLES3_BINDING_LAYOUT_H_

CC_NAMESPACE_BEGIN

class GLES3GPUBindingLayout;

class CC_GLES3_API GLES3BindingLayout : public GFXBindingLayout {
 public:
  GLES3BindingLayout(GFXDevice* device);
  ~GLES3BindingLayout();
  
 public:
  bool Initialize(const GFXBindingLayoutInfo& info);
  void Destroy();
  void Update();
  
  CC_INLINE GLES3GPUBindingLayout* gpu_binding_layout() const { return gpu_binding_layout_; }
  
 private:
  GLES3GPUBindingLayout* gpu_binding_layout_;
};

CC_NAMESPACE_END

#endif
