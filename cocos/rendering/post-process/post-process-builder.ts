import { EDITOR } from 'internal:constants';

import { Camera, CameraProjection, CameraUsage } from '../../render-scene/scene';
import { PipelineBuilder, Pipeline } from '../custom/pipeline';

import { passContext } from './utils/pass-context';
import { ForwardFinalPass } from './passes/forward-final-pass';
import { buildReflectionProbePasss, getCameraUniqueID } from '../custom/define';

import { BasePass } from './passes/base-pass';
import { ForwardPass } from './passes/forward-pass';
import { TAAPass } from './passes/taa-pass';
import { FSRPass } from './passes/fsr-pass';
import { BlitScreenPass } from './passes/blit-screen-pass';

import { ShadowPass } from './passes/shadow-pass';
import { HBAOPass } from './passes/hbao-pass';
import { PostProcess } from './components/post-process';
import { director } from '../../game';

import { Camera as CameraComponent } from '../../misc';
import { BloomPass, ColorGradingPass, DofPass, FloatOutputProcessPass, ForwardTransparencyPass,
    ForwardTransparencySimplePass, FxaaPass, PostFinalPass, SkinPass } from './passes';
import { PipelineEventType } from '../pipeline-event';

export class PostProcessBuilder implements PipelineBuilder  {
    pipelines: Map<string, BasePass[]> = new Map();
    constructor () {
        this.init();
    }

    onGlobalPipelineStateChanged (): void {
        const passes = this.pipelines.get('forward');
        if (passes !== undefined) {
            for (let i = 0; i < passes.length; i++) {
                const pass = passes[i];
                if (typeof pass.onGlobalPipelineStateChanged === 'function') {
                    pass.onGlobalPipelineStateChanged();
                }
            }
        }
    }

    init (): void {
        const forward = new ForwardPass();
        const forwardFinal = new ForwardFinalPass();
        const shadowPass = new ShadowPass();

        // default pipeline
        this.addPass(shadowPass, 'default');

        this.addPass(forward, 'default');
        this.addPass(new ForwardTransparencySimplePass(), 'default');
        this.addPass(forwardFinal, 'default');

        // rendering dependent data generation
        this.addPass(shadowPass);

        // opaque objects forward lighting
        this.addPass(forward);
        this.addPass(new SkinPass());

        // depth-based shading
        this.addPass(new HBAOPass());

        // float output related deferred processing: hdr + fog
        this.addPass(new FloatOutputProcessPass());

        // transparency should after hdr and depth-based shading
        // temporary ignore CC_USE_FLOAT_OUTPUT
        this.addPass(new ForwardTransparencyPass());

        // user post-processing
        this.addPass(new DofPass());
        this.addPass(new TAAPass());
        this.addPass(new FxaaPass());
        this.addPass(new ColorGradingPass());
        this.addPass(new BlitScreenPass());
        this.addPass(new BloomPass());

        // final output
        this.addPass(new FSRPass()); // fsr should be final
        this.addPass(new PostFinalPass());
    }

    getPass (passClass: typeof BasePass, pipelineName = 'forward'): BasePass | undefined {
        const pp = this.pipelines.get(pipelineName);
        return pp && pp.find((p): boolean => p instanceof passClass);
    }
    addPass (pass: BasePass, pipelineName = 'forward'): void {
        let pp = this.pipelines.get(pipelineName);
        if (!pp) {
            pp = [];
            this.pipelines.set(pipelineName, pp);
        }

        const oldIdx = pp.findIndex((p): boolean => p.name === pass.name);
        if (oldIdx !== -1) {
            pp.splice(oldIdx, 1);
        }
        pp.push(pass);
    }
    insertPass (pass: BasePass, passClass: typeof BasePass, pipelineName = 'forward'): void {
        const pp = this.pipelines.get(pipelineName);
        if (pp) {
            const oldIdx = pp.findIndex((p): boolean => p.name === pass.name);
            if (oldIdx !== -1) {
                pp.splice(oldIdx, 1);
            }

            const idx = pp.findIndex((p): boolean => p instanceof passClass);
            if (idx !== -1) {
                pp.splice(idx + 1, 0, pass);
            }
        }
    }

