//for plugin type
anysdk.PluginType = {
    kPluginAds:16,/**< enum value is  the type of Ads. */
    kPluginAnalytics:1,/**< enum value  is the type of Analytics. */
    kPluginIAP:8,/**< enum value is  the type of IAP. */
    kPluginShare:2,/**< enum value is  the type of Share. */
    kPluginUser:32,/**< enum value is  the type of User. */
    kPluginSocial:4,/**< enum value is  the type of Social. */
    kPluginPush:64,/**< enum value is  the type of Push. */
    kPluginCrash:128,/**< enum value is  the type of Crash. */
    kPluginCustom:256,/**< enum value is  the type of Custom. */
    kPluginREC:512,/**< enum value is  the type of REC. */
    kPluginAdTracking:1024/**< enum value is  the type of AdTracking. */

};	//plugin type

//for Custom
anysdk.CustomResultCode = {
    kCustomExtension:80000 /**< enum value is  extension code . */
} ;

anysdk.RECResultCode = {
	kRECInitSuccess:0,/**< enum value is callback of succeeding in initing sdk . */
	kRECInitFail:1,/**< enum  value is callback of failing to init sdk. */
	kRECStartRecording:2,/**< enum  value is callback of starting to record. */
	kRECStopRecording:3,/**< enum  value is callback of stoping to record. */
	kRECPauseRecording:4,/**< enum  value is callback of pausing to record. */
	kRECResumeRecording:5,/**< enum  value is callback of resuming to record. */
	kRECEnterSDKPage:6,/**< enum  value is callback of failing to init sdk. */
	kRECQuitSDKPage:7,/**< enum  value is callback of entering SDK`s page. */
	kRECShareSuccess:8,/**< enum  value is callback of  quiting SDK`s page. */
	kRECShareFail:9,/**< enum  value is callback of failing to share. */
    kRECExtension:90000 /**< enum value is  extension code . */
} ;

//for ads
anysdk.AdsResultCode = {
    kAdsReceived:0,           	/**< enum the callback: the ad is received is at center. */
    kAdsShown:1,                  /**< enum the callback: the advertisement dismissed. */
    kAdsDismissed:2,             /**< enum the callback: the advertisement dismissed. */
    kPointsSpendSucceed:3,       /**< enum the callback: the points spend succeed. */
    kPointsSpendFailed:4,        /**< enum the callback: the points spend failed. */
    kNetworkError:5,              /**< enum the callback of Network error at center. */
    kUnknownError:6,              /**< enum the callback of Unknown error. */
    kOfferWallOnPointsChanged:7,   /**< enum the callback of Changing the point of offerwall. */
    kRewardedVideoWithReward:8,/**< enum the callback of receive the reward of rewardedvideo. */
    kInAppPurchaseFinished:9,/**< enum the callback of finishing IAP ad. */
    kAdsClicked:10,/**< enum the callback of the advertisement clicked. */
    kAdsExtension :40000 /**< enum value is  extension code . */
};	//ads result code

anysdk.AdsPos = {
    kPosCenter:0,			/**< enum the toolbar is at center. */
    kPosTop:1,				/**< enum the toolbar is at top. */
    kPosTopLeft:2,			/**< enum the toolbar is at topleft. */
    kPosTopRight:3,			/**< enum the toolbar is at topright. */
    kPosBottom:4,				/**< enum the toolbar is at bottom. */
    kPosBottomLeft:5,			/**< enum the toolbar is at bottomleft. */
    kPosBottomRight:6 		/**< enum the toolbar is at bottomright. */
};	//ads pos

anysdk.AdsType = {
	AD_TYPE_BANNER:0,		/**< enum value is banner ads . */
	AD_TYPE_FULLSCREEN:1,	/**< enum value is fullscreen ads . */
	AD_TYPE_MOREAPP:2,		/**< enum value is moreapp ads . */
	AD_TYPE_OFFERWALL:3,	/**< enum value is offerwall ads . */
    AD_TYPE_REWARDEDVIDEO:4,/**< enum value is rewarded video ads . */
    AD_TYPE_NATIVEEXPRESS:5,/**< enum value is Native express  ads . */
    AD_TYPE_NATIVEADVANCED:6/**< enum value is Native advanced  ads . */
};	//ads type

