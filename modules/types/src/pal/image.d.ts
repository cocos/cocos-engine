declare module 'pal/image' {

    export type ImageSource = import('../../../../pal/image/types').ImageSource;
    export type IMemoryImageSource = import('../../../../pal/image/types').IMemoryImageSource;
    export type PixelFormat = import('../../../../cocos/asset/assets/asset-enum').PixelFormat;
    export type RawDataType = import('../../../../pal/image/types').RawDataType;
    export class ImageData {
        constructor (source?: ImageSource | ArrayBufferView);
        /**
         * Destroy resources.
         */
        destroy (): void;

        /**
         * @en Get raw image data.Return `ImageBitmap` if source is `ImageBitmap`.
         * @zh 获取原始图像数据。如果source是`ImageBitmap`类型，则返回ImageBitmap。
         */
        get data(): RawDataType | null;

        /**
         * Get and set image data source.
         * @param value Image data source.
         * @engineinternal
         */
        get source(): ImageSource;
        set source(value: ImageSource);

        /**
         * Get image width.
         */
        get width(): number;

        /**
         * Get image height.
         */
        get height(): number;

        /**
         * Load image via local url or web url.
         */
        static loadImage (urlAndBase64: string): Promise<ImageData>

        /**
         * Set image data source.
         * @param data Image data source.
         */
        reset(data?: ImageSource | ArrayBufferView): void;
    }
}
