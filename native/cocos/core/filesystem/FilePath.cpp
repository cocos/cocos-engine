
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
#include "cocos/core/filesystem/FilePath.h"
#include <regex>

namespace {
int isWindowDriveLetter(const ccstd::string& path) {
    if (path.length() >= 2 && path[1] == ':' &&
        ((path[0] >= 'A' && path[0] <= 'Z') ||
         (path[0] >= 'a' && path[0] <= 'z'))) {
        return 1;
    }
    return ccstd::string::npos;
}

// D:\aaa\bbb\ccc\ddd\abc.txt --> D:/aaa/bbb/ccc/ddd/abc.txt
ccstd::string convertToUnixStyle(const ccstd::string& path) {
    ccstd::string ret = path;
    size_t len = ret.length();
    for (size_t i = 0; i < len; ++i) {
        if (ret[i] == '\\') {
            ret[i] = '/';
        }
    }
    return ret;
}

bool isEmptyOrSpecialPath(const ccstd::string& path) {
    if (path == "." || path == ".." || path.empty())
        return true;

    return false;
}

int getLastSepPos(const ccstd::string& path) {
    if (isEmptyOrSpecialPath(path))
        return ccstd::string::npos;

    return path.find_last_of(".");
}


static constexpr char kSeparators[] =
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    "\\/";
#else  // FILE_PATH_USES_WIN_SEPARATORS
    "/";
#endif // FILE_PATH_USES_WIN_SEPARATORS

static constexpr size_t kSeparatorsLength = std::size(kSeparators);

bool isSeparator(char character) {
    for (size_t i = 0; i < kSeparatorsLength - 1; ++i) {
        if (character == kSeparators[i]) {
            return true;
        }
    }

    return false;
}

}

namespace cc {
FilePath::FilePath() = default;
FilePath::FilePath(const FilePath& that) = default;
//FilePath::FilePath(FilePath&& that) noexcept = default;
FilePath::FilePath(const ccstd::string& path) : _path(path) {
    _path = normalizePath();
}
FilePath::~FilePath() = default;

FilePath& FilePath::operator=(const FilePath& that) = default;

bool FilePath::operator==(const FilePath& that) const {
    return _path == that._path;
}

void FilePath::removeLastSeparator() {
    int i = _path.length() - 1;
    while (i > 0) {
        if ((_path[i] == '/' || _path[i] == '\\') && i > 0 && _path[i - 1] != ':') {
            i--;
        } else {
            break;
        }
    }
    if (i >= 0) {
        _path.resize(i + 1);
    }
}

FilePath FilePath::dirName() const {
    FilePath newPath(_path);
    newPath.removeLastSeparator();

    int lastSep = newPath._path.find_last_of(kSeparators);
    if (lastSep != ccstd::string::npos && lastSep != newPath._path.length() - 1) {
        newPath._path = newPath._path.substr(0, lastSep);
    } else {
        newPath._path = "";
    }

    return newPath;
}

FilePath FilePath::baseName() const {
    FilePath newPath(_path);
    newPath.removeLastSeparator();
    int lastSep = newPath._path.find_last_of(kSeparators);
    if (lastSep != ccstd::string::npos) {
        newPath._path.erase(0, lastSep + 1);
    }
    return newPath;
}

FilePath FilePath::removeFinalExtension() const {
    if (finalExtension().empty())
        return *this;

    const size_t dot = getLastSepPos(_path);
    if (dot == ccstd::string::npos)
        return *this;

    return FilePath(_path.substr(0, dot));
}

ccstd::string FilePath::finalExtension(bool tolower) const {
    FilePath base(baseName());
    const size_t dot = getLastSepPos(base._path);
    if (dot == ccstd::string::npos)
        return "";
    ccstd::string ext = base._path.substr(dot, ccstd::string::npos);
    if (tolower) {
        std::transform(ext.begin(), ext.end(), ext.begin(), ::tolower);
    }
    return ext;
}

FilePath FilePath::append(const FilePath& path) const {
    return append(path.value());
 }

FilePath FilePath::append(const ccstd::string& path) const {
     ccstd::string appended = path;
     ccstd::string without_nuls;

     int nulPos = path.find('\0');
     if (nulPos != ccstd::string::npos) {
         appended = path.substr(0, nulPos);
     }

     if (_path == "." && !appended.empty()) {
         return FilePath(appended);
     }

     FilePath new_path(_path);
     new_path.removeLastSeparator();

     if (!appended.empty() && !new_path._path.empty()) {
         if (!isSeparator(new_path._path.back())) {
              new_path._path.append(1, kSeparators[1]);
         }
     }

     new_path._path.append(appended.data(), appended.size());
     return new_path;
 }

ccstd::string FilePath::normalizePath() {
    _path = convertToUnixStyle(_path);
    removeLastSeparator();

    ccstd::string ret;
    // Normalize: remove . and ..
    ret = std::regex_replace(_path, std::regex("/\\./"), "/");
    if (!ret.empty())
    ret = std::regex_replace(ret, std::regex("/\\.$"), "");

    // ./pathA/path
    if (ret[0] == '.' && ret[1] == '/') {
        ret.erase(0, 2);
    }

    size_t pos;
    while ((pos = ret.rfind("..")) != ccstd::string::npos && pos > 0) {
            int prevSlash = ret.rfind('/', pos - 2);
            if (prevSlash == ccstd::string::npos) {
                if (pos + 3 <= ret.length() && ret[pos + 2] == '/')
                    ret.erase(0, pos + 3);
                else if (pos + 2 <= ret.length())
                    ret.erase(0, pos + 2);
                break;
            }

        ret = ret.replace(prevSlash, pos - prevSlash + 2, "");
    }
    return convertToUnixStyle(ret);
 }




 }