//for pay result code
anysdk.PayResultCode = {
    kPaySuccess:0,		/**< enum value is callback of succeeding in paying . */
    kPayFail:1,			/**< enum value is callback of failing to pay . */
    kPayCancel:2,		/**< enum value is callback of canceling to pay . */
    kPayNetworkError:3,	/**< enum value is callback of network error . */
    kPayProductionInforIncomplete:4,	/**< enum value is callback of incompleting info . */
	kPayInitSuccess:5,	/**< enum value is callback of succeeding in initing sdk . */
	kPayInitFail:6,		/**< enum value is callback of failing to init sdk . */
	kPayNowPaying:7, 	/**< enum value is callback of paying now . */
	kPayRechargeSuccess:8,/**< enum value is callback of  succeeding in recharging. */
	kPayExtension : 30000, /**< enum value is  extension code . */
    kPayNeedLoginAgain : 31002 /**< enum value is  callback of  logining again . */
};

anysdk.RequestResultCode = {
  	kRequestSuccess:31000,   /**<enum value is callback of succeeding in paying . */
    kRequestFail:31001   /**<enum value is callback of failing to pay . */
};

// for push action result code
anysdk.PushActionResultCode = {
	kPushReceiveMessage:0,	/**value is callback of Receiving Message . */
	kPushExtensionCode : 60000 /**< enum value is  extension code . */
};

// for share result code
anysdk.ShareResultCode = {
    kShareSuccess:0,	/**< enum value is callback of failing to sharing . */
    kShareFail:1,		/**< enum value is callback of failing to share . */
    kShareCancel:2,		/**< enum value is callback of canceling to share . */
    kShareNetworkError:3,	/**< enum value is callback of network error . */
    kShareExtension :10000 /**< enum value is  extension code . */
};

//for social ret code
anysdk.SocialRetCode = {
	// code for leaderboard feature
	kScoreSubmitSucceed:1,		/**< enum value is callback of succeeding in submiting. */
    kScoreSubmitfail:2,			/**< enum value is callback of failing to submit . */
    // code for achievement feature
    kAchUnlockSucceed:3,		/**< enum value is callback of succeeding in unlocking. */
    kAchUnlockFail:4,			/**< enum value is callback of failing to  unlock. */
    kSocialSignInSucceed:5,		/**< enum value is callback of succeeding to login. */
    kSocialSignInFail:6,		/**< enum value is callback of failing to  login. */
    kSocialSignOutSucceed:7,	/**< enum value is callback of succeeding to login. */
    kSocialSignOutFail:8,		/**< enum value is callback of failing to  login. */
    kSocialGetGameFriends:9,		/**< enum value is callback of failing to  login. */
    kSocialExtensionCode :20000, /**< enum value is  extension code . */
    kSocialGetFriendsInfoSuccess: 21001, /**< enum value is callback  of succeeding in getting user info.*/
    kSocialGetFriendsInfoFail: 21002, /**< enum value is callback  of failing in getting user info. */
    kSocialAlreadySubscription: 21003, /**< enum value is callback  of subscription . */
    kSocialNoSubscription: 21004, /**< enum value is callback No subscription. */
    kSocialSubscriptionFail: 21005, /**< enum value is callback  of failing in subscription . */
};

