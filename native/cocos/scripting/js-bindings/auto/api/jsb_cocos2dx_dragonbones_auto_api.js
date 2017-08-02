/**
 * @module cocos2dx_dragonbones
 */
var dragonBones = dragonBones || {};

/**
 * @class BaseObject
 */
dragonBones.BaseObject = {

/**
 * @method getClassTypeIndex
 * @return {unsigned long}
 */
getClassTypeIndex : function (
)
{
    return 0;
},

/**
 * @method returnToPool
 */
returnToPool : function (
)
{
},

/**
 * @method clearPool
 * @param {unsigned long} arg0
 */
clearPool : function (
long 
)
{
},

/**
 * @method setMaxCount
 * @param {unsigned long} arg0
 * @param {unsigned long} arg1
 */
setMaxCount : function (
long, 
long 
)
{
},

};

/**
 * @class Matrix
 */
dragonBones.Matrix = {

};

/**
 * @class Transform
 */
dragonBones.Transform = {

/**
 * @method getRotation
 * @return {float}
 */
getRotation : function (
)
{
    return 0;
},

/**
 * @method setRotation
 * @param {float} arg0
 */
setRotation : function (
float 
)
{
},

/**
 * @method normalizeRadian
 * @param {float} arg0
 * @return {float}
 */
normalizeRadian : function (
float 
)
{
    return 0;
},

};

/**
 * @class TextureData
 */
dragonBones.TextureData = {

};

/**
 * @class TextureAtlasData
 */
dragonBones.TextureAtlasData = {

/**
 * @method addTexture
 * @param {dragonBones::TextureData} arg0
 */
addTexture : function (
texturedata 
)
{
},

/**
 * @method generateTexture
 * @return {dragonBones::TextureData}
 */
generateTexture : function (
)
{
    return dragonBones::TextureData;
},

/**
 * @method getTexture
 * @param {String} arg0
 * @return {dragonBones::TextureData}
 */
getTexture : function (
str 
)
{
    return dragonBones::TextureData;
},

};

/**
 * @class AnimationData
 */
