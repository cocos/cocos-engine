/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include <chrono>
#include <sstream>
#include <string_view>
#include "platform/FileUtils.h"
#include "rapidjson/document.h"

#include "base/Log.h"

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

#define AUTO_TEST_CONFIG_FILE "auto-test-config.json"

enum class UdpLogClientState {
    UNINITIALIZED,
    INITIALIZED,
    CONFIGURED,
    OK,
    DONE, // FAILED
};

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
        std::time_t now = std::time(nullptr);
        char dateString[100] = {0};
        std::strftime(dateString, sizeof(dateString), "%c", std::localtime(&now));
        std::stringstream ss;
        ss << _testID << std::endl
           << _clientID << std::endl
           << _bootID << std::endl
           << dateString << std::endl
           << msg
           << '\0';
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
        if (!doc.HasMember("ServerConfig")) {
            _status = UdpLogClientState::DONE;
            return;
        }
        if (doc.HasMember("planId")) {
            _testID = doc["planId"].GetString();
        } else {
            _testID = doc["flagId"].GetString();
        }
        _clientID = doc["flagId"].GetString();
        rapidjson::Value &cfg = doc["ServerConfig"];
        std::string remoteIp = cfg["IP"].GetString();
        int remotePort = cfg["PORT"].GetInt() + 1;
        setServerAddr(remoteIp.c_str(), remotePort);

        _bootID = std::chrono::duration_cast<std::chrono::milliseconds>(
                      std::chrono::system_clock::now().time_since_epoch())
                      .count();

        _status = UdpLogClientState::CONFIGURED;
    }

    void setServerAddr(const char *addr, int port) {
        memset(&_serverAddr, 0, sizeof(_serverAddr));
        _serverAddr.sin_family = AF_INET;
        _serverAddr.sin_addr.s_addr = inet_addr(addr);
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

namespace cc {
void Log::logRemote(const char *msg) {
    sendLogThroughUDP(msg);
}
} // namespace cc