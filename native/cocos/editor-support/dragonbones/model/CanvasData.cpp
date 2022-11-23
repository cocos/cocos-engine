#include "CanvasData.h"

DRAGONBONES_NAMESPACE_BEGIN

void CanvasData::_onClear() {
    hasBackground = false;
    color = 0x000000;
    aabb.clear();
}

DRAGONBONES_NAMESPACE_END
