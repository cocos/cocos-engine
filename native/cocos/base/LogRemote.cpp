/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Log.h"

#if CC_REMOTE_LOG
    #include <chrono>
    #include <sstream>
    #include <string_view>
    #include "platform/FileUtils.h"
    #include "rapidjson/document.h"

    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        #ifndef WIN32_LEAN_AND_MEAN
            #define WIN32_LEAN_AND_MEAN
        #endif
        #include <Windows.h>
        #include <winsock2.h>
        #include <cstdio>
        #pragma comment(lib, "ws2_32.lib")

    #else
        #include <arpa/inet.h>
        #include <fcntl.h>
        #include <netinet/in.h>
        #include <sys/socket.h>
        #include <sys/types.h>
    #endif

namespace {

    // #define AUTO_TEST_CONFIG_FILE "auto-test-config.json" // v1
    #define AUTO_TEST_CONFIG_FILE "testConfig.json" // v2

    #define OLD_ATC_KEY_CONFIG "ServerConfig"
    #define OLD_ATC_KEY_IP     "IP"
    #define OLD_ATC_KEY_PORT   "PORT"
    #define OLD_ATC_KEY_PLANID "planId"
    #define OLD_ATC_KEY_FLAGID "flagId"

    #define ATC_KEY_CONFIG         "localServer"
    #define ATC_KEY_IP             "ip"
    #define ATC_KEY_PORT           "port"
    #define ATC_KEY_JOBID          "jobId"
    #define ATC_KEY_PLATFORMS      "platforms"
    #define ATC_KEY_PLATFORM_INDEX "platformIndex"

enum class UdpLogClientState {
    UNINITIALIZED,
    INITIALIZED,
    CONFIGURED,
    OK,
    DONE, // FAILED
};

uint64_t logId = 0;

/**
* Parse auto-test-config.json to get ServerConfig.IP & ServerConfig.PORT
* Logs will be formated with 5 fields
* 1. testId
* 2. clientId
* 3. bootId,  the boot timestamp
* 4. sequence number of the message
* 5. log content
*
* These parts are joined with '\n'.
*
* The log text is sent to the server via UDP. Due to the nature of the UDP protocol,
* there may be packet loss/missequencing issues.
*/
class UdpLogClient {
public:
    UdpLogClient() {
        init();
        tryParseConfig();
    }

    ~UdpLogClient() {
        deinit();
    }

    void sendFullLog(const std::string_view &msg) {
        if (_status == UdpLogClientState::DONE) {
            return;
        }
        std::stringstream ss;
        ss << _testID << std::endl
           << _clientID << std::endl
           << _bootID << std::endl
           << ++logId << std::endl
           << msg;
        sendLog(ss.str());
    }

private:
    void init() {
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        WSAData wsa;
        if (WSAStartup(MAKEWORD(1, 2), &wsa) != 0) {
            printf("WSAStartup failed, code: %d\n", WSAGetLastError());
            _status = UdpLogClientState::DONE;
            return;
        }
    #endif
        _status = UdpLogClientState::INITIALIZED;
    }

    void deinit() {
        if (_status == UdpLogClientState::OK) {
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
            closesocket(_sock);
            WSACleanup();
    #else
            close(_sock);
    #endif
        }
    }
    void tryParseConfig() {
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        if (_status != UdpLogClientState::INITIALIZED) {
            return;
        }
    #endif
        auto *fu = cc::FileUtils::getInstance();
        if (!fu) {
            // engine is not ready, retry later
            return;
        }

        if (!fu->isFileExist(AUTO_TEST_CONFIG_FILE)) {
            _status = UdpLogClientState::DONE;
            return;
        }
        auto content = fu->getStringFromFile(AUTO_TEST_CONFIG_FILE);
        rapidjson::Document doc;
        doc.Parse(content.c_str(), content.length());

        if (doc.HasParseError()) {
            auto code = doc.GetParseError();
            _status = UdpLogClientState::DONE;
            return;
        }

        if (doc.HasMember(OLD_ATC_KEY_CONFIG)) {
            // parse clientID & testID
            if (doc.HasMember(OLD_ATC_KEY_FLAGID)) {
                _clientID = doc[OLD_ATC_KEY_FLAGID].GetString();
            } else {
                _clientID = "flagId is not set!";
            }

            if (doc.HasMember(OLD_ATC_KEY_PLANID)) {
                _testID = doc[OLD_ATC_KEY_PLANID].GetString();
            } else {
                _testID = "planId is not set!";
            }

            // parse ip & port
            rapidjson::Value &cfg = doc[OLD_ATC_KEY_CONFIG];
            if (!cfg.HasMember(OLD_ATC_KEY_IP) || !cfg.HasMember(OLD_ATC_KEY_PORT)) {
                _status = UdpLogClientState::DONE;
                return;
            }
            const char *remoteIp = cfg[OLD_ATC_KEY_IP].GetString();
            // The `PORT` property is used by other service and the next port is for log collection.
            int remotePort = cfg[OLD_ATC_KEY_PORT].GetInt() + 1;
            setServerAddr(remoteIp, remotePort);
        } else if (doc.HasMember(ATC_KEY_CONFIG)) {
            if (doc.HasMember(ATC_KEY_JOBID)) {
                _testID = doc[ATC_KEY_JOBID].GetString();
            } else {
                _testID = "jobId is not set!";
            }
            if (doc.HasMember(ATC_KEY_PLATFORMS)) {
                rapidjson::Value &platforms = doc[ATC_KEY_PLATFORMS];
                if (!platforms.IsArray() || platforms.Size() < 1) {
                    _clientID = "array platforms is empty";
                } else {
                    rapidjson::Value &plt = platforms[0];
                    if (!plt.HasMember(ATC_KEY_PLATFORM_INDEX)) {
                        _clientID = "platforms[0] not key platformIndex";
                    } else {
                        rapidjson::Value &index = plt[ATC_KEY_PLATFORM_INDEX];
                        _clientID = index.IsInt() ? std::to_string(index.GetInt()) : index.GetString();
                    }
                }
            } else {
                _clientID = "platforms not set!";
            }

            // parse ip & port
            rapidjson::Value &cfg = doc[ATC_KEY_CONFIG];
            if (!cfg.HasMember(ATC_KEY_IP) || !cfg.HasMember(ATC_KEY_PORT)) {
                _status = UdpLogClientState::DONE;
                return;
            }
            const char *remoteIp = cfg[ATC_KEY_IP].GetString();
            // The `PORT` property is used by other service and the next port is for log collection.
            int remotePort = cfg[ATC_KEY_PORT].GetInt() + 1;
            setServerAddr(remoteIp, remotePort);
        } else {
            _status = UdpLogClientState::DONE;
            return;
        }

        _bootID = std::chrono::duration_cast<std::chrono::milliseconds>(
                      std::chrono::system_clock::now().time_since_epoch())
                      .count();

        _status = UdpLogClientState::CONFIGURED;
    }

