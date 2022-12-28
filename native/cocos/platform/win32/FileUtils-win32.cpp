/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "platform/win32/FileUtils-win32.h"
#include <Shlobj.h>
#include <cstdlib>
#include <regex>
#include <sstream>
#include "base/Log.h"
#include "base/memory/Memory.h"
#include "platform/win32/Utils-win32.h"

using namespace std;

namespace cc {

#define CC_MAX_PATH 512

// The root path of resources, the character encoding is UTF-8.
// UTF-8 is the only encoding supported by cocos2d-x API.
static ccstd::string s_resourcePath = "";

// D:\aaa\bbb\ccc\ddd\abc.txt --> D:/aaa/bbb/ccc/ddd/abc.txt
static inline ccstd::string convertPathFormatToUnixStyle(const ccstd::string &path) {
    ccstd::string ret = path;
    size_t len = ret.length();
    for (size_t i = 0; i < len; ++i) {
        if (ret[i] == '\\') {
            ret[i] = '/';
        }
    }
    return ret;
}

static void _checkPath() {
    if (s_resourcePath.empty()) {
        WCHAR utf16Path[CC_MAX_PATH] = {0};
        GetModuleFileNameW(NULL, utf16Path, CC_MAX_PATH - 1);
        WCHAR *pUtf16ExePath = &(utf16Path[0]);

        // We need only directory part without exe
        WCHAR *pUtf16DirEnd = wcsrchr(pUtf16ExePath, L'\\');

        char utf8ExeDir[CC_MAX_PATH] = {0};
        int nNum = WideCharToMultiByte(CP_UTF8, 0, pUtf16ExePath, static_cast<int>(pUtf16DirEnd - pUtf16ExePath + 1), utf8ExeDir, sizeof(utf8ExeDir), nullptr, nullptr);

        s_resourcePath = convertPathFormatToUnixStyle(utf8ExeDir);
    }
}

FileUtils *createFileUtils() {
    // TODO(qgh):In the simulator, it will be called twice. So the judgment here is to prevent memory leaks.
    // But this is equivalent to using a singleton pattern,
    // which is not consistent with the current design and will be optimized later.
    if (!FileUtils::getInstance()) {
        return ccnew FileUtilsWin32();
    }
    return FileUtils::getInstance();
}

FileUtilsWin32::FileUtilsWin32() {
    init();
}

bool FileUtilsWin32::init() {
    _checkPath();
    _defaultResRootPath = s_resourcePath;
    return FileUtils::init();
}

bool FileUtilsWin32::isDirectoryExistInternal(const ccstd::string &dirPath) const {
    unsigned long fAttrib = GetFileAttributes(StringUtf8ToWideChar(dirPath).c_str());
    if (fAttrib != INVALID_FILE_ATTRIBUTES &&
        (fAttrib & FILE_ATTRIBUTE_DIRECTORY)) {
        return true;
    }
    return false;
}

ccstd::string FileUtilsWin32::getSuitableFOpen(const ccstd::string &filenameUtf8) const {
    return UTF8StringToMultiByte(filenameUtf8);
}

long FileUtilsWin32::getFileSize(const ccstd::string &filepath) {
    WIN32_FILE_ATTRIBUTE_DATA fad;
    if (!GetFileAttributesEx(StringUtf8ToWideChar(filepath).c_str(), GetFileExInfoStandard, &fad)) {
        return 0; // error condition, could call GetLastError to find out more
    }
    LARGE_INTEGER size;
    size.HighPart = fad.nFileSizeHigh;
    size.LowPart = fad.nFileSizeLow;
    return (long)size.QuadPart;
}

bool FileUtilsWin32::isFileExistInternal(const ccstd::string &strFilePath) const {
    if (strFilePath.empty()) {
        return false;
    }

    ccstd::string strPath = strFilePath;
    if (!isAbsolutePath(strPath)) { // Not absolute path, add the default root path at the beginning.
        strPath.insert(0, _defaultResRootPath);
    }

    DWORD attr = GetFileAttributesW(StringUtf8ToWideChar(strPath).c_str());
    if (attr == INVALID_FILE_ATTRIBUTES || (attr & FILE_ATTRIBUTE_DIRECTORY))
        return false; //  not a file
    return true;
}

bool FileUtilsWin32::isAbsolutePath(const ccstd::string &strPath) const {
    if ((strPath.length() > 2 && ((strPath[0] >= 'a' && strPath[0] <= 'z') || (strPath[0] >= 'A' && strPath[0] <= 'Z')) && strPath[1] == ':') || (strPath[0] == '/' && strPath[1] == '/')) {
        return true;
    }
    return false;
}

FileUtils::Status FileUtilsWin32::getContents(const ccstd::string &filename, ResizableBuffer *buffer) {
    if (filename.empty())
        return FileUtils::Status::NOT_EXISTS;

    // read the file from hardware
    ccstd::string fullPath = FileUtils::getInstance()->fullPathForFilename(filename);

    HANDLE fileHandle = ::CreateFile(StringUtf8ToWideChar(fullPath).c_str(), GENERIC_READ, FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING, NULL, nullptr);
    if (fileHandle == INVALID_HANDLE_VALUE)
        return FileUtils::Status::OPEN_FAILED;

    DWORD hi;
    auto size = ::GetFileSize(fileHandle, &hi);
    if (hi > 0) {
        ::CloseHandle(fileHandle);
        return FileUtils::Status::TOO_LARGE;
    }
    // don't read file content if it is empty
    if (size == 0) {
        ::CloseHandle(fileHandle);
        return FileUtils::Status::OK;
    }

    buffer->resize(size);
    DWORD sizeRead = 0;
    BOOL successed = ::ReadFile(fileHandle, buffer->buffer(), size, &sizeRead, nullptr);
    ::CloseHandle(fileHandle);

    if (!successed) {
        CC_LOG_DEBUG("Get data from file(%s) failed, error code is %s", filename.data(), std::to_string(::GetLastError()).data());
        buffer->resize(sizeRead);
        return FileUtils::Status::READ_FAILED;
    }
    return FileUtils::Status::OK;
}

ccstd::string FileUtilsWin32::getPathForFilename(const ccstd::string &filename, const ccstd::string &searchPath) const {
    ccstd::string unixFileName = convertPathFormatToUnixStyle(filename);
    ccstd::string unixSearchPath = convertPathFormatToUnixStyle(searchPath);

    return FileUtils::getPathForFilename(unixFileName, unixSearchPath);
}

ccstd::string FileUtilsWin32::getFullPathForDirectoryAndFilename(const ccstd::string &strDirectory, const ccstd::string &strFilename) const {
    ccstd::string unixDirectory = convertPathFormatToUnixStyle(strDirectory);
    ccstd::string unixFilename = convertPathFormatToUnixStyle(strFilename);

    return FileUtils::getFullPathForDirectoryAndFilename(unixDirectory, unixFilename);
}

string FileUtilsWin32::getWritablePath() const {
    if (_writablePath.length()) {
        return _writablePath;
    }

    // Get full path of executable, e.g. c:\Program Files (x86)\My Game Folder\MyGame.exe
    WCHAR full_path[CC_MAX_PATH + 1] = {0};
    ::GetModuleFileName(nullptr, full_path, CC_MAX_PATH + 1);

    // Debug app uses executable directory; Non-debug app uses local app data directory
    //#ifndef _DEBUG
    // Get filename of executable only, e.g. MyGame.exe
    WCHAR *base_name = wcsrchr(full_path, '\\');
    wstring retPath;
    if (base_name) {
        WCHAR app_data_path[CC_MAX_PATH + 1];

        // Get local app data directory, e.g. C:\Documents and Settings\username\Local Settings\Application Data
        if (SUCCEEDED(SHGetFolderPath(nullptr, CSIDL_LOCAL_APPDATA, nullptr, SHGFP_TYPE_CURRENT, app_data_path))) {
            wstring ret(app_data_path);

            // Adding executable filename, e.g. C:\Documents and Settings\username\Local Settings\Application Data\MyGame.exe
            ret += base_name;

            // Remove ".exe" extension, e.g. C:\Documents and Settings\username\Local Settings\Application Data\MyGame
            ret = ret.substr(0, ret.rfind(L"."));

            ret += L"\\";

            // Create directory
            if (SUCCEEDED(SHCreateDirectoryEx(nullptr, ret.c_str(), nullptr))) {
                retPath = ret;
            }
        }
    }
    if (retPath.empty())
    //#endif // not defined _DEBUG
    {
        // If fetching of local app data directory fails, use the executable one
        retPath = full_path;

        // remove xxx.exe
        retPath = retPath.substr(0, retPath.rfind(L"\\") + 1);
    }

    return convertPathFormatToUnixStyle(StringWideCharToUtf8(retPath));
}

bool FileUtilsWin32::renameFile(const ccstd::string &oldfullpath, const ccstd::string &newfullpath) {
    CC_ASSERT(!oldfullpath.empty());
    CC_ASSERT(!newfullpath.empty());

    std::wstring _wNew = StringUtf8ToWideChar(newfullpath);
    std::wstring _wOld = StringUtf8ToWideChar(oldfullpath);

    if (FileUtils::getInstance()->isFileExist(newfullpath)) {
        if (!DeleteFile(_wNew.c_str())) {
            CC_LOG_ERROR("Fail to delete file %s !Error code is 0x%x", newfullpath.c_str(), GetLastError());
        }
    }

    if (MoveFile(_wOld.c_str(), _wNew.c_str())) {
        return true;
    } else {
        CC_LOG_ERROR("Fail to rename file %s to %s !Error code is 0x%x", oldfullpath.c_str(), newfullpath.c_str(), GetLastError());
        return false;
    }
}

bool FileUtilsWin32::renameFile(const ccstd::string &path, const ccstd::string &oldname, const ccstd::string &name) {
    CC_ASSERT(!path.empty());
    ccstd::string oldPath = path + oldname;
    ccstd::string newPath = path + name;

    std::regex pat("\\/");
    ccstd::string _old = std::regex_replace(oldPath, pat, "\\");
    ccstd::string _new = std::regex_replace(newPath, pat, "\\");

    return renameFile(_old, _new);
}

bool FileUtilsWin32::createDirectory(const ccstd::string &dirPath) {
    CC_ASSERT(!dirPath.empty());

    if (isDirectoryExist(dirPath))
        return true;

    std::wstring path = StringUtf8ToWideChar(dirPath);

    // Split the path
    size_t start = 0;
    size_t found = path.find_first_of(L"/\\", start);
    std::wstring subpath;
    ccstd::vector<std::wstring> dirs;

    if (found != std::wstring::npos) {
        while (true) {
            subpath = path.substr(start, found - start + 1);
            if (!subpath.empty())
                dirs.push_back(subpath);
            start = found + 1;
            found = path.find_first_of(L"/\\", start);
            if (found == std::wstring::npos) {
                if (start < path.length()) {
                    dirs.push_back(path.substr(start));
                }
                break;
            }
        }
    }

    if ((GetFileAttributes(path.c_str())) == INVALID_FILE_ATTRIBUTES) {
        subpath = L"";
        for (unsigned int i = 0; i < dirs.size(); ++i) {
            subpath += dirs[i];

            ccstd::string utf8Path = StringWideCharToUtf8(subpath);
            if (!isDirectoryExist(utf8Path)) {
                BOOL ret = CreateDirectory(subpath.c_str(), NULL);
                if (!ret && ERROR_ALREADY_EXISTS != GetLastError()) {
                    CC_LOG_ERROR("Fail create directory %s !Error code is 0x%x", utf8Path.c_str(), GetLastError());
                    return false;
                }
            }
        }
    }
    return true;
}

bool FileUtilsWin32::removeFile(const ccstd::string &filepath) {
    std::regex pat("\\/");
    ccstd::string win32path = std::regex_replace(filepath, pat, "\\");

    if (DeleteFile(StringUtf8ToWideChar(win32path).c_str())) {
        return true;
    } else {
        CC_LOG_ERROR("Fail remove file %s !Error code is 0x%x", filepath.c_str(), GetLastError());
        return false;
    }
}

bool FileUtilsWin32::removeDirectory(const ccstd::string &dirPath) {
    std::wstring wpath = StringUtf8ToWideChar(dirPath);
    std::wstring files = wpath + L"*.*";
    WIN32_FIND_DATA wfd;
    HANDLE search = FindFirstFileEx(files.c_str(), FindExInfoStandard, &wfd, FindExSearchNameMatch, NULL, 0);
    bool ret = true;
    if (search != INVALID_HANDLE_VALUE) {
        BOOL find = true;
        while (find) {
            // Need check string . and .. for delete folders and files begin name.
            std::wstring fileName = wfd.cFileName;
            if (fileName != L"." && fileName != L"..") {
                std::wstring temp = wpath + wfd.cFileName;
                if (wfd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) {
                    temp += '/';
                    ret = ret && this->removeDirectory(StringWideCharToUtf8(temp));
                } else {
                    SetFileAttributes(temp.c_str(), FILE_ATTRIBUTE_NORMAL);
                    ret = ret && DeleteFile(temp.c_str());
                }
            }
            find = FindNextFile(search, &wfd);
        }
        FindClose(search);
    }
    if (ret && RemoveDirectory(wpath.c_str())) {
        return true;
    }
    return false;
}

} // namespace cc
