#pragma once

#include "GFXObject.h"
#include "base/RefCounted.h"

namespace cc {
namespace gfx {
class CC_DLL AccelerationStructure : public GFXObject, public RefCounted {
public:
    AccelerationStructure();
    ~AccelerationStructure() override;

    void initialize(const AccelerationStructureInfo &info);
    void build();
    void update();
    void compact();
    void destroy();

    const AccelerationStructureInfo &getInfo() const {
        return _info;
    }

    void setInfo(const AccelerationStructureInfo &info) {
        _info = info;
    }

protected:

    virtual void doInit(const AccelerationStructureInfo &info) = 0;
    virtual void doBuild() = 0;
    virtual void doDestroy() = 0;
    virtual void doUpdate() = 0;
    virtual void doCompact() = 0;

    AccelerationStructureInfo _info;
};

} // namespace gfx
} // namespace cc
