import { Vec4 } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { Pipeline } from '../../custom';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { getSetting, SettingPass } from './setting-pass';
import { Fxaa } from '../components/fxaa';

export class FxaaPass extends SettingPass {
    get setting () { return getSetting(Fxaa); }

    name = 'FxaaPass'
    effectName = 'pipeline/post-process/fxaa-hq';
    outputNames = ['FxaaColor']

    checkEnable (camera: Camera) {
        const enable = super.checkEnable(camera);
        const setting = this.setting;
        return enable && !!setting && setting.enabledInHierarchy;
    }

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);
        const area = this.getRenderArea(camera);
        const inputWidth = area.width;
        const inputHeight = area.height;

        const shadingScale = this.finalShadingScale();
        const width = Math.floor(inputWidth / shadingScale);
        const height = Math.floor(inputHeight / shadingScale);

        passContext.clearFlag = ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, 0, 0, 0, 1);

        passContext.material = this.material;

        const setting = this.setting;

        const input = this.lastPass!.slotName(camera, 0);
        const output = this.slotName(camera);

        passContext.material.setProperty('texSize', new Vec4(width, height, 1.0 / width, 1.0 / height), 0);
        passContext.addRasterPass(width, height, 'fxaa', `fxaa${cameraID}`)
            .setViewport(area.x, area.y, width, height)
            .setPassInput(input, 'sceneColorMap')
            .addRasterView(output, Format.RGBA8)
            .blitScreen(0)
            .version();
    }
}