// for user action result code
anysdk.UserActionResultCode = {
	kInitSuccess:0,		/**< enum value is callback of succeeding in initing sdk. */
	kInitFail:1,		/**< enum  value is callback of failing to init sdk. */
    kLoginSuccess:2,	/**< enum value is callback of succeeding in login.*/
    kLoginNetworkError:3,	/**< enum value is callback of network error*/
    kLoginNoNeed:4,		/**< enum value is callback of no need login.*/
    kLoginFail:5,		/**< enum value is callback of failing to login. */
    kLoginCancel:6,		/**< enum value is callback of canceling to login. */
    kLogoutSuccess:7,	/**< enum value is callback of succeeding in logout. */
    kLogoutFail:8,		/**< enum value is callback of failing to logout. */
    kPlatformEnter:9,	/**< enum value is callback after enter platform. */
    kPlatformBack:10,	/**< enum value is callback after exit antiAddiction. */
    kPausePage:11,		/**< enum value is callback after exit pause page. */
    kExitPage:12,		/**< enum value is callback after exit exit page. */
    kAntiAddictionQuery:13,	/**< enum value is callback after querying antiAddiction. */
    kRealNameRegister:14,	/**< enum value is callback after registering realname. */
    kAccountSwitchSuccess:15,	/**< enum alue is callback of succeeding in switching account. */
    kAccountSwitchFail:16,	/**< enum value is callback of failing to switch account. */
    kOpenShop:17  ,           /**< enum value is callback of open the shop. */
    kAccountSwitchCancel:18,/**< enum value is callback of canceling to switch account. */
    kGameExitPage:19,       /**< enum value is callback of no channel exit page. */
    kUserExtension: 50000, /**< enum value is  extension code . */
    kSendToDesktopSuccess: 51001, /**< enum value is callback of succeeding in sending to desktop. */
    kSendToDesktopFail: 51002, /**< enum value is callback of failing in sending to desktop. */
    kGetAvailableLoginTypeSuccess: 51003,/**< enum value is callback of succeeding in getting available login type. */
    kGetAvailableLoginTypeFail: 51004 ,/**< enum value is callback  of failing in getting available login type. */
    kGetUserInfoSuccess: 51005, /**< enum value is callback  of succeeding in getting user info.*/
    kGetUserInfoFail: 51006 ,/**< enum value is callback  of failing in getting user info. */
    kOpenBBSSuccess: 51007, /**< enum value is callback of succeeding in opening BBS.*/
    kOpenBBSFail: 51008 /**< enum value is callback  of failing in opening BBS. */

};

//for toolBar place
anysdk.ToolBarPlace = {
    kToolBarTopLeft:1,		/**< enum the toolbar is at topleft. */
    kToolBarTopRight:2,		/**< enum the toolbar is at topright. */
    kToolBarMidLeft:3,		/**< enum the toolbar is at midleft. */
    kToolBarMidRight:4,		/**< enum the toolbar is at midright. */
    kToolBarBottomLeft:5,	/**< enum the toolbar is at bottomleft. */
    kToolBarBottomRight:6	/**< enum the toolbar is at bottomright. */
};


//for analytics
anysdk.AccountType = {
    ANONYMOUS:0,/**< enum value is anonymous typek. */
    REGISTED:1,/**< enum value is registed type. */
    SINA_WEIBO:2,/**< enum value is sineweibo type. */
    TENCENT_WEIBO:3,/**< enum value is tecentweibo type */
    QQ:4,/**< enum value is qq type */
    ND91:5/**< enum value is nd91 type. */
};

anysdk.AccountOperate = {
    LOGIN:0,/**< enum value is the login operate. */
    LOGOUT:1,/**< enum value is the logout operate. */
    REGISTER:2/**< enum value is the register operate. */
};

anysdk.AccountGender = {
    MALE:0,/**< enum value is male. */
    FEMALE:1,/**< enum value is female. */
    UNKNOWN:2/**< enum value is unknow. */
};

anysdk.TaskType = {
    GUIDE_LINE:0,/**< enum value is the guideline type.. */
    MAIN_LINE:1,/**< enum value is the mainline type.. */
    BRANCH_LINE:2,/**<enum value is the branchline type.. */
    DAILY:3,/**< enum value is the daily type.. */
    ACTIVITY:4,/**< enum value is the activity type.  */
    OTHER:5/**< enum value is other type. */
};
//end analytics

