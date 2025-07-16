/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include "platform/openharmony/modules/SystemWindowManager.h"

#include "platform/empty/modules/Accelerometer.h"
#include "platform/empty/modules/Battery.h"
#include "platform/empty/modules/Network.h"
#include "platform/empty/modules/Screen.h"
#include "platform/empty/modules/Vibrator.h"
#include "platform/openharmony/modules/System.h"

#include <chrono>
#include <sstream>

namespace {

class SyncContext {
private:
    std::atomic<int> _refCount{1};
    uv_cond_t _cond{};
    uv_mutex_t _mutex{};
    bool _completed{false};
public:
    
    enum class WAIT_RET_CODE {
        SUCCEED = 0,
        TIMEOUT,
    };
    
    SyncContext() {
        CC_LOG_INFO("Create SyncContext: %p", this);
        uv_mutex_init(&_mutex);
        uv_cond_init(&_cond);
    }
    
    ~SyncContext() {
        CC_LOG_INFO("Destroy SyncContext: %p", this);
        uv_mutex_destroy(&_mutex);
        uv_cond_destroy(&_cond);
    }
    
    WAIT_RET_CODE wait_for(uint64_t nanoSeconds) {
        WAIT_RET_CODE ret = WAIT_RET_CODE::SUCCEED;
        uv_mutex_lock(&_mutex);
    
        // Use a while loop to check the completed flag to avoid spurious wakeup.
        while (!_completed) {
            int r = uv_cond_timedwait(&_cond, &_mutex, nanoSeconds);
            if (r == UV_ETIMEDOUT) {
                ret = WAIT_RET_CODE::TIMEOUT;
                break;
            }
        }
        uv_mutex_unlock(&_mutex);
        return ret;
    }
    
    void notify() {
        uv_mutex_lock(&_mutex);
        _completed = true;
        uv_cond_signal(&_cond);
        uv_mutex_unlock(&_mutex);
    }
    
    void addRef() {
        ++_refCount;
    }
    
    void release() {
        --_refCount;
        int ref = _refCount;
        if (ref == 0) {
            delete this;
        }
    }
    
};

void sendMsgToWorker(const cc::MessageType& type, void* data, void* window) {
    cc::OpenHarmonyPlatform* platform = dynamic_cast<cc::OpenHarmonyPlatform*>(cc::BasePlatform::getPlatform());
    CC_ASSERT(platform != nullptr);
    cc::WorkerMessageData msg{type, static_cast<void*>(data), window};
    platform->enqueue(msg);
}

void sendMsgToWorkerAndWait(const cc::MessageType& type, void* data, void* window) {
    cc::OpenHarmonyPlatform* platform = dynamic_cast<cc::OpenHarmonyPlatform*>(cc::BasePlatform::getPlatform());
    CC_ASSERT(platform != nullptr);
    cc::WorkerMessageData msg{type, static_cast<void*>(data), window};
    platform->enqueueAndWait(msg);
}

void onSurfaceCreatedCB(OH_NativeXComponent* component, void* window) {
    CC_LOG_INFO("onSurfaceCreatedCB, component: %p, window: %p");
    // It is possible that when the message is sent, the worker thread has not yet started.
    //sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_CREATED, component, window);
    cc::ISystemWindowInfo info;
    info.title = "";
    info.x = 0;
    info.y = 0;
    info.width = 0;
    info.height = 0;
    info.flags = 0;
    info.externalHandle = window;
    cc::ISystemWindowManager* windowMgr =
        cc::OpenHarmonyPlatform::getInstance()->getInterface<cc::ISystemWindowManager>();
    windowMgr->createWindow(info);
}

void onSurfaceHideCB(OH_NativeXComponent* component, void* window) {
    CC_LOG_INFO("onSurfaceHideCB begin, component: %p, window: %p");
    int32_t ret;
    char idStr[OH_XCOMPONENT_ID_LEN_MAX + 1] = {};
    uint64_t idSize = OH_XCOMPONENT_ID_LEN_MAX + 1;
    ret = OH_NativeXComponent_GetXComponentId(component, idStr, &idSize);
    if(ret != OH_NATIVEXCOMPONENT_RESULT_SUCCESS) {
        CC_LOG_ERROR("onSurfaceHideCB, OH_NativeXComponent_GetXComponentId failed: %d", ret);
        return;
    }
    sendMsgToWorkerAndWait(cc::MessageType::WM_XCOMPONENT_SURFACE_HIDE, component, window);
    
    CC_LOG_INFO("onSurfaceHideCB end, component: %p, window: %p");
}

void onSurfaceShowCB(OH_NativeXComponent* component, void* window) {
    CC_LOG_INFO("onSurfaceShowCB, component: %p, window: %p");
    int32_t ret;
    char idStr[OH_XCOMPONENT_ID_LEN_MAX + 1] = {};
    uint64_t idSize = OH_XCOMPONENT_ID_LEN_MAX + 1;
    ret = OH_NativeXComponent_GetXComponentId(component, idStr, &idSize);
    if(ret != OH_NATIVEXCOMPONENT_RESULT_SUCCESS) {
        return;
    }
    sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_SHOW, component, window);
}

