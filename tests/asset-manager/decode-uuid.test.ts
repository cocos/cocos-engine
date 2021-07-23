
import { decodeUuid } from "../../cocos/core/asset-manager/helper";

test('decode uuid', function () {
    var encoded = 'fcmR3XADNLgJ1ByKhqcC5Z';
    var decoded = 'fc991dd7-0033-4b80-9d41-c8a86a702e59';
    var uuid = decodeUuid(encoded);
    expect(uuid).toBe(decoded);
});

test('decode subAsset(texture) uuid', function () {
    var encoded = '2fkGWtA3tNPY4mxAw5aggP@6c48a';
    var decoded = '2f9065ad-037b-4d3d-8e26-c40c396a080f@6c48a';
    var uuid = decodeUuid(encoded);
    expect(uuid).toBe(decoded);
});

test('decode subAsset(spriteFrame) uuid', function () {
    var encoded = 'f9PAVgqAJCBI9mVlX974oI@f9941';
    var decoded = 'f93c0560-a802-4204-8f66-5655fdef8a08@f9941';
    var uuid = decodeUuid(encoded);
    expect(uuid).toBe(decoded);
});
