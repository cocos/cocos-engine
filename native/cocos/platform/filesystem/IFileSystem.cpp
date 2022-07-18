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
#include "cocos/platform/filesystem/IFileSystem.h"
#include "tinydir/tinydir.h"

#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    #include "cocos/platform/win32/Utils-win32.h"
#endif

namespace cc {

bool IFileSystem::isAbsolutePath(const FilePath &path) const {
    return (path[0] == '/');
}

void IFileSystem::listFiles(const ccstd::string &path, ccstd::vector<ccstd::string> *files) const {
    if (path.empty() || !pathExists(path) || !files) {
        return;
    }
    tinydir_dir dir;
#ifdef UNICODE
    std::wstring fullpathstr = StringUtf8ToWideChar(path);
#else
    ccstd::string fullpathstr = path;
#endif
    if (tinydir_open(&dir, &fullpathstr[0]) != -1) {
        while (dir.has_next) {
            tinydir_file file;
            if (tinydir_readfile(&dir, &file) == -1) {
                // Error getting file
                break;
            }

#ifdef UNICODE
            ccstd::string filepath = StringWideCharToUtf8(file.path);
#else
            ccstd::string filepath = file.path;
#endif
            if (file.is_dir) {
                filepath.append("/");
            }
            files->push_back(filepath);

            if (tinydir_next(&dir) == -1) {
                // Error getting next file
                break;
            }
        }
    }
    tinydir_close(&dir);
}

void IFileSystem::listFilesRecursively(const ccstd::string &path, ccstd::vector<ccstd::string> *files) const { // NOLINT(misc-no-recursion)
    if (path.empty() || !pathExists(path) || !files) {
        return;
    }
    tinydir_dir dir;
#ifdef UNICODE
    std::wstring fullpathstr = StringUtf8ToWideChar(path);
#else
    ccstd::string fullpathstr = path;
#endif
    if (tinydir_open(&dir, &fullpathstr[0]) != -1) {
        while (dir.has_next) {
            tinydir_file file;
            if (tinydir_readfile(&dir, &file) == -1) {
                // Error getting file
                break;
            }

#ifdef UNICODE
            ccstd::string filepath = StringWideCharToUtf8(file.path);
#else
            ccstd::string filepath = file.path;
#endif
            if (file.name[0] != '.') {
                if (file.is_dir) {
                    filepath.append("/");
                    files->push_back(filepath);
                    listFilesRecursively(filepath, files);
                } else {
                    files->push_back(filepath);
                }
            }

            if (tinydir_next(&dir) == -1) {
                // Error getting next file
                break;
            }
        }
    }
    tinydir_close(&dir);
}

} // namespace cc
