// Uniform 数据传输结构体

import { Color, murmurhash2_32_gc } from '../../core';
import { Buffer } from '../../core/gfx';
import { BufferInfo, BufferUsageBit, BufferViewInfo, MemoryUsageBit } from '../../core/gfx/base/define';
import { Device } from '../../core/gfx/base/device';

export class UILocalBuffer {
    private static UBO_COUNT = 10; // 一个里可以放多少个 view

    private _device: Device;
    private _vec4PerUI: number;
    private _UIPerUBO: number; // 目前是 16，就是说每个 batch 可以放得下 16 个，但是 如果是用户材质的话就不够 16 个，device 不同的话可能会更多
    private _uniformBufferStride: number;

    private _uniformBufferElementCount: number;
    private _uniformBuffer: Buffer;
    private _firstUniformBufferView: Buffer;
    private _uniformBufferData: Float32Array;

    // 现在已经存了多少 UI 信息 // index = instanceID + uboIndex * _UIPerUBO
    private _prevUBOIndex = 0;
    private _prevInstanceID = -1;

    // 缺一个能放下多少顶点的属性

    // hash值
    public hash: number;

    get prevUBOIndex () {
        return this._prevUBOIndex;
    }

    get uniformBufferStride () {
        return this._uniformBufferStride;
    }

    get prevInstanceID () {
        return this._prevInstanceID;
    }

    constructor (device: Device, hash: number, UIPerUBO: number, vec4PerUI: number) {
        this._vec4PerUI = vec4PerUI;
        this._UIPerUBO = UIPerUBO;
        this._device = device;
        this.hash = hash;

        const alignment = this._device.capabilities.uboOffsetAlignment; // 对齐长度，UBO 是 alignment 的倍数
        const unalignedStride = Float32Array.BYTES_PER_ELEMENT * 4 * vec4PerUI * UIPerUBO;
        this._uniformBufferStride = Math.ceil(unalignedStride / alignment) * alignment;
        this._uniformBufferElementCount = this._uniformBufferStride / Float32Array.BYTES_PER_ELEMENT;

        // 下面三条是一个 ubo // 内存布局是 0 16 32 48 这种分块内存
        this._uniformBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._uniformBufferStride * UILocalBuffer.UBO_COUNT,
            this._uniformBufferStride,
        ));

        // 数据 view // 注意，在使用 UBOUILocal 中的数值时，需要 * UIPerUBO，由于在定义中长度为 1
        this._firstUniformBufferView = this._device.createBuffer(new BufferViewInfo(this._uniformBuffer, 0, unalignedStride));

        // 实际保存数据的地方// 一个,长度为 100 个 ubo 的长度
        this._uniformBufferData = new Float32Array(this._uniformBufferElementCount * UILocalBuffer.UBO_COUNT);
    }

    checkFull () {
        return this._prevUBOIndex >= UILocalBuffer.UBO_COUNT - 1 && this._prevInstanceID + 1 >= this._UIPerUBO;
    }

    updateIndex () {
        // 更新现有的索引值，通过这两个值实际上是能够得到总数的
        // instanceID + uboIndex * _UIPerUBO
        // 干脆在 upload 里更新吧
        // 一次 upload 中想要更新 5 个值
        if (this._prevInstanceID + 1 >= this._UIPerUBO) {
            ++this._prevUBOIndex;
            this._prevInstanceID = 0;
        } else {
            ++this._prevInstanceID; // 一次 5 个
        }
    }

    destroy () {
    }

    upload (t, r, s, to, c: Color, mode: number, progress, tiled) {
        // 注意是密集排列，所以这里是要根据第几个来存
        this.updateIndex();
        // 先根据 uboIndex 做 ubo 的偏移
        const data = this._uniformBufferData;
        // 只负责根据数据填充
        // trans & RG
        let offset = this._prevInstanceID * this._vec4PerUI * 4 + this._uniformBufferElementCount * this._prevUBOIndex;
        data[offset + 0] = t.x;
        data[offset + 1] = t.y;
        data[offset + 2] = t.z;
        data[offset + 3] = c.r + Math.min(c.y, 0.999);
        // rotation
        offset += 4;
        data[offset + 0] = r.x;
        data[offset + 1] = r.y;
        data[offset + 2] = r.z;
        data[offset + 3] = r.w;
        // scale & BA & Mode.progress
        offset += 4;
        data[offset + 0] = s.x;
        data[offset + 1] = s.y;
        data[offset + 2] = c.b + Math.min(c.w, 0.999);
        data[offset + 3] = mode + Math.min(progress, 0.999);
        // tilling offset
        offset += 4;
        if (to) {
            // data[offset + 0] = to[2] - to[0];
            // data[offset + 1] = to[1] - to[5];
            // data[offset + 2] = to[4];
            // data[offset + 3] = to[5];
            data[offset + 0] = to[0];
            data[offset + 1] = to[1];
            data[offset + 2] = to[2];
            data[offset + 3] = to[3];
        } else {
            data[offset + 0] = 1;
            data[offset + 1] = 1;
            data[offset + 2] = 0;
            data[offset + 3] = 0;
        }
        offset += 4;
        if (mode === 1) {
            // siled
            data[offset + 0] = 1;
            data[offset + 1] = 1;
            data[offset + 2] = 1;
            data[offset + 3] = 1;
        } else if (mode === 2) {
            // tiled
            data[offset + 0] = 1; // X方向重复次数
            data[offset + 1] = 1; // Y方向重复次数
        }
    }

    getBufferView () {
        return this._firstUniformBufferView;
    }

    updateBuffer () {
        this._uniformBuffer.update(this._uniformBufferData);
    }

    reset () {
        // 清掉现有的数据
        this._prevUBOIndex = 0;
        this._prevInstanceID = -1;
    }
}

