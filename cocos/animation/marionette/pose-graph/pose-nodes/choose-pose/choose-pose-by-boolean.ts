import { ccclass, serializable } from '../../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { input } from '../../decorator/input';
import { poseGraphNodeAppearance, poseGraphNodeCategory } from '../../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_CHOOSE } from './menu';
import { PoseNodeChoosePoseBase } from './choose-pose-base';
import { PoseGraphType } from '../../foundation/type-system';
import type { PoseNode } from '../../pose-node';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeChoosePoseByBoolean`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_CHOOSE)
@poseGraphNodeAppearance({ themeColor: '#D07979' })
export class PoseNodeChoosePoseByBoolean extends PoseNodeChoosePoseBase {
    constructor () {
        super(2);
    }

    @input({ type: PoseGraphType.POSE })
    public get truePose (): PoseNode | null {
        return this._poses[0];
    }
    public set truePose (value) {
        this._poses[0] = value;
    }

    @input({ type: PoseGraphType.POSE })
    public get falsePose (): PoseNode | null {
        return this._poses[1];
    }
    public set falsePose (value) {
        this._poses[1] = value;
    }

    @input({ type: PoseGraphType.FLOAT })
    public get trueFadeInDuration (): number {
        return this._fadeInDurations[0];
    }
    public set trueFadeInDuration (value) {
        this._fadeInDurations[0] = value;
    }

    @input({ type: PoseGraphType.FLOAT })
    public get falseFadeInDuration (): number {
        return this._fadeInDurations[1];
    }
    public set falseFadeInDuration (value) {
        this._fadeInDurations[1] = value;
    }

    @serializable
    @input({ type: PoseGraphType.BOOLEAN })
    public choice = true;

    protected getChosenIndex (): number {
        return this.choice ? 0 : 1;
    }
}
