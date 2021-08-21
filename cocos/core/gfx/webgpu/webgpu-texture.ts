import {
    FormatSurfaceSize,
    TextureInfo,
    IsPowerOf2,
    TextureViewInfo,
} from '../base/define';
import { Texture } from '../base/texture';
import { wgpuWasmModule } from './webgpu-utils';
import { WebGPUDevice } from './webgpu-device';

export class WebGPUTexture extends Texture {
    private _nativeTexture;

    get nativeTexture () {
        return this._nativeTexture;
    }
    public initialize (info: TextureInfo | TextureViewInfo): boolean {
        const nativeDevice = (this._device as WebGPUDevice).nativeDevice();
        if ('texture' in info) {
            const texViewInfo = new wgpuWasmModule.TextureViewInfoInstance();
            texViewInfo.setTexture((info.texture as WebGPUTexture).nativeTexture().getThis());
            texViewInfo.setType(info.type);
            texViewInfo.setFormat(info.format);
            texViewInfo.setBaseLevel(info.baseLevel);
            texViewInfo.setLevelCount(info.levelCount);
            texViewInfo.setBaseLayer(info.baseLayer);
            texViewInfo.setLayerCount(info.layerCount);
            this._nativeTexture = nativeDevice.createTexture(texViewInfo);
        } else {
            const texInfo = new wgpuWasmModule.TextureInfoInstance();
            texInfo.type = info.type;
            texInfo.usage = info.usage;
            texInfo.format = info.format;
            texInfo.width = info.width;
            texInfo.height = info.height;
            texInfo.flags = info.flags;
            texInfo.layerCount = info.layerCount;
            texInfo.levelCount = info.levelCount;
            texInfo.samples = info.samples;
            texInfo.depth = info.depth;
            this._nativeTexture = nativeDevice.createTexture(texInfo);
        }

        return true;
    }

    public destroy () {
        this._nativeTexture.destroy();
        this._nativeTexture.delete();
    }

    public resize (width: number, height: number) {
        this._nativeTexture.resize(width, height);
    }
}
