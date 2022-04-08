import { Sprite, SpriteFrame } from '../../cocos/2d';
import { dynamicAtlasManager } from '../../cocos/2d/utils/dynamic-atlas/atlas-manager';
import { Texture2D } from '../../cocos/core';

test('Pack to DynamicAtlas', function () {

    let sprite = new Sprite();
    dynamicAtlasManager.packToDynamicAtlas(sprite,null);
    expect(dynamicAtlasManager.atlasCount).toBe(0);

    let spriteframe_0 = new SpriteFrame();
    dynamicAtlasManager.packToDynamicAtlas(sprite, spriteframe_0);
    expect(dynamicAtlasManager.atlasCount).toBe(0);

    spriteframe_0.packable = true;
    dynamicAtlasManager.packToDynamicAtlas(sprite, spriteframe_0);
    expect(dynamicAtlasManager.atlasCount).toBe(0);

    let texture_0 = new Texture2D();
    spriteframe_0.texture = texture_0;
    dynamicAtlasManager.packToDynamicAtlas(sprite, spriteframe_0);
    expect(dynamicAtlasManager.atlasCount).toBe(0);

    texture_0.create(1, 1);
    spriteframe_0.packable = true;
    dynamicAtlasManager.packToDynamicAtlas(sprite, spriteframe_0);
    expect(dynamicAtlasManager.atlasCount).toBe(1);

    let atlas = dynamicAtlasManager._atlases[0];
    expect(atlas._innerSpriteFrames.length).toBe(1);

});

test('Delete Atlas SpriteFrame', function () {

    dynamicAtlasManager.reset();

    let sprite = new Sprite();
    let spriteframe_0 = new SpriteFrame();
    let texture_0 = new Texture2D();
    spriteframe_0.texture = texture_0;
    texture_0.create(1, 1);
    spriteframe_0.packable = true;
    dynamicAtlasManager.packToDynamicAtlas(sprite, spriteframe_0);
    expect(dynamicAtlasManager.atlasCount).toBe(1);

    let atlas = dynamicAtlasManager._atlases[0];
    expect(atlas._innerSpriteFrames.length).toBe(1);

    dynamicAtlasManager.deleteAtlasSpriteFrame(spriteframe_0);
    spriteframe_0._resetDynamicAtlasFrame();
    expect(dynamicAtlasManager.atlasCount).toBe(0);

    dynamicAtlasManager.packToDynamicAtlas(sprite, spriteframe_0);
    expect(dynamicAtlasManager.atlasCount).toBe(1);
    atlas = dynamicAtlasManager._atlases[0];
    expect(atlas._innerSpriteFrames.length).toBe(1);

});
