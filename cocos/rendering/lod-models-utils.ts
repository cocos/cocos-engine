/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { EDITOR } from 'internal:constants';
import { Model } from '../render-scene/scene/model';
import { LODGroup } from '../render-scene/scene/lod-group';
import { Camera } from '../render-scene/scene/camera';

// LOD所有级别中存储的model集合；包含多个LODGroup的所有LOD
const modelsInAnyLODGroup = new Map<Model, boolean>();
// 指定相机下，某一级LOD使用的model集合；可能包含多个LODGroup的某一级LOD
const visibleModelsByAnyLODGroup = new Map<Model, boolean>();

/**
 * Insert visible LOD models into visibleModelsByAnyLODGroup, Add all models on lodGroups to modelsInAnyLODGroup
 */
export function updateCachedLODModels (lodGroups: LODGroup[], camera: Camera) {
    modelsInAnyLODGroup.clear();
    visibleModelsByAnyLODGroup.clear();
    // eslint-disable-next-line no-lone-blocks
    for (const lodGroup of lodGroups) {
        if (lodGroup.enabled) {
            if (EDITOR) {
                const LODLevels = lodGroup.getLockLODLevels();
                const count = LODLevels.length;
                if (count > 0) {
                    for (let index = 0; index < lodGroup.lodCount; index++) {
                        const lod = lodGroup.LODs[index];
                        for (const model of lod.models) {
                            for (let i = 0; i < count; i++) {
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

export function isLODModelCulled (model: Model) {
    return modelsInAnyLODGroup.get(model) && !visibleModelsByAnyLODGroup.get(model);
}
