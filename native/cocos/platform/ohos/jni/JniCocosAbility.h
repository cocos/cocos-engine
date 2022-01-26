/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include <native_layer.h>
#include <native_layer_jni.h>
#include <rawfile/resource_manager.h>
#include <condition_variable>
#include <mutex>
#include <string>

#include <future>

namespace cc {

// struct CocosApp {
//     ResourceManager *resourceManager = nullptr;
//     // NativeLayer *window = nullptr;
//     int sdkVersion = 0;

//     std::promise<void> glThreadPromise;

//     NativeLayer *pendingWindow    = nullptr;
//     bool         destroyRequested = false;
//     bool         animating        = true;
//     bool         running          = false;
//     bool         surfaceInited    = false;

//     // Current state of the app's activity.  May be either APP_CMD_RESUME, APP_CMD_PAUSE.
//     int activityState = 0;
// };

// extern CocosApp cocosApp;

} // namespace cc
