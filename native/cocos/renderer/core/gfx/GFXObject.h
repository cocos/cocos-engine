#pragma once

#include "GFXDef.h"

NS_CC_BEGIN

class GFXObject : public Object {
public:
    GFXObject(GFXObjectType gfxType);
    virtual ~GFXObject() = default;
    
    CC_INLINE GFXObjectType getType() const { return _gfxType; }
    CC_INLINE GFXStatus getStatus() const { return _status; }

protected:
    GFXObjectType _gfxType = GFXObjectType::UNKNOWN;
    GFXStatus _status = GFXStatus::UNREADY;
};

NS_CC_END
