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
import { LODGroup } from '../render-scene/scene/lod-group';
import { RenderScene } from '../render-scene';
import { NodeEventType } from '../scene-graph/node-event';
import { Node } from '../scene-graph/node';

class LODInfo {
    public visibleLevel = -1;
    public needUpdate = true;
}
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
const visibleModelsByAnyLODGroup = new Map<Camera, Map<Model, boolean>>();
/**
 * @zh 指定相机下，某个LODGroup的当前状态，如：当前使用哪级的LOD，是否需要更新等
 * @en Specify the current status of a LODGroup under the camera, such as: which level of LOD is currently in use, whether it needs to be updated.
 */
const lodGroupStateMap = new Map<Camera, Map<LODGroup, LODInfo>>();
/**
 * @zh 指定相机的状态是否出现变化, 这里主要记录transform是否出现变化
 * @en Specify whether the state of the camera has changed or not, here it is mainly recorded whether the transform has changed or not.
 */
const cameraStateMap = new Map<Camera, boolean>();

function onCameraTransformChanged (this: Camera) {
    cameraStateMap.set(this, true);
}

function onNodeTransformChanged (this: LODGroup) {
    lodGroupStateMap.forEach((value, key) => {
        const info = value.get(this);
        if (info) {
            info.needUpdate = true;
        }
    });
}

export class LODModelsCachedUtils {
    /**
     * @en Insert visible LOD models into visibleModelsByAnyLODGroup, Add all models on lodGroups to modelsInAnyLODGroup
     */
    public static updateCachedLODModels (scene: RenderScene, camera: Camera) {
        let isCameraTransformChanged = cameraStateMap.get(camera);
        if (isCameraTransformChanged === undefined) {
            isCameraTransformChanged = true;
            camera.node.on(NodeEventType.TRANSFORM_CHANGED, onCameraTransformChanged, camera);
        }
        let visibleModels = visibleModelsByAnyLODGroup.get(camera);
        if (visibleModels === undefined) {
            visibleModels = new Map<Model, boolean>();
            visibleModelsByAnyLODGroup.set(camera, visibleModels);
        }
        let lodInfoMap = lodGroupStateMap.get(camera);
        if (lodInfoMap === undefined) {
            lodInfoMap = new Map<LODGroup, LODInfo>();
            lodGroupStateMap.set(camera, lodInfoMap);
        }

        // eslint-disable-next-line no-lone-blocks
        for (const lodGroup of scene.lodGroups) {
            if (lodGroup.enabled) {
                let lodInfo = lodInfoMap.get(lodGroup);
                if (!lodInfo) {
                    lodInfo = new LODInfo();
                    lodInfoMap.set(lodGroup, lodInfo);
                    lodGroup.node.on(NodeEventType.TRANSFORM_CHANGED, onNodeTransformChanged, lodGroup);
                }

                const LODLevels = lodGroup.getLockedLODLevels();
                const count = LODLevels.length;
                //count == 0 will return to standard LOD processing.
                if (count > 0) {
                    lodInfo.needUpdate = true;
                    lodInfo.visibleLevel = -1;

                    for (let index = 0; index < lodGroup.lodCount; index++) {
                        const lod = lodGroup.lodDataArray[index];
                        for (const model of lod.models) {
                            for (let i = 0; i < count; i++) {
                                // The LOD level to use.
                                if (LODLevels[i] === index) {
                                    if (model && model.node && model.node.active) {
                                        visibleModels.set(model, true);
                                        break;
                                    }
                                } else {
                                    visibleModels.set(model, false);
                                }
                            }
                            modelsInAnyLODGroup.set(model, true);
                        }
                    }
                    continue;
                }

                if (isCameraTransformChanged || lodInfo.needUpdate) {
                    const visIndex = lodGroup.getVisibleLODLevel(camera);
                    if (visIndex === lodInfo.visibleLevel && visIndex !== -1) {
                        continue;//do nothing
                    } else if (visIndex !== lodInfo.visibleLevel) {
                        lodInfo.visibleLevel = visIndex;

                        for (let index = 0; index < lodGroup.lodCount; index++) {
                            const lod = lodGroup.lodDataArray[index];
                            for (const model of lod.models) {
                                if (visIndex === index && model && model.node && model.node.active) {
                                    visibleModels.set(model, true);
                                } else {
                                    visibleModels.set(model, false);
                                }
                                modelsInAnyLODGroup.set(model, true);
                            }
                        }
                    }
                }
            }
        }
        if (isCameraTransformChanged) {
            cameraStateMap.set(camera, false);
        }
    }

    public static isLODModelCulled (camera: Camera, model: Model) {
        const models = visibleModelsByAnyLODGroup.get(camera);
        return modelsInAnyLODGroup.get(model) && !models?.get(model);
    }

    public static clearCachedLODModels () {
        cameraStateMap.forEach((value, camera) => {
            if (camera.node) { // preview's camera maybe detached from scene
                camera.node.off(NodeEventType.TRANSFORM_CHANGED, onCameraTransformChanged);
            }
        });
        cameraStateMap.clear();
        lodGroupStateMap.forEach((lodInfos, key) => {
            lodInfos.forEach((info, lodGroup) => {
                lodGroup.node.off(NodeEventType.TRANSFORM_CHANGED, onNodeTransformChanged);
            });
        });
        lodGroupStateMap.clear();
        modelsInAnyLODGroup.clear();
        visibleModelsByAnyLODGroup.clear();
    }
}
