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

#include "XRInterface.h"
#include <fcntl.h>
#include <unistd.h>
#include <functional>
#include <unordered_map>
#include "android/AndroidPlatform.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "bindings/event/EventDispatcher.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "java/jni/JniHelper.h"
#include "renderer/GFXDeviceManager.h"
#ifdef CC_USE_VULKAN
    #include "gfx-vulkan/VKDevice.h"
#endif
#ifdef CC_USE_GLES3
    #include "gfx-gles-common/gles3w.h"
    #include "gfx-gles3/GLES3Device.h"
    #include "renderer/gfx-gles3/GLES3GPUObjects.h"
#endif

#if CC_USE_XR
    #include "Xr.h"
#endif
#include "application/ApplicationManager.h"
#include "base/threading/MessageQueue.h"

// print log
const bool IS_ENABLE_XR_LOG = false;

namespace cc {
ControllerEvent controllerEvent;
static se::Object *jsPoseEventArray = nullptr;
static void dispatchGamepadEventInternal(const xr::XRControllerEvent &xrControllerEvent) {
    if (xrControllerEvent.xrControllerInfos.empty()) {
        return;
    }

    auto *controllerInfo = ccnew ControllerInfo();
    if (!controllerInfo) {
        return;
    }

    size_t length = xrControllerEvent.xrControllerInfos.size();
    for (size_t i = 0; i < length; i++) {
        switch (xrControllerEvent.xrControllerInfos.at(i)->getXREventType()) {
            case xr::XREventType::CLICK: {
                auto *xrClick = static_cast<xr::XRClick *>(xrControllerEvent.xrControllerInfos.at(i).get());
                switch (xrClick->type) {
                    case xr::XRClick::Type::MENU:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::MENU, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::TRIGGER_LEFT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::L3, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::SHOULDER_LEFT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::L1, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::THUMBSTICK_LEFT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::LEFT_STICK, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::X:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::Y, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::Y:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::X, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::TRIGGER_RIGHT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::R3, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::SHOULDER_RIGHT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::R1, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::THUMBSTICK_RIGHT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::RIGHT_STICK, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::A:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::B, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::B:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::A, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::HOME:
                        CC_LOG_INFO("[XRInterface] exit when home click in rokid.");
#if CC_USE_XR
                        xr::XrEntry::getInstance()->destroyXrInstance();
                        xr::XrEntry::destroyInstance();
#endif
                        CC_CURRENT_APPLICATION_SAFE()->close();
                        break;
                    case xr::XRClick::Type::START:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::START, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::DPAD_UP:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::Y, xrClick->isPress ? 1.F : 0.F));
                        break;
                    case xr::XRClick::Type::DPAD_DOWN:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::Y, xrClick->isPress ? -1.F : 0.F));
                        break;
                    case xr::XRClick::Type::DPAD_LEFT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::X, xrClick->isPress ? -1.F : 0.F));
                        break;
                    case xr::XRClick::Type::DPAD_RIGHT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::X, xrClick->isPress ? 1.F : 0.F));
                        break;
                    default:
                        break;
                }
            } break;
            case xr::XREventType::STICK: {
                auto *xrStick = static_cast<xr::XRStick *>(xrControllerEvent.xrControllerInfos.at(i).get());
                switch (xrStick->type) {
                    case xr::XRStick::Type::STICK_LEFT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::LEFT_STICK_X, xrStick->x));
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::LEFT_STICK_Y, xrStick->y));
                        break;
                    case xr::XRStick::Type::STICK_RIGHT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::RIGHT_STICK_X, xrStick->x));
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::RIGHT_STICK_Y, xrStick->y));
                        break;
                    default:
                        break;
                }
            } break;
            case xr::XREventType::GRAB: {
                auto *xrGrab = static_cast<xr::XRGrab *>(xrControllerEvent.xrControllerInfos.at(i).get());
                switch (xrGrab->type) {
                    case xr::XRGrab::Type::TRIGGER_LEFT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::L2, xrGrab->value));
                        break;
                    case xr::XRGrab::Type::TRIGGER_RIGHT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::R2, xrGrab->value));
                        break;
                    default:
                        break;
                }
            } break;
            default:
                break;
        }
    }

    controllerInfo->napdId = 0; // xr only one gamepad connection
    controllerEvent.controllerInfos.emplace_back(controllerInfo);
    controllerEvent.type = ControllerEvent::Type::GAMEPAD;
    static_cast<AndroidPlatform *>(BasePlatform::getPlatform())->dispatchEvent(controllerEvent);
    controllerEvent.type = ControllerEvent::Type::UNKNOWN;
    controllerEvent.controllerInfos.clear();
}

