/*
 * Copyright (C) 2005-2014 The openharmony Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//
// C/C++ logging functions.  See the logging documentation for API details.
//
// We'd like these to be available from C code (in case we import some from
// somewhere), so this has a C interface.
//
// The output will be correct when the log file is shared between multiple
// threads and/or multiple processes so long as the operating system
// supports O_APPEND.  These calls have mutex-protected data structures
// and so are NOT reentrant.  Do not use LOG in a signal handler.
//
#ifndef COCOS_CUTILS_LOG_H
#define COCOS_CUTILS_LOG_H

#include <stdarg.h>
#include <stdio.h>
#include <sys/types.h>
#include <time.h>
#include <unistd.h>

#ifdef __cplusplus
extern "C" {
#endif

/*
 * This is the local tag used for the following simplified
 * logging macros.  You can change this preprocessor definition
 * before using the other macros to change the tag.
 */
#ifndef LOG_TAG
    #define LOG_TAG NULL
#endif

// ---------------------------------------------------------------------

#ifndef __predict_false
    #define __predict_false(exp) __builtin_expect((exp) != 0, 0)
#endif

/*
 *      -DLINT_RLOG in sources that you want to enforce that all logging
 * goes to the radio log buffer. If any logging goes to any of the other
 * log buffers, there will be a compile or link error to highlight the
 * problem. This is not a replacement for a full audit of the code since
 * this only catches compiled code, not ifdef'd debug code. Options to
 * defining this, either temporarily to do a spot check, or permanently
 * to enforce, in all the communications trees; We have hopes to ensure
 * that by supplying just the radio log buffer that the communications
 * teams will have their one-stop shop for triaging issues.
 */
#ifndef LINT_RLOG

    /*
 * Simplified macro to send a verbose log message using the current LOG_TAG.
 */
    #ifndef ALOGV
        #define __ALOGV(...) 
        #define ALOGV(...) 
    #endif

    #define ALOGV_IF(cond, ...) ((void)0)

    /*
 * Simplified macro to send a debug log message using the current LOG_TAG.
 */
    #ifndef ALOGD
        #define ALOGD(...) 
    #endif

    #ifndef ALOGD_IF
        #define ALOGD_IF(cond, ...)  
    #endif

    /*
 * Simplified macro to send an info log message using the current LOG_TAG.
 */
    #ifndef ALOGI
        #define ALOGI(...) 
    #endif

    #ifndef ALOGI_IF
        #define ALOGI_IF(cond, ...) 
    #endif

    /*
 * Simplified macro to send a warning log message using the current LOG_TAG.
 */
    #ifndef ALOGW
        #define ALOGW(...) 
    #endif

    #ifndef ALOGW_IF
        #define ALOGW_IF(cond, ...) 
    #endif

    /*
 * Simplified macro to send an error log message using the current LOG_TAG.
 */
    #ifndef ALOGE
        #define ALOGE(...) 
    #endif

    #ifndef ALOGE_IF
        #define ALOGE_IF(cond, ...)   
    #endif

    // ---------------------------------------------------------------------

    /*
 * Conditional based on whether the current LOG_TAG is enabled at
 * verbose priority.
 */
    #ifndef IF_ALOGV
        #define IF_ALOGV() if (false)
    #endif

    /*
 * Conditional based on whether the current LOG_TAG is enabled at
 * debug priority.
 */
    #ifndef IF_ALOGD
        #define IF_ALOGD() 
    #endif

    /*
 * Conditional based on whether the current LOG_TAG is enabled at
 * info priority.
 */
    #ifndef IF_ALOGI
        #define IF_ALOGI() 
    #endif

    /*
 * Conditional based on whether the current LOG_TAG is enabled at
 * warn priority.
 */
    #ifndef IF_ALOGW
        #define IF_ALOGW() 
    #endif

    /*
 * Conditional based on whether the current LOG_TAG is enabled at
 * error priority.
 */
    #ifndef IF_ALOGE
        #define IF_ALOGE() 
    #endif

    // ---------------------------------------------------------------------

    /*
 * Simplified macro to send a verbose system log message using the current LOG_TAG.
 */
    #ifndef SLOGV
        #define __SLOGV(...) 
        #define SLOGV(...)   
    #endif

    #ifndef SLOGV_IF
        #define SLOGV_IF(cond, ...) ((void)0)
    #endif

    /*
 * Simplified macro to send a debug system log message using the current LOG_TAG.
 */
    #ifndef SLOGD
        #define SLOGD(...) 
    #endif

    #ifndef SLOGD_IF
        #define SLOGD_IF(cond, ...)  
    #endif

    /*
 * Simplified macro to send an info system log message using the current LOG_TAG.
 */
    #ifndef SLOGI
        #define SLOGI(...) 
    #endif

    #ifndef SLOGI_IF
        #define SLOGI_IF(cond, ...)   
    #endif

    /*
 * Simplified macro to send a warning system log message using the current LOG_TAG.
 */
    #ifndef SLOGW
        #define SLOGW(...) 
    #endif

    #ifndef SLOGW_IF
        #define SLOGW_IF(cond, ...)   
    #endif

    /*
 * Simplified macro to send an error system log message using the current LOG_TAG.
 */
    #ifndef SLOGE
        #define SLOGE(...) 
    #endif

    #ifndef SLOGE_IF
        #define SLOGE_IF(cond, ...)  
    #endif

