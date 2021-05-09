module('releaseManager');

var libPath = assetDir + '/library';
cc.assetManager.init({importBase: libPath, nativeBase: libPath});

test('reference', function () {
    var tex = new cc.Texture2D();
    tex._uuid = 'AAA';
    strictEqual(tex.refCount, 0, 'should equal to 0');
    tex.addRef();
    strictEqual(tex.refCount, 1, 'should equal to 1');
    tex.decRef(false);
    strictEqual(tex.refCount, 0, 'should equal to 0');
});

test('release', function () {
    var tex = new cc.Texture2D();
    tex._uuid = 'AAA';
    tex.addRef();
    cc.assetManager.assets.add('AAA', tex);
    ok(cc.isValid(tex, true), 'tex should be valid');
    cc.assetManager._releaseManager._free(tex, false);
    strictEqual(cc.assetManager.assets.count, 1, 'should equal to 1');
    ok(cc.isValid(tex, true), 'tex should be valid');
    cc.assetManager.releaseAsset(tex, true);
    strictEqual(cc.assetManager.assets.count, 0, 'should equal to 0');
    ok(!cc.isValid(tex, true), 'tex should be released');
});

test('release dependencies', function () {
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    cc.assetManager.assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB.addRef();
    cc.assetManager.assets.add('BBB', texB);
    cc.assetManager.dependUtil._depends.add('AAA', {deps: ['BBB']});
    cc.assetManager._releaseManager._free(texA);
    strictEqual(cc.assetManager.assets.count, 0, 'should equal to 0');
});

test('release circle reference', function () {
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    texA.addRef();
    cc.assetManager.assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB.addRef();
    texB.addRef();
    cc.assetManager.assets.add('BBB', texB);
    var texC = new cc.Texture2D();
    texC._uuid = 'CCC';
    texC.addRef();
    cc.assetManager.assets.add('CCC', texC);
    var texD = new cc.Texture2D();
    texD._uuid = 'DDD';
    texD.addRef();
    cc.assetManager.assets.add('DDD', texD);
    cc.assetManager.dependUtil._depends.add('AAA', {deps: ['BBB']});
    cc.assetManager.dependUtil._depends.add('BBB', {deps: ['CCC']});
    cc.assetManager.dependUtil._depends.add('CCC', {deps: ['AAA', 'DDD']});
    cc.assetManager.dependUtil._depends.add('DDD', {deps: ['BBB']});
    cc.assetManager._releaseManager._free(texA);
    strictEqual(cc.assetManager.assets.count, 0, 'should equal to 0');
});

test('release circle reference2', function () {
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    texA.addRef();
    cc.assetManager.assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB.addRef();
    texB.addRef();
    texB.addRef();
    cc.assetManager.assets.add('BBB', texB);
    var texC = new cc.Texture2D();
    texC._uuid = 'CCC';
    texC.addRef();
    cc.assetManager.assets.add('CCC', texC);
    var texD = new cc.Texture2D();
    texD._uuid = 'DDD';
    texD.addRef();
    cc.assetManager.assets.add('DDD', texD);
    cc.assetManager.dependUtil._depends.add('AAA', {deps: ['BBB']});
    cc.assetManager.dependUtil._depends.add('BBB', {deps: ['CCC']});
    cc.assetManager.dependUtil._depends.add('CCC', {deps: ['AAA', 'DDD']});
    cc.assetManager.dependUtil._depends.add('DDD', {deps: ['BBB']});
    cc.assetManager._releaseManager._free(texA);
    strictEqual(cc.assetManager.assets.count, 4, 'should equal to 4');
    cc.assetManager.releaseAll();
});

test('release circle reference3', function () {
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    texA._ref = 2;
    cc.assetManager.assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB._ref = 2;
    cc.assetManager.assets.add('BBB', texB);
    var texC = new cc.Texture2D();
    texC._uuid = 'CCC';
    texC.addRef();
    cc.assetManager.assets.add('CCC', texC);
    var texD = new cc.Texture2D();
    texD._uuid = 'DDD';
    texD.addRef();
    cc.assetManager.assets.add('DDD', texD);
    cc.assetManager.dependUtil._depends.add('AAA', {deps: ['BBB']});
    cc.assetManager.dependUtil._depends.add('BBB', {deps: ['CCC', 'DDD']});
    cc.assetManager.dependUtil._depends.add('CCC', {deps: ['AAA', 'BBB']});
    cc.assetManager.dependUtil._depends.add('DDD', {deps: ['AAA']});
    cc.assetManager._releaseManager._free(texA);
    strictEqual(cc.assetManager.assets.count, 0, 'should equal to 0');
});

test('release circle reference4', function () {
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    texA._ref = 2;
    cc.assetManager.assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB._ref = 3;
    cc.assetManager.assets.add('BBB', texB);
    var texC = new cc.Texture2D();
    texC._uuid = 'CCC';
    texC._ref = 2;
    cc.assetManager.assets.add('CCC', texC);
    var texD = new cc.Texture2D();
    texD._uuid = 'DDD';
    texD.addRef();
    cc.assetManager.assets.add('DDD', texD);
    cc.assetManager.dependUtil._depends.add('AAA', {deps: ['BBB']});
    cc.assetManager.dependUtil._depends.add('BBB', {deps: ['CCC', 'DDD']});
    cc.assetManager.dependUtil._depends.add('CCC', {deps: ['AAA', 'BBB']});
    cc.assetManager.dependUtil._depends.add('DDD', {deps: ['AAA']});
    cc.assetManager._releaseManager._free(texA);
    strictEqual(cc.assetManager.assets.count, 4, 'should equal to 4');
    cc.assetManager.releaseAll();
});