static void dispatchHandleEventInternal(const xr::XRControllerEvent &xrControllerEvent) {
    if (xrControllerEvent.xrControllerInfos.empty()) {
        return;
    }

    auto *controllerInfo = ccnew ControllerInfo();
    if (!controllerInfo) {
        return;
    }

    size_t length = xrControllerEvent.xrControllerInfos.size();
    se::AutoHandleScope scope;
    uint32_t poseIndex = 0;
    for (size_t i = 0; i < length; i++) {
        switch (xrControllerEvent.xrControllerInfos.at(i)->getXREventType()) {
            case xr::XREventType::CLICK: {
                auto *xrClick = static_cast<xr::XRClick *>(xrControllerEvent.xrControllerInfos.at(i).get());
                switch (xrClick->type) {
                    case xr::XRClick::Type::TRIGGER_LEFT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::L3, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::THUMBSTICK_LEFT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::LEFT_STICK, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::X:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::Y, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::Y:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::X, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::TRIGGER_RIGHT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::R3, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::THUMBSTICK_RIGHT:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::RIGHT_STICK, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::A:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::B, xrClick->isPress));
                        break;
                    case xr::XRClick::Type::B:
                        controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::A, xrClick->isPress));
                        break;
                    default:
                        break;
                }
            } break;
            case xr::XREventType::STICK: {
                auto *xrStick = static_cast<xr::XRStick *>(xrControllerEvent.xrControllerInfos.at(i).get());
                switch (xrStick->type) {
                    case xr::XRStick::Type::STICK_LEFT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::LEFT_STICK_X, xrStick->x));
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::LEFT_STICK_Y, xrStick->y));
                        break;
                    case xr::XRStick::Type::STICK_RIGHT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::RIGHT_STICK_X, xrStick->x));
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::RIGHT_STICK_Y, xrStick->y));
                        break;
                    default:
                        break;
                }
            } break;
            case xr::XREventType::GRAB: {
                auto *xrGrab = static_cast<xr::XRGrab *>(xrControllerEvent.xrControllerInfos.at(i).get());
                switch (xrGrab->type) {
                    case xr::XRGrab::Type::TRIGGER_LEFT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::L2, xrGrab->value));
                        break;
                    case xr::XRGrab::Type::TRIGGER_RIGHT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::R2, xrGrab->value));
                        break;
                    case xr::XRGrab::Type::GRIP_LEFT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::LEFT_GRIP, xrGrab->value));
                        break;
                    case xr::XRGrab::Type::GRIP_RIGHT:
                        controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(StickAxisCode::RIGHT_GRIP, xrGrab->value));
                        break;
                    default:
                        break;
                }
            } break;
            case xr::XREventType::POSE: {
                auto *xrPose = static_cast<xr::XRPose *>(xrControllerEvent.xrControllerInfos.at(i).get());
                switch (xrPose->type) {
                    case xr::XRPose::Type::HAND_LEFT:
                    case xr::XRPose::Type::HAND_RIGHT:
                    case xr::XRPose::Type::AIM_LEFT:
                    case xr::XRPose::Type::AIM_RIGHT: {
                        auto *jsPose = se::Object::createPlainObject();
                        jsPose->setProperty("code", se::Value(static_cast<int>(xrPose->type)));
                        jsPose->setProperty("x", se::Value(xrPose->px));
                        jsPose->setProperty("y", se::Value(xrPose->py));
                        jsPose->setProperty("z", se::Value(xrPose->pz));
                        jsPose->setProperty("quaternionX", se::Value(xrPose->qx));
                        jsPose->setProperty("quaternionY", se::Value(xrPose->qy));
                        jsPose->setProperty("quaternionZ", se::Value(xrPose->qz));
                        jsPose->setProperty("quaternionW", se::Value(xrPose->qw));
                        if (!jsPoseEventArray) {
                            jsPoseEventArray = se::Object::createArrayObject(0);
                            jsPoseEventArray->root();
                        }
                        jsPoseEventArray->setArrayElement(poseIndex, se::Value(jsPose));
                        poseIndex++;
                    } break;
                    default:
                        break;
                }
            } break;
            default:
                break;
        }
    }

    if (poseIndex > 0) {
        jsPoseEventArray->setProperty("length", se::Value(poseIndex));
        se::ValueArray args;
        args.emplace_back(se::Value(jsPoseEventArray));
        EventDispatcher::doDispatchJsEvent("onHandlePoseInput", args);
    }

    if (!controllerInfo->buttonInfos.empty() || !controllerInfo->axisInfos.empty()) {
        controllerInfo->napdId = 0; // xr only one handle connection
        controllerEvent.controllerInfos.emplace_back(controllerInfo);
        controllerEvent.type = ControllerEvent::Type::HANDLE;
        EventDispatcher::dispatchControllerEvent(controllerEvent);
        controllerEvent.type = ControllerEvent::Type::UNKNOWN;
        controllerEvent.controllerInfos.clear();
    } else {
        CC_SAFE_DELETE(controllerInfo);
    }
}

