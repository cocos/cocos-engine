/****************************************************************************
Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

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
#include "gtest/gtest.h"
#include "cocos/math/Vec2.h"
#include "cocos/math/Mat3.h"
#include "cocos/math/Mat4.h"
#include "cocos/math/Math.h"
#include "cocos/math/Quaternion.h"
#include "utils.h"
#include <math.h>

TEST(mathMat3Test, test4) {
    cc::Mat3 mat3(0,2,3, 4,5,6, 7,8,9);
    // identity
    logLabel = "test the mat3 identity function";
    cc::Mat3::identity(mat3);
    ExpectEq(mat3.m[0] == 1 && mat3.m[4] == 1 && mat3.m[8] == 1, true);
    // transpose
    logLabel = "test the mat3 transpose function";
    mat3.set(11,21,31,  12,22,32,  13,23,33);
    mat3.transpose();
    ExpectEq(mat3.m[1] == 21 && mat3.m[4] == 22 && mat3.m[7] == 23, true);
    cc::Mat3 matTemp(11,21,31,  12,22,32,  13,23,33);
    cc::Mat3::transpose(mat3, matTemp);
    ExpectEq(mat3.m[1] == 21 && mat3.m[4] == 22 && mat3.m[7] == 23, true);
    // inverse
    logLabel = "test the mat3 inverse function";
    mat3.set(0, 2, 0, 3, 0, 0, 2, 0, 1);
    mat3.inverse();
    ExpectEq(mat3.m[1] == 0.5f && mat3.m[8] == 1, true);
    // adjoint
    logLabel = "test the mat3 adjoint function";
    cc::Mat3 matAdj(0, 2, 0, 3, 0, 0, 2, 0, 1);
    cc::Mat3::adjoint(mat3, matAdj);
    ExpectEq(mat3.m[1] == -3 && mat3.m[3] == -2 && mat3.m[8] == -6, true);
    // determinant
    logLabel = "test the mat3 determinant function";
    mat3.set(1, 0, 3, 2, 1, 0, 4, 0, 2);
    float det = mat3.determinant();
    ExpectEq(det == -10, true);
    // multiply
    logLabel = "test the mat3 multiply function";
    cc::Mat3 lm(2, 3, 1, 4, 7, 3, 8, 2, 0);
    cc::Mat3 rm(5, 2, 6, 8, 1, 0, 6, 5, 4);
    cc::Mat3::multiply(mat3, lm, rm);
    ExpectEq(mat3.m[0] == 40 && mat3.m[4] == 30 && mat3.m[8] == 48, true);
    // translate
    logLabel = "test the mat3 translate function";
    cc::Mat3 translate;
    translate.m[6] = 3;
    translate.m[7] = 2;
    cc::Vec2 pos(1, 2);
    cc::Mat3 transOut;
    cc::Mat3::translate(transOut, translate, pos);
    ExpectEq(transOut.m[6] == 4 && transOut.m[7] == 4, true);
    cc::Mat3::fromTranslation(transOut, pos);
    ExpectEq(transOut.m[7] == 2, true);
    // rotate
    logLabel = "test the mat3 rotate function";
    cc::Mat3 rotate;
    cc::Mat3 rotateOut;
    cc::Mat3::rotate(rotateOut, rotate, cc::math::PI_DIV2);
    ExpectEq(rotateOut.m[1] == 1 && rotateOut.m[3] == -1, true);
    cc::Mat3::fromRotation(rotateOut, cc::math::PI_DIV2);
    ExpectEq(rotateOut.m[1] == 1 && rotateOut.m[3] == -1, true);
    // scale
    logLabel = "test the mat3 scale function";
    cc::Mat3 scale;
    cc::Mat3 scaleOut;
    cc::Vec2 scaleVec(2, 1);
    cc::Mat3::scale(scaleOut, scale, scaleVec);
    ExpectEq(scaleOut.m[0] == 2, true);
    cc::Mat3::fromScaling(scaleOut, scaleVec);
    ExpectEq(scaleOut.m[0] == 2, true);
    // fromMat4
    logLabel = "test the mat3 fromMat4 function";
    cc::Mat4 fromMat4;
    fromMat4.m[0] = 3;
    fromMat4.m[4] = 6;
    fromMat4.m[5] = 7;
    cc::Mat3 copyMat;
    cc::Mat3::fromMat4(copyMat, fromMat4);
    ExpectEq(copyMat.m[0] == 3 && copyMat.m[3] == 6 && copyMat.m[4] == 7, true);
    // fromQuat
    logLabel = "test the mat3 fromQuat function";
    cc::Mat3 fromQuat;
    cc::Quaternion quat(0, 0, 3, 1);
    cc::Mat3::fromQuat(fromQuat, quat);
    ExpectEq(copyMat.m[0] == 3 && copyMat.m[3] == 6 && copyMat.m[4] == 7, true);
    // add
    logLabel = "test the mat3 add function";
    cc::Mat3 lAdd(9,0,0, 3,8,0, 9,0,0);
    cc::Mat3 rAdd(1,0,0, 5,2,0, 1,0,0);
    cc::Mat3 addOut;
    cc::Mat3::add(addOut, lAdd, rAdd);
    ExpectEq(addOut.m[0] == 10 && addOut.m[2] == 10 && addOut.m[4] == 10, true);
    // subtract
    logLabel = "test the mat3 subtract function";
    cc::Mat3 subOut;
    cc::Mat3::subtract(subOut, lAdd, rAdd);
    ExpectEq(subOut.m[0] == 8 && subOut.m[2] == 8 && subOut.m[4] == 6, true);
}

