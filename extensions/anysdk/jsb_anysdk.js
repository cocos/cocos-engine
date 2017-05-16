/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of Stringge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en
 * AnySDK is a third party solution that offers game developers SDK integration without making changes to the SDK's features or parameters.It can do all of this while remaining invisible to your end user.Our goal is to handle all the tedious SDK integration work for you so that you can use your time to focus on the game itself.No matter if it’s the channel SDK, user system, payment system, ad system, statistics system, sharing system or any other type of SDK: we’ll take care of it for you.
 * !#zh
 * AnySDK 为 CP 提供一套第三方 SDK 接入解决方案，整个接入过程，不改变任何 SDK 的功能、特性、参数等，对于最终玩家而言是完全透明无感知的。
目的是让 CP 商能有更多时间更专注于游戏本身的品质，所有 SDK 的接入工作统统交给我们吧。第三方 SDK 包括了渠道SDK、用户系统、支付系统、广告系统、统计系统、分享系统等等。
 * @module anysdk
 * @main anysdk
 */
var anysdk = anysdk || {};
/**
 * !#en
 * agent manager of plugin
 * !#zh
 * 插件管理对象
 * @property {anysdk.AgentManager} agentManager
 */
anysdk.agentManager = anysdk.AgentManager.getInstance();

/**
 * !#en
 * agent manager of plugin
 * !#zh
 * 插件管理类
 * @class AgentManager
 * @hide
 *
 */
anysdk.AgentManager = {
    /**
     * !#en
     * AppKey appSecret and privateKey are the only three parameters generated
     * after the packing tool client finishes creating the game.
     * The oauthLoginServer parameter is the API address provided by the game service
     * to login verification
     * !#zh
     * appKey、appSecret、privateKey是通过 AnySDK 客户端工具创建游戏后生成的。
     * oauthLoginServer参数是游戏服务提供的用来做登陆验证转发的接口地址。
     * @method init
     * @param {String} appKey
     * @param {String} appSecret
     * @param {String} privateKey
     * @param {String} oauthLoginServer
     */
    init: function(appKey, appSecret, privateKey, oauthLoginServer){
    },

    /**
     * !#en
     * load all plugins, the operation includes SDK`s initialization
     * !#zh
     * 加载所有插件，该操作包含了 SDKs 初始化
     * @method loadAllPlugins
     * @param {Function} callback
     * @param {object} target The object to bind to.
     */
    loadAllPlugins: function(callback, target){
    },

    /**
     * !#en
     * unload all plugins
     * !#zh
     * 卸载插件
     * @method unloadAllPlugins
     */
    unloadAllPlugins: function(){
    },

    /**
     * !#en
     * get user system plugin
     * !#zh
     * 获取用户系统插件
     * @method getUserPlugin
     * @return {anysdk.ProtocolUser}
     */
    getUserPlugin: function(){
        return anysdk.ProtocolUser;
    },

    /**
     * !#en
     * get IAP system plugins
     * !#zh
     * 获取支付系统插件
     * @method getIAPPlugins
     * @return {anysdk.ProtocolIAP}
     */
    getIAPPlugins: function(){
        return {anysdk.ProtocolIAP};
    },

    /**
     * !#en
     * get IAP system plugin
     * !#zh
     * 获取支付系统插件
     * @method getIAPPlugin
     * @return {anysdk.ProtocolIAP}
     */
    getIAPPlugin: function(){
        return anysdk.ProtocolIAP;
    },

    /**
     * !#en
     * get social system plugin
     * !#zh
     * 获取社交系统插件
     * @method getSocialPlugin
     * @return {anysdk.ProtocolSocial}
     */
    getSocialPlugin: function(){
        return anysdk.ProtocolSocial;
    },

    /**
     * !#en
     * get share system plugin
     * !#zh
     * 获取分享系统插件
     * @method getSharePlugin
     * @return {anysdk.ProtocolShare}
     */
    getSharePlugin: function(){
        return anysdk.ProtocolShare;
    },

    /**
     * !#en
     * get analytics system plugin
     * !#zh
     * 获取统计系统插件
     * @method getAnalyticsPlugin
     * @return {anysdk.ProtocolAnalytics}
     */
    getAnalyticsPlugin: function(){
        return anysdk.ProtocolAnalytics;
    },

    /**
     * !#en
     * get ads system plugin
     * !#zh
     * 获取广告系统插件
     * @method getAdsPlugin
     * @return {anysdk.ProtocolAds}
     */
    getAdsPlugin: function(){
        return anysdk.ProtocolAds;
    },

    /**
     * !#en
     * get push system plugin
     * !#zh
     * 获取推送系统插件
     * @method getPushPlugin
     * @return {anysdk.ProtocolPush}
     */
    getPushPlugin: function(){
        return anysdk.ProtocolPush;
    },

    /**
     * !#en
     * get REC system plugin
     * !#zh
     * 获取录屏系统插件
     * @method getRECPlugin
     * @return {anysdk.ProtocolREC}
     */
    getRECPlugin: function(){
        return anysdk.ProtocolREC;
    },

    /**
     * !#en
     * get crash system plugin
     * !#zh
     * 获取崩溃分析系统插件
     * @method getCrashPlugin
     * @return {anysdk.ProtocolCrash}
     */
    getCrashPlugin: function(){
        return anysdk.ProtocolCrash;
    },

    /**
     * !#en
     * get ad track system plugin
     * !#zh
     * 获取广告追踪系统插件
     * @method getAdTrackingPlugin
     * @return {anysdk.ProtocolAdTracking}
     */
    getAdTrackingPlugin: function(){
        return anysdk.ProtocolAdTracking;
    },

    /**
     * !#en
     * get custom system plugin
     * !#zh
     * 获取自定义系统插件
     * @method getCustomPlugin
     * @return {anysdk.ProtocolCustom}
     */
    getCustomPlugin: function(){
        return anysdk.ProtocolCustom;
    },

    /**
     * !#en
     * get custom parameter
     * !#zh
     * 获取自定义参数
     * @method getCustomParam
     * @return {String}
     */
    getCustomParam: function(){
        return String;
    },

    /**
     * !#en
     * get channel id
     * !#zh
     * 获取渠道唯一表示符
     * @method getChannelId
     * @return {String}
     */
    getChannelId: function(){
        return String;
    },

    /**
     * !#en
     * get status of analytics
     * !#zh
     * 获取统计状态
     * @method isAnaylticsEnabled
     * @return {boolean}
     */
    isAnaylticsEnabled: function(){
        return boolean;
    },

    /**
     * !#en
     * set whether to analytics
     * !#zh
     * 设置是否统计
     * @method setIsAnaylticsEnabled
     * @param {boolean} enabled
     */
    setIsAnaylticsEnabled: function(enabled){
    },

    /**
     * !#en
     * destory instance
     * !#zh
     * 销毁单例
     * @method end
     * @static
     */
    end: function(){
    },

    /**
     * !#en
     * get instance
     * !#zh
     * 获取单例
     * @method getInstance
     * @return {anysdk.AgentManager}
     * @static
     */
    getInstance: function(){
        return anysdk.AgentManager;
    },
};



/**
 * !#en
 * plugin protocol
 * !#zh
 * 插件协议
 * @class PluginProtocol
 * @hide
 * @brief  The super class for all plugins.
 */
