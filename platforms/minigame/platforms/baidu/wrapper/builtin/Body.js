/* eslint-disable */
import HTMLElement from './HTMLElement'

export default class Body extends HTMLElement {
    constructor() {
        // 为了性能, 此处不按照标准的DOM层级关系设计
        // 将 body 设置为 0级, parent元素为null
        super('body', 0)
    }
}
