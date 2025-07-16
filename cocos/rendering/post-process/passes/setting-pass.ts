import { Camera } from '../../../render-scene/scene';
import { PostProcessSetting } from '../components/post-process-setting';
import { passContext } from '../utils/pass-context';
import { BasePass } from './base-pass';

export function getSetting<T extends PostProcessSetting> (settingClass: new () => T): T {
    const cls: typeof PostProcessSetting = settingClass as any;
    const setting = passContext.postProcess && passContext.postProcess.getSetting(cls) as T;
    return setting!;
}

export abstract class SettingPass extends BasePass {
    getSetting = getSetting;
    get setting (): PostProcessSetting { return this.getSetting(PostProcessSetting); }

    checkEnable (camera: Camera): boolean {
        const enable = super.checkEnable(camera);
        const setting = this.setting;
        return enable && !!setting && setting.enabledInHierarchy;
    }
}
