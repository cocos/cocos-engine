import { VarInstance } from '../variable';
import { PoseGraphNode } from './foundation/pose-graph-node';
import { PoseGraphType } from './foundation/type-system';

type Outputs = unknown[];

/**
 * Base class of all pure value nodes in pose graph.
 *
 * Pure value nodes are nodes in pose graph that yields non-pose-object value(s).
 *
 * Sometimes, pure values nodes are also abbreviated as pv nodes.
 */
export abstract class PureValueNode extends PoseGraphNode {
    constructor (outputTypes: readonly PoseGraphType[]) {
        super();
        this._outputTypes = outputTypes;
    }

    get outputCount (): number {
        return this._outputTypes.length;
    }

    public getOutputType (outputIndex: number):PoseGraphType {
        return this._outputTypes[outputIndex];
    }

    public link (context: PureValueNodeLinkContext): void {
    }

    private _outputTypes: readonly PoseGraphType[] = [];

    public abstract selfEvaluate(outputs: Outputs): void;
}

export abstract class SingleOutputPVNode<TValue = unknown> extends PureValueNode {
    constructor (outputType: PoseGraphType) {
        super([outputType]);
    }

    public selfEvaluate (outputs: Outputs): void {
        outputs[0] = this.selfEvaluateDefaultOutput();
    }

    protected abstract selfEvaluateDefaultOutput(): TValue;
}

export interface PureValueNodeLinkContext {
    getVar(name: string): VarInstance | undefined;
}
