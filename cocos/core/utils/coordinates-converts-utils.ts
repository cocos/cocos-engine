/**
 * @category pipeline
 */

import { UITransformComponent } from '../components/ui-base/ui-transform-component';
import { CameraComponent } from '../3d/framework';
import { Vec3 } from '../math';
import { Node } from '../scene-graph';

const _temp_vec3_1 = new Vec3();

/**
 * @en
 * Conversion of non-UI nodes to UI Node (Local) Space coordinate system.
 * @zh
 * 非 UI 节点转换到 UI 节点(局部) 空间坐标系。
 * @param mainCamera 主相机。
 * @param wpos 世界空间位置。
 * @param uiNode UI节点。
 * @param out 返回局部坐标。
 */
export function WorldNode3DToLocalNodeUI (mainCamera: CameraComponent, wpos: Vec3, uiNode: Node, out?: Vec3) {
    if (!out) {
        out = new Vec3();
    }

    mainCamera.worldToScreen(wpos, _temp_vec3_1);
    _temp_vec3_1.x = _temp_vec3_1.x / cc.view.getScaleX();
    _temp_vec3_1.y = _temp_vec3_1.y / cc.view.getScaleY();
    const cmp = uiNode.getComponent('cc.UITransformComponent') as UITransformComponent;

    if (!cmp){
        return out;
    }

    cmp.convertToNodeSpaceAR(_temp_vec3_1, out);
    const targetPos = uiNode.getPosition();
    out.add(targetPos);

    return out;
}

/**
 * @en
 * Conversion of non-UI nodes to UI Node (World) Space coordinate system.
 * @zh
 * 非 UI 节点转换到 UI 节点(世界) 空间坐标系。
 * @param mainCamera 主相机。
 * @param wpos 世界空间位置。
 * @param out 返回世界坐标。
 */
export function WorldNode3DToWorldNodeUI (mainCamera: CameraComponent, wpos: Vec3, out?: Vec3){
    if (!out) {
        out = new Vec3();
    }

    mainCamera.worldToScreen(wpos, out);
    out.x = out.x / cc.view.getScaleX();
    out.y = out.y / cc.view.getScaleY();
    return out;
}

const convertUtils = {
    WorldNode3DToLocalNodeUI,
    WorldNode3DToWorldNodeUI,
};

export { convertUtils };
cc.pipelineUtils = convertUtils;
