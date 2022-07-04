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

#include "Log.h"

#include <cstdarg>
#include <ctime>
#include "base/std/container/string.h"
#include "base/std/container/vector.h"

#if CC_REMOTE_LOG

    #include <chrono>
    #include <sstream>
    #include <string_view>
    #include "platform/FileUtils.h"
    #include "rapidjson/document.h"

#endif

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #ifndef WIN32_LEAN_AND_MEAN
        #define WIN32_LEAN_AND_MEAN
    #endif
    #include <Windows.h>
    #if CC_REMOTE_LOG
        #include <winsock2.h>
        #include <cstdio>
        #pragma comment(lib, "ws2_32.lib")
    #endif

    #define COLOR_FATAL                   FOREGROUND_INTENSITY | FOREGROUND_RED
    #define COLOR_ERROR                   FOREGROUND_RED
    #define COLOR_WARN                    6
    #define COLOR_INFO                    FOREGROUND_GREEN | FOREGROUND_BLUE
    #define COLOR_DEBUG                   7
    #define COLOR_NORMAL                  8
    #define SET_CONSOLE_TEXT_COLOR(color) SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color)

#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)

    #include <android/log.h>

#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include <hilog/log.h>
#endif

#if CC_REMOTE_LOG

    #if CC_PLATFORM != CC_PLATFORM_WINDOWS

        #include <arpa/inet.h>
        #include <fcntl.h>
        #include <netinet/in.h>
        #include <sys/socket.h>
        #include <sys/types.h>

    #endif
namespace {

    #define AUTO_TEST_CONFIG_FILE "auto-test-config.json"

enum class UdpStatus {
    UNINITIALIZED,
    INITIALIZED,
    CONFIGURED,
    OK,
    FAILED,
};

class UdpContext {
private:
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
    SOCKET sock;
    WSAData wsa;
    #else
    int sock;
    #endif
    struct sockaddr_in server, local;
    UdpStatus status{UdpStatus::UNINITIALIZED};

    std::string testId;
    uint64_t bootId{0};

public:
    UdpContext() {
        initSocket();
        loadConfig();
    }

    ~UdpContext() {
        destroySocket();
    }

    void sendFormatLog(const std::string_view &msg) {
        std::time_t t = std::time(nullptr);
        char mbstr[100] = {0};
        std::strftime(mbstr, sizeof(mbstr), "%c", std::localtime(&t));
        std::stringstream ss;
        ss << testId << std::endl
           << clientName() << std::endl
           << bootId << std::endl
           << mbstr << std::endl
           << msg
           << '\0';
        sendLog(ss.str());
    }

private:

    void loadConfig() {
        if (status != UdpStatus::INITIALIZED) {
            return;
        }

        auto *fu = cc::FileUtils::getInstance();
        if (!fu) {
            // engine is not ready
            return;
        }

        if (!fu->isFileExist(AUTO_TEST_CONFIG_FILE)) {
            status = UdpStatus::FAILED;
            return;
        }
        auto content = fu->getStringFromFile(AUTO_TEST_CONFIG_FILE);
        rapidjson::Document doc;
        doc.Parse(content.c_str(), content.length());

        if (doc.HasParseError()) {
            auto code = doc.GetParseError();
            status = UdpStatus::FAILED;
            return;
        }
        if (!doc.HasMember("ServerConfig")) {
            status = UdpStatus::FAILED;
            return;
        }
        if (doc.HasMember("testID")) {
            testId = doc["testID"].GetString();
        } else {
            testId = doc["flagId"].GetString();
        }
        rapidjson::Value &cfg = doc["ServerConfig"];
        std::string remoteIp = cfg["IP"].GetString();
        int remotePort = cfg["PORT"].GetInt() + 1;
        setRemoteAddr(remoteIp.c_str(), remotePort);

        bootId = std::chrono::duration_cast<std::chrono::milliseconds>(
                     std::chrono::system_clock::now().time_since_epoch())
                     .count();

        status = UdpStatus::CONFIGURED;
    }

