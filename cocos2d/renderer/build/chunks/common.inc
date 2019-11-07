// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// common module

// constant value
#define PI 3.14159265359
#define PI2 6.28318530718
#define EPSILON 1e-6
#define LOG2 1.442695

// common function
#define saturate(a) clamp( a, 0.0, 1.0 )

#define FP_MAX          65504.0
#define FP_SCALE        0.0009765625
#define FP_SCALE_INV    1024.0

mat4 transposeMat4(in mat4 mat) {
    vec4 i0 = mat[0];
    vec4 i1 = mat[1];
    vec4 i2 = mat[2];
    vec4 i3 = mat[3];
    return mat4(vec4(i0.x, i1.x, i2.x, i3.x),
                vec4(i0.y, i1.y, i2.y, i3.y),
                vec4(i0.z, i1.z, i2.z, i3.z),
                vec4(i0.w, i1.w, i2.w, i3.w));
}
