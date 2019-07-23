/**
 * @hidden
 */

import { GFXFormat } from '../../gfx';
import { GFXFormatInfos, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType } from '../../gfx/define';
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
    end: number;
}

export class TextureBufferPool {

    private _device: GFXDevice;
    private _format: GFXFormat;
    private _formatSize: number;
    private _chunks: ITextureBuffer[];
    private _chunkCount = 0;
    private _handles: ITextureBufferHandle[];

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

    public alloc (size: number): ITextureBuffer | null {
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
                this._handles.push({
                    chunkIdx: i,
                    end: start + size,
                });
                return chunk;
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

        this._handles.push({
            chunkIdx: this._chunkCount,
            end: texSize,
        });

        const texBuff = {
            texture,
            texView,
            size: texSize,
            start: texSize,
            end: texSize,
        };
        this._chunks[this._chunkCount++] = texBuff;

        return texBuff;
    }

    public free (handle: ITextureBufferHandle) {
        for (let i = 0; i < this._handles.length; ++i) {
            if (this._handles[i] === handle) {
                this._handles.splice(i, 1);
                return;
            }
        }
    }
}
