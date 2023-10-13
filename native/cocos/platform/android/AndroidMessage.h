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
#include <android/looper.h>


namespace cc {


class MessageHandler;
#define ANDROID_MESSAGE_BUFFER_SIZE 4*1024

class AndroidAppMessage {
public:
    // value set from GameRequestCmd or AppCmd
    uint32_t cmd{0};
    // object can be construct from MessageHandler.obtainMessageBuffer
    uint64_t objectHandle{0};
};

using MainCallback = void(int fd, int events, void* data);

class CocosLooper {
public:
    CocosLooper();
    ~CocosLooper();
    AndroidAppMessage getMessage();
    void writeMessage(AndroidAppMessage&& msg) const;
    inline ALooper* getALooper() const { return _looper; }
    void prepare(void* userData);
    void prepareMainLooper(MainCallback* callback);

private:
    ALooper* _looper{nullptr};
    int _readPipe{-1};
    int _writePipe{-1};
    bool _isMainLooper{false};
};

class MessageHandler {
public:
    explicit MessageHandler(CocosLooper* looper);
    ~MessageHandler();
    template <typename T>
    T* obtainObject();
    void sendMessage(AndroidAppMessage&& msg);
    inline CocosLooper* getLooper() const { return _looper;}

private:
    int _offset{0};
    int8_t _buffer[ANDROID_MESSAGE_BUFFER_SIZE] = {0};
    CocosLooper* _looper{nullptr};
};


enum GameRequestCmd {

    UNUSED_GAME_CMD,
    /**
     * Command from game thread: user wants to exit game.
     */
    GAME_CMD_REQUEST_EXIT,

    /**
     * Command from game thread: wants to create a render view. Need CreateSurfaceAction pass to message's objectHandle
     */
    GAME_CMD_REQUEST_CREATE_RENDER_VIEW,
};

enum AppCmd {
    UNUSED_APP_CMD,

    /**
     * Command from main thread: a new ANativeWindow is ready for use.  Upon
     * receiving this command, CocosApp->window will contain the new window
     * surface.
     */
    APP_CMD_INIT_WINDOW,

    /**
     * Command from main thread: the existing ANativeWindow needs to be
     * terminated.  Upon receiving this command, CocosApp->window still
     * contains the existing window; after calling android_app_exec_cmd
     * it will be set to NULL.
     */
    APP_CMD_TERM_WINDOW,

    /**
     * Command from main thread: the current ANativeWindow has been resized.
     * Please redraw with its new size.
     */
    APP_CMD_WINDOW_RESIZED,

    /**
     * Command from main thread: the system needs that the current ANativeWindow
     * be redrawn.  You should redraw the window before handing this to
     * android_app_exec_cmd() in order to avoid transient drawing glitches.
     */
    APP_CMD_WINDOW_REDRAW_NEEDED,

    /**
     * Command from main thread: the content area of the window has changed,
     * such as from the soft input window being shown or hidden.  You can
     * find the new content rect in android_app::contentRect.
     */
    APP_CMD_CONTENT_RECT_CHANGED,

    /**
     * Command from main thread: the app's activity window has gained
     * input focus.
     */
    APP_CMD_GAINED_FOCUS,

    /**
     * Command from main thread: the app's activity window has lost
     * input focus.
     */
    APP_CMD_LOST_FOCUS,

    /**
     * Command from main thread: the current device configuration has changed.
     */
    APP_CMD_CONFIG_CHANGED,

    /**
     * Command from main thread: the system is running low on memory.
     * Try to reduce your memory use.
     */
    APP_CMD_LOW_MEMORY,

    /**
     * Command from main thread: the app's activity has been started.
     */
    APP_CMD_START,

    /**
     * Command from main thread: the app's activity has been resumed.
     */
    APP_CMD_RESUME,

    /**
     * Command from main thread: the app's activity has been paused.
     */
    APP_CMD_PAUSE,

    /**
     * Command from main thread: the app's activity has been stopped.
     */
    APP_CMD_STOP,

    /**
     * Command from main thread: the app's activity is being destroyed,
     * and waiting for the app thread to clean up and exit before proceeding.
     */
    APP_CMD_DESTROY,
};

struct CreateSurfaceAction {
    int x;
    int y;
    int w;
    int h;
    int windowId;
};

} // namespace cc
