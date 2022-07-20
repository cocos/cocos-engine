#pragma once
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include "../gfx-base/GFXDef-common.h"
#include "../gfx-base/GFXDef.h"

/*
value_object<PipelineLayoutInfo>("PipelineLayoutInfo")
    .field("setLayouts", &PipelineLayoutInfo::setLayouts);
function("PipelineLayoutInfo", &GenInstance<PipelineLayoutInfo>::instance);
*/
#define CC_OBJECT(NAME) \
    explicit operator const gfx::NAME() const { return obj; }
#define CTOR_FROM_CCOBJECT(NAME) \
    NAME(const gfx::NAME& other) : obj(other){};

namespace cc::gfx::ems {

using ::emscripten::allow_raw_pointers;
using ::emscripten::convertJSArrayToNumberVector;
using ::emscripten::val;

using String = ccstd::string;

// template <typename T, typename std::enable_if<std::is_pointer<T>::value, bool>::type = true>
// std::vector<T> ptrVecFromEMS(const val& vals) {
//     uint32_t               len = vals["length"].as<unsigned>();
//     std::vector<T>         res(len);
//     const std::vector<val> Ts = vecFromJSArray<val>(vals);
//     for (size_t i = 0; i < len; ++i) {
//         const val& t = Ts[i];
//         t.as<Texture*>(emscripten::allow_raw_pointers());
//         res[i] = reinterpret_cast<T>(t.as<int>());
//     }
//     return res;
// }

template <typename T, typename TWrapper = T>
std::vector<T> vecFromEMS(const val& vals) {
    uint32_t len = vals["length"].as<unsigned>();
    std::vector<T> res(len);
    const std::vector<val> Ts = vecFromJSArray<val>(vals);
    for (size_t i = 0; i < len; ++i) {
        const val& t = Ts[i];
        res[i] = static_cast<T>(t.as<TWrapper>(allow_raw_pointers()));
    }
    return res;
}

template <typename T, typename TWrapper = T>
val vecToEMS(const std::vector<T>& Ts) {
    auto arr = val::array();
    for (size_t i = 0; i < Ts.size(); ++i) {
        arr.set(i, TWrapper(Ts[i]));
    }
    return arr;
}

template <typename T, typename E, typename std::enable_if<std::is_integral<T>::value, bool>::type = true>
std::vector<E> enumVecFromEMS(const val& vals) {
    auto vec = convertJSArrayToNumberVector<T>(vals);
    std::vector<E> res(vec.size());
    std::transform(vec.begin(), vec.end(), res.begin(),
                   [](T t) { return E(t); });
    return res;
}

template <typename T, typename E, typename std::enable_if<std::is_integral<T>::value, bool>::type = true>
val enumVecToEMS(const std::vector<E>& Ts) {
    auto arr = val::array();
    for (size_t i = 0; i < Ts.size(); ++i) {
        arr.set(i, static_cast<T>(Ts[i]));
    }
    return arr;
}

class BufferUsageBit {
public:
    BufferUsageBit() = delete;

    using type = std::underlying_type<gfx::BufferUsageBit>::type;

    static constexpr type NONE = static_cast<type>(gfx::BufferUsageBit::NONE);
    static constexpr type TRANSFER_SRC = static_cast<type>(gfx::BufferUsageBit::TRANSFER_SRC);
    static constexpr type TRANSFER_DST = static_cast<type>(gfx::BufferUsageBit::TRANSFER_DST);
    static constexpr type INDEX = static_cast<type>(gfx::BufferUsageBit::INDEX);
    static constexpr type VERTEX = static_cast<type>(gfx::BufferUsageBit::VERTEX);
    static constexpr type UNIFORM = static_cast<type>(gfx::BufferUsageBit::UNIFORM);
    static constexpr type STORAGE = static_cast<type>(gfx::BufferUsageBit::STORAGE);
    static constexpr type INDIRECT = static_cast<type>(gfx::BufferUsageBit::INDIRECT);
};

class MemoryUsageBit {
public:
    MemoryUsageBit() = delete;

    using type = std::underlying_type<gfx::MemoryUsageBit>::type;

    static constexpr type NONE = static_cast<type>(gfx::MemoryUsageBit::NONE);
    static constexpr type DEVICE = static_cast<type>(gfx::MemoryUsageBit::DEVICE);
    static constexpr type HOST = static_cast<type>(gfx::MemoryUsageBit::HOST);
};

class TextureFlagBit {
public:
    TextureFlagBit() = delete;

    using type = std::underlying_type<gfx::TextureFlagBit>::type;

    static constexpr type NONE = static_cast<type>(gfx::TextureFlagBit::NONE);
    static constexpr type GEN_MIPMAP = static_cast<type>(gfx::TextureFlagBit::GEN_MIPMAP);
    static constexpr type GENERAL_LAYOUT = static_cast<type>(gfx::TextureFlagBit::GENERAL_LAYOUT);
};

class BufferFlagBit {
public:
    BufferFlagBit() = delete;

    using type = std::underlying_type<gfx::BufferFlagBit>::type;

    static constexpr type NONE = static_cast<type>(gfx::BufferFlagBit::NONE);
};

class ComparisonFunc {
public:
    ComparisonFunc() = delete;

    using type = std::underlying_type<gfx::ComparisonFunc>::type;

    static constexpr type NEVER = static_cast<type>(gfx::ComparisonFunc::NEVER);
    static constexpr type LESS = static_cast<type>(gfx::ComparisonFunc::LESS);
    static constexpr type EQUAL = static_cast<type>(gfx::ComparisonFunc::EQUAL);
    static constexpr type LESS_EQUAL = static_cast<type>(gfx::ComparisonFunc::LESS_EQUAL);
    static constexpr type GREATER = static_cast<type>(gfx::ComparisonFunc::GREATER);
    static constexpr type NOT_EQUAL = static_cast<type>(gfx::ComparisonFunc::NOT_EQUAL);
    static constexpr type GREATER_EQUAL = static_cast<type>(gfx::ComparisonFunc::GREATER_EQUAL);
    static constexpr type ALWAYS = static_cast<type>(gfx::ComparisonFunc::ALWAYS);
};

class Address {
public:
    Address() = delete;

    using type = std::underlying_type<gfx::Address>::type;

    static constexpr type WRAP = static_cast<type>(gfx::Address::WRAP);
    static constexpr type MIRROR = static_cast<type>(gfx::Address::MIRROR);
    static constexpr type CLAMP = static_cast<type>(gfx::Address::CLAMP);
    static constexpr type BORDER = static_cast<type>(gfx::Address::BORDER);
};

class Filter {
public:
    Filter() = delete;

    using type = std::underlying_type<gfx::Filter>::type;

    static constexpr type NONE = static_cast<type>(gfx::Filter::NONE);
    static constexpr type POINT = static_cast<type>(gfx::Filter::POINT);
    static constexpr type LINEAR = static_cast<type>(gfx::Filter::LINEAR);
    static constexpr type ANISOTROPIC = static_cast<type>(gfx::Filter::ANISOTROPIC);
};

class SurfaceTransform {
public:
    SurfaceTransform() = delete;

    using type = std::underlying_type<gfx::SurfaceTransform>::type;

    static constexpr type IDENTITY = static_cast<type>(gfx::SurfaceTransform::IDENTITY);
    static constexpr type ROTATE_90 = static_cast<type>(gfx::SurfaceTransform::ROTATE_90);
    static constexpr type ROTATE_180 = static_cast<type>(gfx::SurfaceTransform::ROTATE_180);
    static constexpr type ROTATE_270 = static_cast<type>(gfx::SurfaceTransform::ROTATE_270);
};

class TextureUsageBit {
public:
    TextureUsageBit() = delete;

    using type = std::underlying_type<gfx::TextureUsageBit>::type;

    static constexpr type NONE = static_cast<type>(gfx::TextureUsageBit::NONE);
    static constexpr type TRANSFER_SRC = static_cast<type>(gfx::TextureUsageBit::TRANSFER_SRC);
    static constexpr type TRANSFER_DST = static_cast<type>(gfx::TextureUsageBit::TRANSFER_DST);
    static constexpr type SAMPLED = static_cast<type>(gfx::TextureUsageBit::SAMPLED);
    static constexpr type STORAGE = static_cast<type>(gfx::TextureUsageBit::STORAGE);
    static constexpr type COLOR_ATTACHMENT = static_cast<type>(gfx::TextureUsageBit::COLOR_ATTACHMENT);
    static constexpr type DEPTH_STENCIL_ATTACHMENT = static_cast<type>(gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT);
    static constexpr type INPUT_ATTACHMENT = static_cast<type>(gfx::TextureUsageBit::INPUT_ATTACHMENT);
};

class TextureType {
public:
    TextureType() = delete;

    using type = std::underlying_type<gfx::TextureType>::type;

    static constexpr type TEX1D = static_cast<type>(gfx::TextureType::TEX1D);
    static constexpr type TEX2D = static_cast<type>(gfx::TextureType::TEX2D);
    static constexpr type TEX3D = static_cast<type>(gfx::TextureType::TEX3D);
    static constexpr type CUBE = static_cast<type>(gfx::TextureType::CUBE);
    static constexpr type TEX1D_ARRAY = static_cast<type>(gfx::TextureType::TEX1D_ARRAY);
    static constexpr type TEX2D_ARRAY = static_cast<type>(gfx::TextureType::TEX2D_ARRAY);
};

class ResolveMode {
public:
    ResolveMode() = delete;

    using type = std::underlying_type<gfx::ResolveMode>::type;

    static constexpr type NONE = static_cast<type>(gfx::ResolveMode::NONE);
    static constexpr type SAMPLE_ZERO = static_cast<type>(gfx::ResolveMode::SAMPLE_ZERO);
    static constexpr type AVERAGE = static_cast<type>(gfx::ResolveMode::AVERAGE);
    static constexpr type MIN = static_cast<type>(gfx::ResolveMode::MIN);
    static constexpr type MAX = static_cast<type>(gfx::ResolveMode::MAX);
};

class AccessFlags {
public:
    AccessFlags() = delete;

    using type = std::underlying_type<gfx::AccessFlags>::type;

    static constexpr type NONE = static_cast<type>(gfx::AccessFlags::NONE);
    static constexpr type INDIRECT_BUFFER = static_cast<type>(gfx::AccessFlags::INDIRECT_BUFFER);
    static constexpr type INDEX_BUFFER = static_cast<type>(gfx::AccessFlags::INDEX_BUFFER);
    static constexpr type VERTEX_BUFFER = static_cast<type>(gfx::AccessFlags::VERTEX_BUFFER);
    static constexpr type VERTEX_SHADER_READ_UNIFORM_BUFFER = static_cast<type>(gfx::AccessFlags::VERTEX_SHADER_READ_UNIFORM_BUFFER);
    static constexpr type VERTEX_SHADER_READ_TEXTURE = static_cast<type>(gfx::AccessFlags::VERTEX_SHADER_READ_TEXTURE);
    static constexpr type VERTEX_SHADER_READ_OTHER = static_cast<type>(gfx::AccessFlags::VERTEX_SHADER_READ_OTHER);
};

class StoreOp {
public:
    StoreOp() = delete;

    using type = std::underlying_type<gfx::StoreOp>::type;

    static constexpr type STORE = static_cast<type>(gfx::StoreOp::STORE);
    static constexpr type DISCARD = static_cast<type>(gfx::StoreOp::DISCARD);
};

class LoadOp {
public:
    LoadOp() = delete;

    using type = std::underlying_type<gfx::LoadOp>::type;

    static constexpr type LOAD = static_cast<type>(gfx::LoadOp::LOAD);
    static constexpr type CLEAR = static_cast<type>(gfx::LoadOp::CLEAR);
    static constexpr type DISCARD = static_cast<type>(gfx::LoadOp::DISCARD);
};

class SampleCount {
public:
    SampleCount() = delete;

    using type = std::underlying_type<gfx::SampleCount>::type;

    static constexpr type ONE = static_cast<type>(gfx::SampleCount::ONE);
    static constexpr type MULTIPLE_PERFORMANCE = static_cast<type>(gfx::SampleCount::MULTIPLE_PERFORMANCE);
    static constexpr type MULTIPLE_BALANCE = static_cast<type>(gfx::SampleCount::MULTIPLE_BALANCE);
    static constexpr type MULTIPLE_QUALITY = static_cast<type>(gfx::SampleCount::MULTIPLE_QUALITY);
};

class VsyncMode {
public:
    VsyncMode() = delete;

    using type = std::underlying_type<gfx::VsyncMode>::type;

    static constexpr type OFF = static_cast<type>(gfx::VsyncMode::OFF);
    static constexpr type ON = static_cast<type>(gfx::VsyncMode::ON);
    static constexpr type RELAXED = static_cast<type>(gfx::VsyncMode::RELAXED);
    static constexpr type MAILBOX = static_cast<type>(gfx::VsyncMode::MAILBOX);
    static constexpr type HALF = static_cast<type>(gfx::VsyncMode::HALF);
};

class Format {
public:
    Format() = delete;

    using type = std::underlying_type<gfx::Format>::type;

