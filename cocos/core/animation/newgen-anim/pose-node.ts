import { ccclass, serializable } from 'cc.decorator';
import { Pose } from './pose';
import { GraphNode, InteractiveGraphNode } from './graph-node';
import { BindableNumber } from './parametric';
import { PoseNodeEval } from './graph-eval';

@ccclass('cc.animation.PoseNode')
export class PoseNode extends InteractiveGraphNode {
    @serializable
    public pose: Pose | null = null;

    @serializable
    public startRatio = new BindableNumber();

    @serializable
    public speed = new BindableNumber(1.0);

    @serializable
    public loop = true;
}
