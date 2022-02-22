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
#ifndef DRAGONBONES_IARMATURE_PROXY_H
#define DRAGONBONES_IARMATURE_PROXY_H

#include "../core/DragonBones.h"
#include "../event/IEventDispatcher.h"
#include "MiddlewareManager.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The armature proxy interface, the docking engine needs to implement it concretely.
 * @see dragonBones.Armature
 * @version DragonBones 5.0
 * @language en_US
 */
/**
 * - 骨架代理接口，对接的引擎需要对其进行具体实现。
 * @see dragonBones.Armature
 * @version DragonBones 5.0
 * @language zh_CN
 */
class IArmatureProxy : public IEventDispatcher
{
    ABSTRACT_CLASS(IArmatureProxy);

public:
    /**
     * @internal
     */
    virtual void dbInit(Armature* armature) = 0;
    /**
     * @internal
     */
    virtual void dbClear() = 0;
    /**
     * @internal
     */
    virtual void dbUpdate() = 0;
    /**
     * @internal
     */
    virtual void dbRender() = 0;
    /**
     * - Dispose the instance and the Armature instance. (The Armature instance will return to the object pool)
     * @example
     * TypeScript style, for reference only.
     * <pre>
     *     removeChild(armatureDisplay);
     *     armatureDisplay.dispose();
     * </pre>
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 释放该实例和骨架。 （骨架会回收到对象池）
     * @example
     * TypeScript 风格，仅供参考。
     * <pre>
     *     removeChild(armatureDisplay);
     *     armatureDisplay.dispose();
     * </pre>
     * @version DragonBones 4.5
     * @language zh_CN
     */
    virtual void dispose() = 0;
    /**
     * - The armature.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 骨架。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    virtual Armature* getArmature() const = 0;
    /**
     * - The animation player.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画播放器。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    virtual Animation* getAnimation() const = 0;
    
    /**
     * - Gets render order
     * @version Cocos Creator 2.3
     * @language en_US
     */
    /**
     * - 获得渲染顺序。
     * @version Cocos Creator 2.3
     * @language zh_CN
     */
    virtual uint32_t getRenderOrder() const = 0;
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_IARMATURE_PROXY_H
