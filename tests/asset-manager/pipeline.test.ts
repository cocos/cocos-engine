module('Pipeline');

(function () {

var download = function (task, callback) {
    task.output = task.input;
    callback(null, null);
};

var load = function (task, callback) {
    task.output = task.input;
    callback(null, null);
};

var pipeline = new cc.AssetManager.Pipeline('test', [download, load]);

test('construction', function () {
    var pipes = pipeline.pipes;
    strictEqual(pipes[0], download, 'should have first pipe id equal to Downloader');
    strictEqual(pipes[1], load, 'should have second pipe id equal to Loader');
    strictEqual(pipeline.name, 'test', 'should have name equal to test');
});

test('operate pipe', function () {
    pipeline.insert(function () {}, 1);
    var pipes = pipeline.pipes;
    strictEqual(pipes[0], download, 'should have first pipe equal to Downloader');
    strictEqual(pipes[2], load, 'should have third pipe equal to Loader');
    ok(pipes[1] !== load, 'should have second pipe equal to new pipe');
    strictEqual(pipes.length, 3, 'should have three pipes');
    pipeline.remove(1);
    strictEqual(pipes.length, 2, 'should have two pipes');
    strictEqual(pipes[1], load, 'should have second pipe equal to Loader');
    pipeline.append(function () {});
    strictEqual(pipes[1], load, 'should have second pipe equal to Loader');
    strictEqual(pipes.length, 3, 'should have three pipes');
    pipeline.remove(2);
});

test('task', function () {
    var task = cc.AssetManager.Task.create({input: [
        'res/Background.png',
        {
            url: 'res/scene.json',
            type: 'scene',
            name: 'scene'
        }
    ]});

    var source = task.source;

    ok(source, 'should have source');
    strictEqual(source[0], 'res/Background.png', 'should have background');
    strictEqual(source[1].url, 'res/scene.json', 'should have scene');
    strictEqual(source.length, 2, 'should have 2 input');
    strictEqual(task.input, source, 'should have input equal to source');
    strictEqual(task.isFinish, true, 'should have isFinish equal to true');

    task.recycle();
    strictEqual(task.input, null, 'should hold 0 item after recycle');
});

test('pipeline flow', function () {
    var download = new Callback(function (task, callback) {
        var input = task.input;
        for (var i = 0; i < input.length; i++) {
            var item = input[i];
            if (!item.type) {
                return callback(new Error(item));
            }
            else {
                task.dispatch('progress', i, input.length, item);
            }
        }
        callback(null, null);
        
    });
    var load = new Callback(function (task, callback) {
        task.output = task.input;
        callback(null, null);
    });
    var pipeline = new cc.AssetManager.Pipeline('pipeline flow', [download, load]);

    var onComplete = new Callback(function (error, items) {
        strictEqual(error.message, 'res/Background.png', 'should contains correct errored url in error object');
    }).enable();
    var onProgress = new Callback().enable();

    download.enable();
    load.enable();

    var task = cc.AssetManager.Task.create({ input: [
        {
            url: 'res/scene.json',
            type: 'scene',
            name: 'scene'
        },
        'res/Background.png',
        'res/role.plist',
        'res/role'
    ], onProgress: onProgress, onComplete: onComplete});

    pipeline.async(task);

    strictEqual(task.source.length, 4, 'should hold 4 items in total');
    strictEqual(task.input, task.source, 'should have input equal to source');
    strictEqual(task.isFinish, true, 'should be completed');

    download.expect(1, 'should call download');
    load.expect(0, 'should not call load');
    onComplete.expect(1, 'should call onComplete callback');
    onProgress.expect(1, 'should call onProgress callback 1 times');
});

test('flow empty array', function () {
    var onComplete = new Callback(function (error, items) {
        onProgress.expect(0, 'shouldn\'t call onProgress after flowIn empty array');
        strictEqual(error, null, 'shouldn\'t return error after flowIn empty array');
        strictEqual(task.source.length, 0, 'should contains zero item in items');
        strictEqual(items.length, 0, 'should contains zero completed item');
    }).enable();
    var onProgress = new Callback().enable();

    var task = cc.AssetManager.Task.create({input: [], onProgress: onProgress, onComplete: onComplete});
    pipeline.async(task);
});

test('sync', function () {
    var map = {
        'AAA': 'resources/import/2a/100101',
        'BBB': 'resources/native/1a/100101'
    };
    var md5Map = {
        'resources/import/2a/100101': '123sawe',
        'resources/native/1a/100101': 'sqwe123'
    };
    var parse = function (task) {
        var output = [];
        for (var i = 0, l = task.input.length; i < l; i++) {
            var str = task.input[i];
            output.push(map[str]);
        }
        task.output = output;
    };
    var combine = function (task) {
        var output = [];
        for (var i = 0, l = task.input.length; i < l; i++) {
            var str = task.input[i];
            output.push(str + '.' + md5Map[str]);
        }
        task.output = output;
    }
    var pipeline = new cc.AssetManager.Pipeline('sync', [parse, combine]);

    var task = cc.AssetManager.Task.create({input: ['AAA', 'BBB']});
    var result = pipeline.sync(task);
    strictEqual(result[0], 'resources/import/2a/100101.123sawe', 'should equal to resources/import/2a/100101.123sawe');
    strictEqual(result[1], 'resources/native/1a/100101.sqwe123', 'should equal to resources/native/1a/100101.sqwe123');
});

asyncTest('content manipulation', function () {
    var init = function (task, callback) {
        var input = task.input;
        var output = task.output = [];
        for (var i = 0; i < input.length; i++) {
            var item = input[i];
            if (!item.type) {
                continue;
            }
            else {
                item.content = item.url;
                task.onProgress(i, input.length, item);
                output.push(item);
            }
        }
        callback(null);
    };
    var download = function (task, callback) {
        setTimeout(function () {
            var input = task.input;
            task.output = input;
            for (var i = 0; i < input.length; i++) {
                var item = input[i];
                item.content += '_Downloaded';
            }
            callback(null);
        }, 1);
    };
    var load = function (task, callback) {
        var input = task.input;
        task.output = input;
        for (var i = 0; i < input.length; i++) {
            var item = input[i];
            item.content += '_Loaded';
        }
        callback(null);
    };
    var pipeline = new cc.AssetManager.Pipeline('content manipulation', [init, download, load]);

    var onComplete = function (error, items) {
        ok(true, 'should call onComplete at the end');
        strictEqual(items.length, 1, 'should complete 1 items');
        strictEqual(items[0].content, items[0].url + '_Downloaded' + '_Loaded', 'should have correct result after pipeline process');
        clearTimeout(timeoutId);
        start();
    };

    var onProgress = function (completed, total, item) {
        strictEqual(completed, 1, 'should dispatch onProgress');
    };

    var task = cc.AssetManager.Task.create({input: [
        'res/Background.png',
        {
            url: 'res/scene.json',
            type: 'scene'
        },
        'res/role.plist',
        'res/role'
    ], onProgress: onProgress, onComplete: onComplete});

    pipeline.async(task);

    var timeoutId = setTimeout(function () {
        ok(false, 'time out!');
        start();
    }, 2);
});

})();