//for plugin type
var PluginType = {
    kPluginAds:16,/**< enum value is  the type of Ads. */
    kPluginAnalytics:1,/**< enum value  is the type of Analytics. */
    kPluginIAP:8,/**< enum value is  the type of IAP. */
    kPluginShare:2,/**< enum value is  the type of Share. */
    kPluginUser:32,/**< enum value is  the type of User. */
    kPluginSocial:4,/**< enum value is  the type of Social. */
    kPluginPush:64,/**< enum value is  the type of Push. */
    kPluginCrash:128,/**< enum value is  the type of Crash. */
    kPluginCustom:256,/**< enum value is  the type of Custom. */
    kPluginREC:512,/**< enum value is  the type of REC. */
    kPluginAdTracking:1024/**< enum value is  the type of AdTracking. */
};  //plugin type

//for Custom
var  CustomResultCode = {
    kCustomExtension:80000 /**< enum value is  extension code . */
} ;

var RECResultCode = {
    kRECInitSuccess:0,/**< enum value is callback of succeeding in initing sdk . */
    kRECInitFail:1,/**< enum  value is callback of failing to init sdk. */
    kRECStartRecording:2,/**< enum  value is callback of starting to record. */
    kRECStopRecording:3,/**< enum  value is callback of stoping to record. */
    kRECPauseRecording:4,/**< enum  value is callback of pausing to record. */
    kRECResumeRecording:5,/**< enum  value is callback of resuming to record. */
    kRECEnterSDKPage:6,/**< enum  value is callback of failing to init sdk. */
    kRECQuitSDKPage:7,/**< enum  value is callback of entering SDK`s page. */
    kRECShareSuccess:8,/**< enum  value is callback of  quiting SDK`s page. */
    kRECShareFail:9,/**< enum  value is callback of failing to share. */
    kRECExtension:90000 /**< enum value is  extension code . */
} ;

//for ads
var AdsResultCode = {
    kAdsReceived:0,             /**< enum the callback: the ad is received is at center. */
    kAdsShown:1,                  /**< enum the callback: the advertisement dismissed. */
    kAdsDismissed:2,             /**< enum the callback: the advertisement dismissed. */
    kPointsSpendSucceed:3,       /**< enum the callback: the points spend succeed. */
    kPointsSpendFailed:4,        /**< enum the callback: the points spend failed. */
    kNetworkError:5,              /**< enum the callback of Network error at center. */
    kUnknownError:6,              /**< enum the callback of Unknown error. */
    kOfferWallOnPointsChanged:7,   /**< enum the callback of Changing the point of offerwall. */
    kRewardedVideoWithReward:8,/**< enum the callback of receive the reward of rewardedvideo. */
    kInAppPurchaseFinished:9,/**< enum the callback of finishing IAP ad. */
    kAdsClicked:10,/**< enum the callback of the advertisement clicked. */
    kAdsExtension :40000 /**< enum value is  extension code . */
};  //ads result code

var AdsPos = {
    kPosCenter:0,           /**< enum the toolbar is at center. */
    kPosTop:1,              /**< enum the toolbar is at top. */
    kPosTopLeft:2,          /**< enum the toolbar is at topleft. */
    kPosTopRight:3,         /**< enum the toolbar is at topright. */
    kPosBottom:4,               /**< enum the toolbar is at bottom. */
    kPosBottomLeft:5,           /**< enum the toolbar is at bottomleft. */
    kPosBottomRight:6       /**< enum the toolbar is at bottomright. */
};  //ads pos

