/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { cclegacy, Enum } from '../../core';
import { PostProcessInfo } from '../../scene-graph';

/**
 * @zh ToneMapping类型。
 * @en The tone mapping type.
 * @static
 * @enum PostProcess.ToneMapping
 */
export const ToneMappingType = Enum({
    /**
     * @zh Tone Mapping 类型：ACES。
     * @en CC_TONE_MAPPING_TYPE: ACES
     * @readonly
     */
    Default: 0,

    /**
     * @zh Tone Mapping 类型：LINEAR。
     * @en CC_TONE_MAPPING_TYPE：LINEAR.
     * @readonly
     */
    Linear: 1,
});

/**
 * @en Global skin in the render scene.
 * The initial data is setup in [[SceneGlobals.skip]].
 * @zh 渲染场景中的全局皮肤后处理设置。
 * 初始值是由 [[SceneGlobals.skin]] 设置的。
 */
export class PostProcess {
    /**
     * @en Getter/Setter sampler width.
     * @zh 设置或者获取采样宽度。
     */
    set toneMappingType (val: number) {
        this._toneMappingType = val;
    }
    get toneMappingType (): number {
        return this._toneMappingType;
    }

    protected _toneMappingType = ToneMappingType.Default;

    public initialize (postProcessInfo: PostProcessInfo) {
        this._toneMappingType = postProcessInfo.toneMappingType;
    }
}

cclegacy.PostProcess = PostProcess;
