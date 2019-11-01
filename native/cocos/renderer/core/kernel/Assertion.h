#ifndef CC_CORE_KERNEL_ASSERTION_H_
#define CC_CORE_KERNEL_ASSERTION_H_

NS_CC_BEGIN

//#if defined(__GNUC__)
#if 0
#define LIKELY(x)   (__builtin_expect(!!(x), 1))
#define UNLIKELY(x) (__builtin_expect(!!(x), 0))
#else
#define LIKELY(x)   (x)
#define UNLIKELY(x) (x)
#endif

CC_CORE_API int  _ExecAssert(const char *condition, const char *fileName, int lineNumber, const char *formats, ...);
CC_CORE_API void _ExecAssertOutput(const char *condition, const char *fileName, int lineNumber, const char* msg);

//#if (CC_MODE == CC_MODE_DEBUG)
//#   if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
//#      define CCASSERT(x, formats, ...) if(UNLIKELY(!(x))) {if(cocos2d::_ExecAssert(#x, __FILE__, __LINE__, formats, ##__VA_ARGS__)) __debugbreak();}
//#   else
//#      define CCASSERT(x, formats, ...) if(UNLIKELY(!(x))) {cocos2d::_ExecAssert(#x, __FILE__, __LINE__, formats, ##__VA_ARGS__); assert(x);}
//#   endif
//#else
//#   define CCASSERT(x, formats, ...) if(UNLIKELY(!(x))) {cocos2d::_ExecAssertOutput(#x, __FILE__, __LINE__, "");}
//#endif

//#define CCASSERT(x) CCASSERT(x, "%s", "")

NS_CC_END

#endif // CC_CORE_KERNEL_ASSERTION_H_
