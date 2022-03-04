// clang-format off
#pragma once
#include "base/Config.h"
#if (USE_VIDEO > 0)
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/ui/videoplayer/VideoPlayer.h"

bool register_all_video(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::VideoPlayer);


extern se::Object *__jsb_cc_VideoPlayer_proto; // NOLINT
extern se::Class * __jsb_cc_VideoPlayer_class; // NOLINT

bool js_register_cc_VideoPlayer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_video_VideoPlayer_addEventListener);
SE_DECLARE_FUNC(js_video_VideoPlayer_currentTime);
SE_DECLARE_FUNC(js_video_VideoPlayer_duration);
SE_DECLARE_FUNC(js_video_VideoPlayer_isKeepAspectRatioEnabled);
SE_DECLARE_FUNC(js_video_VideoPlayer_onPlayEvent);
SE_DECLARE_FUNC(js_video_VideoPlayer_pause);
SE_DECLARE_FUNC(js_video_VideoPlayer_play);
SE_DECLARE_FUNC(js_video_VideoPlayer_seekTo);
SE_DECLARE_FUNC(js_video_VideoPlayer_setFrame);
SE_DECLARE_FUNC(js_video_VideoPlayer_setFullScreenEnabled);
SE_DECLARE_FUNC(js_video_VideoPlayer_setKeepAspectRatioEnabled);
SE_DECLARE_FUNC(js_video_VideoPlayer_setURL);
SE_DECLARE_FUNC(js_video_VideoPlayer_setVisible);
SE_DECLARE_FUNC(js_video_VideoPlayer_stop);
SE_DECLARE_FUNC(js_video_VideoPlayer_VideoPlayer);
#endif //#if (USE_VIDEO > 0)
    // clang-format on