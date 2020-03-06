#include "GLES3Std.h"
#include "GLES3InputAssembler.h"
#include "GLES3Commands.h"
#include "GLES3Buffer.h"

NS_CC_BEGIN

GLES3InputAssembler::GLES3InputAssembler(GFXDevice* device)
    : GFXInputAssembler(device) {
}

GLES3InputAssembler::~GLES3InputAssembler() {
}

bool GLES3InputAssembler::initialize(const GFXInputAssemblerInfo &info) {
  
  _attributes = info.attributes;
  _vertexBuffers = info.vertexBuffers;
  _indexBuffer = info.indexBuffer;
  _indirectBuffer = info.indirectBuffer;
  
  if (_indexBuffer) {
    _indexCount = _indexBuffer->getCount();
  } else if (_vertexBuffers.size()) {
    _vertexCount = _vertexBuffers[0]->getCount();
  }
  
  _gpuInputAssembler = CC_NEW(GLES3GPUInputAssembler);
  _gpuInputAssembler->attributes = _attributes;
  _gpuInputAssembler->gpuVertexBuffers.resize(_vertexBuffers.size());
  for (size_t i = 0; i < _gpuInputAssembler->gpuVertexBuffers.size(); ++i) {
    GLES3Buffer* vb = (GLES3Buffer*)_vertexBuffers[i];
    _gpuInputAssembler->gpuVertexBuffers[i] = vb->gpuBuffer();
  }
    if(info.indexBuffer)
        _gpuInputAssembler->gpuIndexBuffer = static_cast<GLES3Buffer*>(info.indexBuffer)->gpuBuffer();
  
  GLES3CmdFuncCreateInputAssembler((GLES3Device*)_device, _gpuInputAssembler);
  
  return true;
}

void GLES3InputAssembler::destroy() {
  if (_gpuInputAssembler) {
    GLES3CmdFuncDestroyInputAssembler((GLES3Device*)_device, _gpuInputAssembler);
    CC_DELETE(_gpuInputAssembler);
    _gpuInputAssembler = nullptr;
  }
}

void GLES3InputAssembler::ExtractCmdDraw(GLES3CmdDraw* cmd) {
  cmd->draw_info.vertexCount = _vertexCount;
  cmd->draw_info.firstVertex = _firstVertex;
  cmd->draw_info.indexCount = _indexCount;
  cmd->draw_info.firstIndex = _firstIndex;
  cmd->draw_info.vertexOffset = _vertexOffset;
  cmd->draw_info.instanceCount = _instanceCount;
  cmd->draw_info.firstInstance = _firstInstance;
}

NS_CC_END
