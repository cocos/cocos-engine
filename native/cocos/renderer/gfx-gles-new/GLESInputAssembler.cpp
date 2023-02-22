#include "GLESInputAssembler.h"
#include "GLESConversion.h"
#include <algorithm>

#define BUFFER_OFFSET(idx) (static_cast<char *>(0) + (idx))

namespace cc::gfx::gles {

InputAssembler::InputAssembler() {
    _typedID = generateObjectID<decltype(this)>();
}

InputAssembler::~InputAssembler() {
    destroy();
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
    _gpuIa->initInput(info.attributes);
}

void InputAssembler::doDestroy() {
    _gpuIa = nullptr;
}

// gpu object
GPUInputAssembler::~GPUInputAssembler() noexcept {
}

void GPUInputAssembler::initInput(const AttributeList &list) {
    GLuint buffer = 0;
    ccstd::vector<uint32_t> streamOffsets(vertexBuffers.size(), 0);
    attributes.reserve(list.size());
    for (auto &attribute : list) {
        const auto &internalFormat = getInternalType(attribute.format);
        const auto &formatInfo = GFX_FORMAT_INFOS[static_cast<int>(attribute.format)];
        uint32_t offset = streamOffsets[attribute.stream];

        attributes.emplace_back();
        auto &glAttr = attributes.back();
        glAttr.size     = formatInfo.size;
        glAttr.count    = formatInfo.count;
        glAttr.type     = internalFormat.type;
        glAttr.stride   = vertexBuffers[attribute.stream]->buffer->stride;
        glAttr.divisor  = attribute.isInstanced ? 1 : 0;
        glAttr.offset   = 0;
        glAttr.isNormalized = attribute.isNormalized;
        glAttr.offset = BUFFER_OFFSET(offset);
        glAttr.stream = attribute.stream;
        glAttr.name   = attribute.name;

        streamOffsets[attribute.stream] += glAttr.size;
    }
}

} // namespace cc::gfx::gles