int ohKeyCodeToCocosKeyCode(OH_NativeXComponent_KeyCode ohKeyCode){
    static const int keyZeroInCocos = 48;
    static const int keyF1InCocos = 112;
    static const int keyAInCocos = 65;
    static std::unordered_map<OH_NativeXComponent_KeyCode, cc::KeyCode> keyCodeMap = {
        {KEY_ESCAPE, cc::KeyCode::ESCAPE},
        {KEY_GRAVE, cc::KeyCode::BACKQUOTE},
        {KEY_MINUS, cc::KeyCode::MINUS},
        {KEY_EQUALS, cc::KeyCode::EQUAL},
        {KEY_DEL, cc::KeyCode::BACKSPACE},
        {KEY_TAB, cc::KeyCode::TAB},
        {KEY_LEFT_BRACKET, cc::KeyCode::BRACKET_LEFT},
        {KEY_RIGHT_BRACKET, cc::KeyCode::BRACKET_RIGHT},
        {KEY_BACKSLASH, cc::KeyCode::BACKSLASH},
        {KEY_CAPS_LOCK, cc::KeyCode::CAPS_LOCK},
        {KEY_SEMICOLON, cc::KeyCode::SEMICOLON},
        {KEY_APOSTROPHE, cc::KeyCode::QUOTE},
        {KEY_ENTER, cc::KeyCode::ENTER},
        {KEY_SHIFT_LEFT, cc::KeyCode::SHIFT_LEFT},
        {KEY_COMMA, cc::KeyCode::COMMA},
        {KEY_PERIOD, cc::KeyCode::PERIOD},
        {KEY_SLASH, cc::KeyCode::SLASH},
        {KEY_SHIFT_RIGHT, cc::KeyCode::SHIFT_RIGHT},
        {KEY_CTRL_LEFT, cc::KeyCode::CONTROL_LEFT},
        {KEY_ALT_LEFT, cc::KeyCode::ALT_LEFT},
        {KEY_SPACE, cc::KeyCode::SPACE},
        {KEY_ALT_RIGHT, cc::KeyCode::ALT_RIGHT},
        {KEY_CTRL_RIGHT, cc::KeyCode::CONTROL_RIGHT},
        {KEY_DPAD_LEFT, cc::KeyCode::ARROW_LEFT},
        {KEY_DPAD_RIGHT, cc::KeyCode::ARROW_RIGHT},
        {KEY_DPAD_DOWN, cc::KeyCode::ARROW_DOWN},
        {KEY_DPAD_UP, cc::KeyCode::ARROW_UP},
        {KEY_INSERT, cc::KeyCode::INSERT},
    };
    if(keyCodeMap.find(ohKeyCode) != keyCodeMap.end()){
        return int(keyCodeMap[ohKeyCode]);
    }
    if(ohKeyCode >= KEY_0 && ohKeyCode <= KEY_9){
        return keyZeroInCocos + ohKeyCode - KEY_0;
    }
    if(ohKeyCode >= KEY_A && ohKeyCode <= KEY_Z){
        return keyAInCocos + ohKeyCode - KEY_A;
    }  
    if(ohKeyCode >= KEY_F1 && ohKeyCode <= KEY_F12){
        return keyF1InCocos + ohKeyCode - KEY_F1;
    }  
    return ohKeyCode;
}

