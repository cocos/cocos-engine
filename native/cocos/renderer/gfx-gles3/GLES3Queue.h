#ifndef CC_GFXGLES3_GLES3_QUEUE_H_
#define CC_GFXGLES3_GLES3_QUEUE_H_

NS_CC_BEGIN

class CC_GLES3_API GLES3Queue : public GFXQueue {
 public:
  GLES3Queue(GFXDevice* device);
  ~GLES3Queue();

  friend class GLES3Device;
  
 public:
  bool initialize(const GFXQueueInfo& info);
  void destroy();
  void submit(GFXCommandBuffer** cmd_buffs, uint count);
  
  CC_INLINE bool is_async() const { return is_async_; }
  
 private:
  bool is_async_;
  uint _numDrawCalls;
  uint _numTriangles;
};

NS_CC_END

#endif
