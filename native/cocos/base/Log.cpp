#include "Log.h"
#include "UTFString.h"
#include "StringUtil.h"

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #ifndef WIN32_LEAN_AND_MEAN
        #define WIN32_LEAN_AND_MEAN
    #endif
    #include <Windows.h>
    #include <time.h>

    #define COLOR_FATAL                   FOREGROUND_INTENSITY | FOREGROUND_RED
    #define COLOR_ERROR                   FOREGROUND_RED
    #define COLOR_WARN                    6
    #define COLOR_INFO                    FOREGROUND_GREEN | FOREGROUND_BLUE
    #define COLOR_DEBUG                   7
    #define COLOR_NORMAL                  8
    #define SET_CONSOLE_TEXT_COLOR(color) SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color)

#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/log.h>
#endif

namespace cc {

#define LOG_USE_TIMESTAMP
#if (COCOS2D_DEBUG == 1)
LogLevel Log::logLevel = LogLevel::DEBUG_;
#else
LogLevel Log::logLevel = LogLevel::INFO;
#endif

FILE *Log::_logFile = nullptr;
const char *LOG_LEVEL_DESCS[] = {"FATAL", "ERROR", "WARN", "INFO", "DEBUG"};

void Log::setLogFile(const std::string &filename) {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    if (_logFile) {
        fclose(_logFile);
    }

    _logFile = fopen(filename.c_str(), "w");

    if (_logFile) {
        String msg;
        msg += "------------------------------------------------------\n";

        struct tm *tm_time;
        time_t ct_time;
        time(&ct_time);
        tm_time = localtime(&ct_time);

        msg += StringUtil::Format("LOG DATE: %04d-%02d-%02d %02d:%02d:%02d\n",
                                  tm_time->tm_year + 1900,
                                  tm_time->tm_mon + 1,
                                  tm_time->tm_mday,
                                  tm_time->tm_hour,
                                  tm_time->tm_min,
                                  tm_time->tm_sec);

        msg += "------------------------------------------------------\n";

        fputs(msg.c_str(), _logFile);
        fflush(_logFile);
    }
#endif
}

void Log::close() {
    if (_logFile) {
        fclose(_logFile);
        _logFile = nullptr;
    }
}

void Log::logMessage(LogType type, LogLevel level, const char *formats, ...) {
    char buff[4096];
    char *p = buff;
    char *last = buff + sizeof(buff) - 3;

#if defined(LOG_USE_TIMESTAMP)
    struct tm *tm_time;
    time_t ct_time;
    time(&ct_time);
    tm_time = localtime(&ct_time);

    p += sprintf(p, "%02d:%02d:%02d ", tm_time->tm_hour, tm_time->tm_min, tm_time->tm_sec);
#endif

    p += sprintf(p, "[%s]: ", LOG_LEVEL_DESCS[(int)level]);

    va_list args;
    va_start(args, formats);
    // p += StringUtil::VPrintf(p, last, formats, args);

    int count = (int)(last - p);
    int ret = vsnprintf(p, count, formats, args);
    if (ret >= count - 1) {
        p += (count - 1);
    } else if (ret >= 0) {
        p += ret;
    }

    va_end(args);

    *p++ = '\n';
    *p = 0;

    if (_logFile) {
        fputs(buff, _logFile);
        fflush(_logFile);
    }

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    UTFString utfstr(buff);
    const wchar_t *ustr = utfstr.asWStr_c_str();

    WORD color;
    switch (level) {
        case LogLevel::DEBUG_: color = COLOR_DEBUG; break;
        case LogLevel::INFO: color = COLOR_INFO; break;
        case LogLevel::WARN: color = COLOR_WARN; break;
        case LogLevel::ERR: color = COLOR_ERROR; break;
        case LogLevel::FATAL: color = COLOR_FATAL; break;
        default: color = COLOR_INFO;
    }
    SET_CONSOLE_TEXT_COLOR(color);
    wprintf(L"%s", ustr);
    SET_CONSOLE_TEXT_COLOR(COLOR_NORMAL);

    OutputDebugStringW(ustr);
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    android_LogPriority priority;
    switch (level) {
        case LogLevel::DEBUG_: priority = ANDROID_LOG_DEBUG; break;
        case LogLevel::INFO: priority = ANDROID_LOG_INFO; break;
        case LogLevel::WARN: priority = ANDROID_LOG_WARN; break;
        case LogLevel::ERR: priority = ANDROID_LOG_ERROR; break;
        case LogLevel::FATAL: priority = ANDROID_LOG_FATAL; break;
        default: priority = ANDROID_LOG_INFO;
    }

    __android_log_write(priority, (type == LogType::KERNEL ? "Cocos" : "CocosScript"), buff);
#else
    fputs(buff, stdout);
#endif
}

} // namespace cc
