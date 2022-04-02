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
#ifndef DRAGONBONES_MATRIX_H
#define DRAGONBONES_MATRIX_H

#include "../core/DragonBones.h"
#include "Point.h"
#include "Rectangle.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - 2D Transform matrix.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 2D 转换矩阵。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class Matrix
{
public:
    /**
     * - The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
     * @default 1.0
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 缩放或旋转图像时影响像素沿 x 轴定位的值。
     * @default 1.0
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float a;
    /**
     * - The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
     * @default 0.0
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 旋转或倾斜图像时影响像素沿 y 轴定位的值。
     * @default 0.0
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float b;
    /**
     * - The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
     * @default 0.0
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 旋转或倾斜图像时影响像素沿 x 轴定位的值。
     * @default 0.0
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float c;
    /**
     * - The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
     * @default 1.0
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 缩放或旋转图像时影响像素沿 y 轴定位的值。
     * @default 1.0
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float d;
    /**
     * - The distance by which to translate each point along the x axis.
     * @default 0.0
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 沿 x 轴平移每个点的距离。
     * @default 0.0
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float tx;
    /**
     * - The distance by which to translate each point along the y axis.
     * @default 0.0
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 沿 y 轴平移每个点的距离。
     * @default 0.0
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float ty;

    Matrix():
        a(1.0f),
        b(0.0f),
        c(0.0f),
        d(1.0f),
        tx(0.0f),
        ty(0.0f)
    {}
    /**
     * @private
     */
    Matrix(const Matrix& value)
    {
        operator=(value);
    }
    ~Matrix() {}

    inline void operator=(const Matrix& value)
    {
        a = value.a;
        b = value.b;
        c = value.c;
        d = value.d;
        tx = value.tx;
        ty = value.ty;
    }
    /**
     * - Convert to unit matrix.
     * The resulting matrix has the following properties: a=1, b=0, c=0, d=1, tx=0, ty=0.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 转换为单位矩阵。
     * 该矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0、ty=0。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline void identity()
    {
        a = d = 1.0f;
        b = c = 0.0f;
        tx = ty = 0.0f;
    }
    /**
     * - Multiplies the current matrix with another matrix.
     * @param value - The matrix that needs to be multiplied.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 将当前矩阵与另一个矩阵相乘。
     * @param value - 需要相乘的矩阵。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline void concat(const Matrix& value)
    {
        const auto aA = a;
        const auto bA = b;
        const auto cA = c;
        const auto dA = d;
        const auto txA = tx;
        const auto tyA = ty;
        const auto aB = value.a;
        const auto bB = value.b;
        const auto cB = value.c;
        const auto dB = value.d;
        const auto txB = value.tx;
        const auto tyB = value.ty;

        a = aA * aB + bA * cB;
        b = aA * bB + bA * dB;
        c = cA * aB + dA * cB;
        d = cA * bB + dA * dB;
        tx = aB * txA + cB * tyA + txB;
        ty = dB * tyA + bB * txA + tyB;
    }
    /**
     * - Convert to inverse matrix.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 转换为逆矩阵。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline void invert() 
    {
        const auto aA = a;
        const auto bA = b;
        const auto cA = c;
        const auto dA = d;
        const auto txA = tx;
        const auto tyA = ty;
        const auto n = aA * dA - bA * cA;

        a = dA / n;
        b = -bA / n;
        c = -cA / n;
        d = aA / n;
        tx = (cA * tyA - dA * txA) / n;
        ty = -(aA * tyA - bA * txA) / n;
    }
    /**
     * - Apply a matrix transformation to a specific point.
     * @param x - X coordinate.
     * @param y - Y coordinate.
     * @param result - The point after the transformation is applied.
     * @param delta - Whether to ignore tx, ty's conversion to point.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 将矩阵转换应用于特定点。
     * @param x - 横坐标。
     * @param y - 纵坐标。
     * @param result - 应用转换之后的点。
     * @param delta - 是否忽略 tx，ty 对点的转换。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline void transformPoint(float x, float y, Point& result, bool delta = false) const
    {
        result.x = a * x + c * y;
        result.y = b * x + d * y;

        if (!delta)
        {
            result.x += tx;
            result.y += ty;
        }
    }
    /**
     * @private
     */
    inline void transformRectangle(Rectangle& rectangle, bool delta = false) const
    {
        const auto offsetX = delta ? 0.0f : this->tx;
        const auto offsetY = delta ? 0.0f : this->ty;

        const auto x = rectangle.x;
        const auto y = rectangle.y;
        const auto xMax = x + rectangle.width;
        const auto yMax = y + rectangle.height;

        auto x0 = a * x + c * y + offsetX;
        auto y0 = b * x + d * y + offsetY;
        auto x1 = a * xMax + c * y + offsetX;
        auto y1 = b * xMax + d * y + offsetY;
        auto x2 = a * xMax + c * yMax + offsetX;
        auto y2 = b * xMax + d * yMax + offsetY;
        auto x3 = a * x + c * yMax + offsetX;
        auto y3 = b * x + d * yMax + offsetY;
        auto tmp = 0.0f;

        if (x0 > x1) 
        {
            tmp = x0;
            x0 = x1;
            x1 = tmp;
        }

        if (x2 > x3) 
        {
            tmp = x2;
            x2 = x3;
            x3 = tmp;
        }

        rectangle.x = std::floor(x0 < x2 ? x0 : x2);
        rectangle.width = std::ceil((x1 > x3 ? x1 : x3) - rectangle.x);

        if (y0 > y1) 
        {
            tmp = y0;
            y0 = y1;
            y1 = tmp;
        }

        if (y2 > y3) 
        {
            tmp = y2;
            y2 = y3;
            y3 = tmp;
        }

        rectangle.y = std::floor(y0 < y2 ? y0 : y2);
        rectangle.height = std::ceil((y1 > y3 ? y1 : y3) - rectangle.y);
    }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_MATRIX_H
