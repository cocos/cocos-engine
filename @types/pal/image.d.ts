declare module 'pal/image' {
    export type ImageSource = import('pal/image/types').ImageSource;
    export type IMemoryImageSource = import('pal/image/types').IMemoryImageSource;
    export type PixelFormat = import('cocos/asset/assets/asset-enum').PixelFormat;
    export class ImageData {
        constructor (imageAsset?: ImageSource | ArrayBufferView);
        /**
         * Destroy resources.
         */
        destroy (): void;

        /**
         * Get and set the url of the image(when source is HTMLImageElement).
         */
        get src (): string;
        set src(url: string);
        /**
         * Get and set image data source.
         * @param value Image data source.
         */
        get data(): ImageSource | ArrayBufferView;
        set data(value: ImageSource | ArrayBufferView);

        /**
         * Get and set image width(when source is IMemoryImageSource).
         */
        get width(): number;
        set width(value: number);

        /**
         * Get and set image height(when source is IMemoryImageSource).
         */
        get height(): number;
        set height(value: number);

        /**
         * Get image format.
         */
        get format(): PixelFormat;
        /**
         * Get if the image is compressed.
         */
        get compressed(): boolean;
        get mipmapLevelDataSize(): number[] | undefined;
        /**
         * Load image via local url or web url.
         */
        static loadImage (url: string): Promise<ImageData>

        /**
         * Get raw image data, in web platform is image source(like data interface), in native platform is image raw data.
         */
        getRawData (): unknown;
        /**
         * Determine if it is an HTMLElement element.
         */
        isHtmlElement(): boolean;
        /**
         * Set image data source.
         * @param data Image data source(Not contain IMemoryImageSource).
         */
        reset(data: ImageSource): void;
    }
}
