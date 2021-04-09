/**
 * @packageDocumentation
 * @module dragonBones
 */

import { EDITOR } from 'internal:constants';

/**
 * @en
 * The global time scale of DragonBones.
 * @zh
 * DragonBones 全局时间缩放率。
 * @example
 * dragonBones.timeScale = 0.8;
 */
// const _timeScale = 1.0;

// TODO timescale
// Object.defineProperty(dragonBones, 'timeScale', {
//     get () {
//         return this._timeScale;
//     },
//     set (value) {
//         this._timeScale = value;
//         const factory = this.CCFactory.getInstance();
//         factory._dragonBones.clock.timeScale = value;
//     },
//     configurable: true,
// });

// export enum DisplayType {
//     Image = 0,
//     Armature = 1,
//     Mesh = 2
// }

// export enum ArmatureType {
//     Armature = 0,
//     MovieClip = 1,
//     Stage = 2
// }

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

export enum EventType {
    Frame = 0,
    Sound = 1
}

// export enum ActionType {
//     Play = 0,
//     Stop = 1,
//     GotoAndPlay = 2,
//     GotoAndStop = 3,
//     FadeIn = 4,
//     FadeOut = 5
// }

export enum AnimationFadeOutMode {
    None = 0,
    SameLayer = 1,
    SameGroup = 2,
    SameLayerAndGroup = 3,
    All = 4
}

// export enum BoneType {
//     Bone = 0,
//     Surface = 1
// }

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
