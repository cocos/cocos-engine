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

#include <unordered_map>
#include <vector>
#include "base/Ptr.h"
#include "base/Value.h"
#include "bindings/jswrapper/SeApi.h"
#include "cocos/base/Any.h"
#include "cocos/base/Optional.h"
#include "cocos/base/Variant.h"
#include "cocos/core/assets/AssetsModuleHeader.h"
#include "core/TypedArray.h"
#include "core/assets/RenderingSubMesh.h"

#if USE_PHYSICS_PHYSX
    #include "physics/spec/IShape.h"
    #include "physics/spec/IWorld.h"
#endif

namespace cc {
class Data;
class Vec4;
class Vec2;
class Vec3;
class Size;
class Mat3;
class Mat4;
class Quaternion;
class Color;
class Rect;

template <typename K, typename V>
class Map;

struct NativeDep;

class ArrayBuffer;

// class TypedArray;
// class IBArray;

namespace network {
struct DownloaderHints;
class DownloadTask;
} // namespace network

namespace scene {
class FogInfo;
class ShadowsInfo;
class SkyboxInfo;
} // namespace scene

namespace geometry {
class AABB;
class Capsule;
class Line;
class Ray;
class Sphere;
class Triangle;
class Plane;
class Frustum;
} // namespace geometry

namespace extension {
struct ManifestAsset;
}

namespace middleware {
class Texture2D;
}

namespace gfx {
struct Viewport;
struct Offset;
struct Extent;
struct TextureSubres;
struct TextureCopy;
struct BufferTextureCopy;
struct BufferInfo;
struct BufferViewInfo;
struct TextureInfo;
struct DescriptorSetInfo;
struct BindingMappingInfo;
struct ShaderStage;
struct UniformSampler;
struct UniformBlock;
struct Uniform;
struct ShaderInfo;
struct DrawInfo;
struct IndirectBuffer;
struct SamplerInfo;
struct ColorAttachment;
struct DepthStencilAttachment;
struct SubPassInfo;
struct RenderPassInfo;
struct QueueInfo;
struct PipelineLayoutInfo;
struct DescriptorSetLayoutBinding;
struct DescriptorSetLayoutInfo;
struct FramebufferInfo;
struct CommandBufferInfo;
struct InputAssemblerInfo;
} // namespace gfx
} // namespace cc

#if USE_SPINE

namespace spine {
class String;
template <typename T>
class Vector;
template <typename K, typename V>
class Map;
} // namespace spine

#endif

////////////////////////////////////////////////////////////////////////////
/////////////////sevalue to native/////////////////////////////
////////////////////////////////////////////////////////////////////////////

// se value -> native value
bool seval_to_ccvalue(const se::Value &v, cc::Value *ret);                               // NOLINT(readability-identifier-naming)
bool seval_to_ccvaluemap(const se::Value &v, cc::ValueMap *ret);                         // NOLINT(readability-identifier-naming)
bool seval_to_ccvaluemapintkey(const se::Value &v, cc::ValueMapIntKey *ret);             // NOLINT(readability-identifier-naming)
bool seval_to_ccvaluevector(const se::Value &v, cc::ValueVector *ret);                   // NOLINT(readability-identifier-naming)
bool sevals_variadic_to_ccvaluevector(const se::ValueArray &args, cc::ValueVector *ret); // NOLINT(readability-identifier-naming)

bool seval_to_Data(const se::Value &v, cc::Data *ret);                                // NOLINT(readability-identifier-naming)
bool seval_to_DownloaderHints(const se::Value &v, cc::network::DownloaderHints *ret); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::MacroValue *to, se::Object *ctx);                    // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::IPreCompileInfoValueType *to, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming)

// cc::any
bool sevalue_to_native(const se::Value &from, cc::any *to, se::Object *ctx); //NOLINT(readability-identifier-naming)
////////////////// ArrayBuffer
bool sevalue_to_native(const se::Value &from, cc::ArrayBuffer *to, se::Object * /*ctx*/);  // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::ArrayBuffer **to, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, std::vector<cc::MacroRecord> *to, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::MaterialProperty *to, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming)

inline bool sevalue_to_native(const se::Value &from, std::string *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    if (!from.isNullOrUndefined()) {
        *to = from.toString();
    } else {
        to->clear();
    }
    return true;
}

