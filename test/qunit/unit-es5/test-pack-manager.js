(function () {
    var packManager = cc.assetManager.packManager;
    var originTransform = cc.assetManager.transform;
    var originDownload = cc.assetManager.downloader.download;

    module('pack manager', {
        setup: function () {

        },
        teardown: function () {
            cc.assetManager.transform = originTransform;
            cc.assetManager.downloader.download = originDownload;
            cc.assetManager.packManager.init();
            cc.assetManager._files.clear();
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
        cc.assetManager.transform = function (uuid, options) {
            return uuid;
        };

        cc.assetManager.downloader.download = function (id, url, type, options, onComplete) {
            onComplete(null, PACKS[url]);
        }

        packManager.load({ id: "f10d21ed@import" , info: { packs: [{ uuid: "01532d877", packs: ["9b0754b9",
        "f10d21ed"], ext: '.json'}] }, config: {}}, null, function (err, data) {
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
            cc.assetManager.transform = function (uuid, options) {
                return uuid;
            };
    
            cc.assetManager.downloader.download = function (id, url, type, options, onComplete) {
                onComplete(null, PACKS[url]);
            }
            //
            packManager.load(firstToLoad, null, function (err, data) {
                var result = cc.assetManager._files.remove('A@import');
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
        cc.assetManager.transform = function (uuid, options) {
            return uuid;
        };

        cc.assetManager.downloader.download = function (id, url, type, options, onComplete) {
            onComplete(null, PACKS[url]);
        };
        //
        cc.assetManager._files.clear();
        packManager.load({ id: "1@import", config: {}, info: { packs: [
            { uuid: "PACK 1", packs: ["1"], ext: '.json'}, { uuid: "PACK 1.5", packs: ["1", "2"], ext: '.json'},
        ]}}, null, function (err, data) {
            strictEqual(cc.assetManager._files.count, 1, 'asset should load from smallest pack 1');
            cc.assetManager._files.clear();
            packManager.load({ id: "2@import", config: {}, info: { packs: [
                { uuid: "PACK 2", packs: ["2"], ext: '.json'}, { uuid: "PACK 1.5", packs: ["1", "2"], ext: '.json'},
            ]}}, null, function (err, data) {
                strictEqual(cc.assetManager._files.count, 1, 'asset should load from smallest pack 2');
                start();
            });
        });
    });
})();