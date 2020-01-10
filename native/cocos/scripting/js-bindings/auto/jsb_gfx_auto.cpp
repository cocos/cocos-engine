#include "scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/gfx-gles2/GFXGLES2.h"

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
    cocos2d::GLES2Device* cobj = new (std::nothrow) cocos2d::GLES2Device();
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
        delete cobj;
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

se::Object* __jsb_cocos2d_GLES2Context_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Context_class = nullptr;

static bool js_gfx_GLES2Context_egl_config(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_egl_config : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->egl_config();
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_egl_config : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_egl_config)

static bool js_gfx_GLES2Context_minor_ver(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_minor_ver : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->minor_ver();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_minor_ver : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_minor_ver)

static bool js_gfx_GLES2Context_CheckExtension(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_CheckExtension : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::String arg0;
        arg0 = args[0].toStringForce().c_str();
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_CheckExtension : Error processing arguments");
        bool result = cobj->CheckExtension(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_CheckExtension : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_CheckExtension)

static bool js_gfx_GLES2Context_egl_context(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_egl_context : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->egl_context();
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_egl_context : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_egl_context)

static bool js_gfx_GLES2Context_major_ver(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_major_ver : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->major_ver();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_major_ver : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_major_ver)

static bool js_gfx_GLES2Context_egl_display(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_egl_display : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->egl_display();
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_egl_display : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_egl_display)

static bool js_gfx_GLES2Context_native_display(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_native_display : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->native_display();
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_native_display : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_native_display)

static bool js_gfx_GLES2Context_MakeCurrent(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_MakeCurrent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->MakeCurrent();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_MakeCurrent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_MakeCurrent)

static bool js_gfx_GLES2Context_egl_shared_ctx(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_egl_shared_ctx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->egl_shared_ctx();
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_egl_shared_ctx : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_egl_shared_ctx)

static bool js_gfx_GLES2Context_Initialize(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXContextInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXContextInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_Initialize)

static bool js_gfx_GLES2Context_Destroy(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_Destroy)

static bool js_gfx_GLES2Context_egl_surface(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_egl_surface : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->egl_surface();
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_egl_surface : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_egl_surface)

static bool js_gfx_GLES2Context_Present(se::State& s)
{
    cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Context_Present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Context_Present)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Context_finalize)

static bool js_gfx_GLES2Context_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2Context_constructor : Error processing arguments");
    cocos2d::GLES2Context* cobj = new (std::nothrow) cocos2d::GLES2Context(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Context_constructor, __jsb_cocos2d_GLES2Context_class, js_cocos2d_GLES2Context_finalize)



extern se::Object* __jsb_cocos2d_GFXContext_proto;

static bool js_cocos2d_GLES2Context_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Context)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Context* cobj = (cocos2d::GLES2Context*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Context_finalize)

