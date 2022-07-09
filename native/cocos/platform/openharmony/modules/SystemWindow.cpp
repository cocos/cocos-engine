/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "platform/openharmony/modules/SystemWindow.h"
#include <fcntl.h>
#include <unistd.h>
#include <cstddef>
#include <functional>
#include <thread>
#include <vector>
#include "base/Log.h"
#include "base/Macros.h"
#include "platform/openharmony/OpenHarmonyPlatform.h"

namespace {

void SendToWorker(const cc::MessageType& type, OH_NativeXComponent* component, void* window) {
    cc::OpenHarmonyPlatform* platform = dynamic_cast<cc::OpenHarmonyPlatform*>(cc::BasePlatform::getPlatform());
    CCASSERT(platform != nullptr, "Only supports openharmony platform");
    cc::WorkerMessageData data{type, static_cast<void*>(component), window};
    platform->workerMessageQ_.enQueue(data);
    if(type != cc::MessageType::WM_XCOMPONENT_SURFACE_CREATED)
        uv_async_send(&(cc::OpenHarmonyPlatform::getInstance()->workerOnMessageSignal_));
}

void OnSurfaceCreatedCB(OH_NativeXComponent* component, void* window) {
    SendToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_CREATED, component, window);
}

void DispatchTouchEventCB(OH_NativeXComponent* component, void* window) {
    SendToWorker(cc::MessageType::WM_XCOMPONENT_TOUCH_EVENT, component, window);
}

void OnSurfaceChangedCB(OH_NativeXComponent* component, void* window) {
    SendToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_CHANGED, component, window);
}

void OnSurfaceDestroyedCB(OH_NativeXComponent* component, void* window) {
    SendToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_DESTROY, component, window);
}
} // namespace

namespace cc {
SystemWindow* SystemWindow::instance_ = nullptr;

SystemWindow* SystemWindow::GetInstance() {
    return instance_;
}

SystemWindow::SystemWindow() {
    instance_                    = this;
    callback_.OnSurfaceCreated   = OnSurfaceCreatedCB;
    callback_.OnSurfaceChanged   = OnSurfaceChangedCB;
    callback_.OnSurfaceDestroyed = OnSurfaceDestroyedCB;
    callback_.DispatchTouchEvent = DispatchTouchEventCB;
}

bool SystemWindow::createWindow(const char* title,
                                int x, int y, int w,
                                int h, int flags) {
    CC_UNUSED_PARAM(title);
    CC_UNUSED_PARAM(x);
    CC_UNUSED_PARAM(y);
    CC_UNUSED_PARAM(w);
    CC_UNUSED_PARAM(h);
    CC_UNUSED_PARAM(flags);
    return true;
}

void SystemWindow::SetNativeXComponent(OH_NativeXComponent* component) {
    component_ = component;
    OH_NativeXComponent_RegisterCallback(component_, &callback_);
}

void SystemWindow::setCursorEnabled(bool value) {
}

void SystemWindow::copyTextToClipboard(const std::string& text) {
    //copyTextToClipboardJNI(text);
}

uintptr_t SystemWindow::getWindowHandler() const {
    return reinterpret_cast<uintptr_t>(windowHandler_);
}

SystemWindow::Size SystemWindow::getViewSize() const {
    return Size{static_cast<float>(width_),
                static_cast<float>(height_)};
}

void SystemWindow::OnSurfaceCreated(OH_NativeXComponent* component, void* window) {
    int32_t ret = OH_NativeXComponent_GetXComponentSize(component, window, &width_, &height_);
    CCASSERT(ret == OH_NATIVEXCOMPONENT_RESULT_SUCCESS, "GetXComponentSize call failed");
    windowHandler_ = window;
}

void SystemWindow::OnSurfaceChanged(OH_NativeXComponent* component, void* window) {
}

void SystemWindow::OnSurfaceDestroyed(OH_NativeXComponent* component, void* window) {
    windowHandler_ = nullptr;
}

void SystemWindow::DispatchTouchEvent(OH_NativeXComponent* component, void* window) {
    struct OH_NativeXComponent_TouchEvent touchEvent;
    int32_t ret = OH_NativeXComponent_GetTouchEvent(component, window, &touchEvent);
    if (ret != OH_NATIVEXCOMPONENT_RESULT_SUCCESS) {
        return;
    }

    OpenHarmonyPlatform* platform = dynamic_cast<OpenHarmonyPlatform*>(BasePlatform::getPlatform());
    CCASSERT(platform != nullptr, "Only supports openharmony platform");
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

    platform->dispatchEvent(ev);
}

} // namespace cc