anysdk.PluginProtocol = {

    /**
     * !#en
     * Check whether the function is supported
     * !#zh
     * 判断函数是否支持
     * @method isFunctionSupported
     * @param {String} functionName
     * @return {boolean}
     */
    isFunctionSupported: function(functionName)
    {
        return boolean;
    },

    /**
     * !#en
     * get plugin name
     * !#zh
     * 获取插件名称
     * @method getPluginName
     * @return {String}
     */
    getPluginName: function(){
        return String;
    },

    /**
     * !#en
     * get plugin version
     * !#zh
     * 获取插件版本
     * @method getPluginVersion
     * @return {String}
     */
    getPluginVersion: function (){
        return String;
    },

    /**
     * !#en
     * get SDK version
     * !#zh
     * 获取 SDK 版本
     * @method getSDKVersion
     * @return {String}
     */
    getSDKVersion: function(){
        return String;
    },

    /**
     * !#en
     * void methods for reflections with parameter
     * !#zh
     * 反射调用带参数的void方法
     * @method callFuncWithParam
     * @param {String} funName
     * @param {Object|anysdk.PluginParam} [...args] optional arguments
     * @expose
     */
    callFuncWithParam: function(funName){
    },

    /**
     * !#en
     * String methods for reflections with parameter
     * !#zh
     * 反射调用带参数的 String 方法
     * @method callStringFuncWithParam
     * @param {String} funName
     * @param {Object|anysdk.PluginParam} [...args] optional arguments
     * @return {String}
     * @expose
     */
    callStringFuncWithParam: function(funName){
        return String;
    },

    /**
     * !#en
     * int methods for reflections with parameter
     * !#zh
     * 反射调用带参数的 Int 方法
     * @method callIntFuncWithParam
     * @param {String} funName
     * @param {Object|anysdk.PluginParam} [...args] optional arguments
     * @return {Number} Type:int
     * @expose
     */
    callIntFuncWithParam: function(funName){
        return int;
    },

    /**
     * !#en
     * boolean methods for reflections with parameter
     * !#zh
     * 反射调用带参数的 boolean 方法
     * @method callBoolFuncWithParam
     * @param {String} funName
     * @param {Object|anysdk.PluginParam} [...args] optional arguments
     * @return {boolean}
     * @expose
     */
    callBoolFuncWithParam: function(funName){
        return boolean;
    },

    /**
     * !#en
     * float methods for reflections with parameter
     * !#zh
     * 反射调用带参数的 float 方法
     * @method callFloatFuncWithParam
     * @param {String} funName
     * @param {Object|anysdk.PluginParam} [...args] optional arguments
     * @return {Number} Type:float
     * @expose
     */
    callFloatFuncWithParam: function(funName){
        return float;
    },
};

/**
 * !#en
 * user protocol
 * !#zh
 * 用户系统协议接口
 * @class ProtocolUser
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolUser = PluginProtocol.extend({

    /**
     * !#en
     * login interface
     * !#zh
     * 登录接口
     * @method login
     * @param {String|Object} [...args] optional arguments
     */
    login: function(){
    },

    /**
     * !#en
     * get status of login
     * !#zh
     * 获取登录状态
     * @method isLogined
     * @return {boolean}
     */
    isLogined : function ()
    {
        return boolean;
    },

    /**
     * !#en
     * get user ID
     * !#zh
     * 获取用户唯一标示符
     * @method getUserID
     * @return {String}
     */
    getUserID : function ()
    {
        return String;
    },

    /**
     * !#en
     * get plugin ID
     * !#zh
     * 获取插件ID
     * @method getPluginId
     * @return {String}
     */
    getPluginId: function (){
        return String;
    },

    /**
     * !#en
     * set listener
     * !#zh
     * 设置用户系统的监听
     * @method setListener
     * @param {Function} listener
     * @param {Object} target
     */
    setListener: function(listener, target) {
    },

    /**
     * !#en
     * get listener
     * !#zh
     * 获取用户系统的监听
     * @method getListener
     * @return {Function} listener
     */
    getListener: function() {
        return Function;
    },

    /**
     * !#en
     * logout
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 登出，调用前需要判断属性是否存在
     * @method logout
     */
    logout: function(){
    },

    /**
     * !#en
     * show toolbar
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 显示悬浮窗，调用前需要判断属性是否存在
     * @method showToolBar
     * @param {anysdk.ToolBarPlace} place
     */
    showToolBar: function(place){
    },

    /**
     * !#en
     * hide toolbar
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 隐藏悬浮窗，调用前需要判断属性是否存在
     * @method hideToolBar
     */
    hideToolBar: function(){
    },

    /**
     * !#en
     * enter platform
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 显示平台中心，调用前需要判断属性是否存在
     * @method enterPlatform
     */
    enterPlatform: function(){
    },

    /**
     * !#en
     * show exit page
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 显示退出界面，调用前需要判断属性是否存在
     * @method exit
     */
    exit: function(){
    },

    /**
     * !#en
     * show pause page
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 显示暂停界面，调用前需要判断属性是否存在
     * @method pause
     */
    pause: function(){
    },

    /**
     * !#en
     * Real-name registration
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 实名注册，调用前需要判断属性是否存在
     * @method realNameRegister
     */
    realNameRegister: function(){
    },

    /**
     * !#en
     * Anti-addiction query
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 防沉迷查询，调用前需要判断属性是否存在
     * @method antiAddictionQuery
     */
    antiAddictionQuery: function(){
    },

    /**
     * !#en
     * submit game role information
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 提交角色信息，调用前需要判断属性是否存在
     * @method submitLoginGameRole
     * @param {Object} data
     */
    submitLoginGameRole: function(data){
    },
    /**
     * !#en
     * get user information
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 获取用户信息，调用前需要判断属性是否存在
     * @method getUserInfo
     * @param {Object} info
     */
    getUserInfo:function(info){
    },

    /**
     * !#en
     * set login type
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 设置登录类型，调用前需要判断属性是否存在
     * @method getAvailableLoginType
     * @param {Object} info
     */
    getAvailableLoginType:function(info){
    },

    /**
     * !#en
     * set login type
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 设置登录类型，调用前需要判断属性是否存在
     * @method setLoginType
     * @param {String} loginType
     */
    setLoginType:function(loginType){
    },


    /**
     * !#en
     * send to desktop
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 发送到桌面，调用前需要判断属性是否存在
     * @method sendToDesktop
     */
    sendToDesktop: function(){
    },

    /**
     * !#en
     * open bbs
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 打开论坛，调用前需要判断属性是否存在
     * @method openBBS
     */
    openBBS: function(){
    },

});


/**
 * !#en
 * IAP protocol
 * !#zh
 * 支付系统协议接口
 * @class ProtocolIAP
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolIAP = PluginProtocol.extend({

    /**
     * !#en
     * pay interface
     * !#zh
     * 支付接口
     * @method payForProduct
     * @param {Object} info  Type:map
     */
    payForProduct: function(info){
    },

    /**
     * !#en
     * get order ID
     * !#zh
     * 获取订单ID
     * @method getOrderId
     * @return {String}
     */
    getOrderId: function(){
        return String;
    },

    /**
     * !#en
     * reset the pay status
     * !#zh
     * 重置支付状态
     * @static
     * @method resetPayState
     */
    resetPayState: function(){
    },

    /**
     * !#en
     * get plugin ID
     * !#zh
     * 获取插件ID
     * @method getPluginId
     * @return {String}
     */
    getPluginId: function (){
        return String;
    },

    /**
     * !#en
     * set listener
     * !#zh
     * 设置支付系统的监听
     * @method setListener
     * @param {Function} listener
     * @param {Object} target
     */
    setListener: function(listener, target) {
    },

    /**
     * !#en
     * get listener
     * !#zh
     * 获取支付系统的监听
     * @method getListener
     * @return {Function} listener
     */
    getListener: function() {
        return Function;
    },

});

