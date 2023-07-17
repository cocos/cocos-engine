import { Vec4, cclegacy } from '../../../core';

import { ClearFlagBit, Color, Format, StoreOp, Viewport } from '../../../gfx';
import { Camera, ProbeType, ReflectionProbe } from '../../../render-scene/scene';
import { AttachmentType, LightInfo, QueueHint, ResourceResidency, SceneFlags } from '../../custom/types';
import { Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { BasePass } from './base-pass';
import { RenderWindow } from '../../../render-scene/core/render-window';
import { getLoadOpOfClearFlag, updateCameraUBO } from '../../custom/define';

export class ReflectionProbePass extends BasePass {
    name = 'ReflectionProbePass';
    outputNames = ['ReflectionProbeColor', 'ReflectionProbeDS']

    enableInAllEditorCamera = true;
    depthBufferShadingScale = 1;

    slotName (camera: Camera, index = 0): string {
        return this.lastPass!.slotName(camera, index);
    }

    public render (camera: Camera, ppl: Pipeline): void {
        if (!cclegacy.internal.reflectionProbeManager) return;
        const probes = cclegacy.internal.reflectionProbeManager.getProbes();
        if (probes.length === 0) return;
        for (let i = 0; i < probes.length; i++) {
            const probe = probes[i];
            if (probe.needRender) {
                if (probe.probeType === ProbeType.PLANAR) {
                    this.buildReflectionProbePass(camera, ppl, probe, probe.realtimePlanarTexture.window!, 0);
                    probe.copyTextureToMipmap();
                } else if (probe.probeType === ProbeType.CUBE) {
                    for (let faceIdx = 0; faceIdx < probe.bakedCubeTextures.length; faceIdx++) {
                        probe.updateCameraDir(faceIdx);
                        this.buildReflectionProbePass(camera, ppl, probe, probe.bakedCubeTextures[faceIdx].window!, faceIdx);
                    }
                    probe.needRender = false;
                }
            }
        }
    }

    public buildReflectionProbePass (camera: Camera,
        ppl: Pipeline, probe: ReflectionProbe, renderWindow: RenderWindow, faceIdx: number): void {
        const cameraName = `Camera${faceIdx}`;
        const area = probe.renderArea();
        const width = area.x;
        const height = area.y;
        const probeCamera = probe.camera;

        const probePassRTName = `reflectionProbePassColor${cameraName}`;
        const probePassDSName = `reflectionProbePassDS${cameraName}`;

        if (!ppl.containsResource(probePassRTName)) {
            ppl.addRenderWindow(probePassRTName, Format.RGBA8, width, height, renderWindow);
            ppl.addDepthStencil(probePassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.EXTERNAL);
        }
        ppl.updateRenderWindow(probePassRTName, renderWindow);
        ppl.updateDepthStencil(probePassDSName, width, height);

        const probePass = ppl.addRenderPass(width, height, 'default');

        probePass.name = `ReflectionProbePass${faceIdx}`;
        probePass.setViewport(new Viewport(0, 0, width, height));
        probePass.addRenderTarget(probePassRTName, getLoadOpOfClearFlag(probeCamera.clearFlag, AttachmentType.RENDER_TARGET),
            StoreOp.STORE, new Color(probeCamera.clearColor.x, probeCamera.clearColor.y, probeCamera.clearColor.z, probeCamera.clearColor.w));
        probePass.addDepthStencil(probePassDSName, getLoadOpOfClearFlag(probeCamera.clearFlag, AttachmentType.DEPTH_STENCIL),
            StoreOp.STORE, probeCamera.clearDepth, probeCamera.clearStencil, probeCamera.clearFlag);
        const passBuilder = probePass.addQueue(QueueHint.RENDER_OPAQUE);
        passBuilder.addSceneOfCamera(camera, new LightInfo(), SceneFlags.REFLECTION_PROBE);
        updateCameraUBO(passBuilder as unknown as any, probeCamera, ppl);
    }
}
