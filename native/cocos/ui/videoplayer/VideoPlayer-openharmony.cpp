/****************************************************************************
 Copyright (c) 2023-2024 Xiamen Yaji Software Co., Ltd.

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

#include "VideoPlayer-openharmony.h"

#include "cocos/platform/CCApplication.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "platform/openharmony/napi/NapiHelper.h"
namespace cc
{

/*************************************************************************
 Global variables and functions.
************************************************************************/

namespace {
se::Value videoCallback;

void getVideoMessageCallback() {
    if (!videoCallback.isUndefined())
        return;

    auto global = se::ScriptEngine::getInstance()->getGlobalObject();
    se::Value jsbVal;
    if (global->getProperty("jsb", &jsbVal) && jsbVal.isObject()) {
        jsbVal.toObject()->getProperty("onVideoEvent", &videoCallback);
        // free globle se::Value before ScriptEngine clean up
        se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
            videoCallback.setUndefined();
        });
    }
}

void callJSFunc(const std::string &data) {
    getVideoMessageCallback();

    se::AutoHandleScope scope;
    se::ValueArray args;
    args.push_back(se::Value(data));
    if(videoCallback.isObject()) {
        videoCallback.toObject()->call(args, nullptr);
    }
}

} // namespace

/*************************************************************************
Implementation of EditBox.
************************************************************************/

void OpenHarmonyVideoPlayer::napiVideoMessageHandle(const Napi::CallbackInfo &info) {
    auto env = info.Env();
    if (info.Length() != 1) {
        Napi::Error::New(env, "napiVideoMessageHandle, 1 argumentss expected").ThrowAsJavaScriptException();
        return;
    }

    if (!info[0].IsString()) {
        Napi::TypeError::New(env, "napiVideoMessageHandle, string argument expected").ThrowAsJavaScriptException();
        return;
    }

    std::string data = info[0].As<Napi::String>().Utf8Value();
    callJSFunc(data);
}

} // namespace cocos2d


