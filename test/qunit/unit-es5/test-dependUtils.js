module('dependUtils');

test('parse texture deps', function () {
    var depend = cc.assetManager.dependUtil.parse('AAA', { __type__: 'cc.Texture2D', content: '0'}); 
    strictEqual(depend.nativeDep.uuid, 'AAA', 'should equal to AAA');
    strictEqual(depend.nativeDep.ext, '.png', 'should equal to AAA');
    strictEqual(depend.deps.length, 0, 'should equal to 0');
});

test('parse audio deps', function () {
    var depend = cc.assetManager.dependUtil.parse('BBB', {
        "__type__": "cc.AudioClip",
        "_native": ".mp3",
        "loadMode": 0
      }); 
    strictEqual(depend.nativeDep.uuid, 'BBB', 'should equal to AAA');
    strictEqual(depend.nativeDep.ext, '.mp3', 'should equal to .mp3');
    strictEqual(depend.deps.length, 0, 'should equal to 0');
});

test('parse asset', function () {
    var depend = cc.assetManager.dependUtil.parse('ccc', {
        "__type__": "TestSprite",
        "rawTexture": null,
        "texture": {
            "__uuid__": "748321"
        },
        "rotated": false,
        "trim": false,
        "trimThreshold": 1,
        "trimLeft": 0,
        "trimTop": 0,
        "width": 0,
        "height": 0,
        "x": 0,
        "y": 0
    }); 
    strictEqual(depend.nativeDep, null, 'should equal to null');
    strictEqual(depend.deps.length, 1, 'should equal to 1');
    strictEqual(depend.deps[0], "748321", 'should equal to 748321');
});