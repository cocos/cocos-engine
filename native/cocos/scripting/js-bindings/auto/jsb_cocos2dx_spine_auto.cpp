#include "scripting/js-bindings/auto/jsb_cocos2dx_spine_auto.hpp"
#if USE_SPINE > 0
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "spine-creator-support/spine-cocos2dx.h"

se::Object* __jsb_spine_SpineRenderer_proto = nullptr;
se::Class* __jsb_spine_SpineRenderer_class = nullptr;

static bool js_cocos2dx_spine_SpineRenderer_setTimeScale(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setTimeScale)

static bool js_cocos2dx_spine_SpineRenderer_paused(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_paused : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_paused : Error processing arguments");
        cobj->paused(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_paused)

static bool js_cocos2dx_spine_SpineRenderer_setAttachment(se::State& s)
{
    CC_UNUSED bool ok = true;
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_spine_SpineRenderer_setAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            const char* arg1 = nullptr;
            std::string arg1_tmp; ok &= seval_to_std_string(args[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
            if (!ok) { ok = true; break; }
            bool result = cobj->setAttachment(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_setAttachment : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->setAttachment(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_setAttachment : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setAttachment)

static bool js_cocos2dx_spine_SpineRenderer_setBonesToSetupPose(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_setBonesToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setBonesToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setBonesToSetupPose)

static bool js_cocos2dx_spine_SpineRenderer_setSlotsToSetupPose(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_setSlotsToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setSlotsToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setSlotsToSetupPose)

static bool js_cocos2dx_spine_SpineRenderer_isOpacityModifyRGB(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_isOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isOpacityModifyRGB();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_isOpacityModifyRGB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_isOpacityModifyRGB)

static bool js_cocos2dx_spine_SpineRenderer_setDebugSlotsEnabled(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_setDebugSlotsEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_setDebugSlotsEnabled : Error processing arguments");
        cobj->setDebugSlotsEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setDebugSlotsEnabled)

static bool js_cocos2dx_spine_SpineRenderer_getMaterialData(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_getMaterialData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se_object_ptr result = cobj->getMaterialData();
        s.rval().setObject(result);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_getMaterialData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_getMaterialData)

static bool js_cocos2dx_spine_SpineRenderer_initWithJsonFile(se::State& s)
{
    CC_UNUSED bool ok = true;
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_spine_SpineRenderer_initWithJsonFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cobj->initWithJsonFile(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cobj->initWithJsonFile(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            cobj->initWithJsonFile(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cobj->initWithJsonFile(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_initWithJsonFile)

static bool js_cocos2dx_spine_SpineRenderer_setToSetupPose(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_setToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setToSetupPose)

static bool js_cocos2dx_spine_SpineRenderer_setOpacityModifyRGB(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_setOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_setOpacityModifyRGB : Error processing arguments");
        cobj->setOpacityModifyRGB(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setOpacityModifyRGB)

static bool js_cocos2dx_spine_SpineRenderer_initWithBinaryFile(se::State& s)
{
    CC_UNUSED bool ok = true;
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_spine_SpineRenderer_initWithBinaryFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cobj->initWithBinaryFile(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cobj->initWithBinaryFile(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            cobj->initWithBinaryFile(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cobj->initWithBinaryFile(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_initWithBinaryFile)

static bool js_cocos2dx_spine_SpineRenderer_onEnable(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_onEnable)

static bool js_cocos2dx_spine_SpineRenderer_beginSchedule(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_beginSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_beginSchedule)

static bool js_cocos2dx_spine_SpineRenderer_getDebugData(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_getDebugData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se_object_ptr result = cobj->getDebugData();
        s.rval().setObject(result);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_getDebugData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_getDebugData)

static bool js_cocos2dx_spine_SpineRenderer_update(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_update)

static bool js_cocos2dx_spine_SpineRenderer_getAttachment(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_getAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_getAttachment : Error processing arguments");
        spAttachment* result = cobj->getAttachment(arg0, arg1);
        ok &= spattachment_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_getAttachment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_getAttachment)

static bool js_cocos2dx_spine_SpineRenderer_initialize(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initialize();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_initialize)

static bool js_cocos2dx_spine_SpineRenderer_setDebugBonesEnabled(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_setDebugBonesEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_setDebugBonesEnabled : Error processing arguments");
        cobj->setDebugBonesEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setDebugBonesEnabled)

static bool js_cocos2dx_spine_SpineRenderer_getTimeScale(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_getTimeScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_getTimeScale)

static bool js_cocos2dx_spine_SpineRenderer_stopSchedule(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_stopSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_stopSchedule)

static bool js_cocos2dx_spine_SpineRenderer_onDisable(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_onDisable)

static bool js_cocos2dx_spine_SpineRenderer_setColor(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_setColor : Error processing arguments");
        cobj->setColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setColor)

static bool js_cocos2dx_spine_SpineRenderer_setSkin(se::State& s)
{
    CC_UNUSED bool ok = true;
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_spine_SpineRenderer_setSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            const char* arg0 = nullptr;
            std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
            if (!ok) { ok = true; break; }
            bool result = cobj->setSkin(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_setSkin : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->setSkin(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_setSkin : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_setSkin)

static bool js_cocos2dx_spine_SpineRenderer_findSlot(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_findSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_findSlot : Error processing arguments");
        spSlot* result = cobj->findSlot(arg0);
        ok &= spslot_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_findSlot : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_findSlot)

static bool js_cocos2dx_spine_SpineRenderer_updateWorldTransform(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_updateWorldTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateWorldTransform();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_updateWorldTransform)

static bool js_cocos2dx_spine_SpineRenderer_getSkeleton(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_getSkeleton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spSkeleton* result = cobj->getSkeleton();
        ok &= spskeleton_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_getSkeleton : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_getSkeleton)

static bool js_cocos2dx_spine_SpineRenderer_findBone(se::State& s)
{
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineRenderer_findBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_findBone : Error processing arguments");
        spBone* result = cobj->findBone(arg0);
        ok &= spbone_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_findBone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_findBone)

static bool js_cocos2dx_spine_SpineRenderer_createWithFile(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* result = spine::SpineRenderer::createWithFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SpineRenderer>((spine::SpineRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_createWithFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* result = spine::SpineRenderer::createWithFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SpineRenderer>((spine::SpineRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_createWithFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            spine::SpineRenderer* result = spine::SpineRenderer::create();
            ok &= native_ptr_to_seval<spine::SpineRenderer>((spine::SpineRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_createWithFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* result = spine::SpineRenderer::createWithFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SpineRenderer>((spine::SpineRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_createWithFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* result = spine::SpineRenderer::createWithFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SpineRenderer>((spine::SpineRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineRenderer_createWithFile : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineRenderer_createWithFile)

SE_DECLARE_FINALIZE_FUNC(js_spine_SpineRenderer_finalize)

static bool js_cocos2dx_spine_SpineRenderer_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
            ok = false;
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* cobj = new (std::nothrow) spine::SpineRenderer(arg0);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
            ok = false;
            if (!ok) { ok = true; break; }
            bool arg1;
            ok &= seval_to_boolean(args[1], &arg1);
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* cobj = new (std::nothrow) spine::SpineRenderer(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            spine::SpineRenderer* cobj = new (std::nothrow) spine::SpineRenderer();
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* cobj = new (std::nothrow) spine::SpineRenderer(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* cobj = new (std::nothrow) spine::SpineRenderer(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* cobj = new (std::nothrow) spine::SpineRenderer(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineRenderer* cobj = new (std::nothrow) spine::SpineRenderer(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_cocos2dx_spine_SpineRenderer_constructor, __jsb_spine_SpineRenderer_class, js_spine_SpineRenderer_finalize)




static bool js_spine_SpineRenderer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (spine::SpineRenderer)", s.nativeThisObject());
    spine::SpineRenderer* cobj = (spine::SpineRenderer*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_SpineRenderer_finalize)

bool js_register_cocos2dx_spine_SpineRenderer(se::Object* obj)
{
    auto cls = se::Class::create("Skeleton", obj, nullptr, _SE(js_cocos2dx_spine_SpineRenderer_constructor));

    cls->defineFunction("setTimeScale", _SE(js_cocos2dx_spine_SpineRenderer_setTimeScale));
    cls->defineFunction("paused", _SE(js_cocos2dx_spine_SpineRenderer_paused));
    cls->defineFunction("setAttachment", _SE(js_cocos2dx_spine_SpineRenderer_setAttachment));
    cls->defineFunction("setBonesToSetupPose", _SE(js_cocos2dx_spine_SpineRenderer_setBonesToSetupPose));
    cls->defineFunction("setSlotsToSetupPose", _SE(js_cocos2dx_spine_SpineRenderer_setSlotsToSetupPose));
    cls->defineFunction("isOpacityModifyRGB", _SE(js_cocos2dx_spine_SpineRenderer_isOpacityModifyRGB));
    cls->defineFunction("setDebugSlotsEnabled", _SE(js_cocos2dx_spine_SpineRenderer_setDebugSlotsEnabled));
    cls->defineFunction("getMaterialData", _SE(js_cocos2dx_spine_SpineRenderer_getMaterialData));
    cls->defineFunction("initWithJsonFile", _SE(js_cocos2dx_spine_SpineRenderer_initWithJsonFile));
    cls->defineFunction("setToSetupPose", _SE(js_cocos2dx_spine_SpineRenderer_setToSetupPose));
    cls->defineFunction("setOpacityModifyRGB", _SE(js_cocos2dx_spine_SpineRenderer_setOpacityModifyRGB));
    cls->defineFunction("initWithBinaryFile", _SE(js_cocos2dx_spine_SpineRenderer_initWithBinaryFile));
    cls->defineFunction("onEnable", _SE(js_cocos2dx_spine_SpineRenderer_onEnable));
    cls->defineFunction("beginSchedule", _SE(js_cocos2dx_spine_SpineRenderer_beginSchedule));
    cls->defineFunction("getDebugData", _SE(js_cocos2dx_spine_SpineRenderer_getDebugData));
    cls->defineFunction("update", _SE(js_cocos2dx_spine_SpineRenderer_update));
    cls->defineFunction("getAttachment", _SE(js_cocos2dx_spine_SpineRenderer_getAttachment));
    cls->defineFunction("initialize", _SE(js_cocos2dx_spine_SpineRenderer_initialize));
    cls->defineFunction("setDebugBonesEnabled", _SE(js_cocos2dx_spine_SpineRenderer_setDebugBonesEnabled));
    cls->defineFunction("getTimeScale", _SE(js_cocos2dx_spine_SpineRenderer_getTimeScale));
    cls->defineFunction("stopSchedule", _SE(js_cocos2dx_spine_SpineRenderer_stopSchedule));
    cls->defineFunction("onDisable", _SE(js_cocos2dx_spine_SpineRenderer_onDisable));
    cls->defineFunction("setColor", _SE(js_cocos2dx_spine_SpineRenderer_setColor));
    cls->defineFunction("setSkin", _SE(js_cocos2dx_spine_SpineRenderer_setSkin));
    cls->defineFunction("findSlot", _SE(js_cocos2dx_spine_SpineRenderer_findSlot));
    cls->defineFunction("updateWorldTransform", _SE(js_cocos2dx_spine_SpineRenderer_updateWorldTransform));
    cls->defineFunction("getSkeleton", _SE(js_cocos2dx_spine_SpineRenderer_getSkeleton));
    cls->defineFunction("findBone", _SE(js_cocos2dx_spine_SpineRenderer_findBone));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_spine_SpineRenderer_createWithFile));
    cls->defineFinalizeFunction(_SE(js_spine_SpineRenderer_finalize));
    cls->install();
    JSBClassType::registerClass<spine::SpineRenderer>(cls);

    __jsb_spine_SpineRenderer_proto = cls->getProto();
    __jsb_spine_SpineRenderer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_spine_SpineAnimation_proto = nullptr;
se::Class* __jsb_spine_SpineAnimation_class = nullptr;

static bool js_cocos2dx_spine_SpineAnimation_setAnimation(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_setAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        int arg0 = 0;
        std::string arg1;
        bool arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setAnimation : Error processing arguments");
        spTrackEntry* result = cobj->setAnimation(arg0, arg1, arg2);
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_setAnimation)

static bool js_cocos2dx_spine_SpineAnimation_findAnimation(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_findAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_findAnimation : Error processing arguments");
        spAnimation* result = cobj->findAnimation(arg0);
        ok &= spanimation_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_findAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_findAnimation)

static bool js_cocos2dx_spine_SpineAnimation_setMix(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_setMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        float arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setMix : Error processing arguments");
        cobj->setMix(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_setMix)

static bool js_cocos2dx_spine_SpineAnimation_setDisposeListener(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_setDisposeListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spTrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= sptrackentry_to_seval(larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setDisposeListener : Error processing arguments");
        cobj->setDisposeListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_setDisposeListener)

static bool js_cocos2dx_spine_SpineAnimation_setAnimationStateData(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_setAnimationStateData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        spAnimationStateData* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR spAnimationStateData*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setAnimationStateData : Error processing arguments");
        cobj->setAnimationStateData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_setAnimationStateData)

static bool js_cocos2dx_spine_SpineAnimation_setEndListener(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_setEndListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spTrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= sptrackentry_to_seval(larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setEndListener : Error processing arguments");
        cobj->setEndListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_setEndListener)

static bool js_cocos2dx_spine_SpineAnimation_getState(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spAnimationState* result = cobj->getState();
        ok &= spanimationstate_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_getState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_getState)

static bool js_cocos2dx_spine_SpineAnimation_setCompleteListener(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_setCompleteListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spTrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= sptrackentry_to_seval(larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setCompleteListener : Error processing arguments");
        cobj->setCompleteListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_setCompleteListener)

static bool js_cocos2dx_spine_SpineAnimation_getCurrent(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_getCurrent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spTrackEntry* result = cobj->getCurrent();
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_getCurrent : Error processing arguments");
        return true;
    }
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_getCurrent : Error processing arguments");
        spTrackEntry* result = cobj->getCurrent(arg0);
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_getCurrent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_getCurrent)

static bool js_cocos2dx_spine_SpineAnimation_setEventListener(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_setEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (spTrackEntry *, spEvent *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spTrackEntry* larg0, spEvent* larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= sptrackentry_to_seval(larg0, &args[0]);
                    ok &= spevent_to_seval(larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setEventListener : Error processing arguments");
        cobj->setEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_setEventListener)

static bool js_cocos2dx_spine_SpineAnimation_clearTrack(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_clearTrack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->clearTrack();
        return true;
    }
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_clearTrack : Error processing arguments");
        cobj->clearTrack(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_clearTrack)

static bool js_cocos2dx_spine_SpineAnimation_setInterruptListener(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_setInterruptListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spTrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= sptrackentry_to_seval(larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setInterruptListener : Error processing arguments");
        cobj->setInterruptListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_setInterruptListener)

static bool js_cocos2dx_spine_SpineAnimation_addAnimation(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_addAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        int arg0 = 0;
        std::string arg1;
        bool arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_addAnimation : Error processing arguments");
        spTrackEntry* result = cobj->addAnimation(arg0, arg1, arg2);
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_addAnimation : Error processing arguments");
        return true;
    }
    if (argc == 4) {
        int arg0 = 0;
        std::string arg1;
        bool arg2;
        float arg3 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_addAnimation : Error processing arguments");
        spTrackEntry* result = cobj->addAnimation(arg0, arg1, arg2, arg3);
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_addAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_addAnimation)

static bool js_cocos2dx_spine_SpineAnimation_clearTracks(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_clearTracks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearTracks();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_clearTracks)

static bool js_cocos2dx_spine_SpineAnimation_setStartListener(se::State& s)
{
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SpineAnimation_setStartListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spTrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= sptrackentry_to_seval(larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_setStartListener : Error processing arguments");
        cobj->setStartListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_setStartListener)

static bool js_cocos2dx_spine_SpineAnimation_createWithBinaryFile(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* result = spine::SpineAnimation::createWithBinaryFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SpineAnimation>((spine::SpineAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_createWithBinaryFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* result = spine::SpineAnimation::createWithBinaryFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SpineAnimation>((spine::SpineAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_createWithBinaryFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* result = spine::SpineAnimation::createWithBinaryFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SpineAnimation>((spine::SpineAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_createWithBinaryFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* result = spine::SpineAnimation::createWithBinaryFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SpineAnimation>((spine::SpineAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_createWithBinaryFile : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_createWithBinaryFile)

static bool js_cocos2dx_spine_SpineAnimation_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = spine::SpineAnimation::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_spine_SpineAnimation_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_create)

static bool js_cocos2dx_spine_SpineAnimation_createWithJsonFile(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* result = spine::SpineAnimation::createWithJsonFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SpineAnimation>((spine::SpineAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_createWithJsonFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* result = spine::SpineAnimation::createWithJsonFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SpineAnimation>((spine::SpineAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_createWithJsonFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* result = spine::SpineAnimation::createWithJsonFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SpineAnimation>((spine::SpineAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_createWithJsonFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* result = spine::SpineAnimation::createWithJsonFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SpineAnimation>((spine::SpineAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SpineAnimation_createWithJsonFile : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SpineAnimation_createWithJsonFile)

SE_DECLARE_FINALIZE_FUNC(js_spine_SpineAnimation_finalize)

static bool js_cocos2dx_spine_SpineAnimation_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
            ok = false;
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
            ok = false;
            if (!ok) { ok = true; break; }
            bool arg1;
            ok &= seval_to_boolean(args[1], &arg1);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation();
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_cocos2dx_spine_SpineAnimation_constructor, __jsb_spine_SpineAnimation_class, js_spine_SpineAnimation_finalize)

SE_DECLARE_FINALIZE_FUNC(js_spine_SpineAnimation_finalize)

static bool js_cocos2dx_spine_SpineAnimation_ctor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
            ok = false;
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
            ok = false;
            if (!ok) { ok = true; break; }
            bool arg1;
            ok &= seval_to_boolean(args[1], &arg1);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation();
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
            ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            spine::SpineAnimation* cobj = new (std::nothrow) spine::SpineAnimation(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_spine_SpineAnimation_ctor, __jsb_spine_SpineAnimation_class, js_spine_SpineAnimation_finalize)


    

extern se::Object* __jsb_spine_SpineRenderer_proto;

static bool js_spine_SpineAnimation_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (spine::SpineAnimation)", s.nativeThisObject());
    spine::SpineAnimation* cobj = (spine::SpineAnimation*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_SpineAnimation_finalize)

bool js_register_cocos2dx_spine_SpineAnimation(se::Object* obj)
{
    auto cls = se::Class::create("SpineAnimation", obj, __jsb_spine_SpineRenderer_proto, _SE(js_cocos2dx_spine_SpineAnimation_constructor));

    cls->defineFunction("setAnimation", _SE(js_cocos2dx_spine_SpineAnimation_setAnimation));
    cls->defineFunction("findAnimation", _SE(js_cocos2dx_spine_SpineAnimation_findAnimation));
    cls->defineFunction("setMix", _SE(js_cocos2dx_spine_SpineAnimation_setMix));
    cls->defineFunction("setDisposeListener", _SE(js_cocos2dx_spine_SpineAnimation_setDisposeListener));
    cls->defineFunction("setAnimationStateData", _SE(js_cocos2dx_spine_SpineAnimation_setAnimationStateData));
    cls->defineFunction("setEndListener", _SE(js_cocos2dx_spine_SpineAnimation_setEndListener));
    cls->defineFunction("getState", _SE(js_cocos2dx_spine_SpineAnimation_getState));
    cls->defineFunction("setCompleteListenerNative", _SE(js_cocos2dx_spine_SpineAnimation_setCompleteListener));
    cls->defineFunction("getCurrent", _SE(js_cocos2dx_spine_SpineAnimation_getCurrent));
    cls->defineFunction("setEventListener", _SE(js_cocos2dx_spine_SpineAnimation_setEventListener));
    cls->defineFunction("clearTrack", _SE(js_cocos2dx_spine_SpineAnimation_clearTrack));
    cls->defineFunction("setInterruptListener", _SE(js_cocos2dx_spine_SpineAnimation_setInterruptListener));
    cls->defineFunction("addAnimation", _SE(js_cocos2dx_spine_SpineAnimation_addAnimation));
    cls->defineFunction("clearTracks", _SE(js_cocos2dx_spine_SpineAnimation_clearTracks));
    cls->defineFunction("setStartListener", _SE(js_cocos2dx_spine_SpineAnimation_setStartListener));
    cls->defineFunction("ctor", _SE(js_cocos2dx_spine_SpineAnimation_ctor));
    cls->defineStaticFunction("createWithBinaryFile", _SE(js_cocos2dx_spine_SpineAnimation_createWithBinaryFile));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_spine_SpineAnimation_create));
    cls->defineStaticFunction("createWithJsonFile", _SE(js_cocos2dx_spine_SpineAnimation_createWithJsonFile));
    cls->defineFinalizeFunction(_SE(js_spine_SpineAnimation_finalize));
    cls->install();
    JSBClassType::registerClass<spine::SpineAnimation>(cls);

    __jsb_spine_SpineAnimation_proto = cls->getProto();
    __jsb_spine_SpineAnimation_class = cls;

    jsb_set_extend_property("spine", "SpineAnimation");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_spine(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("spine", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("spine", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_cocos2dx_spine_SpineRenderer(ns);
    js_register_cocos2dx_spine_SpineAnimation(ns);
    return true;
}

#endif //#if USE_SPINE > 0
