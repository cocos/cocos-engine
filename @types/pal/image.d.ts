declare module 'pal/image' {
    type ImageSource = import('pal/image/types').ImageSource;
    type IMemoryImageSource = import('pal/image/types').IMemoryImageSource;
    export class ImageData {
        constructor (imageAsset?: ImageSource | ArrayBufferView);
        //constructor (content: string, manifestRoot: string);
        destroy (): void;
        get src (): string;
        set src(url: string);
        set data(value: any);
        get data(): ImageSource | ArrayBufferView;
        set width(value: any);
        get width(): number;
        get height(): number;
        set height(value: any);
        get format(): number;
        get compressed(): number;
        get mipmapLevelDataSize(): number[] | undefined;
        static downloadImage (
            url: string,
            options: Record<string, any>,
            onComplete: ((err: Error | null, data?: HTMLImageElement | null) => void),
        ): HTMLImageElement;
        onload: ((ev: Event) => any) | null;
        onerror: ((ev: Event) => any) | null;
        nativeData (): unknown;
        isHtmlElement(): boolean;
        reset(data: ImageSource): void;
    }
}
