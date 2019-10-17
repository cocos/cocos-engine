#include "Core/CoreStd.h"
#include "Mat4.h"

CC_NAMESPACE_BEGIN

const Mat4f MAT4F_ZERO(
0.0f, 0.0f, 0.0f, 0.0f,
0.0f, 0.0f, 0.0f, 0.0f,
0.0f, 0.0f, 0.0f, 0.0f,
0.0f, 0.0f, 0.0f, 0.0f);

const Mat4f MAT4F_IDENTITY(
1.0f, 0.0f, 0.0f, 0.0f,
0.0f, 1.0f, 0.0f, 0.0f,
0.0f, 0.0f, 1.0f, 0.0f,
0.0f, 0.0f, 0.0f, 1.0f);

const Mat4f MAT4F_D3D2GL_PROJ(
1.0f, 0.0f, 0.0f, 0.0f,
0.0f, 1.0f, 0.0f, 0.0f,
0.0f, 0.0f, 2.0f, 0.0f,
0.0f, 0.0f, -1.0f, 1.0f);

const Mat4d MAT4D_ZERO(
0.0, 0.0, 0.0, 0.0,
0.0, 0.0, 0.0, 0.0,
0.0, 0.0, 0.0, 0.0,
0.0, 0.0, 0.0, 0.0);

const Mat4d MAT4D_IDENTITY(
1.0, 0.0, 0.0, 0.0,
0.0, 1.0, 0.0, 0.0,
0.0, 0.0, 1.0, 0.0,
0.0, 0.0, 0.0, 1.0);

const Mat4d MAT4D_D3D2GL_PROJ(
1.0, 0.0, 0.0, 0.0,
0.0, 1.0, 0.0, 0.0,
0.0, 0.0, 2.0, 0.0,
0.0, 0.0, -1.0, 1.0);

CC_NAMESPACE_END