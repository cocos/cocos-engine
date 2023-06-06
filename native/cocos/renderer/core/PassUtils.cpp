/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos.com
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "renderer/core/PassUtils.h"
#include <cstdint>
#include "base/Log.h"
#include "core/Types.h"
#include "core/assets/TextureBase.h"

namespace cc {

const ccstd::unordered_map<gfx::Type, GFXTypeReaderCallback> type2reader = {
    {gfx::Type::UNKNOWN, [](const float * /*a*/, MaterialProperty & /*v*/, index_t /*idx*/) {
         CC_LOG_ERROR("type2reader unknown type");
     }},
    {gfx::Type::INT, [](const float *a, MaterialProperty &v, index_t idx) {
        v = static_cast<int32_t>(a[idx]);
     }},
    {gfx::Type::INT2, [](const float *a, MaterialProperty &v, index_t idx) {
        v = Vec2(a[idx], a[idx + 1]);
     }},
    {gfx::Type::INT3, [](const float *a, MaterialProperty &v, index_t idx) {
        v = Vec3(a[idx], a[idx + 1], a[idx + 2]);
     }},
    {gfx::Type::INT4, [](const float *a, MaterialProperty &v, index_t idx) {
        v = Vec4(a[idx], a[idx + 1], a[idx + 2], a[idx + 3]);
     }},
    {gfx::Type::FLOAT, [](const float *a, MaterialProperty &v, index_t idx) {
        v = a[idx];
     }},
    {gfx::Type::FLOAT2, [](const float *a, MaterialProperty &v, index_t idx) {
        v = Vec2(a[idx], a[idx + 1]);
     }},
    {gfx::Type::FLOAT3, [](const float *a, MaterialProperty &v, index_t idx) {
        v = Vec3(a[idx], a[idx + 1], a[idx + 2]);
     }},
    {gfx::Type::FLOAT4, [](const float *a, MaterialProperty &v, index_t idx) {
        v = Vec4(a[idx], a[idx + 1], a[idx + 2], a[idx + 3]);
     }},
    {gfx::Type::MAT3, [](const float *a, MaterialProperty &v, index_t idx) {
        Mat3 mat3;
        memcpy(&mat3.m[0], &a[idx], sizeof(Mat3));
        v = mat3;
     }},
    {gfx::Type::MAT4, [](const float *a, MaterialProperty &v, index_t idx) {
        Mat4 mat4;
        memcpy(&mat4.m[0], &a[idx], sizeof(Mat4));
        v = mat4;
     }},
};

const ccstd::unordered_map<gfx::Type, GFXTypeWriterCallback> type2writer = {
    {gfx::Type::UNKNOWN, [](float * /*a*/, const MaterialProperty & /*v*/, index_t /*idx*/) {
         CC_LOG_ERROR("type2writer unknown type");
     }},
    {gfx::Type::INT, [](float *a, const MaterialProperty &v, index_t idx) {
         const int32_t *p = ccstd::get_if<int32_t>(&v);
         CC_ASSERT_NOT_NULL(p);
         a[idx] = static_cast<float>(*p);
     }},
    {gfx::Type::INT2, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = ccstd::get_if<Vec2>(&v);
         CC_ASSERT_NOT_NULL(p);
         a[idx] = p->x;
         a[idx + 1] = p->y;
     }},
    {gfx::Type::INT3, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = ccstd::get_if<Vec3>(&v);
         CC_ASSERT_NOT_NULL(p);
         a[idx] = p->x;
         a[idx + 1] = p->y;
         a[idx + 2] = p->z;
     }},
    {gfx::Type::INT4, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = ccstd::get_if<Vec4>(&v);
         CC_ASSERT_NOT_NULL(p);
         a[idx] = p->x;
         a[idx + 1] = p->y;
         a[idx + 2] = p->z;
         a[idx + 3] = p->w;
     }},
    {gfx::Type::FLOAT, [](float *a, const MaterialProperty &v, index_t idx) {
         const float *p = ccstd::get_if<float>(&v);
         const int32_t *pInt = nullptr;
         if (p != nullptr) {
             a[idx] = *p;
         } else {
             pInt = ccstd::get_if<int32_t>(&v);
             if (pInt != nullptr) {
                 a[idx] = static_cast<float>(*pInt);
             }
         }
         CC_ASSERT(p != nullptr || pInt != nullptr);
     }},
    {gfx::Type::FLOAT2, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = ccstd::get_if<Vec2>(&v);
         CC_ASSERT_NOT_NULL(p);
         a[idx] = p->x;
         a[idx + 1] = p->y;
     }},
    {gfx::Type::FLOAT3, [](float *a, const MaterialProperty &v, index_t idx) {
         if (ccstd::holds_alternative<Vec3>(v)) {
             const auto &vec3 = ccstd::get<Vec3>(v);
             a[idx] = vec3.x;
             a[idx + 1] = vec3.y;
             a[idx + 2] = vec3.z;
         } else {
             CC_ABORT();
         }
     }},
    {gfx::Type::FLOAT4, [](float *a, const MaterialProperty &v, index_t idx) {
         if (ccstd::holds_alternative<Vec4>(v)) {
             const auto &vec4 = ccstd::get<Vec4>(v);
             a[idx] = vec4.x;
             a[idx + 1] = vec4.y;
             a[idx + 2] = vec4.z;
             a[idx + 3] = vec4.w;
         } else if (ccstd::holds_alternative<Color>(v)) {
             const auto &color = ccstd::get<Color>(v);
             Vec4 colorFloat{color.toVec4()};
             a[idx] = colorFloat.x;
             a[idx + 1] = colorFloat.y;
             a[idx + 2] = colorFloat.z;
             a[idx + 3] = colorFloat.w;
         } else if (ccstd::holds_alternative<Quaternion>(v)) {
             const auto &quat = ccstd::get<Quaternion>(v);
             a[idx] = quat.x;
             a[idx + 1] = quat.y;
             a[idx + 2] = quat.z;
             a[idx + 3] = quat.w;
         } else {
             CC_ABORT();
         }
     }},
    {gfx::Type::MAT3, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = ccstd::get_if<Mat3>(&v);
         CC_ASSERT_NOT_NULL(p);
         memcpy(&a[idx], &p->m[0], sizeof(Mat3));
     }},
    {gfx::Type::MAT4, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = ccstd::get_if<Mat4>(&v);
         CC_ASSERT_NOT_NULL(p);
         memcpy(&a[idx], &p->m[0], sizeof(Mat4));
     }},
};

