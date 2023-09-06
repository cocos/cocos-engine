/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "EditBox.h"
#include "EditBox-openharmony.h"

#include "application/ApplicationManager.h"
#include "platform/openharmony/napi/NapiHelper.h"
#include "bindings/jswrapper/SeApi.h"

namespace cc {

/*************************************************************************
 Global variables and functions.
************************************************************************/

namespace {
se::Value g_textInputCallback;

void getTextInputCallback() {
    if (!g_textInputCallback.isUndefined())
        return;

    auto global = se::ScriptEngine::getInstance()->getGlobalObject();
    se::Value jsbVal;
    if (global->getProperty("jsb", &jsbVal) && jsbVal.isObject()) {
        jsbVal.toObject()->getProperty("onTextInput", &g_textInputCallback);
        // free globle se::Value before ScriptEngine clean up
        se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
            g_textInputCallback.setUndefined();
        });
    }
}

void callJSFunc(const ccstd::string &type, const ccstd::string &text) {
    getTextInputCallback();

    se::AutoHandleScope scope;
    se::ValueArray args;
    args.push_back(se::Value(type));
    args.push_back(se::Value(text));
    g_textInputCallback.toObject()->call(args, nullptr);
}

} // namespace

/*************************************************************************
Implementation of EditBox.
************************************************************************/
void EditBox::show(const EditBox::ShowInfo &showInfo) {
    NapiHelper::postMessageToUIThread("showEditBox", Napi::String::New(NapiHelper::getWorkerEnv(), showInfo.defaultValue));
}

void EditBox::hide() {
    NapiHelper::postMessageToUIThread("hideEditBox", Napi::String::New(NapiHelper::getWorkerEnv(), ""));
}

bool EditBox::complete() {
    callJSFunc("complete", "");
    return true;
}

void OpenHarmonyEditBox::napiOnComplete(const Napi::CallbackInfo &info) {
    EditBox::complete();
}

void OpenHarmonyEditBox::napiOnTextChange(const Napi::CallbackInfo &info) {
    auto env = info.Env();
    if (info.Length() != 1) {
        Napi::Error::New(env, "napiOnTextChange, 1 argument expected").ThrowAsJavaScriptException();
        return;
    }

    if (!info[0].IsString()) {
        Napi::TypeError::New(env, "napiOnTextChange, string argument expected").ThrowAsJavaScriptException();
        return;
    }

    ccstd::string buffer = info[0].As<Napi::String>().Utf8Value();
    callJSFunc("input", buffer);
}

} // namespace cc


