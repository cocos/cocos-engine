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

#include "XRInterface.h"
#include <fcntl.h>
#include <unistd.h>
#include <functional>
#include <unordered_map>
#include "android/AndroidPlatform.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "base/StringUtil.h"
#include "bindings/event/EventDispatcher.h"
#include "cocos-version.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "core/scene-graph/Node.h"
#include "java/jni/JniHelper.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"
#include "renderer/GFXDeviceManager.h"
#include "scene/Camera.h"
#include "scene/RenderWindow.h"
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
#include "platform/Image.h"

// print log
const bool IS_ENABLE_XR_LOG = false;

namespace cc {
const static ccstd::unordered_map<xr::XRClick::Type, StickKeyCode> CLICK_TYPE_TO_KEY_CODE = {
    {xr::XRClick::Type::MENU, StickKeyCode::MENU},
    {xr::XRClick::Type::TRIGGER_LEFT, StickKeyCode::TRIGGER_LEFT},
    {xr::XRClick::Type::SHOULDER_LEFT, StickKeyCode::L1},
    {xr::XRClick::Type::THUMBSTICK_LEFT, StickKeyCode::L3},
    {xr::XRClick::Type::X, StickKeyCode::Y},
    {xr::XRClick::Type::Y, StickKeyCode::X},
    {xr::XRClick::Type::TRIGGER_RIGHT, StickKeyCode::TRIGGER_RIGHT},
    {xr::XRClick::Type::SHOULDER_RIGHT, StickKeyCode::R1},
    {xr::XRClick::Type::THUMBSTICK_RIGHT, StickKeyCode::R3},
    {xr::XRClick::Type::A, StickKeyCode::B},
    {xr::XRClick::Type::B, StickKeyCode::A},
    {xr::XRClick::Type::HOME, StickKeyCode::UNDEFINE},
    {xr::XRClick::Type::START, StickKeyCode::START},
    {xr::XRClick::Type::DPAD_DOWN, StickKeyCode::Y},
    {xr::XRClick::Type::DPAD_UP, StickKeyCode::Y},
    {xr::XRClick::Type::DPAD_LEFT, StickKeyCode::X},
    {xr::XRClick::Type::DPAD_RIGHT, StickKeyCode::X}};

const static ccstd::unordered_map<xr::XRGrab::Type, StickAxisCode> GRAB_TYPE_TO_AXIS_CODE = {
    {xr::XRGrab::Type::TRIGGER_LEFT, StickAxisCode::L2},
    {xr::XRGrab::Type::TRIGGER_RIGHT, StickAxisCode::R2},
    {xr::XRGrab::Type::GRIP_LEFT, StickAxisCode::LEFT_GRIP},
    {xr::XRGrab::Type::GRIP_RIGHT, StickAxisCode::RIGHT_GRIP},
};

const static ccstd::unordered_map<xr::XRTouch::Type, StickTouchCode> TOUCH_TYPE_TO_AXIS_CODE = {
    {xr::XRTouch::Type::TOUCH_A, StickTouchCode::A},
    {xr::XRTouch::Type::TOUCH_B, StickTouchCode::B},
    {xr::XRTouch::Type::TOUCH_X, StickTouchCode::X},
    {xr::XRTouch::Type::TOUCH_Y, StickTouchCode::Y},
    {xr::XRTouch::Type::TOUCH_TRIGGER_LEFT, StickTouchCode::LEFT_TRIGGER},
    {xr::XRTouch::Type::TOUCH_TRIGGER_RIGHT, StickTouchCode::RIGHT_TRIGGER},
    {xr::XRTouch::Type::TOUCH_THUMBSTICK_LEFT, StickTouchCode::LEFT_THUMBSTICK},
    {xr::XRTouch::Type::TOUCH_THUMBSTICK_RIGHT, StickTouchCode::RIGHT_THUMBSTICK},
};

void XRInterface::dispatchGamepadEventInternal(const xr::XRControllerEvent &xrControllerEvent) {
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
                if(CLICK_TYPE_TO_KEY_CODE.count(xrClick->type) > 0) {
                    StickKeyCode stickKeyCode = CLICK_TYPE_TO_KEY_CODE.at(xrClick->type);

                    switch (xrClick->type) {
                        case xr::XRClick::Type::MENU:
                        case xr::XRClick::Type::TRIGGER_LEFT:
                        case xr::XRClick::Type::SHOULDER_LEFT:
                        case xr::XRClick::Type::THUMBSTICK_LEFT:
                        case xr::XRClick::Type::X:
                        case xr::XRClick::Type::Y:
                        case xr::XRClick::Type::TRIGGER_RIGHT:
                        case xr::XRClick::Type::SHOULDER_RIGHT:
                        case xr::XRClick::Type::THUMBSTICK_RIGHT:
                        case xr::XRClick::Type::A:
                        case xr::XRClick::Type::B:
                        case xr::XRClick::Type::START: {
                            controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(stickKeyCode, xrClick->isPress));
                            break;
                        }
                        case xr::XRClick::Type::HOME: {
                            CC_LOG_INFO("[XRInterface] dispatchGamepadEventInternal exit when home click in rokid.");
#if CC_USE_XR
                            xr::XrEntry::getInstance()->destroyXrInstance();
                            xr::XrEntry::destroyInstance();
                            _isXrEntryInstanceValid = false;
#endif
                            CC_CURRENT_APPLICATION_SAFE()->close();
                            break;
                        }
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
                if(GRAB_TYPE_TO_AXIS_CODE.count(xrGrab->type) > 0) {
                    StickAxisCode stickAxisCode = GRAB_TYPE_TO_AXIS_CODE.at(xrGrab->type);
                    switch (xrGrab->type) {
                        case xr::XRGrab::Type::TRIGGER_LEFT:
                        case xr::XRGrab::Type::TRIGGER_RIGHT: {
                            controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(stickAxisCode, xrGrab->value));
                            break;
                        }
                        default:
                            break;
                    }
                }
            } break;
            default:
                break;
        }
    }

    controllerInfo->napdId = 0; // xr only one gamepad connection
    _controllerEvent.controllerInfos.emplace_back(controllerInfo);
    _controllerEvent.type = ControllerEvent::Type::GAMEPAD;
