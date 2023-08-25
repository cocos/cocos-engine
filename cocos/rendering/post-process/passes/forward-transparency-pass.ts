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

import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { LightInfo, QueueHint, SceneFlags } from '../../custom/types';
import { getCameraUniqueID } from '../../custom/define';
import { Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { BasePass, getRTFormatBeforeToneMapping, getShadowMapSampler } from './base-pass';
import { ShadowPass } from './shadow-pass';

export class ForwardTransparencyPass extends BasePass {
    name = 'ForwardTransparencyPass';

    enableInAllEditorCamera = true;
    depthBufferShadingScale = 1;

    slotName (camera: Camera, index = 0): string {
        return this.lastPass!.slotName(camera, index);
    }

    public render (camera: Camera, ppl: Pipeline): void {
        passContext.clearFlag = ClearFlagBit.NONE;

        const output = this.lastPass!.slotName(camera, 0);
        const outputDS = passContext.depthSlotName;

        const cameraID = getCameraUniqueID(camera);
        const isOffScreen = true;
        passContext
            .updatePassViewPort()
            .addRenderPass('default', `${this.name}_${cameraID}`)
            .addRasterView(output, getRTFormatBeforeToneMapping(ppl), isOffScreen)
            .addRasterView(outputDS, Format.DEPTH_STENCIL, isOffScreen)
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

        pass.addQueue(QueueHint.RENDER_TRANSPARENT)
            .addSceneOfCamera(
                camera,
                new LightInfo(),
                SceneFlags.UI | SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY,
            );
    }
}