    static const char *clientName() {
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        return "Windows";
    #elif CC_PLATFORM == CC_PLATFORM_ANDROID
        return "Android";
    #elif CC_PLATFORM == CC_PLATFORM_MACOS
        return "MacOS";
    #elif CC_PLATFORM == CC_PLATFORM_IOS
        return "iOS";
    #elif CC_PLATFORM == CC_PLATFORM_LINUX
        return "Linux";
    #elif CC_PLATFORM == CC_PLATFORM_QNX
        return "QNX";
    #elif CC_PLATFORM == CC_PLATFORM_NX
        return "NX";
    #else
        return "Unknown platform";
    #endif
    }

    void initSocket() {
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
            printf("WSAStartup failed, code: %d\n", WSAGetLastError());
            status = UdpStatus::FAILED;
            return;
        }
    #endif
        status = UdpStatus::INITIALIZED;
    }

    void destroySocket() {
        if (status == UdpStatus::OK) {
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
            closesocket(sock);
            WSACleanup();
    #else
            close(sock);
    #endif
        }
    }

    void setRemoteAddr(const char *addr, int port) {
        memset(&server, 0, sizeof(server));
        server.sin_family = AF_INET;
        server.sin_addr.s_addr = inet_addr(addr);
        server.sin_port = htons(port);
    }

    static auto getErrorCode() {
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        return WSAGetLastError();
    #else
        return errno;
    #endif
    }

    void prepareSocket() {
        if (status == UdpStatus::INITIALIZED) {
            loadConfig();
        }
        if (status != UdpStatus::CONFIGURED) {
            return;
        }
        memset(&local, 0, sizeof(local));
        local.sin_family = AF_INET;
        local.sin_addr.s_addr = INADDR_ANY;
        local.sin_port = 0; // bind random port

        if ((sock = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
            auto errorCode = getErrorCode();
            status = UdpStatus::FAILED;
            printf("create socket failed, code: %d\n", errorCode);
            return;
        }
        if (bind(sock, reinterpret_cast<sockaddr *>(&local), sizeof(local))) {
            status = UdpStatus::FAILED;
            auto errorCode = getErrorCode();
            printf("bind socket failed, code: %d\n", errorCode);
            return;
        }
        if (connect(sock, reinterpret_cast<sockaddr *>(&server), sizeof(server))) {
            auto errorCode = getErrorCode();
            printf("connect socket failed, code: %d\n", errorCode);
            status = UdpStatus::FAILED;
            return;
        }

    #if _WIN32
        u_long mode = 1;
        ioctlsocket(sock, FIONBIO, &mode);
    #else
        int flags = fcntl(sock, F_GETFL);
        fcntl(sock, F_SETFL, flags | O_NONBLOCK);
    #endif

        status = UdpStatus::OK;
    }

    void sendLog(const std::string_view &msg) {
        prepareSocket();
        if (status == UdpStatus::OK) {
            send(sock, msg.data(), msg.size(), 0);
        }
    }
};

void sendLogThroughUDP(const std::string_view &msg) {
    static UdpContext remote;
    remote.sendFormatLog(msg);
}

} // namespace
#else
    // NOLINTNEXTLINE
    #define sendLogThroughUDP(msg) (void)(msg)
#endif

