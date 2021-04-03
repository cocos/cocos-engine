// Uniform 数据传输结构体

import legacyCC from '../../../predefine';
import { Color, murmurhash2_32_gc } from '../../core';
import { Buffer } from '../../core/gfx';
import { BufferInfo, BufferUsageBit, BufferViewInfo, MemoryUsageBit } from '../../core/gfx/base/define';
import { Device } from '../../core/gfx/base/device';
import { UBOUILocal } from '../../core/pipeline/define';

export class UILocalBuffer {
    private static UBO_COUNT = 100; // 一个里可以放多少个 view

    private _device: Device;
    private _capacityPerUBO: number;// 目前是 16，就是说每个 batch 可以放得下 16 个，但是 如果是用户材质的话就不够 16 个，device 不同的话可能会更多
    private _uniformBufferStride: number;

    private _uniformBufferElementCount: number;
    private _uniformBuffer: Buffer;
    private _firstUniformBufferView: Buffer;
    private _uniformBufferData: Float32Array;

    // 现在已经存了多少 UI 信息 // index = instanceID + uboIndex * _capacityPerUBO
    private _uboIndex: number;
    private _instanceID: number;

    // 缺一个能放下多少顶点的属性

    // hash值
    public hash: number;

    constructor (device: Device, hash: number, capacityPerUBO: number) {
        this._capacityPerUBO = capacityPerUBO;
        this._device = device;
        this.hash = hash;

        const alignment = this._device.capabilities.uboOffsetAlignment;
        this._uniformBufferStride = Math.ceil(UBOUILocal.SIZE / UBOUILocal.MAX_UI_COUNT * capacityPerUBO / alignment) * alignment;
        this._uniformBufferElementCount = this._uniformBufferStride / Float32Array.BYTES_PER_ELEMENT;

        // 下面三条是一个 ubo // 内存布局是 0 16 32 48 这种分块内存
        this._uniformBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._uniformBufferStride * UILocalBuffer.UBO_COUNT,
            this._uniformBufferStride,
        ));

        // 数据 view
        this._firstUniformBufferView = this._device.createBuffer(new BufferViewInfo(this._uniformBuffer, 0, UBOUILocal.SIZE));

        // 实际保存数据的地方// 一个,长度为 100 个 ubo 的长度
        this._uniformBufferData = new Float32Array(this._uniformBufferElementCount * UILocalBuffer.UBO_COUNT);

        this._uboIndex = 0;
        this._instanceID = 0;
    }

    checkFull () {
        if (this._uboIndex >= UILocalBuffer.UBO_COUNT) {
            return true;
        }
        return false;
    }

    updateIndex () {
        // 更新现有的索引值，通过这两个值实际上是能够得到总数的
        // instanceID + uboIndex * _capacityPerUBO
        // 干脆在 upload 里更新吧
        if (this._instanceID + 1 >= this._capacityPerUBO) {
            this._uboIndex++;
            this._instanceID = 0;
        } else {
            this._instanceID++;
        }
    }

    destroy () {

    }

    upload (t, r, s, to, c: Color) {
        // 注意是密集排列，所以这里是要根据第几个来存
        this.updateIndex();
        // 先根据 uboIndex 做 ubo 的偏移
        const uboOffset = (this._capacityPerUBO * 4) * this._uboIndex;
        // 只负责根据数据填充
        // trans & RG
        const colorRG = c.r + c.g / 255;
        this._uniformBufferData.set([t.x, t.y, t.z, colorRG], this._instanceID * 4 + uboOffset);
        // rotation & BA
        this._uniformBufferData.set([r.x, r.y, r.z, r.w], (this._capacityPerUBO + this._instanceID) * 4 + uboOffset);
        // scale
        this._uniformBufferData.set([s.x, s.y, c.b, c.a], (this._capacityPerUBO * 2 + this._instanceID) * 4 + uboOffset);
        // tilling
        this._uniformBufferData.set([to.x, to.y, to.z, to.w], (this._capacityPerUBO * 3 + this._instanceID) * 4 + uboOffset);
    }

    getInstanceID () {
        return this._instanceID;
    }

    getBufferView () {
        // 怎么做偏移？// 怎么和buffer相关？
        return this._firstUniformBufferView;
    }

    clear () {
        // 清掉现有的数据
        this._uboIndex = 0;
        this._instanceID = 0;
    }
}

export class UILocalUBOManger {
    public static manager: UILocalUBOManger | null = null;

    private _localBuffers = new Map<number, UILocalBuffer[]>(); // capacity -> buffer[]
    private _device = legacyCC.director.root.device;

    // 一个面片调用一次
    upload (t, r, s, to, c, capacity) { // 1 16
        // 根据 capacity 查找/创建 UILocalBuffer
        // capacity 实际是个结构标识
        // 先取一次这个 数组，之后处理
        let localBuffers = this._localBuffers.get(capacity);
        if (!localBuffers) {
            localBuffers = [];
        }
        const length = localBuffers.length;
        if (length === 0 || (length !== 0 && localBuffers[length - 1].checkFull())) {
            const idx = length;
            // 如需创建，hash 根据 capacity 和数组下标
            const hash = murmurhash2_32_gc(`UIUBO-${capacity}-${idx}`, 666);
            localBuffers.push(new UILocalBuffer(this._device, hash, capacity));
        }
        const localBuffer = localBuffers[localBuffers.length - 1]; // 取出实际要填充的对象
        // 缺 currIndex 来记录往哪里填充// 密集排列填充 // 避免内存浪费
        // 所以这里需要把这个加上之后，更新索引值（不必传入 instanceID）// 直接在 upload 中更新吧
        // 推导 uboIdx
        // 推导这个 uboIndex 不是说放不下就放下一个吗？最多是常数个（100）还是说一个只能放一同批次的，其他的空着？
        // 密集排列的话，不需要推导了，直接填吧
        // upload
        localBuffer.upload(t, r, s, to, c);
        return localBuffer;
    }

    getBufferByHash (capacity, hash): UILocalBuffer | null {
        const localBuffers = this._localBuffers.get(capacity);
        if (!localBuffers) return null;
        return localBuffers[hash];
    }
}

UILocalUBOManger.manager = new UILocalUBOManger();
