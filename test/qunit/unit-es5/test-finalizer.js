module('finalizer');

var libPath = assetDir + '/library';
cc.assetManager.init({importBase: libPath, nativeBase: libPath});

test('reference', function () {
    var tex = new cc.Texture2D();
    tex._uuid = 'AAA';
    strictEqual(tex._ref, 0, 'should equal to 0');
    tex._addRef();
    strictEqual(tex._ref, 1, 'should equal to 1');
    tex._removeRef();
    strictEqual(tex._ref, 0, 'should equal to 0');
});

test('release', function () {
    var tex = new cc.Texture2D();
    tex._uuid = 'AAA';
    tex._addRef();
    cc.assetManager._assets.add('AAA', tex);
    ok(cc.isValid(tex, true), 'tex should be valid');
    cc.assetManager.finalizer._free(tex, false);
    strictEqual(cc.assetManager._assets.count, 1, 'should equal to 1');
    ok(cc.isValid(tex, true), 'tex should be valid');
    cc.assetManager.release(tex, true);
    strictEqual(cc.assetManager._assets.count, 0, 'should equal to 0');
    ok(!cc.isValid(tex, true), 'tex should be released');
});

test('release dependencies', function () {
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    cc.assetManager._assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB._addRef();
    cc.assetManager._assets.add('BBB', texB);
    cc.assetManager.dependUtil._depends.add('AAA', {deps: ['BBB']});
    cc.assetManager.finalizer._free(texA);
    strictEqual(cc.assetManager._assets.count, 0, 'should equal to 0');
});

test('release circle reference', function () {
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    texA._addRef();
    cc.assetManager._assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB._addRef();
    cc.assetManager._assets.add('BBB', texB);
    var texC = new cc.Texture2D();
    texC._uuid = 'CCC';
    texC._addRef();
    cc.assetManager._assets.add('CCC', texC);
    var texD = new cc.Texture2D();
    texD._uuid = 'DDD';
    texD._addRef();
    cc.assetManager._assets.add('DDD', texD);
    cc.assetManager.dependUtil._depends.add('AAA', {deps: ['BBB']});
    cc.assetManager.dependUtil._depends.add('BBB', {deps: ['CCC']});
    cc.assetManager.dependUtil._depends.add('CCC', {deps: ['AAA', 'DDD']});
    cc.assetManager.dependUtil._depends.add('DDD', {deps: ['BBB']});
    cc.assetManager.finalizer._free(texA);
    strictEqual(cc.assetManager._assets.count, 0, 'should equal to 0');
});

test('lock', function () {
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    cc.assetManager._assets.add('AAA', texA);
    cc.assetManager.finalizer.lock(texA);
    cc.assetManager.finalizer.release(texA, true);
    strictEqual(cc.assetManager._assets.count, 1, 'should equal to 1');
    cc.assetManager.finalizer.unlock(texA);
    cc.assetManager.finalizer.release(texA, true);
    strictEqual(cc.assetManager._assets.count, 0, 'should equal to 0');
});

test('AutoRelease', function () {
    var originalRelease = cc.assetManager.finalizer.release;
    cc.assetManager.finalizer.release = cc.assetManager.finalizer._free;
    var scene1 = new cc.Scene();
    scene1._id = 'scene 1';
    var scene2 = new cc.Scene();
    scene2._id = 'scene 2';
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    texA._addRef();
    cc.assetManager._assets.add('AAA', texA);
    var texB = new cc.Texture2D();
    texB._uuid = 'BBB';
    texB._ref = 2;
    cc.assetManager._assets.add('BBB', texB);
    var texC = new cc.Texture2D();
    texC._uuid = 'CCC';
    texC._ref = 2;
    cc.assetManager._assets.add('CCC', texC);
    var texD = new cc.Texture2D();
    texD._uuid = 'DDD';
    texD._addRef();
    cc.assetManager._assets.add('DDD', texD);

    cc.assetManager.dependUtil._depends.add('scene 1', {deps: ['AAA', 'BBB', 'CCC', 'DDD']});
    cc.assetManager.dependUtil._depends.add('scene 2', {deps: ['BBB', 'CCC']});
    cc.assetManager.finalizer._autoRelease(scene1, scene2, []);
    strictEqual(cc.assetManager._assets.count, 2, 'should equal to 2');
    strictEqual(texB._ref, 1, 'should equal to 1');
    strictEqual(texC._ref, 1, 'should equal to 1');
    cc.assetManager.finalizer.release = originalRelease;
    cc.assetManager.releaseAll(true);
});

test('autoRelease_polyfill', function () {
    var originalRelease = cc.assetManager.finalizer.release;
    cc.assetManager.finalizer.release = cc.assetManager.finalizer._free;
    var scene1 = new cc.Scene();
    scene1._id = 'scene 1';
    var scene2 = new cc.Scene();
    scene2._id = 'scene 2';
    var texA = new cc.Texture2D();
    texA._uuid = 'AAA';
    cc.assetManager._assets.add('AAA', texA);
    cc.loader.setAutoRelease(texA, true);
    strictEqual(cc.assetManager._assets.count, 1, 'should equal to 1');
    cc.assetManager.finalizer._autoRelease(scene1, scene2, []);
    strictEqual(cc.assetManager._assets.count, 0, 'should equal to 0');
    cc.assetManager.finalizer.release = originalRelease;
});

test('persistNode', function () {
    var originalRelease = cc.assetManager.finalizer.release;
    cc.assetManager.finalizer.release = cc.assetManager.finalizer._free;
    var scene1 = new cc.Scene();
    scene1._id = 'scene 1';
    var scene2 = new cc.Scene();
    scene2._id = 'scene 2';
    var scene3 = new cc.Scene();
    scene3._id = 'scene 3';
    var sp = new cc.SpriteFrame();
    sp._uuid = 'AAA';
    sp._addRef();
    cc.assetManager._assets.add('AAA', sp);
    var persistNode = new cc.Node();
    persistNode.addComponent(cc.Sprite).spriteFrame = sp;
    cc.assetManager.finalizer._addPersistNodeRef(persistNode);

    cc.assetManager.dependUtil._depends.add('scene 1', {deps: ['AAA']});
    cc.assetManager.dependUtil._depends.add('scene 2', {deps: []});
    cc.assetManager.finalizer._autoRelease(scene1, scene2, [persistNode]);
    strictEqual(cc.assetManager._assets.count, 1, 'should equal to 1');
    strictEqual(cc.assetManager._assets.get('AAA'), sp, 'should equal to spriteFrame');
    strictEqual(sp._ref, 2, 'should equal to 2');
    cc.assetManager.finalizer._removePersistNodeRef(persistNode);
    strictEqual(sp._ref, 1, 'should equal to 1');
    cc.assetManager.finalizer._autoRelease(scene2, scene3, []);
    strictEqual(cc.assetManager._assets.count, 0, 'should equal to 0');
    cc.assetManager.finalizer.release = originalRelease;
});

