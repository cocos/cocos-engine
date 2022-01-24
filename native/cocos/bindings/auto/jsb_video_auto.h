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
#if (USE_VIDEO > 0)
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/ui/videoplayer/VideoPlayer.h"

extern se::Object* __jsb_cc_VideoPlayer_proto;
extern se::Class* __jsb_cc_VideoPlayer_class;

bool js_register_cc_VideoPlayer(se::Object* obj);
bool register_all_video(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::VideoPlayer);
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
