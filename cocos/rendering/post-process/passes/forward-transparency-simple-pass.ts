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

import { Camera } from '../../../render-scene/scene';
import { LightInfo, QueueHint, SceneFlags } from '../../custom/types';
import { Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { BasePass } from './base-pass';
import { ForwardPass } from './forward-pass';

export class ForwardTransparencySimplePass extends BasePass {
    name = 'ForwardTransparencySimplePass';

    slotName (camera: Camera, index = 0): string {
        return (passContext.forwardPass as ForwardPass)!.slotName(camera, index);
    }

    public render (camera: Camera, ppl: Pipeline): void {
        const pass = passContext.pass!;
        pass.addQueue(QueueHint.RENDER_TRANSPARENT)
            .addSceneOfCamera(
                camera,
                new LightInfo(),
                SceneFlags.UI | SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY,
            );
    }
}
