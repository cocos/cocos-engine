
var JsonUnpacker = require('./json-unpacker');

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
        cc.loader.load(packUrl, function (err, packJson) {
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
            var json = unpacker.retrieve(uuid);
            if (json) {
                callback(null, json);
            }
            else {
                error(callback, uuid, packUuid);
            }
        }
        else {
            this._loadNewPack(uuid, packUuid, callback);
        }
        return true;
    }
};
