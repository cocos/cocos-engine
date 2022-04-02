#pragma once

#include <cassert>
#include "base/RefCounted.h"

namespace cc {
namespace geometry {

enum class ShapeEnum {
    SHAPE_RAY              = (1 << 0),
    SHAPE_LINE             = (1 << 1),
    SHAPE_SPHERE           = (1 << 2),
    SHAPE_AABB             = (1 << 3),
    SHAPE_OBB              = (1 << 4),
    SHAPE_PLANE            = (1 << 5),
    SHAPE_TRIANGLE         = (1 << 6),
    SHAPE_FRUSTUM          = (1 << 7),
    SHAPE_FRUSTUM_ACCURATE = (1 << 8),
    SHAPE_CAPSULE          = (1 << 9),
    SHAPE_BAD              = (1 << 10),
};

class ShapeBase : public RefCounted {
public:
    /**
     * @en
     * Gets the type of the shape.
     * @zh
     * 获取形状的类型。
     */
    inline ShapeEnum getType() const {
        assert(_type != ShapeEnum::SHAPE_BAD); // shape is not initialized
        return _type;
    }
    inline void setType(ShapeEnum type) { _type = type; }

private:
    ShapeEnum _type = ShapeEnum::SHAPE_BAD;
};

} // namespace geometry
} // namespace cc
