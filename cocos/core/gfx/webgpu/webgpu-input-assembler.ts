/* eslint-disable @typescript-eslint/no-unsafe-return */
import { InputAssembler } from '../base/input-assembler';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUDevice } from './webgpu-device';
import { InputAssemblerInfo, Format } from '../base/define';
import { nativeLib } from './instantiated';

export class WebGPUInputAssembler extends InputAssembler {
    private _nativeInputAssembler;

    get nativeInputAssembler () {
        return this._nativeInputAssembler;
    }

    public initialize (info: InputAssemblerInfo): boolean {
        this._attributes = info.attributes;
        this._vertexBuffers = info.vertexBuffers;
        this._indirectBuffer = info.indirectBuffer;

        const nativeDevice = nativeLib.nativeDevice;
        const inputAssemblerInfo = new nativeLib.InputAssemblerInfoInstance();

        const attrs = new nativeLib.AttributeList();
        for (let i = 0; i < info.attributes.length; i++) {
            const attribute = info.attributes[i];
            const nativeAttr = new nativeLib.AttributeInstance();
            nativeAttr.name = attribute.name;
            const formatStr = Format[attribute.format];
            nativeAttr.format = nativeLib.Format[formatStr];
            nativeAttr.isNormalized = attribute.isNormalized;
            nativeAttr.stream = attribute.stream;
            nativeAttr.isInstanced = attribute.isInstanced;
            nativeAttr.location = attribute.location;
            attrs.push_back(nativeAttr);
        }
        inputAssemblerInfo.setAttributes(attrs);

        const buffers = new nativeLib.BufferList();
        for (let i = 0; i < info.vertexBuffers.length; i++) {
            buffers.push_back((info.vertexBuffers[i] as WebGPUBuffer).nativeBuffer);
        }
        inputAssemblerInfo.setBuffers(buffers);

        if (info.indexBuffer) {
            this._indexBuffer = info.indexBuffer;
            this._drawInfo.indexCount = this._indexBuffer.size / this._indexBuffer.stride;
            this._drawInfo.firstIndex = 0;
            inputAssemblerInfo.setIndexBuffer((info.indexBuffer as WebGPUBuffer).nativeBuffer);
        } else {
            const vertBuff = this._vertexBuffers[0];
            this._drawInfo.vertexCount = vertBuff.size / vertBuff.stride;
            this._drawInfo.firstVertex = 0;
            this._drawInfo.vertexOffset = 0;
        }
        this._drawInfo.instanceCount = 1;
        this._drawInfo.firstInstance = 0;

        if (info.indirectBuffer) {
            inputAssemblerInfo.setIndirectBuffer((info.indirectBuffer as WebGPUBuffer).nativeBuffer);
        }

        this._nativeInputAssembler = nativeDevice.createInputAssembler(inputAssemblerInfo);
        this._attributesHash = this.computeAttributesHash();
        return true;
    }

    // native object created when ia initialized, update in case it's changed.
    public check () {
        const nativeDrawInfo = new nativeLib.DrawInfo();
        nativeDrawInfo.vertexCount = this._drawInfo.vertexCount;
        nativeDrawInfo.firstVertex = this._drawInfo.firstVertex;
        nativeDrawInfo.indexCount = this._drawInfo.indexCount;
        nativeDrawInfo.firstIndex = this._drawInfo.firstIndex;
        nativeDrawInfo.vertexOffset = this._drawInfo.vertexOffset;
        nativeDrawInfo.instanceCount = this._drawInfo.instanceCount;
        nativeDrawInfo.firstInstance = this._drawInfo.firstInstance;

        this._nativeInputAssembler.update(nativeDrawInfo);
    }

    public destroy () {
        this._nativeInputAssembler.destroy();
        this._nativeInputAssembler.delete();
    }
}