var AdsType = {
    AD_TYPE_BANNER:0,       /**< enum value is banner ads . */
    AD_TYPE_FULLSCREEN:1,   /**< enum value is fullscreen ads . */
    AD_TYPE_MOREAPP:2,      /**< enum value is moreapp ads . */
    AD_TYPE_OFFERWALL:3, /**< enum value is offerwall ads . */
    AD_TYPE_REWARDEDVIDEO:4,/**< enum value is rewarded video ads . */
    AD_TYPE_NATIVEEXPRESS:5,/**< enum value is Native express  ads . */
    AD_TYPE_NATIVEADVANCED:6/**< enum value is Native advanced  ads . */
};  //ads type

//for pay result code
var PayResultCode = {
    kPaySuccess:0,      /**< enum value is callback of succeeding in paying . */
    kPayFail:1,         /**< enum value is callback of failing to pay . */
    kPayCancel:2,       /**< enum value is callback of canceling to pay . */
    kPayNetworkError:3, /**< enum value is callback of network error . */
    kPayProductionInforIncomplete:4,    /**< enum value is callback of incompleting info . */
    kPayInitSuccess:5,  /**< enum value is callback of succeeding in initing sdk . */
    kPayInitFail:6,     /**< enum value is callback of failing to init sdk . */
    kPayNowPaying:7,    /**< enum value is callback of paying now . */
    kPayRechargeSuccess:8,/**< enum value is callback of  succeeding in recharging. */
    kPayExtension : 30000, /**< enum value is  extension code . */
    kPayNeedLoginAgain : 31002 /**< enum value is  callback of  logining again . */
};

var RequestResultCode = {
    kRequestSuccess:31000,   /**<enum value is callback of succeeding in paying . */
    kRequestFail:31001   /**<enum value is callback of failing to pay . */
};

// for push action result code
var PushActionResultCode = {
    kPushReceiveMessage:0,  /**value is callback of Receiving Message . */
    kPushExtensionCode : 60000 /**< enum value is  extension code . */
};

// for share result code
var ShareResultCode = {
    kShareSuccess:0,    /**< enum value is callback of failing to sharing . */
    kShareFail:1,       /**< enum value is callback of failing to share . */
    kShareCancel:2,     /**< enum value is callback of canceling to share . */
    kShareNetworkError:3,   /**< enum value is callback of network error . */
    kShareExtension :10000 /**< enum value is  extension code . */
};

//for social ret code
var SocialRetCode = {
    // code for leaderboard feature
    kScoreSubmitSucceed:1,      /**< enum value is callback of succeeding in submiting. */
    kScoreSubmitfail:2,         /**< enum value is callback of failing to submit . */
    // code for achievement feature
    kAchUnlockSucceed:3,        /**< enum value is callback of succeeding in unlocking. */
    kAchUnlockFail:4,           /**< enum value is callback of failing to  unlock. */
    kSocialSignInSucceed:5,     /**< enum value is callback of succeeding to login. */
    kSocialSignInFail:6,        /**< enum value is callback of failing to  login. */
    kSocialSignOutSucceed:7,    /**< enum value is callback of succeeding to login. */
    kSocialSignOutFail:8,       /**< enum value is callback of failing to  login. */
    kSocialGetGameFriends:9,        /**< enum value is callback of failing to  login. */
    kSocialExtensionCode :20000, /**< enum value is  extension code . */
    kSocialGetFriendsInfoSuccess: 21001, /**< enum value is callback  of succeeding in getting user info.*/
    kSocialGetFriendsInfoFail: 21002, /**< enum value is callback  of failing in getting user info. */
    kSocialAlreadySubscription: 21003, /**< enum value is callback  of subscription . */
    kSocialNoSubscription: 21004, /**< enum value is callback No subscription. */
    kSocialSubscriptionFail: 21005, /**< enum value is callback  of failing in subscription . */
};

