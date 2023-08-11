#include "GLESShader.h"
#include "GLESDevice.h"
#include "GLESCommands.h"

namespace cc::gfx {

GLESShader::GLESShader() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESShader::~GLESShader() {
    destroy();
}

void GLESShader::doInit(const ShaderInfo & /*info*/) {
    _gpuShader = ccnew GLESGPUShader;
    _gpuShader->name = _name;
    _gpuShader->blocks = _blocks;
    _gpuShader->buffers = _buffers;
    _gpuShader->samplerTextures = _samplerTextures;
    _gpuShader->images = _images;
    _gpuShader->hash = _hash;
    for (auto &stage : _stages) {
        _gpuShader->stages.emplace_back();
        auto &back = _gpuShader->stages.back();
        back.source = std::move(stage.source);
        back.type = stage.stage;
        back.glShader = 0;
    }
}

void GLESShader::doDestroy() {
    _gpuShader = nullptr;
}

GLESGPUShader::~GLESGPUShader() {
    GLESDevice::getInstance()->recycleBin()->collect(this);
}

} // namespace cc::gfx
