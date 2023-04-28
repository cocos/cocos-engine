export type EnterNodeInfo = {
    type: 'animation-blend';
    target: import('../../../motion/animation-blend').AnimationBlend;
} | {
    type: 'state-machine';
    target: import('../../../animation-graph').StateMachine;
} | {
    type: 'stash';
    stashName: string;
};
