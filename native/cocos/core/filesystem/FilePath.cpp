
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
    return 0;
}

// D:\aaa\bbb\ccc\ddd\abc.txt --> D:/aaa/bbb/ccc/ddd/abc.txt
static inline ccstd::string convertPathFormatToUnixStyle(const ccstd::string& path) {
    ccstd::string ret = path;
    size_t len = ret.length();
    for (size_t i = 0; i < len; ++i) {
        if (ret[i] == '\\') {
            ret[i] = '/';
        }
    }
    return ret;
}

size_t finalExtensionSeparatorPosition(const ccstd::string& path) {
    if (path == cc::FilePath::kCurrentDirectory || path == cc::FilePath::kParentDirectory)
        return 0;

    return path.rfind(cc::FilePath::kExtensionSeparator);
}

bool isEmptyOrSpecialCase(const std::string& path) {
    if (path.empty() || path == cc::FilePath::kCurrentDirectory ||
        path == cc::FilePath::kParentDirectory) {
        return true;
    }

    return false;
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

bool FilePath::isPathAbsolute(const std::string& path) {
#if defined(FILE_PATH_USES_DRIVE_LETTERS)
    StringType::size_type letter = FindDriveLetter(path);
    if (letter != StringType::npos) {
        // Look for a separator right after the drive specification.
        return path.length() > letter + 1 &&
               FilePath::isSeparator(path[letter + 1]);
    }
    // Look for a pair of leading separators.
    return path.length() > 1 &&
           FilePath::isSeparator(path[0]) && FilePath::isSeparator(path[1]);
#else  // FILE_PATH_USES_DRIVE_LETTERS
    // Look for a separator in the first position.
    return path.length() > 0 && isSeparator(path[0]);
#endif // FILE_PATH_USES_DRIVE_LETTERS
}

void FilePath::stripTrailingSeparatorsInternal() {
    // If there is no drive letter, start will be 1, which will prevent stripping
    // the leading separator if there is only one separator.  If there is a drive
    // letter, start will be set appropriately to prevent stripping the first
    // separator following the drive letter, if a separator immediately follows
    // the drive letter.
    size_t start = isWindowDriveLetter(_path) + 2;

    size_t last_stripped = -1;
    for (size_t pos = _path.length();
         pos > start && isSeparator(_path[pos - 1]);
         --pos) {
        // If the string only has two separators and they're at the beginning,
        // don't strip them, unless the string began with more than two separators.
        if (pos != start + 1 || last_stripped == start + 2 ||
            !isSeparator(_path[start - 1])) {
            _path.resize(pos - 1);
            last_stripped = pos;
        }
    }
}

FilePath FilePath::dirName() const {
    FilePath new_path(_path);
    new_path.stripTrailingSeparatorsInternal();

    size_t letter = isWindowDriveLetter(new_path._path);

    size_t last_separator =
        new_path._path.find_last_of(kSeparators);
    if (last_separator == 0) {
        // path_ is in the current directory.
        new_path._path.resize(letter + 1);
    } else if (last_separator == letter + 1) {
        // path_ is in the root directory.
        new_path._path.resize(letter + 2);
    } else if (last_separator == letter + 2 &&
               isSeparator(new_path._path[letter + 1])) {
        // path_ is in "//" (possibly with a drive letter); leave the double
        // separator intact indicating alternate root.
        new_path._path.resize(letter + 3);
    } else if (last_separator != 0) {
        // path_ is somewhere else, trim the basename.
        new_path._path.resize(last_separator);
    }

    new_path.stripTrailingSeparatorsInternal();
    if (!new_path._path.length())
        new_path._path = kCurrentDirectory;

    return new_path;
}

FilePath FilePath::baseName() const {
    FilePath new_path(_path);
    new_path.stripTrailingSeparatorsInternal();

    size_t letter = isWindowDriveLetter(new_path._path);
    if (letter != -1) {
        new_path._path.erase(0, letter + 1);
    }

    // Keep everything after the final separator, but if the pathname is only
    // one character and it's a separator, leave it alone.
    size_t last_separator =
        new_path._path.find_last_of(kSeparators);
    if (last_separator != -1 &&
        last_separator < new_path._path.length() - 1) {
        new_path._path.erase(0, last_separator + 1);
    }

    return new_path;
}

FilePath FilePath::removeFinalExtension() const {
    if (finalExtension().empty())
        return *this;

    const size_t dot = finalExtensionSeparatorPosition(_path);
    if (dot == 0)
        return *this;

    return FilePath(_path.substr(0, dot));
}

ccstd::string FilePath::finalExtension(bool tolower) const {
    FilePath base(baseName());
    const size_t dot = finalExtensionSeparatorPosition(base._path);
    if (dot == 0)
        return "";
    std::string ext = base._path.substr(dot, -1);
    if (tolower) {
        std::transform(ext.begin(), ext.end(), ext.begin(), ::tolower);
    }
    return ext;
}

FilePath FilePath::addExtension(const std::string& extension) const {
    if (isEmptyOrSpecialCase(baseName().value()))
        return FilePath();

    // If the new extension is "" or ".", then just return the current FilePath.
    if (extension.empty() ||
        (extension.size() == 1 && extension[0] == kExtensionSeparator))
        return *this;

    std::string str = _path;
    if (extension[0] != kExtensionSeparator &&
        *(str.end() - 1) != kExtensionSeparator) {
        str.append(1, kExtensionSeparator);
    }
    str.append(extension.data(), extension.size());
    return FilePath(str);
}

FilePath FilePath::replaceExtension(const std::string& extension) const {
    if (isEmptyOrSpecialCase(baseName().value()))
        return FilePath();

    FilePath no_ext = removeFinalExtension();
    // If the new extension is "" or ".", then just remove the current extension.
    if (extension.empty() ||
        (extension.size() == 1 && extension[0] == kExtensionSeparator))
        return no_ext;

    std::string str = no_ext.value();
    if (extension[0] != kExtensionSeparator)
        str.append(1, kExtensionSeparator);
    str.append(extension.data(), extension.size());
    return FilePath(str);
}

FilePath FilePath::append(const FilePath& component) const {
    return append(component.value());
 }

FilePath FilePath::append(const std::string& component) const {
     std::string appended = component;
     std::string without_nuls;

     size_t nul_pos = component.find('\0');
     if (nul_pos != std::string::npos) {
         without_nuls = std::string(component.substr(0, nul_pos));
         appended = std::string(without_nuls);
     }

     if (_path.compare(kCurrentDirectory) == 0 && !appended.empty()) {
         return FilePath(appended);
     }

     FilePath new_path(_path);
     new_path.stripTrailingSeparatorsInternal();
     if (!appended.empty() && !new_path._path.empty()) {
         if (!isSeparator(new_path._path.back())) {
             if (isWindowDriveLetter(new_path._path) + 1 != new_path._path.length()) {
                 new_path._path.append(1, kSeparators[1]);
             }
         }
     }

     new_path._path.append(appended.data(), appended.size());
     return new_path;
 }

ccstd::string FilePath::normalizePath() {
     ccstd::string ret;
     // Normalize: remove . and ..
     ret = std::regex_replace(_path, std::regex("/\\./"), "/");
     if (!ret.empty())
        ret = std::regex_replace(ret, std::regex("/\\.$"), "");

     size_t pos;
     while ((pos = ret.find("..")) != ccstd::string::npos && pos > 2) {
         size_t prevSlash = ret.rfind('/', pos - 2);
         if (prevSlash == ccstd::string::npos) {
             break;
         }

         ret = ret.replace(prevSlash, pos - prevSlash + 2, "");
     }
     return convertPathFormatToUnixStyle(ret);
 }




 }
