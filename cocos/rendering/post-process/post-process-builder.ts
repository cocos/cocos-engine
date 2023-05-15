import { EDITOR } from 'internal:constants';

import { Camera, CameraUsage } from '../../render-scene/scene';
import { PipelineBuilder, Pipeline } from '../custom/pipeline';

import { passContext } from './utils/pass-context';
import { ForwardFinalPass } from './passes/forward-final-pass';
import { getCameraUniqueID } from '../custom/define';

import { BasePass } from './passes/base-pass';
import { ForwardPass } from './passes/forward-pass';
import { TAAPass } from './passes/taa-pass';
import { FSRPass } from './passes/fsr-pass';
import { BlitScreenPass } from './passes/blit-screen-pass';

import { ShadowPass } from './passes/shadow-pass';
import { HBAOPass } from './passes/hbao-pass';
import { PostProcess } from './components/post-process';
import { Node } from '../../scene-graph';
import { director } from '../../game';
import { CCObject } from '../../core';
import { setCustomPipeline } from '../custom';

import { CameraComponent } from '../../misc';
import { BloomPass, ColorGradingPass, FxaaPass } from './passes';

export class PostProcessBuilder implements PipelineBuilder  {
    pipelines: Map<string, BasePass[]> = new Map();
    constructor () {
        this.init();
    }

    init () {
        const forward = new ForwardPass();
        const forwardFinal = new ForwardFinalPass();

        // default pipeline
        this.addPass(forward, 'default');
        this.addPass(forwardFinal, 'default');

        // forward pipeline
        this.addPass(new ShadowPass());
        this.addPass(forward);

        this.addPass(new HBAOPass());
        this.addPass(new TAAPass());
        this.addPass(new FxaaPass());
        this.addPass(new ColorGradingPass());
        this.addPass(new BlitScreenPass());
        this.addPass(new BloomPass());

        this.addPass(new FSRPass()); // fsr should be final
        this.addPass(forwardFinal);
    }

    getPass (passClass: typeof BasePass, pipelineName = 'forward') {
        const pp = this.pipelines.get(pipelineName);
        return pp && pp.find((p) => p instanceof passClass);
    }
    addPass (pass: BasePass, pipelineName = 'forward') {
        let pp = this.pipelines.get(pipelineName);
        if (!pp) {
            pp = [];
            this.pipelines.set(pipelineName, pp);
        }
        pp.push(pass);
    }
    insertPass (pass: BasePass, passClass: typeof BasePass, pipelineName = 'forward') {
        const pp = this.pipelines.get(pipelineName);
        if (pp) {
            const idx = pp.findIndex((p) => p instanceof passClass);
            if (idx !== -1) {
                pp.splice(idx + 1, 0, pass);
            }
        }
    }

    private initEditor () {
        director.root!.cameraList.forEach((cam) => {
            if (cam.name === 'Editor Camera') {
                cam.usePostProcess = true;
            }
        });
    }
    private applyPreviewCamera (camera: Camera) {
        if (!camera.node.parent) return;
        const camComp = camera.node.parent.getComponent(CameraComponent);
        const oriCamera = camComp && camComp.camera;
        if (oriCamera) {
            camera.postProcess = oriCamera.postProcess;
            camera.usePostProcess = oriCamera.usePostProcess;
        }
    }

    setup (cameras: Camera[], ppl: Pipeline) {
        if (EDITOR) {
            this.initEditor();
        }

        passContext.ppl = ppl;
        passContext.renderProfiler = false;
        passContext.shadowPass = undefined;
        passContext.forwardPass = undefined;

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

            passContext.postProcess = camera.postProcess || globalPP;
            this.renderCamera(camera, ppl);
        }
    }

    getCameraPipelineName (camera: Camera) {
        let pipelineName = camera.pipeline;
        if (!pipelineName && camera.usePostProcess) {
            pipelineName = 'forward';
        } else {
            pipelineName = 'default';
        }
        return pipelineName;
    }

    getCameraPasses (camera: Camera) {
        const pipelineName = this.getCameraPipelineName(camera);
        return this.pipelines.get(pipelineName) || [];
    }

    renderCamera (camera: Camera, ppl: Pipeline) {
        passContext.passPathName = `${getCameraUniqueID(camera)}`;
        passContext.camera = camera;
        passContext.updateViewPort();

        const passes = this.getCameraPasses(camera);

        const taaPass = passes.find((p) => p instanceof TAAPass) as TAAPass;
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

setCustomPipeline('PostProcess', new PostProcessBuilder());