interface ILocalBufferPool {
    pool: UILocalBuffer[];
    currentIdx: number;
}

export class UILocalUBOManger {
    private _localBuffers = new Map<number,  ILocalBufferPool>(); // capacity -> buffer[]
    private _device: Device;

    constructor (device: Device) {
        this._device = device;
    }

    // 一个面片调用一次
    upload (t, r, s, to, c, mode, capacity, vec4PerUI, tiled, progress) { // 1 16
        // 根据 capacity 查找/创建 UILocalBuffer
        // capacity 实际是个结构标识
        // 先取一次这个 数组，之后处理
        if (!this._localBuffers.has(capacity)) {
            this._localBuffers.set(capacity, {
                pool: [this._createLocalBuffer(capacity, vec4PerUI, 0)],
                currentIdx: 0,
            });
        }
        const localBufferPool = this._localBuffers.get(capacity)!;
        while (localBufferPool.pool[localBufferPool.currentIdx].checkFull()) {
            if (++localBufferPool.currentIdx >= localBufferPool.pool.length) {
                localBufferPool.pool.push(this._createLocalBuffer(capacity, vec4PerUI, localBufferPool.currentIdx));
            }
        }
        // 如需创建，hash 根据 capacity 和数组下标
        const localBuffer = localBufferPool.pool[localBufferPool.currentIdx]; // 取出实际要填充的对象
        // 缺 currIndex 来记录往哪里填充// 密集排列填充 // 避免内存浪费
        // 所以这里需要把这个加上之后，更新索引值（不必传入 instanceID）// 直接在 upload 中更新吧
        // 推导 uboIdx
        // 推导这个 uboIndex 不是说放不下就放下一个吗？最多是常数个（100）还是说一个只能放一同批次的，其他的空着？
        // 密集排列的话，不需要推导了，直接填吧
        // upload
        localBuffer.upload(t, r, s, to, c, mode, tiled, progress);
        return localBuffer;
    }

    public updateBuffer () {
        const it = this._localBuffers.values();
        let res = it.next();
        while (!res.done) {
            for (let i = 0; i <= res.value.currentIdx; ++i) {
                res.value.pool[i].updateBuffer();
            }
            res = it.next();
        }
    }

    public reset () {
        const it = this._localBuffers.values();
        let res = it.next();
        while (!res.done) {
            for (let i = 0; i <= res.value.currentIdx; ++i) {
                res.value.pool[i].reset();
            }
            res.value.currentIdx = 0;
            res = it.next();
        }
    }

    private _createLocalBuffer (capacity, vec4PerUI, idx) {
        const hash = murmurhash2_32_gc(`UIUBO-${capacity}-${idx}`, 666);
        return new UILocalBuffer(this._device, hash, capacity, vec4PerUI);
    }
}