static void dispatchHMDEventInternal(const xr::XRControllerEvent &xrControllerEvent) {
    if (xrControllerEvent.xrControllerInfos.empty()) {
        return;
    }

    size_t length = xrControllerEvent.xrControllerInfos.size();
    se::AutoHandleScope scope;
    uint32_t poseIndex = 0;
    for (size_t i = 0; i < length; i++) {
        if (xrControllerEvent.xrControllerInfos.at(i)->getXREventType() == xr::XREventType::POSE) {
            auto *xrPose = static_cast<xr::XRPose *>(xrControllerEvent.xrControllerInfos.at(i).get());
            switch (xrPose->type) {
                case xr::XRPose::Type::VIEW_LEFT:
                case xr::XRPose::Type::VIEW_RIGHT:
                case xr::XRPose::Type::HEAD_MIDDLE: {
                    auto *jsPose = se::Object::createPlainObject();
                    jsPose->setProperty("code", se::Value(static_cast<int>(xrPose->type)));
                    jsPose->setProperty("x", se::Value(xrPose->px));
                    jsPose->setProperty("y", se::Value(xrPose->py));
                    jsPose->setProperty("z", se::Value(xrPose->pz));
                    jsPose->setProperty("quaternionX", se::Value(xrPose->qx));
                    jsPose->setProperty("quaternionY", se::Value(xrPose->qy));
                    jsPose->setProperty("quaternionZ", se::Value(xrPose->qz));
                    jsPose->setProperty("quaternionW", se::Value(xrPose->qw));
                    if (!jsPoseEventArray) {
                        jsPoseEventArray = se::Object::createArrayObject(0);
                        jsPoseEventArray->root();
                    }
                    jsPoseEventArray->setArrayElement(poseIndex, se::Value(jsPose));
                    poseIndex++;
                } break;
                default:
                    break;
            }
        }
    }

    if (poseIndex > 0) {
        jsPoseEventArray->setProperty("length", se::Value(poseIndex));
        se::ValueArray args;
        args.emplace_back(se::Value(jsPoseEventArray));
        EventDispatcher::doDispatchJsEvent("onHMDPoseInput", args);
    }
}

