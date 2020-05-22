module('url-transform');

test('transform url', function () {
    cc.assetManager.init({importBase: 'import', nativeBase: 'native'});
    var result = cc.assetManager._transform({ uuid: '0cbZa5Y71CTZAccaIFluuZ'});
    strictEqual(result, 'import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.json', 'should equal to import/0c/0cbZa5Y71CTZAccaIFluuZ.json');
    result = cc.assetManager._transform({ uuid: '0cbZa5Y71CTZAccaIFluuZ', ext: '.png', __isNative__: true});
    strictEqual(result, 'native/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.png', 'should equal to native/0c/0cbZa5Y71CTZAccaIFluuZ.png');
    result = cc.assetManager._transform({ url: 'www.cocos.com/test.jpg', __isNative__: true});
    strictEqual(result, 'www.cocos.com/test.jpg', 'should equal to www.cocos.com/test.jpg');
    var bundle = new cc.AssetManager.Bundle();
    bundle.init({
        name: 'test', 
        base: 'test/', 
        importBase: 'import', 
        nativeBase: 'native', 
        paths: {'AAA': ['images/test', 'cc.Texture2D']}, 
        versions: {
            import: ['AAA', 'dswq123sq'],
            native: ['AAA', 'tester']
        }, 
        uuids: ['AAA']
    });
    result = cc.assetManager._transform({ uuid: '0cbZa5Y71CTZAccaIFluuZ', bundle: 'test'});
    strictEqual(result, 'test/import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.json', 'should equal to test/import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.json');
    result = cc.assetManager._transform({ path: 'images/test', bundle: 'test'});
    strictEqual(result, 'test/import/AA/AAA.dswq123sq.json', 'should equal to test/import/AA/AAA.dswq123sq.json');
});

test('raw', function () {
    cc.assetManager.init({importBase: 'import', nativeBase: 'native'});
    var bundle = new cc.AssetManager.Bundle();
    bundle.init({
        name: cc.AssetManager.BuiltinBundleName.RESOURCES, 
        base: 'test/', 
        importBase: 'import', 
        nativeBase: 'native', 
        paths: {'BBB': ['images/test', 'cc.Texture2D']}, 
        versions: {
            import: ['BBB', 'dswq123sq'],
            native: ['BBB', 'tester']
        }, 
        uuids: ['BBB']
    });
    var result = cc.url.raw('resources/images/test.jpg');
    strictEqual(result, 'test/native/BB/BBB.tester.jpg', 'should equal to test/native/BB/BBB.tester.jpg');
});

test('md5', function () {
    cc.assetManager.init({importBase: 'import', nativeBase: 'native'});
    var bundle = new cc.AssetManager.Bundle();
    bundle.init({
        name: cc.AssetManager.BuiltinBundleName.RESOURCES, 
        base: 'test/', 
        importBase: 'import', 
        nativeBase: 'native', 
        versions: {
            import: ['0c6d96b9-63bd-424d-901c-71a20596eb99', 'sweqesa'],
            native: ['0c6d96b9-63bd-424d-901c-71a20596eb99', 'sxqwe1s']
        }, 
        uuids: ['0c6d96b9-63bd-424d-901c-71a20596eb99']
    });
    var result = cc.loader.md5Pipe.transformURL('test/import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.json');
    strictEqual(result, 'test/import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.sweqesa.json', 'should equal to test/import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.sweqesa.json');
    result = cc.loader.md5Pipe.transformURL('test/native/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.jpg');
    strictEqual(result, 'test/native/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.sxqwe1s.jpg', 'should equal to test/native/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.sxqwe1s.jpg');
});