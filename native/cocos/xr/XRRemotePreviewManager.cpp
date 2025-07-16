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

#include "application/ApplicationManager.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "base/std/container/list.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "math/Quaternion.h"
#include "platform/interfaces/modules/IXRInterface.h"

#if CC_USE_XR
    #include "Xr.h"
    #if ANDROID
        #include <sys/system_properties.h>
    #endif
    #include "XRRemotePreviewManager.h"
    #if CC_USE_WEBSOCKET_SERVER
        #include "network/WebSocketServer.h"
    #endif

namespace cc {
    #define SOCKET_PORT 8989
// 11259375
const int32_t PACKET_HEAD_CODE = 0x000ABCDEF;

XRRemotePreviewManager::XRRemotePreviewManager() {
}

XRRemotePreviewManager::~XRRemotePreviewManager() {
}

    #if CC_USE_WEBSOCKET_SERVER
void XRRemotePreviewManager::onClientConnected(const std::shared_ptr<WebSocketServerConnection> &connection) {
    CC_LOG_INFO("[XRRemotePreviewManager] onClientConnected.%p", connection.get());
    XRDeviceInfo deviceInfo;
    deviceInfo.type = static_cast<int16_t>(XRDataPackageType::DPT_MSG_DEVICE_INFO);
    memset(deviceInfo.deviceName, 0, sizeof(char) * 32);
    strcpy(deviceInfo.deviceName, "XRDevice");
        #if ANDROID
    char man[PROP_VALUE_MAX + 1];
    char mod[PROP_VALUE_MAX + 1];
    /* A length 0 value indicates that the property is not defined */
    int lman = __system_property_get("ro.product.manufacturer", man);
    int lmod = __system_property_get("ro.product.model", mod);
    int len = lman + lmod;
    char *pname = nullptr;
    if (len > 0) {
        pname = static_cast<char *>(malloc(len + 2));
        memset(pname, 0, sizeof(char) * 32);
        snprintf(pname, len + 2, "%s %s", lman > 0 ? man : "", lmod > 0 ? mod : "");
        memcpy(deviceInfo.deviceName, pname, sizeof(char) * 32);
    }
    if (pname) free(pname);
        #endif
    _wssConnections = _webSocketServer->getConnections();
    _xr = CC_GET_XR_INTERFACE();
    if (_xr) {
        ccstd::vector<float> leftEyeFov = _xr->getXREyeFov(static_cast<uint32_t>(cc::xr::XREye::LEFT));
        ccstd::vector<float> rightEyeFov = _xr->getXREyeFov(static_cast<uint32_t>(cc::xr::XREye::RIGHT));
        for (uint32_t i = 0; i < 4; i++) {
            CC_LOG_INFO("[XRRemotePreviewManager] %s.eye fov.%d, L.%f, R.%f.", deviceInfo.deviceName, i, leftEyeFov[i], rightEyeFov[i]);
            deviceInfo.leftEyeFov[i] = leftEyeFov[i] * math::RAD_TO_DEG;
            deviceInfo.rightEyeFov[i] = rightEyeFov[i] * math::RAD_TO_DEG;
        }
        deviceInfo.version = static_cast<int16_t>(_xr->getRuntimeVersion());
        deviceInfo.xrVendorType = static_cast<int16_t>(_xr->getVendor());
        sendDeviceInfo(deviceInfo);
    }
}

void XRRemotePreviewManager::onClientDisconnected(int closeCode, const ccstd::string &closeReason) {
    CC_LOG_INFO("[XRRemotePreviewManager] onClientDisconnected.%d|%s", closeCode, closeReason.c_str());
    this->_isConnectionChanged = true;
}

void XRRemotePreviewManager::onConnection(const std::shared_ptr<WebSocketServerConnection> &connection) {
    CC_LOG_INFO("[XRRemotePreviewManager] onConnection");

    auto map = connection->getHeaders();
    auto mapBegin = map.begin();
    while (mapBegin != map.end()) {
        CC_LOG_INFO("[XRRemotePreviewManager] connection Headers.%s=%s",
                    (*mapBegin).first.c_str(),
                    (*mapBegin).second.c_str());
        mapBegin++;
    }

    auto protocolsList = connection->getProtocols();
    auto listBegin = protocolsList.begin();
    while (listBegin != protocolsList.end()) {
        CC_LOG_INFO("[XRRemotePreviewManager] connection Protocols.%s", (*listBegin).c_str());
        listBegin++;
    }

    onClientConnected(connection);

    connection->setOnClose([=](int closeCode, const ccstd::string &closeReason) {
        onClientDisconnected(closeCode, closeReason);
    });
}
    #endif

void XRRemotePreviewManager::start() {
    #if CC_USE_WEBSOCKET_SERVER
    _webSocketServer = std::make_shared<WebSocketServer>();

    _webSocketServer->setOnBegin([]() {
        CC_LOG_INFO("[XRRemotePreviewManager] onBegin");
    });

    _webSocketServer->setOnEnd([]() {
        CC_LOG_INFO("[XRRemotePreviewManager] onEnd");
    });

    _webSocketServer->setOnClose([](const ccstd::string &msg) {
        CC_LOG_INFO("[XRRemotePreviewManager] onClose.%s", msg.c_str());
    });

    _webSocketServer->setOnListening([](const ccstd::string &msg) {
        CC_LOG_INFO("[XRRemotePreviewManager] onListening.%s", msg.c_str());
    });

    _webSocketServer->setOnError([](const ccstd::string &msg) {
        CC_LOG_INFO("[XRRemotePreviewManager] onError.%s", msg.c_str());
    });

    _webSocketServer->setOnConnection(std::bind(&XRRemotePreviewManager::onConnection, this, std::placeholders::_1));

    WebSocketServer::listenAsync(_webSocketServer, SOCKET_PORT, "127.0.0.1", nullptr);
    CC_LOG_INFO("[XRRemotePreviewManager] listenAsync ready!");
    #endif
    _isStarted = true;
}

void XRRemotePreviewManager::packDeviceInfoData(const XRDeviceInfo &info, char *data) {
    memcpy(data, &PACKET_HEAD_CODE, sizeof(char) * 4);
    size_t infoSize = sizeof(info);
    memcpy(data + 4, &infoSize, sizeof(char) * 4);
    memcpy(data + 8, &info, infoSize);
}

void XRRemotePreviewManager::packDevicePoseData(const XRPoseInfo &info, char *data) {
    memcpy(data, &PACKET_HEAD_CODE, sizeof(char) * 4);
    size_t infoSize = sizeof(info);
    memcpy(data + 4, &infoSize, sizeof(char) * 4);
    memcpy(data + 8, &info, infoSize);
}

void XRRemotePreviewManager::packControllerKeyData(const XRControllerKeyInfo &info, char *data) {
    memcpy(data, &PACKET_HEAD_CODE, sizeof(char) * 4);
    size_t infoSize = sizeof(info);
    memcpy(data + 4, &infoSize, sizeof(char) * 4);
    memcpy(data + 8, &info, infoSize);
}

void XRRemotePreviewManager::packCommonMessageData(const XRCommonMessage &info, char *data) {
    memcpy(data, &PACKET_HEAD_CODE, sizeof(char) * 4);
    size_t infoSize = sizeof(info);
    memcpy(data + 4, &infoSize, sizeof(char) * 4);
    memcpy(data + 8, &info, infoSize);
}

void XRRemotePreviewManager::sendMessage(const ccstd::string &message) {
    #if CC_USE_WEBSOCKET_SERVER
    if (_webSocketServer && _isConnectionChanged) {
        _isConnectionChanged = false;
        _wssConnections = _webSocketServer->getConnections();
    }

    if (_webSocketServer && !_wssConnections.empty()) {
        for (auto &wssConn : _wssConnections) {
            if (wssConn->getReadyState() == WebSocketServerConnection::ReadyState::OPEN) {
                XRCommonMessage xrCommonMsg;
                xrCommonMsg.type = static_cast<int16_t>(XRDataPackageType::DPT_MSG_STRING);
                xrCommonMsg.message = message;
                size_t dataLen = 8 + sizeof(xrCommonMsg);
                char data[dataLen];
                packCommonMessageData(xrCommonMsg, data);
                wssConn->sendBinaryAsync(data, dataLen, nullptr);
            } else {
                CC_LOG_INFO("[XRRemotePreviewManager] sendMessage [%s] failed !!!", message.c_str());
            }
        }
    } else {
        CC_LOG_INFO("[XRRemotePreviewManager] sendMessage [%s] failed [wss invalid] !!!", message.c_str());
    }
    #endif
}

void XRRemotePreviewManager::sendDeviceInfo(const XRDeviceInfo &info) {
    #if CC_USE_WEBSOCKET_SERVER
    if (_webSocketServer && _isConnectionChanged) {
        _isConnectionChanged = false;
        _wssConnections = _webSocketServer->getConnections();
    }

    if (_webSocketServer && !_wssConnections.empty()) {
        for (auto &wssConn : _wssConnections) {
            if (wssConn->getReadyState() == WebSocketServerConnection::ReadyState::OPEN) {
                size_t dataLen = 8 + sizeof(info);
                char data[dataLen];
                packDeviceInfoData(info, data);
                wssConn->sendBinaryAsync(data, dataLen, nullptr);
            } else {
                CC_LOG_INFO("[XRRemotePreviewManager] sendDeviceInfo failed !!!");
            }
        }
    } else {
        CC_LOG_ERROR("[XRRemotePreviewManager] sendDeviceInfo failed [wss invalid] !!!");
    }
    #endif
}

void XRRemotePreviewManager::sendPoseInfo(const XRPoseInfo &info) {
    #if CC_USE_WEBSOCKET_SERVER
    if (_webSocketServer && _isConnectionChanged) {
        _isConnectionChanged = false;
        _wssConnections = _webSocketServer->getConnections();
    }

    if (_webSocketServer && !_wssConnections.empty()) {
        for (auto &wssConn : _wssConnections) {
            if (wssConn->getReadyState() == WebSocketServerConnection::ReadyState::OPEN) {
                size_t dataLen = 8 + sizeof(info);
                char data[dataLen];
                packDevicePoseData(info, data);
                wssConn->sendBinaryAsync(data, dataLen, nullptr);
            } else {
                CC_LOG_ERROR("[XRRemotePreviewManager] sendPoseInfo failed %d!!!", wssConn->getReadyState());
            }
        }
    }
    #endif
}

void XRRemotePreviewManager::sendControllerKeyInfo(const ControllerInfo::ButtonInfo &info) {
    #if CC_USE_WEBSOCKET_SERVER
    if (_webSocketServer && _isConnectionChanged) {
        _isConnectionChanged = false;
        _wssConnections = _webSocketServer->getConnections();
    }

    if (_webSocketServer && !_wssConnections.empty()) {
        for (auto &wssConn : _wssConnections) {
            if (wssConn->getReadyState() == WebSocketServerConnection::ReadyState::OPEN) {
                XRControllerKeyInfo ctrlKeyInfo;
                ctrlKeyInfo.type = static_cast<int16_t>(XRDataPackageType::DPT_MSG_CONTROLLER_KEY);
                ctrlKeyInfo.isButtonPressed = info.isPress;
                ctrlKeyInfo.stickKeyCode = static_cast<int16_t>(info.key);
                ctrlKeyInfo.keyEventType = static_cast<int16_t>(XRKeyEventType::KET_CLICK);
                size_t dataLen = 8 + sizeof(ctrlKeyInfo);
                char data[dataLen];
                packControllerKeyData(ctrlKeyInfo, data);
                wssConn->sendBinaryAsync(data, dataLen, nullptr);
            } else {
                CC_LOG_ERROR("[XRRemotePreviewManager] sendControllerKeyInfo button failed !!!");
            }
        }
    }
    #endif
}

void XRRemotePreviewManager::sendControllerKeyInfo(const ControllerInfo::AxisInfo &info) {
    #if CC_USE_WEBSOCKET_SERVER
    if (_webSocketServer && _isConnectionChanged) {
        _isConnectionChanged = false;
        _wssConnections = _webSocketServer->getConnections();
    }

    if (_webSocketServer && !_wssConnections.empty()) {
        for (auto &wssConn : _wssConnections) {
            if (wssConn->getReadyState() == WebSocketServerConnection::ReadyState::OPEN) {
                XRControllerKeyInfo ctrlKeyInfo;
                ctrlKeyInfo.type = static_cast<int16_t>(XRDataPackageType::DPT_MSG_CONTROLLER_KEY);
                ctrlKeyInfo.stickAxisCode = static_cast<int16_t>(info.axis);
                ctrlKeyInfo.stickAxisValue = info.value;
                if (info.axis == StickAxisCode::LEFT_STICK_X || info.axis == StickAxisCode::LEFT_STICK_Y ||
                    info.axis == StickAxisCode::RIGHT_STICK_X || info.axis == StickAxisCode::RIGHT_STICK_Y) {
                    ctrlKeyInfo.keyEventType = static_cast<int16_t>(XRKeyEventType::KET_STICK);
                } else {
                    ctrlKeyInfo.keyEventType = static_cast<int16_t>(XRKeyEventType::KET_GRAB);
                }
                size_t dataLen = 8 + sizeof(ctrlKeyInfo);
                char data[dataLen];
                packControllerKeyData(ctrlKeyInfo, data);
                wssConn->sendBinaryAsync(data, dataLen, nullptr);
            } else {
                CC_LOG_ERROR("[XRRemotePreviewManager] sendControllerKeyInfo axis failed !!!");
            }
        }
    }
    #endif
}

void XRRemotePreviewManager::sendControllerKeyInfo(const ControllerInfo::TouchInfo &info) {
#if CC_USE_WEBSOCKET_SERVER
    if (_webSocketServer && _isConnectionChanged) {
        _isConnectionChanged = false;
        _wssConnections = _webSocketServer->getConnections();
    }

    if (_webSocketServer && !_wssConnections.empty()) {
        for (auto &wssConn : _wssConnections) {
            if (wssConn->getReadyState() == WebSocketServerConnection::ReadyState::OPEN) {
                XRControllerKeyInfo ctrlKeyInfo;
                ctrlKeyInfo.type = static_cast<int16_t>(XRDataPackageType::DPT_MSG_CONTROLLER_KEY);
                ctrlKeyInfo.stickTouchValue = info.value;
                ctrlKeyInfo.stickTouchCode = static_cast<int16_t>(info.key);
                ctrlKeyInfo.keyEventType = static_cast<int16_t>(XRKeyEventType::KET_TOUCH);
                size_t dataLen = 8 + sizeof(ctrlKeyInfo);
                char data[dataLen];
                packControllerKeyData(ctrlKeyInfo, data);
                wssConn->sendBinaryAsync(data, dataLen, nullptr);
            } else {
                CC_LOG_ERROR("[XRRemotePreviewManager] sendControllerTouchInfo failed !!!");
            }
        }
    }
#endif
}

void XRRemotePreviewManager::resume() {
    CC_LOG_INFO("[XRRemotePreviewManager] resume");
    sendMessage("resume");
}

void XRRemotePreviewManager::pause() {
    CC_LOG_INFO("[XRRemotePreviewManager] pause");
    sendMessage("pause");
}

void XRRemotePreviewManager::stop() {
    _isStarted = false;
    CC_LOG_INFO("[XRRemotePreviewManager] stop");
    _webSocketServer->closeAsync();
    _webSocketServer = nullptr;
}

bool XRRemotePreviewManager::isStarted() const {
    return _isStarted;
}

void XRRemotePreviewManager::tick() {
    if (this->_isStarted) {
        xr::XrEntry::getInstance()->getXrPose(_leftEyePose, _rightEyePose, _leftControllerPose, _rightControllerPose);
        _devicePoseInfo.type = static_cast<int16_t>(XRDataPackageType::DPT_MSG_POSE_DATA);
        _devicePoseInfo.hmdOrientation[0] = _leftEyePose.qx;
        _devicePoseInfo.hmdOrientation[1] = _leftEyePose.qy;
        _devicePoseInfo.hmdOrientation[2] = _leftEyePose.qz;
        _devicePoseInfo.hmdOrientation[3] = _leftEyePose.qw;
        _devicePoseInfo.hmdPosition[0] = (_leftEyePose.px + _rightEyePose.px) * 0.5F;
        _devicePoseInfo.hmdPosition[1] = (_leftEyePose.py + _rightEyePose.py) * 0.5F;
        _devicePoseInfo.hmdPosition[2] = (_leftEyePose.pz + _rightEyePose.pz) * 0.5F;

        _devicePoseInfo.leftControllerOrientation[0] = _leftControllerPose.qx;
        _devicePoseInfo.leftControllerOrientation[1] = _leftControllerPose.qy;
        _devicePoseInfo.leftControllerOrientation[2] = _leftControllerPose.qz;
        _devicePoseInfo.leftControllerOrientation[3] = _leftControllerPose.qw;
        _devicePoseInfo.leftControllerPosition[0] = _leftControllerPose.px;
        _devicePoseInfo.leftControllerPosition[1] = _leftControllerPose.py;
        _devicePoseInfo.leftControllerPosition[2] = _leftControllerPose.pz;

        _devicePoseInfo.rightControllerOrientation[0] = _rightControllerPose.qx;
        _devicePoseInfo.rightControllerOrientation[1] = _rightControllerPose.qy;
        _devicePoseInfo.rightControllerOrientation[2] = _rightControllerPose.qz;
        _devicePoseInfo.rightControllerOrientation[3] = _rightControllerPose.qw;
        _devicePoseInfo.rightControllerPosition[0] = _rightControllerPose.px;
        _devicePoseInfo.rightControllerPosition[1] = _rightControllerPose.py;
        _devicePoseInfo.rightControllerPosition[2] = _rightControllerPose.pz;
        this->sendPoseInfo(_devicePoseInfo);
    }
}

} // namespace cc

#endif
