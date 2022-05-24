#pragma once

#include "cocos/core/geometry/Enums.h"
#include "cocos/math/Mat3.h"
#include "cocos/math/Quaternion.h"
#include "cocos/math/Vec3.h"

namespace cc {
namespace geometry {
class OBB final : public ShapeBase {
public:
    /**
     * @en
     * create a new obb
     * @zh
     * 创建一个新的 obb 实例。
     * @param cx 形状的相对于原点的 X 坐标。
     * @param cy 形状的相对于原点的 Y 坐标。
     * @param cz 形状的相对于原点的 Z 坐标。
     * @param hw - obb 宽度的一半。
     * @param hh - obb 高度的一半。
     * @param hl - obb 长度的一半。
     * @param ox1 方向矩阵参数。
     * @param ox2 方向矩阵参数。
     * @param ox3 方向矩阵参数。
     * @param oy1 方向矩阵参数。
     * @param oy2 方向矩阵参数。
     * @param oy3 方向矩阵参数。
     * @param oz1 方向矩阵参数。
     * @param oz2 方向矩阵参数。
     * @param oz3 方向矩阵参数。
     * @return 返回一个 obb。
     */
    static OBB *create(
        float cx, float cy, float cz,
        float hw, float hh, float hl,
        float ox1, float ox2, float ox3,
        float oy1, float oy2, float oy3,
        float oz1, float oz2, float oz3);

    /**
     * @en
     * clone a new obb
     * @zh
     * 克隆一个 obb。
     * @param a 克隆的目标。
     * @returns 克隆出的新对象。
     */
    static OBB *clone(const OBB &a);
    /**
     * @en
     * copy the values from one obb to another
     * @zh
     * 将从一个 obb 的值复制到另一个 obb。
     * @param {OBB} out 接受操作的 obb。
     * @param {OBB} a 被复制的 obb。
     * @return {OBB} out 接受操作的 obb。
     */
    static OBB *copy(OBB *out, const OBB &a);

    /**
     * @en
     * create a new obb from two corner points
     * @zh
     * 用两个点创建一个新的 obb。
     * @param out - 接受操作的 obb。
     * @param minPos - obb 的最小点。
     * @param maxPos - obb 的最大点。
     * @returns {OBB} out 接受操作的 obb。
     */
    static OBB *fromPoints(OBB *out, const Vec3 &minPos, const Vec3 &maxPos);

    /**
     * @en
     * Set the components of a obb to the given values
     * @zh
     * 将给定 obb 的属性设置为给定的值。
     * @param cx - obb 的原点的 X 坐标。
     * @param cy - obb 的原点的 Y 坐标。
     * @param cz - obb 的原点的 Z 坐标。
     * @param hw - obb 宽度的一半。
     * @param hh - obb 高度的一半。
     * @param hl - obb 长度的一半。
     * @param ox1 方向矩阵参数。
     * @param ox2 方向矩阵参数。
     * @param ox3 方向矩阵参数。
     * @param oy1 方向矩阵参数。
     * @param oy2 方向矩阵参数。
     * @param oy3 方向矩阵参数。
     * @param oz1 方向矩阵参数。
     * @param oz2 方向矩阵参数。
     * @param oz3 方向矩阵参数。
     * @return {OBB} out
     */

    static OBB *set(OBB * out,
                    float cx, float cy, float cz,
                    float hw, float hh, float hl,
                    float ox1, float ox2, float ox3,
                    float oy1, float oy2, float oy3,
                    float oz1, float oz2, float oz3);

    /**
     * @zh
     * 本地坐标的中心点。
     */
    Vec3 center;

    /**
     * @zh
     * 长宽高的一半。
     */
    Vec3 halfExtents;

    /**
     * @zh
     * 方向矩阵。
     */

    Mat3 orientation;

    explicit OBB(float cx = 0, float cy = 0, float cz = 0,
                 float hw = 1, float hh = 1, float hl = 1,
                 float ox1 = 1, float ox2 = 0, float ox3 = 0,
                 float oy1 = 0, float oy2 = 1, float oy3 = 0,
                 float oz1 = 0, float oz2 = 0, float oz3 = 1);

    /**
     * @en
     * Get the bounding points of this shape
     * @zh
     * 获取 obb 的最小点和最大点。
     * @param {Vec3} minPos 最小点。
     * @param {Vec3} maxPos 最大点。
     */
    void getBoundary(Vec3 *minPos, Vec3 *maxPos) const;
    /**
     * Transform this shape
     * @zh
     * 将 out 根据这个 obb 的数据进行变换。
     * @param m 变换的矩阵。
     * @param pos 变换的位置部分。
     * @param rot 变换的旋转部分。
     * @param scale 变换的缩放部分。
     * @param out 变换的目标。
     */
    void transform(const Mat4 &m, const Vec3 &pos, const Quaternion &rot, const Vec3 &scale, OBB *out) const;

    /**
     * @zh
     * 将 out 根据这个 obb 的数据进行变换。
     * @param m 变换的矩阵。
     * @param rot 变换的旋转部分。
     * @param out 变换的目标。
     */
    void translateAndRotate(const Mat4 &m, const Quaternion &rot, OBB *out) const;

    /**
     * @zh
     *  将 out 根据这个 obb 的数据进行缩放。
     * @param scale 缩放值。
     * @param out 缩放的目标。
     */
    void setScale(const Vec3 &scale, OBB *out) const;
};

} // namespace geometry
} // namespace cc