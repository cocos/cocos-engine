#include "scripting/js-bindings/auto/jsb_creator_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "creator/CCScale9Sprite.h"

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
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::Scale9SpriteV2)", s.nativeThisObject());
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

    jsb_set_extend_property("cc", "Scale9SpriteV2");
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

    js_register_creator_Scale9SpriteV2(ns);
    return true;
}

