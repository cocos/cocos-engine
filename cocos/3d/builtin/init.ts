import { Asset } from '../../assets/asset';
import { SpriteFrame} from '../../assets/CCSpriteFrame';
import { ImageAsset } from '../../assets/image-asset';
import { Texture2D } from '../../assets/texture-2d';
import { Rect } from '../../core/value-types';
import { GFXDevice } from '../../gfx/device';
import { TextureCube } from '../assets/texture-cube';

class BuiltinResMgr {
    protected _device: GFXDevice | null = null;
    protected _resources: Record<string, Asset> = {};

    // this should be called after renderer initialized
    public initBuiltinRes (device: GFXDevice) {
        this._device = device;
        const resources = this._resources;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        const imgAsset = new ImageAsset(canvas);
        canvas.width = canvas.height = 2;

        // ============================
        // builtin textures
        // ============================

        // black texture
        context.fillStyle = '#000';
        context.fillRect(0, 0, 2, 2);
        const blackTexture = new Texture2D();
        blackTexture._uuid = 'black-texture';
        blackTexture.image = imgAsset;
        resources[blackTexture._uuid] = blackTexture;

        // grey texture
        context.fillStyle = '#777';
        context.fillRect(0, 0, 2, 2);
        const greyTexture = new Texture2D();
        greyTexture._uuid = 'grey-texture';
        greyTexture.image = imgAsset;
        resources[greyTexture._uuid] = greyTexture;

        // grey cube texture
        // const greyCubeTexture = new TextureCube();
        // greyCubeTexture._uuid = 'grey-cube-texture';
        // greyCubeTexture.image = {
        //     front: new ImageAsset(canvas),
        //     back: new ImageAsset(canvas),
        //     left: new ImageAsset(canvas),
        //     right: new ImageAsset(canvas),
        //     top: new ImageAsset(canvas),
        //     bottom: new ImageAsset(canvas),
        // };
        // resources[greyCubeTexture._uuid] = greyCubeTexture;

        // white texture
        context.fillStyle = '#fff';
        context.fillRect(0, 0, 2, 2);
        const whiteTexture = new Texture2D();
        whiteTexture._uuid = 'white-texture';
        whiteTexture.image = imgAsset;
        resources[whiteTexture._uuid] = whiteTexture;

        // normal texture
        context.fillStyle = '#7f7fff';
        context.fillRect(0, 0, 2, 2);
        const normalTexture = new Texture2D();
        normalTexture._uuid = 'normal-texture';
        normalTexture.image = imgAsset;
        resources[normalTexture._uuid] = normalTexture;

        // default texture
        context.fillStyle = '#ddd';
        context.fillRect(0, 0, 2, 2);
        context.fillStyle = '#555';
        context.fillRect(0, 0, 1, 1);
        context.fillStyle = '#555';
        context.fillRect(1, 1, 1, 1);
        const defaultTexture = new Texture2D();
        defaultTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        defaultTexture._uuid = 'default-texture';
        defaultTexture.image = imgAsset;
        resources[defaultTexture._uuid] = defaultTexture;

        // default cube texture
        // const defaultCubeTexture = new TextureCube();
        // defaultCubeTexture._uuid = 'default-cube-texture';
        // defaultCubeTexture.image = {
        //     front: new ImageAsset(canvas),
        //     back: new ImageAsset(canvas),
        //     left: new ImageAsset(canvas),
        //     right: new ImageAsset(canvas),
        //     top: new ImageAsset(canvas),
        //     bottom: new ImageAsset(canvas),
        // };
        // resources.push(defaultCubeTexture);

        const spriteFrame = new SpriteFrame();
        spriteFrame.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        spriteFrame.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        spriteFrame._uuid = 'default-spriteframe';
        spriteFrame.setOriginalSize(cc.size(imgAsset.width, imgAsset.height));
        spriteFrame.setRect(new Rect(0, 0, imgAsset.width, imgAsset.height));
        spriteFrame.image = imgAsset;
        if (spriteFrame.onLoaded) {
            spriteFrame.onLoaded();
        }
        resources[spriteFrame._uuid] = spriteFrame;

        // default material
        const defaultMtl = new cc.Material();
        defaultMtl._uuid = 'default-material';
        defaultMtl.setDefines({ USE_COLOR: true });
        defaultMtl.effectName = 'builtin-effect-unlit';
        defaultMtl.setProperty('color', cc.color('#FF00FF'));
        resources[defaultMtl._uuid] = defaultMtl;

        // sprite material
        const spriteMtl = new cc.Material();
        spriteMtl._uuid = 'sprite-material';
        spriteMtl.effectName = 'builtin-effect-sprite';
        spriteMtl.setProperty('mainTexture', defaultTexture);
        resources[spriteMtl._uuid] = spriteMtl;
    }

    public get<T extends Asset> (uuid: string): T {
        return this._resources[uuid];
    }
}

const builtinResMgr = cc.builtinResMgr = new BuiltinResMgr();
export { builtinResMgr };
