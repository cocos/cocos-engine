#include "CoreStd.h"
#include "GFXBuffer.h"

NS_CC_BEGIN

GFXBuffer::GFXBuffer(GFXDevice* device)
: GFXObject(GFXObjectType::BUFFER), _device(device)
{
}

GFXBuffer::~GFXBuffer() {
}

NS_CC_END
