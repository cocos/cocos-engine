import { GFXAddress, GFXFilter, GFXFormat } from '../gfx/define';

/**
 * The texture pixel format, default value is RGBA8888,
 * you should note that textures loaded by normal image files (png, jpg) can only support RGBA8888 format,
 * other formats are supported by compressed file types or raw data.
 * @enum {number}
 */
export enum PixelFormat {
    /**
     * 16-bit texture without Alpha channel
     */
    RGB565 = GFXFormat.R5G6B5,
    /**
     * 16-bit textures: RGB5A1
     */
    RGB5A1 = GFXFormat.RGB5A1,
    /**
     * 16-bit textures: RGBA4444
     */
    RGBA4444 = GFXFormat.RGBA4,
    /**
     * 24-bit texture: RGB888
     */
    RGB888 = GFXFormat.RGB8,
    /**
     * 32-bit texture: RGBA8888
     */
    RGBA8888 = GFXFormat.RGBA8,
    /**
     * 32-bit float texture: RGBA32F
     */
    RGBA32F = GFXFormat.RGBA32F,
    /**
     * 8-bit textures used as masks
     */
    A8 = GFXFormat.A8,
    /**
     * 8-bit intensity texture
     */
    I8 = GFXFormat.L8,
    /**
     * 16-bit textures used as masks
     */
    AI8 = GFXFormat.LA8,
    /**
     * rgb 2 bpp pvrtc
     */
    RGB_PVRTC_2BPPV1 = GFXFormat.PVRTC_RGB2,
    /**
     * rgba 2 bpp pvrtc
     */
    RGBA_PVRTC_2BPPV1 = GFXFormat.PVRTC_RGBA2,
    /**
     * rgb 4 bpp pvrtc
     */
    RGB_PVRTC_4BPPV1 = GFXFormat.PVRTC_RGB4,
    /**
     * rgba 4 bpp pvrtc
     */
    RGBA_PVRTC_4BPPV1 = GFXFormat.PVRTC_RGBA4,
    /**
     * rgb etc1
     */
    RGB_ETC1 = GFXFormat.ETC_RGB8,
    /**
     * rgb etc2
     */
    RGB_ETC2 = GFXFormat.ETC2_RGB8,
    /**
     * rgba etc2
     */
    RGBA_ETC2 = GFXFormat.ETC2_RGBA8,
}

/**
 * The texture wrap mode.
 * @enum {number}
 */
export enum WrapMode {
    /**
     * Specifies that the repeat warp mode will be used.
     */
    REPEAT = GFXAddress.WRAP,
    /**
     * Specifies that the clamp to edge warp mode will be used.
     */
    CLAMP_TO_EDGE = GFXAddress.CLAMP,
    /**
     * Specifies that the mirrored repeat warp mode will be used.
     */
    MIRRORED_REPEAT = GFXAddress.MIRROR,
    /**
     * Specifies that the  clamp to border wrap mode will be used.
     */
    CLAMP_TO_BORDER = GFXAddress.BORDER,
}

/**
 * The texture filter mode
 * @enum {number}
 */
export enum Filter {
    NONE = GFXFilter.NONE,
    /**
     * Specifies linear filtering.
     */
    LINEAR = GFXFilter.LINEAR,
    /**
     * Specifies nearest filtering.
     */
    NEAREST = GFXFilter.POINT,
}
