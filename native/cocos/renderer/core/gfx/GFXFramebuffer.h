#ifndef CC_CORE_GFX_FRAME_BUFFER_H_
#define CC_CORE_GFX_FRAME_BUFFER_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL Framebuffer : public GFXObject {
public:
    Framebuffer(Device *device);
    virtual ~Framebuffer();

public:
    virtual bool initialize(const FramebufferInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE RenderPass *getRenderPass() const { return _renderPass; }
    CC_INLINE const TextureList &getColorTextures() const { return _colorTextures; }
    CC_INLINE Texture *getDepthStencilTexture() const { return _depthStencilTexture; }

protected:
    Device *_device = nullptr;
    RenderPass *_renderPass = nullptr;
    TextureList _colorTextures;
    Texture *_depthStencilTexture = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_FRAME_BUFFER_H_
