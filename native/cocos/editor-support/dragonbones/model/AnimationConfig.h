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
#ifndef DRAGONBONES_ANIMATION_CONFIG_H
#define DRAGONBONES_ANIMATION_CONFIG_H

#include "../core/BaseObject.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The animation config is used to describe all the information needed to play an animation state.
 * The API is still in the experimental phase and may encounter bugs or stability or compatibility issues when used.
 * @see dragonBones.AnimationState
 * @beta
 * @version DragonBones 5.0
 * @language en_US
 */
/**
 * - 动画配置用来描述播放一个动画状态所需要的全部信息。
 * 该 API 仍在实验阶段，使用时可能遭遇 bug 或稳定性或兼容性问题。
 * @see dragonBones.AnimationState
 * @beta
 * @version DragonBones 5.0
 * @language zh_CN
 */
class AnimationConfig : public BaseObject {
    BIND_CLASS_TYPE_A(AnimationConfig);

public:
    /**
     * @private
     */
    bool pauseFadeOut;
    /**
     * - Fade out the pattern of other animation states when the animation state is fade in.
     * This property is typically used to specify the substitution of multiple animation states blend.
     * @default dragonBones.AnimationFadeOutMode.All
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 淡入动画状态时淡出其他动画状态的模式。
     * 该属性通常用来指定多个动画状态混合时的相互替换关系。
     * @default dragonBones.AnimationFadeOutMode.All
     * @version DragonBones 5.0
     * @language zh_CN
     */
    AnimationFadeOutMode fadeOutMode;
    /**
     * @private
     */
    TweenType fadeOutTweenType;
    /**
     * @private
     */
    float fadeOutTime;
    /**
     * @private
     */
    bool actionEnabled;
    /**
     * @private
     */
    bool additiveBlending;
    /**
     * - Whether the animation state has control over the display property of the slots.
     * Sometimes blend a animation state does not want it to control the display properties of the slots,
     * especially if other animation state are controlling the display properties of the slots.
     * @default true
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 动画状态是否对插槽的显示对象属性有控制权。
     * 有时混合一个动画状态并不希望其控制插槽的显示对象属性，
     * 尤其是其他动画状态正在控制这些插槽的显示对象属性时。
     * @default true
     * @version DragonBones 5.0
     * @language zh_CN
     */
    bool displayControl;
    /**
     * @private
     */
    bool pauseFadeIn;
    /**
     * - Whether to reset the objects without animation to the armature pose when the animation state is start to play.
     * This property should usually be set to false when blend multiple animation states.
     * @default true
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 开始播放动画状态时是否将没有动画的对象重置为骨架初始值。
     * 通常在混合多个动画状态时应该将该属性设置为 false。
     * @default true
     * @version DragonBones 5.1
     * @language zh_CN
     */
    bool resetToPose;
    /**
     * @private
     */
    TweenType fadeInTweenType;
    /**
     * - The play times. [0: Loop play, [1~N]: Play N times]
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @version DragonBones 3.0
     * @language zh_CN
     */
    int playTimes;
    /**
     * - The blend layer.
     * High layer animation state will get the blend weight first.
     * When the blend weight is assigned more than 1, the remaining animation states will no longer get the weight assigned.
     * @readonly
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 混合图层。
     * 图层高的动画状态会优先获取混合权重。
     * 当混合权重分配超过 1 时，剩余的动画状态将不再获得权重分配。
     * @readonly
     * @version DragonBones 5.0
     * @language zh_CN
     */
    int layer;
    /**
     * - The start time of play. (In seconds)
     * @default 0.0
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 播放的开始时间。 （以秒为单位）
     * @default 0.0
     * @version DragonBones 5.0
     * @language zh_CN
     */
    float position;
    /**
     * - The duration of play.
     * [-1: Use the default value of the animation data, 0: Stop play, (0~N]: The duration] (In seconds)
     * @default -1.0
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 播放的持续时间。
     * [-1: 使用动画数据默认值, 0: 动画停止, (0~N]: 持续时间] （以秒为单位）
     * @default -1.0
     * @version DragonBones 5.0
     * @language zh_CN
     */
    float duration;
    /**
     * - The play speed.
     * The value is an overlay relationship with {@link dragonBones.Animation#timeScale}.
     * [(-N~0): Reverse play, 0: Stop play, (0~1): Slow play, 1: Normal play, (1~N): Fast play]
     * @default 1.0
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 播放速度。
     * 该值与 {@link dragonBones.Animation#timeScale} 是叠加关系。
     * [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
     * @default 1.0
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float timeScale;
    /**
     * - The blend weight.
     * @default 1.0
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 混合权重。
     * @default 1.0
     * @version DragonBones 5.0
     * @language zh_CN
     */
    float weight;
    /**
     * - The fade in time.
     * [-1: Use the default value of the animation data, [0~N]: The fade in time] (In seconds)
     * @default -1.0
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 淡入时间。
     * [-1: 使用动画数据默认值, [0~N]: 淡入时间] （以秒为单位）
     * @default -1.0
     * @version DragonBones 5.0
     * @language zh_CN
     */
    float fadeInTime;
    /**
     * - The auto fade out time when the animation state play completed.
     * [-1: Do not fade out automatically, [0~N]: The fade out time] (In seconds)
     * @default -1.0
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 动画状态播放完成后的自动淡出时间。
     * [-1: 不自动淡出, [0~N]: 淡出时间] （以秒为单位）
     * @default -1.0
     * @version DragonBones 5.0
     * @language zh_CN
     */
    float autoFadeOutTime;
    /**
     * - The name of the animation state. (Can be different from the name of the animation data)
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 动画状态名称。 （可以不同于动画数据）
     * @version DragonBones 5.0
     * @language zh_CN
     */
    std::string name;
    /**
     * - The animation data name.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 动画数据名称。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    std::string animation;
    /**
     * - The blend group name of the animation state.
     * This property is typically used to specify the substitution of multiple animation states blend.
     * @readonly
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 混合组名称。
     * 该属性通常用来指定多个动画状态混合时的相互替换关系。
     * @readonly
     * @version DragonBones 5.0
     * @language zh_CN
     */
    std::string group;
    /**
     * @private
     */
    std::vector<std::string> boneMask;

protected:
    virtual void _onClear() override;

public:
    /**
     * @private
     */
    void clear();
    /**
     * @private
     */
    void copyFrom(AnimationConfig* value);
    /**
     * @private
     */
    bool containsBoneMask(const std::string& boneName) const;
    /**
     * @private
     */
    void addBoneMask(Armature* armature, const std::string& boneName, bool recursive);
    /**
     * @private
     */
    void removeBoneMask(Armature* armature, const std::string& boneName, bool recursive);

public: // For WebAssembly.
    int getFadeOutMode() const { return (int)fadeOutMode; }
    void setFadeOutMode(int value) { fadeOutMode = (AnimationFadeOutMode)value; }

    int getFadeOutTweenType() const { return (int)fadeOutTweenType; }
    void setFadeOutTweenType(int value) { fadeOutTweenType = (TweenType)value; }

    int getFadeInTweenType() const { return (int)fadeInTweenType; }
    void setFadeInTweenType(int value) { fadeInTweenType = (TweenType)value; }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_ANIMATION_CONFIG_H
