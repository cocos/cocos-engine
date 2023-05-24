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

#pragma once

#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "core/assets/Asset.h"

namespace cc {

namespace gfx {
class Device;
}

class Material;
class Asset;

class BuiltinResMgr final {
public:
    static BuiltinResMgr *getInstance();

    BuiltinResMgr();
    ~BuiltinResMgr();

    bool initBuiltinRes();
    inline bool isInitialized() const { return _isInitialized; }

    void addAsset(const ccstd::string &uuid, Asset *asset);
    Asset *getAsset(const ccstd::string &uuid);

    template <typename T, typename Enabled = std::enable_if_t<std::is_base_of<Asset, T>::value>>
    T *get(const ccstd::string &uuid) {
        return static_cast<T *>(getAsset(uuid));
    }

private:
    void initTexture2DWithUuid(const ccstd::string &uuid, const uint8_t *data, size_t dataBytes, uint32_t width, uint32_t height);
    void initTextureCubeWithUuid(const ccstd::string &uuid, const uint8_t *data, size_t dataBytes, uint32_t width, uint32_t height);

    static BuiltinResMgr *instance;

    ccstd::unordered_map<ccstd::string, IntrusivePtr<Asset>> _resources;
    bool _isInitialized{false};

    CC_DISALLOW_COPY_MOVE_ASSIGN(BuiltinResMgr);
};

} // namespace cc
