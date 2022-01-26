
// clang-format off
#include "cocos/bindings/auto/jsb_audio_auto.h"
#if (USE_AUDIO > 0)
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "audio/include/AudioEngine.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_AudioProfile_proto = nullptr; // NOLINT
se::Class* __jsb_cc_AudioProfile_class = nullptr;  // NOLINT

static bool js_audio_AudioProfile_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AudioProfile>(s);
    SE_PRECONDITION2(cobj, false, "js_audio_AudioProfile_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_audio_AudioProfile_get_name)

static bool js_audio_AudioProfile_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::AudioProfile>(s);
    SE_PRECONDITION2(cobj, false, "js_audio_AudioProfile_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_audio_AudioProfile_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_audio_AudioProfile_set_name)

static bool js_audio_AudioProfile_get_maxInstances(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AudioProfile>(s);
    SE_PRECONDITION2(cobj, false, "js_audio_AudioProfile_get_maxInstances : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxInstances, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxInstances, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_audio_AudioProfile_get_maxInstances)

static bool js_audio_AudioProfile_set_maxInstances(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::AudioProfile>(s);
    SE_PRECONDITION2(cobj, false, "js_audio_AudioProfile_set_maxInstances : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxInstances, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_audio_AudioProfile_set_maxInstances : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_audio_AudioProfile_set_maxInstances)

static bool js_audio_AudioProfile_get_minDelay(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AudioProfile>(s);
    SE_PRECONDITION2(cobj, false, "js_audio_AudioProfile_get_minDelay : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->minDelay, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->minDelay, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_audio_AudioProfile_get_minDelay)

static bool js_audio_AudioProfile_set_minDelay(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::AudioProfile>(s);
    SE_PRECONDITION2(cobj, false, "js_audio_AudioProfile_set_minDelay : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->minDelay, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_audio_AudioProfile_set_minDelay : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_audio_AudioProfile_set_minDelay)

SE_DECLARE_FINALIZE_FUNC(js_cc_AudioProfile_finalize)

static bool js_audio_AudioProfile_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::AudioProfile);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_audio_AudioProfile_constructor, __jsb_cc_AudioProfile_class, js_cc_AudioProfile_finalize)

static bool js_cc_AudioProfile_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_AudioProfile_finalize)

bool js_register_audio_AudioProfile(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AudioProfile", obj, nullptr, _SE(js_audio_AudioProfile_constructor));

    cls->defineProperty("name", _SE(js_audio_AudioProfile_get_name), _SE(js_audio_AudioProfile_set_name));
    cls->defineProperty("maxInstances", _SE(js_audio_AudioProfile_get_maxInstances), _SE(js_audio_AudioProfile_set_maxInstances));
    cls->defineProperty("minDelay", _SE(js_audio_AudioProfile_get_minDelay), _SE(js_audio_AudioProfile_set_minDelay));
    cls->defineFinalizeFunction(_SE(js_cc_AudioProfile_finalize));
    cls->install();
    JSBClassType::registerClass<cc::AudioProfile>(cls);

    __jsb_cc_AudioProfile_proto = cls->getProto();
    __jsb_cc_AudioProfile_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_AudioEngine_proto = nullptr; // NOLINT
se::Class* __jsb_cc_AudioEngine_class = nullptr;  // NOLINT

static bool js_audio_AudioEngine_end_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::AudioEngine::end();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_end_static)

static bool js_audio_AudioEngine_getCurrentTime_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getCurrentTime_static : Error processing arguments");
        float result = cc::AudioEngine::getCurrentTime(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getCurrentTime_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getCurrentTime_static)

static bool js_audio_AudioEngine_getDefaultProfile_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::AudioProfile* result = cc::AudioEngine::getDefaultProfile();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getDefaultProfile_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getDefaultProfile_static)

static bool js_audio_AudioEngine_getDuration_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getDuration_static : Error processing arguments");
        float result = cc::AudioEngine::getDuration(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getDuration_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getDuration_static)

static bool js_audio_AudioEngine_getDurationFromFile_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getDurationFromFile_static : Error processing arguments");
        float result = cc::AudioEngine::getDurationFromFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getDurationFromFile_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getDurationFromFile_static)

static bool js_audio_AudioEngine_getMaxAudioInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cc::AudioEngine::getMaxAudioInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getMaxAudioInstance_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getMaxAudioInstance_static)

static bool js_audio_AudioEngine_getPlayingAudioCount_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cc::AudioEngine::getPlayingAudioCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getPlayingAudioCount_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getPlayingAudioCount_static)

static bool js_audio_AudioEngine_getProfile_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::AudioProfile* result = cc::AudioEngine::getProfile(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getProfile_static : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while (false);
    do {
        if (argc == 1) {
            HolderType<int, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::AudioProfile* result = cc::AudioEngine::getProfile(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getProfile_static : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getProfile_static)

static bool js_audio_AudioEngine_getState_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getState_static : Error processing arguments");
        auto result = static_cast<int>(cc::AudioEngine::getState(arg0.value()));
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getState_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getState_static)

static bool js_audio_AudioEngine_getVolume_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getVolume_static : Error processing arguments");
        float result = cc::AudioEngine::getVolume(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getVolume_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getVolume_static)

static bool js_audio_AudioEngine_isEnabled_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cc::AudioEngine::isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_isEnabled_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_isEnabled_static)

static bool js_audio_AudioEngine_isLoop_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_isLoop_static : Error processing arguments");
        bool result = cc::AudioEngine::isLoop(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_isLoop_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_isLoop_static)

static bool js_audio_AudioEngine_lazyInit_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cc::AudioEngine::lazyInit();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_lazyInit_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_lazyInit_static)

static bool js_audio_AudioEngine_pause_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_pause_static : Error processing arguments");
        cc::AudioEngine::pause(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_pause_static)

static bool js_audio_AudioEngine_pauseAll_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::AudioEngine::pauseAll();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_pauseAll_static)

static bool js_audio_AudioEngine_play2d_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_play2d_static : Error processing arguments");
        int result = cc::AudioEngine::play2d(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_play2d_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_play2d_static : Error processing arguments");
        int result = cc::AudioEngine::play2d(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_play2d_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_play2d_static : Error processing arguments");
        int result = cc::AudioEngine::play2d(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_play2d_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 4) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<const cc::AudioProfile*, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        ok &= sevalue_to_native(args[3], &arg3, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_play2d_static : Error processing arguments");
        int result = cc::AudioEngine::play2d(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_play2d_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_play2d_static)

static bool js_audio_AudioEngine_preload_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::function<void (bool)>, true> arg1 = {};
            do {
                if (args[1].isObject() && args[1].toObject()->isFunction())
                {
                    se::Value jsThis(s.thisObject());
                    se::Value jsFunc(args[1]);
                    jsFunc.toObject()->root();
                    auto * thisObj = s.thisObject();
                    auto lambda = [=](bool larg0) -> void {
                        se::ScriptEngine::getInstance()->clearException();
                        se::AutoHandleScope hs;
            
                        CC_UNUSED bool ok = true;
                        se::ValueArray args;
                        args.resize(1);
                        ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                        se::Value rval;
                        se::Object* funcObj = jsFunc.toObject();
                        bool succeed = funcObj->call(args, thisObj, &rval);
                        if (!succeed) {
                            se::ScriptEngine::getInstance()->clearException();
                        }
                    };
                    arg1.data = lambda;
                }
                else
                {
                    arg1.data = nullptr;
                }
            } while(false)
            ;
            if (!ok) { ok = true; break; }
            cc::AudioEngine::preload(arg0.value(), arg1.value());
            return true;
        }
    } while (false);
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::AudioEngine::preload(arg0.value());
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_preload_static)

static bool js_audio_AudioEngine_resume_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_resume_static : Error processing arguments");
        cc::AudioEngine::resume(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_resume_static)

static bool js_audio_AudioEngine_resumeAll_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::AudioEngine::resumeAll();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_resumeAll_static)

static bool js_audio_AudioEngine_setCurrentTime_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_setCurrentTime_static : Error processing arguments");
        bool result = cc::AudioEngine::setCurrentTime(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_setCurrentTime_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_setCurrentTime_static)

static bool js_audio_AudioEngine_setEnabled_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_setEnabled_static : Error processing arguments");
        cc::AudioEngine::setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_setEnabled_static)

