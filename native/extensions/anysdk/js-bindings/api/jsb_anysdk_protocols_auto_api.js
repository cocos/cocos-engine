/**
 * @module anysdk_framework
 */
var anysdk = anysdk || {};

/**
 * @class PluginProtocol
 */
anysdk.PluginProtocol = {

/**
 * @method isFunctionSupported
 * @param {String} arg0
 * @return {bool}
 */
isFunctionSupported : function (
str 
)
{
    return false;
},

/**
 * @method getPluginName
 * @return {char}
 */
getPluginName : function (
)
{
    return 0;
},

/**
 * @method getPluginVersion
 * @return {String}
 */
getPluginVersion : function (
)
{
    return ;
},

/**
 * @method setPluginName
 * @param {char} arg0
 */
setPluginName : function (
char 
)
{
},

/**
 * @method getSDKVersion
 * @return {String}
 */
getSDKVersion : function (
)
{
    return ;
},

};

/**
 * @class PluginFactory
 */
anysdk.PluginFactory = {

/**
 * @method purgeFactory
 */
purgeFactory : function (
)
{
},

/**
 * @method getInstance
 * @return {anysdk::framework::PluginFactory}
 */
getInstance : function (
)
{
    return anysdk::framework::PluginFactory;
},

};

/**
 * @class PluginManager
 */
anysdk.PluginManager = {

/**
 * @method unloadPlugin
 * @param {char} arg0
 * @param {int} arg1
 */
unloadPlugin : function (
char, 
int 
)
{
},

/**
 * @method loadPlugin
 * @param {char} arg0
 * @param {int} arg1
 * @return {anysdk::framework::PluginProtocol}
 */
loadPlugin : function (
char, 
int 
)
{
    return anysdk::framework::PluginProtocol;
},

/**
 * @method end
 */
end : function (
)
{
},

/**
 * @method getInstance
 * @return {anysdk::framework::PluginManager}
 */
getInstance : function (
)
{
    return anysdk::framework::PluginManager;
},

};

/**
 * @class ProtocolAnalytics
 */
anysdk.ProtocolAnalytics = {

/**
 * @method logTimedEventBegin
 * @param {char} arg0
 */
logTimedEventBegin : function (
char 
)
{
},

/**
 * @method logError
 * @param {char} arg0
 * @param {char} arg1
 */
logError : function (
char, 
char 
)
{
},

/**
 * @method setCaptureUncaughtException
 * @param {bool} arg0
 */
setCaptureUncaughtException : function (
bool 
)
{
},

/**
 * @method setSessionContinueMillis
 * @param {long} arg0
 */
setSessionContinueMillis : function (
long 
)
{
},

/**
 * @method startSession
 */
startSession : function (
)
{
},

/**
 * @method stopSession
 */
stopSession : function (
)
{
},

/**
 * @method logTimedEventEnd
 * @param {char} arg0
 */
logTimedEventEnd : function (
char 
)
{
},

};

/**
 * @class ProtocolIAP
 */
anysdk.ProtocolIAP = {

/**
 * @method getPluginId
 * @return {String}
 */
getPluginId : function (
)
{
    return ;
},

/**
 * @method getOrderId
 * @return {String}
 */
getOrderId : function (
)
{
    return ;
},

/**
 * @method resetPayState
 */
resetPayState : function (
)
{
},

};

/**
 * @class ProtocolAds
 */
anysdk.ProtocolAds = {

/**
 * @method showAds
 * @param {anysdk::framework::AdsType} arg0
 * @param {int} arg1
 */
showAds : function (
adstype, 
int 
)
{
},

/**
 * @method hideAds
 * @param {anysdk::framework::AdsType} arg0
 * @param {int} arg1
 */
hideAds : function (
adstype, 
int 
)
{
},

/**
 * @method queryPoints
 * @return {float}
 */
queryPoints : function (
)
{
    return 0;
},

/**
 * @method isAdTypeSupported
 * @param {anysdk::framework::AdsType} arg0
 * @return {bool}
 */
isAdTypeSupported : function (
adstype 
)
{
    return false;
},

/**
 * @method preloadAds
 * @param {anysdk::framework::AdsType} arg0
 * @param {int} arg1
 */
preloadAds : function (
adstype, 
int 
)
{
},

/**
 * @method spendPoints
 * @param {int} arg0
 */
spendPoints : function (
int 
)
{
},

};

/**
 * @class ProtocolSocial
 */
anysdk.ProtocolSocial = {

/**
 * @method showLeaderboard
 * @param {char} arg0
 */
showLeaderboard : function (
char 
)
{
},

/**
 * @method signOut
 */
signOut : function (
)
{
},

/**
 * @method showAchievements
 */
showAchievements : function (
)
{
},

/**
 * @method signIn
 */
signIn : function (
)
{
},

/**
 * @method submitScore
 * @param {char} arg0
 * @param {long} arg1
 */
submitScore : function (
char, 
long 
)
{
},

};

/**
 * @class ProtocolUser
 */
anysdk.ProtocolUser = {

/**
 * @method isLogined
 * @return {bool}
 */
isLogined : function (
)
{
    return false;
},

/**
 * @method getUserID
 * @return {String}
 */
getUserID : function (
)
{
    return ;
},

/**
 * @method login
* @param {map_object} map
*/
login : function(
map 
)
{
},

/**
 * @method getPluginId
 * @return {String}
 */
getPluginId : function (
)
{
    return ;
},

};

