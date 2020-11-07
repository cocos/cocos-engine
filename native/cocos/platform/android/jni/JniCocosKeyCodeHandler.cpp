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
            {AKEYCODE_DPAD_CENTER, 1005}
    };

    void dispatchKeyCodeEvent(int keyCode, cc::KeyboardEvent &event) {
        if (keyCodeMap.count(keyCode) > 0)
            keyCode = keyCodeMap[keyCode];
        else
            keyCode = 0;
        event.key = keyCode;
        cc::EventDispatcher::dispatchKeyboardEvent(event);
    }
}
extern "C" {
    JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosKeyCodeHandler_handleKeyDown(JNIEnv *env, jobject obj, jint keyCode) {
        keyboardEvent.action = cc::KeyboardEvent::Action::PRESS;
        dispatchKeyCodeEvent(keyCode,keyboardEvent);
    }

    JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosKeyCodeHandler_handleKeyUp(JNIEnv *env, jobject obj, jint keyCode) {
        keyboardEvent.action = cc::KeyboardEvent::Action::RELEASE;
        dispatchKeyCodeEvent(keyCode,keyboardEvent);
    }
}

