/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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
#include "platform/Application.h"
#include "platform/java/jni/JniHelper.h"
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include <android/keycodes.h>
    #include <android/log.h>
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include <hilog/log.h>
#endif
#include <jni.h>

namespace {
struct cc::KeyboardEvent keyboardEvent;

// key values in web, refer to http://docs.cocos.com/creator/api/en/enums/KEY.html
#if CC_PLATFORM == CC_PLATFORM_ANDROID
std::unordered_map<int, int> keyCodeMap = {
    {AKEYCODE_BACK, 6},
    {AKEYCODE_ENTER, 13},
    {AKEYCODE_MENU, 18},
    {AKEYCODE_DPAD_UP, 1003},
    {AKEYCODE_DPAD_DOWN, 1004},
    {AKEYCODE_DPAD_LEFT, 1000},
    {AKEYCODE_DPAD_RIGHT, 1001},
    {AKEYCODE_DPAD_CENTER, 1005}};
#elif CC_PLATFORM == CC_PLATFORM_OHOS
std::unordered_map<int, int> keyCodeMap = {};
#endif
//NOLINTNEXTLINE
void dispatchKeyCodeEvent(int keyCode, cc::KeyboardEvent &event) {
    if (keyCodeMap.count(keyCode) > 0) {
        keyCode = keyCodeMap[keyCode];
    } else {
        keyCode = 0;
    }
    event.key = keyCode;
    cc::EventDispatcher::dispatchKeyboardEvent(event);
}
} // namespace
extern "C" {
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosKeyCodeHandler_handleKeyDown(JNIEnv *env, jobject obj, jint keyCode) {
    keyboardEvent.action = cc::KeyboardEvent::Action::PRESS;
    dispatchKeyCodeEvent(keyCode, keyboardEvent);
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosKeyCodeHandler_handleKeyUp(JNIEnv *env, jobject obj, jint keyCode) {
    keyboardEvent.action = cc::KeyboardEvent::Action::RELEASE;
    dispatchKeyCodeEvent(keyCode, keyboardEvent);
}
}
