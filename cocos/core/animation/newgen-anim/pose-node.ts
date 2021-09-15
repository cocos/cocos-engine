import { ccclass, serializable } from 'cc.decorator';
import { Pose } from './pose';
import { GraphNode, InteractiveGraphNode } from './graph-node';
import { parametric, parametricNum } from './parametric';
import { PoseNodeEval } from './graph-eval';

@ccclass('cc.animation.PoseNode')
export class PoseNode extends InteractiveGraphNode {
    @serializable
    public pose: Pose | null = null;

    @serializable
    @parametricNum<[PoseNodeEval]>({
        notify: (value, poseNodeEval) => {
            poseNodeEval.startRatio = value;
        },
    })
    public startRatio = 0.0;

    @serializable
    @parametricNum<[PoseNodeEval]>({
        notify: (value, poseNodeEval) => {
            poseNodeEval.speed = value;
        },
    })
    public speed = 1.0;

    @serializable
    public loop = true;
}
