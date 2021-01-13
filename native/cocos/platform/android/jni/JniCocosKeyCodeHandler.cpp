/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "platform/android/jni/JniHelper.h"
#include "platform/Application.h"
#include <jni.h>
#include <android/log.h>
#include <android/keycodes.h>

#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "CocosKeyCodeHandler JNI", __VA_ARGS__)
namespace {
struct cc::KeyboardEvent keyboardEvent;

// key values in web, refer to http://docs.cocos.com/creator/api/en/enums/KEY.html
std::unordered_map<int, int> keyCodeMap = {
    {AKEYCODE_BACK, 6},
    {AKEYCODE_ENTER, 13},
    {AKEYCODE_MENU, 18},
    {AKEYCODE_DPAD_UP, 1003},
    {AKEYCODE_DPAD_DOWN, 1004},
    {AKEYCODE_DPAD_LEFT, 1000},
    {AKEYCODE_DPAD_RIGHT, 1001},
    {AKEYCODE_DPAD_CENTER, 1005}};

void dispatchKeyCodeEvent(int keyCode, cc::KeyboardEvent &event) {
    if (keyCodeMap.count(keyCode) > 0)
        keyCode = keyCodeMap[keyCode];
    else
        keyCode = 0;
    event.key = keyCode;
    cc::EventDispatcher::dispatchKeyboardEvent(event);
}
} // namespace
extern "C" {
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosKeyCodeHandler_handleKeyDown(JNIEnv *env, jobject obj, jint keyCode) {
    keyboardEvent.action = cc::KeyboardEvent::Action::PRESS;
    dispatchKeyCodeEvent(keyCode, keyboardEvent);
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosKeyCodeHandler_handleKeyUp(JNIEnv *env, jobject obj, jint keyCode) {
    keyboardEvent.action = cc::KeyboardEvent::Action::RELEASE;
    dispatchKeyCodeEvent(keyCode, keyboardEvent);
}
}
