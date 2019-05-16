#include "scripting/js-bindings/auto/jsb_renderer_auto.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/renderer/Renderer.h"
#include "renderer/scene/scene-bindings.h"

se::Object* __jsb_cocos2d_renderer_ProgramLib_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_ProgramLib_class = nullptr;

static bool js_renderer_ProgramLib_getProgram(se::State& s)
{
    cocos2d::renderer::ProgramLib* cobj = (cocos2d::renderer::ProgramLib*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ProgramLib_getProgram : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        std::string arg0;
        cocos2d::ValueMap arg1;
        int32_t arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_ccvaluemap(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_ProgramLib_getProgram : Error processing arguments");
        cocos2d::renderer::Program* result = cobj->getProgram(arg0, arg1, arg2);
        ok &= native_ptr_to_seval<cocos2d::renderer::Program>((cocos2d::renderer::Program*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_ProgramLib_getProgram : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_ProgramLib_getProgram)

static bool js_renderer_ProgramLib_define(se::State& s)
{
    cocos2d::renderer::ProgramLib* cobj = (cocos2d::renderer::ProgramLib*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ProgramLib_define : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        cocos2d::ValueVector arg3;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_ccvaluevector(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_renderer_ProgramLib_define : Error processing arguments");
        cobj->define(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_ProgramLib_define)

static bool js_renderer_ProgramLib_getKey(se::State& s)
{
    cocos2d::renderer::ProgramLib* cobj = (cocos2d::renderer::ProgramLib*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ProgramLib_getKey : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        int32_t arg1 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_ProgramLib_getKey : Error processing arguments");
        unsigned int result = cobj->getKey(arg0, arg1);
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_ProgramLib_getKey : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_ProgramLib_getKey)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_ProgramLib_finalize)

static bool js_renderer_ProgramLib_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
    std::vector<cocos2d::renderer::ProgramLib::Template> arg1;
    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_std_vector_ProgramLib_Template(args[1], &arg1);
    SE_PRECONDITION2(ok, false, "js_renderer_ProgramLib_constructor : Error processing arguments");
    cocos2d::renderer::ProgramLib* cobj = new (std::nothrow) cocos2d::renderer::ProgramLib(arg0, arg1);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_ProgramLib_constructor, __jsb_cocos2d_renderer_ProgramLib_class, js_cocos2d_renderer_ProgramLib_finalize)




static bool js_cocos2d_renderer_ProgramLib_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::ProgramLib)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::ProgramLib* cobj = (cocos2d::renderer::ProgramLib*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_ProgramLib_finalize)

bool js_register_renderer_ProgramLib(se::Object* obj)
{
    auto cls = se::Class::create("ProgramLib", obj, nullptr, _SE(js_renderer_ProgramLib_constructor));

    cls->defineFunction("getProgram", _SE(js_renderer_ProgramLib_getProgram));
    cls->defineFunction("define", _SE(js_renderer_ProgramLib_define));
    cls->defineFunction("getKey", _SE(js_renderer_ProgramLib_getKey));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_ProgramLib_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::ProgramLib>(cls);

    __jsb_cocos2d_renderer_ProgramLib_proto = cls->getProto();
    __jsb_cocos2d_renderer_ProgramLib_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_BaseRenderer_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_BaseRenderer_class = nullptr;

static bool js_renderer_BaseRenderer_getProgramLib(se::State& s)
{
    cocos2d::renderer::BaseRenderer* cobj = (cocos2d::renderer::BaseRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_BaseRenderer_getProgramLib : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::ProgramLib* result = cobj->getProgramLib();
        ok &= native_ptr_to_seval<cocos2d::renderer::ProgramLib>((cocos2d::renderer::ProgramLib*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_BaseRenderer_getProgramLib : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_BaseRenderer_getProgramLib)

static bool js_renderer_BaseRenderer_init(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::renderer::BaseRenderer* cobj = (cocos2d::renderer::BaseRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_renderer_BaseRenderer_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::vector<cocos2d::renderer::ProgramLib::Template> arg1;
            ok &= seval_to_std_vector_ProgramLib_Template(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::renderer::Texture2D* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            bool result = cobj->init(arg0, arg1, arg2);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_renderer_BaseRenderer_init : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::vector<cocos2d::renderer::ProgramLib::Template> arg1;
            ok &= seval_to_std_vector_ProgramLib_Template(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->init(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_renderer_BaseRenderer_init : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_renderer_BaseRenderer_init)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_BaseRenderer_finalize)

static bool js_renderer_BaseRenderer_constructor(se::State& s)
{
    cocos2d::renderer::BaseRenderer* cobj = new (std::nothrow) cocos2d::renderer::BaseRenderer();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_BaseRenderer_constructor, __jsb_cocos2d_renderer_BaseRenderer_class, js_cocos2d_renderer_BaseRenderer_finalize)




static bool js_cocos2d_renderer_BaseRenderer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::BaseRenderer)", s.nativeThisObject());
    cocos2d::renderer::BaseRenderer* cobj = (cocos2d::renderer::BaseRenderer*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_BaseRenderer_finalize)

bool js_register_renderer_BaseRenderer(se::Object* obj)
{
    auto cls = se::Class::create("Base", obj, nullptr, _SE(js_renderer_BaseRenderer_constructor));

    cls->defineFunction("getProgramLib", _SE(js_renderer_BaseRenderer_getProgramLib));
    cls->defineFunction("init", _SE(js_renderer_BaseRenderer_init));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_BaseRenderer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::BaseRenderer>(cls);

    __jsb_cocos2d_renderer_BaseRenderer_proto = cls->getProto();
    __jsb_cocos2d_renderer_BaseRenderer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_View_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_View_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_View_finalize)

static bool js_renderer_View_constructor(se::State& s)
{
    cocos2d::renderer::View* cobj = new (std::nothrow) cocos2d::renderer::View();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_View_constructor, __jsb_cocos2d_renderer_View_class, js_cocos2d_renderer_View_finalize)




static bool js_cocos2d_renderer_View_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::View)", s.nativeThisObject());
    cocos2d::renderer::View* cobj = (cocos2d::renderer::View*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_View_finalize)

bool js_register_renderer_View(se::Object* obj)
{
    auto cls = se::Class::create("View", obj, nullptr, _SE(js_renderer_View_constructor));

    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_View_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::View>(cls);

    __jsb_cocos2d_renderer_View_proto = cls->getProto();
    __jsb_cocos2d_renderer_View_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_NodeProxy_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_NodeProxy_class = nullptr;

static bool js_renderer_NodeProxy_addChild(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_addChild : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_addChild : Error processing arguments");
        cobj->addChild(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_addChild)

static bool js_renderer_NodeProxy_removeAllChildren(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_removeAllChildren : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeAllChildren();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_removeAllChildren)

static bool js_renderer_NodeProxy_addHandle(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_addHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        cocos2d::renderer::SystemHandle* arg1 = nullptr;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_addHandle : Error processing arguments");
        cobj->addHandle(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_addHandle)

static bool js_renderer_NodeProxy_getChildren(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_getChildren : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vector<cocos2d::renderer::NodeProxy *>& result = cobj->getChildren();
        ok &= Vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_getChildren : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_getChildren)

static bool js_renderer_NodeProxy_removeHandle(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_removeHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_removeHandle : Error processing arguments");
        cobj->removeHandle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_removeHandle)

static bool js_renderer_NodeProxy_setCullingMask(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_setCullingMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_setCullingMask : Error processing arguments");
        cobj->setCullingMask(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_setCullingMask)

static bool js_renderer_NodeProxy_setChildrenOrderDirty(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_setChildrenOrderDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setChildrenOrderDirty();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_setChildrenOrderDirty)

static bool js_renderer_NodeProxy_setParent(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_setParent : Error processing arguments");
        cobj->setParent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_setParent)

static bool js_renderer_NodeProxy_getName(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_getName)

static bool js_renderer_NodeProxy_setOpacity(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_setOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint8_t arg0;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_setOpacity : Error processing arguments");
        cobj->setOpacity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_setOpacity)

static bool js_renderer_NodeProxy_getRealOpacity(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_getRealOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const unsigned char result = cobj->getRealOpacity();
        ok &= uint8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_getRealOpacity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_getRealOpacity)

static bool js_renderer_NodeProxy_getOpacity(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_getOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint8_t result = cobj->getOpacity();
        ok &= uint8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_getOpacity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_getOpacity)

static bool js_renderer_NodeProxy_setName(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_setName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_setName : Error processing arguments");
        cobj->setName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_setName)

static bool js_renderer_NodeProxy_updateRealOpacity(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_updateRealOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateRealOpacity();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_updateRealOpacity)

static bool js_renderer_NodeProxy_getCullingMask(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_getCullingMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCullingMask();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_getCullingMask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_getCullingMask)

static bool js_renderer_NodeProxy_reset(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_reset)

static bool js_renderer_NodeProxy_getParent(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::NodeProxy* result = cobj->getParent();
        ok &= native_ptr_to_seval<cocos2d::renderer::NodeProxy>((cocos2d::renderer::NodeProxy*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_getParent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_getParent)

static bool js_renderer_NodeProxy_removeChild(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_removeChild : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_removeChild : Error processing arguments");
        cobj->removeChild(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_removeChild)

static bool js_renderer_NodeProxy_set3DNode(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_set3DNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_set3DNode : Error processing arguments");
        cobj->set3DNode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_set3DNode)

static bool js_renderer_NodeProxy_setLocalZOrder(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_setLocalZOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_setLocalZOrder : Error processing arguments");
        cobj->setLocalZOrder(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_setLocalZOrder)

static bool js_renderer_NodeProxy_getChildrenCount(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_getChildrenCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getChildrenCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_getChildrenCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_getChildrenCount)

static bool js_renderer_NodeProxy_getHandle(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_getHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_getHandle : Error processing arguments");
        cocos2d::renderer::SystemHandle* result = cobj->getHandle(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::SystemHandle>((cocos2d::renderer::SystemHandle*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_getHandle : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_getHandle)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_NodeProxy_finalize)

static bool js_renderer_NodeProxy_constructor(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = new (std::nothrow) cocos2d::renderer::NodeProxy();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_NodeProxy_constructor, __jsb_cocos2d_renderer_NodeProxy_class, js_cocos2d_renderer_NodeProxy_finalize)




static bool js_cocos2d_renderer_NodeProxy_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::NodeProxy)", s.nativeThisObject());
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_NodeProxy_finalize)

bool js_register_renderer_NodeProxy(se::Object* obj)
{
    auto cls = se::Class::create("NodeProxy", obj, nullptr, _SE(js_renderer_NodeProxy_constructor));

    cls->defineFunction("addChild", _SE(js_renderer_NodeProxy_addChild));
    cls->defineFunction("removeAllChildren", _SE(js_renderer_NodeProxy_removeAllChildren));
    cls->defineFunction("addHandle", _SE(js_renderer_NodeProxy_addHandle));
    cls->defineFunction("getChildren", _SE(js_renderer_NodeProxy_getChildren));
    cls->defineFunction("removeHandle", _SE(js_renderer_NodeProxy_removeHandle));
    cls->defineFunction("setCullingMask", _SE(js_renderer_NodeProxy_setCullingMask));
    cls->defineFunction("setChildrenOrderDirty", _SE(js_renderer_NodeProxy_setChildrenOrderDirty));
    cls->defineFunction("setParent", _SE(js_renderer_NodeProxy_setParent));
    cls->defineFunction("getName", _SE(js_renderer_NodeProxy_getName));
    cls->defineFunction("setOpacity", _SE(js_renderer_NodeProxy_setOpacity));
    cls->defineFunction("getRealOpacity", _SE(js_renderer_NodeProxy_getRealOpacity));
    cls->defineFunction("getOpacity", _SE(js_renderer_NodeProxy_getOpacity));
    cls->defineFunction("setName", _SE(js_renderer_NodeProxy_setName));
    cls->defineFunction("updateRealOpacity", _SE(js_renderer_NodeProxy_updateRealOpacity));
    cls->defineFunction("getCullingMask", _SE(js_renderer_NodeProxy_getCullingMask));
    cls->defineFunction("reset", _SE(js_renderer_NodeProxy_reset));
    cls->defineFunction("getParent", _SE(js_renderer_NodeProxy_getParent));
    cls->defineFunction("removeChild", _SE(js_renderer_NodeProxy_removeChild));
    cls->defineFunction("set3DNode", _SE(js_renderer_NodeProxy_set3DNode));
    cls->defineFunction("setLocalZOrder", _SE(js_renderer_NodeProxy_setLocalZOrder));
    cls->defineFunction("getChildrenCount", _SE(js_renderer_NodeProxy_getChildrenCount));
    cls->defineFunction("getHandle", _SE(js_renderer_NodeProxy_getHandle));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_NodeProxy_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::NodeProxy>(cls);

    __jsb_cocos2d_renderer_NodeProxy_proto = cls->getProto();
    __jsb_cocos2d_renderer_NodeProxy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Camera_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Camera_class = nullptr;

static bool js_renderer_Camera_getDepth(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDepth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getDepth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getDepth)

static bool js_renderer_Camera_setFov(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setFov : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setFov : Error processing arguments");
        cobj->setFov(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setFov)

static bool js_renderer_Camera_getFrameBuffer(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getFrameBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::FrameBuffer* result = cobj->getFrameBuffer();
        ok &= native_ptr_to_seval<cocos2d::renderer::FrameBuffer>((cocos2d::renderer::FrameBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getFrameBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getFrameBuffer)

static bool js_renderer_Camera_setStencil(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setStencil : Error processing arguments");
        cobj->setStencil(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setStencil)

static bool js_renderer_Camera_setPriority(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setPriority : Error processing arguments");
        cobj->setPriority(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setPriority)

static bool js_renderer_Camera_getOrthoHeight(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getOrthoHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOrthoHeight();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getOrthoHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getOrthoHeight)

static bool js_renderer_Camera_setCullingMask(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setCullingMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setCullingMask : Error processing arguments");
        cobj->setCullingMask(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setCullingMask)

static bool js_renderer_Camera_getStencil(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getStencil();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getStencil : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getStencil)

static bool js_renderer_Camera_setType(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::ProjectionType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ProjectionType)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setType : Error processing arguments");
        cobj->setType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setType)

static bool js_renderer_Camera_getPriority(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPriority();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getPriority : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getPriority)

static bool js_renderer_Camera_setFar(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setFar : Error processing arguments");
        cobj->setFar(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setFar)

static bool js_renderer_Camera_setFrameBuffer(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setFrameBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::FrameBuffer* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setFrameBuffer : Error processing arguments");
        cobj->setFrameBuffer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setFrameBuffer)

static bool js_renderer_Camera_setRect(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setRect : Error processing arguments");
        cobj->setRect(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setRect)

static bool js_renderer_Camera_setClearFlags(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setClearFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint8_t arg0;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setClearFlags : Error processing arguments");
        cobj->setClearFlags(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setClearFlags)

static bool js_renderer_Camera_getFar(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFar();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getFar : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getFar)

static bool js_renderer_Camera_getType(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getType)

static bool js_renderer_Camera_getCullingMask(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getCullingMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCullingMask();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getCullingMask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getCullingMask)

static bool js_renderer_Camera_setNear(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setNear : Error processing arguments");
        cobj->setNear(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setNear)

static bool js_renderer_Camera_setStages(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<std::string> arg0;
        ok &= seval_to_std_vector_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setStages : Error processing arguments");
        cobj->setStages(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setStages)

static bool js_renderer_Camera_setOrthoHeight(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setOrthoHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setOrthoHeight : Error processing arguments");
        cobj->setOrthoHeight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setOrthoHeight)

static bool js_renderer_Camera_setDepth(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setDepth : Error processing arguments");
        cobj->setDepth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setDepth)

static bool js_renderer_Camera_getStages(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getStages();
        ok &= std_vector_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getStages : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getStages)

static bool js_renderer_Camera_getFov(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getFov : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFov();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getFov : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getFov)

static bool js_renderer_Camera_setColor(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setColor : Error processing arguments");
        cobj->setColor(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setColor)

static bool js_renderer_Camera_setWorldMatrix(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setWorldMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Mat4 arg0;
        ok &= seval_to_Mat4(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setWorldMatrix : Error processing arguments");
        cobj->setWorldMatrix(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setWorldMatrix)

static bool js_renderer_Camera_getNear(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNear();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getNear : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getNear)

static bool js_renderer_Camera_getClearFlags(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getClearFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint8_t result = cobj->getClearFlags();
        ok &= uint8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getClearFlags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getClearFlags)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Camera_finalize)

static bool js_renderer_Camera_constructor(se::State& s)
{
    cocos2d::renderer::Camera* cobj = new (std::nothrow) cocos2d::renderer::Camera();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Camera_constructor, __jsb_cocos2d_renderer_Camera_class, js_cocos2d_renderer_Camera_finalize)




static bool js_cocos2d_renderer_Camera_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Camera)", s.nativeThisObject());
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Camera_finalize)

bool js_register_renderer_Camera(se::Object* obj)
{
    auto cls = se::Class::create("Camera", obj, nullptr, _SE(js_renderer_Camera_constructor));

    cls->defineFunction("getDepth", _SE(js_renderer_Camera_getDepth));
    cls->defineFunction("setFov", _SE(js_renderer_Camera_setFov));
    cls->defineFunction("getFrameBuffer", _SE(js_renderer_Camera_getFrameBuffer));
    cls->defineFunction("setStencil", _SE(js_renderer_Camera_setStencil));
    cls->defineFunction("setPriority", _SE(js_renderer_Camera_setPriority));
    cls->defineFunction("getOrthoHeight", _SE(js_renderer_Camera_getOrthoHeight));
    cls->defineFunction("setCullingMask", _SE(js_renderer_Camera_setCullingMask));
    cls->defineFunction("getStencil", _SE(js_renderer_Camera_getStencil));
    cls->defineFunction("setType", _SE(js_renderer_Camera_setType));
    cls->defineFunction("getPriority", _SE(js_renderer_Camera_getPriority));
    cls->defineFunction("setFar", _SE(js_renderer_Camera_setFar));
    cls->defineFunction("setFrameBuffer", _SE(js_renderer_Camera_setFrameBuffer));
    cls->defineFunction("setRect", _SE(js_renderer_Camera_setRect));
    cls->defineFunction("setClearFlags", _SE(js_renderer_Camera_setClearFlags));
    cls->defineFunction("getFar", _SE(js_renderer_Camera_getFar));
    cls->defineFunction("getType", _SE(js_renderer_Camera_getType));
    cls->defineFunction("getCullingMask", _SE(js_renderer_Camera_getCullingMask));
    cls->defineFunction("setNear", _SE(js_renderer_Camera_setNear));
    cls->defineFunction("setStages", _SE(js_renderer_Camera_setStages));
    cls->defineFunction("setOrthoHeight", _SE(js_renderer_Camera_setOrthoHeight));
    cls->defineFunction("setDepth", _SE(js_renderer_Camera_setDepth));
    cls->defineFunction("getStages", _SE(js_renderer_Camera_getStages));
    cls->defineFunction("getFov", _SE(js_renderer_Camera_getFov));
    cls->defineFunction("setColor", _SE(js_renderer_Camera_setColor));
    cls->defineFunction("setWorldMatrix", _SE(js_renderer_Camera_setWorldMatrix));
    cls->defineFunction("getNear", _SE(js_renderer_Camera_getNear));
    cls->defineFunction("getClearFlags", _SE(js_renderer_Camera_getClearFlags));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Camera_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Camera>(cls);

    __jsb_cocos2d_renderer_Camera_proto = cls->getProto();
    __jsb_cocos2d_renderer_Camera_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_ForwardRenderer_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_ForwardRenderer_class = nullptr;

static bool js_renderer_ForwardRenderer_renderCamera(se::State& s)
{
    cocos2d::renderer::ForwardRenderer* cobj = (cocos2d::renderer::ForwardRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ForwardRenderer_renderCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::renderer::Camera* arg0 = nullptr;
        cocos2d::renderer::Scene* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_ForwardRenderer_renderCamera : Error processing arguments");
        cobj->renderCamera(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_ForwardRenderer_renderCamera)

static bool js_renderer_ForwardRenderer_init(se::State& s)
{
    cocos2d::renderer::ForwardRenderer* cobj = (cocos2d::renderer::ForwardRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ForwardRenderer_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
        std::vector<cocos2d::renderer::ProgramLib::Template> arg1;
        cocos2d::renderer::Texture2D* arg2 = nullptr;
        int arg3 = 0;
        int arg4 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_std_vector_ProgramLib_Template(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (int)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_ForwardRenderer_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_ForwardRenderer_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_renderer_ForwardRenderer_init)

static bool js_renderer_ForwardRenderer_render(se::State& s)
{
    cocos2d::renderer::ForwardRenderer* cobj = (cocos2d::renderer::ForwardRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ForwardRenderer_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Scene* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_ForwardRenderer_render : Error processing arguments");
        cobj->render(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_ForwardRenderer_render)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_ForwardRenderer_finalize)

static bool js_renderer_ForwardRenderer_constructor(se::State& s)
{
    cocos2d::renderer::ForwardRenderer* cobj = new (std::nothrow) cocos2d::renderer::ForwardRenderer();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_ForwardRenderer_constructor, __jsb_cocos2d_renderer_ForwardRenderer_class, js_cocos2d_renderer_ForwardRenderer_finalize)



extern se::Object* __jsb_cocos2d_renderer_BaseRenderer_proto;

static bool js_cocos2d_renderer_ForwardRenderer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::ForwardRenderer)", s.nativeThisObject());
    cocos2d::renderer::ForwardRenderer* cobj = (cocos2d::renderer::ForwardRenderer*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_ForwardRenderer_finalize)

bool js_register_renderer_ForwardRenderer(se::Object* obj)
{
    auto cls = se::Class::create("ForwardRenderer", obj, __jsb_cocos2d_renderer_BaseRenderer_proto, _SE(js_renderer_ForwardRenderer_constructor));

    cls->defineFunction("renderCamera", _SE(js_renderer_ForwardRenderer_renderCamera));
    cls->defineFunction("init", _SE(js_renderer_ForwardRenderer_init));
    cls->defineFunction("render", _SE(js_renderer_ForwardRenderer_render));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_ForwardRenderer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::ForwardRenderer>(cls);

    __jsb_cocos2d_renderer_ForwardRenderer_proto = cls->getProto();
    __jsb_cocos2d_renderer_ForwardRenderer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Effect_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Effect_class = nullptr;

static bool js_renderer_Effect_getProperty(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getProperty : Error processing arguments");
        const cocos2d::renderer::Technique::Parameter& result = cobj->getProperty(arg0);
        ok &= TechniqueParameter_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getProperty : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_getProperty)

static bool js_renderer_Effect_getTechnique(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getTechnique : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getTechnique : Error processing arguments");
        cocos2d::renderer::Technique* result = cobj->getTechnique(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::Technique>((cocos2d::renderer::Technique*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getTechnique : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_getTechnique)

static bool js_renderer_Effect_getDefine(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getDefine : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getDefine : Error processing arguments");
        cocos2d::Value result = cobj->getDefine(arg0);
        ok &= ccvalue_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getDefine : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_getDefine)

static bool js_renderer_Effect_getHash(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getHash();
        ok &= double_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_getHash)

static bool js_renderer_Effect_updateHash(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_updateHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        double arg0 = 0;
        ok &= seval_to_double(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_updateHash : Error processing arguments");
        cobj->updateHash(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_updateHash)

static bool js_renderer_Effect_clear(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_clear)

static bool js_renderer_Effect_define(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_define : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        cocos2d::Value arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_ccvalue(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_define : Error processing arguments");
        cobj->define(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_define)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Effect_finalize)

static bool js_renderer_Effect_constructor(se::State& s)
{
    cocos2d::renderer::Effect* cobj = new (std::nothrow) cocos2d::renderer::Effect();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Effect_constructor, __jsb_cocos2d_renderer_Effect_class, js_cocos2d_renderer_Effect_finalize)




static bool js_cocos2d_renderer_Effect_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Effect)", s.nativeThisObject());
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Effect_finalize)

bool js_register_renderer_Effect(se::Object* obj)
{
    auto cls = se::Class::create("EffectNative", obj, nullptr, _SE(js_renderer_Effect_constructor));

    cls->defineFunction("getProperty", _SE(js_renderer_Effect_getProperty));
    cls->defineFunction("getTechnique", _SE(js_renderer_Effect_getTechnique));
    cls->defineFunction("getDefine", _SE(js_renderer_Effect_getDefine));
    cls->defineFunction("getHash", _SE(js_renderer_Effect_getHash));
    cls->defineFunction("updateHash", _SE(js_renderer_Effect_updateHash));
    cls->defineFunction("clear", _SE(js_renderer_Effect_clear));
    cls->defineFunction("define", _SE(js_renderer_Effect_define));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Effect_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Effect>(cls);

    __jsb_cocos2d_renderer_Effect_proto = cls->getProto();
    __jsb_cocos2d_renderer_Effect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Light_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Light_class = nullptr;

static bool js_renderer_Light_getShadowScale(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowScale)

static bool js_renderer_Light_getRange(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRange();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getRange : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getRange)

static bool js_renderer_Light_setShadowResolution(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowResolution : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowResolution : Error processing arguments");
        cobj->setShadowResolution(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowResolution)

static bool js_renderer_Light_getFrustumEdgeFalloff(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getFrustumEdgeFalloff : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFrustumEdgeFalloff();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getFrustumEdgeFalloff : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getFrustumEdgeFalloff)

static bool js_renderer_Light_setSpotExp(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setSpotExp : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setSpotExp : Error processing arguments");
        cobj->setSpotExp(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setSpotExp)

static bool js_renderer_Light_setShadowType(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Light::ShadowType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::Light::ShadowType)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowType : Error processing arguments");
        cobj->setShadowType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowType)

static bool js_renderer_Light_setType(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Light::LightType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::Light::LightType)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setType : Error processing arguments");
        cobj->setType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setType)

static bool js_renderer_Light_getViewProjMatrix(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getViewProjMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Mat4& result = cobj->getViewProjMatrix();
        ok &= Mat4_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getViewProjMatrix : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getViewProjMatrix)

static bool js_renderer_Light_getShadowBias(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowBias();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowBias : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowBias)

static bool js_renderer_Light_getShadowDarkness(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowDarkness : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getShadowDarkness();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowDarkness : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowDarkness)

static bool js_renderer_Light_getSpotAngle(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getSpotAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSpotAngle();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getSpotAngle : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getSpotAngle)

static bool js_renderer_Light_getSpotExp(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getSpotExp : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSpotExp();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getSpotExp : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getSpotExp)

static bool js_renderer_Light_getViewPorjMatrix(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getViewPorjMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Mat4 result = cobj->getViewPorjMatrix();
        ok &= Mat4_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getViewPorjMatrix : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getViewPorjMatrix)

static bool js_renderer_Light_getType(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getType)

static bool js_renderer_Light_getIntensity(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getIntensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getIntensity();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getIntensity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getIntensity)

static bool js_renderer_Light_getShadowMaxDepth(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowMaxDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowMaxDepth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowMaxDepth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowMaxDepth)

static bool js_renderer_Light_getWorldMatrix(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getWorldMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Mat4& result = cobj->getWorldMatrix();
        ok &= Mat4_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getWorldMatrix : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getWorldMatrix)

static bool js_renderer_Light_getShadowMap(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::Texture2D* result = cobj->getShadowMap();
        ok &= native_ptr_to_seval<cocos2d::renderer::Texture2D>((cocos2d::renderer::Texture2D*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowMap : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowMap)

static bool js_renderer_Light_getColor(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color3F result = cobj->getColor();
        ok &= Color3F_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getColor)

static bool js_renderer_Light_setIntensity(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setIntensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setIntensity : Error processing arguments");
        cobj->setIntensity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setIntensity)

static bool js_renderer_Light_getShadowMinDepth(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowMinDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowMinDepth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowMinDepth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowMinDepth)

static bool js_renderer_Light_setShadowMinDepth(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowMinDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowMinDepth : Error processing arguments");
        cobj->setShadowMinDepth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowMinDepth)

static bool js_renderer_Light_update(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_update)

static bool js_renderer_Light_setShadowDarkness(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowDarkness : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowDarkness : Error processing arguments");
        cobj->setShadowDarkness(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowDarkness)

static bool js_renderer_Light_setWorldMatrix(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setWorldMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Mat4 arg0;
        ok &= seval_to_Mat4(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setWorldMatrix : Error processing arguments");
        cobj->setWorldMatrix(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setWorldMatrix)

static bool js_renderer_Light_setSpotAngle(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setSpotAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setSpotAngle : Error processing arguments");
        cobj->setSpotAngle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setSpotAngle)

static bool js_renderer_Light_setRange(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setRange : Error processing arguments");
        cobj->setRange(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setRange)

static bool js_renderer_Light_setShadowScale(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowScale : Error processing arguments");
        cobj->setShadowScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowScale)

static bool js_renderer_Light_setColor(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setColor : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setColor : Error processing arguments");
        cobj->setColor(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setColor)

static bool js_renderer_Light_setShadowMaxDepth(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowMaxDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowMaxDepth : Error processing arguments");
        cobj->setShadowMaxDepth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowMaxDepth)

static bool js_renderer_Light_setFrustumEdgeFalloff(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setFrustumEdgeFalloff : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setFrustumEdgeFalloff : Error processing arguments");
        cobj->setFrustumEdgeFalloff(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setFrustumEdgeFalloff)

static bool js_renderer_Light_getShadowType(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getShadowType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowType)

static bool js_renderer_Light_getShadowResolution(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowResolution : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getShadowResolution();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowResolution : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowResolution)

static bool js_renderer_Light_setShadowBias(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowBias : Error processing arguments");
        cobj->setShadowBias(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowBias)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Light_finalize)

static bool js_renderer_Light_constructor(se::State& s)
{
    cocos2d::renderer::Light* cobj = new (std::nothrow) cocos2d::renderer::Light();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Light_constructor, __jsb_cocos2d_renderer_Light_class, js_cocos2d_renderer_Light_finalize)




static bool js_cocos2d_renderer_Light_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Light)", s.nativeThisObject());
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Light_finalize)

bool js_register_renderer_Light(se::Object* obj)
{
    auto cls = se::Class::create("Light", obj, nullptr, _SE(js_renderer_Light_constructor));

    cls->defineFunction("getShadowScale", _SE(js_renderer_Light_getShadowScale));
    cls->defineFunction("getRange", _SE(js_renderer_Light_getRange));
    cls->defineFunction("setShadowResolution", _SE(js_renderer_Light_setShadowResolution));
    cls->defineFunction("getFrustumEdgeFalloff", _SE(js_renderer_Light_getFrustumEdgeFalloff));
    cls->defineFunction("setSpotExp", _SE(js_renderer_Light_setSpotExp));
    cls->defineFunction("setShadowType", _SE(js_renderer_Light_setShadowType));
    cls->defineFunction("setType", _SE(js_renderer_Light_setType));
    cls->defineFunction("getViewProjMatrix", _SE(js_renderer_Light_getViewProjMatrix));
    cls->defineFunction("getShadowBias", _SE(js_renderer_Light_getShadowBias));
    cls->defineFunction("getShadowDarkness", _SE(js_renderer_Light_getShadowDarkness));
    cls->defineFunction("getSpotAngle", _SE(js_renderer_Light_getSpotAngle));
    cls->defineFunction("getSpotExp", _SE(js_renderer_Light_getSpotExp));
    cls->defineFunction("getViewPorjMatrix", _SE(js_renderer_Light_getViewPorjMatrix));
    cls->defineFunction("getType", _SE(js_renderer_Light_getType));
    cls->defineFunction("getIntensity", _SE(js_renderer_Light_getIntensity));
    cls->defineFunction("getShadowMaxDepth", _SE(js_renderer_Light_getShadowMaxDepth));
    cls->defineFunction("getWorldMatrix", _SE(js_renderer_Light_getWorldMatrix));
    cls->defineFunction("getShadowMap", _SE(js_renderer_Light_getShadowMap));
    cls->defineFunction("getColor", _SE(js_renderer_Light_getColor));
    cls->defineFunction("setIntensity", _SE(js_renderer_Light_setIntensity));
    cls->defineFunction("getShadowMinDepth", _SE(js_renderer_Light_getShadowMinDepth));
    cls->defineFunction("setShadowMinDepth", _SE(js_renderer_Light_setShadowMinDepth));
    cls->defineFunction("update", _SE(js_renderer_Light_update));
    cls->defineFunction("setShadowDarkness", _SE(js_renderer_Light_setShadowDarkness));
    cls->defineFunction("setWorldMatrix", _SE(js_renderer_Light_setWorldMatrix));
    cls->defineFunction("setSpotAngle", _SE(js_renderer_Light_setSpotAngle));
    cls->defineFunction("setRange", _SE(js_renderer_Light_setRange));
    cls->defineFunction("setShadowScale", _SE(js_renderer_Light_setShadowScale));
    cls->defineFunction("setColor", _SE(js_renderer_Light_setColor));
    cls->defineFunction("setShadowMaxDepth", _SE(js_renderer_Light_setShadowMaxDepth));
    cls->defineFunction("setFrustumEdgeFalloff", _SE(js_renderer_Light_setFrustumEdgeFalloff));
    cls->defineFunction("getShadowType", _SE(js_renderer_Light_getShadowType));
    cls->defineFunction("getShadowResolution", _SE(js_renderer_Light_getShadowResolution));
    cls->defineFunction("setShadowBias", _SE(js_renderer_Light_setShadowBias));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Light_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Light>(cls);

    __jsb_cocos2d_renderer_Light_proto = cls->getProto();
    __jsb_cocos2d_renderer_Light_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Pass_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Pass_class = nullptr;

static bool js_renderer_Pass_getStencilTest(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_getStencilTest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getStencilTest();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_getStencilTest : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_getStencilTest)

static bool js_renderer_Pass_setStencilBack(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setStencilBack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setStencilBack();
        return true;
    }
    if (argc == 1) {
        cocos2d::renderer::ComparisonFunc arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2, arg3);
        return true;
    }
    if (argc == 5) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    if (argc == 6) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    if (argc == 7) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        uint8_t arg6;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        ok &= seval_to_uint8(args[6], (uint8_t*)&arg6);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setStencilBack)

static bool js_renderer_Pass_setCullMode(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setCullMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::CullMode arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::CullMode)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setCullMode : Error processing arguments");
        cobj->setCullMode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setCullMode)

static bool js_renderer_Pass_setBlend(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setBlend : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setBlend();
        return true;
    }
    if (argc == 1) {
        cocos2d::renderer::BlendOp arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3);
        return true;
    }
    if (argc == 5) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        cocos2d::renderer::BlendFactor arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    if (argc == 6) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        cocos2d::renderer::BlendFactor arg4;
        cocos2d::renderer::BlendFactor arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    if (argc == 7) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        cocos2d::renderer::BlendFactor arg4;
        cocos2d::renderer::BlendFactor arg5;
        unsigned int arg6 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setBlend)

static bool js_renderer_Pass_setProgramName(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setProgramName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setProgramName : Error processing arguments");
        cobj->setProgramName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setProgramName)

static bool js_renderer_Pass_disableStencilTest(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_disableStencilTest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->disableStencilTest();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_disableStencilTest)

static bool js_renderer_Pass_setStencilFront(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setStencilFront : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setStencilFront();
        return true;
    }
    if (argc == 1) {
        cocos2d::renderer::ComparisonFunc arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2, arg3);
        return true;
    }
    if (argc == 5) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    if (argc == 6) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    if (argc == 7) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        uint8_t arg6;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        ok &= seval_to_uint8(args[6], (uint8_t*)&arg6);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setStencilFront)

static bool js_renderer_Pass_setDepth(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setDepth();
        return true;
    }
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setDepth : Error processing arguments");
        cobj->setDepth(arg0);
        return true;
    }
    if (argc == 2) {
        bool arg0;
        bool arg1;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setDepth : Error processing arguments");
        cobj->setDepth(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        bool arg0;
        bool arg1;
        cocos2d::renderer::ComparisonFunc arg2;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setDepth : Error processing arguments");
        cobj->setDepth(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setDepth)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Pass_finalize)

static bool js_renderer_Pass_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            cocos2d::renderer::Pass* cobj = new (std::nothrow) cocos2d::renderer::Pass();
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::renderer::Pass* cobj = new (std::nothrow) cocos2d::renderer::Pass(arg0);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_renderer_Pass_constructor, __jsb_cocos2d_renderer_Pass_class, js_cocos2d_renderer_Pass_finalize)




static bool js_cocos2d_renderer_Pass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Pass)", s.nativeThisObject());
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Pass_finalize)

bool js_register_renderer_Pass(se::Object* obj)
{
    auto cls = se::Class::create("PassNative", obj, nullptr, _SE(js_renderer_Pass_constructor));

    cls->defineFunction("getStencilTest", _SE(js_renderer_Pass_getStencilTest));
    cls->defineFunction("setStencilBack", _SE(js_renderer_Pass_setStencilBack));
    cls->defineFunction("setCullMode", _SE(js_renderer_Pass_setCullMode));
    cls->defineFunction("setBlend", _SE(js_renderer_Pass_setBlend));
    cls->defineFunction("setProgramName", _SE(js_renderer_Pass_setProgramName));
    cls->defineFunction("disableStencilTest", _SE(js_renderer_Pass_disableStencilTest));
    cls->defineFunction("setStencilFront", _SE(js_renderer_Pass_setStencilFront));
    cls->defineFunction("setDepth", _SE(js_renderer_Pass_setDepth));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Pass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Pass>(cls);

    __jsb_cocos2d_renderer_Pass_proto = cls->getProto();
    __jsb_cocos2d_renderer_Pass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Scene_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Scene_class = nullptr;

static bool js_renderer_Scene_reset(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_reset)

static bool js_renderer_Scene_getCameraCount(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getCameraCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCameraCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getCameraCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getCameraCount)

static bool js_renderer_Scene_addCamera(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_addCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Camera* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_addCamera : Error processing arguments");
        cobj->addCamera(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_addCamera)

static bool js_renderer_Scene_removeCamera(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_removeCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Camera* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_removeCamera : Error processing arguments");
        cobj->removeCamera(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_removeCamera)

static bool js_renderer_Scene_getLightCount(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getLightCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getLightCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getLightCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getLightCount)

static bool js_renderer_Scene_getCamera(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getCamera : Error processing arguments");
        cocos2d::renderer::Camera* result = cobj->getCamera(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::Camera>((cocos2d::renderer::Camera*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getCamera : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getCamera)

static bool js_renderer_Scene_getLight(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getLight : Error processing arguments");
        cocos2d::renderer::Light* result = cobj->getLight(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::Light>((cocos2d::renderer::Light*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getLight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getLight)

static bool js_renderer_Scene_getCameras(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vector<cocos2d::renderer::Camera *>& result = cobj->getCameras();
        ok &= Vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getCameras : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getCameras)

static bool js_renderer_Scene_sortCameras(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_sortCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->sortCameras();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_sortCameras)

static bool js_renderer_Scene_addView(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_addView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::View* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_addView : Error processing arguments");
        cobj->addView(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_addView)

static bool js_renderer_Scene_setDebugCamera(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_setDebugCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Camera* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_setDebugCamera : Error processing arguments");
        cobj->setDebugCamera(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_setDebugCamera)

static bool js_renderer_Scene_removeView(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_removeView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::View* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_removeView : Error processing arguments");
        cobj->removeView(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_removeView)

static bool js_renderer_Scene_addLight(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_addLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Light* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_addLight : Error processing arguments");
        cobj->addLight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_addLight)

static bool js_renderer_Scene_removeLight(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_removeLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Light* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_removeLight : Error processing arguments");
        cobj->removeLight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_removeLight)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Scene_finalize)

static bool js_renderer_Scene_constructor(se::State& s)
{
    cocos2d::renderer::Scene* cobj = new (std::nothrow) cocos2d::renderer::Scene();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Scene_constructor, __jsb_cocos2d_renderer_Scene_class, js_cocos2d_renderer_Scene_finalize)




static bool js_cocos2d_renderer_Scene_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Scene)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Scene_finalize)

bool js_register_renderer_Scene(se::Object* obj)
{
    auto cls = se::Class::create("Scene", obj, nullptr, _SE(js_renderer_Scene_constructor));

    cls->defineFunction("reset", _SE(js_renderer_Scene_reset));
    cls->defineFunction("getCameraCount", _SE(js_renderer_Scene_getCameraCount));
    cls->defineFunction("addCamera", _SE(js_renderer_Scene_addCamera));
    cls->defineFunction("removeCamera", _SE(js_renderer_Scene_removeCamera));
    cls->defineFunction("getLightCount", _SE(js_renderer_Scene_getLightCount));
    cls->defineFunction("getCamera", _SE(js_renderer_Scene_getCamera));
    cls->defineFunction("getLight", _SE(js_renderer_Scene_getLight));
    cls->defineFunction("getCameras", _SE(js_renderer_Scene_getCameras));
    cls->defineFunction("sortCameras", _SE(js_renderer_Scene_sortCameras));
    cls->defineFunction("addView", _SE(js_renderer_Scene_addView));
    cls->defineFunction("setDebugCamera", _SE(js_renderer_Scene_setDebugCamera));
    cls->defineFunction("removeView", _SE(js_renderer_Scene_removeView));
    cls->defineFunction("addLight", _SE(js_renderer_Scene_addLight));
    cls->defineFunction("removeLight", _SE(js_renderer_Scene_removeLight));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Scene_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Scene>(cls);

    __jsb_cocos2d_renderer_Scene_proto = cls->getProto();
    __jsb_cocos2d_renderer_Scene_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_MeshBuffer_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_MeshBuffer_class = nullptr;

static bool js_renderer_MeshBuffer_reset(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_reset)

static bool js_renderer_MeshBuffer_getVertexOffset(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_getVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexOffset();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_getVertexOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_getVertexOffset)

static bool js_renderer_MeshBuffer_getIndexBuffer(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_getIndexBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::IndexBuffer* result = cobj->getIndexBuffer();
        ok &= native_ptr_to_seval<cocos2d::renderer::IndexBuffer>((cocos2d::renderer::IndexBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_getIndexBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_getIndexBuffer)

static bool js_renderer_MeshBuffer_updateOffset(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_updateOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateOffset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_updateOffset)

static bool js_renderer_MeshBuffer_getIndexStart(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_getIndexStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIndexStart();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_getIndexStart : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_getIndexStart)

static bool js_renderer_MeshBuffer_getIndexOffset(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_getIndexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIndexOffset();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_getIndexOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_getIndexOffset)

static bool js_renderer_MeshBuffer_request(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_request : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        cocos2d::renderer::MeshBuffer::OffsetInfo* arg2 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR OffsetInfo*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_request : Error processing arguments");
        bool result = cobj->request(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_request : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_request)

static bool js_renderer_MeshBuffer_requestStatic(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_requestStatic : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        unsigned int arg0 = 0;
        unsigned int arg1 = 0;
        cocos2d::renderer::MeshBuffer::OffsetInfo* arg2 = nullptr;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR OffsetInfo*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_requestStatic : Error processing arguments");
        bool result = cobj->requestStatic(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_requestStatic : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_requestStatic)

static bool js_renderer_MeshBuffer_uploadData(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_uploadData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->uploadData();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_uploadData)

static bool js_renderer_MeshBuffer_getVertexBuffer(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_getVertexBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::VertexBuffer* result = cobj->getVertexBuffer();
        ok &= native_ptr_to_seval<cocos2d::renderer::VertexBuffer>((cocos2d::renderer::VertexBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_getVertexBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_getVertexBuffer)

static bool js_renderer_MeshBuffer_getByteOffset(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_getByteOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getByteOffset();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_getByteOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_getByteOffset)

static bool js_renderer_MeshBuffer_getVertexStart(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_getVertexStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexStart();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_getVertexStart : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_getVertexStart)

static bool js_renderer_MeshBuffer_destroy(se::State& s)
{
    cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MeshBuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MeshBuffer_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_MeshBuffer_finalize)

static bool js_renderer_MeshBuffer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::renderer::ModelBatcher* arg0 = nullptr;
    cocos2d::renderer::VertexFormat* arg1 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_native_ptr(args[1], &arg1);
    SE_PRECONDITION2(ok, false, "js_renderer_MeshBuffer_constructor : Error processing arguments");
    cocos2d::renderer::MeshBuffer* cobj = new (std::nothrow) cocos2d::renderer::MeshBuffer(arg0, arg1);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_MeshBuffer_constructor, __jsb_cocos2d_renderer_MeshBuffer_class, js_cocos2d_renderer_MeshBuffer_finalize)




static bool js_cocos2d_renderer_MeshBuffer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::MeshBuffer)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::MeshBuffer* cobj = (cocos2d::renderer::MeshBuffer*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_MeshBuffer_finalize)

bool js_register_renderer_MeshBuffer(se::Object* obj)
{
    auto cls = se::Class::create("MeshBuffer", obj, nullptr, _SE(js_renderer_MeshBuffer_constructor));

    cls->defineFunction("reset", _SE(js_renderer_MeshBuffer_reset));
    cls->defineFunction("getVertexOffset", _SE(js_renderer_MeshBuffer_getVertexOffset));
    cls->defineFunction("getIndexBuffer", _SE(js_renderer_MeshBuffer_getIndexBuffer));
    cls->defineFunction("updateOffset", _SE(js_renderer_MeshBuffer_updateOffset));
    cls->defineFunction("getIndexStart", _SE(js_renderer_MeshBuffer_getIndexStart));
    cls->defineFunction("getIndexOffset", _SE(js_renderer_MeshBuffer_getIndexOffset));
    cls->defineFunction("request", _SE(js_renderer_MeshBuffer_request));
    cls->defineFunction("requestStatic", _SE(js_renderer_MeshBuffer_requestStatic));
    cls->defineFunction("uploadData", _SE(js_renderer_MeshBuffer_uploadData));
    cls->defineFunction("getVertexBuffer", _SE(js_renderer_MeshBuffer_getVertexBuffer));
    cls->defineFunction("getByteOffset", _SE(js_renderer_MeshBuffer_getByteOffset));
    cls->defineFunction("getVertexStart", _SE(js_renderer_MeshBuffer_getVertexStart));
    cls->defineFunction("destroy", _SE(js_renderer_MeshBuffer_destroy));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_MeshBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::MeshBuffer>(cls);

    __jsb_cocos2d_renderer_MeshBuffer_proto = cls->getProto();
    __jsb_cocos2d_renderer_MeshBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_RenderHandle_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_RenderHandle_class = nullptr;

static bool js_renderer_RenderHandle_setMeshCount(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_setMeshCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_setMeshCount : Error processing arguments");
        cobj->setMeshCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_setMeshCount)

static bool js_renderer_RenderHandle_setVertexFormat(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_setVertexFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::VertexFormat* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_setVertexFormat : Error processing arguments");
        cobj->setVertexFormat(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_setVertexFormat)

static bool js_renderer_RenderHandle_updateOpacity(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_updateOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        int arg0 = 0;
        uint8_t arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        ok &= seval_to_uint8(args[1], (uint8_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_updateOpacity : Error processing arguments");
        cobj->updateOpacity(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_updateOpacity)

static bool js_renderer_RenderHandle_handle(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_handle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        cocos2d::renderer::ModelBatcher* arg1 = nullptr;
        cocos2d::renderer::Scene* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_handle : Error processing arguments");
        cobj->handle(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_handle)

static bool js_renderer_RenderHandle_postHandle(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_postHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        cocos2d::renderer::ModelBatcher* arg1 = nullptr;
        cocos2d::renderer::Scene* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_postHandle : Error processing arguments");
        cobj->postHandle(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_postHandle)

static bool js_renderer_RenderHandle_getUseModel(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_getUseModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getUseModel();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_getUseModel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_getUseModel)

static bool js_renderer_RenderHandle_setUseModel(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_setUseModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_setUseModel : Error processing arguments");
        cobj->setUseModel(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_setUseModel)

static bool js_renderer_RenderHandle_enabled(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->enabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_enabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_enabled)

static bool js_renderer_RenderHandle_disable(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_disable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->disable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_disable)

static bool js_renderer_RenderHandle_fillBuffers(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_fillBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::renderer::MeshBuffer* arg0 = nullptr;
        int arg1 = 0;
        cocos2d::Mat4 arg2;
        ok &= seval_to_native_ptr(args[0], &arg0);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        ok &= seval_to_Mat4(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_fillBuffers : Error processing arguments");
        cobj->fillBuffers(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_fillBuffers)

static bool js_renderer_RenderHandle_enable(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_enable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->enable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_enable)

static bool js_renderer_RenderHandle_getMeshCount(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_getMeshCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMeshCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_getMeshCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_getMeshCount)

static bool js_renderer_RenderHandle_getVertexFormat(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_getVertexFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::VertexFormat* result = cobj->getVertexFormat();
        ok &= native_ptr_to_seval<cocos2d::renderer::VertexFormat>((cocos2d::renderer::VertexFormat*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_getVertexFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_getVertexFormat)

static bool js_renderer_RenderHandle_getEffect(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderHandle_getEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_getEffect : Error processing arguments");
        cocos2d::renderer::Effect* result = cobj->getEffect(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::Effect>((cocos2d::renderer::Effect*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_RenderHandle_getEffect : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderHandle_getEffect)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_RenderHandle_finalize)

static bool js_renderer_RenderHandle_constructor(se::State& s)
{
    cocos2d::renderer::RenderHandle* cobj = new (std::nothrow) cocos2d::renderer::RenderHandle();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_RenderHandle_constructor, __jsb_cocos2d_renderer_RenderHandle_class, js_cocos2d_renderer_RenderHandle_finalize)




static bool js_cocos2d_renderer_RenderHandle_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::RenderHandle)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::RenderHandle* cobj = (cocos2d::renderer::RenderHandle*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_RenderHandle_finalize)

bool js_register_renderer_RenderHandle(se::Object* obj)
{
    auto cls = se::Class::create("RenderHandle", obj, nullptr, _SE(js_renderer_RenderHandle_constructor));

    cls->defineFunction("setMeshCount", _SE(js_renderer_RenderHandle_setMeshCount));
    cls->defineFunction("setVertexFormat", _SE(js_renderer_RenderHandle_setVertexFormat));
    cls->defineFunction("updateOpacity", _SE(js_renderer_RenderHandle_updateOpacity));
    cls->defineFunction("handle", _SE(js_renderer_RenderHandle_handle));
    cls->defineFunction("postHandle", _SE(js_renderer_RenderHandle_postHandle));
    cls->defineFunction("getUseModel", _SE(js_renderer_RenderHandle_getUseModel));
    cls->defineFunction("setUseModel", _SE(js_renderer_RenderHandle_setUseModel));
    cls->defineFunction("enabled", _SE(js_renderer_RenderHandle_enabled));
    cls->defineFunction("disable", _SE(js_renderer_RenderHandle_disable));
    cls->defineFunction("fillBuffers", _SE(js_renderer_RenderHandle_fillBuffers));
    cls->defineFunction("enable", _SE(js_renderer_RenderHandle_enable));
    cls->defineFunction("getMeshCount", _SE(js_renderer_RenderHandle_getMeshCount));
    cls->defineFunction("getVertexFormat", _SE(js_renderer_RenderHandle_getVertexFormat));
    cls->defineFunction("getEffect", _SE(js_renderer_RenderHandle_getEffect));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_RenderHandle_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::RenderHandle>(cls);

    __jsb_cocos2d_renderer_RenderHandle_proto = cls->getProto();
    __jsb_cocos2d_renderer_RenderHandle_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_CustomRenderHandle_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_CustomRenderHandle_class = nullptr;

static bool js_renderer_CustomRenderHandle_reset(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_reset)

static bool js_renderer_CustomRenderHandle_getIACount(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_getIACount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getIACount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_getIACount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_getIACount)

static bool js_renderer_CustomRenderHandle_getEffectCount(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_getEffectCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getEffectCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_getEffectCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_getEffectCount)

static bool js_renderer_CustomRenderHandle_adjustIA(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_adjustIA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        size_t arg0 = 0;
        ok &= seval_to_size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_adjustIA : Error processing arguments");
        cocos2d::renderer::InputAssembler* result = cobj->adjustIA(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::InputAssembler>((cocos2d::renderer::InputAssembler*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_adjustIA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_adjustIA)

static bool js_renderer_CustomRenderHandle_clearNativeEffect(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_clearNativeEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearNativeEffect();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_clearNativeEffect)

static bool js_renderer_CustomRenderHandle_postHandle(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_postHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        cocos2d::renderer::ModelBatcher* arg1 = nullptr;
        cocos2d::renderer::Scene* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_postHandle : Error processing arguments");
        cobj->postHandle(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_postHandle)

static bool js_renderer_CustomRenderHandle_getUseModel(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_getUseModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getUseModel();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_getUseModel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_getUseModel)

static bool js_renderer_CustomRenderHandle_setUseModel(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_setUseModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_setUseModel : Error processing arguments");
        cobj->setUseModel(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_setUseModel)

static bool js_renderer_CustomRenderHandle_disable(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_disable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->disable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_disable)

static bool js_renderer_CustomRenderHandle_renderIA(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_renderIA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        size_t arg0 = 0;
        cocos2d::renderer::ModelBatcher* arg1 = nullptr;
        cocos2d::renderer::NodeProxy* arg2 = nullptr;
        ok &= seval_to_size(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_renderIA : Error processing arguments");
        cobj->renderIA(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_renderIA)

static bool js_renderer_CustomRenderHandle_enable(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_enable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->enable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_enable)

static bool js_renderer_CustomRenderHandle_handle(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_handle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        cocos2d::renderer::ModelBatcher* arg1 = nullptr;
        cocos2d::renderer::Scene* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_handle : Error processing arguments");
        cobj->handle(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_handle)

static bool js_renderer_CustomRenderHandle_updateNativeEffect(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_updateNativeEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        size_t arg0 = 0;
        cocos2d::renderer::Effect* arg1 = nullptr;
        ok &= seval_to_size(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_updateNativeEffect : Error processing arguments");
        cobj->updateNativeEffect(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_updateNativeEffect)

static bool js_renderer_CustomRenderHandle_getEffect(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomRenderHandle_getEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_getEffect : Error processing arguments");
        cocos2d::renderer::Effect* result = cobj->getEffect(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::Effect>((cocos2d::renderer::Effect*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_CustomRenderHandle_getEffect : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomRenderHandle_getEffect)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_CustomRenderHandle_finalize)

static bool js_renderer_CustomRenderHandle_constructor(se::State& s)
{
    cocos2d::renderer::CustomRenderHandle* cobj = new (std::nothrow) cocos2d::renderer::CustomRenderHandle();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_CustomRenderHandle_constructor, __jsb_cocos2d_renderer_CustomRenderHandle_class, js_cocos2d_renderer_CustomRenderHandle_finalize)




static bool js_cocos2d_renderer_CustomRenderHandle_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::CustomRenderHandle)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::CustomRenderHandle* cobj = (cocos2d::renderer::CustomRenderHandle*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_CustomRenderHandle_finalize)

bool js_register_renderer_CustomRenderHandle(se::Object* obj)
{
    auto cls = se::Class::create("CustomRenderHandle", obj, nullptr, _SE(js_renderer_CustomRenderHandle_constructor));

    cls->defineFunction("reset", _SE(js_renderer_CustomRenderHandle_reset));
    cls->defineFunction("getIACount", _SE(js_renderer_CustomRenderHandle_getIACount));
    cls->defineFunction("getEffectCount", _SE(js_renderer_CustomRenderHandle_getEffectCount));
    cls->defineFunction("adjustIA", _SE(js_renderer_CustomRenderHandle_adjustIA));
    cls->defineFunction("clearNativeEffect", _SE(js_renderer_CustomRenderHandle_clearNativeEffect));
    cls->defineFunction("postHandle", _SE(js_renderer_CustomRenderHandle_postHandle));
    cls->defineFunction("getUseModel", _SE(js_renderer_CustomRenderHandle_getUseModel));
    cls->defineFunction("setUseModel", _SE(js_renderer_CustomRenderHandle_setUseModel));
    cls->defineFunction("disable", _SE(js_renderer_CustomRenderHandle_disable));
    cls->defineFunction("renderIA", _SE(js_renderer_CustomRenderHandle_renderIA));
    cls->defineFunction("enable", _SE(js_renderer_CustomRenderHandle_enable));
    cls->defineFunction("handle", _SE(js_renderer_CustomRenderHandle_handle));
    cls->defineFunction("updateNativeEffect", _SE(js_renderer_CustomRenderHandle_updateNativeEffect));
    cls->defineFunction("getEffect", _SE(js_renderer_CustomRenderHandle_getEffect));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_CustomRenderHandle_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::CustomRenderHandle>(cls);

    __jsb_cocos2d_renderer_CustomRenderHandle_proto = cls->getProto();
    __jsb_cocos2d_renderer_CustomRenderHandle_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_ModelBatcher_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_ModelBatcher_class = nullptr;

static bool js_renderer_ModelBatcher_reset(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_reset)

static bool js_renderer_ModelBatcher_getBuffer(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_getBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::VertexFormat* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_ModelBatcher_getBuffer : Error processing arguments");
        cocos2d::renderer::MeshBuffer* result = cobj->getBuffer(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::MeshBuffer>((cocos2d::renderer::MeshBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_ModelBatcher_getBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_getBuffer)

static bool js_renderer_ModelBatcher_startBatch(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_startBatch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->startBatch();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_startBatch)

static bool js_renderer_ModelBatcher_setCurrentBuffer(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_setCurrentBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::MeshBuffer* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_ModelBatcher_setCurrentBuffer : Error processing arguments");
        cobj->setCurrentBuffer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_setCurrentBuffer)

static bool js_renderer_ModelBatcher_getFlow(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_getFlow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::RenderFlow* result = cobj->getFlow();
        ok &= native_ptr_to_seval<cocos2d::renderer::RenderFlow>((cocos2d::renderer::RenderFlow*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_ModelBatcher_getFlow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_getFlow)

static bool js_renderer_ModelBatcher_commitIA(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_commitIA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        cocos2d::renderer::CustomRenderHandle* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_ModelBatcher_commitIA : Error processing arguments");
        cobj->commitIA(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_commitIA)

static bool js_renderer_ModelBatcher_getCurrentBuffer(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_getCurrentBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::renderer::MeshBuffer* result = cobj->getCurrentBuffer();
        ok &= native_ptr_to_seval<cocos2d::renderer::MeshBuffer>((cocos2d::renderer::MeshBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_ModelBatcher_getCurrentBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_getCurrentBuffer)

static bool js_renderer_ModelBatcher_flush(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_flush : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->flush();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_flush)

static bool js_renderer_ModelBatcher_commit(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_commit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        cocos2d::renderer::RenderHandle* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_ModelBatcher_commit : Error processing arguments");
        cobj->commit(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_commit)

static bool js_renderer_ModelBatcher_flushIA(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_flushIA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::InputAssembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_ModelBatcher_flushIA : Error processing arguments");
        cobj->flushIA(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_flushIA)

static bool js_renderer_ModelBatcher_terminateBatch(se::State& s)
{
    cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ModelBatcher_terminateBatch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->terminateBatch();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_ModelBatcher_terminateBatch)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_ModelBatcher_finalize)

static bool js_renderer_ModelBatcher_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::renderer::RenderFlow* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_renderer_ModelBatcher_constructor : Error processing arguments");
    cocos2d::renderer::ModelBatcher* cobj = new (std::nothrow) cocos2d::renderer::ModelBatcher(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_ModelBatcher_constructor, __jsb_cocos2d_renderer_ModelBatcher_class, js_cocos2d_renderer_ModelBatcher_finalize)




static bool js_cocos2d_renderer_ModelBatcher_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::ModelBatcher)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::ModelBatcher* cobj = (cocos2d::renderer::ModelBatcher*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_ModelBatcher_finalize)

bool js_register_renderer_ModelBatcher(se::Object* obj)
{
    auto cls = se::Class::create("ModelBatcher", obj, nullptr, _SE(js_renderer_ModelBatcher_constructor));

    cls->defineFunction("reset", _SE(js_renderer_ModelBatcher_reset));
    cls->defineFunction("getBuffer", _SE(js_renderer_ModelBatcher_getBuffer));
    cls->defineFunction("startBatch", _SE(js_renderer_ModelBatcher_startBatch));
    cls->defineFunction("setCurrentBuffer", _SE(js_renderer_ModelBatcher_setCurrentBuffer));
    cls->defineFunction("getFlow", _SE(js_renderer_ModelBatcher_getFlow));
    cls->defineFunction("commitIA", _SE(js_renderer_ModelBatcher_commitIA));
    cls->defineFunction("getCurrentBuffer", _SE(js_renderer_ModelBatcher_getCurrentBuffer));
    cls->defineFunction("flush", _SE(js_renderer_ModelBatcher_flush));
    cls->defineFunction("commit", _SE(js_renderer_ModelBatcher_commit));
    cls->defineFunction("flushIA", _SE(js_renderer_ModelBatcher_flushIA));
    cls->defineFunction("terminateBatch", _SE(js_renderer_ModelBatcher_terminateBatch));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_ModelBatcher_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::ModelBatcher>(cls);

    __jsb_cocos2d_renderer_ModelBatcher_proto = cls->getProto();
    __jsb_cocos2d_renderer_ModelBatcher_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_RenderFlow_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_RenderFlow_class = nullptr;

static bool js_renderer_RenderFlow_getRenderScene(se::State& s)
{
    cocos2d::renderer::RenderFlow* cobj = (cocos2d::renderer::RenderFlow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderFlow_getRenderScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::Scene* result = cobj->getRenderScene();
        ok &= native_ptr_to_seval<cocos2d::renderer::Scene>((cocos2d::renderer::Scene*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_RenderFlow_getRenderScene : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderFlow_getRenderScene)

static bool js_renderer_RenderFlow_getModelBatcher(se::State& s)
{
    cocos2d::renderer::RenderFlow* cobj = (cocos2d::renderer::RenderFlow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderFlow_getModelBatcher : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::ModelBatcher* result = cobj->getModelBatcher();
        ok &= native_ptr_to_seval<cocos2d::renderer::ModelBatcher>((cocos2d::renderer::ModelBatcher*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_RenderFlow_getModelBatcher : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderFlow_getModelBatcher)

static bool js_renderer_RenderFlow_getDevice(se::State& s)
{
    cocos2d::renderer::RenderFlow* cobj = (cocos2d::renderer::RenderFlow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderFlow_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::DeviceGraphics* result = cobj->getDevice();
        ok &= native_ptr_to_seval<cocos2d::renderer::DeviceGraphics>((cocos2d::renderer::DeviceGraphics*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_RenderFlow_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderFlow_getDevice)

static bool js_renderer_RenderFlow_render(se::State& s)
{
    cocos2d::renderer::RenderFlow* cobj = (cocos2d::renderer::RenderFlow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderFlow_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderFlow_render : Error processing arguments");
        cobj->render(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderFlow_render)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_RenderFlow_finalize)

static bool js_renderer_RenderFlow_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
    cocos2d::renderer::Scene* arg1 = nullptr;
    cocos2d::renderer::ForwardRenderer* arg2 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_native_ptr(args[1], &arg1);
    ok &= seval_to_native_ptr(args[2], &arg2);
    SE_PRECONDITION2(ok, false, "js_renderer_RenderFlow_constructor : Error processing arguments");
    cocos2d::renderer::RenderFlow* cobj = new (std::nothrow) cocos2d::renderer::RenderFlow(arg0, arg1, arg2);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_RenderFlow_constructor, __jsb_cocos2d_renderer_RenderFlow_class, js_cocos2d_renderer_RenderFlow_finalize)




static bool js_cocos2d_renderer_RenderFlow_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::RenderFlow)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::RenderFlow* cobj = (cocos2d::renderer::RenderFlow*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_RenderFlow_finalize)

bool js_register_renderer_RenderFlow(se::Object* obj)
{
    auto cls = se::Class::create("RenderFlow", obj, nullptr, _SE(js_renderer_RenderFlow_constructor));

    cls->defineFunction("getRenderScene", _SE(js_renderer_RenderFlow_getRenderScene));
    cls->defineFunction("getModelBatcher", _SE(js_renderer_RenderFlow_getModelBatcher));
    cls->defineFunction("getDevice", _SE(js_renderer_RenderFlow_getDevice));
    cls->defineFunction("render", _SE(js_renderer_RenderFlow_render));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_RenderFlow_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::RenderFlow>(cls);

    __jsb_cocos2d_renderer_RenderFlow_proto = cls->getProto();
    __jsb_cocos2d_renderer_RenderFlow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_GraphicsRenderHandle_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_GraphicsRenderHandle_class = nullptr;

static bool js_renderer_GraphicsRenderHandle_setMeshCount(se::State& s)
{
    cocos2d::renderer::GraphicsRenderHandle* cobj = (cocos2d::renderer::GraphicsRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_GraphicsRenderHandle_setMeshCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_GraphicsRenderHandle_setMeshCount : Error processing arguments");
        cobj->setMeshCount(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_GraphicsRenderHandle_setMeshCount)

static bool js_renderer_GraphicsRenderHandle_updateIA(se::State& s)
{
    cocos2d::renderer::GraphicsRenderHandle* cobj = (cocos2d::renderer::GraphicsRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_GraphicsRenderHandle_updateIA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        size_t arg0 = 0;
        int arg1 = 0;
        int arg2 = 0;
        ok &= seval_to_size(args[0], &arg0);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_GraphicsRenderHandle_updateIA : Error processing arguments");
        cobj->updateIA(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_GraphicsRenderHandle_updateIA)

static bool js_renderer_GraphicsRenderHandle_getMeshCount(se::State& s)
{
    cocos2d::renderer::GraphicsRenderHandle* cobj = (cocos2d::renderer::GraphicsRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_GraphicsRenderHandle_getMeshCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMeshCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_GraphicsRenderHandle_getMeshCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_GraphicsRenderHandle_getMeshCount)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_GraphicsRenderHandle_finalize)

static bool js_renderer_GraphicsRenderHandle_constructor(se::State& s)
{
    cocos2d::renderer::GraphicsRenderHandle* cobj = new (std::nothrow) cocos2d::renderer::GraphicsRenderHandle();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_GraphicsRenderHandle_constructor, __jsb_cocos2d_renderer_GraphicsRenderHandle_class, js_cocos2d_renderer_GraphicsRenderHandle_finalize)



extern se::Object* __jsb_cocos2d_renderer_CustomRenderHandle_proto;

static bool js_cocos2d_renderer_GraphicsRenderHandle_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::GraphicsRenderHandle)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::GraphicsRenderHandle* cobj = (cocos2d::renderer::GraphicsRenderHandle*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_GraphicsRenderHandle_finalize)

bool js_register_renderer_GraphicsRenderHandle(se::Object* obj)
{
    auto cls = se::Class::create("GraphicsRenderHandle", obj, __jsb_cocos2d_renderer_CustomRenderHandle_proto, _SE(js_renderer_GraphicsRenderHandle_constructor));

    cls->defineFunction("setMeshCount", _SE(js_renderer_GraphicsRenderHandle_setMeshCount));
    cls->defineFunction("updateIA", _SE(js_renderer_GraphicsRenderHandle_updateIA));
    cls->defineFunction("getMeshCount", _SE(js_renderer_GraphicsRenderHandle_getMeshCount));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_GraphicsRenderHandle_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::GraphicsRenderHandle>(cls);

    __jsb_cocos2d_renderer_GraphicsRenderHandle_proto = cls->getProto();
    __jsb_cocos2d_renderer_GraphicsRenderHandle_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_MaskRenderHandle_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_MaskRenderHandle_class = nullptr;

static bool js_renderer_MaskRenderHandle_setMaskInverted(se::State& s)
{
    cocos2d::renderer::MaskRenderHandle* cobj = (cocos2d::renderer::MaskRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskRenderHandle_setMaskInverted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_MaskRenderHandle_setMaskInverted : Error processing arguments");
        cobj->setMaskInverted(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskRenderHandle_setMaskInverted)

static bool js_renderer_MaskRenderHandle_setImageStencil(se::State& s)
{
    cocos2d::renderer::MaskRenderHandle* cobj = (cocos2d::renderer::MaskRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskRenderHandle_setImageStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_MaskRenderHandle_setImageStencil : Error processing arguments");
        cobj->setImageStencil(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskRenderHandle_setImageStencil)

static bool js_renderer_MaskRenderHandle_setClearSubHandle(se::State& s)
{
    cocos2d::renderer::MaskRenderHandle* cobj = (cocos2d::renderer::MaskRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskRenderHandle_setClearSubHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::GraphicsRenderHandle* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_MaskRenderHandle_setClearSubHandle : Error processing arguments");
        cobj->setClearSubHandle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskRenderHandle_setClearSubHandle)

static bool js_renderer_MaskRenderHandle_getMaskInverted(se::State& s)
{
    cocos2d::renderer::MaskRenderHandle* cobj = (cocos2d::renderer::MaskRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskRenderHandle_getMaskInverted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getMaskInverted();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MaskRenderHandle_getMaskInverted : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskRenderHandle_getMaskInverted)

static bool js_renderer_MaskRenderHandle_setRenderSubHandle(se::State& s)
{
    cocos2d::renderer::MaskRenderHandle* cobj = (cocos2d::renderer::MaskRenderHandle*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskRenderHandle_setRenderSubHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::GraphicsRenderHandle* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_MaskRenderHandle_setRenderSubHandle : Error processing arguments");
        cobj->setRenderSubHandle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskRenderHandle_setRenderSubHandle)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_MaskRenderHandle_finalize)

static bool js_renderer_MaskRenderHandle_constructor(se::State& s)
{
    cocos2d::renderer::MaskRenderHandle* cobj = new (std::nothrow) cocos2d::renderer::MaskRenderHandle();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_MaskRenderHandle_constructor, __jsb_cocos2d_renderer_MaskRenderHandle_class, js_cocos2d_renderer_MaskRenderHandle_finalize)



extern se::Object* __jsb_cocos2d_renderer_RenderHandle_proto;

static bool js_cocos2d_renderer_MaskRenderHandle_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::MaskRenderHandle)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::MaskRenderHandle* cobj = (cocos2d::renderer::MaskRenderHandle*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_MaskRenderHandle_finalize)

bool js_register_renderer_MaskRenderHandle(se::Object* obj)
{
    auto cls = se::Class::create("MaskRenderHandle", obj, __jsb_cocos2d_renderer_RenderHandle_proto, _SE(js_renderer_MaskRenderHandle_constructor));

    cls->defineFunction("setMaskInverted", _SE(js_renderer_MaskRenderHandle_setMaskInverted));
    cls->defineFunction("setImageStencil", _SE(js_renderer_MaskRenderHandle_setImageStencil));
    cls->defineFunction("setClearSubHandle", _SE(js_renderer_MaskRenderHandle_setClearSubHandle));
    cls->defineFunction("getMaskInverted", _SE(js_renderer_MaskRenderHandle_getMaskInverted));
    cls->defineFunction("setRenderSubHandle", _SE(js_renderer_MaskRenderHandle_setRenderSubHandle));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_MaskRenderHandle_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::MaskRenderHandle>(cls);

    __jsb_cocos2d_renderer_MaskRenderHandle_proto = cls->getProto();
    __jsb_cocos2d_renderer_MaskRenderHandle_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_renderer(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("renderer", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("renderer", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_renderer_RenderFlow(ns);
    js_register_renderer_ProgramLib(ns);
    js_register_renderer_CustomRenderHandle(ns);
    js_register_renderer_GraphicsRenderHandle(ns);
    js_register_renderer_Light(ns);
    js_register_renderer_Scene(ns);
    js_register_renderer_ModelBatcher(ns);
    js_register_renderer_Effect(ns);
    js_register_renderer_RenderHandle(ns);
    js_register_renderer_NodeProxy(ns);
    js_register_renderer_MeshBuffer(ns);
    js_register_renderer_Camera(ns);
    js_register_renderer_BaseRenderer(ns);
    js_register_renderer_Pass(ns);
    js_register_renderer_MaskRenderHandle(ns);
    js_register_renderer_ForwardRenderer(ns);
    js_register_renderer_View(ns);
    return true;
}

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
