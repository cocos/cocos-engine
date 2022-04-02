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
#ifndef DRAGONBONES_ANIMATEBLE_H
#define DRAGONBONES_ANIMATEBLE_H

#include "../core/DragonBones.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - Play animation interface. (Both Armature and Wordclock implement the interface)
 * Any instance that implements the interface can be added to the Worldclock instance and advance time by Worldclock instance uniformly.
 * @see dragonBones.WorldClock
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 播放动画接口。 (Armature 和 WordClock 都实现了该接口)
 * 任何实现了此接口的实例都可以添加到 WorldClock 实例中，由 WorldClock 实例统一更新时间。
 * @see dragonBones.WorldClock
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 * @language zh_CN
 */
class IAnimatable
{
    ABSTRACT_CLASS(IAnimatable)

public:
    /**
     * - Advance time.
     * @param passedTime - Passed time. (In seconds)
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 更新时间。
     * @param passedTime - 前进的时间。 （以秒为单位）
     * @version DragonBones 3.0
     * @language zh_CN
     */
    virtual void advanceTime(float passedTime) = 0;
    
    /**
     * - Render.
     * @version Cocos creator 2.3
     * @language en_US
     */
    /**
     * - 渲染。
     * @version Cocos creator 2.3
     * @language zh_CN
     */
    virtual void render() = 0;
    /**
     * - The Wordclock instance to which the current belongs.
     * @example
     * TypeScript style, for reference only.
     * <pre>
     *     armature.clock = factory.clock; // Add armature to clock.
     *     armature.clock = null; // Remove armature from clock.
     * </pre>
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 当前所属的 WordClock 实例。
     * @example
     * TypeScript 风格，仅供参考。
     * <pre>
     *     armature.clock = factory.clock; // 将骨架添加到时钟。
     *     armature.clock = null; // 将骨架从时钟移除。
     * </pre>
     * @version DragonBones 5.0
     * @language zh_CN
     */
    virtual WorldClock* getClock() const = 0;
    virtual void setClock(WorldClock* value) = 0;
    
    /**
     * - Gets render order.
     * @version Cocos creator 2.3
     * @language en_US
     */
    /**
     * - 获得渲染顺序。
     * @version Cocos creator 2.3
     * @language zh_CN
     */
    virtual uint32_t getRenderOrder() const { return 0; }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_ANIMATEBLE_H
