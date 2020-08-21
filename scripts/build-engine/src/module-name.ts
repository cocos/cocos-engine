
/**
 * 获取功能入口对应的模块名。
 * @param entry 功能入口名。
 * @param engine 引擎路径。
 */
export function getModuleName (entry: string, engine: string) {
    return `cc.${entry}`;
}