#if CC_USE_XR_REMOTE_PREVIEW
    if (_xrRemotePreviewManager) {
        if (!controllerInfo->buttonInfos.empty()) {
            for (const auto &btnInfo : controllerInfo->buttonInfos) {
                _xrRemotePreviewManager->sendControllerKeyInfo(btnInfo);
            }
        }

        if (!controllerInfo->axisInfos.empty()) {
            for (const auto &axisInfo : controllerInfo->axisInfos) {
                _xrRemotePreviewManager->sendControllerKeyInfo(axisInfo);
            }
        }
    }
#endif
    events::Controller::broadcast(_controllerEvent);
    _controllerEvent.type = ControllerEvent::Type::UNKNOWN;
    _controllerEvent.controllerInfos.clear();
}

void XRInterface::dispatchHandleEventInternal(const xr::XRControllerEvent &xrControllerEvent) {
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
                if(CLICK_TYPE_TO_KEY_CODE.count(xrClick->type) > 0) {
                    StickKeyCode stickKeyCode = CLICK_TYPE_TO_KEY_CODE.at(xrClick->type);
                    switch (xrClick->type) {
                        case xr::XRClick::Type::MENU: {
#if !XR_OEM_SEED
                            controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(StickKeyCode::MENU, xrClick->isPress));
#else
                            CC_LOG_INFO("[XRInterface] exit when menu click in seed.");
                        CC_CURRENT_APPLICATION_SAFE()->close();
#endif
                            break;
                        }
                        case xr::XRClick::Type::TRIGGER_LEFT:
                        case xr::XRClick::Type::THUMBSTICK_LEFT:
                        case xr::XRClick::Type::X:
                        case xr::XRClick::Type::Y:
                        case xr::XRClick::Type::TRIGGER_RIGHT:
                        case xr::XRClick::Type::THUMBSTICK_RIGHT:
                        case xr::XRClick::Type::A:
                        case xr::XRClick::Type::B:
                        case xr::XRClick::Type::START: {
                            controllerInfo->buttonInfos.emplace_back(ControllerInfo::ButtonInfo(stickKeyCode, xrClick->isPress));
                            break;
                        }
                        case xr::XRClick::Type::HOME: {
                            CC_LOG_INFO("[XRInterface] dispatchHandleEventInternal exit when home click in rokid.");
#if CC_USE_XR
                            xr::XrEntry::getInstance()->destroyXrInstance();
                            xr::XrEntry::destroyInstance();
                            _isXrEntryInstanceValid = false;
#endif
                            CC_CURRENT_APPLICATION_SAFE()->close();
                            break;
                        }
                        default:
                            break;
                    }
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
                if(GRAB_TYPE_TO_AXIS_CODE.count(xrGrab->type) > 0) {
                    StickAxisCode stickAxisCode = GRAB_TYPE_TO_AXIS_CODE.at(xrGrab->type);
                    controllerInfo->axisInfos.emplace_back(ControllerInfo::AxisInfo(stickAxisCode, xrGrab->value));
                }
            } break;
            case xr::XREventType::TOUCH: {
                auto *xrTouch = static_cast<xr::XRTouch *>(xrControllerEvent.xrControllerInfos.at(i).get());
                if(TOUCH_TYPE_TO_AXIS_CODE.count(xrTouch->type) > 0) {
                    StickTouchCode stickTouchCode = TOUCH_TYPE_TO_AXIS_CODE.at(xrTouch->type);
                    controllerInfo->touchInfos.emplace_back(ControllerInfo::TouchInfo(stickTouchCode, xrTouch->value));
                }
                break;
            }
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
                        if (!_jsPoseEventArray) {
                            _jsPoseEventArray = se::Object::createArrayObject(0);
                            _jsPoseEventArray->root();
                        }
                        _jsPoseEventArray->setArrayElement(poseIndex, se::Value(jsPose));
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
        _jsPoseEventArray->setProperty("length", se::Value(poseIndex));
        se::ValueArray args;
        args.emplace_back(se::Value(_jsPoseEventArray));
        EventDispatcher::doDispatchJsEvent("onHandlePoseInput", args);
    }

    if (!controllerInfo->buttonInfos.empty() || !controllerInfo->axisInfos.empty() || !controllerInfo->touchInfos.empty()) {
        controllerInfo->napdId = 0; // xr only one handle connection
        _controllerEvent.controllerInfos.emplace_back(controllerInfo);
        _controllerEvent.type = ControllerEvent::Type::HANDLE;
#if CC_USE_XR_REMOTE_PREVIEW
        if (_xrRemotePreviewManager) {
            if (!controllerInfo->buttonInfos.empty()) {
                for (const auto &btnInfo : controllerInfo->buttonInfos) {
                    _xrRemotePreviewManager->sendControllerKeyInfo(btnInfo);
                }
            }

            if (!controllerInfo->axisInfos.empty()) {
                for (const auto &axisInfo : controllerInfo->axisInfos) {
                    _xrRemotePreviewManager->sendControllerKeyInfo(axisInfo);
                }
            }

            if (!controllerInfo->touchInfos.empty()) {
                for (const auto &touchInfo : controllerInfo->touchInfos) {
                    _xrRemotePreviewManager->sendControllerKeyInfo(touchInfo);
                }
            }
        }
#endif
        events::Controller::broadcast(_controllerEvent);
        _controllerEvent.type = ControllerEvent::Type::UNKNOWN;
        _controllerEvent.controllerInfos.clear();
    } else {
        CC_SAFE_DELETE(controllerInfo)
    }
}

