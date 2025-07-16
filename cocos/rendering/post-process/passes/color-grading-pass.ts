import { Vec2, Vec4 } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { Pipeline } from '../../custom/pipeline';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { getSetting, SettingPass } from './setting-pass';
import { ColorGrading } from '../components';
import { disablePostProcessForDebugView } from './base-pass';

export class ColorGradingPass extends SettingPass {
    get setting (): ColorGrading { return getSetting(ColorGrading); }

    checkEnable (camera: Camera): boolean {
        let enable = super.checkEnable(camera);
        if (disablePostProcessForDebugView()) {
            enable = false;
        }
        return enable;
    }

    name = 'ColorGradingPass';
    effectName = 'pipeline/post-process/color-grading';
    outputNames = ['ColorGrading'];

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);

        passContext.clearFlag = ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, 0, 0, 0, 1);

        passContext.material = this.material;

        const setting = this.setting;
        this.material.setProperty('colorGradingMap', setting.colorGradingMap);
        this.material.setProperty('contribute', setting.contribute);
        const textureSize = setting.colorGradingMap ? new Vec2(setting.colorGradingMap.width, setting.colorGradingMap.height) : new Vec2(1.0, 1.0);
        this.material.setProperty('lutTextureSize', textureSize);

        const input = this.lastPass!.slotName(camera, 0);
        const slot = this.slotName(camera, 0);
        const isSquareMap = setting.colorGradingMap && setting.colorGradingMap.width === setting.colorGradingMap.height;
        const passName = isSquareMap ? 'color-grading-8x8' : 'color-grading-nx1';
        const passIndx = isSquareMap ? 1 : 0;
        passContext
            .updatePassViewPort()
            .addRenderPass(passName, `color-grading${cameraID}`)
            .setPassInput(input, 'sceneColorMap')
            .addRasterView(slot, Format.RGBA8)
            .blitScreen(passIndx)
            .version();
    }
}
