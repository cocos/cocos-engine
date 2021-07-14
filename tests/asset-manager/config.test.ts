import { SpriteFrame } from '../../cocos/2d/assets/sprite-frame';
import Config, { IAddressableInfo } from '../../cocos/core/asset-manager/config'
import { Texture2D } from '../../cocos/core/assets/texture-2d';
describe('config', () => {

    var config = new Config();
    config.init({
        paths: {
            'AAA': ['images/test', 'Texture2D'],
            'BBB': ['images/test', 'SpriteFrame', 1],
            'ccc': ['prefab', 'Prefab']
        },
        scenes: {
            'db://Start.fire': 'DDD',
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
        uuids: ['AAA', 'BBB', 'ccc', 'DDD', 'EEE']
    });

    test('get asset info', function () {
        var result = config.getAssetInfo('AAA') as IAddressableInfo;
        expect(result.path).toBe('images/test');
        expect(result.ctor).toBe(Texture2D);
        result = config.getAssetInfo('BBB');
        expect(result.ver, 'dsqeqqb', 'should equal to dsqeqqb');
        expect(result.nativeVer, 'how do you do', 'should equal to how do you do');
        result = config.getAssetInfo('pack A');
        expect(result.packs[0], 'AAA', 'should equal to AAA');
    });

    test('get scene info', function () {
        var result = config.getSceneInfo('Start');
        expect(result.uuid, 'DDD', 'should equal to DDD');
        expect(result.ver, '12saqwe', 'should equal to 12saqwe');
        expect(result.packs.length, 1, 'should equal to 1');
    });

    test('get info with path', function () {
        var result = config.getInfoWithPath('images/test', Texture2D);
        expect(result.uuid).toBe('AAA');
        expect(result.ver).toBe('dswq123sq');
        expect(result.nativeVer, 'tester', 'should equal to tester');
        result = config.getInfoWithPath('images/test', SpriteFrame);
        expect(result.uuid, 'BBB', 'should equal to BBB');
        expect(result.packs.length, 1, 'should equal to 1');
        result = config.getInfoWithPath('images/test');
        expect(result.uuid, 'AAA', 'should equal to AAA');
    });

    test('get dir with path', function () {
        var result = config.getDirWithPath('images/test');
        expect(result.length, 2, 'should equal to 2');
        result = config.getDirWithPath('images/test', Texture2D);
        expect(result.length, 1, 'should equal to 1');
        result = config.getDirWithPath('');
        expect(result.length, 3, 'should equal to 3');
    });

});