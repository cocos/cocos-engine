import dependUtil from "../../cocos/core/asset-manager/depend-util";

describe('dependUtils', () => {

    test('parse texture deps', function () {
        var depend = dependUtil.parse('AAA', { __type__: 'cc.ImageAsset', content: '0'}); 
        expect(depend.nativeDep.uuid).toBe('AAA');
        expect(depend.nativeDep.ext).toBe('.png');
        expect(depend.deps.length).toBe(0);
    });

    test('parse audio deps', function () {
        var depend = dependUtil.parse('BBB', {
            "__type__": "cc.AudioClip",
            "_native": ".mp3",
            "loadMode": 0
        }); 
        expect(depend.nativeDep.uuid).toBe('BBB');
        expect(depend.nativeDep.ext).toBe('.mp3');
        expect(depend.deps.length).toBe(0);
    });

    test('parse asset', function () {
        var depend = dependUtil.parse('ccc', {
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
        expect(depend.nativeDep).toBeUndefined();
        expect(depend.deps.length).toBe(1);
        expect(depend.deps[0]).toBe("748321");
    });
});