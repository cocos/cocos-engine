largeModule('sprite-atlas');

test('sprite atlas', function() {
    var atlas = new cc.SpriteAtlas();
    var spriteFrames = atlas._spriteFrames;

    ['run_0', 'run_1', 'run_2', 'jump_0', 'jump_1', 'jump2'].forEach(function (name) {
        var frame = new cc.SpriteFrame();
        frame.name = name;
        spriteFrames[name] = frame;
    });

    var frame = atlas.getSpriteFrame('run_0');
    strictEqual(frame instanceof cc.SpriteFrame, true, 'Atlas should get a sprite frame');

    var frames = atlas.getSpriteFrames();
    strictEqual(frames.length, 6, 'Atlas should get all sprite frames');
    strictEqual(frames[0].name, 'run_0');
    strictEqual(frames[1].name, 'run_1');
    strictEqual(frames[2].name, 'run_2');
});
