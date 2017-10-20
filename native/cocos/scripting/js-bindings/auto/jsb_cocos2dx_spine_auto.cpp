#include "scripting/js-bindings/auto/jsb_cocos2dx_spine_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "spine/spine-cocos2dx.h"

se::Object* __jsb_spine_SkeletonRenderer_proto = nullptr;
se::Class* __jsb_spine_SkeletonRenderer_class = nullptr;

static bool js_cocos2dx_spine_SkeletonRenderer_setTimeScale(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_setTimeScale)

static bool js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getDebugSlotsEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled)

static bool js_cocos2dx_spine_SkeletonRenderer_setAttachment(se::State& s)
{
    CC_UNUSED bool ok = true;
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_spine_SkeletonRenderer_setAttachment : Invalid Native Object");
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
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_setAttachment : Error processing arguments");
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
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_setAttachment : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_setAttachment)

static bool js_cocos2dx_spine_SkeletonRenderer_setBonesToSetupPose(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_setBonesToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setBonesToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_setBonesToSetupPose)

static bool js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled : Error processing arguments");
        cobj->setDebugSlotsEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled)

static bool js_cocos2dx_spine_SkeletonRenderer_initWithJsonFile(se::State& s)
{
    CC_UNUSED bool ok = true;
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_spine_SkeletonRenderer_initWithJsonFile : Invalid Native Object");
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
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_initWithJsonFile)

static bool js_cocos2dx_spine_SkeletonRenderer_setSlotsToSetupPose(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_setSlotsToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setSlotsToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_setSlotsToSetupPose)

static bool js_cocos2dx_spine_SkeletonRenderer_initWithBinaryFile(se::State& s)
{
    CC_UNUSED bool ok = true;
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_spine_SkeletonRenderer_initWithBinaryFile : Invalid Native Object");
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
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_initWithBinaryFile)

static bool js_cocos2dx_spine_SkeletonRenderer_setToSetupPose(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_setToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_setToSetupPose)

static bool js_cocos2dx_spine_SkeletonRenderer_getBlendFunc(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_getBlendFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::BlendFunc& result = cobj->getBlendFunc();
        ok &= blendfunc_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_getBlendFunc : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_getBlendFunc)

static bool js_cocos2dx_spine_SkeletonRenderer_updateWorldTransform(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_updateWorldTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateWorldTransform();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_updateWorldTransform)

static bool js_cocos2dx_spine_SkeletonRenderer_getAttachment(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_getAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_getAttachment : Error processing arguments");
        spAttachment* result = cobj->getAttachment(arg0, arg1);
        ok &= spattachment_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_getAttachment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_getAttachment)

static bool js_cocos2dx_spine_SkeletonRenderer_initialize(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initialize();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_initialize)

static bool js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled : Error processing arguments");
        cobj->setDebugBonesEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled)

static bool js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getDebugBonesEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled)

static bool js_cocos2dx_spine_SkeletonRenderer_getTimeScale(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_getTimeScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_getTimeScale)

