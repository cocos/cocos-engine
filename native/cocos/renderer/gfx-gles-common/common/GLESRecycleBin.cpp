#include "GLESRecycleBin.h"
#include "GLESDevice.h"
#include "GLESCommands.h"

namespace cc::gfx {

void GLESRecycleBin::collect(const GLESGPUBuffer *buffer) {
    if (buffer->glBuffer != 0) {
        _buffers.emplace_back(buffer->glBuffer);
    }
}

void GLESRecycleBin::collect(const GLESGPUTexture *texture) {
    if (texture->useRenderBuffer && texture->glRenderbuffer != 0) {
        _renderBuffers.emplace_back(texture->glRenderbuffer);
    } else if (texture->glTexture != 0) {
        _textures.emplace_back(texture->glTexture);
    }
}

void GLESRecycleBin::collect(const GLESGPUShader *shader) {
    if (shader->glProgram != 0) {
        _programs.emplace_back(shader->glProgram);
    }
}

void GLESRecycleBin::clear() {
    auto *device = GLESDevice::getInstance();
    if (!_buffers.empty()) {
        glesDestroyBuffer(device, _buffers.data(), static_cast<uint32_t>(_buffers.size()));
        _buffers.clear();
    }

    if (!_textures.empty()) {
        glesDestroyTexture(device, _textures.data(), static_cast<uint32_t>(_textures.size()));
        _textures.clear();
    }

    if (!_textures.empty()) {
        glesDestroyRenderBuffer(device, _renderBuffers.data(), static_cast<uint32_t>(_renderBuffers.size()));
        _renderBuffers.clear();
    }

    if (!_programs.empty()) {
        for (auto &program : _programs) {
            glesDestroyProgram(device, program);
        }
        _programs.clear();
    }
}


} // namespace cc::gfx