xr::XRVendor XRInterface::getVendor() {
#if CC_USE_XR
    return (xr::XRVendor) xr::XrEntry::getInstance()->getXRConfig(cc::xr::XRConfigKey::DEVICE_VENDOR).getInt();
#endif
    return xr::XRVendor::MONADO;
}

xr::XRConfigValue XRInterface::getXRConfig(xr::XRConfigKey key) {
#if CC_USE_XR
    return xr::XrEntry::getInstance()->getXRConfig(key);
#endif
    CC_UNUSED_PARAM(key);
    cc::xr::XRConfigValue configValue;
    return configValue;
}

void XRInterface::setXRConfig(xr::XRConfigKey key, xr::XRConfigValue value) {
#if CC_USE_XR
    CC_LOG_INFO("[XR] setConfigParameterI %d", key);
    xr::XrEntry::getInstance()->setXRConfig(key, value);
#else
    CC_UNUSED_PARAM(key);
    CC_UNUSED_PARAM(value);
#endif
}

uint32_t XRInterface::getRuntimeVersion() {
#if CC_USE_XR
    return xr::XrEntry::getInstance()->getXRConfig(cc::xr::XRConfigKey::RUNTIME_VERSION).getInt();
#endif
    return 1;
}

void XRInterface::initialize(void *javaVM, void *activity) {
#if CC_USE_XR
    CC_LOG_INFO("[XR] initialize vm.%p,aty.%p | %d", javaVM, activity,  (int)gettid());
    xr::XrEntry::getInstance()->initPlatformData(javaVM, activity);
    xr::XrEntry::getInstance()->setGamepadCallback(&dispatchGamepadEventInternal);
    xr::XrEntry::getInstance()->setHandleCallback(&dispatchHandleEventInternal);
    xr::XrEntry::getInstance()->setHMDCallback(&dispatchHMDEventInternal);
    xr::XrEntry::getInstance()->setXRConfig(xr::XRConfigKey::LOGIC_THREAD_ID, (int)gettid());
    xr::XrEntry::getInstance()->setXRConfigCallback([this](xr::XRConfigKey key, xr::XRConfigValue value) {
        if (IS_ENABLE_XR_LOG) CC_LOG_INFO("XRConfigCallback.%d", key);
        if (key == xr::XRConfigKey::RENDER_EYE_FRAME_LEFT || key == xr::XRConfigKey::RENDER_EYE_FRAME_RIGHT) {
            if (value.getInt() == 0)
                this->beginRenderEyeFrame(key == xr::XRConfigKey::RENDER_EYE_FRAME_LEFT ? 0 : 1);
            if (value.getInt() == 1)
                this->endRenderEyeFrame(key == xr::XRConfigKey::RENDER_EYE_FRAME_LEFT ? 0 : 1);
        }
    });
    #if XR_OEM_PICO
    std::string graphicsApiName = GraphicsApiOpenglES;
#if CC_USE_VULKAN
    graphicsApiName = GraphicsApiVulkan_1_0;
#endif
    xr::XrEntry::getInstance()->createXrInstance(graphicsApiName.c_str());
    #endif
#else
    CC_UNUSED_PARAM(javaVM);
    CC_UNUSED_PARAM(activity);
#endif
}

// render thread lifecycle
void XRInterface::onRenderPause() {
#if CC_USE_XR
    if (!_renderPaused) {
        _renderPaused = true;
        _renderResumed = false;
        CC_LOG_INFO("[XR] onRenderPause");
        xr::XrEntry::getInstance()->pauseXrInstance();
    }
#endif
}

void XRInterface::onRenderResume() {
#if CC_USE_XR
    if (!_renderResumed) {
        _renderResumed = true;
        _renderPaused = false;
        CC_LOG_INFO("[XR] onRenderResume");
        xr::XrEntry::getInstance()->resumeXrInstance();
    }
#endif
}

