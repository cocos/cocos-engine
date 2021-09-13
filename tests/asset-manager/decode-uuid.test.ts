
import { decodeUuid } from "../../cocos/core/asset-manager/helper";

test('decode uuid', function () {
    const encoded = 'fcmR3XADNLgJ1ByKhqcC5Z';
    const decoded = 'fc991dd7-0033-4b80-9d41-c8a86a702e59';
    const uuid = decodeUuid(encoded);
    expect(uuid).toBe(decoded);
});

test('decode subAsset(texture) uuid', function () {
    const encoded = '2fkGWtA3tNPY4mxAw5aggP@6c48a';
    const decoded = '2f9065ad-037b-4d3d-8e26-c40c396a080f@6c48a';
    const uuid = decodeUuid(encoded);
    expect(uuid).toBe(decoded);
});

test('decode subAsset(spriteFrame) uuid', function () {
    const encoded = 'f9PAVgqAJCBI9mVlX974oI@f9941';
    const decoded = 'f93c0560-a802-4204-8f66-5655fdef8a08@f9941';
    const uuid = decodeUuid(encoded);
    expect(uuid).toBe(decoded);
});