const ccstd::unordered_map<gfx::Type, GFXTypeValidatorCallback> type2validator = {
    {gfx::Type::UNKNOWN, [](const MaterialProperty & /*v*/) -> bool {
         CC_LOG_ERROR("type2validator unknown type");
         return false;
     }},
    {gfx::Type::INT, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<int32_t>(&v);
         return p != nullptr;
     }},
    {gfx::Type::INT2, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<Vec2>(&v);
         return p != nullptr;
     }},
    {gfx::Type::INT3, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<Vec3>(&v);
         return p != nullptr;
     }},
    {gfx::Type::INT4, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<Vec4>(&v);
         return p != nullptr;
     }},
    {gfx::Type::FLOAT, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<float>(&v);
         const auto *pInt = ccstd::get_if<int32_t>(&v);
         return p != nullptr || pInt != nullptr;
     }},
    {gfx::Type::FLOAT2, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<Vec2>(&v);
         return p != nullptr;
     }},
    {gfx::Type::FLOAT3, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<Vec3>(&v);
         return p != nullptr;
     }},
    {gfx::Type::FLOAT4, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<Vec4>(&v);
         const auto *pColor = ccstd::get_if<Color>(&v);
         const auto *pQuat = ccstd::get_if<Quaternion>(&v);
         return p != nullptr || pColor != nullptr || pQuat != nullptr;
     }},
    {gfx::Type::MAT3, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<Mat3>(&v);
         return p != nullptr;
     }},
    {gfx::Type::MAT4, [](const MaterialProperty &v) -> bool {
         const auto *p = ccstd::get_if<Mat4>(&v);
         return p != nullptr;
     }},
};

const ccstd::vector<float> &getDefaultFloatArrayFromType(gfx::Type type) {
    static const ccstd::vector<float> DEFAULT_FLOAT_VALUES[] = {
        {0},
        {0, 0},
        {0, 0, 0, 0},
        {1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1}};

    switch (type) {
        case gfx::Type::BOOL:
        case gfx::Type::INT:
        case gfx::Type::UINT:
        case gfx::Type::FLOAT:
            return DEFAULT_FLOAT_VALUES[0];
        case gfx::Type::BOOL2:
        case gfx::Type::INT2:
        case gfx::Type::UINT2:
        case gfx::Type::FLOAT2:
            return DEFAULT_FLOAT_VALUES[1];
        case gfx::Type::BOOL4:
        case gfx::Type::INT4:
        case gfx::Type::UINT4:
        case gfx::Type::FLOAT4:
            return DEFAULT_FLOAT_VALUES[2];
        case gfx::Type::MAT4:
            return DEFAULT_FLOAT_VALUES[3];
        default:
            return DEFAULT_FLOAT_VALUES[0];
    }
}

