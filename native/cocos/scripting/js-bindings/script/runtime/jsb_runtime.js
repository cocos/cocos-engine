cc.INT_MAX = 2147483647;

//==================================================================================================
var __RTPreloadCallbackMap = {};
var __RTPreloadIndex = 0;

runtime.onPreload = function(cbIndex, resultJson) {
    if (cbIndex in __RTPreloadCallbackMap) {
        var cb = __RTPreloadCallbackMap[cbIndex];
        if (cb) {
            var status = JSON.parse(resultJson);
            cb(status);
        }
    }
};

runtime.onPreloadDone = function(cbIndex, resultJson) {
    if (cbIndex in __RTPreloadCallbackMap) {
        var cb = __RTPreloadCallbackMap[cbIndex];
        if (cb) {
            var status = JSON.parse(resultJson);
            cb(status);
        }

        delete __RTPreloadCallbackMap[cbIndex];
    }
};

runtime.preload = function(gameRes, preload_cb, target) {
    __RTPreloadIndex++;
    if (target == null) {
        __RTPreloadCallbackMap[__RTPreloadIndex] = preload_cb;
    }
    else {
        __RTPreloadCallbackMap[__RTPreloadIndex] = preload_cb.bind(target);
    }

    runtime.__preload(gameRes, __RTPreloadIndex);
};
//==================================================================================================
cc.loader.loadImg = function(url, option, cb){
    if (this._imageArray == undefined) {
        this._imageArray = [];
    }
    
    var l = arguments.length;
    if (l == 2) cb = option;
    if (url.match(jsb.urlRegExp)) {
        var picName;
        var picSuffix = [".png", ".jpg", ".jpeg", ".gif", ".bmp"];
        var hasSuffix = false;
        var suffix;

        for (var i = 0; i < picSuffix.length; i++) {
            var item = picSuffix[i];
            if (url.indexOf(item) != -1) {
                hasSuffix = true;
                suffix = item;
                break;
            }
        }
        var conf = l == 2 ? null : option;
        if (conf) {
            picName = cc.md5Encode(url + "cocos" + conf.width + "_" + conf.height);
        } else {
            cc.log("download default image");
            picName = cc.md5Encode(url);
        }
        cc.log("picName is " + picName);
        var imageConfig = conf;
        var cachedTex = cc.textureCache._addImage(picName);
        if (cachedTex instanceof cc.Texture2D) {
            cc.log("loadImg find texture from cache");
            cb && cb(null, cachedTex);
        } else {
            var listItem = this._getDownloadItem(picName);
            if (listItem) {
                cc.log("the same picture is downloading");
                listItem.cb.push(cb);
                return;
            } else {
                listItem = this._addDownloadList(url, picName, suffix, imageConfig, cb);
            }
            var self = this;
            jsb.loadRemoteImg(JSON.stringify(listItem.info), function (configJsonText) {
                var config = JSON.parse(configJsonText);
                cc.log("callback from loadRemoteImg config is " + configJsonText);
                var item = self._getDownloadItem(config.picName);
                if (!item && cb) {
                    cb("Load image failed", null);
                    return;
                }
                if (item.cb) {
                    for (var i = 0; i < item.cb.length; i++) {
                        cc.log("in callback list now i is " + i);
                        var texture = null;
                        var error = null;
                        if (config.isSuccess) {
                            cc.log("begin load texture picName is " + item.info.picName);
                            texture = cc.textureCache._addImage(item.info.picName);
                            if(!texture instanceof cc.Texture2D){
                                texture = null;
                                error = "add image fail";
                            }
                        } else {
                            error = "download image fail";
                        }
                        var cbItem = item.cb[i];
                        if (cbItem) {
                            cbItem(error, texture);
                        } else {
                            cc.log("ERROR:callback is null");
                        }
                    }
                }
                self._delDownloadList(item);
            });
        }
    } else {
        var tex = cc.textureCache._addImage(url);
        if (tex instanceof cc.Texture2D)
            cb && cb(null, tex);
        else cb && cb("Load image failed");
    }
};

cc.loader._addDownloadList = function (url,picName,suffix,option,cb) {
    var item = {
        info: {
            url: url,
            suffix:suffix,
            picName:picName,
            option: option
        },
        cb: [cb]
    };
    this._imageArray.push(item);
    return item;
};

cc.loader._getDownloadItem = function (picName) {
    var imgArray = this._imageArray;
    for (var i = 0, l = imgArray.length; i < l; i++) {
        var item = imgArray[i];
        if (item.info.picName == picName) {
            return item;
        }
    }
    return null;
};

cc.loader._delDownloadList = function (picName) {
    var imgArray = this._imageArray;
    for (var i = 0, l = imgArray.length; i < l; i++) {
        var item = imgArray[i];
        if (item.info.picName == picName) {
            this._imageArray.splice(i,1);
            break;
        }
    }
};

//==================================================================================================
cc.network = cc.network||{};
cc.network.type = {
    NO_NETWORK:-1,
    MOBILE:0,
    WIFI:1
};

cc.network.preloadstatus = {
    DOWNLOAD:1,
    UNZIP:2
};

cc.network.getNetworkType = function () {
    return runtime.getNetworkType();
};

