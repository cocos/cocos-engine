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
      [*] --> Preparation

      state Preparation {
        [*] --> Uninitialized

        Uninitialized --> Unsettled: `set`

        Unsettled --> Settled: `settle()`

        Settled --> [*]
      }

      Preparation --> Up_to_date: `reenter()`
      Up_to_date --> Up_to_date: Repeatedly renter through `reenter()`, no effect
      Outdated --> Up_to_date: `reenter()`

      Up_to_date --> Ticking: `update()`
      Outdated --> Ticking: `update()`

      state Ticking {
        [*] --> Update

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

        Update --> [*]
        Evaluate --> [*]
      }

      Ticking --> Up_to_date: At the end of tick
      Up_to_date --> Outdated: At the end of tick
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
 * - Next, at least one `reenter` should be called on the stash, to put the stash into `Up-to-date` to participate loop.
 *
 * - For each animation graph tick:
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
 *      - If the stash is not updated and is not evaluated in this tick, it will be put back into `Outdated` .
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
     * The stash was updated in last frame or has been reentered this frame.
     */
    UP_TO_DATE,

    /**
     * The stash had not been updated at least one frames at past.
     */
    OUTDATED,

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

    public set (stash: PoseGraphStash, context: AnimationGraphBindingContext): void {
        assertIsTrue(this._state === StashRecordState.UNINITIALIZED, `The stash has already been set.`);
        const instantiatedPoseGraph = instantiatePoseGraph(stash.graph, context);
        instantiatedPoseGraph.bind(context);
        this._instantiatedPoseGraph = instantiatedPoseGraph;
        this._state = StashRecordState.UNSETTLED;
    }

    public settle (context: AnimationGraphSettleContext): void {
        assertIsTrue(
            this._state === StashRecordState.UNSETTLED // First time settle
            || this._state === StashRecordState.SETTLED, // Resettle
        );
        assertIsTrue(this._instantiatedPoseGraph);
        this._instantiatedPoseGraph.settle(context);
        this._state = StashRecordState.SETTLED;
    }

    public reset (): void {
        switch (this._state) {
        case StashRecordState.SETTLED: // Happen when the stash was not reentered till now.
        case StashRecordState.OUTDATED:  // Happen when the stash keeps outdated.
            break;
        case StashRecordState.UP_TO_DATE: // Happen when the stash was not updated in this frame.
            this._state = StashRecordState.OUTDATED; // It's then outdated.
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
            this._state = StashRecordState.UP_TO_DATE;
            break;
        case StashRecordState.UNINITIALIZED:
        default:
            assertIsTrue(false, `Unexpected stash state`);
        }
    }

    public reenter (): void {
        switch (this._state) {
        default:
            assertIsTrue(false as boolean, `Unexpected stash state ${this._state} when reenter().`);
            break;
        case StashRecordState.UP_TO_DATE: // Happen when the state was updated in last frame but received a reenter() request this frame.
        case StashRecordState.UPDATED: // Happen when the state has been update() in this frame at one place but request reenter() at another place.
            break;
        case StashRecordState.SETTLED: // Happen when the state is first reenter().
        case StashRecordState.OUTDATED: { // Happen when the state has been outdated.
            this._state = StashRecordState.UP_TO_DATE;
            assertIsTrue(this._instantiatedPoseGraph);
            this._instantiatedPoseGraph.reenter();
            break;
        }
        }
    }

    public requestUpdate (context: AnimationGraphUpdateContext): void {
        const { deltaTime } = context;
        assertIsTrue(
            this._state === StashRecordState.OUTDATED
            || this._state === StashRecordState.UP_TO_DATE
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

    public evaluate (context: AnimationGraphEvaluationContext): Pose | null {
        switch (this._state) {
        default:
            assertIsTrue(false as boolean, `Unexpected stash state ${this._state} when evaluate().`);
            break;
        case StashRecordState.EVALUATING: // Circular reference occurred.
            this._state = StashRecordState.EVALUATED;
            break;
        case StashRecordState.EVALUATED: // Already evaluated.
            break;
        case StashRecordState.UPDATED: {
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
            break;
        }
        }
        assertIsTrue(this._state === StashRecordState.EVALUATED);
        assertIsTrue(this._instantiatedPoseGraph);
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

    public bindStash (id: string): RuntimeStash {
        return this._stashEvaluations[id] as RuntimeStash;
    }

    public getStash (id: string): RuntimeStashRecord | undefined {
        return this._stashEvaluations[id];
    }

    public addStash (id: string): void {
        this._stashEvaluations[id] = new RuntimeStashRecord(this._allocator);
    }

    public setStash (id: string, stash: PoseGraphStash, context: AnimationGraphBindingContext): void {
        assertIsTrue(id in this._stashEvaluations);
        this._stashEvaluations[id].set(stash, context);
    }

    public reset (): void {
        for (const stashId in this._stashEvaluations) {
            const record = this._stashEvaluations[stashId];
            record.reset();
        }
    }

    public settle (context: AnimationGraphSettleContext): void {
        for (const stashId in this._stashEvaluations) {
            const record = this._stashEvaluations[stashId];
            record.settle(context);
        }
    }

    private _allocator: PoseStashAllocator;
    private _stashEvaluations: Record<string, RuntimeStashRecord> = {};
}

export type { RuntimeStash, RuntimeStashView };
