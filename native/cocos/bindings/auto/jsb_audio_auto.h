// clang-format off
#pragma once
#include "base/Config.h"
#if (USE_AUDIO > 0)
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/audio/include/AudioEngine.h"

bool register_all_audio(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::AudioProfile);
JSB_REGISTER_OBJECT_TYPE(cc::AudioEngine);


extern se::Object *__jsb_cc_AudioProfile_proto; // NOLINT
extern se::Class * __jsb_cc_AudioProfile_class; // NOLINT

bool js_register_cc_AudioProfile(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_audio_AudioProfile_AudioProfile);

extern se::Object *__jsb_cc_AudioEngine_proto; // NOLINT
extern se::Class * __jsb_cc_AudioEngine_class; // NOLINT

bool js_register_cc_AudioEngine(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_audio_AudioEngine_end);
SE_DECLARE_FUNC(js_audio_AudioEngine_getCurrentTime);
SE_DECLARE_FUNC(js_audio_AudioEngine_getDefaultProfile);
SE_DECLARE_FUNC(js_audio_AudioEngine_getDuration);
SE_DECLARE_FUNC(js_audio_AudioEngine_getDurationFromFile);
SE_DECLARE_FUNC(js_audio_AudioEngine_getMaxAudioInstance);
SE_DECLARE_FUNC(js_audio_AudioEngine_getPlayingAudioCount);
SE_DECLARE_FUNC(js_audio_AudioEngine_getProfile);
SE_DECLARE_FUNC(js_audio_AudioEngine_getState);
SE_DECLARE_FUNC(js_audio_AudioEngine_getVolume);
SE_DECLARE_FUNC(js_audio_AudioEngine_isEnabled);
SE_DECLARE_FUNC(js_audio_AudioEngine_isLoop);
SE_DECLARE_FUNC(js_audio_AudioEngine_lazyInit);
SE_DECLARE_FUNC(js_audio_AudioEngine_pause);
SE_DECLARE_FUNC(js_audio_AudioEngine_pauseAll);
SE_DECLARE_FUNC(js_audio_AudioEngine_play2d);
SE_DECLARE_FUNC(js_audio_AudioEngine_preload);
SE_DECLARE_FUNC(js_audio_AudioEngine_resume);
SE_DECLARE_FUNC(js_audio_AudioEngine_resumeAll);
SE_DECLARE_FUNC(js_audio_AudioEngine_setCurrentTime);
SE_DECLARE_FUNC(js_audio_AudioEngine_setEnabled);
SE_DECLARE_FUNC(js_audio_AudioEngine_setFinishCallback);
SE_DECLARE_FUNC(js_audio_AudioEngine_setLoop);
SE_DECLARE_FUNC(js_audio_AudioEngine_setMaxAudioInstance);
SE_DECLARE_FUNC(js_audio_AudioEngine_setVolume);
SE_DECLARE_FUNC(js_audio_AudioEngine_stop);
SE_DECLARE_FUNC(js_audio_AudioEngine_stopAll);
SE_DECLARE_FUNC(js_audio_AudioEngine_uncache);
SE_DECLARE_FUNC(js_audio_AudioEngine_uncacheAll);
#endif //#if (USE_AUDIO > 0)
    // clang-format on