/**
 * !#en
 * analytics protocol
 * !#zh
 * 统计系统协议接口
 * @class ProtocolAnalytics
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolAnalytics = PluginProtocol.extend({

    /**
     * !#en
     * Start a new session.
     * !#zh
     * 启动会话
     * @method startSession
     */
    startSession: function(){
    },

    /**
     * !#en
     *  Stop a session.
     * !#zh
     * 关闭会话
     * @method stopSession
     */
    stopSession: function(){
    },

    /**
     * !#en
     * Set the timeout for expiring a session.
     * !#zh
     * 设置会话超时时间
     * @method setSessionContinueMillis
     * @param {Number} millis  Type: long
     */
    setSessionContinueMillis: function(millis){
    },

    /**
     * !#en
     * log an error
     * !#zh
     * 捕捉异常
     * @method logError
     * @param {String} errorId
     * @param {String} message
     */
    logError: function(errorId, message){
    },

    /**
     * !#en
     * log an event.
     * !#zh
     * 捕捉事件
     * @method logEvent
     * @param {String} errorId
     * @param {Object} [...args] optional arguments Type: map
     */
    logEvent: function(errorId, paramMap){
    },

    /**
     * !#en
     * Track an event begin.
     * !#zh
     * 统计事件开始
     * @method logTimedEventBegin
     * @param {String} eventId
     */
    logTimedEventBegin: function(eventId){
    },

    /**
     * !#en
     * Track an event end.
     * !#zh
     * 统计事件结束
     * @method logTimedEventEnd
     * @param {String} eventId
     */
    logTimedEventEnd: function(eventId){
    },

    /**
     * !#en
     * set Whether to catch uncaught exceptions to server.
     * !#zh
     * 设置是否开启自动异常捕捉
     * @method setCaptureUncaughtException
     * @param {boolean} enabled
     */
    setCaptureUncaughtException: function(enabled){
    },

    /**
     * !#en
     * analytics account information
     * !#zh
     * 统计玩家帐户信息
     * @method setAccount
     * @param {Object} paramMap Type: map
     */
    setAccount: function(paramMap){
    },

    /**
     * !#en
     * track user to request payment
     * !#zh
     * 跟踪用户支付请求
     * @method onChargeRequest
     * @param {Object} paramMap Type: map
     */
    onChargeRequest: function(paramMap){
    },

    /**
     * !#en
     * track Successful payment
     * !#zh
     * 追踪用户支付成功
     * @method onChargeSuccess
     * @param {String} orderID
     */
    onChargeSuccess: function(orderID){
    },

    /**
     * !#en
     * track failed payment
     * !#zh
     * 追踪用户支付失败
     * @method onChargeFail
     * @param {Object} paramMap Type: map
     */
    onChargeFail: function(paramMap){
    },

    /**
     * !#en
     * track Successful payment
     * !#zh
     * 统计玩家支付成功
     * @method onChargeOnlySuccess
     * @param {Object} paramMap Type: map
     */
    onChargeOnlySuccess: function(paramMap){
    },

    /**
     * !#en
     * track user purchase
     * !#zh
     * 统计玩家消费
     * @method onPurchase
     * @param {Object} paramMap Type: map
     */
    onPurchase: function(paramMap){
    },

    /**
     * !#en
     * track user to use goods
     * !#zh
     * 统计玩家使用道具
     * @method onUse
     * @param {Object} paramMap Type: map
     */
    onUse: function(paramMap){
    },

    /**
     * !#en
     * track user to reward goods
     * !#zh
     * 统计玩家获取奖励
     * @method onReward
     * @param {Object} paramMap Type: map
     */
    onReward: function(paramMap){
    },

    /**
     * !#en
     *  start level
     * !#zh
     * 开始关卡
     * @method startLevel
     * @param {Object} paramMap Type: map
     */
    startLevel: function(paramMap){
    },

    /**
     * !#en
     * finish level
     * !#zh
     * 结束关卡
     * @method finishLevel
     * @param {String} levelID
     */
    finishLevel: function(levelID){
    },

    /**
     * !#en
     * failed level
     * !#zh
     * 关卡失败
     * @method failLevel
     * @param {Object} paramMap Type: map
     */
    failLevel: function(paramMap){
    },

    /**
     * !#en
     * start task
     * !#zh
     * 开始任务
     * @method startTask
     * @param {Object} paramMap Type: map
     */
    startTask: function(paramMap){
    },

    /**
     * !#en
     * finish task
     * !#zh
     * 完成任务
     * @method finishTask
     * @param {String} taskID
     */
    finishTask: function(taskID){
    },

    /**
     * !#en
     * failed task
     * !#zh
     * 任务失败
     * @method failTask
     * @param {Object} paramMap Type: map
     */
    failTask: function(paramMap){
    },



});

/**
 * !#en
 * share protocol
 * !#zh
 * 分享系统协议接口
 * @class ProtocolShare
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolShare = PluginProtocol.extend({

    /**
     * !#en
     * share interface
     * !#zh
     * 分享
     * @method share
     * @param {Object} info Type: map
     */
    share: function(info){
    },
    /**
     * !#en
     * set listener
     * !#zh
     * 设置分享系统的监听
     * @method setListener
     * @param {Function} listener
     * @param {Object} target
     */
    setListener: function(listener, target) {
    },

    /**
     * !#en
     * get listener
     * !#zh
     * 获取分享系统的监听
     * @method getListener
     * @return {Function} listener
     */
    getListener: function() {
        return Function;
    },
});


/**
 * !#en
 * ads protocol
 * !#zh
 * 广告系统协议接口
 * @class ProtocolAds
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolAds = PluginProtocol.extend({
    /*
     * !#en
     * show ads view
     * !#zh
     * 显示广告
     * @param {anysdk.AdsType} adstype
     * @param {Number} idx
     */
    showAds: function(adstype, idx){
    },

    /**
     * !#en
     * hide ads view
     * !#zh
     * 隐藏广告
     * @method hideAds
     * @param {anysdk.AdsType} adstype
     * @param {Number} idx
     */
    hideAds: function (adstype, idx){
    },

    /**
     * !#en
     * preload ads view
     * !#zh
     * 预加载广告
     * @method preloadAds
     * @param {anysdk.AdsType} adstype
     * @param {Number} idx
     */
    preloadAds: function(adstype, idx){
    },

    /**
     * !#en
     * query points
     * !#zh
     * 查询分数
     * @method queryPoints
     * @return {Number}
     */
    queryPoints : function (){
        return 0;
    },

    /**
     * !#en
     * get whether the ads type is supported
     * !#zh
     * 获取广告类型是否支持
     * @method isAdTypeSupported
     * @param {anysdk.AdsType} arg0
     * @return {boolean}
     */
    isAdTypeSupported: function (adstype){
        return false;
    },

    /**
     * !#en
     * spend point
     * !#zh
     * 消费分数
     * @method spendPoints
     * @param {Number} points
     */
    spendPoints: function(points){
    },

    /**
     * !#en
     * set listener
     * !#zh
     * 设置广告系统的监听
     * @method setListener
     * @param {Function} listener
     * @param {Object} target
     */
    setListener: function(listener, target) {
    },

    /**
     * !#en
     * get listener
     * !#zh
     * 获取广告系统的监听
     * @method getListener
     * @return {Function} listener
     */
    getListener: function() {
        return Function;
    },

});

