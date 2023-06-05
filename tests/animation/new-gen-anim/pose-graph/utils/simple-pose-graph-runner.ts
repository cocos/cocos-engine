import { PoseGraph } from "../../../../../cocos/animation/marionette/asset-creation";
import { Node } from "../../../../../exports/base";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";
import { createAnimationGraph, VariableDeclarationParams } from "../../utils/factory";

export class SimplePoseGraphRunner {
    constructor({
        root,
        poseGraphInitializer,
        enterDuration = 0.0,
        leaveDuration = 0.0,
        variables = {},
    }: {
        root: Node;
        poseGraphInitializer: (poseGraph: PoseGraph) => void,
        enterDuration?: number;
        leaveDuration?: number;
        variables?: Record<string, VariableDeclarationParams>;
    }) {
        const animationGraph = createAnimationGraph({
            variableDeclarations: {
                'activated': { type: 'boolean', value: false },
                ...variables,
            },
            layers: [{
                stateMachine: {
                    states: {
                        'empty': { type: 'empty' },
                        'play': {
                            type: 'procedural',
                            graph: poseGraphInitializer,
                        },
                    },
                    entryTransitions: [{
                        to: 'empty',
                    }],
                    transitions: [{
                        from: 'empty', to: 'play',
                        duration: enterDuration,
                        conditions: [{ type: 'unary', operator: 'to-be-true', operand: { type: 'variable', name: 'activated' } }],
                    }, {
                        from: 'play', to: 'empty',
                        duration: leaveDuration,
                        conditions: [{ type: 'unary', operator: 'to-be-false', operand: { type: 'variable', name: 'activated' } }],
                    }],
                },
            }],
        });
    
        const evalMock = new AnimationGraphEvalMock(root, animationGraph);
        this._evalMock = evalMock;
        this._leaveDuration = leaveDuration;
    }

    get evalMock() {
        return this._evalMock;
    }

    public enter() {
        this._evalMock.controller.setValue('activated', true);
    }

    public leave() {
        this._evalMock.controller.setValue('activated', false);
    }

    public reenter() {
        this.leave();
        this._evalMock.step(this._leaveDuration + 0.1);
        this.enter();
    }

    private _evalMock: AnimationGraphEvalMock;
    private _enterDuration: number;
    private _leaveDuration: number;
}

export namespace SimplePoseGraphRunner {
    export type Options = ConstructorParameters<typeof SimplePoseGraphRunner>[0];
}