namespace cc {

#define LOG_USE_TIMESTAMP
#if (CC_DEBUG == 1)
LogLevel Log::slogLevel = LogLevel::LEVEL_DEBUG;
#else
LogLevel Log::slogLevel = LogLevel::INFO;
#endif

FILE *Log::slogFile = nullptr;
const ccstd::vector<ccstd::string> LOG_LEVEL_DESCS{"FATAL", "ERROR", "WARN", "INFO", "DEBUG"};

void Log::setLogFile(const ccstd::string &filename) {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    if (slogFile) {
        fclose(slogFile);
    }

    slogFile = fopen(filename.c_str(), "w");

    if (slogFile) {
        ccstd::string msg;
        msg += "------------------------------------------------------\n";

        struct tm *tm_time;
        time_t ct_time;
        time(&ct_time);
        tm_time = localtime(&ct_time);
        char dateBuffer[256] = {0};
        snprintf(dateBuffer, sizeof(dateBuffer), "LOG DATE: %04d-%02d-%02d %02d:%02d:%02d\n",
                 tm_time->tm_year + 1900,
                 tm_time->tm_mon + 1,
                 tm_time->tm_mday,
                 tm_time->tm_hour,
                 tm_time->tm_min,
                 tm_time->tm_sec);

        msg += dateBuffer;

        msg += "------------------------------------------------------\n";

        fputs(msg.c_str(), slogFile);
        fflush(slogFile);
    }
#endif
}

void Log::close() {
    if (slogFile) {
        fclose(slogFile);
        slogFile = nullptr;
    }
}

void Log::logMessage(LogType type, LogLevel level, const char *formats, ...) {
    char buff[4096];
    char *p = buff;
    char *last = buff + sizeof(buff) - 3;

#if defined(LOG_USE_TIMESTAMP)
    struct tm *tmTime;
    time_t ctTime;
    time(&ctTime);
    tmTime = localtime(&ctTime);

    p += sprintf(p, "%02d:%02d:%02d ", tmTime->tm_hour, tmTime->tm_min, tmTime->tm_sec);
#endif

    p += sprintf(p, "[%s]: ", LOG_LEVEL_DESCS[static_cast<int>(level)].c_str());

    va_list args;
    va_start(args, formats);
    // p += StringUtil::vprintf(p, last, formats, args);

    std::ptrdiff_t count = (last - p);
    int ret = vsnprintf(p, count, formats, args);
    if (ret >= count - 1) {
        p += (count - 1);
    } else if (ret >= 0) {
        p += ret;
    }

    va_end(args);

    *p++ = '\n';
    *p = 0;

    if (slogFile) {
        fputs(buff, slogFile);
        fflush(slogFile);
    }

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    WCHAR wszBuf[4096] = {0};
    MultiByteToWideChar(CP_UTF8, 0, buff, -1, wszBuf, sizeof(wszBuf));

    WORD color;
    switch (level) {
        case LogLevel::LEVEL_DEBUG: color = COLOR_DEBUG; break;
        case LogLevel::INFO: color = COLOR_INFO; break;
        case LogLevel::WARN: color = COLOR_WARN; break;
        case LogLevel::ERR: color = COLOR_ERROR; break;
        case LogLevel::FATAL: color = COLOR_FATAL; break;
        default: color = COLOR_INFO;
    }
    SET_CONSOLE_TEXT_COLOR(color);
    wprintf(L"%s", wszBuf);
    SET_CONSOLE_TEXT_COLOR(COLOR_NORMAL);

    OutputDebugStringW(wszBuf);
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    android_LogPriority priority;
    switch (level) {
        case LogLevel::LEVEL_DEBUG:
            priority = ANDROID_LOG_DEBUG;
            break;
        case LogLevel::INFO:
            priority = ANDROID_LOG_INFO;
            break;
        case LogLevel::WARN:
            priority = ANDROID_LOG_WARN;
            break;
        case LogLevel::ERR:
            priority = ANDROID_LOG_ERROR;
            break;
        case LogLevel::FATAL:
            priority = ANDROID_LOG_FATAL;
            break;
        default:
            priority = ANDROID_LOG_INFO;
    }

    __android_log_write(priority, (type == LogType::KERNEL ? "Cocos" : "CocosScript"), buff);
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    const char *typeStr = (type == LogType::KERNEL ? "Cocos %{public}s" : "CocosScript %{public}s");
    switch (level) {
        case LogLevel::LEVEL_DEBUG:
            HILOG_DEBUG(LOG_APP, typeStr, (const char *)buff);
            break;
        case LogLevel::INFO:
            HILOG_INFO(LOG_APP, typeStr, buff);
            break;
        case LogLevel::WARN:
            HILOG_WARN(LOG_APP, typeStr, buff);
            break;
        case LogLevel::ERR:
            HILOG_ERROR(LOG_APP, typeStr, buff);
            break;
        case LogLevel::FATAL:
            HILOG_FATAL(LOG_APP, typeStr, buff);
            break;
        default:
            HILOG_DEBUG(LOG_APP, typeStr, buff);
    }
#else
    fputs(buff, stdout);
#endif

    logRemote(buff);
}

void Log::logRemote(const char *msg) {
    sendLogThroughUDP(msg);
}

} // namespace cc
