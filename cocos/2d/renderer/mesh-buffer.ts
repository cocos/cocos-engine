/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @packageDocumentation
 * @module ui
 */
import { TEST } from 'internal:constants';
import { BufferUsageBit, MemoryUsageBit, InputAssemblerInfo, Attribute, Buffer, BufferInfo, InputAssembler } from '../../core/gfx';
import { Batcher2D } from './batcher-2d';
import { getComponentPerVertex } from './vertex-format';

export class MeshBuffer {
    // 渲染数据结构
    public static OPACITY_OFFSET = 8;

    get attributes () { return this._attributes; } // 属性
    get vertexBuffers () { return this._vertexBuffers; } // VB
    get indexBuffer () { return this._indexBuffer; } // IB

    public vData: Float32Array | null = null; // VData
    public iData: Uint16Array | null = null; // iData

    public byteStart = 0; // 起始位置
    public byteOffset = 0; // 偏置
    public indicesStart = 0;
    public indicesOffset = 0;
    public vertexStart = 0;
    public vertexOffset = 0;
    public lastByteOffset = 1;

    private _attributes: Attribute[] = null!;
    private _vertexBuffers: Buffer[] = [];
    private _indexBuffer: Buffer = null!;
    private _iaInfo: InputAssemblerInfo = null!;

    // NOTE:
    // actually 256 * 4 * (vertexFormat._bytes / 4)
    // include pos, uv, color in ui attributes
    private _batcher: Batcher2D;
    private _dirty = false;
    private _vertexFormatBytes = 0;
    private _initVDataCount = 0;
    private _initIDataCount = 256 * 6; // 默认了创建 256 个？
    private _outOfCallback: ((...args: number[]) => void) | null = null; // 超出边界后的回调
    private _hInputAssemblers: InputAssembler[] = []; // 这个命名之前的意思是 handle，现在移除了，实际上是ia实例
    private _nextFreeIAHandle = 0; // ？？？

    // 启动时通过循环池子创建了 128 个
    constructor (batcher: Batcher2D) {
        if (TEST) {
            return;
        }
        this._batcher = batcher;
    }

    get vertexFormatBytes (): number {
        return this._vertexFormatBytes;
    }

    public initialize (attrs: Attribute[], outOfCallback: ((...args: number[]) => void) | null) {
        this._outOfCallback = outOfCallback;// 决定了超出过后的行为
        const formatBytes = getComponentPerVertex(attrs); // 获取 attribute 的大小
        this._vertexFormatBytes = formatBytes * Float32Array.BYTES_PER_ELEMENT;
        this._initVDataCount = 256 * this._vertexFormatBytes; // 默认 256 ？
        const vbStride = Float32Array.BYTES_PER_ELEMENT * formatBytes;

        // 所以这里是说 vbs 可能不为空？？
        if (!this.vertexBuffers.length) { // length === 0
            if (TEST) {
                // 随便加个什么 buffer
                this.vertexBuffers.push();
            } else {
                this.vertexBuffers.push(this._batcher.device.createBuffer(new BufferInfo( // 创建一个新的
                    BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                    MemoryUsageBit.HOST | MemoryUsageBit.DEVICE, // 内存CPU和GPU都可访问
                    vbStride, // size
                    vbStride, // stride
                )));
            }
        }

        const ibStride = Uint16Array.BYTES_PER_ELEMENT;

        if (!this.indexBuffer) {
            if (TEST) {
                // 随便加个什么 buffer
                this._indexBuffer = ;
            } else {
                this._indexBuffer = this._batcher.device.createBuffer(new BufferInfo(
                    BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
                    MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                    ibStride,
                    ibStride,
                ));
            }
        }

        this._attributes = attrs; // 创建时传一个进来，决定结构，从 vertexFormat 里取
        this._iaInfo = new InputAssemblerInfo(this.attributes, this.vertexBuffers, this.indexBuffer); // IA 创建

        // 创建且扩容
        // 也就意味着这里可能是用于扩容
        // for recycle pool using purpose --
        if (!this.vData || !this.iData) {
            this._reallocBuffer();
        }
        // ----------
    }

