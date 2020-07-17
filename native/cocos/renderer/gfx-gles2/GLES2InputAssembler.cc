#include "GLES2Std.h"
#include "GLES2InputAssembler.h"
#include "GLES2Commands.h"
#include "GLES2Buffer.h"

namespace cc {
namespace gfx {

GLES2InputAssembler::GLES2InputAssembler(Device *device)
: InputAssembler(device) {
}

GLES2InputAssembler::~GLES2InputAssembler() {
}

bool GLES2InputAssembler::initialize(const InputAssemblerInfo &info) {

    _attributes = info.attributes;
    _vertexBuffers = info.vertexBuffers;
    _indexBuffer = info.indexBuffer;
    _indirectBuffer = info.indirectBuffer;

    if (_indexBuffer) {
        _indexCount = _indexBuffer->getCount();
    } else if (_vertexBuffers.size()) {
        _vertexCount = _vertexBuffers[0]->getCount();
    }

    _gpuInputAssembler = CC_NEW(GLES2GPUInputAssembler);
    _gpuInputAssembler->attributes = _attributes;
    _gpuInputAssembler->gpuVertexBuffers.resize(_vertexBuffers.size());
    for (size_t i = 0; i < _gpuInputAssembler->gpuVertexBuffers.size(); ++i) {
        GLES2Buffer *vb = (GLES2Buffer *)_vertexBuffers[i];
        _gpuInputAssembler->gpuVertexBuffers[i] = vb->gpuBuffer();
    }
    if (info.indexBuffer)
        _gpuInputAssembler->gpuIndexBuffer = static_cast<GLES2Buffer *>(info.indexBuffer)->gpuBuffer();

    if (info.indirectBuffer)
        _gpuInputAssembler->gpuIndirectBuffer = static_cast<GLES2Buffer *>(info.indirectBuffer)->gpuBuffer();

    GLES2CmdFuncCreateInputAssembler((GLES2Device *)_device, _gpuInputAssembler);
    _attributesHash = computeAttributesHash();
    _status = Status::SUCCESS;

    return true;
}

void GLES2InputAssembler::destroy() {
    if (_gpuInputAssembler) {
        GLES2CmdFuncDestroyInputAssembler((GLES2Device *)_device, _gpuInputAssembler);
        CC_DELETE(_gpuInputAssembler);
        _gpuInputAssembler = nullptr;
    }
    _status = Status::UNREADY;
}

void GLES2InputAssembler::ExtractCmdDraw(GLES2CmdDraw *cmd) {
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
