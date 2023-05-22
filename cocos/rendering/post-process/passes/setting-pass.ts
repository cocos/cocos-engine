import { macro } from '../../../core';
import { Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { BasicPipeline } from '../../custom';
import { supportsRGBA16FloatTexture } from '../../define';
import { PostProcessSetting } from '../components/post-process-setting';
import { passContext } from '../utils/pass-context';
import { BasePass } from './base-pass';

export function GetRTFormatBeforeToneMapping (ppl: BasicPipeline) {
    const useFloatOutput = ppl.getMacroBool('CC_USE_FLOAT_OUTPUT');
    return ppl.pipelineSceneData.isHDR && useFloatOutput && supportsRGBA16FloatTexture(ppl.device) ? Format.RGBA16F : Format.RGBA8;
}
export function ForceEnableFloatOutput (ppl: BasicPipeline) {
    if (ppl.pipelineSceneData.isHDR && !ppl.getMacroBool('CC_USE_FLOAT_OUTPUT')) {
        const supportFloatOutput = supportsRGBA16FloatTexture(ppl.device);
        ppl.setMacroBool('CC_USE_FLOAT_OUTPUT', supportFloatOutput);
        macro.ENABLE_FLOAT_OUTPUT = supportFloatOutput;
    }
}

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
