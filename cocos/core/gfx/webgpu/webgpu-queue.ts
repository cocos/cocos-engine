import { CommandBuffer } from '../base/command-buffer';
import { Queue } from '../base/queue';
import { WebGPUCommandBuffer } from './webgpu-command-buffer';
import { QueueInfo, QueueType } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';

export class WebGPUQueue extends Queue {

    private _nativeQueue;

    get nativeQueue () {
        return this._nativeQueue;
    }

    public initialize (info: QueueInfo): boolean {
        this._type = info.type;

        const nativeDevice = wgpuWasmModule.nativeDevice;

        const queueInfo = new wgpuWasmModule.QueueInfoInstance();
        const qTypeStr = QueueType[info.type];
        queueInfo.type = wgpuWasmModule.QueueType[qTypeStr];
        this._nativeQueue = nativeDevice.createQueue(queueInfo);
        return true;
    }

    public destroy () {
        this._nativeQueue.destroy();
        this._nativeQueue.delete();
    }

    public submit (cmdBuffs: CommandBuffer[]) {

    }

}
