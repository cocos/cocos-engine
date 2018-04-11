/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

function findPrevious (node) {
    let parent = node._parent;
    // reach root scene
    if (!parent) {
        return null;
    }

    // Find previous render component in siblings
    let children = parent._children;
    let index = children.indexOf(node);
    let previous = null, comp = null;
    for (let i = index - 1; i >= 0; i--) {
        let sibling = children[i];
        previous = findLast(sibling);
        if (previous) {
            return previous;
        }
    }

    // Find previous render component in parent level
    if (parent._renderComponent) {
        return parent._renderComponent._chain;
    }
    else {
        return findPrevious(parent);
    }
}

function findNext (node) {
    let parent = node._parent;
    // reach root scene
    if (!parent) {
        return null;
    }

    // Find next render component in siblings
    let children = parent._children;
    let index = children.indexOf(node);
    let next = null;
    for (let i = index + 1; i < children.length; i++) {
        let sibling = children[i];
        next = findFirst(sibling);
        if (next) {
            return next;
        }
    }

    let comp = parent._renderComponent;
    if (comp && comp.constructor._postAssembler) {
        if (!comp._postChain) {
            comp._postChain = {
                post: true,
                comp: comp,
                next: null
            }
        }
        // If parent's component has post assembler, we need to chain it to the next component
        return comp._postChain;
    }

    // Find next render component in parent level
    return findNext(parent);
}

function findFirst (node) {
    if (node._renderComponent) {
        return node._renderComponent._chain;
    }

    let children = node._children;
    let first;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        first = findFirst(child);
        if (first) {
            return first;
        }
    }
    return null;
}

function findLast (node) {
    let comp = node._renderComponent;
    if (comp && comp.constructor._postAssembler) {
        if (!comp._postChain) {
            comp._postChain = {
                post: true,
                comp: comp,
                next: null
            }
        }
        // If parent's component has post assembler, we need to chain it to the next component
        return comp._postChain;
    }

    let children = node._children;
    let last;
    for (let i = children.length - 1; i >= 0; i--) {
        last = findLast(children[i]);
        if (last) {
            return last;
        }
    }
    return comp ? comp._chain : null;
}

module.exports = {
    rebuildSelf (node) {
        let previous = findPrevious(node);
        let next = findNext(node);
        let first = findFirst(node);
        // If first not exist, then no render component inside the current node
        if (first) {
            if (previous) {
                previous.next = first;
            }
            let last = findLast(node);
            last.next = next;
        }
        else if (previous) {
            previous.next = next;
        }
    },

    rebuild (node) {
        let previous = node._renderComponent ? node._renderComponent._chain : findPrevious(node);
        // Rebuild for all children
        let children = node._children;
        let curr, first;
        for (let i = 0; i < children.length; i++) {
            curr = children[i];
            first = findFirst(curr);
            // If first not exist, then no render component inside the current node, nothing to do
            if (first) {
                if (previous) {
                    // Rebuild chain for previous render component and the first render component in sub tree
                    previous.next = first;
                }
                // Set previous to the last render component in sub tree
                previous = findLast(curr);
            }
        }
        if (previous) {
            // Link the last render component's next to the outside next render component
            previous.next = findNext(node);
        }
    },

    entry (scene) {
        return findFirst(scene);
    }
}