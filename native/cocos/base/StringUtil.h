#ifndef CC_CORE_KERNEL_UTIL_STRING_UTIL_H_
#define CC_CORE_KERNEL_UTIL_STRING_UTIL_H_

#include "Macros.h"
#include "TypeDef.h"

namespace cc {

class CC_DLL StringUtil {
public:
    static int VPrintf(char *buf, char *last, const char *fmt, va_list args);
    static int Printf(char *buf, char *last, const char *fmt, ...);
    static String Format(const char *fmt, ...);
    static StringArray Split(const String &str, const String &delims, uint max_splits = 0);
};

} // namespace cc

#endif // CC_CORE_KERNEL_UTIL_STRING_UTIL_H_
