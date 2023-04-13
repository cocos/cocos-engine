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
 * @engineInternal Since v3.7.2, this is an engine private enum type.
 * @deprecated Since v3.7.2, will be removed in the future.
 */
export enum EventType {
    Frame = 0,
    Sound = 1
}
/**
 * @engineInternal Since v3.7.2, this is an engine private enum type.
 * @deprecated Since v3.7.2, will be removed in the future.
 */
export enum AnimationFadeOutMode {
    None = 0,
    SameLayer = 1,
    SameGroup = 2,
    SameLayerAndGroup = 3,
    All = 4
}

export * from './DragonBonesAsset';
export * from './DragonBonesAtlasAsset';
export * from './ArmatureDisplay';
export * from './AttachUtil';
export * from './assembler';

const dragonBones = globalThis.dragonBones;

export const Slot = dragonBones.Slot;
export const Matrix = dragonBones.Matrix;
export const BaseObject = dragonBones.BaseObject;
export const BoundingBoxData = dragonBones.BoundingBoxData;
export const PolygonBoundingBoxData = dragonBones.PolygonBoundingBoxData;
export const Transform = dragonBones.Transform;
export const Animation = dragonBones.Animation;
export const TextureData = dragonBones.TextureData;
export const CCTextureData = dragonBones.CCTextureData;
export const BaseFactory = dragonBones.BaseFactory;
export const CCFactory = dragonBones.CCFactory;
export const WorldClock = dragonBones.WorldClock;
export const TextureAtlasData = dragonBones.TextureAtlasData;
export const CCArmatureDisplay = dragonBones.CCArmatureDisplay;
export const AnimationState = dragonBones.AnimationState;
export const BoneData = dragonBones.BoneData;
export const EllipseBoundingBoxData = dragonBones.EllipseBoundingBoxData;
export const ArmatureData = dragonBones.ArmatureData;
export const CCTextureAtlasData = dragonBones.CCTextureAtlasData;
export const TransformObject = dragonBones.TransformObject;
export const CCSlot = dragonBones.CCSlot;
export const Armature = dragonBones.Armature;
export const Bone = dragonBones.Bone;
export const RectangleBoundingBoxData = dragonBones.RectangleBoundingBoxData;
export const ArmatureCacheMgr = dragonBones.ArmatureCacheMgr;
export const SkinData = dragonBones.SkinData;
export const EventObject = dragonBones.EventObject;
export const SlotData = dragonBones.SlotData;
export const DragonBonesData = dragonBones.DragonBonesData;
export const AnimationData = dragonBones.AnimationData;
export const CCArmatureCacheDisplay = dragonBones.CCArmatureCacheDisplay;
