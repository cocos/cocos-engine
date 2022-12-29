/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "core/assets/Asset.h"
#include "base/DeferredReleasePool.h"
#include "base/Macros.h"
#include "core/utils/Path.h"

namespace cc {

//cjh TODO:
ccstd::string getAssetUrlWithUuid(const ccstd::string &uuid, bool isNative, const ccstd::string &nativeExt, const ccstd::string &nativeName = "") { //NOLINT
    return "";
}

ccstd::string Asset::getNativeUrl() const {
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
Asset::Asset() = default;
Asset::~Asset() = default;

NativeDep Asset::getNativeDep() const {
    if (!_native.empty()) {
        return NativeDep(true, _uuid, _native);
    }
    return NativeDep();
}

void Asset::setRawAsset(const ccstd::string &filename, bool inLibrary /* = true*/) {
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

void Asset::initDefault(const ccstd::optional<ccstd::string> &uuid) {
    if (uuid.has_value()) {
        _uuid = uuid.value();
    }
    _isDefault = true;
}

bool Asset::destroy() {
    //cjh TODO:    debug(getError(12101, this._uuid));
    return Super::destroy();
}

void Asset::destruct() {
    CCObject::destruct();
    _native.clear();
    _nativeUrl.clear();
}

} // namespace cc
