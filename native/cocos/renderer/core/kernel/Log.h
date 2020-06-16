#ifndef CC_CORE_KERNEL_LOG_H_
#define CC_CORE_KERNEL_LOG_H_

#include <string>

namespace cc {
namespace gfx {

enum class LogType : uint8_t {
    KERNEL,
    SCRIPT,
    COUNT,
};

enum class LogLevel : uint8_t {
    FATAL,
    ERR,
    WARN,
    INFO,
    DEBUG,
    COUNT,
};

class CC_CORE_API Log {
public:
    static LogLevel log_level; // for read only

    static CC_INLINE void set_log_level(LogLevel level) { log_level = level; }
    static CC_INLINE FILE *log_file() { return log_file_; }
    static void set_log_file(const std::string &filename);
    static void Close();
    static void LogMessage(LogType type, LogLevel level, const char *formats, ...);

private:
    static FILE *log_file_;
};

} // namespace gfx
} // namespace cc

#define CC_LOG_DEBUG(formats, ...) \
    if (cc::gfx::Log::log_level >= cc::gfx::LogLevel::DEBUG) cc::gfx::Log::LogMessage(cc::gfx::LogType::KERNEL, cc::gfx::LogLevel::DEBUG, formats, ##__VA_ARGS__)
#define CC_LOG_INFO(formats, ...) \
    if (cc::gfx::Log::log_level >= cc::gfx::LogLevel::INFO) cc::gfx::Log::LogMessage(cc::gfx::LogType::KERNEL, cc::gfx::LogLevel::INFO, formats, ##__VA_ARGS__)
#define CC_LOG_WARNING(formats, ...) \
    if (cc::gfx::Log::log_level >= cc::gfx::LogLevel::WARN) cc::gfx::Log::LogMessage(cc::gfx::LogType::KERNEL, cc::gfx::LogLevel::WARN, formats, ##__VA_ARGS__)
#define CC_LOG_ERROR_(formats, ...) \
    if (cc::gfx::Log::log_level >= cc::gfx::LogLevel::ERR) cc::gfx::Log::LogMessage(cc::gfx::LogType::KERNEL, cc::gfx::LogLevel::ERR, formats, ##__VA_ARGS__)
#define CC_LOG_FATAL(formats, ...) \
    if (cc::gfx::Log::logLevel >= cc::gfx::LogLevel::FATAL) cc::gfx::Log::LogMessage(cc::gfx::LogType::KERNEL, cc::gfx::LogLevel::FATAL, formats, ##__VA_ARGS__)

#define CC_LOG_ERROR(formats, ...)                                      \
    do {                                                                \
        CC_LOG_ERROR_("[ERROR] file %s: line %d ", __FILE__, __LINE__); \
        CC_LOG_ERROR_(formats, ##__VA_ARGS__);                          \
    } while (0)

#endif // CC_CORE_KERNEL_LOG_H_
