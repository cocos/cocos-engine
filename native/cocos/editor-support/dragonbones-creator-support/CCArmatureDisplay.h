/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
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

#include "dragonbones/DragonBonesHeaders.h"
#include "base/CCRef.h"
#include "scripting/js-bindings/event/EventDispatcher.h"
#include <map>
#include <vector>

#include "dragonbones-creator-support/CCSlot.h"
#include "IOTypedArray.h"
#include "MiddlewareManager.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * CCArmatureDisplay is a armature tree.It can add or remove a childArmature.
 * It will not save vertices and indices.Only CCSlot will save these info.
 * And CCArmatureDisplay will traverse all tree node and calculate render data.
 */
class CCArmatureDisplay : public cocos2d::Ref, public virtual IArmatureProxy
{
    DRAGONBONES_DISALLOW_COPY_AND_ASSIGN(CCArmatureDisplay)

public:
    /**
     * @internal
     */
    static CCArmatureDisplay* create();
    
private:
    void traverseArmature(Armature* armature);
    
protected:
    bool _debugDraw = false;
    Armature* _armature = nullptr;

public:
    CCArmatureDisplay();
    virtual ~CCArmatureDisplay();

    /**
     * @inheritDoc
     */
    virtual void dbInit(Armature* armature) override;
    /**
     * @inheritDoc
     */
    virtual void dbClear() override;
    /**
     * @inheritDoc
     */
    virtual void dbUpdate() override;
    /**
     * @inheritDoc
     */
    virtual void dispose(bool disposeProxy = true) override;
    /**
     * @inheritDoc
     */
    virtual bool hasDBEventListener(const std::string& type) const override;
    /**
     * @inheritDoc
     */
    virtual void dispatchDBEvent(const std::string& type, EventObject* value) override;
    /**
     * @inheritDoc
     */
    virtual void addDBEventListener(const std::string& type, const std::function<void(EventObject*)>& listener) override;
    /**
     * @inheritDoc
     */
    virtual void removeDBEventListener(const std::string& type, const std::function<void(EventObject*)>& listener) override;
    /**
     * @inheritDoc
     */
    inline virtual Armature* getArmature() const override
    {
        return _armature;
    }
    /**
     * @inheritDoc
     */
    inline virtual Animation* getAnimation() const override
    {
        return _armature->getAnimation();
    }
    
    /**
     * @return debug data,it's a Float32Array,
     * format |debug bones length|[beginX|beginY|toX|toY|...loop...]
     */
    se_object_ptr getDebugData() const
    {
        if (_debugBuffer)
        {
            return _debugBuffer->getTypeArray();
        }
        return nullptr;
    }
    
    /**
     * @return material data,it's a Uint32Array,
     * format |material length|index offset|[texture index|blend src|blend dst|indice length|...loop...]
     */
    se_object_ptr getMaterialData() const
    {
        if (_materialBuffer)
        {
            return _materialBuffer->getTypeArray();
        }
        return nullptr;
    }
    
    void setColor(cocos2d::Color4B& color)
    {
        _nodeColor = color;
    }
    
    void setDebugBonesEnabled(bool enabled)
    {
        _debugDraw = enabled;
    }
    
    void setOpacityModifyRGB (bool value)
    {
        _premultipliedAlpha = value;
    }
    
    typedef std::function<void(EventObject*)> dbEventCallback;
    void setDBEventCallback(dbEventCallback callback)
    {
        _dbEventCallback = callback;
    }
    
    /**
     * @brief Convert component position to global position.
     * @param[in] pos Component position
     * @return Global position
     */
    cocos2d::Vec2 convertToRootSpace(const cocos2d::Vec2& pos) const;
    
    /**
     * @return root display,if this diplay is root,then return itself.
     */
    CCArmatureDisplay* getRootDisplay();
    
private:
    std::map<std::string,bool> _listenerIDMap;
    cocos2d::middleware::IOTypedArray* _materialBuffer = nullptr;
    cocos2d::middleware::IOTypedArray* _debugBuffer = nullptr;
    cocos2d::Color4B _nodeColor = cocos2d::Color4B::WHITE;
    
    int _preBlendSrc = -1;
    int _preBlendDst = -1;
    int _preTextureIndex = -1;
    int _curBlendSrc = -1;
    int _curBlendDst = -1;
    int _curTextureIndex = -1;
    
    int _preISegWritePos = -1;
    int _curISegLen = 0;
    
    int _debugSlotsLen = 0;
    int _materialLen = 0;
    
    bool _premultipliedAlpha = false;
    cocos2d::Color4B _finalColor = cocos2d::Color4B::WHITE;
    dbEventCallback _dbEventCallback = nullptr;
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_CC_ARMATURE_DISPLAY_CONTAINER_H
