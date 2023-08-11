#pragma once

#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESRecycleBin {
public:
    GLESRecycleBin() = default;
    ~GLESRecycleBin() = default;

    void collect(const GLESGPUBuffer *buffer);
    void collect(const GLESGPUTexture *texture);
    void collect(const GLESGPUShader *shader);

    void clear();

private:
    ccstd::vector<GLuint> _buffers;
    ccstd::vector<GLuint> _textures;
    ccstd::vector<GLuint> _renderBuffers;
    ccstd::vector<GLuint> _programs;
};

} // namespace cc::gfx
