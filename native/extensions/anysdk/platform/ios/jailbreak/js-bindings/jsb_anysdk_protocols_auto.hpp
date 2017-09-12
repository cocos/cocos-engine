#include "base/ccConfig.h"
#ifndef __anysdk_framework_h__
#define __anysdk_framework_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_anysdk_framework_PluginProtocol_class;
extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

bool js_anysdk_framework_PluginProtocol_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_PluginProtocol_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_PluginProtocol(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_PluginProtocol_isFunctionSupported(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_PluginProtocol_getPluginName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_PluginProtocol_getPluginVersion(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_PluginProtocol_setPluginName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_PluginProtocol_getSDKVersion(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_PluginFactory_class;
extern JSObject *jsb_anysdk_framework_PluginFactory_prototype;

bool js_anysdk_framework_PluginFactory_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_PluginFactory_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_PluginFactory(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_PluginFactory_purgeFactory(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_PluginFactory_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_PluginManager_class;
extern JSObject *jsb_anysdk_framework_PluginManager_prototype;

bool js_anysdk_framework_PluginManager_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_PluginManager_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_PluginManager(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_PluginManager_unloadPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_PluginManager_loadPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_PluginManager_end(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_PluginManager_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_ProtocolAnalytics_class;
extern JSObject *jsb_anysdk_framework_ProtocolAnalytics_prototype;

bool js_anysdk_framework_ProtocolAnalytics_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolAnalytics_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolAnalytics(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAnalytics_logError(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAnalytics_startSession(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAnalytics_stopSession(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_ProtocolYAP_class;
extern JSObject *jsb_anysdk_framework_ProtocolYAP_prototype;

bool js_anysdk_framework_ProtocolYAP_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolYAP_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolYAP(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_ProtocolYAP_getPluginId(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolYAP_getOrderId(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolYAP_resetYapState(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_ProtocolAds_class;
extern JSObject *jsb_anysdk_framework_ProtocolAds_prototype;

bool js_anysdk_framework_ProtocolAds_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolAds_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolAds(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_ProtocolAds_showAds(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAds_hideAds(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAds_queryPoints(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAds_isAdTypeSupported(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAds_preloadAds(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAds_spendPoints(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_ProtocolSocial_class;
extern JSObject *jsb_anysdk_framework_ProtocolSocial_prototype;

bool js_anysdk_framework_ProtocolSocial_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolSocial_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolSocial(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_ProtocolSocial_showLeaderboard(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolSocial_signOut(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolSocial_showAchievements(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolSocial_signIn(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolSocial_submitScore(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_ProtocolUser_class;
extern JSObject *jsb_anysdk_framework_ProtocolUser_prototype;

bool js_anysdk_framework_ProtocolUser_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolUser_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolUser(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_ProtocolUser_isLogined(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolUser_getUserID(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolUser_login(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolUser_getPluginId(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_ProtocolPush_class;
extern JSObject *jsb_anysdk_framework_ProtocolPush_prototype;

bool js_anysdk_framework_ProtocolPush_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolPush_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolPush(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_ProtocolPush_startPush(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolPush_closePush(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolPush_delAlias(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolPush_setAlias(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_ProtocolCrash_class;
extern JSObject *jsb_anysdk_framework_ProtocolCrash_prototype;

bool js_anysdk_framework_ProtocolCrash_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolCrash_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolCrash(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_ProtocolCrash_setUserIdentifier(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolCrash_reportException(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolCrash_leaveBreadcrumb(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_ProtocolREC_class;
extern JSObject *jsb_anysdk_framework_ProtocolREC_prototype;

bool js_anysdk_framework_ProtocolREC_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolREC_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolREC(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_ProtocolREC_share(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolREC_startRecording(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolREC_stopRecording(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_ProtocolCustom_class;
extern JSObject *jsb_anysdk_framework_ProtocolCustom_prototype;

bool js_anysdk_framework_ProtocolCustom_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolCustom_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolCustom(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);

extern JSClass  *jsb_anysdk_framework_ProtocolAdTracking_class;
extern JSObject *jsb_anysdk_framework_ProtocolAdTracking_prototype;

bool js_anysdk_framework_ProtocolAdTracking_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_ProtocolAdTracking_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_ProtocolAdTracking(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_ProtocolAdTracking_onYap(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAdTracking_onLogin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_ProtocolAdTracking_onRegister(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_AgentManager_class;
extern JSObject *jsb_anysdk_framework_AgentManager_prototype;

bool js_anysdk_framework_AgentManager_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_AgentManager_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_AgentManager(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_AgentManager_unloadAllPlugins(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getSocialPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getPushPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getUserPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getAdTrackingPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getCustomPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getCustomParam(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_loadAllPlugins(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_init(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_isAnaylticsEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getChannelId(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getAdsPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_setIsAnaylticsEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getSharePlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getAnalyticsPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getRECPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getCrashPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_end(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_anysdk_framework_AgentManager_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_anysdk_framework_JSBRelation_class;
extern JSObject *jsb_anysdk_framework_JSBRelation_prototype;

bool js_anysdk_framework_JSBRelation_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_anysdk_framework_JSBRelation_finalize(JSContext *cx, JSObject *obj);
void js_register_anysdk_framework_JSBRelation(JSContext *cx, JS::HandleObject global);
void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj);
bool js_anysdk_framework_JSBRelation_getMethodsOfPlugin(JSContext *cx, uint32_t argc, JS::Value *vp);

#endif // __anysdk_framework_h__
