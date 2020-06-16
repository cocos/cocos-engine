#include "base/ccMacros.h"

#ifndef CC_CORE_CORE_DEF_H_
    #define CC_CORE_CORE_DEF_H_

    // Initial compiler-related stuff to set.
    #define CC_COMPILER_MSVC  1
    #define CC_COMPILER_CLANG 2
    #define CC_COMPILER_GNUC  3

    // CPU Architecture
    #define CC_CPU_UNKNOWN 0
    #define CC_CPU_X86     1
    #define CC_CPU_PPC     2
    #define CC_CPU_ARM     3
    #define CC_CPU_MIPS    4

    // 32-bits or 64-bits CPU
    #define CC_CPU_ARCH_32 1
    #define CC_CPU_ARCH_64 2

    // Endian
    #define CC_ENDIAN_LITTLE 1
    #define CC_ENDIAN_BIG    2

    // Charset
    #define CC_CHARSET_UNICODE   1
    #define CC_CHARSET_MULTIBYTE 2

    // Precision
    #define CC_PRECISION_FLOAT  1
    #define CC_PRECISION_DOUBLE 2

    // Mode
    #define CC_MODE_DEBUG   1
    #define CC_MODE_RELEASE 2

    // Memory Allocator
    #define CC_MEMORY_ALLOCATOR_STD        0
    #define CC_MEMORY_ALLOCATOR_NEDPOOLING 1
    #define CC_MEMORY_ALLOCATOR_JEMALLOC   2

    // STL Memory Allocator
    #define CC_STL_MEMORY_ALLOCATOR_STANDARD 1
    #define CC_STL_MEMORY_ALLOCATOR_CUSTOM   2

    // Compiler type and version recognition
    #if defined(_MSC_VER)
        #define CC_COMPILER CC_COMPILER_MSVC
        #if _MSC_VER >= 1900
            #define CC_COMPILER_VERSION 130
        #elif _MSC_VER >= 1800
            #define CC_COMPILER_VERSION 120
        #elif _MSC_VER >= 1700
            #define CC_COMPILER_VERSION 110
        #elif _MSC_VER >= 1600
            #define CC_COMPILER_VERSION 100
        #elif _MSC_VER >= 1500
            #define CC_COMPILER_VERSION 90
        #elif _MSC_VER >= 1400
            #define CC_COMPILER_VERSION 80
        #elif _MSC_VER >= 1300
            #define CC_COMPILER_VERSION 70
        #endif
    #elif defined(__clang__)
        #define CC_COMPILER         CC_COMPILER_CLANG
        #define CC_COMPILER_VERSION (((__clang_major__)*100) + (__clang_minor__ * 10) + __clang_patchlevel__)
    #elif defined(__GNUC__)
        #define CC_COMPILER         CC_COMPILER_GNUC
        #define CC_COMPILER_VERSION (((__GNUC__)*100) + (__GNUC_MINOR__ * 10) + __GNUC_PATCHLEVEL__)
    #else
        #error "Unknown compiler. Abort!"
    #endif

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        #define CC_ENDIAN CC_ENDIAN_LITTLE
    #else
        #if (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
            #include <machine/endian.h>
        #else
            #include <endian.h>
        #endif // (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
        #
        #if __BYTE_ORDER == __LITTLE_ENDIAN
            #define CC_ENDIAN CC_ENDIAN_LITTLE
        #else
            #define CC_ENDIAN CC_ENDIAN_BIG
        #endif //__BYTE_ORDER == __LITTLE_ENDIAN
    #endif

    // CPU architecture type recognition
    #if (defined(_MSC_VER) && (defined(_M_IX86) || defined(_M_X64))) || (defined(__GNUC__) && (defined(__i386__) || defined(__x86_64__)))
        #define CC_CPU CC_CPU_X86
    #elif CC_PLATFORM == CC_PLATFORM_MAC_OSX && CC_ENDIAN == CC_ENDIAN_BIG
        #define CC_CPU CC_CPU_PPC
    #elif CC_PLATFORM == CC_PLATFORM_MAC_OSX
        #define COCOS_CPU CC_CPU_X86
    #elif CC_PLATFORM == CC_PLATFORM_MAC_IOS && (defined(__i386__) || defined(__x86_64__))
        #define CC_CPU CC_CPU_X86
    #elif defined(__arm__) || defined(_M_ARM) || defined(__arm64__) || defined(_aarch64_)
        #define CC_CPU CC_CPU_ARM
    #elif defined(__mips64) || defined(__mips64_)
        #define CC_CPU CC_CPU_MIPS
    #else
        #define CC_CPU CC_CPU_UNKNOWN
    #endif

    #if defined(__x86_64__) || defined(_M_X64) || defined(__powerpc64__) || defined(__alpha__) || defined(__ia64__) || defined(__s390__) || defined(__s390x__) || defined(__arm64__) || defined(_aarch64_) || defined(__mips64) || defined(__mips64_)
        #define CC_CPU_ARCH CC_CPU_ARCH_64
    #else
        #define CC_CPU_ARCH CC_CPU_ARCH_32
    #endif

    #if (__cplusplus >= 201103L)
        #define CC_C11
        #define register
    #endif

    // C11 features
    #if (CC_COMPILER == CC_COMPILER_MSVC)
        #if (_MSC_VER >= 1700)
            #define CC_C11_TYPED_ENUMS
        #endif
    #elif (CC_COMPILER == CC_COMPILER_GNUC)
        #if (__GNUC_MINOR__ >= 4)
            #define CC_C11_TYPED_ENUMS
        #endif
    #endif

    // Disable MSVC warning
    #if (CC_COMPILER == CC_COMPILER_MSVC)
        #pragma warning(disable : 4251 4275 4819)
        #ifndef _CRT_SECURE_NO_DEPRECATE
            #define _CRT_SECURE_NO_DEPRECATE
        #endif
        #ifndef _SCL_SECURE_NO_DEPRECATE
            #define _SCL_SECURE_NO_DEPRECATE
        #endif
    #endif

    // Charset Settings
    #if defined(_UNICODE) || defined(UNICODE)
        #define CC_CHARSET CC_CHARSET_UNICODE
    #else
        #define CC_CHARSET CC_CHARSET_MULTIBYTE
    #endif

    #if CC_COMPILER == CC_COMPILER_MSVC
        #if CC_COMPILER_VERSION >= 120
            #define CC_INLINE __forceinline
        #else
            #define CC_INLINE inline
        #endif
    #elif defined(__MINGW32__)
        #if !defined(CC_INLINE)
            #define CC_INLINE __inline
        #endif
    #elif !defined(ANDROID) && (CC_COMPILER == CC_COMPILER_GNUC || CC_COMPILER == CC_COMPILER_CLANG)
        #define CC_INLINE inline __attribute__((always_inline))
    #else
        #define CC_INLINE __inline
    #endif

    // Asserts expression is true at compile-time
    #define CC_COMPILER_ASSERT(x) typedef int COMPILER_ASSERT_[!!(x)]

    #if (CC_COMPILER == CC_COMPILER_MSVC)
        #define CC_RESTRICT __restrict //MSVC
    #else
        #define CC_RESTRICT __restrict__ //GCC... and others?
    #endif

    #define CC_CACHELINE_SIZE 64

    #if (CC_COMPILER == CC_COMPILER_MSVC)
        // MSVC ENABLE/DISABLE WARNING DEFINITION
        #define CC_DISABLE_WARNINGS() \
            __pragma(warning(push, 0))

        #define CC_ENABLE_WARNINGS() \
            __pragma(warning(pop))
    #elif (CC_COMPILER == CC_COMPILER_GNUC)
        // GCC ENABLE/DISABLE WARNING DEFINITION
        #define CC_DISABLE_WARNINGS()                               \
            _Pragma("GCC diagnostic push")                          \
                _Pragma("GCC diagnostic ignored \"-Wall\"")         \
                    _Pragma("clang diagnostic ignored \"-Wextra\"") \
                        _Pragma("clang diagnostic ignored \"-Wtautological-compare\"")

        #define CC_ENABLE_WARNINGS() \
            _Pragma("GCC diagnostic pop")
    #elif (CC_COMPILER == CC_COMPILER_CLANG)
        // CLANG ENABLE/DISABLE WARNING DEFINITION
        #define CC_DISABLE_WARNINGS()                               \
            _Pragma("clang diagnostic push")                        \
                _Pragma("clang diagnostic ignored \"-Wall\"")       \
                    _Pragma("clang diagnostic ignored \"-Wextra\"") \
                        _Pragma("clang diagnostic ignored \"-Wtautological-compare\"")

        #define CC_ENABLE_WARNINGS() \
            _Pragma("clang diagnostic pop")
    #endif

    #if (CC_COMPILER == CC_COMPILER_MSVC)
        #define CC_ALIGN(N)        __declspec(align(N))
        #define CC_CACHE_ALIGN     __declspec(align(CC_CACHELINE_SIZE))
        #define CC_PACKED_ALIGN(N) __declspec(align(N))

        #define CC_ALIGNED_DECL(type, var, alignment) __declspec(align(alignment)) type var

        #define CC_READ_COMPILER_BARRIER()  _ReadBarrier()
        #define CC_WRITE_COMPILER_BARRIER() _WriteBarrier()
        #define CC_COMPILER_BARRIER()       _ReadWriteBarrier()

        #define CC_READ_MEMORY_BARRIER()  MemoryBarrier()
        #define CC_WRITE_MEMORY_BARRIER() MemoryBarrier()
        #define CC_MEMORY_BARRIER()       MemoryBarrier()

        #define CC_CPU_READ_MEMORY_BARRIER() \
            do {                             \
                __asm { lfence}               \
            } while (0)
        #define CC_CPU_WRITE_MEMORY_BARRIER() \
            do {                              \
                __asm { sfence}                \
            } while (0)
        #define CC_CPU_MEMORY_BARRIER() \
            do {                        \
                __asm { mfence}          \
            } while (0)

    #elif (CC_COMPILER == CC_COMPILER_GNUC) || (CC_COMPILER == CC_COMPILER_CLANG)
        #define CC_ALIGN(N)        __attribute__((__aligned__((N))))
        #define CC_CACHE_ALIGN     __attribute__((__aligned__((CC_CACHELINE_SIZE))))
        #define CC_PACKED_ALIGN(N) __attribute__((packed, aligned(N)))

        #define CC_ALIGNED_DECL(type, var, alignment) type var __attribute__((__aligned__(alignment)))

        #define CC_READ_COMPILER_BARRIER()        \
            do {                                  \
                __asm__ __volatile__(""           \
                                     :            \
                                     :            \
                                     : "memory"); \
            } while (0)
        #define CC_WRITE_COMPILER_BARRIER()       \
            do {                                  \
                __asm__ __volatile__(""           \
                                     :            \
                                     :            \
                                     : "memory"); \
            } while (0)
        #define CC_COMPILER_BARRIER()             \
            do {                                  \
                __asm__ __volatile__(""           \
                                     :            \
                                     :            \
                                     : "memory"); \
            } while (0)

        #define CC_READ_MEMORY_BARRIER() \
            do {                         \
                __sync_synchronize();    \
            } while (0)
        #define CC_WRITE_MEMORY_BARRIER() \
            do {                          \
                __sync_synchronize();     \
            } while (0)
        #define CC_MEMORY_BARRIER()   \
            do {                      \
                __sync_synchronize(); \
            } while (0)

        #define CC_CPU_READ_MEMORY_BARRIER()      \
            do {                                  \
                __asm__ __volatile__("lfence"     \
                                     :            \
                                     :            \
                                     : "memory"); \
            } while (0)
        #define CC_CPU_WRITE_MEMORY_BARRIER()     \
            do {                                  \
                __asm__ __volatile__("sfence"     \
                                     :            \
                                     :            \
                                     : "memory"); \
            } while (0)
        #define CC_CPU_MEMORY_BARRIER()           \
            do {                                  \
                __asm__ __volatile__("mfence"     \
                                     :            \
                                     :            \
                                     : "memory"); \
            } while (0)

    #else
        #error "Unsupported compiler!"
    #endif

    #define CC_SIMD_ALIGNMENT 16

    #if (CC_COMPILER == CC_COMPILER_MSVC)
        #define CC_DECL_MALLOC __declspec(restrict) __declspec(noalias)
    #else
        #define CC_DECL_MALLOC __attribute__((malloc))
    #endif

    /* Stack-alignment
If macro __CC_SIMD_ALIGN_STACK defined, means there requests
special code to ensure stack align to a 16-bytes boundary.
	
Note:
	This macro can only guarantee callee stack pointer (esp) align
	to a 16-bytes boundary, but not that for frame pointer (ebp).
	Because most compiler might use frame pointer to access to stack
	variables, so you need to wrap those alignment required functions
	with extra function call.
*/
    #if defined(__INTEL_COMPILER)
        // For intel's compiler, simply calling alloca seems to do the right
        // thing. The size of the allocated block seems to be irrelevant.
        #define CC_SIMD_ALIGN_STACK() _alloca(16)
        #define CC_SIMD_ALIGN_ATTRIBUTE

    #elif (CC_CPU == CC_CPU_X86) && (CC_COMPILER == CC_COMPILER_GNUC || CC_COMPILER == CC_COMPILER_CLANG) && (CC_CPU_ARCH != CC_CPU_ARCH_64)
        // mark functions with GCC attribute to force stack alignment to 16 bytes
        #define CC_SIMD_ALIGN_ATTRIBUTE __attribute__((force_align_arg_pointer))
    #elif (CC_COMPILER == CC_COMPILER_MSVC)
        // Fortunately, MSVC will align the stack automatically
        #define CC_SIMD_ALIGN_ATTRIBUTE
    #else
        #define CC_SIMD_ALIGN_ATTRIBUTE
    #endif

    #if defined(__GNUC__)
        #define CC_FUNC ((const char *)(__PRETTY_FUNCTION__))
    #elif defined(__STDC_VERSION__) && __STDC_VERSION__ >= 19901L
        #define CC_FUNC ((const char *)(__func__))
    #else
        #define CC_FUNC ((const char *)(__FUNCTION__))
    #endif

    // mode
    #if (defined(_DEBUG) || defined(DEBUG)) && (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        #define CC_MODE CC_MODE_DEBUG
    #else
        #define CC_MODE CC_MODE_RELEASE
    #endif

    // Engine Memory Management
    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        #if (CC_MODE == CC_MODE_DEBUG)
            #define CC_MEMORY_TRACKER
        #endif
    #elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    //#    define CC_MEMORY_TRACKER
    #else
    #endif

    // use simd
    //#define CC_USE_SIMD

    // Memory Allocator
    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        #define CC_MEMORY_ALLOCATOR CC_MEMORY_ALLOCATOR_STD
        #undef CC_MEMORY_TRACKER
    //#if defined(CC_MEMORY_TRACKER)
    //#    define CC_MEMORY_ALLOCATOR  CC_MEMORY_ALLOCATOR_JEMALLOC
    //#else
    //#    define CC_MEMORY_ALLOCATOR  CC_MEMORY_ALLOCATOR_STD
    //#endif
    #elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
        #if defined(CC_MEMORY_TRACKER)
            #define CC_MEMORY_ALLOCATOR CC_MEMORY_ALLOCATOR_JEMALLOC
        #else
            #define CC_MEMORY_ALLOCATOR CC_MEMORY_ALLOCATOR_STD
        #endif
    #else
        #define CC_MEMORY_ALLOCATOR CC_MEMORY_ALLOCATOR_STD
    #endif

    // STL memory allocator
    #if (CC_MEMORY_ALLOCATOR == CC_MEMORY_ALLOCATOR_STD)
        #define CC_STL_MEMORY_ALLOCATOR CC_STL_MEMORY_ALLOCATOR_STANDARD
    #else
        #define CC_STL_MEMORY_ALLOCATOR CC_STL_MEMORY_ALLOCATOR_CUSTOM
    #endif

    #define CC_TOSTR(s) #s

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        #ifdef CC_STATIC
            #define CC_CORE_API
        #else
            #ifdef CC_CORE_EXPORTS
                #define CC_CORE_API __declspec(dllexport)
            #else
                #define CC_CORE_API __declspec(dllimport)
            #endif
        #endif
    #else
        #define CC_CORE_API
    #endif

#endif // CC_CORE_CORE_DEF_H_
