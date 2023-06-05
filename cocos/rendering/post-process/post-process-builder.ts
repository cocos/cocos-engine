import { EDITOR } from 'internal:constants';

import { Camera, CameraUsage } from '../../render-scene/scene';
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
import { setCustomPipeline } from '../custom';

import { CameraComponent } from '../../misc';
import { BloomPass, ColorGradingPass, ForwardTransparencyPass, ForwardTransparencySimplePass, FxaaPass, SkinPass, ToneMappingPass } from './passes';

export class PostProcessBuilder implements PipelineBuilder  {
    pipelines: Map<string, BasePass[]> = new Map();
    constructor () {
        this.init();
    }

    init (): void {
        const forward = new ForwardPass();
        const forwardFinal = new ForwardFinalPass();

        // default pipeline
        this.addPass(forward, 'default');
        this.addPass(new ForwardTransparencySimplePass(), 'default');
        this.addPass(forwardFinal, 'default');

        // rendering dependent data generation
        this.addPass(new ShadowPass());

        // forward pipeline
        this.addPass(forward);
        this.addPass(new SkinPass());
        this.addPass(new ForwardTransparencyPass());

        // pipeline related
        this.addPass(new HBAOPass());
        this.addPass(new ToneMappingPass());

        // user post-processing
        this.addPass(new TAAPass());
        this.addPass(new FxaaPass());
        this.addPass(new ColorGradingPass());
        this.addPass(new BlitScreenPass());
        this.addPass(new BloomPass());

        // final output
        this.addPass(new FSRPass()); // fsr should be final
        this.addPass(forwardFinal);
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
                cam.usePostProcess = true;
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

    setup (cameras: Camera[], ppl: Pipeline): void {
        if (EDITOR) {
            this.initEditor();
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

            if (i === (cameras.length - 1)) {
                passContext.isFinalCamera = true;
            }

            if (EDITOR && camera.cameraUsage === CameraUsage.PREVIEW) {
                this.applyPreviewCamera(camera);
            }

            buildReflectionProbePasss(camera, ppl);

            passContext.postProcess = camera.postProcess || globalPP;
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

        let lastPass: BasePass | undefined;
        for (let i = 0; i < passes.length; i++) {
            const pass = passes[i];
            if (!pass.checkEnable(camera)) {
                continue;
            }

            if (i === (passes.length - 1)) {
                passContext.isFinalPass = true;
            }

            pass.lastPass = lastPass;
            pass.render(camera, ppl);

            lastPass = pass;
        }
    }
}

setCustomPipeline('Custom', new PostProcessBuilder());
