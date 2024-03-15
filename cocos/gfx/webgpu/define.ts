import { WebGPUDevice } from './webgpu-device'

export class WebGPUDeviceManager {
    static get instance (): WebGPUDevice {
        return WebGPUDeviceManager._instance!;
    }
    static setInstance (instance: WebGPUDevice): void {
        WebGPUDeviceManager._instance = instance;
    }
    private static _instance: WebGPUDevice | null = null;
}