void dispatchKeyEventCB(OH_NativeXComponent* component, void* window) {
    OH_NativeXComponent_KeyEvent* keyEvent;
    if (OH_NativeXComponent_GetKeyEvent(component, &keyEvent) >= 0) {
        static const int keyCodeUnknownInOH = -1;
        static const int keyActionUnknownInOH = -1;
        OH_NativeXComponent_KeyAction action;
        OH_NativeXComponent_GetKeyEventAction(keyEvent, &action);
        OH_NativeXComponent_KeyCode code;
        OH_NativeXComponent_GetKeyEventCode(keyEvent, &code);
        if (code == keyCodeUnknownInOH || action == keyActionUnknownInOH) {
            CC_LOG_ERROR("unknown code and action don't callback");
            return;
        }
        cc::KeyboardEvent* ev = new cc::KeyboardEvent;
        ev->windowId = cc::ISystemWindow::mainWindowId;
        ev->action = 0 == action ? cc::KeyboardEvent::Action::PRESS : cc::KeyboardEvent::Action::RELEASE;

        ev->key = ohKeyCodeToCocosKeyCode(code);
        sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_KEY_EVENT, reinterpret_cast<void*>(ev), window);
    } else {
        CC_LOG_ERROR("OpenHarmonyPlatform::getKeyEventError");
    }
}


void dispatchMouseEventCB(OH_NativeXComponent* component, void* window) {
    OH_NativeXComponent_MouseEvent mouseEvent;
    int32_t ret = OH_NativeXComponent_GetMouseEvent(component, window, &mouseEvent);
    if (ret == OH_NATIVEXCOMPONENT_RESULT_SUCCESS) {
        if (mouseEvent.action == OH_NativeXComponent_MouseEventAction::OH_NATIVEXCOMPONENT_MOUSE_NONE)
            return;
        cc::MouseEvent* ev = new cc::MouseEvent;
        ev->windowId = cc::ISystemWindow::mainWindowId;
        ev->x = mouseEvent.x;
        ev->y = mouseEvent.y;
        switch (mouseEvent.action) {
            case OH_NativeXComponent_MouseEventAction::OH_NATIVEXCOMPONENT_MOUSE_PRESS:
                ev->type = cc::MouseEvent::Type::DOWN;
                break;
            case OH_NativeXComponent_MouseEventAction::OH_NATIVEXCOMPONENT_MOUSE_RELEASE:
                ev->type = cc::MouseEvent::Type::UP;
                break;
            case OH_NativeXComponent_MouseEventAction::OH_NATIVEXCOMPONENT_MOUSE_MOVE:
                ev->type = cc::MouseEvent::Type::MOVE;
                break;          
            default:
                ev->type = cc::MouseEvent::Type::UNKNOWN;
                break;
        }
        switch (mouseEvent.button) {
            case OH_NativeXComponent_MouseEventButton::OH_NATIVEXCOMPONENT_LEFT_BUTTON:
                ev->button = 0;
                break;
            case OH_NativeXComponent_MouseEventButton::OH_NATIVEXCOMPONENT_RIGHT_BUTTON:
                ev->button = 2;
                break;
            case OH_NativeXComponent_MouseEventButton::OH_NATIVEXCOMPONENT_MIDDLE_BUTTON:
                ev->button = 1;
                break;
            case OH_NativeXComponent_MouseEventButton::OH_NATIVEXCOMPONENT_BACK_BUTTON:
                ev->button = 3;
                break;
            case OH_NativeXComponent_MouseEventButton::OH_NATIVEXCOMPONENT_FORWARD_BUTTON:
                ev->button = 4;
                break;
            case OH_NativeXComponent_MouseEventButton::OH_NATIVEXCOMPONENT_NONE_BUTTON:
                ev->button = -1;
                break;
        }
        if(mouseEvent.action == 1 && mouseEvent.button == 1) {
            cc::OpenHarmonyPlatform::getInstance()->isMouseLeftActive = true;
        }
        if(mouseEvent.action == 2 && mouseEvent.button == 1) {
            cc::OpenHarmonyPlatform::getInstance()->isMouseLeftActive = false;
        }
        sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_MOUSE_EVENT, reinterpret_cast<void*>(ev), window);
    } else {
        CC_LOG_ERROR("OpenHarmonyPlatform::getMouseEventError");
    }
}

