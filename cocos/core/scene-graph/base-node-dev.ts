/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @packageDocumentation
 * @hidden
 */

import { EDITOR, DEV, TEST } from 'internal:constants';
import { CCObject } from '../data/object';
import * as js from '../utils/js';
import { legacyCC } from '../global-exports';
import { error, errorID, getError } from '../platform/debug';
import { Component } from '../components';

const Destroying = CCObject.Flags.Destroying;

export function baseNodePolyfill (BaseNode) {
    if (EDITOR || TEST) {
        BaseNode.prototype._checkMultipleComp = function (ctor) {
            const existing = this.getComponent(ctor._disallowMultiple);
            if (existing) {
                if (existing.constructor === ctor) {
                    throw Error(getError(3805, js.getClassName(ctor), this._name));
                } else {
                    throw Error(getError(3806, js.getClassName(ctor), this._name, js.getClassName(existing)));
                }
            }
            return true;
        };

        /**
         * This api should only used by undo system
         * @method _addComponentAt
         * @param {Component} comp
         * @param {Number} index
         */
        BaseNode.prototype._addComponentAt = function (comp, index) {
            if (this._objFlags & Destroying) {
                return error('isDestroying');
            }
            if (!(comp instanceof legacyCC.Component)) {
                return errorID(3811);
            }
            if (index > this._components.length) {
                return errorID(3812);
            }

            // recheck attributes because script may changed
            const ctor = comp.constructor;
            if (ctor._disallowMultiple) {
                if (!this._checkMultipleComp(ctor)) {
                    return undefined;
                }
            }

            // remove dependency and return directly by editor
            // const ReqComp = ctor._requireComponent;
            // if (ReqComp && !this.getComponent(ReqComp)) {
            //     if (index === this._components.length) {
            //         // If comp should be last component, increase the index because required component added
            //         ++index;
            //     }
            //     const depended = this.addComponent(ReqComp);
            //     if (!depended) {
            //         // depend conflicts
            //         return null;
            //     }
            // }

            comp.node = this;
            this._components.splice(index, 0, comp);
            if (EDITOR && EditorExtends.Node && EditorExtends.Component) {
                const node = EditorExtends.Node.getNode(this._id);
                if (node) {
                    EditorExtends.Component.add(comp._id, comp);
                }
            }
            if (this._activeInHierarchy) {
                legacyCC.director._nodeActivator.activateComp(comp);
            }
            return undefined;
        };

        /**
         * @method _getDependComponent
         * @param {Component} depended
         * @return {Component[]}
         */
        BaseNode.prototype._getDependComponent = function (depended) {
            const dependant: Component[] = [];
            for (let i = 0; i < this._components.length; i++) {
                const comp = this._components[i];
                if (comp !== depended && comp.isValid && !legacyCC.Object._willDestroy(comp)) {
                    const reqComps = comp.constructor._requireComponent;
                    if (reqComps) {
                        if (Array.isArray(reqComps)) {
                            for (let i = 0; i < reqComps.length; i++) {
                                if (depended instanceof reqComps[i]) {
                                    dependant.push(comp);
                                }
                            }
                        } else if (depended instanceof reqComps) {
                            dependant.push(comp);
                        }
                    }
                }
            }
            return dependant;
        };

        BaseNode.prototype.onRestore = function () {
            // check activity state
            const shouldActiveNow = this._active && !!(this._parent && this._parent._activeInHierarchy);
            if (this._activeInHierarchy !== shouldActiveNow) {
                legacyCC.director._nodeActivator.activateNode(this, shouldActiveNow);
            }
        };

        BaseNode.prototype._onPreDestroy = function () {
            const destroyByParent: boolean = this._onPreDestroyBase();
            if (!destroyByParent) {
                // ensure this node can reattach to scene by undo system
                // (simulate some destruct logic to make undo system work correctly)
                this._parent = null;
            }
            return destroyByParent;
        };

        BaseNode.prototype._onRestoreBase = BaseNode.prototype.onRestore;
    }

    if (EDITOR || TEST) {
        BaseNode.prototype._registerIfAttached = function (register) {
            const attachedObjsForEditor = legacyCC.engine.attachedObjsForEditor;
            if (register) {
                attachedObjsForEditor[this._id] = this;
                for (let i = this._components.length - 1; i >= 0; i--) {
                    const comp = this._components[i];
                    if (!comp) {
                        this._components.splice(i, 1);
                        console.error(`component attached to node:${this.name} is invalid for some reason`);
                        continue;
                    }
                    attachedObjsForEditor[comp._id] = comp;
                }
                legacyCC.engine.emit('node-attach-to-scene', this);
            } else {
                legacyCC.engine.emit('node-detach-from-scene', this);
                delete attachedObjsForEditor[this._id];
                for (const comp of this._components) {
                    delete attachedObjsForEditor[comp._id];
                }
            }
            const children = this._children;
            for (let i = 0, len = children.length; i < len; ++i) {
                const child = children[i];
                child._registerIfAttached(register);
            }
        };
    }

    if (DEV) {
        // promote debug info
        js.get(BaseNode.prototype, ' INFO ', function () {
            let path = '';
            // @ts-expect-error
            let node = this;
            while (node && !(node instanceof legacyCC.Scene)) {
                if (path) {
                    path = `${node.name}/${path}`;
                } else {
                    path = node.name;
                }
                node = node._parent;
            }
            // @ts-expect-error
            return `${this.name}, path: ${path}`;
        });
    }
}