void XRInterface::dispatchHMDEventInternal(const xr::XRControllerEvent &xrControllerEvent) {
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
                    if (!_jsPoseEventArray) {
                        _jsPoseEventArray = se::Object::createArrayObject(0);
                        _jsPoseEventArray->root();
                    }
                    _jsPoseEventArray->setArrayElement(poseIndex, se::Value(jsPose));
                    poseIndex++;
                } break;
                default:
                    break;
            }
        }
    }

    if (poseIndex > 0) {
        _jsPoseEventArray->setProperty("length", se::Value(poseIndex));
        se::ValueArray args;
        args.emplace_back(se::Value(_jsPoseEventArray));
        EventDispatcher::doDispatchJsEvent("onHMDPoseInput", args);
    }
}

xr::XRVendor XRInterface::getVendor() {
#if CC_USE_XR
    return static_cast<xr::XRVendor>(xr::XrEntry::getInstance()->getXRConfig(cc::xr::XRConfigKey::DEVICE_VENDOR).getInt());
#else
    return xr::XRVendor::MONADO;
#endif
}

xr::XRConfigValue XRInterface::getXRConfig(xr::XRConfigKey key) {
#if CC_USE_XR
    return xr::XrEntry::getInstance()->getXRConfig(key);
#else
    CC_UNUSED_PARAM(key);
    cc::xr::XRConfigValue configValue;
    return configValue;
#endif
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
#else
    return 1;
#endif
}

