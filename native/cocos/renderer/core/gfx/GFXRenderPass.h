#ifndef CC_CORE_GFX_RENDER_PASS_H_
#define CC_CORE_GFX_RENDER_PASS_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL RenderPass : public GFXObject {
public:
    RenderPass(Device *device);
    virtual ~RenderPass();

public:
    virtual bool initialize(const RenderPassInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE const ColorAttachmentList &getColorAttachments() const { return _colorAttachments; }
    CC_INLINE const DepthStencilAttachment &getDepthStencilAttachment() const { return _depthStencilAttachment; }
    CC_INLINE const SubPassList &getSubPasses() const { return _subPasses; }
    CC_INLINE uint getHash() const { return _hash; }

protected:
    uint computeHash() const;

    Device *_device = nullptr;
    ColorAttachmentList _colorAttachments;
    DepthStencilAttachment _depthStencilAttachment;
    SubPassList _subPasses;
    uint _hash = 0;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_RENDER_PASS_H_
