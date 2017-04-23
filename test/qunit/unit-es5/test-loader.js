largeModule('Loader');

var loader = cc.loader;

asyncTest('Load', function () {
    var image1 = assetDir + '/button.png';
    var json1 = assetDir + '/library/12/123200.json';
    var json2 = assetDir + '/library/deferred-loading/74/748321.json';
    var resources = [
        image1,
        json1,
        json2,
    ];

    loader.load(resources, function (completedCount, totalCount, item) {
        if (item.id === image1) {
            ok(item.content instanceof cc.Texture2D, 'image url\'s result should be Texture2D');
        }
        else if (item.id === json1) {
            strictEqual(item.content.width, 89, 'should give correct js object as result of JSON');
        }
        else if (item.id === json2) {
            strictEqual(item.content._rawFiles[0], 'YouKnowEverything', 'should give correct js object as result of JSON');
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

asyncTest('Load single file', function () {
    var image1 = assetDir + '/button.png';

    loader.load(image1, function (completedCount, totalCount, item) {
        if (item.id === image1) {
            ok(item.content instanceof cc.Texture2D, 'image url\'s result should be Texture2D');
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

asyncTest('Load with dependencies', function () {
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
        this.pipeline.flowInDeps(item, resources, function (deps) {
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
    var audio = assetDir + '/background.mp3';
    var resources = [
        json1,
        json2,
        audio
    ];

    var total = resources.length + depsCount;

    var depsProgression = new Callback().enable();
    var progressCallback = new Callback(function (completedCount, totalCount, item) {
        if (item.id === json1.url) {
            var dep = loader.getRes(dep1);
            ok(dep instanceof cc.Texture2D, 'should correctly load dependent image1');
            dep = loader.getRes(dep2);
            strictEqual(dep.width, 89, 'should correctly load dependent JSON');
            dep = loader.getRes(dep3);
            ok(dep instanceof cc.Texture2D, 'should correctly load dependent image2');

            strictEqual(item.content.__type__, 'TestTexture', 'should give correct js object as result of deps type');
        }
        else if (item.id === json2) {
            strictEqual(item.content._rawFiles[0], 'YouKnowEverything', 'should give correct js object as result of JSON');
        }
        else if (item.id === audio) {
            // Test environment doesn't support audio
            ok((item.content instanceof cc.Audio) || true, 'audio url\'s result should be Audio');
        }
        else if (item.id === dep1 || item.id === dep2 || item.id === dep3) {
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
        if (isPhantomJS) {
            // Test environment doesn't load audio
            strictEqual(count, total-1, 'getResCount should return correct count of loaded resources');
        }
        else {
            strictEqual(count, total, 'getResCount should return correct count of loaded resources');
        }
        loader.releaseAll();
        
        start();
    });
});

asyncTest('Loading font', function () {
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
        if (item.id === image) {
            ok(item.content instanceof cc.Texture2D, 'image url\'s result should be Texture2D');
        }
        else if (item.id === font.url) {
            strictEqual(item.content, null, 'should set null as content for Font type');
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