dragonBones.AnimationData = {

/**
 * @method getClassTypeIndex
 * @return {unsigned long}
 */
getClassTypeIndex : function (
)
{
    return 0;
},

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class BoneData
 */
dragonBones.BoneData = {

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class SlotData
 */
dragonBones.SlotData = {

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class SkinData
 */
dragonBones.SkinData = {

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class ArmatureData
 */
dragonBones.ArmatureData = {

/**
 * @method getBone
 * @param {String} arg0
 * @return {dragonBones::BoneData}
 */
getBone : function (
str 
)
{
    return dragonBones::BoneData;
},

/**
 * @method getAnimation
 * @param {String} arg0
 * @return {dragonBones::AnimationData}
 */
getAnimation : function (
str 
)
{
    return dragonBones::AnimationData;
},

/**
 * @method getSlot
 * @param {String} arg0
 * @return {dragonBones::SlotData}
 */
getSlot : function (
str 
)
{
    return dragonBones::SlotData;
},

/**
 * @method getSkin
 * @param {String} arg0
 * @return {dragonBones::SkinData}
 */
getSkin : function (
str 
)
{
    return dragonBones::SkinData;
},

/**
 * @method getDefaultSkin
 * @return {dragonBones::SkinData}
 */
getDefaultSkin : function (
)
{
    return dragonBones::SkinData;
},

/**
 * @method getDefaultAnimation
 * @return {dragonBones::AnimationData}
 */
getDefaultAnimation : function (
)
{
    return dragonBones::AnimationData;
},

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class DragonBonesData
 */
dragonBones.DragonBonesData = {

/**
 * @method getArmatureNames
 * @return {Array}
 */
getArmatureNames : function (
)
{
    return new Array();
},

/**
 * @method getArmature
 * @param {String} arg0
 * @return {dragonBones::ArmatureData}
 */
getArmature : function (
str 
)
{
    return dragonBones::ArmatureData;
},

/**
 * @method addArmature
 * @param {dragonBones::ArmatureData} arg0
 */
addArmature : function (
armaturedata 
)
{
},

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class EventObject
 */
dragonBones.EventObject = {

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class Armature
 */
dragonBones.Armature = {

/**
 * @method getSlot
 * @param {String} arg0
 * @return {dragonBones::Slot}
 */
getSlot : function (
str 
)
{
    return dragonBones::Slot;
},

/**
 * @method _bufferAction
 * @param {dragonBones::ActionData} arg0
 */
_bufferAction : function (
actiondata 
)
{
},

/**
 * @method getCacheFrameRate
 * @return {unsigned int}
 */
getCacheFrameRate : function (
)
{
    return 0;
},

/**
 * @method getName
 * @return {String}
 */
getName : function (
)
{
    return ;
},

/**
 * @method dispose
 */
dispose : function (
)
{
},

/**
 * @method addSlot
 * @param {dragonBones::Slot} arg0
 * @param {String} arg1
 */
addSlot : function (
slot, 
str 
)
{
},

/**
 * @method invalidUpdate
 */
invalidUpdate : function (
)
{
},

/**
 * @method getBoneByDisplay
 * @param {void} arg0
 * @return {dragonBones::Bone}
 */
getBoneByDisplay : function (
void 
)
{
    return dragonBones::Bone;
},

/**
 * @method setCacheFrameRate
 * @param {unsigned int} arg0
 */
setCacheFrameRate : function (
int 
)
{
},

/**
 * @method removeSlot
 * @param {dragonBones::Slot} arg0
 */
removeSlot : function (
slot 
)
{
},

/**
 * @method addBone
 * @param {dragonBones::Bone} arg0
 * @param {String} arg1
 */
addBone : function (
bone, 
str 
)
{
},

/**
 * @method advanceTime
 * @param {float} arg0
 */
advanceTime : function (
float 
)
{
},

/**
 * @method getBone
 * @param {String} arg0
 * @return {dragonBones::Bone}
 */
getBone : function (
str 
)
{
    return dragonBones::Bone;
},

/**
 * @method getParent
 * @return {dragonBones::Slot}
 */
getParent : function (
)
{
    return dragonBones::Slot;
},

/**
 * @method getSlotByDisplay
 * @param {void} arg0
 * @return {dragonBones::Slot}
 */
getSlotByDisplay : function (
void 
)
{
    return dragonBones::Slot;
},

/**
 * @method removeBone
 * @param {dragonBones::Bone} arg0
 */
removeBone : function (
bone 
)
{
},

/**
 * @method replaceTexture
 * @param {void} arg0
 */
replaceTexture : function (
void 
)
{
},

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class Animation
 */
dragonBones.Animation = {

/**
 * @method reset
 */
reset : function (
)
{
},

/**
 * @method play
 * @return {dragonBones::AnimationState}
 */
play : function (
)
{
    return dragonBones::AnimationState;
},

/**
 * @method getLastAnimationState
 * @return {dragonBones::AnimationState}
 */
getLastAnimationState : function (
)
{
    return dragonBones::AnimationState;
},

/**
 * @method getAnimationNames
 * @return {Array}
 */
getAnimationNames : function (
)
{
    return new Array();
},

/**
 * @method stop
 * @param {String} arg0
 */
stop : function (
str 
)
{
},

/**
 * @method hasAnimation
 * @param {String} arg0
 * @return {bool}
 */
hasAnimation : function (
str 
)
{
    return false;
},

/**
 * @method gotoAndStopByProgress
 * @param {String} arg0
 * @param {float} arg1
 * @return {dragonBones::AnimationState}
 */
gotoAndStopByProgress : function (
str, 
float 
)
{
    return dragonBones::AnimationState;
},

/**
 * @method gotoAndStopByTime
 * @param {String} arg0
 * @param {float} arg1
 * @return {dragonBones::AnimationState}
 */
gotoAndStopByTime : function (
str, 
float 
)
{
    return dragonBones::AnimationState;
},

/**
 * @method gotoAndPlayByTime
 * @param {String} arg0
 * @param {float} arg1
 * @param {int} arg2
 * @return {dragonBones::AnimationState}
 */
gotoAndPlayByTime : function (
str, 
float, 
int 
)
{
    return dragonBones::AnimationState;
},

/**
 * @method isCompleted
 * @return {bool}
 */
isCompleted : function (
)
{
    return false;
},

/**
 * @method fadeIn
 * @param {String} arg0
 * @param {float} arg1
 * @param {int} arg2
 * @param {int} arg3
 * @param {String} arg4
 * @param {dragonBones::AnimationFadeOutMode} arg5
 * @param {bool} arg6
 * @param {bool} arg7
 * @param {bool} arg8
 * @param {bool} arg9
 * @return {dragonBones::AnimationState}
 */
fadeIn : function (
str, 
float, 
int, 
int, 
str, 
animationfadeoutmode, 
bool, 
bool, 
bool, 
bool 
)
{
    return dragonBones::AnimationState;
},

/**
 * @method gotoAndPlayByFrame
 * @param {String} arg0
 * @param {unsigned int} arg1
 * @param {int} arg2
 * @return {dragonBones::AnimationState}
 */
gotoAndPlayByFrame : function (
str, 
int, 
int 
)
{
    return dragonBones::AnimationState;
},

/**
 * @method getLastAnimationName
 * @return {String}
 */
getLastAnimationName : function (
)
{
    return ;
},

/**
 * @method getState
 * @param {String} arg0
 * @return {dragonBones::AnimationState}
 */
getState : function (
str 
)
{
    return dragonBones::AnimationState;
},

/**
 * @method isPlaying
 * @return {bool}
 */
isPlaying : function (
)
{
    return false;
},

/**
 * @method gotoAndStopByFrame
 * @param {String} arg0
 * @param {unsigned int} arg1
 * @return {dragonBones::AnimationState}
 */
gotoAndStopByFrame : function (
str, 
int 
)
{
    return dragonBones::AnimationState;
},

/**
 * @method gotoAndPlayByProgress
 * @param {String} arg0
 * @param {float} arg1
 * @param {int} arg2
 * @return {dragonBones::AnimationState}
 */
gotoAndPlayByProgress : function (
str, 
float, 
int 
)
{
    return dragonBones::AnimationState;
},

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class TransformObject
 */
dragonBones.TransformObject = {

/**
 * @method _setArmature
 * @param {dragonBones::Armature} arg0
 */
_setArmature : function (
armature 
)
{
},

/**
 * @method _setParent
 * @param {dragonBones::Bone} arg0
 */
_setParent : function (
bone 
)
{
},

/**
 * @method getParent
 * @return {dragonBones::Bone}
 */
getParent : function (
)
{
    return dragonBones::Bone;
},

/**
 * @method getArmature
 * @return {dragonBones::Armature}
 */
getArmature : function (
)
{
    return dragonBones::Armature;
},

};

/**
 * @class Bone
 */
dragonBones.Bone = {

/**
 * @method getIK
 * @return {dragonBones::Bone}
 */
getIK : function (
)
{
    return dragonBones::Bone;
},

/**
 * @method getIKChainIndex
 * @return {unsigned int}
 */
getIKChainIndex : function (
)
{
    return 0;
},

/**
 * @method contains
 * @param {dragonBones::TransformObject} arg0
 * @return {bool}
 */
contains : function (
transformobject 
)
{
    return false;
},

/**
 * @method getIKChain
 * @return {unsigned int}
 */
getIKChain : function (
)
{
    return 0;
},

/**
 * @method getVisible
 * @return {bool}
 */
getVisible : function (
)
{
    return false;
},

/**
 * @method setVisible
 * @param {bool} arg0
 */
setVisible : function (
bool 
)
{
},

/**
 * @method invalidUpdate
 */
invalidUpdate : function (
)
{
},

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class Slot
 */
dragonBones.Slot = {

/**
 * @method getChildArmature
 * @return {dragonBones::Armature}
 */
getChildArmature : function (
)
{
    return dragonBones::Armature;
},

/**
 * @method invalidUpdate
 */
invalidUpdate : function (
)
{
},

/**
 * @method setDisplayIndex
 * @param {int} arg0
 */
setDisplayIndex : function (
int 
)
{
},

/**
 * @method setChildArmature
 * @param {dragonBones::Armature} arg0
 */
setChildArmature : function (
armature 
)
{
},

/**
 * @method getDisplayIndex
 * @return {int}
 */
getDisplayIndex : function (
)
{
    return 0;
},

};

/**
 * @class BaseFactory
 */
dragonBones.BaseFactory = {

/**
 * @method removeDragonBonesData
 * @param {String} arg0
 * @param {bool} arg1
 */
removeDragonBonesData : function (
str, 
bool 
)
{
},

/**
 * @method removeTextureAtlasData
 * @param {String} arg0
 * @param {bool} arg1
 */
removeTextureAtlasData : function (
str, 
bool 
)
{
},

/**
 * @method parseDragonBonesData
 * @param {char} arg0
 * @param {String} arg1
 * @param {float} arg2
 * @return {dragonBones::DragonBonesData}
 */
parseDragonBonesData : function (
char, 
str, 
float 
)
{
    return dragonBones::DragonBonesData;
},

/**
 * @method clear
 */
clear : function (
)
{
},

/**
 * @method addDragonBonesData
 * @param {dragonBones::DragonBonesData} arg0
 * @param {String} arg1
 */
addDragonBonesData : function (
dragonbonesdata, 
str 
)
{
},

/**
 * @method buildArmature
 * @param {String} arg0
 * @param {String} arg1
 * @param {String} arg2
 * @return {dragonBones::Armature}
 */
buildArmature : function (
str, 
str, 
str 
)
{
    return dragonBones::Armature;
},

/**
 * @method addTextureAtlasData
 * @param {dragonBones::TextureAtlasData} arg0
 * @param {String} arg1
 */
addTextureAtlasData : function (
textureatlasdata, 
str 
)
{
},

/**
 * @method getDragonBonesData
 * @param {String} arg0
 * @return {dragonBones::DragonBonesData}
 */
getDragonBonesData : function (
str 
)
{
    return dragonBones::DragonBonesData;
},

};

/**
 * @class WorldClock
 */
dragonBones.WorldClock = {

/**
 * @method clear
 */
clear : function (
)
{
},

/**
 * @method advanceTime
 * @param {float} arg0
 */
advanceTime : function (
float 
)
{
},

/**
 * @method contains
 * @param {dragonBones::IAnimateble} arg0
 * @return {bool}
 */
contains : function (
ianimateble 
)
{
    return false;
},

};

/**
 * @class AnimationState
 */
dragonBones.AnimationState = {

/**
 * @method setCurrentTime
 * @param {float} arg0
 */
setCurrentTime : function (
float 
)
{
},

/**
 * @method removeBoneMask
 * @param {String} arg0
 * @param {bool} arg1
 */
removeBoneMask : function (
str, 
bool 
)
{
},

/**
 * @method getGroup
 * @return {String}
 */
getGroup : function (
)
{
    return ;
},

/**
 * @method getCurrentPlayTimes
 * @return {unsigned int}
 */
getCurrentPlayTimes : function (
)
{
    return 0;
},

/**
 * @method getName
 * @return {String}
 */
getName : function (
)
{
    return ;
},

/**
 * @method getCurrentTime
 * @return {float}
 */
getCurrentTime : function (
)
{
    return 0;
},

/**
 * @method getTotalTime
 * @return {float}
 */
getTotalTime : function (
)
{
    return 0;
},

/**
 * @method removeAllBoneMask
 */
removeAllBoneMask : function (
)
{
},

/**
 * @method getLayer
 * @return {int}
 */
getLayer : function (
)
{
    return 0;
},

/**
 * @method isCompleted
 * @return {bool}
 */
isCompleted : function (
)
{
    return false;
},

/**
 * @method play
 */
play : function (
)
{
},

/**
 * @method fadeOut
 * @param {float} arg0
 * @param {bool} arg1
 */
fadeOut : function (
float, 
bool 
)
{
},

/**
 * @method stop
 */
stop : function (
)
{
},

/**
 * @method isPlaying
 * @return {bool}
 */
isPlaying : function (
)
{
    return false;
},

/**
 * @method addBoneMask
 * @param {String} arg0
 * @param {bool} arg1
 */
addBoneMask : function (
str, 
bool 
)
{
},

/**
 * @method containsBoneMask
 * @param {String} arg0
 * @return {bool}
 */
containsBoneMask : function (
str 
)
{
    return false;
},

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class CCTextureData
 */
dragonBones.CCTextureData = {

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class CCTextureAtlasData
 */
dragonBones.CCTextureAtlasData = {

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class CCArmatureDisplay
 */
dragonBones.CCArmatureDisplay = {

/**
 * @method advanceTimeBySelf
 * @param {bool} arg0
 */
advanceTimeBySelf : function (
bool 
)
{
},

/**
 * @method removeEvent
 * @param {String} arg0
 */
removeEvent : function (
str 
)
{
},

/**
 * @method dispose
 */
dispose : function (
)
{
},

/**
 * @method hasEventCallback
 * @return {bool}
 */
hasEventCallback : function (
)
{
    return false;
},

/**
 * @method setEventCallback
 * @param {function} arg0
 */
setEventCallback : function (
func 
)
{
},

/**
 * @method clearEventCallback
 */
clearEventCallback : function (
)
{
},

/**
 * @method addEvent
 * @param {String} arg0
 * @param {function} arg1
 */
addEvent : function (
str, 
func 
)
{
},

/**
 * @method hasEvent
 * @param {String} arg0
 * @return {bool}
 */
hasEvent : function (
str 
)
{
    return false;
},

/**
 * @method getArmature
 * @return {dragonBones::Armature}
 */
getArmature : function (
)
{
    return dragonBones::Armature;
},

/**
 * @method create
 * @return {dragonBones::CCArmatureDisplay}
 */
create : function (
)
{
    return dragonBones::CCArmatureDisplay;
},

};

/**
 * @class DBCCSprite
 */
dragonBones.DBCCSprite = {

/**
 * @method create
 * @return {dragonBones::DBCCSprite}
 */
create : function (
)
{
    return dragonBones::DBCCSprite;
},

};

/**
 * @class CCSlot
 */
dragonBones.CCSlot = {

/**
 * @method getClassTypeIndex
 * @return {unsigned long}
 */
getClassTypeIndex : function (
)
{
    return 0;
},

/**
 * @method getTypeIndex
 * @return {unsigned long}
 */
getTypeIndex : function (
)
{
    return 0;
},

};

/**
 * @class CCFactory
 */
dragonBones.CCFactory = {

/**
 * @method getTextureDisplay
 * @param {String} arg0
 * @param {String} arg1
 * @return {cc.Sprite}
 */
getTextureDisplay : function (
str, 
str 
)
{
    return cc.Sprite;
},

/**
 * @method getSoundEventManater
 * @return {dragonBones::CCArmatureDisplay}
 */
getSoundEventManater : function (
)
{
    return dragonBones::CCArmatureDisplay;
},

/**
 * @method buildArmatureDisplay
 * @param {String} arg0
 * @param {String} arg1
 * @param {String} arg2
 * @return {dragonBones::CCArmatureDisplay}
 */
buildArmatureDisplay : function (
str, 
str, 
str 
)
{
    return dragonBones::CCArmatureDisplay;
},

/**
 * @method parseTextureAtlasData
 * @param {String} arg0
 * @param {String} arg1
 * @param {String} arg2
 * @param {float} arg3
 * @return {dragonBones::TextureAtlasData}
 */
parseTextureAtlasData : function (
str, 
str, 
str, 
float 
)
{
    return dragonBones::TextureAtlasData;
},

/**
 * @method CCFactory
 * @constructor
 */
CCFactory : function (
)
{
},

};