void XRInterface::onRenderDestroy() {
#if CC_USE_XR
    CC_LOG_INFO("[XR] onRenderDestroy");
    xr::XrEntry::getInstance()->destroyXrInstance();
    xr::XrEntry::destroyInstance();
    if (jsPoseEventArray != nullptr) {
        jsPoseEventArray->unroot();
        jsPoseEventArray->decRef();
        jsPoseEventArray = nullptr;
    }
#endif
}
// render thread lifecycle

// gfx
void XRInterface::preGFXDeviceInitialize(gfx::API gfxApi) {
#if CC_USE_XR
    CC_LOG_INFO("[XR] preGFXDeviceInitialize.api.%d | Multi Thread.%d", gfxApi, gfx::DeviceAgent::getInstance() ? 1 : 0);
    setXRConfig(xr::XRConfigKey::MULTITHREAD_MODE, gfx::DeviceAgent::getInstance() ? true : false);
    xr::XrEntry::getInstance()->setXRConfig(xr::XRConfigKey::RENDER_THREAD_ID, (int)gettid());

    if (gfxApi == gfx::API::GLES3 || gfxApi == gfx::API::VULKAN) {
    #if !XR_OEM_PICO
        std::string graphicsApiName = gfxApi == gfx::API::GLES3 ? GraphicsApiOpenglES : GraphicsApiVulkan_1_1;
        xr::XrEntry::getInstance()->createXrInstance(graphicsApiName.c_str());
    #endif
    }
#else
    CC_UNUSED_PARAM(gfxApi);
#endif
}

void XRInterface::postGFXDeviceInitialize(gfx::API gfxApi) {
#if CC_USE_XR
    CC_LOG_INFO("[XR] postGFXDeviceInitialize.api.%d", gfxApi);
    if (gfxApi == gfx::API::GLES3) {
    #if CC_USE_GLES3
        xr::XrEntry::getInstance()->initXrSession(_gles3wLoadFuncProc,
                                                  _gles3GPUContext->eglDisplay,
                                                  _gles3GPUContext->eglConfig,
                                                  _gles3GPUContext->eglDefaultContext);
    #endif
    } else if (gfxApi == gfx::API::VULKAN) {
    #if CC_USE_VULKAN
        int vkQueueFamilyIndex = xr::XrEntry::getInstance()->getXRConfig(cc::xr::XRConfigKey::VK_QUEUE_FAMILY_INDEX).getInt();
        cc::xr::XrEntry::getInstance()->initXrSession(_vkInstance, _vkPhysicalDevice, _vkDevice, vkQueueFamilyIndex);
    #endif
    }
#else
    CC_UNUSED_PARAM(gfxApi);
#endif
}

const xr::XRSwapchain &XRInterface::doGFXDeviceAcquire(gfx::API gfxApi) {
#if CC_USE_XR
    // CC_LOG_INFO("[XR] doGFXDeviceAcquire.api.%d", gfxApi);
    if (gfxApi == gfx::API::GLES3 || gfxApi == gfx::API::VULKAN) {
        return xr::XrEntry::getInstance()->acquireXrSwapchain((uint32_t)gfxApi);
    }
#else
    CC_UNUSED_PARAM(gfxApi);
#endif
    return _acquireSwapchain;
}

bool XRInterface::isGFXDeviceNeedsPresent(gfx::API gfxApi) {
    CC_UNUSED_PARAM(gfxApi);
#if CC_USE_XR
    // CC_LOG_INFO("[XR] isGFXDeviceNeedsPresent.api.%d", gfxApi);
    // if (gfxApi == gfx::API::GLES3 || gfxApi == gfx::API::VULKAN) {
    // }
    return xr::XrEntry::getInstance()->getXRConfig(cc::xr::XRConfigKey::PRESENT_ENABLE).getBool();
#endif
    return true;
}

void XRInterface::postGFXDevicePresent(gfx::API gfxApi) {
#if CC_USE_XR
    // CC_LOG_INFO("[XR] postGFXDevicePresent.api.%d", gfxApi);
    if (gfxApi == gfx::API::GLES3 || gfxApi == gfx::API::VULKAN) {
    }
#else
    CC_UNUSED_PARAM(gfxApi);
#endif
}

