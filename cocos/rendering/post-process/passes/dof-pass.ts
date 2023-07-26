import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { Pipeline } from '../../custom/pipeline';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { getSetting, SettingPass } from './setting-pass';
import { disablePostProcessForDebugView } from './base-pass';
import { Vec4 } from '../../../core';
import { DOF } from '../components/dof';

export class DofPass extends SettingPass {
    get setting () { return getSetting(DOF); }

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
        const colorTex = this.lastPass!.slotName(camera, 0);
        const depthTex = this.lastPass!.slotName(camera, 1);

        const outputCOC = `DOF_CIRCLE_OF_CONFUSION${cameraID}`;
        passContext
            .updatePassViewPort()
            .addRenderPass('dof-coc', `dof-coc${cameraID}`)
            .setPassInput(depthTex, 'depthTex')
            .addRasterView(outputCOC, Format.RGBA8)
            .blitScreen(0)
            .version();

        const outputPrefilter = `DOF_PREFILTER${cameraID}`;
        passContext
            .updatePassViewPort()
            .addRenderPass('dof-prefilter', `dof-prefilter${cameraID}`)
            .setPassInput(colorTex, 'colorTex')
            .setPassInput(outputCOC, 'cocTex')
            .addRasterView(outputPrefilter, Format.RGBA8)
            .blitScreen(1)
            .version();

        const outputBlur = `DOF_BLUR${cameraID}`;
        passContext
            .updatePassViewPort()
            .addRenderPass('dof-blur', `dof-blur${cameraID}`)
            .setPassInput(colorTex, 'colorTex')
            .addRasterView(outputBlur, Format.RGBA8)
            .blitScreen(2)
            .version();

        passContext
            .updatePassViewPort()
            .addRenderPass('dof-combine', `dof-combine${cameraID}`)
            .setPassInput(outputBlur, 'blurTex')
            .setPassInput(colorTex, 'colorTex')
            .setPassInput(outputPrefilter, 'prefilterTex')
            .addRasterView(slot, Format.RGBA8)
            .blitScreen(3)
            .version();

        // const outputBlurVar = `DOF_BLUR_VAR${cameraID}`;
        // passContext
        //     .updatePassViewPort()
        //     .addRenderPass('dof-blur-ver', `dof-blur-ver${cameraID}`)
        //     .setPassInput(outputBlurHor, 'outResultTex')
        //     .addRasterView(slot, Format.RGBA8)
        //     .blitScreen(3)
        //     .version();
    }
}