    static constexpr type UNKNOWN = static_cast<type>(gfx::Format::UNKNOWN);
    static constexpr type A8 = static_cast<type>(gfx::Format::A8);
    static constexpr type L8 = static_cast<type>(gfx::Format::L8);
    static constexpr type LA8 = static_cast<type>(gfx::Format::LA8);
    static constexpr type R8 = static_cast<type>(gfx::Format::R8);
    static constexpr type R8SN = static_cast<type>(gfx::Format::R8SN);
    static constexpr type R8UI = static_cast<type>(gfx::Format::R8UI);
    static constexpr type R8I = static_cast<type>(gfx::Format::R8I);
    static constexpr type R16F = static_cast<type>(gfx::Format::R16F);
    static constexpr type R16UI = static_cast<type>(gfx::Format::R16UI);
    static constexpr type R16I = static_cast<type>(gfx::Format::R16I);
    static constexpr type R32F = static_cast<type>(gfx::Format::R32F);
    static constexpr type R32UI = static_cast<type>(gfx::Format::R32UI);
    static constexpr type R32I = static_cast<type>(gfx::Format::R32I);
    static constexpr type RG8 = static_cast<type>(gfx::Format::RG8);
    static constexpr type RG8SN = static_cast<type>(gfx::Format::RG8SN);
    static constexpr type RG8UI = static_cast<type>(gfx::Format::RG8UI);
    static constexpr type RG8I = static_cast<type>(gfx::Format::RG8I);
    static constexpr type RG16F = static_cast<type>(gfx::Format::RG16F);
    static constexpr type RG16UI = static_cast<type>(gfx::Format::RG16UI);
    static constexpr type RG16I = static_cast<type>(gfx::Format::RG16I);
    static constexpr type RG32F = static_cast<type>(gfx::Format::RG32F);
    static constexpr type RG32UI = static_cast<type>(gfx::Format::RG32UI);
    static constexpr type RG32I = static_cast<type>(gfx::Format::RG32I);
    static constexpr type RGB8 = static_cast<type>(gfx::Format::RGB8);
    static constexpr type SRGB8 = static_cast<type>(gfx::Format::SRGB8);
    static constexpr type RGB8SN = static_cast<type>(gfx::Format::RGB8SN);
    static constexpr type RGB8UI = static_cast<type>(gfx::Format::RGB8UI);
    static constexpr type RGB8I = static_cast<type>(gfx::Format::RGB8I);
    static constexpr type RGB16F = static_cast<type>(gfx::Format::RGB16F);
    static constexpr type RGB16UI = static_cast<type>(gfx::Format::RGB16UI);
    static constexpr type RGB16I = static_cast<type>(gfx::Format::RGB16I);
    static constexpr type RGB32F = static_cast<type>(gfx::Format::RGB32F);
    static constexpr type RGB32UI = static_cast<type>(gfx::Format::RGB32UI);
    static constexpr type RGB32I = static_cast<type>(gfx::Format::RGB32I);
    static constexpr type RGBA8 = static_cast<type>(gfx::Format::RGBA8);
    static constexpr type BGRA8 = static_cast<type>(gfx::Format::BGRA8);
    static constexpr type SRGB8_A8 = static_cast<type>(gfx::Format::SRGB8_A8);
    static constexpr type RGBA8SN = static_cast<type>(gfx::Format::RGBA8SN);
    static constexpr type RGBA8UI = static_cast<type>(gfx::Format::RGBA8UI);
    static constexpr type RGBA8I = static_cast<type>(gfx::Format::RGBA8I);
    static constexpr type RGBA16F = static_cast<type>(gfx::Format::RGBA16F);
    static constexpr type RGBA16UI = static_cast<type>(gfx::Format::RGBA16UI);
    static constexpr type RGBA16I = static_cast<type>(gfx::Format::RGBA16I);
    static constexpr type RGBA32F = static_cast<type>(gfx::Format::RGBA32F);
    static constexpr type RGBA32UI = static_cast<type>(gfx::Format::RGBA32UI);
    static constexpr type RGBA32I = static_cast<type>(gfx::Format::RGBA32I);
    static constexpr type R5G6B5 = static_cast<type>(gfx::Format::R5G6B5);
    static constexpr type R11G11B10F = static_cast<type>(gfx::Format::R11G11B10F);
    static constexpr type RGB5A1 = static_cast<type>(gfx::Format::RGB5A1);
    static constexpr type RGBA4 = static_cast<type>(gfx::Format::RGBA4);
    static constexpr type RGB10A2 = static_cast<type>(gfx::Format::RGB10A2);
    static constexpr type RGB10A2UI = static_cast<type>(gfx::Format::RGB10A2UI);
    static constexpr type RGB9E5 = static_cast<type>(gfx::Format::RGB9E5);
    static constexpr type DEPTH = static_cast<type>(gfx::Format::DEPTH);
    static constexpr type DEPTH_STENCIL = static_cast<type>(gfx::Format::DEPTH_STENCIL);
    static constexpr type BC1 = static_cast<type>(gfx::Format::BC1);
    static constexpr type BC1_ALPHA = static_cast<type>(gfx::Format::BC1_ALPHA);
    static constexpr type BC1_SRGB = static_cast<type>(gfx::Format::BC1_SRGB);
    static constexpr type BC1_SRGB_ALPHA = static_cast<type>(gfx::Format::BC1_SRGB_ALPHA);
    static constexpr type BC2 = static_cast<type>(gfx::Format::BC2);
    static constexpr type BC2_SRGB = static_cast<type>(gfx::Format::BC2_SRGB);
    static constexpr type BC3 = static_cast<type>(gfx::Format::BC3);
    static constexpr type BC3_SRGB = static_cast<type>(gfx::Format::BC3_SRGB);
    static constexpr type BC4 = static_cast<type>(gfx::Format::BC4);
    static constexpr type BC4_SNORM = static_cast<type>(gfx::Format::BC4_SNORM);
    static constexpr type BC5 = static_cast<type>(gfx::Format::BC5);
    static constexpr type BC5_SNORM = static_cast<type>(gfx::Format::BC5_SNORM);
    static constexpr type BC6H_UF16 = static_cast<type>(gfx::Format::BC6H_UF16);
    static constexpr type BC6H_SF16 = static_cast<type>(gfx::Format::BC6H_SF16);
    static constexpr type BC7 = static_cast<type>(gfx::Format::BC7);
    static constexpr type BC7_SRGB = static_cast<type>(gfx::Format::BC7_SRGB);
    static constexpr type ETC_RGB8 = static_cast<type>(gfx::Format::ETC_RGB8);
    static constexpr type ETC2_RGB8 = static_cast<type>(gfx::Format::ETC2_RGB8);
    static constexpr type ETC2_SRGB8 = static_cast<type>(gfx::Format::ETC2_SRGB8);
    static constexpr type ETC2_RGB8_A1 = static_cast<type>(gfx::Format::ETC2_RGB8_A1);
    static constexpr type ETC2_SRGB8_A1 = static_cast<type>(gfx::Format::ETC2_SRGB8_A1);
    static constexpr type ETC2_RGBA8 = static_cast<type>(gfx::Format::ETC2_RGBA8);
    static constexpr type ETC2_SRGB8_A8 = static_cast<type>(gfx::Format::ETC2_SRGB8_A8);
    static constexpr type EAC_R11 = static_cast<type>(gfx::Format::EAC_R11);
    static constexpr type EAC_R11SN = static_cast<type>(gfx::Format::EAC_R11SN);
    static constexpr type EAC_RG11 = static_cast<type>(gfx::Format::EAC_RG11);
    static constexpr type EAC_RG11SN = static_cast<type>(gfx::Format::EAC_RG11SN);
    static constexpr type PVRTC_RGB2 = static_cast<type>(gfx::Format::PVRTC_RGB2);
    static constexpr type PVRTC_RGBA2 = static_cast<type>(gfx::Format::PVRTC_RGBA2);
    static constexpr type PVRTC_RGB4 = static_cast<type>(gfx::Format::PVRTC_RGB4);
    static constexpr type PVRTC_RGBA4 = static_cast<type>(gfx::Format::PVRTC_RGBA4);
    static constexpr type PVRTC2_2BPP = static_cast<type>(gfx::Format::PVRTC2_2BPP);
    static constexpr type PVRTC2_4BPP = static_cast<type>(gfx::Format::PVRTC2_4BPP);
    static constexpr type ASTC_RGBA_4X4 = static_cast<type>(gfx::Format::ASTC_RGBA_4X4);
    static constexpr type ASTC_RGBA_5X4 = static_cast<type>(gfx::Format::ASTC_RGBA_5X4);
    static constexpr type ASTC_RGBA_5X5 = static_cast<type>(gfx::Format::ASTC_RGBA_5X5);
    static constexpr type ASTC_RGBA_6X5 = static_cast<type>(gfx::Format::ASTC_RGBA_6X5);
    static constexpr type ASTC_RGBA_6X6 = static_cast<type>(gfx::Format::ASTC_RGBA_6X6);
    static constexpr type ASTC_RGBA_8X5 = static_cast<type>(gfx::Format::ASTC_RGBA_8X5);
    static constexpr type ASTC_RGBA_8X6 = static_cast<type>(gfx::Format::ASTC_RGBA_8X6);
    static constexpr type ASTC_RGBA_8X8 = static_cast<type>(gfx::Format::ASTC_RGBA_8X8);
    static constexpr type ASTC_RGBA_10X5 = static_cast<type>(gfx::Format::ASTC_RGBA_10X5);
    static constexpr type ASTC_RGBA_10X6 = static_cast<type>(gfx::Format::ASTC_RGBA_10X6);
    static constexpr type ASTC_RGBA_10X8 = static_cast<type>(gfx::Format::ASTC_RGBA_10X8);
    static constexpr type ASTC_RGBA_10X10 = static_cast<type>(gfx::Format::ASTC_RGBA_10X10);
    static constexpr type ASTC_RGBA_12X10 = static_cast<type>(gfx::Format::ASTC_RGBA_12X10);
    static constexpr type ASTC_RGBA_12X12 = static_cast<type>(gfx::Format::ASTC_RGBA_12X12);
    static constexpr type ASTC_SRGBA_4X4 = static_cast<type>(gfx::Format::ASTC_SRGBA_4X4);
    static constexpr type ASTC_SRGBA_5X4 = static_cast<type>(gfx::Format::ASTC_SRGBA_5X4);
    static constexpr type ASTC_SRGBA_5X5 = static_cast<type>(gfx::Format::ASTC_SRGBA_5X5);
    static constexpr type ASTC_SRGBA_6X5 = static_cast<type>(gfx::Format::ASTC_SRGBA_6X5);
    static constexpr type ASTC_SRGBA_6X6 = static_cast<type>(gfx::Format::ASTC_SRGBA_6X6);
    static constexpr type ASTC_SRGBA_8X5 = static_cast<type>(gfx::Format::ASTC_SRGBA_8X5);
    static constexpr type ASTC_SRGBA_8X6 = static_cast<type>(gfx::Format::ASTC_SRGBA_8X6);
    static constexpr type ASTC_SRGBA_8X8 = static_cast<type>(gfx::Format::ASTC_SRGBA_8X8);
    static constexpr type ASTC_SRGBA_10X5 = static_cast<type>(gfx::Format::ASTC_SRGBA_10X5);
    static constexpr type ASTC_SRGBA_10X6 = static_cast<type>(gfx::Format::ASTC_SRGBA_10X6);
    static constexpr type ASTC_SRGBA_10X8 = static_cast<type>(gfx::Format::ASTC_SRGBA_10X8);
    static constexpr type ASTC_SRGBA_10X10 = static_cast<type>(gfx::Format::ASTC_SRGBA_10X10);
    static constexpr type ASTC_SRGBA_12X10 = static_cast<type>(gfx::Format::ASTC_SRGBA_12X10);
    static constexpr type ASTC_SRGBA_12X12 = static_cast<type>(gfx::Format::ASTC_SRGBA_12X12);
    static constexpr type COUNT = static_cast<type>(gfx::Format::COUNT);
};

class DescriptorType {
public:
    DescriptorType() = delete;

    using type = std::underlying_type<gfx::DescriptorType>::type;
    static constexpr type UNKNOWN = static_cast<type>(gfx::DescriptorType::UNKNOWN);
    static constexpr type UNIFORM_BUFFER = static_cast<type>(gfx::DescriptorType::UNIFORM_BUFFER);
    static constexpr type DYNAMIC_UNIFORM_BUFFER = static_cast<type>(gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER);
    static constexpr type STORAGE_BUFFER = static_cast<type>(gfx::DescriptorType::STORAGE_BUFFER);
    static constexpr type DYNAMIC_STORAGE_BUFFER = static_cast<type>(gfx::DescriptorType::DYNAMIC_STORAGE_BUFFER);
    static constexpr type SAMPLER_TEXTURE = static_cast<type>(gfx::DescriptorType::SAMPLER_TEXTURE);
    static constexpr type SAMPLER = static_cast<type>(gfx::DescriptorType::SAMPLER);
    static constexpr type TEXTURE = static_cast<type>(gfx::DescriptorType::TEXTURE);
    static constexpr type STORAGE_IMAGE = static_cast<type>(gfx::DescriptorType::STORAGE_IMAGE);
    static constexpr type INPUT_ATTACHMENT = static_cast<type>(gfx::DescriptorType::INPUT_ATTACHMENT);
    ;
};

class ShaderStageFlagBit {
public:
    ShaderStageFlagBit() = delete;

    using type = std::underlying_type<gfx::ShaderStageFlagBit>::type;
    static constexpr type NONE = static_cast<type>(gfx::ShaderStageFlagBit::NONE);
    static constexpr type VERTEX = static_cast<type>(gfx::ShaderStageFlagBit::VERTEX);
    static constexpr type CONTROL = static_cast<type>(gfx::ShaderStageFlagBit::CONTROL);
    static constexpr type EVALUATION = static_cast<type>(gfx::ShaderStageFlagBit::EVALUATION);
    static constexpr type GEOMETRY = static_cast<type>(gfx::ShaderStageFlagBit::GEOMETRY);
    static constexpr type FRAGMENT = static_cast<type>(gfx::ShaderStageFlagBit::FRAGMENT);
    static constexpr type COMPUTE = static_cast<type>(gfx::ShaderStageFlagBit::COMPUTE);
    static constexpr type ALL = static_cast<type>(gfx::ShaderStageFlagBit::ALL);
    ;
};

class Type {
public:
    Type() = delete;

    using type = std::underlying_type<gfx::Type>::type;
    static constexpr type UNKNOWN = static_cast<type>(gfx::Type::UNKNOWN);
    static constexpr type BOOL = static_cast<type>(gfx::Type::BOOL);
    static constexpr type BOOL2 = static_cast<type>(gfx::Type::BOOL2);
    static constexpr type BOOL3 = static_cast<type>(gfx::Type::BOOL3);
    static constexpr type BOOL4 = static_cast<type>(gfx::Type::BOOL4);
    static constexpr type INT = static_cast<type>(gfx::Type::INT);
    static constexpr type INT2 = static_cast<type>(gfx::Type::INT2);
    static constexpr type INT3 = static_cast<type>(gfx::Type::INT3);
    static constexpr type INT4 = static_cast<type>(gfx::Type::INT4);
    static constexpr type UINT = static_cast<type>(gfx::Type::UINT);
    static constexpr type UINT2 = static_cast<type>(gfx::Type::UINT2);
    static constexpr type UINT3 = static_cast<type>(gfx::Type::UINT3);
    static constexpr type UINT4 = static_cast<type>(gfx::Type::UINT4);
    static constexpr type FLOAT = static_cast<type>(gfx::Type::FLOAT);
    static constexpr type FLOAT2 = static_cast<type>(gfx::Type::FLOAT2);
    static constexpr type FLOAT3 = static_cast<type>(gfx::Type::FLOAT3);
    static constexpr type FLOAT4 = static_cast<type>(gfx::Type::FLOAT4);
    static constexpr type MAT2 = static_cast<type>(gfx::Type::MAT2);
    static constexpr type MAT2X3 = static_cast<type>(gfx::Type::MAT2X3);
    static constexpr type MAT2X4 = static_cast<type>(gfx::Type::MAT2X4);
    static constexpr type MAT3X2 = static_cast<type>(gfx::Type::MAT3X2);
    static constexpr type MAT3X4 = static_cast<type>(gfx::Type::MAT3X4);
    static constexpr type MAT4X2 = static_cast<type>(gfx::Type::MAT4X2);
    static constexpr type MAT4X3 = static_cast<type>(gfx::Type::MAT4X3);
    static constexpr type MAT4 = static_cast<type>(gfx::Type::MAT4);
    static constexpr type SAMPLER1D = static_cast<type>(gfx::Type::SAMPLER1D);
    static constexpr type SAMPLER1D_ARRAY = static_cast<type>(gfx::Type::SAMPLER1D_ARRAY);
    static constexpr type SAMPLER2D = static_cast<type>(gfx::Type::SAMPLER2D);
    static constexpr type SAMPLER2D_ARRAY = static_cast<type>(gfx::Type::SAMPLER2D_ARRAY);
    static constexpr type SAMPLER3D = static_cast<type>(gfx::Type::SAMPLER3D);
    static constexpr type SAMPLER_CUBE = static_cast<type>(gfx::Type::SAMPLER_CUBE);
    static constexpr type SAMPLER = static_cast<type>(gfx::Type::SAMPLER);
    static constexpr type TEXTURE1D = static_cast<type>(gfx::Type::TEXTURE1D);
    static constexpr type TEXTURE1D_ARRAY = static_cast<type>(gfx::Type::TEXTURE1D_ARRAY);
    static constexpr type TEXTURE2D = static_cast<type>(gfx::Type::TEXTURE2D);
    static constexpr type TEXTURE2D_ARRAY = static_cast<type>(gfx::Type::TEXTURE2D_ARRAY);
    static constexpr type TEXTURE3D = static_cast<type>(gfx::Type::TEXTURE3D);
    static constexpr type TEXTURE_CUBE = static_cast<type>(gfx::Type::TEXTURE_CUBE);
    static constexpr type IMAGE1D = static_cast<type>(gfx::Type::IMAGE1D);
    static constexpr type IMAGE1D_ARRAY = static_cast<type>(gfx::Type::IMAGE1D_ARRAY);
    static constexpr type IMAGE2D = static_cast<type>(gfx::Type::IMAGE2D);
    static constexpr type IMAGE2D_ARRAY = static_cast<type>(gfx::Type::IMAGE2D_ARRAY);
    static constexpr type IMAGE3D = static_cast<type>(gfx::Type::IMAGE3D);
    static constexpr type IMAGE_CUBE = static_cast<type>(gfx::Type::IMAGE_CUBE);
    static constexpr type SUBPASS_INPUT = static_cast<type>(gfx::Type::SUBPASS_INPUT);
    static constexpr type COUNT = static_cast<type>(gfx::Type::COUNT);
};

class PolygonMode {
public:
    PolygonMode() = delete;

    using type = std::underlying_type<gfx::PolygonMode>::type;
    static constexpr type FILL = static_cast<type>(gfx::PolygonMode::FILL);
    static constexpr type POINT = static_cast<type>(gfx::PolygonMode::POINT);
    static constexpr type LINE = static_cast<type>(gfx::PolygonMode::LINE);
};

class ShadeModel {
public:
    ShadeModel() = delete;

    using type = std::underlying_type<gfx::ShadeModel>::type;
    static constexpr type GOURAND = static_cast<type>(gfx::ShadeModel::GOURAND);
    static constexpr type FLAT = static_cast<type>(gfx::ShadeModel::FLAT);
};

class CullMode {
public:
    CullMode() = delete;

    using type = std::underlying_type<gfx::CullMode>::type;
    static constexpr type NONE = static_cast<type>(gfx::CullMode::NONE);
    static constexpr type FRONT = static_cast<type>(gfx::CullMode::FRONT);
    static constexpr type BACK = static_cast<type>(gfx::CullMode::BACK);
};

class StencilOp {
public:
    StencilOp() = delete;

    using type = std::underlying_type<gfx::StencilOp>::type;
    static constexpr type ZERO = static_cast<type>(gfx::StencilOp::ZERO);
    static constexpr type KEEP = static_cast<type>(gfx::StencilOp::KEEP);
    static constexpr type REPLACE = static_cast<type>(gfx::StencilOp::REPLACE);
    static constexpr type INCR = static_cast<type>(gfx::StencilOp::INCR);
    static constexpr type DECR = static_cast<type>(gfx::StencilOp::DECR);
    static constexpr type INVERT = static_cast<type>(gfx::StencilOp::INVERT);
    static constexpr type INCR_WRAP = static_cast<type>(gfx::StencilOp::INCR_WRAP);
    static constexpr type DECR_WRAP = static_cast<type>(gfx::StencilOp::DECR_WRAP);
};

class BlendFactor {
public:
    BlendFactor() = delete;

