module('Config');

var config = new cc.AssetManager.Config();
config.init({
    paths: {
        'AAA': ['images/test', 'cc.Texture2D'],
        'BBB': ['images/test', 'cc.SpriteFrame', 1],
        'ccc': ['prefab', 'cc.Prefab']
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
    var result = config.getAssetInfo('AAA');
    strictEqual(result.path, 'images/test', 'should equal to images/test');
    strictEqual(result.ctor, cc.Texture2D, 'should equal to cc.Texture2D');
    result = config.getAssetInfo('BBB');
    strictEqual(result.ver, 'dsqeqqb', 'should equal to dsqeqqb');
    strictEqual(result.nativeVer, 'how do you do', 'should equal to how do you do');
    result = config.getAssetInfo('pack A');
    strictEqual(result.packs[0], 'AAA', 'should equal to AAA');
});

test('get scene info', function () {
    var result = config.getSceneInfo('Start');
    strictEqual(result.uuid, 'DDD', 'should equal to DDD');
    strictEqual(result.ver, '12saqwe', 'should equal to 12saqwe');
    strictEqual(result.packs.length, 1, 'should equal to 1');
});

test('get info with path', function () {
    var result = config.getInfoWithPath('images/test', cc.Texture2D);
    strictEqual(result.uuid, 'AAA', 'should equal to AAA');
    strictEqual(result.ver, 'dswq123sq', 'should equal to dswq123sq');
    strictEqual(result.nativeVer, 'tester', 'should equal to tester');
    result = config.getInfoWithPath('images/test', cc.SpriteFrame);
    strictEqual(result.uuid, 'BBB', 'should equal to BBB');
    strictEqual(result.packs.length, 1, 'should equal to 1');
    result = config.getInfoWithPath('images/test');
    strictEqual(result.uuid, 'AAA', 'should equal to AAA');
});

test('get dir with path', function () {
    var result = config.getDirWithPath('images/test');
    strictEqual(result.length, 2, 'should equal to 2');
    result = config.getDirWithPath('images/test', cc.Texture2D);
    strictEqual(result.length, 1, 'should equal to 1');
    result = config.getDirWithPath('');
    strictEqual(result.length, 3, 'should equal to 3');
});