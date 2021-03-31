// Uniform 数据传输结构体

import { RenderPipeline } from '../../core';
import { Buffer } from '../../core/gfx';
import { BufferInfo, BufferUsageBit, BufferViewInfo, MemoryUsageBit } from '../../core/gfx/base/define';
import { Device } from '../../core/gfx/base/device';
import { UBOUILocal } from '../../core/pipeline/define';

export class UILocalBuffer {
    private _device: Device;

    private _uniformBufferCount = 16;
    private _uniformBufferStride: number;

    private _uniformBufferElementCount: number;
    private _uniformBuffer: Buffer;
    private _firstUniformBufferView: Buffer;
    private _uniformBufferData: Float32Array;

    // 缺一个能放下多少顶点的属性

    constructor (pipeline: RenderPipeline) {
        this._device = pipeline.device;

        const alignment = this._device.capabilities.uboOffsetAlignment;
        this._uniformBufferStride = Math.ceil(UBOUILocal.SIZE / alignment) * alignment;
        this._uniformBufferElementCount = this._uniformBufferStride / Float32Array.BYTES_PER_ELEMENT;

        // 下面三条是一个 ubo // 内存布局是 0 16 32 48 这种分块内存
        this._uniformBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._uniformBufferStride * this._uniformBufferCount,
            this._uniformBufferStride,
        ));

        // 数据 view
        this._firstUniformBufferView = this._device.createBuffer(new BufferViewInfo(this._uniformBuffer, 0, UBOUILocal.SIZE));

        // 实际保存数据的地方
        this._uniformBufferData = new Float32Array(this._uniformBufferElementCount * this._uniformBufferCount);
    }
}

export class UILocalUBOManger {
    public localBuffers: UILocalBuffer[] = []; // 实际可能需要多个 UBO

    // UBO 创建
    // UBO 赋值
    // UBO 放不下的时候创建新的
}
