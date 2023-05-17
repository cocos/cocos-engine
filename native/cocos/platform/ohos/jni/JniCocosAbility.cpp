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

#include "platform/ohos/jni/JniCocosAbility.h"
#include <fcntl.h>
#include <hilog/log.h>
#include <jni.h>
#include <native_layer.h>
#include <native_layer_jni.h>
#include <netdb.h>
#include <platform/FileUtils.h>
#include <unistd.h>
#include <future>
#include <thread>
#include "base/Log.h"

#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/glue/JniNativeGlue.h"
#include "platform/ohos/FileUtils-ohos.h"
#include "platform/ohos/jni/AbilityConsts.h"

#define LOGV(...) HILOG_INFO(LOG_APP, __VA_ARGS__)
//NOLINTNEXTLINE
using namespace cc::ohos;

extern "C" {
//NOLINTNEXTLINE JNI function name
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosAbilitySlice_onCreateNative(JNIEnv *env, jobject obj, jobject ability,
                                                                           jstring moduleNameJ, jstring assetPath, jobject resourceManager,
                                                                           jint sdkVersion) {
    if (JNI_NATIVE_GLUE()->isRunning()) {
        return;
    }
    cc::JniHelper::init(env, ability);
    JNI_NATIVE_GLUE()->setSdkVersion(sdkVersion);

    ResourceManager *objResourceManager = InitNativeResourceManager(env, resourceManager);
    JNI_NATIVE_GLUE()->setResourceManager(objResourceManager);

    jboolean isCopy = false;
    ccstd::string assetPathClone;
    const char *assetPathStr = env->GetStringUTFChars(assetPath, &isCopy);
    assetPathClone = assetPathStr;
    if (isCopy) {
        env->ReleaseStringUTFChars(assetPath, assetPathStr);
        assetPathStr = nullptr;
    }
    ccstd::string moduleName{"entry"};
    const char *moduleNameStr = env->GetStringUTFChars(moduleNameJ, &isCopy);
    moduleName = moduleNameStr;
    if (isCopy) {
        env->ReleaseStringUTFChars(moduleNameJ, moduleNameStr);
        moduleNameStr = nullptr;
    }
    cc::FileUtilsOHOS::initResourceManager(objResourceManager, assetPathClone, moduleName);
    JNI_NATIVE_GLUE()->start(0, nullptr);
}

JNIEXPORT void JNICALL
Java_com_cocos_lib_CocosAbilitySlice_onSurfaceCreatedNative(JNIEnv *env, jobject obj, jobject surface) { //NOLINT JNI function name
    //    termAndSetPendingWindow(GetNativeLayer(env, surface));
}
JNIEXPORT void JNICALL
Java_com_cocos_lib_CocosAbilitySlice_onSurfaceChangedNative(JNIEnv *env, jobject obj, jobject surface, jint width, //NOLINT JNI function name
                                                            jint height) {                                         //NOLINT JNI function name
    JNI_NATIVE_GLUE()->setWindowHandle(GetNativeLayer(env, surface));
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosAbilitySlice_onSurfaceDestroyNative(JNIEnv *env, jobject obj) { //NOLINT JNI function name
    JNI_NATIVE_GLUE()->setWindowHandle(nullptr);
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosAbilitySlice_onStartNative(JNIEnv *env, jobject obj) { //NOLINT JNI function name
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosAbilitySlice_onPauseNative(JNIEnv *env, jobject obj) { //NOLINT JNI function name
    JNI_NATIVE_GLUE()->onPause();
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosAbilitySlice_onResumeNative(JNIEnv *env, jobject obj) { //NOLINT JNI function name
    JNI_NATIVE_GLUE()->onResume();
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosAbilitySlice_onStopNative(JNIEnv *env, jobject obj) { //NOLINT JNI function name
}

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosAbilitySlice_onLowMemoryNative(JNIEnv *env, jobject obj) { //NOLINT JNI function name
    JNI_NATIVE_GLUE()->onLowMemory();
}

JNIEXPORT void JNICALL
Java_com_cocos_lib_CocosAbilitySlice_onWindowFocusChangedNative(JNIEnv *env, jobject obj, jboolean has_focus) { //NOLINT JNI function name
}

JNIEXPORT void JNICALL
Java_com_cocos_lib_CocosAbilitySlice_setRawfilePrefix(JNIEnv *env, jobject obj, jstring prefixJ) { //NOLINT JNI function name
    jboolean isCopy = false;
    const char *prefix = env->GetStringUTFChars(prefixJ, &isCopy);
    cc::FileUtilsOHOS::setRawfilePrefix(prefix);
    if (isCopy) {
        env->ReleaseStringUTFChars(prefixJ, prefix);
    }
}
}