/**
 * !#en
 * social protocol
 * !#zh
 * 社交系统协议接口
 * @class ProtocolSocial
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolSocial = PluginProtocol.extend({

    /**
     * !#en
     * sign in
     * !#zh
     * 登录
     * @method signIn
     */
    signIn: function(){
    },

    /**
     * !#en
     *  sign out
     * !#zh
     * 登出
     * @method signOut
     */
    signOut: function(){
    },

    /**
     * !#en
     * submit score
     * !#zh
     * 提交分数
     * @method submitScore
     * @param {String} leadboardID
     * @param {Number} score Type: long
     */
    submitScore: function(leadboardID, score){
    },

    /**
     * !#en
     * show the id of Leaderboard page
     * !#zh
     * 根据唯一标识符显示排行榜
     * @method showLeaderboard
     * @param {String} leaderboardID
     */
    showLeaderboard: function(leaderboardID){
    },

    /**
     * !#en
     * show the page of achievements
     * !#zh
     * 显示成就榜
     * @method showAchievements
     */
    showAchievements: function(){
    },

    /**
     * !#en
     * unlock achievement
     * !#zh
     * 解锁成就
     * @method share
     * @param {Object} info Type: map
     */
    unlockAchievement: function (info){
    },

    /**
     * !#en
     * set listener
     * !#zh
     * 设置社交系统的监听
     * @method setListener
     * @param {Function} listener
     * @param {Object} target
     */
    setListener: function(listener, target) {
    },

    /**
     * !#en
     * get listener
     * !#zh
     * 获取社交系统的监听
     * @method getListener
     * @return {Function} listener
     */
    getListener: function() {
        return Function;
    },


    /**
     * !#en
     * get friends info
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 获取好友信息，调用前需要判断属性是否存在
     * @method pauseRecording
     */
    getFriendsInfo: function(){
    },

    /**
     * !#en
     * interact
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 订阅，调用前需要判断属性是否存在
     * @method interact
     */
    interact: function(){
    },

    /**
     * !#en
     * subscribe
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 关注，调用前需要判断属性是否存在
     * @method subscribe
     */
    subscribe: function(){
    },
});

/**
 * !#en
 * push protocol
 * !#zh
 * 推送系统协议接口
 * @class ProtocolPush
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolPush = PluginProtocol.extend({

    /**
     * !#en
     * start Push services
     * !#zh
     * 启动推送服务
     * @method startPush
     */
    startPush: function(){
    },

    /**
     * !#en
     * close Push services
     * !#zh
     * 暂停推送服务
     * @method closePush
     */
    closePush: function(){
    },

    /**
     * !#en
     * delete alias
     * !#zh
     * 删除别名
     * @method delAlias
     * @param {String} alias
     */
    delAlias: function(alias){
    },

    /**
     * !#en
     * set alias
     * !#zh
     * 设置别名
     * @method setAlias
     * @param {String} alias
     */
    setAlias: function(alias){
    },

    /**
     * !#en
     * delete tags
     * !#zh
     * 删除标签
     * @method delTags
     * @param {Object} tags  Type: list
     */
    delTags: function(tags){
    },

    /**
     * !#en
     * set tags
     * !#zh
     * 设置标签
     * @method setTags
     * @param {Object} tags  Type: list
     */
    setTags: function(tags){
    },

    /**
     * !#en
     * set listener
     * !#zh
     * 设置推送系统的监听
     * @method setListener
     * @param {Function} listener
     * @param {Object} target
     */
    setListener: function(listener, target) {
    },

    /**
     * !#en
     * get listener
     * !#zh
     * 获取推送系统的监听
     * @method getListener
     * @return {Function} listener
     */
    getListener: function() {
        return Function;
    },

});

/**
 * !#en
 * crash protocol
 * !#zh
 * 崩溃分析系统协议接口
 * @class ProtocolCrash
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolCrash = PluginProtocol.extend({

    /**
     * !#en
     * set user identifier
     * !#zh
     * 统计用户唯一标识符
     * @method setUserIdentifier
     * @param {String} identifier
     */
    setUserIdentifier: function(identifier)
    {
    },

    /**
     * !#en
     * The uploader captured in exception information
     * !#zh
     * 上报异常信息
     * @method reportException
     * @param {String} message
     * @param {String} exception
     */
    reportException: function(message, exception){
    },

    /**
     * !#en
     * customize logging
     * !#zh
     * 自定义日志记录
     * @method leaveBreadcrumb
     * @param {String} breadcrumb
     */
    leaveBreadcrumb : function (breadcrumb)
    {
    },

});

/**
 * !#en
 * REC protocol
 * !#zh
 * 录屏系统协议接口
 * @class ProtocolREC
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolREC = PluginProtocol.extend({

    /**
     * !#en
     * share video
     * !#zh
     * 分享视频
     * @method share
     * @param {Object} info Type: map
     */
    share: function (info){
    },

    /**
     * !#en
     * Start to record video
     * !#zh
     * 开始录制视频
     * @method startRecording
     */
    startRecording: function(){
    },

    /**
     * !#en
     * Start to record video
     * !#zh
     * 结束录制视频
     * @method stopRecording
     */
    stopRecording: function(){
    },

    /**
     * !#en
     * set listener
     * !#zh
     * 设置录屏系统的监听
     * @method setListener
     * @param {Function} listener
     * @param {Object} target
     */
    setListener: function(listener, target) {
    },

    /**
     * !#en
     * get listener
     * !#zh
     * 获取录屏系统的监听
     * @method getListener
     * @return {Function} listener
     */
    getListener: function() {
        return Function;
    },

    /**
     * !#en
     * pause to record video
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 暂停录制视频，调用前需要判断属性是否存在
     * @method pauseRecording
     */
    pauseRecording: function(){
    },

    /**
     * !#en
     * resume to record video
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 恢复录制视频，调用前需要判断属性是否存在
     * @method resumeRecording
     */
    resumeRecording: function(){
    },

    /**
     * !#en
     * get whether the device is isAvailable
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 获取设备是否可用，调用前需要判断属性是否存在
     * @method isAvailable
     * @return {boolean}
     */
    isAvailable: function(){
        return boolean;
    },

    /**
     * !#en
     * get status of recording
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 获取录制状态，调用前需要判断属性是否存在
     * @method isRecording
     * @return {boolean}
     */
    isRecording: function(){
        return boolean;
    },

    /**
     * !#en
     * show toolbar
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 显示悬浮窗，调用前需要判断属性是否存在
     * @method showToolBar
     */
    showToolBar: function(){
    },

    /**
     * !#en
     * hide toolbar
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 隐藏悬浮窗，调用前需要判断属性是否存在
     * @method hideToolBar
     */
    hideToolBar: function(){
    },

    /**
     * !#en
     * show video center
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 显示视频中心，调用前需要判断属性是否存在
     * @method showVideoCenter
     */
    showVideoCenter: function(){
    },

    /**
     * !#en
     * enter platform
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 显示平台中心，调用前需要判断属性是否存在
     * @method enterPlatform
     */
    enterPlatform: function(){
    },

    /**
     * !#en
     * Set the video data, it is recommended to check whether are recorded firstly
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 设置视频相关数据，建议先检查是否是正在录制，调用前需要判断属性是否存在
     * @method setMetaData
     * @param {Object} info Type: map
     */
    setMetaData: function(info){
    },

});



