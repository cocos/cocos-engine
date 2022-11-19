
import Cache from '../../cocos/asset/asset-manager/cache'
test('operation', function () {
    const cache = new Cache();
    cache.add('test 1', {url: 'resources/image'});
    expect(cache.count).toBe(1);
    expect(cache.get('test 1').url).toBe('resources/image');
    expect(cache.get('')).toBeFalsy();
    cache.add('test 1', {url: 'resources/image2'});
    expect(cache.count).toBe(1);
    cache.remove('test 1');
    expect(cache.count).toBe(0);
});