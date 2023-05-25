import { PoseNodeChoosePoseByBoolean } from "../../../../../cocos/animation/marionette/pose-graph/pose-nodes/choose-pose/choose-pose-by-boolean";
import { PoseNodeChoosePoseByIndex } from "../../../../../cocos/animation/marionette/pose-graph/pose-nodes/choose-pose/choose-pose-by-index";
import { lerp } from "../../../../../exports/base";
import { AnimationObserver_SingleRealValue, DEFAULT_NUM_DIGITS, PoseNodeEvaluationMock } from "./utils/evaluation-mock";

describe(`Choose pose nodes`, () => {
    describe(`Authoring`, () => {
        describe(`PoseNodeChoosePoseByBoolean`, () => {
            test(`Defaults`, () => {
                const node = new PoseNodeChoosePoseByBoolean();
                expect(node.truePose).toBe(null);
                expect(node.falsePose).toBe(null);
                expect(node.trueFadeInDuration).toBe(0.0);
                expect(node.falseFadeInDuration).toBe(0.0);
                expect(node.choice).toBe(true);
            });
        });

        describe(`PoseNodeChoosePoseByIndex`, () => {
            test(`Defaults`, () => {
                const node = new PoseNodeChoosePoseByIndex();
                expect(node.poses).toStrictEqual([]);
                expect(node.fadeInDurations).toStrictEqual([]);
                expect(node.choice).toBe(0);
            });
        });
    });

    describe(`Evaluation`, () => {
        test(`PoseNodeChoosePoseByIndex: Zero items`, () => {
            const observer = new AnimationObserver_SingleRealValue(6.666);
            const poseNode = new PoseNodeChoosePoseByIndex();
            const poseNodeEvalMock = new PoseNodeEvaluationMock(poseNode, observer);
            poseNodeEvalMock.step(0.3, 1.0);
            expect(poseNodeEvalMock.resultObserver.value).toBe(observer.initialValue);
        });

        describe(`PoseNodeChoosePoseByBoolean`, () => {
            test.each([
                true,
                false,
            ])(`Initial choice: %s`, (choice) => {
                const fixture = {
                    testing_choice: {
                        pose_value: 7.7,
                        altering_duration: 0.2,
                    },
                    opposite_choice: {
                        pose_value: 8.8,
                        altering_duration: 0.3,
                    },
                };

                const observer = new AnimationObserver_SingleRealValue(6.666);
                const poseNode = new PoseNodeChoosePoseByBoolean();
                poseNode.choice = choice;
                poseNode.truePose = observer.createPoseNodeMockGenerating(choice ? fixture.testing_choice.pose_value : fixture.opposite_choice.pose_value);
                poseNode.trueFadeInDuration = choice ? fixture.testing_choice.altering_duration : fixture.opposite_choice.altering_duration;
                poseNode.falsePose = observer.createPoseNodeMockGenerating(choice ? fixture.opposite_choice.pose_value : fixture.testing_choice.pose_value);
                poseNode.falseFadeInDuration = choice ? fixture.opposite_choice.altering_duration : fixture.testing_choice.altering_duration;

                const getChosenChoice = () => poseNode.choice === choice ? fixture.testing_choice : fixture.opposite_choice;
                const getUnchosenChoice = () => poseNode.choice === choice ? fixture.opposite_choice : fixture.testing_choice;

                const poseNodeEvalMock = new PoseNodeEvaluationMock(poseNode, observer);

                const checkResultWeights = (
                    chosenChoiceWeight: number,
                    unchosenChoiceWeight: number,
                ) => {
                    expect(poseNodeEvalMock.resultObserver.value).toBeCloseTo(calculateNormalizedBlendResultOf([
                        { v: getUnchosenChoice().pose_value, w: unchosenChoiceWeight },
                        { v: getChosenChoice().pose_value, w: chosenChoiceWeight },
                    ]), DEFAULT_NUM_DIGITS);
                };

                // Initially, the initially chosen pose has one weight ignoring altering duration.
                // So, the pose will keep has chosen one until choice changed.
                for (const [deltaTime] of generateTimeIntervalSeq(
                    0.0001, // Initially, the initially chosen pose has one weight ignoring altering duration.
                    getChosenChoice().altering_duration * 0.99,
                    getChosenChoice().altering_duration * 1.01,
                )) {
                    poseNodeEvalMock.step(deltaTime, 1.0);
                    checkResultWeights(
                        1.0,
                        0.0,
                    );
                }
                
                /// The following tests the common case:
                /// The choice alters and remain until it occupies full weight.

                // Choose opposite then alter again.
                for (let i = 0; i < 2; ++i) {
                    poseNode.choice = !poseNode.choice;
                    // During `chosenChoice.altering_duration`,
                    // the chosen choice's weight change from 0 -> 1;
                    // the opposite choice's weight change from 1 -> 0.
                    for (const [deltaTimeRate, timePointRate, timePointIndex] of generateTimeIntervalSeq(0.3, 0.7, 0.99, 1.01)) {
                        poseNodeEvalMock.step(getChosenChoice().altering_duration * deltaTimeRate, 1.0);
                        checkResultWeights(
                            lerp(0, 1, Math.min(1.0, timePointRate)),
                            lerp(1, 0, Math.min(1.0, timePointRate)),
                        );
                    }
                }
                
                /// The following tests the behavior if the choice changed during alternation.

                poseNode.choice = !poseNode.choice;
                // After the following statement,
                // - testing_choice should have weight 0.8,
                // - opposite choice should have weight 0.2.
                poseNodeEvalMock.step(getChosenChoice().altering_duration * 0.2, 1.0);
                // Reverse.
                poseNode.choice = !poseNode.choice;
                // The behavior:
                // - All unchosen choices change from "altering-time" weight to 0.
                // - The chosen choices change from "altering-time" weight to 1.
                for (const [deltaTimeRate, timePointRate, timePointIndex] of generateTimeIntervalSeq(0.3, 0.7, 0.99, 1.01)) {
                    poseNodeEvalMock.step(getChosenChoice().altering_duration * deltaTimeRate, 1.0);
                    checkResultWeights(
                        lerp(0.8, 1, Math.min(1.0, timePointRate)),
                        lerp(0.2, 0.0, Math.min(1.0, timePointRate)),
                    );
                }
            });

            describe(`Altering duration is zero, very small, or negative`, () => {
                // If the altering duration is zero/very small(1e-5)/negative,
                // the duration is treated as zero.
                test.each([
                    [`Altering duration is zero`, 0.0],
                    [`Altering duration is very small`, 1e-5 + 1e-6],
                    [`Altering duration is negative`, -1],
                ])(`%s`, (_title, testing_duration) => {
                    const fixture = {
                        true_choice: {
                            pose_value: 7.7,
                            altering_duration: 0.3,
                        },
                        false_choice: {
                            pose_value: 8.8,
                            altering_duration: testing_duration,
                        },
                    };
    
                    const observer = new AnimationObserver_SingleRealValue(6.666);
                    const poseNode = new PoseNodeChoosePoseByBoolean();
                    poseNode.choice = true;
                    poseNode.truePose = observer.createPoseNodeMockGenerating(fixture.true_choice.pose_value);
                    poseNode.trueFadeInDuration = fixture.true_choice.altering_duration;
                    poseNode.falsePose = observer.createPoseNodeMockGenerating(fixture.false_choice.pose_value);
                    poseNode.falseFadeInDuration = fixture.false_choice.altering_duration;
    
                    const poseNodeEvalMock = new PoseNodeEvaluationMock(poseNode, observer);
                    poseNodeEvalMock.step(0.00001, 1.0);
                    // Verbose check.
                    expect(poseNodeEvalMock.resultObserver.value).toBeCloseTo(fixture.true_choice.pose_value);
    
                    // Choose false.
                    // Note: its altering duration is zero.
                    poseNode.choice = false;
                    for (const [deltaTime] of generateTimeIntervalSeq(0.0001, 0.1)) {
                        poseNodeEvalMock.step(deltaTime, 1.0);
                        expect(poseNodeEvalMock.resultObserver.value).toBeCloseTo(fixture.false_choice.pose_value);
                    }
    
                    // Verbose check.
                    // Then, the following altering should work well.
                    poseNode.choice = true;
                    for (const [deltaTimeRate, timePointRate] of generateTimeIntervalSeq(0.001, 0.3, 0.7, 0.99, 1.01)) {
                        poseNodeEvalMock.step(fixture.true_choice.altering_duration * deltaTimeRate, 1.0);
                        expect(poseNodeEvalMock.resultObserver.value).toBeCloseTo(calculateNormalizedBlendResultOf([
                            { v: fixture.true_choice.pose_value, w: lerp(0.0, 1.0, Math.min(1.0, timePointRate)) },
                            { v: fixture.false_choice.pose_value, w: lerp(1.0, 0.0, Math.min(1.0, timePointRate)) },
                        ]), DEFAULT_NUM_DIGITS);
                    }
                });
            });
        });
    });
});

function* generateTimeIntervalSeq(...timePoints: readonly number[]) {
    let last = 0.0;
    for (let iTimePoint = 0; iTimePoint < timePoints.length; ++iTimePoint) {
        const timePoint = timePoints[iTimePoint];
        yield [(timePoint - last), timePoint, iTimePoint];
        last = timePoint;
    }
}

function calculateNormalizedBlendResultOf (entries: Array<{ w: number; v: number }>) {
    const sum = entries.reduce((result, { w }) => result + w, 0.0);
    expect(sum).not.toBeCloseTo(0.0, DEFAULT_NUM_DIGITS);
    return entries.reduce((result, { w, v }) => result + (w / sum) * v, 0.0);
}