const ccstd::string &getDefaultStringFromType(gfx::Type type) {
    static const ccstd::string DEFAULT_TEXTURE_STR{"default-texture"};
    static const ccstd::string DEFAULT_CUBE_TEXTURE_STR{"default-cube-texture"};

    switch (type) {
        case gfx::Type::SAMPLER2D:
            return DEFAULT_TEXTURE_STR;
        case gfx::Type::SAMPLER_CUBE:
            return DEFAULT_CUBE_TEXTURE_STR;
        default:
            return DEFAULT_TEXTURE_STR;
    }
}

const ccstd::string &getStringFromType(gfx::Type type) {
    static const ccstd::string TEXTURE_2D_STR{"-texture"};
    static const ccstd::string TEXTURE_CUBE_STR{"-cube-texture"};
    static const ccstd::string TEXTURE_2D_ARRAY_STR{"-array-texture"};
    static const ccstd::string TEXTURE_3D_STR{"-3d-texture"};
    static const ccstd::string UNKNOWN_STR{"-unknown"};

    switch (type) {
        case gfx::Type::SAMPLER2D:
            return TEXTURE_2D_STR;
        case gfx::Type::SAMPLER_CUBE:
            return TEXTURE_CUBE_STR;
        case gfx::Type::SAMPLER2D_ARRAY:
            return TEXTURE_2D_ARRAY_STR;
        case gfx::Type::SAMPLER3D:
            return TEXTURE_3D_STR;
        default:
            return UNKNOWN_STR;
    }
}

bool overrideMacros(MacroRecord &target, const MacroRecord &source) {
    bool isDifferent = false;
    for (const auto &p : source) {
        if (target[p.first] != p.second) {
            target[p.first] = p.second;
            isDifferent = true;
        }
    }
    return isDifferent;
}

MaterialProperty toMaterialProperty(gfx::Type type, const ccstd::vector<float> &vec) {
    MaterialProperty ret;
    size_t size = vec.size();

    switch (type) {
        case gfx::Type::FLOAT:
            CC_ASSERT_GE(size, 1);
            ret = vec[0];
            break;
        case gfx::Type::FLOAT2:
            CC_ASSERT_GE(size, 2);
            ret = Vec2(vec[0], vec[1]);
            break;
        case gfx::Type::FLOAT3:
            CC_ASSERT_GE(size, 3);
            ret = Vec3(vec[0], vec[1], vec[2]);
            break;
        case gfx::Type::FLOAT4:
            CC_ASSERT_GE(size, 4);
            ret = Vec4(vec[0], vec[1], vec[2], vec[3]);
            break;
        case gfx::Type::MAT3:
            CC_ASSERT_GE(size, 9);
            ret = Mat3(vec.data());
            break;
        case gfx::Type::MAT4:
            CC_ASSERT_GE(size, 16);
            ret = Mat4(vec.data());
            break;
        case gfx::Type::INT:
        case gfx::Type::INT2:
        case gfx::Type::INT3:
        case gfx::Type::INT4:
        default:
            CC_ABORT();
            break;
    }

    return ret;
}

bool macroRecordAsBool(const MacroRecord::mapped_type &v) {
    if (ccstd::holds_alternative<bool>(v)) {
        return ccstd::get<bool>(v);
    }

    if (ccstd::holds_alternative<int32_t>(v)) {
        return ccstd::get<int32_t>(v) != 0;
    }

    if (ccstd::holds_alternative<ccstd::string>(v)) {
        return ccstd::get<ccstd::string>(v) == "true";
    }
    return false;
}

ccstd::string macroRecordAsString(const MacroRecord::mapped_type &v) {
    if (ccstd::holds_alternative<ccstd::string>(v)) {
        return ccstd::get<ccstd::string>(v);
    }

    if (ccstd::holds_alternative<bool>(v)) {
        return ccstd::get<bool>(v) ? "1" : "0";
    }

    if (ccstd::holds_alternative<int32_t>(v)) {
        return std::to_string(ccstd::get<int32_t>(v));
    }
    return "";
}

}; // namespace cc