    using type = std::underlying_type<gfx::BlendFactor>::type;
    static constexpr type ZERO = static_cast<type>(gfx::BlendFactor::ZERO);
    static constexpr type ONE = static_cast<type>(gfx::BlendFactor::ONE);
    static constexpr type SRC_ALPHA = static_cast<type>(gfx::BlendFactor::SRC_ALPHA);
    static constexpr type DST_ALPHA = static_cast<type>(gfx::BlendFactor::DST_ALPHA);
    static constexpr type ONE_MINUS_SRC_ALPHA = static_cast<type>(gfx::BlendFactor::ONE_MINUS_SRC_ALPHA);
    static constexpr type ONE_MINUS_DST_ALPHA = static_cast<type>(gfx::BlendFactor::ONE_MINUS_DST_ALPHA);
    static constexpr type SRC_COLOR = static_cast<type>(gfx::BlendFactor::SRC_COLOR);
    static constexpr type DST_COLOR = static_cast<type>(gfx::BlendFactor::DST_COLOR);
    static constexpr type ONE_MINUS_SRC_COLOR = static_cast<type>(gfx::BlendFactor::ONE_MINUS_SRC_COLOR);
    static constexpr type ONE_MINUS_DST_COLOR = static_cast<type>(gfx::BlendFactor::ONE_MINUS_DST_COLOR);
    static constexpr type SRC_ALPHA_SATURATE = static_cast<type>(gfx::BlendFactor::SRC_ALPHA_SATURATE);
    static constexpr type CONSTANT_COLOR = static_cast<type>(gfx::BlendFactor::CONSTANT_COLOR);
    static constexpr type ONE_MINUS_CONSTANT_COLOR = static_cast<type>(gfx::BlendFactor::ONE_MINUS_CONSTANT_COLOR);
    static constexpr type CONSTANT_ALPHA = static_cast<type>(gfx::BlendFactor::CONSTANT_ALPHA);
    static constexpr type ONE_MINUS_CONSTANT_ALPHA = static_cast<type>(gfx::BlendFactor::ONE_MINUS_CONSTANT_ALPHA);
};

class BlendOp {
public:
    BlendOp() = delete;

    using type = std::underlying_type<gfx::BlendOp>::type;
    static constexpr type ADD = static_cast<type>(gfx::BlendOp::ADD);
    static constexpr type SUB = static_cast<type>(gfx::BlendOp::SUB);
    static constexpr type REV_SUB = static_cast<type>(gfx::BlendOp::REV_SUB);
    static constexpr type MIN = static_cast<type>(gfx::BlendOp::MIN);
    static constexpr type MAX = static_cast<type>(gfx::BlendOp::MAX);
};

class ColorMask {
public:
    ColorMask() = delete;

    using type = std::underlying_type<gfx::ColorMask>::type;
    static constexpr type NONE = static_cast<type>(gfx::ColorMask::NONE);
    static constexpr type R = static_cast<type>(gfx::ColorMask::R);
    static constexpr type G = static_cast<type>(gfx::ColorMask::G);
    static constexpr type B = static_cast<type>(gfx::ColorMask::B);
    static constexpr type A = static_cast<type>(gfx::ColorMask::A);
    static constexpr type ALL = static_cast<type>(gfx::ColorMask::ALL);
};

class PrimitiveMode {
public:
    PrimitiveMode() = delete;

    using type = std::underlying_type<gfx::PrimitiveMode>::type;
    static constexpr type POINT_LIST = static_cast<type>(gfx::PrimitiveMode::POINT_LIST);
    static constexpr type LINE_LIST = static_cast<type>(gfx::PrimitiveMode::LINE_LIST);
    static constexpr type LINE_STRIP = static_cast<type>(gfx::PrimitiveMode::LINE_STRIP);
    static constexpr type LINE_LOOP = static_cast<type>(gfx::PrimitiveMode::LINE_LOOP);
    static constexpr type LINE_LIST_ADJACENCY = static_cast<type>(gfx::PrimitiveMode::LINE_LIST_ADJACENCY);
    static constexpr type LINE_STRIP_ADJACENCY = static_cast<type>(gfx::PrimitiveMode::LINE_STRIP_ADJACENCY);
    static constexpr type ISO_LINE_LIST = static_cast<type>(gfx::PrimitiveMode::ISO_LINE_LIST);
    static constexpr type TRIANGLE_LIST = static_cast<type>(gfx::PrimitiveMode::TRIANGLE_LIST);
    static constexpr type TRIANGLE_STRIP = static_cast<type>(gfx::PrimitiveMode::TRIANGLE_STRIP);
    static constexpr type TRIANGLE_FAN = static_cast<type>(gfx::PrimitiveMode::TRIANGLE_FAN);
    static constexpr type TRIANGLE_LIST_ADJACENCY = static_cast<type>(gfx::PrimitiveMode::TRIANGLE_LIST_ADJACENCY);
    static constexpr type TRIANGLE_STRIP_ADJACENCY = static_cast<type>(gfx::PrimitiveMode::TRIANGLE_STRIP_ADJACENCY);
    static constexpr type TRIANGLE_PATCH_ADJACENCY = static_cast<type>(gfx::PrimitiveMode::TRIANGLE_PATCH_ADJACENCY);
    static constexpr type QUAD_PATCH_LIST = static_cast<type>(gfx::PrimitiveMode::QUAD_PATCH_LIST);
};

class DynamicStateFlagBit {
public:
    DynamicStateFlagBit() = delete;

    using type = std::underlying_type<gfx::DynamicStateFlagBit>::type;
    static constexpr type NONE = static_cast<type>(gfx::DynamicStateFlagBit::NONE);
    static constexpr type LINE_WIDTH = static_cast<type>(gfx::DynamicStateFlagBit::LINE_WIDTH);
    static constexpr type DEPTH_BIAS = static_cast<type>(gfx::DynamicStateFlagBit::DEPTH_BIAS);
    static constexpr type BLEND_CONSTANTS = static_cast<type>(gfx::DynamicStateFlagBit::BLEND_CONSTANTS);
    static constexpr type DEPTH_BOUNDS = static_cast<type>(gfx::DynamicStateFlagBit::DEPTH_BOUNDS);
    static constexpr type STENCIL_WRITE_MASK = static_cast<type>(gfx::DynamicStateFlagBit::STENCIL_WRITE_MASK);
    static constexpr type STENCIL_COMPARE_MASK = static_cast<type>(gfx::DynamicStateFlagBit::STENCIL_COMPARE_MASK);
};

class PipelineBindPoint {
public:
    PipelineBindPoint() = delete;

    using type = std::underlying_type<gfx::PipelineBindPoint>::type;
    static constexpr type GRAPHICS = static_cast<type>(gfx::PipelineBindPoint::GRAPHICS);
    static constexpr type COMPUTE = static_cast<type>(gfx::PipelineBindPoint::COMPUTE);
    static constexpr type RAY_TRACING = static_cast<type>(gfx::PipelineBindPoint::RAY_TRACING);
};

class QueueType {
public:
    QueueType() = delete;

    using type = std::underlying_type<gfx::QueueType>::type;
    static constexpr type GRAPHICS = static_cast<type>(gfx::QueueType::GRAPHICS);
    static constexpr type COMPUTE = static_cast<type>(gfx::QueueType::COMPUTE);
    static constexpr type TRANSFER = static_cast<type>(gfx::QueueType::TRANSFER);
};

class ClearFlagBit {
public:
    ClearFlagBit() = delete;

    using type = std::underlying_type<gfx::ClearFlagBit>::type;
    static constexpr type NONE = static_cast<type>(gfx::ClearFlagBit::NONE);
    static constexpr type COLOR = static_cast<type>(gfx::ClearFlagBit::COLOR);
    static constexpr type DEPTH = static_cast<type>(gfx::ClearFlagBit::DEPTH);
    static constexpr type STENCIL = static_cast<type>(gfx::ClearFlagBit::STENCIL);
    static constexpr type DEPTH_STENCIL = static_cast<type>(gfx::ClearFlagBit::DEPTH_STENCIL);
    static constexpr type ALL = static_cast<type>(gfx::ClearFlagBit::ALL);
};

class FormatType {
public:
    FormatType() = delete;

    using type = std::underlying_type<gfx::FormatType>::type;
    static constexpr type NONE = static_cast<type>(gfx::FormatType::NONE);
    static constexpr type UNORM = static_cast<type>(gfx::FormatType::UNORM);
    static constexpr type SNORM = static_cast<type>(gfx::FormatType::SNORM);
    static constexpr type UINT = static_cast<type>(gfx::FormatType::UINT);
    static constexpr type INT = static_cast<type>(gfx::FormatType::INT);
    static constexpr type UFLOAT = static_cast<type>(gfx::FormatType::UFLOAT);
    static constexpr type FLOAT = static_cast<type>(gfx::FormatType::FLOAT);
};

class CommandBufferType {
public:
    CommandBufferType() = delete;

    using type = std::underlying_type<gfx::CommandBufferType>::type;
    static constexpr type PRIMARY = static_cast<type>(gfx::CommandBufferType::PRIMARY);
    static constexpr type SECONDARY = static_cast<type>(gfx::CommandBufferType::SECONDARY);
};

class Feature {
public:
    Feature() = delete;

    using type = std::underlying_type<gfx::Feature>::type;
    // static constexpr type COLOR_FLOAT = static_cast<type>(gfx::Feature::COLOR_FLOAT);
    // static constexpr type COLOR_HALF_FLOAT = static_cast<type>(gfx::Feature::COLOR_HALF_FLOAT);
    // static constexpr type TEXTURE_FLOAT = static_cast<type>(gfx::Feature::TEXTURE_FLOAT);
    // static constexpr type TEXTURE_HALF_FLOAT = static_cast<type>(gfx::Feature::TEXTURE_HALF_FLOAT);
    // static constexpr type TEXTURE_FLOAT_LINEAR = static_cast<type>(gfx::Feature::TEXTURE_FLOAT_LINEAR);
    // static constexpr type TEXTURE_HALF_FLOAT_LINEAR = static_cast<type>(gfx::Feature::TEXTURE_HALF_FLOAT_LINEAR);
    // static constexpr type FORMAT_R11G11B10F = static_cast<type>(gfx::Feature::FORMAT_R11G11B10F);
    // static constexpr type FORMAT_SRGB = static_cast<type>(gfx::Feature::FORMAT_SRGB);
    // static constexpr type FORMAT_ETC1 = static_cast<type>(gfx::Feature::FORMAT_ETC1);
    // static constexpr type FORMAT_ETC2 = static_cast<type>(gfx::Feature::FORMAT_ETC2);
    // static constexpr type FORMAT_DXT = static_cast<type>(gfx::Feature::FORMAT_DXT);
    // static constexpr type FORMAT_PVRTC = static_cast<type>(gfx::Feature::FORMAT_PVRTC);
    // static constexpr type FORMAT_ASTC = static_cast<type>(gfx::Feature::FORMAT_ASTC);
    // static constexpr type FORMAT_RGB8 = static_cast<type>(gfx::Feature::FORMAT_RGB8);
    static constexpr type ELEMENT_INDEX_UINT = static_cast<type>(gfx::Feature::ELEMENT_INDEX_UINT);
    static constexpr type INSTANCED_ARRAYS = static_cast<type>(gfx::Feature::INSTANCED_ARRAYS);
    static constexpr type MULTIPLE_RENDER_TARGETS = static_cast<type>(gfx::Feature::MULTIPLE_RENDER_TARGETS);
    static constexpr type BLEND_MINMAX = static_cast<type>(gfx::Feature::BLEND_MINMAX);
    static constexpr type COMPUTE_SHADER = static_cast<type>(gfx::Feature::COMPUTE_SHADER);
    static constexpr type INPUT_ATTACHMENT_BENEFIT = static_cast<type>(gfx::Feature::INPUT_ATTACHMENT_BENEFIT);
    static constexpr type COUNT = static_cast<type>(gfx::Feature::COUNT);
};

class MemoryAccessBit {
public:
    MemoryAccessBit() = delete;

    using type = std::underlying_type<gfx::MemoryAccessBit>::type;
    static constexpr type NONE = static_cast<type>(gfx::MemoryAccessBit::NONE);
    static constexpr type READ_ONLY = static_cast<type>(gfx::MemoryAccessBit::READ_ONLY);
    static constexpr type WRITE_ONLY = static_cast<type>(gfx::MemoryAccessBit::WRITE_ONLY);
    static constexpr type READ_WRITE = static_cast<type>(gfx::MemoryAccessBit::READ_WRITE);
};

class FormatInfo {
public:
    FormatInfo() = default;
    FormatInfo(String name)
    : obj({name}) {}
    FormatInfo(String name, uint32_t size)
    : obj({name, size}) {}
    FormatInfo(String name, uint32_t size, uint32_t count)
    : obj({name, size, count}) {}
    FormatInfo(String name, uint32_t size, uint32_t count, FormatType::type type)
    : obj({name, size, count, gfx::FormatType(type)}) {}
    FormatInfo(String name, uint32_t size, uint32_t count, FormatType::type type, bool hasAlpha)
    : obj({name, size, count, gfx::FormatType(type), hasAlpha}) {}
    FormatInfo(String name, uint32_t size, uint32_t count, FormatType::type type, bool hasAlpha, bool hasDepth)
    : obj({name, size, count, gfx::FormatType(type), hasAlpha, hasDepth}) {}
    FormatInfo(String name, uint32_t size, uint32_t count, FormatType::type type, bool hasAlpha, bool hasDepth, bool hasStencil)
    : obj({name, size, count, gfx::FormatType(type), hasAlpha, hasDepth, hasStencil}) {}
    FormatInfo(String name, uint32_t size, uint32_t count, FormatType::type type, bool hasAlpha, bool hasDepth, bool hasStencil, bool isCompressed)
    : obj({name, size, count, gfx::FormatType(type), hasAlpha, hasDepth, hasStencil, isCompressed}) {}

    // inline void setName(String name) { obj.name = name; }
    // inline void setSize(uint32_t size) { obj.size = size; }
    // inline void setCount(uint32_t count) { obj.count = count; }
    // inline void setType(FormatType::type type) { obj.type = gfx::FormatType(type); }
    // inline void setAlpha(bool hasAlpha) { obj.hasAlpha = hasAlpha; }
    // inline void setDepth(bool hasDepth) { obj.hasDepth = hasDepth; }
    // inline void setStencil(bool hasStencil) { obj.hasStencil = hasStencil; }
    // inline void setCompressed(bool isCompressed) { obj.isCompressed = isCompressed; }

    inline String getName() const { return obj.name; }
    inline uint32_t getSize() const { return obj.size; }
    inline uint32_t getCount() const { return obj.count; }
    inline FormatType::type getType() const { return static_cast<FormatType::type>(obj.type); }
    inline bool getAlpha() const { return obj.hasAlpha; }
    inline bool getDepth() const { return obj.hasDepth; }
    inline bool getStencil() const { return obj.hasStencil; }
    inline bool getCompressed() const { return obj.isCompressed; }

    CC_OBJECT(FormatInfo);

private:
    gfx::FormatInfo obj;
};

static auto formatArray = val::array();

static val getFormatInfos() {
    uint32_t len = formatArray["length"].as<unsigned>();
    if (!len) {
        for (size_t i = 0; i < static_cast<size_t>(Format::COUNT); ++i) {
            formatArray.set(i, FormatInfo{
                                   GFX_FORMAT_INFOS[i].name,
                                   GFX_FORMAT_INFOS[i].size,
                                   GFX_FORMAT_INFOS[i].count,
                                   static_cast<FormatType::type>(GFX_FORMAT_INFOS[i].type),
                                   GFX_FORMAT_INFOS[i].hasAlpha,
                                   GFX_FORMAT_INFOS[i].hasDepth,
                                   GFX_FORMAT_INFOS[i].hasStencil,
                                   GFX_FORMAT_INFOS[i].isCompressed,
                               });
        }
    }
    return formatArray;
};

class BindingMappingInfo {
public:
    BindingMappingInfo() = default;
    BindingMappingInfo(val maxBlockCounts)
    : obj({vecFromEMS<uint32_t>(maxBlockCounts)}) {}
    BindingMappingInfo(val maxBlockCounts, val maxSamplerTextureCounts)
    : obj({vecFromEMS<uint32_t>(maxBlockCounts), vecFromEMS<uint32_t>(maxSamplerTextureCounts)}) {}
    BindingMappingInfo(val maxBlockCounts, val maxSamplerTextureCounts, val maxSamplerCounts)
    : obj({vecFromEMS<uint32_t>(maxBlockCounts), vecFromEMS<uint32_t>(maxSamplerTextureCounts), vecFromEMS<uint32_t>(maxSamplerCounts)}) {}
    BindingMappingInfo(val maxBlockCounts, val maxSamplerTextureCounts, val maxSamplerCounts, val maxTextureCounts)
    : obj({vecFromEMS<uint32_t>(maxBlockCounts), vecFromEMS<uint32_t>(maxSamplerTextureCounts), vecFromEMS<uint32_t>(maxSamplerCounts), vecFromEMS<uint32_t>(maxTextureCounts)}) {}
    BindingMappingInfo(val maxBlockCounts, val maxSamplerTextureCounts, val maxSamplerCounts, val maxTextureCounts, val maxBufferCounts)
    : obj({vecFromEMS<uint32_t>(maxBlockCounts), vecFromEMS<uint32_t>(maxSamplerTextureCounts), vecFromEMS<uint32_t>(maxSamplerCounts), vecFromEMS<uint32_t>(maxTextureCounts), vecFromEMS<uint32_t>(maxBufferCounts)}) {}
    BindingMappingInfo(val maxBlockCounts, val maxSamplerTextureCounts, val maxSamplerCounts, val maxTextureCounts, val maxBufferCounts, val maxImageCounts)
    : obj({vecFromEMS<uint32_t>(maxBlockCounts), vecFromEMS<uint32_t>(maxSamplerTextureCounts), vecFromEMS<uint32_t>(maxSamplerCounts), vecFromEMS<uint32_t>(maxTextureCounts), vecFromEMS<uint32_t>(maxBufferCounts), vecFromEMS<uint32_t>(maxImageCounts)}) {}
    BindingMappingInfo(val maxBlockCounts, val maxSamplerTextureCounts, val maxSamplerCounts, val maxTextureCounts, val maxBufferCounts, val maxImageCounts, val maxSubpassInputCounts)
    : obj({vecFromEMS<uint32_t>(maxBlockCounts), vecFromEMS<uint32_t>(maxSamplerTextureCounts), vecFromEMS<uint32_t>(maxSamplerCounts), vecFromEMS<uint32_t>(maxTextureCounts), vecFromEMS<uint32_t>(maxBufferCounts), vecFromEMS<uint32_t>(maxImageCounts), vecFromEMS<uint32_t>(maxSubpassInputCounts)}) {}
    BindingMappingInfo(val maxBlockCounts, val maxSamplerTextureCounts, val maxSamplerCounts, val maxTextureCounts, val maxBufferCounts, val maxImageCounts, val maxSubpassInputCounts, val setIndices)
    : obj({vecFromEMS<uint32_t>(maxBlockCounts), vecFromEMS<uint32_t>(maxSamplerTextureCounts), vecFromEMS<uint32_t>(maxSamplerCounts), vecFromEMS<uint32_t>(maxTextureCounts), vecFromEMS<uint32_t>(maxBufferCounts), vecFromEMS<uint32_t>(maxImageCounts), vecFromEMS<uint32_t>(maxSubpassInputCounts), vecFromEMS<uint32_t>(setIndices)}) {}

