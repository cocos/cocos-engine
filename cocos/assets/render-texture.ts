import { ccclass } from '../core/data/class-decorator';
import { IRect2D, normalizeRect2D } from '../core/vmath/rect';
import { GFXFormat, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType } from '../gfx/define';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXTexture } from '../gfx/texture';
import { GFXTextureView } from '../gfx/texture-view';
import { RenderPassStage } from '../pipeline/render-pipeline';
import ImageAsset from './image-asset';
import Texture2D from './texture-2d';

enum DepthStencilFormat {
    D24S8 = GFXFormat.D24S8,

    S8 = GFXFormat.R8UI,

    D16 = GFXFormat.D16,
}

function toGfxDepthStencilFormat (depthStencilFormat: DepthStencilFormat): GFXFormat {
    return depthStencilFormat as unknown as GFXFormat;
}

/**
 * Render textures are textures that can be rendered to.
 * @class RenderTexture
 * @extends Texture2D
 */
@ccclass('cc.RenderTexture')
export default class RenderTexture extends Texture2D {
    private _framebuffer: GFXFramebuffer | null = null;

    private _depthStencilTexture: GFXTexture | null = null;

    private _depthStencilTextureView: GFXTextureView | null = null;

    constructor () {
        super();
    }

    /**
     * !#en
     * Init the render texture with size.
     * !#zh
     * 初始化 render texture
     * @param [width]
     * @param [height]
     * @param [depthStencilFormat]
     * @method initWithSize
     */
    public initWithSize (width?: number, height?: number, depthStencilFormat?: DepthStencilFormat) {
        this.destroy();

        const gfxDevice = this._getGlobalDevice();
        if (!gfxDevice) {
            return;
        }

        const w = Math.floor(width || cc.visibleRect.width);
        const h = Math.floor(height || cc.visibleRect.height);
        const image = new ImageAsset({
            width: w,
            height: h,
            format: GFXFormat.RGBA8UI,
            _data: new Uint8Array(w * h * 4),
            _compressed: false,
        });

        this.image = image;

        if (!this._texture) {
            return;
        }

        const colorView = gfxDevice.createTextureView({
            texture: this._texture,
            type: GFXTextureViewType.TV2D,
            format: this._getGfxFormat(),
        });

        if (!colorView) {
            return;
        }

        if (depthStencilFormat !== undefined) {
            this._depthStencilTexture = gfxDevice.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
                format: toGfxDepthStencilFormat(depthStencilFormat),
                width: w,
                height: h,
            });
            if (!this._depthStencilTexture) {
                return;
            }
            this._depthStencilTextureView = gfxDevice.createTextureView({
                texture: this._depthStencilTexture,
                type: GFXTextureViewType.TV2D,
                format: toGfxDepthStencilFormat(depthStencilFormat),
            });
        }

        if (this._depthStencilTextureView === null) {
            return;
        }

        this._framebuffer = gfxDevice.createFramebuffer({
            renderPass: cc.director.root.pipeline.getRenderPass(RenderPassStage.DEFAULT),
            colorViews: [ colorView ],
            depthStencilView: this._depthStencilTextureView === null ? undefined : this._depthStencilTextureView,
            isOffscreen: true,
        });

        this.loaded = true;
        // @ts-ignore
        this.emit('load');
    }

    public destroy () {
        if (this._framebuffer) {
            this._framebuffer.destroy();
            this._framebuffer = null;
        }
        if (this._depthStencilTextureView) {
            this._depthStencilTextureView.destroy();
            this._depthStencilTextureView = null;
        }
        if (this._depthStencilTexture) {
            this._depthStencilTexture.destroy();
            this._depthStencilTexture = null;
        }
        return super.destroy();
    }

    // TODO:
    // public updateSize (width, height) {
    //     this.width = Math.floor(width || cc.visibleRect.width);
    //     this.height = Math.floor(height || cc.visibleRect.height);
    //     this._resetUnderlyingMipmaps();

    //     const rbo = this.depthStencilBuffer;
    //     if (rbo) { rbo.update(this.width, this.height); }
    //     this._framebuffer._width = width;
    //     this._framebuffer._height = height;
    // }

    /**
     * !#en Draw a texture to the specified position
     * !#zh 将指定的图片渲染到指定的位置上
     * @param texture
     * @param x
     * @param y
     */
    public drawTextureAt (texture: Texture2D, x: number, y: number) {
        if (!this._texture) {
            return;
        }

        const image = texture.image;

        if (!image) {
            return;
        }

        this._assignImage(image, 0);
    }

    /**
     * !#en
     * Get pixels from render texture, the pixels data stores in a RGBA Uint8Array.
     * It will return a new (width * height * 4) length Uint8Array by default。
     * You can specify a data to store the pixels to reuse the data,
     * you and can specify other params to specify the texture region to read.
     * !#zh
     * 从 render texture 读取像素数据，数据类型为 RGBA 格式的 Uint8Array 数组。
     * 默认每次调用此函数会生成一个大小为 （长 x 高 x 4） 的 Uint8Array。
     * 你可以通过传入 data 来接收像素数据，也可以通过传参来指定需要读取的区域的像素。
     * @param [data]
     * @param [rect]
     */
    public readPixels (data?: Uint8Array, rect: IRect2D = {}) {
        if (!this._framebuffer || !this._texture) {
            return undefined;
        }

        const gfxDevice = this._getGlobalDevice();
        if (!gfxDevice) {
            return;
        }

        const normalizedRect = normalizeRect2D(rect, this.width, this.height);

        data = data || new Uint8Array(normalizedRect.width * normalizedRect.height * 4);

        gfxDevice.copyFramebufferToBuffer(this._framebuffer, data.buffer, [{
            buffOffset: 0,
            buffStride: 0,
            buffTexHeight: 0,
            texOffset: {
                x: normalizedRect.x,
                y: normalizedRect.y,
                z: 0,
            },
            texExtent: {
                width: normalizedRect.width,
                height: normalizedRect.height,
                depth: 1,
            },
            texSubres: {
                baseMipLevel: 0,
                levelCount: 1,
                baseArrayLayer: 0,
                layerCount: 1,
            },
        }]);

        return data;
    }
}

cc.RenderTexture = RenderTexture;
