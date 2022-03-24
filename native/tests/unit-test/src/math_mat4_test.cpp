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
#include "cocos/math/Vec3.h"
#include "cocos/math/Vec4.h"
#include "cocos/math/Mat3.h"
#include "cocos/math/Mat4.h"
#include "cocos/math/Math.h"
#include "cocos/math/Quaternion.h"
#include "utils.h"
#include <math.h>

TEST(mathMat4Test, test5) {
    cc::Mat4 mat4;
    // createLookAt
    logLabel = "test the mat4 createLookAt function";
    cc::Vec3 eyePos(0, 0, -10);
    cc::Vec3 tarPos(0, 0, 0);
    cc::Vec3 up(0, 1, 0);
    cc::Mat4 outMat;
    cc::Mat4::createLookAt(eyePos, tarPos, up, &outMat);
    ExpectEq(outMat.m[0] == -1 && outMat.m[10] == -1 && outMat.m[14] == -10, true);
    cc::Mat4::createLookAt(eyePos.x, eyePos.y, eyePos.z, tarPos.x, tarPos.y, tarPos.z, up.x, up.y, up.z, &outMat);
    ExpectEq(outMat.m[0] == -1 && outMat.m[10] == -1 && outMat.m[14] == -10, true);
    // createPerspective
    logLabel = "test the mat4 createPerspective function";
    cc::Mat4::createPerspective(60, 1, 0, 100, &outMat);
    ExpectEq(outMat.m[10] == -1 && outMat.m[11] == -1, true);
    // createOrthographic
    logLabel = "test the mat4 createOrthographic function";
    cc::Mat4::createOrthographic(20, 40, 100, 200, 10, 100, &outMat);
    ExpectEq(outMat.m[12] == -3 && outMat.m[13] == -3, true);
    // createOrthographicOffCenter
    logLabel = "test the mat4 createOrthographicOffCenter function";
    cc::Mat4::createOrthographicOffCenter(20, 40, 100, 200, 10, 100, &outMat);
    ExpectEq(outMat.m[12] == -3 && outMat.m[13] == -3, true);
    cc::Mat4::createOrthographicOffCenter(20, 40, 100, 200, 10, 100, 0, 1, &outMat);
    ExpectEq(outMat.m[12] == -3 && outMat.m[13] == -3, true);
    // createBillboard
    logLabel = "test the mat4 createBillboard function";
    cc::Vec3 objectPosition(0, 0, 6);
    cc::Mat4::createBillboard(objectPosition, eyePos, up, &outMat);
    ExpectEq(outMat.m[10] == 1 && outMat.m[11] == 6, true);
    cc::Mat4::createBillboard(objectPosition, eyePos, up, &outMat);
    cc::Vec3 camForward(0, 0, 1);
    cc::Mat4::createBillboard(objectPosition, eyePos, up, camForward, &outMat);
    ExpectEq(outMat.m[10] == 1 && outMat.m[11] == 6, true);
    // createScale
    logLabel = "test the mat4 createScale function";
    cc::Vec3 scale(2, 3, 1);
    cc::Mat4::createScale(scale, &outMat);
    ExpectEq(outMat.m[0] == 2 && outMat.m[5] == 3, true);
    cc::Mat4::createScale(scale.x, scale.y, scale.z, &outMat);
    ExpectEq(outMat.m[0] == 2 && outMat.m[5] == 3, true);
    // createRotation
    logLabel = "test the mat4 createRotation function";
    cc::Quaternion rot(0, 0, 5, 1);
    cc::Mat4::createRotation(rot, &outMat);
    ExpectEq(outMat.m[4] == -10 && outMat.m[5] == -49, true);
    cc::Vec3 axis(0, 1, 0);
    cc::Mat4::createRotation(axis, cc::math::PI_DIV2, &outMat);
    ExpectEq(outMat.m[2] == -1 && outMat.m[8] == 1, true);
    // createRotationX
    logLabel = "test the mat4 createRotationX function";
    cc::Mat4::createRotationX(cc::math::PI, &outMat);
    ExpectEq(outMat.m[5] == -1 && outMat.m[10] == -1, true);
    // createRotationY
    logLabel = "test the mat4 createRotationY function";
    cc::Mat4::createRotationY(cc::math::PI, &outMat);
    ExpectEq(outMat.m[0] == -1 && outMat.m[10] == -1, true);
    // createRotationZ
    logLabel = "test the mat4 createRotationZ function";
    cc::Mat4::createRotationZ(cc::math::PI, &outMat);
    ExpectEq(outMat.m[0] == -1 && outMat.m[5] == -1, true);
    // createTranslation
    logLabel = "test the mat4 createTranslation function";
    cc::Vec3 trans(3, 2, 4);
    cc::Mat4::createTranslation(trans, &outMat);
    ExpectEq(outMat.m[12] == 3 && outMat.m[13] == 2 && outMat.m[14] == 4, true);
    cc::Mat4::createTranslation(trans.x, trans.y, trans.z, &outMat);
    ExpectEq(outMat.m[12] == 3 && outMat.m[13] == 2 && outMat.m[14] == 4, true);
    // add
    logLabel = "test the mat4 add function";
    cc::Mat4 addMat;
    addMat.add(5);
    ExpectEq(addMat.m[0] == 6 && addMat.m[5] == 6 && addMat.m[10] == 6, true);
    addMat.setIdentity();
    addMat.add(6, &addMat);
    ExpectEq(addMat.m[0] == 7 && addMat.m[5] == 7 && addMat.m[10] == 7, true);
    cc::Mat4 m1;
    m1.m[0] = 2;
    cc::Mat4 m2;
    m2.m[0] = 3;
    cc::Mat4::add(m1, m2, &outMat);
    ExpectEq(outMat.m[0] == 5, true);
    // fromRT
    logLabel = "test the mat4 fromRT function";
    cc::Quaternion rotVec(1, 0, 1, 1);
    cc::Vec3       transVec(1, 1, 2);
    cc::Mat4::fromRT(rotVec, transVec, &outMat);
    ExpectEq(outMat.m[5] == -3 && outMat.m[9] == -2 && outMat.m[14] == 2, true);
    // decompose
    logLabel = "test the mat4 decompose function";
    outMat.decompose(&scale, &rot, &transVec);
    ExpectEq(transVec.x == 1 && transVec.y == 1 && transVec.z == 2, true);
    // determinant
    logLabel = "test the mat4 determinant function";
    cc::Mat4 det;
    det.m[0]     = 5;
    det.m[1]     = 7;
    det.m[6]     = 2;
    float detVal = det.determinant();
    ExpectEq(detVal == 5, true);
    // getScale
    logLabel = "test the mat4 getScale function";
    cc::Mat4 getScaleMat;
    getScaleMat.m[0]  = 5;
    getScaleMat.m[5]  = 7;
    getScaleMat.m[10] = 2;
    cc::Vec3 scaleOut;
    getScaleMat.getScale(&scaleOut);
    ExpectEq(scaleOut.x == 5 && scaleOut.y == 7 && scaleOut.z == 2, true);
    // getRotation
    logLabel = "test the mat4 getRotation function";
    cc::Quaternion quat;
    outMat.getRotation(&quat);
    ExpectEq(IsEqualF(quat.x, 0.507208) && IsEqualF(quat.y, -0.06908) && IsEqualF(quat.z, 0.657192), true);
    // getTranslation
    logLabel = "test the mat4 getTranslation function";
    outMat.getTranslation(&transVec);
    ExpectEq(transVec.x == 1 && transVec.y == 1 && transVec.z == 2, true);
    // getUpVector
    logLabel = "test the mat4 getUpVector function";
    cc::Vec3 upVec3;
    outMat.getUpVector(&upVec3);
    ExpectEq(upVec3.x == -2 && upVec3.y == -3 && upVec3.z == 2, true);
    // getDownVector
    logLabel = "test the mat4 getDownVector function";
    cc::Vec3 downVec3;
    outMat.getDownVector(&downVec3);
    ExpectEq(downVec3.x == 2 && downVec3.y == 3 && downVec3.z == -2, true);
    // getLeftVector
    logLabel = "test the mat4 getLeftVector function";
    cc::Vec3 leftVec3;
    outMat.getLeftVector(&leftVec3);
    ExpectEq(leftVec3.x == 1 && leftVec3.y == -2 && leftVec3.z == -2, true);
    // getRightVector
    logLabel = "test the mat4 getRightVector function";
    cc::Vec3 rightVec3;
    outMat.getRightVector(&rightVec3);
    ExpectEq(rightVec3.x == -1 && rightVec3.y == 2 && rightVec3.z == 2, true);
    // getForwardVector
    logLabel = "test the mat4 getForwardVector function";
    cc::Vec3 forwardVec3;
    outMat.getForwardVector(&forwardVec3);
    ExpectEq(forwardVec3.x == -2 && forwardVec3.y == 2 && forwardVec3.z == 1, true);
    // getBackVector
    logLabel = "test the mat4 getBackVector function";
    cc::Vec3 backVec3;
    outMat.getBackVector(&backVec3);
    ExpectEq(backVec3.x == 2 && backVec3.y == -2 && backVec3.z == -1, true);
    // inverse
    logLabel       = "test the mat4 inverse function";
    bool isInverse = outMat.inverse();
    ExpectEq(isInverse == true, true);
    // getInversed
    logLabel = "test the mat4 getInversed function";
    cc::Mat4 inversed;
    inversed.m[1]        = 10;
    inversed.m[2]        = 13;
    inversed.m[4]        = 2;
    cc::Mat4 inversedMat = inversed.getInversed();
    ExpectEq(IsEqualF(inversedMat.m[6], -1.36842108), true);
    // identity
    logLabel = "test the mat4 isIdentity function";
    ExpectEq(outMat.isIdentity(), false);
    outMat.setIdentity();
    ExpectEq(outMat.isIdentity(), true);
    // multiply
    logLabel = "test the mat4 multiply function";
    outMat.multiply(7);
    ExpectEq(outMat.m[0] == 7, true);
    outMat.setIdentity();
    outMat.multiply(6, &outMat);
    ExpectEq(outMat.m[0] == 6, true);
    // negate
    logLabel = "test the mat4 negate function";
    outMat.negate();
    ExpectEq(outMat.m[0] == -6, true);
    outMat.multiply(2);
    outMat = outMat.getNegated();
    ExpectEq(outMat.m[0] == 12, true);
    // rotate
    logLabel = "test the mat4 rotate function";
    outMat.setIdentity();
    cc::Quaternion rotateQuat(3, 0, 0, 1);
    outMat.rotate(rotateQuat);
    ExpectEq(outMat.m[5] == -17 && outMat.m[9] == -6, true);
    outMat.setIdentity();
    cc::Vec3 rAxis(1, 0, 0);
    outMat.rotate(rAxis, cc::math::PI_DIV2);
    ExpectEq(IsEqualF(outMat.m[0], 1) && outMat.m[9] == -1, true);
    outMat.setIdentity();
    outMat.rotateX(cc::math::PI_DIV2);
    ExpectEq(IsEqualF(outMat.m[0], 1) && outMat.m[9] == -1, true);
    outMat.setIdentity();
    outMat.rotateY(cc::math::PI_DIV2);
    ExpectEq(IsEqualF(outMat.m[2], -1), true);
    outMat.setIdentity();
    outMat.rotateZ(cc::math::PI_DIV2);
    ExpectEq(outMat.m[4] == -1, true);
    // scale
    logLabel = "test the mat4 scale function";
    outMat.setIdentity();
    outMat.scale(6);
    ExpectEq(outMat.m[0] == 6 && outMat.m[5] == 6, true);
    outMat.setIdentity();
    outMat.scale(6, 4, 2);
    ExpectEq(outMat.m[0] == 6 && outMat.m[5] == 4, true);
    // setZero
    logLabel = "test the mat4 setZero function";
    outMat.setZero();
    ExpectEq(outMat.m[0] == 0 && outMat.m[5] == 0, true);
    // subtract
    logLabel = "test the mat4 subtract function";
    cc::Mat4::subtract(m1, m2, &outMat);
    ExpectEq(outMat.m[0] == -1, true);
    // transformPoint
    logLabel = "test the mat4 transformPoint function";
    cc::Vec3 transformPot(0, 3, 0);
    outMat.setIdentity();
    outMat.m[13] = 2;
    outMat.transformPoint(&transformPot);
    ExpectEq(transformPot.y == 5, true);
    // translate
    logLabel = "test the mat4 translate function";
    cc::Mat4 translate;
    translate.m[13] = 3;
    translate.m[14] = 2;
    cc::Vec3 pos(1, 2, 0);
    cc::Mat4 transOut;
    translate.translate(2, 3, 0);
    ExpectEq(translate.m[12] = 2 && translate.m[13] == 6, true);
    // transpose
    logLabel = "test the mat4 transpose function";
    cc::Mat4 matTranspose(11, 21, 31, 2, 12, 22, 32, 4, 13, 23, 33, 5, 0, 0, 0, 1);
    matTranspose.transpose();
    ExpectEq(matTranspose.m[1] == 21 && matTranspose.m[4] == 12 && matTranspose.m[7] == 4, true);
}