    inline void setMaxBlockCounts(val maxBlockCounts) { obj.maxBlockCounts = std::move(vecFromEMS<uint32_t>(maxBlockCounts)); }
    inline void setMaxSamplerTextureCounts(val maxSamplerTextureCounts) { obj.maxSamplerTextureCounts = std::move(vecFromEMS<uint32_t>(maxSamplerTextureCounts)); }
    inline void setMaxSamplerCounts(val maxSamplerCounts) { obj.maxSamplerCounts = std::move(vecFromEMS<uint32_t>(maxSamplerCounts)); }
    inline void setMaxTextureCounts(val maxTextureCounts) { obj.maxTextureCounts = std::move(vecFromEMS<uint32_t>(maxTextureCounts)); }
    inline void setMaxBufferCounts(val maxBufferCounts) { obj.maxBufferCounts = std::move(vecFromEMS<uint32_t>(maxBufferCounts)); }
    inline void setMaxImageCounts(val maxImageCounts) { obj.maxImageCounts = std::move(vecFromEMS<uint32_t>(maxImageCounts)); }
    inline void setMaxSubpassInputCounts(val maxSubpassInputCounts) { obj.maxSubpassInputCounts = std::move(vecFromEMS<uint32_t>(maxSubpassInputCounts)); }
    inline void setSetIndices(val setIndices) { obj.setIndices = std::move(vecFromEMS<uint32_t>(setIndices)); }

    inline const val& getMaxBlockCounts() const { return vecToEMS(obj.maxBlockCounts); }
    inline const val& getMaxSamplerTextureCounts() const { return vecToEMS(obj.maxSamplerTextureCounts); }
    inline const val& getMaxSamplerCounts() const { return vecToEMS(obj.maxSamplerCounts); }
    inline const val& getMaxTextureCounts() const { return vecToEMS(obj.maxTextureCounts); }
    inline const val& getMaxBufferCounts() const { return vecToEMS(obj.maxBufferCounts); }
    inline const val& getMaxImageCounts() const { return vecToEMS(obj.maxImageCounts); }
    inline const val& getMaxSubpassInputCounts() const { return vecToEMS(obj.maxSubpassInputCounts); }
    inline const val& getSetIndices() const { return vecToEMS(obj.setIndices); }

    CC_OBJECT(BindingMappingInfo);

    CTOR_FROM_CCOBJECT(BindingMappingInfo);

private:
    cc::gfx::BindingMappingInfo obj;
};

class DeviceInfo {
public:
    DeviceInfo() = default;
    DeviceInfo(const BindingMappingInfo& info)
    : obj({static_cast<cc::gfx::BindingMappingInfo>(info)}) {}

    inline void setBindingInfo(const BindingMappingInfo& info) {
        obj.bindingMappingInfo = static_cast<cc::gfx::BindingMappingInfo>(info);
    }
    inline BindingMappingInfo getBindingInfo() const {
        return BindingMappingInfo{obj.bindingMappingInfo};
    }

    CC_OBJECT(DeviceInfo);

private:
    cc::gfx::DeviceInfo obj;
};

class Uniform {
public:
    Uniform() = default;
    Uniform(String name)
    : obj({name}) {}
    Uniform(String name, Type::type type)
    : obj({name, gfx::Type(type)}) {}
    Uniform(String name, Type::type type, uint32_t count)
    : obj({name, gfx::Type(type), count}) {}

    inline void setName(String name) { obj.name = name; }
    inline void setType(Type::type type) { obj.type = gfx::Type(type); }
    inline void setCount(uint32_t count) { obj.count = count; }

    inline String getName() const { return obj.name; }
    inline Type::type getType() const { return static_cast<Type::type>(obj.type); }
    inline uint32_t getCount() const { return obj.count; }

    CC_OBJECT(Uniform)

private:
    gfx::Uniform obj;
};

class UniformBlock {
public:
    UniformBlock() = default;
    UniformBlock(uint32_t set)
    : obj({set}) {}
    UniformBlock(uint32_t set, uint32_t binding)
    : obj({set, binding}) {}
    UniformBlock(uint32_t set, uint32_t binding, const std::string& name)
    : obj({set, binding, name}) {}
    UniformBlock(uint32_t set, uint32_t binding, const std::string& name, val vals)
    : obj({set, binding, name, vecFromEMS<gfx::Uniform, Uniform>(vals)}) {}
    UniformBlock(uint32_t set, uint32_t binding, const std::string& name, val vals, uint32_t count)
    : obj({set, binding, name, vecFromEMS<gfx::Uniform, Uniform>(vals), count}) {}

    inline void setSet(uint32_t set) { obj.set = set; }
    inline void setBinding(uint32_t binding) { obj.binding = binding; }
    inline void setName(const std::string& name) { obj.name = name; }
    inline void setUniforms(val vals) {
        obj.members = vecFromEMS<gfx::Uniform, Uniform>(vals);
        printf("member set\n");
        for (const auto& member : obj.members) {
            printf("member %d\n", member.count);
        }
    }
    inline void setCount(uint32_t count) { obj.count = count; }

    inline uint32_t getSet() const { return obj.set; }
    inline uint32_t getBinding() const { return obj.binding; }
    inline String getName() const { return obj.name; }
    inline val getUniforms() const {
        printf("member get\n");
        for (const auto& member : obj.members) {
            printf("member %d\n", member.count);
        }
        return vecToEMS(obj.members);
    }
    inline uint32_t getCount() const { return obj.count; }

    CTOR_FROM_CCOBJECT(UniformBlock);
    CC_OBJECT(UniformBlock);

private:
    gfx::UniformBlock obj;
};

class TextureInfo {
public:
    TextureInfo() = default;
    TextureInfo(TextureType::type type)
    : info({gfx::TextureType(type)}) {}
    TextureInfo(TextureType::type type, TextureUsageBit::type usage)
    : info({gfx::TextureType(type), gfx::TextureUsageBit(usage)}) {}
    TextureInfo(TextureType::type type, TextureUsageBit::type usage, Format::type format)
    : info({gfx::TextureType(type), gfx::TextureUsageBit(usage), gfx::Format(format)}) {}
    TextureInfo(TextureType::type type, TextureUsageBit::type usage, Format::type format, uint32_t width, uint32_t height)
    : info({gfx::TextureType(type), gfx::TextureUsageBit(usage), gfx::Format(format), width, height}) {}
    TextureInfo(TextureType::type type, TextureUsageBit::type usage, Format::type format, uint32_t width, uint32_t height, TextureFlagBit::type flag)
    : info({gfx::TextureType(type), gfx::TextureUsageBit(usage), gfx::Format(format), width, height, gfx::TextureFlags(flag)}) {}
    TextureInfo(TextureType::type type, TextureUsageBit::type usage, Format::type format, uint32_t width, uint32_t height, TextureFlagBit::type flag,
                uint32_t layerCount)
    : info({gfx::TextureType(type), gfx::TextureUsageBit(usage), gfx::Format(format), width, height, gfx::TextureFlags(flag), layerCount}) {}
    TextureInfo(TextureType::type type, TextureUsageBit::type usage, Format::type format, uint32_t width, uint32_t height, TextureFlagBit::type flag,
                uint32_t layerCount, uint32_t levelCount)
    : info({gfx::TextureType(type), gfx::TextureUsageBit(usage), gfx::Format(format), width, height, gfx::TextureFlags(flag), layerCount, levelCount}) {}
    TextureInfo(TextureType::type type, TextureUsageBit::type usage, Format::type format, uint32_t width, uint32_t height, TextureFlagBit::type flag,
                uint32_t layerCount, uint32_t levelCount, SampleCount::type sampleCount)
    : info({gfx::TextureType(type), gfx::TextureUsageBit(usage), gfx::Format(format), width, height, gfx::TextureFlags(flag), layerCount, levelCount, gfx::SampleCount(sampleCount)}) {}
    TextureInfo(TextureType::type type, TextureUsageBit::type usage, Format::type format, uint32_t width, uint32_t height, TextureFlagBit::type flag,
                uint32_t layerCount, uint32_t levelCount, SampleCount::type sampleCount, uint32_t depth)
    : info({gfx::TextureType(type), gfx::TextureUsageBit(usage), gfx::Format(format), width, height, gfx::TextureFlags(flag), layerCount, levelCount, gfx::SampleCount(sampleCount), depth}) {}
    TextureInfo(TextureType::type type, TextureUsageBit::type usage, Format::type format, uint32_t width, uint32_t height, TextureFlagBit::type flag,
                uint32_t layerCount, uint32_t levelCount, SampleCount::type sampleCount, uint32_t depth, uint32_t externalRes)
    : info({gfx::TextureType(type), gfx::TextureUsageBit(usage), gfx::Format(format), width, height, gfx::TextureFlags(flag), layerCount, levelCount, gfx::SampleCount(sampleCount), depth, reinterpret_cast<void*>(externalRes)}) {}

    inline void setType(TextureType::type type) { info.type = gfx::TextureType(type); }
    inline void setUsage(TextureUsageBit::type usageIn) { info.usage = gfx::TextureUsageBit(usageIn); }
    inline void setFormat(Format::type format) { info.format = gfx::Format(format); }
    inline void setWidth(uint32_t width) { info.width = width; }
    inline void setHeight(uint32_t height) { info.height = height; }
    inline void setFlags(TextureFlagBit::type flagsIn) { info.flags = gfx::TextureFlagBit(flagsIn); }
    inline void setLevelCount(uint32_t levelCount) { info.levelCount = levelCount; }
    inline void setLayerCount(uint32_t layerCount) { info.layerCount = layerCount; }
    inline void setSamples(SampleCount::type sample) { info.samples = gfx::SampleCount(sample); }
    inline void setDepth(uint32_t depth) { info.depth = depth; }
    inline void setImageBuffer(intptr_t imgBuff) { info.externalRes = reinterpret_cast<void*>(imgBuff); }

    inline TextureType::type getType() const { return static_cast<TextureType::type>(info.type); }
    inline TextureUsageBit::type getUsage() const { return static_cast<TextureUsageBit::type>(info.usage); }
    inline Format::type getFormat() const { return static_cast<Format::type>(info.format); }
    inline uint32_t getWidth() const { return info.width; }
    inline uint32_t getHeight() const { return info.height; }
    inline TextureFlagBit::type getFlags() const { return static_cast<TextureFlagBit::type>(info.flags); }
    inline uint32_t getLevelCount() const { return info.levelCount; }
    inline uint32_t getLayerCount() const { return info.layerCount; }
    inline SampleCount::type getSamples() const { return static_cast<SampleCount::type>(info.samples); }
    inline uint32_t getDepth() const { return info.depth; }
    inline uint32_t getImageBuffer() const { return reinterpret_cast<uint32_t>(info.externalRes); }

    explicit operator const cc::gfx::TextureInfo() const { return info; }

private:
    cc::gfx::TextureInfo info;
};
// emscripten export struct with pointers.

class TextureViewInfo {
public:
    TextureViewInfo() = default;

    inline void setTexture(Texture* tex) { info.texture = tex; }
    inline void setType(TextureType::type type) { info.type = gfx::TextureType(type); }
    inline void setFormat(Format::type format) { info.format = gfx::Format(format); }
    inline void setBaseLevel(uint baseLevel) { info.baseLevel = baseLevel; }
    inline void setLevelCount(uint levelCount) { info.levelCount = levelCount; }
    inline void setBaseLayer(uint baseLayer) { info.baseLayer = baseLayer; }
    inline void setLayerCount(uint layerCount) { info.layerCount = layerCount; }

    inline Texture* getTexture() const { return info.texture; }
    inline TextureType::type getType() const { return static_cast<TextureType::type>(info.type); }
    inline Format::type getFormat() const { return static_cast<Format::type>(info.format); }
    inline uint getBaseLevel() const { return info.baseLevel; }
    inline uint getLevelCount() const { return info.levelCount; }
    inline uint getBaseLayer() const { return info.baseLayer; }
    inline uint getLayerCount() const { return info.layerCount; }

    explicit operator const cc::gfx::TextureViewInfo() const { return info; }

private:
    cc::gfx::TextureViewInfo info;
};

class SwapchainInfo {
public:
    SwapchainInfo() = default;
    SwapchainInfo(const val& hwnd)
    : info({nullptr}) {}
    SwapchainInfo(const val& hwnd, VsyncMode::type mode)
    : info({nullptr, gfx::VsyncMode(mode)}) {}
    SwapchainInfo(const val& hwnd, VsyncMode::type mode, uint32_t width)
    : info({nullptr, gfx::VsyncMode(mode), width}) {}
    SwapchainInfo(const val& hwnd, VsyncMode::type mode, uint32_t width, uint32_t height)
    : info({nullptr, gfx::VsyncMode(mode), width, height}) {}

    inline void setWindowHandle(uintptr_t hwnd) { info.windowHandle = nullptr; }
    inline void setVsyncMode(VsyncMode::type mode) { info.vsyncMode = gfx::VsyncMode(mode); }
    inline void setWidth(uint32_t width) { info.width = width; }
    inline void setHeight(uint32_t height) { info.height = height; }

    inline uintptr_t getWindowHandle() { reinterpret_cast<uintptr_t>(info.windowHandle); }
    inline VsyncMode::type getVsyncMode() { return static_cast<VsyncMode::type>(info.vsyncMode); }
    inline uint32_t getWidth() { return info.width; }
    inline uint32_t getHeight() { return info.height; }

    explicit operator const cc::gfx::SwapchainInfo() const { return info; }

private:
    cc::gfx::SwapchainInfo info;
};

class FramebufferInfo {
public:
    FramebufferInfo() = default;
    FramebufferInfo(RenderPass* renderPass)
    : info({renderPass}) {}
    FramebufferInfo(RenderPass* renderPass, val colors)
    : info({renderPass, vecFromEMS<Texture*>(colors)}) {}
    FramebufferInfo(RenderPass* renderPass, val colors, Texture* ds)
    : info({renderPass, vecFromEMS<Texture*>(colors), ds}) {}

    inline void setRenderPass(RenderPass* renderPass) { info.renderPass = renderPass; }
    inline void setColorTextures(TextureList colors) { info.colorTextures = colors; }
    inline void setDepthStencilTexture(Texture* tex) { info.depthStencilTexture = tex; }

    inline RenderPass* getRenderPass() const { return info.renderPass; }
    inline TextureList getColorTextures() const { return info.colorTextures; }
    inline Texture* getDepthStencilTexture() const { return info.depthStencilTexture; }

    explicit operator const cc::gfx::FramebufferInfo() const { return info; }

private:
    cc::gfx::FramebufferInfo info;
};

class ColorAttachment {
public:
    ColorAttachment() = default;
    ColorAttachment(Format::type format)
    : obj({gfx::Format(format)}) {}
    ColorAttachment(Format::type format, SampleCount::type count)
    : obj({gfx::Format(format), gfx::SampleCount(count)}) {}
    ColorAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOp)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOp)}) {}
    ColorAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOp, StoreOp::type storeOp)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOp), gfx::StoreOp(storeOp)}) {}
    ColorAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOp, StoreOp::type storeOp, val barrier)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOp), gfx::StoreOp(storeOp), nullptr}) {}
    ColorAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOp, StoreOp::type storeOp, val barrier, bool generalLayout)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOp), gfx::StoreOp(storeOp), nullptr, generalLayout}) {}
    ColorAttachment(const cc::gfx::ColorAttachment& color) : obj(color) {}

    inline void setFormat(Format::type format) { obj.format = gfx::Format(format); }
    inline Format::type getFormat() const { return static_cast<Format::type>(obj.format); }
    inline void setSampleCount(SampleCount::type count) { obj.sampleCount = gfx::SampleCount(count); }
    inline SampleCount::type getSampleCount() const { return static_cast<SampleCount::type>(obj.sampleCount); }
    inline void setLoadOp(LoadOp::type loadOp) { obj.loadOp = gfx::LoadOp(loadOp); }
    inline LoadOp::type getLoadOp() const { return static_cast<LoadOp::type>(obj.loadOp); }
    inline void setStoreOp(StoreOp::type storeOp) { obj.storeOp = gfx::StoreOp(storeOp); }
    inline StoreOp::type getStoreOp() const { return static_cast<StoreOp::type>(obj.storeOp); }

    inline void setBarrier(val barrier) { obj.barrier = nullptr; }
    inline val getBarrier() const { return val::null(); }

    inline void setGeneralLayout(bool gen) { obj.isGeneralLayout = gen; }
    inline bool getGeneralLayout() const { return obj.isGeneralLayout; }

    CC_OBJECT(ColorAttachment);

