import { VarInstance } from '../variable';
import { PoseGraphNode } from './foundation/pose-graph-node';
import { PoseGraphType } from './foundation/type-system';

type Outputs = unknown[];

export abstract class XNode extends PoseGraphNode {
    constructor (outputTypes: readonly PoseGraphType[]) {
        super();
        this._outputTypes = outputTypes;
    }

    get outputCount () {
        return this._outputTypes.length;
    }

    public getOutputType (outputIndex: number) {
        return this._outputTypes[outputIndex];
    }

    public link (context: XNodeLinkContext) {
    }

    private _outputTypes: readonly PoseGraphType[] = [];

    public abstract selfEvaluate(outputs: Outputs): void;
}

export abstract class SingleOutputXNode<TValue = unknown> extends XNode {
    constructor (outputType: PoseGraphType) {
        super([outputType]);
    }

    public selfEvaluate (outputs: Outputs): void {
        outputs[0] = this.selfEvaluateDefaultOutput();
    }

    protected abstract selfEvaluateDefaultOutput(): TValue;
}

export interface XNodeLinkContext {
    getVar(name: string): VarInstance | undefined;
}