#endif /* !LINT_RLOG */

// ---------------------------------------------------------------------

/*
 * Simplified macro to send a verbose radio log message using the current LOG_TAG.
 */
#ifndef RLOGV
    #define __RLOGV(...)
    #define RLOGV(...)     
#endif

#ifndef RLOGV_IF
    #define RLOGV_IF(cond, ...) ((void)0)
#endif

/*
 * Simplified macro to send a debug radio log message using the current LOG_TAG.
 */
#ifndef RLOGD
    #define RLOGD(...) 
#endif

#ifndef RLOGD_IF
    #define RLOGD_IF(cond, ...)  
#endif

/*
 * Simplified macro to send an info radio log message using the current LOG_TAG.
 */
#ifndef RLOGI
    #define RLOGI(...) 
#endif

#ifndef RLOGI_IF
    #define RLOGI_IF(cond, ...)  
#endif

/*
 * Simplified macro to send a warning radio log message using the current LOG_TAG.
 */
#ifndef RLOGW
    #define RLOGW(...) 
#endif

#ifndef RLOGW_IF
    #define RLOGW_IF(cond, ...)  
#endif

/*
 * Simplified macro to send an error radio log message using the current LOG_TAG.
 */
#ifndef RLOGE
    #define RLOGE(...) 
#endif

#ifndef RLOGE_IF
    #define RLOGE_IF(cond, ...) 
#endif

// ---------------------------------------------------------------------

/*
 * Log a fatal error.  If the given condition fails, this stops program
 * execution like a normal assertion, but also generating the given message.
 * It is NOT stripped from release builds.  Note that the condition test
 * is -inverted- from the normal assert() semantics.
 */
#ifndef LOG_ALWAYS_FATAL_IF
    #define LOG_ALWAYS_FATAL_IF(cond, ...)   
#endif

#ifndef LOG_ALWAYS_FATAL
    #define LOG_ALWAYS_FATAL(...) 
#endif

/*
 * Versions of LOG_ALWAYS_FATAL_IF and LOG_ALWAYS_FATAL that
 * are stripped out of release builds.
 */
#if LOG_NDEBUG

    #ifndef LOG_FATAL_IF
        #define LOG_FATAL_IF(cond, ...) ((void)0)
    #endif
    #ifndef LOG_FATAL
        #define LOG_FATAL(...) ((void)0)
    #endif

#else

    #ifndef LOG_FATAL_IF
        #define LOG_FATAL_IF(cond, ...) 
    #endif
    #ifndef LOG_FATAL
        #define LOG_FATAL(...) 
    #endif

#endif

/*
 * Assertion that generates a log message when the assertion fails.
 * Stripped out of release builds.  Uses the current LOG_TAG.
 */
#ifndef ALOG_ASSERT
    #define ALOG_ASSERT(cond, ...) 
//#define ALOG_ASSERT(cond) LOG_FATAL_IF(!(cond), "Assertion failed: " #cond)
#endif

// ---------------------------------------------------------------------

