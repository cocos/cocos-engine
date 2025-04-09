import { Texture2D } from "../../cocos/asset/assets/texture-2d";
import { Details } from "../../cocos/serialization/deserialize";

// issue: https://github.com/cocos/cocos-engine/issues/16693
test('Texture2D serialize', function () {
    const texture = new Texture2D();
    texture._mipmaps = [{ _uuid: '09f4f3e7-268b-478c-a7af-bbdf574ec3c6@6c48a' }];
    const ctxForExporting = {
        _depends: [] as string[],
        dependsOn(propName: string, uuid: string) {
            this._depends.push(propName, uuid);
        },
        _compressUuid: this.mustCompresseUuid,
    };
    texture._serialize(ctxForExporting);
    expect(ctxForExporting._depends).toEqual(['_textureSource', '09f4f3e7-268b-478c-a7af-bbdf574ec3c6@6c48a']);
});

test('Texture2D deserialize', function () {
    const data = { base: '2,2,2,2,0,0', mipmaps: ['09f4f3e7-268b-478c-a7af-bbdf574ec3c6'] };
    const result = new Details();
    result.init();
    const handle = { result };
    const texture = new Texture2D();
    texture._deserialize(data, handle);
    expect(handle.result.uuidList).toEqual(['09f4f3e7-268b-478c-a7af-bbdf574ec3c6']);
});