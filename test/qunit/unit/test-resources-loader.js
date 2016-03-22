(function () {

    module('load resources', {
        setup: function () {
            _resetGame();
            AssetLibrary.init({
                libraryPath: assetDir + '/library',
                rawAssetsBase: cc.path.dirname(cc.path._setEndWithSep(assetDir, false) + '.dummyExtForDirname') + '/',
                rawAssets: {
                    assets: {
                        '748321': { url: 'resources/grossini.png', raw: true }
                    }
                }
            });
        }
    });

    asyncTest('load single', function () {
        cc.loader.releaseAll();
        cc.loader.loadRes('grossini.png', function (err, texture) {
            ok(texture instanceof cc.Texture2D, 'should be able to load texture without file extname');
            clearTimeout(timeoutId);
            start();
        });

        var timeoutId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 5000);
    });

})();
