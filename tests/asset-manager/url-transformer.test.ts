import { assetManager, loader, resources, url } from "../../cocos/asset/asset-manager";
import Bundle from "../../cocos/asset/asset-manager/bundle";
import { transform } from "../../cocos/asset/asset-manager/helper";
import { BuiltinBundleName } from "../../cocos/asset/asset-manager/shared";

describe('url-transform', () => {
    test('transform url', function () {
        assetManager.init({importBase: 'import', nativeBase: 'native'});
        let result = transform({ uuid: '0cbZa5Y71CTZAccaIFluuZ'});
        expect(result).toBe('import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.json');
        result = transform({ uuid: '0cbZa5Y71CTZAccaIFluuZ', ext: '.png', __isNative__: true});
        expect(result).toBe('native/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.png');
        result = transform({ url: 'www.cocos.com/test.jpg', __isNative__: true});
        expect(result).toBe('www.cocos.com/test.jpg');
        const bundle = new Bundle();
        bundle.init({
            name: 'test', 
            base: 'test/', 
            importBase: 'import', 
            nativeBase: 'native', 
            paths: {'AAA': ['images/test', 'Texture2D']}, 
            versions: {
                import: ['AAA', 'dswq123sq'],
                native: ['AAA', 'tester']
            }, 
            uuids: ['AAA'],
            deps: [],
            redirect: [],
            debug: false,
            types: [],
            extensionMap: {},
            scenes: {},
            packs: {},
        });
        result = transform({ uuid: '0cbZa5Y71CTZAccaIFluuZ', bundle: 'test'});
        expect(result).toBe('test/import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.json');
        result = transform({ path: 'images/test', bundle: 'test'});
        expect(result).toBe('test/import/AA/AAA.dswq123sq.json');
    });
    
    test('raw', function () {
        assetManager.init({importBase: 'import', nativeBase: 'native'});
        resources.init({
            name: BuiltinBundleName.RESOURCES, 
            base: 'test/', 
            importBase: 'import', 
            nativeBase: 'native', 
            paths: {'BBB': ['images/test', 'Texture2D']}, 
            versions: {
                import: ['BBB', 'dswq123sq'],
                native: ['BBB', 'tester']
            }, 
            uuids: ['BBB'],
            deps: [],
            redirect: [],
            debug: false,
            types: [],
            extensionMap: {},
            scenes: {},
            packs: {},
        });
        const result = url.raw('resources/images/test.jpg');
        expect(result).toBe('test/native/BB/BBB.tester.jpg');
    });
    
    test('md5', function () {
        assetManager.init({importBase: 'import', nativeBase: 'native'});
        resources.init({
            name: BuiltinBundleName.RESOURCES, 
            base: 'test/', 
            importBase: 'import', 
            nativeBase: 'native', 
            versions: {
                import: ['0c6d96b9-63bd-424d-901c-71a20596eb99', 'sweqesa'],
                native: ['0c6d96b9-63bd-424d-901c-71a20596eb99', 'sxqwe1s']
            }, 
            uuids: ['0c6d96b9-63bd-424d-901c-71a20596eb99'],
            deps: [],
            redirect: [],
            debug: false,
            types: [],
            extensionMap: {},
            scenes: {},
            packs: {},
            paths: {}
        });
        let result = loader.md5Pipe.transformURL('test/import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.json');
        expect(result).toBe('test/import/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.sweqesa.json');
        result = loader.md5Pipe.transformURL('test/native/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.jpg');
        expect(result).toBe('test/native/0c/0c6d96b9-63bd-424d-901c-71a20596eb99.sxqwe1s.jpg');
    });
});