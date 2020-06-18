#pragma once

#include "core/CoreStd.h"

namespace cc {
class Root;

namespace pipeline {

struct CC_DLL RenderWindowInfo {
    String titile;
    uint left = 0;
    uint top = 0;
    uint width = 0;
    uint height = 0;
    gfx::GFXRenderPassInfo *renderPassInfo = nullptr;
    bool isOffscreen = false;
};

class CC_DLL RenderWindow : public gfx::Object {
public:
    static void registerCreateFunc(Root *root);
    
    bool initialize(const RenderWindowInfo &info);
    void destroy();
    void resize(uint width, uint height);
    
    CC_INLINE uint getWidth() const { return _width; }
    CC_INLINE uint geiHeight() const { return _height; }
    CC_INLINE bool isOffscreen() const { return _isOffscreen; }
    CC_INLINE gfx::GFXRenderPass *getRenderPass() const { return _renderPass; }
    CC_INLINE const gfx::GFXTextureList &getColorTextures() const { return _colorTexs; }
    CC_INLINE gfx::GFXTexture *getDepthStencilTexture() const { return _depthStencilTex; }
    CC_INLINE gfx::GFXFramebuffer *getFramebuffer() const { return _frameBuffer; }
    
private:
    RenderWindow() = default;
    RenderWindow(Root *root);
    
private:
    String title;
    gfx::GFXTextureList _colorTexs;
    gfx::GFXTexture *_depthStencilTex = nullptr;
    gfx::GFXFramebuffer *_frameBuffer = nullptr;
    gfx::GFXRenderPass *_renderPass = nullptr;
    Root *_root = nullptr;
    uint _width = 0;
    uint _height = 0;
    uint _top = 0;
    uint _nativeWidth = 0;
    uint _nativeHeight = 0;
    bool _isOffscreen = false;
};

} // namespace pipeline
} // namespace cc
