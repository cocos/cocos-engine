// Uniform 数据传输结构体

import { Color, murmurhash2_32_gc, Vec2, Vec3, Vec4 } from '../../core';
import { Buffer } from '../../core/gfx';
import { BufferInfo, BufferUsageBit, BufferViewInfo, MemoryUsageBit } from '../../core/gfx/base/define';
import { Device } from '../../core/gfx/base/device';

export class UILocalBuffer {
    private static UBO_COUNT = 10; // 一个里可以放多少个 view

    private _device: Device;
    private _vec4PerUI: number; // 每个 UI 占用的 Vec4 数量
    private _UIPerUBO: number; // 每个 ubo 能容纳的 UI 数量
    private _uniformBufferStride: number;

    private _uniformBufferElementCount: number;
    private _uniformBuffer: Buffer;
    private _firstUniformBufferView: Buffer;
    private _uniformBufferData: Float32Array;

    // 现在已经存了多少 UI 信息 // index = instanceID + uboIndex * _UIPerUBO
    private _prevUBOIndex = 0;
    private _prevInstanceID = -1;

    // hash值
    public hash: number;
    // pool 中的索引值
    public poolIndex: number;

    get prevUBOIndex () {
        return this._prevUBOIndex;
    }

    get uniformBufferStride () {
        return this._uniformBufferStride;
    }

    get prevInstanceID () {
        return this._prevInstanceID;
    }

