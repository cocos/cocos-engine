#include "GLESInputAssembler.h"
#include "GLESConversion.h"

#define BUFFER_OFFSET(idx) (static_cast<char *>(0) + (idx))

namespace cc::gfx::gles {

InputAssembler::InputAssembler() {

}

InputAssembler::~InputAssembler() {

}

void InputAssembler::doInit(const InputAssemblerInfo &info) {
    _gpuIa = ccnew GPUInputAssembler();
    _gpuIa->vertexBuffers.reserve(_vertexBuffers.size());
    for (auto &vb : _vertexBuffers) {
        auto *buffer = static_cast<Buffer*>(vb);
        _gpuIa->vertexBuffers.emplace_back(buffer->getGPUBufferView());
    }
    if (_indexBuffer != nullptr) {
        auto *buffer = static_cast<Buffer*>(_indexBuffer);
        _gpuIa->indexBuffer = buffer->getGPUBufferView();
        switch (_gpuIa->indexBuffer->buffer->stride) {
            case 1: _gpuIa->indexType = GL_UNSIGNED_BYTE; break;
            case 2: _gpuIa->indexType = GL_UNSIGNED_SHORT; break;
            case 4: _gpuIa->indexType = GL_UNSIGNED_INT; break;
            default: {
                CC_LOG_ERROR("Illegal index buffer stride.");
            }
        }
    }
    _gpuIa->initVAO(info.attributes);
}

void InputAssembler::doDestroy() {
    _gpuIa = nullptr;
}

// gpu object
GPUInputAssembler::~GPUInputAssembler() noexcept {
}

void GPUInputAssembler::initVAO(const AttributeList &list) {
//    GL_CHECK(glGenVertexArrays(1, &vao));
//    GL_CHECK(glBindVertexArray(vao));
//    GLuint buffer = 0;
//
//    ccstd::vector<uint32_t> streamOffset(vertexBuffers.size(), 0);
//    for (auto &attribute : list) {
//        auto &view = vertexBuffers[attribute.stream];
//        if (view->buffer->bufferId != buffer) {
//            buffer = view->buffer->bufferId;
//            glBindBuffer(GL_ARRAY_BUFFER, buffer);
//        }
//        auto &format = getInternalType(attribute.format);

//        GL_CHECK(glVertexAttribPointer(attribute.location, attribute.format.size, format.type, attribute.isNormalized, view->buffer->stride, BUFFER_OFFSET(streamOffset[attribute.stream])));
//        GL_CHECK(glVertexAttribDivisor(attribute.location, attribute.isInstanced ? 1 : 0));
//        GL_CHECK(glEnableVertexAttribArray(attribute.location));
//    }

}

} // namespace cc::gfx::gles
