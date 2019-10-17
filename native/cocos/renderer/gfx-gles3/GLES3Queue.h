#ifndef CC_GFXGLES3_GLES3_QUEUE_H_
#define CC_GFXGLES3_GLES3_QUEUE_H_

CC_NAMESPACE_BEGIN

class CC_GLES3_API GLES3Queue : public GFXQueue {
 public:
  GLES3Queue(GFXDevice* device);
  ~GLES3Queue();

  friend class GLES3Device;
  
 public:
  bool Initialize(const GFXQueueInfo& info);
  void Destroy();
  void submit(GFXCommandBuffer** cmd_buffs, uint count);
  
  CC_INLINE bool is_async() const { return is_async_; }
  
 private:
  bool is_async_;
  uint num_draw_calls_;
  uint num_tris_;
};

CC_NAMESPACE_END

#endif
