/****************************************************************************
Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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
#pragma once

#include <future>
#include <memory>
#include "platform/java/jni/glue/MessagePipe.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/asset_manager.h>
    #include <android/native_window.h>

using ResourceManagerType = AAssetManager;
using NativeWindowType    = ANativeWindow;

#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    #include <native_layer.h>
    #include <rawfile/resource_manager.h>

using ResourceManagerType = ResourceManager;
using NativeWindowType    = NativeLayer;
#endif

namespace cc {

class IEventDispatch;
class OSEvent;

class JniNativeGlue {
public:
    enum class JniCommand {
        JNI_CMD_TERM_WINDOW = 0,
        JNI_CMD_INIT_WINDOW,
        JNI_CMD_RESUME,
        JNI_CMD_PAUSE,
        JNI_CMD_DESTROY,
        JNI_CMD_LOW_MEMORY,
        JNI_CMD_UNKNOW,
    };
    virtual ~JniNativeGlue();
    static JniNativeGlue* getInstance();

    virtual void start(int argc, const char** argv);

    void              setWindowHandler(NativeWindowType* window);
    NativeWindowType* getWindowHandler();

    void                 setResourceManager(ResourceManagerType* resourceManager);
    ResourceManagerType* getResourceManager();

    void setSdkVersion(int sdkVersion);
    int  getSdkVersion() const;

    void        setObbPath(const std::string& path);
    std::string getObbPath() const;

    bool isRunning() const;
    void setRunning(bool isRunning);
    void waitRunning();

    void flushTasksOnGameThread() const;

    struct CommandMsg {
        JniCommand            cmd;
        std::function<void()> callback;
    };
    void writeCommandAsync(JniCommand cmd);
    void writeCommandSync(JniCommand cmd);
    int  readCommand(CommandMsg* msg);

    void setEventDispatch(IEventDispatch* eventDispatcher);
    void dispatchEvent(const OSEvent& ev);
    void dispatchTouchEvent(const OSEvent& ev);

    void onPause();
    void onResume();
    void onLowMemory();

    bool isPause() const;

    void execCommand();

    int32_t getWidth() const;
    int32_t getHeight() const;

private:
    void preExecCmd(JniCommand cmd);
    void engineHandleCmd(JniCommand cmd);
    void postExecCmd(JniCommand cmd);

    bool _running{false};
    int  _sdkVersion{0};
    bool _animating{false};

    std::promise<void>           _threadPromise;
    std::string                  _obbPath;
    ResourceManagerType*         _resourceManager{nullptr};
    NativeWindowType*            _window{nullptr};
    NativeWindowType*            _pendingWindow{nullptr};
    JniCommand                   _appState{JniCommand::JNI_CMD_UNKNOW};
    IEventDispatch*              _eventDispatcher{nullptr};
    std::unique_ptr<MessagePipe> _messagePipe{nullptr};
};

} // namespace cc

#define JNI_NATIVE_GLUE() cc::JniNativeGlue::getInstance()