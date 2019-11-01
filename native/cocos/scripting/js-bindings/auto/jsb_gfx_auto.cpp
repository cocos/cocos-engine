#include "scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/core/Core.h"

se::Object* __jsb_cc_GFXDevice_proto = nullptr;
se::Class* __jsb_cc_GFXDevice_class = nullptr;

static bool js_gfx_GFXDevice_height(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_height : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->height();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_height : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_height)

static bool js_gfx_GFXDevice_CreateGFXTextureView(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXTextureViewInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureViewInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXTextureView : Error processing arguments");
        cc::GFXTextureView* result = cobj->CreateGFXTextureView(arg0);
        ok &= native_ptr_to_seval<cc::GFXTextureView>((cc::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXTextureView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXTextureView)

static bool js_gfx_GFXDevice_CreateGFXCommandAllocator(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXCommandAllocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXCommandAllocatorInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandAllocatorInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXCommandAllocator : Error processing arguments");
        cc::GFXCommandAllocator* result = cobj->CreateGFXCommandAllocator(arg0);
        ok &= native_ptr_to_seval<cc::GFXCommandAllocator>((cc::GFXCommandAllocator*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXCommandAllocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXCommandAllocator)

static bool js_gfx_GFXDevice_api(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_api : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->api();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_api : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_api)

static bool js_gfx_GFXDevice_CreateGFXBuffer(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXBuffer : Error processing arguments");
        cc::GFXBuffer* result = cobj->CreateGFXBuffer(arg0);
        ok &= native_ptr_to_seval<cc::GFXBuffer>((cc::GFXBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXBuffer)

static bool js_gfx_GFXDevice_Destroy(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_Destroy)

static bool js_gfx_GFXDevice_CreateGFXWindow(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXWindowInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXWindowInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXWindow : Error processing arguments");
        cc::GFXWindow* result = cobj->CreateGFXWindow(arg0);
        ok &= native_ptr_to_seval<cc::GFXWindow>((cc::GFXWindow*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXWindow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXWindow)

static bool js_gfx_GFXDevice_CreateGFXShader(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXShaderInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXShaderInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXShader : Error processing arguments");
        cc::GFXShader* result = cobj->CreateGFXShader(arg0);
        ok &= native_ptr_to_seval<cc::GFXShader>((cc::GFXShader*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXShader)

static bool js_gfx_GFXDevice_CreateGFXTexture(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXTextureInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXTextureInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXTexture : Error processing arguments");
        cc::GFXTexture* result = cobj->CreateGFXTexture(arg0);
        ok &= native_ptr_to_seval<cc::GFXTexture>((cc::GFXTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXTexture)

static bool js_gfx_GFXDevice_width(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_width : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->width();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_width : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_width)

static bool js_gfx_GFXDevice_window(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_window : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXWindow* result = cobj->window();
        ok &= native_ptr_to_seval<cc::GFXWindow>((cc::GFXWindow*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_window : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_window)

static bool js_gfx_GFXDevice_CreateGFXCommandBuffer(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXCommandBufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandBufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXCommandBuffer : Error processing arguments");
        cc::GFXCommandBuffer* result = cobj->CreateGFXCommandBuffer(arg0);
        ok &= native_ptr_to_seval<cc::GFXCommandBuffer>((cc::GFXCommandBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXCommandBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXCommandBuffer)

static bool js_gfx_GFXDevice_Initialize(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXDeviceInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXDeviceInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_Initialize)

static bool js_gfx_GFXDevice_Resize(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_Resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_Resize : Error processing arguments");
        cobj->Resize(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_Resize)

static bool js_gfx_GFXDevice_cmd_allocator(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_cmd_allocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXCommandAllocator* result = cobj->cmd_allocator();
        ok &= native_ptr_to_seval<cc::GFXCommandAllocator>((cc::GFXCommandAllocator*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_cmd_allocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_cmd_allocator)

static bool js_gfx_GFXDevice_CreateGFXSampler(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXSamplerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXSamplerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXSampler : Error processing arguments");
        cc::GFXSampler* result = cobj->CreateGFXSampler(arg0);
        ok &= native_ptr_to_seval<cc::GFXSampler>((cc::GFXSampler*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXSampler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXSampler)

static bool js_gfx_GFXDevice_mem_status(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_gfx_GFXDevice_mem_status : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const cc::GFXMemoryStatus& result = cobj->mem_status();
            #pragma warning NO CONVERSION FROM NATIVE FOR GFXMemoryStatus;
            SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_mem_status : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            cc::GFXMemoryStatus& result = cobj->mem_status();
            #pragma warning NO CONVERSION FROM NATIVE FOR GFXMemoryStatus;
            SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_mem_status : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_mem_status)

static bool js_gfx_GFXDevice_HasFeature(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_HasFeature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXFeature arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::GFXFeature)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_HasFeature : Error processing arguments");
        bool result = cobj->HasFeature(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_HasFeature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_HasFeature)

static bool js_gfx_GFXDevice_CreateGFXQueue(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXQueueInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXQueueInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXQueue : Error processing arguments");
        cc::GFXQueue* result = cobj->CreateGFXQueue(arg0);
        ok &= native_ptr_to_seval<cc::GFXQueue>((cc::GFXQueue*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXQueue)

static bool js_gfx_GFXDevice_CreateGFXRenderPass(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXRenderPassInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRenderPassInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXRenderPass : Error processing arguments");
        cc::GFXRenderPass* result = cobj->CreateGFXRenderPass(arg0);
        ok &= native_ptr_to_seval<cc::GFXRenderPass>((cc::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXRenderPass)

static bool js_gfx_GFXDevice_queue(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_queue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXQueue* result = cobj->queue();
        ok &= native_ptr_to_seval<cc::GFXQueue>((cc::GFXQueue*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_queue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_queue)

static bool js_gfx_GFXDevice_CreateGFXBindingLayout(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXBindingLayoutInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXBindingLayoutInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXBindingLayout : Error processing arguments");
        cc::GFXBindingLayout* result = cobj->CreateGFXBindingLayout(arg0);
        ok &= native_ptr_to_seval<cc::GFXBindingLayout>((cc::GFXBindingLayout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXBindingLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXBindingLayout)

static bool js_gfx_GFXDevice_Present(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_Present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_Present)

static bool js_gfx_GFXDevice_context(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_context : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXContext* result = cobj->context();
        ok &= native_ptr_to_seval<cc::GFXContext>((cc::GFXContext*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_context : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_context)

static bool js_gfx_GFXDevice_CreateGFXInputAssembler(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXInputAssemblerInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXInputAssemblerInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXInputAssembler : Error processing arguments");
        cc::GFXInputAssembler* result = cobj->CreateGFXInputAssembler(arg0);
        ok &= native_ptr_to_seval<cc::GFXInputAssembler>((cc::GFXInputAssembler*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXInputAssembler : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXInputAssembler)

static bool js_gfx_GFXDevice_CreateGFXFramebuffer(se::State& s)
{
    cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXDevice_CreateGFXFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXFramebufferInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXFramebufferInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXFramebuffer : Error processing arguments");
        cc::GFXFramebuffer* result = cobj->CreateGFXFramebuffer(arg0);
        ok &= native_ptr_to_seval<cc::GFXFramebuffer>((cc::GFXFramebuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_CreateGFXFramebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXDevice_CreateGFXFramebuffer)

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXDevice_finalize)

static bool js_gfx_GFXDevice_constructor(se::State& s)
{
    cc::GFXDevice* cobj = new (std::nothrow) cc::GFXDevice();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXDevice_constructor, __jsb_cc_GFXDevice_class, js_cc_GFXDevice_finalize)




static bool js_cc_GFXDevice_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXDevice)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXDevice* cobj = (cc::GFXDevice*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXDevice_finalize)

bool js_register_gfx_GFXDevice(se::Object* obj)
{
    auto cls = se::Class::create("GFXDevice", obj, nullptr, _SE(js_gfx_GFXDevice_constructor));

    cls->defineFunction("height", _SE(js_gfx_GFXDevice_height));
    cls->defineFunction("CreateGFXTextureView", _SE(js_gfx_GFXDevice_CreateGFXTextureView));
    cls->defineFunction("CreateGFXCommandAllocator", _SE(js_gfx_GFXDevice_CreateGFXCommandAllocator));
    cls->defineFunction("api", _SE(js_gfx_GFXDevice_api));
    cls->defineFunction("CreateGFXBuffer", _SE(js_gfx_GFXDevice_CreateGFXBuffer));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXDevice_Destroy));
    cls->defineFunction("CreateGFXWindow", _SE(js_gfx_GFXDevice_CreateGFXWindow));
    cls->defineFunction("CreateGFXShader", _SE(js_gfx_GFXDevice_CreateGFXShader));
    cls->defineFunction("CreateGFXTexture", _SE(js_gfx_GFXDevice_CreateGFXTexture));
    cls->defineFunction("width", _SE(js_gfx_GFXDevice_width));
    cls->defineFunction("window", _SE(js_gfx_GFXDevice_window));
    cls->defineFunction("CreateGFXCommandBuffer", _SE(js_gfx_GFXDevice_CreateGFXCommandBuffer));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXDevice_Initialize));
    cls->defineFunction("Resize", _SE(js_gfx_GFXDevice_Resize));
    cls->defineFunction("cmd_allocator", _SE(js_gfx_GFXDevice_cmd_allocator));
    cls->defineFunction("CreateGFXSampler", _SE(js_gfx_GFXDevice_CreateGFXSampler));
    cls->defineFunction("mem_status", _SE(js_gfx_GFXDevice_mem_status));
    cls->defineFunction("HasFeature", _SE(js_gfx_GFXDevice_HasFeature));
    cls->defineFunction("CreateGFXQueue", _SE(js_gfx_GFXDevice_CreateGFXQueue));
    cls->defineFunction("CreateGFXRenderPass", _SE(js_gfx_GFXDevice_CreateGFXRenderPass));
    cls->defineFunction("queue", _SE(js_gfx_GFXDevice_queue));
    cls->defineFunction("CreateGFXBindingLayout", _SE(js_gfx_GFXDevice_CreateGFXBindingLayout));
    cls->defineFunction("Present", _SE(js_gfx_GFXDevice_Present));
    cls->defineFunction("context", _SE(js_gfx_GFXDevice_context));
    cls->defineFunction("CreateGFXInputAssembler", _SE(js_gfx_GFXDevice_CreateGFXInputAssembler));
    cls->defineFunction("CreateGFXFramebuffer", _SE(js_gfx_GFXDevice_CreateGFXFramebuffer));
    cls->defineFinalizeFunction(_SE(js_cc_GFXDevice_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXDevice>(cls);

    __jsb_cc_GFXDevice_proto = cls->getProto();
    __jsb_cc_GFXDevice_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXContext_proto = nullptr;
se::Class* __jsb_cc_GFXContext_class = nullptr;

static bool js_gfx_GFXContext_shared_ctx(se::State& s)
{
    cc::GFXContext* cobj = (cc::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_shared_ctx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXContext* result = cobj->shared_ctx();
        ok &= native_ptr_to_seval<cc::GFXContext>((cc::GFXContext*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_shared_ctx : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_shared_ctx)

static bool js_gfx_GFXContext_color_fmt(se::State& s)
{
    cc::GFXContext* cobj = (cc::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_color_fmt : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->color_fmt();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_color_fmt : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_color_fmt)

static bool js_gfx_GFXContext_vsync_mode(se::State& s)
{
    cc::GFXContext* cobj = (cc::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_vsync_mode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->vsync_mode();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_vsync_mode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_vsync_mode)

static bool js_gfx_GFXContext_device(se::State& s)
{
    cc::GFXContext* cobj = (cc::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_device)

static bool js_gfx_GFXContext_Initialize(se::State& s)
{
    cc::GFXContext* cobj = (cc::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXContextInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXContextInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_Initialize)

static bool js_gfx_GFXContext_Destroy(se::State& s)
{
    cc::GFXContext* cobj = (cc::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_Destroy)

static bool js_gfx_GFXContext_Present(se::State& s)
{
    cc::GFXContext* cobj = (cc::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_Present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_Present)

static bool js_gfx_GFXContext_depth_stencil_fmt(se::State& s)
{
    cc::GFXContext* cobj = (cc::GFXContext*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXContext_depth_stencil_fmt : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->depth_stencil_fmt();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_depth_stencil_fmt : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXContext_depth_stencil_fmt)

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXContext_finalize)

static bool js_gfx_GFXContext_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXContext_constructor : Error processing arguments");
    cc::GFXContext* cobj = new (std::nothrow) cc::GFXContext(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXContext_constructor, __jsb_cc_GFXContext_class, js_cc_GFXContext_finalize)




static bool js_cc_GFXContext_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXContext)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXContext* cobj = (cc::GFXContext*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXContext_finalize)

bool js_register_gfx_GFXContext(se::Object* obj)
{
    auto cls = se::Class::create("GFXContext", obj, nullptr, _SE(js_gfx_GFXContext_constructor));

    cls->defineFunction("shared_ctx", _SE(js_gfx_GFXContext_shared_ctx));
    cls->defineFunction("color_fmt", _SE(js_gfx_GFXContext_color_fmt));
    cls->defineFunction("vsync_mode", _SE(js_gfx_GFXContext_vsync_mode));
    cls->defineFunction("device", _SE(js_gfx_GFXContext_device));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXContext_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXContext_Destroy));
    cls->defineFunction("Present", _SE(js_gfx_GFXContext_Present));
    cls->defineFunction("depth_stencil_fmt", _SE(js_gfx_GFXContext_depth_stencil_fmt));
    cls->defineFinalizeFunction(_SE(js_cc_GFXContext_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXContext>(cls);

    __jsb_cc_GFXContext_proto = cls->getProto();
    __jsb_cc_GFXContext_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXWindow_proto = nullptr;
se::Class* __jsb_cc_GFXWindow_class = nullptr;

static bool js_gfx_GFXWindow_depth_stencil_tex_view(se::State& s)
{
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_depth_stencil_tex_view : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXTextureView* result = cobj->depth_stencil_tex_view();
        ok &= native_ptr_to_seval<cc::GFXTextureView>((cc::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_depth_stencil_tex_view : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_depth_stencil_tex_view)

static bool js_gfx_GFXWindow_render_pass(se::State& s)
{
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_render_pass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXRenderPass* result = cobj->render_pass();
        ok &= native_ptr_to_seval<cc::GFXRenderPass>((cc::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_render_pass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_render_pass)

static bool js_gfx_GFXWindow_native_width(se::State& s)
{
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_title : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->title();
        #pragma warning NO CONVERSION FROM NATIVE FOR basic_string;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_title : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_title)

static bool js_gfx_GFXWindow_color_fmt(se::State& s)
{
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_depth_stencil_texture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXTexture* result = cobj->depth_stencil_texture();
        ok &= native_ptr_to_seval<cc::GFXTexture>((cc::GFXTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_depth_stencil_texture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_depth_stencil_texture)

static bool js_gfx_GFXWindow_color_texture(se::State& s)
{
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_color_texture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXTexture* result = cobj->color_texture();
        ok &= native_ptr_to_seval<cc::GFXTexture>((cc::GFXTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_color_texture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_color_texture)

static bool js_gfx_GFXWindow_is_offscreen(se::State& s)
{
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_device)

static bool js_gfx_GFXWindow_Initialize(se::State& s)
{
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXWindowInfo arg0;
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_framebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXFramebuffer* result = cobj->framebuffer();
        ok &= native_ptr_to_seval<cc::GFXFramebuffer>((cc::GFXFramebuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_framebuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_framebuffer)

static bool js_gfx_GFXWindow_depth_stencil_fmt(se::State& s)
{
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXWindow_color_tex_view : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXTextureView* result = cobj->color_tex_view();
        ok &= native_ptr_to_seval<cc::GFXTextureView>((cc::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_color_tex_view : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXWindow_color_tex_view)

static bool js_gfx_GFXWindow_width(se::State& s)
{
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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
    cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXWindow_finalize)

static bool js_gfx_GFXWindow_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXWindow_constructor : Error processing arguments");
    cc::GFXWindow* cobj = new (std::nothrow) cc::GFXWindow(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXWindow_constructor, __jsb_cc_GFXWindow_class, js_cc_GFXWindow_finalize)




static bool js_cc_GFXWindow_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXWindow)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXWindow* cobj = (cc::GFXWindow*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXWindow_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXWindow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXWindow>(cls);

    __jsb_cc_GFXWindow_proto = cls->getProto();
    __jsb_cc_GFXWindow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXBuffer_proto = nullptr;
se::Class* __jsb_cc_GFXBuffer_class = nullptr;

static bool js_gfx_GFXBuffer_count(se::State& s)
{
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_device)

static bool js_gfx_GFXBuffer_flags(se::State& s)
{
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXBufferInfo arg0;
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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
    cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXBuffer_finalize)

static bool js_gfx_GFXBuffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_constructor : Error processing arguments");
    cc::GFXBuffer* cobj = new (std::nothrow) cc::GFXBuffer(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXBuffer_constructor, __jsb_cc_GFXBuffer_class, js_cc_GFXBuffer_finalize)




static bool js_cc_GFXBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXBuffer* cobj = (cc::GFXBuffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXBuffer_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXBuffer>(cls);

    __jsb_cc_GFXBuffer_proto = cls->getProto();
    __jsb_cc_GFXBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXTexture_proto = nullptr;
se::Class* __jsb_cc_GFXTexture_class = nullptr;

static bool js_gfx_GFXTexture_array_layer(se::State& s)
{
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTexture_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXTextureInfo arg0;
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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
    cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXTexture_finalize)

static bool js_gfx_GFXTexture_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTexture_constructor : Error processing arguments");
    cc::GFXTexture* cobj = new (std::nothrow) cc::GFXTexture(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXTexture_constructor, __jsb_cc_GFXTexture_class, js_cc_GFXTexture_finalize)




static bool js_cc_GFXTexture_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXTexture)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXTexture* cobj = (cc::GFXTexture*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXTexture_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXTexture>(cls);

    __jsb_cc_GFXTexture_proto = cls->getProto();
    __jsb_cc_GFXTexture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXTextureView_proto = nullptr;
se::Class* __jsb_cc_GFXTextureView_class = nullptr;

static bool js_gfx_GFXTextureView_level_count(se::State& s)
{
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
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
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
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
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_texture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXTexture* result = cobj->texture();
        ok &= native_ptr_to_seval<cc::GFXTexture>((cc::GFXTexture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_texture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_texture)

static bool js_gfx_GFXTextureView_device(se::State& s)
{
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXTextureView_device)

static bool js_gfx_GFXTextureView_layer_count(se::State& s)
{
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
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
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
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
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXTextureView_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXTextureViewInfo arg0;
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
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
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
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
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
    cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXTextureView_finalize)

static bool js_gfx_GFXTextureView_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXTextureView_constructor : Error processing arguments");
    cc::GFXTextureView* cobj = new (std::nothrow) cc::GFXTextureView(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXTextureView_constructor, __jsb_cc_GFXTextureView_class, js_cc_GFXTextureView_finalize)




static bool js_cc_GFXTextureView_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXTextureView)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXTextureView* cobj = (cc::GFXTextureView*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXTextureView_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXTextureView_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXTextureView>(cls);

    __jsb_cc_GFXTextureView_proto = cls->getProto();
    __jsb_cc_GFXTextureView_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXSampler_proto = nullptr;
se::Class* __jsb_cc_GFXSampler_class = nullptr;

static bool js_gfx_GFXSampler_cmp_func(se::State& s)
{
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_name : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->name();
        #pragma warning NO CONVERSION FROM NATIVE FOR basic_string;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_name : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_name)

static bool js_gfx_GFXSampler_address_u(se::State& s)
{
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_border_color : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::GFXColor& result = cobj->border_color();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXSampler_device)

static bool js_gfx_GFXSampler_address_v(se::State& s)
{
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSampler_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXSamplerInfo arg0;
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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
    cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXSampler_finalize)

static bool js_gfx_GFXSampler_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSampler_constructor : Error processing arguments");
    cc::GFXSampler* cobj = new (std::nothrow) cc::GFXSampler(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXSampler_constructor, __jsb_cc_GFXSampler_class, js_cc_GFXSampler_finalize)




static bool js_cc_GFXSampler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXSampler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXSampler* cobj = (cc::GFXSampler*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXSampler_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXSampler>(cls);

    __jsb_cc_GFXSampler_proto = cls->getProto();
    __jsb_cc_GFXSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXShader_proto = nullptr;
se::Class* __jsb_cc_GFXShader_class = nullptr;

static bool js_gfx_GFXShader_hash(se::State& s)
{
    cc::GFXShader* cobj = (cc::GFXShader*)s.nativeThisObject();
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
    cc::GFXShader* cobj = (cc::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_name : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->name();
        #pragma warning NO CONVERSION FROM NATIVE FOR basic_string;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_name : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_name)

static bool js_gfx_GFXShader_samplers(se::State& s)
{
    cc::GFXShader* cobj = (cc::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_samplers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXUniformSampler>& result = cobj->samplers();
        ok &= native_ptr_to_seval<cc::GFXUniformSamplerList&>((cc::GFXUniformSamplerList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_samplers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_samplers)

static bool js_gfx_GFXShader_blocks(se::State& s)
{
    cc::GFXShader* cobj = (cc::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_blocks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXUniformBlock>& result = cobj->blocks();
        ok &= native_ptr_to_seval<cc::GFXUniformBlockList&>((cc::GFXUniformBlockList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_blocks : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_blocks)

static bool js_gfx_GFXShader_device(se::State& s)
{
    cc::GFXShader* cobj = (cc::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_device)

static bool js_gfx_GFXShader_Initialize(se::State& s)
{
    cc::GFXShader* cobj = (cc::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXShaderInfo arg0;
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
    cc::GFXShader* cobj = (cc::GFXShader*)s.nativeThisObject();
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
    cc::GFXShader* cobj = (cc::GFXShader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXShader_stages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXShaderStage>& result = cobj->stages();
        ok &= native_ptr_to_seval<cc::GFXShaderStageList&>((cc::GFXShaderStageList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_stages : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXShader_stages)

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXShader_finalize)

static bool js_gfx_GFXShader_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXShader_constructor : Error processing arguments");
    cc::GFXShader* cobj = new (std::nothrow) cc::GFXShader(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXShader_constructor, __jsb_cc_GFXShader_class, js_cc_GFXShader_finalize)




static bool js_cc_GFXShader_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXShader)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXShader* cobj = (cc::GFXShader*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXShader_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXShader_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXShader>(cls);

    __jsb_cc_GFXShader_proto = cls->getProto();
    __jsb_cc_GFXShader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXInputAssembler_proto = nullptr;
se::Class* __jsb_cc_GFXInputAssembler_class = nullptr;

static bool js_gfx_GFXInputAssembler_set_first_vertex(se::State& s)
{
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_vertex_buffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXBuffer *>& result = cobj->vertex_buffers();
        ok &= native_ptr_to_seval<cc::GFXBufferList&>((cc::GFXBufferList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_vertex_buffers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_vertex_buffers)

static bool js_gfx_GFXInputAssembler_set_vertex_count(se::State& s)
{
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXInputAssemblerInfo arg0;
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_attributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXAttribute>& result = cobj->attributes();
        ok &= native_ptr_to_seval<cc::GFXAttributeList&>((cc::GFXAttributeList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_attributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_attributes)

static bool js_gfx_GFXInputAssembler_device(se::State& s)
{
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_device)

static bool js_gfx_GFXInputAssembler_set_first_index(se::State& s)
{
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
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
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_indirect_buffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXBuffer* result = cobj->indirect_buffer();
        ok &= native_ptr_to_seval<cc::GFXBuffer>((cc::GFXBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_indirect_buffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_indirect_buffer)

static bool js_gfx_GFXInputAssembler_index_buffer(se::State& s)
{
    cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_index_buffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXBuffer* result = cobj->index_buffer();
        ok &= native_ptr_to_seval<cc::GFXBuffer>((cc::GFXBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_index_buffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_index_buffer)

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXInputAssembler_finalize)

static bool js_gfx_GFXInputAssembler_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXInputAssembler_constructor : Error processing arguments");
    cc::GFXInputAssembler* cobj = new (std::nothrow) cc::GFXInputAssembler(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXInputAssembler_constructor, __jsb_cc_GFXInputAssembler_class, js_cc_GFXInputAssembler_finalize)




static bool js_cc_GFXInputAssembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXInputAssembler)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXInputAssembler* cobj = (cc::GFXInputAssembler*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXInputAssembler_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXInputAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXInputAssembler>(cls);

    __jsb_cc_GFXInputAssembler_proto = cls->getProto();
    __jsb_cc_GFXInputAssembler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXRenderPass_proto = nullptr;
se::Class* __jsb_cc_GFXRenderPass_class = nullptr;

static bool js_gfx_GFXRenderPass_depth_stencil_attachment(se::State& s)
{
    cc::GFXRenderPass* cobj = (cc::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_depth_stencil_attachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::GFXDepthStencilAttachment& result = cobj->depth_stencil_attachment();
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
    cc::GFXRenderPass* cobj = (cc::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_device)

static bool js_gfx_GFXRenderPass_sub_passes(se::State& s)
{
    cc::GFXRenderPass* cobj = (cc::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_sub_passes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXSubPass>& result = cobj->sub_passes();
        ok &= native_ptr_to_seval<cc::GFXSubPassList&>((cc::GFXSubPassList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_sub_passes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_sub_passes)

static bool js_gfx_GFXRenderPass_color_attachments(se::State& s)
{
    cc::GFXRenderPass* cobj = (cc::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_color_attachments : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXColorAttachment>& result = cobj->color_attachments();
        ok &= native_ptr_to_seval<cc::GFXColorAttachmentList&>((cc::GFXColorAttachmentList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_color_attachments : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXRenderPass_color_attachments)

static bool js_gfx_GFXRenderPass_Initialize(se::State& s)
{
    cc::GFXRenderPass* cobj = (cc::GFXRenderPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXRenderPass_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXRenderPassInfo arg0;
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
    cc::GFXRenderPass* cobj = (cc::GFXRenderPass*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXRenderPass_finalize)

static bool js_gfx_GFXRenderPass_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXRenderPass_constructor : Error processing arguments");
    cc::GFXRenderPass* cobj = new (std::nothrow) cc::GFXRenderPass(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXRenderPass_constructor, __jsb_cc_GFXRenderPass_class, js_cc_GFXRenderPass_finalize)




static bool js_cc_GFXRenderPass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXRenderPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXRenderPass* cobj = (cc::GFXRenderPass*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXRenderPass_finalize)

bool js_register_gfx_GFXRenderPass(se::Object* obj)
{
    auto cls = se::Class::create("GFXRenderPass", obj, nullptr, _SE(js_gfx_GFXRenderPass_constructor));

    cls->defineFunction("depth_stencil_attachment", _SE(js_gfx_GFXRenderPass_depth_stencil_attachment));
    cls->defineFunction("device", _SE(js_gfx_GFXRenderPass_device));
    cls->defineFunction("sub_passes", _SE(js_gfx_GFXRenderPass_sub_passes));
    cls->defineFunction("color_attachments", _SE(js_gfx_GFXRenderPass_color_attachments));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXRenderPass_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXRenderPass_Destroy));
    cls->defineFinalizeFunction(_SE(js_cc_GFXRenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXRenderPass>(cls);

    __jsb_cc_GFXRenderPass_proto = cls->getProto();
    __jsb_cc_GFXRenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXFramebuffer_proto = nullptr;
se::Class* __jsb_cc_GFXFramebuffer_class = nullptr;

static bool js_gfx_GFXFramebuffer_color_views(se::State& s)
{
    cc::GFXFramebuffer* cobj = (cc::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_color_views : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXTextureView *>& result = cobj->color_views();
        ok &= native_ptr_to_seval<cc::GFXTextureViewList&>((cc::GFXTextureViewList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_color_views : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_color_views)

static bool js_gfx_GFXFramebuffer_is_offscreen(se::State& s)
{
    cc::GFXFramebuffer* cobj = (cc::GFXFramebuffer*)s.nativeThisObject();
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
    cc::GFXFramebuffer* cobj = (cc::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_device)

static bool js_gfx_GFXFramebuffer_depth_stencil_view(se::State& s)
{
    cc::GFXFramebuffer* cobj = (cc::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_depth_stencil_view : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXTextureView* result = cobj->depth_stencil_view();
        ok &= native_ptr_to_seval<cc::GFXTextureView>((cc::GFXTextureView*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_depth_stencil_view : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_depth_stencil_view)

static bool js_gfx_GFXFramebuffer_Initialize(se::State& s)
{
    cc::GFXFramebuffer* cobj = (cc::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXFramebufferInfo arg0;
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
    cc::GFXFramebuffer* cobj = (cc::GFXFramebuffer*)s.nativeThisObject();
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
    cc::GFXFramebuffer* cobj = (cc::GFXFramebuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXFramebuffer_render_pass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXRenderPass* result = cobj->render_pass();
        ok &= native_ptr_to_seval<cc::GFXRenderPass>((cc::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_render_pass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXFramebuffer_render_pass)

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXFramebuffer_finalize)

static bool js_gfx_GFXFramebuffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXFramebuffer_constructor : Error processing arguments");
    cc::GFXFramebuffer* cobj = new (std::nothrow) cc::GFXFramebuffer(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXFramebuffer_constructor, __jsb_cc_GFXFramebuffer_class, js_cc_GFXFramebuffer_finalize)




static bool js_cc_GFXFramebuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXFramebuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXFramebuffer* cobj = (cc::GFXFramebuffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXFramebuffer_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXFramebuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXFramebuffer>(cls);

    __jsb_cc_GFXFramebuffer_proto = cls->getProto();
    __jsb_cc_GFXFramebuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXBindingLayout_proto = nullptr;
se::Class* __jsb_cc_GFXBindingLayout_class = nullptr;

static bool js_gfx_GFXBindingLayout_BindTextureView(se::State& s)
{
    cc::GFXBindingLayout* cobj = (cc::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_BindTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cc::GFXTextureView* arg1 = nullptr;
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
    cc::GFXBindingLayout* cobj = (cc::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_BindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cc::GFXBuffer* arg1 = nullptr;
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
    cc::GFXBindingLayout* cobj = (cc::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_BindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        unsigned int arg0 = 0;
        cc::GFXSampler* arg1 = nullptr;
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
    cc::GFXBindingLayout* cobj = (cc::GFXBindingLayout*)s.nativeThisObject();
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
    cc::GFXBindingLayout* cobj = (cc::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_device)

static bool js_gfx_GFXBindingLayout_binding_units(se::State& s)
{
    cc::GFXBindingLayout* cobj = (cc::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_binding_units : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXBindingUnit>& result = cobj->binding_units();
        ok &= native_ptr_to_seval<cc::GFXBindingUnitList&>((cc::GFXBindingUnitList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_binding_units : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBindingLayout_binding_units)

static bool js_gfx_GFXBindingLayout_Initialize(se::State& s)
{
    cc::GFXBindingLayout* cobj = (cc::GFXBindingLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBindingLayout_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXBindingLayoutInfo arg0;
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
    cc::GFXBindingLayout* cobj = (cc::GFXBindingLayout*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXBindingLayout_finalize)

static bool js_gfx_GFXBindingLayout_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBindingLayout_constructor : Error processing arguments");
    cc::GFXBindingLayout* cobj = new (std::nothrow) cc::GFXBindingLayout(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXBindingLayout_constructor, __jsb_cc_GFXBindingLayout_class, js_cc_GFXBindingLayout_finalize)




static bool js_cc_GFXBindingLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXBindingLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXBindingLayout* cobj = (cc::GFXBindingLayout*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXBindingLayout_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXBindingLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXBindingLayout>(cls);

    __jsb_cc_GFXBindingLayout_proto = cls->getProto();
    __jsb_cc_GFXBindingLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXPipelineLayout_proto = nullptr;
se::Class* __jsb_cc_GFXPipelineLayout_class = nullptr;

static bool js_gfx_GFXPipelineLayout_push_constant_ranges(se::State& s)
{
    cc::GFXPipelineLayout* cobj = (cc::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_push_constant_ranges : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXPushConstantRange>& result = cobj->push_constant_ranges();
        ok &= native_ptr_to_seval<cc::GFXPushConstantRangeList&>((cc::GFXPushConstantRangeList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_push_constant_ranges : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_push_constant_ranges)

static bool js_gfx_GFXPipelineLayout_device(se::State& s)
{
    cc::GFXPipelineLayout* cobj = (cc::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_device)

static bool js_gfx_GFXPipelineLayout_layouts(se::State& s)
{
    cc::GFXPipelineLayout* cobj = (cc::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_layouts : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXBindingLayout *>& result = cobj->layouts();
        ok &= native_ptr_to_seval<cc::GFXBindingLayoutList&>((cc::GFXBindingLayoutList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_layouts : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineLayout_layouts)

static bool js_gfx_GFXPipelineLayout_Initialize(se::State& s)
{
    cc::GFXPipelineLayout* cobj = (cc::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXPipelineLayoutInfo arg0;
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
    cc::GFXPipelineLayout* cobj = (cc::GFXPipelineLayout*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXPipelineLayout_finalize)

static bool js_gfx_GFXPipelineLayout_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineLayout_constructor : Error processing arguments");
    cc::GFXPipelineLayout* cobj = new (std::nothrow) cc::GFXPipelineLayout(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXPipelineLayout_constructor, __jsb_cc_GFXPipelineLayout_class, js_cc_GFXPipelineLayout_finalize)




static bool js_cc_GFXPipelineLayout_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXPipelineLayout)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXPipelineLayout* cobj = (cc::GFXPipelineLayout*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXPipelineLayout_finalize)

bool js_register_gfx_GFXPipelineLayout(se::Object* obj)
{
    auto cls = se::Class::create("GFXPipelineLayout", obj, nullptr, _SE(js_gfx_GFXPipelineLayout_constructor));

    cls->defineFunction("push_constant_ranges", _SE(js_gfx_GFXPipelineLayout_push_constant_ranges));
    cls->defineFunction("device", _SE(js_gfx_GFXPipelineLayout_device));
    cls->defineFunction("layouts", _SE(js_gfx_GFXPipelineLayout_layouts));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXPipelineLayout_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXPipelineLayout_Destroy));
    cls->defineFinalizeFunction(_SE(js_cc_GFXPipelineLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXPipelineLayout>(cls);

    __jsb_cc_GFXPipelineLayout_proto = cls->getProto();
    __jsb_cc_GFXPipelineLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXPipelineState_proto = nullptr;
se::Class* __jsb_cc_GFXPipelineState_class = nullptr;

static bool js_gfx_GFXPipelineState_primitive(se::State& s)
{
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
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
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_layout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::GFXPipelineLayout* result = cobj->layout();
        ok &= native_ptr_to_seval<cc::GFXPipelineLayout>((cc::GFXPipelineLayout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_layout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_layout)

static bool js_gfx_GFXPipelineState_rs(se::State& s)
{
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_rs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::GFXRasterizerState& result = cobj->rs();
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
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_dynamic_states : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::GFXDynamicState>& result = cobj->dynamic_states();
        ok &= native_ptr_to_seval<cc::GFXDynamicStateList&>((cc::GFXDynamicStateList&)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_dynamic_states : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_dynamic_states)

static bool js_gfx_GFXPipelineState_is(se::State& s)
{
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_is : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::GFXInputState& result = cobj->is();
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
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_bs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::GFXBlendState& result = cobj->bs();
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
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_shader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXShader* result = cobj->shader();
        ok &= native_ptr_to_seval<cc::GFXShader>((cc::GFXShader*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_shader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_shader)

static bool js_gfx_GFXPipelineState_dss(se::State& s)
{
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_dss : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::GFXDepthStencilState& result = cobj->dss();
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
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_device)

static bool js_gfx_GFXPipelineState_Initialize(se::State& s)
{
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXPipelineStateInfo arg0;
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
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
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
    cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineState_render_pass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::GFXRenderPass* result = cobj->render_pass();
        ok &= native_ptr_to_seval<cc::GFXRenderPass>((cc::GFXRenderPass*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_render_pass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXPipelineState_render_pass)

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXPipelineState_finalize)

static bool js_gfx_GFXPipelineState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXPipelineState_constructor : Error processing arguments");
    cc::GFXPipelineState* cobj = new (std::nothrow) cc::GFXPipelineState(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXPipelineState_constructor, __jsb_cc_GFXPipelineState_class, js_cc_GFXPipelineState_finalize)




static bool js_cc_GFXPipelineState_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXPipelineState)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXPipelineState* cobj = (cc::GFXPipelineState*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXPipelineState_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXPipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXPipelineState>(cls);

    __jsb_cc_GFXPipelineState_proto = cls->getProto();
    __jsb_cc_GFXPipelineState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXCommandAllocator_proto = nullptr;
se::Class* __jsb_cc_GFXCommandAllocator_class = nullptr;

static bool js_gfx_GFXCommandAllocator_Initialize(se::State& s)
{
    cc::GFXCommandAllocator* cobj = (cc::GFXCommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandAllocator_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXCommandAllocatorInfo arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR GFXCommandAllocatorInfo
        ok = false;
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandAllocator_Initialize : Error processing arguments");
        bool result = cobj->Initialize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandAllocator_Initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandAllocator_Initialize)

static bool js_gfx_GFXCommandAllocator_Destroy(se::State& s)
{
    cc::GFXCommandAllocator* cobj = (cc::GFXCommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandAllocator_Destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandAllocator_Destroy)

static bool js_gfx_GFXCommandAllocator_device(se::State& s)
{
    cc::GFXCommandAllocator* cobj = (cc::GFXCommandAllocator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandAllocator_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandAllocator_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandAllocator_device)

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXCommandAllocator_finalize)

static bool js_gfx_GFXCommandAllocator_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandAllocator_constructor : Error processing arguments");
    cc::GFXCommandAllocator* cobj = new (std::nothrow) cc::GFXCommandAllocator(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXCommandAllocator_constructor, __jsb_cc_GFXCommandAllocator_class, js_cc_GFXCommandAllocator_finalize)




static bool js_cc_GFXCommandAllocator_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXCommandAllocator)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXCommandAllocator* cobj = (cc::GFXCommandAllocator*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXCommandAllocator_finalize)

bool js_register_gfx_GFXCommandAllocator(se::Object* obj)
{
    auto cls = se::Class::create("GFXCommandAllocator", obj, nullptr, _SE(js_gfx_GFXCommandAllocator_constructor));

    cls->defineFunction("Initialize", _SE(js_gfx_GFXCommandAllocator_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXCommandAllocator_Destroy));
    cls->defineFunction("device", _SE(js_gfx_GFXCommandAllocator_device));
    cls->defineFinalizeFunction(_SE(js_cc_GFXCommandAllocator_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXCommandAllocator>(cls);

    __jsb_cc_GFXCommandAllocator_proto = cls->getProto();
    __jsb_cc_GFXCommandAllocator_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXCommandBuffer_proto = nullptr;
se::Class* __jsb_cc_GFXCommandBuffer_class = nullptr;

static bool js_gfx_GFXCommandBuffer_End(se::State& s)
{
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_BindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXInputAssembler* arg0 = nullptr;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_BindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXPipelineState* arg0 = nullptr;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_allocator : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXCommandAllocator* result = cobj->allocator();
        ok &= native_ptr_to_seval<cc::GFXCommandAllocator>((cc::GFXCommandAllocator*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_allocator : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_allocator)

static bool js_gfx_GFXCommandBuffer_SetDepthBias(se::State& s)
{
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_BindBindingLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXBindingLayout* arg0 = nullptr;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_CopyBufferToTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        cc::GFXBuffer* arg0 = nullptr;
        cc::GFXTexture* arg1 = nullptr;
        cc::GFXTextureLayout arg2;
        cc::GFXBufferTextureCopy* arg3 = nullptr;
        unsigned int arg4 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::GFXTextureLayout)tmp; } while(false);
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_UpdateBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::GFXBuffer* arg0 = nullptr;
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
        cc::GFXBuffer* arg0 = nullptr;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_Execute : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::GFXCommandBuffer** arg0 = nullptr;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetStencilWriteMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::GFXStencilFace arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::GFXStencilFace)tmp; } while(false);
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_Draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXInputAssembler* arg0 = nullptr;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_BeginRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 7) {
        cc::GFXFramebuffer* arg0 = nullptr;
        cc::GFXRect arg1;
        cc::GFXClearFlagBit arg2;
        cc::GFXColor* arg3 = nullptr;
        unsigned int arg4 = 0;
        float arg5 = 0;
        int arg6 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        #pragma warning NO CONVERSION TO NATIVE FOR GFXRect
        ok = false;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cc::GFXClearFlagBit)tmp; } while(false);
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetStencilCompareMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::GFXStencilFace arg0;
        int arg1 = 0;
        unsigned int arg2 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cc::GFXStencilFace)tmp; } while(false);
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXCommandBufferInfo arg0;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_device)

static bool js_gfx_GFXCommandBuffer_SetViewport(se::State& s)
{
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXViewport arg0;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetBlendConstants : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXColor arg0;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_SetScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXRect arg0;
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
    cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXCommandBuffer_finalize)

static bool js_gfx_GFXCommandBuffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_constructor : Error processing arguments");
    cc::GFXCommandBuffer* cobj = new (std::nothrow) cc::GFXCommandBuffer(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXCommandBuffer_constructor, __jsb_cc_GFXCommandBuffer_class, js_cc_GFXCommandBuffer_finalize)




static bool js_cc_GFXCommandBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXCommandBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXCommandBuffer* cobj = (cc::GFXCommandBuffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXCommandBuffer_finalize)

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
    cls->defineFinalizeFunction(_SE(js_cc_GFXCommandBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXCommandBuffer>(cls);

    __jsb_cc_GFXCommandBuffer_proto = cls->getProto();
    __jsb_cc_GFXCommandBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_GFXQueue_proto = nullptr;
se::Class* __jsb_cc_GFXQueue_class = nullptr;

static bool js_gfx_GFXQueue_submit(se::State& s)
{
    cc::GFXQueue* cobj = (cc::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_submit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::GFXCommandBuffer** arg0 = nullptr;
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
    cc::GFXQueue* cobj = (cc::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_device : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::GFXDevice* result = cobj->device();
        ok &= native_ptr_to_seval<cc::GFXDevice>((cc::GFXDevice*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_device : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXQueue_device)

static bool js_gfx_GFXQueue_Initialize(se::State& s)
{
    cc::GFXQueue* cobj = (cc::GFXQueue*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXQueue_Initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cc::GFXQueueInfo arg0;
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
    cc::GFXQueue* cobj = (cc::GFXQueue*)s.nativeThisObject();
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
    cc::GFXQueue* cobj = (cc::GFXQueue*)s.nativeThisObject();
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

SE_DECLARE_FINALIZE_FUNC(js_cc_GFXQueue_finalize)

static bool js_gfx_GFXQueue_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::GFXDevice* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXQueue_constructor : Error processing arguments");
    cc::GFXQueue* cobj = new (std::nothrow) cc::GFXQueue(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXQueue_constructor, __jsb_cc_GFXQueue_class, js_cc_GFXQueue_finalize)




static bool js_cc_GFXQueue_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cc::GFXQueue)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::GFXQueue* cobj = (cc::GFXQueue*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_GFXQueue_finalize)

bool js_register_gfx_GFXQueue(se::Object* obj)
{
    auto cls = se::Class::create("GFXQueue", obj, nullptr, _SE(js_gfx_GFXQueue_constructor));

    cls->defineFunction("submit", _SE(js_gfx_GFXQueue_submit));
    cls->defineFunction("device", _SE(js_gfx_GFXQueue_device));
    cls->defineFunction("Initialize", _SE(js_gfx_GFXQueue_Initialize));
    cls->defineFunction("Destroy", _SE(js_gfx_GFXQueue_Destroy));
    cls->defineFunction("type", _SE(js_gfx_GFXQueue_type));
    cls->defineFinalizeFunction(_SE(js_cc_GFXQueue_finalize));
    cls->install();
    JSBClassType::registerClass<cc::GFXQueue>(cls);

    __jsb_cc_GFXQueue_proto = cls->getProto();
    __jsb_cc_GFXQueue_class = cls;

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
    js_register_gfx_GFXShader(ns);
    js_register_gfx_GFXContext(ns);
    js_register_gfx_GFXCommandBuffer(ns);
    js_register_gfx_GFXBindingLayout(ns);
    js_register_gfx_GFXTextureView(ns);
    js_register_gfx_GFXFramebuffer(ns);
    js_register_gfx_GFXCommandAllocator(ns);
    js_register_gfx_GFXDevice(ns);
    js_register_gfx_GFXTexture(ns);
    js_register_gfx_GFXPipelineState(ns);
    js_register_gfx_GFXQueue(ns);
    return true;
}

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