cc.LoaderLayer = cc.Layer.extend({
    _backgroundSprite: null,
    _progressBackgroundSprite: null,
    _progressBarSprite: null,
    _logoSprite: null,
    _titleSprite: null,
    _groupname: null,
    _callback: null,
    _selector: null,
    _preloadCount: 0,
    _isPreloadFromFailed: false,
    _progressOriginalWidth: 0,
    _isDefaultProgress: true,
    _isLandScape: false,
    _scaleFactor: null,

    ctor: function (config) {
        this._super();
        this._setConfig(config);
    },
    _setConfig: function (config) {
        if (config) {
            cc.LoaderLayer._userConfig = config;
        }
    },
    ignoreTouch: function(touch, event) {

    },
    onEnter: function () {
        this._super();
        this.initData();
        this.initView();
        var config = this._finalConfig;
        if (config.onEnter) {
            config.onEnter(this);
        }
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                return true;
            },
            onTouchMoved: this.ignoreTouch,
            onTouchEnded: this.ignoreTouch,
            onTouchCancelled: this.ignoreTouch
        }, this);
    },
    onExit: function () {
        this._super();
        var config = this._finalConfig;
        if (config.logo.action) {
            config.logo.action.release();
        }
        if(config.title.action){
            config.title.action.release();
        }
        if (config.onExit) {
            config.onExit(this);
        }
    },
    initData: function () {
        this._finalConfig = cc.cloneObject(cc.LoaderLayer._config);
        var config = this._finalConfig;
        if (cc.LoaderLayer._userConfig != null) {
            var uConfig = cc.LoaderLayer._userConfig;
            if (uConfig.background && uConfig.background.res) {
                config.background.res = uConfig.background.res;
            }
            if (uConfig.title) {
                var uTitle = uConfig.title;
                var title = config.title;
                title.show = typeof uTitle.show != "undefined" ? uTitle.show : title.show;
                title.res = uTitle.res ? uTitle.res : title.res;
                title.position = uTitle.position ? uTitle.position : title.position;
                title.action = uTitle.action ? uTitle.action : title.action;
                if (title.action) {
                    title.action = uTitle.action;
                    title.action.retain();
                }
            }
            if (uConfig.logo) {
                var uLogo = uConfig.logo;
                var logo = config.logo;
                logo.show = typeof uLogo.show != "undefined" ? uLogo.show : logo.show;
                logo.res = uLogo.res ? uLogo.res : logo.res;
                logo.position = uLogo.position ? uLogo.position : logo.position;
                if (typeof uLogo.action != "undefined") {
                    logo.action = uLogo.action;
                    if (logo.action) {
                        logo.action.retain();
                    }
                }
            }
            if (uConfig.progressBar) {
                var uProgress = uConfig.progressBar;
                var progress = config.progressBar;
                progress.show = typeof uProgress.show != "undefined" ? uProgress.show : progress.show;
                if (uProgress.res) {
                    progress.res = uProgress.res;
                    this._isDefaultProgress = false;
                }
                progress.offset = uProgress.offset ? uProgress.offset : progress.offset;
                progress.position = uProgress.position ? uProgress.position : progress.position;
                progress.barBackgroundRes = uProgress.barBackgroundRes ? uProgress.barBackgroundRes : progress.barBackgroundRes;
            }
            if (uConfig.tips) {
                var uTips = uConfig.tips;
                var tips = config.tips;
                tips.show = typeof uTips.show != "undefined" ? uTips.show : tips.show;
                tips.res = uTips.res ? uTips.res : tips.res;
                tips.offset = uTips.offset ? uTips.offset : tips.offset;
                tips.fontSize = uTips.fontSize ? uTips.fontSize : tips.fontSize;
                tips.position = uTips.position ? uTips.position : tips.position;
                tips.color = uTips.color ? uTips.color : tips.color;
                if (uConfig.tips.tipsProgress && typeof uConfig.tips.tipsProgress == "function") {
                    tips.tipsProgress = uConfig.tips.tipsProgress;
                }
            }
            if (typeof uConfig.onEnter == "function") {
                config.onEnter = uConfig.onEnter;
            }
            if (typeof uConfig.onExit == "function") {
                config.onExit = uConfig.onExit;
            }
        }

        if (typeof config.logo.action == "undefined" && cc.LoaderLayer._useDefaultSource) {
            config.logo.action = cc.sequence(
                cc.spawn(cc.moveBy(0.4, cc.p(0, 40)).easing(cc.easeIn(0.5)), cc.scaleTo(0.4, 0.95, 1.05).easing(cc.easeIn(0.5))),
                cc.delayTime(0.08),
                cc.spawn(cc.moveBy(0.4, cc.p(0, -40)).easing(cc.easeOut(0.5)), cc.scaleTo(0.4, 1.05, 0.95).easing(cc.easeOut(0.5)))
            ).repeatForever();
            config.logo.action.retain();
        }
        if (!config.tips.color) {
            config.tips.color = cc.color(255, 255, 255);
        }
    },
    initView: function () {
        var config = this._finalConfig;
        this._contentLayer = new cc.Layer();
        this._isLandScape = cc.winSize.width > cc.winSize.height;
        this._scaleFactor = !cc.LoaderLayer._useDefaultSource ? 1 : cc.winSize.width > cc.winSize.height ? cc.winSize.width / 720 : cc.winSize.width / 480;

        //background
        this.backgroundSprite = new cc.Sprite(config.background.res);
        this.addChild(this.backgroundSprite);
        this.backgroundSprite.x = 0, this.backgroundSprite.y = 0, this.backgroundSprite.anchorX = 0, this.backgroundSprite.anchorY = 0;
        if (cc.LoaderLayer._useDefaultSource) {
            this.backgroundSprite.scaleX = cc.winSize.width / this.backgroundSprite.width;
            this.backgroundSprite.scaleY = cc.winSize.height / this.backgroundSprite.height;
        }

        //title
        if (config.title.show) {
            this.titleSprite = new cc.Sprite(config.title.res);
            var defaultTitlePosition = cc.pAdd(cc.visibleRect.center, cc.p(0, this._scaleFactor < 1 ? 0 : this._isLandScape ? -80 : 30));
            this.titleSprite.setPosition(config.title.position ? config.title.position : defaultTitlePosition);
            this._contentLayer.addChild(this.titleSprite);
            if (config.title.action) {
                this.titleSprite.runAction(config.title.action);
            }
        }

        //logo
        if (config.logo.show) {
            this.logoSprite = new cc.Sprite(config.logo.res);
            var defaultLogoPosition = cc.pAdd(cc.visibleRect.top, cc.p(0, this._scaleFactor < 1 ? 0 : -this.logoSprite.height / 2 - (this._isLandScape ? 56 : 76)));
            this.logoSprite.setPosition(config.logo.position ? config.logo.position : defaultLogoPosition);
            this._contentLayer.addChild(this.logoSprite);
            if (config.logo.action) {
                this.logoSprite.runAction(config.logo.action);
            }
        }

        //progressbar
        if (config.progressBar.show) {
            this.progressBarSprite = new cc.Sprite(config.progressBar.res);
            this._progressOriginalWidth = this.progressBarSprite.width;
            this.progressBackgroundSprite = new cc.Sprite(config.progressBar.barBackgroundRes);
            this.progressBarSprite.anchorX = 0;
            this.progressBarSprite.anchorY = 0;
            if (this._isDefaultProgress) {
                this._barPoint = new cc.Sprite(config.progressBar.barPoint);
                this.progressBarSprite.addChild(this._barPoint);
            }
            if (config.progressBar.barBackgroundRes == null) {
                this.progressBackgroundSprite.setTextureRect(cc.rect(0, 0, this.progressBarSprite.width, this.progressBarSprite.height));
            }
            if (config.progressBar.offset == null) {
                var deltaProgressWithX = (this.progressBackgroundSprite.width - this.progressBarSprite.width) / 2;
                var deltaProgressWithY = (this.progressBackgroundSprite.height - this.progressBarSprite.height) / 2;
                config.progressBar.offset = cc.p(deltaProgressWithX, deltaProgressWithY);
            }
            this.progressBarSprite.setPosition(config.progressBar.offset);
            this.progressBackgroundSprite.addChild(this.progressBarSprite);
            var defaultProgressPosition = cc.pAdd(cc.visibleRect.bottom, cc.p(0, this.progressBarSprite.height / 2 + this._isLandScape ? 60 : 80));
            this.progressBackgroundSprite.setPosition(config.progressBar.position ? config.progressBar.position : defaultProgressPosition);
            this._contentLayer.addChild(this.progressBackgroundSprite);
            this._setProgress(0);
        }

        //tips
        if (config.tips.show) {
            this.tipsLabel = new cc.LabelTTF("100%", "Arial", config.tips.fontSize);
            this.tipsLabel.setColor(config.tips.color ? config.tips.color : cc.color(255, 255, 255));
            this.tipsLabel.setPosition(config.tips.position ? config.tips.position : this.progressBackgroundSprite ? cc.p(this.progressBackgroundSprite.x, this.progressBackgroundSprite.y + this.progressBackgroundSprite.height / 2 + 20) : cc.pAdd(cc.visibleRect.bottom, cc.p(0, 100)));
            this._contentLayer.addChild(this.tipsLabel);
        }
        this.addChild(this._contentLayer);
        if (this._scaleFactor < 1) {
            this._contentLayer.setScale(this._scaleFactor);
            this._contentLayer.setPosition(cc.pAdd(this._contentLayer.getPosition(), cc.p(0, -50)));
        }

    },
    _setProgress: function (percent) {
        if (this.progressBarSprite) {
            percent = percent < 1 ? percent : 1;
            var width = percent * this._progressOriginalWidth;
            this.progressBarSprite.setTextureRect(cc.rect(0, 0, width, this.progressBarSprite.height));
            if (this._isDefaultProgress) {
                this._barPoint.setPosition(cc.p(this.progressBarSprite.width, this.progressBarSprite.height / 2));
            }
        }
    },
    setTipsString: function (str) {
        if (this.tipsLabel != null) {
            this.tipsLabel.setString(str);
        }
    },
    getProgressBar: function () {
        return this.progressBarSprite;
    },
    getTipsLabel: function () {
        return this.tipsLabel;
    },
    getLogoSprite: function () {
        return this.logoSprite;
    },
    getTitleSprite: function () {
        return this.titleSprite;
    },
    updateGroup: function (groupname, callback, target) {
        this._groupname = groupname;
        this._callback = callback;
        this._selector = target;
    },
    _resetLoadingLabel: function () {
        this.setTipsString("");
        this._setProgress(0);
    },
    _preloadSource: function () {
        cc.log("_preloadSource: " + this._groupname);
        this._resetLoadingLabel();
        if (cc.sys.isNative) {
            runtime.preload(this._groupname, this._preload_native, this);
        } else {
            this._preload_html5();
        }
    },
    _preload_html5: function () {
        var res = "";
        var groupIndex = [];
        var config = this._finalConfig;
        if (cc.isString(this._groupname)) {
            if (this._groupname.indexOf(".") != -1) {
                res = [this._groupname];
            } else {
                res = window[this._groupname];
            }
        } else if (cc.isArray(this._groupname)) {
            res = [];
            for (var i = 0; i < this._groupname.length; i++) {
                var group = window[this._groupname[i]];
                var preCount = i > 0 ? groupIndex[i - 1] : 0;
                groupIndex.push(preCount + group.length);
                res = res.concat(group);
            }
        }
        var self = this;
        //var progressFunction = self.config.progressCallback ? self.config.progressCallback : null;
        cc.loader.load(res, function (result, count, loadedCount) {
            var checkGroupName = function (loadedCount) {
                for (var i = 0; i < groupIndex.length; i++) {
                    if (groupIndex[i] >= loadedCount) {
                        return self._groupname[i];
                    }
                }
                return "";
            };
            var groupName = checkGroupName(loadedCount);
            var status = {
                groupName: groupName,
                isCompleted: false,
                percent: (loadedCount / count * 100) | 0,//(float),
                stage: 1, //(1表示正在下载，2 表示正在解压)
                isFailed: false
            };
            if (status.percent != 0) {
                self._setProgress(status.percent / 100);
            }
            config.tips.tipsProgress(status, self);
        }, function () {
            self.removeFromParent();
            self._preloadCount--;
            if (self._callback) {
                if (self._selector) {
                    self._callback(self._selector, true);
                } else {
                    self._callback(true);
                }
            }
            self._callback.call(this._target, !status.isFailed);
        });
    },
    _preload_native: function (status) {
        var config = this._finalConfig;
        if (status.percent) {
            this._setProgress(status.percent / 100);
        }
        if (config.tips.tipsProgress) {
            config.tips.tipsProgress(status, this);
        }
        if (status.isCompleted || status.isFailed) {
            this._preloadCount--;

            if (status.isCompleted) {
                cc.log("preload finish!");
                this._isPreloadFromFailed = false;
            }
            if (status.isFailed) {
                cc.log("preload failed!");
                this._isPreloadFromFailed = true;
            }

            // Remove loading layer from scene after loading was done.
            if (this._preloadCount == 0 && !this._isPreloadFromFailed) {
                this.removeFromParent();
                if (cc.LoaderLayer._useDefaultSource) {
                    var _config = cc.runtime.config.design_resolution || {width: 480, height: 720, policy: "SHOW_ALL"};
                    cc.view.setDesignResolutionSize(_config.width, _config.height, cc.ResolutionPolicy[_config.policy]);
                }
            }

            // Callback must be invoked after removeFromParent.
            this._callback.call(this._target, status);
        }
    },
    _addToScene: function () {
        if (this._preloadCount == 0 && !this._isPreloadFromFailed) {
            if (cc.sys.isNative && cc.LoaderLayer._useDefaultSource) {
                var config = cc.runtime.config.design_resolution;
                var isLandscape = false;
                var isLargeThanResource = false;
                if (config) {
                    var orientation = cc.runtime.config.orientation;
                    cc.log("_addToScene orientation is " + orientation);
                    if (orientation == "landscape") {
                        isLandscape = true;
                        isLargeThanResource = config.width > 720 || config.height > 480;
                    } else {
                        isLargeThanResource = config.width > 480 || config.height > 720;
                    }
                }
                cc.log("isLargeThanResource is " + isLargeThanResource);
                cc.view.setDesignResolutionSize(isLargeThanResource ? config.width : isLandscape ? 720 : 480, isLargeThanResource ? config.height : isLandscape ? 480 : 720, cc.ResolutionPolicy["FIXED_HEIGHT"]);
            }
            cc.director.getRunningScene().addChild(this, cc.INT_MAX - 1);// -1 是防止dialog先弹出来把loaderlayer遮住
        }
        this._preloadCount++;
    }
});

