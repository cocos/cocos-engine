#pragma once
#include <boost/fusion/include/adapt_struct.hpp>
#include <boost/fusion/include/at_c.hpp>
#include <boost/fusion/include/for_each.hpp>
#include <boost/preprocessor/cat.hpp>
#include <boost/preprocessor/seq/for_each.hpp>
#include <boost/preprocessor/stringize.hpp>
#include "WGPUBuffer.h"
#include "WGPUCommandBuffer.h"
#include "WGPUDef.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUFrameBuffer.h"
#include "WGPUInputAssembler.h"
#include "WGPUPipelineLayout.h"
#include "WGPUPipelineState.h"
#include "WGPUQueue.h"
#include "WGPURenderPass.h"
#include "WGPUSampler.h"
#include "WGPUShader.h"
#include "WGPUSwapchain.h"
#include "WGPUTexture.h"
#include "boost/pfr.hpp"
#include "boost/type_index.hpp"
#include "states/WGPUBufferBarrier.h"
#include "states/WGPUGeneralBarrier.h"
#include "states/WGPUTextureBarrier.h"
template <typename T>
struct GenInstance {
    static T instance() {
        return T();
    }
};

template <typename T, typename... Args>
struct Instance {
    static T ctor(Args... args) {
        return T{std::forward<Args>(args)...};
    }
};

template <typename T, std::size_t N, typename = std::make_index_sequence<N>>
struct constructImpl;

template <typename T, std::size_t N, std::size_t... Seq>
struct constructImpl<T, N, std::index_sequence<Seq...>> {
    // using type = T(*)(std::tuple_element<Seq, T>::type...);
    using type = Instance<T, boost::pfr::tuple_element_t<Seq, T>...>;
};

template <typename T, std::size_t N, typename = std::make_index_sequence<N>>
struct constructImplFunc;
template <typename T, std::size_t N, std::size_t... Seq>
struct constructImplFunc<T, N, std::index_sequence<Seq...>> {
    // using type = T(*)(std::tuple_element<Seq, T>::type...);
    using type = Instance<T, boost::pfr::tuple_element_t<Seq, T>...>;
    using func = ::emscripten::constructor<boost::pfr::tuple_element_t<Seq, T>...>;
    T &operator()(T &t) {
        t = std::bind(t, T::template constructor<boost::pfr::tuple_element_t<Seq, T>...>)();
        return t;
    }
};

using boost::pfr::tuple_size_v;
template <typename T, std::size_t IgnoreParams = 0>
struct constructor {
    using Indices = typename std::make_index_sequence<tuple_size_v<T> - IgnoreParams>;
    using type = typename constructImpl<T, tuple_size_v<T> - IgnoreParams>::type;

    T &operator()(T &t) {
        return constructImplFunc(t);
    }
};

#define NUMARGS(...) (sizeof((int[]){__VA_ARGS__}) / sizeof(int))

#define EXPORT_PROERTY_BY_SEQ(r, CLASSNAME, PROPERTY) \
    .field(BOOST_PP_STRINGIZE(PROPERTY), &CLASSNAME::PROPERTY)

#define EXPORT_FUNCTION_BY_SEQ(r, CLASSNAME, FUNCTION) \
    .function(BOOST_PP_STRINGIZE(FUNCTION), &CLASSNAME::FUNCTION, allow_raw_pointers())

