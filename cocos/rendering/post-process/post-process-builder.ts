import { EDITOR } from 'internal:constants';

import { Camera } from '../../render-scene/scene';
import { PipelineBuilder, Pipeline } from '../custom/pipeline';

import { passUtils } from './utils/pass-utils';
import { passContext } from './utils/pass-context';
import { ForwardFinalPass } from './passes/forward-final-pass';
import { getCameraUniqueID } from '../custom/define';

import { BasePass } from './passes/base-pass';
import { ForwardPass } from './passes/forward-pass';
import { TAAPass } from './passes/taa-pass';
import { FSRPass } from './passes/fsr-pass';
import { BlitScreenPass } from './passes/blit-screen-pass';

import './components/taa';
import './components/fsr';
import './components/blit-screen';

import { PostProcess } from './components/post-process';
import { Node } from '../../scene-graph';
import { director } from '../../game';
import { CCObject } from '../../core';

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
        this.addPass(new BlitScreenPass());
        this.addPass(new ForwardFinalPass());
    }

    addPass (pass: BasePass) {
        this.passes.push(pass);
    }
    insertPass (pass: BasePass, prePassName: string) {
        const idx = this.passes.findIndex((p) => p.name === prePassName);
        if (idx !== -1) {
            this.passes.splice(idx + 1, 0, pass);
        }
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

    setup (cameras: Camera[], ppl: Pipeline) {
        if (EDITOR) {
            this.initEditor();
        }

        passContext.renderProfiler = false;
        passUtils.ppl = ppl;

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

            passUtils.camera = camera;
            this.renderCamera(camera, ppl);
        }
    }

    renderCamera (camera: Camera, ppl: Pipeline) {
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