/**
 * !#en
 * ad tracking protocol
 * !#zh
 * 广告追踪系统协议接口
 * @class ProtocolAdTracking
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolAdTracking = PluginProtocol.extend({

    /**
     * !#en
     * Call this method if you want to track register events as happening during a section.
     * !#zh
     * 统计用户注册信息
     * @method onPay
     * @param {Object} productInfo Type: map
     */
    onPay : function (productInfo){
    },

    /**
     * !#en
     * Call this method if you want to track register events as happening during a section.
     * !#zh
     * 统计用户注册信息
     * @method onLogin
     * @param {Object} userInfo Type: map
     */
    onLogin: function(userInfo){
    },

    /**
     * !#en
     * Call this method if you want to track register events as happening during a section.
     * !#zh
     * 统计用户注册信息
     * @method onRegister
     * @param {String} userId
     */
    onRegister: function(userId){
    },

    /**
     * !#en
     * Call this method if you want to track custom events with parameters as happening during a section.
     * !#zh
     * 统计自定义事件
     * @method trackEvent
     * @param {String} eventId
     * @param {Object} paramMap Type: map
     */
    trackEvent: function(eventId, paramMap){
    },

    /**
     * !#en
     * Call this method with parameters if you want to create role as happening during a section.
     * !#zh
     * 统计创建角色事件，调用前需要判断属性是否存在
     * @method onCreateRole
     * @param {Object} userInfo Type: map
     */
    onCreateRole: function(userInfo){
    },

    /**
     * !#en
     * Call this method if you want to track levelup events with parameters as happening during a section.
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 统计角色升级事件，调用前需要判断属性是否存在
     * @method onLevelUp
     * @param {Object} info Type: map
     */
    onLevelUp: function(info){
    },

    /**
     * !#en
     * Invoke this method with parameters if you want to start to pay as happening during a section.
     * Before to invoke, you need to verdict whether this properties existed
     * !#zh
     * 统计开始充值事件，调用前需要判断属性是否存在
     * @method onStartToPay
     * @param {Object} info Type: map
     */
    onStartToPay: function(info){
    },

});

/**
 * !#en
 * custom protocol
 * !#zh
 * 自定义系统协议接口
 * @class ProtocolCustom
 * @hide
 * @extends PluginProtocol
 */
anysdk.ProtocolCustom = PluginProtocol.extend({
    /**
     * !#en
     * set listener
     * !#zh
     * 设置自定义系统的监听
     * @method setListener
     * @param {Function} listener
     * @param {Object} target
     */
    setListener: function(listener, target) {
    },

    /**
     * !#en
     * get listener
     * !#zh
     * 获取自定义系统的监听
     * @method getListener
     * @return {Function} listener
     */
    getListener: function() {
        return Function;
    },
});

/**
 * !#en
 * Data structure class
 * !#zh
 * 数据结构类
 *
 * @class PluginParam
 * @hide
 */
anysdk.PluginParam = {
    /**
     * !#en
     * create plugin parameters
     * !#zh
     * 创建对象
     * @method create
     * @static
     * @param {Number|String|Object} parameters
     * @return {anysdk.PluginParam}
     */
    create: function(parameters) {
        return anysdk.PluginParam
    },
};

/**
 * !#en The callback of user system
 * !#zh 用户系统回调
 * @enum UserActionResultCode
 */
anysdk.UserActionResultCode = {
    /**
     * !#en The callback of succeeding in initing sdk
     * !#zh 用户系统的初始化成功回调
     * @property {Number} kInitSuccess
     */
    kInitSuccess: 0,

    /**
     * !#en The callback of failing to init sdk
     * !#zh 用户系统的初始化失败回调
     * @property {Number} kInitFail
     */
    kInitFail: 1,

    /**
     * !#en The callback of succeeding in login.
     * !#zh 用户系统的登录成功回调
     * @property {Number} kLoginSuccess
     */
    kLoginSuccess: 2,

    /**
     * !#en The callback of network error
     * !#zh 用户系统的初始化成功回调
     * @property {Number} kLoginNetworkError
     */
    kLoginNetworkError: 3,

    /**
     * !#en The callback of no need login.
     * !#zh 用户系统的无需登录回调
     * @property {Number} kLoginNoNeed
     */
    kLoginNoNeed: 4,

    /**
     * !#en The callback of failing to login
     * !#zh 用户系统的登录失败回调
     * @property {Number} kLoginFail
     */
    kLoginFail: 5,

    /**
     * !#en The callback of  canceling to login.
     * !#zh 用户系统的登录取消回调
     * @property {Number} kLoginCancel
     */
    kLoginCancel: 6,

    /**
     * !#en The callback of succeeding in logout
     * !#zh 用户系统的登出成功回调
     * @property {Number} kLogoutSuccess
     */
    kLogoutSuccess: 7,

    /**
     * !#en The callback of failing to logout
     * !#zh 用户系统的登出失败回调
     * @property {Number} kLogoutFail
     */
    kLogoutFail: 8,

    /**
     * !#en The callback after enter platform..
     * !#zh 用户系统的进入平台回调
     * @property {Number} kPlatformEnter
     */
    kPlatformEnter: 9,

    /**
     * !#en The callback after exit antiAddiction
     * !#zh 用户系统的退出平台回调
     * @property {Number} kPlatformBack
     */
    kPlatformBack: 10,

    /**
     * !#en The callback after exit pause page
     * !#zh 用户系统的暂停界面回调
     * @property {Number} kPausePage
     */
    kPausePage: 11,

    /**
     * !#en The callback after exit page
     * !#zh 用户系统的退出界面回调
     * @property {Number} kExitPage
     */
    kExitPage: 12,

    /**
     * !#en The callback after querying antiAddiction
     * !#zh 用户系统的实名认证回调
     * @property {Number} kAntiAddictionQuery
     */
    kAntiAddictionQuery: 13,

    /**
     * !#en The callback after registering realname
     * !#zh 用户系统的注册账号回调
     * @property {Number} kRealNameRegister
     */
    kRealNameRegister: 14,

    /**
     * !#en The callback of succeeding in switching account
     * !#zh 用户系统的切换账号成功回调
     * @property {Number} kAccountSwitchSuccess
     */
    kAccountSwitchSuccess: 15,

    /**
     * !#en The callback of failing to switch account
     * !#zh 用户系统的切换账号失败回调
     * @property {Number} kAccountSwitchFail
     */
    kAccountSwitchFail: 16,

    /**
     * !#en The callback of opening the shop
     * !#zh 用户系统的打开商店回调
     * @property {Number} kOpenShop
     */
    kOpenShop: 17,

    /**
     * !#en The callback of canceling to switch account.
     * !#zh 用户系统的取消切换账号回调
     * @property {Number} kAccountSwitchCancel
     */
    kAccountSwitchCancel: 18,

    /**
     * !#en extension code of user type
     * !#zh 用户系统的扩展回调
     * @property {Number} kUserExtension
     */
    kUserExtension: 50000,

    /**
     * !#en The callback of succeeding in sending to desktop
     * !#zh  用户系统的发送到桌面成功回调
     * @property {Number} kSendToDesktopSuccess
     */
    kSendToDesktopSuccess: 51001,
    /**
     * !#en The callback of failing to sending to desktop
     * !#zh 用户系统的发送到桌面失败回调
     * @property {Number} kSendToDesktopFail
     */
    kSendToDesktopFail: 51002,

    /**
     * !#en The callback of succeeding in getting available login type
     * !#zh 用户系统的获取可登录类型成功回调
     * @property {Number} kGetAvailableLoginTypeSuccess
     */
    kGetAvailableLoginTypeSuccess: 51003,

    /**
     * !#en The callback of failing to get available login type
     * !#zh 用户系统的获取可登录类型失败回调
     * @property {Number} kGetAvailableLoginTypeFail
     */
    kGetAvailableLoginTypeFail: 51004 ,

    /**
     * !#en The callback of succeeding in getting user info
     * !#zh 用户系统的获取用户信息成功回调
     * @property {Number} kGetUserInfoSuccess
     */
    kGetUserInfoSuccess: 51005,

    /**
     * !#en The callback  of failing in getting user`s info
     * !#zh 用户系统的获取用户信息失败回调
     * @property {Number} kGetUserInfoFail
     */
    kGetUserInfoFail: 51006 ,

    /**
     * !#en The callback of succeeding in opening BBS.
     * !#zh 用户系统的进入论坛成功回调
     * @property {Number} kOpenBBSSuccess
     */
    kOpenBBSSuccess: 51007,

    /**
     * !#en The callback  of failing in opening BBS
     * !#zh 用户系统的进入论坛失败回调
     * @property {Number} kOpenBBSFail
     */
    kOpenBBSFail: 51008

};

