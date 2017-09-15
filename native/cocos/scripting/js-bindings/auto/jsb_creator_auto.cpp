#include "scripting/js-bindings/auto/jsb_creator_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "creator/CCScale9Sprite.h"
#include "creator/CCGraphicsNode.h"
#include "editor-support/creator/physics/CCPhysicsDebugDraw.h"
#include "editor-support/creator/physics/CCPhysicsUtils.h"
#include "editor-support/creator/physics/CCPhysicsContactListener.h"
#include "editor-support/creator/physics/CCPhysicsAABBQueryCallback.h"
#include "editor-support/creator/physics/CCPhysicsRayCastCallback.h"
#include "editor-support/creator/physics/CCPhysicsWorldManifoldWrapper.h"
#include "editor-support/creator/physics/CCPhysicsContactImpulse.h"
#include "editor-support/creator/CCCameraNode.h"

se::Object* __jsb_creator_Scale9SpriteV2_proto = nullptr;
se::Class* __jsb_creator_Scale9SpriteV2_class = nullptr;

static bool js_creator_Scale9SpriteV2_setTexture(se::State& s)
{
    CC_UNUSED bool ok = true;
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_creator_Scale9SpriteV2_setTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::Texture2D* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->setTexture(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setTexture : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->setTexture(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setTexture : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setTexture)

static bool js_creator_Scale9SpriteV2_getFillType(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getFillType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFillType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getFillType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getFillType)

static bool js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isTrimmedContentSizeEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled)

static bool js_creator_Scale9SpriteV2_getState(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getState();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getState)

static bool js_creator_Scale9SpriteV2_setState(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        creator::Scale9SpriteV2::State arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setState : Error processing arguments");
        cobj->setState(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setState)

static bool js_creator_Scale9SpriteV2_setInsetBottom(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setInsetBottom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setInsetBottom : Error processing arguments");
        cobj->setInsetBottom(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setInsetBottom)

static bool js_creator_Scale9SpriteV2_setFillRange(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setFillRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setFillRange : Error processing arguments");
        cobj->setFillRange(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setFillRange)

static bool js_creator_Scale9SpriteV2_getFillStart(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getFillStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFillStart();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getFillStart : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getFillStart)

static bool js_creator_Scale9SpriteV2_getFillRange(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getFillRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFillRange();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getFillRange : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getFillRange)

static bool js_creator_Scale9SpriteV2_setInsetTop(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setInsetTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setInsetTop : Error processing arguments");
        cobj->setInsetTop(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setInsetTop)

static bool js_creator_Scale9SpriteV2_setRenderingType(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setRenderingType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        creator::Scale9SpriteV2::RenderingType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setRenderingType : Error processing arguments");
        cobj->setRenderingType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setRenderingType)

static bool js_creator_Scale9SpriteV2_setDistortionOffset(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setDistortionOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setDistortionOffset : Error processing arguments");
        cobj->setDistortionOffset(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setDistortionOffset)

static bool js_creator_Scale9SpriteV2_setFillCenter(se::State& s)
{
    CC_UNUSED bool ok = true;
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_creator_Scale9SpriteV2_setFillCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            float arg0 = 0;
            ok &= seval_to_float(args[0], &arg0);
            if (!ok) { ok = true; break; }
            float arg1 = 0;
            ok &= seval_to_float(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cobj->setFillCenter(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cocos2d::Vec2 arg0;
            ok &= seval_to_Vec2(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setFillCenter(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setFillCenter)

static bool js_creator_Scale9SpriteV2_setSpriteFrame(se::State& s)
{
    CC_UNUSED bool ok = true;
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_creator_Scale9SpriteV2_setSpriteFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->setSpriteFrame(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setSpriteFrame : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->setSpriteFrame(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setSpriteFrame : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setSpriteFrame)

static bool js_creator_Scale9SpriteV2_getBlendFunc(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getBlendFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::BlendFunc& result = cobj->getBlendFunc();
        ok &= blendfunc_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getBlendFunc : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getBlendFunc)

static bool js_creator_Scale9SpriteV2_initWithTexture(se::State& s)
{
    CC_UNUSED bool ok = true;
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_creator_Scale9SpriteV2_initWithTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithTexture(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_initWithTexture : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cocos2d::Texture2D* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithTexture(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_initWithTexture : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_initWithTexture)

static bool js_creator_Scale9SpriteV2_getInsetLeft(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getInsetLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInsetLeft();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getInsetLeft : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getInsetLeft)

static bool js_creator_Scale9SpriteV2_getInsetBottom(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getInsetBottom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInsetBottom();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getInsetBottom : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getInsetBottom)

static bool js_creator_Scale9SpriteV2_setDistortionTiling(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setDistortionTiling : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setDistortionTiling : Error processing arguments");
        cobj->setDistortionTiling(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setDistortionTiling)

static bool js_creator_Scale9SpriteV2_getRenderingType(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getRenderingType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getRenderingType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getRenderingType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getRenderingType)

static bool js_creator_Scale9SpriteV2_setFillStart(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setFillStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setFillStart : Error processing arguments");
        cobj->setFillStart(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setFillStart)

static bool js_creator_Scale9SpriteV2_getInsetRight(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getInsetRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInsetRight();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getInsetRight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getInsetRight)

static bool js_creator_Scale9SpriteV2_setBlendFunc(se::State& s)
{
    CC_UNUSED bool ok = true;
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_creator_Scale9SpriteV2_setBlendFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
            if (!ok) { ok = true; break; }
            unsigned int arg1 = 0;
            ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
            if (!ok) { ok = true; break; }
            cobj->setBlendFunc(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cocos2d::BlendFunc arg0;
            ok &= seval_to_blendfunc(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setBlendFunc(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setBlendFunc)

static bool js_creator_Scale9SpriteV2_getFillCenter(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getFillCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getFillCenter();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getFillCenter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getFillCenter)

static bool js_creator_Scale9SpriteV2_getInsetTop(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_getInsetTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInsetTop();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_getInsetTop : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_getInsetTop)

static bool js_creator_Scale9SpriteV2_setInsetLeft(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setInsetLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setInsetLeft : Error processing arguments");
        cobj->setInsetLeft(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setInsetLeft)

static bool js_creator_Scale9SpriteV2_initWithSpriteFrame(se::State& s)
{
    CC_UNUSED bool ok = true;
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_creator_Scale9SpriteV2_initWithSpriteFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSpriteFrame(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_initWithSpriteFrame : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSpriteFrame(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_initWithSpriteFrame : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_initWithSpriteFrame)

static bool js_creator_Scale9SpriteV2_setFillType(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setFillType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        creator::Scale9SpriteV2::FillType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setFillType : Error processing arguments");
        cobj->setFillType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setFillType)

static bool js_creator_Scale9SpriteV2_setInsetRight(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_setInsetRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_setInsetRight : Error processing arguments");
        cobj->setInsetRight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_setInsetRight)

static bool js_creator_Scale9SpriteV2_enableTrimmedContentSize(se::State& s)
{
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_Scale9SpriteV2_enableTrimmedContentSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_Scale9SpriteV2_enableTrimmedContentSize : Error processing arguments");
        cobj->enableTrimmedContentSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_Scale9SpriteV2_enableTrimmedContentSize)

SE_DECLARE_FINALIZE_FUNC(js_creator_Scale9SpriteV2_finalize)

static bool js_creator_Scale9SpriteV2_constructor(se::State& s)
{
    creator::Scale9SpriteV2* cobj = new (std::nothrow) creator::Scale9SpriteV2();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_Scale9SpriteV2_constructor, __jsb_creator_Scale9SpriteV2_class, js_creator_Scale9SpriteV2_finalize)

static bool js_creator_Scale9SpriteV2_ctor(se::State& s)
{
    creator::Scale9SpriteV2* cobj = new (std::nothrow) creator::Scale9SpriteV2();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_creator_Scale9SpriteV2_ctor, __jsb_creator_Scale9SpriteV2_class, js_creator_Scale9SpriteV2_finalize)


    

extern se::Object* __jsb_cocos2d_Node_proto;

static bool js_creator_Scale9SpriteV2_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::Scale9SpriteV2)", s.nativeThisObject());
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_Scale9SpriteV2_finalize)

bool js_register_creator_Scale9SpriteV2(se::Object* obj)
{
    auto cls = se::Class::create("Scale9SpriteV2", obj, __jsb_cocos2d_Node_proto, _SE(js_creator_Scale9SpriteV2_constructor));

    cls->defineFunction("setTexture", _SE(js_creator_Scale9SpriteV2_setTexture));
    cls->defineFunction("getFillType", _SE(js_creator_Scale9SpriteV2_getFillType));
    cls->defineFunction("isTrimmedContentSizeEnabled", _SE(js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled));
    cls->defineFunction("getState", _SE(js_creator_Scale9SpriteV2_getState));
    cls->defineFunction("setState", _SE(js_creator_Scale9SpriteV2_setState));
    cls->defineFunction("setInsetBottom", _SE(js_creator_Scale9SpriteV2_setInsetBottom));
    cls->defineFunction("setFillRange", _SE(js_creator_Scale9SpriteV2_setFillRange));
    cls->defineFunction("getFillStart", _SE(js_creator_Scale9SpriteV2_getFillStart));
    cls->defineFunction("getFillRange", _SE(js_creator_Scale9SpriteV2_getFillRange));
    cls->defineFunction("setInsetTop", _SE(js_creator_Scale9SpriteV2_setInsetTop));
    cls->defineFunction("setRenderingType", _SE(js_creator_Scale9SpriteV2_setRenderingType));
    cls->defineFunction("setDistortionOffset", _SE(js_creator_Scale9SpriteV2_setDistortionOffset));
    cls->defineFunction("setFillCenter", _SE(js_creator_Scale9SpriteV2_setFillCenter));
    cls->defineFunction("setSpriteFrame", _SE(js_creator_Scale9SpriteV2_setSpriteFrame));
    cls->defineFunction("getBlendFunc", _SE(js_creator_Scale9SpriteV2_getBlendFunc));
    cls->defineFunction("initWithTexture", _SE(js_creator_Scale9SpriteV2_initWithTexture));
    cls->defineFunction("getInsetLeft", _SE(js_creator_Scale9SpriteV2_getInsetLeft));
    cls->defineFunction("getInsetBottom", _SE(js_creator_Scale9SpriteV2_getInsetBottom));
    cls->defineFunction("setDistortionTiling", _SE(js_creator_Scale9SpriteV2_setDistortionTiling));
    cls->defineFunction("getRenderingType", _SE(js_creator_Scale9SpriteV2_getRenderingType));
    cls->defineFunction("setFillStart", _SE(js_creator_Scale9SpriteV2_setFillStart));
    cls->defineFunction("getInsetRight", _SE(js_creator_Scale9SpriteV2_getInsetRight));
    cls->defineFunction("setBlendFunc", _SE(js_creator_Scale9SpriteV2_setBlendFunc));
    cls->defineFunction("getFillCenter", _SE(js_creator_Scale9SpriteV2_getFillCenter));
    cls->defineFunction("getInsetTop", _SE(js_creator_Scale9SpriteV2_getInsetTop));
    cls->defineFunction("setInsetLeft", _SE(js_creator_Scale9SpriteV2_setInsetLeft));
    cls->defineFunction("initWithSpriteFrame", _SE(js_creator_Scale9SpriteV2_initWithSpriteFrame));
    cls->defineFunction("setFillType", _SE(js_creator_Scale9SpriteV2_setFillType));
    cls->defineFunction("setInsetRight", _SE(js_creator_Scale9SpriteV2_setInsetRight));
    cls->defineFunction("enableTrimmedContentSize", _SE(js_creator_Scale9SpriteV2_enableTrimmedContentSize));
    cls->defineFunction("ctor", _SE(js_creator_Scale9SpriteV2_ctor));
    cls->defineFinalizeFunction(_SE(js_creator_Scale9SpriteV2_finalize));
    cls->install();
    JSBClassType::registerClass<creator::Scale9SpriteV2>(cls);

    __jsb_creator_Scale9SpriteV2_proto = cls->getProto();
    __jsb_creator_Scale9SpriteV2_class = cls;

    se::ScriptEngine::getInstance()->evalString("(function () { cc.Scale9SpriteV2.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_GraphicsNode_proto = nullptr;
se::Class* __jsb_creator_GraphicsNode_class = nullptr;

static bool js_creator_GraphicsNode_quadraticCurveTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_quadraticCurveTo : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_quadraticCurveTo : Error processing arguments");
        cobj->quadraticCurveTo(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_quadraticCurveTo)

static bool js_creator_GraphicsNode_moveTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_moveTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_moveTo : Error processing arguments");
        cobj->moveTo(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_moveTo)

static bool js_creator_GraphicsNode_lineTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_lineTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_lineTo : Error processing arguments");
        cobj->lineTo(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_lineTo)

static bool js_creator_GraphicsNode_stroke(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_stroke : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stroke();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_stroke)

static bool js_creator_GraphicsNode_arc(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_arc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        bool arg5;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        ok &= seval_to_boolean(args[5], &arg5);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_arc : Error processing arguments");
        cobj->arc(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_arc)

static bool js_creator_GraphicsNode_setLineJoin(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_setLineJoin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        creator::LineJoin arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_setLineJoin : Error processing arguments");
        cobj->setLineJoin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_setLineJoin)

static bool js_creator_GraphicsNode_close(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_close : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->close();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_close)

static bool js_creator_GraphicsNode_ellipse(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_ellipse : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_ellipse : Error processing arguments");
        cobj->ellipse(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_ellipse)

static bool js_creator_GraphicsNode_setLineWidth(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_setLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_setLineWidth)

static bool js_creator_GraphicsNode_fill(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_fill : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->fill();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_fill)

static bool js_creator_GraphicsNode_getStrokeColor(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_getStrokeColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color4F result = cobj->getStrokeColor();
        ok &= Color4F_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_getStrokeColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_getStrokeColor)

static bool js_creator_GraphicsNode_setLineCap(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_setLineCap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        creator::LineCap arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_setLineCap : Error processing arguments");
        cobj->setLineCap(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_setLineCap)

static bool js_creator_GraphicsNode_circle(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_circle : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_circle : Error processing arguments");
        cobj->circle(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_circle)

static bool js_creator_GraphicsNode_roundRect(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_roundRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_roundRect : Error processing arguments");
        cobj->roundRect(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_roundRect)

static bool js_creator_GraphicsNode_draw(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_draw : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_draw : Error processing arguments");
        cobj->draw(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_draw)

static bool js_creator_GraphicsNode_bezierCurveTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_bezierCurveTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        float arg5 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_bezierCurveTo : Error processing arguments");
        cobj->bezierCurveTo(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_bezierCurveTo)

static bool js_creator_GraphicsNode_arcTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_arcTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_arcTo : Error processing arguments");
        cobj->arcTo(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_arcTo)

static bool js_creator_GraphicsNode_fillRect(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_fillRect : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_fillRect : Error processing arguments");
        cobj->fillRect(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_fillRect)

static bool js_creator_GraphicsNode_onDraw(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_onDraw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Mat4 arg0;
        unsigned int arg1 = 0;
        ok &= seval_to_Mat4(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_onDraw : Error processing arguments");
        cobj->onDraw(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_onDraw)

static bool js_creator_GraphicsNode_setFillColor(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_setFillColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4F arg0;
        ok &= seval_to_Color4F(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_setFillColor : Error processing arguments");
        cobj->setFillColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_setFillColor)

static bool js_creator_GraphicsNode_getFillColor(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_getFillColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color4F result = cobj->getFillColor();
        ok &= Color4F_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_getFillColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_getFillColor)

static bool js_creator_GraphicsNode_beginPath(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_beginPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginPath();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_beginPath)

static bool js_creator_GraphicsNode_setDeviceRatio(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_setDeviceRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_setDeviceRatio : Error processing arguments");
        cobj->setDeviceRatio(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_setDeviceRatio)

static bool js_creator_GraphicsNode_rect(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_rect : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_rect : Error processing arguments");
        cobj->rect(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_rect)

static bool js_creator_GraphicsNode_getMiterLimit(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_getMiterLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMiterLimit();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_getMiterLimit : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_getMiterLimit)

static bool js_creator_GraphicsNode_getLineJoin(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_getLineJoin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->getLineJoin();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_getLineJoin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_getLineJoin)

static bool js_creator_GraphicsNode_getLineCap(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_getLineCap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->getLineCap();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_getLineCap : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_getLineCap)

static bool js_creator_GraphicsNode_setMiterLimit(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_setMiterLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_setMiterLimit : Error processing arguments");
        cobj->setMiterLimit(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_setMiterLimit)

static bool js_creator_GraphicsNode_clear(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_clear : Error processing arguments");
        cobj->clear(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_clear)

static bool js_creator_GraphicsNode_getDeviceRatio(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_getDeviceRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDeviceRatio();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_getDeviceRatio : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_getDeviceRatio)

static bool js_creator_GraphicsNode_getLineWidth(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_getLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLineWidth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_getLineWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_getLineWidth)

static bool js_creator_GraphicsNode_setStrokeColor(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_GraphicsNode_setStrokeColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4F arg0;
        ok &= seval_to_Color4F(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_GraphicsNode_setStrokeColor : Error processing arguments");
        cobj->setStrokeColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_setStrokeColor)

static bool js_creator_GraphicsNode_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = creator::GraphicsNode::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_creator_GraphicsNode_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_GraphicsNode_create)

SE_DECLARE_FINALIZE_FUNC(js_creator_GraphicsNode_finalize)

static bool js_creator_GraphicsNode_constructor(se::State& s)
{
    creator::GraphicsNode* cobj = new (std::nothrow) creator::GraphicsNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_GraphicsNode_constructor, __jsb_creator_GraphicsNode_class, js_creator_GraphicsNode_finalize)

static bool js_creator_GraphicsNode_ctor(se::State& s)
{
    creator::GraphicsNode* cobj = new (std::nothrow) creator::GraphicsNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_creator_GraphicsNode_ctor, __jsb_creator_GraphicsNode_class, js_creator_GraphicsNode_finalize)


    

extern se::Object* __jsb_cocos2d_Node_proto;

static bool js_creator_GraphicsNode_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::GraphicsNode)", s.nativeThisObject());
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_GraphicsNode_finalize)

bool js_register_creator_GraphicsNode(se::Object* obj)
{
    auto cls = se::Class::create("GraphicsNode", obj, __jsb_cocos2d_Node_proto, _SE(js_creator_GraphicsNode_constructor));

    cls->defineFunction("quadraticCurveTo", _SE(js_creator_GraphicsNode_quadraticCurveTo));
    cls->defineFunction("moveTo", _SE(js_creator_GraphicsNode_moveTo));
    cls->defineFunction("lineTo", _SE(js_creator_GraphicsNode_lineTo));
    cls->defineFunction("stroke", _SE(js_creator_GraphicsNode_stroke));
    cls->defineFunction("arc", _SE(js_creator_GraphicsNode_arc));
    cls->defineFunction("setLineJoin", _SE(js_creator_GraphicsNode_setLineJoin));
    cls->defineFunction("close", _SE(js_creator_GraphicsNode_close));
    cls->defineFunction("ellipse", _SE(js_creator_GraphicsNode_ellipse));
    cls->defineFunction("setLineWidth", _SE(js_creator_GraphicsNode_setLineWidth));
    cls->defineFunction("fill", _SE(js_creator_GraphicsNode_fill));
    cls->defineFunction("getStrokeColor", _SE(js_creator_GraphicsNode_getStrokeColor));
    cls->defineFunction("setLineCap", _SE(js_creator_GraphicsNode_setLineCap));
    cls->defineFunction("circle", _SE(js_creator_GraphicsNode_circle));
    cls->defineFunction("roundRect", _SE(js_creator_GraphicsNode_roundRect));
    cls->defineFunction("draw", _SE(js_creator_GraphicsNode_draw));
    cls->defineFunction("bezierCurveTo", _SE(js_creator_GraphicsNode_bezierCurveTo));
    cls->defineFunction("arcTo", _SE(js_creator_GraphicsNode_arcTo));
    cls->defineFunction("fillRect", _SE(js_creator_GraphicsNode_fillRect));
    cls->defineFunction("onDraw", _SE(js_creator_GraphicsNode_onDraw));
    cls->defineFunction("setFillColor", _SE(js_creator_GraphicsNode_setFillColor));
    cls->defineFunction("getFillColor", _SE(js_creator_GraphicsNode_getFillColor));
    cls->defineFunction("beginPath", _SE(js_creator_GraphicsNode_beginPath));
    cls->defineFunction("setDeviceRatio", _SE(js_creator_GraphicsNode_setDeviceRatio));
    cls->defineFunction("rect", _SE(js_creator_GraphicsNode_rect));
    cls->defineFunction("getMiterLimit", _SE(js_creator_GraphicsNode_getMiterLimit));
    cls->defineFunction("getLineJoin", _SE(js_creator_GraphicsNode_getLineJoin));
    cls->defineFunction("getLineCap", _SE(js_creator_GraphicsNode_getLineCap));
    cls->defineFunction("setMiterLimit", _SE(js_creator_GraphicsNode_setMiterLimit));
    cls->defineFunction("clear", _SE(js_creator_GraphicsNode_clear));
    cls->defineFunction("getDeviceRatio", _SE(js_creator_GraphicsNode_getDeviceRatio));
    cls->defineFunction("getLineWidth", _SE(js_creator_GraphicsNode_getLineWidth));
    cls->defineFunction("setStrokeColor", _SE(js_creator_GraphicsNode_setStrokeColor));
    cls->defineFunction("ctor", _SE(js_creator_GraphicsNode_ctor));
    cls->defineStaticFunction("create", _SE(js_creator_GraphicsNode_create));
    cls->defineFinalizeFunction(_SE(js_creator_GraphicsNode_finalize));
    cls->install();
    JSBClassType::registerClass<creator::GraphicsNode>(cls);

    __jsb_creator_GraphicsNode_proto = cls->getProto();
    __jsb_creator_GraphicsNode_class = cls;

    se::ScriptEngine::getInstance()->evalString("(function () { cc.GraphicsNode.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsDebugDraw_proto = nullptr;
se::Class* __jsb_creator_PhysicsDebugDraw_class = nullptr;

static bool js_creator_PhysicsDebugDraw_getDrawer(se::State& s)
{
    creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsDebugDraw_getDrawer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        creator::GraphicsNode* result = cobj->getDrawer();
        ok &= native_ptr_to_seval<creator::GraphicsNode>((creator::GraphicsNode*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsDebugDraw_getDrawer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsDebugDraw_getDrawer)

static bool js_creator_PhysicsDebugDraw_ClearDraw(se::State& s)
{
    creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsDebugDraw_ClearDraw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ClearDraw();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsDebugDraw_ClearDraw)

static bool js_creator_PhysicsDebugDraw_AddDrawerToNode(se::State& s)
{
    creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsDebugDraw_AddDrawerToNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsDebugDraw_AddDrawerToNode : Error processing arguments");
        cobj->AddDrawerToNode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsDebugDraw_AddDrawerToNode)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsDebugDraw_finalize)

static bool js_creator_PhysicsDebugDraw_constructor(se::State& s)
{
    creator::PhysicsDebugDraw* cobj = new (std::nothrow) creator::PhysicsDebugDraw();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_PhysicsDebugDraw_constructor, __jsb_creator_PhysicsDebugDraw_class, js_creator_PhysicsDebugDraw_finalize)



extern se::Object* __jsb_b2Draw_proto;

static bool js_creator_PhysicsDebugDraw_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::PhysicsDebugDraw)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsDebugDraw_finalize)

bool js_register_creator_PhysicsDebugDraw(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsDebugDraw", obj, __jsb_b2Draw_proto, _SE(js_creator_PhysicsDebugDraw_constructor));

    cls->defineFunction("getDrawer", _SE(js_creator_PhysicsDebugDraw_getDrawer));
    cls->defineFunction("ClearDraw", _SE(js_creator_PhysicsDebugDraw_ClearDraw));
    cls->defineFunction("AddDrawerToNode", _SE(js_creator_PhysicsDebugDraw_AddDrawerToNode));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsDebugDraw_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsDebugDraw>(cls);

    __jsb_creator_PhysicsDebugDraw_proto = cls->getProto();
    __jsb_creator_PhysicsDebugDraw_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsWorldManifoldWrapper_proto = nullptr;
se::Class* __jsb_creator_PhysicsWorldManifoldWrapper_class = nullptr;

static bool js_creator_PhysicsWorldManifoldWrapper_getSeparation(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsWorldManifoldWrapper_getSeparation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsWorldManifoldWrapper_getSeparation : Error processing arguments");
        float result = cobj->getSeparation(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsWorldManifoldWrapper_getSeparation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsWorldManifoldWrapper_getSeparation)

static bool js_creator_PhysicsWorldManifoldWrapper_getX(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsWorldManifoldWrapper_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsWorldManifoldWrapper_getX : Error processing arguments");
        float result = cobj->getX(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsWorldManifoldWrapper_getX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsWorldManifoldWrapper_getX)

static bool js_creator_PhysicsWorldManifoldWrapper_getY(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsWorldManifoldWrapper_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsWorldManifoldWrapper_getY : Error processing arguments");
        float result = cobj->getY(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsWorldManifoldWrapper_getY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsWorldManifoldWrapper_getY)

static bool js_creator_PhysicsWorldManifoldWrapper_getCount(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsWorldManifoldWrapper_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsWorldManifoldWrapper_getCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsWorldManifoldWrapper_getCount)

static bool js_creator_PhysicsWorldManifoldWrapper_getNormalY(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsWorldManifoldWrapper_getNormalY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNormalY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsWorldManifoldWrapper_getNormalY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsWorldManifoldWrapper_getNormalY)

static bool js_creator_PhysicsWorldManifoldWrapper_getNormalX(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsWorldManifoldWrapper_getNormalX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNormalX();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsWorldManifoldWrapper_getNormalX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsWorldManifoldWrapper_getNormalX)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsWorldManifoldWrapper_finalize)

static bool js_creator_PhysicsWorldManifoldWrapper_constructor(se::State& s)
{
    creator::PhysicsWorldManifoldWrapper* cobj = new (std::nothrow) creator::PhysicsWorldManifoldWrapper();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_PhysicsWorldManifoldWrapper_constructor, __jsb_creator_PhysicsWorldManifoldWrapper_class, js_creator_PhysicsWorldManifoldWrapper_finalize)




static bool js_creator_PhysicsWorldManifoldWrapper_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::PhysicsWorldManifoldWrapper)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsWorldManifoldWrapper_finalize)

bool js_register_creator_PhysicsWorldManifoldWrapper(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsWorldManifoldWrapper", obj, nullptr, _SE(js_creator_PhysicsWorldManifoldWrapper_constructor));

    cls->defineFunction("getSeparation", _SE(js_creator_PhysicsWorldManifoldWrapper_getSeparation));
    cls->defineFunction("getX", _SE(js_creator_PhysicsWorldManifoldWrapper_getX));
    cls->defineFunction("getY", _SE(js_creator_PhysicsWorldManifoldWrapper_getY));
    cls->defineFunction("getCount", _SE(js_creator_PhysicsWorldManifoldWrapper_getCount));
    cls->defineFunction("getNormalY", _SE(js_creator_PhysicsWorldManifoldWrapper_getNormalY));
    cls->defineFunction("getNormalX", _SE(js_creator_PhysicsWorldManifoldWrapper_getNormalX));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsWorldManifoldWrapper_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsWorldManifoldWrapper>(cls);

    __jsb_creator_PhysicsWorldManifoldWrapper_proto = cls->getProto();
    __jsb_creator_PhysicsWorldManifoldWrapper_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsManifoldWrapper_proto = nullptr;
se::Class* __jsb_creator_PhysicsManifoldWrapper_class = nullptr;

static bool js_creator_PhysicsManifoldWrapper_getNormalImpulse(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getNormalImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getNormalImpulse : Error processing arguments");
        float result = cobj->getNormalImpulse(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getNormalImpulse : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getNormalImpulse)

static bool js_creator_PhysicsManifoldWrapper_getLocalNormalY(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getLocalNormalY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLocalNormalY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getLocalNormalY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getLocalNormalY)

static bool js_creator_PhysicsManifoldWrapper_getLocalNormalX(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getLocalNormalX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLocalNormalX();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getLocalNormalX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getLocalNormalX)

static bool js_creator_PhysicsManifoldWrapper_getLocalPointY(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getLocalPointY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLocalPointY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getLocalPointY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getLocalPointY)

static bool js_creator_PhysicsManifoldWrapper_getLocalPointX(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getLocalPointX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLocalPointX();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getLocalPointX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getLocalPointX)

static bool js_creator_PhysicsManifoldWrapper_getType(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getType)

static bool js_creator_PhysicsManifoldWrapper_getX(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getX : Error processing arguments");
        float result = cobj->getX(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getX)

static bool js_creator_PhysicsManifoldWrapper_getY(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getY : Error processing arguments");
        float result = cobj->getY(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getY)

static bool js_creator_PhysicsManifoldWrapper_getTangentImpulse(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getTangentImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getTangentImpulse : Error processing arguments");
        float result = cobj->getTangentImpulse(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getTangentImpulse : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getTangentImpulse)

static bool js_creator_PhysicsManifoldWrapper_getCount(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = (creator::PhysicsManifoldWrapper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsManifoldWrapper_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsManifoldWrapper_getCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsManifoldWrapper_getCount)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsManifoldWrapper_finalize)

static bool js_creator_PhysicsManifoldWrapper_constructor(se::State& s)
{
    creator::PhysicsManifoldWrapper* cobj = new (std::nothrow) creator::PhysicsManifoldWrapper();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_PhysicsManifoldWrapper_constructor, __jsb_creator_PhysicsManifoldWrapper_class, js_creator_PhysicsManifoldWrapper_finalize)




static bool js_creator_PhysicsManifoldWrapper_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::PhysicsManifoldWrapper)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsManifoldWrapper_finalize)

bool js_register_creator_PhysicsManifoldWrapper(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsManifoldWrapper", obj, nullptr, _SE(js_creator_PhysicsManifoldWrapper_constructor));

    cls->defineFunction("getNormalImpulse", _SE(js_creator_PhysicsManifoldWrapper_getNormalImpulse));
    cls->defineFunction("getLocalNormalY", _SE(js_creator_PhysicsManifoldWrapper_getLocalNormalY));
    cls->defineFunction("getLocalNormalX", _SE(js_creator_PhysicsManifoldWrapper_getLocalNormalX));
    cls->defineFunction("getLocalPointY", _SE(js_creator_PhysicsManifoldWrapper_getLocalPointY));
    cls->defineFunction("getLocalPointX", _SE(js_creator_PhysicsManifoldWrapper_getLocalPointX));
    cls->defineFunction("getType", _SE(js_creator_PhysicsManifoldWrapper_getType));
    cls->defineFunction("getX", _SE(js_creator_PhysicsManifoldWrapper_getX));
    cls->defineFunction("getY", _SE(js_creator_PhysicsManifoldWrapper_getY));
    cls->defineFunction("getTangentImpulse", _SE(js_creator_PhysicsManifoldWrapper_getTangentImpulse));
    cls->defineFunction("getCount", _SE(js_creator_PhysicsManifoldWrapper_getCount));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsManifoldWrapper_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsManifoldWrapper>(cls);

    __jsb_creator_PhysicsManifoldWrapper_proto = cls->getProto();
    __jsb_creator_PhysicsManifoldWrapper_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsUtils_proto = nullptr;
se::Class* __jsb_creator_PhysicsUtils_class = nullptr;

static bool js_creator_PhysicsUtils_addB2Body(se::State& s)
{
    creator::PhysicsUtils* cobj = (creator::PhysicsUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsUtils_addB2Body : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Body* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsUtils_addB2Body : Error processing arguments");
        cobj->addB2Body(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsUtils_addB2Body)

static bool js_creator_PhysicsUtils_syncNode(se::State& s)
{
    creator::PhysicsUtils* cobj = (creator::PhysicsUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsUtils_syncNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->syncNode();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsUtils_syncNode)

static bool js_creator_PhysicsUtils_removeB2Body(se::State& s)
{
    creator::PhysicsUtils* cobj = (creator::PhysicsUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsUtils_removeB2Body : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Body* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsUtils_removeB2Body : Error processing arguments");
        cobj->removeB2Body(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsUtils_removeB2Body)

static bool js_creator_PhysicsUtils_getContactManifoldWrapper(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Contact* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsUtils_getContactManifoldWrapper : Error processing arguments");
        const creator::PhysicsManifoldWrapper* result = creator::PhysicsUtils::getContactManifoldWrapper(arg0);
        ok &= native_ptr_to_rooted_seval<creator::PhysicsManifoldWrapper>((creator::PhysicsManifoldWrapper*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsUtils_getContactManifoldWrapper : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsUtils_getContactManifoldWrapper)

static bool js_creator_PhysicsUtils_getContactWorldManifoldWrapper(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Contact* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsUtils_getContactWorldManifoldWrapper : Error processing arguments");
        const creator::PhysicsWorldManifoldWrapper* result = creator::PhysicsUtils::getContactWorldManifoldWrapper(arg0);
        ok &= native_ptr_to_rooted_seval<creator::PhysicsWorldManifoldWrapper>((creator::PhysicsWorldManifoldWrapper*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsUtils_getContactWorldManifoldWrapper : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsUtils_getContactWorldManifoldWrapper)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsUtils_finalize)

static bool js_creator_PhysicsUtils_constructor(se::State& s)
{
    creator::PhysicsUtils* cobj = new (std::nothrow) creator::PhysicsUtils();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_PhysicsUtils_constructor, __jsb_creator_PhysicsUtils_class, js_creator_PhysicsUtils_finalize)




static bool js_creator_PhysicsUtils_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::PhysicsUtils)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsUtils* cobj = (creator::PhysicsUtils*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsUtils_finalize)

bool js_register_creator_PhysicsUtils(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsUtils", obj, nullptr, _SE(js_creator_PhysicsUtils_constructor));

    cls->defineFunction("addB2Body", _SE(js_creator_PhysicsUtils_addB2Body));
    cls->defineFunction("syncNode", _SE(js_creator_PhysicsUtils_syncNode));
    cls->defineFunction("removeB2Body", _SE(js_creator_PhysicsUtils_removeB2Body));
    cls->defineStaticFunction("getContactManifoldWrapper", _SE(js_creator_PhysicsUtils_getContactManifoldWrapper));
    cls->defineStaticFunction("getContactWorldManifoldWrapper", _SE(js_creator_PhysicsUtils_getContactWorldManifoldWrapper));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsUtils_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsUtils>(cls);

    __jsb_creator_PhysicsUtils_proto = cls->getProto();
    __jsb_creator_PhysicsUtils_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsContactImpulse_proto = nullptr;
se::Class* __jsb_creator_PhysicsContactImpulse_class = nullptr;

static bool js_creator_PhysicsContactImpulse_getCount(se::State& s)
{
    creator::PhysicsContactImpulse* cobj = (creator::PhysicsContactImpulse*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsContactImpulse_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsContactImpulse_getCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsContactImpulse_getCount)

static bool js_creator_PhysicsContactImpulse_getNormalImpulse(se::State& s)
{
    creator::PhysicsContactImpulse* cobj = (creator::PhysicsContactImpulse*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsContactImpulse_getNormalImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsContactImpulse_getNormalImpulse : Error processing arguments");
        float result = cobj->getNormalImpulse(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsContactImpulse_getNormalImpulse : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsContactImpulse_getNormalImpulse)

static bool js_creator_PhysicsContactImpulse_getTangentImpulse(se::State& s)
{
    creator::PhysicsContactImpulse* cobj = (creator::PhysicsContactImpulse*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsContactImpulse_getTangentImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsContactImpulse_getTangentImpulse : Error processing arguments");
        float result = cobj->getTangentImpulse(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsContactImpulse_getTangentImpulse : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsContactImpulse_getTangentImpulse)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsContactImpulse_finalize)

static bool js_creator_PhysicsContactImpulse_constructor(se::State& s)
{
    creator::PhysicsContactImpulse* cobj = new (std::nothrow) creator::PhysicsContactImpulse();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_PhysicsContactImpulse_constructor, __jsb_creator_PhysicsContactImpulse_class, js_creator_PhysicsContactImpulse_finalize)




static bool js_creator_PhysicsContactImpulse_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::PhysicsContactImpulse)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsContactImpulse_finalize)

bool js_register_creator_PhysicsContactImpulse(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsContactImpulse", obj, nullptr, _SE(js_creator_PhysicsContactImpulse_constructor));

    cls->defineFunction("getCount", _SE(js_creator_PhysicsContactImpulse_getCount));
    cls->defineFunction("getNormalImpulse", _SE(js_creator_PhysicsContactImpulse_getNormalImpulse));
    cls->defineFunction("getTangentImpulse", _SE(js_creator_PhysicsContactImpulse_getTangentImpulse));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsContactImpulse_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsContactImpulse>(cls);

    __jsb_creator_PhysicsContactImpulse_proto = cls->getProto();
    __jsb_creator_PhysicsContactImpulse_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsContactListener_proto = nullptr;
se::Class* __jsb_creator_PhysicsContactListener_class = nullptr;

static bool js_creator_PhysicsContactListener_unregisterContactFixture(se::State& s)
{
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsContactListener_unregisterContactFixture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Fixture* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsContactListener_unregisterContactFixture : Error processing arguments");
        cobj->unregisterContactFixture(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsContactListener_unregisterContactFixture)

static bool js_creator_PhysicsContactListener_registerContactFixture(se::State& s)
{
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsContactListener_registerContactFixture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Fixture* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsContactListener_registerContactFixture : Error processing arguments");
        cobj->registerContactFixture(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsContactListener_registerContactFixture)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsContactListener_finalize)

static bool js_creator_PhysicsContactListener_constructor(se::State& s)
{
    creator::PhysicsContactListener* cobj = new (std::nothrow) creator::PhysicsContactListener();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_PhysicsContactListener_constructor, __jsb_creator_PhysicsContactListener_class, js_creator_PhysicsContactListener_finalize)



extern se::Object* __jsb_b2ContactListener_proto;

static bool js_creator_PhysicsContactListener_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::PhysicsContactListener)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsContactListener_finalize)

bool js_register_creator_PhysicsContactListener(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsContactListener", obj, __jsb_b2ContactListener_proto, _SE(js_creator_PhysicsContactListener_constructor));

    cls->defineFunction("unregisterContactFixture", _SE(js_creator_PhysicsContactListener_unregisterContactFixture));
    cls->defineFunction("registerContactFixture", _SE(js_creator_PhysicsContactListener_registerContactFixture));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsContactListener_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsContactListener>(cls);

    __jsb_creator_PhysicsContactListener_proto = cls->getProto();
    __jsb_creator_PhysicsContactListener_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsAABBQueryCallback_proto = nullptr;
se::Class* __jsb_creator_PhysicsAABBQueryCallback_class = nullptr;

static bool js_creator_PhysicsAABBQueryCallback_init(se::State& s)
{
    CC_UNUSED bool ok = true;
    creator::PhysicsAABBQueryCallback* cobj = (creator::PhysicsAABBQueryCallback*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_creator_PhysicsAABBQueryCallback_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            b2Vec2 arg0;
            ok &= seval_to_b2Vec2(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->init(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            cobj->init();
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsAABBQueryCallback_init)

static bool js_creator_PhysicsAABBQueryCallback_getFixture(se::State& s)
{
    creator::PhysicsAABBQueryCallback* cobj = (creator::PhysicsAABBQueryCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsAABBQueryCallback_getFixture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Fixture* result = cobj->getFixture();
        ok &= native_ptr_to_seval<b2Fixture>((b2Fixture*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsAABBQueryCallback_getFixture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsAABBQueryCallback_getFixture)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsAABBQueryCallback_finalize)

static bool js_creator_PhysicsAABBQueryCallback_constructor(se::State& s)
{
    creator::PhysicsAABBQueryCallback* cobj = new (std::nothrow) creator::PhysicsAABBQueryCallback();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_PhysicsAABBQueryCallback_constructor, __jsb_creator_PhysicsAABBQueryCallback_class, js_creator_PhysicsAABBQueryCallback_finalize)



extern se::Object* __jsb_b2QueryCallback_proto;

static bool js_creator_PhysicsAABBQueryCallback_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::PhysicsAABBQueryCallback)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsAABBQueryCallback* cobj = (creator::PhysicsAABBQueryCallback*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsAABBQueryCallback_finalize)

bool js_register_creator_PhysicsAABBQueryCallback(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsAABBQueryCallback", obj, __jsb_b2QueryCallback_proto, _SE(js_creator_PhysicsAABBQueryCallback_constructor));

    cls->defineFunction("init", _SE(js_creator_PhysicsAABBQueryCallback_init));
    cls->defineFunction("getFixture", _SE(js_creator_PhysicsAABBQueryCallback_getFixture));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsAABBQueryCallback_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsAABBQueryCallback>(cls);

    __jsb_creator_PhysicsAABBQueryCallback_proto = cls->getProto();
    __jsb_creator_PhysicsAABBQueryCallback_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_PhysicsRayCastCallback_proto = nullptr;
se::Class* __jsb_creator_PhysicsRayCastCallback_class = nullptr;

static bool js_creator_PhysicsRayCastCallback_getType(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsRayCastCallback_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsRayCastCallback_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsRayCastCallback_getType)

static bool js_creator_PhysicsRayCastCallback_init(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsRayCastCallback_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsRayCastCallback_init : Error processing arguments");
        cobj->init(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsRayCastCallback_init)

static bool js_creator_PhysicsRayCastCallback_getFractions(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_PhysicsRayCastCallback_getFractions : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<float, std::allocator<float> >& result = cobj->getFractions();
        ok &= std_vector_float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_PhysicsRayCastCallback_getFractions : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_PhysicsRayCastCallback_getFractions)

SE_DECLARE_FINALIZE_FUNC(js_creator_PhysicsRayCastCallback_finalize)

static bool js_creator_PhysicsRayCastCallback_constructor(se::State& s)
{
    creator::PhysicsRayCastCallback* cobj = new (std::nothrow) creator::PhysicsRayCastCallback();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_PhysicsRayCastCallback_constructor, __jsb_creator_PhysicsRayCastCallback_class, js_creator_PhysicsRayCastCallback_finalize)



extern se::Object* __jsb_b2RayCastCallback_proto;

static bool js_creator_PhysicsRayCastCallback_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::PhysicsRayCastCallback)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_PhysicsRayCastCallback_finalize)

bool js_register_creator_PhysicsRayCastCallback(se::Object* obj)
{
    auto cls = se::Class::create("PhysicsRayCastCallback", obj, __jsb_b2RayCastCallback_proto, _SE(js_creator_PhysicsRayCastCallback_constructor));

    cls->defineFunction("getType", _SE(js_creator_PhysicsRayCastCallback_getType));
    cls->defineFunction("init", _SE(js_creator_PhysicsRayCastCallback_init));
    cls->defineFunction("getFractions", _SE(js_creator_PhysicsRayCastCallback_getFractions));
    cls->defineFinalizeFunction(_SE(js_creator_PhysicsRayCastCallback_finalize));
    cls->install();
    JSBClassType::registerClass<creator::PhysicsRayCastCallback>(cls);

    __jsb_creator_PhysicsRayCastCallback_proto = cls->getProto();
    __jsb_creator_PhysicsRayCastCallback_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_creator_CameraNode_proto = nullptr;
se::Class* __jsb_creator_CameraNode_class = nullptr;

static bool js_creator_CameraNode_removeTarget(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_CameraNode_removeTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_CameraNode_removeTarget : Error processing arguments");
        cobj->removeTarget(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_CameraNode_removeTarget)

static bool js_creator_CameraNode_setTransform(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_CameraNode_setTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        float arg5 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        SE_PRECONDITION2(ok, false, "js_creator_CameraNode_setTransform : Error processing arguments");
        cobj->setTransform(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_creator_CameraNode_setTransform)

static bool js_creator_CameraNode_getVisibleRect(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_CameraNode_getVisibleRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getVisibleRect();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_CameraNode_getVisibleRect : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_CameraNode_getVisibleRect)

static bool js_creator_CameraNode_containsNode(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_CameraNode_containsNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_CameraNode_containsNode : Error processing arguments");
        bool result = cobj->containsNode(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_CameraNode_containsNode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_CameraNode_containsNode)

static bool js_creator_CameraNode_addTarget(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_CameraNode_addTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_CameraNode_addTarget : Error processing arguments");
        cobj->addTarget(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_CameraNode_addTarget)

static bool js_creator_CameraNode_getInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = creator::CameraNode::getInstance();
        se::Value instanceVal;
        native_ptr_to_seval<creator::CameraNode>(result, __jsb_creator_CameraNode_class, &instanceVal);
        instanceVal.toObject()->root();
        s.rval() = instanceVal;
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_CameraNode_getInstance)

SE_DECLARE_FINALIZE_FUNC(js_creator_CameraNode_finalize)

static bool js_creator_CameraNode_constructor(se::State& s)
{
    creator::CameraNode* cobj = new (std::nothrow) creator::CameraNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_CameraNode_constructor, __jsb_creator_CameraNode_class, js_creator_CameraNode_finalize)



extern se::Object* __jsb_cocos2d_Node_proto;

static bool js_creator_CameraNode_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (creator::CameraNode)", s.nativeThisObject());
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_CameraNode_finalize)

bool js_register_creator_CameraNode(se::Object* obj)
{
    auto cls = se::Class::create("CameraNode", obj, __jsb_cocos2d_Node_proto, _SE(js_creator_CameraNode_constructor));

    cls->defineFunction("removeTarget", _SE(js_creator_CameraNode_removeTarget));
    cls->defineFunction("setTransform", _SE(js_creator_CameraNode_setTransform));
    cls->defineFunction("getVisibleRect", _SE(js_creator_CameraNode_getVisibleRect));
    cls->defineFunction("containsNode", _SE(js_creator_CameraNode_containsNode));
    cls->defineFunction("addTarget", _SE(js_creator_CameraNode_addTarget));
    cls->defineStaticFunction("getInstance", _SE(js_creator_CameraNode_getInstance));
    cls->defineFinalizeFunction(_SE(js_creator_CameraNode_finalize));
    cls->install();
    JSBClassType::registerClass<creator::CameraNode>(cls);

    __jsb_creator_CameraNode_proto = cls->getProto();
    __jsb_creator_CameraNode_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_creator(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("cc", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("cc", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_creator_PhysicsManifoldWrapper(ns);
    js_register_creator_PhysicsRayCastCallback(ns);
    js_register_creator_PhysicsDebugDraw(ns);
    js_register_creator_PhysicsContactListener(ns);
    js_register_creator_PhysicsContactImpulse(ns);
    js_register_creator_PhysicsUtils(ns);
    js_register_creator_Scale9SpriteV2(ns);
    js_register_creator_PhysicsWorldManifoldWrapper(ns);
    js_register_creator_GraphicsNode(ns);
    js_register_creator_PhysicsAABBQueryCallback(ns);
    js_register_creator_CameraNode(ns);
    return true;
}

