#include "scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/gfx-gles2/GFXGLES2.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cocos2d_GFXWindow_proto = nullptr;
se::Class* __jsb_cocos2d_GFXWindow_class = nullptr;

static bool js_gfx_GFXWindow_depth_stencil_tex_view(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_depth_stencil_tex_view : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTextureView* result = cobj->depth_stencil_tex_view();
        ok &= native_ptr_to_seval<cocos2d::GFXTextureView>((cocos2d::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_depth_stencil_tex_view : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_depth_stencil_tex_view)

static bool js_gfx_GFXWindow_render_pass(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_render_pass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXRenderPass* result = cobj->render_pass();
        ok &= native_ptr_to_seval<cocos2d::GFXRenderPass>((cocos2d::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_render_pass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_render_pass)

static bool js_gfx_GFXWindow_native_width(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_native_width : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->native_width();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_native_width : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_native_width)

static bool js_gfx_GFXWindow_native_height(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_native_height : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->native_height();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_native_height : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_native_height)

static bool js_gfx_GFXWindow_title(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_title : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::String& result = cobj->title();
        s.rval().setString(result.buffer());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_title : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_title)

static bool js_gfx_GFXWindow_color_fmt(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_color_fmt : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->color_fmt();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_color_fmt : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_color_fmt)

static bool js_gfx_GFXWindow_top(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_top : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->top();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_top : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_top)

static bool js_gfx_GFXWindow_depth_stencil_texture(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_depth_stencil_texture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTexture* result = cobj->depth_stencil_texture();
        ok &= native_ptr_to_seval<cocos2d::GFXTexture>((cocos2d::GFXTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_depth_stencil_texture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_depth_stencil_texture)

static bool js_gfx_GFXWindow_color_texture(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_color_texture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTexture* result = cobj->color_texture();
        ok &= native_ptr_to_seval<cocos2d::GFXTexture>((cocos2d::GFXTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_color_texture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_color_texture)

static bool js_gfx_GFXWindow_is_offscreen(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_is_offscreen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->is_offscreen();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_is_offscreen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_is_offscreen)

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

static bool js_gfx_GFXWindow_device(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_device)

static bool js_gfx_GFXWindow_Initialize(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXWindowInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXWindowInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_Initialize)

static bool js_gfx_GFXWindow_Destroy(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_Destroy)

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

static bool js_gfx_GFXWindow_depth_stencil_fmt(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_depth_stencil_fmt : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->depth_stencil_fmt();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_depth_stencil_fmt : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_depth_stencil_fmt)

static bool js_gfx_GFXWindow_color_tex_view(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_color_tex_view : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTextureView* result = cobj->color_tex_view();
        ok &= native_ptr_to_seval<cocos2d::GFXTextureView>((cocos2d::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_color_tex_view : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_color_tex_view)

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

static bool js_gfx_GFXWindow_Resize(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_Resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_Resize : Error processing arguments");
        cobj->Resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_Resize)

static bool js_gfx_GFXWindow_left(se::State& s)
{
    cocos2d::GFXWindow* cobj = (cocos2d::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_left : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->left();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_left : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_left)

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

    cls->defineFunction("depth_stencil_tex_view", _SE(js_gfx_GFXWindow_depth_stencil_tex_view));
    cls->defineFunction("render_pass", _SE(js_gfx_GFXWindow_render_pass));
    cls->defineFunction("native_width", _SE(js_gfx_GFXWindow_native_width));
    cls->defineFunction("native_height", _SE(js_gfx_GFXWindow_native_height));
    cls->defineFunction("title", _SE(js_gfx_GFXWindow_title));
    cls->defineFunction("color_fmt", _SE(js_gfx_GFXWindow_color_fmt));
    cls->defineFunction("top", _SE(js_gfx_GFXWindow_top));
    cls->defineFunction("depth_stencil_texture", _SE(js_gfx_GFXWindow_depth_stencil_texture));
    cls->defineFunction("color_texture", _SE(js_gfx_GFXWindow_color_texture));
    cls->defineFunction("is_offscreen", _SE(js_gfx_GFXWindow_is_offscreen));
    cls->defineFunction("height", _SE(js_gfx_GFXWindow_height));
    cls->defineFunction("device", _SE(js_gfx_GFXWindow_device));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXWindow_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXWindow_Destroy));
    cls->defineFunction("framebuffer", _SE(js_gfx_GFXWindow_framebuffer));
    cls->defineFunction("depth_stencil_fmt", _SE(js_gfx_GFXWindow_depth_stencil_fmt));
    cls->defineFunction("color_tex_view", _SE(js_gfx_GFXWindow_color_tex_view));
    cls->defineFunction("width", _SE(js_gfx_GFXWindow_width));
    cls->defineFunction("Resize", _SE(js_gfx_GFXWindow_Resize));
    cls->defineFunction("left", _SE(js_gfx_GFXWindow_left));
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

static bool js_gfx_GFXBuffer_buffer(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_buffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->buffer();
        #pragma warning NO CONVERSION FROM NATIVE FOR unsigned char*;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_buffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_buffer)

static bool js_gfx_GFXBuffer_Update(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_Update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        void* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_Update : Error processing arguments");
        cobj->Update(arg0);
        return true;
    }
    if (argc == 2) {
        void* arg0 = nullptr;
        unsigned int arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_Update : Error processing arguments");
        cobj->Update(arg0, arg1);
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
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_Update : Error processing arguments");
        cobj->Update(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_Update)

static bool js_gfx_GFXBuffer_device(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_device)

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

static bool js_gfx_GFXBuffer_Initialize(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_Initialize)

static bool js_gfx_GFXBuffer_Destroy(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_Destroy)

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

static bool js_gfx_GFXBuffer_Resize(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_Resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_Resize : Error processing arguments");
        cobj->Resize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_Resize)

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
    cls->defineFunction("buffer", _SE(js_gfx_GFXBuffer_buffer));
    cls->defineFunction("Update", _SE(js_gfx_GFXBuffer_Update));
    cls->defineFunction("device", _SE(js_gfx_GFXBuffer_device));
    cls->defineFunction("flags", _SE(js_gfx_GFXBuffer_flags));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXBuffer_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXBuffer_Destroy));
    cls->defineFunction("stride", _SE(js_gfx_GFXBuffer_stride));
    cls->defineFunction("Resize", _SE(js_gfx_GFXBuffer_Resize));
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

static bool js_gfx_GFXTexture_array_layer(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_array_layer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->array_layer();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_array_layer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_array_layer)

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

static bool js_gfx_GFXTexture_mip_level(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_mip_level : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->mip_level();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_mip_level : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_mip_level)

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

static bool js_gfx_GFXTexture_Initialize(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_Initialize)

static bool js_gfx_GFXTexture_Destroy(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_Destroy)

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

static bool js_gfx_GFXTexture_Resize(se::State& s)
{
    cocos2d::GFXTexture* cobj = (cocos2d::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_Resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_Resize : Error processing arguments");
        cobj->Resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTexture_Resize)

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

    cls->defineFunction("array_layer", _SE(js_gfx_GFXTexture_array_layer));
    cls->defineFunction("format", _SE(js_gfx_GFXTexture_format));
    cls->defineFunction("buffer", _SE(js_gfx_GFXTexture_buffer));
    cls->defineFunction("height", _SE(js_gfx_GFXTexture_height));
    cls->defineFunction("usage", _SE(js_gfx_GFXTexture_usage));
    cls->defineFunction("depth", _SE(js_gfx_GFXTexture_depth));
    cls->defineFunction("flags", _SE(js_gfx_GFXTexture_flags));
    cls->defineFunction("mip_level", _SE(js_gfx_GFXTexture_mip_level));
    cls->defineFunction("samples", _SE(js_gfx_GFXTexture_samples));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXTexture_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXTexture_Destroy));
    cls->defineFunction("type", _SE(js_gfx_GFXTexture_type));
    cls->defineFunction("width", _SE(js_gfx_GFXTexture_width));
    cls->defineFunction("Resize", _SE(js_gfx_GFXTexture_Resize));
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

static bool js_gfx_GFXTextureView_level_count(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_level_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->level_count();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_level_count : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_level_count)

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

static bool js_gfx_GFXTextureView_device(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_device)

static bool js_gfx_GFXTextureView_layer_count(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_layer_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->layer_count();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_layer_count : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_layer_count)

static bool js_gfx_GFXTextureView_base_level(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_base_level : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->base_level();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_base_level : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_base_level)

static bool js_gfx_GFXTextureView_Initialize(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureViewInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureViewInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_Initialize)

static bool js_gfx_GFXTextureView_Destroy(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_Destroy)

static bool js_gfx_GFXTextureView_base_layer(se::State& s)
{
    cocos2d::GFXTextureView* cobj = (cocos2d::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_base_layer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->base_layer();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_base_layer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_base_layer)

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

    cls->defineFunction("level_count", _SE(js_gfx_GFXTextureView_level_count));
    cls->defineFunction("format", _SE(js_gfx_GFXTextureView_format));
    cls->defineFunction("texture", _SE(js_gfx_GFXTextureView_texture));
    cls->defineFunction("device", _SE(js_gfx_GFXTextureView_device));
    cls->defineFunction("layer_count", _SE(js_gfx_GFXTextureView_layer_count));
    cls->defineFunction("base_level", _SE(js_gfx_GFXTextureView_base_level));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXTextureView_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXTextureView_Destroy));
    cls->defineFunction("base_layer", _SE(js_gfx_GFXTextureView_base_layer));
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

static bool js_gfx_GFXSampler_cmp_func(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_cmp_func : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->cmp_func();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_cmp_func : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_cmp_func)

static bool js_gfx_GFXSampler_min_filter(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_min_filter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->min_filter();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_min_filter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_min_filter)

static bool js_gfx_GFXSampler_name(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_name : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::String& result = cobj->name();
        s.rval().setString(result.buffer());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_name : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_name)

static bool js_gfx_GFXSampler_address_u(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_address_u : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->address_u();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_address_u : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_address_u)

static bool js_gfx_GFXSampler_border_color(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_border_color : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXColor& result = cobj->border_color();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXColor;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_border_color : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_border_color)

static bool js_gfx_GFXSampler_max_anisotropy(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_max_anisotropy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->max_anisotropy();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_max_anisotropy : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_max_anisotropy)

static bool js_gfx_GFXSampler_device(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_device)

static bool js_gfx_GFXSampler_address_v(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_address_v : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->address_v();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_address_v : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_address_v)

static bool js_gfx_GFXSampler_address_w(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_address_w : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->address_w();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_address_w : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_address_w)

static bool js_gfx_GFXSampler_min_lod(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_min_lod : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->min_lod();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_min_lod : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_min_lod)

static bool js_gfx_GFXSampler_Initialize(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXSamplerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXSamplerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_Initialize)

static bool js_gfx_GFXSampler_Destroy(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_Destroy)

static bool js_gfx_GFXSampler_mag_filter(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_mag_filter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->mag_filter();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_mag_filter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_mag_filter)

static bool js_gfx_GFXSampler_mip_lod_bias(se::State& s)
{
    cocos2d::GFXSampler* cobj = (cocos2d::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_mip_lod_bias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->mip_lod_bias();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_mip_lod_bias : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_mip_lod_bias)

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

    cls->defineFunction("cmp_func", _SE(js_gfx_GFXSampler_cmp_func));
    cls->defineFunction("min_filter", _SE(js_gfx_GFXSampler_min_filter));
    cls->defineFunction("name", _SE(js_gfx_GFXSampler_name));
    cls->defineFunction("address_u", _SE(js_gfx_GFXSampler_address_u));
    cls->defineFunction("border_color", _SE(js_gfx_GFXSampler_border_color));
    cls->defineFunction("max_anisotropy", _SE(js_gfx_GFXSampler_max_anisotropy));
    cls->defineFunction("device", _SE(js_gfx_GFXSampler_device));
    cls->defineFunction("address_v", _SE(js_gfx_GFXSampler_address_v));
    cls->defineFunction("address_w", _SE(js_gfx_GFXSampler_address_w));
    cls->defineFunction("min_lod", _SE(js_gfx_GFXSampler_min_lod));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXSampler_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXSampler_Destroy));
    cls->defineFunction("mag_filter", _SE(js_gfx_GFXSampler_mag_filter));
    cls->defineFunction("mip_lod_bias", _SE(js_gfx_GFXSampler_mip_lod_bias));
    cls->defineFunction("max_lod", _SE(js_gfx_GFXSampler_max_lod));
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

static bool js_gfx_GFXShader_samplers(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_samplers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXUniformSampler>& result = cobj->samplers();
        ok &= native_ptr_to_seval<cocos2d::GFXUniformSamplerList&>((cocos2d::GFXUniformSamplerList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_samplers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_samplers)

static bool js_gfx_GFXShader_blocks(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_blocks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXUniformBlock>& result = cobj->blocks();
        ok &= native_ptr_to_seval<cocos2d::GFXUniformBlockList&>((cocos2d::GFXUniformBlockList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_blocks : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_blocks)

static bool js_gfx_GFXShader_device(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_device)

static bool js_gfx_GFXShader_Initialize(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXShaderInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXShaderInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_Initialize)

static bool js_gfx_GFXShader_Destroy(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_Destroy)

static bool js_gfx_GFXShader_stages(se::State& s)
{
    cocos2d::GFXShader* cobj = (cocos2d::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_stages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXShaderStage>& result = cobj->stages();
        ok &= native_ptr_to_seval<cocos2d::GFXShaderStageList&>((cocos2d::GFXShaderStageList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_stages : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_stages)

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

    cls->defineFunction("hash", _SE(js_gfx_GFXShader_hash));
    cls->defineFunction("name", _SE(js_gfx_GFXShader_name));
    cls->defineFunction("samplers", _SE(js_gfx_GFXShader_samplers));
    cls->defineFunction("blocks", _SE(js_gfx_GFXShader_blocks));
    cls->defineFunction("device", _SE(js_gfx_GFXShader_device));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXShader_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXShader_Destroy));
    cls->defineFunction("stages", _SE(js_gfx_GFXShader_stages));
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

static bool js_gfx_GFXInputAssembler_set_first_vertex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_set_first_vertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_set_first_vertex : Error processing arguments");
        cobj->set_first_vertex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_set_first_vertex)

static bool js_gfx_GFXInputAssembler_set_vertex_offset(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_set_vertex_offset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_set_vertex_offset : Error processing arguments");
        cobj->set_vertex_offset(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_set_vertex_offset)

static bool js_gfx_GFXInputAssembler_vertex_count(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertex_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->vertex_count();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertex_count : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertex_count)

static bool js_gfx_GFXInputAssembler_first_instance(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_first_instance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->first_instance();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_first_instance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_first_instance)

static bool js_gfx_GFXInputAssembler_set_index_count(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_set_index_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_set_index_count : Error processing arguments");
        cobj->set_index_count(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_set_index_count)

static bool js_gfx_GFXInputAssembler_Destroy(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_Destroy)

static bool js_gfx_GFXInputAssembler_first_index(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_first_index : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->first_index();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_first_index : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_first_index)

static bool js_gfx_GFXInputAssembler_first_vertex(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_first_vertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->first_vertex();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_first_vertex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_first_vertex)

static bool js_gfx_GFXInputAssembler_vertex_buffers(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertex_buffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXBuffer *>& result = cobj->vertex_buffers();
        ok &= native_ptr_to_seval<cocos2d::GFXBufferList&>((cocos2d::GFXBufferList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertex_buffers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertex_buffers)

static bool js_gfx_GFXInputAssembler_set_vertex_count(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_set_vertex_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_set_vertex_count : Error processing arguments");
        cobj->set_vertex_count(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_set_vertex_count)

static bool js_gfx_GFXInputAssembler_Initialize(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssemblerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXInputAssemblerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_Initialize)

static bool js_gfx_GFXInputAssembler_set_first_instance(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_set_first_instance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_set_first_instance : Error processing arguments");
        cobj->set_first_instance(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_set_first_instance)

static bool js_gfx_GFXInputAssembler_set_instance_count(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_set_instance_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_set_instance_count : Error processing arguments");
        cobj->set_instance_count(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_set_instance_count)

static bool js_gfx_GFXInputAssembler_vertex_offset(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertex_offset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->vertex_offset();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertex_offset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertex_offset)

static bool js_gfx_GFXInputAssembler_instance_count(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_instance_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->instance_count();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_instance_count : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_instance_count)

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

static bool js_gfx_GFXInputAssembler_device(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_device)

static bool js_gfx_GFXInputAssembler_set_first_index(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_set_first_index : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_set_first_index : Error processing arguments");
        cobj->set_first_index(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_set_first_index)

static bool js_gfx_GFXInputAssembler_index_count(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_index_count : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->index_count();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_index_count : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_index_count)

static bool js_gfx_GFXInputAssembler_indirect_buffer(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_indirect_buffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXBuffer* result = cobj->indirect_buffer();
        ok &= native_ptr_to_seval<cocos2d::GFXBuffer>((cocos2d::GFXBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_indirect_buffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_indirect_buffer)

static bool js_gfx_GFXInputAssembler_index_buffer(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_index_buffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXBuffer* result = cobj->index_buffer();
        ok &= native_ptr_to_seval<cocos2d::GFXBuffer>((cocos2d::GFXBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_index_buffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_index_buffer)

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

    cls->defineFunction("set_first_vertex", _SE(js_gfx_GFXInputAssembler_set_first_vertex));
    cls->defineFunction("set_vertex_offset", _SE(js_gfx_GFXInputAssembler_set_vertex_offset));
    cls->defineFunction("vertex_count", _SE(js_gfx_GFXInputAssembler_vertex_count));
    cls->defineFunction("first_instance", _SE(js_gfx_GFXInputAssembler_first_instance));
    cls->defineFunction("set_index_count", _SE(js_gfx_GFXInputAssembler_set_index_count));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXInputAssembler_Destroy));
    cls->defineFunction("first_index", _SE(js_gfx_GFXInputAssembler_first_index));
    cls->defineFunction("first_vertex", _SE(js_gfx_GFXInputAssembler_first_vertex));
    cls->defineFunction("vertex_buffers", _SE(js_gfx_GFXInputAssembler_vertex_buffers));
    cls->defineFunction("set_vertex_count", _SE(js_gfx_GFXInputAssembler_set_vertex_count));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXInputAssembler_Initialize));
    cls->defineFunction("set_first_instance", _SE(js_gfx_GFXInputAssembler_set_first_instance));
    cls->defineFunction("set_instance_count", _SE(js_gfx_GFXInputAssembler_set_instance_count));
    cls->defineFunction("vertex_offset", _SE(js_gfx_GFXInputAssembler_vertex_offset));
    cls->defineFunction("instance_count", _SE(js_gfx_GFXInputAssembler_instance_count));
    cls->defineFunction("attributes", _SE(js_gfx_GFXInputAssembler_attributes));
    cls->defineFunction("device", _SE(js_gfx_GFXInputAssembler_device));
    cls->defineFunction("set_first_index", _SE(js_gfx_GFXInputAssembler_set_first_index));
    cls->defineFunction("index_count", _SE(js_gfx_GFXInputAssembler_index_count));
    cls->defineFunction("indirect_buffer", _SE(js_gfx_GFXInputAssembler_indirect_buffer));
    cls->defineFunction("index_buffer", _SE(js_gfx_GFXInputAssembler_index_buffer));
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

static bool js_gfx_GFXRenderPass_depth_stencil_attachment(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_depth_stencil_attachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXDepthStencilAttachment& result = cobj->depth_stencil_attachment();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXDepthStencilAttachment;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_depth_stencil_attachment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_depth_stencil_attachment)

static bool js_gfx_GFXRenderPass_device(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_device)

static bool js_gfx_GFXRenderPass_sub_passes(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_sub_passes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXSubPass>& result = cobj->sub_passes();
        ok &= native_ptr_to_seval<cocos2d::GFXSubPassList&>((cocos2d::GFXSubPassList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_sub_passes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_sub_passes)

static bool js_gfx_GFXRenderPass_color_attachments(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_color_attachments : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXColorAttachment>& result = cobj->color_attachments();
        ok &= native_ptr_to_seval<cocos2d::GFXColorAttachmentList&>((cocos2d::GFXColorAttachmentList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_color_attachments : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_color_attachments)

static bool js_gfx_GFXRenderPass_Initialize(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRenderPassInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRenderPassInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_Initialize)

static bool js_gfx_GFXRenderPass_Destroy(se::State& s)
{
    cocos2d::GFXRenderPass* cobj = (cocos2d::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_Destroy)

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

    cls->defineFunction("depth_stencil_attachment", _SE(js_gfx_GFXRenderPass_depth_stencil_attachment));
    cls->defineFunction("device", _SE(js_gfx_GFXRenderPass_device));
    cls->defineFunction("sub_passes", _SE(js_gfx_GFXRenderPass_sub_passes));
    cls->defineFunction("color_attachments", _SE(js_gfx_GFXRenderPass_color_attachments));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXRenderPass_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXRenderPass_Destroy));
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

static bool js_gfx_GFXFramebuffer_color_views(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_color_views : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXTextureView *>& result = cobj->color_views();
        ok &= native_ptr_to_seval<cocos2d::GFXTextureViewList&>((cocos2d::GFXTextureViewList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_color_views : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_color_views)

static bool js_gfx_GFXFramebuffer_is_offscreen(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_is_offscreen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->is_offscreen();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_is_offscreen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_is_offscreen)

static bool js_gfx_GFXFramebuffer_device(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_device)

static bool js_gfx_GFXFramebuffer_depth_stencil_view(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_depth_stencil_view : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXTextureView* result = cobj->depth_stencil_view();
        ok &= native_ptr_to_seval<cocos2d::GFXTextureView>((cocos2d::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_depth_stencil_view : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_depth_stencil_view)

static bool js_gfx_GFXFramebuffer_Initialize(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXFramebufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXFramebufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_Initialize)

static bool js_gfx_GFXFramebuffer_Destroy(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_Destroy)

static bool js_gfx_GFXFramebuffer_render_pass(se::State& s)
{
    cocos2d::GFXFramebuffer* cobj = (cocos2d::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_render_pass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXRenderPass* result = cobj->render_pass();
        ok &= native_ptr_to_seval<cocos2d::GFXRenderPass>((cocos2d::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_render_pass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_render_pass)

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

    cls->defineFunction("color_views", _SE(js_gfx_GFXFramebuffer_color_views));
    cls->defineFunction("is_offscreen", _SE(js_gfx_GFXFramebuffer_is_offscreen));
    cls->defineFunction("device", _SE(js_gfx_GFXFramebuffer_device));
    cls->defineFunction("depth_stencil_view", _SE(js_gfx_GFXFramebuffer_depth_stencil_view));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXFramebuffer_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXFramebuffer_Destroy));
    cls->defineFunction("render_pass", _SE(js_gfx_GFXFramebuffer_render_pass));
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

static bool js_gfx_GFXBindingLayout_BindTextureView(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_BindTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cocos2d::GFXTextureView* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_BindTextureView : Error processing arguments");
        cobj->BindTextureView(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_BindTextureView)

static bool js_gfx_GFXBindingLayout_BindBuffer(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_BindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cocos2d::GFXBuffer* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_BindBuffer : Error processing arguments");
        cobj->BindBuffer(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_BindBuffer)

static bool js_gfx_GFXBindingLayout_BindSampler(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_BindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cocos2d::GFXSampler* arg1 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_BindSampler : Error processing arguments");
        cobj->BindSampler(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_BindSampler)

static bool js_gfx_GFXBindingLayout_Update(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_Update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_Update)

static bool js_gfx_GFXBindingLayout_device(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_device)

static bool js_gfx_GFXBindingLayout_binding_units(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_binding_units : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXBindingUnit>& result = cobj->binding_units();
        ok &= native_ptr_to_seval<cocos2d::GFXBindingUnitList&>((cocos2d::GFXBindingUnitList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_binding_units : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_binding_units)

static bool js_gfx_GFXBindingLayout_Initialize(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayoutInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBindingLayoutInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_Initialize)

static bool js_gfx_GFXBindingLayout_Destroy(se::State& s)
{
    cocos2d::GFXBindingLayout* cobj = (cocos2d::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_Destroy)

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

    cls->defineFunction("BindTextureView", _SE(js_gfx_GFXBindingLayout_BindTextureView));
    cls->defineFunction("BindBuffer", _SE(js_gfx_GFXBindingLayout_BindBuffer));
    cls->defineFunction("BindSampler", _SE(js_gfx_GFXBindingLayout_BindSampler));
    cls->defineFunction("Update", _SE(js_gfx_GFXBindingLayout_Update));
    cls->defineFunction("device", _SE(js_gfx_GFXBindingLayout_device));
    cls->defineFunction("binding_units", _SE(js_gfx_GFXBindingLayout_binding_units));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXBindingLayout_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXBindingLayout_Destroy));
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

static bool js_gfx_GFXPipelineLayout_push_constant_ranges(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_push_constant_ranges : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXPushConstantRange>& result = cobj->push_constant_ranges();
        ok &= native_ptr_to_seval<cocos2d::GFXPushConstantRangeList&>((cocos2d::GFXPushConstantRangeList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_push_constant_ranges : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_push_constant_ranges)

static bool js_gfx_GFXPipelineLayout_device(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_device)

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

static bool js_gfx_GFXPipelineLayout_Initialize(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineLayoutInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXPipelineLayoutInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_Initialize)

static bool js_gfx_GFXPipelineLayout_Destroy(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_Destroy)

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

    cls->defineFunction("push_constant_ranges", _SE(js_gfx_GFXPipelineLayout_push_constant_ranges));
    cls->defineFunction("device", _SE(js_gfx_GFXPipelineLayout_device));
    cls->defineFunction("layouts", _SE(js_gfx_GFXPipelineLayout_layouts));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXPipelineLayout_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXPipelineLayout_Destroy));
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

static bool js_gfx_GFXPipelineState_layout(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_layout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXPipelineLayout* result = cobj->layout();
        ok &= native_ptr_to_seval<cocos2d::GFXPipelineLayout>((cocos2d::GFXPipelineLayout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_layout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_layout)

static bool js_gfx_GFXPipelineState_rs(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_rs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXRasterizerState& result = cobj->rs();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXRasterizerState;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_rs : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_rs)

static bool js_gfx_GFXPipelineState_dynamic_states(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_dynamic_states : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cocos2d::GFXDynamicState>& result = cobj->dynamic_states();
        ok &= native_ptr_to_seval<cocos2d::GFXDynamicStateList&>((cocos2d::GFXDynamicStateList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_dynamic_states : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_dynamic_states)

static bool js_gfx_GFXPipelineState_is(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_is : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXInputState& result = cobj->is();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXInputState;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_is : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_is)

static bool js_gfx_GFXPipelineState_bs(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_bs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXBlendState& result = cobj->bs();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXBlendState;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_bs : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_bs)

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

static bool js_gfx_GFXPipelineState_dss(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_dss : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXDepthStencilState& result = cobj->dss();
        #pragma warning NO CONVERSION FROM NATIVE FOR GFXDepthStencilState;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_dss : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_dss)

static bool js_gfx_GFXPipelineState_device(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_device)

static bool js_gfx_GFXPipelineState_Initialize(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineStateInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXPipelineStateInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_Initialize)

static bool js_gfx_GFXPipelineState_Destroy(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_Destroy)

static bool js_gfx_GFXPipelineState_render_pass(se::State& s)
{
    cocos2d::GFXPipelineState* cobj = (cocos2d::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_render_pass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::GFXRenderPass* result = cobj->render_pass();
        ok &= native_ptr_to_seval<cocos2d::GFXRenderPass>((cocos2d::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_render_pass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_render_pass)

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
    cls->defineFunction("layout", _SE(js_gfx_GFXPipelineState_layout));
    cls->defineFunction("rs", _SE(js_gfx_GFXPipelineState_rs));
    cls->defineFunction("dynamic_states", _SE(js_gfx_GFXPipelineState_dynamic_states));
    cls->defineFunction("is", _SE(js_gfx_GFXPipelineState_is));
    cls->defineFunction("bs", _SE(js_gfx_GFXPipelineState_bs));
    cls->defineFunction("shader", _SE(js_gfx_GFXPipelineState_shader));
    cls->defineFunction("dss", _SE(js_gfx_GFXPipelineState_dss));
    cls->defineFunction("device", _SE(js_gfx_GFXPipelineState_device));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXPipelineState_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXPipelineState_Destroy));
    cls->defineFunction("render_pass", _SE(js_gfx_GFXPipelineState_render_pass));
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

static bool js_gfx_GFXCommandBuffer_End(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_End : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->End();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_End)

static bool js_gfx_GFXCommandBuffer_BindInputAssembler(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_BindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_BindInputAssembler : Error processing arguments");
        cobj->BindInputAssembler(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_BindInputAssembler)

static bool js_gfx_GFXCommandBuffer_BindPipelineState(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_BindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineState* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_BindPipelineState : Error processing arguments");
        cobj->BindPipelineState(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_BindPipelineState)

static bool js_gfx_GFXCommandBuffer_Destroy(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_Destroy)

static bool js_gfx_GFXCommandBuffer_num_tris(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_num_tris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->num_tris();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_num_tris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_num_tris)

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

static bool js_gfx_GFXCommandBuffer_SetDepthBias(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetDepthBias : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_SetDepthBias : Error processing arguments");
        cobj->SetDepthBias(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_SetDepthBias)

static bool js_gfx_GFXCommandBuffer_Begin(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_Begin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Begin();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_Begin)

static bool js_gfx_GFXCommandBuffer_BindBindingLayout(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_BindBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayout* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_BindBindingLayout : Error processing arguments");
        cobj->BindBindingLayout(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_BindBindingLayout)

static bool js_gfx_GFXCommandBuffer_EndRenderPass(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_EndRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->EndRenderPass();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_EndRenderPass)

static bool js_gfx_GFXCommandBuffer_CopyBufferToTexture(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_CopyBufferToTexture : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_CopyBufferToTexture : Error processing arguments");
        cobj->CopyBufferToTexture(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_CopyBufferToTexture)

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

static bool js_gfx_GFXCommandBuffer_UpdateBuffer(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_UpdateBuffer : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_UpdateBuffer : Error processing arguments");
        cobj->UpdateBuffer(arg0, arg1, arg2);
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
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_UpdateBuffer : Error processing arguments");
        cobj->UpdateBuffer(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_UpdateBuffer)

static bool js_gfx_GFXCommandBuffer_Execute(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_Execute : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXCommandBuffer** arg0 = nullptr;
        unsigned int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_Execute : Error processing arguments");
        cobj->Execute(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_Execute)

static bool js_gfx_GFXCommandBuffer_SetStencilWriteMask(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetStencilWriteMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXStencilFace arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilFace)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_SetStencilWriteMask : Error processing arguments");
        cobj->SetStencilWriteMask(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_SetStencilWriteMask)

static bool js_gfx_GFXCommandBuffer_Draw(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_Draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_Draw : Error processing arguments");
        cobj->Draw(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_Draw)

static bool js_gfx_GFXCommandBuffer_BeginRenderPass(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_BeginRenderPass : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_BeginRenderPass : Error processing arguments");
        cobj->BeginRenderPass(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_BeginRenderPass)

static bool js_gfx_GFXCommandBuffer_SetStencilCompareMask(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetStencilCompareMask : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_SetStencilCompareMask : Error processing arguments");
        cobj->SetStencilCompareMask(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_SetStencilCompareMask)

static bool js_gfx_GFXCommandBuffer_Initialize(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_Initialize)

static bool js_gfx_GFXCommandBuffer_SetDepthBounds(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetDepthBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_SetDepthBounds : Error processing arguments");
        cobj->SetDepthBounds(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_SetDepthBounds)

static bool js_gfx_GFXCommandBuffer_device(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_device)

static bool js_gfx_GFXCommandBuffer_SetViewport(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXViewport arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXViewport
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_SetViewport : Error processing arguments");
        cobj->SetViewport(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_SetViewport)

static bool js_gfx_GFXCommandBuffer_num_draw_calls(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_num_draw_calls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->num_draw_calls();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_num_draw_calls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_num_draw_calls)

static bool js_gfx_GFXCommandBuffer_SetBlendConstants(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetBlendConstants : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXColor arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXColor
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_SetBlendConstants : Error processing arguments");
        cobj->SetBlendConstants(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_SetBlendConstants)

static bool js_gfx_GFXCommandBuffer_SetScissor(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRect arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRect
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_SetScissor : Error processing arguments");
        cobj->SetScissor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_SetScissor)

static bool js_gfx_GFXCommandBuffer_SetLineWidth(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_SetLineWidth : Error processing arguments");
        cobj->SetLineWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_SetLineWidth)

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

    cls->defineFunction("End", _SE(js_gfx_GFXCommandBuffer_End));
    cls->defineFunction("BindInputAssembler", _SE(js_gfx_GFXCommandBuffer_BindInputAssembler));
    cls->defineFunction("BindPipelineState", _SE(js_gfx_GFXCommandBuffer_BindPipelineState));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXCommandBuffer_Destroy));
    cls->defineFunction("num_tris", _SE(js_gfx_GFXCommandBuffer_num_tris));
    cls->defineFunction("allocator", _SE(js_gfx_GFXCommandBuffer_allocator));
    cls->defineFunction("SetDepthBias", _SE(js_gfx_GFXCommandBuffer_SetDepthBias));
    cls->defineFunction("Begin", _SE(js_gfx_GFXCommandBuffer_Begin));
    cls->defineFunction("BindBindingLayout", _SE(js_gfx_GFXCommandBuffer_BindBindingLayout));
    cls->defineFunction("EndRenderPass", _SE(js_gfx_GFXCommandBuffer_EndRenderPass));
    cls->defineFunction("CopyBufferToTexture", _SE(js_gfx_GFXCommandBuffer_CopyBufferToTexture));
    cls->defineFunction("type", _SE(js_gfx_GFXCommandBuffer_type));
    cls->defineFunction("UpdateBuffer", _SE(js_gfx_GFXCommandBuffer_UpdateBuffer));
    cls->defineFunction("Execute", _SE(js_gfx_GFXCommandBuffer_Execute));
    cls->defineFunction("SetStencilWriteMask", _SE(js_gfx_GFXCommandBuffer_SetStencilWriteMask));
    cls->defineFunction("Draw", _SE(js_gfx_GFXCommandBuffer_Draw));
    cls->defineFunction("BeginRenderPass", _SE(js_gfx_GFXCommandBuffer_BeginRenderPass));
    cls->defineFunction("SetStencilCompareMask", _SE(js_gfx_GFXCommandBuffer_SetStencilCompareMask));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXCommandBuffer_Initialize));
    cls->defineFunction("SetDepthBounds", _SE(js_gfx_GFXCommandBuffer_SetDepthBounds));
    cls->defineFunction("device", _SE(js_gfx_GFXCommandBuffer_device));
    cls->defineFunction("SetViewport", _SE(js_gfx_GFXCommandBuffer_SetViewport));
    cls->defineFunction("num_draw_calls", _SE(js_gfx_GFXCommandBuffer_num_draw_calls));
    cls->defineFunction("SetBlendConstants", _SE(js_gfx_GFXCommandBuffer_SetBlendConstants));
    cls->defineFunction("SetScissor", _SE(js_gfx_GFXCommandBuffer_SetScissor));
    cls->defineFunction("SetLineWidth", _SE(js_gfx_GFXCommandBuffer_SetLineWidth));
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

static bool js_gfx_GFXQueue_device(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cocos2d::GFXDevice>((cocos2d::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_device)

static bool js_gfx_GFXQueue_Initialize(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXQueueInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXQueueInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_Initialize)

static bool js_gfx_GFXQueue_Destroy(se::State& s)
{
    cocos2d::GFXQueue* cobj = (cocos2d::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_Destroy)

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
    cls->defineFunction("device", _SE(js_gfx_GFXQueue_device));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXQueue_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXQueue_Destroy));
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

static bool js_gfx_GLES2Device_CreateGFXTextureView(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureViewInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureViewInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXTextureView : Error processing arguments");
        cocos2d::GFXTextureView* result = cobj->CreateGFXTextureView(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXTextureView>((cocos2d::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXTextureView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXTextureView)

static bool js_gfx_GLES2Device_CreateGFXCommandAllocator(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXCommandAllocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandAllocatorInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandAllocatorInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXCommandAllocator : Error processing arguments");
        cocos2d::GFXCommandAllocator* result = cobj->CreateGFXCommandAllocator(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXCommandAllocator>((cocos2d::GFXCommandAllocator*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXCommandAllocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXCommandAllocator)

static bool js_gfx_GLES2Device_CreateGFXBuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXBuffer : Error processing arguments");
        cocos2d::GFXBuffer* result = cobj->CreateGFXBuffer(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXBuffer>((cocos2d::GFXBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXBuffer)

static bool js_gfx_GLES2Device_Destroy(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_Destroy)

static bool js_gfx_GLES2Device_CreateGFXWindow(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXWindowInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXWindowInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXWindow : Error processing arguments");
        cocos2d::GFXWindow* result = cobj->CreateGFXWindow(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXWindow>((cocos2d::GFXWindow*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXWindow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXWindow)

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

static bool js_gfx_GLES2Device_CreateGFXTexture(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXTexture : Error processing arguments");
        cocos2d::GFXTexture* result = cobj->CreateGFXTexture(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXTexture>((cocos2d::GFXTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXTexture)

static bool js_gfx_GLES2Device_CreateGFXShader(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXShaderInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXShaderInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXShader : Error processing arguments");
        cocos2d::GFXShader* result = cobj->CreateGFXShader(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXShader>((cocos2d::GFXShader*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXShader)

static bool js_gfx_GLES2Device_CreateGFXCommandBuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXCommandBuffer : Error processing arguments");
        cocos2d::GFXCommandBuffer* result = cobj->CreateGFXCommandBuffer(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXCommandBuffer>((cocos2d::GFXCommandBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXCommandBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXCommandBuffer)

static bool js_gfx_GLES2Device_CheckExtension(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CheckExtension : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CheckExtension : Error processing arguments");
        bool result = cobj->CheckExtension(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CheckExtension : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CheckExtension)

static bool js_gfx_GLES2Device_Initialize(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXDeviceInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXDeviceInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_Initialize)

static bool js_gfx_GLES2Device_Resize(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_Resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_Resize : Error processing arguments");
        cobj->Resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_Resize)

static bool js_gfx_GLES2Device_CreateGFXSampler(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXSamplerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXSamplerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXSampler : Error processing arguments");
        cocos2d::GFXSampler* result = cobj->CreateGFXSampler(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXSampler>((cocos2d::GFXSampler*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXSampler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXSampler)

static bool js_gfx_GLES2Device_CreateGFXQueue(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXQueueInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXQueueInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXQueue : Error processing arguments");
        cocos2d::GFXQueue* result = cobj->CreateGFXQueue(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXQueue>((cocos2d::GFXQueue*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXQueue)

static bool js_gfx_GLES2Device_CreateGFXRenderPass(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRenderPassInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRenderPassInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXRenderPass : Error processing arguments");
        cocos2d::GFXRenderPass* result = cobj->CreateGFXRenderPass(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXRenderPass>((cocos2d::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXRenderPass)

static bool js_gfx_GLES2Device_CreateGFXBindingLayout(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayoutInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBindingLayoutInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXBindingLayout : Error processing arguments");
        cocos2d::GFXBindingLayout* result = cobj->CreateGFXBindingLayout(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXBindingLayout>((cocos2d::GFXBindingLayout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXBindingLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXBindingLayout)

static bool js_gfx_GLES2Device_Present(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_Present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_Present)

static bool js_gfx_GLES2Device_CreateGFXInputAssembler(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssemblerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXInputAssemblerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXInputAssembler : Error processing arguments");
        cocos2d::GFXInputAssembler* result = cobj->CreateGFXInputAssembler(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXInputAssembler>((cocos2d::GFXInputAssembler*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXInputAssembler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXInputAssembler)

static bool js_gfx_GLES2Device_CreateGFXFramebuffer(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_CreateGFXFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXFramebufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXFramebufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXFramebuffer : Error processing arguments");
        cocos2d::GFXFramebuffer* result = cobj->CreateGFXFramebuffer(arg0);
        ok &= native_ptr_to_seval<cocos2d::GFXFramebuffer>((cocos2d::GFXFramebuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Device_CreateGFXFramebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Device_CreateGFXFramebuffer)

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
    cls->defineFunction("CreateGFXTextureView", _SE(js_gfx_GLES2Device_CreateGFXTextureView));
    cls->defineFunction("CreateGFXCommandAllocator", _SE(js_gfx_GLES2Device_CreateGFXCommandAllocator));
    cls->defineFunction("CreateGFXBuffer", _SE(js_gfx_GLES2Device_CreateGFXBuffer));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2Device_Destroy));
    cls->defineFunction("CreateGFXWindow", _SE(js_gfx_GLES2Device_CreateGFXWindow));
    cls->defineFunction("use_vao", _SE(js_gfx_GLES2Device_use_vao));
    cls->defineFunction("use_draw_instanced", _SE(js_gfx_GLES2Device_use_draw_instanced));
    cls->defineFunction("CreateGFXTexture", _SE(js_gfx_GLES2Device_CreateGFXTexture));
    cls->defineFunction("CreateGFXShader", _SE(js_gfx_GLES2Device_CreateGFXShader));
    cls->defineFunction("CreateGFXCommandBuffer", _SE(js_gfx_GLES2Device_CreateGFXCommandBuffer));
    cls->defineFunction("CheckExtension", _SE(js_gfx_GLES2Device_CheckExtension));
    cls->defineFunction("Initialize", _SE(js_gfx_GLES2Device_Initialize));
    cls->defineFunction("Resize", _SE(js_gfx_GLES2Device_Resize));
    cls->defineFunction("CreateGFXSampler", _SE(js_gfx_GLES2Device_CreateGFXSampler));
    cls->defineFunction("CreateGFXQueue", _SE(js_gfx_GLES2Device_CreateGFXQueue));
    cls->defineFunction("CreateGFXRenderPass", _SE(js_gfx_GLES2Device_CreateGFXRenderPass));
    cls->defineFunction("CreateGFXBindingLayout", _SE(js_gfx_GLES2Device_CreateGFXBindingLayout));
    cls->defineFunction("Present", _SE(js_gfx_GLES2Device_Present));
    cls->defineFunction("CreateGFXInputAssembler", _SE(js_gfx_GLES2Device_CreateGFXInputAssembler));
    cls->defineFunction("CreateGFXFramebuffer", _SE(js_gfx_GLES2Device_CreateGFXFramebuffer));
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
    js_register_gfx_GFXCommandBuffer(ns);
    js_register_gfx_GFXBindingLayout(ns);
    js_register_gfx_GFXTextureView(ns);
    js_register_gfx_GFXFramebuffer(ns);
    js_register_gfx_GFXTexture(ns);
    js_register_gfx_GFXPipelineState(ns);
    js_register_gfx_GFXQueue(ns);
    return true;
}

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
