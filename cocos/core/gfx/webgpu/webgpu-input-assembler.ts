import { InputAssembler } from '../base/input-assembler';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUDevice } from './webgpu-device';
import { InputAssemblerInfo, Format } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';

export class WebGPUInputAssembler extends InputAssembler {
    private _nativeInputAssembler;

    get nativeInputAssembler () {
        return this._nativeInputAssembler;
    }

    public initialize (info: InputAssemblerInfo): boolean {
        const nativeDevice = wgpuWasmModule.nativeDevice;
        const inputAssemblerInfo = new wgpuWasmModule.InputAssemblerInfoInstance();

        const attrs = new wgpuWasmModule.AttributeList();
        for (let i = 0; i < info.attributes.length; i++) {
            const attribute = info.attributes[i];
            const nativeAttr = new wgpuWasmModule.AttributeInstance();
            nativeAttr.name = attribute.name;
            const formatStr = Format[attribute.format];
            nativeAttr.format = wgpuWasmModule.Format[formatStr];
            nativeAttr.isNormalized = attribute.isNormalized;
            nativeAttr.stream = attribute.stream;
            nativeAttr.isInstanced = attribute.isInstanced;
            nativeAttr.location = attribute.location;
            attrs.push_back(nativeAttr);
        }
        inputAssemblerInfo.setAttributes(attrs);

        const buffers = new wgpuWasmModule.BufferList();
        for (let i = 0; i < info.vertexBuffers.length; i++) {
            buffers.push_back((info.vertexBuffers[i] as WebGPUBuffer).nativeBuffer);
        }
        inputAssemblerInfo.setBuffers(buffers);

        inputAssemblerInfo.setIndexBuffer((info.indexBuffer as WebGPUBuffer).nativeBuffer);
        if (info.indirectBuffer) {
            inputAssemblerInfo.setIndirectBuffer((info.indirectBuffer as WebGPUBuffer).nativeBuffer);
        }

        this._nativeInputAssembler = nativeDevice.createInputAssembler(inputAssemblerInfo);
        return true;
    }

    public destroy () {
        this._nativeInputAssembler.destroy();
        this._nativeInputAssembler.delete();
    }
}
