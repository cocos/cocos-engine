import { Vec4 } from '../../../core';

import { ClearFlagBit, Format } from '../../../gfx';
import { Camera, ShadowType, SKYBOX_FLAG } from '../../../render-scene/scene';
import { LightInfo, QueueHint, SceneFlags } from '../../custom/types';
import { getCameraUniqueID } from '../../custom/define';
import { Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { BasePass, getRTFormatBeforeToneMapping, getShadowMapSampler } from './base-pass';
import { ShadowPass } from './shadow-pass';

export class ForwardPass extends BasePass {
    name = 'ForwardPass';
    outputNames = ['ForwardColor', 'ForwardDS'];

    enableInAllEditorCamera = true;
    depthBufferShadingScale = 1;

    calcDepthSlot (camera: Camera): void {
        const depthSlotName = !!passContext.depthSlotName;
        let canUsePrevDepth = !(camera.clearFlag & ClearFlagBit.DEPTH_STENCIL);
        canUsePrevDepth = canUsePrevDepth && passContext.shadingScale === this.depthBufferShadingScale;
        if (canUsePrevDepth) {
            if (!depthSlotName) passContext.depthSlotName = super.slotName(camera, 1);
            return;
        }
        this.depthBufferShadingScale = passContext.shadingScale;

        passContext.depthSlotName = super.slotName(camera, 1);
    }

    slotName (camera: Camera, index = 0): string {
        if (index === 1) {
            return passContext.depthSlotName;
        }

        return super.slotName(camera, index);
    }

    public render (camera: Camera, ppl: Pipeline): void {
        passContext.clearFlag = ClearFlagBit.COLOR | (camera.clearFlag & ClearFlagBit.DEPTH_STENCIL) | (camera.clearFlag & SKYBOX_FLAG);
        Vec4.set(passContext.clearColor, 0, 0, 0, 0);
        Vec4.set(passContext.clearDepthColor, camera.clearDepth, camera.clearStencil, 0, 0);

        this.calcDepthSlot(camera);

        const slot0 = this.slotName(camera, 0);
        const slot1 = this.slotName(camera, 1);

        const cameraID = getCameraUniqueID(camera);
        const isOffScreen = true;
        passContext
            .updatePassViewPort()
            .addRenderPass('default', `${this.name}_${cameraID}`)
            .addRasterView(slot0, getRTFormatBeforeToneMapping(ppl), isOffScreen)
            .addRasterView(slot1, Format.DEPTH_STENCIL, isOffScreen)
            .version();

        const pass = passContext.pass!;
        const shadowPass = passContext.shadowPass as ShadowPass;
        if (shadowPass) {
            for (const dirShadowName of shadowPass.mainLightShadows) {
                if (ppl.containsResource(dirShadowName)) {
                    pass.addTexture(dirShadowName, 'cc_shadowMap', getShadowMapSampler());
                }
            }
            for (const spotShadowName of shadowPass.spotLightShadows) {
                if (ppl.containsResource(spotShadowName)) {
                    pass.addTexture(spotShadowName, 'cc_spotShadowMap', getShadowMapSampler());
                }
            }
        }
        const forwardQueue = pass.addQueue(QueueHint.RENDER_OPAQUE);
        forwardQueue.addSceneOfCamera(
            camera,
            new LightInfo(),
            SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT
             | SceneFlags.GEOMETRY,
        );
        const forwardAddQueue = pass.addQueue(QueueHint.RENDER_TRANSPARENT, 'forward-add');
        passContext.addSceneLights(forwardAddQueue, camera);
        const shadowInfo = ppl.pipelineSceneData.shadows;
        if (camera.scene?.mainLight && shadowInfo.enabled && shadowInfo.type === ShadowType.Planar) {
            pass.addQueue(QueueHint.RENDER_TRANSPARENT, 'planar-shadow')
                .addSceneOfCamera(
                    camera,
                    new LightInfo(camera.scene?.mainLight),
                    SceneFlags.TRANSPARENT_OBJECT | SceneFlags.SHADOW_CASTER
                    | SceneFlags.GEOMETRY,
                );
        }
        passContext.forwardPass = this;
    }
}
