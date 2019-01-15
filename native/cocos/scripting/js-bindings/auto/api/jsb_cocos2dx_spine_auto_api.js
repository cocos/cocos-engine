/**
 * @module cocos2dx_spine
 */
var spine = spine || {};

/**
 * @class SpineRenderer
 */
spine.Skeleton = {

/**
 * @method setUseTint
 * @param {bool} arg0
 */
setUseTint : function (
bool 
)
{
},

/**
 * @method setTimeScale
 * @param {float} arg0
 */
setTimeScale : function (
float 
)
{
},

/**
 * @method paused
 * @param {bool} arg0
 */
paused : function (
bool 
)
{
},

/**
 * @method setAttachment
* @param {String|String} str
* @param {char|String} char
* @return {bool|bool}
*/
setAttachment : function(
str,
str 
)
{
    return false;
},

/**
 * @method setBonesToSetupPose
 */
setBonesToSetupPose : function (
)
{
},

/**
 * @method setSlotsToSetupPose
 */
setSlotsToSetupPose : function (
)
{
},

/**
 * @method stopSchedule
 */
stopSchedule : function (
)
{
},

/**
 * @method isOpacityModifyRGB
 * @return {bool}
 */
isOpacityModifyRGB : function (
)
{
    return false;
},

/**
 * @method setDebugSlotsEnabled
 * @param {bool} arg0
 */
setDebugSlotsEnabled : function (
bool 
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
 * @method initWithJsonFile
* @param {String|String} str
* @param {String|spAtlas} str
* @param {float|float} float
*/
initWithJsonFile : function(
str,
spatlas,
float 
)
{
},

/**
 * @method setToSetupPose
 */
setToSetupPose : function (
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
 * @method initWithBinaryFile
* @param {String|String} str
* @param {String|spAtlas} str
* @param {float|float} float
*/
initWithBinaryFile : function(
str,
spatlas,
float 
)
{
},

/**
 * @method onEnable
 */
onEnable : function (
)
{
},

/**
 * @method beginSchedule
 */
beginSchedule : function (
)
{
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
 * @method initWithSkeleton
 * @param {spSkeleton} arg0
 * @param {bool} arg1
 * @param {bool} arg2
 */
initWithSkeleton : function (
spskeleton, 
bool, 
bool 
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
 * @method getAttachment
 * @param {String} arg0
 * @param {String} arg1
 * @return {spAttachment}
 */
getAttachment : function (
str, 
str 
)
{
    return spAttachment;
},

/**
 * @method initialize
 */
initialize : function (
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
 * @method getTimeScale
 * @return {float}
 */
getTimeScale : function (
)
{
    return 0;
},

/**
 * @method setSlotsRange
 * @param {int} arg0
 * @param {int} arg1
 */
setSlotsRange : function (
int, 
int 
)
{
},

/**
 * @method onDisable
 */
onDisable : function (
)
{
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
 * @method setSkin
* @param {char|String} char
* @return {bool|bool}
*/
setSkin : function(
str 
)
{
    return false;
},

/**
 * @method findSlot
 * @param {String} arg0
 * @return {spSlot}
 */
findSlot : function (
str 
)
{
    return spSlot;
},

/**
 * @method updateWorldTransform
 */
updateWorldTransform : function (
)
{
},

/**
 * @method getSkeleton
 * @return {spSkeleton}
 */
getSkeleton : function (
)
{
    return spSkeleton;
},

/**
 * @method findBone
 * @param {String} arg0
 * @return {spBone}
 */
findBone : function (
str 
)
{
    return spBone;
},

/**
 * @method SpineRenderer
 * @constructor
* @param {spSkeleton|spSkeletonData|String|String} spskeleton
* @param {bool|bool|spAtlas|String} bool
* @param {bool|float|float} bool
*/
SpineRenderer : function(
str,
str,
float 
)
{
},

};

/**
 * @class SpineAnimation
 */
spine.SpineAnimation = {

/**
 * @method setAnimation
 * @param {int} arg0
 * @param {String} arg1
 * @param {bool} arg2
 * @return {spTrackEntry}
 */
setAnimation : function (
int, 
str, 
bool 
)
{
    return spTrackEntry;
},

/**
 * @method findAnimation
 * @param {String} arg0
 * @return {spAnimation}
 */
findAnimation : function (
str 
)
{
    return spAnimation;
},

/**
 * @method setMix
 * @param {String} arg0
 * @param {String} arg1
 * @param {float} arg2
 */
setMix : function (
str, 
str, 
float 
)
{
},

/**
 * @method addEmptyAnimation
 * @param {int} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @return {spTrackEntry}
 */
addEmptyAnimation : function (
int, 
float, 
float 
)
{
    return spTrackEntry;
},

/**
 * @method setDisposeListener
 * @param {function} arg0
 */
setDisposeListener : function (
func 
)
{
},

/**
 * @method setAnimationStateData
 * @param {spAnimationStateData} arg0
 */
setAnimationStateData : function (
spanimationstatedata 
)
{
},

/**
 * @method setEndListener
 * @param {function} arg0
 */
setEndListener : function (
func 
)
{
},

/**
 * @method getState
 * @return {spAnimationState}
 */
getState : function (
)
{
    return spAnimationState;
},

/**
 * @method setCompleteListener
 * @param {function} arg0
 */
setCompleteListener : function (
func 
)
{
},

/**
 * @method getCurrent
 * @return {spTrackEntry}
 */
getCurrent : function (
)
{
    return spTrackEntry;
},

/**
 * @method setEventListener
 * @param {function} arg0
 */
setEventListener : function (
func 
)
{
},

/**
 * @method setEmptyAnimation
 * @param {int} arg0
 * @param {float} arg1
 * @return {spTrackEntry}
 */
setEmptyAnimation : function (
int, 
float 
)
{
    return spTrackEntry;
},

/**
 * @method clearTrack
 */
clearTrack : function (
)
{
},

/**
 * @method setInterruptListener
 * @param {function} arg0
 */
setInterruptListener : function (
func 
)
{
},

/**
 * @method addAnimation
 * @param {int} arg0
 * @param {String} arg1
 * @param {bool} arg2
 * @param {float} arg3
 * @return {spTrackEntry}
 */
addAnimation : function (
int, 
str, 
bool, 
float 
)
{
    return spTrackEntry;
},

/**
 * @method setEmptyAnimations
 * @param {float} arg0
 */
setEmptyAnimations : function (
float 
)
{
},

/**
 * @method clearTracks
 */
clearTracks : function (
)
{
},

/**
 * @method setStartListener
 * @param {function} arg0
 */
setStartListener : function (
func 
)
{
},

/**
 * @method createWithBinaryFile
* @param {String|String} str
* @param {String|spAtlas} str
* @param {float|float} float
* @return {sp.SpineAnimation|sp.SpineAnimation}
*/
createWithBinaryFile : function(
str,
spatlas,
float 
)
{
    return sp.SpineAnimation;
},

/**
 * @method create
 * @return {sp.SpineAnimation}
 */
create : function (
)
{
    return sp.SpineAnimation;
},

/**
 * @method createWithJsonFile
* @param {String|String} str
* @param {String|spAtlas} str
* @param {float|float} float
* @return {sp.SpineAnimation|sp.SpineAnimation}
*/
createWithJsonFile : function(
str,
spatlas,
float 
)
{
    return sp.SpineAnimation;
},

/**
 * @method SpineAnimation
 * @constructor
* @param {spSkeletonData|String|String} spskeletondata
* @param {bool|spAtlas|String} bool
* @param {float|float} float
*/
SpineAnimation : function(
str,
str,
float 
)
{
},

};
