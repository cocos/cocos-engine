#include "scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/gfx-gles2/GFXGLES2.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cocos2d_GFXContext_proto = nullptr;
se::Class* __jsb_cocos2d_GFXContext_class = nullptr;

static bool js_gfx_GFXContext_sharedContext(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_sharedContext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXContext* result = cobj->sharedContext();
        ok &= native_ptr_to_seval<cocos2d::GFXContext>((cocos2d::GFXContext*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_sharedContext : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_sharedContext)

static bool js_gfx_GFXContext_colorFormat(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_colorFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->colorFormat();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_colorFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_colorFormat)

static bool js_gfx_GFXContext_detphStencilFormat(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_detphStencilFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->detphStencilFormat();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_detphStencilFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_detphStencilFormat)

static bool js_gfx_GFXContext_device(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_device)

static bool js_gfx_GFXContext_initialize(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXContextInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXContextInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_initialize)

static bool js_gfx_GFXContext_destroy(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_destroy)

static bool js_gfx_GFXContext_vsyncMode(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_vsyncMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->vsyncMode();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_vsyncMode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_vsyncMode)

static bool js_gfx_GFXContext_present(se::State& s)
{
    cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_present)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXContext_finalize)

static bool js_gfx_GFXContext_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_constructor : Error processing arguments");
    cocos2d::GFXContext* cobj = JSB_ALLOC(cocos2d::GFXContext, arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXContext_constructor, __jsb_cocos2d_GFXContext_class, js_cocos2d_GFXContext_finalize)




static bool js_cocos2d_GFXContext_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXContext)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXContext* cobj = (cocos2d::GFXContext*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXContext_finalize)

