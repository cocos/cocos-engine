(function(){

var sys = cc.sys;
var platform = sys.platform;

// Only android and iOS support cocos analytics
if (platform === sys.ANDROID) {

    cocosAnalytics = {};

    var cls_CAAccount = "com/cocos/analytics/CAAccount";
    var cls_CAAgent = "com/cocos/analytics/CAAgent";
    var cls_CAEvent = "com/cocos/analytics/CAEvent";
    var cls_CAItem = "com/cocos/analytics/CAItem";
    var cls_CALevels = "com/cocos/analytics/CALevels";
    var cls_CAPayment = "com/cocos/analytics/CAPayment";
    var cls_CATask = "com/cocos/analytics/CATask";
    var cls_CAVirtual = "com/cocos/analytics/CAVirtual";

    var cls_CAAgentWrapper = "org/cocos2dx/lib/CAAgentWrapper";
    
    cocosAnalytics.init = function(info) {
        if (info && info.appID && info.appSecret && info.channel) {
            jsb.reflection.callStaticMethod(cls_CAAgentWrapper,
                "init", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                info.channel, info.appID, info.appSecret);
        } else {
            console.error("The arguments passed to cocosAnalytics.init are wrong!");
        }
    };

    cocosAnalytics.CAAccount = {
        loginStart: function() {
            jsb.reflection.callStaticMethod(cls_CAAccount, "loginStart", "()V");
        },

        loginSuccess: function(info) {
            if (info && info.userID) {
                jsb.reflection.callStaticMethod(cls_CAAccount, "loginSuccess", "(Ljava/lang/String;)V", info.userID);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAAccount.loginSuccess are wrong!");
            }
        },

        loginFailed: function() {
            jsb.reflection.callStaticMethod(cls_CAAccount, "loginFailed", "()V");
        },

        logout: function(info) {
            jsb.reflection.callStaticMethod(cls_CAAccount, "logout", "()V");
        },

        setAccountType: function(type) {
            if (type) {
                jsb.reflection.callStaticMethod(cls_CAAccount, "setAccountType", "(Ljava/lang/String;)V", type);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAAccount.setAccountType are wrong!");
            }
        },

        setAge: function(age) {
            if (age) {
                jsb.reflection.callStaticMethod(cls_CAAccount, "setAge", "(I)V", age);
            } else {
                console.error("The argument passed to cocosAnalytics.CAAccount.setAge is wrong!");
            }
        },

        setGender: function(gender) {
            if (gender) {
                jsb.reflection.callStaticMethod(cls_CAAccount, "setGender", "(I)V", gender);
            } else {
                console.error("The argument passed to cocosAnalytics.CAAccount.setGender is wrong!");
            }
        },

        setLevel: function(level) {
            if (level) {
                jsb.reflection.callStaticMethod(cls_CAAccount, "setLevel", "(I)V", level);
            } else {
                console.error("The argument passed to cocosAnalytics.CAAccount.setLevel is wrong!");
            }
        },

        createRole: function(info) {
            if (info && info.roleID && info.userName && info.race && info['class'] && info.gameServer) {
                jsb.reflection.callStaticMethod(cls_CAAccount,
                    "createRole", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                    info.roleID, info.userName, info.race, info['class'], info.gameServer);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAAccount.createRole are wrong!");
            }
        }
    };

    cocosAnalytics.CAEvent = {
        onEvent: function(info) {
            if (info && info.eventName) {
                jsb.reflection.callStaticMethod(cls_CAEvent, "onEvent", "(Ljava/lang/String;)V", info.eventName);
            } else {
                console.error("The argument passed to cocosAnalytics.CAEvent.onEvent is wrong!");
            }
        },

        onEventStart: function(info) {
            if (info && info.eventName) {
                jsb.reflection.callStaticMethod(cls_CAEvent, "onEventStart", "(Ljava/lang/String;)V", info.eventName);
            } else {
                console.error("The argument passed to cocosAnalytics.CAEvent.onEventStart is wrong!");
            }
        },

        onEventEnd: function(info) {
            if (info && info.eventName) {
                jsb.reflection.callStaticMethod(cls_CAEvent, "onEventEnd", "(Ljava/lang/String;)V", info.eventName);
            } else {
                console.error("The argument passed to cocosAnalytics.CAEvent.onEventEnd is wrong!");
            }
        }
    };

    cocosAnalytics.CAPayment = {
        payBegin: function(info) {
            if (info && info.amount && info.orderID && info.payType && info.iapID && info.currencyType) {
                jsb.reflection.callStaticMethod(cls_CAPayment,
                    "payBegin", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                    info.amount, info.orderID, info.payType, info.iapID, info.currencyType);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAPayment.payBegin are wrong!");
            }
        },

        paySuccess: function(info) {
            if (info && info.amount && info.orderID && info.payType && info.iapID && info.currencyType) {
                jsb.reflection.callStaticMethod(cls_CAPayment,
                    "paySuccess", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                    info.amount, info.orderID, info.payType, info.iapID, info.currencyType);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAPayment.paySuccess are wrong!");
            }
        },

        payFailed: function(info) {
            if (info && info.amount && info.orderID && info.payType && info.iapID && info.currencyType) {
                jsb.reflection.callStaticMethod(cls_CAPayment,
                    "payFailed", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                    info.amount, info.orderID, info.payType, info.iapID, info.currencyType);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAPayment.payFailed are wrong!");
            }
        },

        payCanceled: function(info) {
            if (info && info.amount && info.orderID && info.payType && info.iapID && info.currencyType) {
                jsb.reflection.callStaticMethod(cls_CAPayment,
                    "payCanceled", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                    info.amount, info.orderID, info.payType, info.iapID, info.currencyType);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAPayment.payCanceled are wrong!");
            }
        }
    };

    cocosAnalytics.CALevels = {
        begin: function(info) {
            if (info && info.level) {
                jsb.reflection.callStaticMethod(cls_CALevels, "begin", "(Ljava/lang/String;)V", info.level);
            } else {
                console.error("The argument passed to cocosAnalytics.CALevels.begin is wrong!");
            }
        },

        complete: function(info) {
            if (info && info.level) {
                jsb.reflection.callStaticMethod(cls_CALevels, "complete", "(Ljava/lang/String;)V", info.level);
            } else {
                console.error("The argument passed to cocosAnalytics.CALevels.complete is wrong!");
            }
        },

        failed: function(info) {
            if (info && info.level) {
                info.reason = info.reason || "";
                jsb.reflection.callStaticMethod(cls_CALevels, "failed", "(Ljava/lang/String;Ljava/lang/String;)V", info.level, info.reason);
            } else {
                console.error("The arguments passed to cocosAnalytics.CALevels.failed are wrong!");
            }
        }
    };

    cocosAnalytics.CATaskType = {
        GuideLine: 1,
        MainLine: 2,
        BranchLine: 3,
        Daily: 4,
        Activity: 5,
        Other: 100
    };

    cocosAnalytics.CATask = {

        begin: function(info) {
            if (info && info.taskID && info.type) {
                jsb.reflection.callStaticMethod(cls_CATask, "begin", "(Ljava/lang/String;I)V", info.taskID, info.type);
            } else {
                console.error("The arguments passed to cocosAnalytics.CATask.begin are wrong!");
            }
        },

        complete: function(info) {
            if (info && info.taskID) {
                jsb.reflection.callStaticMethod(cls_CATask, "complete", "(Ljava/lang/String;)V", info.taskID);
            } else {
                console.error("The argument passed to cocosAnalytics.CATask.complete is wrong!");
            }
        },

        failed: function(info) {
            if (info && info.taskID) {
                info.reason = info.reason || "";
                jsb.reflection.callStaticMethod(cls_CATask, "failed", "(Ljava/lang/String;Ljava/lang/String;)V", info.taskID, info.reason);
            } else {
                console.error("The arguments passed to cocosAnalytics.CATask.failed are wrong!");
            }
        }
    };

    cocosAnalytics.CAItem = {
        buy: function(info) {
            if (info && info.itemID && info.itemType && info.itemCount && info.virtualCoin && info.virtualType && info.consumePoint) {
                jsb.reflection.callStaticMethod(cls_CAItem, "buy", "(Ljava/lang/String;Ljava/lang/String;IILjava/lang/String;Ljava/lang/String;)V",
                    info.itemID, info.itemType, info.itemCount, info.virtualCoin, info.virtualType, info.consumePoint);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAItem.buy are wrong!");
            }
        },

        get: function(info) {
            if (info && info.itemID && info.itemType && info.itemCount && info.reason) {
                jsb.reflection.callStaticMethod(cls_CAItem, "get", "(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;)V",
                    info.itemID, info.itemType, info.itemCount, info.reason);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAItem.get are wrong!");
            }
        },

        consume: function(info) {
            if (info && info.itemID && info.itemType && info.itemCount && info.reason) {
                jsb.reflection.callStaticMethod(cls_CAItem, "consume", "(Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;)V",
                    info.itemID, info.itemType, info.itemCount, info.reason);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAItem.consume are wrong!");
            }
        }
    };

    cocosAnalytics.CAVirtual = {
        setVirtualNum: function(info) {
            if (info && info.type && info.count) {
                jsb.reflection.callStaticMethod(cls_CAVirtual, "setVirtualNum", "(Ljava/lang/String;J)V",
                    info.type, info.count);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAVirtual.setVirtualNum are wrong!");
            }
        },

        get: function(info) {
            if (info && info.type && info.count && info.reason) {
                jsb.reflection.callStaticMethod(cls_CAVirtual, "get", "(Ljava/lang/String;JLjava/lang/String;)V",
                    info.type, info.count, info.reason);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAVirtual.get are wrong!");
            }
        },

        consume: function(info) {
            if (info && info.type && info.count && info.reason) {
                jsb.reflection.callStaticMethod(cls_CAVirtual, "consume", "(Ljava/lang/String;JLjava/lang/String;)V",
                    info.type, info.count, info.reason);
            } else {
                console.error("The arguments passed to cocosAnalytics.CAVirtual.consume are wrong!");
            }
        }
    };

} else if (platform === sys.IPAD || platform === sys.IPHONE) {

} else {

}

})();
