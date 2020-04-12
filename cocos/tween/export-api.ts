/**
 * @category tween
 */

 /**
  * @en
  * Built-in string value definition for the cache function.
  * @zh
  * 内置缓动函数的字符串值定义。
  */
export type TweenEasing =
'linear'    | 'smooth'     | 'fade'         |
'quadIn'    | 'quadOut'    | 'quadInOut'    | 'quadOutIn'    |
'cubicIn'   | 'cubicOut'   | 'cubicInOut'   | 'cubicOutIn'   |
'quartIn'   | 'quartOut'   | 'quartInOut'   | 'quartOutIn'   |
'quintIn'   | 'quintOut'   | 'quintInOut'   | 'quintOutIn'   |
'sineIn'    | 'sineOut'    | 'sineInOut'    | 'sineOutIn'    |
'expoIn'    | 'expoOut'    | 'expoInOut'    | 'expoOutIn'    |
'circIn'    | 'circOut'    | 'circInOut'    | 'circOutIn'    |
'elasticIn' | 'elasticOut' | 'elasticInOut' | 'elasticOutIn' |
'backIn'    | 'backOut'    | 'backInOut'    | 'backOutIn'    |
'bounceIn'  | 'bounceOut'  | 'bounceInOut'  | 'bounceOutIn'  ;


/**
 * @en
 * The interface of optional property.
 * @zh
 * 缓动的可选属性的接口定义。
 */
export interface ITweenOption {
    
    /**
     * @en
     * Easing function, you can pass in a string or custom function.
     * @zh
     * 缓动函数，可以使用已有的，也可以传入自定义的函数。
     */
    easing?: TweenEasing | ((k: number) => number);
    
    /**
     * @en
     * Interpolation functin, you can pass in a custom function.
     * @zh
     * 插值函数，参数的意义 start:起始值，end:目标值，current:当前值，ratio:当前进度
     */
    progress?: (start: number, end: number, current: number, ratio: number) => number;

    /**
     * @en
     * A callback that is triggered when a tween action is started.
     * @zh
     * 回调，当缓动动作启动时触发。
     */
    onStart?: (target?: object) => void;
    
    /**
     * @en
     * A callback that is triggered when a tween action is update.
     * @zh
     * 回调，当缓动动作更新时触发。
     */
    onUpdate?: (target?: object, ratio?: number) => void;
    
    /**
     * @en
     * A callback that is triggered when a tween action is completed.
     * @zh
     * 回调，当缓动动作完成时触发。
     */
    onComplete?: (target?: object) => void;
}