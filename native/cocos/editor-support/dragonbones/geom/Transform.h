/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
#ifndef DRAGONBONES_TRANSFORM_H
#define DRAGONBONES_TRANSFORM_H

#include "../core/DragonBones.h"
#include "Matrix.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - 2D Transform.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 2D 变换。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class Transform final
{
public:
    /**
     * @private
     */
    static const float PI;
    /**
     * @private
     */
    static const float PI_D;
    /**
     * @private
     */
    static const float PI_H;
    /**
     * @private
     */
    static const float PI_Q;
    /**
     * @private
     */
    static const float DEG_RAD;
    /**
     * @private
     */
    static const float RAD_DEG;

    /**
     * @private
     */
    static float normalizeRadian(float value)
    {
        value = fmod(value + Transform::PI, Transform::PI * 2.0f);
        value += value > 0.0f ? -Transform::PI : Transform::PI;

        return value;
    }

public:
    /**
     * - Horizontal translate.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 水平位移。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float x;
    /**
     * - Vertical translate.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 垂直位移。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float y;
    /**
     * - Skew. (In radians)
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 倾斜。 （以弧度为单位）
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float skew;
    /**
     * - rotation. (In radians)
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 旋转。 （以弧度为单位）
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float rotation;
    /**
     * - Horizontal Scaling.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 水平缩放。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float scaleX;
    /**
     * - Vertical scaling.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 垂直缩放。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float scaleY;

    Transform():
        x(0.0f),
        y(0.0f),
        skew(0.0f),
        rotation(0.0f),
        scaleX(1.0f),
        scaleY(1.0f)
    {}
    /**
     * @private
     */
    Transform(const Transform& value)
    {
        operator=(value);
    }
    ~Transform() {}

    inline void operator=(const Transform& value)
    {
        x = value.x;
        y = value.y;
        skew = value.skew;
        rotation = value.rotation;
        scaleX = value.scaleX;
        scaleY = value.scaleY;
    }
    /**
     * @private
     */
    inline Transform& identity()
    {
        x = y = skew = rotation = 0.0f;
        scaleX = scaleY = 1.0f;

        return *this;
    }
    /**
     * @private
     */
    inline Transform& add(const Transform& value)
    {
        x += value.x;
        y += value.y;
        skew += value.skew;
        rotation += value.rotation;
        scaleX *= value.scaleX;
        scaleY *= value.scaleY;

        return *this;
    }
    /**
     * @private
     */
    inline Transform& minus(const Transform& value)
    {
        x -= value.x;
        y -= value.y;
        skew -= value.skew;
        rotation -= value.rotation;
        scaleX /= value.scaleX;
        scaleY /= value.scaleY;

        return *this;
    }
    /**
     * @private
     */
    inline Transform& fromMatrix(const Matrix& matrix)
    {
        const auto backupScaleX = scaleX, backupScaleY = scaleY;

        x = matrix.tx;
        y = matrix.ty;

        rotation = std::atan(matrix.b / matrix.a);
        auto skewX = std::atan(-matrix.c / matrix.d);

        scaleX = (rotation > -PI_Q && rotation < PI_Q) ? matrix.a / std::cos(rotation) : matrix.b / std::sin(rotation);
        scaleY = (skewX > -PI_Q && skewX < PI_Q) ? matrix.d / std::cos(skewX) : -matrix.c / std::sin(skewX);

        if (backupScaleX >= 0.0f && scaleX < 0.0f) 
        {
            scaleX = -scaleX;
            rotation = rotation - PI;
        }

        if (backupScaleY >= 0.0f && scaleY < 0.0f) 
        {
            scaleY = -scaleY;
            skewX = skewX - PI;
        }

        skew = skewX - rotation;

        return *this;
    }
    /**
     * @private
     */
    inline Transform& toMatrix(Matrix& matrix)
    {
        if (rotation == 0.0f)
        {
            matrix.a = 1.0f;
            matrix.b = 0.0f;
        }
        else 
        {
            matrix.a = std::cos(rotation);
            matrix.b = std::sin(rotation);
        }

        if (skew == 0.0f) 
        {
            matrix.c = -matrix.b;
            matrix.d = matrix.a;
        }
        else {
            matrix.c = -std::sin(skew + rotation);
            matrix.d = std::cos(skew + rotation);
        }

        if (scaleX != 1.0f) 
        {
            matrix.a *= scaleX;
            matrix.b *= scaleX;
        }

        if (scaleY != 1.0f) 
        {
            matrix.c *= scaleY;
            matrix.d *= scaleY;
        }

        matrix.tx = x;
        matrix.ty = y;

        return *this;
    }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_TRANSFORM_H
