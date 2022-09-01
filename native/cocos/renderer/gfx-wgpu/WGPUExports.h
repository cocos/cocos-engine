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
    Exporter(T &t, const char *propName, U V::*field) {
        t.field(propName, field);
    }
};

template <typename T, typename U, typename V>
struct Exporter<T, U, V, typename std::enable_if<std::is_enum<U>::value>::type> {
    Exporter(T &t, const char *propName, U V::*field) {
        std::function<void(V & v, std::underlying_type_t<U> u)> set = [field](V &v, std::underlying_type_t<U> u) {
            v.*field = U{u};
        };
        std::function<std::underlying_type_t<U>(const V &v)> get = [field](const V &v) {
            return static_cast<std::underlying_type_t<U>>(v.*field);
        };
        t.field(propName, get, set);
    }
};

// template <typename T, typename U, typename V>
// struct Exporter<T, U, V, typename std::enable_if<std::is_pointer<U>::value>::type> {
//     Exporter(T &t, const char *propName, U V::*field) {
//         std::function<void(V & v, uintptr_t u)> set = [field](V &v, uintptr_t u) {
//             v.*field = reinterpret_cast<U>(u);
//         };
//         std::function<uintptr_t(const V &v)> get = [field](const V &v) {
//             return reinterpret_cast<uintptr_t>(v.*field);
//         };
//         t.field(propName, get, set);
//     }
// };

#define PROCESS_STRUCT_MEMBERS(r, struct_name, property) \
    { Exporter exporter(obj, BOOST_PP_STRINGIZE(property), &struct_name::property); }

#define EXPORT_STRUCT_POD(struct_name, ...)                                                                \
    {                                                                                                      \
        auto obj = value_object<struct_name>(#struct_name);                                                \
        BOOST_PP_SEQ_FOR_EACH(PROCESS_STRUCT_MEMBERS, struct_name, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

// #define PROCESS_STRUCT_MEMBERS_MAY_BE_PTR \
//     { \
//         EmsSpecializer<MEMBER_TYPE(prop)>\
//         Exporter exporter(obj, BOOST_PP_STRINGIZE(property), &struct_name::property); \
//     }

// #define EXPORT_STRUCT_NPOD(struct_name, ...)                                                                \
//     {                                                                                                      \
//         auto obj = value_object<struct_name>(#struct_name);                                                \
//         BOOST_PP_SEQ_FOR_EACH(PROCESS_STRUCT_MEMBERS, struct_name, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
//     }

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

// namespace emscripten {
// namespace internal {

// template <typename T>
// struct emscripten::internal::BindingType<PtTest *> {
//    typedef PtTest* WireType;
//     static WireType toWireType(PtTest *ptr) {
//         return ptr;
//     }

//     static WireType fromWireType(WireType value) {
//         return value;
//     }
// };

// template <>
// struct emscripten::internal::TypeID<PtTest *, void> {
//     static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::CanonicalizedID<PtTest *>::get(); }
// };

// template <>
// struct emscripten::internal::TypeID<PtInternal *, void> {
//     static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::CanonicalizedID<PtInternal *>::get(); }
// };

template <>
struct emscripten::internal::TypeID<cc::gfx::CCWGPUDevice *, void> {
    static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::CanonicalizedID<cc::gfx::CCWGPUDevice *>::get(); }
};

// uint32  PtTest*
template <typename T>
struct EmsSpecializer {
};

// remove_cv/remove_reference are required for TypeID, but not BindingType, see https://github.com/emscripten-core/emscripten/issues/7292
// template<typename T>
// struct TypeID<T, typename std::enable_if<std::is_pod<typename std::remove_cv<typename std::remove_reference<T>::type>::type>::value, void>::type> {
//   static constexpr TYPEID get() {
//     return TypeID<IntWrapperIntermediate>::get();
//   }
// };

// template<typename T>
// struct BindingType<T, typename std::enable_if<std::is_pod<T>::value, void>::type> {
//   typedef typename BindingType<IntWrapperIntermediate>::WireType WireType;

//   constexpr static WireType toWireType(const T& v) {
//     return BindingType<IntWrapperIntermediate>::toWireType(v.get());
//   }
//   constexpr static T fromWireType(WireType v) {
//     return T::create(BindingType<IntWrapperIntermediate>::fromWireType(v));
//   }
// };
// } // namespace internal
// } // namespace emscripten

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
    EXPORT_STRUCT_POD(DrawInfo, vertexCount, firstVertex, indexCount, firstIndex, instanceCount, firstInstance);

    // EXPORT_STRUCT_POD(PtTest, value, next);
    // EXPORT_STRUCT_POD(Point2D, x, y, z, w, type, usage, flag, prop, test);
    // EXPORT_STRUCT_POD(TestPoint, value, pt);
    EXPORT_STRUCT_POD(Offset, x, y, z);
    EXPORT_STRUCT_POD(Rect, x, y, width, height);
    EXPORT_STRUCT_POD(Extent, width, height, depth);
    EXPORT_STRUCT_POD(TextureSubresLayers, mipLevel, baseArrayLayer, layerCount);
    EXPORT_STRUCT_POD(TextureCopy, srcSubres, srcOffset, dstSubres, dstOffset, extent);
    EXPORT_STRUCT_POD(TextureBlit, srcSubres, srcOffset, srcExtent, dstSubres, dstOffset, dstExtent);
    EXPORT_STRUCT_POD(BufferTextureCopy, buffOffset, buffStride, buffTexHeight, texOffset, texExtent, texSubres);
    EXPORT_STRUCT_POD(Viewport, left, top, width, height, minDepth, maxDepth);
    EXPORT_STRUCT_POD(Color, x, y, z, w);

    // class_<TestClass>("TestClass")
    //     .constructor<>()
    //     .property("pt", &TestClass::getPt, &TestClass::setPt, allow_raw_pointers());
    // EXPORT_STRUCT_POD(BindingMappingInfo, maxBlockCounts, maxSamplerTextureCounts, maxSamplerCounts, maxTextureCounts, maxBufferCounts, maxImageCounts, maxSubpassInputCounts, setIndices);

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

    value_object<PtInternal>("PtInternal")
        .field("value", &PtInternal::value);
    function("PtInternal", &GenInstance<PtInternal>::instance);

    value_object<PtTest>("PtTest")
        .field("value", &PtTest::value)
        .field("device", &PtTest::device);

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
        .function("execute", select_overload<void(const CommandBufferList &, uint32_t)>(&CommandBuffer::execute), allow_raw_pointers())
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
