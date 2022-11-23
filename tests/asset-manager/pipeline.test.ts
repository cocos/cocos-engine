import { Pipeline } from "../../cocos/asset/asset-manager/pipeline";
import Task from "../../cocos/asset/asset-manager/task";

describe('Pipeline', () => {
    const download = function (task, callback) {
        task.output = task.input;
        callback(null, null);
    };
    
    const load = function (task, callback) {
        task.output = task.input;
        callback(null, null);
    };
    
    const pipeline = new Pipeline('test', [download, load]);
    
    test('construction', function () {
        const pipes = pipeline.pipes;
        expect(pipes[0]).toBe(download);
        expect(pipes[1]).toBe(load);
        expect(pipeline.name).toBe('test');
    });
    
    test('operate pipe', function () {
        pipeline.insert(function () {}, 1);
        const pipes = pipeline.pipes;
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
        const task = Task.create({input: [
            'res/Background.png',
            {
                url: 'res/scene.json',
                type: 'scene',
                name: 'scene'
            }
        ]});
    
        const source = task.source;
    
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
        const download = jest.fn(function (task, callback) {
            const input = task.input;
            for (let i = 0; i < input.length; i++) {
                const item = input[i];
                if (!item.type) {
                    return callback(new Error(item));
                }
                else {
                    task.dispatch('progress', i, input.length, item);
                }
            }
            callback(null, null);
            
        });
        const load = jest.fn(function (task, callback) {
            task.output = task.input;
            callback(null, null);
        });
        const pipeline = new Pipeline('pipeline flow', [download, load]);
    
        const onComplete = jest.fn(function (error, items) {
            expect(error.message).toBe('res/Background.png');
        });
        const onProgress = jest.fn(() => {});

    
        const task = Task.create({ input: [
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
        const onComplete = jest.fn(function (error, items) {
            expect(onProgress).toBeCalledTimes(0);
            expect(error).toBe(null);
            expect(task.source.length).toBe(0);
            expect(items.length).toBe(0);
            done();
        });
        const onProgress = jest.fn(() => {});
    
        const task = Task.create({input: [], onProgress: onProgress, onComplete: onComplete});
        pipeline.async(task);
    });
    
    test('sync', function () {
        const map = {
            'AAA': 'resources/import/2a/100101',
            'BBB': 'resources/native/1a/100101'
        };
        const md5Map = {
            'resources/import/2a/100101': '123sawe',
            'resources/native/1a/100101': 'sqwe123'
        };
        const parse = function (task) {
            const output = [];
            for (let i = 0, l = task.input.length; i < l; i++) {
                const str = task.input[i];
                output.push(map[str]);
            }
            task.output = output;
        };
        const combine = function (task) {
            const output = [];
            for (let i = 0, l = task.input.length; i < l; i++) {
                const str = task.input[i];
                output.push(str + '.' + md5Map[str]);
            }
            task.output = output;
        }
        const pipeline = new Pipeline('sync', [parse, combine]);
    
        const task = Task.create({input: ['AAA', 'BBB']});
        const result = pipeline.sync(task);
        expect(result[0]).toBe('resources/import/2a/100101.123sawe');
        expect(result[1]).toBe('resources/native/1a/100101.sqwe123');
    });
    
    test('content manipulation', function (done) {
        const init = function (task, callback) {
            const input = task.input;
            const output = task.output = [];
            for (let i = 0; i < input.length; i++) {
                const item = input[i];
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
        const download = function (task, callback) {
            setTimeout(function () {
                const input = task.input;
                task.output = input;
                for (let i = 0; i < input.length; i++) {
                    const item = input[i];
                    item.content += '_Downloaded';
                }
                callback(null);
            }, 1);
        };
        const load = function (task, callback) {
            const input = task.input;
            task.output = input;
            for (let i = 0; i < input.length; i++) {
                const item = input[i];
                item.content += '_Loaded';
            }
            callback(null);
        };
        const pipeline = new Pipeline('content manipulation', [init, download, load]);
    
        const onComplete = function (error, items) {
            expect(items.length).toBe(1);
            expect(items[0].content).toBe(items[0].url + '_Downloaded' + '_Loaded');
            done();
        };
    
        const onProgress = function (completed, total, item) {
            expect(completed).toBe(1);
        };
    
        const task = Task.create({input: [
            'res/Background.png',
            {
                url: 'res/scene.json',
                type: 'scene'
            },
            'res/role.plist',
            'res/role'
        ], onProgress: onProgress, onComplete: onComplete});
    
        pipeline.async(task);
    });
});