    constructor (device: Device, hash: number, UIPerUBO: number, vec4PerUI: numberm, poolIndex: number) {
        this._vec4PerUI = vec4PerUI;
        this._UIPerUBO = UIPerUBO;
        this._device = device;
        this.hash = hash;
        this.poolIndex = poolIndex;

        const alignment = this._device.capabilities.uboOffsetAlignment; // 对齐长度，UBO 是 alignment 的倍数
        const unalignedStride = Float32Array.BYTES_PER_ELEMENT * 4 * vec4PerUI * UIPerUBO;
        this._uniformBufferStride = Math.ceil(unalignedStride / alignment) * alignment; // 硬件对齐
        this._uniformBufferElementCount = this._uniformBufferStride / Float32Array.BYTES_PER_ELEMENT;

        // 下面三条是一个 ubo // 内存布局是 0 16 32 48 这种分块内存
        this._uniformBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._uniformBufferStride * UILocalBuffer.UBO_COUNT,
            this._uniformBufferStride,
        ));

        // 数据 view
        this._firstUniformBufferView = this._device.createBuffer(new BufferViewInfo(this._uniformBuffer, 0, unalignedStride));

        // 实际保存数据的地方// 一个,长度为 10 个 ubo 的长度
        this._uniformBufferData = new Float32Array(this._uniformBufferElementCount * UILocalBuffer.UBO_COUNT);
    }

    checkFull () {
        return this._prevUBOIndex >= UILocalBuffer.UBO_COUNT - 1 && this._prevInstanceID + 1 >= this._UIPerUBO;
    }

    updateIndex () {
        // 更新现有的索引值，通过这两个值实际上是能够得到总数的
        // 索引不必关心更新了多少值
        if (this._prevInstanceID + 1 >= this._UIPerUBO) {
            ++this._prevUBOIndex;
            this._prevInstanceID = 0;
        } else {
            ++this._prevInstanceID;
        }
    }

    destroy () {
    }

    upload (t: Vec3, r: Quat, s: Vec3, to: number[], c: Color, mode: number, uvExtra: Vec4, fillType: number) {
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
        data[offset + 3] = c.r + Math.min(c.y, 0.999); // RG复合使用同一位
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
        data[offset + 2] = c.b + Math.min(c.w, 0.999); // BA复合使用同一位
        data[offset + 3] = mode + Math.min(fillType, 0.999); // Mode 和 progress 使用同一位
        // tilling offset
        offset += 4;
        if (to) {
            data[offset + 0] = to[0];
            data[offset + 1] = to[1];
            data[offset + 2] = to[2];
            data[offset + 3] = to[3];
        } else {
            // 为 label 提供？ 可能是不需要的 // todo remove
            data[offset + 0] = 1;
            data[offset + 1] = 1;
            data[offset + 2] = 0;
            data[offset + 3] = 0;
        }
        offset += 4;
        // uvExtra
        if (mode > 0) {
            data[offset + 0] = uvExtra.x;
            data[offset + 1] = uvExtra.y;
            data[offset + 2] = uvExtra.z;
            data[offset + 3] = uvExtra.w;
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

    updateDataByDirty (instanceID: number, UBOIndex: number, t: Vec3, r?: Quat, s?: Vec3) {
        let offset = instanceID * this._vec4PerUI * 4 + this._uniformBufferElementCount * UBOIndex;
        const data = this._uniformBufferData;
        data[offset + 0] = t.x;
        data[offset + 1] = t.y;
        data[offset + 2] = t.z;
        if (r) {
            offset += 4;
            data[offset + 0] = r.x;
            data[offset + 1] = r.y;
            data[offset + 2] = r.z;
            data[offset + 3] = r.w;
        }
        if (s) {
            offset += 4;
            data[offset + 0] = s.x;
            data[offset + 1] = s.y;
        }
    }
}

interface ILocalBufferPool {
    pool: UILocalBuffer[];
    currentIdx: number;
}

interface ILocalBuffers {
    key: number;
    value: ILocalBufferPool;
}

export class UILocalUBOManger {
    // 给个接口吧
    // public _localBuffers = new Map<number,  ILocalBufferPool>(); // UIPerUBO -> buffer[]
    public _localBuffers: ILocalBuffers[] = []; // UIPerUBO -> buffer[]
    private _device: Device;

    constructor (device: Device) {
        this._device = device;
    }

    // 一个面片调用一次
    upload (t: Vec3, r: Quat, s: Vec3, to: number[], c: Color, mode: number, UIPerUBO: number, vec4PerUI: number, uvExtra: Vec4, fillType: number) { // 1 16
        // 根据 UIPerUBO 查找/创建 UILocalBuffer
        // UIPerUBO 结构标识，决定 UI 的排布结构
        // 如果修改的话，修改这个值，修改 shader 即可
        // 先取一次这个 数组，之后处理
        // if (!this._localBuffers.has(UIPerUBO)) {
        //     this._localBuffers.set(UIPerUBO, {
        //         pool: [this._createLocalBuffer(UIPerUBO, vec4PerUI, 0)],
        //         currentIdx: 0,
        //     });
        // }
        const element = this._localBuffers.find(
            (element)  => element.key === UIPerUBO,
        );
        if (element === undefined) {
            this._localBuffers.push({
                key: UIPerUBO,
                value: {
                    pool: [this._createLocalBuffer(UIPerUBO, vec4PerUI, 0)],
                    currentIdx: 0,
                },
            });
        }
        // const localBufferPool = this._localBuffers.get(UIPerUBO)!;
        const localBufferPool = this._localBuffers.find((element)  => element.key === UIPerUBO)!.value;
        while (localBufferPool.pool[localBufferPool.currentIdx].checkFull()) {
            if (++localBufferPool.currentIdx >= localBufferPool.pool.length) {
                // 如需创建，hash 根据 capacity 和数组下标
                localBufferPool.pool.push(this._createLocalBuffer(UIPerUBO, vec4PerUI, localBufferPool.currentIdx));
            }
        }
        const localBuffer = localBufferPool.pool[localBufferPool.currentIdx]; // 取出实际要填充的对象
        // 密集排列填充 // 避免内存浪费
        // 直接在 upload 中更新索引值吧
        // upload
        localBuffer.upload(t, r, s, to, c, mode, uvExtra, fillType);
        return localBuffer;
    }

    public updateBuffer () {
        // const it = this._localBuffers.values();
        // let res = it.next();
        // while (!res.done) {
        //     for (let i = 0; i <= res.value.currentIdx; ++i) {
        //         res.value.pool[i].updateBuffer();
        //     }
        //     res = it.next();
        // }
        const length = this._localBuffers.length;
        let res;
        for (let i = 0; i < length; ++i) {
            res = this._localBuffers[i].value;
            for (let j = 0; j <= res.currentIdx; ++j) {
                res.pool[j].updateBuffer();
            }
        }
    }

    public reset () {
        // const it = this._localBuffers.values();
        // let res = it.next();
        // while (!res.done) {
        //     for (let i = 0; i <= res.value.currentIdx; ++i) {
        //         res.value.pool[i].reset();
        //     }
        //     res.value.currentIdx = 0;
        //     res = it.next();
        // }
        const length = this._localBuffers.length;
        let res;
        for (let i = 0; i < length; ++i) {
            res = this._localBuffers[i].value;
            for (let j = 0; j <= res.currentIdx; ++j) {
                res.pool[j].reset();
            }
            res.currentIdx = 0;
        }
    }

    private _createLocalBuffer (capacity, vec4PerUI, idx) {
        const hash = murmurhash2_32_gc(`UIUBO-${capacity}-${idx}`, 666);
        return new UILocalBuffer(this._device, hash, capacity, vec4PerUI, idx);// 想要利用这个数组下标找 localBuffer
    }
}