/**
 * !#en The toolbar position of user type
 * !#zh 用户系统悬浮窗位置
 * @enum ToolBarPlace
 */
anysdk.ToolBarPlace = {
    /**
     * !#en The upper left corner
     * !#zh 左上方
     * @property {Number} kToolBarTopLeft
     */
    kToolBarTopLeft: 1,

    /**
     * !#en the upper right corner
     * !#zh 右上方
     * @property {Number} kToolBarTopRight
     */
    kToolBarTopRight: 2,

    /**
     * !#en at the left of the center
     * !#zh 中间偏左
     * @property {Number} kToolBarMidLeft
     */
    kToolBarMidLeft: 3,

    /**
     * !#en At the right of the center
     * !#zh 中间偏右
     * @property {Number} kToolBarMidRight
     */
    kToolBarMidRight: 4,

    /**
     * !#en The lower left corner
     * !#zh 左下方
     * @property {Number} kToolBarBottomLeft
     */
    kToolBarBottomLeft: 5,

    /**
     * !#en The lower right corner
     * !#zh 右下方
     * @property {Number} kToolBarBottomRight
     */
    kToolBarBottomRight: 6
};

/**
 * !#en The callback of IAP type
 * !#zh 支付系统回调
 * @enum PayResultCode
 */
anysdk.PayResultCode = {
    /**
     * !#en The callback of succeeding in paying
     * !#zh 支付系统的支付成功回调
     * @property {Number} kPaySuccess
     */
    kPaySuccess: 0,

    /**
     * !#en The callback of failing to pay
     * !#zh 支付系统的支付失败回调
     * @property {Number} kPayFail
     */
    kPayFail: 1,

    /**
     * !#en The callback of canceling to pay
     * !#zh 支付系统的支付取消回调
     * @property {Number} kPayCancel
     */
    kPayCancel: 2,

    /**
     * !#en The callback of network error
     * !#zh 支付系统的网络失败回调
     * @property {Number} kPayNetworkError
     */
    kPayNetworkError: 3,

    /**
     * !#en The callback of incompleting info
     * !#zh 支付系统的支付信息不完整回调
     * @property {Number} kPayProductionInforIncomplete
     */
    kPayProductionInforIncomplete: 4,

    /**
     * !#en callback of succeeding in initing sdk .
     * !#zh 支付系统的初始化成功回调
     * @property {Number} kPayInitSuccess
     */
    kPayInitSuccess: 5,

    /**
     * !#en The callback of failing to init sdk
     * !#zh 支付系统的初始化失败回调
     * @property {Number} kPayInitFail
     */
    kPayInitFail: 6,

    /**
     * !#en The callback of paying now
     * !#zh 支付系统的正在支付回调
     * @property {Number} kPayNowPaying
     */
    kPayNowPaying: 7,

    /**
     * !#en The callback of  succeeding in reStringging
     * !#zh 支付系统的充值成功回调
     * @property {Number} kPayReStringgeSuccess
     */
    kPayReStringgeSuccess: 8,

    /**
     * !#en extension code of user type
     * !#zh 支付系统的扩展回调
     * @property {Number} kPayExtension
     */
    kPayExtension: 30000,

    /**
     * !#en The callback of  re-logining .
     * !#zh 支付系统的重登陆回调
     * @property {Number} kPayNeedLoginAgain
     */
    kPayNeedLoginAgain: 31002
};

/**
 * !#en The callback of requesting reStringge
 * !#zh 支付系统支付请求回调
 * @enum PayResultCode
 */
anysdk.RequestResultCode = {
    /**
     * !#en The callback of succeeding in requesting .
     * !#zh 支付系统的请求成功回调
     * @property {Number} kRequestSuccess
     */
    kRequestSuccess: 31000,

    /**
     * !#en The callback of failing to requesting .
     * !#zh 支付系统的请求失败回调
     * @property {Number} kRequestFail
     */
    kRequestFail: 31001
};

/**
 * !#en The enum of account type
 * !#zh 统计系统的账号类型
 * @enum AccountType
 */
anysdk.AccountType = {
    /**
     * !#en The source of account is anonymous
     * !#zh 账号来源:匿名
     * @property {Number} ANONYMOUS
     */
    ANONYMOUS: 0,

    /**
     * !#en The source of account is Registered
     * !#zh 账号来源:注册
     * @property {Number} REGISTED
     */
    REGISTED: 1,

    /**
     * !#en The source of account is Sina weibo
     * !#zh 账号来源:新浪微博
     * @property {Number} SINA_WEIBO
     */
    SINA_WEIBO: 2,

    /**
     * !#en The source of account is Tencent weibo
     * !#zh 账号来源:腾讯微博
     * @property {Number} TENCENT_WEIBO
     */
    TENCENT_WEIBO: 3,

    /**
     * !#en The source of account is QQ
     * !#zh 账号来源:QQ
     * @property {Number} QQ
     */
    QQ: 4,

    /**
     * !#en The source of account is ND91
     * !#zh 账号来源:ND91
     * @property {Number} ND91
     */
    ND91: 5
};

