/**
 Copyright 2013 BlackBerry Inc.
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Original file from GamePlay3D: http://gameplay3d.org

 This file was modified to fit the cocos2d-x project
 */

#include "math/Mat4.h"

#include <cmath>
#include <cstring>
#include "base/Log.h"
#include "base/std/container/array.h"
#include "math/MathUtil.h"
#include "math/Quaternion.h"

NS_CC_MATH_BEGIN

namespace {

const ccstd::array<ccstd::array<float, 4>, 4> PRE_TRANSFORMS = {{
    {{1, 0, 0, 1}},   // SurfaceTransform.IDENTITY
    {{0, 1, -1, 0}},  // SurfaceTransform.ROTATE_90
    {{-1, 0, 0, -1}}, // SurfaceTransform.ROTATE_180
    {{0, -1, 1, 0}}   // SurfaceTransform.ROTATE_270
}};

}

Mat4::Mat4() {
    // As JS defautl mat4 is zero, so change it to zero.
    *this = IDENTITY;
}

Mat4::Mat4(float m11, float m12, float m13, float m14, float m21, float m22, float m23, float m24,
           float m31, float m32, float m33, float m34, float m41, float m42, float m43, float m44) {
    set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
}

Mat4::Mat4(const float *mat) {
    set(mat);
}

Mat4::Mat4(const Mat4 &copy) {
    memcpy(m, copy.m, MATRIX_SIZE);
}

void Mat4::createLookAt(const Vec3 &eyePosition, const Vec3 &targetPosition, const Vec3 &up, Mat4 *dst) {
    createLookAt(eyePosition.x, eyePosition.y, eyePosition.z, targetPosition.x, targetPosition.y, targetPosition.z,
                 up.x, up.y, up.z, dst);
}

void Mat4::createLookAt(float eyePositionX, float eyePositionY, float eyePositionZ,
                        float targetPositionX, float targetPositionY, float targetPositionZ,
                        float upX, float upY, float upZ, Mat4 *dst) {
    CC_ASSERT(dst);

    Vec3 eye(eyePositionX, eyePositionY, eyePositionZ);
    Vec3 target(targetPositionX, targetPositionY, targetPositionZ);
    Vec3 up(upX, upY, upZ);
    up.normalize();

    Vec3 zaxis;
    Vec3::subtract(eye, target, &zaxis);
    zaxis.normalize();

    Vec3 xaxis;
    Vec3::cross(up, zaxis, &xaxis);
    xaxis.normalize();

    Vec3 yaxis;
    Vec3::cross(zaxis, xaxis, &yaxis);
    yaxis.normalize();

    dst->m[0] = xaxis.x;
    dst->m[1] = yaxis.x;
    dst->m[2] = zaxis.x;
    dst->m[3] = 0.0F;

    dst->m[4] = xaxis.y;
    dst->m[5] = yaxis.y;
    dst->m[6] = zaxis.y;
    dst->m[7] = 0.0F;

    dst->m[8] = xaxis.z;
    dst->m[9] = yaxis.z;
    dst->m[10] = zaxis.z;
    dst->m[11] = 0.0F;

    dst->m[12] = -Vec3::dot(xaxis, eye);
    dst->m[13] = -Vec3::dot(yaxis, eye);
    dst->m[14] = -Vec3::dot(zaxis, eye);
    dst->m[15] = 1.0F;
}

void Mat4::createPerspective(float fieldOfView, float aspectRatio, float zNearPlane, float zFarPlane,
                             bool isFieldOfViewY, float minClipZ, float projectionSignY, int orientation, Mat4 *dst) {
    CC_ASSERT(dst);
    CC_ASSERT_NE(zFarPlane, zNearPlane);
    CC_ASSERT(fieldOfView != 0.0F);

    const float f = 1.0F / tanf(fieldOfView / 2.0F);
    const float nf = 1.0F / (zNearPlane - zFarPlane);

    const float x = isFieldOfViewY ? f / aspectRatio : f;
    const float y = (isFieldOfViewY ? f : f * aspectRatio) * projectionSignY;

    const ccstd::array<float, 4> &preTransform = PRE_TRANSFORMS[orientation];

    dst->m[0] = x * preTransform[0];
    dst->m[1] = x * preTransform[1];
    dst->m[2] = 0.0F;
    dst->m[3] = 0.0F;
    dst->m[4] = y * preTransform[2];
    dst->m[5] = y * preTransform[3];
    dst->m[6] = 0.0F;
    dst->m[7] = 0.0F;
    dst->m[8] = 0.0F;
    dst->m[9] = 0.0F;
    dst->m[10] = (zFarPlane - minClipZ * zNearPlane) * nf;
    dst->m[11] = -1.0F;
    dst->m[12] = 0.0F;
    dst->m[13] = 0.0F;
    dst->m[14] = zFarPlane * zNearPlane * nf * (1.0F - minClipZ);
    dst->m[15] = 0.0F;
}

