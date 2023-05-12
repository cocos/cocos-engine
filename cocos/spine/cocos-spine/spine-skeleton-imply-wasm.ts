import { SkeletonData } from '../skeleton-data';
import { SpineSkeletonInstanceInterface } from './spine-skeleton-instance-interface';
import { getSpineWasmInstance, wasmResourceInstance, getSpineWasmMemory } from './instantiated';
import { Mat4, Color } from '../../core';
import { ccclass } from '../../core/data/decorators';

type WASMPtr = number;

const floatStride = 6;

let _wasmInstance: SpineWasm.instance = null!;
let _wasmHEAPU8: Uint8Array = null!;

function alignedBytes (address: number, bytes: number) {
    return Math.floor(address / bytes);
}

/**
 * @engineInternal
 */
export interface SpineMeshBlendInfo {
    blendMode: number;
    indexOffset: number;
    indexCount: number;
}

/**
 * @engineInternal
 */
export class SpineSkeletonMesh {
    constructor () {

    }
    public initialize (slot: number, vc: number, ic: number, stride: number) {
        this.slotIndex = slot;
        this.vCount = vc;
        this.iCount = ic;
        this.byteStride = stride;
        const floatNum = vc * this.byteStride / 4;
        this.vertices = new Float32Array(floatNum);
        this.indices = new Uint16Array(ic);
    }

    public clone (): SpineSkeletonMesh {
        const newOne = new SpineSkeletonMesh();
        newOne.slotIndex = this.slotIndex;
        newOne.vCount = this.vCount;
        newOne.iCount = this.iCount;
        newOne.byteStride = this.byteStride;
        newOne.vertices = new Float32Array(this.vertices.length);
        newOne.indices = new Uint16Array(this.indices.length);
        newOne.vertices.set(this.vertices);
        newOne.indices.set(this.indices);

        this.blendInfos.forEach((item) => {
            newOne.blendInfos.push({
                blendMode: item.blendMode,
                indexOffset: item.indexOffset,
                indexCount: item.indexCount });
        });

        return newOne;
    }

    public declare slotIndex: number;
    public declare vCount: number;
    public declare iCount: number;
    public declare byteStride: number;
    public declare vertices: Float32Array;
    public declare indices: Uint16Array;
    public blendInfos: SpineMeshBlendInfo[] = [];
}

class SpineVertexEffectDelegate {
    constructor () {
        this.handle = -1;
        if (!_wasmInstance) {
            _wasmInstance = getSpineWasmInstance();
        }
    }
    public getHandle () {
        return this.handle;
    }
    protected handle: number;
}

@ccclass('sp.SpineJitterVertexEffect')
export class SpineJitterVertexEffect extends SpineVertexEffectDelegate {
    constructor (x: number, y: number) {
        super();
        this._jitterX = x;
        this._jitterY = y;
        this.handle = _wasmInstance.createJitterVertexEffect(x, y);
    }
    private _jitterX = 0;
    private _jitterY = 0;

    get jitterX () {
        return this._jitterX;
    }
    set jitterX (val: number) {
        this._jitterX = val;
        this._updateParameters();
    }
    get jitterY () {
        return this._jitterY;
    }
    set jitterY (val: number) {
        this._jitterY = val;
        this._updateParameters();
    }
    private _updateParameters () {
        _wasmInstance.updateJitterParameters(this.handle, this._jitterX, this._jitterY);
    }
}

@ccclass('sp.SpineSwirlVertexEffect')
export class SpineSwirlVertexEffect extends SpineVertexEffectDelegate {
    constructor (radius: number, power: number, usePowerOut: boolean) {
        super();
        this.handle = _wasmInstance.createSwirlVertexEffect(radius, power, usePowerOut);
        this._radius = radius;
    }
    private _centerX = 0;
    private _centerY = 0;
    private _radius = 0;
    private _angle = 0;

    get centerX () {
        return this._centerX;
    }
    set centerX (val: number) {
        this._centerX = val;
        this._updateParameters();
    }

    get centerY () {
        return this._centerY;
    }
    set centerY (val: number) {
        this._centerY = val;
        this._updateParameters();
    }

    get radius () {
        return this._radius;
    }
    set radius (val: number) {
        this._radius = val;
        this._updateParameters();
    }

    get angle () {
        return this._angle;
    }
    set angle (val: number) {
        this._angle = val;
        this._updateParameters();
    }

