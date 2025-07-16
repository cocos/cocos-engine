import { AnimationController } from "../../../../cocos/animation/animation";
import { AnimationGraph } from "../../../../cocos/animation/marionette/animation-graph";
import { AnimationGraphVariant } from "../../../../cocos/animation/marionette/animation-graph-variant";
import { AnimationGraphEval } from "../../../../cocos/animation/marionette/graph-eval";
import { Node } from "../../../../cocos/scene-graph";

export class AnimationGraphEvalMock {
    constructor(
        node: Node,
        animationGraph: AnimationGraph | AnimationGraphVariant,
    ) {
        const controller = node.addComponent(AnimationController) as AnimationController;
        this._controller = controller;

        const graphEval = new AnimationGraphEval(
            (animationGraph instanceof AnimationGraph) ? animationGraph : animationGraph.original!,
            node,
            controller,
            (animationGraph instanceof AnimationGraph) ? null : animationGraph.clipOverrides,
        );
        // @ts-expect-error HACK
        controller._graphEval = graphEval;
        this._eval = graphEval;
    }

    public destroy(afterException = false) {
        if (afterException) {
            this._eval._destroyAfterException_debugging();
            // @ts-expect-error HACK
            this.controller._graphEval = null;
        } else {
            this.controller.destroy();
        }
    }

    get controller() {
        return this._controller;
    }

    get current() {
        return this._current;
    }

    get lastDeltaTime() {
        return this._lastDeltaTime;
    }

    public step(deltaTime: number) {
        this._current += deltaTime;
        try {
            this._eval.update(deltaTime);
        } catch (err) {
            this._eval._destroyAfterException_debugging();
            throw err;
        }
        this._lastDeltaTime = deltaTime;
    }

    public goto(time: number) {
        const deltaTime = time - this._current;
        this._current = time;
        try {
            this._eval.update(deltaTime);
        } catch (err) {
            this._eval._destroyAfterException_debugging();
            throw err;
        }
        this._lastDeltaTime = deltaTime;
    }

    private _current = 0.0;

    private _lastDeltaTime = 0.0;

    private _eval: AnimationGraphEval;
    private _controller: AnimationController;
}

export function* generateIntervals(...times: readonly number[]) {
    let last = 0.0;
    for (let i = 0; i < times.length; ++i) {
        const t = times[i];
        yield [t - last, i, t] as [interval: number, index: number, timePoint: number];
        last = t;
    }
}
