import { BaseImageData } from '../base-image-data';
import { ImageSource, IMemoryImageSource } from '../types';
import { ccwindow } from '../../../cocos/core/global-exports';
import { getError } from '../../../cocos/core';

export class ImageData extends BaseImageData {
    public destroy () {
        if (this.data && this.data instanceof HTMLImageElement) {
            // JSB element should destroy native data.
            // TODO: Property 'destroy' does not exist on type 'HTMLImageElement'.
            // maybe we need a higher level implementation called `pal/image`, we provide `destroy` interface here.
            // issue: https://github.com/cocos/cocos-engine/issues/14646
            (this.data as any).destroy();
        }
        super.destroy();
    }
    public nativeData (): unknown {
        if (this._imageSource instanceof HTMLCanvasElement) {
            // @ts-ignore
            return this._imageSource._data.data;
        } else if (this._imageSource instanceof HTMLImageElement) {
            // @ts-ignore
            return this._imageSource._data;
        } else if (ArrayBuffer.isView(this._imageSource)) {
            return this._imageSource.buffer;
        }
        return super.nativeData();
    }

    protected isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
        if ((imageSource as IMemoryImageSource)._compressed === true) {
            return false;
        }
        return super.isNativeImage(imageSource);
    }

    static downloadImage (url: string,
        options: Record<string, any>,
        onComplete: ((err: Error | null, data?: HTMLImageElement | null) => void)): HTMLImageElement {
        const image = new ImageData();

        // NOTE: on xiaomi platform, we need to force setting img.crossOrigin as 'anonymous'
        if (ccwindow.location.protocol !== 'file:') {
            image.crossOrigin = 'anonymous';
        }

        function loadCallback () {
            image.removeEventListener('load', loadCallback);
            if (onComplete) { onComplete(null, image.data as HTMLImageElement); }
            image.removeEventListener('error', errorCallback);
        }

        function errorCallback () {
            image.removeEventListener('load', loadCallback);
            image.removeEventListener('error', errorCallback);
            if (onComplete) { onComplete(new Error(getError(4930, url))); }
        }

        image.addEventListener('load', loadCallback);
        image.addEventListener('error', errorCallback);
        image.src = url;
        return (image.data as HTMLImageElement);
    }
}
