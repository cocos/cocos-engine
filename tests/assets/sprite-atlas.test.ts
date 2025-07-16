import { SpriteAtlas } from "../../cocos/2d";
import { Details } from "../../cocos/serialization/deserialize";

// issue: https://github.com/cocos/cocos-engine/issues/16693
test('SpriteAtlas serialize', function () {
    const spriteAtlas = new SpriteAtlas();
    spriteAtlas.spriteFrames = {
        '09f4f3e7-268b-478c-a7af-bbdf574ec3c6@9941': { _uuid: '09f4f3e7-268b-478c-a7af-bbdf574ec3c6' },
        '19f4f3e7-268b-478c-a7af-bbdf574ec3c6@9941': { _uuid: '19f4f3e7-268b-478c-a7af-bbdf574ec3c6' },
    };
    const ctxForExporting = {
        _depends: [] as string[],
        dependsOn(propName: string, uuid: string) {
            this._depends.push(propName, uuid);
        },
        _compressUuid: this.mustCompresseUuid,
    };
    spriteAtlas._serialize(ctxForExporting);
    expect(ctxForExporting._depends).toEqual(['_textureSource', '09f4f3e7-268b-478c-a7af-bbdf574ec3c6', '_textureSource', '19f4f3e7-268b-478c-a7af-bbdf574ec3c6']);
});

test('SpriteAtlas deserialize', function () {
    const data = { name: 'avatar', spriteFrames: ['1', '09f4f3e7-268b-478c-a7af-bbdf574ec3c6', '2', '19f4f3e7-268b-478c-a7af-bbdf574ec3c6'] };
    const result = new Details();
    result.init();
    const handle = { result };
    const spriteAtlas = new SpriteAtlas();
    spriteAtlas._deserialize(data, handle);
    expect(handle.result.uuidList).toEqual(['09f4f3e7-268b-478c-a7af-bbdf574ec3c6', '19f4f3e7-268b-478c-a7af-bbdf574ec3c6']);
});