///// integers
inline bool sevalue_to_native(const se::Value &from, bool *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.isNullOrUndefined() ? false : (from.isNumber() ? from.toDouble() != 0 : from.toBoolean());
    return true;
}

inline bool sevalue_to_native(const se::Value &from, int32_t *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.toInt32();
    return true;
}
inline bool sevalue_to_native(const se::Value &from, uint32_t *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.toUint32();
    return true;
}

inline bool sevalue_to_native(const se::Value &from, int16_t *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.toInt16();
    return true;
}
inline bool sevalue_to_native(const se::Value &from, uint16_t *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.toUint16();
    return true;
}

inline bool sevalue_to_native(const se::Value &from, int8_t *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.toInt8();
    return true;
}
inline bool sevalue_to_native(const se::Value &from, uint8_t *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.toUint8();
    return true;
}

inline bool sevalue_to_native(const se::Value &from, uint64_t *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.toUint64();
    return true;
}

inline bool sevalue_to_native(const se::Value &from, int64_t *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.toInt64();
    return true;
}

#if CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
inline bool sevalue_to_native(const se::Value &from, unsigned long *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    // on mac: unsiged long  === uintptr_t
    static_assert(sizeof(*to) == 8, "");
    *to = static_cast<unsigned long>(from.toUint64());
    return true;
}
#endif

inline bool sevalue_to_native(const se::Value &from, float *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    *to = from.toFloat();
    return true;
}
inline bool sevalue_to_native(const se::Value &from, double *to, se::Object * /*unused*/) { // NOLINT(readability-identifier-naming)
    *to = from.toDouble();
    return true;
}

//inline bool sevalue_to_native(const se::Value & /*from*/, void * /*to*/, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
//    assert(false);                                                                               // void not supported
//    return false;
//}

inline bool sevalue_to_native(const se::Value &from, cc::Data *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    return seval_to_Data(from, to);
}

inline bool sevalue_to_native(const se::Value &from, cc::Value *to, se::Object * /*unused*/) { // NOLINT(readability-identifier-naming)
    return seval_to_ccvalue(from, to);
}

inline bool sevalue_to_native(const se::Value &from, se::Value *to, se::Object * /*unused*/) { // NOLINT(readability-identifier-naming)
    *to = from;
    return true;
}

bool sevalue_to_native(const se::Value &from, cc::Vec4 *to, se::Object * /*unused*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::Mat3 *to, se::Object * /*unused*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::Mat4 *to, se::Object * /*unused*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::Vec3 *to, se::Object * /*unused*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::Vec2 *to, se::Object * /*unused*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::Size *to, se::Object * /*unused*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::Quaternion *to, se::Object * /*unused*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::Color *to, se::Object * /*unused*/); // NOLINT(readability-identifier-naming)

inline bool sevalue_to_native(const se::Value &from, std::vector<se::Value> *to, se::Object * /*unused*/) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        to->clear();
        return true;
    }
    assert(from.isObject() && from.toObject()->isArray());
    auto *array = from.toObject();
    to->clear();
    uint32_t size;
    array->getArrayLength(&size);
    for (uint32_t i = 0; i < size; i++) {
        se::Value ele;
        array->getArrayElement(i, &ele);
        to->emplace_back(ele);
    }
    return true;
}

//////////////////  cc::any
inline bool sevalue_to_native(const se::Value & /*from*/, cc::any * /*to*/, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    assert(false);
    SE_LOGE("Can not convert any to specific types");
    return false;
}

bool sevalue_to_native(const se::Value &from, cc::TypedArray *to, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &from, cc::IBArray *to, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming)

//bool sevalue_to_native(const se::Value &from, cc::gfx::Context **to, se::Object*) {// NOLINT(readability-identifier-naming)
//    assert(from.isObject());
//    *to = (cc::gfx::Context*)from.toObject()->getPrivateData();
//    return true;
//}

inline bool sevalue_to_native(const se::Value &from, void **to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    assert(to != nullptr);
    if (from.isNumber() || from.isBigInt()) {
        // NOLINTNEXTLINE(performance-no-int-to-ptr)
        *to = reinterpret_cast<void *>(from.toUint64());
        return true;
    }
    if (from.isObject()) {
        *to = from.toObject()->getPrivateData();
        return true;
    }
    SE_LOGE("[warn] failed to convert to void *\n");
    return false;
}

