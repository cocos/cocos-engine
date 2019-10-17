#ifndef CC_CORE_KERNEL_UTIL_STRING_UTIL_H_
#define CC_CORE_KERNEL_UTIL_STRING_UTIL_H_

CC_NAMESPACE_BEGIN

class CC_CORE_API StringUtil {
 public:
	static int VPrintf(char* buf, char* last, const char* fmt, va_list args);
	static int Printf(char* buf, char* last, const char* fmt, ...);
	static String Format(const char* fmt, ...);
  static StringArray Split(const String &str, const String &delims, uint max_splits = 0);
};

CC_NAMESPACE_END

#endif // CC_CORE_KERNEL_UTIL_STRING_UTIL_H_
