declare namespace dragonBones {
    /**
     * @private
     */
    const enum ArmatureType {
        Armature = 0,
        MovieClip = 1,
        Stage = 2,
    }
    /**
     * @private
     */
    const enum DisplayType {
        Image = 0,
        Armature = 1,
        Mesh = 2,
    }
    /**
     * @private
     */
    const enum ExtensionType {
        FFD = 0,
        AdjustColor = 10,
        BevelFilter = 11,
        BlurFilter = 12,
        DropShadowFilter = 13,
        GlowFilter = 14,
        GradientBevelFilter = 15,
        GradientGlowFilter = 16,
    }
    /**
     * @private
     */
    const enum EventType {
        Frame = 10,
        Sound = 11,
    }
    /**
     * @private
     */
    const enum ActionType {
        Play = 0,
        Stop = 1,
        GotoAndPlay = 2,
        GotoAndStop = 3,
        FadeIn = 4,
        FadeOut = 5,
    }
    /**
     * @private
     */
    const enum BlendMode {
        Normal = 0,
        Add = 1,
        Alpha = 2,
        Darken = 3,
        Difference = 4,
        Erase = 5,
        HardLight = 6,
        Invert = 7,
        Layer = 8,
        Lighten = 9,
        Multiply = 10,
        Overlay = 11,
        Screen = 12,
        Subtract = 13,
    }
    /**
     * @private
     */
    interface Map<T> {
        [key: string]: T;
    }
    /**
     * DragonBones
     */
    class DragonBones {
        /**
         * @private
         */
        static PI_D: number;
        /**
         * @private
         */
        static PI_H: number;
        /**
         * @private
         */
        static PI_Q: number;
        /**
         * @private
         */
        static ANGLE_TO_RADIAN: number;
        /**
         * @private
         */
        static RADIAN_TO_ANGLE: number;
        /**
         * @private
         */
        static SECOND_TO_MILLISECOND: number;
        static VERSION: string;
        /**
         * @private
         */
        static debug: boolean;
        /**
         * @private
         */
        static debugDraw: boolean;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 基础对象。
     * @version DragonBones 4.5
     */
    abstract class BaseObject {
        private static _hashCode;
        private static _defaultMaxCount;
        private static _maxCountMap;
        private static _poolsMap;
        private static _returnObject(object);
        /**
         * @language zh_CN
         * 设置每种对象池的最大缓存数量。
         * @param objectConstructor 对象类。
         * @param maxCount 最大缓存数量。 (设置为 0 则不缓存)
         * @version DragonBones 4.5
         */
        static setMaxCount(objectConstructor: typeof BaseObject, maxCount: number): void;
        /**
         * @language zh_CN
         * 清除对象池缓存的对象。
         * @param objectConstructor 对象类。 (不设置则清除所有缓存)
         * @version DragonBones 4.5
         */
        static clearPool(objectConstructor?: typeof BaseObject): void;
        /**
         * @language zh_CN
         * 从对象池中创建指定对象。
         * @param objectConstructor 对象类。
         * @version DragonBones 4.5
         */
        static borrowObject<T extends BaseObject>(objectConstructor: {
            new (): T;
        }): T;
        /**
         * @language zh_CN
         * 对象的唯一标识。
         * @version DragonBones 4.5
         */
        hashCode: number;
        /**
         * @private
         */
        protected abstract _onClear(): void;
        /**
         * @language zh_CN
         * 清除数据并返还对象池。
         * @version DragonBones 4.5
         */
        returnToPool(): void;
    }
}
declare namespace dragonBones {
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 动画混合时，使用的淡出方式。
     * @see dragonBones.Animation#fadeIn()
     * @version DragonBones 4.5
     */
    const enum AnimationFadeOutMode {
        /**
         * @language zh_CN
         * 不淡出动画。
         * @version DragonBones 4.5
         */
        None = 0,
        /**
        * @language zh_CN
         * 淡出同层的动画。
         * @version DragonBones 4.5
         */
        SameLayer = 1,
        /**
         * @language zh_CN
         * 淡出同组的动画。
         * @version DragonBones 4.5
         */
        SameGroup = 2,
        /**
         * @language zh_CN
         * 淡出同层并且同组的动画。
         * @version DragonBones 4.5
         */
        SameLayerAndGroup = 3,
        /**
         * @language zh_CN
         * 淡出所有动画。
         * @version DragonBones 4.5
         */
        All = 4,
    }
    /**
     * @language zh_CN
     * 播放动画组件接口。 (Armature 和 WordClock 都实现了该接口)
     * 任何实现了此接口的实例都可以加到 WorldClock 时钟中，由时钟统一控制动画的播放。
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    interface IAnimateble {
        /**
        * @language zh_CN
        * 更新一个指定的时间。
        * @param passedTime 前进的时间。 (以秒为单位)
        * @version DragonBones 3.0
        */
        advanceTime(passedTime: number): void;
    }
    /**
     * @language zh_CN
     * 动画控制器，用来播放动画数据，管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    class Animation extends BaseObject {
        /**
         * @private
         */
        private static _sortAnimationState(a, b);
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 动画的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        timeScale: number;
        /**
         * @private
         */
        _armature: Armature;
        private _isPlaying;
        private _time;
        private _duration;
        private _lastAnimationState;
        private _animations;
        private _animationNames;
        private _animationStates;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        private _fadeOut(fadeOutTime, layer, group, fadeOutMode, pauseFadeOut);
        /**
         * @language zh_CN
         * 清除所有正在播放的动画状态。
         * @version DragonBones 4.5
         */
        reset(): void;
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        stop(animationName?: string): void;
        /**
         * @language zh_CN
         * 播放动画。
         * @param animationName 动画数据的名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。
         * @param playTimes 动画需要播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        play(animationName?: string, playTimes?: number): AnimationState;
        /**
         * @language zh_CN
         * 淡入播放指定名称的动画。
         * @param animationName 动画数据的名称。
         * @param playTimes 循环播放的次数。 [-1: 使用数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入的时间。 [-1: 使用数据默认值, [0~N]: N 秒淡入完毕] (以秒为单位)
         * @param layer 混合的图层，图层高会优先获取混合权重。
         * @param group 混合的组，用于给动画状态编组，方便混合淡出控制。
         * @param fadeOutMode 淡出的模式。
         * @param additiveBlending 以叠加的形式混合。
         * @param displayControl 是否对显示对象属性可控。
         * @param pauseFadeOut 暂停需要淡出的动画。
         * @param pauseFadeIn 暂停需要淡入的动画，直到淡入结束才开始播放。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationFadeOutMode
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        fadeIn(animationName: string, fadeInTime?: number, playTimes?: number, layer?: number, group?: string, fadeOutMode?: AnimationFadeOutMode, additiveBlending?: boolean, displayControl?: boolean, pauseFadeOut?: boolean, pauseFadeIn?: boolean): AnimationState;
        /**
         * @language zh_CN
         * 指定名称的动画从指定时间开始播放。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @param playTimes 动画循环播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param toTime 播放到指定的时间，如果未设置则播放整个动画。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndPlayByTime(animationName: string, time?: number, playTimes?: number, toTime?: number): AnimationState;
        /**
         * @language zh_CN
         * 指定名称的动画从指定帧开始播放。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param toFrame 播放到指定的帧，如果未设置则播放整个动画。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndPlayByFrame(animationName: string, frame?: number, playTimes?: number, toFrame?: number): AnimationState;
        /**
         * @language zh_CN
         * 指定名称的动画从指定进度开始播放。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param toProgress 播放到指定的进度，如果未设置则播放整个动画。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndPlayByProgress(animationName: string, progress?: number, playTimes?: number, toProgress?: number): AnimationState;
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的时间并停止。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndStopByTime(animationName: string, time?: number): AnimationState;
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的帧并停止。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndStopByFrame(animationName: string, frame?: number): AnimationState;
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的进度并停止。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndStopByProgress(animationName: string, progress?: number): AnimationState;
        /**
         * @language zh_CN
         * 获取指定名称的动画状态。
         * @param animationName 动画状态的名称。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        getState(animationName: string): AnimationState;
        /**
         * @language zh_CN
         * 是否包含指定名称的动画数据。
         * @param animationName 动画数据的名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        hasAnimation(animationName: string): boolean;
        /**
         * @language zh_CN
         * 动画是否处于播放状态。
         * @version DragonBones 3.0
         */
        isPlaying: boolean;
        /**
         * @language zh_CN
         * 所有动画状态是否均已播放完毕。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        isCompleted: boolean;
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态的名称。
         * @see #lastAnimationState
         * @version DragonBones 3.0
         */
        lastAnimationName: string;
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        lastAnimationState: AnimationState;
        /**
         * @language zh_CN
         * 所有动画数据名称。
         * @see #animations
         * @version DragonBones 4.5
         */
        animationNames: Array<string>;
        /**
         * @language zh_CN
         * 所有的动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         */
        animations: Map<AnimationData>;
        /**
         * @deprecated
         * @see #play()
         * @see #fadeIn()
         * @see #gotoAndPlayByTime()
         * @see #gotoAndPlayByFrame()
         * @see #gotoAndPlayByProgress()
         */
        gotoAndPlay(animationName: string, fadeInTime?: number, duration?: number, playTimes?: number, layer?: number, group?: string, fadeOutMode?: AnimationFadeOutMode, pauseFadeOut?: boolean, pauseFadeIn?: boolean): AnimationState;
        /**
         * @deprecated
         * @see #gotoAndStopByTime()
         * @see #gotoAndStopByFrame()
         * @see #gotoAndStopByProgress()
         */
        gotoAndStop(animationName: string, time?: number): AnimationState;
        /**
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        animationList: Array<string>;
        /**
         * @language zh_CN
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        animationDataList: Array<AnimationData>;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 动画状态，播放动画时产生，可以对单个动画的播放进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    class AnimationState extends BaseObject {
        /**
         * @private
         */
        static stateActionEnabled: boolean;
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 是否对插槽的颜色，显示序列索引，深度排序，行为等拥有控制的权限。
         * @see dragonBones.Slot#displayController
         * @version DragonBones 3.0
         */
        displayControl: boolean;
        /**
         * @language zh_CN
         * 是否以叠加的方式混合动画。
         * @version DragonBones 3.0
         */
        additiveBlending: boolean;
        /**
         * @private
         */
        actionEnabled: boolean;
        /**
         * @language zh_CN
         * 需要播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         */
        playTimes: number;
        /**
         * @language zh_CN
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        timeScale: number;
        /**
         * @language zh_CN
         * 进行动画混合时的权重。
         * @default 1
         * @version DragonBones 3.0
         */
        weight: number;
        /**
         * @language zh_CN
         * 自动淡出时需要的时间，当设置一个大于等于 0 的值，动画状态将会在播放完成后自动淡出。 (以秒为单位)
         * @default -1
         * @version DragonBones 3.0
         */
        autoFadeOutTime: number;
        /**
         * @private
         */
        fadeTotalTime: number;
        /**
         * @private
         */
        private _isPlaying;
        /**
         * @private
         */
        private _isPausePlayhead;
        /**
         * @private
         */
        private _fadeTime;
        /**
         * @private
         */
        private _time;
        /**
         * @private
         */
        private _name;
        /**
         * @private
         */
        private _armature;
        /**
         * @private
         */
        private _animationData;
        /**
         * @private
         */
        private _zOrderTimeline;
        /**
         * @private
         */
        private _boneMask;
        /**
         * @private
         */
        private _boneTimelines;
        /**
         * @private
         */
        private _slotTimelines;
        /**
         * @private
         */
        private _ffdTimelines;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        private _updateTimelineStates();
        private _advanceFadeTime(passedTime);
        /**
         * @language zh_CN
         * 继续播放。
         * @version DragonBones 3.0
         */
        play(): void;
        /**
         * @language zh_CN
         * 暂停播放。
         * @version DragonBones 3.0
         */
        stop(): void;
        /**
         * @language zh_CN
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。 [true: 暂停, false: 不暂停]
         * @version DragonBones 3.0
         */
        fadeOut(fadeOutTime: number, pausePlayhead?: boolean): void;
        /**
         * @language zh_CN
         * 是否包含指定的骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         */
        containsBoneMask(name: string): boolean;
        /**
         * @language zh_CN
         * 添加指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         */
        addBoneMask(name: string, recursive?: boolean): void;
        /**
         * @language zh_CN
         * 删除指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         */
        removeBoneMask(name: string, recursive?: boolean): void;
        /**
         * @language zh_CN
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         */
        removeAllBoneMask(): void;
        /**
         * @language zh_CN
         * 动画图层。
         * @see dragonBones.Animation#fadeIn()
         * @version DragonBones 3.0
         */
        layer: number;
        /**
         * @language zh_CN
         * 动画组。
         * @see dragonBones.Animation#fadeIn()
         * @version DragonBones 3.0
         */
        group: string;
        /**
         * @language zh_CN
         * 动画名称。
         * @see dragonBones.AnimationData#name
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        animationData: AnimationData;
        /**
         * @language zh_CN
         * 是否播放完毕。
         * @version DragonBones 3.0
         */
        isCompleted: boolean;
        /**
         * @language zh_CN
         * 是否正在播放。
         * @version DragonBones 3.0
         */
        isPlaying: boolean;
        /**
         * @language zh_CN
         * 当前动画的播放次数。
         * @version DragonBones 3.0
         */
        currentPlayTimes: number;
        /**
         * @language zh_CN
         * 当前动画的总时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        totalTime: number;
        /**
         * @language zh_CN
         * 当前动画的播放时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        currentTime: number;
        /**
         * @deprecated
         */
        autoTween: boolean;
        /**
         * @deprecated
         * @see #animationData
         */
        clip: AnimationData;
    }
}
declare namespace dragonBones {
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * WorldClock 提供时钟的支持，为每个加入到时钟的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimatable
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    class WorldClock implements IAnimateble {
        private static _clock;
        /**
         * @language zh_CN
         * 一个可以直接使用的全局 WorldClock 实例.
         * @version DragonBones 3.0
         */
        static clock: WorldClock;
        /**
         * @language zh_CN
         * 当前的时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        time: number;
        /**
         * @language zh_CN
         * 时间流逝的速度，用于实现动画的变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        timeScale: number;
        private _animatebles;
        /**
         * @language zh_CN
         * 创建一个新的 WorldClock 实例。
         * 通常并不需要单独创建 WorldClock 的实例，可以直接使用 WorldClock.clock 静态实例。
         * (创建更多独立的 WorldClock 可以更灵活的为需要更新的 IAnimateble 实例分组，实现不同组不同速度的动画播放)
         * @version DragonBones 3.0
         */
        constructor();
        /**
         * @language zh_CN
         * 为所有的 IAnimatable 实例向前播放一个指定的时间。 (通常这个方法需要在 ENTER_FRAME 事件的响应函数中被调用)
         * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
         * @version DragonBones 3.0
         */
        advanceTime(passedTime: number): void;
        /**
         * 是否包含指定的 IAnimatable 实例
         * @param value 指定的 IAnimatable 实例。
         * @returns  [true: 包含，false: 不包含]。
         * @version DragonBones 3.0
         */
        contains(value: IAnimateble): boolean;
        /**
         * @language zh_CN
         * 添加指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        add(value: IAnimateble): void;
        /**
         * @language zh_CN
         * 移除指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        remove(value: IAnimateble): void;
        /**
         * @language zh_CN
         * 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         */
        clear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 基础变换对象。
     * @version DragonBones 4.5
     */
    abstract class TransformObject extends BaseObject {
        /**
         * @language zh_CN
         * 可以用于存储临时数据。
         * @version DragonBones 3.0
         */
        userData: any;
        /**
         * @language zh_CN
         * 对象的名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 相对于骨架坐标系的矩阵。
         * @version DragonBones 3.0
         */
        globalTransformMatrix: Matrix;
        /**
         * @language zh_CN
         * 相对于骨架坐标系的变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        global: Transform;
        /**
         * @language zh_CN
         * 相对于骨架或父骨骼坐标系的绑定变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        origin: Transform;
        /**
         * @language zh_CN
         * 相对于骨架或父骨骼坐标系的偏移变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        offset: Transform;
        /**
         * @private
         */
        _armature: Armature;
        /**
         * @private
         */
        _parent: Bone;
        /**
         * @private
         */
        protected _globalTransformMatrix: Matrix;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @language zh_CN
         * 所属的骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        armature: Armature;
        /**
         * @language zh_CN
         * 所属的父骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        parent: Bone;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @see dragonBones.IArmatureDisplay
     * @version DragonBones 3.0
     */
    class Armature extends BaseObject implements IAnimateble {
        /**
         * @private
         */
        static toString(): string;
        private static _onSortSlots(a, b);
        /**
         * @language zh_CN
         * 可以用于存储临时数据。
         * @version DragonBones 3.0
         */
        userData: any;
        /**
         * @private
         */
        _cacheFrameIndex: number;
        /**
         * @private
         */
        _armatureData: ArmatureData;
        /**
         * @private
         */
        _skinData: SkinData;
        /**
         * @private
         */
        _animation: Animation;
        /**
         * @private
         */
        _display: IArmatureDisplay;
        /**
         * @private
         */
        _eventManager: IEventDispatcher;
        private _delayDispose;
        private _lockDispose;
        private _slotsDirty;
        private _replacedTexture;
        private _bones;
        private _slots;
        private _actions;
        private _events;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        private _sortBones();
        private _sortSlots();
        private _doAction(value);
        /**
         * @private
         */
        _sortZOrder(slotIndices: Array<number>): void;
        /**
         * @private
         */
        _bufferAction(value: ActionData): void;
        /**
         * @language zh_CN
         * 释放骨架。 (会回收到内存池)
         * @version DragonBones 3.0
         */
        dispose(): void;
        /**
         * @language zh_CN
         * 更新骨架和动画。 (可以使用时钟实例或显示容器来更新)
         * @param passedTime 两帧之前的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @see dragonBones.IArmatureDisplay
         * @version DragonBones 3.0
         */
        advanceTime(passedTime: number): void;
        /**
         * @language zh_CN
         * 更新骨骼和插槽的变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
         * @param updateSlotDisplay 是否更新插槽的显示对象。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        invalidUpdate(boneName?: string, updateSlotDisplay?: boolean): void;
        /**
         * @language zh_CN
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        getBone(name: string): Bone;
        /**
         * @language zh_CN
         * 通过显示对象获取骨骼。
         * @param display 显示对象。
         * @returns 包含这个显示对象的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        getBoneByDisplay(display: any): Bone;
        /**
         * @language zh_CN
         * 获取指定名称的插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        getSlot(name: string): Slot;
        /**
         * @language zh_CN
         * 通过显示对象获取插槽。
         * @param display 显示对象。
         * @returns 包含这个显示对象的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        getSlotByDisplay(display: any): Slot;
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
         * @param texture 贴图。
         * @version DragonBones 4.5
         */
        replaceTexture(texture: any): void;
        /**
         * @language zh_CN
         * 获取所有骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        getBones(): Array<Bone>;
        /**
         * @language zh_CN
         * 获取所有插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        getSlots(): Array<Slot>;
        /**
         * @language zh_CN
         * 骨架名称。
         * @see dragonBones.ArmatureData#name
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 获取骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         */
        armatureData: ArmatureData;
        /**
         * @language zh_CN
         * 获得动画控制器。
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         */
        animation: Animation;
        /**
         * @language zh_CN
         * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
         * @version DragonBones 3.0
         */
        display: IArmatureDisplay | any;
        /**
         * @language zh_CN
         * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         */
        parent: Slot;
        /**
         * @language zh_CN
         * 动画缓存的帧率，当设置一个大于 0 的帧率时，将会开启动画缓存。
         * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
         * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
         * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         */
        cacheFrameRate: number;
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
         * @version DragonBones 4.5
         */
        replacedTexture: any;
        /**
         * @language zh_CN
         * 开启动画缓存。
         * @param frameRate 动画缓存的帧率
         * @see #cacheFrameRate
         * @version DragonBones 4.5
         */
        enableAnimationCache(frameRate: number): void;
        /**
         * @language zh_CN
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @returns  [true: 包含, false: 不包含]
         * @version DragonBones 3.0
         */
        hasEventListener(type: EventStringType): void;
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        addEventListener(type: EventStringType, listener: Function, target: any): void;
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        removeEventListener(type: EventStringType, listener: Function, target: any): void;
        /**
         * @deprecated
         */
        addBone(value: Bone, parentName?: string): void;
        /**
         * @deprecated
         */
        addSlot(value: Slot, parentName: string): void;
        /**
         * @deprecated
         */
        removeBone(value: Bone): void;
        /**
         * @deprecated
         */
        removeSlot(value: Slot): void;
        /**
         * @deprecated
         * @see #display
         */
        getDisplay(): any;
        /**
         * @deprecated
         * @see #cacheFrameRate
         */
        enableCache: boolean;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
     * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    class Bone extends TransformObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 是否继承父骨骼的平移。 [true: 继承, false: 不继承]
         * @version DragonBones 3.0
         */
        inheritTranslation: boolean;
        /**
         * @language zh_CN
         * 是否继承父骨骼的旋转。 [true: 继承, false: 不继承]
         * @version DragonBones 3.0
         */
        inheritRotation: boolean;
        /**
         * @language zh_CN
         * 是否继承父骨骼的缩放。 [true: 继承, false: 不继承]
         * @version DragonBones 4.5
         */
        inheritScale: boolean;
        /**
         * @language zh_CN
         * IK 约束时骨骼方向是否为顺时针方向。 [true: 顺时针, false: 逆时针]
         * @version DragonBones 4.5
         */
        ikBendPositive: boolean;
        /**
         * @language zh_CN
         * IK 约束的权重。
         * @version DragonBones 4.5
         */
        ikWeight: number;
        /**
         * @language zh_CN
         * 骨骼长度。
         * @version DragonBones 4.5
         */
        length: number;
        /**
         * @private
         */
        private _visible;
        /**
         * @private
         */
        private _ikChain;
        /**
         * @private
         */
        private _ikChainIndex;
        /**
         * @private
         */
        private _ik;
        /**
         * @private
         */
        private _bones;
        /**
         * @private
         */
        private _slots;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        private _updateGlobalTransformMatrix();
        /**
         * @private
         */
        private _computeIKA();
        /**
         * @private
         */
        private _computeIKB();
        /**
         * @inheritDoc
         */
        _setArmature(value: Armature): void;
        /**
         * @language zh_CN
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         */
        invalidUpdate(): void;
        /**
         * @language zh_CN
         * 是否包含某个指定的骨骼或插槽。
         * @returns [true: 包含，false: 不包含]
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         */
        contains(child: TransformObject): boolean;
        /**
         * @language zh_CN
         * 所有的子骨骼。
         * @version DragonBones 3.0
         */
        getBones(): Array<Bone>;
        /**
         * @language zh_CN
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        getSlots(): Array<Slot>;
        /**
         * @private
         */
        ikChain: number;
        /**
         * @private
         */
        ikChainIndex: number;
        /**
         * @language zh_CN
         * 当前的 IK 约束目标。
         * @version DragonBones 4.5
         */
        ik: Bone;
        /**
         * @language zh_CN
         * 控制此骨骼所有插槽的显示。
         * @default true
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        visible: boolean;
        /**
         * @deprecated
         * @see dragonBones.Armature#getSlot()
         */
        slot: Slot;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架显示容器和事件的接口。
     * @see dragonBones.Armature#display
     * @version DragonBones 4.5
     */
    interface IArmatureDisplay extends IEventDispatcher {
        /**
         * @language zh_CN
         * 释放显示对象和骨架。
         * @version DragonBones 4.5
         */
        dispose(): void;
        /**
         * @language zh_CN
         * 获取使用这个显示容器的骨架。
         * @readOnly
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         */
        armature: Armature;
        /**
         * @language zh_CN
         * 获取使用骨架的动画控制器。
         * @readOnly
         * @see dragonBones.Animation
         * @version DragonBones 4.5
         */
        animation: Animation;
        /**
         * @language zh_CN
         * 由显示容器来更新骨架和动画。
         * @param on 开启或关闭显示容器对骨架与动画的更新。
         * @version DragonBones 4.5
         */
        advanceTimeBySelf(on: boolean): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    abstract class Slot extends TransformObject {
        private static _helpPoint;
        private static _helpMatrix;
        /**
         * @language zh_CN
         * 子骨架是否继承父骨架的动画。 [true: 继承, false: 不继承]
         * @default true
         * @version DragonBones 4.5
         */
        inheritAnimation: boolean;
        /**
         * @language zh_CN
         * 显示对象受到控制的对象，应设置为动画状态的名称或组名称，设置为 null 则表示受所有的动画状态控制。
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         */
        displayController: string;
        /**
         * @private
         */
        _zOrder: number;
        /**
         * @private
         */
        _pivotX: number;
        /**
         * @private
         */
        _pivotY: number;
        /**
         * @private
         */
        _displayDataSet: SlotDisplayDataSet;
        /**
         * @private
         */
        _meshData: MeshData;
        /**
         * @private
         */
        _childArmature: Armature;
        /**
         * @private
         */
        _rawDisplay: any;
        /**
         * @private
         */
        _meshDisplay: any;
        /**
         * @private
         */
        _cacheFrames: Array<Matrix>;
        /**
         * @private
         */
        _colorTransform: ColorTransform;
        /**
         * @private
         */
        _ffdVertices: Array<number>;
        /**
         * @private
         */
        _replacedDisplayDataSet: Array<DisplayData>;
        /**
         * @private
         */
        protected _displayDirty: boolean;
        /**
         * @private
         */
        protected _blendModeDirty: boolean;
        /**
         * @private
         */
        protected _originDirty: boolean;
        /**
         * @private
         */
        protected _transformDirty: boolean;
        /**
         * @private
         */
        protected _displayIndex: number;
        /**
         * @private
         */
        protected _blendMode: BlendMode;
        /**
         * @private
         */
        protected _display: any;
        /**
         * @private
         */
        protected _localMatrix: Matrix;
        /**
         * @private
         */
        protected _displayList: Array<any | Armature>;
        /**
         * @private
         */
        protected _meshBones: Array<Bone>;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        protected abstract _initDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _disposeDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _onUpdateDisplay(): void;
        /**
         * @private
         */
        protected abstract _addDisplay(): void;
        /**
         * @private
         */
        protected abstract _replaceDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _removeDisplay(): void;
        /**
         * @private
         */
        protected abstract _updateZOrder(): void;
        /**
         * @private
         */
        protected abstract _updateBlendMode(): void;
        /**
         * @private
         */
        protected abstract _updateColor(): void;
        /**
         * @private
         */
        protected abstract _updateFilters(): void;
        /**
         * @private
         */
        protected abstract _updateFrame(): void;
        /**
         * @private
         */
        protected abstract _updateMesh(): void;
        /**
         * @private
         */
        protected abstract _updateTransform(): void;
        private _isMeshBonesUpdate();
        /**
         * @private
         */
        protected _updatePivot(rawDisplayData: DisplayData, currentDisplayData: DisplayData, currentTextureData: TextureData): void;
        /**
         * @private
         */
        protected _updateDisplay(): void;
        /**
         * @private
         */
        protected _updateLocalTransformMatrix(): void;
        /**
         * @private
         */
        protected _updateGlobalTransformMatrix(): void;
        /**
         * @private Factory
         */
        _setDisplayList(value: Array<any>): boolean;
        /**
         * @language zh_CN
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         */
        invalidUpdate(): void;
        /**
         * @private
         */
        rawDisplay: any;
        /**
         * @private
         */
        MeshDisplay: any;
        /**
         * @language zh_CN
         * 此时显示的显示对象在显示列表中的索引。
         * @version DragonBones 4.5
         */
        displayIndex: number;
        /**
         * @language zh_CN
         * 包含显示对象或子骨架的显示列表。
         * @version DragonBones 3.0
         */
        displayList: Array<any>;
        /**
         * @language zh_CN
         * 此时显示的显示对象。
         * @version DragonBones 3.0
         */
        display: any;
        /**
         * @language zh_CN
         * 此时显示的子骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        childArmature: Armature;
        /**
         * @deprecated
         * @see #display
         */
        getDisplay(): any;
        /**
         * @deprecated
         * @see #display
         */
        setDisplay(value: any): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    type EventStringType = string | "start" | "loopComplete" | "complete" | "fadeIn" | "fadeInComplete" | "fadeOut" | "fadeOutComplete" | "frameEvent" | "soundEvent";
    /**
     * @language zh_CN
     * 事件接口。
     * @version DragonBones 4.5
     */
    interface IEventDispatcher {
        /**
         * @language zh_CN
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @returns  [true: 包含, false: 不包含]
         * @version DragonBones 4.5
         */
        hasEvent(type: EventStringType): boolean;
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         */
        addEvent(type: EventStringType, listener: Function, target: any): void;
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         */
        removeEvent(type: EventStringType, listener: Function, target: any): void;
    }
    /**
     * @language zh_CN
     * 事件数据。
     * @version DragonBones 4.5
     */
    class EventObject extends BaseObject {
        /**
         * @language zh_CN
         * 动画开始。
         * @version DragonBones 4.5
         */
        static START: string;
        /**
         * @language zh_CN
         * 动画循环播放一次完成。
         * @version DragonBones 4.5
         */
        static LOOP_COMPLETE: string;
        /**
         * @language zh_CN
         * 动画播放完成。
         * @version DragonBones 4.5
         */
        static COMPLETE: string;
        /**
         * @language zh_CN
         * 动画淡入开始。
         * @version DragonBones 4.5
         */
        static FADE_IN: string;
        /**
         * @language zh_CN
         * 动画淡入完成。
         * @version DragonBones 4.5
         */
        static FADE_IN_COMPLETE: string;
        /**
         * @language zh_CN
         * 动画淡出开始。
         * @version DragonBones 4.5
         */
        static FADE_OUT: string;
        /**
         * @language zh_CN
         * 动画淡出完成。
         * @version DragonBones 4.5
         */
        static FADE_OUT_COMPLETE: string;
        /**
         * @language zh_CN
         * 动画帧事件。
         * @version DragonBones 4.5
         */
        static FRAME_EVENT: string;
        /**
         * @language zh_CN
         * 动画声音事件。
         * @version DragonBones 4.5
         */
        static SOUND_EVENT: string;
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 事件类型。
         * @version DragonBones 4.5
         */
        type: EventStringType;
        /**
         * @language zh_CN
         * 事件名称。 (帧标签的名称或声音的名称)
         * @version DragonBones 4.5
         */
        name: string;
        /**
         * @language zh_CN
         * 扩展的数据。
         * @version DragonBones 4.5
         */
        data: any;
        /**
         * @language zh_CN
         * 发出事件的骨架。
         * @version DragonBones 4.5
         */
        armature: Armature;
        /**
         * @language zh_CN
         * 发出事件的骨骼。
         * @version DragonBones 4.5
         */
        bone: Bone;
        /**
         * @language zh_CN
         * 发出事件的插槽。
         * @version DragonBones 4.5
         */
        slot: Slot;
        /**
         * @language zh_CN
         * 发出事件的动画状态。
         * @version DragonBones 4.5
         */
        animationState: AnimationState;
        /**
         * @private
         */
        frame: AnimationFrameData;
        /**
         * @language zh_CN
         * 用户数据。
         * @version DragonBones 4.5
         */
        userData: any;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    class ColorTransform {
        alphaMultiplier: number;
        redMultiplier: number;
        greenMultiplier: number;
        blueMultiplier: number;
        alphaOffset: number;
        redOffset: number;
        greenOffset: number;
        blueOffset: number;
        constructor(alphaMultiplier?: number, redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaOffset?: number, redOffset?: number, greenOffset?: number, blueOffset?: number);
        copyFrom(value: ColorTransform): void;
        identity(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 2D 矩阵。
     * @version DragonBones 3.0
     */
    class Matrix {
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        /**
         * @private
         */
        toString(): string;
        /**
         * @language zh_CN
         * 复制矩阵。
         * @param value 需要复制的矩阵。
         * @version DragonBones 3.0
         */
        copyFrom(value: Matrix): void;
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        identity(): void;
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        concat(value: Matrix): void;
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        invert(): void;
        /**
         * @language zh_CN
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         */
        transformPoint(x: number, y: number, result: {
            x: number;
            y: number;
        }, delta?: boolean): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        copyFrom(value: Point): void;
        clear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        copyFrom(value: Rectangle): void;
        clear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 2D 变换。
     * @version DragonBones 3.0
     */
    class Transform {
        /**
         * @language zh_CN
         * 水平位移。
         * @version DragonBones 3.0
         */
        x: number;
        /**
         * @language zh_CN
         * 垂直位移。
         * @version DragonBones 3.0
         */
        y: number;
        /**
         * @language zh_CN
         * 水平倾斜。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        skewX: number;
        /**
         * @language zh_CN
         * 垂直倾斜。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        skewY: number;
        /**
         * @language zh_CN
         * 水平缩放。
         * @version DragonBones 3.0
         */
        scaleX: number;
        /**
         * @language zh_CN
         * 垂直缩放。
         * @version DragonBones 3.0
         */
        scaleY: number;
        /**
         * @private
         */
        static normalizeRadian(value: number): number;
        /**
         * @private
         */
        constructor(
            /**
             * @language zh_CN
             * 水平位移。
             * @version DragonBones 3.0
             */
            x?: number, 
            /**
             * @language zh_CN
             * 垂直位移。
             * @version DragonBones 3.0
             */
            y?: number, 
            /**
             * @language zh_CN
             * 水平倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewX?: number, 
            /**
             * @language zh_CN
             * 垂直倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewY?: number, 
            /**
             * @language zh_CN
             * 水平缩放。
             * @version DragonBones 3.0
             */
            scaleX?: number, 
            /**
             * @language zh_CN
             * 垂直缩放。
             * @version DragonBones 3.0
             */
            scaleY?: number);
        /**
         * @private
         */
        toString(): string;
        /**
         * @private
         */
        copyFrom(value: Transform): Transform;
        /**
         * @private
         */
        identity(): Transform;
        /**
         * @private
         */
        add(value: Transform): Transform;
        /**
         * @private
         */
        minus(value: Transform): Transform;
        /**
         * @private
         */
        fromMatrix(matrix: Matrix): Transform;
        /**
         * @language zh_CN
         * 转换为矩阵。
         * @param 矩阵。
         * @version DragonBones 3.0
         */
        toMatrix(matrix: Matrix): Transform;
        /**
         * @language zh_CN
         * 旋转。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        rotation: number;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    abstract class TimelineData<T extends FrameData<T>> extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        scale: number;
        /**
         * @private
         */
        offset: number;
        /**
         * @private
         */
        frames: Array<T>;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class ZOrderTimelineData extends TimelineData<ZOrderFrameData> {
        static toString(): string;
    }
    /**
     * @private
     */
    class BoneTimelineData extends TimelineData<BoneFrameData> {
        static cacheFrame(cacheFrames: Array<Matrix>, cacheFrameIndex: number, globalTransformMatrix: Matrix): Matrix;
        static toString(): string;
        bone: BoneData;
        originalTransform: Transform;
        cachedFrames: Array<Matrix>;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        cacheFrames(cacheFrameCount: number): void;
    }
    /**
     * @private
     */
    class SlotTimelineData extends TimelineData<SlotFrameData> {
        static cacheFrame(cacheFrames: Array<Matrix>, cacheFrameIndex: number, globalTransformMatrix: Matrix): Matrix;
        static toString(): string;
        slot: SlotData;
        cachedFrames: Array<Matrix>;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        cacheFrames(cacheFrameCount: number): void;
    }
    /**
     * @private
     */
    class FFDTimelineData extends TimelineData<ExtensionFrameData> {
        static toString(): string;
        displayIndex: number;
        skin: SkinData;
        slot: SlotDisplayDataSet;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 动画数据。
     * @version DragonBones 3.0
     */
    class AnimationData extends TimelineData<AnimationFrameData> {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        hasAsynchronyTimeline: boolean;
        /**
         * @language zh_CN
         * 持续的帧数。
         * @version DragonBones 3.0
         */
        frameCount: number;
        /**
         * @language zh_CN
         * 循环播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         */
        playTimes: number;
        /**
         * @language zh_CN
         * 开始的时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        position: number;
        /**
         * @language zh_CN
         * 持续的时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        duration: number;
        /**
         * @language zh_CN
         * 淡入混合的时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        fadeInTime: number;
        /**
         * @private
         */
        cacheTimeToFrameScale: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @private
         */
        animation: AnimationData;
        /**
         * @private
         */
        zOrderTimeline: TimelineData<ZOrderFrameData>;
        /**
         * @private
         */
        boneTimelines: Map<BoneTimelineData>;
        /**
         * @private
         */
        slotTimelines: Map<SlotTimelineData>;
        /**
         * @private
         */
        ffdTimelines: Map<Map<Map<FFDTimelineData>>>;
        /**
         * @private
         */
        cachedFrames: Array<boolean>;
        /**
         * @private
         */
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        cacheFrames(value: number): void;
        /**
         * @private
         */
        addBoneTimeline(value: BoneTimelineData): void;
        /**
         * @private
         */
        addSlotTimeline(value: SlotTimelineData): void;
        /**
         * @private
         */
        addFFDTimeline(value: FFDTimelineData): void;
        /**
         * @private
         */
        getBoneTimeline(name: string): BoneTimelineData;
        /**
         * @private
         */
        getSlotTimeline(name: string): SlotTimelineData;
        /**
         * @private
         */
        getFFDTimeline(skinName: string, slotName: string, displayIndex: number): FFDTimelineData;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    class ArmatureData extends BaseObject {
        private static _onSortSlots(a, b);
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 动画帧率。
         * @version DragonBones 3.0
         */
        frameRate: number;
        /**
         * @language zh_CN
         * 骨架类型。
         * @see dragonBones.ArmatureType
         * @version DragonBones 3.0
         */
        type: ArmatureType;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @private
         */
        parent: DragonBonesData;
        /**
         * @private
         */
        userData: any;
        /**
         * @private
         */
        aabb: Rectangle;
        /**
         * @language zh_CN
         * 所有的骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        bones: Map<BoneData>;
        /**
         * @language zh_CN
         * 所有的插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        slots: Map<SlotData>;
        /**
         * @language zh_CN
         * 所有的皮肤数据。
         * @see dragonBones.SkinData
         * @version DragonBones 3.0
         */
        skins: Map<SkinData>;
        /**
         * @language zh_CN
         * 所有的动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        animations: Map<AnimationData>;
        /**
         * @private
         */
        actions: Array<ActionData>;
        /**
         * @private
         */
        cacheFrameRate: number;
        /**
         * @private
         */
        scale: number;
        private _boneDirty;
        private _slotDirty;
        private _defaultSkin;
        private _defaultAnimation;
        private _sortedBones;
        private _sortedSlots;
        private _bonesChildren;
        /**
         * @private
         */
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        private _sortBones();
        private _sortSlots();
        /**
         * @private
         */
        cacheFrames(value: number): void;
        /**
         * @private
         */
        addBone(value: BoneData, parentName: string): void;
        /**
         * @private
         */
        addSlot(value: SlotData): void;
        /**
         * @private
         */
        addSkin(value: SkinData): void;
        /**
         * @private
         */
        addAnimation(value: AnimationData): void;
        /**
         * @language zh_CN
         * 获取指定名称的骨骼数据。
         * @param name 骨骼数据名称。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        getBone(name: string): BoneData;
        /**
         * @language zh_CN
         * 获取指定名称的插槽数据。
         * @param name 插槽数据名称。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        getSlot(name: string): SlotData;
        /**
         * @language zh_CN
         * 获取指定名称的皮肤数据。
         * @param name 皮肤数据名称。
         * @see dragonBones.SkinData
         * @version DragonBones 3.0
         */
        getSkin(name: string): SkinData;
        /**
         * @language zh_CN
         * 获取指定名称的动画数据。
         * @param name 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        getAnimation(name: string): AnimationData;
        /**
         * @private
         */
        sortedBones: Array<BoneData>;
        /**
         * @private
         */
        sortedSlots: Array<SlotData>;
        /**
         * @language zh_CN
         * 获取默认的皮肤数据。
         * @see dragonBones.SkinData
         * @version DragonBones 4.5
         */
        defaultSkin: SkinData;
        /**
         * @language zh_CN
         * 获取默认的动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         */
        defaultAnimation: AnimationData;
    }
    /**
     * @language zh_CN
     * 骨骼数据。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    class BoneData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        inheritTranslation: boolean;
        /**
         * @private
         */
        inheritRotation: boolean;
        /**
         * @private
         */
        inheritScale: boolean;
        /**
         * @private
         */
        bendPositive: boolean;
        /**
         * @private
         */
        chain: number;
        /**
         * @private
         */
        chainIndex: number;
        /**
         * @private
         */
        weight: number;
        /**
         * @private
         */
        length: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 所属的父骨骼数据。
         * @version DragonBones 3.0
         */
        parent: BoneData;
        /**
         * @private
         */
        ik: BoneData;
        /**
         * @private
         */
        transform: Transform;
        /**
         * @private
         */
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @language zh_CN
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    class SlotData extends BaseObject {
        /**
         * @private
         */
        static DEFAULT_COLOR: ColorTransform;
        /**
         * @private
         */
        static generateColor(): ColorTransform;
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        displayIndex: number;
        /**
         * @private
         */
        zOrder: number;
        /**
         * @private
         */
        blendMode: BlendMode;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 所属的父骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        parent: BoneData;
        /**
         * @private
         */
        color: ColorTransform;
        /**
         * @private
         */
        actions: Array<ActionData>;
        /**
         * @private
         */
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @language zh_CN
     * 皮肤数据。
     * @version DragonBones 3.0
     */
    class SkinData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @private
         */
        slots: Map<SlotDisplayDataSet>;
        /**
         * @private
         */
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        addSlot(value: SlotDisplayDataSet): void;
        /**
         * @private
         */
        getSlot(name: string): SlotDisplayDataSet;
    }
    /**
     * @private
     */
    class SlotDisplayDataSet extends BaseObject {
        static toString(): string;
        slot: SlotData;
        displays: Array<DisplayData>;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class DisplayData extends BaseObject {
        static toString(): string;
        isRelativePivot: boolean;
        type: DisplayType;
        name: string;
        texture: TextureData;
        armature: ArmatureData;
        mesh: MeshData;
        pivot: Point;
        transform: Transform;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class MeshData extends BaseObject {
        static toString(): string;
        skinned: boolean;
        slotPose: Matrix;
        uvs: Array<number>;
        vertices: Array<number>;
        vertexIndices: Array<number>;
        boneIndices: Array<Array<number>>;
        weights: Array<Array<number>>;
        boneVertices: Array<Array<number>>;
        bones: Array<BoneData>;
        inverseBindPose: Array<Matrix>;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 龙骨数据，包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    class DragonBonesData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 是否开启共享搜索。 [true: 开启, false: 不开启]
         * @default false
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         */
        autoSearch: boolean;
        /**
         * @language zh_CN
         * 动画帧频。
         * @version DragonBones 3.0
         */
        frameRate: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 所有的骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        armatures: Map<ArmatureData>;
        private _armatureNames;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @language zh_CN
         * 获取指定名称的骨架。
         * @param name 骨架数据骨架名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        getArmature(name: string): ArmatureData;
        /**
         * @language zh_CN
         * 所有的骨架数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         */
        armatureNames: Array<string>;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        dispose(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    class ActionData extends BaseObject {
        static toString(): string;
        type: ActionType;
        bone: BoneData;
        slot: SlotData;
        data: Array<any>;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class EventData extends BaseObject {
        static toString(): string;
        type: EventType;
        name: string;
        data: any;
        bone: BoneData;
        slot: SlotData;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    abstract class FrameData<T> extends BaseObject {
        position: number;
        duration: number;
        prev: T;
        next: T;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    abstract class TweenFrameData<T> extends FrameData<T> {
        static samplingCurve(curve: Array<number>, frameCount: number): Array<number>;
        tweenEasing: number;
        curve: Array<number>;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class AnimationFrameData extends FrameData<AnimationFrameData> {
        static toString(): string;
        actions: Array<ActionData>;
        events: Array<EventData>;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class ZOrderFrameData extends FrameData<ZOrderFrameData> {
        zOrder: Array<number>;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class BoneFrameData extends TweenFrameData<BoneFrameData> {
        static toString(): string;
        tweenScale: boolean;
        tweenRotate: number;
        guideCurve: Array<number>;
        transform: Transform;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class SlotFrameData extends TweenFrameData<SlotFrameData> {
        static DEFAULT_COLOR: ColorTransform;
        static generateColor(): ColorTransform;
        static toString(): string;
        displayIndex: number;
        color: ColorTransform;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class ExtensionFrameData extends TweenFrameData<ExtensionFrameData> {
        static toString(): string;
        type: ExtensionType;
        tweens: Array<number>;
        keys: Array<number>;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    abstract class DataParser {
        protected static DATA_VERSION_2_3: string;
        protected static DATA_VERSION_3_0: string;
        protected static DATA_VERSION_4_0: string;
        protected static DATA_VERSION: string;
        protected static TEXTURE_ATLAS: string;
        protected static SUB_TEXTURE: string;
        protected static FORMAT: string;
        protected static IMAGE_PATH: string;
        protected static WIDTH: string;
        protected static HEIGHT: string;
        protected static ROTATED: string;
        protected static FRAME_X: string;
        protected static FRAME_Y: string;
        protected static FRAME_WIDTH: string;
        protected static FRAME_HEIGHT: string;
        protected static DRADON_BONES: string;
        protected static ARMATURE: string;
        protected static BONE: string;
        protected static IK: string;
        protected static SLOT: string;
        protected static SKIN: string;
        protected static DISPLAY: string;
        protected static ANIMATION: string;
        protected static Z_ORDER: string;
        protected static FFD: string;
        protected static FRAME: string;
        protected static PIVOT: string;
        protected static TRANSFORM: string;
        protected static AABB: string;
        protected static COLOR: string;
        protected static FILTER: string;
        protected static VERSION: string;
        protected static IS_GLOBAL: string;
        protected static FRAME_RATE: string;
        protected static TYPE: string;
        protected static NAME: string;
        protected static PARENT: string;
        protected static LENGTH: string;
        protected static DATA: string;
        protected static DISPLAY_INDEX: string;
        protected static BLEND_MODE: string;
        protected static INHERIT_TRANSLATION: string;
        protected static INHERIT_ROTATION: string;
        protected static INHERIT_SCALE: string;
        protected static TARGET: string;
        protected static BEND_POSITIVE: string;
        protected static CHAIN: string;
        protected static WEIGHT: string;
        protected static FADE_IN_TIME: string;
        protected static PLAY_TIMES: string;
        protected static SCALE: string;
        protected static OFFSET: string;
        protected static POSITION: string;
        protected static DURATION: string;
        protected static TWEEN_EASING: string;
        protected static TWEEN_ROTATE: string;
        protected static TWEEN_SCALE: string;
        protected static CURVE: string;
        protected static GUIDE_CURVE: string;
        protected static EVENT: string;
        protected static SOUND: string;
        protected static ACTION: string;
        protected static ACTIONS: string;
        protected static DEFAULT_ACTIONS: string;
        protected static X: string;
        protected static Y: string;
        protected static SKEW_X: string;
        protected static SKEW_Y: string;
        protected static SCALE_X: string;
        protected static SCALE_Y: string;
        protected static ALPHA_OFFSET: string;
        protected static RED_OFFSET: string;
        protected static GREEN_OFFSET: string;
        protected static BLUE_OFFSET: string;
        protected static ALPHA_MULTIPLIER: string;
        protected static RED_MULTIPLIER: string;
        protected static GREEN_MULTIPLIER: string;
        protected static BLUE_MULTIPLIER: string;
        protected static UVS: string;
        protected static VERTICES: string;
        protected static TRIANGLES: string;
        protected static WEIGHTS: string;
        protected static SLOT_POSE: string;
        protected static BONE_POSE: string;
        protected static TWEEN: string;
        protected static KEY: string;
        protected static COLOR_TRANSFORM: string;
        protected static TIMELINE: string;
        protected static PIVOT_X: string;
        protected static PIVOT_Y: string;
        protected static Z: string;
        protected static LOOP: string;
        protected static AUTO_TWEEN: string;
        protected static HIDE: string;
        protected static _getArmatureType(value: string): ArmatureType;
        protected static _getDisplayType(value: string): DisplayType;
        protected static _getBlendMode(value: string): BlendMode;
        protected static _getActionType(value: string): ActionType;
        protected _data: DragonBonesData;
        protected _armature: ArmatureData;
        protected _skin: SkinData;
        protected _slotDisplayDataSet: SlotDisplayDataSet;
        protected _mesh: MeshData;
        protected _animation: AnimationData;
        protected _timeline: any;
        protected _isOldData: boolean;
        protected _isGlobalTransform: boolean;
        protected _isAutoTween: boolean;
        protected _animationTweenEasing: number;
        protected _timelinePivot: Point;
        protected _helpPoint: Point;
        protected _helpTransformA: Transform;
        protected _helpTransformB: Transform;
        protected _helpMatrix: Matrix;
        protected _rawBones: Array<BoneData>;
        constructor();
        /**
         * @private
         */
        abstract parseDragonBonesData(rawData: any, scale: number): DragonBonesData;
        /**
         * @private
         */
        abstract parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number): void;
        private _getTimelineFrameMatrix(animation, timeline, position, transform);
        protected _globalToLocal(armature: ArmatureData): void;
        protected _mergeFrameToAnimationTimeline(framePostion: number, actions: Array<ActionData>, events: Array<EventData>): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        static parseDragonBonesData(rawData: any): DragonBonesData;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parsetTextureAtlasData()
         */
        static parseTextureAtlasData(rawData: any, scale?: number): any;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    class ObjectDataParser extends DataParser {
        /**
         * @private
         */
        protected static _getBoolean(rawData: any, key: string, defaultValue: boolean): boolean;
        /**
         * @private
         */
        protected static _getNumber(rawData: any, key: string, defaultValue: number): number;
        /**
         * @private
         */
        protected static _getString(rawData: any, key: string, defaultValue: string): string;
        /**
         * @private
         */
        protected static _getParameter(rawData: Array<any>, index: number, defaultValue: any): any;
        /**
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _parseArmature(rawData: any, scale: number): ArmatureData;
        /**
         * @private
         */
        protected _parseBone(rawData: any): BoneData;
        /**
         * @private
         */
        protected _parseIK(rawData: any): void;
        /**
         * @private
         */
        protected _parseSlot(rawData: any, zOrder: number): SlotData;
        /**
         * @private
         */
        protected _parseSkin(rawData: any): SkinData;
        /**
         * @private
         */
        protected _parseSlotDisplaySet(rawData: any): SlotDisplayDataSet;
        /**
         * @private
         */
        protected _parseDisplay(rawData: any): DisplayData;
        /**
         * @private
         */
        protected _parseMesh(rawData: any): MeshData;
        /**
         * @private
         */
        protected _parseAnimation(rawData: any): AnimationData;
        /**
         * @private
         */
        protected _parseBoneTimeline(rawData: any): BoneTimelineData;
        /**
         * @private
         */
        protected _parseSlotTimeline(rawData: any): SlotTimelineData;
        /**
         * @private
         */
        protected _parseFFDTimeline(rawData: any): FFDTimelineData;
        /**
         * @private
         */
        protected _parseAnimationFrame(rawData: any, frameStart: number, frameCount: number): AnimationFrameData;
        /**
         * @private
         */
        protected _parseZOrderFrame(rawData: any, frameStart: number, frameCount: number): ZOrderFrameData;
        /**
         * @private
         */
        protected _parseBoneFrame(rawData: Object, frameStart: number, frameCount: number): BoneFrameData;
        /**
         * @private
         */
        protected _parseSlotFrame(rawData: any, frameStart: number, frameCount: number): SlotFrameData;
        /**
         * @private
         */
        protected _parseFFDFrame(rawData: any, frameStart: number, frameCount: number): ExtensionFrameData;
        /**
         * @private
         */
        protected _parseTweenFrame<T extends TweenFrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void;
        /**
         * @private
         */
        protected _parseFrame<T extends FrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void;
        /**
         * @private
         */
        protected _parseTimeline<T extends FrameData<T>>(rawData: Object, timeline: TimelineData<T>, frameParser: (rawData: any, frameStart: number, frameCount: number) => T): void;
        /**
         * @private
         */
        protected _parseActionData(rawData: any, actions: Array<ActionData>, bone: BoneData, slot: SlotData): void;
        /**
         * @private
         */
        protected _parseEventData(rawData: any, events: Array<EventData>, bone: BoneData, slot: SlotData): void;
        /**
         * @private
         */
        protected _parseTransform(rawData: Object, transform: Transform): void;
        /**
         * @private
         */
        protected _parseColorTransform(rawData: Object, color: ColorTransform): void;
        /**
         * @inheritDoc
         */
        parseDragonBonesData(rawData: any, scale?: number): DragonBonesData;
        /**
         * @inheritDoc
         */
        parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale?: number): void;
        /**
         * @private
         */
        private static _instance;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        static getInstance(): ObjectDataParser;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 贴图集数据。
     * @version DragonBones 3.0
     */
    abstract class TextureAtlasData extends BaseObject {
        /**
         * @language zh_CN
         * 是否开启共享搜索。 [true: 开启, false: 不开启]
         * @default false
         * @version DragonBones 4.5
         */
        autoSearch: boolean;
        /**
         * @language zh_CN
         * 贴图集缩放系数。
         * @version DragonBones 3.0
         */
        scale: number;
        /**
         * @language zh_CN
         * 贴图集名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 贴图集图片路径。
         * @version DragonBones 3.0
         */
        imagePath: string;
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        getTexture(name: string): TextureData;
    }
    /**
     * @private
     */
    abstract class TextureData extends BaseObject {
        static generateRectangle(): Rectangle;
        rotated: boolean;
        name: string;
        frame: Rectangle;
        parent: TextureAtlasData;
        region: Rectangle;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    type BuildArmaturePackage = {
        dataName?: string;
        textureAtlasName?: string;
        data?: DragonBonesData;
        armature?: ArmatureData;
        skin?: SkinData;
    };
    /**
     * @language zh_CN
     * 创建骨架的基础工厂。 (通常只需要一个全局工厂实例)
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    abstract class BaseFactory {
        protected static _defaultParser: ObjectDataParser;
        /**
         * @language zh_CN
         * 是否开启共享搜索。 [true: 开启, false: 不开启]
         * 如果开启，创建一个骨架时，可以从多个龙骨数据中寻找骨架数据，或贴图集数据中寻找贴图数据。 (通常在有共享导出的数据时开启)
         * @see dragonBones.DragonBonesData#autoSearch
         * @see dragonBones.TextureAtlasData#autoSearch
         * @version DragonBones 4.5
         */
        autoSearch: boolean;
        /**
         * @private
         */
        protected _dataParser: DataParser;
        /**
         * @private
         */
        protected _dragonBonesDataMap: Map<DragonBonesData>;
        /**
         * @private
         */
        protected _textureAtlasDataMap: Map<Array<TextureAtlasData>>;
        /**
         * @private
         */
        constructor(dataParser?: DataParser);
        /**
         * @private
         */
        protected _getTextureData(textureAtlasName: string, textureName: string): TextureData;
        /**
         * @private
         */
        protected _fillBuildArmaturePackage(dataPackage: BuildArmaturePackage, dragonBonesName: string, armatureName: string, skinName: string, textureAtlasName: string): boolean;
        /**
         * @private
         */
        protected _buildBones(dataPackage: BuildArmaturePackage, armature: Armature): void;
        /**
         * @private
         */
        protected _buildSlots(dataPackage: BuildArmaturePackage, armature: Armature): void;
        /**
         * @private
         */
        protected _replaceSlotDisplay(dataPackage: BuildArmaturePackage, displayData: DisplayData, slot: Slot, displayIndex: number): void;
        /**
         * @private
         */
        protected abstract _generateTextureAtlasData(textureAtlasData: TextureAtlasData, textureAtlas: any): TextureAtlasData;
        /**
         * @private
         */
        protected abstract _generateArmature(dataPackage: BuildArmaturePackage): Armature;
        /**
         * @private
         */
        protected abstract _generateSlot(dataPackage: BuildArmaturePackage, slotDisplayDataSet: SlotDisplayDataSet, armature: Armature): Slot;
        /**
         * @language zh_CN
         * 解析并添加龙骨数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param name 为数据提供一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @returns DragonBonesData
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         */
        parseDragonBonesData(rawData: any, name?: string, scale?: number): DragonBonesData;
        /**
         * @language zh_CN
         * 解析并添加贴图集数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param textureAtlas 贴图集数据。 (JSON)
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @param scale 为贴图集设置一个缩放值。
         * @returns 贴图集数据
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         */
        parseTextureAtlasData(rawData: any, textureAtlas: Object, name?: string, scale?: number): TextureAtlasData;
        /**
         * @language zh_CN
         * 获取指定名称的龙骨数据。
         * @param name 数据名称。
         * @returns DragonBonesData
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        getDragonBonesData(name: string): DragonBonesData;
        /**
         * @language zh_CN
         * 添加龙骨数据。
         * @param data 龙骨数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        addDragonBonesData(data: DragonBonesData, name?: string): void;
        /**
         * @language zh_CN
         * 移除龙骨数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。 [false: 不释放, true: 释放]
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        removeDragonBonesData(name: string, disposeData?: boolean): void;
        /**
         * @language zh_CN
         * 获取指定名称的贴图集数据列表。
         * @param name 数据名称。
         * @returns 贴图集数据列表。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        getTextureAtlasData(name: string): Array<TextureAtlasData>;
        /**
         * @language zh_CN
         * 添加贴图集数据。
         * @param data 贴图集数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        addTextureAtlasData(data: TextureAtlasData, name?: string): void;
        /**
         * @language zh_CN
         * 移除贴图集数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。 [false: 不释放, true: 释放]
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        removeTextureAtlasData(name: string, disposeData?: boolean): void;
        /**
         * @language zh_CN
         * 清除所有的数据。
         * @param disposeData 是否释放数据。 [false: 不释放, true: 释放]
         * @version DragonBones 4.5
         */
        clear(disposeData?: boolean): void;
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，当多个龙骨数据中包含同名的骨架数据时，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        buildArmature(armatureName: string, dragonBonesName?: string, skinName?: string, textureAtlasName?: string): Armature;
        /**
         * @language zh_CN
         * 将指定骨架的动画替换成其他骨架的动画。 (通常这些骨架应该具有相同的骨架结构)
         * @param toArmature 指定的骨架。
         * @param fromArmatreName 其他骨架的名称。
         * @param fromSkinName 其他骨架的皮肤名称，如果未设置，则使用默认皮肤。
         * @param fromDragonBonesDataName 其他骨架属于的龙骨数据名称，如果未设置，则检索所有的龙骨数据。
         * @param ifRemoveOriginalAnimationList 是否移除原有的动画。 [true: 移除, false: 不移除]
         * @returns 是否替换成功。 [true: 成功, false: 不成功]
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         */
        copyAnimationsToArmature(toArmature: Armature, fromArmatreName: string, fromSkinName?: string, fromDragonBonesDataName?: string, ifRemoveOriginalAnimationList?: boolean): boolean;
        /**
         * @language zh_CN
         * 将指定插槽的显示对象替换为指定资源创造出的显示对象。
         * @param dragonBonesName 指定的龙骨数据名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param displayName 指定的显示对象名称。
         * @param slot 指定的插槽实例。
         * @param displayIndex 要替换的显示对象的索引，如果未设置，则替换当前正在显示的显示对象。
         * @version DragonBones 4.5
         */
        replaceSlotDisplay(dragonBonesName: string, armatureName: string, slotName: string, displayName: string, slot: Slot, displayIndex?: number): void;
        /**
         * @language zh_CN
         * 将指定插槽的显示对象列表替换为指定资源创造出的显示对象列表。
         * @param dragonBonesName 指定的 DragonBonesData 名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param slot 指定的插槽实例。
         * @version DragonBones 4.5
         */
        replaceSlotDisplayList(dragonBonesName: string, armatureName: string, slotName: string, slot: Slot): void;
        /**
         * @private
         */
        getAllDragonBonesData(): Map<DragonBonesData>;
        /**
         * @private
         */
        getAllTextureAtlasData(): Map<Array<TextureAtlasData>>;
    }
}