private:
    cc::gfx::ColorAttachment obj;
};

class DepthStencilAttachment {
public:
    DepthStencilAttachment() = default;
    DepthStencilAttachment(Format::type format)
    : obj({gfx::Format(format)}) {}
    DepthStencilAttachment(Format::type format, SampleCount::type count)
    : obj({gfx::Format(format), gfx::SampleCount(count)}) {}
    DepthStencilAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOpD)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOpD)}) {}
    DepthStencilAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOpD, StoreOp::type storeOpD)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOpD), gfx::StoreOp(storeOpD)}) {}
    DepthStencilAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOpD, StoreOp::type storeOpD, LoadOp::type loadOpS)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOpD), gfx::StoreOp(storeOpD), gfx::LoadOp(loadOpS)}) {}
    DepthStencilAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOpD, StoreOp::type storeOpD, LoadOp::type loadOpS, StoreOp::type storeOpS)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOpD), gfx::StoreOp(storeOpD), gfx::LoadOp(loadOpS), gfx::StoreOp(storeOpS)}) {}
    DepthStencilAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOpD, StoreOp::type storeOpD, LoadOp::type loadOpS, StoreOp::type storeOpS, val barrier)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOpD), gfx::StoreOp(storeOpD), gfx::LoadOp(loadOpS), gfx::StoreOp(storeOpS), nullptr}) {}
    DepthStencilAttachment(Format::type format, SampleCount::type count, LoadOp::type loadOpD, StoreOp::type storeOpD, LoadOp::type loadOpS, StoreOp::type storeOpS, val barrier, bool gen)
    : obj({gfx::Format(format), gfx::SampleCount(count), gfx::LoadOp(loadOpD), gfx::StoreOp(storeOpD), gfx::LoadOp(loadOpS), gfx::StoreOp(storeOpS), nullptr, gen}) {}
    DepthStencilAttachment(const cc::gfx::DepthStencilAttachment& ds) : obj(ds) {}

    inline void setFormat(Format::type format) { obj.format = gfx::Format(format); }
    inline Format::type getFormat() const { return static_cast<Format::type>(obj.format); }
    inline void setSampleCount(SampleCount::type count) { obj.sampleCount = gfx::SampleCount(count); }
    inline SampleCount::type getSampleCount() const { return static_cast<SampleCount::type>(obj.sampleCount); }
    inline void setDepthLoadOp(LoadOp::type loadOp) { obj.depthLoadOp = gfx::LoadOp(loadOp); }
    inline LoadOp::type getDepthLoadOp() const { return static_cast<LoadOp::type>(obj.depthLoadOp); }
    inline void setDepthStoreOp(StoreOp::type storeOp) { obj.depthStoreOp = gfx::StoreOp(storeOp); }
    inline StoreOp::type getDepthStoreOp() const { return static_cast<StoreOp::type>(obj.depthStoreOp); }
    inline void setStencilLoadOp(LoadOp::type loadOp) { obj.stencilLoadOp = gfx::LoadOp(loadOp); }
    inline LoadOp::type getStencilLoadOp() const { return static_cast<LoadOp::type>(obj.stencilLoadOp); }
    inline void setStencilStoreOp(StoreOp::type storeOp) { obj.stencilStoreOp = gfx::StoreOp(storeOp); }
    inline StoreOp::type getStencilStoreOp() const { return static_cast<StoreOp::type>(obj.stencilStoreOp); }
    inline void setBarrier(val barrier) { obj.barrier = nullptr; }
    inline val getBarrier() const { return val::null(); }
    inline void setGeneralLayout(bool gen) { obj.isGeneralLayout = gen; }
    inline bool getGeneralLayout() const { return obj.isGeneralLayout; }

    CC_OBJECT(DepthStencilAttachment);

private:
    cc::gfx::DepthStencilAttachment obj;
};

class SubpassInfo {
public:
    SubpassInfo() = default;
    SubpassInfo(val inputs)
    : obj({vecFromEMS<uint32_t>(inputs)}) {}
    SubpassInfo(val inputs, val outputs)
    : obj({vecFromEMS<uint32_t>(inputs), vecFromEMS<uint32_t>(outputs)}) {}
    SubpassInfo(val inputs, val outputs, val resolves)
    : obj({vecFromEMS<uint32_t>(inputs), vecFromEMS<uint32_t>(outputs), vecFromEMS<uint32_t>(resolves)}) {}
    SubpassInfo(val inputs, val outputs, val resolves, val preserves)
    : obj({vecFromEMS<uint32_t>(inputs), vecFromEMS<uint32_t>(outputs), vecFromEMS<uint32_t>(resolves), vecFromEMS<uint32_t>(preserves)}) {}
    SubpassInfo(val inputs, val outputs, val resolves, val preserves, uint32_t ds)
    : obj({vecFromEMS<uint32_t>(inputs), vecFromEMS<uint32_t>(outputs), vecFromEMS<uint32_t>(resolves), vecFromEMS<uint32_t>(preserves), ds}) {}
    SubpassInfo(val inputs, val outputs, val resolves, val preserves, uint32_t ds, uint32_t dsr)
    : obj({vecFromEMS<uint32_t>(inputs), vecFromEMS<uint32_t>(outputs), vecFromEMS<uint32_t>(resolves), vecFromEMS<uint32_t>(preserves), ds, dsr}) {}
    SubpassInfo(val inputs, val outputs, val resolves, val preserves, uint32_t ds, uint32_t dsr, ResolveMode::type drm)
    : obj({vecFromEMS<uint32_t>(inputs), vecFromEMS<uint32_t>(outputs), vecFromEMS<uint32_t>(resolves), vecFromEMS<uint32_t>(preserves), ds, dsr, gfx::ResolveMode(drm)}) {}
    SubpassInfo(val inputs, val outputs, val resolves, val preserves, uint32_t ds, uint32_t dsr, ResolveMode::type drm, ResolveMode::type srm)
    : obj({vecFromEMS<uint32_t>(inputs), vecFromEMS<uint32_t>(outputs), vecFromEMS<uint32_t>(resolves), vecFromEMS<uint32_t>(preserves), ds, dsr, gfx::ResolveMode(drm), gfx::ResolveMode(srm)}) {}
    SubpassInfo(const cc::gfx::SubpassInfo& info) : obj(info) {}

    inline void setInputs(val inputs) {
        obj.inputs = std::move(vecFromEMS<uint32_t>(inputs));
    }
    inline val getInputs() const {
        return vecToEMS(obj.inputs);
    }
    inline void setColors(val colors) {
        obj.colors = std::move(vecFromEMS<uint32_t>(colors));
    }
    inline val getColors() const {
        return vecToEMS(obj.colors);
    }
    inline void setResolves(val resolves) {
        obj.resolves = std::move(vecFromEMS<uint32_t>(resolves));
    }
    inline val getResolves() const {
        return vecToEMS(obj.resolves);
    }
    inline void setPreserves(val preserves) {
        obj.preserves = std::move(vecFromEMS<uint32_t>(preserves));
    }
    inline val getPreserves() const {
        return vecToEMS(obj.preserves);
    }
    inline void setDepthStencil(uint32_t ds) {
        obj.depthStencil = ds;
    }
    inline uint32_t getDepthStencil() const {
        return obj.depthStencil;
    }
    inline void setDSResolve(uint32_t dsr) {
        obj.depthStencilResolve = dsr;
    }
    inline uint32_t getDSResolve() const {
        return obj.depthStencilResolve;
    }
    inline void setDRMode(ResolveMode::type mode) {
        obj.depthResolveMode = gfx::ResolveMode(mode);
    }
    inline ResolveMode::type getDRMode() const {
        return static_cast<ResolveMode::type>(obj.depthResolveMode);
    }
    inline void setSRMode(ResolveMode::type mode) {
        obj.stencilResolveMode = gfx::ResolveMode(mode);
    }
    inline ResolveMode::type getSRMode() const {
        return static_cast<ResolveMode::type>(obj.stencilResolveMode);
    }

    CC_OBJECT(SubpassInfo);

private:
    cc::gfx::SubpassInfo obj;
};

class SubpassDependency {
public:
    SubpassDependency() = default;
    SubpassDependency(uint32_t src)
    : obj({src}) {}
    SubpassDependency(uint32_t src, uint32_t dst)
    : obj({src, dst}) {}
    SubpassDependency(uint32_t src, uint32_t dst, val barrier)
    : obj({src, dst, nullptr}) {}
    SubpassDependency(const cc::gfx::SubpassDependency& dp) : obj(dp) {}

    inline void setSrcSubpass(uint32_t src) { obj.srcSubpass = src; }
    inline uint32_t getSrcSubpass() const { return obj.srcSubpass; }
    inline void setDstSubpass(uint32_t dst) { obj.dstSubpass = dst; }
    inline uint32_t getDstSubpass() const { return obj.dstSubpass; }
    inline void setBarrier(val barrier) { obj.barrier = nullptr; }
    inline val getBarrier() const { return val::null(); }

    CC_OBJECT(SubpassDependency);

private:
    cc::gfx::SubpassDependency obj;
};

class RenderPassInfo {
public:
    RenderPassInfo() = default;
    RenderPassInfo(val colors)
    : obj({vecFromEMS<cc::gfx::ColorAttachment, ColorAttachment>(colors)}) {}
    RenderPassInfo(val colors, const DepthStencilAttachment& ds)
    : obj({vecFromEMS<cc::gfx::ColorAttachment, ColorAttachment>(colors), static_cast<cc::gfx::DepthStencilAttachment>(ds)}) {}
    RenderPassInfo(val colors, const DepthStencilAttachment& ds, val subpasses)
    : obj({vecFromEMS<cc::gfx::ColorAttachment, ColorAttachment>(colors), static_cast<cc::gfx::DepthStencilAttachment>(ds), vecFromEMS<cc::gfx::SubpassInfo, SubpassInfo>(subpasses)}) {}
    RenderPassInfo(val colors, const DepthStencilAttachment& ds, val subpasses, val deps)
    : obj({vecFromEMS<cc::gfx::ColorAttachment, ColorAttachment>(colors), static_cast<cc::gfx::DepthStencilAttachment>(ds), vecFromEMS<cc::gfx::SubpassInfo, SubpassInfo>(subpasses), vecFromEMS<cc::gfx::SubpassDependency, SubpassDependency>(deps)}) {}

    inline void setColors(val vals) {
        obj.colorAttachments = std::move(vecFromEMS<cc::gfx::ColorAttachment, ColorAttachment>(vals));
    }
    inline val getColors() const {
        return vecToEMS<cc::gfx::ColorAttachment, ColorAttachment>({obj.colorAttachments});
    }
    inline void setDepthStencil(const DepthStencilAttachment& ds) { obj.depthStencilAttachment = static_cast<cc::gfx::DepthStencilAttachment>(ds); }
    inline DepthStencilAttachment getDepthStencil() const { return {obj.depthStencilAttachment}; }
    inline void setSubpasses(val vals) {
        obj.subpasses = std::move(vecFromEMS<cc::gfx::SubpassInfo, SubpassInfo>(vals));
    }
    inline val getSubpasses() const {
        return vecToEMS<cc::gfx::SubpassInfo, SubpassInfo>(obj.subpasses);
    }
    inline void setDependencies(val vals) {
        obj.dependencies = std::move(vecFromEMS<cc::gfx::SubpassDependency, SubpassDependency>(vals));
    }
    inline val getDependencies() const {
        return vecToEMS<cc::gfx::SubpassDependency, SubpassDependency>(obj.dependencies);
    }

    CC_OBJECT(RenderPassInfo);

private:
    cc::gfx::RenderPassInfo obj;
};

class BufferViewInfo {
public:
    BufferViewInfo() = default;
    BufferViewInfo(Buffer* buffer) : obj({buffer, 0, 0}) {}
    BufferViewInfo(Buffer* buffer, uint32_t offset) : obj({buffer, offset, 0}) {}
    BufferViewInfo(Buffer* buffer, uint32_t offset, uint32_t range) : obj({buffer, offset, range}) {}

    inline void setBuffer(Buffer* buffer) { obj.buffer = buffer; }
    inline void setOffset(uint32_t offset) { obj.offset = offset; }
    inline void setRange(uint32_t range) { obj.range = range; }

    inline Buffer* getBuffer() const { return obj.buffer; }
    inline uint32_t getOffset() const { return obj.offset; }
    inline uint32_t getRange() const { return obj.range; }

    CTOR_FROM_CCOBJECT(BufferViewInfo);

    CC_OBJECT(BufferViewInfo);

private:
    cc::gfx::BufferViewInfo obj;
};

class DescriptorSetInfo {
public:
    DescriptorSetInfo() = default;
    DescriptorSetInfo(DescriptorSetLayout* layout) : info({layout}) {}

    inline void setDescriptorSetLayout(DescriptorSetLayout* layout) { info.layout = layout; }

    inline DescriptorSetLayout* getDescriptorSetLayout() const { return info.layout; }

    explicit operator const cc::gfx::DescriptorSetInfo() const { return info; }

private:
    cc::gfx::DescriptorSetInfo info;
};

class PipelineLayoutInfo {
public:
    PipelineLayoutInfo() = default;
    PipelineLayoutInfo(val layouts) : obj({vecFromEMS<DescriptorSetLayout*>(layouts)}) {}

    inline void setSetLayouts(val layouts) { obj.setLayouts = std::move(vecFromEMS<DescriptorSetLayout*>(layouts)); }

    inline val getSetLayouts() const { return vecToEMS<DescriptorSetLayout*>(obj.setLayouts); }

    CTOR_FROM_CCOBJECT(PipelineLayoutInfo);
    CC_OBJECT(PipelineLayoutInfo)
private:
    cc::gfx::PipelineLayoutInfo obj;
};

class BlendTarget {
public:
    BlendTarget() = default;
    BlendTarget(uint32_t blend)
    : obj({blend}) {}
    BlendTarget(uint32_t blend, BlendFactor::type blendSrc)
    : obj({blend, gfx::BlendFactor(blendSrc)}) {}
    BlendTarget(uint32_t blend, BlendFactor::type blendSrc, BlendFactor::type blendDst)
    : obj({blend, gfx::BlendFactor(blendSrc), gfx::BlendFactor(blendDst)}) {}
    BlendTarget(uint32_t blend, BlendFactor::type blendSrc, BlendFactor::type blendDst, BlendOp::type blendEq)
    : obj({blend, gfx::BlendFactor(blendSrc), gfx::BlendFactor(blendDst), gfx::BlendOp(blendEq)}) {}
    BlendTarget(uint32_t blend, BlendFactor::type blendSrc, BlendFactor::type blendDst, BlendOp::type blendEq, BlendFactor::type blendSrcAlpha)
    : obj({blend, gfx::BlendFactor(blendSrc), gfx::BlendFactor(blendDst), gfx::BlendOp(blendEq), gfx::BlendFactor(blendSrcAlpha)}) {}
    BlendTarget(uint32_t blend, BlendFactor::type blendSrc, BlendFactor::type blendDst, BlendOp::type blendEq, BlendFactor::type blendSrcAlpha, BlendFactor::type blendDstAlpha)
    : obj({blend, gfx::BlendFactor(blendSrc), gfx::BlendFactor(blendDst), gfx::BlendOp(blendEq), gfx::BlendFactor(blendSrcAlpha), gfx::BlendFactor(blendDstAlpha)}) {}
    BlendTarget(uint32_t blend, BlendFactor::type blendSrc, BlendFactor::type blendDst, BlendOp::type blendEq, BlendFactor::type blendSrcAlpha, BlendFactor::type blendDstAlpha, BlendOp::type blendAlphaEq)
    : obj({blend, gfx::BlendFactor(blendSrc), gfx::BlendFactor(blendDst), gfx::BlendOp(blendEq), gfx::BlendFactor(blendSrcAlpha), gfx::BlendFactor(blendDstAlpha), gfx::BlendOp(blendAlphaEq)}) {}
    BlendTarget(uint32_t blend, BlendFactor::type blendSrc, BlendFactor::type blendDst, BlendOp::type blendEq, BlendFactor::type blendSrcAlpha, BlendFactor::type blendDstAlpha, BlendOp::type blendAlphaEq, ColorMask::type blendColorMask)
    : obj({blend, gfx::BlendFactor(blendSrc), gfx::BlendFactor(blendDst), gfx::BlendOp(blendEq), gfx::BlendFactor(blendSrcAlpha), gfx::BlendFactor(blendDstAlpha), gfx::BlendOp(blendAlphaEq), gfx::ColorMask(blendColorMask)}) {}

    inline void setBlend(uint32_t blend) { obj.blend = blend; }
    inline void setBlendSrc(BlendFactor::type blendSrc) { obj.blendSrc = gfx::BlendFactor(blendSrc); }
    inline void setBlendDst(BlendFactor::type blendDst) { obj.blendDst = gfx::BlendFactor(blendDst); }
    inline void setBlendEq(BlendOp::type blendEq) { obj.blendEq = gfx::BlendOp(blendEq); }
    inline void setBlendSrcAlpha(BlendFactor::type blendSrcAlpha) { obj.blendSrcAlpha = gfx::BlendFactor(blendSrcAlpha); }
    inline void setBlendDstAlpha(BlendFactor::type blendDstAlpha) { obj.blendDstAlpha = gfx::BlendFactor(blendDstAlpha); }
    inline void setBlendAlphaEq(BlendOp::type blendAlphaEq) { obj.blendAlphaEq = gfx::BlendOp(blendAlphaEq); }
    inline void setBlendColorMask(ColorMask::type blendColorMask) { obj.blendColorMask = gfx::ColorMask(blendColorMask); }

