/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos.com
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.
 
 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
 
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
#include "gfx-base/GFXDef-common.h"
#include "math/Color.h"
#include "math/Mat3.h"
#include "math/Mat4.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"
#include "renderer/gfx-base/GFXDef.h"

namespace cc {

const std::unordered_map<gfx::Type, GFXTypeReaderCallback> type2reader = {
    {gfx::Type::UNKNOWN, [](const float * /*a*/, MaterialProperty & /*v*/, index_t /*idx*/) {
         CC_LOG_ERROR("type2reader unknown type");
     }},
    {gfx::Type::INT, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<int32_t>(&v);
         CC_ASSERT(p != nullptr);
         p[0] = static_cast<int32_t>(a[idx]);
     }},
    {gfx::Type::INT2, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<Vec2>(&v);
         CC_ASSERT(p != nullptr);
         p->x = a[idx];
         p->y = a[idx + 1];
     }},
    {gfx::Type::INT3, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<Vec3>(&v);
         CC_ASSERT(p != nullptr);
         p->x = a[idx];
         p->y = a[idx + 1];
         p->z = a[idx + 2];
     }},
    {gfx::Type::INT4, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<Vec4>(&v);
         CC_ASSERT(p != nullptr);
         p->x = a[idx];
         p->y = a[idx + 1];
         p->z = a[idx + 2];
         p->w = a[idx + 3];
     }},
    {gfx::Type::FLOAT, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<float>(&v);
         CC_ASSERT(p != nullptr);
         p[0] = a[idx];
     }},
    {gfx::Type::FLOAT2, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<Vec2>(&v);
         CC_ASSERT(p != nullptr);
         p->x = a[idx];
         p->y = a[idx + 1];
     }},
    {gfx::Type::FLOAT3, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<Vec3>(&v);
         CC_ASSERT(p != nullptr);
         p->x = a[idx];
         p->y = a[idx + 1];
         p->z = a[idx + 2];
     }},
    {gfx::Type::FLOAT4, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<Vec4>(&v);
         CC_ASSERT(p != nullptr);
         p->x = a[idx];
         p->y = a[idx + 1];
         p->z = a[idx + 2];
         p->w = a[idx + 3];
     }},
    {gfx::Type::MAT3, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<Mat3>(&v);
         CC_ASSERT(p != nullptr);
         memcpy(&p->m[0], &a[idx], sizeof(Mat3));
     }},
    {gfx::Type::MAT4, [](const float *a, MaterialProperty &v, index_t idx) {
         auto *p = cc::get_if<Mat4>(&v);
         CC_ASSERT(p != nullptr);
         memcpy(&p->m[0], &a[idx], sizeof(Mat4));
     }},
};

