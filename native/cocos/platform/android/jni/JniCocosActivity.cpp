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
#include "platform/Application.h"
#include "platform/android/FileUtils-android.h"
#include "platform/android/View.h"
#include "platform/java/jni/JniHelper.h"

#define LOGV(...) __android_log_print(ANDROID_LOG_INFO, "CocosActivity JNI", __VA_ARGS__)

cc::Application *cocos_main(int, int) __attribute__((weak)); //NOLINT

namespace cc {
CocosApp cocosApp;
}

namespace {
int              messagePipe[2];
int              pipeRead  = 0;
int              pipeWrite = 0;
cc::Application *game      = nullptr;

void createGame(ANativeWindow *window) {
    int width  = ANativeWindow_getWidth(window);
    int height = ANativeWindow_getHeight(window);
    game       = cocos_main(width, height);
    game->init();
}

void writeCommand(int8_t cmd) {
    write(pipeWrite, &cmd, sizeof(cmd));
}

int readCommand(int8_t &cmd) { //NOLINT(google-runtime-references)
    return read(pipeRead, &cmd, sizeof(cmd));
}

void handlePauseResume(int8_t cmd) {
    LOGV("appState=%d", cmd);
    std::unique_lock<std::mutex> lk(cc::cocosApp.mutex);
    cc::cocosApp.appState = static_cast<uint8_t>(cmd);
    lk.unlock();
    cc::cocosApp.cond.notify_all();
}

void preExecCmd(int8_t cmd) {
    switch (cmd) {
        case APP_CMD_INIT_WINDOW: {
            LOGV("APP_CMD_INIT_WINDOW");
            std::unique_lock<std::mutex> lk(cc::cocosApp.mutex);
            cc::cocosApp.window = cc::cocosApp.pendingWindow;
            lk.unlock();
            cc::cocosApp.cond.notify_all();
            cc::cocosApp.animating = true;

            if (!game) {
                createGame(cc::cocosApp.window);
            }
        } break;
        case APP_CMD_TERM_WINDOW:
            LOGV("APP_CMD_TERM_WINDOW");
            cc::cocosApp.animating = false;
            cc::cocosApp.cond.notify_all();
            break;
        case APP_CMD_RESUME:
            LOGV("APP_CMD_RESUME");
            handlePauseResume(cmd);
            break;
        case APP_CMD_PAUSE:
            LOGV("APP_CMD_PAUSE");
            handlePauseResume(cmd);
            break;
        case APP_CMD_DESTROY:
            LOGV("APP_CMD_DESTROY");
            cc::cocosApp.destroyRequested = true;
            break;
        default:
            break;
    }
}

void postExecCmd(int8_t cmd) {
    switch (cmd) {
        case APP_CMD_TERM_WINDOW: {
            std::unique_lock<std::mutex> lk(cc::cocosApp.mutex);
            cc::cocosApp.window = nullptr;
            lk.unlock();
            cc::cocosApp.cond.notify_all();
        } break;
        default:
            break;
    }
}

void glThreadEntry() {
    std::unique_lock<std::mutex> lk(cc::cocosApp.mutex);
    cc::cocosApp.running = true;
    lk.unlock();
    cc::cocosApp.cond.notify_all();

    int8_t cmd = 0;
    while (true) {
        if (readCommand(cmd) > 0) {
            preExecCmd(cmd);
            cc::View::engineHandleCmd(cmd);
            postExecCmd(cmd);
        }

        if (!cc::cocosApp.animating || APP_CMD_PAUSE == cc::cocosApp.appState) {
            std::this_thread::yield();
        }

        if (game && cc::cocosApp.animating) {
            // Handle java events send by UI thread. Input events are handled here too.
            cc::JniHelper::callStaticVoidMethod("com.cocos.lib.CocosHelper",
                                                "flushTasksOnGameThread");
            game->tick();
        }

        if (cc::cocosApp.destroyRequested) break;
    }

    close(pipeRead);
    close(pipeWrite);

    delete game;
    game = nullptr;
}

void setWindow(ANativeWindow *window) {
    std::unique_lock<std::mutex> lk(cc::cocosApp.mutex);
    if (cc::cocosApp.pendingWindow) {
        writeCommand(APP_CMD_TERM_WINDOW);
    }
    cc::cocosApp.pendingWindow = window;
    if (window) {
        writeCommand(APP_CMD_INIT_WINDOW);
    }
    while (cc::cocosApp.window != cc::cocosApp.pendingWindow) {
        cc::cocosApp.cond.wait(lk);
    }
}

void setAppState(int8_t cmd) {
    std::unique_lock<std::mutex> lk(cc::cocosApp.mutex);
    writeCommand(cmd);
    while (cc::cocosApp.appState != cmd) {
        cc::cocosApp.cond.wait(lk);
    }
}
} // namespace

extern "C" {
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onCreateNative(JNIEnv *env, jobject obj, jobject activity,
                                                                       jobject assetMgr, jstring obbPath, jint sdkVersion) {
    if (cc::cocosApp.running) {
        return;
    }

    cc::cocosApp.sdkVersion = sdkVersion;
    cc::JniHelper::init(env, activity);
    cc::cocosApp.obbPath      = cc::JniHelper::jstring2string(obbPath);
    cc::cocosApp.assetManager = AAssetManager_fromJava(env, assetMgr);
    cc::FileUtilsAndroid::setassetmanager(cc::cocosApp.assetManager);

    if (pipe(messagePipe)) {
        LOGV("Can not create pipe: %s", strerror(errno));
    }
    pipeRead  = messagePipe[0];
    pipeWrite = messagePipe[1];
    if (fcntl(pipeRead, F_SETFL, O_NONBLOCK) < 0) {
        LOGV("Can not make pipe read to non blocking mode.");
    }

    std::thread glThread(glThreadEntry);
    glThread.detach();

    std::unique_lock<std::mutex> lk(cc::cocosApp.mutex);
    while (!cc::cocosApp.running) {
        cc::cocosApp.cond.wait(lk);
    }
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onSurfaceCreatedNative(JNIEnv *env, jobject obj, jobject surface) {
    setWindow(ANativeWindow_fromSurface(env, surface));
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onStartNative(JNIEnv *env, jobject obj) {
    setAppState(APP_CMD_RESUME);
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onPauseNative(JNIEnv *env, jobject obj) {
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onResumeNative(JNIEnv *env, jobject obj) {
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onStopNative(JNIEnv *env, jobject obj) {
    setAppState(APP_CMD_PAUSE);
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onLowMemoryNative(JNIEnv *env, jobject obj) {
    writeCommand(APP_CMD_LOW_MEMORY);
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onWindowFocusChangedNative(JNIEnv *env, jobject obj, jboolean has_focus) {
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onSurfaceChangedNative(JNIEnv *env, jobject obj, jint width, jint height) {
}
//NOLINTNEXTLINE
JNIEXPORT void JNICALL Java_com_cocos_lib_CocosActivity_onSurfaceDestroyNative(JNIEnv *env, jobject obj) {
    setWindow(nullptr);
}
}
