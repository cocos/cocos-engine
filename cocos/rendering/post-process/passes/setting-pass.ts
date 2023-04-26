import { Camera } from '../../../render-scene/scene';
import { PostProcessSetting } from '../components/post-process-setting';
import { passContext } from '../utils/pass-context';
import { BasePass } from './base-pass';

export function getSetting<T extends PostProcessSetting> (settingClass: new () => T) {
    const cls: typeof PostProcessSetting = settingClass as any;
    let setting = passContext.postProcess && passContext.postProcess.getSetting(cls) as T;
    if (!setting) {
        setting = cls.default as T;
    }
    return setting;
}

export abstract class SettingPass extends BasePass {
    getSetting = getSetting
    get setting () { return this.getSetting(PostProcessSetting); }

    checkEnable (camera: Camera) {
        const enable = super.checkEnable(camera);
        const setting = this.setting;
        return enable && !!setting && setting.enabledInHierarchy;
    }
}
