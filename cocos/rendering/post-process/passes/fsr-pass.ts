import { EDITOR } from 'internal:constants';
import { Vec4 } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera, CameraUsage } from '../../../render-scene/scene';
import { Pipeline } from '../../custom';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { FSR } from '../components/fsr';
import { getSetting, SettingPass } from './setting-pass';

export class FSRPass extends SettingPass {
    get setting () { return getSetting(FSR); }

    name = 'FSRPass'
    effectName = 'pipeline/post-process/fsr';
    outputNames = ['FSRColor']

    checkEnable (camera: Camera) {
        let enable = super.checkEnable(camera);
        if (EDITOR && camera.cameraUsage === CameraUsage.PREVIEW) {
            enable = false;
        }
        return enable;
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
        this.material.setProperty('fsrParams', new Vec4(setting.sharpness, 0, 0, 0));
        this.material.setProperty('texSize',
            new Vec4(
                inputWidth, inputHeight,
                outWidth, outHeight,
            ));

        const input0 = this.lastPass!.slotName(camera, 0);
        const easu = `FSR_EASU${cameraID}`;
        passContext.addRasterPass(outWidth, outHeight, 'post-process', `CameraFSR_EASU_Pass${cameraID}`)
            .setViewport(0, 0, outWidth, outHeight)
            .setPassInput(input0, 'outputResultMap')
            .addRasterView(easu, Format.RGBA8)
            .blitScreen(0)
            .version();

        const slot0 = this.slotName(camera, 0);
        passContext.addRasterPass(outWidth, outHeight, 'post-process', `CameraFSR_RCAS_Pass${cameraID}`)
            .setViewport(0, 0, outWidth, outHeight)
            .setPassInput(easu, 'outputResultMap')
            .addRasterView(slot0, Format.RGBA8)
            .blitScreen(1)
            .version();
    }
}
