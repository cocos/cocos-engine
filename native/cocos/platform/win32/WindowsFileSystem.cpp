
/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "cocos/platform/win32/WindowsFileSystem.h"
#include <ShlObj.h>
#include <Windows.h>
#include "cocos/base/Log.h"
#include "cocos/platform/win32/WindowsFileHandle.h"
#include "cocos/platform/win32/Utils-win32.h"

namespace cc {
constexpr int kMaxPath = 512;
// The root path of resources, the character encoding is UTF-8.
// UTF-8 is the only encoding supported by cocos2d-x API.
static ccstd::string s_resourcePath = "";

WindowsFileSystem::WindowsFileSystem() {
    if (s_resourcePath.empty()) {
        WCHAR utf16Path[kMaxPath] = {0};
        GetModuleFileNameW(NULL, utf16Path, kMaxPath - 1);
        WCHAR* pUtf16ExePath = &(utf16Path[0]);

        // We need only directory part without exe
        WCHAR* pUtf16DirEnd = wcsrchr(pUtf16ExePath, L'\\');

        char utf8ExeDir[kMaxPath] = {0};
        int nNum = WideCharToMultiByte(CP_UTF8, 0, pUtf16ExePath, static_cast<int>(pUtf16DirEnd - pUtf16ExePath + 1), utf8ExeDir, sizeof(utf8ExeDir), nullptr, nullptr);

        s_resourcePath = FilePath(utf8ExeDir).normalizePath();
    }
    setRootPath(s_resourcePath);
}

WindowsFileSystem::~WindowsFileSystem() = default;

bool WindowsFileSystem::createDirectory(const FilePath& path) {
    if (pathExists(path)) {
        return true;
    }
    FilePath parentPath(path.dirName());
    if (parentPath.value() == path.value()) {
        return false;
    }
    if (!createDirectory(parentPath)) {
        return false;
    }

    std::wstring wPath = StringUtf8ToWideChar(path.value());
    if (!CreateDirectory(wPath.c_str(), NULL)) {
        if (ERROR_ALREADY_EXISTS != GetLastError()) {
            CC_LOG_ERROR("Fail create directory %s !Error code is 0x%x", path.value().c_str(), GetLastError());
        }
        return false;
    }

    return true;
}

bool WindowsFileSystem::removeDirectory(const FilePath& path) {
    if (path.value().empty()) {
        return false;
    }
    std::wstring wpath = StringUtf8ToWideChar(path.value());
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

bool WindowsFileSystem::isAbsolutePath(const FilePath& strPath) const {
    if ((strPath.value().length() > 2 && ((strPath[0] >= 'a' && strPath[0] <= 'z') || (strPath[0] >= 'A' && strPath[0] <= 'Z')) && strPath[1] == ':') || (strPath[0] == '/' && strPath[1] == '/')) {
        return true;
    }
    return false;
}

int64_t WindowsFileSystem::getFileSize(const FilePath& filePath) const {
    WIN32_FILE_ATTRIBUTE_DATA fad;
    if (!GetFileAttributesEx(StringUtf8ToWideChar(filePath.value()).c_str(), GetFileExInfoStandard, &fad)) {
        return 0; // error condition, could call GetLastError to find out more
    }
    LARGE_INTEGER size;
    size.HighPart = fad.nFileSizeHigh;
    size.LowPart = fad.nFileSizeLow;
    return (long)size.QuadPart;
}

bool WindowsFileSystem::removeFile(const FilePath& filePath) {
    if (DeleteFile(StringUtf8ToWideChar(filePath.value()).c_str())) {
        return true;
    }
    CC_LOG_ERROR("Fail remove file %s !Error code is 0x%x", filePath.value().c_str(), GetLastError());
    return false;
}

bool WindowsFileSystem::renameFile(const FilePath& oldFilePath, const FilePath& newFilePath) {
    CC_ASSERT(!oldFilePath.empty());
    CC_ASSERT(!newFilePath.empty());

    std::wstring _wNew = StringUtf8ToWideChar(newFilePath.value());
    std::wstring _wOld = StringUtf8ToWideChar(oldFilePath.value());

    if (pathExists(newFilePath)) {
        if (!DeleteFile(_wNew.c_str())) {
            CC_LOG_ERROR("Fail to delete file %s !Error code is 0x%x", newFilePath.value().c_str(), GetLastError());
        }
    }

    if (MoveFile(_wOld.c_str(), _wNew.c_str())) {
        return true;
    }
    CC_LOG_ERROR("Fail to rename file %s to %s !Error code is 0x%x", oldFilePath.value().c_str(), newFilePath.value().c_str(), GetLastError());
    return false;
}

std::unique_ptr<IFileHandle> WindowsFileSystem::open(const FilePath& filepath, AccessFlag flag) {
    int32_t accessFlag = 0;
    if (flag == AccessFlag::READ_ONLY) {
        accessFlag = GENERIC_READ;
    } else if (flag == AccessFlag::WRITE_ONLY) {
        accessFlag = GENERIC_WRITE | CREATE_ALWAYS | TRUNCATE_EXISTING;
    } else if (flag == AccessFlag::READ_WRITE) {
        accessFlag = GENERIC_READ | GENERIC_WRITE;
    } else if (flag == AccessFlag::APPEND) {
        accessFlag = GENERIC_READ | GENERIC_WRITE | OPEN_ALWAYS;
    }

    int32_t winFlags = FILE_SHARE_READ | FILE_SHARE_WRITE;
    int32_t createFlag = OPEN_EXISTING;
    FilePath actualPath = filepath;
    HANDLE handle = CreateFile(StringUtf8ToWideChar(actualPath.value()).c_str(), accessFlag, winFlags, NULL, createFlag, FILE_ATTRIBUTE_NORMAL, NULL);
    if (handle != INVALID_HANDLE_VALUE) {
        return std::make_unique<WindowsFileHandle>(handle);
    }
    return nullptr;
}

FilePath WindowsFileSystem::getUserAppDataPath() const {

    if (_writablePath.length()) {
        return _writablePath;
    }

    // Get full path of executable, e.g. c:\Program Files (x86)\My Game Folder\MyGame.exe
    WCHAR full_path[kMaxPath + 1] = {0};
    ::GetModuleFileName(nullptr, full_path, kMaxPath + 1);

    // Debug app uses executable directory; Non-debug app uses local app data directory
    //#ifndef _DEBUG
    // Get filename of executable only, e.g. MyGame.exe
    WCHAR* base_name = wcsrchr(full_path, '\\');
    std::wstring retPath;
    if (base_name) {
        WCHAR app_data_path[kMaxPath + 1];

        // Get local app data directory, e.g. C:\Documents and Settings\username\Local Settings\Application Data
        if (SUCCEEDED(SHGetFolderPath(nullptr, CSIDL_LOCAL_APPDATA, nullptr, SHGFP_TYPE_CURRENT, app_data_path))) {
            std::wstring ret(app_data_path);

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

    return FilePath(StringWideCharToUtf8(retPath));
}

bool WindowsFileSystem::pathExists(const FilePath& path) const {
    int32_t result = GetFileAttributesW(StringUtf8ToWideChar(path.value()).c_str());
    if (result != INVALID_FILE_ATTRIBUTES) {
        return true;
    }
    return false;
}

} // namespace cc
