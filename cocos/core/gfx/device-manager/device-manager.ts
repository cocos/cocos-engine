import { TEST } from 'internal:constants';
import { systemInfo } from 'pal/system-info';
import { bindingMappingInfo } from '../../pipeline/define';
import { DeviceInfo } from '../base/define';
import { Device } from '../base/device';
import { EmptyDevice } from '../empty/empty-device';
import { legacyCC } from '../../global-exports';

export class DeviceManager {
    static create (): Device {
        let device: Device | undefined;
        const deviceInfo = new DeviceInfo(bindingMappingInfo);

        if (TEST) {
            device = new EmptyDevice();
            device.initialize(deviceInfo);
        } else {
            const ctors: Constructor<Device>[] = [];
            if (systemInfo.supportWebGL2 && legacyCC.WebGL2Device) {
                ctors.push(legacyCC.WebGL2Device);
            }
            if (legacyCC.WebGLDevice) {
                ctors.push(legacyCC.WebGLDevice);
            }
            if (legacyCC.EmptyDevice) {
                ctors.push(legacyCC.EmptyDevice);
            }

            for (let i = 0; i < ctors.length; i++) {
                device = new ctors[i]();
                if (device.initialize(deviceInfo)) { break; }
            }
        }
        if (typeof device === 'undefined') {
            throw new Error('can not support rendering.');
        }
        return device;
    }
}