/**
 * @class ProtocolPush
 */
anysdk.ProtocolPush = {

/**
 * @method startPush
 */
startPush : function (
)
{
},

/**
 * @method closePush
 */
closePush : function (
)
{
},

/**
 * @method delAlias
 * @param {String} arg0
 */
delAlias : function (
str 
)
{
},

/**
 * @method setAlias
 * @param {String} arg0
 */
setAlias : function (
str 
)
{
},

};

/**
 * @class ProtocolCrash
 */
anysdk.ProtocolCrash = {

/**
 * @method setUserIdentifier
 * @param {char} arg0
 */
setUserIdentifier : function (
char 
)
{
},

/**
 * @method reportException
 * @param {char} arg0
 * @param {char} arg1
 */
reportException : function (
char, 
char 
)
{
},

/**
 * @method leaveBreadcrumb
 * @param {char} arg0
 */
leaveBreadcrumb : function (
char 
)
{
},

};

/**
 * @class ProtocolREC
 */
anysdk.ProtocolREC = {

/**
 * @method share
 * @param {map_object} arg0
 */
share : function (
map 
)
{
},

/**
 * @method startRecording
 */
startRecording : function (
)
{
},

/**
 * @method stopRecording
 */
stopRecording : function (
)
{
},

};

/**
 * @class ProtocolCustom
 */
anysdk.ProtocolCustom = {

};

/**
 * @class ProtocolAdTracking
 */
anysdk.ProtocolAdTracking = {

/**
 * @method onPay
 * @param {map_object} arg0
 */
onPay : function (
map 
)
{
},

/**
 * @method onLogin
 * @param {map_object} arg0
 */
onLogin : function (
map 
)
{
},

/**
 * @method onRegister
 * @param {char} arg0
 */
onRegister : function (
char 
)
{
},

};

/**
 * @class AgentManager
 */
anysdk.AgentManager = {

/**
 * @method unloadAllPlugins
 */
unloadAllPlugins : function (
)
{
},

/**
 * @method getSocialPlugin
 * @return {anysdk::framework::ProtocolSocial}
 */
getSocialPlugin : function (
)
{
    return anysdk::framework::ProtocolSocial;
},

/**
 * @method getPushPlugin
 * @return {anysdk::framework::ProtocolPush}
 */
getPushPlugin : function (
)
{
    return anysdk::framework::ProtocolPush;
},

/**
 * @method getUserPlugin
 * @return {anysdk::framework::ProtocolUser}
 */
getUserPlugin : function (
)
{
    return anysdk::framework::ProtocolUser;
},

/**
 * @method getAdTrackingPlugin
 * @return {anysdk::framework::ProtocolAdTracking}
 */
getAdTrackingPlugin : function (
)
{
    return anysdk::framework::ProtocolAdTracking;
},

/**
 * @method getCustomPlugin
 * @return {anysdk::framework::ProtocolCustom}
 */
getCustomPlugin : function (
)
{
    return anysdk::framework::ProtocolCustom;
},

/**
 * @method getCustomParam
 * @return {String}
 */
getCustomParam : function (
)
{
    return ;
},

/**
 * @method loadAllPlugins
 */
loadAllPlugins : function (
)
{
},

/**
 * @method init
 * @param {String} arg0
 * @param {String} arg1
 * @param {String} arg2
 * @param {String} arg3
 */
init : function (
str, 
str, 
str, 
str 
)
{
},

/**
 * @method isAnaylticsEnabled
 * @return {bool}
 */
isAnaylticsEnabled : function (
)
{
    return false;
},

/**
 * @method getChannelId
 * @return {String}
 */
getChannelId : function (
)
{
    return ;
},

/**
 * @method getAdsPlugin
 * @return {anysdk::framework::ProtocolAds}
 */
getAdsPlugin : function (
)
{
    return anysdk::framework::ProtocolAds;
},

/**
 * @method setIsAnaylticsEnabled
 * @param {bool} arg0
 */
setIsAnaylticsEnabled : function (
bool 
)
{
},

/**
 * @method getSharePlugin
 * @return {anysdk::framework::ProtocolShare}
 */
getSharePlugin : function (
)
{
    return anysdk::framework::ProtocolShare;
},

/**
 * @method getAnalyticsPlugin
 * @return {anysdk::framework::ProtocolAnalytics}
 */
getAnalyticsPlugin : function (
)
{
    return anysdk::framework::ProtocolAnalytics;
},

/**
 * @method getRECPlugin
 * @return {anysdk::framework::ProtocolREC}
 */
getRECPlugin : function (
)
{
    return anysdk::framework::ProtocolREC;
},

/**
 * @method getCrashPlugin
 * @return {anysdk::framework::ProtocolCrash}
 */
getCrashPlugin : function (
)
{
    return anysdk::framework::ProtocolCrash;
},

/**
 * @method end
 */
end : function (
)
{
},

/**
 * @method getInstance
 * @return {anysdk::framework::AgentManager}
 */
getInstance : function (
)
{
    return anysdk::framework::AgentManager;
},

};

/**
 * @class JSBRelation
 */
anysdk.JSBRelation = {

/**
 * @method getMethodsOfPlugin
 * @param {anysdk::framework::PluginProtocol} arg0
 * @return {String}
 */
getMethodsOfPlugin : function (
pluginprotocol 
)
{
    return ;
},

};