void XRInterface::createXRSwapchains() {
#if CC_USE_XR
    CC_LOG_INFO("[XR] createXRSwapchains");
    if (gfx::DeviceAgent::getInstance()) {
        ENQUEUE_MESSAGE_0(gfx::DeviceAgent::getInstance()->getMessageQueue(),
                          CreateXRSwapchains,
                          {
                              CC_LOG_INFO("[XR] [RT] initXrSwapchains");
                              xr::XrEntry::getInstance()->setXRConfig(xr::XRConfigKey::RENDER_THREAD_ID, (int)gettid());
                              JniHelper::getEnv();
                              xr::XrEntry::getInstance()->initXrSwapchains();
                          });
    } else {
        xr::XrEntry::getInstance()->initXrSwapchains();
    }
#endif
}

const std::vector<cc::xr::XRSwapchain> &XRInterface::getXRSwapchains() {
#if CC_USE_XR
    CC_LOG_INFO("[XR] getXRSwapchains");
    if (_xrSwapchains.size() == 0)
        _xrSwapchains = xr::XrEntry::getInstance()->getCocosXrSwapchains();
#endif
    return _xrSwapchains;
}

gfx::Format XRInterface::getXRSwapchainFormat() {
#if CC_USE_XR
     int swapchainFormat = xr::XrEntry::getInstance()->getXRConfig(xr::XRConfigKey::SWAPCHAIN_FORMAT).getInt();
#if CC_USE_GLES3
    if(swapchainFormat == GL_SRGB_ALPHA_EXT) {
        return gfx::Format::SRGB8_A8;
    } else if(swapchainFormat == GL_RGBA8) {
        return gfx::Format::RGBA8;
    } else if(swapchainFormat == GL_BGRA8_EXT) {
        return gfx::Format::BGRA8;
    }
#endif

#if CC_USE_VULKAN
    if(swapchainFormat == VK_FORMAT_R8G8B8A8_SRGB) {
        return gfx::Format::SRGB8_A8;
    } else if(swapchainFormat == VK_FORMAT_R8G8B8A8_UNORM) {
        return gfx::Format::RGBA8;
    } else if(swapchainFormat == VK_FORMAT_B8G8R8A8_UNORM) {
        return gfx::Format::BGRA8;
    }
#endif
#endif
    return gfx::Format::BGRA8;
}

void XRInterface::updateXRSwapchainTypedID(uint32_t typedID) {
#if CC_USE_XR
    #if XR_OEM_HUAWEIVR
    _eglSurfaceTypeMap[typedID] = EGLSurfaceType::WINDOW;
    #else
    _eglSurfaceTypeMap[typedID] = EGLSurfaceType::PBUFFER;
    #endif
#else
    CC_UNUSED_PARAM(typedID);
#endif
}
// gfx

// vulkan
#ifdef CC_USE_VULKAN
uint32_t XRInterface::getXRVkApiVersion(uint32_t engineVkApiVersion) {
#if CC_USE_XR
    return xr::XrEntry::getInstance()->getXrVkApiVersion(engineVkApiVersion);
#else
    return engineVkApiVersion;
#endif
}

void XRInterface::initializeVulkanData(const PFN_vkGetInstanceProcAddr &addr) {
    _vkGetInstanceProcAddr = addr;
}

VkInstance XRInterface::createXRVulkanInstance(const VkInstanceCreateInfo &instInfo) {
#if CC_USE_XR
    _vkInstance = xr::XrEntry::getInstance()->xrVkCreateInstance(instInfo, _vkGetInstanceProcAddr);
    _vkPhysicalDevice = xr::XrEntry::getInstance()->getXrVkGraphicsDevice(_vkInstance);
    return _vkInstance;
#else
    CC_UNUSED_PARAM(instInfo);
    return nullptr;
#endif
}

