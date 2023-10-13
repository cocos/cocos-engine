/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <cstdint>
#include <jni.h>
#include <pthread.h>
#include <android/configuration.h>
#include <android/native_window.h>
#include "base/std/container/vector.h"
#include "AndroidInput.h"
#include "AndroidMessage.h"

namespace cc {

class MessageHandler;

#define NATIVE_APP_GLUE_MAX_NUM_MOTION_EVENTS 16
#define NATIVE_APP_GLUE_MAX_NUM_KEY_EVENTS    4

struct AndroidInputBuffer {
    /**
     * Pointer to a read-only array of pointers to AndroidMotionEvent.
     * Only the first motionEventsCount events are valid.
     */
    AndroidMotionEvent motionEvents[NATIVE_APP_GLUE_MAX_NUM_MOTION_EVENTS];

    /**
     * The number of valid motion events in `motionEvents`.
     */
    uint64_t motionEventsCount;

    /**
     * Pointer to a read-only array of pointers to AndroidKeyEvent.
     * Only the first keyEventsCount events are valid.
     */
    AndroidKeyEvent keyEvents[NATIVE_APP_GLUE_MAX_NUM_KEY_EVENTS];

    /**
     * The number of valid "Key" events in `keyEvents`.
     */
    uint64_t keyEventsCount;
};

class NativeWindowCache {
public:
    explicit NativeWindowCache(uint32_t windowId) : _windowId{windowId} {
    }

    ~NativeWindowCache() {
        setSurface(nullptr);
    }

    inline void resize(uint32_t width, uint32_t height) { _width = width; _height = height;}
    void setSurface(jobject surface);

    inline ANativeWindow *getNativeWindow() const { return _nativeWindow; }
    inline uint32_t getWindowId() const { return _windowId; }
    inline uint32_t getWidth() const { return _width; }
    inline uint32_t getHeight() const { return _height; }

    JNIEnv *env{nullptr};
    ANativeWindow* _pendingWindow{nullptr};

private:
    uint32_t _width{0};
    uint32_t _height{0};
    uint32_t _windowId{0};
    /** When non-NULL, this is the window surface that the app can draw in. */
    ANativeWindow *_nativeWindow{nullptr};
};

class AndroidApp {
public:
    /**
     * An optional pointer.
     */
    void* userData{nullptr};

    /**
     * The global handle on the process's Java VM.
     */
    JavaVM* vm{nullptr};

    /**
     * JNI context for the main thread of the app.  Note that this field
     * can ONLY be used from the main thread of the process; that is, the
     * thread that calls into the GameActivityCallbacks.
     */
    JNIEnv* env{nullptr};

    /**
     * The Context object handle.
     */
    jobject javaContext{nullptr};

    /** The current configuration the app is running in. */
    AConfiguration* config{nullptr};

    /**
     * Pointer to the Asset Manager instance for the application.  The
     * application uses this to access binary assets bundled inside its own .apk
     * file.
     */
    AAssetManager* assetManager{nullptr};

    /**
     * Current state of the app.  May be either APP_CMD_START,
     * APP_CMD_RESUME, APP_CMD_PAUSE, or APP_CMD_STOP.
     */
    int appState{UNUSED_APP_CMD};

    /**
     * This is non-zero when the application's GameActivity is being
     * destroyed and waiting for the app thread to complete.
     */
    int destroyRequested{0};

#define NATIVE_APP_GLUE_MAX_INPUT_BUFFERS 2

    /**
     * This is used for buffering input from GameActivity. Once ready, the
     * application thread switches the buffers and processes what was
     * accumulated.
     */
    struct AndroidInputBuffer inputBuffers[NATIVE_APP_GLUE_MAX_INPUT_BUFFERS]{0};

    int currentInputBuffer{0};

    // Below are "private" implementation of the glue code.
    /** @cond INTERNAL */

    pthread_mutex_t mutex;
    pthread_cond_t cond;

    pthread_t thread;

    int running{0};
    int destroyed{0};

    AndroidApp();
    ~AndroidApp();
    inline bool isVisible() const { return _isVisible; }
    inline bool isActive() const { return _isActive; }
    bool hasWindow();

    static void processAppCmd(AndroidApp* app);
    static void processGameRequest(int fd, int events, void* data);

private:
    ccstd::vector<NativeWindowCache*> _vecNativeWindow;
    MessageHandler* _gameRequestHandler{nullptr};
    MessageHandler* _appCmdHandler{nullptr};
    bool _isVisible{false};
    bool _isActive{false};
};

} // namespace cc
