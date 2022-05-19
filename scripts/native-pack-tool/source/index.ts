
import { nativePackToolMg } from './base/manager';
import { MacPackTool } from './platforms/mac';
import { WindowsPackTool } from './platforms/windows';
import { AndroidPackTool } from './platforms/android';
import { LinuxPackTool } from './platforms/linux';
import { OHOSPackTool } from './platforms/ohos';

nativePackToolMg.register('mac', new MacPackTool());
nativePackToolMg.register('windows', new WindowsPackTool());
nativePackToolMg.register('android', new AndroidPackTool());
nativePackToolMg.register('linux', new LinuxPackTool());
nativePackToolMg.register('ohos', new OHOSPackTool());

export * from './base/manager';
export * from './base/default';
