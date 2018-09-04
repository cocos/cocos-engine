/**
 * @module extension
 */
var jsb = jsb || {};

/**
 * @class EventAssetsManagerEx
 */
jsb.EventAssetsManager = {

/**
 * @method getAssetsManagerEx
 * @return {cc.AssetsManagerEx}
 */
getAssetsManagerEx : function (
)
{
    return cc.AssetsManagerEx;
},

/**
 * @method getDownloadedFiles
 * @return {int}
 */
getDownloadedFiles : function (
)
{
    return 0;
},

/**
 * @method getTotalFiles
 * @return {int}
 */
getTotalFiles : function (
)
{
    return 0;
},

/**
 * @method getAssetId
 * @return {String}
 */
getAssetId : function (
)
{
    return ;
},

/**
 * @method getTotalBytes
 * @return {double}
 */
getTotalBytes : function (
)
{
    return 0;
},

/**
 * @method getCURLECode
 * @return {int}
 */
getCURLECode : function (
)
{
    return 0;
},

/**
 * @method getMessage
 * @return {String}
 */
getMessage : function (
)
{
    return ;
},

/**
 * @method getCURLMCode
 * @return {int}
 */
getCURLMCode : function (
)
{
    return 0;
},

/**
 * @method getDownloadedBytes
 * @return {double}
 */
getDownloadedBytes : function (
)
{
    return 0;
},

/**
 * @method getPercentByFile
 * @return {float}
 */
getPercentByFile : function (
)
{
    return 0;
},

/**
 * @method getEventCode
 * @return {cc.EventAssetsManagerEx::EventCode}
 */
getEventCode : function (
)
{
    return 0;
},

/**
 * @method getPercent
 * @return {float}
 */
getPercent : function (
)
{
    return 0;
},

/**
 * @method isResuming
 * @return {bool}
 */
isResuming : function (
)
{
    return false;
},

/**
 * @method EventAssetsManagerEx
 * @constructor
 * @param {String} arg0
 * @param {cc.AssetsManagerEx} arg1
 * @param {cc.EventAssetsManagerEx::EventCode} arg2
 * @param {String} arg3
 * @param {String} arg4
 * @param {int} arg5
 * @param {int} arg6
 */
EventAssetsManagerEx : function (
str, 
assetsmanagerex, 
eventcode, 
str, 
str, 
int, 
int 
)
{
},

};

/**
 * @class Manifest
 */
jsb.Manifest = {

/**
 * @method getManifestRoot
 * @return {String}
 */
getManifestRoot : function (
)
{
    return ;
},

/**
 * @method setUpdating
 * @param {bool} arg0
 */
setUpdating : function (
bool 
)
{
},

/**
 * @method getManifestFileUrl
 * @return {String}
 */
getManifestFileUrl : function (
)
{
    return ;
},

/**
 * @method isVersionLoaded
 * @return {bool}
 */
isVersionLoaded : function (
)
{
    return false;
},

/**
 * @method parseFile
 * @param {String} arg0
 */
parseFile : function (
str 
)
{
},

/**
 * @method isLoaded
 * @return {bool}
 */
isLoaded : function (
)
{
    return false;
},

/**
 * @method getPackageUrl
 * @return {String}
 */
getPackageUrl : function (
)
{
    return ;
},

/**
 * @method isUpdating
 * @return {bool}
 */
isUpdating : function (
)
{
    return false;
},

/**
 * @method getVersion
 * @return {String}
 */
getVersion : function (
)
{
    return ;
},

/**
 * @method parseJSONString
 * @param {String} arg0
 * @param {String} arg1
 */
parseJSONString : function (
str, 
str 
)
{
},

/**
 * @method getVersionFileUrl
 * @return {String}
 */
getVersionFileUrl : function (
)
{
    return ;
},

/**
 * @method getSearchPaths
 * @return {Array}
 */
getSearchPaths : function (
)
{
    return new Array();
},

/**
 * @method Manifest
 * @constructor
* @param {String|String} str
* @param {String} str
*/
Manifest : function(
str,
str 
)
{
},

};

/**
 * @class AssetsManagerEx
 */
jsb.AssetsManager = {

/**
 * @method getDownloadedFiles
 * @return {int}
 */
getDownloadedFiles : function (
)
{
    return 0;
},

/**
 * @method getState
 * @return {cc.AssetsManagerEx::State}
 */
getState : function (
)
{
    return 0;
},

/**
 * @method getMaxConcurrentTask
 * @return {int}
 */
getMaxConcurrentTask : function (
)
{
    return 0;
},

/**
 * @method getTotalFiles
 * @return {int}
 */
getTotalFiles : function (
)
{
    return 0;
},

/**
 * @method loadRemoteManifest
 * @param {cc.Manifest} arg0
 * @return {bool}
 */
loadRemoteManifest : function (
manifest 
)
{
    return false;
},

/**
 * @method checkUpdate
 */
checkUpdate : function (
)
{
},

/**
 * @method getTotalBytes
 * @return {double}
 */
getTotalBytes : function (
)
{
    return 0;
},

/**
 * @method setVerifyCallback
 * @param {function} arg0
 */
setVerifyCallback : function (
func 
)
{
},

/**
 * @method getStoragePath
 * @return {String}
 */
getStoragePath : function (
)
{
    return ;
},

/**
 * @method update
 */
update : function (
)
{
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
 * @method setVersionCompareHandle
 * @param {function} arg0
 */
setVersionCompareHandle : function (
func 
)
{
},

/**
 * @method setMaxConcurrentTask
 * @param {int} arg0
 */
setMaxConcurrentTask : function (
int 
)
{
},

/**
 * @method getDownloadedBytes
 * @return {double}
 */
getDownloadedBytes : function (
)
{
    return 0;
},

/**
 * @method getLocalManifest
 * @return {cc.Manifest}
 */
getLocalManifest : function (
)
{
    return cc.Manifest;
},

/**
 * @method loadLocalManifest
* @param {String|cc.Manifest} str
* @param {String} str
* @return {bool|bool}
*/
loadLocalManifest : function(
manifest,
str 
)
{
    return false;
},

/**
 * @method getRemoteManifest
 * @return {cc.Manifest}
 */
getRemoteManifest : function (
)
{
    return cc.Manifest;
},

/**
 * @method prepareUpdate
 */
prepareUpdate : function (
)
{
},

/**
 * @method downloadFailedAssets
 */
downloadFailedAssets : function (
)
{
},

/**
 * @method isResuming
 * @return {bool}
 */
isResuming : function (
)
{
    return false;
},

/**
 * @method create
 * @param {String} arg0
 * @param {String} arg1
 * @return {cc.AssetsManagerEx}
 */
create : function (
str, 
str 
)
{
    return cc.AssetsManagerEx;
},

/**
 * @method AssetsManagerEx
 * @constructor
* @param {String|String} str
* @param {String|String} str
* @param {function} func
*/
AssetsManagerEx : function(
str,
str,
func 
)
{
},

};
