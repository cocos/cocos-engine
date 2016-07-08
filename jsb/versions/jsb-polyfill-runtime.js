/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
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

var _imageArray = [];

function _addDownloadList (url,picName,suffix,option,cb) {
    var item = {
        info: {
            url: url,
            suffix:suffix,
            picName:picName,
            option: option
        },
        cb: [cb]
    };
    _imageArray.push(item);
    return item;
}

function _getDownloadItem (picName) {
    for (var i = 0, l = _imageArray.length; i < l; i++) {
        var item = _imageArray[i];
        if (item.info.picName === picName) {
            return item;
        }
    }
    return null;
}

function _delDownloadList (picName) {
    for (var i = 0, l = _imageArray.length; i < l; i++) {
        var item = _imageArray[i];
        if (item.info.picName === picName) {
            _imageArray.splice(i,1);
            break;
        }
    }
}

function loadImage (loadItem, callback) {
    var url = loadItem.url;

    var cachedTex = cc.textureCache.getTextureForKey(url);
    if (cachedTex) {
        callback && callback(null, cachedTex);
    }
    else if (url.match(jsb.urlRegExp)) {
        var picName;
        var picSuffix = [".png", ".jpg", ".jpeg", ".gif", ".bmp"];
        var hasSuffix = false;
        var suffix;

        for (var i = 0; i < picSuffix.length; i++) {
            var item = picSuffix[i];
            if (url.indexOf(item) !== -1) {
                hasSuffix = true;
                suffix = item;
                break;
            }
        }
        var conf = loadItem.option;
        if (conf) {
            picName = cc.md5Encode(url + "cocos" + conf.width + "_" + conf.height);
        } else {
            cc.log("download default image");
            picName = cc.md5Encode(url);
        }
        cc.log("picName is " + picName);
        var imageConfig = conf;
        cachedTex = cc.textureCache._addImage(picName);
        if (cachedTex instanceof cc.Texture2D) {
            cc.log("loadImg find texture from cache");
            callback && callback(null, cachedTex);
        } else {
            var listItem = _getDownloadItem(picName);
            if (listItem) {
                cc.log("the same picture is downloading");
                listItem.cb.push(callback);
                return;
            } else {
                listItem = _addDownloadList(url, picName, suffix, imageConfig, callback);
            }
            jsb.loadRemoteImg(JSON.stringify(listItem.info), function (configJsonText) {
                var config = JSON.parse(configJsonText);
                cc.log("callback from loadRemoteImg config is " + configJsonText);
                var item = _getDownloadItem(config.picName);
                if (!item && callback) {
                    callback(new Error("Load image failed: " + url), null);
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
                                error = new Error("add image fail: " + url);
                            }
                        } else {
                            error = new Error("download image fail" + url);
                        }
                        var cbItem = item.cb[i];
                        if (cbItem) {
                            cbItem(error, texture);
                        } else {
                            cc.log("ERROR: callback is null");
                        }
                    }
                }
                _delDownloadList(item);
            });
        }
    } 
    else {
        cc.textureCache._addImageAsync(url, function (tex){
            if (tex instanceof cc.Texture2D) {
                callback && callback(null, tex);
            }
            else {
                callback && callback(new Error('Load image failed: ' + url));
            }
        });
    }
}

cc.loader.addLoadHandlers({
    // Images
    'png' : loadImage,
    'jpg' : loadImage,
    'bmp' : loadImage,
    'jpeg' : loadImage,
    'gif' : loadImage,
    'ico' : loadImage,
    'tiff' : loadImage,
    'webp' : loadImage,
    'image' : loadImage
});

cc.Follow.prototype._ctor = function (followedNode, rect) {
    if(followedNode)
        rect ? this.initWithTarget(followedNode, rect)
            : this.initWithTarget(followedNode);
};