static bool js_audio_AudioEngine_setFinishCallback_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<std::function<void (int, const std::string)>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsFunc.toObject()->root();
                auto * thisObj = s.thisObject();
                auto lambda = [=](int larg0, const std::string larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_setFinishCallback_static : Error processing arguments");
        cc::AudioEngine::setFinishCallback(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_setFinishCallback_static)

static bool js_audio_AudioEngine_setLoop_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_setLoop_static : Error processing arguments");
        cc::AudioEngine::setLoop(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_setLoop_static)

static bool js_audio_AudioEngine_setMaxAudioInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_setMaxAudioInstance_static : Error processing arguments");
        bool result = cc::AudioEngine::setMaxAudioInstance(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_setMaxAudioInstance_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_setMaxAudioInstance_static)

static bool js_audio_AudioEngine_setVolume_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_setVolume_static : Error processing arguments");
        cc::AudioEngine::setVolume(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_setVolume_static)

static bool js_audio_AudioEngine_stop_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_stop_static : Error processing arguments");
        cc::AudioEngine::stop(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_stop_static)

static bool js_audio_AudioEngine_stopAll_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::AudioEngine::stopAll();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_stopAll_static)

static bool js_audio_AudioEngine_uncache_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_uncache_static : Error processing arguments");
        cc::AudioEngine::uncache(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_uncache_static)

