import { Vec4 } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { Pipeline } from '../../custom';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { getSetting, SettingPass } from './setting-pass';
import { ColorGrading } from '../components';

export class ColorGradingPass extends SettingPass {
    get setting () { return getSetting(ColorGrading); }

    name = 'ColorGrading'
    effectName = 'post-process/color-grading';
    outputNames = ['ColorGradingColor']

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
        const outWidth = Math.floor(inputWidth / shadingScale);
        const outHeight = Math.floor(inputHeight / shadingScale);

        passContext.clearFlag = ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, 0, 0, 0, 1);

        passContext.material = this.material;

        const setting = this.setting;
        this.material.setProperty('colorGradingMap', setting.colorGradingMap);
        this.material.setProperty('texSize',
            new Vec4(
                inputWidth, inputHeight,
                outWidth, outHeight,
            ));

        
        const input0 = this.lastPass!.slotName(camera, 0);
        const easu = 'COLOR-GRADING_EASU';
        passContext.addRasterPass(outWidth, outHeight, 'color-grading', `color-grading${cameraID}`)
            .setViewport(area.x, area.y, outWidth, outHeight)
            .setPassInput(input0, 'sceneColorMap')
            .addRasterView(easu, Format.RGBA8)
            .blitScreen(0)
            .version();
    }
}