cc.LoaderLayer._config = {//默认的设置
    background: {
        res: "res_engine/preload_bg.jpg"
    },
    title: {
        show: true,
        res: "res_engine/preload_title.png",
        position: null,
        action: null
    },
    logo: {
        res: "res_engine/preload_logo.png",
        show: true,
        position: null
    },
    progressBar: {
        show: true,
        res: "res_engine/progress_bar.png",//progressBar 图片
        offset: null,//loadingbar偏移loadingbar背景的offset
        position: null,//loadbar在整个layer中的位置
        barBackgroundRes: "res_engine/progress_bg.png",//progressBar 背景图片
        barPoint: "res_engine/progress_light.png",
        barShadow: "res_engine/shadow.png"
    },
    tips: {
        show: true,
        fontSize: 22,
        position: null,
        color: null,
        tipsProgress: function (status, loaderlayer) {
            if (loaderlayer.getTipsLabel()) {
                var statusStr = "正在";
                if (status.stage == cc.network.preloadstatus.DOWNLOAD) {
                    statusStr += "下载";
                } else if (status.stage == cc.network.preloadstatus.UNZIP) {
                    statusStr += "解压";
                }
                if (status.groupName) {
                    statusStr += status.groupName;
                }
                statusStr += "进度:" + status.percent.toFixed(2) + "%";
                loaderlayer.getTipsLabel().setString(statusStr);
            }
        }
    },
    progressCallback: function (progress) {//进度更新回调

    },
    onEnter: function (layer) {
        cc.log("LoaderLayer onEnter");
    },
    onExit: function (layer) {
        cc.log("LoaderLayer onExit");
    }
};

