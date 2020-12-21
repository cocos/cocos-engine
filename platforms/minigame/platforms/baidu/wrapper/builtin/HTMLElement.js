/* eslint-disable */
import { noop } from './util/index.js'
import * as Mixin from './util/mixin'
import Element from './Element'

export default class HTMLElement extends Element {

    constructor(tagName = '', level) {
        super()

        this.className = ''
        this.childern = []

        this.focus = noop
        this.blur = noop

        this.insertBefore = noop
        this.appendChild = noop
        this.removeChild = noop
        this.remove = noop

        this.innerHTML = ''

        this.tagName = tagName.toUpperCase()

        Mixin.parentNode(this, level);
        Mixin.style(this);
        Mixin.classList(this);
        Mixin.clientRegion(this);
        Mixin.offsetRegion(this);
        Mixin.scrollRegion(this);
    }
}
