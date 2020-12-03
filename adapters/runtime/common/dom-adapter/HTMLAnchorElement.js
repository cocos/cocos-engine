import HTMLElement from "./HTMLElement"
import _weakMap from "./util/WeakMap"

export default class HTMLAnchorElement extends HTMLElement {
    constructor() {
        super("A");

        _weakMap.get(this).protocol = ":";
    }

    get protocol() {
        return _weakMap.get(this).protocol;
    }
}