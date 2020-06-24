#pragma once

#include "GFXDef.h"

namespace cc {
namespace gfx {

class GFXObject : public Object {
public:
    GFXObject(ObjectType Type);
    virtual ~GFXObject() = default;

    CC_INLINE ObjectType getType() const { return _Type; }
    CC_INLINE Status getStatus() const { return _status; }

protected:
    ObjectType _Type = ObjectType::UNKNOWN;
    Status _status = Status::UNREADY;
};

} // namespace gfx
} // namespace cc
