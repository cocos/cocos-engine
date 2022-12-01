import { CCAudioContext } from './audio-context';
import { CCSourceNode } from './source-node';

export enum NodeType {
    SOURCE,
    GAIN,
    STEREOPANNER,
    DESTINATION
}
export abstract class CCAudioNode  {
    protected abstract _type: NodeType;
    protected _inputs: CCAudioNode[] = [];
    protected _outputs: CCAudioNode[] = [];
    protected _weight = 0;
    // For CC audio backend, only gain weight need to be updated as all other params are invalid.
    protected _gain = 1;
    abstract innerOperation: (() => void) | undefined;
    update () {
        this._weight = 0;
        this._outputs.forEach((output) => {
            this._weight += this._gain * output._weight;
        });
        this._inputs.forEach((input) => {
            input.update();
        });
        if (this._type === NodeType.SOURCE) {
            this.innerOperation && this.innerOperation();
        }
    }
    connect (node: CCAudioNode): CCAudioNode {
        if (this._outputs.find((output) => output === node)) {
            return node;
        }
        this._outputs.push(node);
        node._inputs.push(this);
        // Update this weight with the node connected.
        const oldWeight = this._weight;
        this.update();
        return node;
    }
    disconnect (node?: CCAudioNode) {
        if (node) {
            let idx = this._outputs.findIndex((output) => output === node);
            if (idx === -1) {
                return;
            }
            this._outputs.splice(idx, 1);
            idx = node._inputs.findIndex((input) => this === input);
            node._inputs.splice(idx, 1);
        } else {
            this._outputs.forEach((output) => {
                const idx = output._inputs.findIndex((input) => this === input);
                output._inputs.splice(idx, 1);
            }, this);
        }
        this.update();
    }
    public ctx: CCAudioContext

    constructor (ctx: CCAudioContext) {
        this.ctx = ctx;
    }
}
