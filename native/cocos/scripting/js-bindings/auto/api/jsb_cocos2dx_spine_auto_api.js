/**
 * @module cocos2dx_spine
 */
var sp = sp || {};

/**
 * @class SkeletonRenderer
 */
sp.Skeleton = {

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
 * @method getDebugSlotsEnabled
 * @return {bool}
 */
getDebugSlotsEnabled : function (
)
{
    return false;
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
 * @method setDebugSlotsEnabled
 * @param {bool} arg0
 */
setDebugSlotsEnabled : function (
bool 
)
{
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
 * @method setSlotsToSetupPose
 */
setSlotsToSetupPose : function (
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
 * @method setToSetupPose
 */
setToSetupPose : function (
)
{
},

/**
 * @method getBlendFunc
 * @return {cc.BlendFunc}
 */
getBlendFunc : function (
)
{
    return cc.BlendFunc;
},

/**
 * @method updateWorldTransform
 */
updateWorldTransform : function (
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
 * @method getDebugBonesEnabled
 * @return {bool}
 */
getDebugBonesEnabled : function (
)
{
    return false;
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
 * @method setBlendFunc
 * @param {cc.BlendFunc} arg0
 */
setBlendFunc : function (
blendfunc 
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
 * @method drawDebug
 * @param {cc.Renderer} arg0
 * @param {mat4_object} arg1
 * @param {unsigned int} arg2
 */
drawDebug : function (
renderer, 
mat4, 
int 
)
{
},

/**
 * @method createWithFile
* @param {String|String} str
* @param {spAtlas|String} spatlas
* @param {float|float} float
* @return {sp.SkeletonRenderer|sp.SkeletonRenderer|sp.SkeletonRenderer}
*/
createWithFile : function(
str,
str,
float 
)
{
    return sp.SkeletonRenderer;
},

/**
 * @method SkeletonRenderer
 * @constructor
* @param {spSkeletonData|String|String} spskeletondata
* @param {bool|spAtlas|String} bool
* @param {float|float} float
*/
SkeletonRenderer : function(
str,
str,
float 
)
{
},

};

/**
 * @class SkeletonAnimation
 */
sp.SkeletonAnimation = {

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
* @return {sp.SkeletonAnimation|sp.SkeletonAnimation}
*/
createWithBinaryFile : function(
str,
spatlas,
float 
)
{
    return sp.SkeletonAnimation;
},

/**
 * @method create
 * @return {sp.SkeletonAnimation}
 */
create : function (
)
{
    return sp.SkeletonAnimation;
},

/**
 * @method createWithJsonFile
* @param {String|String} str
* @param {String|spAtlas} str
* @param {float|float} float
* @return {sp.SkeletonAnimation|sp.SkeletonAnimation}
*/
createWithJsonFile : function(
str,
spatlas,
float 
)
{
    return sp.SkeletonAnimation;
},

/**
 * @method SkeletonAnimation
 * @constructor
* @param {spSkeletonData|String|String} spskeletondata
* @param {bool|spAtlas|String} bool
* @param {float|float} float
*/
SkeletonAnimation : function(
str,
str,
float 
)
{
},

};
