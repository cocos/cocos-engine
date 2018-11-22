largeModule('Pipeline');

(function () {

var download = function (item, callback) {
    callback(null, null);
};

var load = function () {};

var pipeline = new cc.Pipeline([
    {
        id: 'Downloader',
        handle: download,
        async: true
    },
    {
        id: 'Loader',
        handle: load,
        async: false
    }
]);

test('construction', function () {
    var pipes = pipeline._pipes;

    strictEqual(pipes[0].id, 'Downloader', 'should have first pipe id equal to Downloader');
    strictEqual(pipes[1].id, 'Loader', 'should have second pipe id equal to Loader');
    strictEqual(pipes[0].handle, download, 'should have first pipe use download function as handle');
    strictEqual(pipes[1].handle, load, 'should have second pipe use load function as handle');
    strictEqual(pipes[0].async, true, 'should set first pipe asynchronous');
    strictEqual(pipes[1].async, false, 'should set second pipe synchronous');
    strictEqual(pipes[0].pipeline, pipeline, 'should set first pipe\'s pipeline property');
    strictEqual(pipes[1].pipeline, pipeline, 'should set second pipe\'s pipeline property');
    strictEqual(pipes[0].next, pipes[1], 'should set first pipe\'s next as second pipe');
    strictEqual(pipes[1].next, null, 'should set last pipe\' next as null');
});

test('items', function () {
    var items = cc.LoadingItems.create(pipeline, [
        'res/Background.png',
        {
            url: 'res/scene.json',
            type: 'scene',
            name: 'scene'
        }
    ]);

    var map = items.map;
    var background = map['res/Background.png'];
    var scene = map['res/scene.json'];

    ok(background, 'should have background image');
    ok(scene, 'should have scene');
    strictEqual(background.type, 'png', 'should extract extension as type');
    strictEqual(scene.type, 'scene', 'should use custom type if specified');

    items.append([
        'res/scene.json',
        'res/role.plist',
        'res/role.png'
    ]);

    var scene2 = map['res/scene.json'];
    var role = map['res/role.plist'];

    ok(role, 'can append items');
    strictEqual(scene2, scene, 'shouldn\'t add new item for existing url');
    strictEqual(scene2.name, 'scene', 'should be able to set custom property of item');
    strictEqual(items.totalCount, 4, 'should now hold 4 items in total');

    pipeline.clear();
    strictEqual(Object.keys(pipeline._cache).length, 0, 'should hold 0 item after clear');
});

test('pipeline flow', function () {
    var download = new Callback(function (item, callback) {
        if (!item.type) {
            callback('Error');
        }
        else {
            callback(null, null);
        }
    });
    var load = new Callback(function () {
        return null;
    });
    var pipeline = new cc.Pipeline([
        {
            id: 'Downloader',
            handle: download,
            async: true
        },
        {
            id: 'Loader',
            handle: load,
            async: false
        }
    ]);

    var onComplete = new Callback(function (error, items) {
        ok(error instanceof Array, 'should return error array in onComplete when error happened');
        strictEqual(error[0], 'res/role', 'should contains correct errored url in error array');
        ok(items.getError('res/role') !== null, 'should set error property in errored item.');
    }).enable();
    var onProgress = new Callback().enable();

    download.enable();
    load.enable();

    var items = cc.LoadingItems.create(pipeline, [
        'res/Background.png',
        {
            url: 'res/scene.json',
            type: 'scene',
            name: 'scene'
        },
        'res/role.plist',
        'res/role'
    ], onProgress, onComplete);

    strictEqual(items.totalCount, 4, 'should hold 4 items in total');
    strictEqual(items.completedCount, 4, 'should complete all 4 items');
    strictEqual(items.isCompleted(), true, 'should be completed');
    strictEqual(Object.keys(pipeline._cache).length, 3, 'should hold all 3 succeed items in pipeline cache');
    download.expect(4, 'should call download for each item');
    load.expect(3, 'should call load for each item successfully passed from download');
    onComplete.expect(1, 'should call onComplete callback');
    onProgress.expect(4, 'should call onProgress callback 4 times');
});

test('flow empty array', function () {
    var onComplete = new Callback(function (error, items) {
        onProgress.expect(0, 'shouldn\'t call onProgress after flowIn empty array');
        strictEqual(error, null, 'shouldn\'t return error after flowIn empty array');
        strictEqual(items.totalCount, 0, 'should contains zero item in items');
        strictEqual(items.completedCount, 0, 'should contains zero completed item');
    }).enable();
    var onProgress = new Callback().enable();

    var items = cc.LoadingItems.create(pipeline, [], onProgress, onComplete);
});

asyncTest('content manipulation', function () {
    var init = function (item) {
        if (!item.type) {
            return new Error('No type found');
        }
        else {
            return item.id;
        }
    };
    var download = function (item, callback) {
        setTimeout(function () {
            callback(null, item.content + '_Downloaded');
        }, 1);
    };
    var load = function (item) {
        return item.content + '_Loaded';
    };
    var pipeline = new cc.Pipeline([
        {
            id: 'DataIniter',
            handle: init,
            async: false
        },
        {
            id: 'Downloader',
            handle: download,
            async: true
        },
        {
            id: 'Loader',
            handle: load,
            async: false
        }
    ]);

    var onComplete = function (error, items) {
        ok(true, 'should call onComplete at the end');
        strictEqual(items.completedCount, 4, 'should complete all 4 items');
        strictEqual(items.isCompleted(), true, 'should be completed');

        for (var url in items.map) {
            var item = items.map[url];
            if (url === 'res/role') {
                strictEqual(item.content, null, 'should have no content in failed item');
            }
            else {
                strictEqual(item.content, url + '_Downloaded' + '_Loaded', 'should have correct result after pipeline process');
            }
        }
        clearTimeout(timeoutId);
        start();
    };
    var urls = {
        'res/Background.png': 0,
        'res/scene.json': 0,
        'res/role.plist': 0,
        'res/role': 0
    };
    var count = 0;
    var onProgress = function (completed, total, item) {
        var url = item.id;
        urls[url]++;
        if (url === 'res/role') {
            ok(item.error instanceof Error, 'should fail on item without type');
            strictEqual(item.states['DataIniter'], cc.Pipeline.ItemState.ERROR, 'should set DataIniter state to ERROR while failed');
        }
        else {
            strictEqual(item.states['DataIniter'], cc.Pipeline.ItemState.COMPLETE, 'should set DataIniter state to COMPLETE while completed');
            strictEqual(item.states['Downloader'], cc.Pipeline.ItemState.COMPLETE, 'should set Downloader state to COMPLETE while completed');
            strictEqual(item.states['Loader'], cc.Pipeline.ItemState.COMPLETE, 'should set Loader state to COMPLETE while completed');
        }
        strictEqual(urls[url], 1, 'should only complete once for each item');
        count++;
        strictEqual(completed, count, 'should increase completed count by one');
    };

    var items = cc.LoadingItems.create(pipeline, [
        'res/Background.png',
        {
            url: 'res/scene.json',
            type: 'scene'
        },
        'res/role.plist',
        'res/role'
    ], onProgress, onComplete);

    var timeoutId = setTimeout(function () {
        ok(false, 'time out!');
        start();
    }, 2);
});

})();