inline bool sevalue_to_native(const se::Value &from, std::string **to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    **to = from.toString();
    return true;
}

inline bool sevalue_to_native(const se::Value &from, cc::ValueMap *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    return seval_to_ccvaluemap(from, to);
}

bool sevalue_to_native(const se::Value &from, std::vector<bool> *to, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming)

bool        sevalue_to_native(const se::Value &from, std::vector<unsigned char> *to, se::Object * /*ctx*/);              // NOLINT(readability-identifier-naming)
bool        sevalue_to_native(const se::Value &from, cc::variant<std::vector<float>, std::string> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)
inline bool sevalue_to_native(const se::Value & /*from*/, cc::monostate * /*to*/, se::Object * /*ctx*/) {                // NOLINT(readability-identifier-naming)
    // nothing todo
    return false;
}
bool sevalue_to_native(const se::Value &from, cc::variant<cc::monostate, cc::MaterialProperty, cc::MaterialPropertyList> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)

//////////////////////// scene info
bool sevalue_to_native(const se::Value &from, cc::scene::FogInfo *, se::Object * /*ctx*/);     // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::scene::ShadowsInfo *, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::scene::SkyboxInfo *, se::Object * /*ctx*/);  // NOLINT(readability-identifier-naming)

/////////////////////// geometry

bool sevalue_to_native(const se::Value &from, cc::geometry::AABB *, se::Object * /*ctx*/);         // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::geometry::Capsule *, se::Object * /*ctx*/);      // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::geometry::Line *, se::Object * /*ctx*/);         // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::geometry::Ray *, se::Object * /*ctx*/);          // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::geometry::Sphere *, se::Object * /*ctx*/);       // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::geometry::Triangle *, se::Object * /*ctx*/);     // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::geometry::Plane *to, se::Object * /*unused*/);   // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::geometry::Plane **to, se::Object * /*unused*/);  // NOLINT(readability-identifier-naming)
bool sevalue_to_native(const se::Value &from, cc::geometry::Frustum *to, se::Object * /*unused*/); // NOLINT(readability-identifier-naming)

////////////////////////////////////////////////////////////////////////////
////////////////////nativevalue to se /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// native value -> se value
bool ccvalue_to_seval(const cc::Value &v, se::Value *ret);                   // NOLINT(readability-identifier-naming)
bool ccvaluemap_to_seval(const cc::ValueMap &v, se::Value *ret);             // NOLINT(readability-identifier-naming)
bool ccvaluemapintkey_to_seval(const cc::ValueMapIntKey &v, se::Value *ret); // NOLINT(readability-identifier-naming)
bool ccvaluevector_to_seval(const cc::ValueVector &v, se::Value *ret);       // NOLINT(readability-identifier-naming)

bool ManifestAsset_to_seval(const cc::extension::ManifestAsset &v, se::Value *ret); // NOLINT(readability-identifier-naming)
bool Data_to_seval(const cc::Data &v, se::Value *ret);                              // NOLINT(readability-identifier-naming)
bool DownloadTask_to_seval(const cc::network::DownloadTask &v, se::Value *ret);     // NOLINT(readability-identifier-naming)

//bool nativevalue_to_se(const cc::TypedArray &typedArray, se::Value &to, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming) // NOLINT

bool nativevalue_to_se(const cc::ArrayBuffer &arrayBuffer, se::Value &to, se::Object * /*ctx*/); // NOLINT(readability-identifier-naming) // NOLINT

inline bool nativevalue_to_se(const std::vector<int8_t> &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::Object *array = se::Object::createTypedArray(se::Object::TypedArrayType::INT8, from.data(), from.size());
    to.setObject(array);
    array->decRef();
    return true;
}

inline bool nativevalue_to_se(const std::vector<uint8_t> &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::Object *array = se::Object::createTypedArray(se::Object::TypedArrayType::UINT8, from.data(), from.size());
    to.setObject(array);
    array->decRef();
    return true;
}

inline bool nativevalue_to_se(int64_t from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setInt64(from);
    return true;
}

inline bool nativevalue_to_se(uint64_t from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setUint64(from);
    return true;
}

inline bool nativevalue_to_se(int32_t from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setInt32(from);
    return true;
}

