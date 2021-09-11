import { assetManager } from "../../cocos/core/asset-manager";
import Config from "../../cocos/core/asset-manager/config";
import RequestItem from "../../cocos/core/asset-manager/request-item";
import { files } from '../../cocos/core/asset-manager/shared';

describe('pack-manager', function () {
    var packManager = assetManager.packManager;
    packManager.register('.json', function (pack, json, options, onComplete) {
        var out = {};
        if (Array.isArray(json)) {
            for (var i = 0; i < pack.length; i++) {
                out[pack[i] + '@import'] = json[i];
            }
            onComplete && onComplete(null, out);
        }
        else {
            packManager.unpackJson.apply(packManager, arguments);
        }
    });

    test('basic', function (done) {
        var PACKS = {
            "/01/01102378e.json": [
                "da9b7d82",
                "f9673f4b"
            ],
            "/01/01532d877.json": [
                "9b0754b9",
                "f10d21ed"
            ],
        };

        assetManager.downloader.download = function (id, url, type, options, onComplete) {
            onComplete(null, PACKS[url]);
        };

        const requestItem = new RequestItem;
        requestItem.uuid = 'f10d21ed';
        requestItem.info = {
            uuid: 'f10d21ed',
            packs: [{
                uuid: "01532d877",
                packedUuids: PACKS["/01/01532d877.json"], 
                ext: '.json'
            }]
        };
        requestItem.config = new Config();
        packManager.load(requestItem, null, function (err, data) {
            expect(data).toBe("f10d21ed");
            done();
        });
    });

    function testDuplicatedAssets (firstToLoad) {
        test('packs with duplicated assets, load pack ' + firstToLoad + ' first', function (done) {
            var PACKS = {
                "/PA/PACK 1.json": [
                    "A",
                    "1",
                ],
                "/PA/PACK 2.json": [
                    "A",
                    "2",
                ],
            };
    
            assetManager.downloader.download = function (id, url, type, options, onComplete) {
                onComplete(null, PACKS[url]);
            };
            //
            packManager.load(firstToLoad, null, function (err, data) {
                var result = files.remove('A@import');
                expect(result).toBe("A");
                done();
            });
        });
    }

    testDuplicatedAssets({ id: '1@import' , info: { packs: [{ uuid: "PACK 1", packedUuids: [ "A", "1" ], ext: '.json'}]},  config: {}});

    testDuplicatedAssets({ id: '2@import' , info: { packs: [{ uuid: "PACK 2", packedUuids: [ "A", "2" ], ext: '.json'}]},  config: {}});

    test('packs with duplicated assets, if no one downloaded', function (done) {
        var PACKS = {
            "/PA/PACK 1.json": [
                "1",
            ],
            "/PA/PACK 1.5.json": [
                "1",
                "2",
            ],
            "/PA/PACK 2.json": [
                "2",
            ],
        };

        assetManager.downloader.download = function (id, url, type, options, onComplete) {
            onComplete(null, PACKS[url]);
        };
        //
        files.clear();
        const config = new Config();
        const requestItem = new RequestItem();
        requestItem.uuid = "1";
        requestItem.config = config;
        requestItem.info = { uuid: '1', packs: [
            { uuid: "PACK 1", packedUuids: ["1"], ext: '.json'}, { uuid: "PACK 1.5", packedUuids: ["1", "2"], ext: '.json'},
        ]};
        const requestItem2 = new RequestItem();
        requestItem2.uuid = '2';
        requestItem2.config = config;
        requestItem2.info = { uuid: '2', packs: [
            { uuid: "PACK 2", packedUuids: ["2"], ext: '.json'}, { uuid: "PACK 1.5", packedUuids: ["1", "2"], ext: '.json'},
        ]};
        packManager.load(requestItem, null, function (err, data) {
            expect(files.count).toBe(1);
            files.clear();
            packManager.load(requestItem2, null, function (err, data) {
                expect(files.count).toBe(1);
                done();
            });
        });
    });
});