void XRInterface::initialize(void *javaVM, void *activity) {
#if CC_USE_XR
    CC_LOG_INFO("[XR] initialize vm.%p,aty.%p | %d", javaVM, activity, (int)gettid());
    _isXrEntryInstanceValid = true;
    xr::XrEntry::getInstance()->initPlatformData(javaVM, activity);
    xr::XrEntry::getInstance()->setGamepadCallback(std::bind(&XRInterface::dispatchGamepadEventInternal, this, std::placeholders::_1));
    xr::XrEntry::getInstance()->setHandleCallback(std::bind(&XRInterface::dispatchHandleEventInternal, this, std::placeholders::_1));
    xr::XrEntry::getInstance()->setHMDCallback(std::bind(&XRInterface::dispatchHMDEventInternal, this, std::placeholders::_1));
    xr::XrEntry::getInstance()->setXRConfig(xr::XRConfigKey::LOGIC_THREAD_ID, static_cast<int>(gettid()));
    xr::XrEntry::getInstance()->setXRConfig(xr::XRConfigKey::ENGINE_VERSION, COCOS_VERSION);
    xr::XrEntry::getInstance()->setXRConfigCallback([this](xr::XRConfigKey key, xr::XRConfigValue value) {
        if (IS_ENABLE_XR_LOG) CC_LOG_INFO("XRConfigCallback.%d", key);
        if (key == xr::XRConfigKey::RENDER_EYE_FRAME_LEFT || key == xr::XRConfigKey::RENDER_EYE_FRAME_RIGHT) {
            if (value.getInt() == 0) {
                this->beginRenderEyeFrame(key == xr::XRConfigKey::RENDER_EYE_FRAME_LEFT ? 0 : 1);
            }

            if (value.getInt() == 1) {
                this->endRenderEyeFrame(key == xr::XRConfigKey::RENDER_EYE_FRAME_LEFT ? 0 : 1);
            }
        } else if (key == xr::XRConfigKey::IMAGE_TRACKING_CANDIDATEIMAGE && value.isString()) {
            if (!_gThreadPool) {
                _gThreadPool = LegacyThreadPool::newSingleThreadPool();
            }

            std::string imageInfo = value.getString();
            _gThreadPool->pushTask([imageInfo, this](int /*tid*/) {
                this->loadImageTrackingData(imageInfo);
            });
        } else if (key == xr::XRConfigKey::ASYNC_LOAD_ASSETS_IMAGE && value.isString()) {
            std::string imagePath = value.getString();
            if (imagePath.length() == 0) {
                return;
            }

            if (!_gThreadPool) {
                _gThreadPool = LegacyThreadPool::newSingleThreadPool();
            }
            _gThreadPool->pushTask([imagePath, this](int /*tid*/) {
                this->asyncLoadAssetsImage(imagePath);
            });
        } else if (key == xr::XRConfigKey::ASYNC_LOAD_ASSETS_IMAGE && value.isInt()) {
            _isFlipPixelY = value.getInt() == static_cast<int>(gfx::API::GLES3);
        } else if (key == xr::XRConfigKey::TS_EVENT_CALLBACK) {
            se::AutoHandleScope scope;
            se::ValueArray args;
            args.emplace_back(se::Value(value.getString()));
            EventDispatcher::doDispatchJsEvent("onXREvent", args);
        }
    });
    #if XR_OEM_PICO
    std::string graphicsApiName = GraphicsApiOpenglES;
        #if CC_USE_VULKAN
    graphicsApiName = GraphicsApiVulkan_1_1;
        #endif
    xr::XrEntry::getInstance()->createXrInstance(graphicsApiName.c_str());
    #endif

    #if CC_USE_XR_REMOTE_PREVIEW
    _xrRemotePreviewManager = new XRRemotePreviewManager();
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
    #if CC_USE_XR_REMOTE_PREVIEW
        if (_xrRemotePreviewManager) {
            _xrRemotePreviewManager->pause();
        }
    #endif
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
    #if CC_USE_XR_REMOTE_PREVIEW
        if (_xrRemotePreviewManager) {
            _xrRemotePreviewManager->resume();
        }
    #endif
    }
#endif
}

void XRInterface::onRenderDestroy() {
#if CC_USE_XR
    CC_LOG_INFO("[XR] onRenderDestroy");
    xr::XrEntry::getInstance()->destroyXrInstance();
    xr::XrEntry::destroyInstance();
    _isXrEntryInstanceValid = false;
    if (_jsPoseEventArray != nullptr) {
        _jsPoseEventArray->unroot();
        _jsPoseEventArray->decRef();
        _jsPoseEventArray = nullptr;
    }
    #if CC_USE_XR_REMOTE_PREVIEW
    if (_xrRemotePreviewManager) {
        _xrRemotePreviewManager->stop();
    }
    #endif
#endif
}
// render thread lifecycle

// gfx
void XRInterface::preGFXDeviceInitialize(gfx::API gfxApi) {
#if CC_USE_XR
    CC_LOG_INFO("[XR] preGFXDeviceInitialize.api.%d | Multi Thread.%d", gfxApi, gfx::DeviceAgent::getInstance() ? 1 : 0);
    setXRConfig(xr::XRConfigKey::MULTITHREAD_MODE, gfx::DeviceAgent::getInstance() != nullptr);
    xr::XrEntry::getInstance()->setXRConfig(xr::XRConfigKey::RENDER_THREAD_ID, static_cast<int>(gettid()));

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
        return xr::XrEntry::getInstance()->acquireXrSwapchain(static_cast<uint32_t>(gfxApi));
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
#else
    return true;
#endif
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
                          })
    } else {
        xr::XrEntry::getInstance()->initXrSwapchains();
    }
#endif
}

