/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Vec4, cclegacy } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera, FOG_TYPE_NONE } from '../../../render-scene/scene';
import { Pipeline } from '../../custom/pipeline';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { SettingPass } from './setting-pass';
import { Root } from '../../../root';

export class FloatOutputProcessPass extends SettingPass {
    name = 'FloatOutputProcessPass';
    effectName = 'pipeline/float-output-process';
    outputNames = ['FloatOutputProcess'];

    hdrInputName: string = '';

    enableInAllEditorCamera = true;
    enable = true;
    checkEnable (camera: Camera): boolean {
        const ppl = (cclegacy.director.root as Root).pipeline;
        return ppl.getMacroBool('CC_USE_FLOAT_OUTPUT');
    }
    getHDRInputName (): string { return this.hdrInputName; }

    onGlobalPipelineStateChanged (): void {
        passContext.material = this.material;
        const passes = passContext.material.passes;
        for (let i = 0; i < passes.length; i++) {
            const pass = passes[i];
            pass.beginChangeStatesSilently();
            pass.tryCompile(); // force update shaders
            pass.endChangeStatesSilently();
        }
    }
    needDepthInput (ppl: Pipeline): boolean {
        return ppl.pipelineSceneData.fog.type !== FOG_TYPE_NONE;
    }

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);
        passContext.material = this.material;

        let copyDS = '';
        let passIndx = 0;
        const inputDS = passContext.depthSlotName;
        if (this.needDepthInput(ppl)) {
            copyDS = 'floatOutputProcessCopyDS';
            // ==== Copy input DS ===
            const copyInputDSPassLayoutName = 'copy-pass';
            const copyInputDSPass = `floatOutputProcessCopyDS-pass${cameraID}`;
            passContext.updatePassViewPort()
                .addRenderPass(copyInputDSPassLayoutName, copyInputDSPass)
                .setClearFlag(ClearFlagBit.COLOR)
                .setClearColor(1.0, 0, 0, 0)
                .setPassInput(inputDS, 'depthRaw')
                .addRasterView(copyDS, Format.RGBA8)
                .blitScreen(passIndx)
                .version();
        }

        passIndx = 1;
        this.hdrInputName = this.lastPass!.slotName(camera, 0);
        const output = this.slotName(camera, 0);
        const layoutName = 'tone-mapping';
        const passName = `tone-mapping${cameraID}`;
        passContext.clearFlag = ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w);
        passContext.updatePassViewPort()
            .addRenderPass(layoutName, passName)
            .setPassInput(this.hdrInputName, 'u_texSampler')
            .setPassInput(copyDS, 'DepthTex')
            .addRasterView(output, Format.RGBA8)
            .blitScreen(passIndx)
            .version();
    }
}
