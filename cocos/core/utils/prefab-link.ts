import {ccclass, menu, serializable, type, visible} from "../data/decorators";
import { Component } from "../components";
import Prefab from "../assets/prefab";

/**
 * PrefabLink
 * 由于新的Prefab系统还不完善，所以旧的Prefab系统中和Prefab资源差异过大的Prefab无法实现自动迁移。
 * 此组件用于保存在旧Prefab系统中这个节点关联的Prefab资源，等新的Prefab系统完善，会自动迁移到新的Prefab系统上。
 *
 * Since the new Prefab system is not yet complete, the prefab that has a large difference with prefab asset cannot be automatically migrated.
 * This component is used to save the relationship between the node with the referenced prefab asset in the old Prefab system.
 * When the new Prefab system is complete, it will be automatically migrated to the new Prefab system.
 */
@ccclass('cc.PrefabLink')
@menu('Components/PrefabLink')
export class PrefabLink extends Component {
    @type(Prefab)
    @serializable
    @visible(true)
    public prefab: Prefab | null = null;
}