const std::vector<cc::xr::XRSwapchain> &XRInterface::getXRSwapchains() {
#if CC_USE_XR
    CC_LOG_INFO("[XR] getXRSwapchains");
    if (_xrSwapchains.empty()) {
        _xrSwapchains = xr::XrEntry::getInstance()->getCocosXrSwapchains();
    }
#endif
    return _xrSwapchains;
}

gfx::Format XRInterface::getXRSwapchainFormat() {
#if CC_USE_XR
    int swapchainFormat = xr::XrEntry::getInstance()->getXRConfig(xr::XRConfigKey::SWAPCHAIN_FORMAT).getInt();
    #if CC_USE_GLES3
    if (swapchainFormat == GL_SRGB_ALPHA_EXT) {
        return gfx::Format::SRGB8_A8;
    }

    if (swapchainFormat == GL_RGBA8) {
        return gfx::Format::RGBA8;
    }

    if (swapchainFormat == GL_BGRA8_EXT) {
        return gfx::Format::BGRA8;
    }
    #endif

    #if CC_USE_VULKAN
    if (swapchainFormat == VK_FORMAT_R8G8B8A8_SRGB) {
        return gfx::Format::SRGB8_A8;
    }

    if (swapchainFormat == VK_FORMAT_R8G8B8A8_UNORM) {
        return gfx::Format::RGBA8;
    }

    if (swapchainFormat == VK_FORMAT_B8G8R8A8_UNORM) {
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
    CC_UNUSED_PARAM(eye);
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
    if (!_isXrEntryInstanceValid) {
        return false;
    }
    #if CC_USE_XR_REMOTE_PREVIEW
    if (_xrRemotePreviewManager && !_xrRemotePreviewManager->isStarted()) {
        _xrRemotePreviewManager->start();
    }
    #endif
    return xr::XrEntry::getInstance()->platformLoopStart();
#else
    return false;
#endif
}

bool XRInterface::beginRenderFrame() {
#if CC_USE_XR
    if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] beginRenderFrame.%d", _committedFrame);
    _isEnabledEyeRenderJsCallback = xr::XrEntry::getInstance()->getXRConfig(xr::XRConfigKey::EYE_RENDER_JS_CALLBACK).getBool();
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
                          })
    #if CC_USE_XR_REMOTE_PREVIEW
        if (_xrRemotePreviewManager) {
            _xrRemotePreviewManager->tick();
        }
    #endif
        return true;
    }

    #if CC_USE_XR_REMOTE_PREVIEW
    if (_xrRemotePreviewManager) {
        _xrRemotePreviewManager->tick();
    }
    #endif
    return xr::XrEntry::getInstance()->frameStart();
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
    if (_isEnabledEyeRenderJsCallback) {
        se::AutoHandleScope scope;
        se::ValueArray args;
        args.emplace_back(se::Value(eye));
        EventDispatcher::doDispatchJsEvent("onXREyeRenderBegin", args);
    }
    if (gfx::DeviceAgent::getInstance()) {
        ENQUEUE_MESSAGE_1(gfx::DeviceAgent::getInstance()->getMessageQueue(),
                          BeginRenderEyeFrame, eye, eye,
                          {
                              if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] [RT] beginRenderEyeFrame %d", eye);
                              xr::XrEntry::getInstance()->renderLoopStart(eye);
                          })
    } else {
        xr::XrEntry::getInstance()->renderLoopStart(static_cast<int>(eye));
    }
#else
    CC_UNUSED_PARAM(eye);
#endif
    return true;
}

bool XRInterface::endRenderEyeFrame(uint32_t eye) {
#if CC_USE_XR
    if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] endRenderEyeFrame %d", eye);
    if (_isEnabledEyeRenderJsCallback) {
        se::AutoHandleScope scope;
        se::ValueArray args;
        args.emplace_back(se::Value(eye));
        EventDispatcher::doDispatchJsEvent("onXREyeRenderEnd", args);
    }
    if (gfx::DeviceAgent::getInstance()) {
        ENQUEUE_MESSAGE_1(gfx::DeviceAgent::getInstance()->getMessageQueue(),
                          EndRenderEyeFrame, eye, eye,
                          {
                              if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] [RT] endRenderEyeFrame %d", eye);
                              xr::XrEntry::getInstance()->renderLoopEnd(eye);
                          })
    } else {
        xr::XrEntry::getInstance()->renderLoopEnd(static_cast<int>(eye));
    }
#else
    CC_UNUSED_PARAM(eye);
#endif
    return true;
}