cc.LoaderLayer.preload = function (groupname, callback, target) {
    var loaderLayer = new cc.LoaderLayer();
    var preloadCb = function (status) {
        if (status.isFailed) {
            var tips, conirmfunc, cancelfunc;
            switch (status.errorCode) {
                case "err_no_space":
                {
                    tips = "空间不足，请清理磁盘空间";
                    conirmfunc = function () {
                        callPreload();
                    };
                    cancelfunc = function () {
                        cc.director.end();
                    };
                    break;
                }
                case "err_verify":
                {
                    tips = "校验失败，是否重新下载？";
                    conirmfunc = function () {
                        callPreload();
                    };
                    cancelfunc = function () {
                        cc.director.end();
                    };
                    break;
                }
                case "err_network":
                {
                    tips = "网络异常是否重新下载";
                    conirmfunc = function () {
                        callPreload();
                    };
                    cancelfunc = function () {
                        cc.director.end();
                    };
                    break;
                }
                default :
                {
                    conirmfunc = cancelfunc = function () {

                    };
                }
            }
            cc._NetworkErrorDialog._show(status.errorCode, tips, conirmfunc, cancelfunc);
        } else {
            if (callback) {
                if (target) {
                    callback.call(target, !status.isFailed);
                } else {
                    callback(!status.isFailed);
                }
            }
        }
    };

    var callPreload = function () {
        if (cc.director.getRunningScene()) {
            loaderLayer.updateGroup(groupname, preloadCb, target);
            loaderLayer._addToScene();
            loaderLayer._preloadSource();
        } else {
            cc.log("Current scene is null we can't start preload");
        }
    };
    callPreload();
};