void Mat4::createOrthographic(float left, float right, float bottom, float top, float zNearPlane, float zFarPlane, Mat4 *dst) {
    createOrthographicOffCenter(left, right, bottom, top, zNearPlane, zFarPlane, dst);
}

void Mat4::createOrthographicOffCenter(float left, float right, float bottom, float top,
                                       float zNearPlane, float zFarPlane, Mat4 *dst) {
    createOrthographicOffCenter(left, right, bottom, top, zNearPlane, zFarPlane, -1.0F, 1.0F, 0, dst);
}

void Mat4::createOrthographicOffCenter(float left, float right, float bottom, float top, float zNearPlane, float zFarPlane, float minClipZ, float projectionSignY, int orientation, Mat4 *dst) {
    CC_ASSERT(dst);
    CC_ASSERT_NE(right, left);
    CC_ASSERT_NE(top, bottom);
    CC_ASSERT_NE(zFarPlane, zNearPlane);

    const ccstd::array<float, 4> &preTransform = PRE_TRANSFORMS[orientation];
    const float lr = 1.F / (left - right);
    const float bt = 1.F / (bottom - top) * projectionSignY;
    const float nf = 1.F / (zNearPlane - zFarPlane);

    const float x = -2 * lr;
    const float y = -2 * bt;
    const float dx = (left + right) * lr;
    const float dy = (top + bottom) * bt;

    dst->m[0] = x * preTransform[0];
    dst->m[1] = x * preTransform[1];
    dst->m[2] = 0;
    dst->m[3] = 0;
    dst->m[4] = y * preTransform[2];
    dst->m[5] = y * preTransform[3];
    dst->m[6] = 0;
    dst->m[7] = 0;
    dst->m[8] = 0;
    dst->m[9] = 0;
    dst->m[10] = nf * (1 - minClipZ);
    dst->m[11] = 0;
    dst->m[12] = dx * preTransform[0] + dy * preTransform[2];
    dst->m[13] = dx * preTransform[1] + dy * preTransform[3];
    dst->m[14] = (zNearPlane - minClipZ * zFarPlane) * nf;
    dst->m[15] = 1.F;
}

void Mat4::createBillboard(const Vec3 &objectPosition, const Vec3 &cameraPosition,
                           const Vec3 &cameraUpVector, Mat4 *dst) {
    createBillboardHelper(objectPosition, cameraPosition, cameraUpVector, nullptr, dst);
}

void Mat4::createBillboard(const Vec3 &objectPosition, const Vec3 &cameraPosition,
                           const Vec3 &cameraUpVector, const Vec3 &cameraForwardVector,
                           Mat4 *dst) {
    createBillboardHelper(objectPosition, cameraPosition, cameraUpVector, &cameraForwardVector, dst);
}

void Mat4::createBillboardHelper(const Vec3 &objectPosition, const Vec3 &cameraPosition,
                                 const Vec3 &cameraUpVector, const Vec3 *cameraForwardVector,
                                 Mat4 *dst) {
    Vec3 delta(objectPosition, cameraPosition);
    bool isSufficientDelta = delta.lengthSquared() > MATH_EPSILON;

    dst->setIdentity();
    dst->m[3] = objectPosition.x;
    dst->m[7] = objectPosition.y;
    dst->m[11] = objectPosition.z;

    // As per the contracts for the 2 variants of createBillboard, we need
    // either a safe default or a sufficient distance between object and camera.
    if (cameraForwardVector || isSufficientDelta) {
        Vec3 target = isSufficientDelta ? cameraPosition : (objectPosition - *cameraForwardVector);

        // A billboard is the inverse of a lookAt rotation
        Mat4 lookAt;
        createLookAt(objectPosition, target, cameraUpVector, &lookAt);
        dst->m[0] = lookAt.m[0];
        dst->m[1] = lookAt.m[4];
        dst->m[2] = lookAt.m[8];
        dst->m[4] = lookAt.m[1];
        dst->m[5] = lookAt.m[5];
        dst->m[6] = lookAt.m[9];
        dst->m[8] = lookAt.m[2];
        dst->m[9] = lookAt.m[6];
        dst->m[10] = lookAt.m[10];
    }
}

// void Mat4::createReflection(const Plane& plane, Mat4* dst)
// {
//     Vec3 normal(plane.getNormal());
//     float k = -2.0f * plane.getDistance();

