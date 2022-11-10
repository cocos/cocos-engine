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

#pragma once
#include <cstdint>
#include <memory>
#include "base/RefCounted.h"
#include "XRCommon.h"

namespace cc {
class IXRInterface;
namespace network {
class WebSocketServer;
class WebSocketServerConnection;
}
using namespace network;

#if CC_USE_XR
enum class XRDataPackageType {
  DPT_MSG_DEVICE_INFO = 1,
  DPT_MSG_POSE_DATA,
  DPT_MSG_CONTROLLER_KEY,
  DPT_MSG_STRING
};

enum class XRKeyEventType {
    KET_CLICK,
    KET_STICK,
    KET_GRAB
};

#pragma pack(1)
struct XRCommonMessage {
  int16_t type;
  ccstd::string message;
};
#pragma pack ()

#pragma pack(1)
struct XRDeviceInfo {
  int16_t type;
  int16_t version;
  char deviceName[32];
  int16_t xrVendorType;
  float leftEyeFov[4]; //L-R-D-U
  float rightEyeFov[4];
};
#pragma pack ()

#pragma pack(1)
struct XRPoseInfo {
  int16_t type;
  float hmdOrientation[4];
  float hmdPosition[3];
  float leftControllerOrientation[4];
  float leftControllerPosition[3];
  float rightControllerOrientation[4];
  float rightControllerPosition[3];
};
#pragma pack ()

#pragma pack(1)
struct XRControllerKeyInfo {
    int16_t type;
    int16_t keyEventType;
    int16_t stickAxisCode{0};
    float stickAxisValue{0};
    int16_t stickKeyCode{0};
    bool isButtonPressed{false};
};
#pragma pack ()

class XRRemotePreviewManager : public RefCounted {
 public:
  XRRemotePreviewManager();
  ~XRRemotePreviewManager() override;
  void start();
  void sendDeviceInfo(const XRDeviceInfo &info);
  void sendPoseInfo(const XRPoseInfo &info);
  void sendControllerKeyInfo(const ControllerInfo::ButtonInfo &info);
  void sendControllerKeyInfo(const ControllerInfo::AxisInfo &info);
  void tick();
  void resume();
  void pause();
  void stop();
  bool isStarted() const;
 private:
  void sendMessage(const ccstd::string &message);
  static void packCommonMessageData(const XRCommonMessage &message, char *data);
  static void packDeviceInfoData(const XRDeviceInfo &info, char *data);
  static void packDevicePoseData(const XRPoseInfo &info, char *data);
  static void packControllerKeyData(const XRControllerKeyInfo &info, char *data);
#if CC_USE_WEBSOCKET_SERVER
  void onConnection(const std::shared_ptr<WebSocketServerConnection> &connection);
  void onClientConnected(const std::shared_ptr<WebSocketServerConnection> &connection);
  void onClientDisconnected(int closeCode, const ccstd::string &closeReason);
  std::shared_ptr<WebSocketServer> _webSocketServer{nullptr};
  ccstd::vector<std::shared_ptr<WebSocketServerConnection>> _wssConnections;
#endif
  bool _isStarted{false};
  bool _isConnectionChanged{false};
  IXRInterface *_xr{nullptr};
  cc::xr::XRPose _leftEyePose{cc::xr::XRPose::Type::VIEW_LEFT, true};
  cc::xr::XRPose _rightEyePose{cc::xr::XRPose::Type::VIEW_RIGHT, true};
  cc::xr::XRPose _leftControllerPose{cc::xr::XRPose::Type::HAND_LEFT, true};
  cc::xr::XRPose _rightControllerPose{cc::xr::XRPose::Type::HAND_RIGHT, true};
  XRPoseInfo _devicePoseInfo;
 private:
  CC_DISALLOW_COPY_MOVE_ASSIGN(XRRemotePreviewManager);
};
#endif

} // namespace cc