cc.LoaderLayer._useDefaultSource = true;
cc.LoaderLayer.setUseDefaultSource = function (status) {
    cc.LoaderLayer._useDefaultSource = status;
};

cc.LoaderLayer._userConfig = null;
cc.LoaderLayer.setConfig = function (config) {
    if(config.title && config.title.action){
        config.title.action.retain();
    }
    if(config.logo && config.logo.action){
        config.logo.action.retain();
    }
    cc.LoaderLayer._userConfig = config;
};

cc.Dialog = cc.Layer.extend({
    _userConfig: null,
    _finalConfig: null,
    _defaultConfig: null,
    backgroundSprite: null,
    _menuItemConfirm: null,
    _menuItemCancel: null,
    _messageLabel: null,
    _eventListener: null,
    _scaleFactor: null,

    ctor: function (config) {
        this._super();
        this.setConfig(config);
    },
    setConfig: function (config) {
        if (config) {
            this._userConfig = config;
        }
        this.removeAllChildren();
        this.initData();
    },
    initData: function () {
        this._finalConfig = cc.cloneObject(cc.Dialog._defaultConfig);
        var config = this._finalConfig;
        if (this._userConfig != null) {
            var uConfig = this._userConfig;
            if (uConfig.position) {
                config.position = uConfig.position;
            }
            if (uConfig.action) {
                config.action = uConfig.action;
            }
            if (uConfig.background && uConfig.background.res) {
                config.background = uConfig.background;
            }
            if (uConfig.confirmBtn) {
                var uConfirmBtn = uConfig.confirmBtn;
                var confirmBtn = config.confirmBtn;
                confirmBtn.normalRes = uConfirmBtn.normalRes ? uConfirmBtn.normalRes : confirmBtn.normalRes;
                confirmBtn.pressRes = uConfirmBtn.pressRes ? uConfirmBtn.pressRes : confirmBtn.pressRes;
                confirmBtn.text = typeof uConfirmBtn.text != "undefined" ? uConfirmBtn.text : confirmBtn.text;
                confirmBtn.textColor = uConfirmBtn.textColor ? uConfirmBtn.textColor : confirmBtn.textColor;
                confirmBtn.fontSize = uConfirmBtn.fontSize ? uConfirmBtn.fontSize : confirmBtn.fontSize;
                confirmBtn.position = uConfirmBtn.position ? uConfirmBtn.position : confirmBtn.position;
                confirmBtn.callback = uConfirmBtn.callback ? uConfirmBtn.callback : confirmBtn.callback;
            }
            if (uConfig.cancelBtn) {
                var uCancelBtn = uConfig.cancelBtn;
                var cancelBtn = config.cancelBtn;
                cancelBtn.normalRes = uCancelBtn.normalRes ? uCancelBtn.normalRes : cancelBtn.normalRes;
                cancelBtn.pressRes = uCancelBtn.pressRes ? uCancelBtn.pressRes : cancelBtn.pressRes;
                cancelBtn.text = typeof uCancelBtn.text != "undefined" ? uCancelBtn.text : cancelBtn.text;
                cancelBtn.textColor = uCancelBtn.textColor ? uCancelBtn.textColor : cancelBtn.textColor;
                cancelBtn.fontSize = uCancelBtn.fontSize ? uCancelBtn.fontSize : cancelBtn.fontSize;
                cancelBtn.position = uCancelBtn.position ? uCancelBtn.position : cancelBtn.position;
                cancelBtn.callback = uCancelBtn.callback ? uCancelBtn.callback : cancelBtn.callback;
            }
            if (uConfig.messageLabel) {
                var uMessageLabel = uConfig.messageLabel;
                var messageLabel = config.messageLabel;
                messageLabel.text = typeof uMessageLabel.text != "undefined" ? uMessageLabel.text : messageLabel.text;
                messageLabel.color = uMessageLabel.color ? uMessageLabel.color : messageLabel.color;
                messageLabel.fontSize = uMessageLabel.fontSize ? uMessageLabel.fontSize : messageLabel.fontSize;
                messageLabel.position = uMessageLabel.position ? uMessageLabel.position : messageLabel.position;
                messageLabel.dimensions = uMessageLabel.dimensions ? uMessageLabel.dimensions : messageLabel.dimensions;
            }
            if (uConfig.target) {
                config.target = uConfig.target;
            }
            if (typeof uConfig.onEnter == "function") {
                config.onEnter = uConfig.onEnter;
            }
            if (typeof uConfig.onExit == "function") {
                config.onExit = uConfig.onExit;
            }
        }

        if (!config.cancelBtn.textColor) {
            config.cancelBtn.textColor = cc.color(255, 255, 255);
        }
        if (!config.confirmBtn.textColor) {
            config.confirmBtn.textColor = cc.color(255, 255, 255);
        }

    },
    initView: function () {
        var useDefaultSource = cc.Dialog._useDefaultSource;
        var winSize = cc.director.getWinSize();
        this._scaleFactor = !useDefaultSource ? 1 : winSize.width > winSize.height ? winSize.width / 720 : winSize.width / 480;
        var config = this._finalConfig;

        //bg
        this.backgroundSprite = new cc.Scale9Sprite(config.background.res);
        this._setScale(this.backgroundSprite);
        if (this._scaleFactor < 1) {
            this.backgroundSprite.setScale(this._scaleFactor);
        }
        this.backgroundSprite.setPosition(config.position ? config.position : cc.p(winSize.width / 2, winSize.height / 2));

        //menu
        this.menuItemConfirm = this._createMenuItemSprite(config.confirmBtn, this._confirmCallback);
        this.menuItemCancel = this._createMenuItemSprite(config.cancelBtn, this._cancelCallback);
        this.menuItemCancel.setPosition(config.cancelBtn.position ? config.cancelBtn.position : cc.p(this.backgroundSprite.width / 2 - this.menuItemCancel.width / 2 - 20, this.menuItemCancel.height + 20));
        this.menuItemConfirm.setPosition(config.confirmBtn.position ? config.confirmBtn.position : cc.p(this.backgroundSprite.width / 2 + this.menuItemConfirm.width / 2 + 20, this.menuItemConfirm.height + 20));
        var menu = new cc.Menu(this.menuItemConfirm, this.menuItemCancel);
        menu.setPosition(cc.p(0, 0));
        this.backgroundSprite.addChild(menu);

        //message
        var fontSize = config.messageLabel.fontSize ? config.messageLabel.fontSize : this._scaleFactor > 1 ? 16 * this._scaleFactor : 16;
        this.messageLabel = new cc.LabelTTF(config.messageLabel.text, "Arial", fontSize);
        this.messageLabel.setDimensions(config.messageLabel.dimensions ? config.messageLabel.dimensions : cc.size(this.backgroundSprite.width - 30, this.backgroundSprite.height - this.menuItemConfirm.y - 10));
        this.messageLabel.setColor(config.messageLabel.color ? config.messageLabel.color : cc.color(255, 255, 255));
        this.messageLabel.setPosition(config.messageLabel.position ? config.messageLabel.position : cc.p(this.backgroundSprite.width / 2, this.backgroundSprite.height - this.messageLabel.height / 2 - 20));
        this.backgroundSprite.addChild(this.messageLabel);
        if (!config.action) {
            var action = cc.sequence(cc.EaseIn.create(cc.scaleTo(0.1, this.backgroundSprite.scale + 0.02), 0.4), cc.EaseOut.create(cc.scaleTo(0.1, this.backgroundSprite.scale), 0.3));
            this.backgroundSprite.runAction(action);
        } else {
            this.backgroundSprite.runAction(config.action);
        }
        this.addChild(this.backgroundSprite);

    },
    _createMenuItemSprite: function (res, callback) {
        var spriteNormal = new cc.Scale9Sprite(res.normalRes);
        var spritePress = new cc.Scale9Sprite(res.pressRes);
        this._setScale(spriteNormal);
        this._setScale(spritePress);
        var fontSize = res.fontSize ? res.fontSize : this._scaleFactor > 1 ? 16 * this._scaleFactor : 16;
        var menuLabel = new cc.LabelTTF(res.text, "Arial", fontSize);
        menuLabel.setColor(res.textColor);
        var menuItem = new cc.MenuItemSprite(spriteNormal, spritePress, callback, this);
        menuLabel.setPosition(cc.p(menuItem.width / 2, menuItem.height / 2));
        menuItem.addChild(menuLabel);
        return menuItem;
    },
    _setScale: function (s9Sprite) {
        if (this._scaleFactor > 1) {
            s9Sprite.setContentSize(cc.size(this._scaleFactor * s9Sprite.width, this._scaleFactor * s9Sprite.height));
        }
    },
    _confirmCallback: function () {
        var config = this._finalConfig;
        if (config.confirmBtn.callback) {
            if (config.target) {
                config.confirmBtn.callback.call(config.target, this);
            } else {
                config.confirmBtn.callback(this);
            }
        }
        this.removeFromParent();
    },
    _cancelCallback: function () {
        var config = this._finalConfig;
        if (config.cancelBtn.callback) {
            if (config.target) {
                config.cancelBtn.callback.call(config.target, this);
            } else {
                config.cancelBtn.callback(this);
            }
        }
        this.removeFromParent();
    },
    onEnter: function () {
        this._super();
        var config = this._finalConfig;
        this.initView();
        config.onEnter(this);
        var self = this;
        self._eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            }
        });
        cc.eventManager.addListener(self._eventListener, self);
    },
    onExit: function () {
        this._super();
        var config = this._finalConfig;
        config.onExit(this);
        this.removeAllChildren();
        cc.Dialog._dialog = null;
        cc.eventManager.removeListener(this._eventListener);
    }
});

