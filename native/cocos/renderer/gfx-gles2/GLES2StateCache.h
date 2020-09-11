#ifndef CC_GFXGLES2_STATE_CACHE_H_
#define CC_GFXGLES2_STATE_CACHE_H_

#include "gles2w.h"

namespace cc {
namespace gfx {

class GLES2StateCache : public Object {
public:
    GLuint glArrayBuffer = 0;
    GLuint glElementArrayBuffer = 0;
    GLuint glUniformBuffer = 0;
    GLuint glVAO = 0;
    uint texUint = 0;
    vector<GLuint> glTextures;
    GLuint glProgram = 0;
    vector<bool> glEnabledAttribLocs;
    vector<bool> glCurrentAttribLocs;
    GLuint glFramebuffer = 0;
    GLuint glReadFBO = 0;
    Viewport viewport;
    Rect scissor;
    RasterizerState rs;
    DepthStencilState dss;
    BlendState bs;
    bool isCullFaceEnabled = true;
    bool isStencilTestEnabled = false;
    map<String, uint> texUnitCacheMap;

    void initialize(size_t texUnits, size_t vertexAttributes) {
        glTextures.resize(texUnits, 0u);
        glEnabledAttribLocs.resize(vertexAttributes, false);
        glCurrentAttribLocs.resize(vertexAttributes, false);
    }
};

} // namespace gfx
} // namespace cc

#endif
