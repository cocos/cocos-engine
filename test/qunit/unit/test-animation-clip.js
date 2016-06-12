largeModule('animation-clip');

test('animation clip', function() {
    var atlas = new cc.SpriteAtlas();
    var spriteFrames = atlas._spriteFrames;

    ['run_0', 'run_1', 'run_2'].forEach(function (name) {
        var frame = new cc.SpriteFrame();
        frame.name = name;
        spriteFrames[name] = frame;
    });

    var frames = atlas.getSpriteFrames();

    var clip = cc.AnimationClip.createWithSpriteFrames(frames, 10);
    clip.name = 'run';

    strictEqual(clip.name, 'run', 'AnimationClip name should be run');

    var clipFrames = clip.curveData.comps['cc.Sprite'].spriteFrame;
    strictEqual(clipFrames.length, 3, 'AnimationClip should create 3 frames');
    deepEqual(clipFrames[0], {
        frame: 0,
        value: frames[0]
    });

    strictEqual(clip.duration, 0.3, 'AnimationClip duration should be 0.3');
});
