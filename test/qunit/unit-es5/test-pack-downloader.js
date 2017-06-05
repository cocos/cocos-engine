(function () {
    var PackDownloader = cc._Test.PackDownloader;
    var originLoadNewPack = PackDownloader._loadNewPack;

    module('Pack Downloader', {
        setup: function () {
            // PackDownloader._loadNewPack = ;
        },
        teardown: function () {
            PackDownloader._loadNewPack = originLoadNewPack;
            PackDownloader.reset();
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
        PackDownloader._loadNewPack = function (uuid, packUuid, callback) {
            var packIndices = PACKS[packUuid];
            var packValue = packIndices;
            var res = this._doLoadNewPack(uuid, packUuid, packValue);
            callback(null, res);
        };
        PackDownloader.initPacks(PACKS);
        var result = PackDownloader.load({ uuid: "f10d21ed" }, function (err, data) {
            ok(data === "f10d21ed", 'simple test');
            start();
        });
        if (!!result) {
            ok(result === "f10d21ed", 'simple test');
            start();
        }
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
            var lastLoadedPackUuid = '';
            PackDownloader._loadNewPack = function (uuid, packUuid, callback) {
                lastLoadedPackUuid = packUuid;
                var packIndices = PACKS[packUuid];
                var packValue = packIndices;
                var res = this._doLoadNewPack(uuid, packUuid, packValue);
                callback(null, res);
            };
            PackDownloader.initPacks(PACKS);
            //
            PackDownloader.load({ uuid: "" + firstToLoad }, function (err, data) {
                var result = PackDownloader.load({ uuid: "A" });
                strictEqual(result, "A", 'loaded asset should be returned synchronously');
                strictEqual(lastLoadedPackUuid, 'PACK ' + firstToLoad, 'asset should load from previous loaded pack');
                start();
            });
        });
    }

    testDuplicatedAssets(1);
    testDuplicatedAssets(2);

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
        var lastLoadedPackUuid = '';
        PackDownloader._loadNewPack = function (uuid, packUuid, callback) {
            lastLoadedPackUuid = packUuid;
            var packIndices = PACKS[packUuid];
            var packValue = packIndices;
            var res = this._doLoadNewPack(uuid, packUuid, packValue);
            callback(null, res);
        };
        PackDownloader.initPacks(PACKS);
        //
        PackDownloader.load({ uuid: "1" }, function (err, data) {
            strictEqual(lastLoadedPackUuid, 'PACK 1', 'asset should load from smallest pack 1');
            PackDownloader.load({ uuid: "2" }, function (err, data) {
                strictEqual(lastLoadedPackUuid, 'PACK 2', 'asset should load from smallest pack 2');
                start();
            });
        });
    });
})();