bool js_register_gfx_GLES2Context(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Context", obj, __jsb_cocos2d_GFXContext_proto, _SE(js_gfx_GLES2Context_constructor));

    cls->defineFunction("egl_config", _SE(js_gfx_GLES2Context_egl_config));
    cls->defineFunction("minor_ver", _SE(js_gfx_GLES2Context_minor_ver));
    cls->defineFunction("CheckExtension", _SE(js_gfx_GLES2Context_CheckExtension));
    cls->defineFunction("egl_context", _SE(js_gfx_GLES2Context_egl_context));
    cls->defineFunction("major_ver", _SE(js_gfx_GLES2Context_major_ver));
    cls->defineFunction("egl_display", _SE(js_gfx_GLES2Context_egl_display));
    cls->defineFunction("native_display", _SE(js_gfx_GLES2Context_native_display));
    cls->defineFunction("MakeCurrent", _SE(js_gfx_GLES2Context_MakeCurrent));
    cls->defineFunction("egl_shared_ctx", _SE(js_gfx_GLES2Context_egl_shared_ctx));
    cls->defineFunction("Initialize", _SE(js_gfx_GLES2Context_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2Context_Destroy));
    cls->defineFunction("egl_surface", _SE(js_gfx_GLES2Context_egl_surface));
    cls->defineFunction("Present", _SE(js_gfx_GLES2Context_Present));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Context_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Context>(cls);

    __jsb_cocos2d_GLES2Context_proto = cls->getProto();
    __jsb_cocos2d_GLES2Context_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2Window_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Window_class = nullptr;

static bool js_gfx_GLES2Window_Initialize(se::State& s)
{
    cocos2d::GLES2Window* cobj = (cocos2d::GLES2Window*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Window_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXWindowInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXWindowInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Window_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Window_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Window_Initialize)

static bool js_gfx_GLES2Window_Destroy(se::State& s)
{
    cocos2d::GLES2Window* cobj = (cocos2d::GLES2Window*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Window_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Window_Destroy)

static bool js_gfx_GLES2Window_Resize(se::State& s)
{
    cocos2d::GLES2Window* cobj = (cocos2d::GLES2Window*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Window_Resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Window_Resize : Error processing arguments");
        cobj->Resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Window_Resize)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Window_finalize)

static bool js_gfx_GLES2Window_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2Window_constructor : Error processing arguments");
    cocos2d::GLES2Window* cobj = new (std::nothrow) cocos2d::GLES2Window(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Window_constructor, __jsb_cocos2d_GLES2Window_class, js_cocos2d_GLES2Window_finalize)



extern se::Object* __jsb_cocos2d_GFXWindow_proto;

static bool js_cocos2d_GLES2Window_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Window)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Window* cobj = (cocos2d::GLES2Window*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Window_finalize)

bool js_register_gfx_GLES2Window(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Window", obj, __jsb_cocos2d_GFXWindow_proto, _SE(js_gfx_GLES2Window_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2Window_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2Window_Destroy));
    cls->defineFunction("Resize", _SE(js_gfx_GLES2Window_Resize));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Window_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Window>(cls);

    __jsb_cocos2d_GLES2Window_proto = cls->getProto();
    __jsb_cocos2d_GLES2Window_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2Buffer_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Buffer_class = nullptr;

static bool js_gfx_GLES2Buffer_Update(se::State& s)
{
    cocos2d::GLES2Buffer* cobj = (cocos2d::GLES2Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Buffer_Update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        void* arg0 = nullptr;
        unsigned int arg1 = 0;
        unsigned int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
        ok = false;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Buffer_Update : Error processing arguments");
        cobj->Update(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Buffer_Update)

static bool js_gfx_GLES2Buffer_gpu_buffer(se::State& s)
{
    cocos2d::GLES2Buffer* cobj = (cocos2d::GLES2Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Buffer_gpu_buffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUBuffer* result = cobj->gpu_buffer();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUBuffer>((cocos2d::GLES2GPUBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Buffer_gpu_buffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Buffer_gpu_buffer)

static bool js_gfx_GLES2Buffer_Initialize(se::State& s)
{
    cocos2d::GLES2Buffer* cobj = (cocos2d::GLES2Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Buffer_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Buffer_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Buffer_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Buffer_Initialize)

static bool js_gfx_GLES2Buffer_Destroy(se::State& s)
{
    cocos2d::GLES2Buffer* cobj = (cocos2d::GLES2Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Buffer_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Buffer_Destroy)

static bool js_gfx_GLES2Buffer_Resize(se::State& s)
{
    cocos2d::GLES2Buffer* cobj = (cocos2d::GLES2Buffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Buffer_Resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Buffer_Resize : Error processing arguments");
        cobj->Resize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Buffer_Resize)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Buffer_finalize)

static bool js_gfx_GLES2Buffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2Buffer_constructor : Error processing arguments");
    cocos2d::GLES2Buffer* cobj = new (std::nothrow) cocos2d::GLES2Buffer(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Buffer_constructor, __jsb_cocos2d_GLES2Buffer_class, js_cocos2d_GLES2Buffer_finalize)



extern se::Object* __jsb_cocos2d_GFXBuffer_proto;

static bool js_cocos2d_GLES2Buffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Buffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Buffer* cobj = (cocos2d::GLES2Buffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Buffer_finalize)

bool js_register_gfx_GLES2Buffer(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Buffer", obj, __jsb_cocos2d_GFXBuffer_proto, _SE(js_gfx_GLES2Buffer_constructor));

    cls->defineFunction("Update", _SE(js_gfx_GLES2Buffer_Update));
    cls->defineFunction("gpu_buffer", _SE(js_gfx_GLES2Buffer_gpu_buffer));
    cls->defineFunction("Initialize", _SE(js_gfx_GLES2Buffer_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2Buffer_Destroy));
    cls->defineFunction("Resize", _SE(js_gfx_GLES2Buffer_Resize));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Buffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Buffer>(cls);

    __jsb_cocos2d_GLES2Buffer_proto = cls->getProto();
    __jsb_cocos2d_GLES2Buffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2Texture_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Texture_class = nullptr;

static bool js_gfx_GLES2Texture_Initialize(se::State& s)
{
    cocos2d::GLES2Texture* cobj = (cocos2d::GLES2Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Texture_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Texture_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Texture_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Texture_Initialize)

static bool js_gfx_GLES2Texture_Destroy(se::State& s)
{
    cocos2d::GLES2Texture* cobj = (cocos2d::GLES2Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Texture_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Texture_Destroy)

static bool js_gfx_GLES2Texture_gpu_texture(se::State& s)
{
    cocos2d::GLES2Texture* cobj = (cocos2d::GLES2Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Texture_gpu_texture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUTexture* result = cobj->gpu_texture();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUTexture>((cocos2d::GLES2GPUTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Texture_gpu_texture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Texture_gpu_texture)

static bool js_gfx_GLES2Texture_Resize(se::State& s)
{
    cocos2d::GLES2Texture* cobj = (cocos2d::GLES2Texture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Texture_Resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Texture_Resize : Error processing arguments");
        cobj->Resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Texture_Resize)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Texture_finalize)

static bool js_gfx_GLES2Texture_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2Texture_constructor : Error processing arguments");
    cocos2d::GLES2Texture* cobj = new (std::nothrow) cocos2d::GLES2Texture(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Texture_constructor, __jsb_cocos2d_GLES2Texture_class, js_cocos2d_GLES2Texture_finalize)



extern se::Object* __jsb_cocos2d_GFXTexture_proto;

static bool js_cocos2d_GLES2Texture_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Texture)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Texture* cobj = (cocos2d::GLES2Texture*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Texture_finalize)

bool js_register_gfx_GLES2Texture(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Texture", obj, __jsb_cocos2d_GFXTexture_proto, _SE(js_gfx_GLES2Texture_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2Texture_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2Texture_Destroy));
    cls->defineFunction("gpu_texture", _SE(js_gfx_GLES2Texture_gpu_texture));
    cls->defineFunction("Resize", _SE(js_gfx_GLES2Texture_Resize));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Texture_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Texture>(cls);

    __jsb_cocos2d_GLES2Texture_proto = cls->getProto();
    __jsb_cocos2d_GLES2Texture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2TextureView_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2TextureView_class = nullptr;

static bool js_gfx_GLES2TextureView_Initialize(se::State& s)
{
    cocos2d::GLES2TextureView* cobj = (cocos2d::GLES2TextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2TextureView_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXTextureViewInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureViewInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2TextureView_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2TextureView_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2TextureView_Initialize)

static bool js_gfx_GLES2TextureView_Destroy(se::State& s)
{
    cocos2d::GLES2TextureView* cobj = (cocos2d::GLES2TextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2TextureView_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2TextureView_Destroy)

static bool js_gfx_GLES2TextureView_gpu_tex_view(se::State& s)
{
    cocos2d::GLES2TextureView* cobj = (cocos2d::GLES2TextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2TextureView_gpu_tex_view : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUTextureView* result = cobj->gpu_tex_view();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUTextureView>((cocos2d::GLES2GPUTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2TextureView_gpu_tex_view : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2TextureView_gpu_tex_view)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2TextureView_finalize)

static bool js_gfx_GLES2TextureView_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2TextureView_constructor : Error processing arguments");
    cocos2d::GLES2TextureView* cobj = new (std::nothrow) cocos2d::GLES2TextureView(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2TextureView_constructor, __jsb_cocos2d_GLES2TextureView_class, js_cocos2d_GLES2TextureView_finalize)



extern se::Object* __jsb_cocos2d_GFXTextureView_proto;

static bool js_cocos2d_GLES2TextureView_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2TextureView)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2TextureView* cobj = (cocos2d::GLES2TextureView*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2TextureView_finalize)

bool js_register_gfx_GLES2TextureView(se::Object* obj)
{
    auto cls = se::Class::create("GLES2TextureView", obj, __jsb_cocos2d_GFXTextureView_proto, _SE(js_gfx_GLES2TextureView_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2TextureView_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2TextureView_Destroy));
    cls->defineFunction("gpu_tex_view", _SE(js_gfx_GLES2TextureView_gpu_tex_view));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2TextureView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2TextureView>(cls);

    __jsb_cocos2d_GLES2TextureView_proto = cls->getProto();
    __jsb_cocos2d_GLES2TextureView_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2Sampler_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Sampler_class = nullptr;

static bool js_gfx_GLES2Sampler_Initialize(se::State& s)
{
    cocos2d::GLES2Sampler* cobj = (cocos2d::GLES2Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Sampler_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXSamplerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXSamplerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Sampler_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Sampler_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Sampler_Initialize)

static bool js_gfx_GLES2Sampler_Destroy(se::State& s)
{
    cocos2d::GLES2Sampler* cobj = (cocos2d::GLES2Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Sampler_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Sampler_Destroy)

static bool js_gfx_GLES2Sampler_gpu_sampler(se::State& s)
{
    cocos2d::GLES2Sampler* cobj = (cocos2d::GLES2Sampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Sampler_gpu_sampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUSampler* result = cobj->gpu_sampler();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUSampler>((cocos2d::GLES2GPUSampler*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Sampler_gpu_sampler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Sampler_gpu_sampler)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Sampler_finalize)

static bool js_gfx_GLES2Sampler_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2Sampler_constructor : Error processing arguments");
    cocos2d::GLES2Sampler* cobj = new (std::nothrow) cocos2d::GLES2Sampler(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Sampler_constructor, __jsb_cocos2d_GLES2Sampler_class, js_cocos2d_GLES2Sampler_finalize)



extern se::Object* __jsb_cocos2d_GFXSampler_proto;

static bool js_cocos2d_GLES2Sampler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Sampler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Sampler* cobj = (cocos2d::GLES2Sampler*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Sampler_finalize)

bool js_register_gfx_GLES2Sampler(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Sampler", obj, __jsb_cocos2d_GFXSampler_proto, _SE(js_gfx_GLES2Sampler_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2Sampler_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2Sampler_Destroy));
    cls->defineFunction("gpu_sampler", _SE(js_gfx_GLES2Sampler_gpu_sampler));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Sampler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Sampler>(cls);

    __jsb_cocos2d_GLES2Sampler_proto = cls->getProto();
    __jsb_cocos2d_GLES2Sampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2Shader_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Shader_class = nullptr;

static bool js_gfx_GLES2Shader_Initialize(se::State& s)
{
    cocos2d::GLES2Shader* cobj = (cocos2d::GLES2Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Shader_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXShaderInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXShaderInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Shader_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Shader_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Shader_Initialize)

static bool js_gfx_GLES2Shader_Destroy(se::State& s)
{
    cocos2d::GLES2Shader* cobj = (cocos2d::GLES2Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Shader_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Shader_Destroy)

static bool js_gfx_GLES2Shader_gpu_shader(se::State& s)
{
    cocos2d::GLES2Shader* cobj = (cocos2d::GLES2Shader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Shader_gpu_shader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUShader* result = cobj->gpu_shader();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUShader>((cocos2d::GLES2GPUShader*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Shader_gpu_shader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Shader_gpu_shader)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Shader_finalize)

static bool js_gfx_GLES2Shader_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2Shader_constructor : Error processing arguments");
    cocos2d::GLES2Shader* cobj = new (std::nothrow) cocos2d::GLES2Shader(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Shader_constructor, __jsb_cocos2d_GLES2Shader_class, js_cocos2d_GLES2Shader_finalize)



extern se::Object* __jsb_cocos2d_GFXShader_proto;

static bool js_cocos2d_GLES2Shader_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Shader)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Shader* cobj = (cocos2d::GLES2Shader*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Shader_finalize)

bool js_register_gfx_GLES2Shader(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Shader", obj, __jsb_cocos2d_GFXShader_proto, _SE(js_gfx_GLES2Shader_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2Shader_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2Shader_Destroy));
    cls->defineFunction("gpu_shader", _SE(js_gfx_GLES2Shader_gpu_shader));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Shader_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Shader>(cls);

    __jsb_cocos2d_GLES2Shader_proto = cls->getProto();
    __jsb_cocos2d_GLES2Shader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2InputAssembler_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2InputAssembler_class = nullptr;

static bool js_gfx_GLES2InputAssembler_Initialize(se::State& s)
{
    cocos2d::GLES2InputAssembler* cobj = (cocos2d::GLES2InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2InputAssembler_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssemblerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXInputAssemblerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2InputAssembler_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2InputAssembler_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2InputAssembler_Initialize)

static bool js_gfx_GLES2InputAssembler_Destroy(se::State& s)
{
    cocos2d::GLES2InputAssembler* cobj = (cocos2d::GLES2InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2InputAssembler_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2InputAssembler_Destroy)

static bool js_gfx_GLES2InputAssembler_gpu_input_assembler(se::State& s)
{
    cocos2d::GLES2InputAssembler* cobj = (cocos2d::GLES2InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2InputAssembler_gpu_input_assembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUInputAssembler* result = cobj->gpu_input_assembler();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUInputAssembler>((cocos2d::GLES2GPUInputAssembler*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2InputAssembler_gpu_input_assembler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2InputAssembler_gpu_input_assembler)

static bool js_gfx_GLES2InputAssembler_ExtractCmdDraw(se::State& s)
{
    cocos2d::GLES2InputAssembler* cobj = (cocos2d::GLES2InputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2InputAssembler_ExtractCmdDraw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GLES2CmdDraw* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2InputAssembler_ExtractCmdDraw : Error processing arguments");
        cobj->ExtractCmdDraw(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2InputAssembler_ExtractCmdDraw)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2InputAssembler_finalize)

static bool js_gfx_GLES2InputAssembler_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2InputAssembler_constructor : Error processing arguments");
    cocos2d::GLES2InputAssembler* cobj = new (std::nothrow) cocos2d::GLES2InputAssembler(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2InputAssembler_constructor, __jsb_cocos2d_GLES2InputAssembler_class, js_cocos2d_GLES2InputAssembler_finalize)



extern se::Object* __jsb_cocos2d_GFXInputAssembler_proto;

static bool js_cocos2d_GLES2InputAssembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2InputAssembler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2InputAssembler* cobj = (cocos2d::GLES2InputAssembler*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2InputAssembler_finalize)

bool js_register_gfx_GLES2InputAssembler(se::Object* obj)
{
    auto cls = se::Class::create("GLES2InputAssembler", obj, __jsb_cocos2d_GFXInputAssembler_proto, _SE(js_gfx_GLES2InputAssembler_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2InputAssembler_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2InputAssembler_Destroy));
    cls->defineFunction("gpu_input_assembler", _SE(js_gfx_GLES2InputAssembler_gpu_input_assembler));
    cls->defineFunction("ExtractCmdDraw", _SE(js_gfx_GLES2InputAssembler_ExtractCmdDraw));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2InputAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2InputAssembler>(cls);

    __jsb_cocos2d_GLES2InputAssembler_proto = cls->getProto();
    __jsb_cocos2d_GLES2InputAssembler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2RenderPass_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2RenderPass_class = nullptr;

static bool js_gfx_GLES2RenderPass_Initialize(se::State& s)
{
    cocos2d::GLES2RenderPass* cobj = (cocos2d::GLES2RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2RenderPass_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRenderPassInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRenderPassInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2RenderPass_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2RenderPass_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2RenderPass_Initialize)

static bool js_gfx_GLES2RenderPass_Destroy(se::State& s)
{
    cocos2d::GLES2RenderPass* cobj = (cocos2d::GLES2RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2RenderPass_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2RenderPass_Destroy)

static bool js_gfx_GLES2RenderPass_gpu_render_pass(se::State& s)
{
    cocos2d::GLES2RenderPass* cobj = (cocos2d::GLES2RenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2RenderPass_gpu_render_pass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPURenderPass* result = cobj->gpu_render_pass();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPURenderPass>((cocos2d::GLES2GPURenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2RenderPass_gpu_render_pass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2RenderPass_gpu_render_pass)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2RenderPass_finalize)

static bool js_gfx_GLES2RenderPass_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2RenderPass_constructor : Error processing arguments");
    cocos2d::GLES2RenderPass* cobj = new (std::nothrow) cocos2d::GLES2RenderPass(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2RenderPass_constructor, __jsb_cocos2d_GLES2RenderPass_class, js_cocos2d_GLES2RenderPass_finalize)



extern se::Object* __jsb_cocos2d_GFXRenderPass_proto;

static bool js_cocos2d_GLES2RenderPass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2RenderPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2RenderPass* cobj = (cocos2d::GLES2RenderPass*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2RenderPass_finalize)

bool js_register_gfx_GLES2RenderPass(se::Object* obj)
{
    auto cls = se::Class::create("GLES2RenderPass", obj, __jsb_cocos2d_GFXRenderPass_proto, _SE(js_gfx_GLES2RenderPass_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2RenderPass_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2RenderPass_Destroy));
    cls->defineFunction("gpu_render_pass", _SE(js_gfx_GLES2RenderPass_gpu_render_pass));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2RenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2RenderPass>(cls);

    __jsb_cocos2d_GLES2RenderPass_proto = cls->getProto();
    __jsb_cocos2d_GLES2RenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2Framebuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Framebuffer_class = nullptr;

static bool js_gfx_GLES2Framebuffer_Initialize(se::State& s)
{
    cocos2d::GLES2Framebuffer* cobj = (cocos2d::GLES2Framebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Framebuffer_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXFramebufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXFramebufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Framebuffer_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Framebuffer_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Framebuffer_Initialize)

static bool js_gfx_GLES2Framebuffer_Destroy(se::State& s)
{
    cocos2d::GLES2Framebuffer* cobj = (cocos2d::GLES2Framebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Framebuffer_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Framebuffer_Destroy)

static bool js_gfx_GLES2Framebuffer_gpu_fbo(se::State& s)
{
    cocos2d::GLES2Framebuffer* cobj = (cocos2d::GLES2Framebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Framebuffer_gpu_fbo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUFramebuffer* result = cobj->gpu_fbo();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUFramebuffer>((cocos2d::GLES2GPUFramebuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Framebuffer_gpu_fbo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Framebuffer_gpu_fbo)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Framebuffer_finalize)

static bool js_gfx_GLES2Framebuffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2Framebuffer_constructor : Error processing arguments");
    cocos2d::GLES2Framebuffer* cobj = new (std::nothrow) cocos2d::GLES2Framebuffer(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Framebuffer_constructor, __jsb_cocos2d_GLES2Framebuffer_class, js_cocos2d_GLES2Framebuffer_finalize)



extern se::Object* __jsb_cocos2d_GFXFramebuffer_proto;

static bool js_cocos2d_GLES2Framebuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Framebuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Framebuffer* cobj = (cocos2d::GLES2Framebuffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Framebuffer_finalize)

bool js_register_gfx_GLES2Framebuffer(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Framebuffer", obj, __jsb_cocos2d_GFXFramebuffer_proto, _SE(js_gfx_GLES2Framebuffer_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2Framebuffer_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2Framebuffer_Destroy));
    cls->defineFunction("gpu_fbo", _SE(js_gfx_GLES2Framebuffer_gpu_fbo));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Framebuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Framebuffer>(cls);

    __jsb_cocos2d_GLES2Framebuffer_proto = cls->getProto();
    __jsb_cocos2d_GLES2Framebuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2BindingLayout_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2BindingLayout_class = nullptr;

static bool js_gfx_GLES2BindingLayout_Initialize(se::State& s)
{
    cocos2d::GLES2BindingLayout* cobj = (cocos2d::GLES2BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2BindingLayout_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayoutInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBindingLayoutInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2BindingLayout_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2BindingLayout_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2BindingLayout_Initialize)

static bool js_gfx_GLES2BindingLayout_Destroy(se::State& s)
{
    cocos2d::GLES2BindingLayout* cobj = (cocos2d::GLES2BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2BindingLayout_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2BindingLayout_Destroy)

static bool js_gfx_GLES2BindingLayout_gpu_binding_layout(se::State& s)
{
    cocos2d::GLES2BindingLayout* cobj = (cocos2d::GLES2BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2BindingLayout_gpu_binding_layout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUBindingLayout* result = cobj->gpu_binding_layout();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUBindingLayout>((cocos2d::GLES2GPUBindingLayout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2BindingLayout_gpu_binding_layout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2BindingLayout_gpu_binding_layout)

static bool js_gfx_GLES2BindingLayout_Update(se::State& s)
{
    cocos2d::GLES2BindingLayout* cobj = (cocos2d::GLES2BindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2BindingLayout_Update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2BindingLayout_Update)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2BindingLayout_finalize)

static bool js_gfx_GLES2BindingLayout_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2BindingLayout_constructor : Error processing arguments");
    cocos2d::GLES2BindingLayout* cobj = new (std::nothrow) cocos2d::GLES2BindingLayout(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2BindingLayout_constructor, __jsb_cocos2d_GLES2BindingLayout_class, js_cocos2d_GLES2BindingLayout_finalize)



extern se::Object* __jsb_cocos2d_GFXBindingLayout_proto;

static bool js_cocos2d_GLES2BindingLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2BindingLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2BindingLayout* cobj = (cocos2d::GLES2BindingLayout*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2BindingLayout_finalize)

bool js_register_gfx_GLES2BindingLayout(se::Object* obj)
{
    auto cls = se::Class::create("GLES2BindingLayout", obj, __jsb_cocos2d_GFXBindingLayout_proto, _SE(js_gfx_GLES2BindingLayout_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2BindingLayout_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2BindingLayout_Destroy));
    cls->defineFunction("gpu_binding_layout", _SE(js_gfx_GLES2BindingLayout_gpu_binding_layout));
    cls->defineFunction("Update", _SE(js_gfx_GLES2BindingLayout_Update));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2BindingLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2BindingLayout>(cls);

    __jsb_cocos2d_GLES2BindingLayout_proto = cls->getProto();
    __jsb_cocos2d_GLES2BindingLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2PipelineLayout_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2PipelineLayout_class = nullptr;

static bool js_gfx_GLES2PipelineLayout_Initialize(se::State& s)
{
    cocos2d::GLES2PipelineLayout* cobj = (cocos2d::GLES2PipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2PipelineLayout_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineLayoutInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXPipelineLayoutInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2PipelineLayout_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2PipelineLayout_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2PipelineLayout_Initialize)

static bool js_gfx_GLES2PipelineLayout_Destroy(se::State& s)
{
    cocos2d::GLES2PipelineLayout* cobj = (cocos2d::GLES2PipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2PipelineLayout_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2PipelineLayout_Destroy)

static bool js_gfx_GLES2PipelineLayout_gpu_pipeline_layout(se::State& s)
{
    cocos2d::GLES2PipelineLayout* cobj = (cocos2d::GLES2PipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2PipelineLayout_gpu_pipeline_layout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUPipelineLayout* result = cobj->gpu_pipeline_layout();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUPipelineLayout>((cocos2d::GLES2GPUPipelineLayout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2PipelineLayout_gpu_pipeline_layout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2PipelineLayout_gpu_pipeline_layout)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2PipelineLayout_finalize)

static bool js_gfx_GLES2PipelineLayout_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2PipelineLayout_constructor : Error processing arguments");
    cocos2d::GLES2PipelineLayout* cobj = new (std::nothrow) cocos2d::GLES2PipelineLayout(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2PipelineLayout_constructor, __jsb_cocos2d_GLES2PipelineLayout_class, js_cocos2d_GLES2PipelineLayout_finalize)



extern se::Object* __jsb_cocos2d_GFXPipelineLayout_proto;

static bool js_cocos2d_GLES2PipelineLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2PipelineLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2PipelineLayout* cobj = (cocos2d::GLES2PipelineLayout*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2PipelineLayout_finalize)

bool js_register_gfx_GLES2PipelineLayout(se::Object* obj)
{
    auto cls = se::Class::create("GLES2PipelineLayout", obj, __jsb_cocos2d_GFXPipelineLayout_proto, _SE(js_gfx_GLES2PipelineLayout_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2PipelineLayout_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2PipelineLayout_Destroy));
    cls->defineFunction("gpu_pipeline_layout", _SE(js_gfx_GLES2PipelineLayout_gpu_pipeline_layout));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2PipelineLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2PipelineLayout>(cls);

    __jsb_cocos2d_GLES2PipelineLayout_proto = cls->getProto();
    __jsb_cocos2d_GLES2PipelineLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2PipelineState_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2PipelineState_class = nullptr;

static bool js_gfx_GLES2PipelineState_Initialize(se::State& s)
{
    cocos2d::GLES2PipelineState* cobj = (cocos2d::GLES2PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2PipelineState_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineStateInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXPipelineStateInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2PipelineState_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2PipelineState_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2PipelineState_Initialize)

static bool js_gfx_GLES2PipelineState_Destroy(se::State& s)
{
    cocos2d::GLES2PipelineState* cobj = (cocos2d::GLES2PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2PipelineState_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2PipelineState_Destroy)

static bool js_gfx_GLES2PipelineState_gpu_pso(se::State& s)
{
    cocos2d::GLES2PipelineState* cobj = (cocos2d::GLES2PipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2PipelineState_gpu_pso : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::GLES2GPUPipelineState* result = cobj->gpu_pso();
        ok &= native_ptr_to_seval<cocos2d::GLES2GPUPipelineState>((cocos2d::GLES2GPUPipelineState*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2PipelineState_gpu_pso : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2PipelineState_gpu_pso)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2PipelineState_finalize)

static bool js_gfx_GLES2PipelineState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2PipelineState_constructor : Error processing arguments");
    cocos2d::GLES2PipelineState* cobj = new (std::nothrow) cocos2d::GLES2PipelineState(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2PipelineState_constructor, __jsb_cocos2d_GLES2PipelineState_class, js_cocos2d_GLES2PipelineState_finalize)



extern se::Object* __jsb_cocos2d_GFXPipelineState_proto;

static bool js_cocos2d_GLES2PipelineState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2PipelineState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2PipelineState* cobj = (cocos2d::GLES2PipelineState*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2PipelineState_finalize)

bool js_register_gfx_GLES2PipelineState(se::Object* obj)
{
    auto cls = se::Class::create("GLES2PipelineState", obj, __jsb_cocos2d_GFXPipelineState_proto, _SE(js_gfx_GLES2PipelineState_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2PipelineState_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2PipelineState_Destroy));
    cls->defineFunction("gpu_pso", _SE(js_gfx_GLES2PipelineState_gpu_pso));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2PipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2PipelineState>(cls);

    __jsb_cocos2d_GLES2PipelineState_proto = cls->getProto();
    __jsb_cocos2d_GLES2PipelineState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUBuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUBuffer_class = nullptr;



static bool js_cocos2d_GLES2GPUBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUBuffer* cobj = (cocos2d::GLES2GPUBuffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUBuffer_finalize)

bool js_register_gfx_GLES2GPUBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUBuffer", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUBuffer>(cls);

    __jsb_cocos2d_GLES2GPUBuffer_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUTexture_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUTexture_class = nullptr;



static bool js_cocos2d_GLES2GPUTexture_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUTexture)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUTexture* cobj = (cocos2d::GLES2GPUTexture*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUTexture_finalize)

bool js_register_gfx_GLES2GPUTexture(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUTexture", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUTexture>(cls);

    __jsb_cocos2d_GLES2GPUTexture_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUTexture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUTextureView_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUTextureView_class = nullptr;



static bool js_cocos2d_GLES2GPUTextureView_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUTextureView)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUTextureView* cobj = (cocos2d::GLES2GPUTextureView*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUTextureView_finalize)

bool js_register_gfx_GLES2GPUTextureView(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUTextureView", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUTextureView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUTextureView>(cls);

    __jsb_cocos2d_GLES2GPUTextureView_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUTextureView_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUSampler_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUSampler_class = nullptr;



static bool js_cocos2d_GLES2GPUSampler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUSampler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUSampler* cobj = (cocos2d::GLES2GPUSampler*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUSampler_finalize)

bool js_register_gfx_GLES2GPUSampler(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUSampler", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUSampler>(cls);

    __jsb_cocos2d_GLES2GPUSampler_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUShader_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUShader_class = nullptr;



static bool js_cocos2d_GLES2GPUShader_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUShader)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUShader* cobj = (cocos2d::GLES2GPUShader*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUShader_finalize)

bool js_register_gfx_GLES2GPUShader(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUShader", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUShader_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUShader>(cls);

    __jsb_cocos2d_GLES2GPUShader_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUShader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUInputAssembler_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUInputAssembler_class = nullptr;



static bool js_cocos2d_GLES2GPUInputAssembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUInputAssembler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUInputAssembler* cobj = (cocos2d::GLES2GPUInputAssembler*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUInputAssembler_finalize)

bool js_register_gfx_GLES2GPUInputAssembler(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUInputAssembler", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUInputAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUInputAssembler>(cls);

    __jsb_cocos2d_GLES2GPUInputAssembler_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUInputAssembler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPURenderPass_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPURenderPass_class = nullptr;



static bool js_cocos2d_GLES2GPURenderPass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPURenderPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPURenderPass* cobj = (cocos2d::GLES2GPURenderPass*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPURenderPass_finalize)

bool js_register_gfx_GLES2GPURenderPass(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPURenderPass", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPURenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPURenderPass>(cls);

    __jsb_cocos2d_GLES2GPURenderPass_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPURenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUFramebuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUFramebuffer_class = nullptr;



static bool js_cocos2d_GLES2GPUFramebuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUFramebuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUFramebuffer* cobj = (cocos2d::GLES2GPUFramebuffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUFramebuffer_finalize)

bool js_register_gfx_GLES2GPUFramebuffer(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUFramebuffer", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUFramebuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUFramebuffer>(cls);

    __jsb_cocos2d_GLES2GPUFramebuffer_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUFramebuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUPipelineLayout_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUPipelineLayout_class = nullptr;



static bool js_cocos2d_GLES2GPUPipelineLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUPipelineLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUPipelineLayout* cobj = (cocos2d::GLES2GPUPipelineLayout*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUPipelineLayout_finalize)

bool js_register_gfx_GLES2GPUPipelineLayout(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUPipelineLayout", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUPipelineLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUPipelineLayout>(cls);

    __jsb_cocos2d_GLES2GPUPipelineLayout_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUPipelineLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUPipelineState_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUPipelineState_class = nullptr;



static bool js_cocos2d_GLES2GPUPipelineState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUPipelineState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUPipelineState* cobj = (cocos2d::GLES2GPUPipelineState*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUPipelineState_finalize)

bool js_register_gfx_GLES2GPUPipelineState(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUPipelineState", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUPipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUPipelineState>(cls);

    __jsb_cocos2d_GLES2GPUPipelineState_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUPipelineState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2GPUBindingLayout_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2GPUBindingLayout_class = nullptr;



static bool js_cocos2d_GLES2GPUBindingLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2GPUBindingLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2GPUBindingLayout* cobj = (cocos2d::GLES2GPUBindingLayout*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2GPUBindingLayout_finalize)

bool js_register_gfx_GLES2GPUBindingLayout(se::Object* obj)
{
    auto cls = se::Class::create("GLES2GPUBindingLayout", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2GPUBindingLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2GPUBindingLayout>(cls);

    __jsb_cocos2d_GLES2GPUBindingLayout_proto = cls->getProto();
    __jsb_cocos2d_GLES2GPUBindingLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2CmdBeginRenderPass_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2CmdBeginRenderPass_class = nullptr;

static bool js_gfx_GLES2CmdBeginRenderPass_Clear(se::State& s)
{
    cocos2d::GLES2CmdBeginRenderPass* cobj = (cocos2d::GLES2CmdBeginRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CmdBeginRenderPass_Clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CmdBeginRenderPass_Clear)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2CmdBeginRenderPass_finalize)

static bool js_gfx_GLES2CmdBeginRenderPass_constructor(se::State& s)
{
    cocos2d::GLES2CmdBeginRenderPass* cobj = new (std::nothrow) cocos2d::GLES2CmdBeginRenderPass();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2CmdBeginRenderPass_constructor, __jsb_cocos2d_GLES2CmdBeginRenderPass_class, js_cocos2d_GLES2CmdBeginRenderPass_finalize)



extern se::Object* __jsb_cocos2d_GFXCmd_proto;

static bool js_cocos2d_GLES2CmdBeginRenderPass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2CmdBeginRenderPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2CmdBeginRenderPass* cobj = (cocos2d::GLES2CmdBeginRenderPass*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2CmdBeginRenderPass_finalize)

bool js_register_gfx_GLES2CmdBeginRenderPass(se::Object* obj)
{
    auto cls = se::Class::create("GLES2CmdBeginRenderPass", obj, __jsb_cocos2d_GFXCmd_proto, _SE(js_gfx_GLES2CmdBeginRenderPass_constructor));

    cls->defineFunction("Clear", _SE(js_gfx_GLES2CmdBeginRenderPass_Clear));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2CmdBeginRenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2CmdBeginRenderPass>(cls);

    __jsb_cocos2d_GLES2CmdBeginRenderPass_proto = cls->getProto();
    __jsb_cocos2d_GLES2CmdBeginRenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2CmdBindStates_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2CmdBindStates_class = nullptr;

static bool js_gfx_GLES2CmdBindStates_Clear(se::State& s)
{
    cocos2d::GLES2CmdBindStates* cobj = (cocos2d::GLES2CmdBindStates*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CmdBindStates_Clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CmdBindStates_Clear)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2CmdBindStates_finalize)

static bool js_gfx_GLES2CmdBindStates_constructor(se::State& s)
{
    cocos2d::GLES2CmdBindStates* cobj = new (std::nothrow) cocos2d::GLES2CmdBindStates();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2CmdBindStates_constructor, __jsb_cocos2d_GLES2CmdBindStates_class, js_cocos2d_GLES2CmdBindStates_finalize)



extern se::Object* __jsb_cocos2d_GFXCmd_proto;

static bool js_cocos2d_GLES2CmdBindStates_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2CmdBindStates)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2CmdBindStates* cobj = (cocos2d::GLES2CmdBindStates*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2CmdBindStates_finalize)

bool js_register_gfx_GLES2CmdBindStates(se::Object* obj)
{
    auto cls = se::Class::create("GLES2CmdBindStates", obj, __jsb_cocos2d_GFXCmd_proto, _SE(js_gfx_GLES2CmdBindStates_constructor));

    cls->defineFunction("Clear", _SE(js_gfx_GLES2CmdBindStates_Clear));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2CmdBindStates_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2CmdBindStates>(cls);

    __jsb_cocos2d_GLES2CmdBindStates_proto = cls->getProto();
    __jsb_cocos2d_GLES2CmdBindStates_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2CmdDraw_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2CmdDraw_class = nullptr;

static bool js_gfx_GLES2CmdDraw_Clear(se::State& s)
{
    cocos2d::GLES2CmdDraw* cobj = (cocos2d::GLES2CmdDraw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CmdDraw_Clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CmdDraw_Clear)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2CmdDraw_finalize)

static bool js_gfx_GLES2CmdDraw_constructor(se::State& s)
{
    cocos2d::GLES2CmdDraw* cobj = new (std::nothrow) cocos2d::GLES2CmdDraw();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2CmdDraw_constructor, __jsb_cocos2d_GLES2CmdDraw_class, js_cocos2d_GLES2CmdDraw_finalize)



extern se::Object* __jsb_cocos2d_GFXCmd_proto;

static bool js_cocos2d_GLES2CmdDraw_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2CmdDraw)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2CmdDraw* cobj = (cocos2d::GLES2CmdDraw*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2CmdDraw_finalize)

bool js_register_gfx_GLES2CmdDraw(se::Object* obj)
{
    auto cls = se::Class::create("GLES2CmdDraw", obj, __jsb_cocos2d_GFXCmd_proto, _SE(js_gfx_GLES2CmdDraw_constructor));

    cls->defineFunction("Clear", _SE(js_gfx_GLES2CmdDraw_Clear));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2CmdDraw_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2CmdDraw>(cls);

    __jsb_cocos2d_GLES2CmdDraw_proto = cls->getProto();
    __jsb_cocos2d_GLES2CmdDraw_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2CmdUpdateBuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2CmdUpdateBuffer_class = nullptr;

static bool js_gfx_GLES2CmdUpdateBuffer_Clear(se::State& s)
{
    cocos2d::GLES2CmdUpdateBuffer* cobj = (cocos2d::GLES2CmdUpdateBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CmdUpdateBuffer_Clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CmdUpdateBuffer_Clear)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2CmdUpdateBuffer_finalize)

static bool js_gfx_GLES2CmdUpdateBuffer_constructor(se::State& s)
{
    cocos2d::GLES2CmdUpdateBuffer* cobj = new (std::nothrow) cocos2d::GLES2CmdUpdateBuffer();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2CmdUpdateBuffer_constructor, __jsb_cocos2d_GLES2CmdUpdateBuffer_class, js_cocos2d_GLES2CmdUpdateBuffer_finalize)



extern se::Object* __jsb_cocos2d_GFXCmd_proto;

static bool js_cocos2d_GLES2CmdUpdateBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2CmdUpdateBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2CmdUpdateBuffer* cobj = (cocos2d::GLES2CmdUpdateBuffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2CmdUpdateBuffer_finalize)

bool js_register_gfx_GLES2CmdUpdateBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GLES2CmdUpdateBuffer", obj, __jsb_cocos2d_GFXCmd_proto, _SE(js_gfx_GLES2CmdUpdateBuffer_constructor));

    cls->defineFunction("Clear", _SE(js_gfx_GLES2CmdUpdateBuffer_Clear));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2CmdUpdateBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2CmdUpdateBuffer>(cls);

    __jsb_cocos2d_GLES2CmdUpdateBuffer_proto = cls->getProto();
    __jsb_cocos2d_GLES2CmdUpdateBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2CmdCopyBufferToTexture_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2CmdCopyBufferToTexture_class = nullptr;

static bool js_gfx_GLES2CmdCopyBufferToTexture_Clear(se::State& s)
{
    cocos2d::GLES2CmdCopyBufferToTexture* cobj = (cocos2d::GLES2CmdCopyBufferToTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CmdCopyBufferToTexture_Clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CmdCopyBufferToTexture_Clear)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2CmdCopyBufferToTexture_finalize)

static bool js_gfx_GLES2CmdCopyBufferToTexture_constructor(se::State& s)
{
    cocos2d::GLES2CmdCopyBufferToTexture* cobj = new (std::nothrow) cocos2d::GLES2CmdCopyBufferToTexture();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2CmdCopyBufferToTexture_constructor, __jsb_cocos2d_GLES2CmdCopyBufferToTexture_class, js_cocos2d_GLES2CmdCopyBufferToTexture_finalize)



extern se::Object* __jsb_cocos2d_GFXCmd_proto;

static bool js_cocos2d_GLES2CmdCopyBufferToTexture_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2CmdCopyBufferToTexture)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2CmdCopyBufferToTexture* cobj = (cocos2d::GLES2CmdCopyBufferToTexture*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2CmdCopyBufferToTexture_finalize)

bool js_register_gfx_GLES2CmdCopyBufferToTexture(se::Object* obj)
{
    auto cls = se::Class::create("GLES2CmdCopyBufferToTexture", obj, __jsb_cocos2d_GFXCmd_proto, _SE(js_gfx_GLES2CmdCopyBufferToTexture_constructor));

    cls->defineFunction("Clear", _SE(js_gfx_GLES2CmdCopyBufferToTexture_Clear));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2CmdCopyBufferToTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2CmdCopyBufferToTexture>(cls);

    __jsb_cocos2d_GLES2CmdCopyBufferToTexture_proto = cls->getProto();
    __jsb_cocos2d_GLES2CmdCopyBufferToTexture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2CmdPackage_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2CmdPackage_class = nullptr;



static bool js_cocos2d_GLES2CmdPackage_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2CmdPackage)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2CmdPackage* cobj = (cocos2d::GLES2CmdPackage*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2CmdPackage_finalize)

bool js_register_gfx_GLES2CmdPackage(se::Object* obj)
{
    auto cls = se::Class::create("GLES2CmdPackage", obj, nullptr, nullptr);

    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2CmdPackage_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2CmdPackage>(cls);

    __jsb_cocos2d_GLES2CmdPackage_proto = cls->getProto();
    __jsb_cocos2d_GLES2CmdPackage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2CommandAllocator_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2CommandAllocator_class = nullptr;

static bool js_gfx_GLES2CommandAllocator_Initialize(se::State& s)
{
    cocos2d::GLES2CommandAllocator* cobj = (cocos2d::GLES2CommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandAllocator_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandAllocatorInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandAllocatorInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandAllocator_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandAllocator_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandAllocator_Initialize)

static bool js_gfx_GLES2CommandAllocator_Destroy(se::State& s)
{
    cocos2d::GLES2CommandAllocator* cobj = (cocos2d::GLES2CommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandAllocator_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandAllocator_Destroy)

static bool js_gfx_GLES2CommandAllocator_ClearCmds(se::State& s)
{
    cocos2d::GLES2CommandAllocator* cobj = (cocos2d::GLES2CommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandAllocator_ClearCmds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GLES2CmdPackage* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandAllocator_ClearCmds : Error processing arguments");
        cobj->ClearCmds(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandAllocator_ClearCmds)

static bool js_gfx_GLES2CommandAllocator_ReleaseCmds(se::State& s)
{
    cocos2d::GLES2CommandAllocator* cobj = (cocos2d::GLES2CommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandAllocator_ReleaseCmds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ReleaseCmds();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandAllocator_ReleaseCmds)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2CommandAllocator_finalize)

static bool js_gfx_GLES2CommandAllocator_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandAllocator_constructor : Error processing arguments");
    cocos2d::GLES2CommandAllocator* cobj = new (std::nothrow) cocos2d::GLES2CommandAllocator(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2CommandAllocator_constructor, __jsb_cocos2d_GLES2CommandAllocator_class, js_cocos2d_GLES2CommandAllocator_finalize)



extern se::Object* __jsb_cocos2d_GFXCommandAllocator_proto;

static bool js_cocos2d_GLES2CommandAllocator_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2CommandAllocator)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2CommandAllocator* cobj = (cocos2d::GLES2CommandAllocator*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2CommandAllocator_finalize)

bool js_register_gfx_GLES2CommandAllocator(se::Object* obj)
{
    auto cls = se::Class::create("GLES2CommandAllocator", obj, __jsb_cocos2d_GFXCommandAllocator_proto, _SE(js_gfx_GLES2CommandAllocator_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2CommandAllocator_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2CommandAllocator_Destroy));
    cls->defineFunction("ClearCmds", _SE(js_gfx_GLES2CommandAllocator_ClearCmds));
    cls->defineFunction("ReleaseCmds", _SE(js_gfx_GLES2CommandAllocator_ReleaseCmds));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2CommandAllocator_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2CommandAllocator>(cls);

    __jsb_cocos2d_GLES2CommandAllocator_proto = cls->getProto();
    __jsb_cocos2d_GLES2CommandAllocator_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2CommandBuffer_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2CommandBuffer_class = nullptr;

static bool js_gfx_GLES2CommandBuffer_End(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_End : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->End();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_End)

static bool js_gfx_GLES2CommandBuffer_BindInputAssembler(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_BindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_BindInputAssembler : Error processing arguments");
        cobj->BindInputAssembler(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_BindInputAssembler)

static bool js_gfx_GLES2CommandBuffer_BindPipelineState(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_BindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXPipelineState* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_BindPipelineState : Error processing arguments");
        cobj->BindPipelineState(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_BindPipelineState)

static bool js_gfx_GLES2CommandBuffer_Destroy(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_Destroy)

static bool js_gfx_GLES2CommandBuffer_SetDepthBias(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_SetDepthBias : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_SetDepthBias : Error processing arguments");
        cobj->SetDepthBias(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_SetDepthBias)

static bool js_gfx_GLES2CommandBuffer_Begin(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_Begin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Begin();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_Begin)

static bool js_gfx_GLES2CommandBuffer_BindBindingLayout(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_BindBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXBindingLayout* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_BindBindingLayout : Error processing arguments");
        cobj->BindBindingLayout(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_BindBindingLayout)

static bool js_gfx_GLES2CommandBuffer_EndRenderPass(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_EndRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->EndRenderPass();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_EndRenderPass)

static bool js_gfx_GLES2CommandBuffer_CopyBufferToTexture(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_CopyBufferToTexture : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_CopyBufferToTexture : Error processing arguments");
        cobj->CopyBufferToTexture(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_CopyBufferToTexture)

static bool js_gfx_GLES2CommandBuffer_UpdateBuffer(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_UpdateBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
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
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_UpdateBuffer : Error processing arguments");
        cobj->UpdateBuffer(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_UpdateBuffer)

static bool js_gfx_GLES2CommandBuffer_Execute(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_Execute : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXCommandBuffer** arg0 = nullptr;
        unsigned int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_Execute : Error processing arguments");
        cobj->Execute(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_Execute)

static bool js_gfx_GLES2CommandBuffer_SetStencilWriteMask(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_SetStencilWriteMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXStencilFace arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXStencilFace)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_SetStencilWriteMask : Error processing arguments");
        cobj->SetStencilWriteMask(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_SetStencilWriteMask)

static bool js_gfx_GLES2CommandBuffer_Draw(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_Draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXInputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_Draw : Error processing arguments");
        cobj->Draw(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_Draw)

static bool js_gfx_GLES2CommandBuffer_BeginRenderPass(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_BeginRenderPass : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_BeginRenderPass : Error processing arguments");
        cobj->BeginRenderPass(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_BeginRenderPass)

static bool js_gfx_GLES2CommandBuffer_SetStencilCompareMask(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_SetStencilCompareMask : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_SetStencilCompareMask : Error processing arguments");
        cobj->SetStencilCompareMask(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_SetStencilCompareMask)

static bool js_gfx_GLES2CommandBuffer_Initialize(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXCommandBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_Initialize)

static bool js_gfx_GLES2CommandBuffer_SetDepthBounds(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_SetDepthBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_SetDepthBounds : Error processing arguments");
        cobj->SetDepthBounds(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_SetDepthBounds)

static bool js_gfx_GLES2CommandBuffer_SetViewport(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_SetViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXViewport arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXViewport
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_SetViewport : Error processing arguments");
        cobj->SetViewport(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_SetViewport)

static bool js_gfx_GLES2CommandBuffer_SetBlendConstants(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_SetBlendConstants : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXColor arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXColor
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_SetBlendConstants : Error processing arguments");
        cobj->SetBlendConstants(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_SetBlendConstants)

static bool js_gfx_GLES2CommandBuffer_SetScissor(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_SetScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXRect arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRect
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_SetScissor : Error processing arguments");
        cobj->SetScissor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_SetScissor)

static bool js_gfx_GLES2CommandBuffer_SetLineWidth(se::State& s)
{
    cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2CommandBuffer_SetLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_SetLineWidth : Error processing arguments");
        cobj->SetLineWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2CommandBuffer_SetLineWidth)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2CommandBuffer_finalize)

static bool js_gfx_GLES2CommandBuffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2CommandBuffer_constructor : Error processing arguments");
    cocos2d::GLES2CommandBuffer* cobj = new (std::nothrow) cocos2d::GLES2CommandBuffer(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2CommandBuffer_constructor, __jsb_cocos2d_GLES2CommandBuffer_class, js_cocos2d_GLES2CommandBuffer_finalize)



extern se::Object* __jsb_cocos2d_GFXCommandBuffer_proto;

static bool js_cocos2d_GLES2CommandBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2CommandBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2CommandBuffer* cobj = (cocos2d::GLES2CommandBuffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2CommandBuffer_finalize)

bool js_register_gfx_GLES2CommandBuffer(se::Object* obj)
{
    auto cls = se::Class::create("GLES2CommandBuffer", obj, __jsb_cocos2d_GFXCommandBuffer_proto, _SE(js_gfx_GLES2CommandBuffer_constructor));

    cls->defineFunction("End", _SE(js_gfx_GLES2CommandBuffer_End));
    cls->defineFunction("BindInputAssembler", _SE(js_gfx_GLES2CommandBuffer_BindInputAssembler));
    cls->defineFunction("BindPipelineState", _SE(js_gfx_GLES2CommandBuffer_BindPipelineState));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2CommandBuffer_Destroy));
    cls->defineFunction("SetDepthBias", _SE(js_gfx_GLES2CommandBuffer_SetDepthBias));
    cls->defineFunction("Begin", _SE(js_gfx_GLES2CommandBuffer_Begin));
    cls->defineFunction("BindBindingLayout", _SE(js_gfx_GLES2CommandBuffer_BindBindingLayout));
    cls->defineFunction("EndRenderPass", _SE(js_gfx_GLES2CommandBuffer_EndRenderPass));
    cls->defineFunction("CopyBufferToTexture", _SE(js_gfx_GLES2CommandBuffer_CopyBufferToTexture));
    cls->defineFunction("UpdateBuffer", _SE(js_gfx_GLES2CommandBuffer_UpdateBuffer));
    cls->defineFunction("Execute", _SE(js_gfx_GLES2CommandBuffer_Execute));
    cls->defineFunction("SetStencilWriteMask", _SE(js_gfx_GLES2CommandBuffer_SetStencilWriteMask));
    cls->defineFunction("Draw", _SE(js_gfx_GLES2CommandBuffer_Draw));
    cls->defineFunction("BeginRenderPass", _SE(js_gfx_GLES2CommandBuffer_BeginRenderPass));
    cls->defineFunction("SetStencilCompareMask", _SE(js_gfx_GLES2CommandBuffer_SetStencilCompareMask));
    cls->defineFunction("Initialize", _SE(js_gfx_GLES2CommandBuffer_Initialize));
    cls->defineFunction("SetDepthBounds", _SE(js_gfx_GLES2CommandBuffer_SetDepthBounds));
    cls->defineFunction("SetViewport", _SE(js_gfx_GLES2CommandBuffer_SetViewport));
    cls->defineFunction("SetBlendConstants", _SE(js_gfx_GLES2CommandBuffer_SetBlendConstants));
    cls->defineFunction("SetScissor", _SE(js_gfx_GLES2CommandBuffer_SetScissor));
    cls->defineFunction("SetLineWidth", _SE(js_gfx_GLES2CommandBuffer_SetLineWidth));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2CommandBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2CommandBuffer>(cls);

    __jsb_cocos2d_GLES2CommandBuffer_proto = cls->getProto();
    __jsb_cocos2d_GLES2CommandBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_GLES2Queue_proto = nullptr;
se::Class* __jsb_cocos2d_GLES2Queue_class = nullptr;

static bool js_gfx_GLES2Queue_Initialize(se::State& s)
{
    cocos2d::GLES2Queue* cobj = (cocos2d::GLES2Queue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Queue_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::GFXQueueInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXQueueInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Queue_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Queue_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Queue_Initialize)

static bool js_gfx_GLES2Queue_Destroy(se::State& s)
{
    cocos2d::GLES2Queue* cobj = (cocos2d::GLES2Queue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Queue_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Queue_Destroy)

static bool js_gfx_GLES2Queue_is_async(se::State& s)
{
    cocos2d::GLES2Queue* cobj = (cocos2d::GLES2Queue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Queue_is_async : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->is_async();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Queue_is_async : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Queue_is_async)

static bool js_gfx_GLES2Queue_submit(se::State& s)
{
    cocos2d::GLES2Queue* cobj = (cocos2d::GLES2Queue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Queue_submit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::GFXCommandBuffer** arg0 = nullptr;
        unsigned int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GLES2Queue_submit : Error processing arguments");
        cobj->submit(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GLES2Queue_submit)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GLES2Queue_finalize)

static bool js_gfx_GLES2Queue_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GLES2Queue_constructor : Error processing arguments");
    cocos2d::GLES2Queue* cobj = new (std::nothrow) cocos2d::GLES2Queue(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GLES2Queue_constructor, __jsb_cocos2d_GLES2Queue_class, js_cocos2d_GLES2Queue_finalize)



extern se::Object* __jsb_cocos2d_GFXQueue_proto;

static bool js_cocos2d_GLES2Queue_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GLES2Queue)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GLES2Queue* cobj = (cocos2d::GLES2Queue*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GLES2Queue_finalize)

bool js_register_gfx_GLES2Queue(se::Object* obj)
{
    auto cls = se::Class::create("GLES2Queue", obj, __jsb_cocos2d_GFXQueue_proto, _SE(js_gfx_GLES2Queue_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GLES2Queue_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GLES2Queue_Destroy));
    cls->defineFunction("is_async", _SE(js_gfx_GLES2Queue_is_async));
    cls->defineFunction("submit", _SE(js_gfx_GLES2Queue_submit));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GLES2Queue_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GLES2Queue>(cls);

    __jsb_cocos2d_GLES2Queue_proto = cls->getProto();
    __jsb_cocos2d_GLES2Queue_class = cls;

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

    js_register_gfx_GLES2CmdCopyBufferToTexture(ns);
    js_register_gfx_GLES2GPUPipelineLayout(ns);
    js_register_gfx_GLES2CmdDraw(ns);
    js_register_gfx_GLES2GPUSampler(ns);
    js_register_gfx_GLES2TextureView(ns);
    js_register_gfx_GLES2PipelineLayout(ns);
    js_register_gfx_GLES2Window(ns);
    js_register_gfx_GLES2Framebuffer(ns);
    js_register_gfx_GLES2Sampler(ns);
    js_register_gfx_GLES2Texture(ns);
    js_register_gfx_GLES2InputAssembler(ns);
    js_register_gfx_GLES2GPUBuffer(ns);
    js_register_gfx_GLES2RenderPass(ns);
    js_register_gfx_GLES2CmdUpdateBuffer(ns);
    js_register_gfx_GLES2GPUFramebuffer(ns);
    js_register_gfx_GLES2GPUInputAssembler(ns);
    js_register_gfx_GLES2Queue(ns);
    js_register_gfx_GLES2GPUBindingLayout(ns);
    js_register_gfx_GLES2GPUShader(ns);
    js_register_gfx_GLES2CmdPackage(ns);
    js_register_gfx_GLES2CmdBindStates(ns);
    js_register_gfx_GLES2CommandAllocator(ns);
    js_register_gfx_GLES2GPUPipelineState(ns);
    js_register_gfx_GLES2Shader(ns);
    js_register_gfx_GLES2GPUTextureView(ns);
    js_register_gfx_GLES2CmdBeginRenderPass(ns);
    js_register_gfx_GLES2Device(ns);
    js_register_gfx_GLES2Context(ns);
    js_register_gfx_GLES2GPURenderPass(ns);
    js_register_gfx_GLES2PipelineState(ns);
    js_register_gfx_GLES2GPUTexture(ns);
    js_register_gfx_GLES2BindingLayout(ns);
    js_register_gfx_GLES2Buffer(ns);
    js_register_gfx_GLES2CommandBuffer(ns);
    return true;
}

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
