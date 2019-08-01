module('Cache');

var cache = new cc.AssetManager.Cache();
test('operation', function () {
    cache.add('test 1', {url: 'resources/image'});
    strictEqual(cache.count, 1, 'should equal to 1');
    strictEqual(cache.get('test 1').url, 'resources/image', 'should equal to resources/image');
    ok(!cache.get(''), 'should be undefined');
    cache.add('test 1', {url: 'resources/image2'});
    strictEqual(cache.count, 1, 'should equal to 1');
    cache.remove('test 1');
    strictEqual(cache.count, 0, 'should equal to 0');
});