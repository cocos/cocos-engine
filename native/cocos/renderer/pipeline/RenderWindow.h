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
    gfx::RenderPassInfo *renderPassInfo = nullptr;
    bool isOffscreen = false;
};

class CC_DLL RenderWindow : public Object {
public:
    static void registerCreateFunc(Root *root);
    
    bool initialize(const RenderWindowInfo &info);
    void destroy();
    void resize(uint width, uint height);
    
    CC_INLINE uint getWidth() const { return _width; }
    CC_INLINE uint geiHeight() const { return _height; }
    CC_INLINE bool isOffscreen() const { return _isOffscreen; }
    CC_INLINE gfx::RenderPass *getRenderPass() const { return _renderPass; }
    CC_INLINE const gfx::TextureList &getColorTextures() const { return _colorTexs; }
    CC_INLINE gfx::Texture *getDepthStencilTexture() const { return _depthStencilTex; }
    CC_INLINE gfx::Framebuffer *getFramebuffer() const { return _frameBuffer; }
    
private:
    RenderWindow() = default;
    RenderWindow(Root *root);
    
private:
    String title;
    gfx::TextureList _colorTexs;
    gfx::Texture *_depthStencilTex = nullptr;
    gfx::Framebuffer *_frameBuffer = nullptr;
    gfx::RenderPass *_renderPass = nullptr;
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
