/**
 * @hidden
 */

export type TweenEasing = 'Linear-None' |
'Quadratic-In'   | 'Quadratic-Out'   | 'Quadratic-InOut'   |
'Cubic-In'       | 'Cubic-Out'       | 'Cubic-InOut'       |
'Quartic-In'     | 'Quartic-Out'     | 'Quartic-InOut'     |
'Quintic-In'     | 'Quintic-Out'     | 'Quintic-InOut'     |
'Sinusoidal-In'  | 'Sinusoidal-Out'  | 'Sinusoidal-InOut'  |
'Exponential-In' | 'Exponential-Out' | 'Exponential-InOut' |
'Circular-In'    | 'Circular-Out'    | 'Circular-InOut'    |
'Elastic-In'     | 'Elastic-Out'     | 'Elastic-InOut'     |
'Back-In'        | 'Back-Out'        | 'Back-InOut'        |
'Bounce-In'      | 'Bounce-Out'      | 'Bounce-InOut'      ;

export type TweenInterpolation = 'Linear' | 'Bezier' | 'CatmullRom';

export interface ITweenOption {
    delay?: number;
    repeat?: number;
    repeatDelay?: number;
    yoyo?: boolean;
    easing?: TweenEasing | ((k: number) => number);
    interpolation?: TweenInterpolation | ((v: number[], k: number) => number);
    onStart ?: (object?: any) => void;
    onStop ?: (object?: any) => void;
    onUpdate ?: (object?: any) => void;
    onComplete ?: (object?: any) => void;
}

export interface ITweenProp {
    [x: string]: any;
}
