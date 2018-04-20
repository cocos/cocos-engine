/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

let Pipeline = require('./pipeline');

//录制时间间隔
let RECORD_DELTA_TIME = 0.1;

let BEGIN_ID = 0;
let S_INTERVAL_ID = 0;

let recordList = [];
let screenShot = [];
let ID = 'AssetRecordPipe';
window.recordList = recordList;

let _genItemInfo = function (item) {
    return {
        uuid: item.uuid || null,
        url: item.url,
        id: item.id,
        rawUrl: item.rawUrl
    }
};

let _genRecordInfo = function (time) {
    return {
        id: ++BEGIN_ID,
        ts: time,
        items: [],
        screenshot: ""
    }
};

let AssetRecordPipe = function (libraryBase, rawAssetsBase) {
    this.id = ID;
    this.async = false;
    this.pipeline = null;
    this.libraryBase = libraryBase;
    this.rawAssetsBase = rawAssetsBase;

    recordList.push(_genRecordInfo(new Date().getTime()));
    this.screenShot();
};

AssetRecordPipe.ID = ID;

AssetRecordPipe.prototype.handle = function (item) {
    this.recordFrame(item);
    return null;
};

AssetRecordPipe.prototype.screenShot = function () {
    S_INTERVAL_ID = setInterval(function () {
        let now = new Date().getTime();
        let recordInfo = _genRecordInfo(now);
        recordList.push(recordInfo);

        let size = cc.director.getWinSize();
        let current_scene = cc.director.getScene();
        if (current_scene) {
            let render = new cc.RenderTexture(size.width, size.height);
            let name = `${now}.jpg`;
            screenShot.push({name: name, rt: render});
            render.begin();
            current_scene.getChildByName("Canvas")._sgNode.visit();
            render.end();
            recordInfo.screenshot = name;
            console.log("name is ", name);

            render.saveToPath(`${CC_SIMULATOR_RECORD_PATH}/${name}`, cc.ImageFormat.JPG, true, function (err, data) {
                // cc.log("capture screen successfully!",err,data);
                // });
            });
        }

        jsb.fileUtils.writeStringToFile(JSON.stringify(recordList), `${CC_SIMULATOR_RECORD_PATH}/timeline.json`);
    }, RECORD_DELTA_TIME * 1000);
};

AssetRecordPipe.prototype.recordFrame = function (item) {
    let last_item = recordList[recordList.length - 1];
    last_item.items.push(_genItemInfo(item));

};

Pipeline.AssetRecordPipe = module.exports = AssetRecordPipe;