void dispatchHoverEventCB(OH_NativeXComponent* component, bool isHover) {
    // OpenharmonyPlatform::DispatchHoverEventCB
}

cc::TouchEvent::Type touchTypeTransform(OH_NativeXComponent_TouchEventType touchType) {
    if (touchType == OH_NATIVEXCOMPONENT_DOWN) {
        return cc::TouchEvent::Type::BEGAN;
    } else if (touchType == OH_NATIVEXCOMPONENT_MOVE) {
        return cc::TouchEvent::Type::MOVED;
    } else if (touchType == OH_NATIVEXCOMPONENT_UP) {
        return cc::TouchEvent::Type::ENDED;
    } else if (touchType == OH_NATIVEXCOMPONENT_CANCEL) {
        return cc::TouchEvent::Type::CANCELLED;
    }
    return cc::TouchEvent::Type::UNKNOWN;
}

void dispatchTouchEventCB(OH_NativeXComponent* component, void* window) {
    OH_NativeXComponent_TouchEvent touchEvent;
    int32_t ret = OH_NativeXComponent_GetTouchEvent(component, window, &touchEvent);
    if (ret != OH_NATIVEXCOMPONENT_RESULT_SUCCESS) {
        return;
    }
    // TODO(qgh):Is it possible to find an efficient way to do this, I thought about using a cache queue but it requires locking.
    cc::TouchEvent* ev = new cc::TouchEvent;
    cc::SystemWindowManager* windowMgr =
        cc::OpenHarmonyPlatform::getInstance()->getInterface<cc::SystemWindowManager>();
    CC_ASSERT_NOT_NULL(windowMgr);
    cc::ISystemWindow* systemWindow = windowMgr->getWindowFromHandle(window);
    CC_ASSERT_NOT_NULL(systemWindow);
    ev->windowId = systemWindow->getWindowId();
    if (touchEvent.type == OH_NATIVEXCOMPONENT_DOWN) {
        ev->type = cc::TouchEvent::Type::BEGAN;
    } else if (touchEvent.type == OH_NATIVEXCOMPONENT_MOVE) {
        ev->type = cc::TouchEvent::Type::MOVED;
    } else if (touchEvent.type == OH_NATIVEXCOMPONENT_UP) {
        ev->type = cc::TouchEvent::Type::ENDED;
    } else if (touchEvent.type == OH_NATIVEXCOMPONENT_CANCEL) {
        ev->type = cc::TouchEvent::Type::CANCELLED;
    }
    for (int i = 0; i < touchEvent.numPoints; ++i) {
        int32_t id = touchEvent.touchPoints[i].id;
        if (touchEvent.id == id) {
            ev->touches.emplace_back(touchEvent.touchPoints[i].x, touchEvent.touchPoints[i].y, id);
        }
    }
    sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_TOUCH_EVENT, reinterpret_cast<void*>(ev), window);
}

void onSurfaceChangedCB(OH_NativeXComponent* component, void* window) {
    sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_CHANGED, reinterpret_cast<void*>(component), window);
}

void onSurfaceDestroyedCB(OH_NativeXComponent* component, void* window) {
    sendMsgToWorker(cc::MessageType::WM_XCOMPONENT_SURFACE_DESTROY, reinterpret_cast<void*>(component), window);
}

} // namespace

