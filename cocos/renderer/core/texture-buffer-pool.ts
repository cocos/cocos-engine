/**
 * @hidden
 */

import { GFXFormat } from '../../gfx';
import { GFXBufferTextureCopy, GFXFormatInfos, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXTexture } from '../../gfx/texture';
import { GFXTextureView } from '../../gfx/texture-view';

function nearestPO2 (num: number): number {
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
    private _format: GFXFormat = GFXFormat.UNKNOWN;
    private _formatSize: number = 0;
    private _chunks: ITextureBuffer[] = [];
    private _chunkCount = 0;
    private _handles: ITextureBufferHandle[] = [];
    private _region0: GFXBufferTextureCopy = new GFXBufferTextureCopy();
    private _region1: GFXBufferTextureCopy = new GFXBufferTextureCopy();
    private _region2: GFXBufferTextureCopy = new GFXBufferTextureCopy();
    private _roundUpFn: ((size: number) => number) | null = null;

    get formatSize () {
        return this._formatSize;
    }

    public constructor (device: GFXDevice) {
        this._device = device;
    }

    public initialize (format: GFXFormat, maxChunks: number, roundUpFn?: (size: number) => number): boolean {
        this._format = format;
        this._formatSize = GFXFormatInfos[this._format].size;
        this._chunks = new Array(maxChunks);
        if (roundUpFn) { this._roundUpFn = roundUpFn; }

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
        const texWidth = this._roundUpFn && this._roundUpFn(targetSize) || Math.max(1024, nearestPO2(targetSize));
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
            end: size,
            texture,
            texView,
        };
        this._handles.push(texHandle);

        this._chunks[this._chunkCount++] = {
            texture,
            texView,
            size: texSize,
            start: size,
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

        const buffers: ArrayBuffer[] = [];
        const regions: GFXBufferTextureCopy[] = [];
        const start = handle.start / this._formatSize;

        let remainSize = buffer.byteLength / this._formatSize;
        let offsetX = start % handle.texture.width;
        let offsetY = Math.floor(start / handle.texture.width);
        let copySize = Math.min(handle.texture.width - offsetX, remainSize);
        let begin = 0;

        if (offsetX > 0) {
            this._region0.texOffset.x = offsetX;
            this._region0.texOffset.y = offsetY;
            this._region0.texExtent.width = copySize;
            this._region0.texExtent.height = 1;

            buffers.push(buffer.slice(begin * this._formatSize, (begin + copySize) * this._formatSize));
            regions.push(this._region0);

            offsetX = 0;
            offsetY += 1;
            remainSize -= copySize;
            begin += copySize;
        }

        if (remainSize > 0) {
            this._region1.texOffset.x = offsetX;
            this._region1.texOffset.y = offsetY;

            if (remainSize > handle.texture.width) {
                this._region1.texExtent.width = handle.texture.width;
                this._region1.texExtent.height = Math.floor(remainSize / handle.texture.width);
                copySize = this._region1.texExtent.width * this._region1.texExtent.height;
            } else {
                copySize = remainSize;
                this._region1.texExtent.width = copySize;
                this._region1.texExtent.height = 1;
            }

            buffers.push(buffer.slice(begin * this._formatSize, (begin + copySize) * this._formatSize));
            regions.push(this._region1);

            offsetX = 0;
            offsetY += this._region1.texExtent.height;
            remainSize -= copySize;
            begin += copySize;
        }

        if (remainSize > 0) {
            this._region2.texOffset.x = offsetX;
            this._region2.texOffset.y = offsetY;
            this._region2.texExtent.width = remainSize;
            this._region2.texExtent.height = 1;

            buffers.push(buffer.slice(begin * this._formatSize, (begin + remainSize) * this._formatSize));
            regions.push(this._region2);
        }

        this._device.copyBuffersToTexture(buffers, handle.texture, regions);
    }
}
