/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include <functional>
#include <future>
#include <memory>
#include "base/Macros.h"
#include "platform/java/jni/glue/MessagePipe.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/asset_manager.h>
    #include <android/native_window.h>

using ResourceManagerType = AAssetManager;
using NativeWindowType = ANativeWindow;

#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    #include <native_layer.h>
    #include <rawfile/resource_manager.h>

using ResourceManagerType = ResourceManager;
using NativeWindowType = NativeLayer;
#endif

using NativeActivity = void*; //jobject
using NativeEnv = void*;      //jnienv

namespace cc {

class IEventDispatch;
class TouchEvent;

class CC_DLL JniNativeGlue {
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

    void setWindowHandle(NativeWindowType* window);
    NativeWindowType* getWindowHandle();

    void setActivityGetter(std::function<NativeActivity(void)>);
    void* getActivity();

    void setEnvGetter(std::function<NativeEnv(void)>);
    void* getEnv();

    void setResourceManager(ResourceManagerType* resourceManager);
    ResourceManagerType* getResourceManager();

    void setSdkVersion(int sdkVersion);
    int getSdkVersion() const;

    void setObbPath(const std::string& path);
    std::string getObbPath() const;

    bool isRunning() const;
    void setRunning(bool isRunning);
    void waitRunning();

    void flushTasksOnGameThread() const;

    struct CommandMsg {
        JniCommand cmd;
        std::function<void()> callback;
    };
    void writeCommandAsync(JniCommand cmd);
    void writeCommandSync(JniCommand cmd);
    int readCommand(CommandMsg* msg);
    int readCommandWithTimeout(CommandMsg* cmd, int delayMS);

    void onPause();
    void onResume();
    void onLowMemory();

    bool isPause() const;

    void execCommand();

    int32_t getWidth() const;
    int32_t getHeight() const;

    bool isAnimating() const { return _animating; }

private:
    void preExecCmd(JniCommand cmd);
    void engineHandleCmd(JniCommand cmd);
    void postExecCmd(JniCommand cmd);

    bool _running{false};
    int _sdkVersion{0};
    bool _animating{false};

    std::promise<void> _threadPromise;
    std::string _obbPath;
    ResourceManagerType* _resourceManager{nullptr};
    NativeWindowType* _window{nullptr};
    NativeWindowType* _pendingWindow{nullptr};
    JniCommand _appState{JniCommand::JNI_CMD_UNKNOW};
    IEventDispatch* _eventDispatcher{nullptr};
    std::unique_ptr<MessagePipe> _messagePipe{nullptr};

    std::function<NativeEnv(void)> _envGetter;
    std::function<NativeActivity(void)> _activityGetter;
};

} // namespace cc

#define JNI_NATIVE_GLUE() cc::JniNativeGlue::getInstance()
