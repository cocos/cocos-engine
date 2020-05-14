/**
 * @category pipeline
 */

import { CameraComponent } from '../3d/framework/camera-component';
import { Vec3 } from '../math';
import { Node } from '../scene-graph';
import { replaceProperty } from './deprecated';
import { legacyCC } from '../global-exports';

const _vec3 = new Vec3();

/**
 * @en
 * Conversion of non-UI nodes to UI Node (Local) Space coordinate system.
 * @zh
 * 非 UI 节点转换到 UI 节点(局部) 空间坐标系。
 * @deprecated 将在 1.2 移除，请使用 CameraComponent 的 `convertToUINode`。
 * @param mainCamera 主相机。
 * @param wpos 世界空间位置。
 * @param uiNode UI节点。
 * @param out 返回局部坐标。
 */
export function WorldNode3DToLocalNodeUI (mainCamera: CameraComponent, wpos: Vec3, uiNode: Node, out?: Vec3) {
    if (!out) {
        out = new Vec3();
    }

    mainCamera.convertToUINode(wpos, uiNode, out);
    const pos = uiNode.position;
    out.add(pos);
    return out;
}

/**
 * @en
 * Conversion of non-UI nodes to UI Node (World) Space coordinate system.
 * @zh
 * 非 UI 节点转换到 UI 节点(世界) 空间坐标系。
 * @deprecated 将在 1.2 移除，请使用 CameraComponent 的 `convertToUINode`。
 * @param mainCamera 主相机。
 * @param wpos 世界空间位置。
 * @param out 返回世界坐标。
 */
export function WorldNode3DToWorldNodeUI (mainCamera: CameraComponent, wpos: Vec3, out?: Vec3){
    if (!out) {
        out = new Vec3();
    }

    mainCamera.worldToScreen(wpos, out);
    out.x = out.x / legacyCC.view.getScaleX();
    out.y = out.y / legacyCC.view.getScaleY();
    return out;
}

/**
 * @deprecated 将在 1.2 移除，请使用 CameraComponent 的 `convertToUINode`。
 */
const convertUtils = {
    WorldNode3DToLocalNodeUI,
    WorldNode3DToWorldNodeUI,
};

export { convertUtils };
legacyCC.pipelineUtils = convertUtils;

replaceProperty(legacyCC.pipelineUtils, 'cc.pipelineUtils', [
    {
        'name': 'WorldNode3DToLocalNodeUI',
        'newName': 'convertToUINode',
        'targetName': 'cc.CameraComponent.prototype',
        'customFunction': function (...args: any[]) {
            const camera = args[0] as CameraComponent;
            const out = args[3] || _vec3;
            camera.convertToUINode(args[1], args[2], out);
            out.add(args[2].position);
            return args[3] || out.clone();
        },
    },
]);
