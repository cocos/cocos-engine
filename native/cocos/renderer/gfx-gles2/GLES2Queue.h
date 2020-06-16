#ifndef CC_GFXGLES2_GLES2_QUEUE_H_
#define CC_GFXGLES2_GLES2_QUEUE_H_

namespace cc {
namespace gfx {

class CC_GLES2_API GLES2Queue : public GFXQueue {
public:
    GLES2Queue(GFXDevice *device);
    ~GLES2Queue();

    friend class GLES2Device;

public:
    virtual bool initialize(const GFXQueueInfo &info) override;
    virtual void destroy() override;
    virtual void submit(const vector<GFXCommandBuffer *>::type &cmdBuffs, GFXFence *fence) override;

    CC_INLINE bool isAsync() const { return _isAsync; }

private:
    bool _isAsync = false;
    uint _numDrawCalls = 0;
    uint _numInstances = 0;
    uint _numTriangles = 0;
};

} // namespace gfx
} // namespace cc

#endif