#define EXPORT_CTOR_BY_SEQ(r, CLASSNAME, i, elem) \
    function(#CLASSNAME, &constructor<CLASSNAME, i>::type::ctor);

#define EXPORT_STRUCT_CTOR(CLASSNAME, SEQ)                       \
    BOOST_PP_SEQ_FOR_EACH_I(EXPORT_CTOR_BY_SEQ, CLASSNAME, SEQ); \
    function(#CLASSNAME, &GenInstance<CLASSNAME>::instance); // manually generate ctor without any args

#define EXPORT_STRUCT(CLASSNAME, ...)                                                                       \
    {                                                                                                       \
        auto obj = value_object<CLASSNAME>(#CLASSNAME);                                                     \
        obj                                                                                                 \
            BOOST_PP_SEQ_FOR_EACH(EXPORT_PROERTY_BY_SEQ, CLASSNAME, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
        EXPORT_STRUCT_CTOR(CLASSNAME, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__));                               \
    }

/*

    class_<ems::MemoryUsageBit>("MemoryUsageBit")
        .class_property("NONE", &ems::MemoryUsageBit::NONE)
        .class_property("DEVICE", &ems::MemoryUsageBit::DEVICE)
        .class_property("HOST", &ems::MemoryUsageBit::HOST);

*/
#define EXPORT_ENUMFIELD_BY_SEQ(r, ENUMNAME, FIELD) \
    .class_property(BOOST_PP_STRINGIZE(FIELD), &ems::ENUMNAME::FIELD)

#define EXPORT_ENUM(ENUMNAME, ...)   \
    class_<ems::ENUMNAME>(#ENUMNAME) \
        BOOST_PP_SEQ_FOR_EACH(EXPORT_ENUMFIELD_BY_SEQ, ENUMNAME, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__));

template <typename T, int index>
using ElementType = T;

template <typename R, typename T, std::size_t N, typename Indices = std::make_index_sequence<N>>
struct VecCtorExport;

template <typename R, typename T, std::size_t N, std::size_t... Indices>
struct VecCtorExport<R, T, N, std::index_sequence<Indices...>> {
    R &operator()(R &r) {
        r.constructor<ElementType<T, Indices>...>();
        return r;
    }
};

// VecCtorExport<decltype(obj), ELEMNAME, 3>()(obj);
#define EXPORT_CTOR_N(z, i, ELEMNAME) \
    VecCtorExport<decltype(obj), ELEMNAME, i>()(obj);

#define EXPORT_STRUCT_VECTOR(CLASSNAME, ELEMNAME, CTOR_NUMS, ...) \
    {                                                             \
        auto obj = class_<ems::CLASSNAME>(#CLASSNAME);            \
        BOOST_PP_REPEAT(CTOR_NUMS, EXPORT_CTOR_N, ELEMNAME)       \
    }

namespace cc::gfx {

using ::emscripten::allow_raw_pointer;
using ::emscripten::allow_raw_pointers;
using ::emscripten::arg;
using ::emscripten::base;
using ::emscripten::class_;
using ::emscripten::constant;
using ::emscripten::enum_;
using ::emscripten::function;
using ::emscripten::pure_virtual;
using ::emscripten::register_vector;
using ::emscripten::select_overload;
using ::emscripten::val;
using ::emscripten::value_object;

using String = ccstd::string;
using ccstd::vector;

/*
    value_object<PipelineLayoutInfo>("PipelineLayoutInfo")
        .field("setLayouts", &PipelineLayoutInfo::setLayouts);
    function("PipelineLayoutInfo", &GenInstance<PipelineLayoutInfo>::instance);
*/

// fieldName<boost::pfr::tuple_element_t<Seq, T>>(boost::fusion::extension::struct_member_name<T, Seq>::call())

// template <typename Raw, typename Exp, std::size_t index>
// Exp &exportFiled(const Raw &raw, Exp &exp) {
//     boost::fusion::get<0>(raw);
//     return exp;
//     // return exp.field(boost::fusion::extension::struct_member_name<Raw, index>::call(), reinterpret_cast<char *>(&get<index>(raw)) - reinterpret_cast<char *>(&get<0>(raw)));
// }

// template <typename Raw, typename Exp, std::size_t... seq>
// void exportStruct(const Raw &raw, Exp &exp, std::index_sequence<seq...>) {
//     (..., exportFiled<Raw, Exp, seq>(raw, exp));
//     // (..., getInt(seq));
//     //decltype(auto) res = exp.field(boost::fusion::extension::struct_member_name<Raw, seq>::call(), reinterpret_cast<char *>(&get<seq>(raw)) - reinterpret_cast<char *>(&get<0>(raw))), ...;
// }

// template <typename Raw>
// void exportStruct() {
//     Raw            raw{};
//     const auto &   name = boost::typeindex::type_id<Raw>().pretty_name();
//     decltype(auto) exp  = value_object<Raw>(name.c_str());
//     exportStruct(raw, exp, std::make_index_sequence<tuple_size_v<Raw>>{});
//     function(name.c_str(), &GenInstance<Raw>::instance);
// }

// template <typename T, class... Ts>
// struct GenInstances {
//     OBJECT_EXPORT(T);
//     GenInstance<Ts...>;
// };

// template <typename T>
// struct GenInstances<T> {
//     OBJECT_EXPORT(T);
// };

// inline void setSwapchainVsyncMode(SwapchainInfo &info, uint32_t mode) { info.vsyncMode = gfx::VsyncMode(mode); }

// inline uint32_t getSwapchainVsyncMode(const SwapchainInfo &info) { return static_cast<std::underlying_type<decltype(info.vsyncMode)>::type>(info.vsyncMode); }

// GenInstances<DeviceInfo, BindingMappingInfo, ColorAttachment, DepthStencilAttachment, SubpassInfo, SubpassDependency, RenderPassInfo, Offset, Extent, TextureSubresLayers, BufferTextureCopy, SamplerInfo, BufferInfo,
//              DescriptorSetLayoutInfo, DescriptorSetLayoutBinding, PipelineLayoutInfo, UniformStorageImage, ShaderStage, Attribute, UniformBlock, UniformStorageBuffer>;

EMSCRIPTEN_BINDINGS(WEBGPU_DEVICE_WASM_EXPORT) {
    // TODO_Zeqiang: compile time traverse enum
    //------------------------------------------------ENUM------------------------------------------------------------
    // enum_<BufferUsage>("BufferUsage")
    //     .value("NONE", BufferUsageBit::NONE)
    //     .value("TRANSFER_SRC", BufferUsageBit::TRANSFER_SRC)
    //     .value("TRANSFER_DST", BufferUsageBit::TRANSFER_DST)
    //     .value("INDEX", BufferUsageBit::INDEX)
    //     .value("VERTEX", BufferUsageBit::VERTEX)
    //     .value("UNIFORM", BufferUsageBit::UNIFORM)
    //     .value("STORAGE", BufferUsageBit::STORAGE)
    //     .value("INDIRECT", BufferUsageBit::INDIRECT);

    //-----------------------------------------------STRUCT-------------------------------------------------------------------
    EXPORT_STRUCT(Offset, x, y, z);
    EXPORT_STRUCT(Extent, width, height, depth);
    EXPORT_STRUCT(TextureSubresLayers, mipLevel, baseArrayLayer, layerCount);
    EXPORT_STRUCT(BufferTextureCopy, buffStride, buffTexHeight, texOffset, texExtent, texSubres);
    // EXPORT_STRUCT(TextureInfo, type, usage, format, width, height, depth, layerCount, levelCount, sampleCount);
    // EXPORT_STRUCT(SamplerInfo, minFilter, magFilter, mipFilter, addressU, addressV, addressW, maxAnisotropy, cmpFunc);
    // EXPORT_STRUCT(BufferInfo, usage, memUsage, size, stride, flags);
    // EXPORT_STRUCT(DescriptorSetLayoutBinding, binding, descriptorType, count, stageFlags, immutableSamplers);
    // EXPORT_STRUCT(UniformStorageImage, set, binding, name, type, count, memoryAccess);
    // EXPORT_STRUCT(ShaderStage, stage, source);
    // EXPORT_STRUCT(Attribute, name, format, isNormalized, stream, isInstanced, location);
    // EXPORT_STRUCT(Uniform, name, type, count);
    // EXPORT_STRUCT(UniformBlock, set, binding, name, members, count);
    // EXPORT_STRUCT(UniformStorageBuffer, set, binding, name, count, memoryAccess);
    // EXPORT_STRUCT(UniformSamplerTexture, set, binding, name, type, count);
    EXPORT_STRUCT(UniformSampler, set, binding, name, count);
    // EXPORT_STRUCT(UniformTexture, set, binding, name, type, count);
    EXPORT_STRUCT(UniformInputAttachment, set, binding, name, count);
    // EXPORT_STRUCT(ShaderInfo, name, stages, attributes, blocks, buffers, samplerTextures, samplers, textures, images, subpassInputs);
    // EXPORT_STRUCT(InputState, attributes);
    // EXPORT_STRUCT(RasterizerState, isDiscard, polygonMode, shadeModel, cullMode, isFrontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop, isDepthClip, isMultisample, lineWidth);
    // EXPORT_STRUCT(DepthStencilState, depthTest, depthWrite, depthFunc, stencilTestFront, stencilFuncFront, stencilReadMaskFront, stencilWriteMaskFront, stencilFailOpFront, stencilZFailOpFront,
    //               stencilPassOpFront, stencilRefFront, stencilFuncBack, stencilReadMaskBack, stencilWriteMaskBack, stencilFailOpBack, stencilZFailOpBack, stencilPassOpBack, stencilRefBack);
    // EXPORT_STRUCT(BlendTarget, blend, blendSrc, blendDst, blendEq, blendSrcAlpha, blendDstAlpha, blendAlphaEq, blendColorMask);
    // EXPORT_STRUCT(BlendState, isA2C, isIndepend, blendColor, targets);
    EXPORT_STRUCT(Color, x, y, z, w);
    // EXPORT_STRUCT(QueueInfo, type);
    EXPORT_STRUCT(Rect, x, y, width, height);
    EXPORT_STRUCT(Viewport, left, top, width, height, minDepth, maxDepth);
    EXPORT_STRUCT(DrawInfo, vertexCount, firstVertex, indexCount, firstIndex, vertexOffset, instanceCount, firstInstance);
    EXPORT_STRUCT(TextureBlit, srcSubres, srcOffset, srcExtent, dstSubres, dstOffset, dstExtent);
    EXPORT_STRUCT(Size, x, y, z);
    EXPORT_STRUCT(DeviceCaps, maxVertexAttributes, maxVertexUniformVectors, maxFragmentUniformVectors, maxTextureUnits, maxImageUnits, maxVertexTextureUnits, maxColorRenderTargets,
                  maxShaderStorageBufferBindings, maxShaderStorageBlockSize, maxUniformBufferBindings, maxUniformBlockSize, maxTextureSize, maxCubeMapTextureSize, uboOffsetAlignment,
                  maxComputeSharedMemorySize, maxComputeWorkGroupInvocations, maxComputeWorkGroupSize, maxComputeWorkGroupCount, supportQuery, clipSpaceMinZ, screenSpaceSignY, clipSpaceSignY)
    // using ems::FormatInfo;
    //  EXPORT_STRUCT(FormatInfo, name, size, count, type, hasAlpha, hasDepth, hasStencil, isCompressed);
    // emscripten::constant("FormatInfos", GFX_FORMAT_INFOS);

    function("getFormatInfos", &ems::getFormatInfos);

    // to accept uint-to-enum_calss params
    class_<ems::QueueInfo>("QueueInfo")
        .constructor<>()
        .constructor<ems::QueueType::type>()
        .property("type", &ems::QueueInfo::getType, &ems::QueueInfo::setType);

    class_<ems::BlendState>("BlendState")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, Color>()
        .constructor<uint32_t, uint32_t, Color, val>()
        .function("setTarget", &ems::BlendState::setTarget)
        .function("reset", &ems::BlendState::reset)
        .property("isA2C", &ems::BlendState::getIsA2C, &ems::BlendState::setIsA2C)
        .property("isIndepend", &ems::BlendState::getIsIndepend, &ems::BlendState::setIsIndepend)
        .property("blendColor", &ems::BlendState::getBlendColor, &ems::BlendState::setBlendColor)
        .property("targets", &ems::BlendState::getTargets, &ems::BlendState::setTargets);

    class_<ems::BlendTarget>("BlendTarget")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, ems::BlendFactor::type>()
        .constructor<uint32_t, ems::BlendFactor::type, ems::BlendFactor::type>()
        .constructor<uint32_t, ems::BlendFactor::type, ems::BlendFactor::type, ems::BlendOp::type>()
        .constructor<uint32_t, ems::BlendFactor::type, ems::BlendFactor::type, ems::BlendOp::type, ems::BlendFactor::type>()
        .constructor<uint32_t, ems::BlendFactor::type, ems::BlendFactor::type, ems::BlendOp::type, ems::BlendFactor::type, ems::BlendFactor::type>()
        .constructor<uint32_t, ems::BlendFactor::type, ems::BlendFactor::type, ems::BlendOp::type, ems::BlendFactor::type, ems::BlendFactor::type, ems::BlendOp::type>()
        .constructor<uint32_t, ems::BlendFactor::type, ems::BlendFactor::type, ems::BlendOp::type, ems::BlendFactor::type, ems::BlendFactor::type, ems::BlendOp::type, ems::ColorMask::type>()
        .property("blend", &ems::BlendTarget::getBlend, &ems::BlendTarget::setBlend)
        .property("blendSrc", &ems::BlendTarget::getBlendSrc, &ems::BlendTarget::setBlendSrc)
        .property("blendDst", &ems::BlendTarget::getBlendDst, &ems::BlendTarget::setBlendDst)
        .property("blendEq", &ems::BlendTarget::getBlendEq, &ems::BlendTarget::setBlendEq)
        .property("blendSrcAlpha", &ems::BlendTarget::getBlendSrcAlpha, &ems::BlendTarget::setBlendSrcAlpha)
        .property("blendDstAlpha", &ems::BlendTarget::getBlendDstAlpha, &ems::BlendTarget::setBlendDstAlpha)
        .property("blendAlphaEq", &ems::BlendTarget::getBlendAlphaEq, &ems::BlendTarget::setBlendAlphaEq)
        .property("blendColorMask", &ems::BlendTarget::getBlendColorMask, &ems::BlendTarget::setBlendColorMask);

    class_<ems::DepthStencilState>("DepthStencilState")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t, uint32_t, ems::ComparisonFunc::type>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t, uint32_t, ems::ComparisonFunc::type,
                     uint32_t>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t, uint32_t, ems::ComparisonFunc::type,
                     uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t, uint32_t, ems::ComparisonFunc::type,
                     uint32_t, uint32_t, ems::StencilOp::type>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t, uint32_t, ems::ComparisonFunc::type,
                     uint32_t, uint32_t, ems::StencilOp::type, ems::StencilOp::type>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t, uint32_t, ems::ComparisonFunc::type,
                     uint32_t, uint32_t, ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type>()
        .constructor<uint32_t, uint32_t, ems::ComparisonFunc::type, uint32_t, ems::ComparisonFunc::type, uint32_t, uint32_t,
                     ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t, uint32_t, ems::ComparisonFunc::type,
                     uint32_t, uint32_t, ems::StencilOp::type, ems::StencilOp::type, ems::StencilOp::type, uint32_t>()
        .property("depthTest", &ems::DepthStencilState::getDepthTest, &ems::DepthStencilState::setDepthTest)
        .property("depthWrite", &ems::DepthStencilState::getDepthWrite, &ems::DepthStencilState::setDepthWrite)
        .property("depthFunc", &ems::DepthStencilState::getDepthFunc, &ems::DepthStencilState::setDepthFunc)
        .property("stencilTestFront", &ems::DepthStencilState::getStencilTestFront, &ems::DepthStencilState::setStencilTestFront)
        .property("stencilFuncFront", &ems::DepthStencilState::getStencilFuncFront, &ems::DepthStencilState::setStencilFuncFront)
        .property("stencilReadMaskFront", &ems::DepthStencilState::getStencilReadMaskFront, &ems::DepthStencilState::setStencilReadMaskFront)
        .property("stencilWriteMaskFront", &ems::DepthStencilState::getStencilWriteMaskFront, &ems::DepthStencilState::setStencilWriteMaskFront)
        .property("stencilFailFront", &ems::DepthStencilState::getStencilOpFrontFail, &ems::DepthStencilState::setStencilOpFrontFail)
        .property("stencilZFailFront", &ems::DepthStencilState::getStencilOpFrontZFail, &ems::DepthStencilState::setStencilOpFrontZFail)
        .property("stencilPassFront", &ems::DepthStencilState::getStencilOpFrontPass, &ems::DepthStencilState::setStencilOpFrontPass)
        .property("stencilRefFront", &ems::DepthStencilState::getStencilRefFront, &ems::DepthStencilState::setStencilRefFront)
        .property("stencilTestBack", &ems::DepthStencilState::getStencilTestBack, &ems::DepthStencilState::setStencilTestBack)
        .property("stencilFuncBack", &ems::DepthStencilState::getStencilFuncBack, &ems::DepthStencilState::setStencilFuncBack)
        .property("stencilReadMaskBack", &ems::DepthStencilState::getStencilReadMaskBack, &ems::DepthStencilState::setStencilReadMaskBack)
        .property("stencilWriteMaskBack", &ems::DepthStencilState::getStencilWriteMaskBack, &ems::DepthStencilState::setStencilWriteMaskBack)
        .property("stencilFailBack", &ems::DepthStencilState::getStencilOpBackFail, &ems::DepthStencilState::setStencilOpBackFail)
        .property("stencilZFailBack", &ems::DepthStencilState::getStencilOpBackZFail, &ems::DepthStencilState::setStencilOpBackZFail)
        .property("stencilPassBack", &ems::DepthStencilState::getStencilOpBackPass, &ems::DepthStencilState::setStencilOpBackPass)
        .property("stencilRefBack", &ems::DepthStencilState::getStencilRefBack, &ems::DepthStencilState::setStencilRefBack);

    class_<ems::RasterizerState>("RasterizerState")
        .constructor<>()
        .constructor<bool>()
        .constructor<bool, ems::PolygonMode::type>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type, ems::CullMode::type>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type, ems::CullMode::type, uint32_t>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type, ems::CullMode::type, uint32_t, bool>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type, ems::CullMode::type, uint32_t, bool, float>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type, ems::CullMode::type, uint32_t, bool, float, float>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type, ems::CullMode::type, uint32_t, bool, float, float, float>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type, ems::CullMode::type, uint32_t, bool, float, float, float, uint32_t>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type, ems::CullMode::type, uint32_t, bool, float, float, float, uint32_t, bool>()
        .constructor<bool, ems::PolygonMode::type, ems::ShadeModel::type, ems::CullMode::type, uint32_t, bool, float, float, float, uint32_t, bool, float>()
        .property("isDiscard", &ems::RasterizerState::getDiscard, &ems::RasterizerState::setDiscard)
        .property("polygonMode", &ems::RasterizerState::getPolygonMode, &ems::RasterizerState::setPolygonMode)
        .property("shadeModel", &ems::RasterizerState::getShadeModel, &ems::RasterizerState::setShadeModel)
        .property("cullMode", &ems::RasterizerState::getCullMode, &ems::RasterizerState::setCullMode)
        .property("isFrontFaceCCW", &ems::RasterizerState::getFrontFaceCCW, &ems::RasterizerState::setFrontFaceCCW)
        .property("depthBiasEnabled", &ems::RasterizerState::getDepthBiasEnabled, &ems::RasterizerState::setDepthBiasEnabled)
        .property("depthBias", &ems::RasterizerState::getDepthBias, &ems::RasterizerState::setDepthBias)
        .property("depthBiasClamp", &ems::RasterizerState::getDepthBiasClamp, &ems::RasterizerState::setDepthBiasClamp)
        .property("depthBiasSlop", &ems::RasterizerState::getDepthBiasSlop, &ems::RasterizerState::setDepthBiasSlop)
        .property("isDepthClip", &ems::RasterizerState::getDepthClip, &ems::RasterizerState::setDepthClip)
        .property("isMultisample", &ems::RasterizerState::getMultiSample, &ems::RasterizerState::setMultiSample)
        .property("isAntialiasedLine", &ems::RasterizerState::getLineWidth, &ems::RasterizerState::setLineWidth);

    class_<ems::InputState>("InputState")
        .constructor<>()
        .constructor<val>()
        .property("attributes", &ems::InputState::getAttrs, &ems::InputState::setAttrs);

    class_<ems::ShaderInfo>("ShaderInfo")
        .constructor<>()
        .constructor<String>()
        .constructor<String, val>()
        .constructor<String, val, val>()
        .constructor<String, val, val, val>()
        .constructor<String, val, val, val, val>()
        .constructor<String, val, val, val, val, val>()
        .constructor<String, val, val, val, val, val, val>()
        .constructor<String, val, val, val, val, val, val, val>()
        .constructor<String, val, val, val, val, val, val, val, val>()
        .constructor<String, val, val, val, val, val, val, val, val, val>()
        .property("name", &ems::ShaderInfo::getName, &ems::ShaderInfo::setName)
        .property("stages", &ems::ShaderInfo::getStageList, &ems::ShaderInfo::setStageList)
        .property("attributes", &ems::ShaderInfo::getAttrs, &ems::ShaderInfo::setAttrs)
        .property("blocks", &ems::ShaderInfo::getBlocks, &ems::ShaderInfo::setBlocks)
        .property("buffers", &ems::ShaderInfo::getBuffers, &ems::ShaderInfo::setBuffers)
        .property("samplerTextures", &ems::ShaderInfo::getSamplerTextures, &ems::ShaderInfo::setSamplerTextures)
        .property("samplers", &ems::ShaderInfo::getSamplers, &ems::ShaderInfo::setSamplers)
        .property("textures", &ems::ShaderInfo::getTextures, &ems::ShaderInfo::setTextures)
        .property("images", &ems::ShaderInfo::getImages, &ems::ShaderInfo::setImages)
        .property("subpassInputs", &ems::ShaderInfo::getSubpassInputs, &ems::ShaderInfo::setSubpassInputs);

    class_<ems::UniformTexture>("UniformTexture")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, String>()
        .constructor<uint32_t, uint32_t, String, ems::Type::type>()
        .constructor<uint32_t, uint32_t, String, ems::Type::type, uint32_t>()
        .property("set", &ems::UniformTexture::getSet, &ems::UniformTexture::setSet)
        .property("binding", &ems::UniformTexture::getBinding, &ems::UniformTexture::setBinding)
        .property("name", &ems::UniformTexture::getName, &ems::UniformTexture::setName)
        .property("type", &ems::UniformTexture::getType, &ems::UniformTexture::setType)
        .property("count", &ems::UniformTexture::getCount, &ems::UniformTexture::setCount);

    class_<ems::UniformSamplerTexture>("UniformSamplerTexture")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, String>()
        .constructor<uint32_t, uint32_t, String, ems::Type::type>()
        .constructor<uint32_t, uint32_t, String, ems::Type::type, uint32_t>()
        .property("set", &ems::UniformSamplerTexture::getSet, &ems::UniformSamplerTexture::setSet)
        .property("binding", &ems::UniformSamplerTexture::getBinding, &ems::UniformSamplerTexture::setBinding)
        .property("name", &ems::UniformSamplerTexture::getName, &ems::UniformSamplerTexture::setName)
        .property("type", &ems::UniformSamplerTexture::getType, &ems::UniformSamplerTexture::setType)
        .property("count", &ems::UniformSamplerTexture::getCount, &ems::UniformSamplerTexture::setCount);

    class_<ems::UniformStorageBuffer>("UniformStorageBuffer")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, String>()
        .constructor<uint32_t, uint32_t, String, uint32_t>()
        .constructor<uint32_t, uint32_t, String, uint32_t, ems::MemoryAccessBit::type>()
        .property("set", &ems::UniformStorageBuffer::getSet, &ems::UniformStorageBuffer::setSet)
        .property("binding", &ems::UniformStorageBuffer::getBinding, &ems::UniformStorageBuffer::setBinding)
        .property("name", &ems::UniformStorageBuffer::getName, &ems::UniformStorageBuffer::setName)
        .property("count", &ems::UniformStorageBuffer::getCount, &ems::UniformStorageBuffer::setCount)
        .property("memoryAccess", &ems::UniformStorageBuffer::getMemAccess, &ems::UniformStorageBuffer::setMemAccess);

    class_<Uniform>("Uniform")
        .constructor<>()
        .constructor(&ems::getUniform_1)
        .constructor(&ems::getUniform_2)
        .constructor(&ems::getUniform_3)
        .property("name", &Uniform::name)
        .property("type", &ems::getUniformType, &ems::setUniformType)
        .property("count", &Uniform::count);

    class_<ems::Attribute>("Attribute")
        .constructor<>()
        .constructor<String>()
        .constructor<String, ems::Format::type>()
        .constructor<String, ems::Format::type, bool>()
        .constructor<String, ems::Format::type, bool, uint32_t>()
        .constructor<String, ems::Format::type, bool, uint32_t, bool>()
        .constructor<String, ems::Format::type, bool, uint32_t, bool, uint32_t>()
        .property("name", &ems::Attribute::getName, &ems::Attribute::setName)
        .property("format", &ems::Attribute::getFormat, &ems::Attribute::setFormat)
        .property("isNormalized", &ems::Attribute::getNormalized, &ems::Attribute::setNormalized)
        .property("stream", &ems::Attribute::getStream, &ems::Attribute::setStream)
        .property("isInstanced", &ems::Attribute::getInstanced, &ems::Attribute::setInstanced)
        .property("location", &ems::Attribute::getLocation, &ems::Attribute::setLocation);

    class_<ems::SamplerInfo>("SamplerInfo")
        .constructor<>()
        .constructor<ems::Filter::type>()
        .constructor<ems::Filter::type, ems::Filter::type>()
        .constructor<ems::Filter::type, ems::Filter::type, ems::Filter::type>()
        .constructor<ems::Filter::type, ems::Filter::type, ems::Filter::type, ems::Address::type>()
        .constructor<ems::Filter::type, ems::Filter::type, ems::Filter::type, ems::Address::type, ems::Address::type>()
        .constructor<ems::Filter::type, ems::Filter::type, ems::Filter::type, ems::Address::type, ems::Address::type, ems::Address::type>()
        .constructor<ems::Filter::type, ems::Filter::type, ems::Filter::type, ems::Address::type, ems::Address::type, ems::Address::type, float>()
        .constructor<ems::Filter::type, ems::Filter::type, ems::Filter::type, ems::Address::type, ems::Address::type, ems::Address::type, float, float>()
        .property("minFilter", &ems::SamplerInfo::getMinFilter, &ems::SamplerInfo::setMinFilter)
        .property("magFilter", &ems::SamplerInfo::getMagFilter, &ems::SamplerInfo::setMagFilter)
        .property("mipFilter", &ems::SamplerInfo::getMipmapFilter, &ems::SamplerInfo::setMipmapFilter)
        .property("addressU", &ems::SamplerInfo::getAddressU, &ems::SamplerInfo::setAddressU)
        .property("addressV", &ems::SamplerInfo::getAddressV, &ems::SamplerInfo::setAddressV)
        .property("addressW", &ems::SamplerInfo::getAddressW, &ems::SamplerInfo::setAddressW)
        .property("maxAnisotropy", &ems::SamplerInfo::getMaxAnisotropy, &ems::SamplerInfo::setMaxAnisotropy)
        .property("cmpFunc", &ems::SamplerInfo::getCmpFunc, &ems::SamplerInfo::setCmpFunc);

    class_<ems::GeneralBarrierInfo>("GeneralBarrierInfo")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, uint32_t>()
        .property("prevAccesses", &ems::GeneralBarrierInfo::getPrevAccess, &ems::GeneralBarrierInfo::setPrevAccess)
        .property("nextAccess", &ems::GeneralBarrierInfo::getNextAccess, &ems::GeneralBarrierInfo::setNextAccess)
        .property("type", &ems::GeneralBarrierInfo::getBarrierType, &ems::GeneralBarrierInfo::setBarrierType);

    class_<ems::ShaderStage>("ShaderStage")
        .constructor<>()
        .constructor<ems::ShaderStageFlagBit::type>()
        .constructor<ems::ShaderStageFlagBit::type, String>()
        .property("stage", &ems::ShaderStage::getStage, &ems::ShaderStage::setStage)
        .property("source", &ems::ShaderStage::getSource, &ems::ShaderStage::setSource);

    class_<ems::UniformStorageImage>("UniformStorageImage")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, String>()
        .constructor<uint32_t, uint32_t, String, ems::Type::type>()
        .constructor<uint32_t, uint32_t, String, ems::Type::type, uint32_t>()
        .constructor<uint32_t, uint32_t, String, ems::Type::type, uint32_t, ems::MemoryUsageBit::type>()
        .property("set", &ems::UniformStorageImage::getSet, &ems::UniformStorageImage::setSet)
        .property("binding", &ems::UniformStorageImage::getBinding, &ems::UniformStorageImage::setBinding)
        .property("name", &ems::UniformStorageImage::getName, &ems::UniformStorageImage::setName)
        .property("type", &ems::UniformStorageImage::getType, &ems::UniformStorageImage::setType)
        .property("count", &ems::UniformStorageImage::getCount, &ems::UniformStorageImage::setCount)
        .property("memoryAccess", &ems::UniformStorageImage::getMemAccess, &ems::UniformStorageImage::setMemAccess);

    class_<ems::DescriptorSetLayoutBinding>("DescriptorSetLayoutBinding")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, ems::DescriptorType::type>()
        .constructor<uint32_t, ems::DescriptorType::type, uint32_t>()
        .constructor<uint32_t, ems::DescriptorType::type, uint32_t, ems::ShaderStageFlagBit::type>()
        .constructor<uint32_t, ems::DescriptorType::type, uint32_t, ems::ShaderStageFlagBit::type, val>()
        .property("binding", &ems::DescriptorSetLayoutBinding::getBinding, &ems::DescriptorSetLayoutBinding::setBinding)
        .property("descriptorType", &ems::DescriptorSetLayoutBinding::getDescriptorType, &ems::DescriptorSetLayoutBinding ::setDescriptorType)
        .property("count", &ems::DescriptorSetLayoutBinding::getCount, &ems::DescriptorSetLayoutBinding::setCount)
        .property("stageFlags", &ems::DescriptorSetLayoutBinding::getStageFlags, &ems::DescriptorSetLayoutBinding::setStageFlags)
        .property("immutableSamplers", &ems::DescriptorSetLayoutBinding::getSamplers, &ems::DescriptorSetLayoutBinding::setSamplers);

    class_<ems::FormatInfo>("FormatInfo")
        .constructor<>()
        .constructor<String>()
        .constructor<String, uint32_t>()
        .constructor<String, uint32_t, uint32_t>()
        .constructor<String, uint32_t, uint32_t, ems::FormatType::type>()
        .constructor<String, uint32_t, uint32_t, ems::FormatType::type, bool>()
        .constructor<String, uint32_t, uint32_t, ems::FormatType::type, bool, bool>()
        .constructor<String, uint32_t, uint32_t, ems::FormatType::type, bool, bool, bool>()
        .constructor<String, uint32_t, uint32_t, ems::FormatType::type, bool, bool, bool, bool>()
        .property("name", &ems::FormatInfo::getName)
        .property("size", &ems::FormatInfo::getSize)
        .property("count", &ems::FormatInfo::getCount)
        .property("type", &ems::FormatInfo::getType)
        .property("hasAlpha", &ems::FormatInfo::getAlpha)
        .property("hasDepth", &ems::FormatInfo::getDepth)
        .property("hasStencil", &ems::FormatInfo::getStencil)
        .property("isCompressed", &ems::FormatInfo::getCompressed);

    class_<ems::BufferInfo>("BufferInfo")
        .constructor<>()
        .constructor<ems::BufferUsageBit::type>()
        .constructor<ems::BufferUsageBit::type, ems::BufferFlagBit::type>()
        .constructor<ems::BufferUsageBit::type, ems::BufferFlagBit::type, uint32_t>()
        .constructor<ems::BufferUsageBit::type, ems::BufferFlagBit::type, uint32_t, uint32_t>()
        .constructor<ems::BufferUsageBit::type, ems::BufferFlagBit::type, uint32_t, uint32_t, ems::BufferFlagBit::type>()
        .property("usage", &ems::BufferInfo::getUsage, &ems::BufferInfo::setUsage)
        .property("memUsage", &ems::BufferInfo::getMemUsage, &ems::BufferInfo::setMemUsage)
        .property("size", &ems::BufferInfo::getSize, &ems::BufferInfo::setSize)
        .property("stride", &ems::BufferInfo::getStride, &ems::BufferInfo::setStride)
        .property("flags", &ems::BufferInfo::getFlags, &ems::BufferInfo::setFlags);

    class_<ems::UniformBlock>("UniformBlock")
        .constructor<>()
        .constructor<uint32_t>()
        .constructor<uint32_t, uint32_t>()
        .constructor<uint32_t, uint32_t, const String &>()
        .constructor<uint32_t, uint32_t, const String &, val>()
        .constructor<uint32_t, uint32_t, const std::string &, val, uint32_t>()
        .property("set", &ems::UniformBlock::getSet, &ems::UniformBlock::setSet)
        .property("binding", &ems::UniformBlock::getBinding, &ems::UniformBlock::setBinding)
        .property("name", &ems::UniformBlock::getName, &ems::UniformBlock::setName)
        .property("members", &ems::UniformBlock::getUniforms, &ems::UniformBlock::setUniforms)
        .property("count", &ems::UniformBlock::getCount, &ems::UniformBlock::setCount);

    // struct with pointers
    class_<TextureInfo>("TextureInfo")
        .constructor<>(select_overload<TextureInfo()>([]() { return TextureInfo(); }))
        .constructor(&ems::getTextureInfo_1, allow_raw_pointers())
        .constructor(&ems::getTextureInfo_2, allow_raw_pointers())
        .constructor(&ems::getTextureInfo_3, allow_raw_pointers())
        .constructor(&ems::getTextureInfo_5, allow_raw_pointers())
        .constructor(&ems::getTextureInfo_6, allow_raw_pointers())
        .constructor(&ems::getTextureInfo_7, allow_raw_pointers())
        .constructor(&ems::getTextureInfo_8, allow_raw_pointers())
        .constructor(&ems::getTextureInfo_9, allow_raw_pointers())
        .constructor(&ems::getTextureInfo_10, allow_raw_pointers())
        .property("type", &ems::getTextureInfoType, &ems::setTextureInfoType)
        .property("usage", &ems::getTextureInfoUsage, &ems::setTextureInfoUsage)
        .property("format", &ems::getTextureInfoFormat, &ems::setTextureInfoFormat)
        .property("width", &TextureInfo::width)
        .property("height", &TextureInfo::height)
        .property("flags", &ems::getTextureInfoFlags, &ems::setTextureInfoFlags)
        .property("layerCount", &TextureInfo::layerCount)
        .property("levelCount", &TextureInfo::levelCount)
        .property("samples", &ems::getTextureInfoSamples, &ems::setTextureInfoSamples)
        .property("depth", &TextureInfo::depth);

    // .constructor<TextureType::type, >(select_overload<TextureInfo(TextureType::type)>([](TextureType::type) {
    //     return TextureInfo(TextureType::type());
    // }))
    // .constructor<ems::TextureType::type, ems::TextureUsageBit::type>()
    // .constructor<ems::TextureType::type, ems::TextureUsageBit::type, ems::Format::type>()
    // .constructor<ems::TextureType::type, ems::TextureUsageBit::type, ems::Format::type, uint32_t, uint32_t>()
    // .constructor<ems::TextureType::type, ems::TextureUsageBit::type, ems::Format::type, uint32_t, uint32_t, ems::TextureFlagBit::type>()
    // .constructor<ems::TextureType::type, ems::TextureUsageBit::type, ems::Format::type, uint32_t, uint32_t, ems::TextureFlagBit::type, uint32_t>()
    // .constructor<ems::TextureType::type, ems::TextureUsageBit::type, ems::Format::type, uint32_t, uint32_t, ems::TextureFlagBit::type, uint32_t, uint32_t>()
    // .constructor<ems::TextureType::type, ems::TextureUsageBit::type, ems::Format::type, uint32_t, uint32_t, ems::TextureFlagBit::type, uint32_t, uint32_t, ems::SampleCount::type>()
    // .constructor<ems::TextureType::type, ems::TextureUsageBit::type, ems::Format::type, uint32_t, uint32_t, ems::TextureFlagBit::type, uint32_t, uint32_t, ems::SampleCount::type, uint32_t>()
    // .constructor<ems::TextureType::type, ems::TextureUsageBit::type, ems::Format::type, uint32_t, uint32_t, ems::TextureFlagBit::type, uint32_t, uint32_t, ems::SampleCount::type, uint32_t, uint32_t>()
    // .property("type", &ems::TextureInfo::getType, &ems::TextureInfo::setType)
    // .property("usage", &ems::TextureInfo::getUsage, &ems::TextureInfo::setUsage)
    // .property("format", &ems::TextureInfo::getFormat, &ems::TextureInfo::setFormat)
    // .property("width", &ems::TextureInfo::getWidth, &ems::TextureInfo::setWidth)
    // .property("height", &ems::TextureInfo::getHeight, &ems::TextureInfo::setHeight)
    // .property("flags", &ems::TextureInfo::getFlags, &ems::TextureInfo::setFlags)
    // .property("levelCount", &ems::TextureInfo::getLevelCount, &ems::TextureInfo::setLevelCount)
    // .property("layerCount", &ems::TextureInfo::getLayerCount, &ems::TextureInfo::setLayerCount)
    // .property("samples", &ems::TextureInfo::getSamples, &ems::TextureInfo::setSamples)
    // .property("depth", &ems::TextureInfo::getDepth, &ems::TextureInfo::setDepth)
    // .property("externalRes", &ems::TextureInfo::getImageBuffer, &ems::TextureInfo::setImageBuffer);

    // class_<TextureViewInfo>("TextureViewInfo")
    //     // .constructor<>()
    //     .constructor<>(select_overload<TextureViewInfo()>([]() {
    //         return TextureViewInfo{};
    //     }))
    //     .constructor<>(select_overload<TextureViewInfo(uint32_t)>([](uint32_t c) {
    //         return TextureViewInfo{nullptr, TextureType::TEX2D, Format::RGBA16F, c};
    //     }))
    //     .property("tex", &TextureViewInfo::baseLevel);

    class_<ems::TextureViewInfo>("TextureViewInfo")
        .constructor<>()
        .constructor<Texture *>()
        .constructor<Texture *, uint32_t>()
        .constructor<Texture *, uint32_t, uint32_t>()
        .constructor<Texture *, uint32_t, uint32_t, uint32_t, uint32_t>()
        .constructor<Texture *, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t>()
        .function("setTexture", &ems::TextureViewInfo::setTexture, allow_raw_pointer<arg<0>>())
        .function("getTexture", &ems::TextureViewInfo::getTexture, allow_raw_pointer<arg<0>>())
        .property("type", &ems::TextureViewInfo::getType, &ems::TextureViewInfo::setType)
        .property("format", &ems::TextureViewInfo::getFormat, &ems::TextureViewInfo::setFormat)
        .property("baseLevel", &ems::TextureViewInfo::getBaseLevel, &ems::TextureViewInfo::setBaseLevel)
        .property("levelCount", &ems::TextureViewInfo::getLevelCount, &ems::TextureViewInfo::setLevelCount)
        .property("baseLayer", &ems::TextureViewInfo::getBaseLayer, &ems::TextureViewInfo::setBaseLayer)
        .property("layerCount", &ems::TextureViewInfo::getLayerCount, &ems::TextureViewInfo::setLayerCount);

    class_<ems::FramebufferInfo>("FramebufferInfo")
        .constructor<>()
        .constructor<RenderPass *>()
        .constructor<RenderPass *, val>()
        .constructor<RenderPass *, val, Texture *>()
        .function("setRenderPass", &ems::FramebufferInfo::setRenderPass, allow_raw_pointer<arg<0>>())
        .function("setColorTextures", &ems::FramebufferInfo::setColorTextures, allow_raw_pointer<arg<0>>())
        .function("setDepthStencilTexture", &ems::FramebufferInfo::setDepthStencilTexture, allow_raw_pointer<arg<0>>());

    class_<ems::SwapchainInfo>("SwapchainInfo")
        .constructor<>()
        .constructor<const val &>()
        .constructor<const val &, ems::VsyncMode::type>()
        .constructor<const val &, ems::VsyncMode::type, uint32_t>()
        .constructor<const val &, ems::VsyncMode::type, uint32_t, uint32_t>()
        .function("setWindowHandle", &ems::SwapchainInfo::setWindowHandle)
        .property("vsyncMode", &ems::SwapchainInfo::getVsyncMode, &ems::SwapchainInfo::setVsyncMode)
        .property("width", &ems::SwapchainInfo::getWidth, &ems::SwapchainInfo::setWidth)
        .property("height", &ems::SwapchainInfo::getHeight, &ems::SwapchainInfo::setHeight);

    class_<ems::BufferViewInfo>("BufferViewInfo")
        .constructor<>()
        .constructor<Buffer *>()
        .constructor<Buffer *, uint32_t>()
        .constructor<Buffer *, uint32_t, uint32_t>()
        .function("getBuffer", &ems::BufferViewInfo::getBuffer, allow_raw_pointer<arg<0>>())
        .function("getOffset", &ems::BufferViewInfo::getOffset)
        .function("getRange", &ems::BufferViewInfo::getRange)
        .function("setBuffer", &ems::BufferViewInfo::setBuffer, allow_raw_pointer<arg<0>>())
        .function("setOffset", &ems::BufferViewInfo::setOffset)
        .function("setRange", &ems::BufferViewInfo::setRange);

    class_<ems::DescriptorSetInfo>("DescriptorSetInfo")
        .constructor<>()
        .constructor<DescriptorSetLayout *>()
        .function("setDescriptorSetLayout", &ems::DescriptorSetInfo::setDescriptorSetLayout, allow_raw_pointer<arg<0>>())
        .function("getDescriptorSetLayout", &ems::DescriptorSetInfo::getDescriptorSetLayout, allow_raw_pointer<arg<0>>());

    class_<ems::PipelineStateInfo>("PipelineStateInfo")
        .constructor<>()
        .function("setShader", &ems::PipelineStateInfo::setShader, allow_raw_pointer<arg<0>>())
        .function("setPipelineLayout", &ems::PipelineStateInfo::setPipelineLayout, allow_raw_pointer<arg<0>>())
        .function("setRenderPass", &ems::PipelineStateInfo::setRenderPass, allow_raw_pointer<arg<0>>())
        .function("setInputState", &ems::PipelineStateInfo::setInputState)
        .function("setRasterizerState", &ems::PipelineStateInfo::setRasterizerState)
        .function("setDepthStencilState", &ems::PipelineStateInfo::setDepthStencilState)
        .function("setBlendState", &ems::PipelineStateInfo::setBlendState)
        .function("setPrimitiveMode", &ems::PipelineStateInfo::setPrimitiveMode)
        .function("setDynamicStateFlags", &ems::PipelineStateInfo::setDynamicStateFlags)
        .function("setPipelineBindPoint", &ems::PipelineStateInfo::setPipelineBindPoint)
        .function("setSubpass", &ems::PipelineStateInfo::setSubpass);

    class_<ems::InputAssemblerInfo>("InputAssemblerInfo")
        .constructor<>()
        .constructor<val>()
        .constructor<val, val>()
        .constructor<val, val, Buffer *>()
        .constructor<val, val, Buffer *, Buffer *>()
        .function("setAttributes", &ems::InputAssemblerInfo::setAttributes)
        .function("setBuffers", &ems::InputAssemblerInfo::setBuffers)
        .function("setIndexBuffer", &ems::InputAssemblerInfo::setIndexBuffer, allow_raw_pointer<arg<0>>())
        .function("setIndirectBuffer", &ems::InputAssemblerInfo::setIndirectBuffer, allow_raw_pointer<arg<0>>());

    class_<ems::CommandBufferInfo>("CommandBufferInfo")
        .constructor<>()
        .constructor<Queue *>()
        .constructor<Queue *, ems::CommandBufferType::type>()
        .function("setQueue", &ems::CommandBufferInfo::setQueue, allow_raw_pointer<arg<0>>())
        .function("setType", &ems::CommandBufferInfo::setType, allow_raw_pointer<arg<0>>());

    // class_<ems::DescriptorSetLayoutBinding>("DescriptorSetLayoutBinding")
    //     .constructor<>()
    //     .function("setBinding", &ems::DescriptorSetLayoutBinding::setBinding)
    //     .function("setDescriptorType", &ems::DescriptorSetLayoutBinding::setDescriptorType)
    //     .function("setCount", &ems::DescriptorSetLayoutBinding::setCount)
    //     .function("setStageFlags", &ems::DescriptorSetLayoutBinding::setStageFlags)
    //     .function("setImmutableSamplers", &ems::DescriptorSetLayoutBinding::setImmutableSamplers);

    class_<ems::DescriptorSetLayoutInfo>("DescriptorSetLayoutInfo")
        .constructor<>()
        .constructor<val>()
        .property("bindings", &ems::DescriptorSetLayoutInfo::getBindings, &ems::DescriptorSetLayoutInfo::setBindings);

    class_<ems::ColorAttachment>("ColorAttachment")
        .constructor<>()
        .constructor<ems::Format::type>()
        .constructor<ems::Format::type, ems::SampleCount::type>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type, ems::StoreOp::type>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type, ems::StoreOp::type, val>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type, ems::StoreOp::type, val, bool>()
        .property("format", &ems::ColorAttachment::getFormat, &ems::ColorAttachment::setFormat)
        .property("sampleCount", &ems::ColorAttachment::getSampleCount, &ems::ColorAttachment::setSampleCount)
        .property("loadOp", &ems::ColorAttachment::getLoadOp, &ems::ColorAttachment::setLoadOp)
        .property("storeOp", &ems::ColorAttachment::getStoreOp, &ems::ColorAttachment::setStoreOp)
        .property("barrier", &ems::ColorAttachment::getBarrier, &ems::ColorAttachment::setBarrier)
        .property("isGeneralLayout", &ems::ColorAttachment::getGeneralLayout, &ems::ColorAttachment::setGeneralLayout);

    class_<ems::DeviceInfo>("DeviceInfo")
        .constructor<>()
        .constructor<const ems::BindingMappingInfo>()
        .property("bindingMappingInfo", &ems::DeviceInfo::getBindingInfo, &ems::DeviceInfo::setBindingInfo);

    class_<ems::BindingMappingInfo>("BindingMappingInfo")
        .constructor<>()
        .constructor<const val &>()
        .constructor<const val &, const val &>()
        .constructor<const val &, const val &, const val &>()
        .constructor<const val &, const val &, const val &, const val &>()
        .constructor<const val &, const val &, const val &, const val &, const val &>()
        .constructor<const val &, const val &, const val &, const val &, const val &, const val &>()
        .constructor<const val &, const val &, const val &, const val &, const val &, const val &, const val &>()
        .constructor<const val &, const val &, const val &, const val &, const val &, const val &, const val &, const val &>()
        .property("maxBlockCounts", &ems::BindingMappingInfo::getMaxBlockCounts, &ems::BindingMappingInfo::setMaxBlockCounts)
        .property("maxSamplerTextureCounts", &ems::BindingMappingInfo::getMaxSamplerTextureCounts, &ems::BindingMappingInfo::setMaxSamplerTextureCounts)
        .property("maxSamplerCounts", &ems::BindingMappingInfo::getMaxSamplerCounts, &ems::BindingMappingInfo::setMaxSamplerCounts)
        .property("maxTextureCounts", &ems::BindingMappingInfo::getMaxTextureCounts, &ems::BindingMappingInfo::setMaxTextureCounts)
        .property("maxBufferCounts", &ems::BindingMappingInfo::getMaxBufferCounts, &ems::BindingMappingInfo::setMaxBufferCounts)
        .property("maxImageCounts", &ems::BindingMappingInfo::getMaxImageCounts, &ems::BindingMappingInfo::setMaxImageCounts)
        .property("maxSubpassInputCounts", &ems::BindingMappingInfo::getMaxSubpassInputCounts, &ems::BindingMappingInfo::setMaxSubpassInputCounts)
        .property("setIndices", &ems::BindingMappingInfo::getSetIndices, &ems::BindingMappingInfo::setSetIndices);

    class_<ems::DepthStencilAttachment>("DepthStencilAttachment")
        .constructor<>()
        .constructor<ems::Format::type>()
        .constructor<ems::Format::type, ems::SampleCount::type>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type, ems::StoreOp::type>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type, ems::StoreOp::type, ems::LoadOp::type>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type, ems::StoreOp::type, ems::LoadOp::type, ems::StoreOp::type>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type, ems::StoreOp::type, ems::LoadOp::type, ems::StoreOp::type, val>()
        .constructor<ems::Format::type, ems::SampleCount::type, ems::LoadOp::type, ems::StoreOp::type, ems::LoadOp::type, ems::StoreOp::type, val, bool>()
        .property("format", &ems::DepthStencilAttachment::getFormat, &ems::DepthStencilAttachment::setFormat)
        .property("sampleCount", &ems::DepthStencilAttachment::getSampleCount, &ems::DepthStencilAttachment::setSampleCount)
        .property("depthLoadOp", &ems::DepthStencilAttachment::getDepthLoadOp, &ems::DepthStencilAttachment::setDepthLoadOp)
        .property("depthStoreOp", &ems::DepthStencilAttachment::getDepthStoreOp, &ems::DepthStencilAttachment::setDepthStoreOp)
        .property("stencilLoadOp", &ems::DepthStencilAttachment::getStencilLoadOp, &ems::DepthStencilAttachment::setStencilLoadOp)
        .property("stencilStoreOp", &ems::DepthStencilAttachment::getStencilStoreOp, &ems::DepthStencilAttachment::setStencilStoreOp)
        .property("barrier", &ems::DepthStencilAttachment::getBarrier, &ems::DepthStencilAttachment::setBarrier)
        .property("isGeneralLayout", &ems::DepthStencilAttachment::getGeneralLayout, &ems::DepthStencilAttachment::setGeneralLayout);

    // class_<ems::SubpassInfo>("SubpassInfo")
    //     .constructor<>()
    //     .constructor<val>()
    //     .constructor<val, val>()
    //     .constructor<val, val, val>()
    //     .constructor<val, val, val, val>()
    //     .constructor<val, val, val, val, uint32_t>()
    //     .constructor<val, val, val, val, uint32_t, uint32_t>()
    //     .constructor<val, val, val, val, uint32_t, uint32_t, ems::ResolveMode::type>()
    //     .constructor<val, val, val, val, uint32_t, uint32_t, ems::ResolveMode::type, ems::ResolveMode::type>()
    //     .property("inputs", &ems::SubpassInfo::getInputs, &ems::SubpassInfo::setInputs)
    //     .property("colors", &ems::SubpassInfo::getColors, &ems::SubpassInfo::setColors)
    //     .property("resolves", &ems::SubpassInfo::getResolves, &ems::SubpassInfo::setResolves)
    //     .property("preserves", &ems::SubpassInfo::getPreserves, &ems::SubpassInfo::setPreserves)
    //     .property("depthStencil", &ems::SubpassInfo::getDepthStencil, &ems::SubpassInfo::setDepthStencil)
    //     .property("depthStencilResolve", &ems::SubpassInfo::getDSResolve, &ems::SubpassInfo::setDSResolve)
    //     .property("depthResolveMode", &ems::SubpassInfo::getDRMode, &ems::SubpassInfo::setDRMode)
    //     .property("stencilResolveMode", &ems::SubpassInfo::getSRMode, &ems::SubpassInfo::setSRMode);

    // class_<ems::SubpassDependency>("SubpassDependency")
    //     .constructor<>()
    //     .constructor<uint32_t>()
    //     .constructor<uint32_t, uint32_t>()
    //     .constructor<uint32_t, uint32_t, val>()
    //     .property("srcSubpass", &ems::SubpassDependency::getSrcSubpass, &ems::SubpassDependency::setSrcSubpass)
    //     .property("dstSubpass", &ems::SubpassDependency::getDstSubpass, &ems::SubpassDependency::setDstSubpass)
    //     .property("barrier", &ems::SubpassDependency::getBarrier, &ems::SubpassDependency::setBarrier);

    class_<ems::RenderPassInfo>("RenderPassInfo")
        .constructor<>()
        .constructor<val>()
        .constructor<val, const ems::DepthStencilAttachment &>()
        .constructor<val, const ems::DepthStencilAttachment &, val>()
        .constructor<val, const ems::DepthStencilAttachment &, val, val>()
        .property("colorAttachments", &ems::RenderPassInfo::getColors, &ems::RenderPassInfo::setColors)
        .property("depthStencilAttachment", &ems::RenderPassInfo::getDepthStencil, &ems::RenderPassInfo::setDepthStencil)
        .property("subpasses", &ems::RenderPassInfo::getSubpasses, &ems::RenderPassInfo::setSubpasses)
        .property("dependencies", &ems::RenderPassInfo::getDependencies, &ems::RenderPassInfo::setDependencies);

    // EXPORT_STRUCT_WITH_PTR(ems::TextureInfo, TextureInfo, setType, setUsage, setFormat, setWidth, setHeight, setFlags, setLevelCount, setLayerCount,
    //                     setSamples,setDepth, setImageBuffer);

    class_<ems::SPVShaderInfo>("SPVShaderInfo")
        .constructor<>()
        .function("setName", &ems::SPVShaderInfo::setName)
        .function("setStages", &ems::SPVShaderInfo::setStages)
        .function("setAttributes", &ems::SPVShaderInfo::setAttributes)
        .function("setBlocks", &ems::SPVShaderInfo::setBlocks)
        .function("setBuffers", &ems::SPVShaderInfo::setBuffers)
        .function("setSamplerTextures", &ems::SPVShaderInfo::setSamplerTextures)
        .function("setTextures", &ems::SPVShaderInfo::setTextures)
        .function("setSamplers", &ems::SPVShaderInfo::setSamplers)
        .function("setImages", &ems::SPVShaderInfo::setImages)
        .function("setSubpasses", &ems::SPVShaderInfo::setSubpasses);

    class_<ems::SPVShaderStage>("SPVShaderStage")
        .constructor<>()
        .function("setStage", &ems::SPVShaderStage::setStage)
        .function("setSPVData", &ems::SPVShaderStage::setSPVData);

    class_<ems::PipelineLayoutInfo>("PipelineLayoutInfo")
        .constructor<>()
        .constructor<val>()
        .property("setLayouts", &ems::PipelineLayoutInfo::getSetLayouts, &ems::PipelineLayoutInfo::setSetLayouts);

    //--------------------------------------------------CLASS---------------------------------------------------------------------------
    class_<cc::gfx::Swapchain>("Swapchain")
        .function("initialize", &cc::gfx::Swapchain::initialize, allow_raw_pointer<arg<0>>())
        .function("destroy", &cc::gfx::Swapchain::destroy)
        .function("resize", select_overload<void(uint32_t, uint32_t, SurfaceTransform)>(&cc::gfx::Swapchain::resize))
        .function("destroySurface", &cc::gfx::Swapchain::destroySurface)
        .function("createSurface", &cc::gfx::Swapchain::createSurface, allow_raw_pointer<arg<0>>())
        .function("getWidth", &cc::gfx::Swapchain::getWidth)
        .function("getHeight", &cc::gfx::Swapchain::getHeight);
    class_<CCWGPUSwapchain, base<Swapchain>>("CCWGPUSwapchain")
        /* .property("colorTexture", &CCWGPUSwapchain::getColorTexture, &CCWGPUSwapchain::setColorTexture, allow_raw_pointer<arg<0>>())
        .property("depthSteniclTexture", &CCWGPUSwapchain::getDepthStencilTexture, &CCWGPUSwapchain::setDepthStencilTexture, allow_raw_pointer<arg<0>>()); */
        .function("getColorTexture", &CCWGPUSwapchain::getColorTexture, allow_raw_pointers())
        .function("setColorTexture", &CCWGPUSwapchain::setColorTexture, allow_raw_pointers())
        .function("getDepthStencilTexture", &CCWGPUSwapchain::getDepthStencilTexture, allow_raw_pointers())
        .function("setDepthStencilTexture", &CCWGPUSwapchain::setDepthStencilTexture, allow_raw_pointers());

    class_<Device>("Device")
        // .function("initialize", &Device::initialize, allow_raw_pointer<arg<0>>())
        .function("destroy", &Device::destroy, pure_virtual())
        .function("present", &Device::present, pure_virtual())
        .function("createQueue", select_overload<Queue *(const QueueInfo &)>(&Device::createQueue),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        // .function("getSampler", &Device::getSampler, allow_raw_pointer<arg<0>>())
        // .function("createGlobalBarrier", select_overload<GlobalBarrier*(const GlobalBarrierInfo&)>(&Device::createGlobalBarrier),
        //           /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        // .function("createTextureBarrier", select_overload<TextureBarrier*(const TextureBarrierInfo&)>(&Device::createTextureBarrier),
        //           /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("getCommandBuffer", &Device::getCommandBuffer, allow_raw_pointers())
        .function("getQueue", &Device::getQueue, allow_raw_pointers())
        .function("present", select_overload<void(void)>(&Device::present),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .property("capabilities", &Device::getCapabilities);
    class_<CCWGPUDevice, base<Device>>("CCWGPUDevice")
        // .class_function("getInstance", &CCWGPUDevice::getInstance, allow_raw_pointer<arg<0>>())
        .constructor<>()
        .function("debug", &CCWGPUDevice::debug)
        .function("initialize", select_overload<void(const emscripten::val &)>(&CCWGPUDevice::initialize))
        .function("acquire", select_overload<void(const emscripten::val &)>(&CCWGPUDevice::acquire),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createSwapchain", select_overload<Swapchain *(const emscripten::val &)>(&CCWGPUDevice::createSwapchain),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("createRenderPass", select_overload<RenderPass *(const emscripten::val &)>(&CCWGPUDevice::createRenderPass),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createCommandBuffer", select_overload<CommandBuffer *(const ems::CommandBufferInfo &)>(&CCWGPUDevice::createCommandBuffer),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createFramebuffer", select_overload<Framebuffer *(const emscripten::val &)>(&CCWGPUDevice::createFramebuffer),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createBuffer", select_overload<Buffer *(const emscripten::val &)>(&CCWGPUDevice::createBuffer),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createTexture", select_overload<Texture *(const emscripten::val &)>(&CCWGPUDevice::createTexture),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createShader", select_overload<Shader *(const val &)>(&CCWGPUDevice::createShader),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createDescriptorSetLayout", select_overload<DescriptorSetLayout *(const emscripten::val &)>(&CCWGPUDevice::createDescriptorSetLayout),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createInputAssembler", select_overload<InputAssembler *(const emscripten::val &)>(&CCWGPUDevice::createInputAssembler),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createPipelineState", select_overload<PipelineState *(const ems::PipelineStateInfo &)>(&CCWGPUDevice::createPipelineState),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createDescriptorSet", select_overload<DescriptorSet *(const emscripten::val &)>(&CCWGPUDevice::createDescriptorSet),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("copyTextureToBuffers", select_overload<emscripten::val(Texture *, const BufferTextureCopyList &)>(&CCWGPUDevice::copyTextureToBuffers),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("copyBuffersToTextureWithRawCopyList", select_overload<void(const emscripten::val &, Texture *, const std::vector<BufferTextureCopy> &)>(&CCWGPUDevice::copyBuffersToTexture),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("copyBuffersToTexture", select_overload<void(const emscripten::val &, Texture *, const val &)>(&CCWGPUDevice::copyBuffersToTexture),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("createPipelineLayout", select_overload<PipelineLayout *(const emscripten::val &)>(&CCWGPUDevice::createPipelineLayout),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("getSampler", select_overload<Sampler *(const emscripten::val &)>(&CCWGPUDevice::getSampler), allow_raw_pointer<arg<0>>())
        .function("getFormatFeatures", select_overload<uint32_t(uint32_t)>(&CCWGPUDevice::getFormatFeatures))
        .property("gfxAPI", &CCWGPUDevice::getGFXAPI)
        .function("hasFeature", &CCWGPUDevice::hasFeature);

    class_<cc::gfx::RenderPass>("RenderPass")
        .class_function("computeHash", select_overload<ccstd::hash_t(const RenderPassInfo &)>(&RenderPass::computeHash), allow_raw_pointer<arg<0>>())
        .function("initialize", &cc::gfx::RenderPass::initialize, allow_raw_pointer<arg<0>>())
        .function("destroy", &cc::gfx::RenderPass::destroy)
        .function("getColorAttachments", &cc::gfx::RenderPass::getColorAttachments)
        .function("DepthStencilAttachment", &cc::gfx::RenderPass::getDepthStencilAttachment)
        .function("SubpassInfoList", &cc::gfx::RenderPass::getSubpasses)
        .function("SubpassDependencyList", &cc::gfx::RenderPass::getDependencies)
        .function("getHash", &cc::gfx::RenderPass::getHash);
    class_<CCWGPURenderPass, base<RenderPass>>("CCWGPURenderPass")
        .constructor<>()
        .function("getThis", select_overload<CCWGPURenderPass *(CCWGPURenderPass *)>(&cc::gfx::getThis), allow_raw_pointer<arg<0>>());

    class_<cc::gfx::Texture>("Texture")
        .class_function("computeHash", select_overload<ccstd::hash_t(const cc::gfx::TextureInfo &)>(&Texture::computeHash), allow_raw_pointer<arg<0>>())
        .function("initialize", select_overload<void(const cc::gfx::TextureInfo &)>(&cc::gfx::Texture::initialize), allow_raw_pointer<arg<0>>())
        .function("initialize", select_overload<void(const cc::gfx::TextureViewInfo &)>(&cc::gfx::Texture::initialize), allow_raw_pointer<arg<0>>())
        .function("destroy", &cc::gfx::Texture::destroy)
        .function("resize", &cc::gfx::Texture::resize);
    class_<CCWGPUTexture, base<cc::gfx::Texture>>("CCWGPUTexture")
        .property("format", &CCWGPUTexture::getEMSFormat)
        .constructor<>();

    class_<cc::gfx::Framebuffer>("Framebuffer")
        .class_function("computeHash", select_overload<ccstd::hash_t(const cc::gfx::FramebufferInfo &)>(&Framebuffer::computeHash), allow_raw_pointer<arg<0>>())
        .function("initialize", &cc::gfx::Framebuffer::initialize, allow_raw_pointer<arg<0>>())
        .function("destroy", &cc::gfx::Framebuffer::destroy)
        .function("getRenderPass", &cc::gfx::Framebuffer::getRenderPass, allow_raw_pointer<arg<0>>())
        .function("getColorTextures", &cc::gfx::Framebuffer::getColorTextures, allow_raw_pointer<arg<0>>())
        .function("getDepthStencilTexture", &cc::gfx::Framebuffer::getDepthStencilTexture, allow_raw_pointer<arg<0>>());
    class_<CCWGPUFramebuffer, base<Framebuffer>>("CCWGPUFramebuffer")
        .constructor<>();

    class_<Sampler>("Sampler")
        .function("getInfo", &Sampler::getInfo);
    class_<CCWGPUSampler, base<Sampler>>("CCWGPUSampler")
        .constructor<const SamplerInfo &>();

    class_<Buffer>("Buffer")
        .function("initialize", select_overload<void(const cc::gfx::BufferInfo &)>(&Buffer::initialize), allow_raw_pointer<arg<0>>())
        .function("initialize", select_overload<void(const cc::gfx::BufferViewInfo &)>(&Buffer::initialize), allow_raw_pointer<arg<0>>())
        .function("resize", &Buffer::resize)
        .function("destroy", &Buffer::destroy);
    class_<CCWGPUBuffer, base<Buffer>>("CCWGPUBuffer")
        .function("update", select_overload<void(const emscripten::val &v, uint)>(&CCWGPUBuffer::update), allow_raw_pointer<arg<0>>())
        // .function("update", select_overload<void(const emscripten::val &v)>(&CCWGPUBuffer::update), allow_raw_pointer<arg<0>>())
        .function("updateDrawInfo", select_overload<void(const DrawInfoList &infos)>(&CCWGPUBuffer::update), allow_raw_pointer<arg<0>>())
        .constructor<>();

    class_<DescriptorSetLayout>("DescriptorSetLayout")
        .function("initialize", &DescriptorSetLayout::initialize)
        .function("destroy", &DescriptorSetLayout::destroy);
    class_<CCWGPUDescriptorSetLayout, base<DescriptorSetLayout>>("CCWGPUDescriptorSetLayout")
        .property("bindings", &CCWGPUDescriptorSetLayout::getEMSBindings, &CCWGPUDescriptorSetLayout::setEMSBindings)
        // .property("bindings", &CCWGPUDescriptorSetLayout::getEMSDynamicBindings, &CCWGPUDescriptorSetLayout::setEMSDynamicBindings)
        .property("bindingIndices", &CCWGPUDescriptorSetLayout::getEMSBindingIndices, &CCWGPUDescriptorSetLayout::setEMSBindingIndices)
        .property("descriptorIndices", &CCWGPUDescriptorSetLayout::getEMSDescriptorIndices, &CCWGPUDescriptorSetLayout::setEMSDescriptorIndices)
        .constructor<>();

    class_<DescriptorSet>("DescriptorSet")
        .function("initialize", &DescriptorSet::initialize)
        .function("destroy", &DescriptorSet::destroy)
        .function("update", &DescriptorSet::update)
        .function("bindBuffer", select_overload<void(uint32_t, Buffer *, uint32_t)>(&DescriptorSet::bindBuffer), allow_raw_pointer<arg<1>>())
        .function("bindTexture", select_overload<void(uint32_t, Texture *, uint32_t)>(&DescriptorSet::bindTexture), allow_raw_pointer<arg<1>>())
        .function("bindSampler", select_overload<void(uint32_t, Sampler *, uint32_t)>(&DescriptorSet::bindSampler), allow_raw_pointer<arg<1>>());
    class_<CCWGPUDescriptorSet, base<DescriptorSet>>("CCWGPUDescriptorSet")
        .constructor<>();

    class_<PipelineLayout>("PipelineLayout")
        .function("initialize", &PipelineLayout::initialize)
        .function("destroy", &PipelineLayout::destroy);
    class_<CCWGPUPipelineLayout, base<PipelineLayout>>("CCWGPUPipelineLayout")
        .constructor<>();

    class_<Shader>("Shader")
        .function("initialize", &Shader::initialize)
        .function("destroy", &Shader::destroy);
    class_<CCWGPUShader, base<Shader>>("CCWGPUShader")
        .constructor<>();

    class_<InputAssembler>("InputAssembler")
        .function("initialize", &InputAssembler::initialize)
        .function("destroy", &InputAssembler::destroy);
    class_<CCWGPUInputAssembler, base<InputAssembler>>("CCWGPUInputAssembler")
        .function("update", &CCWGPUInputAssembler::update)
        .constructor<>();

    class_<CommandBuffer>("CommandBuffer")
        .function("initialize", &CommandBuffer::initialize)
        .function("destroy", &CommandBuffer::destroy)
        .function("begin3", select_overload<void(RenderPass *, uint, Framebuffer *)>(&CommandBuffer::begin), allow_raw_pointers())
        .function("end", &CommandBuffer::end)
        .function("endRenderPass", &CommandBuffer::endRenderPass)
        .function("bindPipelineState", &CommandBuffer::bindPipelineState, allow_raw_pointer<arg<0>>())
        .function("bindDescriptorSet", select_overload<void(uint, DescriptorSet *, const vector<uint> &)>(&CommandBuffer::bindDescriptorSet), allow_raw_pointers())
        .function("bindInputAssembler", &CommandBuffer::bindInputAssembler, allow_raw_pointer<arg<0>>())
        .function("setViewport", &CommandBuffer::setViewport)
        .function("setScissor", &CommandBuffer::setScissor)
        .function("setDepthBias", &CommandBuffer::setDepthBias)
        .function("setBlendConstants", &CommandBuffer::setBlendConstants)
        .function("setDepthBound", &CommandBuffer::setDepthBound)
        .function("setStencilWriteMask", &CommandBuffer::setStencilWriteMask)
        .function("setStencilCompareMask", &CommandBuffer::setStencilCompareMask)
        .function("nextSubpass", &CommandBuffer::nextSubpass)
        .function("draw", select_overload<void(const DrawInfo &)>(&CommandBuffer::draw))
        .function("copyBuffersToTexture", select_overload<void(const uint8_t *const *, Texture *, const BufferTextureCopy *, uint)>(&CommandBuffer::copyBuffersToTexture), allow_raw_pointers())
        .function("blitTexture", select_overload<void(Texture *, Texture *, const TextureBlit *, uint, Filter)>(&CommandBuffer::blitTexture), allow_raw_pointers())
        .function("execute", select_overload<void(CommandBuffer *const *, uint32_t)>(&CommandBuffer::execute), allow_raw_pointer<arg<0>>())
        .function("dispatch", &CommandBuffer::dispatch)
        .function("begin0", select_overload<void(void)>(&CommandBuffer::begin))
        .function("begin1", select_overload<void(RenderPass *)>(&CommandBuffer::begin), allow_raw_pointers())
        .function("begin2", select_overload<void(RenderPass *, uint)>(&CommandBuffer::begin), allow_raw_pointers())
        .function("execute", select_overload<void(const CommandBufferList &, uint32_t)>(&CommandBuffer::execute))
        .function("bindDescriptorSet2", select_overload<void(uint, DescriptorSet *)>(&CommandBuffer::bindDescriptorSet), allow_raw_pointer<arg<0>>())
        .function("drawIA", select_overload<void(InputAssembler *)>(&CommandBuffer::draw), allow_raw_pointer<arg<0>>())
        .function("blitTexture2", select_overload<void(Texture *, Texture *, const TextureBlitList &, Filter)>(&CommandBuffer::blitTexture), allow_raw_pointers())
        .function("getQueue", &CommandBuffer::getQueue, allow_raw_pointer<arg<0>>());
    class_<CCWGPUCommandBuffer, base<CommandBuffer>>("CCWGPUCommandBuffer")
        .constructor<>()
        .function("beginRenderPass", select_overload<void(RenderPass *, Framebuffer *, const Rect &, const ColorList &, float, uint)>(&CCWGPUCommandBuffer::beginRenderPass), allow_raw_pointers())
        .function("updateIndirectBuffer", select_overload<void(Buffer *, const DrawInfoList &)>(&CCWGPUCommandBuffer::updateIndirectBuffer), allow_raw_pointers())
        .function("updateBuffer", select_overload<void(Buffer *, const emscripten::val &v, uint)>(&CCWGPUCommandBuffer::updateBuffer), allow_raw_pointers());

    class_<Queue>("Queue")
        .function("destroy", &Queue::destroy)
        .function("submit", select_overload<void(const CommandBufferList &)>(&Queue::submit));
    class_<CCWGPUQueue, base<Queue>>("CCWGPUQueue")
        .function("initialize", &CCWGPUQueue::initialize)
        .constructor<>();

    class_<PipelineState>("PipelineState")
        .function("initialize", &Queue::initialize)
        .function("destroy", &Queue::destroy);
    class_<CCWGPUPipelineState>("CCWGPUPipelineState")
        .constructor<>();

    class_<WGPUGeneralBarrier>("WGPUGeneralBarrier")
        .constructor<val>();

    class_<WGPUBufferBarrier>("WGPUBufferBarrier")
        .constructor<val>();

    class_<WGPUTextureBarrier>("WGPUTextureBarrier")
        .constructor<val>();
    //--------------------------------------------------CONTAINER-----------------------------------------------------------------------
    register_vector<int>("vector_int");
    register_vector<uint32_t>("vector_uint32");
    // register_vector<AccessType>("AccessTypeList");
    register_vector<SubpassInfoList>("SubpassInfoList");
    // register_vector<ColorAttachment>("ColorAttachmentList");
    // register_vector<SubpassDependency>("SubpassDependencyList");
    register_vector<Texture *>("TextureList");
    register_vector<BufferTextureCopy>("BufferTextureCopyList");
    register_vector<Sampler *>("SamplerList");
    // register_vector<ems::DescriptorSetLayoutBinding>("DescriptorSetLayoutBindingList");
    register_vector<DescriptorSetLayout *>("DescriptorSetLayoutList");
    // register_vector<UniformStorageImage>("UniformStorageImageList");
    // register_vector<ShaderStage>("ShaderStageList");
    // register_vector<Attribute>("AttributeList");
    // register_vector<UniformBlock>("UniformBlockList");
    // register_vector<UniformStorageBuffer>("UniformStorageBufferList");
    // register_vector<UniformSamplerTexture>("UniformSamplerTextureList");
    register_vector<UniformTexture>("UniformTextureList");
    register_vector<UniformSampler>("UniformSamplerList");
    register_vector<UniformInputAttachment>("UniformInputAttachmentList");
    // register_vector<Uniform>("UniformList");
    register_vector<BlendTarget>("BlendTargetList");
    register_vector<CommandBuffer *>("CommandBufferList");
    register_vector<Color>("ColorList");
    register_vector<TextureBlit>("TextureBlitList");
    register_vector<DrawInfo>("DrawInfoList");
    register_vector<String>("StringList");
    register_vector<Buffer *>("BufferList");
    register_vector<Swapchain *>("SwapchainList");
    register_vector<ems::SPVShaderStage>("SPVShaderStageList");
};
} // namespace cc::gfx
