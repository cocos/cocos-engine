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

template <class R, class T>
R getMemberType(R T::*);

#define MEMBER_TYPE(prop) decltype(getMemberType(prop))

template <typename T, typename U, typename V, typename FallBack = void>
struct Exporter {
    Exporter(T &t, const char *propName, U V::*field, bool ignorePtrAssert = false) {
        t.field(propName, field);
    }
};

template <typename T, typename U, typename V>
struct Exporter<T, U, V, typename std::enable_if<std::is_enum<U>::value>::type> {
    Exporter(T &t, const char *propName, U V::*field, bool ignorePtrAssert = false) {
        std::function<void(V & v, std::underlying_type_t<U> u)> set = [field](V &v, std::underlying_type_t<U> u) {
            v.*field = U{u};
        };
        std::function<std::underlying_type_t<U>(const V &v)> get = [field](const V &v) {
            return static_cast<std::underlying_type_t<U>>(v.*field);
        };
        t.field(propName, get, set);
    }
};

template <typename T, typename U, typename V>
struct Exporter<T, U, V, typename std::enable_if<std::is_pointer<U>::value>::type> {
    Exporter(T &t, const char *propName, U V::*field) {
        static_assert(!std::is_pointer<U>::value, "Export pointer with struct, try EXPORT_STRUCT_NPOD!");
    }

    Exporter(T &t, const char *propName, U V::*field, bool ignorePtrAssert) {
        t.field(propName, field);
    }
};

#define PROCESS_STRUCT_MEMBERS(r, struct_name, property) \
    { Exporter exporter(obj, BOOST_PP_STRINGIZE(property), &struct_name::property); }

