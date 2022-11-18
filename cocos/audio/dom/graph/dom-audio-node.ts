import { CCAudioNode } from '../../base';
import { DomAudioContext } from './dom-audio-context';

export enum NodeType {
    SOURCE,
    GAIN,
    STEREOPANNER,
    DESTINATION
}
export abstract class DomAudioNode implements CCAudioNode  {
    protected abstract _type: NodeType;
    protected _inputs: DomAudioNode[] = [];
    protected _outputs: DomAudioNode[] = [];
    protected _weight = 0;
    // For dom audio backend, only gain weight need to be updated as all other params are invalid.
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
    connect (node: DomAudioNode): DomAudioNode {
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
    disconnect (node?: DomAudioNode) {
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
    public ctx: DomAudioContext;

    constructor (ctx: DomAudioContext) {
        this.ctx = ctx;
    }
}