    void setServerAddr(const std::string_view &addr, int port) {
        memset(&_serverAddr, 0, sizeof(_serverAddr));
        _serverAddr.sin_family = AF_INET;
        _serverAddr.sin_addr.s_addr = inet_addr(addr.data());
        _serverAddr.sin_port = htons(port);
    }

    static auto getErrorCode() {
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        return WSAGetLastError();
    #else
        return errno;
    #endif
    }

    void ensureInitSocket() {
        if (_status == UdpLogClientState::INITIALIZED) {
            tryParseConfig();
        }
        if (_status != UdpLogClientState::CONFIGURED) {
            return;
        }
        memset(&_localAddr, 0, sizeof(_localAddr));
        _localAddr.sin_family = AF_INET;
        _localAddr.sin_addr.s_addr = INADDR_ANY;
        _localAddr.sin_port = 0; // bind random port

        if ((_sock = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
            auto errorCode = getErrorCode();
            _status = UdpLogClientState::DONE;
            printf("create socket failed, code: %d\n", errorCode);
            return;
        }
        if (bind(_sock, reinterpret_cast<sockaddr *>(&_localAddr), sizeof(_localAddr))) {
            _status = UdpLogClientState::DONE;
            auto errorCode = getErrorCode();
            printf("bind socket failed, code: %d\n", errorCode);
            return;
        }
        if (connect(_sock, reinterpret_cast<sockaddr *>(&_serverAddr), sizeof(_serverAddr))) {
            auto errorCode = getErrorCode();
            printf("connect socket failed, code: %d\n", errorCode);
            _status = UdpLogClientState::DONE;
            return;
        }

    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        u_long mode = 1;
        if (ioctlsocket(_sock, FIONBIO, &mode)) {
            auto errorCode = getErrorCode();
            printf("set nonblock failed, code: %d\n", errorCode);
            // continue
        }
    #else
        int flags = fcntl(_sock, F_GETFL);
        if (fcntl(_sock, F_SETFL, flags | O_NONBLOCK)) {
            auto errorCode = getErrorCode();
            printf("set nonblock failed, code: %d\n", errorCode);
            // continue
        }
    #endif
        _status = UdpLogClientState::OK;
    }

    void sendLog(const std::string_view &msg) {
        ensureInitSocket();
        if (_status == UdpLogClientState::OK) {
            send(_sock, msg.data(), msg.size(), 0);
        }
    }

    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
    SOCKET _sock{INVALID_SOCKET};
    #else
    int _sock{-1};
    #endif
    sockaddr_in _serverAddr;
    sockaddr_in _localAddr;
    UdpLogClientState _status{UdpLogClientState::UNINITIALIZED};
    std::string _testID;
    std::string _clientID;
    uint64_t _bootID{0};
};

void sendLogThroughUDP(const std::string_view &msg) {
    static UdpLogClient remote;
    remote.sendFullLog(msg);
}

} // namespace

#endif

namespace cc {

void Log::logRemote(const char *msg) {
#if CC_REMOTE_LOG
    sendLogThroughUDP(msg);
#endif
}

} // namespace cc