#define EXPORT_STRUCT_POD(struct_name, ...)                                                                \
    {                                                                                                      \
        auto obj = value_object<struct_name>(#struct_name);                                                \
        BOOST_PP_SEQ_FOR_EACH(PROCESS_STRUCT_MEMBERS, struct_name, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define PROCESS_STRUCT_MEMBERS_MAY_BE_PTR(r, struct_name, property) \
    { Exporter exporter(obj, BOOST_PP_STRINGIZE(property), &struct_name::property, true); }

#define EXPORT_STRUCT_NPOD(struct_name, ...)                                                                          \
    {                                                                                                                 \
        auto obj = value_object<struct_name>(#struct_name);                                                           \
        BOOST_PP_SEQ_FOR_EACH(PROCESS_STRUCT_MEMBERS_MAY_BE_PTR, struct_name, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define SPECIALIZE_PTR_FOR_STRUCT(r, _, TYPE)                                                                                                                       \
    template <>                                                                                                                                                     \
    struct emscripten::internal::TypeID<cc::gfx::TYPE *, void> {                                                                                                    \
        static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::TypeID<emscripten::internal::AllowedRawPointer<cc::gfx::TYPE>>::get(); } \
    };

#define REGISTER_GFX_PTRS_FOR_STRUCT(...) \
    BOOST_PP_SEQ_FOR_EACH(SPECIALIZE_PTR_FOR_STRUCT, _, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__));

#if 1
enum class TestEnum : uint32_t {
    ZERO,
    ONE,
    TWO,
    THREE,
};

struct PtInternal {
    uint32_t value{0};
};

struct PtTest {
    uint32_t value{0};
    cc::gfx::CCWGPUDevice *device{nullptr};
};

struct Point2D {
    uint32_t x;
    uint32_t y;
    uint32_t z;
    uint32_t w;
    TestEnum type;
    TestEnum usage;
    TestEnum flag;
    TestEnum prop;
    PtTest *test;
};

struct TestPoint {
    uint32_t value;
    Point2D pt;
};

// void printPoint(TestPoint info) {
//     printf("point2D %u, %u, %u, %u, %u, %u, %u, %u, %u, %u\n", info.pt.x, info.pt.y, info.pt.z, info.pt.w, info.pt.type, info.pt.usage, info.pt.flag, info.pt.prop, info.pt.test->value, info.pt.test->next->value);
// }

void printPtTest(const PtTest &test) {
    printf("%u, %s\n", test.value, test.device->getDeviceName().c_str());
}

static Point2D s_pt;

void testPoint(const Point2D &pt) {
    s_pt = pt;
}
#endif

// specialize for void*
template <>
struct emscripten::internal::TypeID<void *, void> {
    static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::TypeID<uintptr_t>::get(); }
};

REGISTER_GFX_PTRS_FOR_STRUCT(CCWGPUDevice, Buffer, Texture, GeneralBarrier, Queue, RenderPass, Shader, PipelineLayout, DescriptorSetLayout);

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

class TestClass {
public:
    TestClass() = default;
    Point2D *getPt() const {
        return _pt;
    }
    void setPt(Point2D *pt) {
        _pt = pt;
    }
    Point2D *_pt;
};

EMSCRIPTEN_BINDINGS(WEBGPU_DEVICE_WASM_EXPORT) {
    // register_vector<uint32_t>("Uint32Vector");

    EXPORT_STRUCT_POD(Size, x, y, z);
    EXPORT_STRUCT_POD(DeviceCaps, maxVertexAttributes, maxVertexUniformVectors, maxFragmentUniformVectors, maxTextureUnits, maxImageUnits, maxVertexTextureUnits, maxColorRenderTargets,
                      maxShaderStorageBufferBindings, maxShaderStorageBlockSize, maxUniformBufferBindings, maxUniformBlockSize, maxTextureSize, maxCubeMapTextureSize, uboOffsetAlignment,
                      maxComputeSharedMemorySize, maxComputeWorkGroupInvocations, maxComputeWorkGroupSize, maxComputeWorkGroupCount, supportQuery, clipSpaceMinZ, screenSpaceSignY, clipSpaceSignY);
    EXPORT_STRUCT_NPOD(PtTest, value, device);
    EXPORT_STRUCT_POD(Offset, x, y, z);
    EXPORT_STRUCT_POD(Rect, x, y, width, height);
    EXPORT_STRUCT_POD(Extent, width, height, depth);
    EXPORT_STRUCT_POD(TextureSubresLayers, mipLevel, baseArrayLayer, layerCount);
    EXPORT_STRUCT_POD(TextureCopy, srcSubres, srcOffset, dstSubres, dstOffset, extent);
    EXPORT_STRUCT_POD(TextureBlit, srcSubres, srcOffset, srcExtent, dstSubres, dstOffset, dstExtent);
    EXPORT_STRUCT_POD(BufferTextureCopy, buffOffset, buffStride, buffTexHeight, texOffset, texExtent, texSubres);
    EXPORT_STRUCT_POD(Viewport, left, top, width, height, minDepth, maxDepth);
    EXPORT_STRUCT_POD(Color, x, y, z, w);
    EXPORT_STRUCT_POD(BindingMappingInfo, maxBlockCounts, maxSamplerTextureCounts, maxSamplerCounts, maxTextureCounts, maxBufferCounts, maxImageCounts, maxSubpassInputCounts, setIndices);
    EXPORT_STRUCT_NPOD(SwapchainInfo, windowHandle, vsyncMode, width, height);
    EXPORT_STRUCT_POD(DeviceInfo, bindingMappingInfo);
    EXPORT_STRUCT_POD(BufferInfo, usage, memUsage, size, stride, flags);
    EXPORT_STRUCT_NPOD(BufferViewInfo, buffer, offset, range);
    EXPORT_STRUCT_POD(DrawInfo, vertexCount, firstVertex, indexCount, firstIndex, vertexOffset, instanceCount, firstInstance);
    EXPORT_STRUCT_NPOD(DispatchInfo, groupCountX, groupCountY, groupCountZ, indirectBuffer, indirectOffset);
    EXPORT_STRUCT_POD(IndirectBuffer, drawInfos);
    EXPORT_STRUCT_NPOD(TextureInfo, type, usage, format, width, height, flags, layerCount, levelCount, samples, depth, externalRes);
    EXPORT_STRUCT_NPOD(TextureViewInfo, texture, type, format, baseLevel, levelCount, baseLayer, layerCount);
    EXPORT_STRUCT_POD(SamplerInfo, minFilter, magFilter, mipFilter, addressU, addressV, addressW, maxAnisotropy, cmpFunc);
    EXPORT_STRUCT_POD(Uniform, name, type, count);
    EXPORT_STRUCT_POD(UniformBlock, set, binding, name, members, count);
    EXPORT_STRUCT_POD(UniformSamplerTexture, set, binding, name, type, count);
    EXPORT_STRUCT_POD(UniformSampler, set, binding, name, count);
    EXPORT_STRUCT_POD(UniformTexture, set, binding, name, type, count);
    EXPORT_STRUCT_POD(UniformStorageImage, set, binding, name, type, count, memoryAccess);
    EXPORT_STRUCT_POD(UniformStorageBuffer, set, binding, name, count, memoryAccess);
    EXPORT_STRUCT_POD(UniformInputAttachment, set, binding, name, count);
    EXPORT_STRUCT_POD(ShaderStage, stage, source);
    EXPORT_STRUCT_POD(Attribute, name, format, isNormalized, stream, isInstanced, location);
    EXPORT_STRUCT_POD(ShaderInfo, name, stages, attributes, blocks, buffers, samplerTextures, samplers, textures, images, subpassInputs);
    EXPORT_STRUCT_NPOD(InputAssemblerInfo, attributes, vertexBuffers, indexBuffer, indirectBuffer);
    EXPORT_STRUCT_NPOD(ColorAttachment, format, sampleCount, loadOp, storeOp, barrier, isGeneralLayout);
    EXPORT_STRUCT_NPOD(DepthStencilAttachment, format, sampleCount, depthLoadOp, depthStoreOp, stencilLoadOp, stencilStoreOp, barrier, isGeneralLayout);
    EXPORT_STRUCT_POD(SubpassInfo, inputs, colors, resolves, preserves, depthStencil, depthStencilResolve, depthResolveMode, stencilResolveMode);

    // MAYBE TODO(Zeqiang): all ts related backend no need to care about barriers.
    EXPORT_STRUCT_POD(SubpassDependency, srcSubpass, dstSubpass, bufferBarrierCount, textureBarrierCount);
    EXPORT_STRUCT_POD(RenderPassInfo, colorAttachments, depthStencilAttachment, subpasses, dependencies);
    EXPORT_STRUCT_POD(GeneralBarrierInfo, prevAccesses, nextAccesses, type);
    EXPORT_STRUCT_NPOD(TextureBarrierInfo, prevAccesses, nextAccesses, type, baseMipLevel, levelCount, baseSlice, sliceCount, discardContents, srcQueue, dstQueue);
    EXPORT_STRUCT_NPOD(BufferBarrierInfo, prevAccesses, nextAccesses, type, offset, size, discardContents, srcQueue, dstQueue);
    EXPORT_STRUCT_NPOD(FramebufferInfo, renderPass, colorTextures, depthStencilTexture);
    EXPORT_STRUCT_NPOD(DescriptorSetLayoutBinding, binding, descriptorType, count, stageFlags, immutableSamplers);
    EXPORT_STRUCT_POD(DescriptorSetLayoutInfo, bindings);
    EXPORT_STRUCT_NPOD(DescriptorSetInfo, layout);
    EXPORT_STRUCT_NPOD(PipelineLayoutInfo, setLayouts);
    EXPORT_STRUCT_POD(InputState, attributes);
    EXPORT_STRUCT_POD(RasterizerState, isDiscard, polygonMode, shadeModel, cullMode, isFrontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop, isDepthClip, isMultisample, lineWidth);
    EXPORT_STRUCT_POD(DepthStencilState, depthTest, depthWrite, depthFunc, stencilTestFront, stencilReadMaskFront, stencilWriteMaskFront, stencilFailOpFront, stencilZFailOpFront, stencilPassOpFront,
                      stencilRefFront, stencilTestBack, stencilFuncBack, stencilReadMaskBack, stencilWriteMaskBack, stencilFailOpBack, stencilZFailOpBack, stencilPassOpBack, stencilRefBack);
    EXPORT_STRUCT_POD(BlendTarget, blend, blendSrc, blendDst, blendEq, blendSrcAlpha, blendDstAlpha, blendAlphaEq, blendColorMask);
    EXPORT_STRUCT_POD(BlendState, isA2C, isIndepend, blendColor, targets)
    // MAYBE TODO(Zeqiang): no subpass in ts now
    EXPORT_STRUCT_NPOD(PipelineStateInfo, shader, pipelineLayout, renderPass, inputState, rasterizerState, depthStencilState, blendState, primitive, dynamicStates, bindPoint);
    EXPORT_STRUCT_NPOD(CommandBufferInfo, queue);
    EXPORT_STRUCT_POD(QueueInfo, type);
    EXPORT_STRUCT_POD(QueryPoolInfo, type, maxQueryObjects, forceWait);
    // EXPORT_STRUCT_POD(FormatInfo, name, size, count, type, hasAlpha, hasDepth, hasStencil, isCompressed);
    EXPORT_STRUCT_POD(MemoryStatus, bufferSize, textureSize);
    EXPORT_STRUCT_POD(DynamicStencilStates, writeMask, compareMask, reference);
    EXPORT_STRUCT_POD(DynamicStates, viewport, scissor, blendConstant, lineWidth, depthBiasConstant, depthBiasClamp, depthBiasSlope, depthMinBounds, depthMaxBounds, stencilStatesFront, stencilStatesBack);
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

    // value_object<TestEnum>("TestEnum")
    //     .field("ZERO", &TestEnum::ZERO)
    //     .field("ONE", &TestEnum::ONE)
    //     .field("TWO", &TestEnum::TWO)
    //     .field("THREE", &TestEnum::THREE);

    // std::function<uint32_t(const Point2D &p)> getX = [](const Point2D &p) {
    //     return p.x;
    // };
    // std::function<void(Point2D & p, uint32_t x)> setX = [](Point2D &p, uint32_t x) {
    //     p.x = x;
    // };
    class_<Device>("Device")
        .function("initialize", &Device::initialize)
        .function("destroy", &Device::destroy, pure_virtual())
        .function("present", &Device::present, pure_virtual())
        .function("createQueue", select_overload<Queue *(const QueueInfo &)>(&Device::createQueue), allow_raw_pointer<arg<0>>())
        .function("createSwapchain", select_overload<Swapchain *(const SwapchainInfo &)>(&Device::createSwapchain), allow_raw_pointer<arg<0>>())
        .function("createRenderPass", select_overload<RenderPass *(const RenderPassInfo &)>(&Device::createRenderPass))
        .function("createFramebuffer", select_overload<Framebuffer *(const FramebufferInfo &)>(&Device::createFramebuffer), allow_raw_pointer<arg<0>>())
        .function("createBuffer", select_overload<Buffer *(const BufferInfo &)>(&Device::createBuffer), allow_raw_pointer<arg<0>>())
        .function("createBufferView", select_overload<Buffer *(const BufferViewInfo &)>(&Device::createBuffer), allow_raw_pointer<arg<0>>())
        .function("createTexture", select_overload<Texture *(const TextureInfo &)>(&Device::createTexture), allow_raw_pointer<arg<0>>())
        .function("createTextureView", select_overload<Texture *(const TextureViewInfo &)>(&Device::createTexture), allow_raw_pointer<arg<0>>())
        .function("createDescriptorSetLayout", select_overload<DescriptorSetLayout *(const DescriptorSetLayoutInfo &)>(&Device::createDescriptorSetLayout), allow_raw_pointer<arg<0>>())
        .function("createInputAssembler", select_overload<InputAssembler *(const InputAssemblerInfo &)>(&Device::createInputAssembler), allow_raw_pointer<arg<0>>())
        .function("createPipelineState", select_overload<PipelineState *(const PipelineStateInfo &)>(&Device::createPipelineState), allow_raw_pointer<arg<0>>())
        .function("createDescriptorSet", select_overload<DescriptorSet *(const DescriptorSetInfo &)>(&Device::createDescriptorSet), allow_raw_pointer<arg<0>>())
        .function("createPipelineLayout", select_overload<PipelineLayout *(const PipelineLayoutInfo &)>(&Device::createPipelineLayout), allow_raw_pointer<arg<0>>())
        .function("getSampler", &Device::getSampler, allow_raw_pointer<arg<0>>())
        .function("getGeneralBarrier", &Device::getGeneralBarrier, allow_raw_pointer<arg<0>>())
        // .function("createTextureBarrier", select_overload<TextureBarrier*(const TextureBarrierInfo&)>(&Device::createTextureBarrier),
        //           /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("getCommandBuffer", &Device::getCommandBuffer, allow_raw_pointers())
        .function("getQueue", &Device::getQueue, allow_raw_pointers())
        // .function("flushCommands", &Device::flushCommands, allow_raw_pointers())
        .function("present", select_overload<void(void)>(&Device::present),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .property("capabilities", &Device::getCapabilities)
        .property("name", &Device::getDeviceName)
        .property("renderer", &Device::getRenderer)
        .property("vendor", &Device::getVendor)
        .property("numDrawCalls", &Device::getNumDrawCalls)
        .property("numInstances", &Device::getNumInstances)
        .property("numTris", &Device::getNumTris);
    class_<CCWGPUDevice, base<Device>>("CCWGPUDevice")
        // .class_function("getInstance", &CCWGPUDevice::getInstance, allow_raw_pointer<arg<0>>())
        .constructor<>()
        .function("debug", &CCWGPUDevice::debug)

        .function("acquire", select_overload<void(const std::vector<Swapchain *> &)>(&CCWGPUDevice::acquire),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createShaderNative", select_overload<Shader *(const ShaderInfo &, const emscripten::val &)>(&CCWGPUDevice::createShader),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("copyTextureToBuffers", select_overload<void(Texture * src, const emscripten::val &, const emscripten::val &)>(&CCWGPUDevice::copyTextureToBuffers),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("copyBuffersToTexture", select_overload<void(const emscripten::val &, Texture *dst, const std::vector<BufferTextureCopy> &)>(&CCWGPUDevice::copyBuffersToTexture),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("getFormatFeatures", select_overload<uint32_t(uint32_t)>(&CCWGPUDevice::getFormatFeatures))
        .property("gfxAPI", &CCWGPUDevice::getGFXAPI)
        .property("memoryStatus", &CCWGPUDevice::getMemStatus)
        .function("hasFeature", &CCWGPUDevice::hasFeature);

    function("PtTest", &GenInstance<PtTest>::instance);

    function("printPtTest", &printPtTest);
    // function("testPoint", &testPoint);

    class_<RenderPass>("RenderPass")
        .class_function("computeHash", select_overload<ccstd::hash_t(const RenderPassInfo &)>(&RenderPass::computeHash), allow_raw_pointer<arg<0>>())
        .function("destroy", &RenderPass::destroy)
        .function("getColorAttachments", &RenderPass::getColorAttachments)
        .function("DepthStencilAttachment", &RenderPass::getDepthStencilAttachment)
        .function("SubpassInfoList", &RenderPass::getSubpasses)
        .function("SubpassDependencyList", &RenderPass::getDependencies)
        .function("getHash", &RenderPass::getHash)
        .function("initialize", select_overload<void(const RenderPassInfo &)>(&CCWGPURenderPass::initialize), allow_raw_pointer<arg<0>>());
    class_<CCWGPURenderPass, base<RenderPass>>("CCWGPURenderPass")
        .constructor<>();

    class_<Texture>("Texture")
        .class_function("computeHash", select_overload<ccstd::hash_t(const TextureInfo &)>(&Texture::computeHash), allow_raw_pointer<arg<0>>())
        .function("initialize", select_overload<void(const TextureInfo &)>(&Texture::initialize), allow_raw_pointer<arg<0>>())
        .function("initialize", select_overload<void(const TextureViewInfo &)>(&Texture::initialize), allow_raw_pointer<arg<0>>())
        .function("destroy", &Texture::destroy)
        .function("resize", &Texture::resize)
        .function("getInfo", &Texture::getInfo)
        .function("getViewInfo", &Texture::getViewInfo)
        .property("width", &Texture::getWidth)
        .property("height", &Texture::getHeight)
        .property("size", &Texture::getSize)
        .property("isTextureView", &Texture::isTextureView);
    class_<CCWGPUTexture, base<Texture>>("CCWGPUTexture")
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
        .function("getDepthStencilTexture", &Framebuffer::getDepthStencilTexture, allow_raw_pointer<arg<0>>())
        .function("initialize", &Framebuffer::initialize, allow_raw_pointer<arg<0>>());
    class_<CCWGPUFramebuffer, base<Framebuffer>>("CCWGPUFramebuffer")
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
        .function("destroy", &DescriptorSetLayout::destroy)
        .function("getBindings", &DescriptorSetLayout::getBindings)
        .function("getBindingIndices", &DescriptorSetLayout::getBindingIndices)
        .function("getDescriptorIndices", &DescriptorSetLayout::getDescriptorIndices);
    class_<CCWGPUDescriptorSetLayout, base<DescriptorSetLayout>>("CCWGPUDescriptorSetLayout")
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
        .property("firstInstance", &InputAssembler::getFirstInstance, &InputAssembler::setFirstInstance)
        .function("getAttributes", &InputAssembler::getAttributes)
        .function("getVertexBuffers", &InputAssembler::getVertexBuffers, allow_raw_pointers())
        .function("getIndexBuffer", &InputAssembler::getIndexBuffer, allow_raw_pointers())
        .function("getIndirectBuffer", &InputAssembler::getIndirectBuffer, allow_raw_pointers());
    class_<CCWGPUInputAssembler, base<InputAssembler>>("CCWGPUInputAssembler")
        .constructor<>();

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
        .function("execute", select_overload<void(const CommandBufferList &, uint32_t)>(&CommandBuffer::execute), allow_raw_pointers())
        .function("blitTexture2", select_overload<void(Texture *, Texture *, const TextureBlitList &, Filter)>(&CommandBuffer::blitTexture), allow_raw_pointers())
        .function("getQueue", &CommandBuffer::getQueue, allow_raw_pointer<arg<0>>())
        .function("draw", select_overload<void(InputAssembler *)>(&CommandBuffer::draw), allow_raw_pointers())
        .property("numDrawCalls", &CommandBuffer::getNumDrawCalls)
        .property("numInstances", &CommandBuffer::getNumInstances)
        .property("numTris", &CommandBuffer::getNumTris);
    class_<CCWGPUCommandBuffer, base<CommandBuffer>>("CCWGPUCommandBuffer")
        .constructor<>()
        .function("setViewport", select_overload<void(const Viewport &)>(&CCWGPUCommandBuffer::setViewport))
        .function("setScissor", select_overload<void(const Rect &)>(&CCWGPUCommandBuffer::setScissor))
        .function("beginRenderPass", select_overload<void(RenderPass *, Framebuffer *, const Rect &, const ColorList &, float, uint32_t)>(&CCWGPUCommandBuffer::beginRenderPass), allow_raw_pointers())
        .function("bindDescriptorSet", select_overload<void(uint32_t, DescriptorSet *, const std::vector<uint32_t> &)>(&CCWGPUCommandBuffer::bindDescriptorSet), allow_raw_pointers())
        .function("bindPipelineState", select_overload<void(PipelineState *)>(&CCWGPUCommandBuffer::bindPipelineState), allow_raw_pointer<arg<0>>())
        .function("bindInputAssembler", select_overload<void(InputAssembler *)>(&CCWGPUCommandBuffer::bindInputAssembler), allow_raw_pointer<arg<0>>())
        .function("drawByInfo", select_overload<void(const DrawInfo &)>(&CCWGPUCommandBuffer::draw))
        .function("updateIndirectBuffer", select_overload<void(Buffer *, const DrawInfoList &)>(&CCWGPUCommandBuffer::updateIndirectBuffer), allow_raw_pointers())
        .function("updateBuffer", select_overload<void(Buffer *, const emscripten::val &v, uint32_t)>(&CCWGPUCommandBuffer::updateBuffer), allow_raw_pointers())
        .function("getType", &CCWGPUCommandBuffer::getCommandBufferType);

    class_<Queue>("Queue")
        .function("initialize", &Queue::initialize)
        .function("destroy", &Queue::destroy)
        .function("submit", select_overload<void(const CommandBufferList &cmdBuffs)>(&Queue::submit));
    class_<CCWGPUQueue, base<Queue>>("CCWGPUQueue")
        .constructor<>();

    class_<PipelineState>("PipelineState")
        .function("initialize", &Queue::initialize)
        .function("destroy", &Queue::destroy);
    class_<CCWGPUPipelineState, base<PipelineState>>("CCWGPUPipelineState")
        .constructor<>();

    class_<GeneralBarrier>("GeneralBarrier")
        .constructor<GeneralBarrierInfo>();
    class_<WGPUGeneralBarrier>("WGPUGeneralBarrier")
        .constructor<GeneralBarrierInfo>();

    class_<BufferBarrier>("BufferBarrier")
        .constructor<BufferBarrierInfo>();
    class_<WGPUBufferBarrier>("WGPUBufferBarrier")
        .constructor<BufferBarrierInfo>();

    class_<TextureBarrier>("TextureBarrier")
        .constructor<TextureBarrierInfo>();
    class_<WGPUTextureBarrier>("WGPUTextureBarrier")
        .constructor<TextureBarrierInfo>();
};
} // namespace cc::gfx
