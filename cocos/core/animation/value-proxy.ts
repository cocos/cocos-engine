/**
 * @category animation
 */

/**
 * 曲线值代理用来设置曲线值到目标，是广义的赋值。
 * 每个曲线值代理都关联着一个目标对象。
 */
export interface IValueProxy {
    get?: () => any;
    /**
     * 设置曲线值到目标对象上。
     */
    set: (value: any) => void;
}

export interface IValueProxyFactory {
    /**
     * 返回指定目标的曲线值代理。
     * @param target
     */
    forTarget (target: any): IValueProxy;
}