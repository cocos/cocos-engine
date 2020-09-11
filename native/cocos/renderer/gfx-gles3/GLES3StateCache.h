#ifndef CC_GFXGLES3_STATE_CACHE_H_
#define CC_GFXGLES3_STATE_CACHE_H_

#include "gles3w.h"

namespace cc {
namespace gfx {

class GLES3StateCache : public Object {
public:
    GLuint glArrayBuffer = 0;
    GLuint glElementArrayBuffer = 0;
    GLuint glUniformBuffer = 0;
    vector<GLuint> glBindUBOs;
    vector<GLuint> glBindUBOOffsets;
    GLuint glVAO = 0;
    uint texUint = 0;
    vector<GLuint> glTextures;
    vector<GLuint> glSamplers;
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

    void initialize(size_t texUnits, size_t bufferBindings, size_t vertexAttributes) {
        glBindUBOs.resize(bufferBindings, 0u);
        glBindUBOOffsets.resize(bufferBindings, 0u);
        glTextures.resize(texUnits, 0u);
        glSamplers.resize(texUnits, 0u);
        glEnabledAttribLocs.resize(vertexAttributes, false);
        glCurrentAttribLocs.resize(vertexAttributes, false);
    }
};

} // namespace gfx
} // namespace cc

#endif