bool js_register_gfx_GFXContext(se::Object* obj)
{
    auto cls = se::Class::create("GFXContext", obj, nullptr, _SE(js_gfx_GFXContext_constructor));

    cls->defineFunction("sharedContext", _SE(js_gfx_GFXContext_sharedContext));
    cls->defineFunction("colorFormat", _SE(js_gfx_GFXContext_colorFormat));
    cls->defineFunction("detphStencilFormat", _SE(js_gfx_GFXContext_detphStencilFormat));
    cls->defineFunction("device", _SE(js_gfx_GFXContext_device));
    cls->defineFunction("initialize", _SE(js_gfx_GFXContext_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXContext_destroy));
    cls->defineFunction("vsyncMode", _SE(js_gfx_GFXContext_vsyncMode));
    cls->defineFunction("present", _SE(js_gfx_GFXContext_present));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXContext_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXContext>(cls);

    __jsb_cocos2d_GFXContext_proto = cls->getProto();
    __jsb_cocos2d_GFXContext_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXWindow_proto = nullptr;
se::Class* __jsb_cocos2d_GFXWindow_class = nullptr;

static bool js_gfx_GFXWindow_depthStencilTexView(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_depthStencilTexView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTextureView* result = cobj->depthStencilTexView();
        ok &= native_ptr_to_seval<cocos2d::GFXTextureView>((cocos2d::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_depthStencilTexView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_depthStencilTexView)

static bool js_gfx_GFXWindow_renderPass(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_renderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXRenderPass* result = cobj->renderPass();
        ok &= native_ptr_to_seval<cocos2d::GFXRenderPass>((cocos2d::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_renderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_renderPass)

static bool js_gfx_GFXWindow_isOffscreen(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_isOffscreen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isOffscreen();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_isOffscreen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_isOffscreen)

static bool js_gfx_GFXWindow_detphStencilFormat(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_detphStencilFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->detphStencilFormat();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_detphStencilFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_detphStencilFormat)

static bool js_gfx_GFXWindow_height(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_height : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->height();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_height : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_height)

static bool js_gfx_GFXWindow_colorTexView(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_colorTexView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTextureView* result = cobj->colorTexView();
        ok &= native_ptr_to_seval<cocos2d::GFXTextureView>((cocos2d::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_colorTexView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_colorTexView)

static bool js_gfx_GFXWindow_initialize(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXWindowInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXWindowInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_initialize)

static bool js_gfx_GFXWindow_destroy(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_destroy)

static bool js_gfx_GFXWindow_framebuffer(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_framebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXFramebuffer* result = cobj->framebuffer();
        ok &= native_ptr_to_seval<cocos2d::GFXFramebuffer>((cocos2d::GFXFramebuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_framebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_framebuffer)

static bool js_gfx_GFXWindow_colorFormat(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_colorFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->colorFormat();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_colorFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_colorFormat)

static bool js_gfx_GFXWindow_width(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_width : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->width();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_width : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_width)

static bool js_gfx_GFXWindow_resize(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_resize : Error processing arguments");
        cobj->resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_resize)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXWindow_finalize)

static bool js_gfx_GFXWindow_constructor(se::State& s)
{
    //#3 cocos2d::GFXWindow: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXWindow constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXWindow_constructor, __jsb_cocos2d_GFXWindow_class, js_cocos2d_GFXWindow_finalize)




static bool js_cocos2d_GFXWindow_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXWindow)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXWindow_finalize)

bool js_register_gfx_GFXWindow(se::Object* obj)
{
    auto cls = se::Class::create("GFXWindow", obj, nullptr, _SE(js_gfx_GFXWindow_constructor));

    cls->defineFunction("depthStencilTexView", _SE(js_gfx_GFXWindow_depthStencilTexView));
    cls->defineFunction("renderPass", _SE(js_gfx_GFXWindow_renderPass));
    cls->defineFunction("isOffscreen", _SE(js_gfx_GFXWindow_isOffscreen));
    cls->defineFunction("detphStencilFormat", _SE(js_gfx_GFXWindow_detphStencilFormat));
    cls->defineFunction("height", _SE(js_gfx_GFXWindow_height));
    cls->defineFunction("colorTexView", _SE(js_gfx_GFXWindow_colorTexView));
    cls->defineFunction("initialize", _SE(js_gfx_GFXWindow_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXWindow_destroy));
    cls->defineFunction("framebuffer", _SE(js_gfx_GFXWindow_framebuffer));
    cls->defineFunction("colorFormat", _SE(js_gfx_GFXWindow_colorFormat));
    cls->defineFunction("width", _SE(js_gfx_GFXWindow_width));
    cls->defineFunction("resize", _SE(js_gfx_GFXWindow_resize));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXWindow_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXWindow>(cls);

    __jsb_cocos2d_GFXWindow_proto = cls->getProto();
    __jsb_cocos2d_GFXWindow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBuffer_class = nullptr;

static bool js_gfx_GFXBuffer_count(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->count();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_count : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_count)

static bool js_gfx_GFXBuffer_memUsage(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_memUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->memUsage();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_memUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_memUsage)

static bool js_gfx_GFXBuffer_usage(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_usage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->usage();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_usage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_usage)

static bool js_gfx_GFXBuffer_bufferView(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_bufferView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->bufferView();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_bufferView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_bufferView)

static bool js_gfx_GFXBuffer_update(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        void* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    if (argc == 2) {
        void* arg0 = nullptr;
        unsigned int arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        void* arg0 = nullptr;
        unsigned int arg1 = 0;
        unsigned int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_update)

static bool js_gfx_GFXBuffer_flags(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_flags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->flags();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_flags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_flags)

static bool js_gfx_GFXBuffer_initialize(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_initialize)

static bool js_gfx_GFXBuffer_destroy(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_destroy)

static bool js_gfx_GFXBuffer_stride(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_stride : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->stride();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_stride : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_stride)

static bool js_gfx_GFXBuffer_resize(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_resize : Error processing arguments");
        cobj->resize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_resize)

static bool js_gfx_GFXBuffer_size(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_size : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->size();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_size : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_size)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBuffer_finalize)

static bool js_gfx_GFXBuffer_constructor(se::State& s)
{
    //#3 cocos2d::GFXBuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXBuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBuffer_constructor, __jsb_cocos2d_GFXBuffer_class, js_cocos2d_GFXBuffer_finalize)




static bool js_cocos2d_GFXBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBuffer_finalize)

bool js_register_gfx_GFXBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXBuffer", obj, nullptr, _SE(js_gfx_GFXBuffer_constructor));

    cls->defineFunction("count", _SE(js_gfx_GFXBuffer_count));
    cls->defineFunction("memUsage", _SE(js_gfx_GFXBuffer_memUsage));
    cls->defineFunction("usage", _SE(js_gfx_GFXBuffer_usage));
    cls->defineFunction("bufferView", _SE(js_gfx_GFXBuffer_bufferView));
    cls->defineFunction("update", _SE(js_gfx_GFXBuffer_update));
    cls->defineFunction("flags", _SE(js_gfx_GFXBuffer_flags));
    cls->defineFunction("initialize", _SE(js_gfx_GFXBuffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXBuffer_destroy));
    cls->defineFunction("stride", _SE(js_gfx_GFXBuffer_stride));
    cls->defineFunction("resize", _SE(js_gfx_GFXBuffer_resize));
    cls->defineFunction("size", _SE(js_gfx_GFXBuffer_size));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBuffer>(cls);

    __jsb_cocos2d_GFXBuffer_proto = cls->getProto();
    __jsb_cocos2d_GFXBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXTexture_proto = nullptr;
se::Class* __jsb_cocos2d_GFXTexture_class = nullptr;

static bool js_gfx_GFXTexture_arrayLayer(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_arrayLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->arrayLayer();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_arrayLayer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_arrayLayer)

static bool js_gfx_GFXTexture_format(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_format : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->format();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_format : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_format)

static bool js_gfx_GFXTexture_buffer(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_buffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->buffer();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_buffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_buffer)

static bool js_gfx_GFXTexture_mipLevel(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_mipLevel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->mipLevel();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_mipLevel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_mipLevel)

static bool js_gfx_GFXTexture_height(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_height : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->height();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_height : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_height)

static bool js_gfx_GFXTexture_usage(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_usage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->usage();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_usage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_usage)

static bool js_gfx_GFXTexture_depth(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_depth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->depth();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_depth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_depth)

static bool js_gfx_GFXTexture_flags(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_flags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->flags();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_flags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_flags)

static bool js_gfx_GFXTexture_samples(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_samples : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->samples();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_samples : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_samples)

static bool js_gfx_GFXTexture_initialize(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_initialize)

static bool js_gfx_GFXTexture_destroy(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_destroy)

static bool js_gfx_GFXTexture_type(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_type : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->type();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_type : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_type)

static bool js_gfx_GFXTexture_width(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_width : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->width();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_width : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_width)

static bool js_gfx_GFXTexture_resize(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_resize : Error processing arguments");
        cobj->resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_resize)

static bool js_gfx_GFXTexture_size(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_size : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->size();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_size : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_size)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTexture_finalize)

static bool js_gfx_GFXTexture_constructor(se::State& s)
{
    //#3 cocos2d::GFXTexture: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXTexture constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXTexture_constructor, __jsb_cocos2d_GFXTexture_class, js_cocos2d_GFXTexture_finalize)




static bool js_cocos2d_GFXTexture_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXTexture)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXTexture_finalize)

bool js_register_gfx_GFXTexture(se::Object* obj)
{
    auto cls = se::Class::create("GFXTexture", obj, nullptr, _SE(js_gfx_GFXTexture_constructor));

    cls->defineFunction("arrayLayer", _SE(js_gfx_GFXTexture_arrayLayer));
    cls->defineFunction("format", _SE(js_gfx_GFXTexture_format));
    cls->defineFunction("buffer", _SE(js_gfx_GFXTexture_buffer));
    cls->defineFunction("mipLevel", _SE(js_gfx_GFXTexture_mipLevel));
    cls->defineFunction("height", _SE(js_gfx_GFXTexture_height));
    cls->defineFunction("usage", _SE(js_gfx_GFXTexture_usage));
    cls->defineFunction("depth", _SE(js_gfx_GFXTexture_depth));
    cls->defineFunction("flags", _SE(js_gfx_GFXTexture_flags));
    cls->defineFunction("samples", _SE(js_gfx_GFXTexture_samples));
    cls->defineFunction("initialize", _SE(js_gfx_GFXTexture_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXTexture_destroy));
    cls->defineFunction("type", _SE(js_gfx_GFXTexture_type));
    cls->defineFunction("width", _SE(js_gfx_GFXTexture_width));
    cls->defineFunction("resize", _SE(js_gfx_GFXTexture_resize));
    cls->defineFunction("size", _SE(js_gfx_GFXTexture_size));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXTexture>(cls);

    __jsb_cocos2d_GFXTexture_proto = cls->getProto();
    __jsb_cocos2d_GFXTexture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXTextureView_proto = nullptr;
se::Class* __jsb_cocos2d_GFXTextureView_class = nullptr;

static bool js_gfx_GFXTextureView_baseLevel(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_baseLevel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->baseLevel();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_baseLevel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_baseLevel)

static bool js_gfx_GFXTextureView_format(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_format : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->format();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_format : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_format)

static bool js_gfx_GFXTextureView_levelCount(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_levelCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->levelCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_levelCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_levelCount)

static bool js_gfx_GFXTextureView_texture(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_texture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTexture* result = cobj->texture();
        ok &= native_ptr_to_seval<cocos2d::GFXTexture>((cocos2d::GFXTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_texture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_texture)

static bool js_gfx_GFXTextureView_layerCount(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_layerCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->layerCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_layerCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_layerCount)

static bool js_gfx_GFXTextureView_initialize(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureViewInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureViewInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_initialize)

static bool js_gfx_GFXTextureView_destroy(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_destroy)

static bool js_gfx_GFXTextureView_baseLayer(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_baseLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->baseLayer();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_baseLayer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_baseLayer)

static bool js_gfx_GFXTextureView_type(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_type : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->type();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_type : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_type)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXTextureView_finalize)

static bool js_gfx_GFXTextureView_constructor(se::State& s)
{
    //#3 cocos2d::GFXTextureView: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXTextureView constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXTextureView_constructor, __jsb_cocos2d_GFXTextureView_class, js_cocos2d_GFXTextureView_finalize)




static bool js_cocos2d_GFXTextureView_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXTextureView)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXTextureView_finalize)

bool js_register_gfx_GFXTextureView(se::Object* obj)
{
    auto cls = se::Class::create("GFXTextureView", obj, nullptr, _SE(js_gfx_GFXTextureView_constructor));

    cls->defineFunction("baseLevel", _SE(js_gfx_GFXTextureView_baseLevel));
    cls->defineFunction("format", _SE(js_gfx_GFXTextureView_format));
    cls->defineFunction("levelCount", _SE(js_gfx_GFXTextureView_levelCount));
    cls->defineFunction("texture", _SE(js_gfx_GFXTextureView_texture));
    cls->defineFunction("layerCount", _SE(js_gfx_GFXTextureView_layerCount));
    cls->defineFunction("initialize", _SE(js_gfx_GFXTextureView_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXTextureView_destroy));
    cls->defineFunction("baseLayer", _SE(js_gfx_GFXTextureView_baseLayer));
    cls->defineFunction("type", _SE(js_gfx_GFXTextureView_type));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXTextureView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXTextureView>(cls);

    __jsb_cocos2d_GFXTextureView_proto = cls->getProto();
    __jsb_cocos2d_GFXTextureView_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXSampler_proto = nullptr;
se::Class* __jsb_cocos2d_GFXSampler_class = nullptr;

static bool js_gfx_GFXSampler_max_lod(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_max_lod : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->max_lod();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_max_lod : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_max_lod)

static bool js_gfx_GFXSampler_initialize(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXSamplerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXSamplerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_initialize)

static bool js_gfx_GFXSampler_destroy(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_destroy)

static bool js_gfx_GFXSampler_mip_filter(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_mip_filter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->mip_filter();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_mip_filter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_mip_filter)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXSampler_finalize)

static bool js_gfx_GFXSampler_constructor(se::State& s)
{
    //#3 cocos2d::GFXSampler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXSampler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXSampler_constructor, __jsb_cocos2d_GFXSampler_class, js_cocos2d_GFXSampler_finalize)




static bool js_cocos2d_GFXSampler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXSampler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXSampler_finalize)

bool js_register_gfx_GFXSampler(se::Object* obj)
{
    auto cls = se::Class::create("GFXSampler", obj, nullptr, _SE(js_gfx_GFXSampler_constructor));

    cls->defineFunction("max_lod", _SE(js_gfx_GFXSampler_max_lod));
    cls->defineFunction("initialize", _SE(js_gfx_GFXSampler_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXSampler_destroy));
    cls->defineFunction("mip_filter", _SE(js_gfx_GFXSampler_mip_filter));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXSampler>(cls);

    __jsb_cocos2d_GFXSampler_proto = cls->getProto();
    __jsb_cocos2d_GFXSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXShader_proto = nullptr;
se::Class* __jsb_cocos2d_GFXShader_class = nullptr;

static bool js_gfx_GFXShader_name(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_name : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::String& result = cobj->name();
        s.rval().setString(result.buffer());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_name : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_name)

static bool js_gfx_GFXShader_initialize(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXShaderInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXShaderInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_initialize)

static bool js_gfx_GFXShader_destroy(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_destroy)

static bool js_gfx_GFXShader_hash(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_hash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->hash();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_hash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_hash)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXShader_finalize)

static bool js_gfx_GFXShader_constructor(se::State& s)
{
    //#3 cocos2d::GFXShader: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXShader constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXShader_constructor, __jsb_cocos2d_GFXShader_class, js_cocos2d_GFXShader_finalize)




static bool js_cocos2d_GFXShader_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXShader)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXShader_finalize)

bool js_register_gfx_GFXShader(se::Object* obj)
{
    auto cls = se::Class::create("GFXShader", obj, nullptr, _SE(js_gfx_GFXShader_constructor));

    cls->defineFunction("name", _SE(js_gfx_GFXShader_name));
    cls->defineFunction("initialize", _SE(js_gfx_GFXShader_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXShader_destroy));
    cls->defineFunction("id", _SE(js_gfx_GFXShader_hash));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXShader_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXShader>(cls);

    __jsb_cocos2d_GFXShader_proto = cls->getProto();
    __jsb_cocos2d_GFXShader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXInputAssembler_proto = nullptr;
se::Class* __jsb_cocos2d_GFXInputAssembler_class = nullptr;

static bool js_gfx_GFXInputAssembler_vertexBuffers(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertexBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXBuffer *>& result = cobj->vertexBuffers();
        ok &= native_ptr_to_seval<cocos2d::GFXBufferList&>((cocos2d::GFXBufferList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertexBuffers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertexBuffers)

static bool js_gfx_GFXInputAssembler_firstInstance(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_firstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->firstInstance();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_firstInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_firstInstance)

static bool js_gfx_GFXInputAssembler_initialize(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssemblerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXInputAssemblerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_initialize)

static bool js_gfx_GFXInputAssembler_setIndexCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setIndexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setIndexCount : Error processing arguments");
        cobj->setIndexCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setIndexCount)

static bool js_gfx_GFXInputAssembler_vertexOffset(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->vertexOffset();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertexOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertexOffset)

static bool js_gfx_GFXInputAssembler_setFirstInstance(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setFirstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setFirstInstance : Error processing arguments");
        cobj->setFirstInstance(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setFirstInstance)

static bool js_gfx_GFXInputAssembler_destroy(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_destroy)

static bool js_gfx_GFXInputAssembler_setVertexOffset(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setVertexOffset : Error processing arguments");
        cobj->setVertexOffset(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setVertexOffset)

static bool js_gfx_GFXInputAssembler_firstVertex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_firstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->firstVertex();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_firstVertex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_firstVertex)

static bool js_gfx_GFXInputAssembler_instanceCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_instanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->instanceCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_instanceCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_instanceCount)

static bool js_gfx_GFXInputAssembler_vertexCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->vertexCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertexCount)

static bool js_gfx_GFXInputAssembler_attributes(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_attributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXAttribute>& result = cobj->attributes();
        ok &= native_ptr_to_seval<cocos2d::GFXAttributeList&>((cocos2d::GFXAttributeList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_attributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_attributes)

static bool js_gfx_GFXInputAssembler_setFirstVertex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setFirstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setFirstVertex : Error processing arguments");
        cobj->setFirstVertex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setFirstVertex)

static bool js_gfx_GFXInputAssembler_firstIndex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_firstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->firstIndex();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_firstIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_firstIndex)

static bool js_gfx_GFXInputAssembler_indirectBuffer(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_indirectBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXBuffer* result = cobj->indirectBuffer();
        ok &= native_ptr_to_seval<cocos2d::GFXBuffer>((cocos2d::GFXBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_indirectBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_indirectBuffer)

static bool js_gfx_GFXInputAssembler_indexCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_indexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->indexCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_indexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_indexCount)

static bool js_gfx_GFXInputAssembler_setVertexCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setVertexCount : Error processing arguments");
        cobj->setVertexCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setVertexCount)

static bool js_gfx_GFXInputAssembler_indexBuffer(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_indexBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXBuffer* result = cobj->indexBuffer();
        ok &= native_ptr_to_seval<cocos2d::GFXBuffer>((cocos2d::GFXBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_indexBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_indexBuffer)

static bool js_gfx_GFXInputAssembler_setFirstIndex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setFirstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setFirstIndex : Error processing arguments");
        cobj->setFirstIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setFirstIndex)

static bool js_gfx_GFXInputAssembler_setInstanceCount(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_setInstanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_setInstanceCount : Error processing arguments");
        cobj->setInstanceCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_setInstanceCount)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXInputAssembler_finalize)

static bool js_gfx_GFXInputAssembler_constructor(se::State& s)
{
    //#3 cocos2d::GFXInputAssembler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXInputAssembler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXInputAssembler_constructor, __jsb_cocos2d_GFXInputAssembler_class, js_cocos2d_GFXInputAssembler_finalize)




static bool js_cocos2d_GFXInputAssembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXInputAssembler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXInputAssembler_finalize)

bool js_register_gfx_GFXInputAssembler(se::Object* obj)
{
    auto cls = se::Class::create("GFXInputAssembler", obj, nullptr, _SE(js_gfx_GFXInputAssembler_constructor));

    cls->defineFunction("vertexBuffers", _SE(js_gfx_GFXInputAssembler_vertexBuffers));
    cls->defineFunction("firstInstance", _SE(js_gfx_GFXInputAssembler_firstInstance));
    cls->defineFunction("initialize", _SE(js_gfx_GFXInputAssembler_initialize));
    cls->defineFunction("setIndexCount", _SE(js_gfx_GFXInputAssembler_setIndexCount));
    cls->defineFunction("vertexOffset", _SE(js_gfx_GFXInputAssembler_vertexOffset));
    cls->defineFunction("setFirstInstance", _SE(js_gfx_GFXInputAssembler_setFirstInstance));
    cls->defineFunction("destroy", _SE(js_gfx_GFXInputAssembler_destroy));
    cls->defineFunction("setVertexOffset", _SE(js_gfx_GFXInputAssembler_setVertexOffset));
    cls->defineFunction("firstVertex", _SE(js_gfx_GFXInputAssembler_firstVertex));
    cls->defineFunction("instanceCount", _SE(js_gfx_GFXInputAssembler_instanceCount));
    cls->defineFunction("vertexCount", _SE(js_gfx_GFXInputAssembler_vertexCount));
    cls->defineFunction("attributes", _SE(js_gfx_GFXInputAssembler_attributes));
    cls->defineFunction("setFirstVertex", _SE(js_gfx_GFXInputAssembler_setFirstVertex));
    cls->defineFunction("firstIndex", _SE(js_gfx_GFXInputAssembler_firstIndex));
    cls->defineFunction("indirectBuffer", _SE(js_gfx_GFXInputAssembler_indirectBuffer));
    cls->defineFunction("indexCount", _SE(js_gfx_GFXInputAssembler_indexCount));
    cls->defineFunction("setVertexCount", _SE(js_gfx_GFXInputAssembler_setVertexCount));
    cls->defineFunction("indexBuffer", _SE(js_gfx_GFXInputAssembler_indexBuffer));
    cls->defineFunction("setFirstIndex", _SE(js_gfx_GFXInputAssembler_setFirstIndex));
    cls->defineFunction("setInstanceCount", _SE(js_gfx_GFXInputAssembler_setInstanceCount));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXInputAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXInputAssembler>(cls);

    __jsb_cocos2d_GFXInputAssembler_proto = cls->getProto();
    __jsb_cocos2d_GFXInputAssembler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXRenderPass_proto = nullptr;
se::Class* __jsb_cocos2d_GFXRenderPass_class = nullptr;

static bool js_gfx_GFXRenderPass_initialize(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRenderPassInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRenderPassInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_initialize)

static bool js_gfx_GFXRenderPass_destroy(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXRenderPass_finalize)

static bool js_gfx_GFXRenderPass_constructor(se::State& s)
{
    //#3 cocos2d::GFXRenderPass: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXRenderPass constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXRenderPass_constructor, __jsb_cocos2d_GFXRenderPass_class, js_cocos2d_GFXRenderPass_finalize)




static bool js_cocos2d_GFXRenderPass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXRenderPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXRenderPass_finalize)

bool js_register_gfx_GFXRenderPass(se::Object* obj)
{
    auto cls = se::Class::create("GFXRenderPass", obj, nullptr, _SE(js_gfx_GFXRenderPass_constructor));

    cls->defineFunction("initialize", _SE(js_gfx_GFXRenderPass_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXRenderPass_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXRenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXRenderPass>(cls);

    __jsb_cocos2d_GFXRenderPass_proto = cls->getProto();
    __jsb_cocos2d_GFXRenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXFramebuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GFXFramebuffer_class = nullptr;

static bool js_gfx_GFXFramebuffer_depthStencilView(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_depthStencilView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTextureView* result = cobj->depthStencilView();
        ok &= native_ptr_to_seval<cocos2d::GFXTextureView>((cocos2d::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_depthStencilView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_depthStencilView)

static bool js_gfx_GFXFramebuffer_isOffscreen(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_isOffscreen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isOffscreen();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_isOffscreen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_isOffscreen)

static bool js_gfx_GFXFramebuffer_renderPass(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_renderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXRenderPass* result = cobj->renderPass();
        ok &= native_ptr_to_seval<cocos2d::GFXRenderPass>((cocos2d::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_renderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_renderPass)

static bool js_gfx_GFXFramebuffer_initialize(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXFramebufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXFramebufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_initialize)

static bool js_gfx_GFXFramebuffer_destroy(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_destroy)

static bool js_gfx_GFXFramebuffer_colorViews(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_colorViews : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXTextureView *>& result = cobj->colorViews();
        ok &= native_ptr_to_seval<cocos2d::GFXTextureViewList&>((cocos2d::GFXTextureViewList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_colorViews : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_colorViews)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXFramebuffer_finalize)

static bool js_gfx_GFXFramebuffer_constructor(se::State& s)
{
    //#3 cocos2d::GFXFramebuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXFramebuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXFramebuffer_constructor, __jsb_cocos2d_GFXFramebuffer_class, js_cocos2d_GFXFramebuffer_finalize)




static bool js_cocos2d_GFXFramebuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXFramebuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXFramebuffer_finalize)

bool js_register_gfx_GFXFramebuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXFramebuffer", obj, nullptr, _SE(js_gfx_GFXFramebuffer_constructor));

    cls->defineFunction("depthStencilView", _SE(js_gfx_GFXFramebuffer_depthStencilView));
    cls->defineFunction("isOffscreen", _SE(js_gfx_GFXFramebuffer_isOffscreen));
    cls->defineFunction("renderPass", _SE(js_gfx_GFXFramebuffer_renderPass));
    cls->defineFunction("initialize", _SE(js_gfx_GFXFramebuffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXFramebuffer_destroy));
    cls->defineFunction("colorViews", _SE(js_gfx_GFXFramebuffer_colorViews));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXFramebuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXFramebuffer>(cls);

    __jsb_cocos2d_GFXFramebuffer_proto = cls->getProto();
    __jsb_cocos2d_GFXFramebuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXBindingLayout_proto = nullptr;
se::Class* __jsb_cocos2d_GFXBindingLayout_class = nullptr;

static bool js_gfx_GFXBindingLayout_bindTextureView(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cocos2d::GFXTextureView* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_bindTextureView : Error processing arguments");
        cobj->bindTextureView(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_bindTextureView)

static bool js_gfx_GFXBindingLayout_bindBuffer(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cocos2d::GFXBuffer* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_bindBuffer : Error processing arguments");
        cobj->bindBuffer(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_bindBuffer)

static bool js_gfx_GFXBindingLayout_bindSampler(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_bindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cocos2d::GFXSampler* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_bindSampler : Error processing arguments");
        cobj->bindSampler(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_bindSampler)

static bool js_gfx_GFXBindingLayout_update(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_update)

static bool js_gfx_GFXBindingLayout_initialize(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayoutInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBindingLayoutInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_initialize)

static bool js_gfx_GFXBindingLayout_destroy(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXBindingLayout_finalize)

static bool js_gfx_GFXBindingLayout_constructor(se::State& s)
{
    //#3 cocos2d::GFXBindingLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXBindingLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXBindingLayout_constructor, __jsb_cocos2d_GFXBindingLayout_class, js_cocos2d_GFXBindingLayout_finalize)




static bool js_cocos2d_GFXBindingLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXBindingLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXBindingLayout_finalize)

bool js_register_gfx_GFXBindingLayout(se::Object* obj)
{
    auto cls = se::Class::create("GFXBindingLayout", obj, nullptr, _SE(js_gfx_GFXBindingLayout_constructor));

    cls->defineFunction("bindTextureView", _SE(js_gfx_GFXBindingLayout_bindTextureView));
    cls->defineFunction("bindBuffer", _SE(js_gfx_GFXBindingLayout_bindBuffer));
    cls->defineFunction("bindSampler", _SE(js_gfx_GFXBindingLayout_bindSampler));
    cls->defineFunction("update", _SE(js_gfx_GFXBindingLayout_update));
    cls->defineFunction("initialize", _SE(js_gfx_GFXBindingLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXBindingLayout_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXBindingLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXBindingLayout>(cls);

    __jsb_cocos2d_GFXBindingLayout_proto = cls->getProto();
    __jsb_cocos2d_GFXBindingLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXPipelineLayout_proto = nullptr;
se::Class* __jsb_cocos2d_GFXPipelineLayout_class = nullptr;

static bool js_gfx_GFXPipelineLayout_layouts(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_layouts : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXBindingLayout *>& result = cobj->layouts();
        ok &= native_ptr_to_seval<cocos2d::GFXBindingLayoutList&>((cocos2d::GFXBindingLayoutList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_layouts : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_layouts)

static bool js_gfx_GFXPipelineLayout_initialize(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineLayoutInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXPipelineLayoutInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_initialize)

static bool js_gfx_GFXPipelineLayout_destroy(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXPipelineLayout_finalize)

static bool js_gfx_GFXPipelineLayout_constructor(se::State& s)
{
    //#3 cocos2d::GFXPipelineLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXPipelineLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXPipelineLayout_constructor, __jsb_cocos2d_GFXPipelineLayout_class, js_cocos2d_GFXPipelineLayout_finalize)




static bool js_cocos2d_GFXPipelineLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXPipelineLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXPipelineLayout_finalize)

bool js_register_gfx_GFXPipelineLayout(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineLayout", obj, nullptr, _SE(js_gfx_GFXPipelineLayout_constructor));

    cls->defineFunction("layouts", _SE(js_gfx_GFXPipelineLayout_layouts));
    cls->defineFunction("initialize", _SE(js_gfx_GFXPipelineLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXPipelineLayout_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXPipelineLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXPipelineLayout>(cls);

    __jsb_cocos2d_GFXPipelineLayout_proto = cls->getProto();
    __jsb_cocos2d_GFXPipelineLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXPipelineState_proto = nullptr;
se::Class* __jsb_cocos2d_GFXPipelineState_class = nullptr;

static bool js_gfx_GFXPipelineState_primitive(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_primitive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->primitive();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_primitive : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_primitive)

static bool js_gfx_GFXPipelineState_renderPass(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_renderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXRenderPass* result = cobj->renderPass();
        ok &= native_ptr_to_seval<cocos2d::GFXRenderPass>((cocos2d::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_renderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_renderPass)

static bool js_gfx_GFXPipelineState_rasterizerState(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_rasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXRasterizerState& result = cobj->rasterizerState();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXRasterizerState;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_rasterizerState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_rasterizerState)

static bool js_gfx_GFXPipelineState_dynamicStates(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_dynamicStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXDynamicState>& result = cobj->dynamicStates();
        ok &= native_ptr_to_seval<cocos2d::GFXDynamicStateList&>((cocos2d::GFXDynamicStateList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_dynamicStates : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_dynamicStates)

static bool js_gfx_GFXPipelineState_shader(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_shader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXShader* result = cobj->shader();
        ok &= native_ptr_to_seval<cocos2d::GFXShader>((cocos2d::GFXShader*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_shader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_shader)

static bool js_gfx_GFXPipelineState_inputState(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_inputState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXInputState& result = cobj->inputState();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXInputState;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_inputState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_inputState)

static bool js_gfx_GFXPipelineState_blendState(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_blendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXBlendState& result = cobj->blendState();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXBlendState;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_blendState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_blendState)

static bool js_gfx_GFXPipelineState_pipelineLayout(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_pipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXPipelineLayout* result = cobj->pipelineLayout();
        ok &= native_ptr_to_seval<cocos2d::GFXPipelineLayout>((cocos2d::GFXPipelineLayout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_pipelineLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_pipelineLayout)

static bool js_gfx_GFXPipelineState_initialize(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineStateInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXPipelineStateInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_initialize)

static bool js_gfx_GFXPipelineState_destroy(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_destroy)

static bool js_gfx_GFXPipelineState_depthStencilState(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_depthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXDepthStencilState& result = cobj->depthStencilState();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXDepthStencilState;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_depthStencilState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_depthStencilState)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXPipelineState_finalize)

static bool js_gfx_GFXPipelineState_constructor(se::State& s)
{
    //#3 cocos2d::GFXPipelineState: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXPipelineState constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXPipelineState_constructor, __jsb_cocos2d_GFXPipelineState_class, js_cocos2d_GFXPipelineState_finalize)




static bool js_cocos2d_GFXPipelineState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXPipelineState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXPipelineState_finalize)

bool js_register_gfx_GFXPipelineState(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineState", obj, nullptr, _SE(js_gfx_GFXPipelineState_constructor));

    cls->defineFunction("primitive", _SE(js_gfx_GFXPipelineState_primitive));
    cls->defineFunction("renderPass", _SE(js_gfx_GFXPipelineState_renderPass));
    cls->defineFunction("rasterizerState", _SE(js_gfx_GFXPipelineState_rasterizerState));
    cls->defineFunction("dynamicStates", _SE(js_gfx_GFXPipelineState_dynamicStates));
    cls->defineFunction("shader", _SE(js_gfx_GFXPipelineState_shader));
    cls->defineFunction("inputState", _SE(js_gfx_GFXPipelineState_inputState));
    cls->defineFunction("blendState", _SE(js_gfx_GFXPipelineState_blendState));
    cls->defineFunction("pipelineLayout", _SE(js_gfx_GFXPipelineState_pipelineLayout));
    cls->defineFunction("initialize", _SE(js_gfx_GFXPipelineState_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXPipelineState_destroy));
    cls->defineFunction("depthStencilState", _SE(js_gfx_GFXPipelineState_depthStencilState));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXPipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXPipelineState>(cls);

    __jsb_cocos2d_GFXPipelineState_proto = cls->getProto();
    __jsb_cocos2d_GFXPipelineState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXCommandBuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GFXCommandBuffer_class = nullptr;

static bool js_gfx_GFXCommandBuffer_draw(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_draw : Error processing arguments");
        cobj->draw(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_draw)

static bool js_gfx_GFXCommandBuffer_setBlendConstants(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setBlendConstants : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXColor arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXColor
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setBlendConstants : Error processing arguments");
        cobj->setBlendConstants(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setBlendConstants)

static bool js_gfx_GFXCommandBuffer_setDepthBound(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setDepthBound : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setDepthBound : Error processing arguments");
        cobj->setDepthBound(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setDepthBound)

static bool js_gfx_GFXCommandBuffer_copyBufferToTexture(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_copyBufferToTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        cocos2d::GFXBuffer* arg0 = nullptr;
        cocos2d::GFXTexture* arg1 = nullptr;
        cocos2d::GFXTextureLayout arg2;
        cocos2d::GFXBufferTextureCopy* arg3 = nullptr;
        unsigned int arg4 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXTextureLayout)tmp; } while(false);
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBufferTextureCopy*
        ok = false;
        ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_copyBufferToTexture : Error processing arguments");
        cobj->copyBufferToTexture(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_copyBufferToTexture)

static bool js_gfx_GFXCommandBuffer_setLineWidth(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setLineWidth)

static bool js_gfx_GFXCommandBuffer_updateBuffer(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_updateBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::GFXBuffer* arg0 = nullptr;
        void* arg1 = nullptr;
        unsigned int arg2 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_updateBuffer : Error processing arguments");
        cobj->updateBuffer(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::GFXBuffer* arg0 = nullptr;
        void* arg1 = nullptr;
        unsigned int arg2 = 0;
        unsigned int arg3 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        ok &= seval_to_uint32(args[3], (uint32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_updateBuffer : Error processing arguments");
        cobj->updateBuffer(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_updateBuffer)

static bool js_gfx_GFXCommandBuffer_end(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_end : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->end();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_end)

static bool js_gfx_GFXCommandBuffer_setStencilWriteMask(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setStencilWriteMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXStencilFace arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilFace)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setStencilWriteMask : Error processing arguments");
        cobj->setStencilWriteMask(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setStencilWriteMask)

static bool js_gfx_GFXCommandBuffer_setStencilCompareMask(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setStencilCompareMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::GFXStencilFace arg0;
        int arg1 = 0;
        unsigned int arg2 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilFace)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setStencilCompareMask : Error processing arguments");
        cobj->setStencilCompareMask(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setStencilCompareMask)

static bool js_gfx_GFXCommandBuffer_bindInputAssembler(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_bindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_bindInputAssembler : Error processing arguments");
        cobj->bindInputAssembler(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_bindInputAssembler)

static bool js_gfx_GFXCommandBuffer_allocator(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_allocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXCommandAllocator* result = cobj->allocator();
        ok &= native_ptr_to_seval<cocos2d::GFXCommandAllocator>((cocos2d::GFXCommandAllocator*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_allocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_allocator)

static bool js_gfx_GFXCommandBuffer_bindPipelineState(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_bindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineState* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_bindPipelineState : Error processing arguments");
        cobj->bindPipelineState(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_bindPipelineState)

static bool js_gfx_GFXCommandBuffer_destroy(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_destroy)

static bool js_gfx_GFXCommandBuffer_type(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_type : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->type();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_type : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_type)

static bool js_gfx_GFXCommandBuffer_setViewport(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXViewport arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXViewport
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setViewport : Error processing arguments");
        cobj->setViewport(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setViewport)

static bool js_gfx_GFXCommandBuffer_setDepthBias(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setDepthBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setDepthBias : Error processing arguments");
        cobj->setDepthBias(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setDepthBias)

static bool js_gfx_GFXCommandBuffer_begin(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_begin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->begin();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_begin)

static bool js_gfx_GFXCommandBuffer_numDrawCalls(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_numDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->numDrawCalls();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_numDrawCalls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_numDrawCalls)

static bool js_gfx_GFXCommandBuffer_bindBindingLayout(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_bindBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayout* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_bindBindingLayout : Error processing arguments");
        cobj->bindBindingLayout(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_bindBindingLayout)

static bool js_gfx_GFXCommandBuffer_endRenderPass(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_endRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->endRenderPass();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_endRenderPass)

static bool js_gfx_GFXCommandBuffer_initialize(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_initialize)

static bool js_gfx_GFXCommandBuffer_setScissor(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_setScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRect arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRect
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_setScissor : Error processing arguments");
        cobj->setScissor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_setScissor)

static bool js_gfx_GFXCommandBuffer_execute(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_execute : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXCommandBuffer** arg0 = nullptr;
        unsigned int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_execute : Error processing arguments");
        cobj->execute(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_execute)

static bool js_gfx_GFXCommandBuffer_numTris(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_numTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->numTris();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_numTris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_numTris)

static bool js_gfx_GFXCommandBuffer_beginRenderPass(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_beginRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 7) {
        cocos2d::GFXFramebuffer* arg0 = nullptr;
        cocos2d::GFXRect arg1;
        cocos2d::GFXClearFlagBit arg2;
        cocos2d::GFXColor* arg3 = nullptr;
        unsigned int arg4 = 0;
        float arg5 = 0;
        int arg6 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRect
        ok = false;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::GFXClearFlagBit)tmp; } while(false);
        #pragma warning NO CONVERSION TO NATIVE FOR GFXColor*
        ok = false;
        ok &= seval_to_uint32(args[4], (uint32_t*)&arg4);
        ok &= seval_to_float(args[5], &arg5);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[6], &tmp); arg6 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_beginRenderPass : Error processing arguments");
        cobj->beginRenderPass(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_beginRenderPass)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXCommandBuffer_finalize)

static bool js_gfx_GFXCommandBuffer_constructor(se::State& s)
{
    //#3 cocos2d::GFXCommandBuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXCommandBuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXCommandBuffer_constructor, __jsb_cocos2d_GFXCommandBuffer_class, js_cocos2d_GFXCommandBuffer_finalize)




static bool js_cocos2d_GFXCommandBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXCommandBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXCommandBuffer_finalize)

bool js_register_gfx_GFXCommandBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GFXCommandBuffer", obj, nullptr, _SE(js_gfx_GFXCommandBuffer_constructor));

    cls->defineFunction("draw", _SE(js_gfx_GFXCommandBuffer_draw));
    cls->defineFunction("setBlendConstants", _SE(js_gfx_GFXCommandBuffer_setBlendConstants));
    cls->defineFunction("setDepthBound", _SE(js_gfx_GFXCommandBuffer_setDepthBound));
    cls->defineFunction("copyBufferToTexture", _SE(js_gfx_GFXCommandBuffer_copyBufferToTexture));
    cls->defineFunction("setLineWidth", _SE(js_gfx_GFXCommandBuffer_setLineWidth));
    cls->defineFunction("updateBuffer", _SE(js_gfx_GFXCommandBuffer_updateBuffer));
    cls->defineFunction("end", _SE(js_gfx_GFXCommandBuffer_end));
    cls->defineFunction("setStencilWriteMask", _SE(js_gfx_GFXCommandBuffer_setStencilWriteMask));
    cls->defineFunction("setStencilCompareMask", _SE(js_gfx_GFXCommandBuffer_setStencilCompareMask));
    cls->defineFunction("bindInputAssembler", _SE(js_gfx_GFXCommandBuffer_bindInputAssembler));
    cls->defineFunction("allocator", _SE(js_gfx_GFXCommandBuffer_allocator));
    cls->defineFunction("bindPipelineState", _SE(js_gfx_GFXCommandBuffer_bindPipelineState));
    cls->defineFunction("destroy", _SE(js_gfx_GFXCommandBuffer_destroy));
    cls->defineFunction("type", _SE(js_gfx_GFXCommandBuffer_type));
    cls->defineFunction("setViewport", _SE(js_gfx_GFXCommandBuffer_setViewport));
    cls->defineFunction("setDepthBias", _SE(js_gfx_GFXCommandBuffer_setDepthBias));
    cls->defineFunction("begin", _SE(js_gfx_GFXCommandBuffer_begin));
    cls->defineFunction("numDrawCalls", _SE(js_gfx_GFXCommandBuffer_numDrawCalls));
    cls->defineFunction("bindBindingLayout", _SE(js_gfx_GFXCommandBuffer_bindBindingLayout));
    cls->defineFunction("endRenderPass", _SE(js_gfx_GFXCommandBuffer_endRenderPass));
    cls->defineFunction("initialize", _SE(js_gfx_GFXCommandBuffer_initialize));
    cls->defineFunction("setScissor", _SE(js_gfx_GFXCommandBuffer_setScissor));
    cls->defineFunction("execute", _SE(js_gfx_GFXCommandBuffer_execute));
    cls->defineFunction("numTris", _SE(js_gfx_GFXCommandBuffer_numTris));
    cls->defineFunction("beginRenderPass", _SE(js_gfx_GFXCommandBuffer_beginRenderPass));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXCommandBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXCommandBuffer>(cls);

    __jsb_cocos2d_GFXCommandBuffer_proto = cls->getProto();
    __jsb_cocos2d_GFXCommandBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GFXQueue_proto = nullptr;
se::Class* __jsb_cocos2d_GFXQueue_class = nullptr;

static bool js_gfx_GFXQueue_submit(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_submit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXCommandBuffer** arg0 = nullptr;
        unsigned int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_submit : Error processing arguments");
        cobj->submit(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_submit)

static bool js_gfx_GFXQueue_initialize(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXQueueInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXQueueInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_initialize)

static bool js_gfx_GFXQueue_destroy(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_destroy)

static bool js_gfx_GFXQueue_type(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_type : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->type();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_type : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_type)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXQueue_finalize)

static bool js_gfx_GFXQueue_constructor(se::State& s)
{
    //#3 cocos2d::GFXQueue: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cocos2d::GFXQueue constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GFXQueue_constructor, __jsb_cocos2d_GFXQueue_class, js_cocos2d_GFXQueue_finalize)




static bool js_cocos2d_GFXQueue_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXQueue)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXQueue_finalize)

bool js_register_gfx_GFXQueue(se::Object* obj)
{
    auto cls = se::Class::create("GFXQueue", obj, nullptr, _SE(js_gfx_GFXQueue_constructor));

    cls->defineFunction("submit", _SE(js_gfx_GFXQueue_submit));
    cls->defineFunction("initialize", _SE(js_gfx_GFXQueue_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_GFXQueue_destroy));
    cls->defineFunction("type", _SE(js_gfx_GFXQueue_type));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXQueue_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXQueue>(cls);

    __jsb_cocos2d_GFXQueue_proto = cls->getProto();
    __jsb_cocos2d_GFXQueue_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2Device_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Device_class = nullptr;

static bool js_gfx_GLES2Device_use_discard_framebuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_use_discard_framebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->use_discard_framebuffer();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_use_discard_framebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_use_discard_framebuffer)

static bool js_gfx_GLES2Device_use_instanced_arrays(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_use_instanced_arrays : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->use_instanced_arrays();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_use_instanced_arrays : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_use_instanced_arrays)

static bool js_gfx_GLES2Device_createCommandAllocator(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createCommandAllocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandAllocatorInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandAllocatorInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createCommandAllocator : Error processing arguments");
        cocos2d::GFXCommandAllocator* result = cobj->createCommandAllocator(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXCommandAllocator>((cocos2d::GFXCommandAllocator*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createCommandAllocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createCommandAllocator)

static bool js_gfx_GLES2Device_use_vao(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_use_vao : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->use_vao();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_use_vao : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_use_vao)

static bool js_gfx_GLES2Device_use_draw_instanced(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_use_draw_instanced : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->use_draw_instanced();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_use_draw_instanced : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_use_draw_instanced)

static bool js_gfx_GLES2Device_createCommandBuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createCommandBuffer : Error processing arguments");
        cocos2d::GFXCommandBuffer* result = cobj->createCommandBuffer(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXCommandBuffer>((cocos2d::GFXCommandBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createCommandBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createCommandBuffer)

static bool js_gfx_GLES2Device_present(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_present)

static bool js_gfx_GLES2Device_createTexture(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createTexture : Error processing arguments");
        cocos2d::GFXTexture* result = cobj->createTexture(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXTexture>((cocos2d::GFXTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createTexture)

static bool js_gfx_GLES2Device_destroy(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_destroy)

static bool js_gfx_GLES2Device_createFramebuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXFramebufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXFramebufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createFramebuffer : Error processing arguments");
        cocos2d::GFXFramebuffer* result = cobj->createFramebuffer(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXFramebuffer>((cocos2d::GFXFramebuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createFramebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createFramebuffer)

static bool js_gfx_GLES2Device_createRenderPass(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRenderPassInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRenderPassInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createRenderPass : Error processing arguments");
        cocos2d::GFXRenderPass* result = cobj->createRenderPass(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXRenderPass>((cocos2d::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createRenderPass)

static bool js_gfx_GLES2Device_createWindow(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXWindowInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXWindowInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createWindow : Error processing arguments");
        cocos2d::GFXWindow* result = cobj->createWindow(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXWindow>((cocos2d::GFXWindow*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createWindow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createWindow)

static bool js_gfx_GLES2Device_createShader(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXShaderInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXShaderInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createShader : Error processing arguments");
        cocos2d::GFXShader* result = cobj->createShader(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXShader>((cocos2d::GFXShader*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createShader)

static bool js_gfx_GLES2Device_createInputAssembler(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssemblerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXInputAssemblerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createInputAssembler : Error processing arguments");
        cocos2d::GFXInputAssembler* result = cobj->createInputAssembler(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXInputAssembler>((cocos2d::GFXInputAssembler*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createInputAssembler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createInputAssembler)

static bool js_gfx_GLES2Device_createSampler(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXSamplerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXSamplerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createSampler : Error processing arguments");
        cocos2d::GFXSampler* result = cobj->createSampler(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXSampler>((cocos2d::GFXSampler*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createSampler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createSampler)

static bool js_gfx_GLES2Device_createBuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createBuffer : Error processing arguments");
        cocos2d::GFXBuffer* result = cobj->createBuffer(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXBuffer>((cocos2d::GFXBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createBuffer)

static bool js_gfx_GLES2Device_initialize(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXDeviceInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXDeviceInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_initialize)

static bool js_gfx_GLES2Device_resize(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_resize : Error processing arguments");
        cobj->resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_resize)

static bool js_gfx_GLES2Device_createQueue(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXQueueInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXQueueInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createQueue : Error processing arguments");
        cocos2d::GFXQueue* result = cobj->createQueue(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXQueue>((cocos2d::GFXQueue*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createQueue)

static bool js_gfx_GLES2Device_checkExtension(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_checkExtension : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_checkExtension : Error processing arguments");
        bool result = cobj->checkExtension(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_checkExtension : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_checkExtension)

static bool js_gfx_GLES2Device_createBindingLayout(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayoutInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBindingLayoutInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createBindingLayout : Error processing arguments");
        cocos2d::GFXBindingLayout* result = cobj->createBindingLayout(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXBindingLayout>((cocos2d::GFXBindingLayout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createBindingLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createBindingLayout)

static bool js_gfx_GLES2Device_createTextureView(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_createTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureViewInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureViewInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createTextureView : Error processing arguments");
        cocos2d::GFXTextureView* result = cobj->createTextureView(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXTextureView>((cocos2d::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_createTextureView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_createTextureView)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Device_finalize)

static bool js_gfx_GLES2Device_constructor(se::State& s)
{
    cocos2d::GLES2Device* cobj = JSB_ALLOC(cocos2d::GLES2Device);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Device_constructor, __jsb_cocos2d_GLES2Device_class, js_cocos2d_GLES2Device_finalize)



extern se::Object* __jsb_cocos2d_GFXDevice_proto;

static bool js_cocos2d_GLES2Device_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Device)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Device_finalize)

bool js_register_gfx_GLES2Device(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Device", obj, __jsb_cocos2d_GFXDevice_proto, _SE(js_gfx_GLES2Device_constructor));

    cls->defineFunction("use_discard_framebuffer", _SE(js_gfx_GLES2Device_use_discard_framebuffer));
    cls->defineFunction("use_instanced_arrays", _SE(js_gfx_GLES2Device_use_instanced_arrays));
    cls->defineFunction("createCommandAllocator", _SE(js_gfx_GLES2Device_createCommandAllocator));
    cls->defineFunction("use_vao", _SE(js_gfx_GLES2Device_use_vao));
    cls->defineFunction("use_draw_instanced", _SE(js_gfx_GLES2Device_use_draw_instanced));
    cls->defineFunction("createCommandBuffer", _SE(js_gfx_GLES2Device_createCommandBuffer));
    cls->defineFunction("present", _SE(js_gfx_GLES2Device_present));
    cls->defineFunction("createTexture", _SE(js_gfx_GLES2Device_createTexture));
    cls->defineFunction("destroy", _SE(js_gfx_GLES2Device_destroy));
    cls->defineFunction("createFramebuffer", _SE(js_gfx_GLES2Device_createFramebuffer));
    cls->defineFunction("createRenderPass", _SE(js_gfx_GLES2Device_createRenderPass));
    cls->defineFunction("createWindow", _SE(js_gfx_GLES2Device_createWindow));
    cls->defineFunction("createShader", _SE(js_gfx_GLES2Device_createShader));
    cls->defineFunction("createInputAssembler", _SE(js_gfx_GLES2Device_createInputAssembler));
    cls->defineFunction("createSampler", _SE(js_gfx_GLES2Device_createSampler));
    cls->defineFunction("createBuffer", _SE(js_gfx_GLES2Device_createBuffer));
    cls->defineFunction("initialize", _SE(js_gfx_GLES2Device_initialize));
    cls->defineFunction("resize", _SE(js_gfx_GLES2Device_resize));
    cls->defineFunction("createQueue", _SE(js_gfx_GLES2Device_createQueue));
    cls->defineFunction("checkExtension", _SE(js_gfx_GLES2Device_checkExtension));
    cls->defineFunction("createBindingLayout", _SE(js_gfx_GLES2Device_createBindingLayout));
    cls->defineFunction("createTextureView", _SE(js_gfx_GLES2Device_createTextureView));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Device_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Device>(cls);

    __jsb_cocos2d_GLES2Device_proto = cls->getProto();
    __jsb_cocos2d_GLES2Device_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_gfx(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("gfx", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("gfx", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_gfx_GFXWindow(ns);
    js_register_gfx_GFXSampler(ns);
    js_register_gfx_GFXBuffer(ns);
    js_register_gfx_GFXPipelineLayout(ns);
    js_register_gfx_GFXRenderPass(ns);
    js_register_gfx_GFXInputAssembler(ns);
    js_register_gfx_GLES2Device(ns);
    js_register_gfx_GFXShader(ns);
    js_register_gfx_GFXContext(ns);
    js_register_gfx_GFXCommandBuffer(ns);
    js_register_gfx_GFXBindingLayout(ns);
    js_register_gfx_GFXTextureView(ns);
    js_register_gfx_GFXFramebuffer(ns);
    js_register_gfx_GFXTexture(ns);
    js_register_gfx_GFXPipelineState(ns);
    js_register_gfx_GFXQueue(ns);
    return true;
}

#endif //#if (USE_GFX_RENDERER > 0) && (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
