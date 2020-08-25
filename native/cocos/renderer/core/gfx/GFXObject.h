#pragma once

#include "GFXDef.h"

namespace cc {
namespace gfx {

class GFXObject : public Object {
public:
    GFXObject(ObjectType Type);
    virtual ~GFXObject() = default;

    CC_INLINE ObjectType getType() const { return _Type; }

protected:
    ObjectType _Type = ObjectType::UNKNOWN;
};

} // namespace gfx
} // namespace cc
