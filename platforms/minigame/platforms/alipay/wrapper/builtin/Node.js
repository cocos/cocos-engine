import EventTarget from './EventTarget'
import { noop } from './utils/noop';

export default class Node extends EventTarget {
    constructor() {
        super();

        this.childNodes = [];

        this.insertBefor = noop;
    }

    appendChild(node) {
        if (node instanceof Node || node instanceof window.Node) {
          this.childNodes.push(node)
        } else {
          throw new TypeError(`Failed to executed 'appendChild' on 'Node': parameter 1 is not of type 'Node'.`)
        }
    }

    cloneNode() {
        var copyNode = Object.create(this);

        return Object.assign(copyNode, this);
    }

    removeChild(node) {
        var index = this.childNodes.findIndex((child) => {
          return child === node;
        });
  
        if (index > -1) {
          return this.childNodes.splice(index, 1);
        }
        return null;
      }
}