    private _updateParameters () {
        _wasmInstance.updateSwirlParameters(this.handle, this._centerX, this._centerY, this._radius, this._angle);
    }
}

export class SpineSkeletonInstance implements SpineSkeletonInstanceInterface {
    constructor () {
        if (!_wasmInstance) _wasmInstance = getSpineWasmInstance();
        if (!_wasmHEAPU8) _wasmHEAPU8 = getSpineWasmMemory();
        this._objPtr = _wasmInstance.createSkeletonObject();
    }

    public getNativeObject (): any {
        return null;
    }

    public setSkeletonData (data: SkeletonData) {
        const uuid = data.uuid;
        const encoder = new TextEncoder();
        const encodedUUID = encoder.encode(uuid);
        const length = encodedUUID.length;
        const local = _wasmInstance.queryStoreMemory();
        const array = _wasmHEAPU8.subarray(local, local + length);
        array.set(encodedUUID);
        let datPtr = _wasmInstance.retainSkeletonDataByUUID(length);
        if (datPtr === 0) {
            datPtr = this.initSkeletonData(data);
            if (datPtr !== 0) {
                const array = _wasmHEAPU8.subarray(local, local + length);
                array.set(encodedUUID);
                _wasmInstance.recordSkeletonDataUUID(length, datPtr);
            }
        }
        _wasmInstance.setSkeletonData(this._objPtr, datPtr);
    }

    private initSkeletonData (data: SkeletonData): number {
        const name = data.name;
        let isJosn = false;
        if (data.skeletonJson) {
            isJosn = true;
            const altasName = `${name}.atlas`;
            const jsonName = `${name}.json`;
            wasmResourceInstance.addTextRes(altasName, data.atlasText);
            wasmResourceInstance.addTextRes(jsonName, data.skeletonJsonStr);
        } else {
            const altasName = `${name}.atlas`;
            const binName = `${name}.bin`;
            wasmResourceInstance.addTextRes(altasName, data.atlasText);
            wasmResourceInstance.addRawRes(binName, new Uint8Array(data._nativeAsset));
        }
        const encoder = new TextEncoder();
        const encodedName = encoder.encode(name);
        const length = encodedName.length;

        const local = _wasmInstance.queryStoreMemory();
        const array = _wasmHEAPU8.subarray(local, local + length);
        array.set(encodedName);

        const datPtr = _wasmInstance.initSkeletonData(length, isJosn);

        return datPtr;
    }

    public updateRenderData (): SpineSkeletonMesh {
        const address = _wasmInstance.updateRenderData(this._objPtr);
        let uint32Ptr = alignedBytes(address, 4);
        const heap32 = new Uint32Array(_wasmHEAPU8.buffer);
        const vc = heap32[uint32Ptr++];
        const ic = heap32[uint32Ptr++];
        const startV = heap32[uint32Ptr++];
        const startI = heap32[uint32Ptr++];
        const blendCount = heap32[uint32Ptr++];
        const vertices = new Float32Array(heap32.buffer, startV, floatStride * vc);
        const indices = new Uint16Array(heap32.buffer, startI, ic);

        const mesh = new SpineSkeletonMesh();
        mesh.slotIndex = 0;
        mesh.byteStride = 4 * floatStride;
        mesh.vCount = vc;
        mesh.iCount = ic;
        mesh.vertices = vertices;
        mesh.indices = indices;

        for (let i = 0; i < blendCount; i++) {
            const blend = heap32[uint32Ptr++];
            const iOffset = heap32[uint32Ptr++];
            const iCount = heap32[uint32Ptr++];
            mesh.blendInfos.push({
                blendMode: blend,
                indexOffset: iOffset,
                indexCount: iCount });
        }
        return mesh;
    }

    public setSkin (name: string) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(name);
        const length = encoded.length;

