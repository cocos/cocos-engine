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

#include "JniCocosActivity.h"
#include <android/asset_manager_jni.h>
#include <android/log.h>
#include <android/native_window_jni.h>
#include <android_native_app_glue.h>
#include <fcntl.h>
#include <jni.h>
#include <unistd.h>
#include <thread>
#include <vector>

#include "platform/android/FileUtils-android.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/glue/JniNativeGlue.h"

extern "C" {
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onCreateNative(JNIEnv *env, jobject obj, jobject activity,
                                                                       jobject assetMgr, jstring obbPath, jint sdkVersion) {
    if (JNI_NATIVE_GLUE()->isRunning()) {
        return;
    }
    JNI_NATIVE_GLUE()->setSdkVersion(sdkVersion);
    cc::JniHelper::init(env, activity);
    JNI_NATIVE_GLUE()->setObbPath(cc::JniHelper::jstring2string(obbPath));
    JNI_NATIVE_GLUE()->setResourceManager(AAssetManager_fromJava(env, assetMgr));
    cc::FileUtilsAndroid::setassetmanager(AAssetManager_fromJava(env, assetMgr));
    JNI_NATIVE_GLUE()->start(0, nullptr);
}

//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onSurfaceCreatedNative(JNIEnv *env, jobject obj, jobject surface) {
    JNI_NATIVE_GLUE()->setWindowHandler(ANativeWindow_fromSurface(env, surface));
}

//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onStartNative(JNIEnv *env, jobject obj) {
    JNI_NATIVE_GLUE()->onResume();
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onPauseNative(JNIEnv *env, jobject obj) {
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onResumeNative(JNIEnv *env, jobject obj) {
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onStopNative(JNIEnv *env, jobject obj) {
    JNI_NATIVE_GLUE()->onPause();
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onLowMemoryNative(JNIEnv *env, jobject obj) {
    JNI_NATIVE_GLUE()->onLowMemory();
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onWindowFocusChangedNative(JNIEnv *env, jobject obj, jboolean has_focus) {
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onSurfaceChangedNative(JNIEnv *env, jobject obj, jint width, jint height) {
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onSurfaceDestroyNative(JNIEnv *env, jobject obj) {
    JNI_NATIVE_GLUE()->setWindowHandler(nullptr);
}
}
