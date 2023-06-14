import { EDITOR } from 'internal:constants';
import { Vec4 } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera, CameraUsage } from '../../../render-scene/scene';
import { Pipeline } from '../../custom';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { FSR } from '../components/fsr';
import { getSetting, SettingPass } from './setting-pass';
import { game } from '../../../game';

export class FSRPass extends SettingPass {
    get setting (): FSR { return getSetting(FSR); }

    name = 'FSRPass';
    effectName = 'pipeline/post-process/fsr';
    outputNames = ['FSRColor'];

    checkEnable (camera: Camera): boolean {
        let enable = super.checkEnable(camera);
        if (EDITOR && camera.cameraUsage === CameraUsage.PREVIEW) {
            enable = false;
        }
        return enable;
    }

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);

        passContext.material = this.material;
        passContext.clearBlack();

        passContext.updatePassViewPort(1 / passContext.shadingScale);

        const inputWidth = Math.floor(game.canvas!.width * passContext.shadingScale);
        const inputHeight = Math.floor(game.canvas!.height * passContext.shadingScale);
        const outWidth = Math.floor(game.canvas!.width);
        const outHeight = Math.floor(game.canvas!.height);

        const setting = this.setting;
        this.material.setProperty('fsrParams', new Vec4(setting.sharpness, 0, 0, 0));
        this.material.setProperty(
            'texSize',
            new Vec4(
                inputWidth,
                inputHeight,
                outWidth,
                outHeight,
            ),
        );

        const input0 = this.lastPass!.slotName(camera, 0);
        const easu = `FSR_EASU${cameraID}`;
        passContext
            .addRenderPass('post-process', `CameraFSR_EASU_Pass${cameraID}`)
            .setPassInput(input0, 'outputResultMap')
            .addRasterView(easu, Format.RGBA8)
            .blitScreen(0)
            .version();

        const slot0 = this.slotName(camera, 0);
        passContext
            .addRenderPass('post-process', `CameraFSR_RCAS_Pass${cameraID}`)
            .setPassInput(easu, 'outputResultMap')
            .addRasterView(slot0, Format.RGBA8)
            .blitScreen(1)
            .version();
    }
}
