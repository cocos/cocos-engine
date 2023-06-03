import { EDITOR } from 'internal:constants';
import { ccclass, serializable } from '../../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { input } from '../../decorator/input';
import { poseGraphNodeAppearance, poseGraphNodeCategory } from '../../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_CHOOSE } from './menu';
import { PoseNodeChoosePoseBase } from './choose-pose-base';
import { PoseGraphType } from '../../foundation/type-system';
import type { PoseNode } from '../../pose-node';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeChoosePoseByIndex`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_CHOOSE)
@poseGraphNodeAppearance({ themeColor: '#D07979' })
export class PoseNodeChoosePoseByIndex extends PoseNodeChoosePoseBase {
    @input({
        type: PoseGraphType.POSE,
        arraySyncGroup: 'choose-item',
    })
    get poses (): (PoseNode | null)[] {
        return this._poses;
    }

    set poses (value) {
        this._poses = value;
    }

    @input({
        type: PoseGraphType.FLOAT,
        arraySyncGroup: 'choose-item',
        arraySyncGroupFollower: true,
    })
    get fadeInDurations (): number[] {
        return this._fadeInDurations;
    }

    set fadeInDurations (value) {
        this._fadeInDurations = value;
    }

    @serializable
    @input({ type: PoseGraphType.INTEGER })
    public choice = 0;

    protected getChosenIndex (): number {
        return this.choice;
    }
}
