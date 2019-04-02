import { CameraComponent } from '../3d';
import { UITransformComponent } from '../3d/ui/components/ui-transfrom-component';
import { Vec3 } from '../core';
import { Node } from '../scene-graph';

const _temp_vec3_1 = new Vec3();

/**
 * !#en
 * Conversion of non-UI nodes to UI Node (Local) Space coordinate system.
 * !#zh
 * 非 UI 节点转换到 UI 节点(局部) 空间坐标系
 * @method convertToNodeSpaceAR
 * @param {CameraComponent} mainCamera
 * @param {Vec3} wpos
 * @param {Node} uiNode
 * @return {Vec3}
 */
export function WorldNode3DToLocalNodeUI (mainCamera: CameraComponent, wpos: Vec3, uiNode: Node, out?: Vec3) {
    if (!out) {
        out = new Vec3();
    }

    mainCamera.worldToScreen(wpos, _temp_vec3_1);
    _temp_vec3_1.x = _temp_vec3_1.x / cc.view.getScaleX();
    _temp_vec3_1.y = _temp_vec3_1.y / cc.view.getScaleY();
    const cmp = uiNode.getComponent(UITransformComponent);

    if (!cmp){
        return out;
    }

    cmp.convertToNodeSpaceAR(_temp_vec3_1, out);
    const targetPos = uiNode.getPosition();
    out.addSelf(targetPos);

    return out;
}

export function WorldNode3DToWorldNodeUI (mainCamera: CameraComponent, wpos: Vec3, out?: Vec3){
    if (!out) {
        out = new Vec3();
    }

    mainCamera.worldToScreen(wpos, out);
    out.x = out.x / cc.view.getScaleX();
    out.y = out.y / cc.view.getScaleY();
    return out;
}

cc.pipelineUtils = {
    WorldNode3DToLocalNodeUI,
    WorldNode3DToWorldNodeUI,
};