namespace cc {

OpenHarmonyPlatform::OpenHarmonyPlatform() {
    registerInterface(std::make_shared<System>());
    registerInterface(std::make_shared<Screen>());
    registerInterface(std::make_shared<Vibrator>());
    registerInterface(std::make_shared<Network>());
    registerInterface(std::make_shared<Battery>());
    registerInterface(std::make_shared<Accelerometer>());
    registerInterface(std::make_shared<SystemWindowManager>());

    _callback.OnSurfaceCreated = onSurfaceCreatedCB;
    _callback.OnSurfaceChanged = onSurfaceChangedCB;
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
    /*
    if (_workerLoop) {
        // Todo: Starting the timer in this way is inaccurate and will be fixed later.
        uv_timer_init(_workerLoop, &_timerHandle);
        // 1s = 1000ms = 60fps;
        // 1000ms / 60fps = 16 ms/fps
        uv_timer_start(&_timerHandle, &OpenHarmonyPlatform::timerCb, 16, true);
    }
    */
    return 0;
}

void OpenHarmonyPlatform::setNativeXComponent(OH_NativeXComponent* component) {
    _component = component;
    OH_NativeXComponent_RegisterCallback(_component, &_callback);
    OH_NativeXComponent_RegisterSurfaceHideCallback(_component, onSurfaceHideCB);
    OH_NativeXComponent_RegisterSurfaceShowCallback(_component, onSurfaceShowCB);
    // register KeyEvent                                     
    OH_NativeXComponent_RegisterKeyEventCallback(_component, dispatchKeyEventCB);
    // register mouseEvent
    _mouseCallback.DispatchMouseEvent = dispatchMouseEventCB;
    _mouseCallback.DispatchHoverEvent = dispatchHoverEventCB;
    OH_NativeXComponent_RegisterMouseEventCallback(_component, &_mouseCallback);
}

void OpenHarmonyPlatform::enqueue(const WorkerMessageData& msg) {
    _messageQueue.enqueue(msg);
    triggerMessageSignal();
}

void OpenHarmonyPlatform::enqueueAndWait(WorkerMessageData& msg) {
    SyncContext* syncContext = new SyncContext(); // ref -> 1
    syncContext->addRef(); // ref -> 2
    msg.syncContext = syncContext;
    _messageQueue.enqueue(msg);
    auto *oldWorkerLoop = _workerLoop;
    triggerMessageSignal();

    auto oldTime = std::chrono::steady_clock::now();
    static const uint64_t SYNC_TIMEOUT_NANO_SECONDS = 300 * 1000 * 1000; // 300ms
    static const uint32_t WAIT_COUNT = 10;

    SyncContext::WAIT_RET_CODE waitRet = SyncContext::WAIT_RET_CODE::SUCCEED;
    for (uint32_t i = 0; i < WAIT_COUNT; ++i) {
        waitRet = syncContext->wait_for(SYNC_TIMEOUT_NANO_SECONDS); // not timeout, after wait: ref -> 1 ; timeout, after wait: ref still -> 2
        if (waitRet == SyncContext::WAIT_RET_CODE::SUCCEED) {
            break;
        }
        if (oldWorkerLoop == nullptr) {
            CC_LOG_INFO("oldWorkerLoop is nullptr, current: %p", _workerLoop);
            triggerMessageSignal();
            oldWorkerLoop = _workerLoop;
        }
        CC_LOG_INFO("enqueueAndWait timeout 300ms, index: %u, try again", i);
    }

    auto nowTime = std::chrono::steady_clock::now();
    auto interval = static_cast<double>(std::chrono::duration_cast<std::chrono::nanoseconds>(nowTime - oldTime).count());
    CC_LOG_INFO("enqueueAndWait: %.03f ms, waitRet: %d", interval / 1000 / 1000, static_cast<int>(waitRet));
    syncContext->release(); // not timeout, ref -> 0; timeout, ref -> 1, will be released in event handle callback
}

void OpenHarmonyPlatform::triggerMessageSignal() {
    if (_workerLoop != nullptr) {
        // It is possible that when the message is sent, the worker thread has not yet started.
        uv_async_send(&_messageSignal);
    } else {
        CC_LOG_WARNING("triggerMessageSignal, _workerLoop is not created");
    }
}

bool OpenHarmonyPlatform::dequeue(WorkerMessageData* msg) {
    return _messageQueue.dequeue(msg);
}

// static
void OpenHarmonyPlatform::onMessageCallback(const uv_async_t* /* req */) {
    void* window = nullptr;
    WorkerMessageData msgData;
    OpenHarmonyPlatform* platform = OpenHarmonyPlatform::getInstance();
    while (true) {
        //loop until all msg dispatch
        if (!platform->dequeue(reinterpret_cast<WorkerMessageData*>(&msgData))) {
            // Queue has no data
            break;
        }

        if ((msgData.type >= MessageType::WM_XCOMPONENT_SURFACE_CREATED) && (msgData.type <= MessageType::WM_XCOMPONENT_SURFACE_DESTROY)) {
            if (msgData.type == MessageType::WM_XCOMPONENT_TOUCH_EVENT) {
                TouchEvent* ev = reinterpret_cast<TouchEvent*>(msgData.data);
                CC_ASSERT(ev != nullptr);
                events::Touch::broadcast(*ev);
                delete ev;
                ev = nullptr;
            } else if (msgData.type == MessageType::WM_XCOMPONENT_KEY_EVENT) {
                KeyboardEvent* ev = reinterpret_cast<KeyboardEvent*>(msgData.data);
                CC_ASSERT(ev != nullptr);
                events::Keyboard::broadcast(*ev);
                delete ev;
                ev = nullptr;
            } else if (msgData.type == MessageType::WM_XCOMPONENT_MOUSE_EVENT || msgData.type == MessageType::WM_XCOMPONENT_MOUSE_WHEEL_EVENT ) {
                MouseEvent* ev = reinterpret_cast<MouseEvent*>(msgData.data);
                CC_ASSERT(ev != nullptr);
                events::Mouse::broadcast(*ev);
                delete ev;
                ev = nullptr;
            } else if (msgData.type == MessageType::WM_XCOMPONENT_SURFACE_CREATED) {
                CC_LOG_INFO("onMessageCallback WM_XCOMPONENT_SURFACE_CREATED ...");
                OH_NativeXComponent* nativexcomponet = reinterpret_cast<OH_NativeXComponent*>(msgData.data);
                CC_ASSERT(nativexcomponet != nullptr);
                platform->onSurfaceCreated(nativexcomponet, msgData.window);
            } else if (msgData.type == MessageType::WM_XCOMPONENT_SURFACE_CHANGED) {
                CC_LOG_INFO("onMessageCallback WM_XCOMPONENT_SURFACE_CHANGED ...");
                OH_NativeXComponent* nativexcomponet = reinterpret_cast<OH_NativeXComponent*>(msgData.data);
                CC_ASSERT(nativexcomponet != nullptr);
                platform->onSurfaceChanged(nativexcomponet, msgData.window);
            } else if (msgData.type == MessageType::WM_XCOMPONENT_SURFACE_SHOW) {
                OH_NativeXComponent* nativexcomponet = reinterpret_cast<OH_NativeXComponent*>(msgData.data);
                CC_ASSERT(nativexcomponet != nullptr);        
                platform->onSurfaceShow(msgData.window);
            } else if (msgData.type == MessageType::WM_XCOMPONENT_SURFACE_HIDE) {
                OH_NativeXComponent* nativexcomponet = reinterpret_cast<OH_NativeXComponent*>(msgData.data);
                CC_ASSERT(nativexcomponet != nullptr);        
                platform->onSurfaceHide();
                
                auto *ctx = reinterpret_cast<SyncContext*>(msgData.syncContext);
                if (ctx) {
                    ctx->notify();
                    ctx->release();
                }
            } else if (msgData.type == MessageType::WM_XCOMPONENT_SURFACE_DESTROY) {
                CC_LOG_INFO("onMessageCallback WM_XCOMPONENT_SURFACE_DESTROY ...");
                OH_NativeXComponent* nativexcomponet = reinterpret_cast<OH_NativeXComponent*>(msgData.data);
                CC_ASSERT(nativexcomponet != nullptr);
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
        }
        if (msgData.type == MessageType::WM_VSYNC) {
            platform->runTask();
        }
    }
}

void OpenHarmonyPlatform::onCreateNative(napi_env env, uv_loop_t* loop) {
}

void OpenHarmonyPlatform::onShowNative() {
    CC_LOG_INFO("OpenHarmonyPlatform::onShowNative");
    WindowEvent ev;
    ev.type = WindowEvent::Type::SHOW;
    ev.windowId = cc::ISystemWindow::mainWindowId;
    events::WindowEvent::broadcast(ev);
    onResume();
    if (_timerInited) {
        uv_timer_start(&_timerHandle, &OpenHarmonyPlatform::timerCb, 0, 1);
    }
}

void OpenHarmonyPlatform::onHideNative() {
    CC_LOG_INFO("OpenHarmonyPlatform::onHideNative");
    WindowEvent ev;
    ev.type = WindowEvent::Type::HIDDEN;
    ev.windowId = cc::ISystemWindow::mainWindowId;
    events::WindowEvent::broadcast(ev);
    onPause();
    if (_timerInited) {
        uv_timer_stop(&_timerHandle);
    }
}

void OpenHarmonyPlatform::onDestroyNative() {
    CC_LOG_INFO("OpenHarmonyPlatform::onDestroyNative");
    onDestroy();
     if (_timerInited) {
        uv_timer_stop(&_timerHandle);
    }
}

void OpenHarmonyPlatform::timerCb(uv_timer_t* handle) {
    OpenHarmonyPlatform::getInstance()->runTask();
}

void OpenHarmonyPlatform::restartJSVM() {
    g_started = false;
}

void OpenHarmonyPlatform::workerInit(uv_loop_t* loop) {
    CC_LOG_INFO("workerInit: %p", loop);
    _workerLoop = loop;
    if (_workerLoop) {
        uv_timer_init(_workerLoop, &_timerHandle);
        _timerInited = true;
        
        uv_async_init(_workerLoop, &_messageSignal, reinterpret_cast<uv_async_cb>(OpenHarmonyPlatform::onMessageCallback));
        
        if (!_messageQueue.empty()) {
            triggerMessageSignal(); // trigger the signal to handle the pending message
        }
	}
}

void OpenHarmonyPlatform::requestVSync() {
}

int32_t OpenHarmonyPlatform::loop() {
    return 0;
}

void OpenHarmonyPlatform::onSurfaceCreated(OH_NativeXComponent* component, void* window) {
}

void OpenHarmonyPlatform::onSurfaceChanged(OH_NativeXComponent* component, void* window) {
    uint64_t width = 0;
    uint64_t height = 0;
    int32_t ret = OH_NativeXComponent_GetXComponentSize(_component, window, &width, &height);
    CC_ASSERT(ret == OH_NATIVEXCOMPONENT_RESULT_SUCCESS);
    WindowEvent ev;
    ev.windowId = cc::ISystemWindow::mainWindowId;
    ev.type = WindowEvent::Type::SIZE_CHANGED;
    ev.width = width;
    ev.height = height;
    events::WindowEvent::broadcast(ev);
}

void OpenHarmonyPlatform::onSurfaceDestroyed(OH_NativeXComponent* component, void* window) {
    cc::SystemWindowManager* windowMgr = this->getInterface<cc::SystemWindowManager>();
    CC_ASSERT_NOT_NULL(windowMgr);
    windowMgr->removeWindow(window);
}

void OpenHarmonyPlatform::onSurfaceHide() {
    CC_LOG_INFO("OpenHarmonyPlatform::onSurfaceHide");
    events::WindowDestroy::broadcast(ISystemWindow::mainWindowId);
}

void OpenHarmonyPlatform::onSurfaceShow(void* window) {
    CC_LOG_INFO("OpenHarmonyPlatform::onSurfaceShow");
    events::WindowRecreated::broadcast(ISystemWindow::mainWindowId);
}

void OpenHarmonyPlatform::dispatchMouseWheelCB(std::string eventType, float offsetY) {
    if(isMouseLeftActive) {
        return;
    }
    if(eventType == "actionUpdate") {
        float moveScrollY = offsetY - scrollDistance;
        scrollDistance = offsetY;
        cc::MouseEvent* ev = new cc::MouseEvent;
        ev->windowId = cc::ISystemWindow::mainWindowId;
        ev->type = MouseEvent::Type::WHEEL;
        ev->x = 0;
        ev->y = moveScrollY;
        sendMsgToWorker(MessageType::WM_XCOMPONENT_MOUSE_WHEEL_EVENT, reinterpret_cast<void*>(ev), nullptr);
    } else {
        scrollDistance = 0;
    }
}

ISystemWindow* OpenHarmonyPlatform::createNativeWindow(uint32_t windowId, void* externalHandle) {
    SystemWindow* window = ccnew SystemWindow(windowId, externalHandle);
    uint64_t width = 0;
    uint64_t height = 0;
    CC_ASSERT_NOT_NULL(_component);
    int32_t ret = OH_NativeXComponent_GetXComponentSize(_component, externalHandle, &width, &height);
    CC_ASSERT(ret == OH_NATIVEXCOMPONENT_RESULT_SUCCESS);
    window->setViewSize(width, height);
    return window;
}

}; // namespace cc