VkDevice XRInterface::createXRVulkanDevice(const VkDeviceCreateInfo *deviceInfo) {
#if CC_USE_XR
    VK_CHECK(xr::XrEntry::getInstance()->xrVkCreateDevice(deviceInfo, _vkGetInstanceProcAddr, _vkPhysicalDevice, &_vkDevice));
#else
    CC_UNUSED_PARAM(deviceInfo);
#endif
    return _vkDevice;
}

VkPhysicalDevice XRInterface::getXRVulkanGraphicsDevice() {
    return _vkPhysicalDevice;
}

void XRInterface::getXRSwapchainVkImages(std::vector<VkImage> &vkImages, uint32_t eye) {
#if CC_USE_XR
    xr::XrEntry::getInstance()->getSwapchainImages(vkImages, eye);
#else
    CC_UNUSED_PARAM(vkImages);
    CC_UNUSED_PARAM(ccSwapchainTypedID);
#endif
}
#endif
// vulkan

// gles
#ifdef CC_USE_GLES3
void XRInterface::initializeGLESData(PFNGLES3WLOADPROC gles3wLoadFuncProc, gfx::GLES3GPUContext *gpuContext) {
#if CC_USE_XR
    _gles3wLoadFuncProc = gles3wLoadFuncProc;
    _gles3GPUContext = gpuContext;
    void *eglDisplay = gpuContext->eglDisplay;
    void *eglConfig = gpuContext->eglConfig;
    void *eglDefaultContext = gpuContext->eglDefaultContext;
    CC_LOG_INFO("[XR] initializeGLESData.egl.%p/%p/%p", eglDisplay, eglConfig, eglDefaultContext);
#else
    CC_UNUSED_PARAM(gles3wLoadFuncProc);
    CC_UNUSED_PARAM(gpuContext);
#endif
}

void XRInterface::attachGLESFramebufferTexture2D() {
#if CC_USE_XR
    xr::XrEntry::getInstance()->attachXrFramebufferTexture2D();
#endif
}

EGLSurfaceType XRInterface::acquireEGLSurfaceType(uint32_t typedID) {
#if CC_USE_XR
    if (_eglSurfaceTypeMap.count(typedID) > 0) {
        return _eglSurfaceTypeMap[typedID];
    }
#else
    CC_UNUSED_PARAM(typedID);
#endif
    return EGLSurfaceType::WINDOW;
}
#endif
// gles

// stereo render loop
bool XRInterface::platformLoopStart() {
#if CC_USE_XR
    // CC_LOG_INFO("[XR] platformLoopStart");
    return xr::XrEntry::getInstance()->platformLoopStart();
#else
    return false;
#endif
}

bool XRInterface::beginRenderFrame() {
#if CC_USE_XR
    if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] beginRenderFrame.%d", _committedFrame);
    if (gfx::DeviceAgent::getInstance()) {
        static uint64_t frameId = 0;
        frameId++;
        if (_committedFrame) {
            gfx::DeviceAgent::getInstance()->presentWait();
            _committedFrame = false;
        }
        if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] beginRenderFrame waitFrame.%lld", frameId);
        xr::XrEntry::getInstance()->waitFrame();
        ENQUEUE_MESSAGE_1(gfx::DeviceAgent::getInstance()->getMessageQueue(),
                          BeginRenderFrame, frameId, frameId,
                          {
                              if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] [RT] beginRenderFrame.%lld", frameId);
                              xr::XrEntry::getInstance()->frameStart();
                          });
        return true;
    } else {
        return xr::XrEntry::getInstance()->frameStart();
    }
#else
    return false;
#endif
}

bool XRInterface::isRenderAllowable() {
#if CC_USE_XR
    return xr::XrEntry::getInstance()->isRenderAllowable();
#else
    return false;
#endif
}