/**
 * !#en The enum of account operation
 * !#zh 统计系统的账号操作
 * @enum AccountOperate
 */
anysdk.AccountOperate = {
    /**
     * !#en Login
     * !#zh 登录
     * @property {Number} LOGIN
     */
    LOGIN: 0,

    /**
     * !#en Logout
     * !#zh 登出
     * @property {Number} LOGOUT
     */
    LOGOUT: 1,

    /**
     * !#en Register
     * !#zh 注册
     * @property {Number} REGISTER
     */
    REGISTER: 2
};

/**
 * !#en The enum of gender
 * !#zh 统计系统的账号性别
 * @enum AccountGender
 */
anysdk.AccountGender = {
    /**
     * !#en Male
     * !#zh 男性
     * @property {Number} MALE
     */
    MALE: 0,
    /**
     * !#en Female
     * !#zh 女性
     * @property {Number} FEMALE
     */
    FEMALE: 1,

    /**
     * !#en Unknow
     * !#zh 未知
     * @property {Number} UNKNOWN
     */
    UNKNOWN: 2
};

/**
 * !#en The enum of task type
 * !#zh 统计系统的任务类型
 * @enum TaskType
 */
anysdk.TaskType = {
    /**
     * !#en Guide line
     * !#zh 新手引导
     * @property {Number} GUIDE_LINE
     */
    GUIDE_LINE: 0,

    /**
     * !#en Main line
     * !#zh 主线
     * @property {Number} MAIN_LINE
     */
    MAIN_LINE: 1,

    /**
     * !#en Branch line
     * !#zh 支线
     * @property {Number} BRANCH_LINE
     */
    BRANCH_LINE: 2,

    /**
     * !#en Daily
     * !#zh 日常
     * @property {Number} DAILY
     */
    DAILY: 3,

    /**
     * !#en Activity
     * !#zh 活动
     * @property {Number} ACTIVITY
     */
    ACTIVITY: 4,

    /**
     * !#en Other
     * !#zh 其他
     * @property {Number} OTHER
     */
    OTHER: 5
};

/**
 * !#en The callback of share system
 * !#zh 分享系统回调
 * @enum ShareResultCode
 */
anysdk.ShareResultCode = {
    /**
     * !#en The callback of failing to sharing
     * !#zh 分享系统的分享成功回调
     * @property {Number} kShareSuccess
     */
    kShareSuccess: 0,

    /**
     * !#en The callback of failing to share
     * !#zh 分享系统的分享失败回调
     * @property {Number} kShareFail
     */
    kShareFail: 1,

    /**
     * !#en The callback of canceling to share
     * !#zh 分享系统的分享取消回调
     * @property {Number} kShareCancel
     */
    kShareCancel: 2,

    /**
     * !#en The callback of network error
     * !#zh 分享系统的网络错误回调
     * @property {Number} kShareNetworkError
     */
    kShareNetworkError: 3,

    /**
     * !#en The extension code of share system
     * !#zh 分享系统的扩展回调
     * @property {Number} kShareExtension
     */
    kShareExtension: 10000
};

/**
 * !#en The callback of social system
 * !#zh 社交系统回调
 * @enum SocialRetCode
 */
anysdk.SocialRetCode = {

    /**
     * !#en The callback of succeeding in submiting.
     * !#zh 社交系统的成功提交回调
     * @property {Number} kScoreSubmitSucceed
     */
    kScoreSubmitSucceed: 1,

    /**
     * !#en The callback of failing to submit.
     * !#zh 社交系统的提交失败回调
     * @property {Number} kScoreSubmitfail
     */
    kScoreSubmitfail: 2,

    /**
     * !#en The is callback of succeeding in  unlocking
     * !#zh 社交系统的解锁成功回调
     * @property {Number} kAchUnlockSucceed
     */
    kAchUnlockSucceed: 3,

    /**
     * !#en The callback of failing to  unlock.
     * !#zh 社交系统的解锁失败回调
     * @property {Number} kAchUnlockFail
     */
    kAchUnlockFail: 4,

    /**
     * !#en The callback of succeeding to login.
     * !#zh 社交系统的登录成功回调
     * @property {Number} kSocialSignInSucceed
     */
    kSocialSignInSucceed: 5,

    /**
     * !#en The callback of failing to  login
     * !#zh 社交系统的登录失败回调
     * @property {Number} kSocialSignInFail
     */
    kSocialSignInFail: 6,

    /**
     * !#en The callback of succeeding to logout.
     * !#zh 社交系统的登出成功回调
     * @property {Number} kSocialSignOutSucceed
     */
    kSocialSignOutSucceed: 7,

    /**
     * !#en The callback of failing to  logout.
     * !#zh 社交系统的登出失败回调
     * @property {Number} kSocialSignOutFail
     */
    kSocialSignOutFail: 8,

    /**
     * !#en The callback of getting friends`s .
     * !#zh 社交系统的获取好友回调
     * @property {Number} kSocialGetGameFriends
     */
    kSocialGetGameFriends: 9,

    /**
     * !#en The extension code of social system
     * !#zh 社交系统的扩展回调
     * @property {Number} kSocialExtensionCode
     */
    kSocialExtensionCode:20000,

    /**
     * !#en The callback  of succeeding in getting friends`s info
     * !#zh 社交系统的获取好友信息成功回调
     * @property {Number} kSocialGetFriendsInfoSuccess
     */
    kSocialGetFriendsInfoSuccess: 21001,

    /**
     * !#en The callback  of failing in getting friends`s info.
     * !#zh 社交系统的获取好友信息失败回调
     * @property {Number} kSocialGetFriendsInfoFail
     */
    kSocialGetFriendsInfoFail: 21002,

    /**
     * !#en The callback  of subscription
     * !#zh 社交系统的订阅回调
     * @property {Number} kSocialAlreadySubscription
     */
    kSocialAlreadySubscription: 21003,

    /**
     * !#en The callback No subscription.
     * !#zh 社交系统的无需订阅回调
     * @property {Number} kSocialNoSubscription
     */
    kSocialNoSubscription: 21004,

    /**
     * !#en The callback  of failing in subscription
     * !#zh 社交系统的订阅失败回调
     * @property {Number} kSocialSubscriptionFail
     */
    kSocialSubscriptionFail: 21005,
};

/**
 * !#en The callback of ads system
 * !#zh 广告系统回调
 * @enum AdsResultCode
 */
