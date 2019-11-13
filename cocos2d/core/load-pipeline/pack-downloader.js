/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

var Unpackers = require('./unpackers');
var pushToMap = require('../utils/misc').pushToMap;

// when more than one package contains the required asset,
// choose to load from the package with the largest state value.
var PackState = {
    Invalid: 0,
    Removed: 1,
    Downloading: 2,
    Loaded: 3,
};

function UnpackerData () {
    this.unpacker = null;
    this.state = PackState.Invalid;
    this.duration = 0;
}

// {assetUuid: packUuid|[packUuid]}
// If value is array of packUuid, then the first one will be prioritized for download,
// so the smallest pack must be at the beginning of the array.
var uuidToPack = {};

// {packUuid: assetIndices}
var packIndices = {};

// {packUuid: UnpackerData}
// We have to cache all packs in global because for now there's no operation context in loader.
var globalUnpackers = {};

var toBeChecked = [];

var timer = null;
var checkPeriod = 5000;

function error (uuid, packUuid) {
    return new Error('Can not retrieve ' + uuid + ' from packer ' + packUuid);
}

module.exports = {
    // two minutes
    msToRelease: 2 * 60 * 1000,

    initPacks: function (packs) {
        packIndices = packs;
        uuidToPack = {};
        for (var packUuid in packs) {
            var uuids = packs[packUuid];
            for (var i = 0; i < uuids.length; i++) {
                var uuid = uuids[i];
                // the smallest pack must be at the beginning of the array to download more first
                var pushFront = uuids.length === 1;
                pushToMap(uuidToPack, uuid, packUuid, pushFront);
            }
        }
    },

    _loadNewPack: function (uuid, packUuid, callback) {
        var self = this;
        var packUrl = cc.AssetLibrary.getLibUrlNoExt(packUuid) + '.json';
        cc.loader.load({ url: packUrl, ignoreMaxConcurrency: true }, function (err, packJson) {
            if (err) {
                cc.errorID(4916, uuid);
                return callback(err);
            }
            globalUnpackers[packUuid].url = packUrl;
            var res = self._doLoadNewPack(uuid, packUuid, packJson);
            if (res) {
                callback(null, res);
            }
            else {
                callback(error(uuid, packUuid));
            }
        });
    },

    _doPreload (packUuid, packJson) {
        var unpackerData = globalUnpackers[packUuid];
        if (!unpackerData) {
            unpackerData = globalUnpackers[packUuid] = new UnpackerData();
            unpackerData.state = PackState.Downloading;
        }
        if (unpackerData.state !== PackState.Loaded) {
            unpackerData.unpacker = new Unpackers.JsonUnpacker();
            unpackerData.unpacker.load(packIndices[packUuid], packJson);
            unpackerData.state = PackState.Loaded;
        }
        // can not release subdomain packed json because it would not be reloaded. 
    },

    _doLoadNewPack: function (uuid, packUuid, packedJson) {
        var unpackerData = globalUnpackers[packUuid];
        // double check cache after load
        if (unpackerData.state !== PackState.Loaded) {
            // init unpacker
            if (typeof packedJson === 'string') {
                packedJson = JSON.parse(packedJson);
            }
            if (Array.isArray(packedJson)) {
                unpackerData.unpacker = new Unpackers.JsonUnpacker();
            }
            else if (packedJson.type === Unpackers.TextureUnpacker.ID) {
                unpackerData.unpacker = new Unpackers.TextureUnpacker();
            }
            unpackerData.unpacker.load(packIndices[packUuid], packedJson);
            unpackerData.state = PackState.Loaded;
            unpackerData.duration = 0;
            toBeChecked.push(packUuid);
            var self = this;
            if (!timer) timer = setInterval(function () {
                var maxDuration = self.msToRelease / checkPeriod;
                for (var i = toBeChecked.length - 1; i >= 0; i--) {
                    var id = toBeChecked[i];
                    var pack = globalUnpackers[id];
                    if (++pack.duration > maxDuration) {
                        self.release(id);
                    }
                }
                if (toBeChecked.length === 0) { 
                    clearInterval(timer);
                    timer = null;
                }
            }, checkPeriod);
        }

        return unpackerData.unpacker.retrieve(uuid);
    },

    _selectLoadedPack: function (packUuids) {
        var existsPackState = PackState.Invalid;
        var existsPackUuid = '';
        for (var i = 0; i < packUuids.length; i++) {
            var packUuid = packUuids[i];
            var unpackerData = globalUnpackers[packUuid];
            if (unpackerData) {
                var state = unpackerData.state;
                if (state === PackState.Loaded) {
                    return packUuid;
                }
                else if (state > existsPackState) {     // load from the package with the largest state value,
                    existsPackState = state;
                    existsPackUuid = packUuid;
                }
            }
        }
                                                        // otherwise the first one (smallest one) will be load
        return existsPackState !== PackState.Invalid ? existsPackUuid : packUuids[0];
    },

    /**
     * @returns {Object} When returns undefined, the requested item is not in any pack, when returns null, the item is in a loading pack, when item json exists, it will return the result directly.
     */
    load: function (item, callback) {
        var uuid = item.uuid;
        var packUuid = uuidToPack[uuid];
        if (!packUuid) {
            // Return undefined to let caller know it's not recognized.
            // We don't use false here because changing return value type may cause jit fail, 
            // though return undefined may have the same issue.
            return;
        }

        if (Array.isArray(packUuid)) {
            packUuid = this._selectLoadedPack(packUuid);
        }

        var unpackerData = globalUnpackers[packUuid];
        if (unpackerData && unpackerData.state === PackState.Loaded) {
            // update duration
            unpackerData.duration = 0;
            // ensure async
            var json = unpackerData.unpacker.retrieve(uuid);
            if (json) {
                return json;
            }
            else {
                return error(uuid, packUuid);
            }
        }
        else {
            if (!unpackerData) {
                if (!CC_TEST) {
                    console.log('Create unpacker %s for %s', packUuid, uuid);
                }
                unpackerData = globalUnpackers[packUuid] = new UnpackerData();
                unpackerData.state = PackState.Downloading;
            }
            this._loadNewPack(uuid, packUuid, callback);
        }
        // Return null to let caller know it's loading asynchronously
        return null;
    },

    release (packUuid) {
        var unpackerData = globalUnpackers[packUuid];
        if (unpackerData) {
            cc.loader.release(unpackerData.url);
            delete globalUnpackers[packUuid];
            cc.js.array.fastRemove(toBeChecked, packUuid);
        }
    }
};

if (CC_TEST) {
    cc._Test.PackDownloader = module.exports;
    cc._Test.PackDownloader.reset = function () {
        uuidToPack = {};
        packIndices = {};
        globalUnpackers = {};
    };
}