    inline uint32_t getBlend() const { return obj.blend; }
    inline BlendFactor::type getBlendSrc() const { return BlendFactor::type(obj.blendSrc); }
    inline BlendFactor::type getBlendDst() const { return BlendFactor::type(obj.blendDst); }
    inline BlendOp::type getBlendEq() const { return BlendOp::type(obj.blendEq); }
    inline BlendFactor::type getBlendSrcAlpha() const { return BlendFactor::type(obj.blendSrcAlpha); }
    inline BlendFactor::type getBlendDstAlpha() const { return BlendFactor::type(obj.blendDstAlpha); }
    inline BlendOp::type getBlendAlphaEq() const { return BlendOp::type(obj.blendAlphaEq); }
    inline ColorMask::type getBlendColorMask() const { return ColorMask::type(obj.blendColorMask); }

    CC_OBJECT(BlendTarget)

private:
    gfx::BlendTarget obj;
};

class BlendState {
public:
    BlendState() = default;
    BlendState(uint32_t isA2C)
    : obj({isA2C}) {}
    BlendState(uint32_t isA2C, uint32_t isIndepend)
    : obj({isA2C, isIndepend}) {}
    BlendState(uint32_t isA2C, uint32_t isIndepend, Color blendColor)
    : obj({isA2C, isIndepend, gfx::Color(blendColor)}) {}
    BlendState(uint32_t isA2C, uint32_t isIndepend, Color blendColor, val targets)
    : obj({isA2C, isIndepend, gfx::Color(blendColor), vecFromEMS<gfx::BlendTarget, BlendTarget>(targets)}) {}

    inline void setIsA2C(uint32_t isA2C) { obj.isA2C = isA2C; }
    inline void setIsIndepend(uint32_t isIndepend) { obj.isIndepend = isIndepend; }
    inline void setBlendColor(Color blendColor) { obj.blendColor = blendColor; }
    inline void setTargets(val targets) { obj.targets = std::move(vecFromEMS<gfx::BlendTarget, BlendTarget>(targets)); }

    inline uint32_t getIsA2C() const { return obj.isA2C; }
    inline uint32_t getIsIndepend() const { return obj.isIndepend; }
    inline Color getBlendColor() const { return obj.blendColor; }
    inline const val getTargets() const { return vecToEMS(obj.targets); }

    inline void setTarget(uint32_t index, BlendTarget target) { obj.targets[index] = gfx::BlendTarget(target); }
    inline void reset() {
        obj.isA2C = 0;
        obj.isIndepend = 0;
        obj.blendColor = gfx::Color();
        obj.targets.clear();
    }

    CTOR_FROM_CCOBJECT(BlendState);
    CC_OBJECT(BlendState);

private:
    gfx::BlendState obj;
};

class QueueInfo {
public:
    QueueInfo() = default;
    QueueInfo(QueueType::type type)
    : obj({gfx::QueueType(type)}) {}

    inline void setType(QueueType::type type) { obj.type = gfx::QueueType(type); }

    inline QueueType::type getType() const { return QueueType::type(obj.type); }

    CC_OBJECT(QueueInfo)

private:
    gfx::QueueInfo obj;
};

class PipelineStateInfo {
public:
    inline void setShader(Shader* shader) { info.shader = shader; }
    inline void setPipelineLayout(PipelineLayout* pipelineLayout) { info.pipelineLayout = pipelineLayout; }
    inline void setRenderPass(RenderPass* renderPass) { info.renderPass = renderPass; }
    inline void setInputState(InputState inputState) { info.inputState = inputState; }
    inline void setRasterizerState(RasterizerState rasterizerState) { info.rasterizerState = rasterizerState; }
    inline void setDepthStencilState(DepthStencilState depthStencilState) { info.depthStencilState = depthStencilState; }
    inline void setBlendState(BlendState blendState) { info.blendState = gfx::BlendState(blendState); }
    inline void setPrimitiveMode(PrimitiveMode::type primitive) { info.primitive = gfx::PrimitiveMode(primitive); }
    inline void setDynamicStateFlags(DynamicStateFlagBit::type dynamicStates) { info.dynamicStates = gfx::DynamicStateFlagBit(dynamicStates); }
    inline void setPipelineBindPoint(PipelineBindPoint::type bindPoint) { info.bindPoint = gfx::PipelineBindPoint(bindPoint); }
    inline void setSubpass(uint32_t subpass) { info.subpass = subpass; }

    inline Shader* getShader() const { return info.shader; }
    inline PipelineLayout* getPipelineLayout() const { return info.pipelineLayout; }
    inline RenderPass* getRenderPass() const { return info.renderPass; }
    inline InputState getInputState() const { return info.inputState; }
    inline RasterizerState getRasterizerState() const { return info.rasterizerState; }
    inline DepthStencilState getDepthStencilState() const { return info.depthStencilState; }
    inline BlendState getBlendState() const { return BlendState(info.blendState); }
    inline PrimitiveMode::type getPrimitiveMode() const { return static_cast<PrimitiveMode::type>(info.primitive); }
    inline DynamicStateFlagBit::type getDynamicStateFlags() const { return static_cast<DynamicStateFlagBit::type>(info.dynamicStates); }
    inline PipelineBindPoint::type getPipelineBindPoint() const { return static_cast<PipelineBindPoint::type>(info.bindPoint); }
    inline uint32_t getSubpass() const { return info.subpass; }

    explicit operator const cc::gfx::PipelineStateInfo() const { return info; }

private:
    cc::gfx::PipelineStateInfo info;
};

class Attribute {
public:
    Attribute() = default;
    Attribute(String name)
    : obj({name}) {}
    Attribute(String name, Format::type format)
    : obj({name, gfx::Format(format)}) {}
    Attribute(String name, Format::type format, bool isNormalized)
    : obj({name, gfx::Format(format), isNormalized}) {}
    Attribute(String name, Format::type format, bool isNormalized, uint32_t stream)
    : obj({name, gfx::Format(format), isNormalized, stream}) {}
    Attribute(String name, Format::type format, bool isNormalized, uint32_t stream, bool isInstanced)
    : obj({name, gfx::Format(format), isNormalized, stream, isInstanced}) {}
    Attribute(String name, Format::type format, bool isNormalized, uint32_t stream, bool isInstanced, uint32_t location)
    : obj({name, gfx::Format(format), isNormalized, stream, isInstanced, location}) {}

    inline void setName(String name) { obj.name = name; }
    inline void setFormat(Format::type format) { obj.format = gfx::Format(format); }
    inline void setNormalized(bool isNormalized) { obj.isNormalized = isNormalized; }
    inline void setStream(uint32_t stream) { obj.stream = stream; }
    inline void setInstanced(bool isInstanced) { obj.isInstanced = isInstanced; }
    inline void setLocation(uint32_t location) { obj.location = location; }

    inline String getName() const { return obj.name; }
    inline Format::type getFormat() const { return static_cast<Format::type>(obj.format); }
    inline bool getNormalized() const { return obj.isNormalized; }
    inline uint32_t getStream() const { return obj.stream; }
    inline bool getInstanced() const { return obj.isInstanced; }
    inline uint32_t getLocation() const { return obj.location; }

    CC_OBJECT(Attribute)

private:
    gfx::Attribute obj;
};

class InputAssemblerInfo {
public:
    InputAssemblerInfo() = default;
    InputAssemblerInfo(val attrs)
    : obj({vecFromEMS<gfx::Attribute, Attribute>(attrs)}) {}
    InputAssemblerInfo(val attrs, val buffers)
    : obj({vecFromEMS<gfx::Attribute, Attribute>(attrs), vecFromEMS<gfx::Buffer*, Buffer*>(buffers)}) {}
    InputAssemblerInfo(val attrs, val buffers, Buffer* indexBuffer)
    : obj({vecFromEMS<gfx::Attribute, Attribute>(attrs), vecFromEMS<gfx::Buffer*, Buffer*>(buffers), indexBuffer}) {}
    InputAssemblerInfo(val attrs, val buffers, Buffer* indexBuffer, Buffer* indirectBuffer)
    : obj({vecFromEMS<gfx::Attribute, Attribute>(attrs), vecFromEMS<gfx::Buffer*, Buffer*>(buffers), indexBuffer, indirectBuffer}) {}

    inline void setAttributes(val attrs) { obj.attributes = vecFromEMS<gfx::Attribute, Attribute>(attrs); }
    inline void setBuffers(val vals) { obj.vertexBuffers = std::move(vecFromEMS<gfx::Buffer*, Buffer*>(vals)); }
    inline void setIndexBuffer(Buffer* buffer) { obj.indexBuffer = buffer; }
    inline void setIndirectBuffer(Buffer* buffer) { obj.indirectBuffer = buffer; }

    inline val getAttributes() const { return vecToEMS(obj.attributes); }
    inline val getBuffers() const { return vecToEMS(obj.vertexBuffers); }
    inline Buffer* getIndexBuffer(Buffer* buffer) const { return obj.indexBuffer; }
    inline Buffer* getIndirectBuffer(Buffer* buffer) const { return obj.indirectBuffer; }

    CTOR_FROM_CCOBJECT(InputAssemblerInfo);
    CC_OBJECT(InputAssemblerInfo);

private:
    cc::gfx::InputAssemblerInfo obj;
};

class CommandBufferInfo {
public:
    CommandBufferInfo() = default;
    CommandBufferInfo(Queue* q) {
        info.queue = q;
    }
    CommandBufferInfo(Queue* q, CommandBufferType::type type) {
        info.queue = q;
        info.type = gfx::CommandBufferType(type);
    }

    inline void setQueue(Queue* q) { info.queue = q; }
    inline void setType(CommandBufferType::type type) { info.type = gfx::CommandBufferType(type); }

    inline Queue* getQueue() const { return info.queue; }
    inline CommandBufferType::type getType() const { return static_cast<CommandBufferType::type>(info.type); }

    explicit operator const cc::gfx::CommandBufferInfo() const { return info; }

private:
    cc::gfx::CommandBufferInfo info;
};

class DispatchInfo {
public:
    inline void setGroupCountX(uint32_t groupCountX) { info.groupCountX = groupCountX; }
    inline void setGroupCountY(uint32_t groupCountY) { info.groupCountY = groupCountY; }
    inline void setGroupCountZ(uint32_t groupCountZ) { info.groupCountZ = groupCountZ; }
    inline void setIndirectBuffer(Buffer* indirectBuffer) { info.indirectBuffer = indirectBuffer; }
    inline void setIndirectOffset(uint32_t offset) { info.indirectOffset = offset; }

    inline uint32_t getGroupCountX() const { return info.groupCountX; }
    inline uint32_t getGroupCountY() const { return info.groupCountY; }
    inline uint32_t getGroupCountZ() const { return info.groupCountZ; }
    inline Buffer* getIndirectBuffer() const { return info.indirectBuffer; }
    inline uint32_t getIndirectOffset() const { return info.indirectOffset; }

    explicit operator const cc::gfx::DispatchInfo() const { return info; }

private:
    cc::gfx::DispatchInfo info;
};

class SPVShaderStage {
public:
    gfx::ShaderStageFlagBit stage{gfx::ShaderStageFlagBit::NONE};
    std::vector<uint32_t> spv;

    inline void setStage(ShaderStageFlagBit::type stageIn) { stage = gfx::ShaderStageFlagBit(stageIn); }
    inline void setSPVData(const emscripten::val& v) { spv = emscripten::convertJSArrayToNumberVector<uint32_t>(v); }
};

class SPVShaderInfo {
public:
    inline void setName(String name) { info.name = name; }
    inline void setAttributes(AttributeList attrs) { info.attributes = attrs; }
    inline void setStages(std::vector<SPVShaderStage> spvStages) { stages = spvStages; }
    inline void setBlocks(UniformBlockList blocks) { info.blocks = blocks; }
    inline void setBuffers(UniformStorageBufferList buffers) { info.buffers = buffers; }
    inline void setSamplerTextures(UniformSamplerTextureList list) { info.samplerTextures = list; }
    inline void setTextures(UniformTextureList textures) { info.textures = textures; }
    inline void setSamplers(UniformSamplerList samplers) { info.samplers = samplers; }
    inline void setImages(UniformStorageImageList images) { info.images = images; }
    inline void setSubpasses(UniformInputAttachmentList subpassInputs) { info.subpassInputs = subpassInputs; }

    inline String getName() const { return info.name; }
    inline AttributeList getAttributes() const { return info.attributes; }
    inline uint32_t getStages() const { return 1; }
    inline UniformBlockList getBlocks() const { return info.blocks; }
    inline UniformStorageBufferList getBuffers() const { return info.buffers; }
    inline UniformSamplerTextureList getSamplerTextures() const { return info.samplerTextures; }
    inline UniformTextureList getTextures() const { return info.textures; }
    inline UniformSamplerList getSamplers() const { return info.samplers; }
    inline UniformStorageImageList getImages() const { return info.images; }
    inline UniformInputAttachmentList getSubpasses() const { return info.subpassInputs; }

    cc::gfx::ShaderInfo info;
    std::vector<SPVShaderStage> stages;
};

class DescriptorSetLayoutBinding {
public:
    DescriptorSetLayoutBinding() = default;
    DescriptorSetLayoutBinding(uint32_t binding)
    : obj({binding}) {}
    DescriptorSetLayoutBinding(uint32_t binding, DescriptorType::type type)
    : obj({binding, gfx::DescriptorType(type)}) {}
    DescriptorSetLayoutBinding(uint32_t binding, DescriptorType::type type, uint32_t count)
    : obj({binding, gfx::DescriptorType(type), count}) {}
    DescriptorSetLayoutBinding(uint32_t binding, DescriptorType::type type, uint32_t count, ShaderStageFlagBit::type flags)
    : obj({binding, gfx::DescriptorType(type), count, gfx::ShaderStageFlagBit(flags)}) {}
    DescriptorSetLayoutBinding(uint32_t binding, DescriptorType::type type, uint32_t count, ShaderStageFlagBit::type flags, val list)
    : obj({binding, gfx::DescriptorType(type), count, gfx::ShaderStageFlagBit(flags), vecFromEMS<Sampler*>(list)}) {}

    inline void setBinding(uint32_t binding) { obj.binding = binding; }
    inline void setDescriptorType(DescriptorType::type type) { obj.descriptorType = gfx::DescriptorType(type); }
    inline void setCount(uint32_t count) { obj.count = count; }
    inline void setStageFlags(ShaderStageFlagBit::type flags) { obj.stageFlags = gfx::ShaderStageFlagBit(flags); }
    inline void setSamplers(val list) { obj.immutableSamplers = std::move(vecFromEMS<Sampler*>(list)); }

    inline uint32_t getBinding() const { return obj.binding; }
    inline DescriptorType::type getDescriptorType() const { return static_cast<DescriptorType::type>(obj.descriptorType); }
    inline uint32_t getCount() const { return obj.count; }
    inline ShaderStageFlagBit::type getStageFlags() const { return static_cast<ShaderStageFlagBit::type>(obj.stageFlags); }
    inline val getSamplers() const { return vecToEMS(obj.immutableSamplers); }

    CTOR_FROM_CCOBJECT(DescriptorSetLayoutBinding);
    CC_OBJECT(DescriptorSetLayoutBinding)

private:
    gfx::DescriptorSetLayoutBinding obj;
};

class DescriptorSetLayoutInfo {
public:
    DescriptorSetLayoutInfo() = default;
    DescriptorSetLayoutInfo(val vals)
    : obj({std::move(vecFromEMS<gfx::DescriptorSetLayoutBinding, DescriptorSetLayoutBinding>(vals))}) {
    }
    inline void setBindings(val vals) {
        obj.bindings = std::move(vecFromEMS<gfx::DescriptorSetLayoutBinding, DescriptorSetLayoutBinding>(vals));
    }

    inline val getBindings() const {
        return vecToEMS<gfx::DescriptorSetLayoutBinding, DescriptorSetLayoutBinding>(obj.bindings);
    }

    CC_OBJECT(DescriptorSetLayoutInfo);

private:
    cc::gfx::DescriptorSetLayoutInfo obj;
};

class BufferInfo {
public:
    BufferInfo() = default;
    BufferInfo(BufferUsageBit::type usageIn)
    : obj({gfx::BufferUsageBit(usageIn)}) {}
    BufferInfo(BufferUsageBit::type usageIn, MemoryUsageBit::type memUsageIn)
    : obj({gfx::BufferUsageBit(usageIn), gfx::MemoryUsageBit(memUsageIn)}) {}
    BufferInfo(BufferUsageBit::type usageIn, MemoryUsageBit::type memUsageIn, uint32_t size)
    : obj({gfx::BufferUsageBit(usageIn), gfx::MemoryUsageBit(memUsageIn), size}) {}
    BufferInfo(BufferUsageBit::type usageIn, MemoryUsageBit::type memUsageIn, uint32_t size, uint32_t stride)
    : obj({gfx::BufferUsageBit(usageIn), gfx::MemoryUsageBit(memUsageIn), size, stride}) {}
    BufferInfo(BufferUsageBit::type usageIn, MemoryUsageBit::type memUsageIn, uint32_t size, uint32_t stride, BufferFlagBit::type flagsIn)
    : obj({gfx::BufferUsageBit(usageIn), gfx::MemoryUsageBit(memUsageIn), size, stride, gfx::BufferFlagBit(flagsIn)}) {}

