import { bindingMappingInfo } from '../../pipeline/define';
import { DeviceInfo } from '../base/define';
import { Device } from '../base/device';

declare global {
    interface Window {
        gfx: any;
    }
}

export class DeviceManager {
    static create (): Device {
        let device: Device | undefined;
        const deviceInfo = new DeviceInfo(bindingMappingInfo);

        const gfx = window.gfx;  // defined on native
        if (gfx) {
            device = gfx.DeviceManager.create(deviceInfo);
        }
        if (typeof device === 'undefined') {
            throw new Error('can not support rendering.');
        }
        return device;
    }
}
