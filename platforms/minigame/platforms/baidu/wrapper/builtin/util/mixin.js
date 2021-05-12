/* eslint-disable */
import { innerWidth, innerHeight } from '../WindowProperties'

export function parentNode(obj, level) {
    if (!('parentNode' in obj)) {
        let _parent;

        if (level === 0) {
            _parent = function() {
                // return document
                return null
            }
        } else if (level === 1) {
            _parent = function() {
                return document.documentElement
            }
        } else {
            _parent = function() {
                return document.body
            }
        }

        Object.defineProperty(obj, 'parentNode', {
            enumerable: true,
            get: _parent
        })
    }

    if (!('parentElement' in obj)) {
        let _parent;

        if (level === 0) {
            _parent = function() {
                return null
            }
        } else if (level === 1) {
            _parent = function() {
                return document.documentElement
            }
        } else {
            _parent = function() {
                return document.body
            }
        }

        Object.defineProperty(obj, 'parentElement', {
            enumerable: true,
            get: _parent
        })
    }
}

export function style(obj) {
    obj.style = obj.style || {}

    Object.assign(obj.style, {
        top: '0px',
        left: '0px',
        width: innerWidth + 'px',
        height: innerHeight + 'px',
        margin: '0px',
        padding: '0px',
        removeProperty() {},
        setProperty() {}
    })
}

export function clientRegion(obj) {
    if (!('clientLeft' in obj)) {
        obj.clientLeft = 0
        obj.clientTop = 0
    }
    if (!('clientWidth' in obj)) {
        obj.clientWidth = innerWidth
        obj.clientHeight = innerHeight
    }

    if (!('getBoundingClientRect' in obj)) {
        obj.getBoundingClientRect = function() {
            const ret = {
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                width: this.clientWidth,
                height: this.clientHeight
            }
            ret.right = ret.width
            ret.bottom = ret.height

            return ret
        }
    }
}

export function offsetRegion(obj) {
    if (!('offsetLeft' in obj)) {
        obj.offsetLeft = 0
        obj.offsetTop = 0
    }
    if (!('offsetWidth' in obj)) {
        obj.offsetWidth = innerWidth
        obj.offsetHeight = innerHeight
    }
}

export function scrollRegion(obj) {
    if (!('scrollLeft' in obj)) {
        obj.scrollLeft = 0
        obj.scrollTop = 0
    }
    if (!('scrollWidth' in obj)) {
        obj.scrollWidth = innerWidth
        obj.scrollHeight = innerHeight
    }
}

export function classList(obj) {
    const noop = function() {}
    obj.classList = []
    obj.classList.add = noop
    obj.classList.remove = noop
    obj.classList.contains = noop
    obj.classList.toggle = noop
}