    inline void setUsage(BufferUsageBit::type usageIn) { obj.usage = gfx::BufferUsageBit(usageIn); }
    inline void setMemUsage(MemoryUsageBit::type memUsageIn) { obj.memUsage = gfx::MemoryUsageBit(memUsageIn); }
    inline void setSize(uint32_t size) { obj.size = size; }
    inline void setStride(uint32_t stride) { obj.stride = stride; }
    inline void setFlags(BufferFlagBit::type flagsIn) { obj.flags = gfx::BufferFlagBit(flagsIn); }

    inline BufferUsageBit::type getUsage() const { return static_cast<BufferUsageBit::type>(obj.usage); }
    inline MemoryUsageBit::type getMemUsage() const { return static_cast<MemoryUsageBit::type>(obj.memUsage); }
    inline uint32_t getSize() const { return obj.size; }
    inline uint32_t getStride() const { return obj.stride; }
    inline BufferFlagBit::type getFlags() const { return static_cast<BufferFlagBit::type>(obj.flags); }

    CTOR_FROM_CCOBJECT(BufferInfo);

    CC_OBJECT(BufferInfo);

private:
    cc::gfx::BufferInfo obj;
};

class UniformStorageImage {
public:
    UniformStorageImage() = default;
    UniformStorageImage(uint32_t set)
    : obj({set}) {}
    UniformStorageImage(uint32_t set, uint32_t binding)
    : obj({set, binding}) {}
    UniformStorageImage(uint32_t set, uint32_t binding, String name)
    : obj({set, binding, name}) {}
    UniformStorageImage(uint32_t set, uint32_t binding, String name, Type::type type)
    : obj({set, binding, name, gfx::Type(type)}) {}
    UniformStorageImage(uint32_t set, uint32_t binding, String name, Type::type type, uint32_t count)
    : obj({set, binding, name, gfx::Type(type), count}) {}
    UniformStorageImage(uint32_t set, uint32_t binding, String name, Type::type type, uint32_t count, MemoryUsageBit::type memAccess)
    : obj({set, binding, name, gfx::Type(type), count, gfx::MemoryAccessBit(memAccess)}) {}

    inline void setSet(uint32_t set) { obj.set = set; }
    inline void setBinding(uint32_t binding) { obj.binding = binding; }
    inline void setName(String name) { obj.name = name; }
    inline void setType(Type::type type) { obj.type = gfx::Type(type); }
    inline void setCount(uint32_t count) { obj.count = count; }
    inline void setMemAccess(MemoryAccessBit::type memAccess) { obj.memoryAccess = gfx::MemoryAccessBit(memAccess); }

    inline uint32_t getSet() const { return obj.set; }
    inline uint32_t getBinding() const { return obj.binding; }
    inline String getName() const { return obj.name; }
    inline Type::type getType() const { return static_cast<Type::type>(obj.type); }
    inline uint32_t getCount() const { return obj.count; }
    inline MemoryAccessBit::type getMemAccess() const { return static_cast<MemoryAccessBit::type>(obj.memoryAccess); }

    CC_OBJECT(UniformStorageImage);

private:
    gfx::UniformStorageImage obj;
};

class ShaderStage {
public:
    ShaderStage() = default;
    ShaderStage(ShaderStageFlagBit::type flags)
    : obj({gfx::ShaderStageFlagBit(flags)}) {}
    ShaderStage(ShaderStageFlagBit::type flags, String source)
    : obj({gfx::ShaderStageFlagBit(flags), source}) {}

    inline void setStage(ShaderStageFlagBit::type stage) { obj.stage = gfx::ShaderStageFlagBit(stage); }
    inline void setSource(String source) { obj.source = source; }

    inline ShaderStageFlagBit::type getStage() const { return static_cast<ShaderStageFlagBit::type>(obj.stage); }
    inline String getSource() const { return obj.source; }

    CC_OBJECT(ShaderStage)

private:
    gfx::ShaderStage obj;
};

class SamplerInfo {
public:
    SamplerInfo() = default;
    SamplerInfo(Filter::type minFilter)
    : obj({gfx::Filter(minFilter)}) {}
    SamplerInfo(Filter::type minFilter, Filter::type magFilter)
    : obj({gfx::Filter(minFilter), gfx::Filter(magFilter)}) {}
    SamplerInfo(Filter::type minFilter, Filter::type magFilter, Filter::type mipmapFilter)
    : obj({gfx::Filter(minFilter), gfx::Filter(magFilter), gfx::Filter(mipmapFilter)}) {}
    SamplerInfo(Filter::type minFilter, Filter::type magFilter, Filter::type mipmapFilter, Address::type addressModeU)
    : obj({gfx::Filter(minFilter), gfx::Filter(magFilter), gfx::Filter(mipmapFilter), gfx::Address(addressModeU)}) {}
    SamplerInfo(Filter::type minFilter, Filter::type magFilter, Filter::type mipmapFilter, Address::type addressModeU, Address::type addressModeV)
    : obj({gfx::Filter(minFilter), gfx::Filter(magFilter), gfx::Filter(mipmapFilter), gfx::Address(addressModeU), gfx::Address(addressModeV)}) {}
    SamplerInfo(Filter::type minFilter, Filter::type magFilter, Filter::type mipmapFilter, Address::type addressModeU, Address::type addressModeV, Address::type addressModeW)
    : obj({gfx::Filter(minFilter), gfx::Filter(magFilter), gfx::Filter(mipmapFilter), gfx::Address(addressModeU), gfx::Address(addressModeV), gfx::Address(addressModeW)}) {}
    SamplerInfo(Filter::type minFilter, Filter::type magFilter, Filter::type mipmapFilter, Address::type addressModeU, Address::type addressModeV, Address::type addressModeW, uint32_t maxAnisotropy)
    : obj({gfx::Filter(minFilter), gfx::Filter(magFilter), gfx::Filter(mipmapFilter), gfx::Address(addressModeU), gfx::Address(addressModeV), gfx::Address(addressModeW), maxAnisotropy}) {}
    SamplerInfo(Filter::type minFilter, Filter::type magFilter, Filter::type mipmapFilter, Address::type addressModeU, Address::type addressModeV, Address::type addressModeW, uint32_t maxAnisotropy, ComparisonFunc::type func)
    : obj({gfx::Filter(minFilter), gfx::Filter(magFilter), gfx::Filter(mipmapFilter), gfx::Address(addressModeU), gfx::Address(addressModeV), gfx::Address(addressModeW), maxAnisotropy, gfx::ComparisonFunc(func)}) {}

    inline void setMinFilter(Filter::type minFilter) { obj.minFilter = gfx::Filter(minFilter); }
    inline void setMagFilter(Filter::type magFilter) { obj.magFilter = gfx::Filter(magFilter); }
    inline void setMipmapFilter(Filter::type mipmapFilter) { obj.mipFilter = gfx::Filter(mipmapFilter); }
    inline void setAddressU(Address::type addressModeU) { obj.addressU = gfx::Address(addressModeU); }
    inline void setAddressV(Address::type addressModeV) { obj.addressV = gfx::Address(addressModeV); }
    inline void setAddressW(Address::type addressModeW) { obj.addressW = gfx::Address(addressModeW); }
    inline void setMaxAnisotropy(uint32_t maxAnisotropy) { obj.maxAnisotropy = maxAnisotropy; }
    inline void setCmpFunc(ComparisonFunc::type func) { obj.cmpFunc = gfx::ComparisonFunc(func); }

    inline Filter::type getMinFilter() const { return static_cast<Filter::type>(obj.minFilter); }
    inline Filter::type getMagFilter() const { return static_cast<Filter::type>(obj.magFilter); }
    inline Filter::type getMipmapFilter() const { return static_cast<Filter::type>(obj.mipFilter); }
    inline Address::type getAddressU() const { return static_cast<Address::type>(obj.addressU); }
    inline Address::type getAddressV() const { return static_cast<Address::type>(obj.addressV); }
    inline Address::type getAddressW() const { return static_cast<Address::type>(obj.addressW); }
    inline uint32_t getMaxAnisotropy() const { return obj.maxAnisotropy; }
    inline ComparisonFunc::type getCmpFunc() const { return static_cast<ComparisonFunc::type>(obj.cmpFunc); }

    CC_OBJECT(SamplerInfo)

private:
    gfx::SamplerInfo obj;
};

class UniformStorageBuffer {
public:
    UniformStorageBuffer() = default;
    UniformStorageBuffer(uint32_t set)
    : obj({set}) {}
    UniformStorageBuffer(uint32_t set, uint32_t binding)
    : obj({set, binding}) {}
    UniformStorageBuffer(uint32_t set, uint32_t binding, String name)
    : obj({set, binding, name}) {}
    UniformStorageBuffer(uint32_t set, uint32_t binding, String name, uint32_t count)
    : obj({set, binding, name, count}) {}
    UniformStorageBuffer(uint32_t set, uint32_t binding, String name, uint32_t count, MemoryAccessBit::type memAccess)
    : obj({set, binding, name, count, gfx::MemoryAccessBit(memAccess)}) {}

    inline void setSet(uint32_t set) { obj.set = set; }
    inline void setBinding(uint32_t binding) { obj.binding = binding; }
    inline void setName(String name) { obj.name = name; }
    inline void setCount(uint32_t count) { obj.count = count; }
    inline void setMemAccess(MemoryAccessBit::type memAccess) { obj.memoryAccess = gfx::MemoryAccessBit(memAccess); }

    inline uint32_t getSet() const { return obj.set; }
    inline uint32_t getBinding() const { return obj.binding; }
    inline String getName() const { return obj.name; }
    inline uint32_t getCount() const { return obj.count; }
    inline MemoryAccessBit::type getMemAccess() const { return static_cast<MemoryAccessBit::type>(obj.memoryAccess); }

    CC_OBJECT(UniformStorageBuffer)

private:
    gfx::UniformStorageBuffer obj;
};

class UniformSamplerTexture {
public:
    UniformSamplerTexture() = default;
    UniformSamplerTexture(uint32_t set)
    : obj({set}) {}
    UniformSamplerTexture(uint32_t set, uint32_t binding)
    : obj({set, binding}) {}
    UniformSamplerTexture(uint32_t set, uint32_t binding, String name)
    : obj({set, binding, name}) {}
    UniformSamplerTexture(uint32_t set, uint32_t binding, String name, Type::type type)
    : obj({set, binding, name, gfx::Type(type)}) {}
    UniformSamplerTexture(uint32_t set, uint32_t binding, String name, Type::type type, uint32_t count)
    : obj({set, binding, name, gfx::Type(type), count}) {}

    inline void setSet(uint32_t set) { obj.set = set; }
    inline void setBinding(uint32_t binding) { obj.binding = binding; }
    inline void setName(String name) { obj.name = name; }
    inline void setType(Type::type type) { obj.type = gfx::Type(type); }
    inline void setCount(uint32_t count) { obj.count = count; }

    inline uint32_t getSet() const { return obj.set; }
    inline uint32_t getBinding() const { return obj.binding; }
    inline String getName() const { return obj.name; }
    inline Type::type getType() const { return static_cast<Type::type>(obj.type); }
    inline uint32_t getCount() const { return obj.count; }

    CC_OBJECT(UniformSamplerTexture)

private:
    gfx::UniformSamplerTexture obj;
};

class UniformTexture {
public:
    UniformTexture() = default;
    UniformTexture(uint32_t set)
    : obj({set}) {}
    UniformTexture(uint32_t set, uint32_t binding)
    : obj({set, binding}) {}
    UniformTexture(uint32_t set, uint32_t binding, String name)
    : obj({set, binding, name}) {}
    UniformTexture(uint32_t set, uint32_t binding, String name, Type::type type)
    : obj({set, binding, name, gfx::Type(type)}) {}
    UniformTexture(uint32_t set, uint32_t binding, String name, Type::type type, uint32_t count)
    : obj({set, binding, name, gfx::Type(type), count}) {}

    inline void setSet(uint32_t set) { obj.set = set; }
    inline void setBinding(uint32_t binding) { obj.binding = binding; }
    inline void setName(String name) { obj.name = name; }
    inline void setType(Type::type type) { obj.type = gfx::Type(type); }
    inline void setCount(uint32_t count) { obj.count = count; }

    inline uint32_t getSet() const { return obj.set; }
    inline uint32_t getBinding() const { return obj.binding; }
    inline String getName() const { return obj.name; }
    inline Type::type getType() const { return static_cast<Type::type>(obj.type); }
    inline uint32_t getCount() const { return obj.count; }

    CC_OBJECT(UniformTexture)

private:
    gfx::UniformTexture obj;
};

class ShaderInfo {
public:
    ShaderInfo() = default;
    ShaderInfo(String name)
    : obj({name}) {}
    ShaderInfo(String name, val stageList)
    : obj({name, vecFromEMS<gfx::ShaderStage, ShaderStage>(stageList)}) {}
    ShaderInfo(String name, val stageList, val attrs)
    : obj({name, vecFromEMS<gfx::ShaderStage, ShaderStage>(stageList), vecFromEMS<gfx::Attribute, Attribute>(attrs)}) {}
    ShaderInfo(String name, val stageList, val attrs, val blocks)
    : obj({name, vecFromEMS<gfx::ShaderStage, ShaderStage>(stageList), vecFromEMS<gfx::Attribute, Attribute>(attrs),
           vecFromEMS<gfx::UniformBlock, UniformBlock>(blocks)}) {}
    ShaderInfo(String name, val stageList, val attrs, val blocks, val buffers)
    : obj({name, vecFromEMS<gfx::ShaderStage, ShaderStage>(stageList), vecFromEMS<gfx::Attribute, Attribute>(attrs),
           vecFromEMS<gfx::UniformBlock, UniformBlock>(blocks), vecFromEMS<gfx::UniformStorageBuffer, UniformStorageBuffer>(buffers)}) {}
    ShaderInfo(String name, val stageList, val attrs, val blocks, val buffers, val samplerTextures)
    : obj({name, vecFromEMS<gfx::ShaderStage, ShaderStage>(stageList), vecFromEMS<gfx::Attribute, Attribute>(attrs),
           vecFromEMS<gfx::UniformBlock, UniformBlock>(blocks), vecFromEMS<gfx::UniformStorageBuffer, UniformStorageBuffer>(buffers),
           vecFromEMS<gfx::UniformSamplerTexture, UniformSamplerTexture>(samplerTextures)}) {}
    ShaderInfo(String name, val stageList, val attrs, val blocks, val buffers, val samplerTextures, val samplers)
    : obj({name, vecFromEMS<gfx::ShaderStage, ShaderStage>(stageList), vecFromEMS<gfx::Attribute, Attribute>(attrs),
           vecFromEMS<gfx::UniformBlock, UniformBlock>(blocks), vecFromEMS<gfx::UniformStorageBuffer, UniformStorageBuffer>(buffers),
           vecFromEMS<gfx::UniformSamplerTexture, UniformSamplerTexture>(samplerTextures), vecFromEMS<gfx::UniformSampler, UniformSampler>(samplers)}) {}
    ShaderInfo(String name, val stageList, val attrs, val blocks, val buffers, val samplerTextures, val samplers, val textures)
    : obj({name, vecFromEMS<gfx::ShaderStage, ShaderStage>(stageList), vecFromEMS<gfx::Attribute, Attribute>(attrs),
           vecFromEMS<gfx::UniformBlock, UniformBlock>(blocks), vecFromEMS<gfx::UniformStorageBuffer, UniformStorageBuffer>(buffers),
           vecFromEMS<gfx::UniformSamplerTexture, UniformSamplerTexture>(samplerTextures), vecFromEMS<gfx::UniformSampler, UniformSampler>(samplers),
           vecFromEMS<gfx::UniformTexture, UniformTexture>(textures)}) {}
    ShaderInfo(String name, val stageList, val attrs, val blocks, val buffers, val samplerTextures, val samplers, val textures, val images)
    : obj({name, vecFromEMS<gfx::ShaderStage, ShaderStage>(stageList), vecFromEMS<gfx::Attribute, Attribute>(attrs),
           vecFromEMS<gfx::UniformBlock, UniformBlock>(blocks), vecFromEMS<gfx::UniformStorageBuffer, UniformStorageBuffer>(buffers),
           vecFromEMS<gfx::UniformSamplerTexture, UniformSamplerTexture>(samplerTextures), vecFromEMS<gfx::UniformSampler, UniformSampler>(samplers),
           vecFromEMS<gfx::UniformTexture, UniformTexture>(textures), vecFromEMS<gfx::UniformStorageImage, UniformStorageImage>(images)}) {}
    ShaderInfo(String name, val stageList, val attrs, val blocks, val buffers, val samplerTextures, val samplers, val textures, val images, val subpassInputs)
    : obj({name, vecFromEMS<gfx::ShaderStage, ShaderStage>(stageList), vecFromEMS<gfx::Attribute, Attribute>(attrs),
           vecFromEMS<gfx::UniformBlock, UniformBlock>(blocks), vecFromEMS<gfx::UniformStorageBuffer, UniformStorageBuffer>(buffers),
           vecFromEMS<gfx::UniformSamplerTexture, UniformSamplerTexture>(samplerTextures), vecFromEMS<gfx::UniformSampler, UniformSampler>(samplers),
           vecFromEMS<gfx::UniformTexture, UniformTexture>(textures), vecFromEMS<gfx::UniformStorageImage, UniformStorageImage>(images), vecFromEMS<gfx::UniformInputAttachment, UniformInputAttachment>(subpassInputs)}) {}

