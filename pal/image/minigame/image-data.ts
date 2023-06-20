import { ALIPAY, XIAOMI, JSB, BAIDU, TAOBAO, TAOBAO_MINIGAME, WECHAT_MINI_PROGRAM } from 'internal:constants';
import { BaseImageData } from '../base-image-data';
import { ImageSource } from '../types';
import { ccwindow } from '../../../cocos/core/global-exports';
import { getError } from '../../../cocos/core';

export class ImageData extends BaseImageData {
    protected isNativeImage (imageSource: ImageSource): imageSource is (HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
        if (ALIPAY || TAOBAO || TAOBAO_MINIGAME || XIAOMI || BAIDU || WECHAT_MINI_PROGRAM) {
            // We're unable to grab the constructors of Alipay native image or canvas object.
            return !('_data' in imageSource);
        }
        return super.isNativeImage(imageSource);
    }

    set src (url: string) {
        (this._imageSource as HTMLImageElement).src = url;
    }

    static downloadImage (url: string,
        options: Record<string, any>,
        onComplete: ((err: Error | null, data?: HTMLImageElement | null) => void)): HTMLImageElement {
        const image = new ImageData();

        // NOTE: on xiaomi platform, we need to force setting img.crossOrigin as 'anonymous'
        if (ccwindow.location.protocol !== 'file:' || XIAOMI) {
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
