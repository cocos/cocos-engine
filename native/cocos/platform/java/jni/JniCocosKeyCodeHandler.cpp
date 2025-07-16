/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "platform/java/jni/JniHelper.h"
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include <android/keycodes.h>
    #include <android/log.h>
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include <hilog/log.h>
#endif

#include <jni.h>
#include "engine/EngineEvents.h"
#include "platform/java/jni/glue/JniNativeGlue.h"
#include "platform/java/modules/SystemWindow.h"

namespace {
struct cc::KeyboardEvent keyboardEvent;

// key values in web, refer to http://docs.cocos.com/creator/api/en/enums/KEY.html
#if CC_PLATFORM == CC_PLATFORM_ANDROID
ccstd::unordered_map<int, int> keyCodeMap = {
    {AKEYCODE_BACK, 6},
    {AKEYCODE_ENTER, 13},
    {AKEYCODE_MENU, 18},
    {AKEYCODE_DPAD_UP, 1003},
    {AKEYCODE_DPAD_DOWN, 1004},
    {AKEYCODE_DPAD_LEFT, 1000},
    {AKEYCODE_DPAD_RIGHT, 1001},
    {AKEYCODE_DPAD_CENTER, 1005}};
#elif CC_PLATFORM == CC_PLATFORM_OHOS
ccstd::unordered_map<int, int> keyCodeMap = {};
#endif
//NOLINTNEXTLINE
static void dispatchKeyCodeEvent(int keyCode, cc::KeyboardEvent &event) {
    if (keyCodeMap.count(keyCode) > 0) {
        keyCode = keyCodeMap[keyCode];
    } else {
        keyCode = 0;
    }
    event.windowId = cc::ISystemWindow::mainWindowId;
    event.key = keyCode;
    cc::events::Keyboard::broadcast(event);
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
