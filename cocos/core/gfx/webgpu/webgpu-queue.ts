/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CommandBuffer } from '../base/command-buffer';
import { Queue } from '../base/queue';
import { WebGPUCommandBuffer } from './webgpu-command-buffer';
import { QueueInfo, QueueType } from '../base/define';
import { nativeLib } from './instantiated';

export class WebGPUQueue extends Queue {
    private _nativeQueue;
    private _device;

    get nativeQueue () {
        return this._nativeQueue;
    }

    set device (device) {
        this._device = device;
    }

    public initialize (info: QueueInfo): boolean {
        this._type = info.type;

        const nativeDevice = nativeLib.nativeDevice;

        if (this._device) {
            this._nativeQueue = nativeDevice.getQueue();
        } else {
            const queueInfo = new nativeLib.QueueInfoInstance();
            const qTypeStr = QueueType[info.type];
            queueInfo.type = nativeLib.QueueType[qTypeStr];
            this._nativeQueue = nativeDevice.createQueue(queueInfo);
        }

        return true;
    }

    public destroy () {
        this._nativeQueue.destroy();
        this._nativeQueue.delete();
    }

    public submit (cmdBuffs: CommandBuffer[]) {
        const commandBufferList = new nativeLib.CommandBufferList();
        for (let i = 0; i < cmdBuffs.length; i++) {
            commandBufferList.push_back((cmdBuffs[i] as WebGPUCommandBuffer).nativeCommandBuffer);
        }
        this._nativeQueue.submit(commandBufferList);
    }
}
