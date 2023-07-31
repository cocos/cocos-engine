declare module 'pal/image' {

    export type ImageSource = import('pal/image/types').ImageSource;
    export type IMemoryImageSource = import('pal/image/types').IMemoryImageSource;
    export type PixelFormat = import('cocos/asset/assets/asset-enum').PixelFormat;
    export type RawDataType = import('pal/image/types').RawDataType;
    export class ImageData {
        constructor (imageAsset?: ImageSource | ArrayBufferView);
        /**
         * Destroy resources.
         */
        destroy (): void;

        /**
         * Get and set image data source.
         * @param value Image data source.
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
         * Get raw image data, in web platform is image source(like data interface), in native platform is image raw data.
         */
        getRawData (): RawDataType | null;

        /**
         * Set image data source.
         * @param data Image data source.
         */
        reset(data?: ImageSource | ArrayBufferView): void;
    }
}