inline bool nativevalue_to_se(uint32_t from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setUint32(from);
    return true;
}
inline bool nativevalue_to_se(int16_t from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setInt16(from);
    return true;
}
inline bool nativevalue_to_se(uint16_t from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setUint16(from);
    return true;
}

inline bool nativevalue_to_se(int8_t from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setInt8(from);
    return true;
}

inline bool nativevalue_to_se(uint8_t from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setUint8(from);
    return true;
}

inline bool nativevalue_to_se(float from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setFloat(from);
    return true;
}
inline bool nativevalue_to_se(double from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setDouble(from);
    return true;
}
inline bool nativevalue_to_se(bool from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setBoolean(from);
    return true;
}

inline bool nativevalue_to_se(const std::string &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setString(from);
    return true;
}
// template <>
// bool nativevalue_to_se(const cc::Color &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::NativeDep &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::Mat3 &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::Mat4 &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

// JSB_REGISTER_OBJECT_TYPE(cc::network::DownloaderHints);

bool nativevalue_to_se(const cc::Data &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::Value &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const std::unordered_map<std::string, cc::Value> &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::Vec2 &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::Vec3 &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::Vec4 &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::Size &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::Quaternion &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::extension::ManifestAsset &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const cc::Rect &from, se::Value &to, se::Object *ctx); // NOLINT(readability-identifier-naming)

inline bool nativevalue_to_se(const cc::network::DownloadTask &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    return DownloadTask_to_seval(from, &to);
}

inline bool nativevalue_to_se(const cc::monostate & /*from*/, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setUndefined();
    return true;
}

inline bool nativevalue_to_se(const cc::any &from, se::Value &to, se::Object *ctx) { //NOLINT
    assert(false);
    SE_LOGE("should not convert cc::any");
    return true;
}

using void_p = void *;
inline bool nativevalue_to_se(const void_p &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    if (!from) {
        to.setUndefined();
    } else {
        auto ptr = reinterpret_cast<uintptr_t>(from);
        sizeof(from) == 8 ? to.setUint64(static_cast<uint64_t>(ptr)) : to.setUint32(static_cast<uint32_t>(ptr));
    }
    return true;
}

// Spine conversions
#if USE_SPINE

bool sevalue_to_native(const se::Value &, spine::String *, se::Object *); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const spine::Vector<spine::String> &v, se::Value &ret, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool nativevalue_to_se(const spine::String &obj, se::Value &val, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool sevalue_to_native(const se::Value &v, spine::Vector<spine::String> *ret, se::Object *ctx); // NOLINT(readability-identifier-naming)

bool seval_to_Map_string_key(const se::Value &v, cc::Map<std::string, cc::middleware::Texture2D *> *ret); // NOLINT(readability-identifier-naming)

#endif

#if USE_MIDDLEWARE
inline bool nativevalue_to_se(const se_object_ptr &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setObject(const_cast<se::Object *>(from));
    return true;
}
#endif //USE_MIDDLEWARE

#if USE_PHYSICS_PHYSX

bool nativevalue_to_se(const std::vector<std::shared_ptr<cc::physics::TriggerEventPair>> &from, se::Value &to, se::Object * /*ctx*/);
bool nativevalue_to_se(const std::vector<cc::physics::ContactPoint> &from, se::Value &to, se::Object * /*ctx*/);
bool nativevalue_to_se(const std::vector<std::shared_ptr<cc::physics::ContactEventPair>> &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const cc::physics::RaycastResult &from, se::Value &to, se::Object *ctx);

bool sevalue_to_native(const se::Value &from, cc::physics::ConvexDesc *to, se::Object *ctx);
bool sevalue_to_native(const se::Value &from, cc::physics::TrimeshDesc *to, se::Object *ctx);
bool sevalue_to_native(const se::Value &from, cc::physics::HeightFieldDesc *to, se::Object *ctx);
bool sevalue_to_native(const se::Value &from, cc::physics::RaycastOptions *to, se::Object *ctx);

bool nativevalue_to_se(const cc::geometry::AABB &from, se::Value &to, se::Object *ctx);
bool nativevalue_to_se(const cc::geometry::Sphere &from, se::Value &to, se::Object *ctx);

#endif //USE_PHYSICS_PHYSX
