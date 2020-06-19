#ifndef CC_CORE_GFX_FRAME_BUFFER_H_
#define CC_CORE_GFX_FRAME_BUFFER_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL GFXFramebuffer : public GFXObject {
public:
    GFXFramebuffer(GFXDevice *device);
    virtual ~GFXFramebuffer();

public:
    virtual bool initialize(const GFXFramebufferInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE GFXDevice *getDevice() const { return _device; }
    CC_INLINE GFXRenderPass *getRenderPass() const { return _renderPass; }
    CC_INLINE const GFXTextureList &getColorTextures() const { return _colorTextures; }
    CC_INLINE GFXTexture *getDepthStencilTexture() const { return _depthStencilTexture; }
    CC_INLINE bool isOffscreen() const { return _isOffscreen; }

protected:
    GFXDevice *_device = nullptr;
    GFXRenderPass *_renderPass = nullptr;
    GFXTextureList _colorTextures;
    GFXTexture *_depthStencilTexture = nullptr;
    bool _isOffscreen = true;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_FRAME_BUFFER_H_
