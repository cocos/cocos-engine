import { assetManager } from "../../cocos/core/asset-manager";
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

    test('basic', function () {
        var PACKS = {
            "01102378e": [
                "da9b7d82",
                "f9673f4b"
            ],
            "01532d877": [
                "9b0754b9",
                "f10d21ed"
            ],
        };

        assetManager.downloader.download = function (id, url, type, options, onComplete) {
            onComplete(null, PACKS[url]);
        };

        packManager.load({
            id: "f10d21ed@import" ,
            info: {
                packs: [{
                    uuid: "01532d877",
                    packs: PACKS["01532d877"], 
                    ext: '.json'
                }]
            },
            config: {} as any
        }, null, function (err, data) {
            expect(data).toBe("f10d21ed");
        });
    });

    function testDuplicatedAssets (firstToLoad) {
        test('packs with duplicated assets, load pack ' + firstToLoad + ' first', function () {
            var PACKS = {
                "PACK 1": [
                    "A",
                    "1",
                ],
                "PACK 2": [
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
            });
        });
    }

    testDuplicatedAssets({ id: '1@import' , info: { packs: [{ uuid: "PACK 1", packs: [ "A", "1" ], ext: '.json'}]},  config: {}});

    testDuplicatedAssets({ id: '2@import' , info: { packs: [{ uuid: "PACK 2", packs: [ "A", "2" ], ext: '.json'}]},  config: {}});

    test('packs with duplicated assets, if no one downloaded', function () {
        var PACKS = {
            "PACK 1": [
                "1",
            ],
            "PACK 1.5": [
                "1",
                "2",
            ],
            "PACK 2": [
                "2",
            ],
        };

        assetManager.downloader.download = function (id, url, type, options, onComplete) {
            onComplete(null, PACKS[url]);
        };
        //
        files.clear();
        packManager.load({ id: "1@import", config: {}, info: { packs: [
            { uuid: "PACK 1", packs: ["1"], ext: '.json'}, { uuid: "PACK 1.5", packs: ["1", "2"], ext: '.json'},
        ]}}, null, function (err, data) {
            expect(files.count).toBe(1);
            files.clear();
            packManager.load({ id: "2@import", config: {}, info: { packs: [
                { uuid: "PACK 2", packs: ["2"], ext: '.json'}, { uuid: "PACK 1.5", packs: ["1", "2"], ext: '.json'},
            ]}}, null, function (err, data) {
                expect(files.count).toBe(1);
            });
        });
    });
});