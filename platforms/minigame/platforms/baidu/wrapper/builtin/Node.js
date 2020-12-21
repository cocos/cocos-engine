/* eslint-disable */
import EventTarget from './EventTarget.js'

export default class Node extends EventTarget {
    constructor() {
        super()
        this.childNodes = []
    }

    appendChild(node) {
        this.childNodes.push(node)
        // if (node instanceof Node) {
        //   this.childNodes.push(node)
        // } else {
        //   throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.')
        // }
    }

    cloneNode() {
        const copyNode = Object.create(this)

        Object.assign(copyNode, this)
        return copyNode
    }

    removeChild(node) {
        const index = this.childNodes.findIndex((child) => child === node)

        if (index > -1) {
            return this.childNodes.splice(index, 1)
        }
        return null
    }
}
