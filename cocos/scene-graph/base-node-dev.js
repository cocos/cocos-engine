
import { CCObject } from '../core/data/object';
import * as js from '../core/utils/js';

// @ts-ignore
const Destroying = CCObject.Flags.Destroying;

export function baseNodePolyfill (BaseNode) {
    if (CC_EDITOR) {
        BaseNode.prototype._checkMultipleComp = function (ctor) {
            const existing = this.getComponent(ctor._disallowMultiple);
            if (existing) {
                if (existing.constructor === ctor) {
                    cc.errorID(3805, js.getClassName(ctor), this._name);
                } else {
                    cc.errorID(3806, js.getClassName(ctor), this._name, js.getClassName(existing));
                }
                return false;
            }
            return true;
        };

        /**
         * This api should only used by undo system
         * @method _addComponentAt
         * @param {Component} comp
         * @param {Number} index
         * @private
         */
        BaseNode.prototype._addComponentAt = function (comp, index) {
            if (this._objFlags & Destroying) {
                return cc.error('isDestroying');
            }
            if (!(comp instanceof cc.Component)) {
                return cc.errorID(3811);
            }
            if (index > this._components.length) {
                return cc.errorID(3812);
            }

            // recheck attributes because script may changed
            const ctor = comp.constructor;
            if (ctor._disallowMultiple) {
                if (!this._checkMultipleComp(ctor)) {
                    return;
                }
            }
            const ReqComp = ctor._requireComponent;
            if (ReqComp && !this.getComponent(ReqComp)) {
                if (index === this._components.length) {
                    // If comp should be last component, increase the index because required component added
                    ++index;
                }
                const depended = this.addComponent(ReqComp);
                if (!depended) {
                    // depend conflicts
                    return null;
                }
            }

            comp.node = this;
            this._components.splice(index, 0, comp);
            if ((CC_EDITOR || CC_TEST) && cc.engine && (this._id in cc.engine.attachedObjsForEditor)) {
                cc.engine.attachedObjsForEditor[comp._id] = comp;
            }
            if (this._activeInHierarchy) {
                cc.director._nodeActivator.activateComp(comp);
            }
        };

        /**
         * @method _getDependComponent
         * @param {Component} depended
         * @return {Component}
         * @private
         */
        BaseNode.prototype._getDependComponent = function (depended) {
            for (let i = 0; i < this._components.length; i++) {
                const comp = this._components[i];
                if (comp !== depended && comp.isValid && !cc.Object._willDestroy(comp)) {
                    const depend = comp.constructor._requireComponent;
                    if (depend && depended instanceof depend) {
                        return comp;
                    }
                }
            }
            return null;
        };

        BaseNode.prototype.onRestore = function () {
            // check activity state
            const shouldActiveNow = this._active && !!(this._parent && this._parent._activeInHierarchy);
            if (this._activeInHierarchy !== shouldActiveNow) {
                cc.director._nodeActivator.activateNode(this, shouldActiveNow);
            }
        };

        BaseNode.prototype._onPreDestroy = function () {
            const destroyByParent = this._onPreDestroyBase();
            if (!destroyByParent) {
                // ensure this node can reattach to scene by undo system
                // (simulate some destruct logic to make undo system work correctly)
                this._parent = null;
            }
            return destroyByParent;
        };

        BaseNode.prototype._onRestoreBase = BaseNode.prototype.onRestore;
    }

    if (CC_EDITOR || CC_TEST) {
        BaseNode.prototype._registerIfAttached = function (register) {
            const attachedObjsForEditor = cc.engine.attachedObjsForEditor;
            if (register) {
                attachedObjsForEditor[this._id] = this;
                for (const comp of this._components) {
                    attachedObjsForEditor[comp._id] = comp;
                }
                cc.engine.emit('node-attach-to-scene', this);
            } else {
                cc.engine.emit('node-detach-from-scene', this);
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

    if (CC_DEV) {
        // promote debug info
        js.get(BaseNode.prototype, ' INFO ', function () {
            let path = '';
            let node = this;
            while (node && !(node instanceof cc.Scene)) {
                if (path) {
                    path = node.name + '/' + path;
                } else {
                    path = node.name;
                }
                node = node._parent;
            }
            return this.name + ', path: ' + path;
        });
    }
}