//     dst->setIdentity();

//     dst->m[0] -= 2.0f * normal.x * normal.x;
//     dst->m[5] -= 2.0f * normal.y * normal.y;
//     dst->m[10] -= 2.0f * normal.z * normal.z;
//     dst->m[1] = dst->m[4] = -2.0f * normal.x * normal.y;
//     dst->m[2] = dst->m[8] = -2.0f * normal.x * normal.z;
//     dst->m[6] = dst->m[9] = -2.0f * normal.y * normal.z;

//     dst->m[3] = k * normal.x;
//     dst->m[7] = k * normal.y;
//     dst->m[11] = k * normal.z;
// }

void Mat4::createScale(const Vec3 &scale, Mat4 *dst) {
    CC_ASSERT(dst);

    memcpy(dst->m, IDENTITY.m, MATRIX_SIZE);

    dst->m[0] = scale.x;
    dst->m[5] = scale.y;
    dst->m[10] = scale.z;
}

void Mat4::createScale(float xScale, float yScale, float zScale, Mat4 *dst) {
    CC_ASSERT(dst);

    memcpy(dst->m, IDENTITY.m, MATRIX_SIZE);

    dst->m[0] = xScale;
    dst->m[5] = yScale;
    dst->m[10] = zScale;
}

void Mat4::createRotation(const Quaternion &q, Mat4 *dst) {
    CC_ASSERT(dst);

    float x2 = q.x + q.x;
    float y2 = q.y + q.y;
    float z2 = q.z + q.z;

    float xx2 = q.x * x2;
    float yy2 = q.y * y2;
    float zz2 = q.z * z2;
    float xy2 = q.x * y2;
    float xz2 = q.x * z2;
    float yz2 = q.y * z2;
    float wx2 = q.w * x2;
    float wy2 = q.w * y2;
    float wz2 = q.w * z2;

    dst->m[0] = 1.0F - yy2 - zz2;
    dst->m[1] = xy2 + wz2;
    dst->m[2] = xz2 - wy2;
    dst->m[3] = 0.0F;

    dst->m[4] = xy2 - wz2;
    dst->m[5] = 1.0F - xx2 - zz2;
    dst->m[6] = yz2 + wx2;
    dst->m[7] = 0.0F;

    dst->m[8] = xz2 + wy2;
    dst->m[9] = yz2 - wx2;
    dst->m[10] = 1.0F - xx2 - yy2;
    dst->m[11] = 0.0F;

    dst->m[12] = 0.0F;
    dst->m[13] = 0.0F;
    dst->m[14] = 0.0F;
    dst->m[15] = 1.0F;
}

void Mat4::createRotation(const Vec3 &axis, float angle, Mat4 *dst) {
    CC_ASSERT(dst);

    float x = axis.x;
    float y = axis.y;
    float z = axis.z;

    // Make sure the input axis is normalized.
    float n = x * x + y * y + z * z;
    if (n != 1.0F) {
        // Not normalized.
        n = std::sqrt(n);
        // Prevent divide too close to zero.
        if (n > 0.000001F) {
            n = 1.0F / n;
            x *= n;
            y *= n;
            z *= n;
        }
    }

    float c = std::cos(angle);
    float s = std::sin(angle);

    float t = 1.0F - c;
    float tx = t * x;
    float ty = t * y;
    float tz = t * z;
    float txy = tx * y;
    float txz = tx * z;
    float tyz = ty * z;
    float sx = s * x;
    float sy = s * y;
    float sz = s * z;

    dst->m[0] = c + tx * x;
    dst->m[1] = txy + sz;
    dst->m[2] = txz - sy;
    dst->m[3] = 0.0F;

    dst->m[4] = txy - sz;
    dst->m[5] = c + ty * y;
    dst->m[6] = tyz + sx;
    dst->m[7] = 0.0F;

    dst->m[8] = txz + sy;
    dst->m[9] = tyz - sx;
    dst->m[10] = c + tz * z;
    dst->m[11] = 0.0F;

    dst->m[12] = 0.0F;
    dst->m[13] = 0.0F;
    dst->m[14] = 0.0F;
    dst->m[15] = 1.0F;
}

void Mat4::createRotationX(float angle, Mat4 *dst) {
    CC_ASSERT(dst);

    memcpy(dst->m, IDENTITY.m, MATRIX_SIZE);

    float c = std::cos(angle);
    float s = std::sin(angle);

    dst->m[5] = c;
    dst->m[6] = s;
    dst->m[9] = -s;
    dst->m[10] = c;
}