cc.Dialog._dialog = null;
cc.Dialog._clearDialog = function () {
    if (cc.Dialog._dialog != null) {
        cc.Dialog._dialog.removeFromParent();
        cc.Dialog._dialog = null;
    }
};

cc.Dialog.show = function (tips, confirmCb, cancelCb) {
    if(cc.Dialog._dialog != null){
        cc.log("other dialog is on the screen,this dialog can't show now");
        return;
    }
    var conf;
    if(typeof tips == "string"){
        conf = {
            messageLabel: {
                text: tips
            },
            confirmBtn: {
                callback: confirmCb
            },
            cancelBtn: {
                callback: cancelCb
            }
        };
    }else if(typeof tips == "object"){
        conf = tips;
    }else{
        cc.log("tips is invalid");
        return;
    }

    cc.Dialog._dialog = new cc.Dialog(conf);
    if (cc.director.getRunningScene()) {
        cc.director.getRunningScene().addChild(cc.Dialog._dialog, cc.INT_MAX);
    } else {
        cc.log("Current scene is null we can't show dialog");
    }
};

cc.Dialog._useDefaultSource = true;
cc.Dialog.setUseDefaultSource = function (status) {
    cc.Dialog._useDefaultSource = status;
};

cc.Dialog._defaultConfig = {
    position: null,
    target: null,
    action: null,
    background: {
        res: "res_engine/dialog_bg.png"
    },
    confirmBtn: {
        normalRes: "res_engine/dialog_confirm_normal.png",
        pressRes: "res_engine/dialog_confirm_press.png",
        text: "确定",
        textColor: null,
        fontSize: null,
        position: null,
        callback: function () {
            cc.log("this is confirm callback");
        }
    },
    cancelBtn: {
        normalRes: "res_engine/dialog_cancel_normal.png",
        pressRes: "res_engine/dialog_cancel_press.png",
        text: "取消",
        textColor: null,
        position: null,
        fontSize: null,
        callback: function () {
            cc.log("this is cancel callback");
        }
    },
    messageLabel: {
        text: "",
        color: null,
        dimensions: null,
        fontSize: null,
        position:null
    },
    onEnter: function (dialog) {
        cc.log("dialog call onEnter");
    },
    onExit: function (dialog) {
        cc.log("dialog call onExit");
    }
};

