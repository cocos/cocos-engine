#ifndef CC_GFXVULKAN_STATE_CACHE_H_
#define CC_GFXVULKAN_STATE_CACHE_H_

NS_CC_BEGIN

class CCVKStateCache : public Object {
public:
    //GLuint glArrayBuffer = 0;
    //GLuint glElementArrayBuffer = 0;
    //GLuint glUniformBuffer = 0;
    //GLuint glBindUBOs[GFX_MAX_BUFFER_BINDINGS] = { 0 };
    //GLuint glVAO = 0;
    uint texUint = 0;
    //GLuint glTextures[GFX_MAX_TEXTURE_UNITS] = { 0 };
    //GLuint glSamplers[GFX_MAX_TEXTURE_UNITS] = { 0 };
    //GLuint glProgram = 0;
    bool glEnabledAttribLocs[GFX_MAX_VERTEX_ATTRIBUTES] = { false };
    bool glCurrentAttribLocs[GFX_MAX_VERTEX_ATTRIBUTES] = { false };
    //GLuint glFramebuffer = 0;
    //GLuint glReadFBO = 0;
    GFXViewport viewport;
    GFXRect scissor;
    GFXRasterizerState rs;
    GFXDepthStencilState dss;
    GFXBlendState bs;
    bool isCullFaceEnabled = true;
    bool isStencilTestEnabled = false;

    CCVKStateCache() {}
};

NS_CC_END

#endif