void Mat4::createRotationY(float angle, Mat4 *dst) {
    CC_ASSERT(dst);

    memcpy(dst->m, IDENTITY.m, MATRIX_SIZE);

    float c = std::cos(angle);
    float s = std::sin(angle);

    dst->m[0] = c;
    dst->m[2] = -s;
    dst->m[8] = s;
    dst->m[10] = c;
}

void Mat4::createRotationZ(float angle, Mat4 *dst) {
    CC_ASSERT(dst);

    memcpy(dst->m, IDENTITY.m, MATRIX_SIZE);

    float c = std::cos(angle);
    float s = std::sin(angle);

    dst->m[0] = c;
    dst->m[1] = s;
    dst->m[4] = -s;
    dst->m[5] = c;
}

void Mat4::createTranslation(const Vec3 &translation, Mat4 *dst) {
    CC_ASSERT(dst);

    memcpy(dst->m, IDENTITY.m, MATRIX_SIZE);

    dst->m[12] = translation.x;
    dst->m[13] = translation.y;
    dst->m[14] = translation.z;
}

void Mat4::createTranslation(float xTranslation, float yTranslation, float zTranslation, Mat4 *dst) {
    CC_ASSERT(dst);

    memcpy(dst->m, IDENTITY.m, MATRIX_SIZE);

    dst->m[12] = xTranslation;
    dst->m[13] = yTranslation;
    dst->m[14] = zTranslation;
}

void Mat4::add(float scalar) {
    add(scalar, this);
}

void Mat4::add(float scalar, Mat4 *dst) {
    CC_ASSERT(dst);
#ifdef __SSE__
    MathUtil::addMatrix(col, scalar, dst->col);
#else
    MathUtil::addMatrix(m, scalar, dst->m);
#endif
}

void Mat4::add(const Mat4 &mat) {
    add(*this, mat, this);
}

void Mat4::add(const Mat4 &m1, const Mat4 &m2, Mat4 *dst) {
    CC_ASSERT(dst);
#ifdef __SSE__
    MathUtil::addMatrix(m1.col, m2.col, dst->col);
#else
    MathUtil::addMatrix(m1.m, m2.m, dst->m);
#endif
}

void Mat4::fromRT(const Quaternion &rotation, const Vec3 &translation, Mat4 *dst) {
    const auto x = rotation.x;
    const auto y = rotation.y;
    const auto z = rotation.z;
    const auto w = rotation.w;
    const auto x2 = x + x;
    const auto y2 = y + y;
    const auto z2 = z + z;

    const auto xx = x * x2;
    const auto xy = x * y2;
    const auto xz = x * z2;
    const auto yy = y * y2;
    const auto yz = y * z2;
    const auto zz = z * z2;
    const auto wx = w * x2;
    const auto wy = w * y2;
    const auto wz = w * z2;

    dst->m[0] = 1 - (yy + zz);
    dst->m[1] = xy + wz;
    dst->m[2] = xz - wy;
    dst->m[3] = 0;
    dst->m[4] = xy - wz;
    dst->m[5] = 1 - (xx + zz);
    dst->m[6] = yz + wx;
    dst->m[7] = 0;
    dst->m[8] = xz + wy;
    dst->m[9] = yz - wx;
    dst->m[10] = 1 - (xx + yy);
    dst->m[11] = 0;
    dst->m[12] = translation.x;
    dst->m[13] = translation.y;
    dst->m[14] = translation.z;
    dst->m[15] = 1;
}

void Mat4::fromRTS(const Quaternion &rotation, const Vec3 &translation, const Vec3 &scale, Mat4 *dst) {
    const float x = rotation.x;
    const float y = rotation.y;
    const float z = rotation.z;
    const float w = rotation.w;
    const float x2 = x + x;
    const float y2 = y + y;
    const float z2 = z + z;

    const float xx = x * x2;
    const float xy = x * y2;
    const float xz = x * z2;
    const float yy = y * y2;
    const float yz = y * z2;
    const float zz = z * z2;
    const float wx = w * x2;
    const float wy = w * y2;
    const float wz = w * z2;
    const float sx = scale.x;
    const float sy = scale.y;
    const float sz = scale.z;

    dst->m[0] = (1 - (yy + zz)) * sx;
    dst->m[1] = (xy + wz) * sx;
    dst->m[2] = (xz - wy) * sx;
    dst->m[3] = 0;
    dst->m[4] = (xy - wz) * sy;
    dst->m[5] = (1 - (xx + zz)) * sy;
    dst->m[6] = (yz + wx) * sy;
    dst->m[7] = 0;
    dst->m[8] = (xz + wy) * sz;
    dst->m[9] = (yz - wx) * sz;
    dst->m[10] = (1 - (xx + yy)) * sz;
    dst->m[11] = 0;
    dst->m[12] = translation.x;
    dst->m[13] = translation.y;
    dst->m[14] = translation.z;
    dst->m[15] = 1;
}