    // 请求 meshBuffer
    public request (vertexCount = 4, indicesCount = 6) {
        this.lastByteOffset = this.byteOffset; // 记录已有的偏移
        const byteOffset = this.byteOffset + vertexCount * this._vertexFormatBytes;// 实际的位数偏移量
        const indicesOffset = this.indicesOffset + indicesCount;// 同样是index的偏移

        if (vertexCount + this.vertexOffset > 65535) { // 如果已经超出了上限
            if (this._outOfCallback) {
                this._outOfCallback.call(this._batcher, vertexCount, indicesCount);
            }
            return false;
        }

        let byteLength = this.vData!.byteLength;
        let indicesLength = this.iData!.length;
        if (byteOffset > byteLength || indicesOffset > indicesLength) {
            while (byteLength < byteOffset || indicesLength < indicesOffset) {
                this._initVDataCount *= 2; // 扩容
                this._initIDataCount *= 2; // 扩容

                byteLength = this._initVDataCount * 4;
                indicesLength = this._initIDataCount;
            }

            this._reallocBuffer(); // 重新申请
        }

        this.vertexOffset += vertexCount;
        this.indicesOffset += indicesCount;
        this.byteOffset = byteOffset;

        this._dirty = true;
        return true;
    }

    // afterUpload
    // 注意，这里并没有全部释放或者置位
    public reset () {
        this.byteStart = 0;
        this.byteOffset = 0;
        this.indicesStart = 0;
        this.indicesOffset = 0;
        this.vertexStart = 0;
        this.vertexOffset = 0;
        this.lastByteOffset = 0;
        this._nextFreeIAHandle = 0;

        this._dirty = false;
    }

    public destroy () {
        this._attributes = null!;

        this.vertexBuffers[0].destroy();
        this.vertexBuffers.length = 0;

        this.indexBuffer.destroy();
        this._indexBuffer = null!;

        for (let i = 0; i < this._hInputAssemblers.length; i++) {
            this._hInputAssemblers[i].destroy();
        }
        this._hInputAssemblers.length = 0;
    }

    // 获取ia
    public recordBatch (): InputAssembler | null {
        const vCount = this.indicesOffset - this.indicesStart;
        if (!vCount) {
            return null;
        }

        // 这儿也要处理一下@TODO
        if (this._hInputAssemblers.length <= this._nextFreeIAHandle) {
            this._hInputAssemblers.push(this._batcher.device.createInputAssembler(this._iaInfo));
        }

        const ia = this._hInputAssemblers[this._nextFreeIAHandle++];

        ia.firstIndex = this.indicesStart;
        ia.indexCount = vCount;

        return ia;
    }

    // 上传 buffer
    public uploadBuffers () {
        if (this.byteOffset === 0 || !this._dirty) {
            return;
        }

        const verticesData = new Float32Array(this.vData!.buffer, 0, this.byteOffset >> 2);
        const indicesData = new Uint16Array(this.iData!.buffer, 0, this.indicesOffset);

        if (this.byteOffset > this.vertexBuffers[0].size) {
            this.vertexBuffers[0].resize(this.byteOffset);
        }
        this.vertexBuffers[0].update(verticesData);

        if (this.indicesOffset * 2 > this.indexBuffer.size) {
            this.indexBuffer.resize(this.indicesOffset * 2);
        }
        this.indexBuffer.update(indicesData);
        this._dirty = false;
    }

    // 重新创建切隐含了扩容的逻辑
    private _reallocBuffer () {
        this._reallocVData(true);
        this._reallocIData(true);
    }

    // 重建 VData
    private _reallocVData (copyOldData: boolean) {
        let oldVData;
        if (this.vData) { // 旧数据？
            oldVData = new Uint8Array(this.vData.buffer);
        }

        // 新建，用新的大小新建
        this.vData = new Float32Array(this._initVDataCount);

        // 拷贝，这里的逻辑实际上是为了扩容
        // 建新的然后拷贝
        if (oldVData && copyOldData) {
            const newData = new Uint8Array(this.vData.buffer);
            for (let i = 0, l = oldVData.length; i < l; i++) {
                newData[i] = oldVData[i];
            }
        }
    }

    // 重建 IData
    private _reallocIData (copyOldData: boolean) {
        const oldIData = this.iData;
        // 同样是扩容的逻辑
        this.iData = new Uint16Array(this._initIDataCount);

        if (oldIData && copyOldData) {
            const iData = this.iData;
            for (let i = 0, l = oldIData.length; i < l; i++) {
                iData[i] = oldIData[i];
            }
        }
    }
}
