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

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);
        passContext.clearBlack();
        passContext.material = this.material;

        const setting = this.setting;

        const input = this.lastPass!.slotName(camera, 0);
        const output = this.slotName(camera);

        passContext.updatePassViewPort();
        const width = passContext.passViewport.width;
        const height = passContext.passViewport.height;

        passContext.material.setProperty('texSize', new Vec4(width, height, 1.0 / width, 1.0 / height), 0);

        passContext.addRasterPass('fxaa', `fxaa${cameraID}`)
            .setPassInput(input, 'sceneColorMap')
            .addRasterView(output, Format.RGBA8)
            .blitScreen(0)
            .version();
    }
}
