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
#ifndef DRAGONBONES_ANIMATION_H
#define DRAGONBONES_ANIMATION_H

#include "../core/BaseObject.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The animation player is used to play the animation data and manage the animation states.
 * @see dragonBones.AnimationData
 * @see dragonBones.AnimationState
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 动画播放器用来播放动画数据和管理动画状态。
 * @see dragonBones.AnimationData
 * @see dragonBones.AnimationState
 * @version DragonBones 3.0
 * @language zh_CN
 */
class Animation final : public BaseObject {
    BIND_CLASS_TYPE_B(Animation);

public:
    /**
     * - The play speed of all animations. [0: Stop, (0~1): Slow, 1: Normal, (1~N): Fast]
     * @default 1.0
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 所有动画的播放速度。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
     * @default 1.0
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float timeScale;

private:
    bool _animationDirty;
    float _inheritTimeScale;
    std::vector<std::string> _animationNames;
    std::vector<AnimationState*> _animationStates;
    std::map<std::string, AnimationData*> _animations;
    Armature* _armature;
    AnimationConfig* _animationConfig;
    AnimationState* _lastAnimationState;

public:
    Animation() : _animationConfig(nullptr) {
        _onClear();
    }
    ~Animation() {
        _onClear();
    }

private:
    void _fadeOut(AnimationConfig* animationConfig);

protected:
    virtual void _onClear() override;

public:
    /**
     * @internal
     */
    void init(Armature* armature);
    /**
     * @internal
     */
    void advanceTime(float passedTime);
    /**
     * - Clear all animations states.
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 清除所有的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     * @language zh_CN
     */
    void reset();
    /**
     * - Pause a specific animation state.
     * @param animationName - The name of animation state. (If not set, it will pause all animations)
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 暂停指定动画状态的播放。
     * @param animationName - 动画状态名称。 （如果未设置，则暂停所有动画）
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language zh_CN
     */
    void stop(const std::string& animationName = "");
    /**
     * - Play animation with a specific animation config.
     * The API is still in the experimental phase and may encounter bugs or stability or compatibility issues when used.
     * @param animationConfig - The animation config.
     * @returns The playing animation state.
     * @see dragonBones.AnimationConfig
     * @beta
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 通过指定的动画配置来播放动画。
     * 该 API 仍在实验阶段，使用时可能遭遇 bug 或稳定性或兼容性问题。
     * @param animationConfig - 动画配置。
     * @returns 播放的动画状态。
     * @see dragonBones.AnimationConfig
     * @beta
     * @version DragonBones 5.0
     * @language zh_CN
     */
    AnimationState* playConfig(AnimationConfig* animationConfig);
    /**
     * - Play a specific animation.
     * @param animationName - The name of animation data. (If not set, The default animation will be played, or resume the animation playing from pause status, or replay the last playing animation)
     * @param playTimes - Playing repeat times. [-1: Use default value of the animation data, 0: No end loop playing, [1~N]: Repeat N times] (default: -1)
     * @returns The playing animation state.
     * @example
     * TypeScript style, for reference only.
     * <pre>
     *     armature.animation.play("walk");
     * </pre>
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 播放指定动画。
     * @param animationName - 动画数据名称。 （如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放之前播放的动画）
     * @param playTimes - 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
     * @returns 播放的动画状态。
     * @example
     * TypeScript 风格，仅供参考。
     * <pre>
     *     armature.animation.play("walk");
     * </pre>
     * @version DragonBones 3.0
     * @language zh_CN
     */
    AnimationState* play(const std::string& animationName = "", int playTimes = -1);
    /**
     * - Fade in a specific animation.
     * @param animationName - The name of animation data.
     * @param fadeInTime - The fade in time. [-1: Use the default value of animation data, [0~N]: The fade in time (In seconds)] (Default: -1)
     * @param playTimes - playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
     * @param layer - The blending layer, the animation states in high level layer will get the blending weights with high priority, when the total blending weights are more than 1.0, there will be no more weights can be allocated to the other animation states. (Default: 0)
     * @param group - The blending group name, it is typically used to specify the substitution of multiple animation states blending. (Default: null)
     * @param fadeOutMode - The fade out mode, which is typically used to specify alternate mode of multiple animation states blending. (Default: AnimationFadeOutMode.SameLayerAndGroup)
     * @returns The playing animation state.
     * @example
     * TypeScript style, for reference only.
     * <pre>
     *     armature.animation.fadeIn("walk", 0.3, 0, 0, "normalGroup").resetToPose = false;
     *     armature.animation.fadeIn("attack", 0.3, 1, 0, "attackGroup").resetToPose = false;
     * </pre>
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 淡入播放指定的动画。
     * @param animationName - 动画数据名称。
     * @param fadeInTime - 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间 (以秒为单位)] （默认: -1）
     * @param playTimes - 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
     * @param layer - 混合图层，图层高的动画状态会优先获取混合权重，当混合权重分配总和超过 1.0 时，剩余的动画状态将不能再获得权重分配。 （默认: 0）
     * @param group - 混合组名称，该属性通常用来指定多个动画状态混合时的相互替换关系。 （默认: null）
     * @param fadeOutMode - 淡出模式，该属性通常用来指定多个动画状态混合时的相互替换模式。 （默认: AnimationFadeOutMode.SameLayerAndGroup）
     * @returns 播放的动画状态。
     * @example
     * TypeScript 风格，仅供参考。
     * <pre>
     *     armature.animation.fadeIn("walk", 0.3, 0, 0, "normalGroup").resetToPose = false;
     *     armature.animation.fadeIn("attack", 0.3, 1, 0, "attackGroup").resetToPose = false;
     * </pre>
     * @version DragonBones 4.5
     * @language zh_CN
     */
    AnimationState* fadeIn(
        const std::string& animationName, float fadeInTime = -1.f, int playTimes = -1,
        int layer = 0, const std::string& group = "", AnimationFadeOutMode fadeOutMode = AnimationFadeOutMode::SameLayerAndGroup);
    /**
     * - Play a specific animation from the specific time.
     * @param animationName - The name of animation data.
     * @param time - The start time point of playing. (In seconds)
     * @param playTimes - Playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
     * @returns The played animation state.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 从指定时间开始播放指定的动画。
     * @param animationName - 动画数据名称。
     * @param time - 播放开始的时间。 (以秒为单位)
     * @param playTimes - 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
     * @returns 播放的动画状态。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    AnimationState* gotoAndPlayByTime(const std::string& animationName, float time = 0.f, int playTimes = -1);
    /**
     * - Play a specific animation from the specific frame.
     * @param animationName - The name of animation data.
     * @param frame - The start frame of playing.
     * @param playTimes - Playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
     * @returns The played animation state.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 从指定帧开始播放指定的动画。
     * @param animationName - 动画数据名称。
     * @param frame - 播放开始的帧数。
     * @param playTimes - 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
     * @returns 播放的动画状态。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    AnimationState* gotoAndPlayByFrame(const std::string& animationName, unsigned frame = 0, int playTimes = -1);
    /**
     * - Play a specific animation from the specific progress.
     * @param animationName - The name of animation data.
     * @param progress - The start progress value of playing.
     * @param playTimes - Playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
     * @returns The played animation state.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 从指定进度开始播放指定的动画。
     * @param animationName - 动画数据名称。
     * @param progress - 开始播放的进度。
     * @param playTimes - 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
     * @returns 播放的动画状态。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    AnimationState* gotoAndPlayByProgress(const std::string& animationName, float progress = 0.f, int playTimes = -1);
    /**
     * - Stop a specific animation at the specific time.
     * @param animationName - The name of animation data.
     * @param time - The stop time. (In seconds)
     * @returns The played animation state.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 在指定时间停止指定动画播放
     * @param animationName - 动画数据名称。
     * @param time - 停止的时间。 (以秒为单位)
     * @returns 播放的动画状态。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    AnimationState* gotoAndStopByTime(const std::string& animationName, float time = 0.f);
    /**
     * - Stop a specific animation at the specific frame.
     * @param animationName - The name of animation data.
     * @param frame - The stop frame.
     * @returns The played animation state.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 在指定帧停止指定动画的播放
     * @param animationName - 动画数据名称。
     * @param frame - 停止的帧数。
     * @returns 播放的动画状态。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    AnimationState* gotoAndStopByFrame(const std::string& animationName, unsigned frame = 0);
    /**
     * - Stop a specific animation at the specific progress.
     * @param animationName - The name of animation data.
     * @param progress - The stop progress value.
     * @returns The played animation state.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 在指定的进度停止指定的动画播放。
     * @param animationName - 动画数据名称。
     * @param progress - 停止进度。
     * @returns 播放的动画状态。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    AnimationState* gotoAndStopByProgress(const std::string& animationName, float progress = 0.f);
    /**
     * - Get a specific animation state.
     * @param animationName - The name of animation state.
     * @example
     * TypeScript style, for reference only.
     * <pre>
     *     armature.animation.play("walk");
     *     let walkState = armature.animation.getState("walk");
     *     walkState.timeScale = 0.5;
     * </pre>
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 获取指定的动画状态
     * @param animationName - 动画状态名称。
     * @example
     * TypeScript 风格，仅供参考。
     * <pre>
     *     armature.animation.play("walk");
     *     let walkState = armature.animation.getState("walk");
     *     walkState.timeScale = 0.5;
     * </pre>
     * @version DragonBones 3.0
     * @language zh_CN
     */
    AnimationState* getState(const std::string& animationName) const;
    /**
     * - Check whether a specific animation data is included.
     * @param animationName - The name of animation data.
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 检查是否包含指定的动画数据
     * @param animationName - 动画数据名称。
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    bool hasAnimation(const std::string& animationName) const;
    /**
     * - Get all the animation states.
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 获取所有的动画状态
     * @version DragonBones 5.1
     * @language zh_CN
     */
    inline const std::vector<AnimationState*>& getStates() const {
        return _animationStates;
    }
    /**
     * - Check whether there is an animation state is playing
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 检查是否有动画状态正在播放
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language zh_CN
     */
    bool isPlaying() const;
    /**
     * - Check whether all the animation states' playing were finished.
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 检查是否所有的动画状态均已播放完毕。
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language zh_CN
     */
    bool isCompleted() const;
    /**
     * - The name of the last playing animation state.
     * @see #lastAnimationState
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 上一个播放的动画状态名称
     * @see #lastAnimationState
     * @version DragonBones 3.0
     * @language zh_CN
     */
    const std::string& getLastAnimationName() const;
    /**
     * - The name of all animation data
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 所有动画数据的名称
     * @version DragonBones 4.5
     * @language zh_CN
     */
    inline const std::vector<std::string>& getAnimationNames() const {
        return _animationNames;
    }
    /**
     * - All animation data.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 所有的动画数据。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    inline const std::map<std::string, AnimationData*>& getAnimations() const {
        return _animations;
    }
    void setAnimations(const std::map<std::string, AnimationData*>& value);
    /**
     * - An AnimationConfig instance that can be used quickly.
     * @see dragonBones.AnimationConfig
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 一个可以快速使用的动画配置实例。
     * @see dragonBones.AnimationConfig
     * @version DragonBones 5.0
     * @language zh_CN
     */
    AnimationConfig* getAnimationConfig() const;
    /**
     * - The last playing animation state
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 上一个播放的动画状态
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline AnimationState* getLastAnimationState() const {
        return _lastAnimationState;
    }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_ANIMATION_H
