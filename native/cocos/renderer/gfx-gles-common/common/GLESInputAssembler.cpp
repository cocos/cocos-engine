#include "GLESInputAssembler.h"
#include "GLESBuffer.h"
#include "GLESCommands.h"
#include "GLESDevice.h"

namespace cc::gfx {

GLESInputAssembler::GLESInputAssembler() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESInputAssembler::~GLESInputAssembler() {
    destroy();
}

void GLESInputAssembler::doInit(const InputAssemblerInfo &info) {
    _gpuIA = ccnew GLESGPUInputAssembler;
    _gpuIA->attributes = _attributes;
    _gpuIA->gpuVertexBuffers.resize(_vertexBuffers.size());
    for (size_t i = 0; i < _gpuIA->gpuVertexBuffers.size(); ++i) {
        auto *vb = static_cast<GLESBuffer *>(_vertexBuffers[i]);
        _gpuIA->gpuVertexBuffers[i] = vb->gpuBufferView();
    }
    if (info.indexBuffer) {
        _gpuIA->gpuIndexBuffer = static_cast<GLESBuffer *>(info.indexBuffer)->gpuBufferView();
    }

    if (info.indirectBuffer) {
        _gpuIA->gpuIndirectBuffer = static_cast<GLESBuffer *>(info.indirectBuffer)->gpuBufferView();
    }
    glesCreateInputAssembler(GLESDevice::getInstance(), _gpuIA);
}

void GLESInputAssembler::doDestroy() {
    _gpuIA = nullptr;
}

} // namespace cc::gfx
