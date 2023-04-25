import { EDITOR } from 'internal:constants';
import { Vec4 } from '../../../core';
import { director } from '../../../game';

import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { AccessType, LightInfo, QueueHint, ResourceResidency, SceneFlags } from '../../custom';
import { getCameraUniqueID } from '../../custom/define';
import { Pipeline } from '../../custom/pipeline';
import { passSettings } from '../utils/pass-settings';
import { passUtils } from '../utils/pass-utils';
import { BasePass } from './base-pass';

export class ForwardPass extends BasePass {
    name = 'ForwardPass';
    outputNames = ['ForwardColor', 'ForwardDS']

    enableInAllEditorCamera = true;

    slotName (camera: Camera, index = 0) {
        if (index === 1) {
            const cameraIdx = director.root!.cameraList.indexOf(camera);
            if (cameraIdx === 0) {
                return this.outputNames[index];
            }
            if (!(camera.clearFlag & ClearFlagBit.DEPTH_STENCIL)) {
                return this.outputNames[index];
            }
        }

        return super.slotName(camera, index);
    }

    public render (camera: Camera, ppl: Pipeline) {
        passUtils.clearFlag = ClearFlagBit.COLOR | (camera.clearFlag & ClearFlagBit.DEPTH_STENCIL);
        Vec4.set(passUtils.clearColor, 0, 0, 0, 0);

        // passUtils.clearFlag = camera.clearFlag;
        // Vec4.set(passUtils.clearColor, camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w);

        Vec4.set(passUtils.clearDepthColor, camera.clearDepth, camera.clearStencil, 0, 0);

        const area = this.getRenderArea(camera);
        const width = area.width;
        const height = area.height;

        const slot0 = this.slotName(camera, 0);
        const slot1 = this.slotName(camera, 1);

        const cameraID = getCameraUniqueID(camera);
        const isOffScreen = true;
        passUtils.addRasterPass(width, height, 'default', `${this.name}_${cameraID}`)
            .setViewport(0, 0, width, height)
            .addRasterView(slot0, Format.RGBA16F, isOffScreen)
            .addRasterView(slot1, Format.DEPTH_STENCIL, isOffScreen)
            .version();

        const pass = passUtils.pass!;
        pass.addQueue(QueueHint.RENDER_OPAQUE)
            .addSceneOfCamera(camera,
                new LightInfo(),
                SceneFlags.OPAQUE_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.CUTOUT_OBJECT
                | SceneFlags.DEFAULT_LIGHTING | SceneFlags.DRAW_INSTANCING);

        pass.addQueue(QueueHint.RENDER_TRANSPARENT)
            .addSceneOfCamera(camera,
                new LightInfo(),
                SceneFlags.UI | SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY);

        passSettings.forwardPass = this;
    }
}
