/**
 * @hidden
 */

import { GFXFormat } from '../../gfx';
import { GFXFormatInfos, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType, GFXBufferTextureCopy } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXTexture } from '../../gfx/texture';
import { GFXTextureView } from '../../gfx/texture-view';

function nearsetPO2 (num: number): number {
    --num;
    num |= num >> 16;
    num |= num >> 8;
    num |= num >> 4;
    num |= num >> 2;
    num |= num >> 1;
    ++num;
    return num;
}

export interface ITextureBuffer {
    texture: GFXTexture;
    texView: GFXTextureView;
    size: number;
    start: number;
    end: number;
}

export interface ITextureBufferHandle {
    chunkIdx: number;
    start: number;
    end: number;
    texture: GFXTexture;
    texView: GFXTextureView;
}

export class TextureBufferPool {

    private _device: GFXDevice;
    private _format: GFXFormat;
    private _formatSize: number;
    private _chunks: ITextureBuffer[];
    private _chunkCount = 0;
    private _handles: ITextureBufferHandle[];
    private _region0: GFXBufferTextureCopy = new GFXBufferTextureCopy();
    private _region1: GFXBufferTextureCopy = new GFXBufferTextureCopy();
    private _region2: GFXBufferTextureCopy = new GFXBufferTextureCopy();

    public constructor (device: GFXDevice) {
        this._device = device;
    }

    public initialize (format: GFXFormat, maxChunks: number): boolean {
        this._format = format;
        this._formatSize = GFXFormatInfos[this._format].size;
        this._chunks = new Array(maxChunks);

        return true;
    }

    public destroy () {
        for (let i = 0; i < this._chunkCount; ++i) {
            const chunk = this._chunks[i];
            chunk.texView.destroy();
            chunk.texture.destroy();
        }
        this._chunks.splice(0);
        this._handles.splice(0);
    }

    public alloc (size: number): ITextureBufferHandle | null {
        if (size === 0) {
            return null;
        }

        for (let i = 0; i < this._chunkCount; ++i) {
            const chunk = this._chunks[i];
            let isFound = false;
            let start = chunk.start;
            if ((start + size) <= chunk.end) {
                isFound = true;
            } else if (start > chunk.end) {
                if ((start + size) <= chunk.size) {
                    isFound = true;
                } else if (size <= chunk.end) {
                    // Try to find from head again.
                    chunk.start = start = 0;
                    isFound = true;
                }
            } else if (start === chunk.end) {
                chunk.start = start = 0;
                chunk.end = chunk.size;
                if (size <= chunk.end) {
                    isFound = true;
                }
            }

            if (isFound) {
                chunk.start += size;

                const handle = {
                    chunkIdx: i,
                    start,
                    end: start + size,
                    texture: chunk.texture,
                    texView: chunk.texView,
                };

                this._handles.push(handle);
                return handle;
            }
        }

        // boundary checking
        if (this._chunkCount >= this._chunks.length) {
            console.error('TextureBufferPool: Reach max chunk count.');
            return null;
        }

        // create a new one
        const targetSize = Math.sqrt(size / this._formatSize);
        const texWidth = Math.max(1024, nearsetPO2(targetSize));
        const texSize = texWidth * texWidth * this._formatSize;

        console.info('TextureBufferPool: Allocate chunk ' + this._chunkCount + ', size: ' + texSize);

        const texture: GFXTexture = this._device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format: this._format,
            width: texWidth,
            height: texWidth,
            mipLevel: 1,
        });

        const texView: GFXTextureView = this._device.createTextureView({
            texture,
            type: GFXTextureViewType.TV2D,
            format: this._format,
        });

        const texHandle = {
            chunkIdx: this._chunkCount,
            start: 0,
            end: texSize,
            texture,
            texView,
        };
        this._handles.push(texHandle);

        this._chunks[this._chunkCount++] = {
            texture,
            texView,
            size: texSize,
            start: texSize,
            end: texSize,
        };

        return texHandle;
    }

    public free (handle: ITextureBufferHandle) {
        for (let i = 0; i < this._handles.length; ++i) {
            if (this._handles[i] === handle) {
                this._handles.splice(i, 1);
                return;
            }
        }
    }

    public update (handle: ITextureBufferHandle, buffer: ArrayBuffer) {

        let offsetX = handle.start % handle.texture.width;
        let offsetY = handle.start / handle.texture.width;
        let copySize = handle.texture.width - offsetX;
        let remianSize = buffer.byteLength;
        let begin = 0;

        const buffers: ArrayBuffer[] = [];
        const regions: GFXBufferTextureCopy[] = [];

        if (offsetX > 0) {
            this._region0.texOffset.x = offsetX;
            this._region0.texOffset.y = offsetY;
            this._region0.texExtent.width = remianSize;
            this._region0.texExtent.height = 1;

            buffers.push(buffer.slice(begin, copySize));
            regions.push(this._region0);

            offsetX = 0;
            offsetY += 1;
            remianSize -= copySize;
            begin += copySize;
        }

        if (remianSize > 0) {
            this._region1.texOffset.x = offsetX;
            this._region1.texOffset.y = offsetY;

            if (remianSize > handle.texture.width) {
                this._region1.texExtent.width = handle.texture.width;
                this._region1.texExtent.height = remianSize / handle.texture.width;
                copySize = this._region1.texExtent.width * this._region1.texExtent.height * this._formatSize;
                remianSize -= copySize;
            } else {
                copySize = remianSize;
                this._region1.texExtent.width = copySize;
                this._region1.texExtent.height = 1;
            }

            buffers.push(buffer.slice(begin, copySize));
            regions.push(this._region1);

            offsetX = 0;
            offsetY += 1;
            remianSize -= copySize;
            begin += copySize;
        }

        if (remianSize > 0) {
            this._region2.texOffset.x = offsetX;
            this._region2.texOffset.y = offsetY;

            if (remianSize > handle.texture.width) {
                this._region2.texExtent.width = remianSize;
                this._region2.texExtent.height = 1;
            }

            buffers.push(buffer.slice(begin, remianSize));
            regions.push(this._region2);
        }

        this._device.copyBuffersToTexture(buffers, handle.texture, regions);
    }
}