cc._NetworkErrorDialog = function () {
    cc.Dialog._clearDialog();
    cc.Dialog._dialog = new cc.Dialog(cc._NetworkErrorDialog._config);
    return cc.Dialog._dialog;
};

cc._NetworkErrorDialog._config = {
    networkError:{

    },
    spaceError:{

    },
    verifyError:{

    }
};

cc._NetworkErrorDialog._show = function (type, tips, confirmCb, cancelCb) {
    var networkDialog = cc._NetworkErrorDialog();
    var config;
    switch (type) {
        case "err_network":
        {
            config = cc._NetworkErrorDialog._config.networkError;
            break;
        }
        case "err_no_space":
        {
            config = cc._NetworkErrorDialog._config.spaceError;
            break;
        }
        case "err_verify":
        {
            config = cc._NetworkErrorDialog._config.verifyError;
            break;
        }
        default:
        {
            cc.log("type is not found");
            return;
        }
    }
    if (!networkDialog.getParent()) {

        config.confirmBtn = config.confirmBtn || {};
        config.confirmBtn.callback = function () {
            if (confirmCb)
                confirmCb();
        };

        config.cancelBtn = config.cancelBtn || {};
        config.cancelBtn.callback = function () {
            if (cancelCb)
                cancelCb();
        };

        config.messageLabel = config.messageLabel || {};
        if (typeof config.messageLabel.text == "undefined") {
            config.messageLabel.text = tips;
        }

        networkDialog.setConfig(config);
        if (cc.director.getRunningScene()) {
            cc.director.getRunningScene().addChild(networkDialog, cc.INT_MAX);
        } else {
            cc.log("Current scene is null we can't show dialog");
        }
    }
};

