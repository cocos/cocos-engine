import { BaseImageData } from '../base-image-data';
import { ccwindow } from '../../../cocos/core/global-exports';
import { getError } from '../../../cocos/core';

export class ImageData extends BaseImageData {
    public nativeData (): unknown {
        // TODO:Get raw image data
        return null;
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
