#include "jsb_audio_manual.h"
#include <stdint.h>
#include "State.h"
#include "bindings/auto/jsb_audio_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "audio/include/AudioEngine.h"
#include "v8/HelperMacros.h"

bool register_all_audio_manuel(se::Object* obj) // NOLINT
{
        // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal, true))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_cc_AudioEngine_manual(ns);
    return true;
}

bool js_register_cc_AudioEngine_manual(se::Object* obj) // NOLINT
{
    __jsb_cc_AudioEngine_class->defineStaticFunction("getSampleRate", _SE(js_audio_AudioEngine_getSampleRate));
    __jsb_cc_AudioEngine_class->defineStaticFunction("getPCMBuffer", _SE(js_audio_AudioEngine_getPCMBuffer));
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

static bool js_audio_AudioEngine_getSampleRate(se::State &s) // NOLINT
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0;
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getSampleRate_static : Error processing arguments");
        unsigned int result = cc::AudioEngine::getSampleRate(arg0);
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getSampleRate_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;

}
SE_BIND_FUNC(js_audio_AudioEngine_getSampleRate)

static bool js_audio_AudioEngine_getPCMBuffer(se::State &s) // NOLINT
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const char* arg0;
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getPCMBuffer_static : Error processing arguments");
        
        uint32_t arg1;
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getPCMBuffer_static : Error processing arguments");
        
        std::vector<float> result = cc::AudioEngine::getPCMBuffer(arg0, arg1);
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getSampleRate_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;

}
SE_BIND_FUNC(js_audio_AudioEngine_getPCMBuffer)