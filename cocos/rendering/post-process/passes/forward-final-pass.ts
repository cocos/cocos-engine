import { EDITOR } from 'internal:constants';

import { Vec4 } from '../../../core';
import { director } from '../../../game';

import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { getCameraUniqueID } from '../../custom/define';
import { Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { BasePass } from './base-pass';

export class ForwardFinalPass extends BasePass {
    name = 'ForwardFinalPass';
    outputNames = ['ForwardFinalColor']

    enableInAllEditorCamera = true;

    public render (camera: Camera, ppl: Pipeline) {
        if (!this.lastPass) {
            return;
        }

        passContext.clearFlag = camera.clearFlag & ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w);

        // passContext.clearFlag = ClearFlagBit.COLOR;
        // Vec4.set(passContext.clearColor, 0, 0, 0, 1);

        passContext.material = this.material;

        const cameraID = getCameraUniqueID(camera);
        const area = this.getRenderArea(camera);
        let width = area.width;
        let height = area.height;

        const input0 = this.lastPass.slotName(camera, 0);
        const slot0 = this.slotName(camera, 0);

        const shadingScale = this.finalShadingScale();
        const isOffScreen = director.root!.mainWindow !== camera.window;

        if (!isOffScreen) {
            width /= shadingScale;
            height /= shadingScale;
        }

        const fb = camera.window.framebuffer;
        const ct = fb && fb.colorTextures[0];
        const format = ct ? ct.format : Format.RGBA8;

        passContext.addRasterPass(width, height, 'post-process', `${this.name}${cameraID}`)
            .setViewport(area.x, area.y, width, height)
            .setPassInput(input0, 'inputTexture')
            .addRasterView(slot0, format, isOffScreen)
            .blitScreen(0);

        this.renderProfiler(camera);
    }
}
