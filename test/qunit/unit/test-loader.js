largeModule('Loader');

asyncTest('Load', function () {
    var loader = new cc.Pipeline([
        new cc.Pipeline.Downloader(),
        new cc.Pipeline.Loader()
    ]);
    loader.load = function (resources, progressCallback, completeCallback) {
        if (completeCallback === undefined) {
            completeCallback = progressCallback;
            progressCallback = null;
        }

        this.onProgress = progressCallback;
        this.onComplete = completeCallback;

        this.flowIn(resources);
    };

    var image1 = assetDir + '/button.png';
    var json1 = assetDir + '/library/12/123200.json';
    var json2 = assetDir + '/library/deferred-loading/74/748321.json';
    var resources = [
        image1,
        json1,
        json2,
    ];

    loader.load(resources, function (completedCount, totalCount, item) {
        console.log((100 * completedCount / totalCount).toFixed(2) + '%');
        if (item.src === image1) {
            ok(item.content instanceof cc.Texture2D, 'image url\'s result should be Texture2D');
        }
        else if (item.src === json1) {
            strictEqual(item.content.width, 89, 'should give correct js object as result of JSON');
        }
        else if (item.src === json2) {
            strictEqual(item.content._rawFiles[0], 'YouKnowEverything', 'should give correct js object as result of JSON');
        }
        else {
            ok(false, 'should not load an unknown url');
        }
    }, function (items) {
        ok(items.isCompleted(), 'Able to load all resources');
        clearTimeout(timeoutId);
        start();
    });

    var timeoutId = setTimeout(function () {
        ok(false, 'time out!');
        start();
    }, 5000);
});

asyncTest('Load with dependencies', function () {
    var dep1 = assetDir + '/button.png';
    var dep2 = assetDir + '/library/12/123200.json';
    var dep3 = assetDir + '/library/65/6545543.png';

    function loadWithDeps (item, callback) {
        try {
            var result = JSON.parse(item.content);
        }
        catch (e) {
            callback( new Error('JSON Loader: Parse json [' + item.src + '] failed : ' + e) );
        }
        var resources = [
            dep1,
            dep2,
            dep3
        ];
        this.pipeline.flowInDeps(resources, function (deps) {
            callback(null, result);
        });
    }

    var loader = new cc.Pipeline([
        new cc.Pipeline.Downloader(),
        new cc.Pipeline.Loader({
            'deps': loadWithDeps
        })
    ]);
    loader.load = function (resources, progressCallback, completeCallback) {
        if (completeCallback === undefined) {
            completeCallback = progressCallback;
            progressCallback = null;
        }

        this.onProgress = new Callback(progressCallback).enable();
        this.onComplete = completeCallback;

        this.flowIn(resources);
    };

    var json1 = {
        src: assetDir + '/library/65/6545543',
        type: 'deps'
    };
    var json2 = assetDir + '/library/deferred-loading/74/748321.json';
    var resources = [
        json1,
        json2,
    ];

    var dep1Loaded = false;
    var dep2Loaded = false;
    var dep3Loaded = false;

    loader.load(resources, function (completedCount, totalCount, item) {
        console.log((100 * completedCount / totalCount).toFixed(2) + '%');
        if (item.src === json1.src) {
            var depsLoaded = this._items.isItemCompleted(dep1) &&
                             this._items.isItemCompleted(dep2) &&
                             this._items.isItemCompleted(dep3);
            ok(depsLoaded, 'should load all dependencies before complete parent resources');
            var depsCallbackCalled = dep1Loaded && dep2Loaded && dep3Loaded;
            ok(depsCallbackCalled, 'should call all dependencies complete callback before complete parent resources');
            strictEqual(item.content.__type__, 'TestTexture', 'should give correct js object as result of deps type');
        }
        else if (item.src === json2) {
            strictEqual(item.content._rawFiles[0], 'YouKnowEverything', 'should give correct js object as result of JSON');
        }
        else if (item.src === dep1) {
            dep1Loaded = true;
            ok(item.content instanceof cc.Texture2D, 'image url\'s result should be Texture2D');
        }
        else if (item.src === dep2) {
            dep2Loaded = true;
            strictEqual(item.content.width, 89, 'should give correct js object as result of JSON');
        }
        else if (item.src === dep3) {
            dep3Loaded = true;
            ok(item.content instanceof cc.Texture2D, 'image url\'s result should be Texture2D');
        }
        else {
            ok(false, 'should not load an unknown url: ' + item.src);
        }
    }, function (items) {
        ok(items.isCompleted(), 'be able to load all resources');
        this.onProgress.expect(5, 'should call 5 times progress callback for 5 resources');
        clearTimeout(timeoutId);
        start();
    });

    var timeoutId = setTimeout(function () {
        ok(false, 'time out!');
        start();
    }, 5000);
});