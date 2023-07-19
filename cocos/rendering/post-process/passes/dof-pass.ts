import { Vec3 } from '@cocos/cannon';
import { Vec2, Vec4 } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { Pipeline } from '../../custom/pipeline';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { getSetting, SettingPass } from './setting-pass';
import { Dof } from '../components';
import { disablePostProcessForDebugView } from './base-pass';

export class DofPass extends SettingPass {
    get setting () { return getSetting(Dof); }

    checkEnable (camera: Camera) {
        let enable = super.checkEnable(camera);
        if (disablePostProcessForDebugView()) {
            enable = false;
        }
        return enable;
    }

    name = 'DOFPass'
    effectName = 'pipeline/post-process/dof';
    outputNames = ['DOFColor']

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);

        passContext.clearFlag = ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, 0, 0, 0, 1);

        const passViewport = passContext.passViewport;

        passContext.material = this.material;

        const setting = this.setting;

        const cocParams = new Vec4(setting.farStart, setting.farEnd, setting.maxRadius, 0.0);
        const texSize = new Vec4(passViewport.width, passViewport.height, 1.0 / passViewport.width, 1.0 / passViewport.height);

        this.material.setProperty('cocParams', cocParams);
        this.material.setProperty('texSize', texSize);

        const slot = this.slotName(camera, 0);
        const input = this.lastPass!.slotName(camera, 0);
        const depth = this.lastPass!.slotName(camera, 1);

        const outputCOC = `DOF_CIRCLE_OF_CONFUSION${cameraID}`;
        passContext
            .updatePassViewPort()
            .addRenderPass('dof-coc', `dof-coc${cameraID}`)
            .setPassInput(depth, 'depthTex')
            .addRasterView(outputCOC, Format.RGBA8)
            .blitScreen(0)
            .version();

        const outputPrefilter = `DOF_PREFILTER${cameraID}`;
        passContext
            .updatePassViewPort()
            .addRenderPass('dof-prefilter', `dof-prefilter${cameraID}`)
            .setPassInput(input, 'colorTex')
            .setPassInput(outputCOC, 'cocTex')
            .addRasterView(slot, Format.RGBA8)
            .blitScreen(1)
            .version();
    }
}
