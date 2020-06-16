#ifndef CC_GFXGLES3_GLES3_QUEUE_H_
#define CC_GFXGLES3_GLES3_QUEUE_H_

namespace cc {
namespace gfx {

class CC_GLES3_API GLES3Queue : public GFXQueue {
public:
    GLES3Queue(GFXDevice *device);
    ~GLES3Queue();

    friend class GLES3Device;

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