test('release circle reference5', function () {
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    texA._ref = 1;
    cc.assetManager.assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB._ref = 1;
    cc.assetManager.assets.add('BBB', texB);
    var texC = new cc.Texture2D();
    texC._uuid = 'CCC';
    texC._ref = 1;
    cc.assetManager.assets.add('CCC', texC);
    var texD = new cc.Texture2D();
    texD._uuid = 'DDD';
    texD._ref = 2;
    cc.assetManager.assets.add('DDD', texD);
    cc.assetManager.dependUtil._depends.add('AAA', {deps: ['DDD', 'BBB']});
    cc.assetManager.dependUtil._depends.add('BBB', {deps: ['CCC']});
    cc.assetManager.dependUtil._depends.add('CCC', {deps: ['DDD']});
    cc.assetManager.dependUtil._depends.add('DDD', {deps: ['AAA']});
    cc.assetManager._releaseManager._free(texA);
    strictEqual(cc.assetManager.assets.count, 0, 'should equal to 4');
    cc.assetManager.releaseAll();
});

test('AutoRelease', function () {
    var originalRelease = cc.assetManager._releaseManager.tryRelease;
    cc.assetManager._releaseManager.tryRelease = cc.assetManager._releaseManager._free;
    var scene1 = new cc.Scene();
    scene1._id = 'scene 1';
    var scene2 = new cc.Scene();
    scene2._id = 'scene 2';
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    texA.addRef();
    cc.assetManager.assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB._ref = 2;
    cc.assetManager.assets.add('BBB', texB);
    var texC = new cc.Texture2D();
    texC._uuid = 'CCC';
    texC._ref = 2;
    cc.assetManager.assets.add('CCC', texC);
    var texD = new cc.Texture2D();
    texD._uuid = 'DDD';
    texD.addRef();
    cc.assetManager.assets.add('DDD', texD);

    cc.assetManager.dependUtil._depends.add('scene 1', {deps: ['AAA', 'BBB', 'CCC', 'DDD']});
    cc.assetManager.dependUtil._depends.add('scene 2', {deps: ['BBB', 'CCC']});
    cc.assetManager._releaseManager._autoRelease(scene1, scene2, {});
    strictEqual(cc.assetManager.assets.count, 2, 'should equal to 2');
    strictEqual(texB.refCount, 1, 'should equal to 1');
    strictEqual(texC.refCount, 1, 'should equal to 1');
    cc.assetManager._releaseManager.tryRelease = originalRelease;
    cc.assetManager.releaseAll();
});

test('autoRelease_polyfill', function () {
    var originalRelease = cc.assetManager._releaseManager.tryRelease;
    cc.assetManager._releaseManager.tryRelease = cc.assetManager._releaseManager._free;
    var scene1 = new cc.Scene();
    scene1._id = 'scene 1';
    var scene2 = new cc.Scene();
    scene2._id = 'scene 2';
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    cc.assetManager.assets.add('AAA', texA);
    cc.loader.setAutoRelease(texA, true);
    strictEqual(cc.assetManager.assets.count, 1, 'should equal to 1');
    cc.assetManager._releaseManager._autoRelease(scene1, scene2, {});
    strictEqual(cc.assetManager.assets.count, 0, 'should equal to 0');
    cc.assetManager._releaseManager.tryRelease = originalRelease;
});

test('persistNode', function () {
    var originalRelease = cc.assetManager._releaseManager.tryRelease;
    cc.assetManager._releaseManager.tryRelease = cc.assetManager._releaseManager._free;
    var scene1 = new cc.Scene();
    scene1._id = 'scene 1';
    var scene2 = new cc.Scene();
    scene2._id = 'scene 2';
    var scene3 = new cc.Scene();
    scene3._id = 'scene 3';
    var sp = new cc.SpriteFrame();
    sp._uuid = 'AAA';
    sp.addRef();
    var tex = new cc.Texture2D();
    tex.loaded = true;
    sp.setTexture(tex);
    cc.assetManager.assets.add('AAA', sp);
    var persistNode = new cc.Node();
    persistNode.addComponent(cc.Sprite).spriteFrame = sp;
    cc.assetManager._releaseManager._addPersistNodeRef(persistNode);
    var persistNodes = {};
    persistNodes[persistNode.uuid] = persistNode;
    cc.assetManager.dependUtil._depends.add('scene 1', {deps: ['AAA']});
    cc.assetManager.dependUtil._depends.add('scene 2', {deps: []});
    cc.assetManager._releaseManager._autoRelease(scene1, scene2, persistNodes);
    strictEqual(cc.assetManager.assets.count, 1, 'should equal to 1');
    strictEqual(cc.assetManager.assets.get('AAA'), sp, 'should equal to spriteFrame');
    strictEqual(sp.refCount, 2, 'should equal to 2');
    cc.assetManager._releaseManager._removePersistNodeRef(persistNode);
    strictEqual(sp.refCount, 1, 'should equal to 1');
    cc.assetManager._releaseManager._autoRelease(scene2, scene3, {});
    strictEqual(cc.assetManager.assets.count, 0, 'should equal to 0');
    cc.assetManager._releaseManager.tryRelease = originalRelease;
});

