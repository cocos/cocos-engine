/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include "base/Config.h"
#if (USE_AUDIO > 0)
    #include <type_traits>
    #include "cocos/audio/include/AudioEngine.h"
    #include "cocos/bindings/jswrapper/SeApi.h"
    #include "cocos/bindings/manual/jsb_conversions.h"

extern se::Object* __jsb_cc_AudioProfile_proto;
extern se::Class*  __jsb_cc_AudioProfile_class;

bool js_register_cc_AudioProfile(se::Object* obj);
bool register_all_audio(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::AudioProfile);
SE_DECLARE_FUNC(js_audio_AudioProfile_AudioProfile);

extern se::Object* __jsb_cc_AudioEngine_proto;
extern se::Class*  __jsb_cc_AudioEngine_class;

bool js_register_cc_AudioEngine(se::Object* obj);
bool register_all_audio(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::AudioEngine);
SE_DECLARE_FUNC(js_audio_AudioEngine_lazyInit);
SE_DECLARE_FUNC(js_audio_AudioEngine_end);
SE_DECLARE_FUNC(js_audio_AudioEngine_getDefaultProfile);
SE_DECLARE_FUNC(js_audio_AudioEngine_play2d);
SE_DECLARE_FUNC(js_audio_AudioEngine_setLoop);
SE_DECLARE_FUNC(js_audio_AudioEngine_isLoop);
SE_DECLARE_FUNC(js_audio_AudioEngine_setVolume);
SE_DECLARE_FUNC(js_audio_AudioEngine_getVolume);
SE_DECLARE_FUNC(js_audio_AudioEngine_pause);
SE_DECLARE_FUNC(js_audio_AudioEngine_pauseAll);
SE_DECLARE_FUNC(js_audio_AudioEngine_resume);
SE_DECLARE_FUNC(js_audio_AudioEngine_resumeAll);
SE_DECLARE_FUNC(js_audio_AudioEngine_stop);
SE_DECLARE_FUNC(js_audio_AudioEngine_stopAll);
SE_DECLARE_FUNC(js_audio_AudioEngine_setCurrentTime);
SE_DECLARE_FUNC(js_audio_AudioEngine_getCurrentTime);
SE_DECLARE_FUNC(js_audio_AudioEngine_getDuration);
SE_DECLARE_FUNC(js_audio_AudioEngine_getDurationFromFile);
SE_DECLARE_FUNC(js_audio_AudioEngine_getState);
SE_DECLARE_FUNC(js_audio_AudioEngine_setFinishCallback);
SE_DECLARE_FUNC(js_audio_AudioEngine_getMaxAudioInstance);
SE_DECLARE_FUNC(js_audio_AudioEngine_setMaxAudioInstance);
SE_DECLARE_FUNC(js_audio_AudioEngine_uncache);
SE_DECLARE_FUNC(js_audio_AudioEngine_uncacheAll);
SE_DECLARE_FUNC(js_audio_AudioEngine_getProfile);
SE_DECLARE_FUNC(js_audio_AudioEngine_preload);
SE_DECLARE_FUNC(js_audio_AudioEngine_getPlayingAudioCount);
SE_DECLARE_FUNC(js_audio_AudioEngine_setEnabled);
SE_DECLARE_FUNC(js_audio_AudioEngine_isEnabled);

#endif //#if (USE_AUDIO > 0)
