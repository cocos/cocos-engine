import { Camera } from '../../../render-scene/scene';
import { PostProcessSetting } from '../components/post-process-setting';
import { passSettings } from '../utils/pass-settings';
import { BasePass } from './base-pass';

export abstract class SettingPass <T extends PostProcessSetting> extends BasePass {
    abstract SettingClass: typeof PostProcessSetting;

    getSetting () {
        let setting = passSettings.postProcess && passSettings.postProcess.getSetting(this.SettingClass) as T;
        if (!setting) {
            setting = this.SettingClass.default as T;
        }
        return setting;
    }

    checkEnable (camera: Camera) {
        const enable = super.checkEnable(camera);
        const setting = this.getSetting();
        return enable && !!setting && setting.enabledInHierarchy;
    }
}
