import { Camera } from '../../../render-scene/scene';
import { PostProcessSetting } from '../components/post-process-setting';
import { passSettings } from '../utils/pass-settings';
import { BasePass } from './base-pass';

export function getSetting<T extends PostProcessSetting> (settingClass: new () => T) {
    const cls: typeof PostProcessSetting = settingClass as any;
    let setting = passSettings.postProcess && passSettings.postProcess.getSetting(cls) as T;
    if (!setting) {
        setting = cls.default as T;
    }
    return setting;
}

export abstract class SettingPass extends BasePass {
    _getSetting = getSetting
    get setting () { return getSetting(PostProcessSetting); }

    checkEnable (camera: Camera) {
        const enable = super.checkEnable(camera);
        const setting = this.setting;
        return enable && !!setting && setting.enabledInHierarchy;
    }
}
