import { ccclass, menu, serializable, type, visible } from '../data/decorators';
import { Component } from '../components/component';
import { Prefab } from '../assets/prefab';

/**
 * @en
 * Since the new Prefab system is not yet complete, the prefab that has a large difference with prefab asset cannot be automatically migrated.
 * This component is used to save the relationship between the node with the referenced prefab asset in the old Prefab system.
 * When the new Prefab system is complete, it will be automatically migrated to the new Prefab system.
 *
 * @zh
 * PrefabLink
 * 由于新的 Prefab 系统还不完善，所以旧的 Prefab 系统中和 Prefab 资源差异过大的 Prefab 无法实现自动迁移。
 * 此组件用于保存在旧 Prefab 系统中这个节点关联的 Prefab 资源，等新的 Prefab 系统完善，会自动迁移到新的 Prefab 系统上。
 */
@ccclass('cc.PrefabLink')
export class PrefabLink extends Component {
    @type(Prefab)
    @serializable
    @visible(true)
    public prefab: Prefab | null = null;
}
