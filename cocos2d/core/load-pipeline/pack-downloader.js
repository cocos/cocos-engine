/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

var JsonUnpacker = require('./json-unpacker');

// {assetUuid: packUuid|[packUuid]}
// If value is array of packUuid, then the first one will be prioritized for download,
// so the smallest pack must be at the beginning of the array.
var uuidToPack = {};

// {packUuid: assetIndices}
var packIndices = {};

// {packUuid: JsonUnpacker}
// We have to cache all packs in global because for now there's no operation context in loader.
var globalUnpackers = {};

// when more than one package contains the required asset,
// choose to load from the package with the largest state value.
var PackState = {
    Invalid: 0,
    Removed: 1,
    Downloading: 2,
    Loaded: 3,
};

function error (callback, uuid, packUuid) {
    callback(new Error('Can not retrieve ' + uuid + ' from packer ' + packUuid));
}

module.exports = {
    initPacks: function (packs) {
        packIndices = packs;
        for (var packUuid in packs) {
            var uuids = packs[packUuid];
            for (var i = 0; i < uuids.length; i++) {
                var uuid = uuids[i];
                var allIncludedPacks = uuidToPack[uuid];
                if (allIncludedPacks) {
                    if (Array.isArray(allIncludedPacks)) {
                        allIncludedPacks.push(packUuid);
                    }
                    else {
                        uuidToPack[uuid] = allIncludedPacks = [allIncludedPacks, packUuid];
                    }
                    if (uuids.length === 1) {
                        // the smallest pack must be at the beginning of the array to download more first
                        var swapToLast = allIncludedPacks[0];
                        allIncludedPacks[0] = allIncludedPacks[allIncludedPacks.length - 1];
                        allIncludedPacks[allIncludedPacks.length - 1] = swapToLast;
                    }
                }
                else {
                    uuidToPack[uuid] = packUuid;
                }
            }
        }
    },

    _loadNewPack: function (uuid, packUuid, callback) {
        var self = this;
        var packUrl = cc.AssetLibrary.getImportedDir(packUuid) + '/' + packUuid + '.json';
        cc.loader.load({ url: packUrl, ignoreMaxConcurrency: true }, function (err, packJson) {
            if (err) {
                cc.errorID(4916, uuid);
                return callback(err);
            }
            var res = self._doLoadNewPack(uuid, packUuid, packJson);
            if (res) {
                callback(null, res);
            }
            else {
                error(callback, uuid, packUuid);
            }
        });
    },

    _doLoadNewPack: function (uuid, packUuid, packJson) {
        var unpacker = globalUnpackers[packUuid];
        // double check cache after load
        if (unpacker.state !== PackState.Loaded) {
            unpacker.read(packIndices[packUuid], packJson);
            unpacker.state = PackState.Loaded;
        }

        return unpacker.retrieve(uuid);
    },

    _selectLoadedPack: function (packUuids) {
        var existsPackState = PackState.Invalid;
        var existsPackUuid = '';
        for (var i = 0; i < packUuids.length; i++) {
            var packUuid = packUuids[i];
            var unpacker = globalUnpackers[packUuid];
            if (unpacker) {
                var state = unpacker.state;
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
     * @returns {Boolean} specify whether loaded by pack
     */
    load: function (item, callback) {
        var uuid = item.uuid;
        var packUuid = uuidToPack[uuid];
        if (!packUuid) {
            return false;
        }

        if (Array.isArray(packUuid)) {
            packUuid = this._selectLoadedPack(packUuid);
        }

        var unpacker = globalUnpackers[packUuid];
        if (unpacker && unpacker.state === PackState.Loaded) {
            // ensure async
            setTimeout(function () {
                var json = unpacker.retrieve(uuid);
                if (json) {
                    callback(null, json);
                }
                else {
                    error(callback, uuid, packUuid);
                }
            }, 0);
        }
        else {
            if (!unpacker) {
                if (!CC_TEST) {
                    console.log('Create unpacker %s for %s', packUuid, uuid);
                }
                unpacker = globalUnpackers[packUuid] = new JsonUnpacker();
                unpacker.state = PackState.Downloading;
            }
            this._loadNewPack(uuid, packUuid, callback);
        }
        return true;
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
