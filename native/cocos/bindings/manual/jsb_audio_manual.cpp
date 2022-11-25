#include "jsb_audio_manual.h"
#include <cstdint>
#include "State.h"
#include "bindings/auto/jsb_audio_auto.h"
#include "bindings/auto/jsb_audio_graph_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/base/ThreadPool.h"
#include "v8/HelperMacros.h"
#include "application/ApplicationManager.h"

// NOLINTNEXTLINE(readability-identifier-naming)
static bool PCMHeader_to_seval(PCMHeader& header, se::Value* ret) {
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        PCMHeader header = cc::AudioEngine::getPCMHeader(arg0.c_str());
        ok &= PCMHeader_to_seval(header, &s.rval());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        uint32_t arg1{0};
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        ccstd::vector<uint8_t> buffer = cc::AudioEngine::getOriginalPCMBuffer(arg0.c_str(), arg1);
        se::HandleObject obj(se::Object::createArrayBufferObject(buffer.data(), buffer.size()));
        s.rval().setObject(obj);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_audio_AudioEngine_getOriginalPCMBuffer)

// bool register_all_audio_manual(se::Object* obj) // NOLINT
// {
//     se::Value jsbVal;
//     obj->getProperty("jsb", &jsbVal);
//     se::Value audioEngineVal;
//     jsbVal.toObject()->getProperty("AudioEngine", &audioEngineVal);

//     audioEngineVal.toObject()->defineFunction("getPCMHeader", _SE(js_audio_AudioEngine_getPCMHeader));
//     audioEngineVal.toObject()->defineFunction("getOriginalPCMBuffer", _SE(js_audio_AudioEngine_getOriginalPCMBuffer));
//     return true;
// }

static bool js_audio_BaseAudioContext_decodeAudioDataFromUrl(se::State& s) { // NOLINT
    const auto& args = s.args();
    size_t argc = args.size();
    bool ok = true;
    if (argc == 2) {
        cc::BaseAudioContext* ctx = SE_THIS_OBJECT<cc::BaseAudioContext>(s);
        SE_PRECONDITION2(ctx, false, "%s, Invalid Native Object", __FUNCTION__);
        ccstd::string url;
        ok &= sevalue_to_native(args[0], &url);
        se::Value callbackVal = args[1];
        se::Object* callbackObj{nullptr};
        if (!callbackVal.isNull()) {
            CC_ASSERT(callbackVal.isObject());
            CC_ASSERT(callbackVal.toObject()->isFunction());
            callbackObj = callbackVal.toObject();
            callbackObj->root();
            callbackObj->incRef();
        }
        auto func = [=](int/*thread id*/) {
            auto buffer = ctx->decodeAudioDataFromUrl(url);
            CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([=]() {
                se::AutoHandleScope hs;
                se::Value bufferVal;
                nativevalue_to_se(buffer, bufferVal);
                callbackObj->call({bufferVal}, nullptr);
                callbackObj->unroot();
                callbackObj->decRef();
            });
        };
        cc::LegacyThreadPool::getDefaultThreadPool()->pushTask(func);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}

SE_BIND_FUNC(js_audio_BaseAudioContext_decodeAudioDataFromUrl);
static bool js_audio_SourceNode_onEnded(se::State&s) {
    const auto& args = s.args();
    size_t argc = args.size();
    bool ok = true;
    if (argc == 2) {
        cc::SourceNode* sourceNode = SE_THIS_OBJECT<cc::SourceNode>(s);
        SE_PRECONDITION2(sourceNode, false, "%s, Invalid Native Object", __FUNCTION__);
        se::Value callbackVal = args[1];
        se::Object* callbackObj{nullptr};
        if (!callbackVal.isNull()) {
            CC_ASSERT(callbackVal.isObject());
            CC_ASSERT(callbackVal.toObject()->isFunction());
            callbackObj = callbackVal.toObject();
            callbackObj->root();
            callbackObj->incRef();
        }
        sourceNode->setOnEnded([=](){
            callbackObj->call({}, nullptr);
        });
        return true;
    }
    return false;
}
SE_BIND_FUNC(js_audio_SourceNode_onEnded);

bool register_all_audio_manual(se::Object* obj) // NOLINT
{
    se::Value jsbVal;
    obj->getProperty("jsb", &jsbVal);
    se::Value audioEngineVal;
    jsbVal.toObject()->getProperty("AudioEngine", &audioEngineVal);

    audioEngineVal.toObject()->defineFunction("getPCMHeader", _SE(js_audio_AudioEngine_getPCMHeader));
    audioEngineVal.toObject()->defineFunction("getOriginalPCMBuffer", _SE(js_audio_AudioEngine_getOriginalPCMBuffer));
    
    __jsb_cc_BaseAudioContext_proto->defineFunction("decodeAudioDataFromUrl", _SE(js_audio_BaseAudioContext_decodeAudioDataFromUrl));
    __jsb_cc_SourceNode_proto->defineFunction("onEnded", _SE(js_audio_SourceNode_onEnded));
    return true;
}
