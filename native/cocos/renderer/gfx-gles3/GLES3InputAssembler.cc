#include "GLES3Std.h"
#include "GLES3InputAssembler.h"
#include "GLES3Commands.h"
#include "GLES3Buffer.h"

namespace cc {
namespace gfx {

GLES3InputAssembler::GLES3InputAssembler(Device *device)
: InputAssembler(device) {
}

GLES3InputAssembler::~GLES3InputAssembler() {
}

bool GLES3InputAssembler::initialize(const InputAssemblerInfo &info) {

    _attributes = info.attributes;
    _vertexBuffers = info.vertexBuffers;
    _indexBuffer = info.indexBuffer;
    _indirectBuffer = info.indirectBuffer;

    if (_indexBuffer) {
        _indexCount = _indexBuffer->getCount();
        _firstIndex = 0;
    } else if (_vertexBuffers.size()) {
        _vertexCount = _vertexBuffers[0]->getCount();
        _firstVertex = 0;
        _vertexOffset = 0;
    }

    _gpuInputAssembler = CC_NEW(GLES3GPUInputAssembler);
    _gpuInputAssembler->attributes = _attributes;
    _gpuInputAssembler->gpuVertexBuffers.resize(_vertexBuffers.size());
    for (size_t i = 0; i < _gpuInputAssembler->gpuVertexBuffers.size(); ++i) {
        GLES3Buffer *vb = (GLES3Buffer *)_vertexBuffers[i];
        _gpuInputAssembler->gpuVertexBuffers[i] = vb->gpuBuffer();
    }
    if (info.indexBuffer)
        _gpuInputAssembler->gpuIndexBuffer = static_cast<GLES3Buffer *>(info.indexBuffer)->gpuBuffer();

    if (info.indirectBuffer)
        _gpuInputAssembler->gpuIndirectBuffer = static_cast<GLES3Buffer *>(info.indirectBuffer)->gpuBuffer();

    GLES3CmdFuncCreateInputAssembler((GLES3Device *)_device, _gpuInputAssembler);
    _attributesHash = computeAttributesHash();

    return true;
}

void GLES3InputAssembler::destroy() {
    if (_gpuInputAssembler) {
        GLES3CmdFuncDestroyInputAssembler((GLES3Device *)_device, _gpuInputAssembler);
        CC_DELETE(_gpuInputAssembler);
        _gpuInputAssembler = nullptr;
    }
}

void GLES3InputAssembler::ExtractCmdDraw(GLES3CmdDraw *cmd) {
    cmd->drawInfo.vertexCount = _vertexCount;
    cmd->drawInfo.firstVertex = _firstVertex;
    cmd->drawInfo.indexCount = _indexCount;
    cmd->drawInfo.firstIndex = _firstIndex;
    cmd->drawInfo.vertexOffset = _vertexOffset;
    cmd->drawInfo.instanceCount = _instanceCount;
    cmd->drawInfo.firstInstance = _firstInstance;
}

} // namespace gfx
} // namespace cc
