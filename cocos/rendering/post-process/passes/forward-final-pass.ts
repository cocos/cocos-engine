import { Vec4 } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera, SKYBOX_FLAG } from '../../../render-scene/scene';
import { getCameraUniqueID } from '../../custom/define';
import { Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { BasePass } from './base-pass';

export class ForwardFinalPass extends BasePass {
    name = 'ForwardFinalPass';
    outputNames = ['ForwardFinalColor'];

    enableInAllEditorCamera = true;

    public render (camera: Camera, ppl: Pipeline): void {
        if (!this.lastPass) {
            return;
        }

        passContext.clearFlag = camera.clearFlag & ClearFlagBit.COLOR  | (camera.clearFlag & SKYBOX_FLAG);
        Vec4.set(passContext.clearColor, camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w);

        passContext.material = this.material;

        const cameraID = getCameraUniqueID(camera);

        const input0 = this.lastPass.slotName(camera, 0);
        const slot0 = this.slotName(camera, 0);

        const isOffScreen = false;//director.root!.mainWindow !== camera.window;

        const fb = camera.window.framebuffer;
        const ct = fb && fb.colorTextures[0];
        const format = ct ? ct.format : Format.RGBA8;

        const shadingScale = passContext.shadingScale;
        passContext
            .updatePassViewPort(1 / shadingScale, 1 / shadingScale)
            .addRenderPass('post-process', `${this.name}${cameraID}`)
            .setPassInput(input0, 'inputTexture')
            .addRasterView(slot0, format, isOffScreen)
            .blitScreen(0);

        this.renderProfiler(camera);
    }
}
