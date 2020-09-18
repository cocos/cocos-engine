#ifndef CC_CORE_GFX_QUEUE_H_
#define CC_CORE_GFX_QUEUE_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL Queue : public GFXObject {
public:
    Queue(Device *device);
    virtual ~Queue();

public:
    virtual bool initialize(const QueueInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) = 0;

    CC_INLINE void submit(const vector<CommandBuffer *> &cmdBuffs) { submit(cmdBuffs, nullptr); }
    CC_INLINE void submit(const vector<CommandBuffer *> &cmdBuffs, Fence *fence) { submit(cmdBuffs.data(), cmdBuffs.size(), fence); }
    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE QueueType getType() const { return _type; }
    CC_INLINE bool isAsync() const { return _isAsync; }

protected:
    Device *_device = nullptr;
    QueueType _type = QueueType::GRAPHICS;
    bool _isAsync = false;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_QUEUE_H_
