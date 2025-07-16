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
    get setting (): DOF { return getSetting(DOF); }

    checkEnable (camera: Camera): boolean {
        let enable = super.checkEnable(camera);
        if (disablePostProcessForDebugView()) {
            enable = false;
        }
        return enable;
    }

    name = 'DOFPass';
    effectName = 'pipeline/post-process/dof';
    outputNames = ['DOFColor'];

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);

        passContext.clearFlag = ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, 0, 0, 0, 1);

        const passViewport = passContext.passViewport;

        passContext.material = this.material;

        const setting = this.setting;

        const width = passViewport.width;
        const height = passViewport.height;

        const cocParams = new Vec4(setting.focusDistance, setting.focusRange, setting.bokehRadius, 0.0);
        const mainTexTexelSize = new Vec4(1.0 / width, 1.0 / height, width, height);

        this.material.setProperty('cocParams', cocParams);
        this.material.setProperty('mainTexTexelSize', mainTexTexelSize);

        const slot = this.slotName(camera, 0);
        const colorTex = this.lastPass!.slotName(camera, 0);
        const depthTex = this.lastPass!.slotName(camera, 1);

        // compute CoC
        const outputCOC = `DOF_CIRCLE_OF_CONFUSION${cameraID}`;
        passContext
            .updatePassViewPort()
            .addRenderPass('dof-coc', `dof-coc${cameraID}`)
            .setPassInput(depthTex, 'DepthTex')
            .addRasterView(outputCOC, Format.RGBA8)
            .blitScreen(0)
            .version();

        // downscale
        const outputPrefilter = `DOF_PREFILTER${cameraID}`;
        passContext
            .updatePassViewPort(0.5)
            .addRenderPass('dof-prefilter', `dof-prefilter${cameraID}`)
            .setPassInput(colorTex, 'colorTex')
            .setPassInput(outputCOC, 'cocTex')
            .addRasterView(outputPrefilter, Format.RGBA8)
            .blitScreen(1)
            .version();

        // bokeh blur
        const outputBokeh = `DOF_BOKEH${cameraID}`;
        passContext
            .updatePassViewPort(0.5)
            .addRenderPass('dof-bokeh', `dof-bokeh${cameraID}`)
            .setPassInput(outputPrefilter, 'prefilterTex')
            .addRasterView(outputBokeh, Format.RGBA8)
            .blitScreen(2)
            .version();

        //filtering
        const outputFilter = `DOF_FILTER${cameraID}`;
        passContext
            .updatePassViewPort(0.5)
            .addRenderPass('dof-filter', `dof-filter${cameraID}`)
            .setPassInput(outputBokeh, 'bokehTex')
            .addRasterView(outputFilter, Format.RGBA8)
            .blitScreen(3)
            .version();

        //combine
        passContext
            .updatePassViewPort()
            .addRenderPass('dof-combine', `dof-combine${cameraID}`)
            .setPassInput(outputFilter, 'filterTex')
            .setPassInput(outputCOC, 'cocTex')
            .setPassInput(colorTex, 'colorTex')
            .addRasterView(slot, Format.RGBA8)
            .blitScreen(4)
            .version();
    }
}
