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
    EXPORT_STRUCT(Size, x, y, z);
    EXPORT_STRUCT(DeviceCaps, maxVertexAttributes, maxVertexUniformVectors, maxFragmentUniformVectors, maxTextureUnits, maxImageUnits, maxVertexTextureUnits, maxColorRenderTargets,
                  maxShaderStorageBufferBindings, maxShaderStorageBlockSize, maxUniformBufferBindings, maxUniformBlockSize, maxTextureSize, maxCubeMapTextureSize, uboOffsetAlignment,
                  maxComputeSharedMemorySize, maxComputeWorkGroupInvocations, maxComputeWorkGroupSize, maxComputeWorkGroupCount, supportQuery, clipSpaceMinZ, screenSpaceSignY, clipSpaceSignY);
    EXPORT_STRUCT(DrawInfo, vertexCount, firstVertex, indexCount, firstIndex, instanceCount, firstInstance);
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
        .function("setDepthStencilTexture", &CCWGPUSwapchain::setDepthStencilTexture, allow_raw_pointers())
        .function("getTransform", &CCWGPUSwapchain::getTransform)
        .property("width", &CCWGPUSwapchain::getWidth)
        .property("height", &CCWGPUSwapchain::getHeight);

    value_object<MemoryStatus>("MemoryStatus")
        .field("bufferSize", &MemoryStatus::bufferSize)
        .field("textureSize", &MemoryStatus::textureSize);

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
        // .function("flushCommands", &Device::flushCommands, allow_raw_pointers())
        .function("present", select_overload<void(void)>(&Device::present),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .property("capabilities", &Device::getCapabilities)
        .property("renderer", &Device::getRenderer)
        .property("vendor", &Device::getVendor)
        .property("numDrawCalls", &Device::getNumDrawCalls)
        .property("numInstances", &Device::getNumInstances)
        .property("numTris", &Device::getNumTris);
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
        .function("createFramebuffer", select_overload<Framebuffer *(const emscripten::val &)>(&CCWGPUDevice::createFramebuffer),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createBuffer", select_overload<Buffer *(const emscripten::val &)>(&CCWGPUDevice::createBuffer),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createTexture", select_overload<Texture *(const emscripten::val &)>(&CCWGPUDevice::createTexture),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createShaderNative", select_overload<Shader *(const val &)>(&CCWGPUDevice::createShader),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createDescriptorSetLayout", select_overload<DescriptorSetLayout *(const emscripten::val &)>(&CCWGPUDevice::createDescriptorSetLayout),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createInputAssembler", select_overload<InputAssembler *(const emscripten::val &)>(&CCWGPUDevice::createInputAssembler),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createPipelineState", select_overload<PipelineState *(const emscripten::val &)>(&CCWGPUDevice::createPipelineState),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createDescriptorSet", select_overload<DescriptorSet *(const emscripten::val &)>(&CCWGPUDevice::createDescriptorSet),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("copyTextureToBuffers", select_overload<void(Texture * src, const emscripten::val &, const emscripten::val &)>(&CCWGPUDevice::copyTextureToBuffers),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("copyBuffersToTexture", select_overload<void(const emscripten::val &, Texture *, const emscripten::val &)>(&CCWGPUDevice::copyBuffersToTexture),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("createPipelineLayout", select_overload<PipelineLayout *(const emscripten::val &)>(&CCWGPUDevice::createPipelineLayout),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("getSampler", select_overload<Sampler *(const emscripten::val &)>(&CCWGPUDevice::getSampler), allow_raw_pointer<arg<0>>())
        .function("getGeneralBarrier", select_overload<WGPUGeneralBarrier *(const emscripten::val &)>(&CCWGPUDevice::getGeneralBarrier), allow_raw_pointer<arg<0>>())
        .function("getFormatFeatures", select_overload<uint32_t(uint32_t)>(&CCWGPUDevice::getFormatFeatures))
        .property("gfxAPI", &CCWGPUDevice::getGFXAPI)
        .property("memoryStatus", &CCWGPUDevice::getMemStatus)
        .function("hasFeature", &CCWGPUDevice::hasFeature);

    class_<RenderPass>("RenderPass")
        .class_function("computeHash", select_overload<ccstd::hash_t(const RenderPassInfo &)>(&RenderPass::computeHash), allow_raw_pointer<arg<0>>())
        .function("destroy", &RenderPass::destroy)
        .function("getColorAttachments", &RenderPass::getColorAttachments)
        .function("DepthStencilAttachment", &RenderPass::getDepthStencilAttachment)
        .function("SubpassInfoList", &RenderPass::getSubpasses)
        .function("SubpassDependencyList", &RenderPass::getDependencies)
        .function("getHash", &RenderPass::getHash);
    class_<CCWGPURenderPass, base<RenderPass>>("CCWGPURenderPass")
        .constructor<>()
        .function("initialize", select_overload<void(const val &)>(&CCWGPURenderPass::initialize), allow_raw_pointer<arg<0>>());

    class_<Texture>("Texture")
        .class_function("computeHash", select_overload<ccstd::hash_t(const TextureInfo &)>(&Texture::computeHash), allow_raw_pointer<arg<0>>())
        .function("initialize", select_overload<void(const TextureInfo &)>(&Texture::initialize), allow_raw_pointer<arg<0>>())
        .function("initialize", select_overload<void(const TextureViewInfo &)>(&Texture::initialize), allow_raw_pointer<arg<0>>())
        .function("destroy", &Texture::destroy)
        .function("resize", &Texture::resize)
        .property("width", &Texture::getWidth)
        .property("height", &Texture::getHeight)
        .property("size", &Texture::getSize)
        .property("isTextureView", &Texture::isTextureView);
    class_<CCWGPUTexture, base<Texture>>("CCWGPUTexture")
        .function("getInfo", &CCWGPUTexture::getTextureInfo)
        .function("getViewInfo", &CCWGPUTexture::getTextureViewInfo)
        .property("depth", &CCWGPUTexture::getDepth)
        .property("layerCount", &CCWGPUTexture::getLayerCount)
        .property("levelCount", &CCWGPUTexture::getLevelCount)
        .function("getType", &CCWGPUTexture::getTextureType, allow_raw_pointers())
        .function("getUsage", &CCWGPUTexture::getTextureUsage, allow_raw_pointers())
        .function("getFormat", &CCWGPUTexture::getTextureFormat, allow_raw_pointers())
        .function("getSamples", &CCWGPUTexture::getTextureSamples, allow_raw_pointers())
        .function("getFlags", &CCWGPUTexture::getTextureFlags, allow_raw_pointers())
        .constructor<>();

    class_<Framebuffer>("Framebuffer")
        .class_function("computeHash", select_overload<ccstd::hash_t(const FramebufferInfo &)>(&Framebuffer::computeHash), allow_raw_pointer<arg<0>>())
        .function("destroy", &Framebuffer::destroy)
        .function("getRenderPass", &Framebuffer::getRenderPass, allow_raw_pointer<arg<0>>())
        .function("getColorTextures", &Framebuffer::getColorTextures, allow_raw_pointer<arg<0>>())
        .function("getDepthStencilTexture", &Framebuffer::getDepthStencilTexture, allow_raw_pointer<arg<0>>());
    class_<CCWGPUFramebuffer, base<Framebuffer>>("CCWGPUFramebuffer")
        .function("initialize", select_overload<void(const emscripten::val &)>(&CCWGPUFramebuffer::initialize), allow_raw_pointer<arg<0>>())
        .constructor<>();

    class_<Sampler>("Sampler")
        .function("getInfo", &Sampler::getInfo)
        .property("hash", &Sampler::getHash);
    class_<CCWGPUSampler, base<Sampler>>("CCWGPUSampler")
        .constructor<const SamplerInfo &>();

    class_<Buffer>("Buffer")
        .function("resize", &Buffer::resize)
        .function("destroy", &Buffer::destroy)
        .property("size", &Buffer::getSize)
        .property("stride", &Buffer::getStride)
        .property("count", &Buffer::getCount);
    class_<CCWGPUBuffer, base<Buffer>>("CCWGPUBuffer")
        .function("update", select_overload<void(const emscripten::val &v, uint32_t)>(&CCWGPUBuffer::update), allow_raw_pointer<arg<0>>())
        // .function("update", select_overload<void(const emscripten::val &v)>(&CCWGPUBuffer::update), allow_raw_pointer<arg<0>>())
        .function("updateDrawInfo", select_overload<void(const DrawInfoList &infos)>(&CCWGPUBuffer::update), allow_raw_pointer<arg<0>>())
        .function("getUsage", &CCWGPUBuffer::getBufferUsage, allow_raw_pointers())
        .function("getMemUsage", &CCWGPUBuffer::getBufferMemUsage, allow_raw_pointers())
        .function("getFlags", &CCWGPUBuffer::getBufferFlags, allow_raw_pointers())
        .constructor<>();

    class_<DescriptorSetLayout>("DescriptorSetLayout")
        .function("initialize", &DescriptorSetLayout::initialize)
        .function("destroy", &DescriptorSetLayout::destroy);
    class_<CCWGPUDescriptorSetLayout, base<DescriptorSetLayout>>("CCWGPUDescriptorSetLayout")
        .function("getBindings", &CCWGPUDescriptorSetLayout::getDSLayoutBindings)
        .function("getBindingIndices", &CCWGPUDescriptorSetLayout::getDSLayoutBindingIndices)
        .function("getDescriptorIndices", &CCWGPUDescriptorSetLayout::getDSLayoutIndices)
        .constructor<>();

    class_<DescriptorSet>("DescriptorSet")
        .function("initialize", &DescriptorSet::initialize)
        .function("destroy", &DescriptorSet::destroy)
        .function("update", &DescriptorSet::update)
        .function("bindBuffer", select_overload<void(uint32_t, Buffer *, uint32_t)>(&DescriptorSet::bindBuffer), allow_raw_pointer<arg<1>>())
        .function("bindTexture", select_overload<void(uint32_t, Texture *, uint32_t)>(&DescriptorSet::bindTexture), allow_raw_pointer<arg<1>>())
        .function("bindSampler", select_overload<void(uint32_t, Sampler *, uint32_t)>(&DescriptorSet::bindSampler), allow_raw_pointer<arg<1>>())
        .function("getBuffer", select_overload<Buffer *(uint32_t, uint32_t) const>(&DescriptorSet::getBuffer), allow_raw_pointers())
        .function("getTexture", select_overload<Texture *(uint32_t, uint32_t) const>(&DescriptorSet::getTexture), allow_raw_pointers())
        .function("getSampler", select_overload<Sampler *(uint32_t, uint32_t) const>(&DescriptorSet::getSampler), allow_raw_pointers())
        .function("getLayout", &DescriptorSet::getLayout, allow_raw_pointer<arg<0>>());
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
        .function("destroy", &InputAssembler::destroy)
        .property("drawInfo", &InputAssembler::getDrawInfo, &InputAssembler::setDrawInfo)
        .property("vertexCount", &InputAssembler::getVertexCount, &InputAssembler::setVertexCount)
        .property("firstVertex", &InputAssembler::getFirstVertex, &InputAssembler::setFirstVertex)
        .property("indexCount", &InputAssembler::getIndexCount, &InputAssembler::setIndexCount)
        .property("firstIndex", &InputAssembler::getFirstIndex, &InputAssembler::setFirstIndex)
        .property("vertexOffset", &InputAssembler::getVertexOffset, &InputAssembler::setVertexOffset)
        .property("instanceCount", &InputAssembler::getInstanceCount, &InputAssembler::setInstanceCount)
        .property("firstInstance", &InputAssembler::getFirstInstance, &InputAssembler::setFirstInstance);
    class_<CCWGPUInputAssembler, base<InputAssembler>>("CCWGPUInputAssembler")
        .constructor<>()
        .function("update", &CCWGPUInputAssembler::update)
        .function("getAttributes", &CCWGPUInputAssembler::getEMSAttributes)
        .function("getVertexBuffers", &CCWGPUInputAssembler::getEMSVertexBuffers, allow_raw_pointers())
        .function("getIndexBuffer", &CCWGPUInputAssembler::getEMSIndexBuffer, allow_raw_pointers())
        .function("getIndirectBuffer", &CCWGPUInputAssembler::getEMSIndirectBuffer, allow_raw_pointers());

    class_<CommandBuffer>("CommandBuffer")
        .function("initialize", &CommandBuffer::initialize)
        .function("destroy", &CommandBuffer::destroy)
        .function("begin3", select_overload<void(RenderPass *, uint32_t, Framebuffer *)>(&CommandBuffer::begin), allow_raw_pointers())
        .function("end", &CommandBuffer::end)
        .function("endRenderPass", &CommandBuffer::endRenderPass)
        .function("setDepthBias", &CommandBuffer::setDepthBias)
        .function("setBlendConstants", &CommandBuffer::setBlendConstants)
        .function("setDepthBound", &CommandBuffer::setDepthBound)
        .function("setStencilWriteMask", &CommandBuffer::setStencilWriteMask)
        .function("setStencilCompareMask", &CommandBuffer::setStencilCompareMask)
        .function("nextSubpass", &CommandBuffer::nextSubpass)
        .function("copyBuffersToTexture", select_overload<void(const uint8_t *const *, Texture *, const BufferTextureCopy *, uint32_t)>(&CommandBuffer::copyBuffersToTexture), allow_raw_pointers())
        .function("blitTexture", select_overload<void(Texture *, Texture *, const TextureBlit *, uint32_t, Filter)>(&CommandBuffer::blitTexture), allow_raw_pointers())
        .function("execute", select_overload<void(CommandBuffer *const *, uint32_t)>(&CommandBuffer::execute), allow_raw_pointer<arg<0>>())
        .function("dispatch", &CommandBuffer::dispatch)
        .function("begin0", select_overload<void(void)>(&CommandBuffer::begin))
        .function("begin1", select_overload<void(RenderPass *)>(&CommandBuffer::begin), allow_raw_pointers())
        .function("begin2", select_overload<void(RenderPass *, uint32_t)>(&CommandBuffer::begin), allow_raw_pointers())
        .function("execute", select_overload<void(const CommandBufferList &, uint32_t)>(&CommandBuffer::execute))
        .function("blitTexture2", select_overload<void(Texture *, Texture *, const TextureBlitList &, Filter)>(&CommandBuffer::blitTexture), allow_raw_pointers())
        .function("getQueue", &CommandBuffer::getQueue, allow_raw_pointer<arg<0>>())
        .property("numDrawCalls", &CommandBuffer::getNumDrawCalls)
        .property("numInstances", &CommandBuffer::getNumInstances)
        .property("numTris", &CommandBuffer::getNumTris);
    class_<CCWGPUCommandBuffer, base<CommandBuffer>>("CCWGPUCommandBuffer")
        .constructor<>()
        .function("setViewport", select_overload<void(const emscripten::val &)>(&CCWGPUCommandBuffer::setViewport))
        .function("setScissor", select_overload<void(const emscripten::val &)>(&CCWGPUCommandBuffer::setScissor))
        .function("beginRenderPass", select_overload<void(RenderPass *, Framebuffer *, const emscripten::val &, const emscripten::val &, float, uint32_t)>(&CCWGPUCommandBuffer::beginRenderPass), allow_raw_pointers())
        .function("bindDescriptorSet", select_overload<void(uint32_t, DescriptorSet *, const emscripten::val &)>(&CCWGPUCommandBuffer::bindDescriptorSet), allow_raw_pointers())
        .function("bindPipelineState", select_overload<void(const emscripten::val &)>(&CCWGPUCommandBuffer::bindPipelineState), allow_raw_pointer<arg<0>>())
        .function("bindInputAssembler", select_overload<void(const emscripten::val &)>(&CCWGPUCommandBuffer::bindInputAssembler), allow_raw_pointer<arg<0>>())
        .function("draw", select_overload<void(const emscripten::val &)>(&CCWGPUCommandBuffer::draw))
        .function("drawByInfo", select_overload<void(const DrawInfo &)>(&CCWGPUCommandBuffer::draw))
        .function("updateIndirectBuffer", select_overload<void(Buffer *, const DrawInfoList &)>(&CCWGPUCommandBuffer::updateIndirectBuffer), allow_raw_pointers())
        .function("updateBuffer", select_overload<void(Buffer *, const emscripten::val &v, uint32_t)>(&CCWGPUCommandBuffer::updateBuffer), allow_raw_pointers())
        .function("getType", &CCWGPUCommandBuffer::getCommandBufferType);

    class_<Queue>("Queue")
        .function("destroy", &Queue::destroy);
    class_<CCWGPUQueue, base<Queue>>("CCWGPUQueue")
        .function("initialize", &CCWGPUQueue::initialize)
        .function("submit", select_overload<void(const emscripten::val &)>(&CCWGPUQueue::submit))
        .constructor<>();

    class_<PipelineState>("PipelineState")
        .function("initialize", &Queue::initialize)
        .function("destroy", &Queue::destroy);
    class_<CCWGPUPipelineState, base<PipelineState>>("CCWGPUPipelineState")
        .constructor<>();

    class_<WGPUGeneralBarrier>("WGPUGeneralBarrier")
        .constructor<val>();

    class_<WGPUBufferBarrier>("WGPUBufferBarrier")
        .constructor<val>();

    class_<WGPUTextureBarrier>("WGPUTextureBarrier")
        .constructor<val>();
};
} // namespace cc::gfx
