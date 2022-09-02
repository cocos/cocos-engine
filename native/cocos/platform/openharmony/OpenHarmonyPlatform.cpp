/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
#include "platform/openharmony/OpenHarmonyPlatform.h"
#include "base/Macros.h"

#include <ace/xcomponent/native_interface_xcomponent.h>
#include <napi/native_api.h>

#include "application/ApplicationManager.h"
#include "application/CocosApplication.h"
#include "platform/UniversalPlatform.h"

#include "platform/openharmony/modules/SystemWindow.h"

#include "platform/openharmony/modules/System.h"
#include "platform/empty/modules/Screen.h"
#include "platform/empty/modules/Accelerometer.h"
#include "platform/empty/modules/Battery.h"
#include "platform/empty/modules/Network.h"
#include "platform/empty/modules/Vibrator.h"

#include <sstream>
#include <chrono>

namespace {
void sendMsgToWorker(const cc::MessageType& type, OH_NativeXComponent* component, void* window) {
    cc::OpenHarmonyPlatform* platform = dynamic_cast<cc::OpenHarmonyPlatform*>(cc::BasePlatform::getPlatform());
    CC_ASSERT(platform != nullptr);
    cc::WorkerMessageData data{type, static_cast<void*>(component), window};
    platform->enqueue(data);
}

void onSurfaceCreatedCB(OH_NativeXComponent* component, void* window) {
    // It is possible that when the message is sent, the worker thread has not yet started.
    //sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_CREATED, component, window);
    uint64_t width  = 0;
    uint64_t height = 0;
    int32_t ret = OH_NativeXComponent_GetXComponentSize(component, window, &width, &height);
    CC_ASSERT(ret == OH_NATIVEXCOMPONENT_RESULT_SUCCESS);
    cc::SystemWindow* intf = cc::BasePlatform::getPlatform()->getInterface<cc::SystemWindow>();
    intf->createWindow("", 0, 0, width, height, 0);
    intf->setWindowHandler(window);
}

void dispatchTouchEventCB(OH_NativeXComponent* component, void* window) {
    sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_TOUCH_EVENT, component, window);
}

void onSurfaceChangedCB(OH_NativeXComponent* component, void* window) {
    sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_CHANGED, component, window);
}

void onSurfaceDestroyedCB(OH_NativeXComponent* component, void* window) {
    sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_DESTROY, component, window);
}

} // namespace