bool XRInterface::endRenderFrame() {
#if CC_USE_XR
    if (IS_ENABLE_XR_LOG) {
        CC_LOG_INFO("[XR] endRenderFrame.%d",
                    cc::ApplicationManager::getInstance()->getCurrentAppSafe()->getEngine()->getTotalFrames());
    }

    if (gfx::DeviceAgent::getInstance()) {
        ENQUEUE_MESSAGE_0(gfx::DeviceAgent::getInstance()->getMessageQueue(),
                          EndRenderFrame,
                          {
                              xr::XrEntry::getInstance()->frameEnd();
                              gfx::DeviceAgent::getInstance()->presentSignal();
                              if (IS_ENABLE_XR_LOG) CC_LOG_INFO("[XR] [RT] presentSignal endRenderFrame.%d",
                                                                cc::ApplicationManager::getInstance()->getCurrentAppSafe()->getEngine()->getTotalFrames());
                          })
        _committedFrame = true;
        // CC_LOG_INFO("[XR] endRenderFrame pass presentWait errno %d", errno);
    } else {
        xr::XrEntry::getInstance()->frameEnd();
    #if CC_USE_XR_REMOTE_PREVIEW
        if (_xrRemotePreviewManager) {
            _xrRemotePreviewManager->tick();
        }
    #endif
    }
#endif
    return true;
}

