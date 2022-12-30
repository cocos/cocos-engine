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

import { SkinnedMeshRenderer } from './skinned-mesh-renderer';
import { SkinnedMeshBatchRenderer, SkinnedMeshUnit } from './skinned-mesh-batch-renderer';
import { js, cclegacy } from '../../core';
/**
 * Alias of [[SkinnedMeshRenderer]]
 * @deprecated Since v1.2
 */
export { SkinnedMeshRenderer as SkinningModelComponent };
cclegacy.SkinningModelComponent = SkinnedMeshRenderer;
js.setClassAlias(SkinnedMeshRenderer, 'cc.SkinningModelComponent');
/**
 * Alias of [[SkinnedMeshUnit]]
 * @deprecated Since v1.2
 */
export { SkinnedMeshUnit as SkinningModelUnit };
cclegacy.SkinningModelUnit = SkinnedMeshUnit;
js.setClassAlias(SkinnedMeshUnit, 'cc.SkinningModelUnit');
/**
 * Alias of [[SkinnedMeshBatchRenderer]]
 * @deprecated Since v1.2
 */
export { SkinnedMeshBatchRenderer as BatchedSkinningModelComponent };
cclegacy.BatchedSkinningModelComponent = SkinnedMeshBatchRenderer;
js.setClassAlias(SkinnedMeshBatchRenderer, 'cc.BatchedSkinningModelComponent');
