import { assetManager, loader } from "../../cocos/asset/asset-manager";
import { ImageAsset } from "../../cocos/asset/assets/image-asset";

describe('Loader', () => {
    const assetDir = './tests/fixtures';
    const libPath = assetDir + '/library';
    assetManager.init({importBase: libPath, nativeBase: libPath});
    
    test('Load', function (done) {
        const image1 = assetDir + '/button.png';
        const json1 = assetDir + '/library/12/123200.json';
        const json2 = assetDir + '/library/deferred-loading/74/748321.json';
        const resources = [
            image1,
            json1,
            json2,
        ];
    
        loader.load(resources, function (completedCount, totalCount, item) {
            if (item.uuid === image1) {
                expect(item.content).toBeInstanceOf(Image);
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
            done();
        });
    });
    
    test('Load single file', function (done) {
        const image1 = assetDir + '/button.png';
    
        loader.load(image1, function (completedCount, totalCount, item) {
            if (item.uuid === image1) {
                expect(item.content).toBeInstanceOf(Image);
            }
            else {
                fail('should not load an unknown url');
            }
        }, function (error, texture) {
            expect(!error).toBeTruthy();
            expect(texture).toBeInstanceOf(ImageAsset);
    
            loader.releaseAll();
            done();
        });
    });
    
    test('Load with dependencies', function (done) {
        const dep1 = assetDir + '/button.png';
        const dep2 = assetDir + '/library/12/123200.json';
        const dep3 = assetDir + '/library/65/6545543.png';
        const depsCount = 3;
    
        function loadWithDeps (item, callback) {
            try {
                var result = JSON.parse(item.content);
            }
            catch (e) {
                callback( new Error('JSON Loader: Parse json [' + item.id + '] failed : ' + e) );
            }
            const resources = [
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
    
        const json1 = {
            url: assetDir + '/library/65/6545543',
            type: 'deps'
        };
        const json2 = assetDir + '/library/deferred-loading/74/748321.json';
        const audio = assetDir + '/library/12/1258a1.json';
        const resources = [
            json1,
            json2,
            audio
        ];
    
        const total = resources.length + depsCount;
    
        const depsProgression = jest.fn(() => {});
        const progressCallback = jest.fn(function (completedCount, totalCount, item) {
            if (item.uuid === json1.url) {
                let dep = loader.getRes(dep1);
                expect(dep).toBeInstanceOf(ImageAsset);
                dep = loader.getRes(dep2);
                expect((dep as any).width).toBe(89);
                dep = loader.getRes(dep3);
                expect(dep).toBeInstanceOf(ImageAsset);
    
                expect(item.content.__type__).toBe('TestTexture');
            }
            else if (item.uuid === json2) {
                expect(item.content._native).toBe('YouKnowEverything');
            }
            else if (item.uuid === audio) {
                // Test environment doesn't support audio
                expect(item.content).toBeTruthy();
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
            const count = loader.getResCount();
            expect(count).toBe(total);
            loader.releaseAll();
            done();
        });
    });
    
    test('Loading font', function (done) {
        const image = assetDir + '/button.png';
        const font = {
            url: assetDir + '/Thonburi.ttf',
            type: 'font',
            name: 'Thonburi',
            srcs: [assetDir + '/Thonburi.eot']
        };
        const resources = [
            image,
            font
        ];
        const total = resources.length;
    
        const progressCallback = jest.fn(function (completedCount, totalCount, item) {
            if (item.uuid === image) {
                expect(item.content).toBeInstanceOf(Image);
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
            done();
        });
    });
    
    test('Loading texture with query', function (done) {
        const image1 = assetDir + '/button.png?url=http://.../1';
        const image2 = assetDir + '/button.png?url=http://.../2';
        loader.load({url: image1, type: 'png'}, function (error) {
            loader.load({url: image2, type: 'png'}, function (error) {
                expect(loader.getItem(image1).content !== loader.getItem(image2).content).toBeTruthy();
                done();
            });
        });
    });
});