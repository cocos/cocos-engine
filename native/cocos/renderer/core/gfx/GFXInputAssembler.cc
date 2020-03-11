#include "CoreStd.h"
#include "GFXInputAssembler.h"

NS_CC_BEGIN

GFXInputAssembler::GFXInputAssembler(GFXDevice* device)
: _device(device)
{
}

GFXInputAssembler::~GFXInputAssembler() {
}

void GFXInputAssembler::extractDrawInfo(GFXDrawInfo& drawInfo) const
{
    drawInfo.vertexCount = _vertexCount;
    drawInfo.firstVertex = _firstVertex;
    drawInfo.indexCount = _indexCount;
    drawInfo.firstIndex = _firstIndex;
    drawInfo.vertexOffset = _vertexOffset;
    drawInfo.instanceCount = _instanceCount;
    drawInfo.firstInstance = _firstInstance;
}

NS_CC_END