bool XRInterface::platformLoopEnd() {
#if CC_USE_XR
    if (!_isXrEntryInstanceValid) {
        return false;
    }
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

ccstd::vector<float> XRInterface::getXREyeFov(uint32_t eye) {
#if CC_USE_XR
    return xr::XrEntry::getInstance()->getEyeFov(eye);
#else
    CC_UNUSED_PARAM(eye);
    ccstd::vector<float> res;
    res.reserve(4);
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

void XRInterface::loadImageTrackingData(const std::string &imageInfo) {
    // name|@assets/TrackingImage_SpacesTown.png|0.18|0.26
    ccstd::vector<ccstd::string> segments = StringUtil::split(imageInfo, "|");
    std::string imageName = segments.at(0);
    std::string imagePath = segments.at(1);
    auto physicalSizeX = static_cast<float>(atof(segments.at(2).c_str()));
    auto physicalSizeY = static_cast<float>(atof(segments.at(3).c_str()));
    auto *spaceTownImage = new Image();
    spaceTownImage->addRef();
    bool res = spaceTownImage->initWithImageFile(imagePath);
    if (!res) {
        CC_LOG_ERROR("[XRInterface] loadImageTrackingData init failed, %s!!!", imageInfo.c_str());
        return;
    }
    uint32_t imageWidth = spaceTownImage->getWidth();
    uint32_t imageHeight = spaceTownImage->getHeight();
    const uint32_t bufferSize = imageWidth * imageHeight * 3;
    auto *buffer = new uint8_t[bufferSize];
    for (unsigned int j = 0; j < imageHeight; ++j) {
        for (unsigned int i = 0; i < imageWidth; ++i) {
            const unsigned int pixel = i + j * imageWidth;
            const unsigned int pixelFlip = i + (imageHeight - j - 1) * imageWidth;

            const uint8_t *originalPixel = &spaceTownImage->getData()[static_cast<size_t>(pixel * 4)];
            uint8_t *convertedPixel = &buffer[static_cast<size_t>(pixelFlip * 3)];
            convertedPixel[0] = originalPixel[0];
            convertedPixel[1] = originalPixel[1];
            convertedPixel[2] = originalPixel[2];
        }
    }
    spaceTownImage->release();

    auto app = CC_CURRENT_APPLICATION();
    if (!app) {
        CC_LOG_ERROR("[XRInterface] loadImageTrackingData callback failed, application not exist!!!");
        return;
    }
    auto engine = app->getEngine();
    CC_ASSERT_NOT_NULL(engine);
    engine->getScheduler()->performFunctionInCocosThread([=]() {
        xr::XRTrackingImageData candidateImage;
        candidateImage.friendlyName = imageName;
        candidateImage.bufferSize = bufferSize;
        candidateImage.buffer = buffer;
        candidateImage.pixelSizeWidth = imageWidth;
        candidateImage.pixelSizeHeight = imageHeight;
        candidateImage.physicalWidth = physicalSizeX;
        candidateImage.physicalHeight = physicalSizeY;
        setXRConfig(xr::XRConfigKey::IMAGE_TRACKING_CANDIDATEIMAGE, static_cast<void *>(&candidateImage));
    });
}

void XRInterface::handleAppCommand(int appCmd) {
#if CC_USE_XR
    setXRConfig(xr::XRConfigKey::APP_COMMAND, appCmd);
#else
    CC_UNUSED_PARAM(appCmd);
#endif
}

void XRInterface::adaptOrthographicMatrix(cc::scene::Camera *camera, const ccstd::array<float, 4> &preTransform, Mat4 &proj, Mat4 &view) {
#if CC_USE_XR
    const float orthoHeight = camera->getOrthoHeight();
    const float near = camera->getNearClip();
    const float far = camera->getFarClip();
    const float aspect = camera->getAspect();
    auto *swapchain = camera->getWindow()->getSwapchain();
    const auto &orientation = swapchain ? swapchain->getSurfaceTransform() : gfx::SurfaceTransform::IDENTITY;
    cc::xr::XREye wndXREye = getXREyeByRenderWindow(camera->getWindow());
    const auto &xrFov = getXREyeFov(static_cast<uint32_t>(wndXREye));
    const float ipdValue = getXRConfig(xr::XRConfigKey::DEVICE_IPD).getFloat();
    const float projectionSignY = gfx::Device::getInstance()->getCapabilities().clipSpaceSignY;
    Mat4 orthoProj;
    auto *systemWindow = CC_GET_MAIN_SYSTEM_WINDOW();
    const float deviceAspect = systemWindow ? (systemWindow->getViewSize().width / systemWindow->getViewSize().height) : 1.777F;
    // device's fov may be asymmetry
    float radioLeft = 1.0F;
    float radioRight = 1.0F;
    if (wndXREye == xr::XREye::LEFT) {
        radioLeft = fabs(tanf(xrFov[0])) / fabs(tanf(xrFov[1]));
    } else if (wndXREye == xr::XREye::RIGHT) {
        radioRight = fabs(tanf(xrFov[1])) / fabs(tanf(xrFov[0]));
    }

    const float x = orthoHeight * deviceAspect;
    const float y = orthoHeight;
    Mat4::createOrthographicOffCenter(-x * radioLeft, x * radioRight, -y, y, near, far,
                                      gfx::Device::getInstance()->getCapabilities().clipSpaceMinZ, projectionSignY,
                                      static_cast<int>(orientation), &orthoProj);
    // keep scale to [-1, 1] only use offset
    orthoProj.m[0] = preTransform[0] / x;
    orthoProj.m[5] = preTransform[3] * projectionSignY / y;

    Mat4 eyeCameraProj;
    const auto &projFloat = getXRViewProjectionData(static_cast<uint32_t>(wndXREye), 0.001F, 1000.0F);
    std::memcpy(eyeCameraProj.m, projFloat.data(), sizeof(float) * 16);
    Vec4 point{ipdValue * 0.5F, 0.0F, -1.0F, 1.0F};
    eyeCameraProj.transformVector(&point);

    Mat4 objectTranslateMat;
    // point in [-1,1] convert to [-aspect,aspect]
    if (wndXREye == xr::XREye::LEFT) {
        objectTranslateMat.translate(point.x * orthoHeight * 0.5F * aspect, 0.0F, 0.0F);
    } else if (wndXREye == xr::XREye::RIGHT) {
        objectTranslateMat.translate(-point.x * orthoHeight * 0.5F * aspect, 0.0F, 0.0F);
    }
    // update view matrix
    view = camera->getNode()->getWorldMatrix().getInversed();
    Mat4 scaleMat{};
    scaleMat.scale(camera->getNode()->getWorldScale());
    // remove scale
    Mat4::multiply(scaleMat, view, &view);
    Mat4::multiply(objectTranslateMat, view, &view);

    // fit width, scale deviceAspect to aspect
    const float ndcXScale = getXRConfig(xr::XRConfigKey::SPLIT_AR_GLASSES).getBool() ? (1.0F + point.x * 0.5F) : 1.0F;
    const float ndcYScale = aspect / deviceAspect;
    Mat4 ndcScaleMat;
    ndcScaleMat.scale(ndcXScale, ndcYScale, 1.0F);

    proj = ndcScaleMat * orthoProj;
#else
    CC_UNUSED_PARAM(camera);
    CC_UNUSED_PARAM(preTransform);
    CC_UNUSED_PARAM(proj);
    CC_UNUSED_PARAM(view);
#endif
}

void XRInterface::asyncLoadAssetsImage(const std::string &imagePath) {
    auto *assetsImage = new Image();
    assetsImage->addRef();
    bool res = assetsImage->initWithImageFile(imagePath);
    if (!res) {
        CC_LOG_ERROR("[XRInterface] async load assets image init failed, %s!!!", imagePath.c_str());
        assetsImage->release();
        return;
    }
    uint32_t imageWidth = assetsImage->getWidth();
    uint32_t imageHeight = assetsImage->getHeight();
    uint32_t bufferSize = assetsImage->getDataLen();
    uint8_t *buffer = nullptr;
    if (assetsImage->getRenderFormat() == gfx::Format::RGB8) {
        // convert to rgba8
        bufferSize = imageWidth * imageHeight * 4;
        buffer = new uint8_t[bufferSize];
        for (uint32_t y = 0; y < imageHeight; y++) {
            for (uint32_t x = 0; x < imageWidth; x++) {
                const unsigned int pixel = x + y * imageWidth;
                const unsigned int pixelFlip = x + (imageHeight - y - 1) * imageWidth;
                const uint8_t *originalPixel = &assetsImage->getData()[static_cast<size_t>(pixel * 3)];
                uint8_t *convertedPixel = nullptr;
                if (_isFlipPixelY) {
                    convertedPixel = &buffer[static_cast<size_t>(pixelFlip * 4)];
                } else {
                    convertedPixel = &buffer[static_cast<size_t>(pixel * 4)];
                }
                convertedPixel[0] = originalPixel[0];
                convertedPixel[1] = originalPixel[1];
                convertedPixel[2] = originalPixel[2];
                convertedPixel[3] = 255.0F;
            }
        }
    } else {
        buffer = new uint8_t[bufferSize];
        if (_isFlipPixelY) {
            for (uint32_t y = 0; y < imageHeight; y++) {
                for (uint32_t x = 0; x < imageWidth; x++) {
                    const unsigned int pixel = x + y * imageWidth;
                    const unsigned int pixelFlip = x + (imageHeight - y - 1) * imageWidth;
                    const uint8_t *originalPixel = &assetsImage->getData()[static_cast<size_t>(pixel * 4)];
                    uint8_t *convertedPixel = &buffer[static_cast<size_t>(pixelFlip * 4)];
                    convertedPixel[0] = originalPixel[0];
                    convertedPixel[1] = originalPixel[1];
                    convertedPixel[2] = originalPixel[2];
                    convertedPixel[3] = originalPixel[3];
                }
            }
        } else {
            memcpy(buffer, assetsImage->getData(), bufferSize);
        }
    }
    auto app = CC_CURRENT_APPLICATION();
    if (!app) {
        CC_LOG_ERROR("[XRInterface] loadAssetsImage callback failed, application not exist!!!");
        return;
    }
    auto engine = app->getEngine();
    CC_ASSERT_NOT_NULL(engine);
    engine->getScheduler()->performFunctionInCocosThread([=]() {
        auto *imageData = new xr::XRTrackingImageData();
        imageData->friendlyName = imagePath;
        imageData->bufferSize = bufferSize;
        imageData->buffer = buffer;
        imageData->pixelSizeWidth = imageWidth;
        imageData->pixelSizeHeight = imageHeight;
        if (!this->getXRConfig(xr::XRConfigKey::ASYNC_LOAD_ASSETS_IMAGE_RESULTS).getPointer()) {
            auto *imagesMapPtr = new std::unordered_map<std::string, void *>();
            (*imagesMapPtr).emplace(std::make_pair(imagePath, static_cast<void *>(imageData)));
            this->setXRConfig(xr::XRConfigKey::ASYNC_LOAD_ASSETS_IMAGE_RESULTS, static_cast<void *>(imagesMapPtr));
        } else {
            auto *imagesMapPtr = static_cast<std::unordered_map<std::string,
                                                                void *> *>(getXRConfig(xr::XRConfigKey::ASYNC_LOAD_ASSETS_IMAGE_RESULTS).getPointer());
            (*imagesMapPtr).emplace(std::make_pair(imagePath, static_cast<void *>(imageData)));
        }
    });
    assetsImage->release();
}

#if CC_USE_XR

extern "C" JNIEXPORT void JNICALL Java_com_cocos_lib_xr_CocosXRApi_onAdbCmd(JNIEnv * /*env*/, jobject /*thiz*/, jstring key, jstring value) {
    auto cmdKey = cc::JniHelper::jstring2string(key);
    auto cmdValue = cc::JniHelper::jstring2string(value);
    if (IS_ENABLE_XR_LOG) {
        CC_LOG_INFO("CocosXRApi_onAdbCmd_%s_%s", cmdKey.c_str(), cmdValue.c_str());
    }
    cc::xr::XrEntry::getInstance()->setXRConfig(cc::xr::XRConfigKey::ADB_COMMAND, cmdKey.append(":").append(cmdValue));
}

extern "C" JNIEXPORT void JNICALL Java_com_cocos_lib_xr_CocosXRApi_onActivityLifecycleCallback(JNIEnv * /*env*/, jobject /*thiz*/, jint type, jstring activityClassName) {
    auto name = cc::JniHelper::jstring2string(activityClassName);
    if (IS_ENABLE_XR_LOG) {
        CC_LOG_INFO("CocosXRApi_onActivityLifecycleCallback_%d_%s", type, name.c_str());
    }
    cc::xr::XrEntry::getInstance()->setXRConfig(cc::xr::XRConfigKey::ACTIVITY_LIFECYCLE, type);
    cc::xr::XrEntry::getInstance()->setXRConfig(cc::xr::XRConfigKey::ACTIVITY_LIFECYCLE, name);
}

#endif
} // namespace cc
