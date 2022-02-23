/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2020 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#ifndef DRAGONBONES_CC_ARMATURE_DISPLAY_CONTAINER_H
#define DRAGONBONES_CC_ARMATURE_DISPLAY_CONTAINER_H

#include <map>
#include <utility>
#include <vector>
#include "IOTypedArray.h"
#include "MiddlewareManager.h"
#include "base/Map.h"
#include "base/RefCounted.h"
#include "bindings/event/EventDispatcher.h"
#include "dragonbones-creator-support/CCSlot.h"
#include "dragonbones/DragonBonesHeaders.h"
#include "middleware-adapter.h"

DRAGONBONES_NAMESPACE_BEGIN

/**
 * CCArmatureDisplay is a armature tree.It can add or remove a childArmature.
 * It will not save vertices and indices.Only CCSlot will save these info.
 * And CCArmatureDisplay will traverse all tree node and calculate render data.
 */
class CCArmatureDisplay : public cc::RefCounted, public virtual IArmatureProxy {
    DRAGONBONES_DISALLOW_COPY_AND_ASSIGN(CCArmatureDisplay)

public:
    /**
     * @internal
     */
    static CCArmatureDisplay *create();

private:
    void traverseArmature(Armature *armature, float parentOpacity = 1.0F);

protected:
    bool      _debugDraw = false;
    Armature *_armature  = nullptr;

public:
    CCArmatureDisplay();
    ~CCArmatureDisplay() override;

    /**
     * @inheritDoc
     */
    void dbInit(Armature *armature) override;
    /**
     * @inheritDoc
     */
    void dbClear() override;
    /**
     * @inheritDoc
     */
    void dbUpdate() override;
    /**
     * @inheritDoc
     */
    void dbRender() override;
    /**
     * @inheritDoc
     */
    void dispose() override;
    /**
     * @inheritDoc
     */
    bool hasDBEventListener(const std::string &type) const override;
    /**
     * @inheritDoc
     */
    void dispatchDBEvent(const std::string &type, EventObject *value) override;
    /**
     * @inheritDoc
     */
    void addDBEventListener(const std::string &type, const std::function<void(EventObject *)> &listener) override;
    /**
     * @inheritDoc
     */
    void removeDBEventListener(const std::string &type, const std::function<void(EventObject *)> &listener) override;
    /**
     * @inheritDoc
     */
    uint32_t getRenderOrder() const override;

    using dbEventCallback = std::function<void(EventObject *)>;
    void setDBEventCallback(dbEventCallback callback) {
        _dbEventCallback = std::move(callback);
    }

    /**
     * @inheritDoc
     */
    inline Armature *getArmature() const override {
        return _armature;
    }
    /**
     * @inheritDoc
     */
    inline Animation *getAnimation() const override {
        return _armature->getAnimation();
    }

    /**
     * @return debug data,it's a Float32Array,
     * format |debug bones length|[beginX|beginY|toX|toY|...loop...]
     */
    se_object_ptr getDebugData() const;
    /**
     * @return shared buffer offset, it's a Uint32Array
     * format |render info offset|attach info offset|
     */
    se_object_ptr getSharedBufferOffset() const;
    /**
     * @return js send to cpp parameters, it's a Uint32Array
     * format |render order|world matrix|
     */
    se_object_ptr getParamsBuffer() const;

    void setColor(float r, float g, float b, float a);

    void setDebugBonesEnabled(bool enabled) {
        _debugDraw = enabled;
    }

    void setBatchEnabled(bool enabled) {
        // disable switch batch mode, force to enable batch, it may be changed in future version
        // _batch = enabled;
    }

    void setAttachEnabled(bool enabled) {
        _useAttach = enabled;
    }

    void setOpacityModifyRGB(bool value) {
        _premultipliedAlpha = value;
    }

    /**
     * @brief Convert component position to global position.
     * @param[in] pos Component position
     * @return Global position
     */
    const cc::Vec2 &convertToRootSpace(float x, float y) const;

    /**
     * @return root display,if this diplay is root,then return itself.
     */
    CCArmatureDisplay *getRootDisplay();

private:
    std::map<std::string, bool> _listenerIDMap;
    int                         _preBlendMode    = -1;
    int                         _preTextureIndex = -1;
    int                         _curTextureIndex = -1;
    int                         _curBlendSrc     = -1;
    int                         _curBlendDst     = -1;

    int _preISegWritePos = -1;
    int _curISegLen      = 0;

    int _debugSlotsLen = 0;
    int _materialLen   = 0;

    bool _batch              = true;
    bool _useAttach          = false;
    bool _premultipliedAlpha = false;

    // NOTE: We bind Vec2 to make JS deserialization works, we need to return const reference in convertToRootSpace method,
    // because returning Vec2 JSB object on stack to JS will let JS get mess data.
    mutable cc::Vec2 _tmpVec2;
    //
    cc::middleware::Color4F _nodeColor       = cc::middleware::Color4F::WHITE;
    dbEventCallback         _dbEventCallback = nullptr;

    cc::middleware::IOTypedArray *_sharedBufferOffset = nullptr;
    cc::middleware::IOTypedArray *_debugBuffer        = nullptr;
    // Js fill this buffer to send parameter to cpp, avoid to call jsb function.
    cc::middleware::IOTypedArray *_paramsBuffer = nullptr;
};

DRAGONBONES_NAMESPACE_END

#endif // DRAGONBONES_CC_ARMATURE_DISPLAY_CONTAINER_H
