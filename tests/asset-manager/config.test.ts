import { SpriteFrame } from '../../cocos/2d/assets/sprite-frame';
import Config, { IAddressableInfo, IPackInfo } from '../../cocos/asset/asset-manager/config'
import { Texture2D } from '../../cocos/asset/assets/texture-2d';
describe('config', () => {

    const config = new Config();
    config.init({
        paths: {
            'AAA': ['images/test', 'cc.Texture2D'],
            'BBB': ['images/test', 'cc.SpriteFrame', 1],
            'ccc': ['prefab', 'cc.Prefab']
        },
        scenes: {
            'db://Start.scene': 'DDD',
            'db://Second.scene': 'EEE',
        },
        packs: {
            'pack A': ['AAA', 'BBB'],
            'pack b': ['ccc', 'DDD']
        },
        versions: {
            import: ['AAA', 'dswq123sq', 'BBB', 'dsqeqqb', 'ccc', 'eqq123s', 'DDD', '12saqwe'],
            native: ['AAA', 'tester', 'BBB', 'how do you do']
        },
        uuids: ['AAA', 'BBB', 'ccc', 'DDD', 'EEE'],
        importBase: '',
        nativeBase: '',
        base: '',
        name: '',
        deps: [],
        redirect: [],
        debug: false,
        types: [],
        extensionMap: {}
    });

    test('get asset info', function () {
        const result1 = config.getAssetInfo('AAA') as IAddressableInfo;
        expect(result1.path).toBe('images/test');
        expect(result1.ctor).toBe(Texture2D);
        const result2 = config.getAssetInfo('BBB');
        expect(result2.ver).toBe('dsqeqqb');
        expect(result2.nativeVer).toBe('how do you do');
        const result3 = config.getAssetInfo('pack A') as IPackInfo;
        expect(result3.packedUuids[0]).toBe('AAA');
    });

    test('get scene info', function () {
        const result = config.getSceneInfo('Start');
        expect(result.uuid).toBe('DDD');
        expect(result.ver).toBe('12saqwe');
        expect(result.packs.length).toBe(1);
    });

    test('get info with path', function () {
        let result = config.getInfoWithPath('images/test', Texture2D);
        expect(result.uuid).toBe('AAA');
        expect(result.ver).toBe('dswq123sq');
        expect(result.nativeVer).toBe('tester');
        result = config.getInfoWithPath('images/test', SpriteFrame);
        expect(result.uuid).toBe('BBB');
        expect(result.packs.length).toBe(1);
        result = config.getInfoWithPath('images/test');
        expect(result.uuid).toBe('AAA');
    });

    test('get dir with path', function () {
        let result = config.getDirWithPath('images/test');
        expect(result.length).toBe(2);
        result = config.getDirWithPath('images/test', Texture2D);
        expect(result.length).toBe(1)
        result = config.getDirWithPath('');
        expect(result.length).toBe(3);
    });
});