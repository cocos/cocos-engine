/****************************************************************************
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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
#include "cocos/platform/openharmony/OpenHarmonyGamepad.h"
#include "cocos/base/Log.h"
#include "cocos/engine/EngineEvents.h"
#include "cocos/platform/openharmony/OpenHarmonyPlatform.h"
#include "cocos/platform/openharmony/WorkerMessageQueue.h"

#include "GameControllerKit/game_device.h"
#include "GameControllerKit/game_device_event.h"
#include "GameControllerKit/game_pad.h"

namespace cc {
static char gGameControllerIds{0};
static std::unordered_map<std::string, char> gControllers;
static constexpr char kMaxControllers = sizeof(gGameControllerIds) * 8;
#define CALL_OH_GAMEPAD(the_call)                                             \
    do {                                                                      \
        GameController_ErrorCode errorCode = (the_call);                      \
        if (errorCode != GameController_ErrorCode::GAME_CONTROLLER_SUCCESS) { \
            CC_LOG_ERROR("%s failed: %d", #the_call, errorCode);              \
        }                                                                     \
    } while (0);

enum ButtonCode {
    OH_LeftShoulder = 2307,
    OH_RightShoulder = 2308,
    OH_LeftTrigger = 2309,
    OH_RightTrigger = 2310,
    OH_LeftThumbstick = 2314,
    OH_RightThumbstick = 2315,
    OH_ButtonHome = 2311,
    OH_ButtonMenu = 2312,
    OH_ButtonA = 2301,
    OH_ButtonB = 2302,
    OH_ButtonC = 2303,
    OH_ButtonX = 2304,
    OH_ButtonY = 2305,
    OH_Dpad_UpButton = 2012,
    OH_Dpad_DownButton = 2013,
    OH_Dpad_LeftButton = 2014,
    OH_Dpad_RightButton = 2015,
};

StickKeyCode ohButtonCode2StickKeyCode(int32_t code) {
    switch (code) {
        case OH_LeftShoulder: return StickKeyCode::L1;
        case OH_RightShoulder: return StickKeyCode::R1;
        case OH_LeftThumbstick: return StickKeyCode::L3;
        case OH_RightThumbstick: return StickKeyCode::R3;

        case OH_ButtonA: return StickKeyCode::B;
        case OH_ButtonB: return StickKeyCode::A;
        case OH_ButtonX: return StickKeyCode::Y;
        case OH_ButtonY: return StickKeyCode::X;

        case OH_ButtonHome: return StickKeyCode::MINUS;
        case OH_ButtonMenu:
            return StickKeyCode::PLUS;
        // case OH_ButtonC: return StickAxisCode::HOME;
    }
    return StickKeyCode::UNDEFINE;
}

void SendAxisEvent(const char* deviceId, double result, StickAxisCode stickAxisCode) {
    auto it = gControllers.find(deviceId);
    if (it == gControllers.end()) {
        CC_LOG_ERROR("Controller not found");
        return;
    }
    cc::ControllerInfo info;
    info.napdId = it->second;
    info.axisInfos.emplace_back(stickAxisCode, result);

    ControllerEvent* ev = new ControllerEvent;
    ev->type = ControllerEvent::Type::GAMEPAD;
    ev->controllerInfos.emplace_back(std::make_unique<ControllerInfo>(std::move(info)));
    OpenHarmonyPlatform::sendMsgToWorker(cc::MessageType::WM_GAMEPAD_CONTROLLER_INPUT, reinterpret_cast<void*>(ev), nullptr);
}

void SendAxisEvent(const char* deviceId, double result_x, double result_y, StickAxisCode stickAxisCodeX, StickAxisCode stickAxisCodeY) {
    auto it = gControllers.find(deviceId);
    if (it == gControllers.end()) {
        CC_LOG_ERROR("Controller not found");
        return;
    }
    cc::ControllerInfo info;
    info.napdId = it->second;
    info.axisInfos.emplace_back(stickAxisCodeX, result_x);
    info.axisInfos.emplace_back(stickAxisCodeY, result_y);

    ControllerEvent* ev = new ControllerEvent;
    ev->type = ControllerEvent::Type::GAMEPAD;
    ev->controllerInfos.emplace_back(std::make_unique<ControllerInfo>(std::move(info)));
    OpenHarmonyPlatform::sendMsgToWorker(cc::MessageType::WM_GAMEPAD_CONTROLLER_INPUT, reinterpret_cast<void*>(ev), nullptr);
}

void OnLeftThumbstickAxisEventCallback(const struct GamePad_AxisEvent* axisEvent) {
    char* deviceId = nullptr;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetDeviceId(axisEvent, &deviceId));
    double result_x;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetXAxisValue(axisEvent, &result_x));
    double result_y;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetYAxisValue(axisEvent, &result_y));

    SendAxisEvent(deviceId, result_x, -result_y, StickAxisCode::LEFT_STICK_X, StickAxisCode::LEFT_STICK_Y);
    free(deviceId);
}

void OnRightThumbstickAxisEventCallback(const struct GamePad_AxisEvent* axisEvent) {
    char* deviceId = nullptr;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetDeviceId(axisEvent, &deviceId));
    double result_x;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetZAxisValue(axisEvent, &result_x));
    double result_y;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetRZAxisValue(axisEvent, &result_y));
    SendAxisEvent(deviceId, result_x, -result_y, StickAxisCode::RIGHT_STICK_X, StickAxisCode::RIGHT_STICK_Y);
    free(deviceId);
}

void OnDpadAxisEventCallback(const struct GamePad_AxisEvent* axisEvent) {
    char* deviceId = nullptr;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetDeviceId(axisEvent, &deviceId));
    double result_x;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetHatXAxisValue(axisEvent, &result_x));
    double result_y;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetHatYAxisValue(axisEvent, &result_y));
    SendAxisEvent(deviceId, result_x, -result_y, StickAxisCode::X, StickAxisCode::Y);
    free(deviceId);
}

void OnLeftTriggerAxisEventCallback(const struct GamePad_AxisEvent* axisEvent) {
    char* deviceId = nullptr;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetDeviceId(axisEvent, &deviceId));
    double result;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetBrakeAxisValue(axisEvent, &result));
    SendAxisEvent(deviceId, result, cc::StickAxisCode::L2);
    free(deviceId);
}

void OnRightTriggerAxisEventCallback(const struct GamePad_AxisEvent* axisEvent) {
    char* deviceId = nullptr;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetDeviceId(axisEvent, &deviceId));
    double result;
    CALL_OH_GAMEPAD(OH_GamePad_AxisEvent_GetGasAxisValue(axisEvent, &result));
    SendAxisEvent(deviceId, result, cc::StickAxisCode::R2);
    free(deviceId);
}

void OnDeviceChanged(const struct GameDevice_DeviceEvent* deviceEvent) {
    GameDevice_StatusChangedType status;
    CALL_OH_GAMEPAD(OH_GameDevice_DeviceEvent_GetChangedType(deviceEvent, &status));
    GameDevice_DeviceInfo* deviceInfo;
    CALL_OH_GAMEPAD(OH_GameDevice_DeviceEvent_GetDeviceInfo(deviceEvent, &deviceInfo));
    char* deviceId = nullptr;
    CALL_OH_GAMEPAD(OH_GameDevice_DeviceInfo_GetDeviceId(deviceInfo, &deviceId));
    char* name = nullptr;
    CALL_OH_GAMEPAD(OH_GameDevice_DeviceInfo_GetName(deviceInfo, &name));

    int product;
    CALL_OH_GAMEPAD(OH_GameDevice_DeviceInfo_GetProduct(deviceInfo, &product));
    int version;
    CALL_OH_GAMEPAD(OH_GameDevice_DeviceInfo_GetVersion(deviceInfo, &version));
    char* physicalAddress = nullptr;
    CALL_OH_GAMEPAD(OH_GameDevice_DeviceInfo_GetPhysicalAddress(deviceInfo, &physicalAddress));
    GameDevice_DeviceType type;
    CALL_OH_GAMEPAD(OH_GameDevice_DeviceInfo_GetDeviceType(deviceInfo, &type));

    // TODO: This is a hack because some system components in HarmonyOS also receive this message, making it impossible 
    // to distinguish between a game controller and system components. This could cause the game to misinterpret 
    // the presence of multiple controllers, leading to anomalies. Therefore, a filter condition has been added here.
    // Theoretically, the distinction should be made using the "type" field, but in the system, game controllers are also identified as "unknown".
    // product == 480 && version == 256 : hid-over-i2c 27C6:01E0 Touchpad
    // product == 5120 && version == 256 : uart_hid 14F3:1400 System Control
    if((product == 480 && version == 256) || (product == 5120 && version == 256)) {
        return;
    }
//    if(type != GameDevice_DeviceType::GAME_PAD) {
//        return;
//    }
    
    do {
        if (status == GameDevice_StatusChangedType::ONLINE) {
            int id = 0;
            do {
                if ((gGameControllerIds & (1 << id)) == 0) {
                    break;
                }
                id++;
            } while (id < kMaxControllers);
            if (id >= kMaxControllers) {
                CC_LOG_ERROR("The number of controllers should not exceed %d", kMaxControllers);
                break;
            }
            gGameControllerIds |= (1 << id);
            gControllers.insert(std::make_pair(std::string(deviceId), id));
        } else {
            auto it = gControllers.find(deviceId);
            if (it == gControllers.end()) {
                CC_LOG_ERROR("Controller not found: %s, %s", name, deviceId);
                break;
            }
            gGameControllerIds &= ~(1 << it->second);
            gControllers.erase(it);
        }
        ControllerChangeEvent* ev = new ControllerChangeEvent;
        // Send an online controllers.
        for (auto controller : gControllers) {
            ev->controllerIds.emplace_back(controller.second);
        }
        OpenHarmonyPlatform::sendMsgToWorker(cc::MessageType::WM_GAMEPAD_CONTROLLER_CHANGE, reinterpret_cast<void*>(ev), nullptr);
    } while (0);

    free(deviceId);
    free(physicalAddress);
    free(name);
    CALL_OH_GAMEPAD(OH_GameDevice_DestroyDeviceInfo(&deviceInfo));
}

void OnButtonEvent(const struct GamePad_ButtonEvent* buttonEvent) {
    char* deviceId;
    CALL_OH_GAMEPAD(OH_GamePad_ButtonEvent_GetDeviceId(buttonEvent, &deviceId));
    GamePad_Button_ActionType action;
    CALL_OH_GAMEPAD(OH_GamePad_ButtonEvent_GetButtonAction(buttonEvent, &action));
    std::int32_t buttonCode;
    CALL_OH_GAMEPAD(OH_GamePad_ButtonEvent_GetButtonCode(buttonEvent, &buttonCode));
    char* buttonCodeName;
    CALL_OH_GAMEPAD(OH_GamePad_ButtonEvent_GetButtonCodeName(buttonEvent, &buttonCodeName));
    std::int64_t actionTime;
    CALL_OH_GAMEPAD(OH_GamePad_ButtonEvent_GetActionTime(buttonEvent, &actionTime));
    std::int32_t count;
    CALL_OH_GAMEPAD(OH_GamePad_PressedButtons_GetCount(buttonEvent, &count));
    for (std::int32_t idx = 0; idx < count; idx++) {
        GamePad_PressedButton* pressedButton;
        CALL_OH_GAMEPAD(OH_GamePad_PressedButtons_GetButtonInfo(buttonEvent, idx, &pressedButton));
        int code;
        CALL_OH_GAMEPAD(OH_GamePad_PressedButton_GetButtonCode(pressedButton, &code));
        char* name;
        CALL_OH_GAMEPAD(OH_GamePad_PressedButton_GetButtonCodeName(pressedButton, &name));
        free(name);
    }
    auto it = gControllers.find(deviceId);
    if (it == gControllers.end()) {
        CC_LOG_ERROR("Controller not found");
        return;
    }

    bool isPressed = (action == GamePad_Button_ActionType::DOWN);
    cc::ControllerInfo info;
    cc::ControllerInfo::ButtonInfo buttonInfo{ohButtonCode2StickKeyCode(buttonCode), isPressed};
    info.buttonInfos.emplace_back(buttonInfo);
    info.napdId = it->second;
    ControllerEvent* ev = new ControllerEvent;
    ev->type = ControllerEvent::Type::GAMEPAD;
    ev->controllerInfos.emplace_back(std::make_unique<ControllerInfo>(std::move(info)));
    OpenHarmonyPlatform::sendMsgToWorker(cc::MessageType::WM_GAMEPAD_CONTROLLER_INPUT, reinterpret_cast<void*>(ev), nullptr);
}

OpenHarmonyGamePad::OpenHarmonyGamePad() {
    CALL_OH_GAMEPAD(OH_GameDevice_RegisterDeviceMonitor(OnDeviceChanged));

    CALL_OH_GAMEPAD(OH_GamePad_LeftShoulder_RegisterButtonInputMonitor(OnButtonEvent));
    CALL_OH_GAMEPAD(OH_GamePad_RightShoulder_RegisterButtonInputMonitor(OnButtonEvent));

    CALL_OH_GAMEPAD(OH_GamePad_ButtonMenu_RegisterButtonInputMonitor(OnButtonEvent));
    CALL_OH_GAMEPAD(OH_GamePad_ButtonHome_RegisterButtonInputMonitor(OnButtonEvent));
    CALL_OH_GAMEPAD(OH_GamePad_ButtonC_RegisterButtonInputMonitor(OnButtonEvent));

    CALL_OH_GAMEPAD(OH_GamePad_ButtonA_RegisterButtonInputMonitor(OnButtonEvent));
    CALL_OH_GAMEPAD(OH_GamePad_ButtonB_RegisterButtonInputMonitor(OnButtonEvent));
    CALL_OH_GAMEPAD(OH_GamePad_ButtonX_RegisterButtonInputMonitor(OnButtonEvent));
    CALL_OH_GAMEPAD(OH_GamePad_ButtonY_RegisterButtonInputMonitor(OnButtonEvent));

    CALL_OH_GAMEPAD(OH_GamePad_LeftThumbstick_RegisterButtonInputMonitor(OnButtonEvent));
    CALL_OH_GAMEPAD(OH_GamePad_RightThumbstick_RegisterButtonInputMonitor(OnButtonEvent));

    CALL_OH_GAMEPAD(OH_GamePad_LeftTrigger_RegisterAxisInputMonitor(OnLeftTriggerAxisEventCallback));
    CALL_OH_GAMEPAD(OH_GamePad_RightTrigger_RegisterAxisInputMonitor(OnRightTriggerAxisEventCallback));

    CALL_OH_GAMEPAD(OH_GamePad_Dpad_RegisterAxisInputMonitor(OnDpadAxisEventCallback));
    CALL_OH_GAMEPAD(OH_GamePad_LeftThumbstick_RegisterAxisInputMonitor(OnLeftThumbstickAxisEventCallback));
    CALL_OH_GAMEPAD(OH_GamePad_RightThumbstick_RegisterAxisInputMonitor(OnRightThumbstickAxisEventCallback));
}

OpenHarmonyGamePad::~OpenHarmonyGamePad() {
    CALL_OH_GAMEPAD(OH_GameDevice_UnregisterDeviceMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_LeftShoulder_UnregisterButtonInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_RightShoulder_UnregisterButtonInputMonitor());

    CALL_OH_GAMEPAD(OH_GamePad_ButtonMenu_UnregisterButtonInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_ButtonHome_UnregisterButtonInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_ButtonC_UnregisterButtonInputMonitor());

    CALL_OH_GAMEPAD(OH_GamePad_ButtonA_UnregisterButtonInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_ButtonB_UnregisterButtonInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_ButtonX_UnregisterButtonInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_ButtonY_UnregisterButtonInputMonitor());

    CALL_OH_GAMEPAD(OH_GamePad_LeftThumbstick_UnregisterButtonInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_RightThumbstick_UnregisterButtonInputMonitor());

    CALL_OH_GAMEPAD(OH_GamePad_LeftTrigger_UnregisterAxisInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_RightTrigger_UnregisterAxisInputMonitor());

    CALL_OH_GAMEPAD(OH_GamePad_Dpad_UnregisterAxisInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_LeftThumbstick_UnregisterAxisInputMonitor());
    CALL_OH_GAMEPAD(OH_GamePad_RightThumbstick_UnregisterAxisInputMonitor());
}
} // namespace cc