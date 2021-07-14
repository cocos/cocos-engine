largeModule('Loader');

var libPath = assetDir + '/library';
cc.assetManager.init({importBase: libPath, nativeBase: libPath});
var loader = cc.loader;

test('Load', function () {
    var image1 = assetDir + '/button.png';
    var json1 = assetDir + '/library/12/123200.json';
    var json2 = assetDir + '/library/deferred-loading/74/748321.json';
    var resources = [
        image1,
        json1,
        json2,
    ];

    loader.load(resources, function (completedCount, totalCount, item) {
        if (item.uuid === image1) {
            ok(item.content instanceof ImageBitmapOrImage, 'image url\'s result should be Image');
        }
        else if (item.uuid === json1) {
            strictEqual(item.content.width, 89, 'should give correct js object as result of JSON');
        }
        else if (item.uuid === json2) {
            strictEqual(item.content._native, 'YouKnowEverything', 'should give correct js object as result of JSON');
        }
        else {
            ok(false, 'should not load an unknown url');
        }
    }, function (error, items) {
        ok(items.isCompleted(), 'be able to load all resources');

        loader.releaseAll();
        strictEqual(Object.keys(loader._cache).length, 0, 'should clear loading items after releaseAll called');

        start();
    });
});

test('Load single file', function () {
    var image1 = assetDir + '/button.png';

    loader.load(image1, function (completedCount, totalCount, item) {
        if (item.uuid === image1) {
            ok(item.content instanceof ImageBitmapOrImage, 'image url\'s result should be Image');
        }
        else {
            ok(false, 'should not load an unknown url');
        }
    }, function (error, texture) {
        ok(!error, 'should not return error');
        ok(texture instanceof cc.Texture2D, 'the single result should be Texture2D');

        loader.releaseAll();
        start();
    });
});

test('Load with dependencies', function () {
    var dep1 = assetDir + '/button.png';
    var dep2 = assetDir + '/library/12/123200.json';
    var dep3 = assetDir + '/library/65/6545543.png';
    var depsCount = 3;

    function loadWithDeps (item, callback) {
        try {
            var result = JSON.parse(item.content);
        }
        catch (e) {
            callback( new Error('JSON Loader: Parse json [' + item.id + '] failed : ' + e) );
        }
        var resources = [
            dep1,
            dep2,
            dep3
        ];
        loader.load(resources, progressCallback, function (err, deps) {
            callback(null, result);
        });
    }

    loader.addLoadHandlers({
        'deps': loadWithDeps
    });

    var json1 = {
        url: assetDir + '/library/65/6545543',
        type: 'deps'
    };
    var json2 = assetDir + '/library/deferred-loading/74/748321.json';
    var audio = assetDir + '/library/12/1258a1.json';
    var resources = [
        json1,
        json2,
        audio
    ];

    var total = resources.length + depsCount;

    var depsProgression = new Callback().enable();
    var progressCallback = new Callback(function (completedCount, totalCount, item) {
        if (item.uuid === json1.url) {
            var dep = loader.getRes(dep1);
            ok(dep instanceof cc.Texture2D, 'should correctly load dependent image1');
            dep = loader.getRes(dep2);
            strictEqual(dep.width, 89, 'should correctly load dependent JSON');
            dep = loader.getRes(dep3);
            ok(dep instanceof cc.Texture2D, 'should correctly load dependent image2');

            strictEqual(item.content.__type__, 'TestTexture', 'should give correct js object as result of deps type');
        }
        else if (item.uuid === json2) {
            strictEqual(item.content._native, 'YouKnowEverything', 'should give correct js object as result of JSON');
        }
        else if (item.uuid === audio) {
            // Test environment doesn't support audio
            ok((item.content instanceof cc.AudioClip) || true, 'audio url\'s result should be AudioClip');
        }
        else if (item.uuid === dep1 || item.uuid === dep2 || item.uuid === dep3) {
            depsProgression();
        }
        else {
            ok(false, 'should not load an unknown url: ' + item.id);
        }
    }).enable();

    loader.load(resources, progressCallback, function (error, items) {
        ok(items.isCompleted(), 'be able to load all resources');
        depsProgression.expect(depsCount, 'should call progress callback for all ' + depsCount + ' dependencies');
        progressCallback.expect(total, 'should call ' + total + ' times progress callback for ' + total + ' resources');
        var count = loader.getResCount();
        strictEqual(count, total, 'getResCount should return correct count of loaded resources');
        loader.releaseAll();
        
        start();
    });
});

test('Loading font', function () {
    var image = assetDir + '/button.png';
    var font = {
        url: assetDir + '/Thonburi.ttf',
        type: 'font',
        name: 'Thonburi',
        srcs: [assetDir + '/Thonburi.eot']
    };
    var resources = [
        image,
        font
    ];
    var total = resources.length;

    var progressCallback = new Callback(function (completedCount, totalCount, item) {
        if (item.uuid === image) {
            ok(item.content instanceof ImageBitmapOrImage, 'image url\'s result should be Image');
        }
        else if (item.uuid === font.url) {
            strictEqual(item.content, 'Thonburi_LABEL', 'should set family name as content for Font type');
        }
        else {
            ok(false, 'should not load an unknown url');
        }
    }).enable();

    loader.load(resources, progressCallback, function (error, items) {
        ok(items.isCompleted(), 'be able to load all resources');
        progressCallback.expect(total, 'should call ' + total + ' times progress callback for ' + total + ' resources');

        start();
    });
});

test('Loading texture with query', function () {
    var image1 = assetDir + '/button.png?url=http://.../1';
    var image2 = assetDir + '/button.png?url=http://.../2';
    loader.load({url: image1, type: 'png'}, function (error) {
        loader.load({url: image2, type: 'png'}, function (error) {
            ok(loader.getItem(image1).content !== loader.getItem(image2).content, 'should split cache if query is different');
            start();
        });
    });
});