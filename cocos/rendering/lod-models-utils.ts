/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { Model } from '../render-scene/scene/model';
import { Camera } from '../render-scene/scene/camera';
import { RenderScene } from '../render-scene';

/**
 * @engineInternal
 * @zh LOD所有级别中存储的model集合；包含多个LODGroup的所有LOD
 * @en The collection of models stored in all levels of LOD, All LODs containing multiple LODGroups.
 */
const modelsInAnyLODGroup = new Map<Model, boolean>();
/**
 * @engineInternal
 * @zh 指定相机下，某一级LOD使用的model集合；可能包含多个LODGroup的某一级LOD
 * @en Specify the model set used by a level of LOD under the camera, LOD of a level that may contain multiple LODGroups.
 */
const visibleModelsByAnyLODGroup = new Map<Model, boolean>();

/**
 * @engineInternal
 */
export class LODModelsCachedUtils {
    /**
     * @en Insert visible LOD models into visibleModelsByAnyLODGroup, Add all models on lodGroups to modelsInAnyLODGroup
     */
    public static updateCachedLODModels (scene: RenderScene, camera: Camera) {
        // eslint-disable-next-line no-lone-blocks
        for (const lodGroup of scene.lodGroups) {
            if (lodGroup.enabled) {
                const LODLevels = lodGroup.getLockLODLevels();
                const count = LODLevels.length;
                //count == 0 will return to standard LOD processing.
                if (count > 0) {
                    for (let index = 0; index < lodGroup.lodCount; index++) {
                        const lod = lodGroup.LODs[index];
                        for (const model of lod.models) {
                            for (let i = 0; i < count; i++) {
                                // The LOD level to use.
                                if (LODLevels[i] === index) {
                                    if (model && model.node.active) {
                                        visibleModelsByAnyLODGroup.set(model, true);
                                        break;
                                    }
                                }
                            }
                            modelsInAnyLODGroup.set(model, true);
                        }
                    }
                    continue;
                }

                const visIndex = lodGroup.getVisibleLOD(camera);
                for (let index = 0; index < lodGroup.lodCount; index++) {
                    const lod = lodGroup.LODs[index];
                    for (const model of lod.models) {
                        if (visIndex === index && model && model.node.active) {
                            visibleModelsByAnyLODGroup.set(model, true);
                        }
                        modelsInAnyLODGroup.set(model, true);
                    }
                }
            }
        }
    }

    public static isLODModelCulled (model: Model) {
        return modelsInAnyLODGroup.get(model) && !visibleModelsByAnyLODGroup.get(model);
    }

    public static clearCachedLODModels () {
        modelsInAnyLODGroup.clear();
        visibleModelsByAnyLODGroup.clear();
    }
}
