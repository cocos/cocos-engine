/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

/**
 * @engineInternal Since v3.7.2, this is an engine private enum type.
 * @deprecated Since v3.7.2, will be removed in the future.
 */
export enum ExtensionType {
    FFD = 0,
    AdjustColor = 10,
    BevelFilter = 11,
    BlurFilter = 12,
    DropShadowFilter = 13,
    GlowFilter = 14,
    GradientBevelFilter = 15,
    GradientGlowFilter = 16
}

/**
 * @en Event type in dragonbones animation.
 * @zh 龙骨动画中的事件类型。
 */
export enum EventType {
    /**
     * @en Event about animation frame.
     * @zh 动画帧相关的事件。
     */
    Frame = 0,
    /**
     * @en Event about sound.
     * @zh 声音相关的事件。
     */
    Sound = 1
}

/**
 * @en Animation fade out mode.
 * @zh 动画淡出模式。
 */
export enum AnimationFadeOutMode {
    None = 0,

    /**
     * @en Fade out the animation states of the same layer.
     * @zh 淡出同层的动画状态。
     */
    SameLayer = 1,

    /**
     * @en Fade out the animation states of the same group.
     * @zh 淡出同组的动画状态。
     */
    SameGroup = 2,

    /**
     * @en Fade out the animation states of the same layer and group.
     * @zh 淡出同层并且同组的动画状态。
     */
    SameLayerAndGroup = 3,

    /**
     * @en Fade out of all animation states.
     * @zh 淡出所有的动画状态。
     */
    All = 4
}

export * from './CCFactory';
export * from './CCSlot';
export * from './CCTextureData';
export * from './CCArmatureDisplay';
export * from './ArmatureCache';

export * from './DragonBonesAsset';
export * from './DragonBonesAtlasAsset';
export * from './ArmatureDisplay';
export * from './AttachUtil';
export * from './assembler';

export * from '@cocos/dragonbones-js';
