#include "config.hpp"
#include <stdio.h>
#include <algorithm>

#if defined(_WIN32) && defined(_WINDOWS)

#include <windows.h>

static void _winLog(const char *format, va_list args)
{
    static const int MAX_LOG_LENGTH = 16 * 1024;
    int bufferSize = MAX_LOG_LENGTH;
    char* buf = nullptr;

    do
    {
        buf = new (std::nothrow) char[bufferSize];
        if (buf == nullptr)
            return; // not enough memory

        int ret = vsnprintf(buf, bufferSize - 3, format, args);
        if (ret < 0)
        {
            bufferSize *= 2;

            delete[] buf;
        }
        else
            break;

    } while (true);

    int pos = 0;
    int len = strlen(buf);
    char tempBuf[MAX_LOG_LENGTH + 1] = { 0 };
    WCHAR wszBuf[MAX_LOG_LENGTH + 1] = { 0 };

    do
    {
        std::copy(buf + pos, buf + pos + MAX_LOG_LENGTH, tempBuf);

        tempBuf[MAX_LOG_LENGTH] = 0;

        MultiByteToWideChar(CP_UTF8, 0, tempBuf, -1, wszBuf, sizeof(wszBuf));
        OutputDebugStringW(wszBuf);
        WideCharToMultiByte(CP_ACP, 0, wszBuf, -1, tempBuf, sizeof(tempBuf), nullptr, FALSE);
        printf("%s", tempBuf);

        pos += MAX_LOG_LENGTH;

    } while (pos < len);

    fflush(stdout);
    delete[] buf;
}

void seLog(const char * format, ...)
{
    va_list args;
    va_start(args, format);
    _winLog(format, args);
    va_end(args);
}

#endif // #if defined(_WIN32) && defined(_WINDOWS)
