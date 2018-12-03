/**
 * @module cocos2dx_dragonbones
 */
var dragonBones = dragonBones || {};

/**
 * @class BaseObject
 */
dragonBones.BaseObject = {

/**
 * @method returnToPool
 */
returnToPool : function (
)
{
},

/**
 * @method clearPool
 */
clearPool : function (
)
{
},

/**
 * @method setMaxCount
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 */
setMaxCount : function (
int, 
int 
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
 * @class TextureAtlasData
 */
dragonBones.TextureAtlasData = {

/**
 * @method createTexture
 * @return {dragonBones::TextureData}
 */
createTexture : function (
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

/**
 * @method addTexture
 * @param {dragonBones::TextureData} arg0
 */
addTexture : function (
texturedata 
)
{
},

};

/**
 * @class TextureData
 */
dragonBones.TextureData = {

/**
 * @method getParent
 * @return {dragonBones::TextureAtlasData}
 */
getParent : function (
)
{
    return dragonBones::TextureAtlasData;
},

/**
 * @method setFrame
 * @param {dragonBones::Rectangle} arg0
 */
setFrame : function (
rectangle 
)
{
},

/**
 * @method getRegion
 * @return {dragonBones::Rectangle}
 */
getRegion : function (
)
{
    return dragonBones::Rectangle;
},

/**
 * @method getFrame
 * @return {dragonBones::Rectangle}
 */
getFrame : function (
)
{
    return dragonBones::Rectangle;
},

/**
 * @method setParent
 * @param {dragonBones::TextureAtlasData} arg0
 */
setParent : function (
textureatlasdata 
)
{
},

/**
 * @method createRectangle
 * @return {dragonBones::Rectangle}
 */
createRectangle : function (
)
{
    return dragonBones::Rectangle;
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
 * @method addAction
 * @param {dragonBones::ActionData} arg0
 * @param {bool} arg1
 */
addAction : function (
actiondata, 
bool 
)
{
},

/**
 * @method setUserData
 * @param {dragonBones::UserData} arg0
 */
setUserData : function (
userdata 
)
{
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
 * @method setDefaultAnimation
 * @param {dragonBones::AnimationData} arg0
 */
setDefaultAnimation : function (
animationdata 
)
{
},

/**
 * @method setType
 * @param {int} arg0
 */
setType : function (
int 
)
{
},

/**
 * @method setParent
 * @param {dragonBones::DragonBonesData} arg0
 */
setParent : function (
dragonbonesdata 
)
{
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
 * @method getMesh
 * @param {String} arg0
 * @param {String} arg1
 * @param {String} arg2
 * @return {dragonBones::MeshDisplayData}
 */
getMesh : function (
str, 
str, 
str 
)
{
    return dragonBones::MeshDisplayData;
},

/**
 * @method setDefaultSkin
 * @param {dragonBones::SkinData} arg0
 */
setDefaultSkin : function (
skindata 
)
{
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
 * @method getType
 * @return {int}
 */
getType : function (
)
{
    return 0;
},

/**
 * @method addConstraint
 * @param {dragonBones::ConstraintData} arg0
 */
addConstraint : function (
constraintdata 
)
{
},

/**
 * @method getUserData
 * @return {dragonBones::UserData}
 */
getUserData : function (
)
{
    return dragonBones::UserData;
},

/**
 * @method getAABB
 * @return {dragonBones::Rectangle}
 */
getAABB : function (
)
{
    return dragonBones::Rectangle;
},

/**
 * @method getParent
 * @return {dragonBones::DragonBonesData}
 */
getParent : function (
)
{
    return dragonBones::DragonBonesData;
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
 * @method getConstraint
 * @param {String} arg0
 * @return {dragonBones::ConstraintData}
 */
getConstraint : function (
str 
)
{
    return dragonBones::ConstraintData;
},

/**
 * @method sortBones
 */
sortBones : function (
)
{
},

};

/**
 * @class BoneData
 */
dragonBones.BoneData = {

/**
 * @method setParent
 * @param {dragonBones::BoneData} arg0
 */
setParent : function (
bonedata 
)
{
},

/**
 * @method getTransfrom
 * @return {dragonBones::Transform}
 */
getTransfrom : function (
)
{
    return dragonBones::Transform;
},

/**
 * @method setUserData
 * @param {dragonBones::UserData} arg0
 */
setUserData : function (
userdata 
)
{
},

/**
 * @method getUserData
 * @return {dragonBones::UserData}
 */
getUserData : function (
)
{
    return dragonBones::UserData;
},

/**
 * @method getParent
 * @return {dragonBones::BoneData}
 */
getParent : function (
)
{
    return dragonBones::BoneData;
},

};

/**
 * @class SlotData
 */
dragonBones.SlotData = {

/**
 * @method setUserData
 * @param {dragonBones::UserData} arg0
 */
setUserData : function (
userdata 
)
{
},

/**
 * @method setColor
 * @param {dragonBones::ColorTransform} arg0
 */
setColor : function (
colortransform 
)
{
},

/**
 * @method getUserData
 * @return {dragonBones::UserData}
 */
getUserData : function (
)
{
    return dragonBones::UserData;
},

/**
 * @method getColor
 * @return {dragonBones::ColorTransform}
 */
getColor : function (
)
{
    return dragonBones::ColorTransform;
},

/**
 * @method setBlendMode
 * @param {int} arg0
 */
setBlendMode : function (
int 
)
{
},

/**
 * @method getBlendMode
 * @return {int}
 */
getBlendMode : function (
)
{
    return 0;
},

/**
 * @method setParent
 * @param {dragonBones::BoneData} arg0
 */
setParent : function (
bonedata 
)
{
},

/**
 * @method getParent
 * @return {dragonBones::BoneData}
 */
getParent : function (
)
{
    return dragonBones::BoneData;
},

/**
 * @method createColor
 * @return {dragonBones::ColorTransform}
 */
createColor : function (
)
{
    return dragonBones::ColorTransform;
},

/**
 * @method getDefaultColor
 * @return {dragonBones::ColorTransform}
 */
getDefaultColor : function (
)
{
    return dragonBones::ColorTransform;
},

};

/**
 * @class DragonBonesData
 */
dragonBones.DragonBonesData = {

/**
 * @method setUserData
 * @param {dragonBones::UserData} arg0
 */
setUserData : function (
userdata 
)
{
},

/**
 * @method getUserData
 * @return {dragonBones::UserData}
 */
getUserData : function (
)
{
    return dragonBones::UserData;
},

/**
 * @method getFrameIndices
 * @return {Array}
 */
getFrameIndices : function (
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
 * @method getArmatureNames
 * @return {Array}
 */
getArmatureNames : function (
)
{
    return new Array();
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

};

/**
 * @class SkinData
 */
dragonBones.SkinData = {

/**
 * @method addDisplay
 * @param {String} arg0
 * @param {dragonBones::DisplayData} arg1
 */
addDisplay : function (
str, 
displaydata 
)
{
},

/**
 * @method getDisplay
 * @param {String} arg0
 * @param {String} arg1
 * @return {dragonBones::DisplayData}
 */
getDisplay : function (
str, 
str 
)
{
    return dragonBones::DisplayData;
},

};

/**
 * @class AnimationData
 */
dragonBones.AnimationData = {

/**
 * @method getActionTimeline
 * @return {dragonBones::TimelineData}
 */
getActionTimeline : function (
)
{
    return dragonBones::TimelineData;
},

/**
 * @method setParent
 * @param {dragonBones::ArmatureData} arg0
 */
setParent : function (
armaturedata 
)
{
},

/**
 * @method setActionTimeline
 * @param {dragonBones::TimelineData} arg0
 */
setActionTimeline : function (
timelinedata 
)
{
},

/**
 * @method getSlotCachedFrameIndices
 * @param {String} arg0
 * @return {Array}
 */
getSlotCachedFrameIndices : function (
str 
)
{
    return new Array();
},

/**
 * @method addConstraintTimeline
 * @param {dragonBones::ConstraintData} arg0
 * @param {dragonBones::TimelineData} arg1
 */
addConstraintTimeline : function (
constraintdata, 
timelinedata 
)
{
},

/**
 * @method getBoneCachedFrameIndices
 * @param {String} arg0
 * @return {Array}
 */
getBoneCachedFrameIndices : function (
str 
)
{
    return new Array();
},

/**
 * @method getZOrderTimeline
 * @return {dragonBones::TimelineData}
 */
getZOrderTimeline : function (
)
{
    return dragonBones::TimelineData;
},

/**
 * @method setZOrderTimeline
 * @param {dragonBones::TimelineData} arg0
 */
setZOrderTimeline : function (
timelinedata 
)
{
},

/**
 * @method getParent
 * @return {dragonBones::ArmatureData}
 */
getParent : function (
)
{
    return dragonBones::ArmatureData;
},

};

/**
 * @class Armature
 */
dragonBones.Armature = {

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
 * @method getClock
 * @return {dragonBones::WorldClock}
 */
getClock : function (
)
{
    return dragonBones::WorldClock;
},

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
 * @method setClock
 * @param {dragonBones::WorldClock} arg0
 */
setClock : function (
worldclock 
)
{
},

/**
 * @method _bufferAction
 * @param {dragonBones::EventObject} arg0
 * @param {bool} arg1
 */
_bufferAction : function (
eventobject, 
bool 
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
 * @method getAnimatable
 * @return {dragonBones::IAnimatable}
 */
getAnimatable : function (
)
{
    return dragonBones::IAnimatable;
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
 * @method invalidUpdate
 */
invalidUpdate : function (
)
{
},

/**
 * @method _addBone
 * @param {dragonBones::Bone} arg0
 */
_addBone : function (
bone 
)
{
},

/**
 * @method getFlipY
 * @return {bool}
 */
getFlipY : function (
)
{
    return false;
},

/**
 * @method getFlipX
 * @return {bool}
 */
getFlipX : function (
)
{
    return false;
},

/**
 * @method intersectsSegment
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 * @param {dragonBones::Point} arg4
 * @param {dragonBones::Point} arg5
 * @param {dragonBones::Point} arg6
 * @return {dragonBones::Slot}
 */
intersectsSegment : function (
float, 
float, 
float, 
float, 
point, 
point, 
point 
)
{
    return dragonBones::Slot;
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
 * @method _addConstraint
 * @param {dragonBones::Constraint} arg0
 */
_addConstraint : function (
constraint 
)
{
},

/**
 * @method setFlipY
 * @param {bool} arg0
 */
setFlipY : function (
bool 
)
{
},

/**
 * @method setFlipX
 * @param {bool} arg0
 */
setFlipX : function (
bool 
)
{
},

/**
 * @method getArmatureData
 * @return {dragonBones::ArmatureData}
 */
getArmatureData : function (
)
{
    return dragonBones::ArmatureData;
},

/**
 * @method _addSlot
 * @param {dragonBones::Slot} arg0
 */
_addSlot : function (
slot 
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
 * @method getAnimation
 * @return {dragonBones::Animation}
 */
getAnimation : function (
)
{
    return dragonBones::Animation;
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
 * @method getEventDispatcher
 * @return {dragonBones::IEventDispatcher}
 */
getEventDispatcher : function (
)
{
    return dragonBones::IEventDispatcher;
},

/**
 * @method containsPoint
 * @param {float} arg0
 * @param {float} arg1
 * @return {dragonBones::Slot}
 */
containsPoint : function (
float, 
float 
)
{
    return dragonBones::Slot;
},

/**
 * @method getProxy
 * @return {dragonBones::IArmatureProxy}
 */
getProxy : function (
)
{
    return dragonBones::IArmatureProxy;
},

};

/**
 * @class TransformObject
 */
dragonBones.TransformObject = {

/**
 * @method getOffset
 * @return {dragonBones::Transform}
 */
getOffset : function (
)
{
    return dragonBones::Transform;
},

/**
 * @method getGlobal
 * @return {dragonBones::Transform}
 */
getGlobal : function (
)
{
    return dragonBones::Transform;
},

/**
 * @method getOrigin
 * @return {dragonBones::Transform}
 */
getOrigin : function (
)
{
    return dragonBones::Transform;
},

/**
 * @method getGlobalTransformMatrix
 * @return {dragonBones::Matrix}
 */
getGlobalTransformMatrix : function (
)
{
    return dragonBones::Matrix;
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
 * @method updateGlobalTransform
 */
updateGlobalTransform : function (
)
{
},

};

/**
 * @class AnimationState
 */
dragonBones.AnimationState = {

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
 * @method getName
 * @return {String}
 */
getName : function (
)
{
    return ;
},

/**
 * @method stop
 */
stop : function (
)
{
},

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
 * @method init
 * @param {dragonBones::Armature} arg0
 * @param {dragonBones::AnimationData} arg1
 * @param {dragonBones::AnimationConfig} arg2
 */
init : function (
armature, 
animationdata, 
animationconfig 
)
{
},

/**
 * @method isFadeIn
 * @return {bool}
 */
isFadeIn : function (
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
 * @method removeAllBoneMask
 */
removeAllBoneMask : function (
)
{
},

/**
 * @method getAnimationData
 * @return {dragonBones::AnimationData}
 */
getAnimationData : function (
)
{
    return dragonBones::AnimationData;
},

/**
 * @method isFadeComplete
 * @return {bool}
 */
isFadeComplete : function (
)
{
    return false;
},

/**
 * @method advanceTime
 * @param {float} arg0
 * @param {float} arg1
 */
advanceTime : function (
float, 
float 
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
 * @method getCurrentPlayTimes
 * @return {unsigned int}
 */
getCurrentPlayTimes : function (
)
{
    return 0;
},

/**
 * @method isFadeOut
 * @return {bool}
 */
isFadeOut : function (
)
{
    return false;
},

};

/**
 * @class Bone
 */
dragonBones.Bone = {

/**
 * @method getOffsetMode
 * @return {int}
 */
getOffsetMode : function (
)
{
    return 0;
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
 * @method getName
 * @return {String}
 */
getName : function (
)
{
    return ;
},

/**
 * @method contains
 * @param {dragonBones::Bone} arg0
 * @return {bool}
 */
contains : function (
bone 
)
{
    return false;
},

/**
 * @method update
 * @param {int} arg0
 */
update : function (
int 
)
{
},

/**
 * @method updateByConstraint
 */
updateByConstraint : function (
)
{
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
 * @method init
 * @param {dragonBones::BoneData} arg0
 * @param {dragonBones::Armature} arg1
 */
init : function (
bonedata, 
armature 
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
 * @method setOffsetMode
 * @param {int} arg0
 */
setOffsetMode : function (
int 
)
{
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
 * @method getBoneData
 * @return {dragonBones::BoneData}
 */
getBoneData : function (
)
{
    return dragonBones::BoneData;
},

};

/**
 * @class Slot
 */
dragonBones.Slot = {

/**
 * @method _updateColor
 */
_updateColor : function (
)
{
},

/**
 * @method setRawDisplayDatas
 * @param {Array} arg0
 */
setRawDisplayDatas : function (
array 
)
{
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
 * @method getSlotData
 * @return {dragonBones::SlotData}
 */
getSlotData : function (
)
{
    return dragonBones::SlotData;
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
 * @method _setZorder
 * @param {int} arg0
 * @return {bool}
 */
_setZorder : function (
int 
)
{
    return false;
},

/**
 * @method invalidUpdate
 */
invalidUpdate : function (
)
{
},

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
 * @method intersectsSegment
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 * @param {dragonBones::Point} arg4
 * @param {dragonBones::Point} arg5
 * @param {dragonBones::Point} arg6
 * @return {int}
 */
intersectsSegment : function (
float, 
float, 
float, 
float, 
point, 
point, 
point 
)
{
    return 0;
},

/**
 * @method update
 * @param {int} arg0
 */
update : function (
int 
)
{
},

/**
 * @method updateTransformAndMatrix
 */
updateTransformAndMatrix : function (
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
 * @method getBoundingBoxData
 * @return {dragonBones::BoundingBoxData}
 */
getBoundingBoxData : function (
)
{
    return dragonBones::BoundingBoxData;
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
 * @method replaceDisplayData
 * @param {dragonBones::DisplayData} arg0
 * @param {int} arg1
 */
replaceDisplayData : function (
displaydata, 
int 
)
{
},

/**
 * @method containsPoint
 * @param {float} arg0
 * @param {float} arg1
 * @return {bool}
 */
containsPoint : function (
float, 
float 
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
 * @method contains
 * @param {dragonBones::IAnimatable} arg0
 * @return {bool}
 */
contains : function (
ianimatable 
)
{
    return false;
},

/**
 * @method getClock
 * @return {dragonBones::WorldClock}
 */
getClock : function (
)
{
    return dragonBones::WorldClock;
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
 * @method setClock
 * @param {dragonBones::WorldClock} arg0
 */
setClock : function (
worldclock 
)
{
},

/**
 * @method getStaticClock
 * @return {dragonBones::WorldClock}
 */
getStaticClock : function (
)
{
    return dragonBones::WorldClock;
},

};

/**
 * @class Animation
 */
dragonBones.Animation = {

/**
 * @method init
 * @param {dragonBones::Armature} arg0
 */
init : function (
armature 
)
{
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
 * @method fadeIn
 * @param {String} arg0
 * @param {float} arg1
 * @param {int} arg2
 * @param {int} arg3
 * @param {String} arg4
 * @param {dragonBones::AnimationFadeOutMode} arg5
 * @return {dragonBones::AnimationState}
 */
fadeIn : function (
str, 
float, 
int, 
int, 
str, 
animationfadeoutmode 
)
{
    return dragonBones::AnimationState;
},

/**
 * @method playConfig
 * @param {dragonBones::AnimationConfig} arg0
 * @return {dragonBones::AnimationState}
 */
playConfig : function (
animationconfig 
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
 * @method play
 * @return {dragonBones::AnimationState}
 */
play : function (
)
{
    return dragonBones::AnimationState;
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
 * @method stop
 * @param {String} arg0
 */
stop : function (
str 
)
{
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
 * @method advanceTime
 * @param {float} arg0
 */
advanceTime : function (
float 
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
 * @method getAnimationConfig
 * @return {dragonBones::AnimationConfig}
 */
getAnimationConfig : function (
)
{
    return dragonBones::AnimationConfig;
},

/**
 * @method reset
 */
reset : function (
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

};

/**
 * @class EventObject
 */
dragonBones.EventObject = {

/**
 * @method getBone
 * @return {dragonBones::Bone}
 */
getBone : function (
)
{
    return dragonBones::Bone;
},

/**
 * @method getData
 * @return {dragonBones::UserData}
 */
getData : function (
)
{
    return dragonBones::UserData;
},

/**
 * @method getAnimationState
 * @return {dragonBones::AnimationState}
 */
getAnimationState : function (
)
{
    return dragonBones::AnimationState;
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
 * @method getSlot
 * @return {dragonBones::Slot}
 */
getSlot : function (
)
{
    return dragonBones::Slot;
},

/**
 * @method actionDataToInstance
 * @param {dragonBones::ActionData} arg0
 * @param {dragonBones::EventObject} arg1
 * @param {dragonBones::Armature} arg2
 */
actionDataToInstance : function (
actiondata, 
eventobject, 
armature 
)
{
},

};

/**
 * @class BaseFactory
 */
dragonBones.BaseFactory = {

/**
 * @method replaceSkin
 * @param {dragonBones::Armature} arg0
 * @param {dragonBones::SkinData} arg1
 * @param {bool} arg2
 * @param {Array} arg3
 * @return {bool}
 */
replaceSkin : function (
armature, 
skindata, 
bool, 
array 
)
{
    return false;
},

/**
 * @method replaceAnimation
 * @param {dragonBones::Armature} arg0
 * @param {dragonBones::ArmatureData} arg1
 * @param {bool} arg2
 * @return {bool}
 */
replaceAnimation : function (
armature, 
armaturedata, 
bool 
)
{
    return false;
},

/**
 * @method getClock
 * @return {dragonBones::WorldClock}
 */
getClock : function (
)
{
    return dragonBones::WorldClock;
},

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
 * @param {String} arg3
 * @return {dragonBones::Armature}
 */
buildArmature : function (
str, 
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
 * @method getArmatureData
 * @param {String} arg0
 * @param {String} arg1
 * @return {dragonBones::ArmatureData}
 */
getArmatureData : function (
str, 
str 
)
{
    return dragonBones::ArmatureData;
},

/**
 * @method replaceSlotDisplay
 * @param {String} arg0
 * @param {String} arg1
 * @param {String} arg2
 * @param {String} arg3
 * @param {dragonBones::Slot} arg4
 * @param {int} arg5
 * @return {bool}
 */
replaceSlotDisplay : function (
str, 
str, 
str, 
str, 
slot, 
int 
)
{
    return false;
},

/**
 * @method changeSkin
 * @param {dragonBones::Armature} arg0
 * @param {dragonBones::SkinData} arg1
 * @param {Array} arg2
 * @return {bool}
 */
changeSkin : function (
armature, 
skindata, 
array 
)
{
    return false;
},

/**
 * @method replaceDisplay
 * @param {dragonBones::Slot} arg0
 * @param {dragonBones::DisplayData} arg1
 * @param {int} arg2
 */
replaceDisplay : function (
slot, 
displaydata, 
int 
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
 * @class CCTextureAtlasData
 */
dragonBones.CCTextureAtlasData = {

/**
 * @method setRenderTexture
 * @param {cc.middleware::Texture2D} arg0
 */
setRenderTexture : function (
texture2d 
)
{
},

/**
 * @method getRenderTexture
 * @return {cc.middleware::Texture2D}
 */
getRenderTexture : function (
)
{
    return cc.middleware::Texture2D;
},

};

/**
 * @class CCTextureData
 */
dragonBones.CCTextureData = {

};

/**
 * @class CCSlot
 */
dragonBones.CCSlot = {

/**
 * @method getTexture
 * @return {cc.middleware::Texture2D}
 */
getTexture : function (
)
{
    return cc.middleware::Texture2D;
},

/**
 * @method updateWorldMatrix
 */
updateWorldMatrix : function (
)
{
},

};

/**
 * @class CCArmatureDisplay
 */
dragonBones.CCArmatureDisplay = {

/**
 * @method getAnimation
 * @return {dragonBones::Animation}
 */
getAnimation : function (
)
{
    return dragonBones::Animation;
},

/**
 * @method hasDBEventListener
 * @param {String} arg0
 * @return {bool}
 */
hasDBEventListener : function (
str 
)
{
    return false;
},

/**
 * @method setColor
 * @param {color4b_object} arg0
 */
setColor : function (
color4b 
)
{
},

/**
 * @method dbInit
 * @param {dragonBones::Armature} arg0
 */
dbInit : function (
armature 
)
{
},

/**
 * @method addDBEventListener
 * @param {String} arg0
 * @param {function} arg1
 */
addDBEventListener : function (
str, 
func 
)
{
},

/**
 * @method getMaterialData
 * @return {se::Object}
 */
getMaterialData : function (
)
{
    return se::Object;
},

/**
 * @method dbUpdate
 */
dbUpdate : function (
)
{
},

/**
 * @method dispatchDBEvent
 * @param {String} arg0
 * @param {dragonBones::EventObject} arg1
 */
dispatchDBEvent : function (
str, 
eventobject 
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
 * @method setOpacityModifyRGB
 * @param {bool} arg0
 */
setOpacityModifyRGB : function (
bool 
)
{
},

/**
 * @method getRootDisplay
 * @return {dragonBones::CCArmatureDisplay}
 */
getRootDisplay : function (
)
{
    return dragonBones::CCArmatureDisplay;
},

/**
 * @method setDBEventCallback
 * @param {function} arg0
 */
setDBEventCallback : function (
func 
)
{
},

/**
 * @method setDebugBonesEnabled
 * @param {bool} arg0
 */
setDebugBonesEnabled : function (
bool 
)
{
},

/**
 * @method removeDBEventListener
 * @param {String} arg0
 * @param {function} arg1
 */
removeDBEventListener : function (
str, 
func 
)
{
},

/**
 * @method dbClear
 */
dbClear : function (
)
{
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
 * @method convertToRootSpace
 * @param {vec2_object} arg0
 * @return {vec2_object}
 */
convertToRootSpace : function (
vec2 
)
{
    return cc.Vec2;
},

/**
 * @method getDebugData
 * @return {se::Object}
 */
getDebugData : function (
)
{
    return se::Object;
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

/**
 * @method CCArmatureDisplay
 * @constructor
 */
CCArmatureDisplay : function (
)
{
},

};

/**
 * @class CCFactory
 */
dragonBones.CCFactory = {

/**
 * @method parseDragonBonesDataOnly
 * @param {String} arg0
 * @param {String} arg1
 * @param {float} arg2
 * @return {dragonBones::DragonBonesData}
 */
parseDragonBonesDataOnly : function (
str, 
str, 
float 
)
{
    return dragonBones::DragonBonesData;
},

/**
 * @method getSoundEventManager
 * @return {dragonBones::CCArmatureDisplay}
 */
getSoundEventManager : function (
)
{
    return dragonBones::CCArmatureDisplay;
},

/**
 * @method handleTextureAtlasData
 * @param {bool} arg0
 * @param {String} arg1
 * @param {float} arg2
 */
handleTextureAtlasData : function (
bool, 
str, 
float 
)
{
},

/**
 * @method update
 * @param {float} arg0
 */
update : function (
float 
)
{
},

/**
 * @method remove
 * @param {dragonBones::Armature} arg0
 */
remove : function (
armature 
)
{
},

/**
 * @method getTextureAtlasDataByIndex
 * @param {String} arg0
 * @param {int} arg1
 * @return {dragonBones::CCTextureAtlasData}
 */
getTextureAtlasDataByIndex : function (
str, 
int 
)
{
    return dragonBones::CCTextureAtlasData;
},

/**
 * @method add
 * @param {dragonBones::Armature} arg0
 */
add : function (
armature 
)
{
},

/**
 * @method buildArmatureDisplay
 * @param {String} arg0
 * @param {String} arg1
 * @param {String} arg2
 * @param {String} arg3
 * @return {dragonBones::CCArmatureDisplay}
 */
buildArmatureDisplay : function (
str, 
str, 
str, 
str 
)
{
    return dragonBones::CCArmatureDisplay;
},

/**
 * @method stopSchedule
 */
stopSchedule : function (
)
{
},

/**
 * @method removeTextureAtlasDataByIndex
 * @param {String} arg0
 * @param {int} arg1
 */
removeTextureAtlasDataByIndex : function (
str, 
int 
)
{
},

/**
 * @method isInit
 * @return {bool}
 */
isInit : function (
)
{
    return false;
},

/**
 * @method destroyFactory
 */
destroyFactory : function (
)
{
},

/**
 * @method getClock
 * @return {dragonBones::WorldClock}
 */
getClock : function (
)
{
    return dragonBones::WorldClock;
},

/**
 * @method getFactory
 * @return {dragonBones::CCFactory}
 */
getFactory : function (
)
{
    return dragonBones::CCFactory;
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
