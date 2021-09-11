import { Pipeline } from "../../cocos/core/asset-manager/pipeline";
import Task from "../../cocos/core/asset-manager/task";

describe('Pipeline', () => {
    var download = function (task, callback) {
        task.output = task.input;
        callback(null, null);
    };
    
    var load = function (task, callback) {
        task.output = task.input;
        callback(null, null);
    };
    
    var pipeline = new Pipeline('test', [download, load]);
    
    test('construction', function () {
        var pipes = pipeline.pipes;
        expect(pipes[0]).toBe(download);
        expect(pipes[1]).toBe(load);
        expect(pipeline.name).toBe('test');
    });
    
    test('operate pipe', function () {
        pipeline.insert(function () {}, 1);
        var pipes = pipeline.pipes;
        expect(pipes[0]).toBe(download);
        expect(pipes[2]).toBe(load);
        expect(pipes[1] !== load).toBeTruthy();
        expect(pipes.length).toBe(3);
        pipeline.remove(1);
        expect(pipes.length).toBe(2);
        expect(pipes[1]).toBe(load);
        pipeline.append(function () {});
        expect(pipes[1]).toBe(load);
        expect(pipes.length).toBe(3);
        pipeline.remove(2);
    });
    
    test('task', function () {
        var task = Task.create({input: [
            'res/Background.png',
            {
                url: 'res/scene.json',
                type: 'scene',
                name: 'scene'
            }
        ]});
    
        var source = task.source;
    
        expect(source).toBeTruthy();
        expect(source[0]).toBe('res/Background.png');
        expect(source[1].url).toBe('res/scene.json');
        expect(source.length).toBe(2);
        expect(task.input).toBe(source);
        expect(task.isFinish).toBeTruthy();
    
        task.recycle();
        expect(task.input).toBe(null);
    });
    
    test('pipeline flow', function () {
        var download = jest.fn(function (task, callback) {
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
        var load = jest.fn(function (task, callback) {
            task.output = task.input;
            callback(null, null);
        });
        var pipeline = new Pipeline('pipeline flow', [download, load]);
    
        var onComplete = jest.fn(function (error, items) {
            expect(error.message).toBe('res/Background.png');
        });
        var onProgress = jest.fn(() => {});

    
        var task = Task.create({ input: [
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
    
        expect(task.source.length).toBe(4);
        expect(task.input).toBe(task.source);
        expect(task.isFinish).toBe(true);
    
        expect(download).toBeCalledTimes(1);
        expect(load).toBeCalledTimes(0);
        expect(onComplete).toBeCalledTimes(1);
        expect(onProgress).toBeCalledTimes(1);
    });
    
    test('flow empty array', function (done) {
        var onComplete = jest.fn(function (error, items) {
            expect(onProgress).toBeCalledTimes(0);
            expect(error).toBe(null);
            expect(task.source.length).toBe(0);
            expect(items.length).toBe(0);
            done();
        });
        var onProgress = jest.fn(() => {});
    
        var task = Task.create({input: [], onProgress: onProgress, onComplete: onComplete});
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
        var pipeline = new Pipeline('sync', [parse, combine]);
    
        var task = Task.create({input: ['AAA', 'BBB']});
        var result = pipeline.sync(task);
        expect(result[0]).toBe('resources/import/2a/100101.123sawe');
        expect(result[1]).toBe('resources/native/1a/100101.sqwe123');
    });
    
    test('content manipulation', function (done) {
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
        var pipeline = new Pipeline('content manipulation', [init, download, load]);
    
        var onComplete = function (error, items) {
            expect(items.length).toBe(1);
            expect(items[0].content).toBe(items[0].url + '_Downloaded' + '_Loaded');
            done();
        };
    
        var onProgress = function (completed, total, item) {
            expect(completed).toBe(1);
        };
    
        var task = Task.create({input: [
            'res/Background.png',
            {
                url: 'res/scene.json',
                type: 'scene'
            },
            'res/role.plist',
            'res/role'
        ], onProgress: onProgress, onComplete: onComplete});
    
        pipeline.async(task);
    }, 2);
});