bool XRInterface::beginRenderEyeFrame(uint32_t eye) {
#if CC_USE_XR
    if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] beginRenderEyeFrame %d", eye);
    if (gfx::DeviceAgent::getInstance()) {
        ENQUEUE_MESSAGE_1(gfx::DeviceAgent::getInstance()->getMessageQueue(),
                          BeginRenderEyeFrame, eye, eye,
                          {
                              if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] [RT] beginRenderEyeFrame %d", eye);
                              xr::XrEntry::getInstance()->renderLoopStart(eye);
                          });
    } else {
        xr::XrEntry::getInstance()->renderLoopStart(eye);
    }
#else
    CC_UNUSED_PARAM(eye);
#endif
    return true;
}

bool XRInterface::endRenderEyeFrame(uint32_t eye) {
#if CC_USE_XR
    if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] endRenderEyeFrame %d", eye);
    if (gfx::DeviceAgent::getInstance()) {
        ENQUEUE_MESSAGE_1(gfx::DeviceAgent::getInstance()->getMessageQueue(),
                          EndRenderEyeFrame, eye, eye,
                          {
                              if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] [RT] endRenderEyeFrame %d", eye);
                              xr::XrEntry::getInstance()->renderLoopEnd(eye);
                          });
    } else {
        xr::XrEntry::getInstance()->renderLoopEnd(eye);
    }
#else
    CC_UNUSED_PARAM(eye);
#endif
    return true;
}

bool XRInterface::endRenderFrame() {
#if CC_USE_XR
    if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] endRenderFrame.%d",
                                      cc::ApplicationManager::getInstance()->getCurrentAppSafe()->getEngine()->getTotalFrames());

    if (gfx::DeviceAgent::getInstance()) {
        ENQUEUE_MESSAGE_0(gfx::DeviceAgent::getInstance()->getMessageQueue(),
                          EndRenderFrame,
                          {
                              xr::XrEntry::getInstance()->frameEnd();
                              gfx::DeviceAgent::getInstance()->presentSignal();
                              if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] [RT] presentSignal endRenderFrame.%d",
                                                                cc::ApplicationManager::getInstance()->getCurrentAppSafe()->getEngine()->getTotalFrames());
                          });
        _committedFrame = true;
        // CC_LOG_INFO("[XR] endRenderFrame pass presentWait errno %d", errno);
    } else {
        xr::XrEntry::getInstance()->frameEnd();
    }
#endif
    return true;
}

bool XRInterface::platformLoopEnd() {
#if CC_USE_XR
    return xr::XrEntry::getInstance()->platformLoopEnd();
#else
    return false;
#endif
}
// stereo render loop

ccstd::vector<float> XRInterface::getHMDViewPosition(uint32_t eye, int trackingType) {
#if CC_USE_XR
    return xr::XrEntry::getInstance()->getHMDViewPosition(eye, trackingType);
#else
    CC_UNUSED_PARAM(eye);
    CC_UNUSED_PARAM(trackingType);
    ccstd::vector<float> res;
    res.reserve(3);
    return res;
#endif
}

ccstd::vector<float> XRInterface::getXRViewProjectionData(uint32_t eye, float near, float far) {
#if CC_USE_XR
    return xr::XrEntry::getInstance()->computeViewProjection(eye, near, far, 1.0F);
#else
    CC_UNUSED_PARAM(eye);
    CC_UNUSED_PARAM(near);
    CC_UNUSED_PARAM(far);
    ccstd::vector<float> res;
    res.reserve(16);
    return res;
#endif
}

// renderwindow
xr::XREye XRInterface::getXREyeByRenderWindow(void *window) {
    if (!window) {
        return xr::XREye::NONE;
    }
    if (_xrWindowMap.count(window) > 0) {
        return _xrWindowMap[window];
    }
    return xr::XREye::NONE;
}

void XRInterface::bindXREyeWithRenderWindow(void *window, xr::XREye eye) {
    if (_xrWindowMap.count(window) > 0) {
        _xrWindowMap[window] = eye;
    } else {
        _xrWindowMap.emplace(std::make_pair(window, eye));
    }
}
} // namespace cc
