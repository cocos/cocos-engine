// clang-format off
#pragma once

#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/audio/include/AudioEngine.h"

bool register_all_audio_manual(se::Object *obj); // NOLINT

extern se::Object *__jsb_cc_AudioEngine_proto; // NOLINT
extern se::Class * __jsb_cc_AudioEngine_class; // NOLINT

bool js_register_cc_AudioEngine_manual(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_audio_AudioEngine_getPCMBuffer);
SE_DECLARE_FUNC(js_audio_AudioEngine_getSampleRate);