cc._NetworkErrorDialog._setConfig = function (key, config) {
    if (key && config) {
        switch (key) {
            case "err_network":
            {
                cc._NetworkErrorDialog._config.networkError = config;
                break;
            }
            case "err_no_space":
            {
                cc._NetworkErrorDialog._config.spaceError = config;
                break;
            }
            case "err_verify":
            {
                cc._NetworkErrorDialog._config.verifyError = config;
                break;
            }
        }
    }
};

cc.cloneObject = function (obj) {
    var o;
    if (obj.constructor == Object) {
        o = new obj.constructor();
    } else {
        o = new obj.constructor(obj.valueOf());
    }
    for (var key in obj) {
        if (o[key] != obj[key]) {
            if (typeof(obj[key]) == 'object') {
                o[key] = cc.cloneObject(obj[key]);
            } else {
                o[key] = obj[key];
            }
        }
    }
    o.toString = obj.toString;
    o.valueOf = obj.valueOf;
    return o;
};

//+++++++++++++++++++++++++something about cc.runtime begin+++++++++++++++++++++++++++++
//todo init runtime config
cc.runtime = {
    RUNTIME_CONFIG_KEY:{
        description: "description",
        design_resolution: "design_resolution",
        entry_file: "entry_file",
        game_name: "game_name",
        manifest_file:"manifest_file",
        orientation: "orientation",
        package_name: "package_name",
        project_json_file: "project_json_file",
        runtime_version: "runtime_version",
        version_code: "version_code",
        version_name: "version_name"
    },
    config:null,
    _getConfigName: function () {
        return "config.json";
    },
    _initConfig: function () {
        cc.log("begin init runtime config");
        var CONFIG_KEY = this.RUNTIME_CONFIG_KEY;
        var _init = function(cfg){
            cfg[CONFIG_KEY.design_resolution] = cfg[CONFIG_KEY.design_resolution] || {height:800,width:480,policy:"SHOW_ALL"};
            cfg[CONFIG_KEY.entry_file] = cfg[CONFIG_KEY.entry_file] || {"md5": "", "name": "main.js"};
            cfg[CONFIG_KEY.manifest_file] = cfg[CONFIG_KEY.manifest_file] ||{"md5": "", "name": "manifest.json"};
            cfg[CONFIG_KEY.project_json_file] = cfg[CONFIG_KEY.project_json_file] ||{"md5": "", "name": "project.json"};
            cfg[CONFIG_KEY.description] = cfg[CONFIG_KEY.description] || "";
            cfg[CONFIG_KEY.game_name] = cfg[CONFIG_KEY.game_name] || "";
            cfg[CONFIG_KEY.orientation] = cfg[CONFIG_KEY.orientation] ||"";
            cfg[CONFIG_KEY.package_name] = cfg[CONFIG_KEY.package_name] ||"";
            cfg[CONFIG_KEY.runtime_version] = cfg[CONFIG_KEY.runtime_version] ||"";
            cfg[CONFIG_KEY.version_code] = cfg[CONFIG_KEY.version_code] ||"";
            cfg[CONFIG_KEY.version_name] = cfg[CONFIG_KEY.version_name] ||"";
            return cfg;
        };
        try {
            this.config = runtime.config;
            //cc.log("read runtime config is " + JSON.stringify(this.config));
            var design = this.config[CONFIG_KEY.design_resolution];
            cc.log("design.width is " + design.width + " design.height is " + design.height + " policy is " + design.policy);
            this._setDesignResolutionSize(design.width, design.height, cc.ResolutionPolicy[design.policy]);
        } catch (e) {
            cc.log("Failed to read or parse" + this._getConfigName());
            this.config = _init({});
        }
    },
    _setDesignResolutionSize : function(width,height,policy){
        cc.log("cc.runtime begin setting designResolutionSize");
        cc.view.setDesignResolutionSize(width,height,policy);
    }
};

cc.runtime._initConfig();

cc.runtime.network = cc.network;

cc.runtime.setOption = function (promptype, config) {
    if (config) {
        switch (promptype) {
            case "network_error_dialog":
            {
                cc._NetworkErrorDialog._setConfig("err_network", config);
                break;
            }
            case "no_space_error_dialog":
            {
                cc._NetworkErrorDialog._setConfig("err_no_space", config);
                break;
            }
            case "verify_error_dialog":
            {
                cc._NetworkErrorDialog._setConfig("err_verify", config);
                break;
            }
            default :
            {
                cc.log("promptype not found please check your promptype");
            }
        }
    } else {
        cc.log("config is null please check your config");
    }
};

runtime.sendMessageToChannel = function(obj) {
    var msg = JSON.stringify(obj);
    var ret = runtime._sendToChannel(msg, 0);
    cc.log("runtime.sendMessageToChannel msg: " + msg + ", ret: " + ret);
    return ret;
};

var _receiveChannelMessageCallback = null;

runtime.registerReceiveChannelMessageCallback = function(cb) {
    if (_receiveChannelMessageCallback) {
        cc.log("WARNING: receiveChannelMessageCallback has been invoked, will replace callback!");
    }
    _receiveChannelMessageCallback = cb;
};

runtime.unregisterReceiveChannelMessageCallback = function() {
    _receiveChannelMessageCallback = null;
};

runtime._onReceiveChannelMessage = function(objJson) {
    if (_receiveChannelMessageCallback) {
        cc.log("runtime._onReceiveChannelMessage: " + objJson);
        var obj = JSON.parse(objJson);
        return _receiveChannelMessageCallback(obj);
    }
};