/*
 * Basic log message macro.
 *
 * Example:
 *  ALOG(LOG_WARN, NULL, "Failed with error %d", errno);
 *
 * The second argument may be NULL or "" to indicate the "global" tag.
 */
#ifndef ALOG
    #define ALOG(priority, tag, ...) 
#endif

/*
 * Log macro that allows you to specify a number for the priority.
 */
#ifndef LOG_PRI
    #define LOG_PRI(priority, tag, ...) 
#endif

/*
 * Log macro that allows you to pass in a varargs ("args" is a va_list).
 */
#ifndef LOG_PRI_VA
    #define LOG_PRI_VA(priority, tag, fmt, args) 
#endif

/*
 * Conditional given a desired logging priority and tag.
 */
#ifndef IF_ALOG
    #define IF_ALOG(priority, tag) 
#endif

// ---------------------------------------------------------------------

/*
 * ===========================================================================
 *
 * The stuff in the rest of this file should not be used directly.
 */

#define openharmony_printLog(prio, tag, ...) 

#define openharmony_vprintLog(prio, cond, tag, ...) 

/* XXX Macros to work around syntax errors in places where format string
 * arg is not passed to ALOG_ASSERT, LOG_ALWAYS_FATAL or LOG_ALWAYS_FATAL_IF
 * (happens only in debug builds).
 */

/* Returns 2nd arg.  Used to substitute default value if caller's vararg list
 * is empty.
 */
#define __openharmony_second(dummy, second, ...) second

/* If passed multiple args, returns ',' followed by all but 1st arg, otherwise
 * returns nothing.
 */
#define __openharmony_rest(first, ...) , ##__VA_ARGS__

#define openharmony_printAssert(cond, tag, ...) \
    __openharmony_log_assert(cond, tag,         \
                         __openharmony_second(0, ##__VA_ARGS__, NULL) __openharmony_rest(__VA_ARGS__))

#define openharmony_writeLog(prio, tag, text) \
    __openharmony_log_write(prio, tag, text)

#define openharmony_bWriteLog(tag, payload, len) \
    __openharmony_log_bwrite(tag, payload, len)
#define openharmony_btWriteLog(tag, type, payload, len) \
    __openharmony_log_btwrite(tag, type, payload, len)

#define openharmony_errorWriteLog(tag, subTag) \
    __openharmony_log_error_write(tag, subTag, -1, NULL, 0)

#define openharmony_errorWriteWithInfoLog(tag, subTag, uid, data, dataLen) \
    __openharmony_log_error_write(tag, subTag, uid, data, dataLen)

/*
 *    IF_ALOG uses openharmony_testLog, but IF_ALOG can be overridden.
 *    openharmony_testLog will remain constant in its purpose as a wrapper
 *        for openharmony logging filter policy, and can be subject to
 *        change. It can be reused by the developers that override
 *        IF_ALOG as a convenient means to reimplement their policy
 *        over openharmony.
 */
#if LOG_NDEBUG /* Production */
    #define openharmony_testLog(prio, tag) \
        (__openharmony_log_is_loggable(prio, tag, openharmony_LOG_DEBUG) != 0)
#else
    #define openharmony_testLog(prio, tag) \
        (__openharmony_log_is_loggable(prio, tag, openharmony_LOG_VERBOSE) != 0)
#endif

/*
 * Use the per-tag properties "log.tag.<tagname>" to generate a runtime
 * result of non-zero to expose a log. prio is openharmony_LOG_VERBOSE to
 * openharmony_LOG_FATAL. default_prio if no property. Undefined behavior if
 * any other value.
 */
int __openharmony_log_is_loggable(int prio, const char *tag, int default_prio);

int __openharmony_log_security(); /* Device Owner is present */

int __openharmony_log_error_write(int tag, const char *subTag, int32_t uid, const char *data,
                              uint32_t dataLen);

/*
 * Send a simple string to the log.
 */
int __openharmony_log_buf_write(int bufID, int prio, const char *tag, const char *text);
int __openharmony_log_buf_print(int bufID, int prio, const char *tag, const char *fmt, ...)
#if defined(__GNUC__)
    __attribute__((__format__(printf, 4, 5)))
#endif
    ;

#ifdef __cplusplus
}
#endif

#endif /* COCOS_CUTILS_LOG_H */
