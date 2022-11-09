/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

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
#include "cocos/application/ApplicationManager.h"
#include "platform/openharmony/napi/NapiHelper.h"
#include "cocos/bindings/jswrapper/SeApi.h"

namespace cc {

/*************************************************************************
 Global variables and functions.
************************************************************************/

namespace {
se::Value g_textInputCallback;

napi_ref showEditBoxCallback;
napi_ref hideEditBoxCallback;

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

napi_value napiSetShowEditBoxCallback(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1] = {nullptr};
    auto status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    napi_create_reference(env, args[0], 1, &showEditBoxCallback);
    return nullptr;
}

napi_value napiSetHideEditBoxCallback(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1] = {nullptr};
    auto status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    napi_create_reference(env, args[0], 1, &hideEditBoxCallback);
    return nullptr;
}

napi_value napiOnComplete(napi_env env, napi_callback_info info) {
    EditBox::complete();
    return nullptr;
}

napi_value napiOnTextChange(napi_env env, napi_callback_info info) {
    size_t      argc = 1;
    napi_value  args[1];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    napi_status status;
    char   buffer[512];
    size_t result = 0;
    NODE_API_CALL(status, env, napi_get_value_string_utf8(env, args[0], buffer, 512, &result));
    callJSFunc("input", std::string(buffer));
    return nullptr;
}

napi_value showEditBox(const std::string& inputMessage) {
    napi_value argv[1];
    napi_create_string_utf8(se::ScriptEngine::getEnv(), inputMessage.c_str(), NAPI_AUTO_LENGTH, &argv[0]);
    napi_value global;
    napi_get_global(se::ScriptEngine::getEnv(), &global);
    napi_value cb = nullptr;
    napi_get_reference_value(se::ScriptEngine::getEnv(), showEditBoxCallback, &cb);
    napi_valuetype type;
    napi_typeof(se::ScriptEngine::getEnv(), cb, &type);
    napi_value result = nullptr;
    napi_status status = napi_call_function(se::ScriptEngine::getEnv(), global, cb, 1, &argv[0], &result);
    return nullptr;
}

napi_value hideEditBox() {
    napi_value global;
    napi_get_global(se::ScriptEngine::getEnv(), &global);

    napi_value cb = nullptr;
    napi_get_reference_value(se::ScriptEngine::getEnv(), hideEditBoxCallback, &cb);

    napi_valuetype type;
    napi_typeof(se::ScriptEngine::getEnv(), cb, &type);

    napi_value result = nullptr;
    napi_status status = napi_call_function(se::ScriptEngine::getEnv(), global, cb, 1, nullptr, &result);
    return nullptr;
}

/*************************************************************************
Implementation of EditBox.
************************************************************************/
void EditBox::show(const EditBox::ShowInfo &showInfo) {
    showEditBox(showInfo.defaultValue);
}

void EditBox::hide() {
    hideEditBox();
}

bool EditBox::complete() {
    callJSFunc("complete", "");
    return true;
}

} // namespace cc


