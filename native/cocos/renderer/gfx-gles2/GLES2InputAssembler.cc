#include "GLES2Std.h"
#include "GLES2InputAssembler.h"
#include "GLES2Commands.h"
#include "GLES2Buffer.h"

namespace cc {

GLES2InputAssembler::GLES2InputAssembler(GFXDevice *device)
: GFXInputAssembler(device) {
}

GLES2InputAssembler::~GLES2InputAssembler() {
}

bool GLES2InputAssembler::initialize(const GFXInputAssemblerInfo &info) {

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
    _status = GFXStatus::SUCCESS;

    return true;
}

void GLES2InputAssembler::destroy() {
    if (_gpuInputAssembler) {
        GLES2CmdFuncDestroyInputAssembler((GLES2Device *)_device, _gpuInputAssembler);
        CC_DELETE(_gpuInputAssembler);
        _gpuInputAssembler = nullptr;
    }
    _status = GFXStatus::UNREADY;
}

void GLES2InputAssembler::ExtractCmdDraw(GLES2CmdDraw *cmd) {
    cmd->draw_info.vertexCount = _vertexCount;
    cmd->draw_info.firstVertex = _firstVertex;
    cmd->draw_info.indexCount = _indexCount;
    cmd->draw_info.firstIndex = _firstIndex;
    cmd->draw_info.vertexOffset = _vertexOffset;
    cmd->draw_info.instanceCount = _instanceCount;
    cmd->draw_info.firstInstance = _firstInstance;
}

}
