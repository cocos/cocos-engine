import { EDITOR } from 'internal:constants';

import { Camera } from '../../render-scene/scene';
import { PipelineBuilder, Pipeline } from '../custom/pipeline';

import { passContext } from './utils/pass-context';
import { ForwardFinalPass } from './passes/forward-final-pass';
import { getCameraUniqueID } from '../custom/define';

import { BasePass } from './passes/base-pass';
import { ForwardPass } from './passes/forward-pass';
import { TAAPass } from './passes/taa-pass';
import { FSRPass } from './passes/fsr-pass';
import { BlitScreenPass } from './passes/blit-screen-pass';
import { ColorGradingPass } from './passes/color-grading-pass';

import { PostProcess } from './components/post-process';
import { Node } from '../../scene-graph';
import { director } from '../../game';
import { CCObject } from '../../core';
import { setCustomPipeline } from '../custom';

export class PostProcessBuilder implements PipelineBuilder  {
    passes: BasePass[] = [];

    constructor () {
        this.init();
    }

    editorPostProcess: PostProcess | undefined;

    init () {
        this.addPass(new ForwardPass());
        this.addPass(new TAAPass());
        this.addPass(new FSRPass());
        this.addPass(new ColorGradingPass());
        this.addPass(new BlitScreenPass());
        this.addPass(new ForwardFinalPass());
    }

    initEditor () {
        if (this.editorPostProcess) {
            return;
        }

        const node = new Node('editor-post-process');
        node.hideFlags = CCObject.Flags.DontSave | CCObject.Flags.HideInHierarchy;

        const pp = node.addComponent(PostProcess);
        pp.global = false;

        node.parent = director.getScene();
        director.addPersistRootNode(node);

        director.root!.cameraList.forEach((cam) => {
            if (cam.name === 'Scene Gizmo Camera' || cam.name === 'Editor UIGizmoCamera') {
                cam.postProcess = pp;
            }
        });

        this.editorPostProcess = pp;
    }

    getPass (passClass: typeof BasePass) {
        return this.passes.find((p) => p instanceof passClass);
    }
    addPass (pass: BasePass) {
        this.passes.push(pass);
    }
    insertPass (pass: BasePass, passClass: typeof BasePass) {
        const idx = this.passes.findIndex((p) => p instanceof passClass);
        if (idx !== -1) {
            this.passes.splice(idx + 1, 0, pass);
        }
    }

    setup (cameras: Camera[], ppl: Pipeline) {
        if (EDITOR) {
            this.initEditor();
        }

        passContext.ppl = ppl;
        passContext.renderProfiler = false;

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

            passContext.postProcess = camera.postProcess || globalPP;
            passContext.camera = camera;
            this.renderCamera(camera, ppl);
        }
    }

    enableSceneGizmoCamera = true;
    enableEditorUIGizmoCamera = true;

    renderCamera (camera: Camera, ppl: Pipeline) {
        if (EDITOR) {
            if ((camera.name === 'Scene Gizmo Camera' && !this.enableSceneGizmoCamera)
            || (camera.name === 'Editor UIGizmoCamera' && !this.enableEditorUIGizmoCamera)) {
                return;
            }
        }

        passContext.passPathName = `${getCameraUniqueID(camera)}`;

        const passes = this.passes;

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
