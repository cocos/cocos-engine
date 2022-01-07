/****************************************************************************
 Copyright (c) 2018-2021 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos.com
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#ifndef MATH_MAT3_H
#define MATH_MAT3_H

#define MATRIX3_SIZE (sizeof(float) * 9)

#include "base/Macros.h"

#include "math/Mat4.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"

/**
 * @addtogroup base
 * @{
 */

NS_CC_MATH_BEGIN

class CC_DLL Mat3 {
public:
    /**
     * Stores the columns of this 3x3 matrix.
     * */
    float m[9];

    /**
     * Default constructor.
     * Constructs a matrix initialized to the identity matrix:
     *
     *     1  0  0
     *     0  1  0
     *     0  0  1
     */
    Mat3();

    /**
     * Constructs a matrix initialized to the specified value.
     *
     * @param m11 The first element of the first row.
     * @param m12 The second element of the first row.
     * @param m13 The third element of the first row.
     * @param m21 The first element of the second row.
     * @param m22 The second element of the second row.
     * @param m23 The third element of the second row.
     * @param m31 The first element of the third row.
     * @param m32 The second element of the third row.
     * @param m33 The third element of the third row.
     */
    Mat3(float m11, float m12, float m13, float m21, float m22, float m23, float m31, float m32, float m33);

    /**
     * Creates a matrix initialized to the specified column-major array.
     *
     * The passed-in array is in column-major order, so the memory layout of the array is as follows:
     *
     *     0   3   6
     *     1   4   7
     *     2   5   8
     *
     * @param mat An array containing 16 elements in column-major order.
     */
    explicit Mat3(const float *mat);

    /**
     * Constructs a new matrix by copying the values from the specified matrix.
     *
     * @param copy The matrix to copy.
     */
    Mat3(const Mat3 &copy);

    /**
     * Destructor.
     */
    ~Mat3() = default;

    /**
     * Sets the values of this matrix.
     *
     * @param m11 The first element of the first row.
     * @param m12 The second element of the first row.
     * @param m13 The third element of the first row.
     * @param m21 The first element of the second row.
     * @param m22 The second element of the second row.
     * @param m23 The third element of the second row.
     * @param m31 The first element of the third row.
     * @param m32 The second element of the third row.
     * @param m33 The third element of the third row.
     */
    void set(float m11, float m12, float m13, float m21, float m22, float m23,
             float m31, float m32, float m33);

    /**
     * Sets the values of this matrix to those in the specified column-major array.
     *
     * @param mat An array containing 9 elements in column-major format.
     */
    void set(const float *mat);

    /**
     * Sets the values of this matrix to those of the specified matrix.
     *
     * @param mat The source matrix.
     */
    void set(const Mat3 &mat);

    /**
     * return an identity matrix.
     */
    static void identity(Mat3 &mat);

    /**
     * Transposes matrix.
     */
    void transpose();

    /**
     * Transposes a matrix.
     */
    static void transpose(const Mat3 &mat, Mat3 *out);

    /**
     * Inverts a matrix.
     */
    void inverse();

    /**
     * Calculates the adjugate of a matrix.
     */
    static void adjoint(const Mat3 &mat, Mat3 *out);

    /**
     * Calculates the determinant of a matrix.
     */
    float determinant();

    /**
     * Multiply two matrices explicitly.
     */
    static void multiply(const Mat3 &a, const Mat3 &b, Mat3 *out);

    /**
     * Multiply a matrix with a translation matrix given by a translation offset.
     */
    static void translate(const Mat3 &mat, const Vec2 &vec, Mat3 *out);

    /**
     * Rotates a matrix by the given angle.
     */
    static void rotate(const Mat3 &mat, float rad, Mat3 *out);

    /**
     * Multiply a matrix with a scale matrix given by a scale vector.
     */
    static void scale(const Mat3 &mat, const Vec2 &vec, Mat3 *out);

    /**
     * Copies the upper-left 3x3 values of a 4x4 matrix into a 3x3 matrix.
     */
    static void fromMat4(const Mat4 &mat, Mat3 *out);

    /**
     * Creates a matrix from a translation offset.
     */
    static void fromTranslation(const Vec2 &vec, Mat3 *out);

    /**
     * Creates a matrix from a given angle.
     */
    static void fromRotation(float rad, Mat3 *out);

    /**
     * Creates a matrix from a scale vector.
     */
    static void fromScaling(const Vec2 &vec, Mat3 *out);

    /**
     * Sets a third order matrix with view direction and up direction. Then save the results to out matrix
     */
    static void fromViewUp(const Vec3 &view, Mat3 *out);
    static void fromViewUp(const Vec3 &view, const Vec3 &up, Mat3 *out);

    /**
     * Calculates a 3x3 matrix from the given quaternion.
     */

    static void fromQuat(const Quaternion &quat, Mat3 *out);

    /**
     * Adds two matrices.
     */
    static void add(const Mat3 &a, const Mat3 &b, Mat3 *out);

    /**
     * Subtracts matrix b from matrix a.
     */
    static void subtract(const Mat3 &a, const Mat3 &b, Mat3 *out);

    /** equals to a matrix full of zeros */
    static const Mat3 ZERO;
    /** equals to the identity matrix */
    static const Mat3 IDENTITY;
};

NS_CC_MATH_END

/**
 end of base group
 @}
 */

#endif
