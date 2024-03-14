import { SpriteFrame } from "../../cocos/2d";
import { Texture2D } from "../../cocos/asset/assets";
import { Rect, Size, Vec2 } from "../../exports/base";

test('sprite-frame.clone', () => {
    let sp = new SpriteFrame;

    sp.insetTop = 100;
    expect(sp.insetTop).toStrictEqual(100);
    sp.insetBottom = 200;
    expect(sp.insetBottom).toStrictEqual(200);
    sp.insetLeft = 300;
    expect(sp.insetLeft).toStrictEqual(300);
    sp.insetRight = 400;
    expect(sp.insetRight).toStrictEqual(400);

    let rc = new Rect(0, 0, 100, 100);
    sp.rect = rc;
    expect(sp.rect).toEqual(rc);

    let sz = new Size(100, 100);
    sp.originalSize = sz
    expect(sp.originalSize).toEqual(sz);

    let offset = new Vec2(100, 200);
    sp.offset = offset;
    expect(sp.offset).toEqual(offset);

    sp.rotated = true;
    expect(sp.rotated).toEqual(true);

    let tex = new Texture2D();
    sp.texture = tex;
    expect(sp.texture).toEqual(tex);

    let atlasUuid = '123456787abcd';
    sp.atlasUuid = atlasUuid;
    expect(sp.atlasUuid).toStrictEqual(atlasUuid);

    expect(sp.width).toEqual(tex.width);
    expect(sp.height).toEqual(tex.height);

    sp.flipUVX = true;
    sp.flipUVY = false;
    expect(sp.flipUVX).toEqual(true);
    expect(sp.flipUVY).toEqual(false);

    sp.packable = true;
    expect(sp.packable).toEqual(true);

    // default value
    expect(sp.pixelsToUnit).toEqual(100);
    expect(sp.pivot).toEqual(new Vec2(0.5, 0.5));
    
    sp.setRotated(false);
    expect(sp.rotated).toEqual(false);
    // Make sure the mesh is created
    sp.ensureMeshData();
    
    let sp_clone = sp.clone();
    expect(sp_clone.insetTop).toStrictEqual(sp.insetTop);
    expect(sp_clone.insetBottom).toStrictEqual(sp.insetBottom);
    expect(sp_clone.insetLeft).toStrictEqual(sp.insetLeft);
    expect(sp_clone.insetRight).toStrictEqual(sp.insetRight);
    expect(sp_clone.rect).toEqual(sp.rect);
    expect(sp_clone.originalSize).toEqual(sp.originalSize);
    expect(sp_clone.offset).toEqual(sp.offset);
    expect(sp_clone.rotated).toEqual(sp.rotated);
    
    expect(sp_clone.texture).toEqual(sp.texture);
    expect(sp_clone.atlasUuid).toStrictEqual(sp.atlasUuid);

    expect(sp_clone.width).toEqual(sp.width);
    expect(sp_clone.height).toEqual(sp.height);
    expect(sp_clone.flipUVX).toEqual(sp.flipUVX);
    expect(sp_clone.flipUVY).toEqual(sp.flipUVY);
    expect(sp_clone.packable).toEqual(sp.packable);

    expect(sp_clone.pixelsToUnit).toEqual(sp.pixelsToUnit);
    expect(sp_clone.pivot).toEqual(sp.pivot);
    expect(sp_clone.mesh).toEqual(sp.mesh);
    expect(sp_clone.uv).toEqual(sp.uv);
    expect(sp_clone.unbiasUV).toEqual(sp.unbiasUV);
    expect(sp_clone.uvSliced).toEqual(sp.uvSliced);
    expect(sp_clone.vertices).toEqual(sp.vertices);
    expect(sp_clone.original).toEqual(sp.original);
    expect(sp_clone.trimmedBorder).toEqual(sp.trimmedBorder);
});
