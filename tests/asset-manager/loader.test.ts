import { assetManager, loader } from "../../cocos/core/asset-manager";
import { Texture2D } from "../../cocos/core/assets/texture-2d";
import { AuidoClip } from ""

describe('Loader', () => {
    const assetDir = './fixtures';
    var libPath = assetDir + '/library';
    assetManager.init({importBase: libPath, nativeBase: libPath});
    
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
                expect(item.content instanceof Image).toBeTruthy();
            }
            else if (item.uuid === json1) {
                expect(item.content.width).toBe(89);
            }
            else if (item.uuid === json2) {
                expect(item.content._native).toBe('YouKnowEverything');
            }
            else {
                fail('should not load an unknown url');
            }
        }, function (error, items) {
            expect(items.isCompleted()).toBeTruthy();
    
            loader.releaseAll();
            expect(Object.keys(loader._cache).length).toBe(0);
        });
    });
    
    test('Load single file', function () {
        var image1 = assetDir + '/button.png';
    
        loader.load(image1, function (completedCount, totalCount, item) {
            if (item.uuid === image1) {
                expect(item.content instanceof Image).toBeTruthy();
            }
            else {
                fail('should not load an unknown url');
            }
        }, function (error, texture) {
            expect(!error).toBeTruthy();
            expect(texture instanceof Texture2D).toBeTruthy();
    
            loader.releaseAll();
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
    
        var depsProgression = jest.fn(() => {});
        var progressCallback = jest.fn(function (completedCount, totalCount, item) {
            if (item.uuid === json1.url) {
                var dep = loader.getRes(dep1);
                expect(dep instanceof Texture2D).toBeTruthy();
                dep = loader.getRes(dep2);
                expect((dep as any).width).toBe(89);
                dep = loader.getRes(dep3);
                expect(dep instanceof Texture2D).toBeTruthy();
    
                expect(item.content.__type__).toBe('TestTexture');
            }
            else if (item.uuid === json2) {
                expect(item.content._native).toBe('YouKnowEverything');
            }
            else if (item.uuid === audio) {
                // Test environment doesn't support audio
                expect(item.content instanceof AudioClip).toBeTruthy();
            }
            else if (item.uuid === dep1 || item.uuid === dep2 || item.uuid === dep3) {
                depsProgression();
            }
            else {
                fail('should not load an unknown url: ' + item.id);
            }
        });
    
        loader.load(resources, progressCallback, function (error, items) {
            expect(items.isCompleted()).toBeTruthy();
            expect(depsProgression).toBeCalledTimes(depsCount);
            expect(progressCallback).toBeCalledTimes(total);
            var count = loader.getResCount();
            expect(count).toBe(total);
            loader.releaseAll();
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
    
        var progressCallback = jest.fn(function (completedCount, totalCount, item) {
            if (item.uuid === image) {
                expect(item.content instanceof Image).toBeTruthy();
            }
            else if (item.uuid === font.url) {
                expect(item.content).toBe('Thonburi_LABEL');
            }
            else {
                fail('should not load an unknown url');
            }
        });
    
        loader.load(resources, progressCallback, function (error, items) {
            expect(items.isCompleted()).toBeTruthy();
            expect(progressCallback).toBeCalledTimes(total);
        });
    });
    
    test('Loading texture with query', function () {
        var image1 = assetDir + '/button.png?url=http://.../1';
        var image2 = assetDir + '/button.png?url=http://.../2';
        loader.load({url: image1, type: 'png'}, function (error) {
            loader.load({url: image2, type: 'png'}, function (error) {
                expect(loader.getItem(image1).content !== loader.getItem(image2).content).toBeTruthy();
            });
        });
    });
});