    private initEditor (): void {
        director.root!.cameraList.forEach((cam): void => {
            if (cam.name === 'Editor Camera') {
                cam.usePostProcess = cam.projectionType === CameraProjection.PERSPECTIVE;
            }
        });
    }
    private applyPreviewCamera (camera: Camera): void {
        if (!camera.node.parent) return;
        const camComp = camera.node.parent.getComponent(CameraComponent);
        const oriCamera = camComp && camComp.camera;
        if (oriCamera) {
            camera.postProcess = oriCamera.postProcess;
            camera.usePostProcess = oriCamera.usePostProcess;
        }
    }

    private resortEditorCameras (cameras: Camera[]): Camera[] {
        const newCameras: Camera[] = [];
        for (let i = 0; i < cameras.length; i++) {
            const c = cameras[i];
            if (c.name === 'Editor Camera'
            || c.name === 'Editor UIGizmoCamera'
            || c.name === 'Scene Gizmo Camera') {
                newCameras.push(c);
            }
        }
        for (let i = 0; i < cameras.length; i++) {
            const c = cameras[i];
            if (newCameras.indexOf(c) === -1) {
                newCameras.push(c);
            }
        }
        return newCameras;
    }

    setup (cameras: Camera[], ppl: Pipeline): void {
        if (EDITOR) {
            this.initEditor();
            cameras = this.resortEditorCameras(cameras);
        }

        passContext.ppl = ppl;
        passContext.shadowPass = undefined;
        passContext.forwardPass = undefined;
        passContext.depthSlotName = '';
        passContext.isFinalCamera = false;
        passContext.isFinalPass = false;

        let globalPP: PostProcess | undefined;
        for (let i = 0; i < PostProcess.all.length; i++) {
            const pp = PostProcess.all[i];
            if (pp.global) {
                globalPP = pp;
            }
        }

        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (!camera.scene) {
                continue;
            }
            ppl.update(camera);
            if (i === (cameras.length - 1)) {
                passContext.isFinalCamera = true;
            }

            if (EDITOR && camera.cameraUsage === CameraUsage.PREVIEW) {
                this.applyPreviewCamera(camera);
            }

            ppl.addBuiltinReflectionProbePass(camera);

            passContext.postProcess = camera.postProcess || globalPP;

            director.root!.pipelineEvent.emit(PipelineEventType.RENDER_CAMERA_BEGIN, camera);

            this.renderCamera(camera, ppl);
        }
    }

    getCameraPipelineName (camera: Camera): string {
        let pipelineName = camera.pipeline;
        if (!pipelineName && camera.usePostProcess) {
            pipelineName = 'forward';
        } else {
            pipelineName = 'default';
        }
        return pipelineName;
    }

    getCameraPasses (camera: Camera): BasePass[] {
        const pipelineName = this.getCameraPipelineName(camera);
        return this.pipelines.get(pipelineName) || [];
    }

    renderCamera (camera: Camera, ppl: Pipeline): void {
        passContext.passPathName = `${getCameraUniqueID(camera)}`;
        passContext.camera = camera;
        passContext.updateViewPort();

        const passes = this.getCameraPasses(camera);

        const taaPass = passes.find((p): boolean => p instanceof TAAPass) as TAAPass;
        if (taaPass && taaPass.checkEnable(camera)) {
            taaPass.applyCameraJitter(camera);
            taaPass.updateSample();
        }

        const floatOutputPass = passes.find((p): boolean => p instanceof FloatOutputProcessPass) as FloatOutputProcessPass;

        let lastPass: BasePass | undefined;
        for (let i = 0; i < passes.length; i++) {
            const pass = passes[i];
            if (!pass.checkEnable(camera)) {
                continue;
            }

            if (i === (passes.length - 1)) {
                passContext.isFinalPass = true;
            }

            if (pass.name === 'BloomPass') {
                // for override post-process builder
                (pass as BloomPass).hdrInputName = (floatOutputPass === undefined || floatOutputPass === null)
                    ? '' :  floatOutputPass.getHDRInputName();
            }

            pass.lastPass = lastPass;
            pass.render(camera, ppl);

            lastPass = pass;
        }
    }
}
