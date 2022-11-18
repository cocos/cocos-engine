import { CCAudioNode } from '../../base';
import { DomAudioContext } from './dom-audio-context';
import { DomSourceNode } from './dom-source-node';

export abstract class DomAudioNode implements CCAudioNode  {
    protected _inputs: DomAudioNode[] = [];
    protected _outputs: DomAudioNode[] = [];
    protected _weight = 0;
    // For dom audio backend, only gain weight need to be updated as all other params are invalid.
    protected _gain = 1;

    update () {
        this._weight = 0;
        this._outputs.forEach((output) => {
            this._weight += this._gain * output._weight;
        });
        this._inputs.forEach((input) => {
            input.update();
        });
        if (this instanceof DomSourceNode) {
            this.volume = this._gain * this._weight;
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
    public ctx: DomAudioContext

    constructor (ctx: DomAudioContext) {
        this.ctx = ctx;
    }
}