// for user action result code
var UserActionResultCode = {
    kInitSuccess:0,     /**< enum value is callback of succeeding in initing sdk. */
    kInitFail:1,        /**< enum  value is callback of failing to init sdk. */
    kLoginSuccess:2,    /**< enum value is callback of succeeding in login.*/
    kLoginNetworkError:3,   /**< enum value is callback of network error*/
    kLoginNoNeed:4,     /**< enum value is callback of no need login.*/
    kLoginFail:5,       /**< enum value is callback of failing to login. */
    kLoginCancel:6,     /**< enum value is callback of canceling to login. */
    kLogoutSuccess:7,   /**< enum value is callback of succeeding in logout. */
    kLogoutFail:8,      /**< enum value is callback of failing to logout. */
    kPlatformEnter:9,   /**< enum value is callback after enter platform. */
    kPlatformBack:10,   /**< enum value is callback after exit antiAddiction. */
    kPausePage:11,      /**< enum value is callback after exit pause page. */
    kExitPage:12,       /**< enum value is callback after exit exit page. */
    kAntiAddictionQuery:13, /**< enum value is callback after querying antiAddiction. */
    kRealNameRegister:14,   /**< enum value is callback after registering realname. */
    kAccountSwitchSuccess:15,   /**< enum alue is callback of succeeding in switching account. */
    kAccountSwitchFail:16,  /**< enum value is callback of failing to switch account. */
    kOpenShop:17  ,           /**< enum value is callback of open the shop. */
    kAccountSwitchCancel:18,/**< enum value is callback of canceling to switch account. */
    kGameExitPage:19,       /**< enum value is callback of no channel exit page. */
    kUserExtension: 50000, /**< enum value is  extension code . */
    kSendToDesktopSuccess: 51001, /**< enum value is callback of succeeding in sending to desktop. */
    kSendToDesktopFail: 51002, /**< enum value is callback of failing in sending to desktop. */
    kGetAvailableLoginTypeSuccess: 51003,/**< enum value is callback of succeeding in getting available login type. */
    kGetAvailableLoginTypeFail: 51004 ,/**< enum value is callback  of failing in getting available login type. */
    kGetUserInfoSuccess: 51005, /**< enum value is callback  of succeeding in getting user info.*/
    kGetUserInfoFail: 51006 ,/**< enum value is callback  of failing in getting user info. */
    kOpenBBSSuccess: 51007, /**< enum value is callback of succeeding in opening BBS.*/
    kOpenBBSFail: 51008 /**< enum value is callback  of failing in opening BBS. */
};

//for toolBar place
var ToolBarPlace = {
    kToolBarTopLeft:1,      /**< enum the toolbar is at topleft. */
    kToolBarTopRight:2,     /**< enum the toolbar is at topright. */
    kToolBarMidLeft:3,      /**< enum the toolbar is at midleft. */
    kToolBarMidRight:4,     /**< enum the toolbar is at midright. */
    kToolBarBottomLeft:5,   /**< enum the toolbar is at bottomleft. */
    kToolBarBottomRight:6   /**< enum the toolbar is at bottomright. */
};


//for analytics
var AccountType = {
    ANONYMOUS:0,/**< enum value is anonymous typek. */
    REGISTED:1,/**< enum value is registed type. */
    SINA_WEIBO:2,/**< enum value is sineweibo type. */
    TENCENT_WEIBO:3,/**< enum value is tecentweibo type */
    QQ:4,/**< enum value is qq type */
    ND91:5/**< enum value is nd91 type. */
};

var AccountOperate = {
    LOGIN:0,/**< enum value is the login operate. */
    LOGOUT:1,/**< enum value is the logout operate. */
    REGISTER:2/**< enum value is the register operate. */
};

var AccountGender = {
    MALE:0,/**< enum value is male. */
    FEMALE:1,/**< enum value is female. */
    UNKNOWN:2/**< enum value is unknow. */
};

var TaskType = {
    GUIDE_LINE:0,/**< enum value is the guideline type.. */
    MAIN_LINE:1,/**< enum value is the mainline type.. */
    BRANCH_LINE:2,/**<enum value is the branchline type.. */
    DAILY:3,/**< enum value is the daily type.. */
    ACTIVITY:4,/**< enum value is the activity type.  */
    OTHER:5/**< enum value is other type. */
};
//end analytics