        const local = _wasmInstance.queryStoreMemory();
        const array = _wasmHEAPU8.subarray(local, local + length);
        array.set(encoded);
        _wasmInstance.setSkin(this._objPtr, length);
    }

    public setAnimation (trackIndex: number, name: string, loop: boolean) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(name);
        const length = encoded.length;

        const local = _wasmInstance.queryStoreMemory();
        const array = _wasmHEAPU8.subarray(local, local + length);
        array.set(encoded);
        const ret = _wasmInstance.setAnimation(this._objPtr, length, trackIndex, loop);
        return ret;
    }

    public clearTrack (trackIndex: number) {
        _wasmInstance.clearTrack(this._objPtr, trackIndex);
    }

    public clearTracks () {
        _wasmInstance.clearTracks(this._objPtr);
    }

    public setToSetupPose () {
        _wasmInstance.setToSetupPose(this._objPtr);
    }

    public setTimeScale (timeScale: number) {
        _wasmInstance.setTimeScale(this._objPtr, timeScale);
    }

    public updateAnimation (dltTime: number) {
        _wasmInstance.updateAnimation(this._objPtr, dltTime);
    }

    public setMix (fromAnimation: string, toAnimation: string, duration: number) {
        const encoder = new TextEncoder();
        const fromAnimationEncode = encoder.encode(fromAnimation);
        const toAnimationEncode = encoder.encode(toAnimation);
        const length = fromAnimationEncode.length + toAnimationEncode.length;
        const local = _wasmInstance.queryStoreMemory();
        const array = _wasmHEAPU8.subarray(local, local + length);
        array.set(fromAnimationEncode, 0);
        array.set(toAnimationEncode, fromAnimationEncode.length);
        _wasmInstance.setMix(this._objPtr, local, fromAnimationEncode.length, toAnimationEncode.length, duration);
    }

    getSlotsTable (): Map<number, string | null> {
        const table = new Map<number, string>();
        const count = _wasmInstance.getDrawOrderSize(this._objPtr);

        let i = 0;
        const decoder = new TextDecoder();
        for (i = 0; i < count; i++) {
            const address = _wasmInstance.getSlotNameByOrder(this._objPtr, i);
            const start = alignedBytes(address, 4);
            const heap32 = new Uint32Array(_wasmHEAPU8.buffer);
            const length = heap32[start];
            let name;
            if (length < 1) {
                name = null;
            } else {
                const source = _wasmHEAPU8.subarray(address + 4, address + 4 + length);
                name = decoder.decode(source);
            }
            table.set(i, name);
        }
        return table;
    }

    public getBoneMatrix (index: number, mat: Mat4) {
        const address = _wasmInstance.getBoneMatrix(this._objPtr, index);
        const start = address / 4;
        const floatArray = new Float32Array(_wasmHEAPU8.buffer);
        mat.m00 = floatArray[start];
        mat.m01 = floatArray[start + 1];
        mat.m04 = floatArray[start + 2];
        mat.m05 = floatArray[start + 3];
        mat.m12 = floatArray[start + 4];
        mat.m13 = floatArray[start + 5];
    }

    public setDefaultScale (scale: number) {
        _wasmInstance.setDefaultScale(this._objPtr, scale);
    }

    public setVertexEffect (effect: SpineJitterVertexEffect | SpineSwirlVertexEffect | null) {
        let effectHandle = 0;
        if (effect) {
            effectHandle = effect.getHandle();
        }
        _wasmInstance.setVertexEffect(this._objPtr, effectHandle, 0);
    }

    public setPremultipliedAlpha (premultipliedAlpha: boolean) {
        _wasmInstance.setPremultipliedAlpha(this._objPtr, premultipliedAlpha);
    }

    public setColor (color: Color) {
        const r = color.r / 255.0;
        const g = color.g / 255.0;
        const b = color.b / 255.0;
        const a = color.a / 255.0;
        _wasmInstance.setColor(this._objPtr, r, g, b, a);
    }

    public onDestroy () {
        _wasmInstance.destroyInstance(this._objPtr);
    }

    public setSlotsToSetupPose () {
        _wasmInstance.setSlotsToSetupPose(this._objPtr);
    }

    public setBonesToSetupPose (): void {
        _wasmInstance.setBonesToSetupPose(this._objPtr);
    }

    public setAttachment (slotName: string, attachmentName: string): void {
        const encoder = new TextEncoder();
        const slotEncode = encoder.encode(slotName);
        const attachEncode = encoder.encode(attachmentName);
        const length = slotEncode.length + attachEncode.length;
        const local = _wasmInstance.queryStoreMemory();
        const array = _wasmHEAPU8.subarray(local, local + length);
        array.set(slotEncode, 0);
        array.set(attachEncode, slotEncode.length);
        _wasmInstance.setAttachment(this._objPtr, local, slotEncode.length, attachEncode.length);
    }

    private _objPtr: WASMPtr = 0;
}
