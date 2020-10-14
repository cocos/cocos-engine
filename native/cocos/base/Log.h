#ifndef CC_CORE_KERNEL_LOG_H_
#define CC_CORE_KERNEL_LOG_H_

#include "Macros.h"
#include <string>

namespace cc {

enum class LogType {
    KERNEL,
    SCRIPT,
    COUNT,
};

enum class LogLevel {
    FATAL,
    ERR,
    WARN,
    INFO,
    DEBUG_, // DEBUG is a macro on windows, so use DEBUG_ instead.
    COUNT,
};

class CC_DLL Log {
public:
    static LogLevel logLevel; // for read only

    static CC_INLINE void setLogLevel(LogLevel level) { logLevel = level; }
    static CC_INLINE FILE *getLogFile() { return _logFile; }
    static void setLogFile(const std::string &filename);
    static void close();
    static void logMessage(LogType type, LogLevel level, const char *formats, ...);

private:
    static FILE *_logFile;
};

} // namespace cc

#define CC_LOG_DEBUG(formats, ...) \
    if (cc::Log::logLevel >= cc::LogLevel::DEBUG_) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::DEBUG_, formats, ##__VA_ARGS__)
#define CC_LOG_INFO(formats, ...) \
    if (cc::Log::logLevel >= cc::LogLevel::INFO) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::INFO, formats, ##__VA_ARGS__)
#define CC_LOG_WARNING(formats, ...) \
    if (cc::Log::logLevel >= cc::LogLevel::WARN) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::WARN, formats, ##__VA_ARGS__)
#define CC_LOG_ERROR_(formats, ...) \
    if (cc::Log::logLevel >= cc::LogLevel::ERR) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::ERR, formats, ##__VA_ARGS__)
#define CC_LOG_FATAL(formats, ...) \
    if (cc::Log::logLevel >= cc::LogLevel::FATAL) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::FATAL, formats, ##__VA_ARGS__)

#define CC_LOG_ERROR(formats, ...)                                      \
    do {                                                                \
        CC_LOG_ERROR_("[ERROR] file %s: line %d ", __FILE__, __LINE__); \
        CC_LOG_ERROR_(formats, ##__VA_ARGS__);                          \
    } while (0)

#endif // CC_CORE_KERNEL_LOG_H_