namespace cc {

OpenHarmonyPlatform::OpenHarmonyPlatform() {
    registerInterface(std::make_shared<SystemWindow>());
    registerInterface(std::make_shared<System>());
    registerInterface(std::make_shared<Screen>());
    registerInterface(std::make_shared<Vibrator>());
    registerInterface(std::make_shared<Network>());
    registerInterface(std::make_shared<Battery>());
    registerInterface(std::make_shared<Accelerometer>());

    _callback.OnSurfaceCreated   = onSurfaceCreatedCB;
    _callback.OnSurfaceChanged   = onSurfaceChangedCB;
    _callback.OnSurfaceDestroyed = onSurfaceDestroyedCB;
    _callback.DispatchTouchEvent = dispatchTouchEventCB;
}

int32_t OpenHarmonyPlatform::init() {
    return 0;
}

OpenHarmonyPlatform* OpenHarmonyPlatform::getInstance() {
    return dynamic_cast<OpenHarmonyPlatform*>(BasePlatform::getPlatform());
}

int32_t OpenHarmonyPlatform::run(int argc, const char** argv) {
    UniversalPlatform::run(argc, argv);
    if (_workerLoop) {
        // Todo: Starting the timer in this way is inaccurate and will be fixed later.
        uv_timer_init(_workerLoop, &_timerHandle);
        // 1s = 1000ms = 60fps;
        // 1000ms / 60fps = 16 ms/fps
        uv_timer_start(&_timerHandle, &OpenHarmonyPlatform::timerCb, 16, true);
    }
    return 0;
}

void OpenHarmonyPlatform::setNativeXComponent(OH_NativeXComponent* component) {
    _component = component;
    OH_NativeXComponent_RegisterCallback(_component, &_callback);
}

void OpenHarmonyPlatform::enqueue(const WorkerMessageData& msg) {
    _messageQueue.enqueue(msg);
    triggerMessageSignal();
}

void OpenHarmonyPlatform::triggerMessageSignal() {
    if(_workerLoop != nullptr) {
        // It is possible that when the message is sent, the worker thread has not yet started.
        uv_async_send(&_messageSignal);
    }
}

bool OpenHarmonyPlatform::dequeue(WorkerMessageData* msg) {
    return _messageQueue.dequeue(msg);
}

// static
void OpenHarmonyPlatform::onMessageCallback(const uv_async_t* /* req */) {
    void*             window          = nullptr;
    WorkerMessageData msgData;
    OpenHarmonyPlatform* platform = OpenHarmonyPlatform::getInstance();

    while (true) {
        //loop until all msg dispatch
        if (!platform->dequeue(reinterpret_cast<WorkerMessageData*>(&msgData))) {
            // Queue has no data
            break;
        }

        if ((msgData.type >= MessageType::WM_XCOMPONENT_SURFACE_CREATED) && (msgData.type <= MessageType::WM_XCOMPONENT_SURFACE_DESTROY)) {
            OH_NativeXComponent* nativexcomponet = reinterpret_cast<OH_NativeXComponent*>(msgData.data);
            CC_ASSERT(nativexcomponet != nullptr);

            if (msgData.type == MessageType::WM_XCOMPONENT_SURFACE_CREATED) {
                platform->onSurfaceCreated(nativexcomponet, msgData.window);
            } else if (msgData.type == MessageType::WM_XCOMPONENT_TOUCH_EVENT) {
                platform->dispatchTouchEvent(nativexcomponet, msgData.window);
            } else if (msgData.type == MessageType::WM_XCOMPONENT_SURFACE_CHANGED) {
                platform->onSurfaceChanged(nativexcomponet, msgData.window);
            } else if (msgData.type == MessageType::WM_XCOMPONENT_SURFACE_DESTROY) {
                platform->onSurfaceDestroyed(nativexcomponet, msgData.window);
            } else {
                CC_ASSERT(false);
            }
            continue;
        }

        if (msgData.type == MessageType::WM_APP_SHOW) {
            platform->onShowNative();
        } else if (msgData.type == MessageType::WM_APP_HIDE) {
            platform->onHideNative();
        } else if (msgData.type == MessageType::WM_APP_DESTROY) {
            platform->onDestroyNative();
        } else {
            CC_ASSERT(false);
        }
    }
}

void OpenHarmonyPlatform::onCreateNative(napi_env env, uv_loop_t* loop) {
}

void OpenHarmonyPlatform::onShowNative() {
    WindowEvent ev;
    ev.type = WindowEvent::Type::SHOW;
    dispatchEvent(ev);
}

void OpenHarmonyPlatform::onHideNative() {
    WindowEvent ev;
    ev.type = WindowEvent::Type::HIDDEN;
    dispatchEvent(ev);
}

void OpenHarmonyPlatform::onDestroyNative() {
    onDestory();
}

void OpenHarmonyPlatform::timerCb(uv_timer_t* handle) {
    OpenHarmonyPlatform::getInstance()->runTask();
}

void OpenHarmonyPlatform::workerInit(napi_env env, uv_loop_t* loop) {
    _workerLoop = loop;
    if (_workerLoop) {
        uv_async_init(_workerLoop, &_messageSignal, reinterpret_cast<uv_async_cb>(OpenHarmonyPlatform::onMessageCallback));
    }
}

int32_t OpenHarmonyPlatform::loop() {
    return 0;
}

void OpenHarmonyPlatform::onSurfaceCreated(OH_NativeXComponent* component, void* window) {

}

void OpenHarmonyPlatform::onSurfaceChanged(OH_NativeXComponent* component, void* window) {
}

void OpenHarmonyPlatform::onSurfaceDestroyed(OH_NativeXComponent* component, void* window) {
    SystemWindow* systemWindowIntf = getPlatform()->getInterface<SystemWindow>();
    systemWindowIntf->setWindowHandler(nullptr);
}

void OpenHarmonyPlatform::dispatchTouchEvent(OH_NativeXComponent* component, void* window) {
    struct OH_NativeXComponent_TouchEvent touchEvent;
    int32_t ret = OH_NativeXComponent_GetTouchEvent(component, window, &touchEvent);
    if (ret != OH_NATIVEXCOMPONENT_RESULT_SUCCESS) {
        return;
    }

    TouchEvent ev;
    if (touchEvent.type == OH_NATIVEXCOMPONENT_DOWN) {
        ev.type = cc::TouchEvent::Type::BEGAN;
    } else if (touchEvent.type == OH_NATIVEXCOMPONENT_MOVE) {
        ev.type = cc::TouchEvent::Type::MOVED;
    } else if (touchEvent.type == OH_NATIVEXCOMPONENT_UP) {
        ev.type = cc::TouchEvent::Type::ENDED;
    } else if (touchEvent.type == OH_NATIVEXCOMPONENT_CANCEL) {
        ev.type = cc::TouchEvent::Type::CANCELLED;
    }
    for(int i = 0; i < touchEvent.numPoints; ++i) {
        ev.touches.emplace_back(touchEvent.touchPoints[i].x, touchEvent.touchPoints[i].y, touchEvent.touchPoints[i].id);
    }

    dispatchEvent(ev);
}


}; // namespace cc
