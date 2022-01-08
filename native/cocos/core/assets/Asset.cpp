/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "core/assets/Asset.h"
#include "base/Macros.h"
#include "core/utils/Path.h"

namespace cc {

//cjh TODO:
std::string getAssetUrlWithUuid(const std::string &uuid, bool isNative, const std::string &nativeExt, const std::string &nativeName = "") { //NOLINT
    return "";
}

std::string Asset::getNativeUrl() const {
    if (_nativeUrl.empty()) {
        if (_native.empty()) {
            return "";
        }
        const auto &name = _native;
        if (name[0] == 47) { // '/'
            // remove library tag
            // not imported in library, just created on-the-fly
            return name.substr(1);
        }

        if (name[0] == 46) { // '.'
            // imported in dir where json exist
            const_cast<Asset *>(this)->_nativeUrl = getAssetUrlWithUuid(_uuid, true, name);
        } else {
            // imported in an independent dir
            const_cast<Asset *>(this)->_nativeUrl = getAssetUrlWithUuid(_uuid, true, extname(name), name);
        }
    }
    return _nativeUrl;
}

Asset::~Asset() = default;

NativeDep Asset::getNativeDep() const {
    if (!_native.empty()) {
        return NativeDep(true, _uuid, _native);
    }
    return NativeDep();
}

void Asset::setRawAsset(const std::string &filename, bool inLibrary /* = true*/) {
    if (inLibrary) {
        _native = filename;
    } else {
        _native = "/" + filename; // simply use '/' to tag location where is not in the library
    }
}

void Asset::addAssetRef() {
    ++_assetRefCount;
}

void Asset::decAssetRef(bool autoRelease /* = true*/) {
    if (_assetRefCount > 0) {
        --_assetRefCount;
    }

    if (autoRelease) {
        //cjh TODO:
    }
}

void Asset::initDefault(const cc::optional<std::string> &uuid) {
    if (uuid.has_value()) {
        _uuid = uuid.value();
    }
    _isDefault = true;
}

bool Asset::destroy() {
    //cjh TODO:    debug(getError(12101, this._uuid));
    return Super::destroy();
}

} // namespace cc