static bool js_cocos2dx_spine_SkeletonRenderer_setBlendFunc(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_setBlendFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::BlendFunc arg0;
        ok &= seval_to_blendfunc(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_setBlendFunc : Error processing arguments");
        cobj->setBlendFunc(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_setBlendFunc)

static bool js_cocos2dx_spine_SkeletonRenderer_setSkin(se::State& s)
{
    CC_UNUSED bool ok = true;
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_spine_SkeletonRenderer_setSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            const char* arg0 = nullptr;
            std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
            if (!ok) { ok = true; break; }
            bool result = cobj->setSkin(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_setSkin : Error processing arguments");
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
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_setSkin : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_setSkin)

static bool js_cocos2dx_spine_SkeletonRenderer_findSlot(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_findSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_findSlot : Error processing arguments");
        spSlot* result = cobj->findSlot(arg0);
        ok &= spslot_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_findSlot : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_findSlot)

static bool js_cocos2dx_spine_SkeletonRenderer_getSkeleton(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_getSkeleton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spSkeleton* result = cobj->getSkeleton();
        ok &= spskeleton_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_getSkeleton : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_getSkeleton)

static bool js_cocos2dx_spine_SkeletonRenderer_findBone(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_findBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_findBone : Error processing arguments");
        spBone* result = cobj->findBone(arg0);
        ok &= spbone_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_findBone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_findBone)

static bool js_cocos2dx_spine_SkeletonRenderer_drawDebug(se::State& s)
{
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonRenderer_drawDebug : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::Renderer* arg0 = nullptr;
        cocos2d::Mat4 arg1;
        unsigned int arg2 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_Mat4(args[1], &arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_drawDebug : Error processing arguments");
        cobj->drawDebug(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_drawDebug)

static bool js_cocos2dx_spine_SkeletonRenderer_createWithFile(se::State& s)
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
            spine::SkeletonRenderer* result = spine::SkeletonRenderer::createWithFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SkeletonRenderer>((spine::SkeletonRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : Error processing arguments");
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
            spine::SkeletonRenderer* result = spine::SkeletonRenderer::createWithFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SkeletonRenderer>((spine::SkeletonRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            spine::SkeletonRenderer* result = spine::SkeletonRenderer::create();
            ok &= native_ptr_to_seval<spine::SkeletonRenderer>((spine::SkeletonRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : Error processing arguments");
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
            spine::SkeletonRenderer* result = spine::SkeletonRenderer::createWithFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SkeletonRenderer>((spine::SkeletonRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : Error processing arguments");
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
            spine::SkeletonRenderer* result = spine::SkeletonRenderer::createWithFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SkeletonRenderer>((spine::SkeletonRenderer*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonRenderer_createWithFile)

SE_DECLARE_FINALIZE_FUNC(js_spine_SkeletonRenderer_finalize)

static bool js_cocos2dx_spine_SkeletonRenderer_constructor(se::State& s)
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
            spine::SkeletonRenderer* cobj = new (std::nothrow) spine::SkeletonRenderer(arg0);
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
            spine::SkeletonRenderer* cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            spine::SkeletonRenderer* cobj = new (std::nothrow) spine::SkeletonRenderer();
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
            spine::SkeletonRenderer* cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1);
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
            spine::SkeletonRenderer* cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1, arg2);
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
            spine::SkeletonRenderer* cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1);
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
            spine::SkeletonRenderer* cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_cocos2dx_spine_SkeletonRenderer_constructor, __jsb_spine_SkeletonRenderer_class, js_spine_SkeletonRenderer_finalize)



extern se::Object* __jsb_cocos2d_Node_proto;

static bool js_spine_SkeletonRenderer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (spine::SkeletonRenderer)", s.nativeThisObject());
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_SkeletonRenderer_finalize)

bool js_register_cocos2dx_spine_SkeletonRenderer(se::Object* obj)
{
    auto cls = se::Class::create("Skeleton", obj, __jsb_cocos2d_Node_proto, _SE(js_cocos2dx_spine_SkeletonRenderer_constructor));

    cls->defineFunction("setTimeScale", _SE(js_cocos2dx_spine_SkeletonRenderer_setTimeScale));
    cls->defineFunction("getDebugSlotsEnabled", _SE(js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled));
    cls->defineFunction("setAttachment", _SE(js_cocos2dx_spine_SkeletonRenderer_setAttachment));
    cls->defineFunction("setBonesToSetupPose", _SE(js_cocos2dx_spine_SkeletonRenderer_setBonesToSetupPose));
    cls->defineFunction("setDebugSlotsEnabled", _SE(js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled));
    cls->defineFunction("initWithJsonFile", _SE(js_cocos2dx_spine_SkeletonRenderer_initWithJsonFile));
    cls->defineFunction("setSlotsToSetupPose", _SE(js_cocos2dx_spine_SkeletonRenderer_setSlotsToSetupPose));
    cls->defineFunction("initWithBinaryFile", _SE(js_cocos2dx_spine_SkeletonRenderer_initWithBinaryFile));
    cls->defineFunction("setToSetupPose", _SE(js_cocos2dx_spine_SkeletonRenderer_setToSetupPose));
    cls->defineFunction("getBlendFunc", _SE(js_cocos2dx_spine_SkeletonRenderer_getBlendFunc));
    cls->defineFunction("updateWorldTransform", _SE(js_cocos2dx_spine_SkeletonRenderer_updateWorldTransform));
    cls->defineFunction("getAttachment", _SE(js_cocos2dx_spine_SkeletonRenderer_getAttachment));
    cls->defineFunction("initialize", _SE(js_cocos2dx_spine_SkeletonRenderer_initialize));
    cls->defineFunction("setDebugBonesEnabled", _SE(js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled));
    cls->defineFunction("getDebugBonesEnabled", _SE(js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled));
    cls->defineFunction("getTimeScale", _SE(js_cocos2dx_spine_SkeletonRenderer_getTimeScale));
    cls->defineFunction("setBlendFunc", _SE(js_cocos2dx_spine_SkeletonRenderer_setBlendFunc));
    cls->defineFunction("setSkin", _SE(js_cocos2dx_spine_SkeletonRenderer_setSkin));
    cls->defineFunction("findSlot", _SE(js_cocos2dx_spine_SkeletonRenderer_findSlot));
    cls->defineFunction("getSkeleton", _SE(js_cocos2dx_spine_SkeletonRenderer_getSkeleton));
    cls->defineFunction("findBone", _SE(js_cocos2dx_spine_SkeletonRenderer_findBone));
    cls->defineFunction("drawDebug", _SE(js_cocos2dx_spine_SkeletonRenderer_drawDebug));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_spine_SkeletonRenderer_createWithFile));
    cls->defineFinalizeFunction(_SE(js_spine_SkeletonRenderer_finalize));
    cls->install();
    JSBClassType::registerClass<spine::SkeletonRenderer>(cls);

    __jsb_spine_SkeletonRenderer_proto = cls->getProto();
    __jsb_spine_SkeletonRenderer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_spine_SkeletonAnimation_proto = nullptr;
se::Class* __jsb_spine_SkeletonAnimation_class = nullptr;

static bool js_cocos2dx_spine_SkeletonAnimation_setAnimation(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_setAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        int arg0 = 0;
        std::string arg1;
        bool arg2;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setAnimation : Error processing arguments");
        spTrackEntry* result = cobj->setAnimation(arg0, arg1, arg2);
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_setAnimation)

static bool js_cocos2dx_spine_SkeletonAnimation_findAnimation(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_findAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_findAnimation : Error processing arguments");
        spAnimation* result = cobj->findAnimation(arg0);
        ok &= spanimation_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_findAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_findAnimation)

static bool js_cocos2dx_spine_SkeletonAnimation_setMix(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_setMix : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setMix : Error processing arguments");
        cobj->setMix(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_setMix)

static bool js_cocos2dx_spine_SkeletonAnimation_setDisposeListener(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_setDisposeListener : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setDisposeListener : Error processing arguments");
        cobj->setDisposeListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_setDisposeListener)

static bool js_cocos2dx_spine_SkeletonAnimation_setAnimationStateData(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_setAnimationStateData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        spAnimationStateData* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR spAnimationStateData*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setAnimationStateData : Error processing arguments");
        cobj->setAnimationStateData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_setAnimationStateData)

static bool js_cocos2dx_spine_SkeletonAnimation_setEndListener(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_setEndListener : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setEndListener : Error processing arguments");
        cobj->setEndListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_setEndListener)

static bool js_cocos2dx_spine_SkeletonAnimation_getState(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spAnimationState* result = cobj->getState();
        ok &= spanimationstate_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_getState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_getState)

static bool js_cocos2dx_spine_SkeletonAnimation_setCompleteListener(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_setCompleteListener : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setCompleteListener : Error processing arguments");
        cobj->setCompleteListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_setCompleteListener)

static bool js_cocos2dx_spine_SkeletonAnimation_getCurrent(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_getCurrent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spTrackEntry* result = cobj->getCurrent();
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_getCurrent : Error processing arguments");
        return true;
    }
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_getCurrent : Error processing arguments");
        spTrackEntry* result = cobj->getCurrent(arg0);
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_getCurrent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_getCurrent)

static bool js_cocos2dx_spine_SkeletonAnimation_setEventListener(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_setEventListener : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setEventListener : Error processing arguments");
        cobj->setEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_setEventListener)

static bool js_cocos2dx_spine_SkeletonAnimation_clearTrack(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_clearTrack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->clearTrack();
        return true;
    }
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_clearTrack : Error processing arguments");
        cobj->clearTrack(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_clearTrack)

static bool js_cocos2dx_spine_SkeletonAnimation_setInterruptListener(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_setInterruptListener : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setInterruptListener : Error processing arguments");
        cobj->setInterruptListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_setInterruptListener)

static bool js_cocos2dx_spine_SkeletonAnimation_addAnimation(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_addAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        int arg0 = 0;
        std::string arg1;
        bool arg2;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_addAnimation : Error processing arguments");
        spTrackEntry* result = cobj->addAnimation(arg0, arg1, arg2);
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_addAnimation : Error processing arguments");
        return true;
    }
    if (argc == 4) {
        int arg0 = 0;
        std::string arg1;
        bool arg2;
        float arg3 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_addAnimation : Error processing arguments");
        spTrackEntry* result = cobj->addAnimation(arg0, arg1, arg2, arg3);
        ok &= sptrackentry_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_addAnimation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_addAnimation)

static bool js_cocos2dx_spine_SkeletonAnimation_clearTracks(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_clearTracks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearTracks();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_clearTracks)

static bool js_cocos2dx_spine_SkeletonAnimation_setStartListener(se::State& s)
{
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_spine_SkeletonAnimation_setStartListener : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_setStartListener : Error processing arguments");
        cobj->setStartListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_setStartListener)

static bool js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile(se::State& s)
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
            spine::SkeletonAnimation* result = spine::SkeletonAnimation::createWithBinaryFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SkeletonAnimation>((spine::SkeletonAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile : Error processing arguments");
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
            spine::SkeletonAnimation* result = spine::SkeletonAnimation::createWithBinaryFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SkeletonAnimation>((spine::SkeletonAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile : Error processing arguments");
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
            spine::SkeletonAnimation* result = spine::SkeletonAnimation::createWithBinaryFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SkeletonAnimation>((spine::SkeletonAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile : Error processing arguments");
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
            spine::SkeletonAnimation* result = spine::SkeletonAnimation::createWithBinaryFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SkeletonAnimation>((spine::SkeletonAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile)

static bool js_cocos2dx_spine_SkeletonAnimation_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = spine::SkeletonAnimation::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_spine_SkeletonAnimation_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_create)

static bool js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile(se::State& s)
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
            spine::SkeletonAnimation* result = spine::SkeletonAnimation::createWithJsonFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SkeletonAnimation>((spine::SkeletonAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile : Error processing arguments");
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
            spine::SkeletonAnimation* result = spine::SkeletonAnimation::createWithJsonFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SkeletonAnimation>((spine::SkeletonAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile : Error processing arguments");
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
            spine::SkeletonAnimation* result = spine::SkeletonAnimation::createWithJsonFile(arg0, arg1);
            ok &= native_ptr_to_seval<spine::SkeletonAnimation>((spine::SkeletonAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile : Error processing arguments");
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
            spine::SkeletonAnimation* result = spine::SkeletonAnimation::createWithJsonFile(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<spine::SkeletonAnimation>((spine::SkeletonAnimation*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile)

SE_DECLARE_FINALIZE_FUNC(js_spine_SkeletonAnimation_finalize)

static bool js_cocos2dx_spine_SkeletonAnimation_constructor(se::State& s)
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0);
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation();
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1, arg2);
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_cocos2dx_spine_SkeletonAnimation_constructor, __jsb_spine_SkeletonAnimation_class, js_spine_SkeletonAnimation_finalize)

SE_DECLARE_FINALIZE_FUNC(js_spine_SkeletonAnimation_finalize)

static bool js_cocos2dx_spine_SkeletonAnimation_ctor(se::State& s)
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0);
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation();
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1, arg2);
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);
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
            spine::SkeletonAnimation* cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_spine_SkeletonAnimation_ctor, __jsb_spine_SkeletonAnimation_class, js_spine_SkeletonAnimation_finalize)


    

extern se::Object* __jsb_spine_SkeletonRenderer_proto;

static bool js_spine_SkeletonAnimation_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (spine::SkeletonAnimation)", s.nativeThisObject());
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_SkeletonAnimation_finalize)

bool js_register_cocos2dx_spine_SkeletonAnimation(se::Object* obj)
{
    auto cls = se::Class::create("SkeletonAnimation", obj, __jsb_spine_SkeletonRenderer_proto, _SE(js_cocos2dx_spine_SkeletonAnimation_constructor));

    cls->defineFunction("setAnimation", _SE(js_cocos2dx_spine_SkeletonAnimation_setAnimation));
    cls->defineFunction("findAnimation", _SE(js_cocos2dx_spine_SkeletonAnimation_findAnimation));
    cls->defineFunction("setMix", _SE(js_cocos2dx_spine_SkeletonAnimation_setMix));
    cls->defineFunction("setDisposeListener", _SE(js_cocos2dx_spine_SkeletonAnimation_setDisposeListener));
    cls->defineFunction("setAnimationStateData", _SE(js_cocos2dx_spine_SkeletonAnimation_setAnimationStateData));
    cls->defineFunction("setEndListener", _SE(js_cocos2dx_spine_SkeletonAnimation_setEndListener));
    cls->defineFunction("getState", _SE(js_cocos2dx_spine_SkeletonAnimation_getState));
    cls->defineFunction("setCompleteListenerNative", _SE(js_cocos2dx_spine_SkeletonAnimation_setCompleteListener));
    cls->defineFunction("getCurrent", _SE(js_cocos2dx_spine_SkeletonAnimation_getCurrent));
    cls->defineFunction("setEventListener", _SE(js_cocos2dx_spine_SkeletonAnimation_setEventListener));
    cls->defineFunction("clearTrack", _SE(js_cocos2dx_spine_SkeletonAnimation_clearTrack));
    cls->defineFunction("setInterruptListener", _SE(js_cocos2dx_spine_SkeletonAnimation_setInterruptListener));
    cls->defineFunction("addAnimation", _SE(js_cocos2dx_spine_SkeletonAnimation_addAnimation));
    cls->defineFunction("clearTracks", _SE(js_cocos2dx_spine_SkeletonAnimation_clearTracks));
    cls->defineFunction("setStartListener", _SE(js_cocos2dx_spine_SkeletonAnimation_setStartListener));
    cls->defineFunction("ctor", _SE(js_cocos2dx_spine_SkeletonAnimation_ctor));
    cls->defineStaticFunction("createWithBinaryFile", _SE(js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_spine_SkeletonAnimation_create));
    cls->defineStaticFunction("createWithJsonFile", _SE(js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile));
    cls->defineFinalizeFunction(_SE(js_spine_SkeletonAnimation_finalize));
    cls->install();
    JSBClassType::registerClass<spine::SkeletonAnimation>(cls);

    __jsb_spine_SkeletonAnimation_proto = cls->getProto();
    __jsb_spine_SkeletonAnimation_class = cls;

    jsb_set_extend_property("sp", "SkeletonAnimation");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_spine(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("sp", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("sp", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_cocos2dx_spine_SkeletonRenderer(ns);
    js_register_cocos2dx_spine_SkeletonAnimation(ns);
    return true;
}

