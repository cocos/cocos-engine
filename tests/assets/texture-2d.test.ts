import { ImageAsset } from '../../cocos/asset/assets/image-asset';
import { Texture2D } from '../../cocos/asset/assets/texture-2d';
import { dependMap } from '../../cocos/asset/asset-manager/depend-maps';
import dependUtil from '../../cocos/asset/asset-manager/depend-util';
import { setProperties } from '../../cocos/asset/asset-manager/utilities';
import { macro } from '../../cocos/core';

const textureUuid = 'f41e5c8f-0e9a-4c38-bb1d-texture2d';

afterEach(() => {
    dependUtil.remove(textureUuid);
});

test('releases every Texture2D dependency edge for an uploaded image', () => {
    const cleanupImageCache = macro.CLEANUP_IMAGE_CACHE;
    macro.CLEANUP_IMAGE_CACHE = true;

    try {
        const texture = new Texture2D();
        texture._uuid = textureUuid;
        const image = new ImageAsset({
            _data: new Uint8Array(4),
            width: 1,
            height: 1,
        });
        image._uuid = '6d35c119-b763-4295-96e7-image';
        const deps = [
            { uuid: image._uuid, owner: texture, prop: '_textureSource' },
            { uuid: image._uuid, owner: texture._mipmaps, prop: '0' },
        ];
        const assetsMap = { [`${image._uuid}@import`]: image };

        dependMap.set(texture, deps);
        dependUtil._depends.add(textureUuid, { deps: deps.map((dep) => dep.uuid) });
        setProperties(textureUuid, texture, assetsMap);
        expect(image.refCount).toBe(2);

        texture.onLoaded();

        expect(image.refCount).toBe(0);
        expect(dependUtil.getDeps(textureUuid)).toEqual([]);
    } finally {
        macro.CLEANUP_IMAGE_CACHE = cleanupImageCache;
    }
});