const std::unordered_map<gfx::Type, GFXTypeWriterCallback> type2writer = {
    {gfx::Type::UNKNOWN, [](float * /*a*/, const MaterialProperty & /*v*/, index_t /*idx*/) {
         CC_LOG_ERROR("type2writer unknown type");
     }},
    {gfx::Type::INT, [](float *a, const MaterialProperty &v, index_t idx) {
         const int32_t *p      = cc::get_if<int32_t>(&v);
         const float *  pFloat = nullptr;
         if (p != nullptr) {
             a[idx] = static_cast<float>(*p);
         } else {
             pFloat = cc::get_if<float>(&v);
             if (pFloat != nullptr) {
                 a[idx] = static_cast<float>(*p);
             }
         }
         CC_ASSERT(p != nullptr || pFloat != nullptr);
     }},
    {gfx::Type::INT2, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = cc::get_if<Vec2>(&v);
         CC_ASSERT(p != nullptr);
         a[idx]     = p->x;
         a[idx + 1] = p->y;
     }},
    {gfx::Type::INT3, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = cc::get_if<Vec3>(&v);
         CC_ASSERT(p != nullptr);
         a[idx]     = p->x;
         a[idx + 1] = p->y;
         a[idx + 2] = p->z;
     }},
    {gfx::Type::INT4, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = cc::get_if<Vec4>(&v);
         CC_ASSERT(p != nullptr);
         a[idx]     = p->x;
         a[idx + 1] = p->y;
         a[idx + 2] = p->z;
         a[idx + 3] = p->w;
     }},
    {gfx::Type::FLOAT, [](float *a, const MaterialProperty &v, index_t idx) {
         const float *  p    = cc::get_if<float>(&v);
         const int32_t *pInt = nullptr;
         if (p != nullptr) {
             a[idx] = *p;
         } else {
             pInt = cc::get_if<int32_t>(&v);
             if (pInt != nullptr) {
                 a[idx] = static_cast<float>(*pInt);
             }
         }
         CC_ASSERT(p != nullptr || pInt != nullptr);
     }},
    {gfx::Type::FLOAT2, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = cc::get_if<Vec2>(&v);
         CC_ASSERT(p != nullptr);
         a[idx]     = p->x;
         a[idx + 1] = p->y;
     }},
    {gfx::Type::FLOAT3, [](float *a, const MaterialProperty &v, index_t idx) {
         if (cc::holds_alternative<Vec3>(v)) {
             const auto &vec3 = cc::get<Vec3>(v);
             a[idx]           = vec3.x;
             a[idx + 1]       = vec3.y;
             a[idx + 2]       = vec3.z;
         } else if (cc::holds_alternative<Vec4>(v)) {
             const auto &vec4 = cc::get<Vec4>(v);
             a[idx]           = vec4.x;
             a[idx + 1]       = vec4.y;
             a[idx + 2]       = vec4.z;
         } else {
             assert(false);
         }
     }},
    {gfx::Type::FLOAT4, [](float *a, const MaterialProperty &v, index_t idx) {
         if (cc::holds_alternative<Vec4>(v)) {
             const auto &vec4 = cc::get<Vec4>(v);
             a[idx]           = vec4.x;
             a[idx + 1]       = vec4.y;
             a[idx + 2]       = vec4.z;
             a[idx + 3]       = vec4.w;
         } else if (cc::holds_alternative<Color>(v)) {
             const auto &color = cc::get<Color>(v);
             Vec4        colorFloat{color.toVec4()};
             a[idx]     = colorFloat.x;
             a[idx + 1] = colorFloat.y;
             a[idx + 2] = colorFloat.z;
             a[idx + 3] = colorFloat.w;
         } else if (cc::holds_alternative<Quaternion>(v)) {
             const auto &quat = cc::get<Quaternion>(v);
             a[idx]           = quat.x;
             a[idx + 1]       = quat.y;
             a[idx + 2]       = quat.z;
             a[idx + 3]       = quat.w;
         } else {
             assert(false);
         }
     }},
    {gfx::Type::MAT3, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = cc::get_if<Mat3>(&v);
         CC_ASSERT(p != nullptr);
         memcpy(&a[idx], &p->m[0], sizeof(Mat3));
     }},
    {gfx::Type::MAT4, [](float *a, const MaterialProperty &v, index_t idx) {
         const auto *p = cc::get_if<Mat4>(&v);
         CC_ASSERT(p != nullptr);
         memcpy(&a[idx], &p->m[0], sizeof(Mat4));
     }},
};

const std::vector<float> &getDefaultFloatArrayFromType(gfx::Type type) {
    static const std::vector<float> DEFAULT_FLOAT_VALUES[] = {
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

const std::string &getDefaultStringFromType(gfx::Type type) {
    static const std::string DEFAULT_TEXTURE_STR{"default-texture"};
    static const std::string DEFAULT_CUBE_TEXTURE_STR{"default-cube-texture"};

    switch (type) {
        case gfx::Type::SAMPLER2D:
            return DEFAULT_TEXTURE_STR;
        case gfx::Type::SAMPLER_CUBE:
            return DEFAULT_CUBE_TEXTURE_STR;
        default:
            return DEFAULT_TEXTURE_STR;
    }
}

bool overrideMacros(MacroRecord &target, const MacroRecord &source) {
    bool isDifferent = false;
    for (const auto &p : source) {
        if (target[p.first] != p.second) {
            target[p.first] = p.second;
            isDifferent     = true;
        }
    }
    return isDifferent;
}

}; // namespace cc
