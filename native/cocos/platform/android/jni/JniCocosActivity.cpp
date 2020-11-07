#include "JniCocosActivity.h"
#include "platform/android/jni/JniHelper.h"
#include "platform/android/FileUtils-android.h"
#include "platform/Application.h"
#include "platform/android/View.h"
#include <jni.h>
#include <android/log.h>
#include <android/asset_manager_jni.h>
#include <android/native_window_jni.h>
#include <android_native_app_glue.h>
#include <thread>
#include <unistd.h>
#include <fcntl.h>
#include <mutex>
#include <condition_variable>

#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "CocosActivity JNI", __VA_ARGS__)

cc::Application *cocos_main(int, int) __attribute__((weak));

namespace cc {
CocosApp cocosApp;
int messagePipe[2];
int pipeRead = 0;
int pipeWrite = 0;
bool needToStop = false;
bool animating = true;
std::mutex animatingMutex;
std::condition_variable animatingCond;

void writeCommand(int cmd) {
    write(pipeWrite, &cmd, sizeof(cmd));
}

int readCommand(int &cmd) {
    return read(pipeRead, &cmd, sizeof(int));
}

void glThreadEntry(ANativeWindow *window) {
	int width = ANativeWindow_getWidth(window);
	int height = ANativeWindow_getHeight(window);
	auto game = cocos_main(width, height);
	game->init();
	if (!game) return;

	int cmd = 0;
	while (1) {
	    if (needToStop) break;

	    while (readCommand(cmd) > 0) {
	        View::engineHandleCmd(cmd);
	    }
        if (!animating) {
            std::unique_lock<std::mutex> lk(animatingMutex);
            animatingCond.wait(lk);
        }

        // Handle java events send by UI thread. Input events are handled here too.
		JniHelper::callStaticVoidMethod("org.cocos2dx.lib.Cocos2dxHelper", "flushTasksOnGameThread");

		game->tick();
	}
}

}

extern "C" {

JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onCreateNative(JNIEnv *env, jobject obj, jobject activity,
	jobject assetMgr, jstring obbPath, jint sdkVersion) {
	cc::cocosApp.sdkVersion = sdkVersion;
	cc::JniHelper::init(env, activity);
	cc::cocosApp.obbPath = cc::JniHelper::jstring2string(obbPath);
	cc::cocosApp.assetManager = AAssetManager_fromJava(env, assetMgr);
	static_cast<cc::FileUtilsAndroid*>(cc::FileUtils::getInstance())->setassetmanager(cc::cocosApp.assetManager);

	if (pipe(cc::messagePipe)) {
		LOGD("Can not create pipe: %s", strerror(errno));
	}
	cc::pipeRead = cc::messagePipe[0];
	cc::pipeWrite = cc::messagePipe[1];
	if (fcntl(cc::pipeRead, F_SETFL, O_NONBLOCK) < 0) {
	    LOGD("Can not make pipe read to non blocking mode.");
	}
}

JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onSurfaceCreatedNative(JNIEnv *env, jobject obj, jobject surface) {
    static bool first = true;
    cc::cocosApp.window = ANativeWindow_fromSurface(env, surface);
    cc::writeCommand(APP_CMD_INIT_WINDOW);

    if (first) {
        first = false;
        std::thread glThread(cc::glThreadEntry, cc::cocosApp.window);
        glThread.detach();
    }
    else {
        cc::animating = true;
        cc::animatingCond.notify_all();
    }
}
JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onStartNative(JNIEnv *env, jobject obj) {
}

JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onPauseNative(JNIEnv *env, jobject obj) {
    cc::writeCommand(APP_CMD_PAUSE);
}

JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onResumeNative(JNIEnv *env, jobject obj) {
    static bool first = true;
    if (first) {
        first = false;
        return;
    }
    cc::writeCommand(APP_CMD_RESUME);
}

JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onStopNative(JNIEnv *env, jobject obj) {
}

JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onLowMemoryNative(JNIEnv *env, jobject obj) {
	cc::writeCommand(APP_CMD_LOW_MEMORY);
}

JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onWindowFocusChangedNative(JNIEnv *env, jobject obj, jboolean has_focus) {

}

JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onSurfaceChangedNative(JNIEnv *env, jobject obj, jint width, jint height) {

}

JNIEXPORT void JNICALL Java_org_cocos2dx_lib_CocosActivity_onSurfaceDestroyNative(JNIEnv *env, jobject obj) {
	cc::writeCommand(APP_CMD_TERM_WINDOW);
    cc::animating = false;
}

}
