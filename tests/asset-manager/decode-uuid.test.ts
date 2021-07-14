import { decodeUuid } from "../../cocos/core/asset-manager/helper";

module('decode uuid');

test('decode uuid', function () {
    var encoded = 'fcmR3XADNLgJ1ByKhqcC5Z';
    var decoded = 'fc991dd7-0033-4b80-9d41-c8a86a702e59';
    var uuid = decodeUuid(encoded);
    strictEqual(uuid, decoded, 'uuid could be decoded');
});