void Mat4::toRTS(const Mat4 &src, Quaternion *rotation, Vec3 *translation, Vec3 *scale) {
    src.decompose(scale, rotation, translation);
}

bool Mat4::decompose(Vec3 *scale, Quaternion *rotation, Vec3 *translation) const {
    if (translation) {
        // Extract the translation.
        translation->x = m[12];
        translation->y = m[13];
        translation->z = m[14];
    }

    // Nothing left to do.
    if (scale == nullptr && rotation == nullptr) {
        return true;
    }

    // Extract the scale.
    // This is simply the length of each axis (row/column) in the matrix.
    Vec3 xaxis(m[0], m[1], m[2]);
    float scaleX = xaxis.length();

    Vec3 yaxis(m[4], m[5], m[6]);
    float scaleY = yaxis.length();

    Vec3 zaxis(m[8], m[9], m[10]);
    float scaleZ = zaxis.length();

    // Determine if we have a negative scale (true if determinant is less than zero).
    // In this case, we simply negate a single axis of the scale.
    float det = determinant();
    if (det < 0) {
        scaleX = -scaleX;
    }

    if (scale) {
        scale->x = scaleX;
        scale->y = scaleY;
        scale->z = scaleZ;
    }

    // Nothing left to do.
    if (rotation == nullptr) {
        return true;
    }

    // Scale too close to zero, can't decompose rotation.
    if (scaleX < MATH_TOLERANCE || scaleY < MATH_TOLERANCE || std::abs(scaleZ) < MATH_TOLERANCE) {
        return false;
    }

    float rn;

    // Factor the scale out of the matrix axes.
    rn = 1.0F / scaleX;
    xaxis.x *= rn;
    xaxis.y *= rn;
    xaxis.z *= rn;

    rn = 1.0F / scaleY;
    yaxis.x *= rn;
    yaxis.y *= rn;
    yaxis.z *= rn;

    rn = 1.0F / scaleZ;
    zaxis.x *= rn;
    zaxis.y *= rn;
    zaxis.z *= rn;

    // Now calculate the rotation from the resulting matrix (axes).
    float trace = xaxis.x + yaxis.y + zaxis.z;

    if (trace > 0.0F) {
        float s = 0.5F / std::sqrt(trace + 1.0F);
        rotation->w = 0.25F / s;
        rotation->x = (yaxis.z - zaxis.y) * s;
        rotation->y = (zaxis.x - xaxis.z) * s;
        rotation->z = (xaxis.y - yaxis.x) * s;
    } else {
        // Note: since xaxis, yaxis, and zaxis are normalized,
        // we will never divide by zero in the code below.
        if (xaxis.x > yaxis.y && xaxis.x > zaxis.z) {
            float s = 0.5F / std::sqrt(1.0F + xaxis.x - yaxis.y - zaxis.z);
            rotation->w = (yaxis.z - zaxis.y) * s;
            rotation->x = 0.25F / s;
            rotation->y = (yaxis.x + xaxis.y) * s;
            rotation->z = (zaxis.x + xaxis.z) * s;
        } else if (yaxis.y > zaxis.z) {
            float s = 0.5F / std::sqrt(1.0F + yaxis.y - xaxis.x - zaxis.z);
            rotation->w = (zaxis.x - xaxis.z) * s;
            rotation->x = (yaxis.x + xaxis.y) * s;
            rotation->y = 0.25F / s;
            rotation->z = (zaxis.y + yaxis.z) * s;
        } else {
            float s = 0.5F / std::sqrt(1.0F + zaxis.z - xaxis.x - yaxis.y);
            rotation->w = (xaxis.y - yaxis.x) * s;
            rotation->x = (zaxis.x + xaxis.z) * s;
            rotation->y = (zaxis.y + yaxis.z) * s;
            rotation->z = 0.25F / s;
        }
    }

    return true;
}

float Mat4::determinant() const {
    float a0 = m[0] * m[5] - m[1] * m[4];
    float a1 = m[0] * m[6] - m[2] * m[4];
    float a2 = m[0] * m[7] - m[3] * m[4];
    float a3 = m[1] * m[6] - m[2] * m[5];
    float a4 = m[1] * m[7] - m[3] * m[5];
    float a5 = m[2] * m[7] - m[3] * m[6];
    float b0 = m[8] * m[13] - m[9] * m[12];
    float b1 = m[8] * m[14] - m[10] * m[12];
    float b2 = m[8] * m[15] - m[11] * m[12];
    float b3 = m[9] * m[14] - m[10] * m[13];
    float b4 = m[9] * m[15] - m[11] * m[13];
    float b5 = m[10] * m[15] - m[11] * m[14];

    // Calculate the determinant.
    return (a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0);
}

