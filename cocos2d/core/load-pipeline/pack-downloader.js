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
var downloadText = require('./text-downloader');

// {assetUuid: packUuid}
var uuidToPack = {};
// {packUuid: assetIndices}
var packIndices = {};

// {packUuid: JsonUnpacker}
// We have to cache all packs in global because for now there's no operation context in loader.
var globalUnpackers = {};

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
                uuidToPack[uuid] = packUuid;
            }
        }
    },
    //getPackUuid: function (uuid) {
    //    return uuidToPack[uuid];
    //},

    _loadNewPack: function (uuid, packUuid, callback) {
        var packUrl = cc.AssetLibrary.getImportedDir(packUuid) + '/' + packUuid + '.json';
        downloadText({ url: packUrl }, function (err, packJson) {
            if (err) {
                cc.error('Failed to download package for ' + uuid);
                return callback(err);
            }
            // double check cache after load
            var unpacker = globalUnpackers[packUuid];
            if (!unpacker) {
                console.log('Load pack %s for %s', packUuid, uuid);
                unpacker = globalUnpackers[packUuid] = new JsonUnpacker();
            }
            unpacker.read(packIndices[packUuid], packJson);
            var json = unpacker.retrieve(uuid);
            if (json) {
                callback(null, json);
            }
            else {
                error(callback, uuid, packUuid);
            }
        });
        //var packItem = {
        //    id: packUrl,
        //    type: 'json',
        //    uuid: packUuid
        //};
        //pipeline.flowInDeps(depends, function (items) {
        //});
    },

    /**
     * @returns {Boolean} specify whether loaded by pack
     */
    load: function (item, callback) {
        var uuid = item.id;
        var packUuid = uuidToPack[uuid];
        if (!packUuid) {
            return false;
        }

        var unpacker = globalUnpackers[packUuid];
        if (unpacker) {
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
            this._loadNewPack(uuid, packUuid, callback);
        }
        return true;
    }
};
