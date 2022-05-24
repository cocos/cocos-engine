#pragma once

#include "core/geometry/Enums.h"
#include "math/Vec3.h"
namespace cc {
namespace geometry {

/**
 * @en
 * Basic Geometry: Line.
 * @zh
 * 基础几何 line。
 */

class Line final : public ShapeBase {
public:
    /**
     * @en
     * create a new line
     * @zh
     * 创建一个新的 line。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     * @return
     */

    static Line *create(float sx,
                        float sy,
                        float sz,
                        float ex,
                        float ey,
                        float ez);

    /**
     * @en
     * Creates a new Line initialized with values from an existing Line
     * @zh
     * 克隆一个新的 line。
     * @param a 克隆的来源。
     * @return 克隆出的对象。
     */

    static Line *clone(const Line &a);

    /**
     * @en
     * Copy the values from one Line to another
     * @zh
     * 复制一个线的值到另一个。
     * @param out 接受操作的对象。
     * @param a 复制的来源。
     * @return 接受操作的对象。
     */
    static Line *copy(Line *out, const Line &a);

    /**
     * @en
     * create a line from two points
     * @zh
     * 用两个点创建一个线。
     * @param out 接受操作的对象。
     * @param start 起点。
     * @param end 终点。
     * @return out 接受操作的对象。
     */

    static Line *fromPoints(Line *out, const Vec3 &start, const Vec3 &end);

    /**
     * @en
     * Set the components of a Vec3 to the given values
     * @zh
     * 将给定线的属性设置为给定值。
     * @param out 接受操作的对象。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     * @return out 接受操作的对象。
     */
    static Line *set(Line *out,
                     float sx,
                     float sy,
                     float sz,
                     float ex,
                     float ey,
                     float ez);

    /**
     * @zh
     * 计算线的长度。
     * @param a 要计算的线。
     * @return 长度。
     */
    static inline float len(const Line &a) {
        return a.s.distance(a.e);
    }

    /**
     * @zh
     * 起点。
     */
    Vec3 s;

    /**
     * @zh
     * 终点。
     */
    Vec3 e;

    /**
     * 构造一条线。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     */
    explicit Line(float sx = 0, float sy = 0, float sz = 0, float ex = 0, float ey = 0, float ez = -1);

    Line(const Line &) = default;
    Line &operator=(const Line &) = default;
    Line &operator=(Line &&) = default;
    Line(Line &&)            = default;
    ~Line() override         = default;

    /**
     * @zh
     * 计算线的长度。
     * @param a 要计算的线。
     * @return 长度。
     */

    inline float length() const {
        return s.distance(e);
    }
};

} // namespace geometry
} // namespace cc