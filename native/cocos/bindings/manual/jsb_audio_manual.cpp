#include "jsb_audio_manual.h"
#include <cstdint>
#include "State.h"
#include "bindings/auto/jsb_audio_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "audio/include/AudioEngine.h"
#include "audio/include/Common.h"
#include "v8/HelperMacros.h"

// NOLINTNEXTLINE(readability-identifier-naming)
static bool PCMHeader_to_seval(WavePCMHeader& header, se::Value* ret) {
    CC_ASSERT(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("totalFrames", se::Value(header.totalFrames));
    obj->setProperty("sampleRate", se::Value(header.sampleRate));
    obj->setProperty("bytesPerFrame", se::Value(header.bytesPerFrame));
    obj->setProperty("channelCount", se::Value(header.channelCount));
    obj->setProperty("audioFormat", se::Value(static_cast<int>(header.dataFormat)));
    ret->setObject(obj);

    return true;
}
static bool js_audio_AudioEngine_getPCMHeader(se::State& s) // NOLINT
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ccstd::string arg0;
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getSampleRate_static : Error processing arguments");
        WavePCMHeader header = cc::AudioEngine::getPCMHeader(arg0.c_str());
        ok &= PCMHeader_to_seval(header, &s.rval());
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getSampleRate_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;

}
SE_BIND_FUNC(js_audio_AudioEngine_getPCMHeader)

static bool js_audio_AudioEngine_getOriginalPCMBuffer(se::State& s) // NOLINT
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        ccstd::string arg0; // url of audio
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getPCMBuffer_static : Error processing arguments");
        
        uint32_t arg1{0};
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getPCMBuffer_static : Error processing arguments");
        
        ccstd::vector<uint8_t> buffer = cc::AudioEngine::getOriginalPCMBuffer(arg0.c_str(), arg1);
        //ok &= nativevalue_to_se(buffer, s.rval(), nullptr /*ctx*/);
        s.rval().setObject(se::Object::createArrayBufferObject(buffer.data(), buffer.size()));
        SE_PRECONDITION2(ok, false, "js_audio_AudioEngine_getSampleRate_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;

}
SE_BIND_FUNC(js_audio_AudioEngine_getOriginalPCMBuffer)

bool register_all_audio_manual(se::Object* obj) // NOLINT
{
    se::Value jsbVal;
    obj->getProperty("jsb", &jsbVal);
    se::Value audioEngineVal;
    jsbVal.toObject()->getProperty("AudioEngine", &audioEngineVal);

    audioEngineVal.toObject()->defineFunction("getPCMHeader", _SE(js_audio_AudioEngine_getPCMHeader));
    audioEngineVal.toObject()->defineFunction("getOriginalPCMBuffer", _SE(js_audio_AudioEngine_getOriginalPCMBuffer));
    // Get the ns

    return true;
}
