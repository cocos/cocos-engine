/**
 * @category asset
 */

import { GFXAddress, GFXFilter, GFXFormat } from '../gfx/define';

/**
 * @en
 * The texture pixel format, default value is RGBA8888,<br>
 * you should note that textures loaded by normal image files (png, jpg) can only support RGBA8888 format,<br>
 * other formats are supported by compressed file types or raw data.
 * @zh
 * 纹理像素格式，默认值为RGBA8888，<br>
 * 你应该注意到普通图像文件（png，jpg）加载的纹理只能支持RGBA8888格式，<br>
 * 压缩文件类型或原始数据支持其他格式。
 */
export enum PixelFormat {
    /**
     * @en
     * 16-bit texture without Alpha channel
     * @zh
     * 没有透明度通道的16位纹理。
     */
    RGB565 = GFXFormat.R5G6B5,
    /**
     * @en
     * 16-bit textures: RGB5A1
     * @zh
     * 16位纹理：RGB5A1。
     */
    RGB5A1 = GFXFormat.RGB5A1,
    /**
     * @en
     * 16-bit textures: RGBA4444
     * @zh
     * 16位纹理：RGBA4444。
     */
    RGBA4444 = GFXFormat.RGBA4,
    /**
     * @en
     * 24-bit texture: RGB888
     * @zh
     * 24位纹理：RGB888。
     */
    RGB888 = GFXFormat.RGB8,
    /**
     * @en
     * 32-bit float texture: RGBA32F
     * @zh
     * 32位纹理：RGBA32F。
     */
    RGB32F = GFXFormat.RGB32F,
    /**
     * @en
     * 32-bit texture: RGBA8888
     * @zh
     * 32位纹理：RGBA8888。
     */
    RGBA8888 = GFXFormat.RGBA8,
    /**
     * @en
     * 32-bit float texture: RGBA32F
     * @zh
     * 32位纹理：RGBA32F。
     */
    RGBA32F = GFXFormat.RGBA32F,
    /**
     * @en
     * 8-bit textures used as masks
     * @zh
     * 用作蒙版的8位纹理。
     */
    A8 = GFXFormat.A8,
    /**
     * @en
     * 8-bit intensity texture
     * @zh
     * 8位强度纹理。
     */
    I8 = GFXFormat.L8,
    /**
     * @en
     * 16-bit textures used as masks
     * @zh
     * 用作蒙版的16位纹理。
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
 * @en
 * The texture wrap mode.
 * @zh
 * 纹理环绕方式。
 */
export enum WrapMode {
    /**
     * @en
     * Specifies that the repeat warp mode will be used.
     * @zh
     * 指定环绕模式：重复纹理图像。
     */
    REPEAT = GFXAddress.WRAP,
    /**
     * @en
     * Specifies that the clamp to edge warp mode will be used.
     * @zh
     * 指定环绕模式：纹理边缘拉伸效果。
     */
    CLAMP_TO_EDGE = GFXAddress.CLAMP,
    /**
     * @en
     * Specifies that the mirrored repeat warp mode will be used.
     * @zh
     * 指定环绕模式：以镜像模式重复纹理图像。
     */
    MIRRORED_REPEAT = GFXAddress.MIRROR,
    /**
     * @en
     * Specifies that the  clamp to border wrap mode will be used.
     * @zh
     * 指定环绕模式：超出纹理坐标部分以用户指定颜色填充。
     */
    CLAMP_TO_BORDER = GFXAddress.BORDER,
}

/**
 * @en
 * The texture filter mode
 * @zh
 * 纹理过滤模式。
 */
export enum Filter {
    NONE = GFXFilter.NONE,
    /**
     * @en
     * Specifies linear filtering.
     * @zh
     * 线性过滤模式。
     */
    LINEAR = GFXFilter.LINEAR,
    /**
     * @en
     * Specifies nearest filtering.
     * @zh
     * 临近过滤模式。
     */
    NEAREST = GFXFilter.POINT,
}

export enum DepthStencilFormat {
    NONE = GFXFormat.UNKNOWN,

    DEPTH_16 = GFXFormat.D16,

    DEPTH_24 = GFXFormat.D24,

    DEPTH_32 = GFXFormat.D32F,

    DEPTH_16_STENCIL_8 = GFXFormat.D16S8,

    DEPTH_24_STENCIL_8 = GFXFormat.D24S8,

    DEPTH_32_STENCIL_8 = GFXFormat.D32F_S8,
}
