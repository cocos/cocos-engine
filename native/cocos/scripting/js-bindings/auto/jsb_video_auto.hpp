#pragma once
#include "base/ccConfig.h"
#if (USE_VIDEO > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cocos2d_VideoPlayer_proto;
extern se::Class* __jsb_cocos2d_VideoPlayer_class;

bool js_register_cocos2d_VideoPlayer(se::Object* obj);
bool register_all_video(se::Object* obj);
SE_DECLARE_FUNC(js_video_VideoPlayer_setFrame);
SE_DECLARE_FUNC(js_video_VideoPlayer_play);
SE_DECLARE_FUNC(js_video_VideoPlayer_pause);
SE_DECLARE_FUNC(js_video_VideoPlayer_setKeepAspectRatioEnabled);
SE_DECLARE_FUNC(js_video_VideoPlayer_currentTime);
SE_DECLARE_FUNC(js_video_VideoPlayer_setFullScreenEnabled);
SE_DECLARE_FUNC(js_video_VideoPlayer_addEventListener);
SE_DECLARE_FUNC(js_video_VideoPlayer_stop);
SE_DECLARE_FUNC(js_video_VideoPlayer_setURL);
SE_DECLARE_FUNC(js_video_VideoPlayer_isKeepAspectRatioEnabled);
SE_DECLARE_FUNC(js_video_VideoPlayer_onPlayEvent);
SE_DECLARE_FUNC(js_video_VideoPlayer_duration);
SE_DECLARE_FUNC(js_video_VideoPlayer_setVisible);
SE_DECLARE_FUNC(js_video_VideoPlayer_seekTo);
SE_DECLARE_FUNC(js_video_VideoPlayer_VideoPlayer);

#endif //#if (USE_VIDEO > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