void Mat4::inverseTranspose(const Mat4 &mat, Mat4 *dst) {
    float a00 = mat.m[0];
    float a01 = mat.m[1];
    float a02 = mat.m[2];
    float a03 = mat.m[3];
    float a10 = mat.m[4];
    float a11 = mat.m[5];
    float a12 = mat.m[6];
    float a13 = mat.m[7];
    float a20 = mat.m[8];
    float a21 = mat.m[9];
    float a22 = mat.m[10];
    float a23 = mat.m[11];
    float a30 = mat.m[12];
    float a31 = mat.m[13];
    float a32 = mat.m[14];
    float a33 = mat.m[15];

    float b00 = a00 * a11 - a01 * a10;
    float b01 = a00 * a12 - a02 * a10;
    float b02 = a00 * a13 - a03 * a10;
    float b03 = a01 * a12 - a02 * a11;
    float b04 = a01 * a13 - a03 * a11;
    float b05 = a02 * a13 - a03 * a12;
    float b06 = a20 * a31 - a21 * a30;
    float b07 = a20 * a32 - a22 * a30;
    float b08 = a20 * a33 - a23 * a30;
    float b09 = a21 * a32 - a22 * a31;
    float b10 = a21 * a33 - a23 * a31;
    float b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    float det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det == 0.0) {
        return;
    }
    det = 1 / det;

    dst->m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    dst->m[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    dst->m[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    dst->m[3] = 0;

    dst->m[4] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    dst->m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    dst->m[6] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    dst->m[7] = 0;

    dst->m[8] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    dst->m[9] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    dst->m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    dst->m[11] = 0;

    dst->m[12] = 0;
    dst->m[13] = 0;
    dst->m[14] = 0;
    dst->m[15] = 1;
}

void Mat4::getScale(Vec3 *scale) const {
    decompose(scale, nullptr, nullptr);
}

bool Mat4::getRotation(Quaternion *rotation) const {
    return decompose(nullptr, rotation, nullptr);
}

void Mat4::getTranslation(Vec3 *translation) const {
    decompose(nullptr, nullptr, translation);
}

void Mat4::getUpVector(Vec3 *dst) const {
    CC_ASSERT(dst);

    dst->x = m[4];
    dst->y = m[5];
    dst->z = m[6];
}

void Mat4::getDownVector(Vec3 *dst) const {
    CC_ASSERT(dst);

    dst->x = -m[4];
    dst->y = -m[5];
    dst->z = -m[6];
}

void Mat4::getLeftVector(Vec3 *dst) const {
    CC_ASSERT(dst);

    dst->x = -m[0];
    dst->y = -m[1];
    dst->z = -m[2];
}

void Mat4::getRightVector(Vec3 *dst) const {
    CC_ASSERT(dst);

    dst->x = m[0];
    dst->y = m[1];
    dst->z = m[2];
}

void Mat4::getForwardVector(Vec3 *dst) const {
    CC_ASSERT(dst);

    dst->x = -m[8];
    dst->y = -m[9];
    dst->z = -m[10];
}

void Mat4::getBackVector(Vec3 *dst) const {
    CC_ASSERT(dst);

    dst->x = m[8];
    dst->y = m[9];
    dst->z = m[10];
}

Mat4 Mat4::clone() const {
    Mat4 mat(*this);
    return mat;
}

Mat4 Mat4::getInversed() const {
    Mat4 mat(*this);
    mat.inverse();
    return mat;
}

bool Mat4::inverse() {
    float a0 = m[0] * m[5] - m[1] * m[4];
    float a1 = m[0] * m[6] - m[2] * m[4];
    float a2 = m[0] * m[7] - m[3] * m[4];
    float a3 = m[1] * m[6] - m[2] * m[5];
    float a4 = m[1] * m[7] - m[3] * m[5];
    float a5 = m[2] * m[7] - m[3] * m[6];
    float b0 = m[8] * m[13] - m[9] * m[12];
    float b1 = m[8] * m[14] - m[10] * m[12];
    float b2 = m[8] * m[15] - m[11] * m[12];
    float b3 = m[9] * m[14] - m[10] * m[13];
    float b4 = m[9] * m[15] - m[11] * m[13];
    float b5 = m[10] * m[15] - m[11] * m[14];

    // Calculate the determinant.
    float det = a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0;

    // Close to zero, can't invert.
    if (std::abs(det) <= MATH_TOLERANCE) {
        return false;
    }

    // Support the case where m == dst.
    Mat4 inverse;
    inverse.m[0] = m[5] * b5 - m[6] * b4 + m[7] * b3;
    inverse.m[1] = -m[1] * b5 + m[2] * b4 - m[3] * b3;
    inverse.m[2] = m[13] * a5 - m[14] * a4 + m[15] * a3;
    inverse.m[3] = -m[9] * a5 + m[10] * a4 - m[11] * a3;

    inverse.m[4] = -m[4] * b5 + m[6] * b2 - m[7] * b1;
    inverse.m[5] = m[0] * b5 - m[2] * b2 + m[3] * b1;
    inverse.m[6] = -m[12] * a5 + m[14] * a2 - m[15] * a1;
    inverse.m[7] = m[8] * a5 - m[10] * a2 + m[11] * a1;

    inverse.m[8] = m[4] * b4 - m[5] * b2 + m[7] * b0;
    inverse.m[9] = -m[0] * b4 + m[1] * b2 - m[3] * b0;
    inverse.m[10] = m[12] * a4 - m[13] * a2 + m[15] * a0;
    inverse.m[11] = -m[8] * a4 + m[9] * a2 - m[11] * a0;

    inverse.m[12] = -m[4] * b3 + m[5] * b1 - m[6] * b0;
    inverse.m[13] = m[0] * b3 - m[1] * b1 + m[2] * b0;
    inverse.m[14] = -m[12] * a3 + m[13] * a1 - m[14] * a0;
    inverse.m[15] = m[8] * a3 - m[9] * a1 + m[10] * a0;

    multiply(inverse, 1.0F / det, this);

    return true;
}

bool Mat4::isIdentity() const {
    return (memcmp(m, &IDENTITY, MATRIX_SIZE) == 0);
}

void Mat4::multiply(float scalar) {
    multiply(scalar, this);
}

void Mat4::multiply(float scalar, Mat4 *dst) const {
    multiply(*this, scalar, dst);
}

void Mat4::multiply(const Mat4 &m, float scalar, Mat4 *dst) {
    CC_ASSERT(dst);
#ifdef __SSE__
    MathUtil::multiplyMatrix(m.col, scalar, dst->col);
#else
    MathUtil::multiplyMatrix(m.m, scalar, dst->m);
#endif
}

void Mat4::multiply(const Mat4 &mat) {
    multiply(*this, mat, this);
}

void Mat4::multiply(const Mat4 &m1, const Mat4 &m2, Mat4 *dst) {
    CC_ASSERT(dst);
#ifdef __SSE__
    MathUtil::multiplyMatrix(m1.col, m2.col, dst->col);
#else
    MathUtil::multiplyMatrix(m1.m, m2.m, dst->m);
#endif
}

void Mat4::negate() {
#ifdef __SSE__
    MathUtil::negateMatrix(col, col);
#else
    MathUtil::negateMatrix(m, m);
#endif
}

Mat4 Mat4::getNegated() const {
    Mat4 mat(*this);
    mat.negate();
    return mat;
}

void Mat4::rotate(const Quaternion &q) {
    rotate(q, this);
}

void Mat4::rotate(const Quaternion &q, Mat4 *dst) const {
    Mat4 r;
    createRotation(q, &r);
    multiply(*this, r, dst);
}

void Mat4::rotate(const Vec3 &axis, float angle) {
    rotate(axis, angle, this);
}

void Mat4::rotate(const Vec3 &axis, float angle, Mat4 *dst) const {
    Mat4 r;
    createRotation(axis, angle, &r);
    multiply(*this, r, dst);
}

void Mat4::rotateX(float angle) {
    rotateX(angle, this);
}

void Mat4::rotateX(float angle, Mat4 *dst) const {
    Mat4 r;
    createRotationX(angle, &r);
    multiply(*this, r, dst);
}

void Mat4::rotateY(float angle) {
    rotateY(angle, this);
}

void Mat4::rotateY(float angle, Mat4 *dst) const {
    Mat4 r;
    createRotationY(angle, &r);
    multiply(*this, r, dst);
}

void Mat4::rotateZ(float angle) {
    rotateZ(angle, this);
}

void Mat4::rotateZ(float angle, Mat4 *dst) const {
    Mat4 r;
    createRotationZ(angle, &r);
    multiply(*this, r, dst);
}

void Mat4::scale(float value) {
    scale(value, this);
}

void Mat4::scale(float value, Mat4 *dst) const {
    scale(value, value, value, dst);
}

void Mat4::scale(float xScale, float yScale, float zScale) {
    scale(xScale, yScale, zScale, this);
}

void Mat4::scale(float xScale, float yScale, float zScale, Mat4 *dst) const {
    Mat4 s;
    createScale(xScale, yScale, zScale, &s);
    multiply(*this, s, dst);
}

void Mat4::scale(const Vec3 &s) {
    scale(s.x, s.y, s.z, this);
}

void Mat4::scale(const Vec3 &s, Mat4 *dst) const {
    scale(s.x, s.y, s.z, dst);
}

void Mat4::set(float m11, float m12, float m13, float m14, float m21, float m22, float m23, float m24,
               float m31, float m32, float m33, float m34, float m41, float m42, float m43, float m44) {
    m[0] = m11;
    m[1] = m21;
    m[2] = m31;
    m[3] = m41;
    m[4] = m12;
    m[5] = m22;
    m[6] = m32;
    m[7] = m42;
    m[8] = m13;
    m[9] = m23;
    m[10] = m33;
    m[11] = m43;
    m[12] = m14;
    m[13] = m24;
    m[14] = m34;
    m[15] = m44;
}

void Mat4::set(const float *mat) {
    CC_ASSERT(mat);
    memcpy(this->m, mat, MATRIX_SIZE);
}

void Mat4::set(const Mat4 &mat) {
    memcpy(this->m, mat.m, MATRIX_SIZE);
}

void Mat4::setIdentity() {
    memcpy(m, IDENTITY.m, MATRIX_SIZE);
}

void Mat4::setZero() {
    memset(m, 0, MATRIX_SIZE);
}

void Mat4::subtract(const Mat4 &mat) {
    subtract(*this, mat, this);
}

void Mat4::subtract(const Mat4 &m1, const Mat4 &m2, Mat4 *dst) {
    CC_ASSERT(dst);
#ifdef __SSE__
    MathUtil::subtractMatrix(m1.col, m2.col, dst->col);
#else
    MathUtil::subtractMatrix(m1.m, m2.m, dst->m);
#endif
}

void Mat4::transformVector(Vec4 *vector) const {
    CC_ASSERT(vector);
    transformVector(*vector, vector);
}

void Mat4::transformVector(const Vec4 &vector, Vec4 *dst) const {
    CC_ASSERT(dst);
#ifdef __SSE__
    MathUtil::transformVec4(col, vector.v, dst->v);
#else
    MathUtil::transformVec4(m, reinterpret_cast<const float *>(&vector), reinterpret_cast<float *>(dst));
#endif
}

void Mat4::translate(float x, float y, float z) {
    translate(x, y, z, this);
}

void Mat4::translate(float x, float y, float z, Mat4 *dst) const {
    Mat4 t;
    createTranslation(x, y, z, &t);
    multiply(*this, t, dst);
}

void Mat4::translate(const Vec3 &t) {
    translate(t.x, t.y, t.z, this);
}

void Mat4::translate(const Vec3 &t, Mat4 *dst) const {
    translate(t.x, t.y, t.z, dst);
}

void Mat4::transpose() {
#ifdef __SSE__
    MathUtil::transposeMatrix(col, col);
#else
    MathUtil::transposeMatrix(m, m);
#endif
}

Mat4 Mat4::getTransposed() const {
    Mat4 mat(*this);
    mat.transpose();
    return mat;
}

bool Mat4::approxEquals(const Mat4 &v, float precision /* = CC_FLOAT_CMP_PRECISION */) const {
    return math::isEqualF(m[0], v.m[0], precision) && math::isEqualF(m[1], v.m[1], precision) && math::isEqualF(m[2], v.m[2], precision) && math::isEqualF(m[3], v.m[3], precision) && math::isEqualF(m[4], v.m[4], precision) && math::isEqualF(m[5], v.m[5], precision) && math::isEqualF(m[6], v.m[6], precision) && math::isEqualF(m[7], v.m[7], precision) && math::isEqualF(m[8], v.m[8], precision) && math::isEqualF(m[9], v.m[9], precision) && math::isEqualF(m[10], v.m[10], precision) && math::isEqualF(m[11], v.m[11], precision) && math::isEqualF(m[12], v.m[12], precision) && math::isEqualF(m[13], v.m[13], precision) && math::isEqualF(m[14], v.m[14], precision) && math::isEqualF(m[15], v.m[15], precision);
}

const Mat4 Mat4::IDENTITY = Mat4(
    1.0F, 0.0F, 0.0F, 0.0F,
    0.0F, 1.0F, 0.0F, 0.0F,
    0.0F, 0.0F, 1.0F, 0.0F,
    0.0F, 0.0F, 0.0F, 1.0F);

const Mat4 Mat4::ZERO = Mat4(
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0);

NS_CC_MATH_END
