var Path = require('path');

// util methods
window.getAssetsPath = function () {
    [].splice.call(arguments, 0, 0, __dirname, 'fixtures/assets');

    return Path.resolve( Path.join.apply(Path, arguments) );
};



Editor.isRuntime = true;

// canvas assets
var Meta = Editor.require('app://asset-db/lib/meta');
Editor.metas = {
    asset: Meta.AssetMeta,
    folder: Meta.FolderMeta
};
Editor.assets = {};
Editor.inspectors = {};

// cocos
Editor.require('unpack://engine');

// init asset library
cc.AssetLibrary.init({
    libraryPath: Path.resolve(Path.join(__dirname, 'fixtures/library'))
});

describe('test wrappers', function () {
    // test wrappers
    var pageTests = [
        'engine',
        'scene',
        'node',
        'sprite',
        'bitmap-font',
        'button',
        'particle',
        'label-ttf',
        'scale9-sprite',
        "asset"
    ];

    var option = {
        width:  400,
        height: 400,
        id: 'gameCanvas'
    };

    it('init runtime', function(done) {
        cc.game.run(option, function () {
            cc.view.resizeWithBrowserSize(true);

            var scene = new _ccsg.Scene();

            // scene anchor point need be 0,0
            scene.setAnchorPoint(0.0, 0.0);

            cc.view.setFrameSize(width, height);

            cc.director.runScene(scene);
            cc.game.pause();

            pageTests.forEach( function (test) {
                require( Path.join(__dirname, 'page', test + '.js' ) );
            });

            done();
        });
    });
});
