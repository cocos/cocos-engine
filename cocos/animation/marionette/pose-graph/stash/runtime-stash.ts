import { DEBUG } from 'internal:constants';
import { approx, assertIsTrue, error } from '../../../../core';
import { Pose } from '../../../core/pose';
import { PoseGraphStash } from '../../animation-graph';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext,
    AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphUpdateContextGenerator,
} from '../../animation-graph-context';
import { InstantiatedPoseGraph, instantiatePoseGraph } from '../instantiation';

interface RuntimeStash {
    reenter(): void;

    requestUpdate (context: AnimationGraphUpdateContext): void;

    evaluate (context: AnimationGraphEvaluationContext): Pose | null;
}

/**
 * Traces the state of a stash record. The transition is described as following.
 *
  ```mermaid
    stateDiagram-v2
      [*] --> Uninitialized
      Uninitialized --> Unsettled: `set`

      Unsettled --> Settled: `settle()`
      Settled --> Unsettled: `rebind()`(not supported yet)

      Settled --> Pending: `reenter()`
      Pending --> Pending: Repeatedly renter through `reenter()`, no effect

      Pending --> Update: `update()`
      state Update {
        [*] --> Updating
        Updating --> Updating: `update()`, circular dependency formed, no effect
        Updating --> Updated: The `update()` returned
        Updated --> Updated: `update()`, no effect
        Updated --> [*]
      }

      Update --> Evaluate: `evaluate()`
      state Evaluate {
        [*] --> Evaluating
        Evaluating --> Evaluating: `evaluate()`, circular dependency formed, return the default pose
        Evaluating --> Evaluated: The `evaluate()` returned
        Evaluated --> Evaluated: `evaluate()`, cache is returned
        Evaluated --> [*]
      }

      Settled --> Settled: At the end of tick
      Pending --> Settled: At the end of tick
      Update --> Pending: At the end of tick
      Evaluate --> Pending: At the end of tick
  ```
 *
 * - Stash records are created at the beginning of layer instantiation, before instantiation of any other things.
 *   All records' initial states are `UNINITIALIZED`.
 *
 * - Each stash is fed into the record, cause the record's state transition into `UNSETTLED`.
 *   Then the stash's graph starts its bind stage.
 *
 * - After all things in animation graph completed their bind stage, each stash would be settled.
 *   Then the stash was put in `SETTLED` state.
 *
 * - For each animation graph tick:
 *
 *   - If the stash was not accessed in last tick(asserts its state would be `SETTLED`),
 *     but should be accessed in this tick. The stash would call `reenter()` of its graph.
 *     Then the stash was put in `PENDING` state.
 *
 *   - Then, the stash will run into `UPDATING` and then `UPDATED` stage in animation graph update stage.
 *     The stash only updates once, if there're multiple update threads, the later update takes no effect.
 *     If circular dependency occurred, the update as well takes no effect.
 *
 *   - Then, the stash will run into `EVALUATING` and then `EVALUATED` stage in animation graph evaluation stage.
 *     The stash only evaluates once and the evaluation result is cached,
 *     if there're multiple evaluation threads, the evaluation result is duplicated.
 *     If circular dependency occurred, the evaluation returns default pose.
 *
 *   - At the end of tick,
 *
 *      - If the stash is not updated and is not evaluated in this tick, it will be put back into `SETTLED` stage.
 *
 *      - Otherwise, it will be put in `PENDING` state.
 */
enum StashRecordState {
    /**
     * The stash record is created, but there's no stash set.
     * The record shall not be in this state after binding stage.
     */
    UNINITIALIZED,

    /**
     * The stash has already been set into the stash record,
     * but haven't not been settled.
     */
    UNSETTLED,

    /**
     * The stash has been settled. A `reenter` is required to activate the stash.
     */
    SETTLED,

    /**
     * The stash is not activated but have not been updated or evaluated in last frame.
     */
    PENDING,

    /**
     * The stash is being updated.
     */
    UPDATING,

    /**
     * The stash has been updated and is ready to evaluate, but it has not been evaluated.
     */
    UPDATED,

    /**
     * The stash is being evaluated.
     */
    EVALUATING,

    /**
     * The stash has been evaluated once.
     */
    EVALUATED,
}

class RuntimeStashRecord implements RuntimeStash {
    public constructor (
        private _allocator: PoseStashAllocator,
    ) {
    }

    public set (stash: PoseGraphStash, context: AnimationGraphBindingContext) {
        assertIsTrue(this._state === StashRecordState.UNINITIALIZED, `The stash has already been set.`);
        const instantiatedPoseGraph = instantiatePoseGraph(stash.graph, context);
        instantiatedPoseGraph.bind(context);
        this._instantiatedPoseGraph = instantiatedPoseGraph;
        this._state = StashRecordState.UNSETTLED;
    }

    public settle (context: AnimationGraphSettleContext) {
        assertIsTrue(
            this._state === StashRecordState.UNSETTLED // First time settle
            || this._state === StashRecordState.SETTLED, // Resettle
        );
        assertIsTrue(this._instantiatedPoseGraph);
        this._instantiatedPoseGraph.settle(context);
        this._state = StashRecordState.SETTLED;
    }