static bool js_audio_AudioEngine_uncacheAll_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::AudioEngine::uncacheAll();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_uncacheAll_static)

bool js_register_audio_AudioEngine(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AudioEngine", obj, nullptr, nullptr);

    cls->defineStaticFunction("end", _SE(js_audio_AudioEngine_end_static));
    cls->defineStaticFunction("getCurrentTime", _SE(js_audio_AudioEngine_getCurrentTime_static));
    cls->defineStaticFunction("getDefaultProfile", _SE(js_audio_AudioEngine_getDefaultProfile_static));
    cls->defineStaticFunction("getDuration", _SE(js_audio_AudioEngine_getDuration_static));
    cls->defineStaticFunction("getDurationFromFile", _SE(js_audio_AudioEngine_getDurationFromFile_static));
    cls->defineStaticFunction("getMaxAudioInstance", _SE(js_audio_AudioEngine_getMaxAudioInstance_static));
    cls->defineStaticFunction("getPlayingAudioCount", _SE(js_audio_AudioEngine_getPlayingAudioCount_static));
    cls->defineStaticFunction("getProfile", _SE(js_audio_AudioEngine_getProfile_static));
    cls->defineStaticFunction("getState", _SE(js_audio_AudioEngine_getState_static));
    cls->defineStaticFunction("getVolume", _SE(js_audio_AudioEngine_getVolume_static));
    cls->defineStaticFunction("isEnabled", _SE(js_audio_AudioEngine_isEnabled_static));
    cls->defineStaticFunction("isLoop", _SE(js_audio_AudioEngine_isLoop_static));
    cls->defineStaticFunction("lazyInit", _SE(js_audio_AudioEngine_lazyInit_static));
    cls->defineStaticFunction("pause", _SE(js_audio_AudioEngine_pause_static));
    cls->defineStaticFunction("pauseAll", _SE(js_audio_AudioEngine_pauseAll_static));
    cls->defineStaticFunction("play2d", _SE(js_audio_AudioEngine_play2d_static));
    cls->defineStaticFunction("preload", _SE(js_audio_AudioEngine_preload_static));
    cls->defineStaticFunction("resume", _SE(js_audio_AudioEngine_resume_static));
    cls->defineStaticFunction("resumeAll", _SE(js_audio_AudioEngine_resumeAll_static));
    cls->defineStaticFunction("setCurrentTime", _SE(js_audio_AudioEngine_setCurrentTime_static));
    cls->defineStaticFunction("setEnabled", _SE(js_audio_AudioEngine_setEnabled_static));
    cls->defineStaticFunction("setFinishCallback", _SE(js_audio_AudioEngine_setFinishCallback_static));
    cls->defineStaticFunction("setLoop", _SE(js_audio_AudioEngine_setLoop_static));
    cls->defineStaticFunction("setMaxAudioInstance", _SE(js_audio_AudioEngine_setMaxAudioInstance_static));
    cls->defineStaticFunction("setVolume", _SE(js_audio_AudioEngine_setVolume_static));
    cls->defineStaticFunction("stop", _SE(js_audio_AudioEngine_stop_static));
    cls->defineStaticFunction("stopAll", _SE(js_audio_AudioEngine_stopAll_static));
    cls->defineStaticFunction("uncache", _SE(js_audio_AudioEngine_uncache_static));
    cls->defineStaticFunction("uncacheAll", _SE(js_audio_AudioEngine_uncacheAll_static));
    cls->install();
    JSBClassType::registerClass<cc::AudioEngine>(cls);

    __jsb_cc_AudioEngine_proto = cls->getProto();
    __jsb_cc_AudioEngine_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_audio(se::Object* obj)    // NOLINT
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

    js_register_audio_AudioEngine(ns);
    js_register_audio_AudioProfile(ns);
    return true;
}

#endif //#if (USE_AUDIO > 0)
// clang-format on