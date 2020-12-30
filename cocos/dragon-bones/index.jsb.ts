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

declare const window: any;
const dragonBones = window.dragonBones;

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
