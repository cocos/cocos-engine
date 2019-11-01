#ifndef CC_CORE_KERNEL_LOG_H_
#define CC_CORE_KERNEL_LOG_H_

NS_CC_BEGIN

enum class LogType: uint8_t {
  KERNEL,
  SCRIPT,
  COUNT,
};

enum class LogLevel: uint8_t {
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
  static CC_INLINE FILE* log_file() { return log_file_; }
  static void set_log_file(const std::string& filename);
  static void Close();
  static void LogMessage(LogType type, LogLevel level, const char* formats, ...);
  
 private:
  static FILE* log_file_;
};

NS_CC_END

#define CC_LOG_DEBUG(formats, ...)   if(cocos2d::Log::log_level >= cocos2d::LogLevel::DEBUG) cocos2d::Log::LogMessage(cocos2d::LogType::KERNEL, cocos2d::LogLevel::DEBUG, formats, ##__VA_ARGS__)
#define CC_LOG_INFO(formats, ...)    if(cocos2d::Log::log_level >= cocos2d::LogLevel::INFO) cocos2d::Log::LogMessage(cocos2d::LogType::KERNEL, cocos2d::LogLevel::INFO, formats, ##__VA_ARGS__)
#define CC_LOG_WARNING(formats, ...) if(cocos2d::Log::log_level >= cocos2d::LogLevel::WARN) cocos2d::Log::LogMessage(cocos2d::LogType::KERNEL, cocos2d::LogLevel::WARN, formats, ##__VA_ARGS__)
#define CC_LOG_ERROR(formats, ...)   if(cocos2d::Log::log_level >= cocos2d::LogLevel::ERR) cocos2d::Log::LogMessage(cocos2d::LogType::KERNEL, cocos2d::LogLevel::ERR, formats, ##__VA_ARGS__)
#define CC_LOG_FATAL(formats, ...)   if(cocos2d::Log::m_logLevel >= cocos2d::LogLevel::FATAL) cocos2d::Log::LogMessage(cocos2d::LogType::KERNEL, cocos2d::LogLevel::FATAL, formats, ##__VA_ARGS__)

#endif // CC_CORE_KERNEL_LOG_H_
