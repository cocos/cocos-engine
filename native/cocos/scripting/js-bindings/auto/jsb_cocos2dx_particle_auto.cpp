#include "scripting/js-bindings/auto/jsb_cocos2dx_particle_auto.hpp"
#if USE_PARTICLE > 0
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "editor-support/particle/ParticleSimulator.h"

se::Object* __jsb_cocos2d_ParticleSimulator_proto = nullptr;
se::Class* __jsb_cocos2d_ParticleSimulator_class = nullptr;

static bool js_cocos2dx_particle_ParticleSimulator_setGravity(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setGravity : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setGravity : Error processing arguments");
        cobj->setGravity(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setGravity)

static bool js_cocos2dx_particle_ParticleSimulator_render(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_render : Error processing arguments");
        cobj->render(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_render)

static bool js_cocos2dx_particle_ParticleSimulator_setSourcePos(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setSourcePos : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setSourcePos : Error processing arguments");
        cobj->setSourcePos(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setSourcePos)

static bool js_cocos2dx_particle_ParticleSimulator_onEnable(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_onEnable)

static bool js_cocos2dx_particle_ParticleSimulator_setEffect(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Effect* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setEffect : Error processing arguments");
        cobj->setEffect(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setEffect)

static bool js_cocos2dx_particle_ParticleSimulator_setPosVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setPosVar : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setPosVar : Error processing arguments");
        cobj->setPosVar(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setPosVar)

static bool js_cocos2dx_particle_ParticleSimulator_setEndColorVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setEndColorVar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        uint8_t arg0;
        uint8_t arg1;
        uint8_t arg2;
        uint8_t arg3;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        ok &= seval_to_uint8(args[1], (uint8_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_uint8(args[3], (uint8_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setEndColorVar : Error processing arguments");
        cobj->setEndColorVar(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setEndColorVar)

static bool js_cocos2dx_particle_ParticleSimulator_getParticleCount(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_getParticleCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getParticleCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_getParticleCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_getParticleCount)

static bool js_cocos2dx_particle_ParticleSimulator_setStartColorVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setStartColorVar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        uint8_t arg0;
        uint8_t arg1;
        uint8_t arg2;
        uint8_t arg3;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        ok &= seval_to_uint8(args[1], (uint8_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_uint8(args[3], (uint8_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setStartColorVar : Error processing arguments");
        cobj->setStartColorVar(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setStartColorVar)

static bool js_cocos2dx_particle_ParticleSimulator_emitParticle(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_emitParticle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec3 arg0;
        ok &= seval_to_Vec3(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_emitParticle : Error processing arguments");
        cobj->emitParticle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_emitParticle)

static bool js_cocos2dx_particle_ParticleSimulator_stop(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_stop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stop();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_stop)

static bool js_cocos2dx_particle_ParticleSimulator_update(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_update)

static bool js_cocos2dx_particle_ParticleSimulator_active(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_active : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->active();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_active : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_active)

static bool js_cocos2dx_particle_ParticleSimulator_updateUVs(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_updateUVs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<float> arg0;
        ok &= seval_to_std_vector_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_updateUVs : Error processing arguments");
        cobj->updateUVs(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_updateUVs)

static bool js_cocos2dx_particle_ParticleSimulator_setStartColor(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setStartColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        uint8_t arg0;
        uint8_t arg1;
        uint8_t arg2;
        uint8_t arg3;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        ok &= seval_to_uint8(args[1], (uint8_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_uint8(args[3], (uint8_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setStartColor : Error processing arguments");
        cobj->setStartColor(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setStartColor)

static bool js_cocos2dx_particle_ParticleSimulator_reset(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_reset)

static bool js_cocos2dx_particle_ParticleSimulator_onDisable(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_onDisable)

static bool js_cocos2dx_particle_ParticleSimulator_bindNodeProxy(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_bindNodeProxy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_bindNodeProxy : Error processing arguments");
        cobj->bindNodeProxy(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_bindNodeProxy)

static bool js_cocos2dx_particle_ParticleSimulator_setEndColor(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setEndColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        uint8_t arg0;
        uint8_t arg1;
        uint8_t arg2;
        uint8_t arg3;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        ok &= seval_to_uint8(args[1], (uint8_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_uint8(args[3], (uint8_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setEndColor : Error processing arguments");
        cobj->setEndColor(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setEndColor)

static bool js_cocos2dx_particle_ParticleSimulator_setFinishedCallback(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setFinishedCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void ()> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=]() -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(se::EmptyValueArray, thisObj, &rval);
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setFinishedCallback : Error processing arguments");
        cobj->setFinishedCallback(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setFinishedCallback)

static bool js_cocos2dx_particle_ParticleSimulator_setStopCallback(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_setStopCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void ()> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=]() -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(se::EmptyValueArray, thisObj, &rval);
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_setStopCallback : Error processing arguments");
        cobj->setStopCallback(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_particle_ParticleSimulator_setStopCallback)

static bool js_cocos2dx_particle_ParticleSimulator_get_positionType(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_positionType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval(cobj->positionType, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_positionType)

static bool js_cocos2dx_particle_ParticleSimulator_set_positionType(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_positionType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_positionType : Error processing new value");
    cobj->positionType = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_positionType)

static bool js_cocos2dx_particle_ParticleSimulator_get_emissionRate(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_emissionRate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->emissionRate, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_emissionRate)

static bool js_cocos2dx_particle_ParticleSimulator_set_emissionRate(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_emissionRate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_emissionRate : Error processing new value");
    cobj->emissionRate = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_emissionRate)

static bool js_cocos2dx_particle_ParticleSimulator_get_totalParticles(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_totalParticles : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint32_to_seval(cobj->totalParticles, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_totalParticles)

static bool js_cocos2dx_particle_ParticleSimulator_set_totalParticles(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_totalParticles : Invalid Native Object");

    CC_UNUSED bool ok = true;
    size_t arg0 = 0;
    ok &= seval_to_size(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_totalParticles : Error processing new value");
    cobj->totalParticles = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_totalParticles)

static bool js_cocos2dx_particle_ParticleSimulator_get_duration(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_duration : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->duration, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_duration)

static bool js_cocos2dx_particle_ParticleSimulator_set_duration(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_duration : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_duration : Error processing new value");
    cobj->duration = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_duration)

static bool js_cocos2dx_particle_ParticleSimulator_get_emitterMode(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_emitterMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval(cobj->emitterMode, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_emitterMode)

static bool js_cocos2dx_particle_ParticleSimulator_set_emitterMode(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_emitterMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    int arg0 = 0;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_emitterMode : Error processing new value");
    cobj->emitterMode = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_emitterMode)

static bool js_cocos2dx_particle_ParticleSimulator_get_life(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_life : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->life, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_life)

static bool js_cocos2dx_particle_ParticleSimulator_set_life(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_life : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_life : Error processing new value");
    cobj->life = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_life)

static bool js_cocos2dx_particle_ParticleSimulator_get_lifeVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_lifeVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->lifeVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_lifeVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_lifeVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_lifeVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_lifeVar : Error processing new value");
    cobj->lifeVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_lifeVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_startSize(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_startSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->startSize, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_startSize)

static bool js_cocos2dx_particle_ParticleSimulator_set_startSize(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_startSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_startSize : Error processing new value");
    cobj->startSize = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_startSize)

static bool js_cocos2dx_particle_ParticleSimulator_get_startSizeVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_startSizeVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->startSizeVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_startSizeVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_startSizeVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_startSizeVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_startSizeVar : Error processing new value");
    cobj->startSizeVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_startSizeVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_endSize(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_endSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->endSize, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_endSize)

static bool js_cocos2dx_particle_ParticleSimulator_set_endSize(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_endSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_endSize : Error processing new value");
    cobj->endSize = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_endSize)

static bool js_cocos2dx_particle_ParticleSimulator_get_endSizeVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_endSizeVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->endSizeVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_endSizeVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_endSizeVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_endSizeVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_endSizeVar : Error processing new value");
    cobj->endSizeVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_endSizeVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_startSpin(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_startSpin : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->startSpin, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_startSpin)

static bool js_cocos2dx_particle_ParticleSimulator_set_startSpin(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_startSpin : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_startSpin : Error processing new value");
    cobj->startSpin = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_startSpin)

static bool js_cocos2dx_particle_ParticleSimulator_get_startSpinVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_startSpinVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->startSpinVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_startSpinVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_startSpinVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_startSpinVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_startSpinVar : Error processing new value");
    cobj->startSpinVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_startSpinVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_endSpin(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_endSpin : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->endSpin, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_endSpin)

static bool js_cocos2dx_particle_ParticleSimulator_set_endSpin(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_endSpin : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_endSpin : Error processing new value");
    cobj->endSpin = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_endSpin)

static bool js_cocos2dx_particle_ParticleSimulator_get_endSpinVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_endSpinVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->endSpinVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_endSpinVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_endSpinVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_endSpinVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_endSpinVar : Error processing new value");
    cobj->endSpinVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_endSpinVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_angle(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_angle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->angle, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_angle)

static bool js_cocos2dx_particle_ParticleSimulator_set_angle(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_angle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_angle : Error processing new value");
    cobj->angle = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_angle)

static bool js_cocos2dx_particle_ParticleSimulator_get_angleVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_angleVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->angleVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_angleVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_angleVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_angleVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_angleVar : Error processing new value");
    cobj->angleVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_angleVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_speed(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_speed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->speed, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_speed)

static bool js_cocos2dx_particle_ParticleSimulator_set_speed(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_speed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_speed : Error processing new value");
    cobj->speed = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_speed)

static bool js_cocos2dx_particle_ParticleSimulator_get_speedVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_speedVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->speedVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_speedVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_speedVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_speedVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_speedVar : Error processing new value");
    cobj->speedVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_speedVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_radialAccel(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_radialAccel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->radialAccel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_radialAccel)

static bool js_cocos2dx_particle_ParticleSimulator_set_radialAccel(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_radialAccel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_radialAccel : Error processing new value");
    cobj->radialAccel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_radialAccel)

static bool js_cocos2dx_particle_ParticleSimulator_get_radialAccelVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_radialAccelVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->radialAccelVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_radialAccelVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_radialAccelVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_radialAccelVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_radialAccelVar : Error processing new value");
    cobj->radialAccelVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_radialAccelVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_tangentialAccel(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_tangentialAccel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->tangentialAccel, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_tangentialAccel)

static bool js_cocos2dx_particle_ParticleSimulator_set_tangentialAccel(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_tangentialAccel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_tangentialAccel : Error processing new value");
    cobj->tangentialAccel = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_tangentialAccel)

static bool js_cocos2dx_particle_ParticleSimulator_get_tangentialAccelVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_tangentialAccelVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->tangentialAccelVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_tangentialAccelVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_tangentialAccelVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_tangentialAccelVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_tangentialAccelVar : Error processing new value");
    cobj->tangentialAccelVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_tangentialAccelVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_rotationIsDir(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_rotationIsDir : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= boolean_to_seval(cobj->rotationIsDir, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_rotationIsDir)

static bool js_cocos2dx_particle_ParticleSimulator_set_rotationIsDir(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_rotationIsDir : Invalid Native Object");

    CC_UNUSED bool ok = true;
    bool arg0;
    ok &= seval_to_boolean(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_rotationIsDir : Error processing new value");
    cobj->rotationIsDir = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_rotationIsDir)

static bool js_cocos2dx_particle_ParticleSimulator_get_startRadius(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_startRadius : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->startRadius, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_startRadius)

static bool js_cocos2dx_particle_ParticleSimulator_set_startRadius(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_startRadius : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_startRadius : Error processing new value");
    cobj->startRadius = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_startRadius)

static bool js_cocos2dx_particle_ParticleSimulator_get_startRadiusVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_startRadiusVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->startRadiusVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_startRadiusVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_startRadiusVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_startRadiusVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_startRadiusVar : Error processing new value");
    cobj->startRadiusVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_startRadiusVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_endRadius(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_endRadius : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->endRadius, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_endRadius)

static bool js_cocos2dx_particle_ParticleSimulator_set_endRadius(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_endRadius : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_endRadius : Error processing new value");
    cobj->endRadius = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_endRadius)

static bool js_cocos2dx_particle_ParticleSimulator_get_endRadiusVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_endRadiusVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->endRadiusVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_endRadiusVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_endRadiusVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_endRadiusVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_endRadiusVar : Error processing new value");
    cobj->endRadiusVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_endRadiusVar)

static bool js_cocos2dx_particle_ParticleSimulator_get_rotatePerS(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_rotatePerS : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->rotatePerS, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_rotatePerS)

static bool js_cocos2dx_particle_ParticleSimulator_set_rotatePerS(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_rotatePerS : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_rotatePerS : Error processing new value");
    cobj->rotatePerS = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_rotatePerS)

static bool js_cocos2dx_particle_ParticleSimulator_get_rotatePerSVar(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_get_rotatePerSVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= float_to_seval(cobj->rotatePerSVar, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_particle_ParticleSimulator_get_rotatePerSVar)

static bool js_cocos2dx_particle_ParticleSimulator_set_rotatePerSVar(se::State& s)
{
    const auto& args = s.args();
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_particle_ParticleSimulator_set_rotatePerSVar : Invalid Native Object");

    CC_UNUSED bool ok = true;
    float arg0 = 0;
    ok &= seval_to_float(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_particle_ParticleSimulator_set_rotatePerSVar : Error processing new value");
    cobj->rotatePerSVar = arg0;
    return true;
}
SE_BIND_PROP_SET(js_cocos2dx_particle_ParticleSimulator_set_rotatePerSVar)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ParticleSimulator_finalize)

static bool js_cocos2dx_particle_ParticleSimulator_constructor(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = new (std::nothrow) cocos2d::ParticleSimulator();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_particle_ParticleSimulator_constructor, __jsb_cocos2d_ParticleSimulator_class, js_cocos2d_ParticleSimulator_finalize)

static bool js_cocos2dx_particle_ParticleSimulator_ctor(se::State& s)
{
    cocos2d::ParticleSimulator* cobj = new (std::nothrow) cocos2d::ParticleSimulator();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_particle_ParticleSimulator_ctor, __jsb_cocos2d_ParticleSimulator_class, js_cocos2d_ParticleSimulator_finalize)


    


static bool js_cocos2d_ParticleSimulator_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::ParticleSimulator)", s.nativeThisObject());
    cocos2d::ParticleSimulator* cobj = (cocos2d::ParticleSimulator*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ParticleSimulator_finalize)

bool js_register_cocos2dx_particle_ParticleSimulator(se::Object* obj)
{
    auto cls = se::Class::create("ParticleSimulator", obj, nullptr, _SE(js_cocos2dx_particle_ParticleSimulator_constructor));

    cls->defineProperty("positionType", _SE(js_cocos2dx_particle_ParticleSimulator_get_positionType), _SE(js_cocos2dx_particle_ParticleSimulator_set_positionType));
    cls->defineProperty("emissionRate", _SE(js_cocos2dx_particle_ParticleSimulator_get_emissionRate), _SE(js_cocos2dx_particle_ParticleSimulator_set_emissionRate));
    cls->defineProperty("totalParticles", _SE(js_cocos2dx_particle_ParticleSimulator_get_totalParticles), _SE(js_cocos2dx_particle_ParticleSimulator_set_totalParticles));
    cls->defineProperty("duration", _SE(js_cocos2dx_particle_ParticleSimulator_get_duration), _SE(js_cocos2dx_particle_ParticleSimulator_set_duration));
    cls->defineProperty("emitterMode", _SE(js_cocos2dx_particle_ParticleSimulator_get_emitterMode), _SE(js_cocos2dx_particle_ParticleSimulator_set_emitterMode));
    cls->defineProperty("life", _SE(js_cocos2dx_particle_ParticleSimulator_get_life), _SE(js_cocos2dx_particle_ParticleSimulator_set_life));
    cls->defineProperty("lifeVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_lifeVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_lifeVar));
    cls->defineProperty("startSize", _SE(js_cocos2dx_particle_ParticleSimulator_get_startSize), _SE(js_cocos2dx_particle_ParticleSimulator_set_startSize));
    cls->defineProperty("startSizeVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_startSizeVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_startSizeVar));
    cls->defineProperty("endSize", _SE(js_cocos2dx_particle_ParticleSimulator_get_endSize), _SE(js_cocos2dx_particle_ParticleSimulator_set_endSize));
    cls->defineProperty("endSizeVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_endSizeVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_endSizeVar));
    cls->defineProperty("startSpin", _SE(js_cocos2dx_particle_ParticleSimulator_get_startSpin), _SE(js_cocos2dx_particle_ParticleSimulator_set_startSpin));
    cls->defineProperty("startSpinVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_startSpinVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_startSpinVar));
    cls->defineProperty("endSpin", _SE(js_cocos2dx_particle_ParticleSimulator_get_endSpin), _SE(js_cocos2dx_particle_ParticleSimulator_set_endSpin));
    cls->defineProperty("endSpinVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_endSpinVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_endSpinVar));
    cls->defineProperty("angle", _SE(js_cocos2dx_particle_ParticleSimulator_get_angle), _SE(js_cocos2dx_particle_ParticleSimulator_set_angle));
    cls->defineProperty("angleVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_angleVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_angleVar));
    cls->defineProperty("speed", _SE(js_cocos2dx_particle_ParticleSimulator_get_speed), _SE(js_cocos2dx_particle_ParticleSimulator_set_speed));
    cls->defineProperty("speedVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_speedVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_speedVar));
    cls->defineProperty("radialAccel", _SE(js_cocos2dx_particle_ParticleSimulator_get_radialAccel), _SE(js_cocos2dx_particle_ParticleSimulator_set_radialAccel));
    cls->defineProperty("radialAccelVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_radialAccelVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_radialAccelVar));
    cls->defineProperty("tangentialAccel", _SE(js_cocos2dx_particle_ParticleSimulator_get_tangentialAccel), _SE(js_cocos2dx_particle_ParticleSimulator_set_tangentialAccel));
    cls->defineProperty("tangentialAccelVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_tangentialAccelVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_tangentialAccelVar));
    cls->defineProperty("rotationIsDir", _SE(js_cocos2dx_particle_ParticleSimulator_get_rotationIsDir), _SE(js_cocos2dx_particle_ParticleSimulator_set_rotationIsDir));
    cls->defineProperty("startRadius", _SE(js_cocos2dx_particle_ParticleSimulator_get_startRadius), _SE(js_cocos2dx_particle_ParticleSimulator_set_startRadius));
    cls->defineProperty("startRadiusVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_startRadiusVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_startRadiusVar));
    cls->defineProperty("endRadius", _SE(js_cocos2dx_particle_ParticleSimulator_get_endRadius), _SE(js_cocos2dx_particle_ParticleSimulator_set_endRadius));
    cls->defineProperty("endRadiusVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_endRadiusVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_endRadiusVar));
    cls->defineProperty("rotatePerS", _SE(js_cocos2dx_particle_ParticleSimulator_get_rotatePerS), _SE(js_cocos2dx_particle_ParticleSimulator_set_rotatePerS));
    cls->defineProperty("rotatePerSVar", _SE(js_cocos2dx_particle_ParticleSimulator_get_rotatePerSVar), _SE(js_cocos2dx_particle_ParticleSimulator_set_rotatePerSVar));
    cls->defineFunction("setGravity", _SE(js_cocos2dx_particle_ParticleSimulator_setGravity));
    cls->defineFunction("render", _SE(js_cocos2dx_particle_ParticleSimulator_render));
    cls->defineFunction("setSourcePos", _SE(js_cocos2dx_particle_ParticleSimulator_setSourcePos));
    cls->defineFunction("onEnable", _SE(js_cocos2dx_particle_ParticleSimulator_onEnable));
    cls->defineFunction("setEffect", _SE(js_cocos2dx_particle_ParticleSimulator_setEffect));
    cls->defineFunction("setPosVar", _SE(js_cocos2dx_particle_ParticleSimulator_setPosVar));
    cls->defineFunction("setEndColorVar", _SE(js_cocos2dx_particle_ParticleSimulator_setEndColorVar));
    cls->defineFunction("getParticleCount", _SE(js_cocos2dx_particle_ParticleSimulator_getParticleCount));
    cls->defineFunction("setStartColorVar", _SE(js_cocos2dx_particle_ParticleSimulator_setStartColorVar));
    cls->defineFunction("emitParticle", _SE(js_cocos2dx_particle_ParticleSimulator_emitParticle));
    cls->defineFunction("stop", _SE(js_cocos2dx_particle_ParticleSimulator_stop));
    cls->defineFunction("update", _SE(js_cocos2dx_particle_ParticleSimulator_update));
    cls->defineFunction("active", _SE(js_cocos2dx_particle_ParticleSimulator_active));
    cls->defineFunction("updateUVs", _SE(js_cocos2dx_particle_ParticleSimulator_updateUVs));
    cls->defineFunction("setStartColor", _SE(js_cocos2dx_particle_ParticleSimulator_setStartColor));
    cls->defineFunction("reset", _SE(js_cocos2dx_particle_ParticleSimulator_reset));
    cls->defineFunction("onDisable", _SE(js_cocos2dx_particle_ParticleSimulator_onDisable));
    cls->defineFunction("bindNodeProxy", _SE(js_cocos2dx_particle_ParticleSimulator_bindNodeProxy));
    cls->defineFunction("setEndColor", _SE(js_cocos2dx_particle_ParticleSimulator_setEndColor));
    cls->defineFunction("setFinishedCallback", _SE(js_cocos2dx_particle_ParticleSimulator_setFinishedCallback));
    cls->defineFunction("setStopCallback", _SE(js_cocos2dx_particle_ParticleSimulator_setStopCallback));
    cls->defineFunction("ctor", _SE(js_cocos2dx_particle_ParticleSimulator_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ParticleSimulator_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ParticleSimulator>(cls);

    __jsb_cocos2d_ParticleSimulator_proto = cls->getProto();
    __jsb_cocos2d_ParticleSimulator_class = cls;

    jsb_set_extend_property("middleware", "ParticleSimulator");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_particle(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("middleware", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("middleware", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_cocos2dx_particle_ParticleSimulator(ns);
    return true;
}

#endif //#if USE_PARTICLE > 0