    inline void setName(String name) { obj.name = name; }
    inline void setStageList(val stages) { obj.stages = std::move(vecFromEMS<gfx::ShaderStage, ShaderStage>(stages)); }
    inline void setAttrs(val attributes) { obj.attributes = std::move(vecFromEMS<gfx::Attribute, Attribute>(attributes)); }
    inline void setBlocks(val blocks) { obj.blocks = std::move(vecFromEMS<gfx::UniformBlock, UniformBlock>(blocks)); }
    inline void setBuffers(val buffers) { obj.buffers = std::move(vecFromEMS<gfx::UniformStorageBuffer, UniformStorageBuffer>(buffers)); }
    inline void setSamplerTextures(val samplerTextures) { obj.samplerTextures = std::move(vecFromEMS<gfx::UniformSamplerTexture, UniformSamplerTexture>(samplerTextures)); }
    inline void setSamplers(val samplers) { obj.samplers = std::move(vecFromEMS<gfx::UniformSampler, UniformSampler>(samplers)); }
    inline void setTextures(val textures) { obj.textures = std::move(vecFromEMS<gfx::UniformTexture, UniformTexture>(textures)); }
    inline void setImages(val images) { obj.images = std::move(vecFromEMS<gfx::UniformStorageImage, UniformStorageImage>(images)); }
    inline void setSubpassInputs(val subpassInputs) { obj.subpassInputs = std::move(vecFromEMS<gfx::UniformInputAttachment, UniformInputAttachment>(subpassInputs)); }

    inline String getName() const { return obj.name; }
    inline val getStageList() const { return vecToEMS(obj.stages); }
    inline val getAttrs() const { return vecToEMS(obj.attributes); }
    inline val getBlocks() const { return vecToEMS(obj.blocks); }
    inline val getBuffers() const { return vecToEMS(obj.buffers); }
    inline val getSamplerTextures() const { return vecToEMS(obj.samplerTextures); }
    inline val getSamplers() const { return vecToEMS(obj.samplers); }
    inline val getTextures() const { return vecToEMS(obj.textures); }
    inline val getImages() const { return vecToEMS(obj.images); }
    inline val getSubpassInputs() const { return vecToEMS(obj.subpassInputs); }

    CC_OBJECT(ShaderInfo)

private:
    gfx::ShaderInfo obj;
};

class InputState {
public:
    InputState() = default;
    InputState(val attrs)
    : obj({vecFromEMS<gfx::Attribute, Attribute>(attrs)}) {}

    inline void setAttrs(val attrs) { obj.attributes = std::move(vecFromEMS<gfx::Attribute, Attribute>(attrs)); }

    inline val getAttrs() const { return vecToEMS(obj.attributes); }

    CC_OBJECT(InputState)

private:
    gfx::InputState obj;
};

class RasterizerState {
public:
    RasterizerState() = default;
    RasterizerState(bool discard)
    : obj({discard}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode)
    : obj({discard, gfx::PolygonMode(polygonMode)}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel)}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel, CullMode::type cullMode)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel), gfx::CullMode(cullMode)}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel, CullMode::type cullMode, uint32_t frontFaceCCW)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel), gfx::CullMode(cullMode), frontFaceCCW}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel, CullMode::type cullMode, uint32_t frontFaceCCW, bool depthBiasEnabled)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel), gfx::CullMode(cullMode), frontFaceCCW, depthBiasEnabled}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel, CullMode::type cullMode, uint32_t frontFaceCCW, bool depthBiasEnabled, float depthBias)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel), gfx::CullMode(cullMode), frontFaceCCW, depthBiasEnabled, depthBias}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel, CullMode::type cullMode, uint32_t frontFaceCCW, bool depthBiasEnabled, float depthBias, float depthBiasClamp)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel), gfx::CullMode(cullMode), frontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel, CullMode::type cullMode, uint32_t frontFaceCCW, bool depthBiasEnabled, float depthBias, float depthBiasClamp, float depthBiasSlop)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel), gfx::CullMode(cullMode), frontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel, CullMode::type cullMode, uint32_t frontFaceCCW, bool depthBiasEnabled, float depthBias, float depthBiasClamp, float depthBiasSlop, uint32_t depthClip)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel), gfx::CullMode(cullMode), frontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop, depthClip}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel, CullMode::type cullMode, uint32_t frontFaceCCW, bool depthBiasEnabled, float depthBias, float depthBiasClamp, float depthBiasSlop, uint32_t depthClip, bool multiSample)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel), gfx::CullMode(cullMode), frontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop, depthClip, multiSample}) {}
    RasterizerState(bool discard, PolygonMode::type polygonMode, ShadeModel::type shadeModel, CullMode::type cullMode, uint32_t frontFaceCCW, bool depthBiasEnabled, float depthBias, float depthBiasClamp, float depthBiasSlop, uint32_t depthClip, bool multiSample, float lineWidth)
    : obj({discard, gfx::PolygonMode(polygonMode), gfx::ShadeModel(shadeModel), gfx::CullMode(cullMode), frontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop, depthClip, multiSample, lineWidth}) {}

    inline void setDiscard(bool discard) { obj.isDiscard = discard; }
    inline void setPolygonMode(PolygonMode::type polygonMode) { obj.polygonMode = gfx::PolygonMode(polygonMode); }
    inline void setShadeModel(ShadeModel::type shadeModel) { obj.shadeModel = gfx::ShadeModel(shadeModel); }
    inline void setCullMode(CullMode::type cullMode) { obj.cullMode = gfx::CullMode(cullMode); }
    inline void setFrontFaceCCW(uint32_t frontFaceCCW) { obj.isFrontFaceCCW = frontFaceCCW; }
    inline void setDepthBiasEnabled(bool depthBiasEnabled) { obj.depthBiasEnabled = depthBiasEnabled; }
    inline void setDepthBias(float depthBias) { obj.depthBias = depthBias; }
    inline void setDepthBiasClamp(float depthBiasClamp) { obj.depthBiasClamp = depthBiasClamp; }
    inline void setDepthBiasSlop(float depthBiasSlop) { obj.depthBiasSlop = depthBiasSlop; }
    inline void setDepthClip(uint32_t depthClip) { obj.isDepthClip = depthClip; }
    inline void setMultiSample(bool multiSample) { obj.isMultisample = multiSample; }
    inline void setLineWidth(float lineWidth) { obj.lineWidth = lineWidth; }

    inline bool getDiscard() const { return obj.isDiscard; }
    inline PolygonMode::type getPolygonMode() const { return static_cast<PolygonMode::type>(obj.polygonMode); }
    inline ShadeModel::type getShadeModel() const { return static_cast<ShadeModel::type>(obj.shadeModel); }
    inline CullMode::type getCullMode() const { return static_cast<CullMode::type>(obj.cullMode); }
    inline uint32_t getFrontFaceCCW() const { return obj.isFrontFaceCCW; }
    inline bool getDepthBiasEnabled() const { return obj.depthBiasEnabled; }
    inline float getDepthBias() const { return obj.depthBias; }
    inline float getDepthBiasClamp() const { return obj.depthBiasClamp; }
    inline float getDepthBiasSlop() const { return obj.depthBiasSlop; }
    inline uint32_t getDepthClip() const { return obj.isDepthClip; }
    inline bool getMultiSample() const { return obj.isMultisample; }
    inline float getLineWidth() const { return obj.lineWidth; }

    CC_OBJECT(RasterizerState);

private:
    gfx::RasterizerState obj;
};

class DepthStencilState {
public:
    DepthStencilState() = default;
    DepthStencilState(uint32_t depthTest)
    : obj({depthTest}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite)
    : obj({depthTest, depthWrite}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc)}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront)}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail)}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront)}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass)}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass, uint32_t stencilRefFront)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass), stencilRefFront}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass, uint32_t stencilRefFront, uint32_t stencilTestBack)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass), stencilRefFront, stencilTestBack}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass, uint32_t stencilRefFront, uint32_t stencilTestBack, ComparisonFunc::type stencilFuncBack)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass), stencilRefFront, stencilTestBack, gfx::ComparisonFunc(stencilFuncBack)}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass, uint32_t stencilRefFront, uint32_t stencilTestBack, ComparisonFunc::type stencilFuncBack,
                      uint32_t stencilReadMaskBack)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass), stencilRefFront, stencilTestBack, gfx::ComparisonFunc(stencilFuncBack), stencilReadMaskBack}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass, uint32_t stencilRefFront, uint32_t stencilTestBack, ComparisonFunc::type stencilFuncBack,
                      uint32_t stencilReadMaskBack, uint32_t stencilWriteMaskBack)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass), stencilRefFront, stencilTestBack, gfx::ComparisonFunc(stencilFuncBack), stencilReadMaskBack, stencilWriteMaskBack}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass, uint32_t stencilRefFront, uint32_t stencilTestBack, ComparisonFunc::type stencilFuncBack,
                      uint32_t stencilReadMaskBack, uint32_t stencilWriteMaskBack,
                      StencilOp::type stencilFailOpBack)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass), stencilRefFront, stencilTestBack, gfx::ComparisonFunc(stencilFuncBack), stencilReadMaskBack, stencilWriteMaskBack,
           gfx::StencilOp(stencilFailOpBack)}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass, uint32_t stencilRefFront, uint32_t stencilTestBack, ComparisonFunc::type stencilFuncBack,
                      uint32_t stencilReadMaskBack, uint32_t stencilWriteMaskBack, StencilOp::type stencilFailOpBack, StencilOp::type stencilZFailOpBack)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass), stencilRefFront, stencilTestBack, gfx::ComparisonFunc(stencilFuncBack), stencilReadMaskBack, stencilWriteMaskBack,
           gfx::StencilOp(stencilFailOpBack), gfx::StencilOp(stencilZFailOpBack)}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass, uint32_t stencilRefFront, uint32_t stencilTestBack, ComparisonFunc::type stencilFuncBack,
                      uint32_t stencilReadMaskBack, uint32_t stencilWriteMaskBack,
                      StencilOp::type stencilFailOpBack, StencilOp::type stencilZFailOpBack, StencilOp::type stencilPassOpBack)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass), stencilRefFront, stencilTestBack, gfx::ComparisonFunc(stencilFuncBack), stencilReadMaskBack, stencilWriteMaskBack,
           gfx::StencilOp(stencilFailOpBack), gfx::StencilOp(stencilZFailOpBack), gfx::StencilOp(stencilPassOpBack)}) {}
    DepthStencilState(uint32_t depthTest, uint32_t depthWrite, ComparisonFunc::type depthFunc, uint32_t stencilTestFront,
                      ComparisonFunc::type stencilFuncFront, uint32_t stencilReadMaskFront, uint32_t stencilWriteMaskFront, StencilOp::type stencilOpFrontFail,
                      StencilOp::type stencilZFailOpFront, StencilOp::type stencilOpFrontPass, uint32_t stencilRefFront, uint32_t stencilTestBack, ComparisonFunc::type stencilFuncBack,
                      uint32_t stencilReadMaskBack, uint32_t stencilWriteMaskBack, StencilOp::type stencilFailOpBack, StencilOp::type stencilZFailOpBack, StencilOp::type stencilPassOpBack,
                      uint32_t stencilRefBack)
    : obj({depthTest, depthWrite, gfx::ComparisonFunc(depthFunc), stencilTestFront, gfx::ComparisonFunc(stencilFuncFront), stencilReadMaskFront, stencilWriteMaskFront,
           gfx::StencilOp(stencilOpFrontFail), gfx::StencilOp(stencilZFailOpFront), gfx::StencilOp(stencilOpFrontPass), stencilRefFront, stencilTestBack, gfx::ComparisonFunc(stencilFuncBack), stencilReadMaskBack, stencilWriteMaskBack,
           gfx::StencilOp(stencilFailOpBack), gfx::StencilOp(stencilZFailOpBack), gfx::StencilOp(stencilPassOpBack), stencilRefBack}) {}

    inline void setDepthTest(uint32_t depthTest) { obj.depthTest = depthTest; }
    inline void setDepthWrite(uint32_t depthWrite) { obj.depthWrite = depthWrite; }
    inline void setDepthFunc(ComparisonFunc::type depthFunc) { obj.depthFunc = gfx::ComparisonFunc(depthFunc); }
    inline void setStencilTestFront(uint32_t stencilTestFront) { obj.stencilTestFront = stencilTestFront; }
    inline void setStencilFuncFront(ComparisonFunc::type stencilFuncFront) { obj.stencilFuncFront = gfx::ComparisonFunc(stencilFuncFront); }
    inline void setStencilReadMaskFront(uint32_t stencilReadMaskFront) { obj.stencilReadMaskFront = stencilReadMaskFront; }
    inline void setStencilWriteMaskFront(uint32_t stencilWriteMaskFront) { obj.stencilWriteMaskFront = stencilWriteMaskFront; }
    inline void setStencilOpFrontFail(StencilOp::type stencilOpFrontFail) { obj.stencilFailOpFront = gfx::StencilOp(stencilOpFrontFail); }
    inline void setStencilOpFrontZFail(StencilOp::type stencilOpFrontZFail) { obj.stencilZFailOpFront = gfx::StencilOp(stencilOpFrontZFail); }
    inline void setStencilOpFrontPass(StencilOp::type stencilOpFrontPass) { obj.stencilPassOpFront = gfx::StencilOp(stencilOpFrontPass); }
    inline void setStencilRefFront(uint32_t stencilRefFront) { obj.stencilRefFront = stencilRefFront; }
    inline void setStencilTestBack(uint32_t stencilTestBack) { obj.stencilTestBack = stencilTestBack; }
    inline void setStencilFuncBack(ComparisonFunc::type stencilFuncBack) { obj.stencilFuncBack = gfx::ComparisonFunc(stencilFuncBack); }
    inline void setStencilReadMaskBack(uint32_t stencilReadMaskBack) { obj.stencilReadMaskBack = stencilReadMaskBack; }
    inline void setStencilWriteMaskBack(uint32_t stencilWriteMaskBack) { obj.stencilWriteMaskBack = stencilWriteMaskBack; }
    inline void setStencilOpBackFail(StencilOp::type stencilOpBackFail) { obj.stencilFailOpBack = gfx::StencilOp(stencilOpBackFail); }
    inline void setStencilOpBackZFail(StencilOp::type stencilOpBackZFail) { obj.stencilZFailOpBack = gfx::StencilOp(stencilOpBackZFail); }
    inline void setStencilOpBackPass(StencilOp::type stencilOpBackPass) { obj.stencilPassOpBack = gfx::StencilOp(stencilOpBackPass); }
    inline void setStencilRefBack(uint32_t stencilRefBack) { obj.stencilRefBack = stencilRefBack; }

    inline uint32_t getDepthTest() const { return obj.depthTest; }
    inline uint32_t getDepthWrite() const { return obj.depthWrite; }
    inline ComparisonFunc::type getDepthFunc() const { return ComparisonFunc::type(obj.depthFunc); }
    inline uint32_t getStencilTestFront() const { return obj.stencilTestFront; }
    inline ComparisonFunc::type getStencilFuncFront() const { return ComparisonFunc::type(obj.stencilFuncFront); }
    inline uint32_t getStencilReadMaskFront() const { return obj.stencilReadMaskFront; }
    inline uint32_t getStencilWriteMaskFront() const { return obj.stencilWriteMaskFront; }
    inline StencilOp::type getStencilOpFrontFail() const { return StencilOp::type(obj.stencilFailOpFront); }
    inline StencilOp::type getStencilOpFrontZFail() const { return StencilOp::type(obj.stencilZFailOpFront); }
    inline StencilOp::type getStencilOpFrontPass() const { return StencilOp::type(obj.stencilPassOpFront); }
    inline uint32_t getStencilRefFront() const { return obj.stencilRefFront; }
    inline uint32_t getStencilTestBack() const { return obj.stencilTestBack; }
    inline ComparisonFunc::type getStencilFuncBack() const { return ComparisonFunc::type(obj.stencilFuncBack); }
    inline uint32_t getStencilReadMaskBack() const { return obj.stencilReadMaskBack; }
    inline uint32_t getStencilWriteMaskBack() const { return obj.stencilWriteMaskBack; }
    inline StencilOp::type getStencilOpBackFail() const { return StencilOp::type(obj.stencilFailOpBack); }
    inline StencilOp::type getStencilOpBackZFail() const { return StencilOp::type(obj.stencilZFailOpBack); }
    inline StencilOp::type getStencilOpBackPass() const { return StencilOp::type(obj.stencilPassOpBack); }
    inline uint32_t getStencilRefBack() const { return obj.stencilRefBack; }

    CC_OBJECT(DepthStencilState)

private:
    gfx::DepthStencilState obj;
};

/*--------------------------------------------------------------------------------------------*/
// struct with pointers, getter setter template function should be visible here

// EMSCRIPTEN_BINDINGS(WEBGPU_DEVICE_WASM_EXPORT) {

// }

/*--------------------------------------------------------------------------------------------*/

} // namespace cc::gfx::ems
