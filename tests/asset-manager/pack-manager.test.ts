import { assetManager } from "../../cocos/core/asset-manager";

(function () {
    var packManager = assetManager.packManager;
    var originTransform = assetManager._transform;
    var originDownload = assetManager.downloader.download;

    module('pack manager', {
        setup: function () {
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
        },
        teardown: function () {
            var packManager = assetManager.packManager;
            assetManager._transform = originTransform;
            assetManager.downloader.download = originDownload;
            packManager.init();
            packManager.register('.json', packManager.unpackJson);
            assetManager._files.clear();
        }
    });

    asyncTest('basic', function () {
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
        assetManager._transform = function (uuid, options) {
            return uuid;
        };

        assetManager.downloader.download = function (id, url, type, options, onComplete) {
            onComplete(null, PACKS[url]);
        };

        packManager.load({
            id: "f10d21ed@import" ,
            info: {
                packs: [{
                    uuid: "01532d877",
                    packs: PACKS["01532d877"], ext: '.json'
                }]
            },
            config: {}
        }, null, function (err, data) {
            ok(data === "f10d21ed", 'simple test');
            start();
        });
    });

    function testDuplicatedAssets (firstToLoad) {
        asyncTest('packs with duplicated assets, load pack ' + firstToLoad + ' first', function () {
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
            assetManager._transform = function (uuid, options) {
                return uuid;
            };
    
            assetManager.downloader.download = function (id, url, type, options, onComplete) {
                onComplete(null, PACKS[url]);
            };
            //
            packManager.load(firstToLoad, null, function (err, data) {
                var result = assetManager._files.remove('A@import');
                strictEqual(result, "A", 'loaded asset should be returned synchronously');
                start();
            });
        });
    }

    testDuplicatedAssets({ id: '1@import' , info: { packs: [{ uuid: "PACK 1", packs: [ "A", "1" ], ext: '.json'}]},  config: {}});

    testDuplicatedAssets({ id: '2@import' , info: { packs: [{ uuid: "PACK 2", packs: [ "A", "2" ], ext: '.json'}]},  config: {}});

    asyncTest('packs with duplicated assets, if no one downloaded', function () {
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
        assetManager._transform = function (uuid, options) {
            return uuid;
        };

        assetManager.downloader.download = function (id, url, type, options, onComplete) {
            onComplete(null, PACKS[url]);
        };
        //
        assetManager._files.clear();
        packManager.load({ id: "1@import", config: {}, info: { packs: [
            { uuid: "PACK 1", packs: ["1"], ext: '.json'}, { uuid: "PACK 1.5", packs: ["1", "2"], ext: '.json'},
        ]}}, null, function (err, data) {
            strictEqual(assetManager._files.count, 1, 'asset should load from smallest pack 1');
            assetManager._files.clear();
            packManager.load({ id: "2@import", config: {}, info: { packs: [
                { uuid: "PACK 2", packs: ["2"], ext: '.json'}, { uuid: "PACK 1.5", packs: ["1", "2"], ext: '.json'},
            ]}}, null, function (err, data) {
                strictEqual(assetManager._files.count, 1, 'asset should load from smallest pack 2');
                start();
            });
        });
    });
})();