anysdk.AdsResultCode = {

    /**
     * !#en The callback : the ad is received
     * !#zh 广告系统的接受广告回调
     * @property {Number} kAdsReceived
     */
    kAdsReceived: 0,

    /**
     * !#en The callback: the advertisement dismissed.
     * !#zh 广告系统的显示广告回调
     * @property {Number} kAdsShown
     */
    kAdsShown: 1,

    /**
     * !#en The callback: the advertisement dismissed.
     * !#zh 广告系统的广告消失回调
     * @property {Number} kAdsDismissed
     */
    kAdsDismissed: 2,

    /**
     * !#en The callback: the points spend succeed.
     * !#zh 广告系统的花费积分成功回调
     * @property {Number} kPointsSpendSucceed
     */
    kPointsSpendSucceed: 3,

    /**
     * !#en The callback: the points spend failed.
     * !#zh 广告系统的花费积分失败回调
     * @property {Number} kPointsSpendFailed
     */
    kPointsSpendFailed: 4,

    /**
     * !#en The callback of network error
     * !#zh 广告系统的网络错误回调
     * @property {Number} kNetworkError
     */
    kNetworkError: 5,

    /**
     * !#en The callback of Unknown error.
     * !#zh 广告系统的未知错误回调
     * @property {Number} kUnknownError
     */
    kUnknownError: 6,

    /**
     * !#en The callback of Changing the point of offerwall.
     * !#zh 广告系统的积金墙积金变化回调
     * @property {Number} kOfferWallOnPointsChanged
     */
    kOfferWallOnPointsChanged: 7,

    /**
     * !#en The callback of receive the reward of rewardedvideo
     * !#zh 广告系统的激励视频奖励回调
     * @property {Number} kRewardedVideoWithReward
     */
    kRewardedVideoWithReward: 8,

    /**
     * !#en The callback of finishing IAP ad
     * !#zh 广告系统的应用内支付广告回调
     * @property {Number} kInAppPurchaseFinished
     */
    kInAppPurchaseFinished: 9,

    /**
     * !#en The callback of the advertisement clicked
     * !#zh 广告系统的广告被点击回调
     * @property {Number} kAdsClicked
     */
    kAdsClicked: 10,

    /**
     * !#en The extension code
     * !#zh 广告系统的扩展回调
     * @property {Number} kAdsExtension
     */
    kAdsExtension: 40000
};

/**
 * !#en The enum of ads position
 * !#zh 广告位置
 * @enum AdsPos
 */
anysdk.AdsPos = {

    /**
     * !#en In the center
     * !#zh 中间
     * @property {Number} kPosCenter
     */
    kPosCenter:0,

    /**
     * !#en at the top of center
     * !#zh 上方
     * @property {Number} kPosTop
     */
    kPosTop:1,

    /**
     * !#en the upper left corner
     * !#zh 左上方
     * @property {Number} kPosTopLeft
     */
    kPosTopLeft:2,

    /**
     * !#en the upper right corner
     * !#zh 右上方
     * @property {Number} kPosTopRight
     */
    kPosTopRight:3,

    /**
     * !#en at the bottom of the center
     * !#zh 底部
     * @property {Number} kPosBottom
     */
    kPosBottom: 4,

    /**
     * !#en the lower left corner
     * !#zh 左下方
     * @property {Number} kPosBottomLeft
     */
    kPosBottomLeft: 5,

    /**
     * !#en the lower right corner
     * !#zh 右下方
     * @property {Number} kPosBottomRight
     */
    kPosBottomRight: 6
};

/**
 * !#en The enum of ads type
 * !#zh 广告类型
 * @enum AdsType
 */
anysdk.AdsType = {

    /**
     * !#en Banner Ads
     * !#zh 横幅广告
     * @property {Number} AD_TYPE_BANNER
     */
    AD_TYPE_BANNER: 0,

    /**
     * !#en Full Screen Ads
     * !#zh 插屏广告
     * @property {Number} AD_TYPE_FULLSCREEN
     */
    AD_TYPE_FULLSCREEN: 1,

    /**
     * !#en Move APP Ads
     * !#zh 精品广告
     * @property {Number} AD_TYPE_MOREAPP
     */
    AD_TYPE_MOREAPP: 2,

    /**
     * !#en Offer Wall Ads
     * !#zh 积金墙
     * @property {Number} AD_TYPE_OFFERWALL
     */
    AD_TYPE_OFFERWALL: 3,

    /**
     * !#en Reward Video Ads
     * !#zh 激励视频
     * @property {Number} AD_TYPE_REWARDEDVIDEO
     */
    AD_TYPE_REWARDEDVIDEO: 4,

    /**
     * !#en Native Express Ads
     * !#zh 原生广告
     * @property {Number} AD_TYPE_NATIVEEXPRESS
     */
    AD_TYPE_NATIVEEXPRESS: 5,

    /**
     * !#en Native Advanced Ads
     * !#zh 改进版原生广告
     * @property {Number} AD_TYPE_NATIVEADVANCED
     */
    AD_TYPE_NATIVEADVANCED: 6
};

/**
 * !#en The callback of push system
 * !#zh 推送系统回调
 * @enum PushActionResultCode
 */
anysdk.PushActionResultCode = {
    /**
     * !#en The callback of Receiving Message
     * !#zh 推送系统的接受消息回调
     * @property {Number} kPushReceiveMessage
     */
    kPushReceiveMessage: 0,

    /**
     * !#en The extension code
     * !#zh 推送系统的扩展回调
     * @property {Number} kPushExtensionCode
     */
    kPushExtensionCode: 60000
};

/**
 * !#en The callback of custom system
 * !#zh 自定义系统回调
 * @enum CustomResultCode
 */
anysdk.CustomResultCode = {
    /**
     * !#en The extension code of custom system
     * !#zh 自定义系统扩展回调
     * @property {Number} kCustomExtension
     */
    kCustomExtension:80000
} ;

/**
 * !#en The callback of REC system
 * !#zh 录屏系统回调
 * @enum RECResultCode
 */
anysdk.RECResultCode = {

    /**
     * !#en The callback of succeeding in initing sdk
     * !#zh 录屏系统的初始化成功回调
     * @property {Number} kRECInitSuccess
     */
    kRECInitSuccess: 0,

    /**
     * !#en The callback of failing to init sdk.
     * !#zh 录屏系统的初始化失败回调
     * @property {Number} kRECInitFail
     */
    kRECInitFail: 1,

    /**
     * !#en The callback of starting to record.
     * !#zh 录屏系统的开始录屏回调
     * @property {Number} kRECStartRecording
     */
    kRECStartRecording: 2,

    /**
     * !#en The callback of stoping to record.
     * !#zh 录屏系统的停止录屏回调
     * @property {Number} kRECStopRecording
     */
    kRECStopRecording: 3,

    /**
     * !#en The callback of pausing to record.
     * !#zh 录屏系统的暂停录屏回调
     * @property {Number} kRECPauseRecording
     */
    kRECPauseRecording: 4,

    /**
     * !#en The callback of resuming to record.
     * !#zh 录屏系统的恢复录屏回调
     * @property {Number} kRECResumeRecording
     */
    kRECResumeRecording: 5,

    /**
     * !#en The callback of entering SDK`s page.
     * !#zh 录屏系统的初进入SDK界面回调
     * @property {Number} kRECEnterSDKPage
     */
    kRECEnterSDKPage: 6,

    /**
     * !#en The callback of quiting SDK`s page.
     * !#zh 录屏系统的退出SDK界面回调
     * @property {Number} kRECQuitSDKPage
     */
    kRECQuitSDKPage: 7,

    /**
     * !#en The callback of succeeding in initing sdk
     * !#zh 录屏系统的分享成功回调
     * @property {Number} kRECShareSuccess
     */
    kRECShareSuccess: 8,

    /**
     * !#en The callback of failing to share.
     * !#zh 录屏系统的分享失败回调
     * @property {Number} kRECShareFail
     */
    kRECShareFail: 9,/**< enum  value is callback of failing to share. */

    /**
     * !#en The extension code of REC system
     * !#zh 录屏系统的扩展回调
     * @property {Number} kRECExtension
     */
    kRECExtension: 90000
};