    public reset () {
        switch (this._state) {
        case StashRecordState.SETTLED:
            // The stash was not touched in last tick and still not been touched in this tick.
            break;
        case StashRecordState.PENDING:
            // The stash was touched in last tick but does not being touched in this tick.
            this._state = StashRecordState.SETTLED;
            break;
        case StashRecordState.UPDATED:
            // Note: shall this means the stash is updated but not evaluated.
            // fallthrough
        case StashRecordState.EVALUATED:
            if (this._evaluationCache) {
                this._allocator.destroyPose(this._evaluationCache);
                this._evaluationCache = null;
            }
            this._maxRequestedUpdateTime = 0.0;
            this._state = StashRecordState.PENDING;
            break;
        case StashRecordState.UNINITIALIZED:
        default:
            assertIsTrue(false, `Unexpected stash state`);
        }
    }

    public reenter () {
        assertIsTrue(
            this._state === StashRecordState.SETTLED
            || this._state === StashRecordState.PENDING
            || this._state === StashRecordState.UPDATED, // The stash has been updated in other place, but here again reenters.
        );
        assertIsTrue(this._instantiatedPoseGraph);
        if (this._state === StashRecordState.SETTLED) {
            this._state = StashRecordState.PENDING;
            this._instantiatedPoseGraph.reenter();
        }
    }

    public requestUpdate (context: AnimationGraphUpdateContext) {
        const { deltaTime } = context;
        assertIsTrue(
            this._state === StashRecordState.PENDING
            || this._state === StashRecordState.UPDATING
            || this._state === StashRecordState.UPDATED,
        );
        assertIsTrue(this._instantiatedPoseGraph);

        // We entered a loop, stop.
        if (this._state === StashRecordState.UPDATING) {
            return;
        }

        // Note: even `deltaTime < this._maxRequestedUpdateTime`(the `diffDeltaTime` becomes 0.0),
        // the `context.directiveAbsoluteWeight` might not be 0.0.
        // We still need to trigger an update since some nodes(such as PlayMotion) needs to accumulate weight.
        const diffDeltaTime = Math.max(0.0, deltaTime - this._maxRequestedUpdateTime);
        // We accepted two same time-length update, don't do redundant updates.
        // After PR #14990, this should always true.
        if (this._state === StashRecordState.UPDATED) {
            if (approx(diffDeltaTime, 0.0, 1e-8)) {
                return;
            } else {
                // eslint-disable-next-line no-lonely-if
                if (DEBUG) {
                    error(`Arrived here indicates a violent of PR #14990. Please report the BUG.`);
                    return;
                }
            }
        }
        this._state = StashRecordState.UPDATING;
        this._maxRequestedUpdateTime = Math.max(deltaTime, this._maxRequestedUpdateTime);
        const updateContext = this._updateContextGenerator.generate(
            diffDeltaTime,
            context.indicativeWeight,
        );
        this._instantiatedPoseGraph.update(updateContext);
        this._state = StashRecordState.UPDATED;
    }

    public evaluate (context: AnimationGraphEvaluationContext) {
        assertIsTrue(
            this._state === StashRecordState.UPDATED
            || this._state === StashRecordState.EVALUATING
            || this._state === StashRecordState.EVALUATED,
        );
        assertIsTrue(this._instantiatedPoseGraph);
        if (this._state === StashRecordState.EVALUATING) {
            // Circular reference occurred.
            this._state = StashRecordState.EVALUATED;
        } else if (this._state === StashRecordState.UPDATED) {
            assertIsTrue(!this._evaluationCache);
            this._state = StashRecordState.EVALUATING;
            const pose = this._instantiatedPoseGraph?.evaluate(context);
            this._state = StashRecordState.EVALUATED;
            if (pose) {
                const heapPose = this._allocator.allocatePose();
                heapPose.transforms.set(pose.transforms);
                heapPose.auxiliaryCurves.set(pose.auxiliaryCurves);
                this._evaluationCache = heapPose;
                context.popPose();
            }
            this._state = StashRecordState.EVALUATED;
        }
        return this._evaluationCache
            ? context.pushDuplicatedPose(this._evaluationCache)
            : null;
    }

    private _state = StashRecordState.UNINITIALIZED;
    private _instantiatedPoseGraph: InstantiatedPoseGraph | undefined = undefined;
    private _maxRequestedUpdateTime = 0.0;
    private _evaluationCache: Pose | null = null;
    private _updateContextGenerator = new AnimationGraphUpdateContextGenerator();
}

interface RuntimeStashView {
    bindStash(id: string): RuntimeStash | undefined;
}

export interface PoseStashAllocator {
    allocatePose(): Pose;

    destroyPose(pose: Pose): void;
}

export class RuntimeStashManager implements RuntimeStashView {
    constructor (allocator: PoseStashAllocator) {
        this._allocator = allocator;
    }

    public bindStash (id: string) {
        return this._stashEvaluations[id] as RuntimeStash;
    }

    public getStash (id: string): RuntimeStashRecord | undefined {
        return this._stashEvaluations[id];
    }

    public addStash (id: string) {
        this._stashEvaluations[id] = new RuntimeStashRecord(this._allocator);
    }

    public setStash (id: string, stash: PoseGraphStash, context: AnimationGraphBindingContext) {
        assertIsTrue(id in this._stashEvaluations);
        this._stashEvaluations[id].set(stash, context);
    }

    public reset () {
        for (const stashId in this._stashEvaluations) {
            const record = this._stashEvaluations[stashId];
            record.reset();
        }
    }

    public settle (context: AnimationGraphSettleContext) {
        for (const stashId in this._stashEvaluations) {
            const record = this._stashEvaluations[stashId];
            record.settle(context);
        }
    }

    private _allocator: PoseStashAllocator;
    private _stashEvaluations: Record<string, RuntimeStashRecord> = {};
}

export type { RuntimeStash, RuntimeStashView };
