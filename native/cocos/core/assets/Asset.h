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

#pragma once

#include <functional>
#include "cocos/base/Any.h"
#include "cocos/base/Optional.h"

#include "base/Macros.h"
#include "core/Types.h"
#include "core/data/Object.h"
#include "core/event/CallbacksInvoker.h"

namespace cc {

class Node;

class Asset : public CCObject, public EventTarget {
public:
    using Super = CCObject;

    Asset();
    ~Asset() override;

    /**
     * @en
     * Returns the url of this asset's native object, if none it will returns an empty string.
     * @zh
     * 返回该资源对应的目标平台资源的 URL，如果没有将返回一个空字符串。
     * @readOnly
     */
    std::string getNativeUrl() const;

    NativeDep getNativeDep() const;

    inline const std::string &getUuid() const { return _uuid; }
    inline void               setUuid(const std::string &uuid) { _uuid = uuid; }

    /**
     * @en
     * The underlying native asset of this asset if one is available.<br>
     * This property can be used to access additional details or functionality related to the asset.<br>
     * This property will be initialized by the loader if `_native` is available.
     * @zh
     * 此资源的基础资源（如果有）。 此属性可用于访问与资源相关的其他详细信息或功能。<br>
     * 如果`_native`可用，则此属性将由加载器初始化。
     * @default null
     * @private
     */
    virtual cc::any getNativeAsset() const {
        return _file;
    }

    virtual void setNativeAsset(const cc::any &obj) {
        _file = obj;
    }

    /**
     * @param error - null or the error info
     * @param node - the created node or null
     */
    using CreateNodeCallback = std::function<void(Error, Node *)>;
    /**
     * @en
     * Create a new node using this asset in the scene.<br/>
     * If this type of asset don't have its corresponding node type, this method should be null.
     * @zh
     * 使用该资源在场景中创建一个新节点。<br/>
     * 如果这类资源没有相应的节点类型，该方法应该是空的。
     */
    virtual void createNode(const CreateNodeCallback &cb) {}

    void            addAssetRef();
    void            decAssetRef(bool autoRelease = true);
    inline uint32_t getAssetRefCount() const { return _assetRefCount; }

    virtual void onLoaded() {}

    virtual void initDefault(const cc::optional<std::string> &uuid);
    virtual bool validate() const { return true; }

    bool isDefault() const { return _isDefault; }

    bool destroy() override;

    // SERIALIZATION

    /**
     * @return
     */
    virtual cc::any serialize(const cc::any & /*ctxForExporting*/) { return cc::any{}; };

    /**
     *
     * @param data
     */
    virtual void deserialize(const cc::any &serializedData, const cc::any &handle) {}

    std::string toString() const override { return _nativeUrl; }

protected:
    /**
     * @en
     * Set native file name for this asset.
     * @zh
     * 为此资源设置原始文件名。
     * @seealso nativeUrl
     *
     * @param filename
     * @param inLibrary
     * @private
     */
    void setRawAsset(const std::string &filename, bool inLibrary = true);

    // Make _native, _nativeUrl public for deserialization
public:
    std::string _native;
    std::string _nativeUrl;

protected:
    std::string _uuid;

    cc::any  _file;
    uint32_t _assetRefCount{0};

    bool _loaded{true};
    bool _isDefault{false};

    CC_DISALLOW_COPY_MOVE_ASSIGN(Asset);
};

} // namespace cc
