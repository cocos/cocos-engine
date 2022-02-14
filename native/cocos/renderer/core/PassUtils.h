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

#pragma once

#include <string>
#include "base/Ptr.h"
#include "base/TypeDef.h"
#include "cocos/base/Variant.h"

#include "math/Color.h"
#include "math/Mat3.h"
#include "math/Mat4.h"
#include "math/Quaternion.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"

#include "renderer/gfx-base/GFXDef.h"

namespace cc {

class TextureBase;

constexpr uint32_t TYPE_MASK    = 0xfc000000; //  6 bits => 64 types
constexpr uint32_t BINDING_MASK = 0x03f00000; //  6 bits => 64 bindings
constexpr uint32_t COUNT_MASK   = 0x000ff000; //  8 bits => 256 vectors
constexpr uint32_t OFFSET_MASK  = 0x00000fff; // 12 bits => 1024 vectors

constexpr uint32_t genHandle(uint32_t binding, gfx::Type type, uint32_t count, uint32_t offset = 0) {
    return ((static_cast<uint32_t>(type) << 26) & TYPE_MASK) |
           ((binding << 20) & BINDING_MASK) |
           ((count << 12) & COUNT_MASK) |
           (offset & OFFSET_MASK);
}

constexpr gfx::Type getTypeFromHandle(uint32_t handle) { return static_cast<gfx::Type>((handle & TYPE_MASK) >> 26); }
constexpr uint32_t  getBindingFromHandle(uint32_t handle) { return (handle & BINDING_MASK) >> 20; }
constexpr uint32_t  getCountFromHandle(uint32_t handle) { return (handle & COUNT_MASK) >> 12; }
constexpr uint32_t  getOffsetFromHandle(uint32_t handle) { return (handle & OFFSET_MASK); }
constexpr uint32_t  customizeType(uint32_t handle, gfx::Type type) {
    return (handle & ~TYPE_MASK) | ((static_cast<uint32_t>(type) << 26) & TYPE_MASK);
}

using MacroValue = cc::variant<int32_t, bool, std::string>;

/**
 * @en Combination of preprocess macros
 * @zh 预处理宏组合
 */
using MacroRecord = Record<std::string, MacroValue>;

using MaterialProperty = cc::variant<cc::monostate /*0*/, float /*1*/, int32_t /*2*/, Vec2 /*3*/, Vec3 /*4*/, Vec4 /*5*/, Color, /*6*/ Mat3 /*7*/, Mat4 /*8*/, Quaternion /*9*/, IntrusivePtr<TextureBase> /*10*/, IntrusivePtr<gfx::Texture> /*11*/>;

using MaterialPropertyList = std::vector<MaterialProperty>;

using MaterialPropertyVariant = cc::variant<cc::monostate /*0*/, MaterialProperty /*1*/, MaterialPropertyList /*2*/>;

#define MATERIAL_PROPERTY_INDEX_SINGLE 1
#define MATERIAL_PROPERTY_INDEX_LIST   2

using GFXTypeReaderCallback = void (*)(const float *, MaterialProperty &, index_t);
using GFXTypeWriterCallback = void (*)(float *, const MaterialProperty &, index_t);

extern const std::unordered_map<gfx::Type, GFXTypeReaderCallback> type2reader; //NOLINT(readability-identifier-naming)
extern const std::unordered_map<gfx::Type, GFXTypeWriterCallback> type2writer; //NOLINT(readability-identifier-naming)

/**
 * @en Gets the default values for the given type of uniform
 * @zh 根据指定的 Uniform 类型来获取默认值
 * @param type The type of the uniform
 */
const std::vector<float> &getDefaultFloatArrayFromType(gfx::Type type);
const std::string &       getDefaultStringFromType(gfx::Type type);

/**
 * @en Combination of preprocess macros
 * @zh 预处理宏组合
 */
/**
 * @en Override the preprocess macros
 * @zh 覆写预处理宏
 * @param target Target preprocess macros to be overridden
 * @param source Preprocess macros used for override
 */
bool overrideMacros(MacroRecord &target, const MacroRecord &source);

} // namespace cc
